import { Router } from 'express'
import { createInitialCVState, createPortfolioCV } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { cvStore } from '../storage/memory.js'

export const cvsRouter = Router()

cvsRouter.use(requireAuth)

cvsRouter.get('/me', (req, res) => {
  const existing = cvStore.get(req.user!.id)
  res.json({ cv: existing ?? createInitialCVState() })
})

cvsRouter.put('/me', (req, res) => {
  const userId = req.user!.id
  const body = req.body as Record<string, unknown>
  const normalized = createPortfolioCV({
    ...(body as Parameters<typeof createPortfolioCV>[0]),
    meta: { lastUpdated: new Date().toISOString() },
  })
  const saved = cvStore.set(userId, normalized)
  res.json({ cv: saved })
})
