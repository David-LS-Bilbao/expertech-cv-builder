import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { createToken, toPublicUser } from '../domain.js'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { hashPassword, verifyPassword } from '../lib/password.js'

export const authRouter = Router()

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

authRouter.post('/register', async (req, res) => {
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

  try {
    const user = await prisma.user.create({
      data: {
        displayName: displayName.trim(),
        email: normalizeEmail(email),
        hashedPassword: await hashPassword(password),
        provider: 'local',
      },
    })

    const session = await prisma.session.create({
      data: { token: createToken(), userId: user.id },
    })

    res.status(201).json({
      user: toPublicUser(user),
      session: { token: session.token, userId: user.id, loggedAt: session.loggedAt.toISOString() },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Ya existe una cuenta con ese email.' })
      return
    }
    console.error('[auth/register] error:', err)
    res.status(500).json({ error: 'Error interno al registrar.' })
  }
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as Record<string, unknown>

  if (!hasText(email)) {
    res.status(400).json({ error: 'El email es obligatorio.' })
    return
  }
  if (!hasText(password)) {
    res.status(400).json({ error: 'La contraseña es obligatoria.' })
    return
  }

  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } })
  if (!user) {
    res.status(401).json({ error: 'Credenciales inválidas.' })
    return
  }

  const ok = await verifyPassword(password, user.hashedPassword)
  if (!ok) {
    res.status(401).json({ error: 'Credenciales inválidas.' })
    return
  }

  const session = await prisma.session.create({
    data: { token: createToken(), userId: user.id },
  })

  res.json({
    user: toPublicUser(user),
    session: { token: session.token, userId: user.id, loggedAt: session.loggedAt.toISOString() },
  })
})

authRouter.post('/logout', requireAuth, async (req, res) => {
  if (req.sessionToken) {
    await prisma.session.delete({ where: { token: req.sessionToken } })
  }
  res.json({ ok: true })
})
