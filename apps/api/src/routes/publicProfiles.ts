import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import type { PortfolioCV } from '../types.js'

export const publicProfilesRouter = Router()

const SLUG_MIN_LENGTH = 3
const SLUG_MAX_LENGTH = 60

function normalizeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/^-+|-+$/g, '')
}

function validateSlug(slug: string): string | null {
  if (slug.length < SLUG_MIN_LENGTH) return `El slug debe tener al menos ${SLUG_MIN_LENGTH} caracteres.`
  if (slug.length > SLUG_MAX_LENGTH) return `El slug no puede superar ${SLUG_MAX_LENGTH} caracteres.`
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return 'El slug solo puede contener letras minúsculas, números y guiones intermedios.'
  }
  return null
}

function publicPath(slug: string): string {
  return `/p/${slug}`
}

function serializeSettings(profile: {
  slug: string
  isPublic: boolean
  updatedAt: Date
} | null, suggestedSlug: string) {
  return {
    exists: Boolean(profile),
    slug: profile?.slug ?? '',
    suggestedSlug,
    isPublic: profile?.isPublic ?? false,
    publicPath: profile ? publicPath(profile.slug) : '',
    updatedAt: profile?.updatedAt.toISOString() ?? null,
  }
}

publicProfilesRouter.get('/me', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const profile = await prisma.publicProfile.findUnique({ where: { ownerId: userId } })
  const suggestedSlug = normalizeSlug(profile?.slug || req.user!.displayName || req.user!.email)

  res.json({ publicProfile: serializeSettings(profile, suggestedSlug || 'expertech-cv') })
})

publicProfilesRouter.put('/me', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const body = req.body as Record<string, unknown>
  const existing = await prisma.publicProfile.findUnique({ where: { ownerId: userId } })

  const rawSlug = typeof body.slug === 'string' ? body.slug : existing?.slug ?? ''
  const slug = normalizeSlug(rawSlug)
  const isPublic = typeof body.isPublic === 'boolean' ? body.isPublic : existing?.isPublic ?? false

  const validationError = validateSlug(slug)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const conflictingProfile = await prisma.publicProfile.findUnique({ where: { slug } })
  if (conflictingProfile && conflictingProfile.ownerId !== userId) {
    res.status(409).json({ error: 'Este slug ya está en uso.' })
    return
  }

  const cv = await prisma.cV.findUnique({ where: { ownerId: userId } })
  if (isPublic && !cv) {
    res.status(400).json({ error: 'Guarda tu CV antes de publicarlo.' })
    return
  }

  try {
    const saved = await prisma.publicProfile.upsert({
      where: { ownerId: userId },
      create: { ownerId: userId, slug, isPublic },
      update: { slug, isPublic },
    })

    res.json({ publicProfile: serializeSettings(saved, saved.slug) })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Este slug ya está en uso.' })
      return
    }

    throw err
  }
})

// Vista pública por slug. Solo devuelve el CV si el PublicProfile.isPublic es true.
publicProfilesRouter.get('/:slug', async (req, res) => {
  const slug = normalizeSlug(req.params.slug)

  const validationError = validateSlug(slug)
  if (validationError) {
    res.status(400).json({ error: 'Slug inválido.' })
    return
  }

  const profile = await prisma.publicProfile.findUnique({
    where: { slug },
    include: { owner: { include: { cv: true } } },
  })

  if (!profile || !profile.isPublic || !profile.owner.cv) {
    res.status(404).json({ error: 'Perfil público no encontrado.' })
    return
  }

  const cv: PortfolioCV = {
    profile: profile.owner.cv.profile as unknown as PortfolioCV['profile'],
    projects: profile.owner.cv.projects as unknown as PortfolioCV['projects'],
    meta: profile.owner.cv.meta as unknown as PortfolioCV['meta'],
  }

  res.json({
    slug: profile.slug,
    isPublic: profile.isPublic,
    publicPath: publicPath(profile.slug),
    displayName: profile.owner.displayName,
    cv,
  })
})
