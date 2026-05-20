import { Router } from 'express'
import { toPublicUser } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { userStore } from '../storage/memory.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

usersRouter.get('/me', (req, res) => {
  // requireAuth garantiza que req.user existe.
  res.json({ user: toPublicUser(req.user!) })
})

usersRouter.put('/me', (req, res) => {
  const current = req.user!
  const { displayName } = req.body as Record<string, unknown>

  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    res.status(400).json({ error: 'displayName debe ser una cadena no vacía.' })
    return
  }

  const updated = userStore.update({ ...current, displayName: displayName.trim() })
  res.json({ user: toPublicUser(updated) })
})
