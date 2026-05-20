import { useEffect, useState } from 'react'
import type { CandidateProfile, PortfolioCV } from '../../lib/domain/types'
import { createPortfolioCV } from '../../lib/domain/createPortfolioCV'
import type { PublicUser } from '../../lib/api/client'
import { api } from '../../lib/api/client'
import { ProfileForm } from './ProfileForm'
import { CVPreview } from './CVPreview'

interface Props {
  user: PublicUser
  cv: PortfolioCV
  onLogout: () => void | Promise<void>
  onCVUpdate: (cv: PortfolioCV) => void | Promise<void>
}

type BackendStatus = 'checking' | 'ok' | 'offline'

export function AuthenticatedShell({ user, cv, onLogout, onCVUpdate }: Props) {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking')

  useEffect(() => {
    let cancelled = false
    api.health()
      .then(() => { if (!cancelled) setBackendStatus('ok') })
      .catch(() => { if (!cancelled) setBackendStatus('offline') })
    return () => { cancelled = true }
  }, [])

  async function handleProfileSave(profile: CandidateProfile) {
    await onCVUpdate(createPortfolioCV({ ...cv, profile }))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-brand">EXPERTECH CV <span className="app-header-v2">V2</span></span>
        <div className="app-header-user">
          <span className={`backend-status backend-status-${backendStatus}`} title={`Backend: ${backendStatus}`}>
            {backendStatus === 'ok' && '● backend ok'}
            {backendStatus === 'checking' && '○ backend…'}
            {backendStatus === 'offline' && '○ backend offline'}
          </span>
          <span className="app-header-name">{user.displayName || user.email}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => void onLogout()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="app-content">
        <aside className="editor-panel">
          <ProfileForm profile={cv.profile} onSave={handleProfileSave} />
        </aside>
        <main className="preview-panel">
          <CVPreview cv={cv} />
        </main>
      </div>
    </div>
  )
}
