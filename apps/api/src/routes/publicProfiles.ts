import { Router } from 'express'

export const publicProfilesRouter = Router()

// Stub para Fase 5. La resolución real (slug → cv público) llega en Fase 6
// cuando exista persistencia multi-usuario y un modelo PublicProfile.
publicProfilesRouter.get('/:slug', (req, res) => {
  const { slug } = req.params

  if (typeof slug !== 'string' || slug.trim().length === 0) {
    res.status(400).json({ error: 'Slug inválido.' })
    return
  }

  // Hasta Fase 6: ningún slug está mapeado a un usuario. 404 explícito.
  res.status(404).json({
    error: 'Perfil público no encontrado.',
    note: 'Los perfiles públicos se habilitan en Fase 6 con persistencia real.',
    slug,
  })
})
