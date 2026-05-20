import { Router } from 'express'
import { searchJobs } from '../services/joobleProxy.js'

export const jobsRouter = Router()

jobsRouter.get('/search', async (req, res) => {
  const keywords = String(req.query.keywords ?? '').trim()
  const location = String(req.query.location ?? '').trim()

  if (!keywords) {
    res.status(400).json({ error: 'El parámetro "keywords" es obligatorio.' })
    return
  }

  try {
    const result = await searchJobs(keywords, location)
    res.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error desconocido'
    console.error('[jobs] Error en /jobs/search:', message)
    res.status(500).json({ error: 'Error interno al buscar ofertas.' })
  }
})
