import { Router } from 'express'
import { toPublicUser } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

usersRouter.get('/me', (req, res) => {
  res.json({ user: toPublicUser(req.user!) })
})

usersRouter.put('/me', async (req, res) => {
  const { displayName } = req.body as Record<string, unknown>

  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    res.status(400).json({ error: 'displayName debe ser una cadena no vacía.' })
    return
  }

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { displayName: displayName.trim() },
  })
  res.json({ user: toPublicUser(updated) })
})
