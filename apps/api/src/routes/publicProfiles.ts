import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import type { PortfolioCV } from '../types.js'

export const publicProfilesRouter = Router()

// Vista pública por slug. Solo devuelve el CV si el PublicProfile.isPublic es true.
publicProfilesRouter.get('/:slug', async (req, res) => {
  const { slug } = req.params

  if (typeof slug !== 'string' || slug.trim().length === 0) {
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
    displayName: profile.owner.displayName,
    cv,
  })
})
