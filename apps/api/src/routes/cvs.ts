import { Router } from 'express'
import type { Prisma } from '@prisma/client'
import { createInitialCVState, createPortfolioCV } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import type { PortfolioCV } from '../types.js'

export const cvsRouter = Router()

cvsRouter.use(requireAuth)

cvsRouter.get('/me', async (req, res) => {
  const userId = req.user!.id
  // Aislamiento por usuario: la query filtra siempre por ownerId.
  const cv = await prisma.cV.findUnique({ where: { ownerId: userId } })

  if (!cv) {
    res.json({ cv: createInitialCVState() })
    return
  }

  // Reconstruimos la shape PortfolioCV desde los campos JSON.
  const portfolioCV: PortfolioCV = {
    profile: cv.profile as unknown as PortfolioCV['profile'],
    projects: cv.projects as unknown as PortfolioCV['projects'],
    meta: cv.meta as unknown as PortfolioCV['meta'],
  }
  res.json({ cv: portfolioCV })
})

cvsRouter.put('/me', async (req, res) => {
  const userId = req.user!.id
  const body = req.body as Record<string, unknown>

  const normalized = createPortfolioCV({
    ...(body as Parameters<typeof createPortfolioCV>[0]),
    meta: { lastUpdated: new Date().toISOString() },
  })

  // Upsert por ownerId garantiza el aislamiento: no podemos pisar el CV de otro.
  const saved = await prisma.cV.upsert({
    where: { ownerId: userId },
    create: {
      ownerId: userId,
      profile: normalized.profile as unknown as Prisma.InputJsonValue,
      projects: normalized.projects as unknown as Prisma.InputJsonValue,
      meta: normalized.meta as unknown as Prisma.InputJsonValue,
    },
    update: {
      profile: normalized.profile as unknown as Prisma.InputJsonValue,
      projects: normalized.projects as unknown as Prisma.InputJsonValue,
      meta: normalized.meta as unknown as Prisma.InputJsonValue,
    },
  })

  res.json({
    cv: {
      profile: saved.profile as unknown as PortfolioCV['profile'],
      projects: saved.projects as unknown as PortfolioCV['projects'],
      meta: saved.meta as unknown as PortfolioCV['meta'],
    },
  })
})
