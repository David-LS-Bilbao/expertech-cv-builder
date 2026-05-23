import { useEffect, useState } from 'react'
import type { PortfolioCV } from '../lib/domain/types'
import { createInitialCVState } from '../lib/domain/createInitialCVState'
import type { PublicUser } from '../lib/api/client'
import { api, getToken, setToken } from '../lib/api/client'
import { AuthScreen } from '../features/auth/AuthScreen'
import { AuthenticatedShell } from '../features/cv/AuthenticatedShell'
import { LandingPage } from '../features/landing/LandingPage'
import { PublicProfilePage } from '../features/public-profile/PublicProfilePage'

type AppStatus = 'initializing' | 'unauthenticated' | 'authenticated'
type PublicEntryView = 'landing' | 'auth'

interface AuthState {
  status: AppStatus
  user: PublicUser | null
  cv: PortfolioCV
}

function getPublicProfileSlugFromPath(): string | null {
  if (typeof window === 'undefined') return null

  const match = window.location.pathname.match(/^\/p\/([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function App() {
  const publicProfileSlug = getPublicProfileSlugFromPath()
  const [publicEntryView, setPublicEntryView] = useState<PublicEntryView>('landing')
  const [state, setState] = useState<AuthState>({
    status: 'initializing',
    user: null,
    cv: createInitialCVState(),
  })

  useEffect(() => {
    if (publicProfileSlug) return

    let cancelled = false
    async function bootstrap() {
      const token = getToken()
      if (!token) {
        if (!cancelled) setState((s) => ({ ...s, status: 'unauthenticated' }))
        return
      }
      try {
        const [{ user }, { cv }] = await Promise.all([api.users.me(), api.cvs.me()])
        if (!cancelled) setState({ status: 'authenticated', user, cv })
      } catch {
        // Token inválido o backend offline: el cliente ya limpió el token en 401.
        setToken(null)
        if (!cancelled) setState({ status: 'unauthenticated', user: null, cv: createInitialCVState() })
      }
    }
    void bootstrap()
    return () => { cancelled = true }
  }, [publicProfileSlug])

  async function handleAuthSuccess(user: PublicUser, token: string) {
    setToken(token)
    try {
      const { cv } = await api.cvs.me()
      setState({ status: 'authenticated', user, cv })
    } catch {
      setState({ status: 'authenticated', user, cv: createInitialCVState() })
    }
  }

  async function handleLogout() {
    try { await api.auth.logout() } catch { /* ignore */ }
    setToken(null)
    setPublicEntryView('landing')
    setState({ status: 'unauthenticated', user: null, cv: createInitialCVState() })
  }

  async function handleCVUpdate(next: PortfolioCV) {
    try {
      const { cv } = await api.cvs.save(next)
      setState((s) => ({ ...s, cv }))
    } catch (err) {
      console.error('[App] Error al guardar CV:', err)
      // Mantenemos el draft localmente aunque la persistencia falle.
      setState((s) => ({ ...s, cv: next }))
    }
  }

  if (state.status === 'initializing') {
    if (publicProfileSlug) return <PublicProfilePage slug={publicProfileSlug} />

    return (
      <div className="loading-screen">
        <p>Cargando…</p>
      </div>
    )
  }

  if (state.status === 'unauthenticated' || !state.user) {
    if (publicEntryView === 'auth') {
      return <AuthScreen onAuthSuccess={handleAuthSuccess} />
    }

    return (
      <LandingPage
        onStart={() => setPublicEntryView('auth')}
        onSignIn={() => setPublicEntryView('auth')}
      />
    )
  }

  return (
    <AuthenticatedShell
      user={state.user}
      cv={state.cv}
      onLogout={handleLogout}
      onCVUpdate={handleCVUpdate}
    />
  )
}
