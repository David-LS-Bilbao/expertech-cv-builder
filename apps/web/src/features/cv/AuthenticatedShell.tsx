import type { Session } from '../../lib/auth/types'
import type { CandidateProfile, PortfolioCV } from '../../lib/domain/types'
import { createPortfolioCV } from '../../lib/domain/createPortfolioCV'
import { ProfileForm } from './ProfileForm'
import { CVPreview } from './CVPreview'

interface Props {
  session: Session
  cv: PortfolioCV
  onLogout: () => void
  onCVUpdate: (cv: PortfolioCV) => void
}

export function AuthenticatedShell({ session, cv, onLogout, onCVUpdate }: Props) {
  function handleProfileSave(profile: CandidateProfile) {
    onCVUpdate(createPortfolioCV({ ...cv, profile }))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-brand">EXPERTECH CV <span className="app-header-v2">V2</span></span>
        <div className="app-header-user">
          <span className="app-header-name">{session.displayName || session.email}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
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
