import { Router } from 'express'
import { createSessionRecord, createUserRecord, toPublicUser } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { sessionStore, userStore } from '../storage/memory.js'

export const authRouter = Router()

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

authRouter.post('/register', (req, res) => {
  const { displayName, email, password } = req.body as Record<string, unknown>

  if (!hasText(displayName)) {
    res.status(400).json({ error: 'El nombre visible es obligatorio.' })
    return
  }
  if (!hasText(email)) {
    res.status(400).json({ error: 'El email es obligatorio.' })
    return
  }
  if (!hasText(password)) {
    res.status(400).json({ error: 'La contraseña es obligatoria.' })
    return
  }

  if (userStore.findByEmail(email)) {
    res.status(409).json({ error: 'Ya existe una cuenta con ese email.' })
    return
  }

  const user = userStore.create(createUserRecord({ displayName, email, password }))
  const session = sessionStore.create(createSessionRecord(user))

  res.status(201).json({ user: toPublicUser(user), session })
})

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body as Record<string, unknown>

  if (!hasText(email)) {
    res.status(400).json({ error: 'El email es obligatorio.' })
    return
  }
  if (!hasText(password)) {
    res.status(400).json({ error: 'La contraseña es obligatoria.' })
    return
  }

  const user = userStore.findByEmail(email)
  if (!user) {
    res.status(401).json({ error: 'No existe una cuenta con ese email.' })
    return
  }
  if (user.password !== password) {
    res.status(401).json({ error: 'La contraseña no es correcta.' })
    return
  }

  const session = sessionStore.create(createSessionRecord(user))
  res.json({ user: toPublicUser(user), session })
})

authRouter.post('/logout', requireAuth, (req, res) => {
  if (req.session) {
    sessionStore.delete(req.session.token)
  }
  res.json({ ok: true })
})
