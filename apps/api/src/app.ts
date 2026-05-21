import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { authRouter } from './routes/auth.js'
import { cvsRouter } from './routes/cvs.js'
import { healthRouter } from './routes/health.js'
import { jobsRouter } from './routes/jobs.js'
import { publicProfilesRouter } from './routes/publicProfiles.js'
import { usersRouter } from './routes/users.js'

function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173'
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

// Rate limit for auth endpoints: 20 attempts per IP per 15 minutes.
// Prevents brute-force on register and login.
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.' },
})

export function createApp(): express.Express {
  const app = express()
  const allowedOrigins = parseAllowedOrigins()

  // Security headers (Content-Security-Policy, X-Frame-Options, etc.)
  app.use(helmet())

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        callback(new Error(`Origin no permitido por CORS: ${origin}`))
      },
      credentials: false,
    })
  )

  app.use(express.json({ limit: '1mb' }))

  app.use('/health', healthRouter)
  app.use('/auth/register', authRateLimit)
  app.use('/auth/login', authRateLimit)
  app.use('/auth', authRouter)
  app.use('/users', usersRouter)
  app.use('/cvs', cvsRouter)
  app.use('/public-profiles', publicProfilesRouter)
  app.use('/jobs', jobsRouter)

  app.use((req, res) => {
    res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
  })

  return app
}
