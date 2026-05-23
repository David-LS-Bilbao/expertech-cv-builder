import { useEffect, useState } from 'react'
import type { PublicProfileView } from '../../lib/api/client'
import { ApiError, api } from '../../lib/api/client'
import { PublicCVView } from './PublicCVView'
import { PublicProfileEmptyState } from './PublicProfileEmptyState'

interface Props {
  slug: string
}

type PageState =
  | { status: 'loading' }
  | { status: 'success'; profile: PublicProfileView }
  | { status: 'not-found' }
  | { status: 'error'; message: string }

export function PublicProfilePage({ slug }: Props) {
  const [state, setState] = useState<PageState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    api.publicProfiles.getBySlug(slug)
      .then((profile) => {
        if (!cancelled) setState({ status: 'success', profile })
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'error', message: err instanceof Error ? err.message : 'No se pudo cargar el perfil público.' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (state.status === 'loading') {
    return (
      <div className="loading-screen">
        <p>Cargando perfil público…</p>
      </div>
    )
  }

  if (state.status === 'not-found') {
    return (
      <PublicProfileEmptyState
        title="Perfil no disponible"
        message="Este perfil no existe, está despublicado o el slug ha cambiado."
      />
    )
  }

  if (state.status === 'error') {
    return (
      <PublicProfileEmptyState
        title="No se pudo cargar"
        message={state.message}
      />
    )
  }

  return <PublicCVView cv={state.profile.cv} displayName={state.profile.displayName} slug={state.profile.slug} />
}
