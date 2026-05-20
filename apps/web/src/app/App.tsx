import { useState } from 'react'
import type { Session } from '../lib/auth/types'
import type { PortfolioCV } from '../lib/domain/types'
import { loadSession, logoutUser } from '../lib/auth/AuthStorageService'
import { loadCV, saveCV } from '../lib/storage/CVStorageService'
import { AuthScreen } from '../features/auth/AuthScreen'
import { AuthenticatedShell } from '../features/cv/AuthenticatedShell'

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession())
  const [cv, setCv] = useState<PortfolioCV>(() => loadCV())

  function handleAuthSuccess(s: Session) {
    setSession(s)
  }

  function handleLogout() {
    logoutUser()
    setSession(null)
  }

  function handleCVUpdate(next: PortfolioCV) {
    setCv(saveCV(next))
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <AuthenticatedShell
      session={session}
      cv={cv}
      onLogout={handleLogout}
      onCVUpdate={handleCVUpdate}
    />
  )
}
