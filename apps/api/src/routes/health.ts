import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    const users = await prisma.user.count()
    res.json({
      status: 'ok',
      service: 'expertech-cv-api',
      storage: 'postgres',
      users,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error desconocido'
    res.status(503).json({
      status: 'degraded',
      service: 'expertech-cv-api',
      storage: 'postgres',
      error: `DB no disponible: ${message}`,
      timestamp: new Date().toISOString(),
    })
  }
})
