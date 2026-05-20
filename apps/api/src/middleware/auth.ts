import type { NextFunction, Request, Response } from 'express'
import type { User } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    sessionToken?: string
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.header('authorization') ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Bearer token requerido.' })
    return
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) {
    res.status(401).json({ error: 'Token de sesión inválido o expirado.' })
    return
  }

  req.user = session.user
  req.sessionToken = session.token
  next()
}
