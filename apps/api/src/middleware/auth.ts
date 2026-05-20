import type { NextFunction, Request, Response } from 'express'
import type { LocalUser, Session } from '../types.js'
import { sessionStore, userStore } from '../storage/memory.js'

// Extiende Request para llevar la sesión y el usuario autenticados.
declare module 'express-serve-static-core' {
  interface Request {
    session?: Session
    user?: LocalUser
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization') ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Bearer token requerido.' })
    return
  }

  const session = sessionStore.findByToken(token)
  if (!session) {
    res.status(401).json({ error: 'Token de sesión inválido o expirado.' })
    return
  }

  const user = userStore.findById(session.userId)
  if (!user) {
    sessionStore.delete(token)
    res.status(401).json({ error: 'Usuario asociado a la sesión ya no existe.' })
    return
  }

  req.session = session
  req.user = user
  next()
}
