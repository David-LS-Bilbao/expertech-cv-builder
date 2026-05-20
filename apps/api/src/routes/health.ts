import { Router } from 'express'
import { userStore } from '../storage/memory.js'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'expertech-cv-api',
    storage: 'memory',
    users: userStore.count(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})
