import { useState } from 'react'
import type { CandidateProfile } from '../../lib/domain/types'

interface Props {
  profile: CandidateProfile
  onSave: (profile: CandidateProfile) => void
}

export function ProfileForm({ profile, onSave }: Props) {
  const [draft, setDraft] = useState<CandidateProfile>(profile)
  const [saved, setSaved] = useState(false)

  function field(key: keyof CandidateProfile) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSaved(false)
      setDraft((prev) => ({ ...prev, [key]: e.target.value }))
    }
  }

  function handleSkillsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSaved(false)
    const skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
    setDraft((prev) => ({ ...prev, skills }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(draft)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="panel-title">Perfil</h2>

      <div className="form-field">
        <label htmlFor="pf-name">Nombre completo</label>
        <input id="pf-name" type="text" value={draft.fullName} onChange={field('fullName')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-headline">Titular profesional</label>
        <input id="pf-headline" type="text" value={draft.headline} onChange={field('headline')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-summary">Resumen</label>
        <textarea id="pf-summary" rows={4} value={draft.summary} onChange={field('summary')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-email">Email</label>
        <input id="pf-email" type="email" value={draft.email} onChange={field('email')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-phone">Teléfono</label>
        <input id="pf-phone" type="tel" value={draft.phone} onChange={field('phone')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-location">Ubicación</label>
        <input id="pf-location" type="text" value={draft.location} onChange={field('location')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-linkedin">LinkedIn URL</label>
        <input id="pf-linkedin" type="url" value={draft.linkedinUrl} onChange={field('linkedinUrl')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-github">GitHub username</label>
        <input id="pf-github" type="text" value={draft.githubUsername} onChange={field('githubUsername')} />
      </div>
      <div className="form-field">
        <label htmlFor="pf-skills">Tecnologías (separadas por comas)</label>
        <input
          id="pf-skills"
          type="text"
          value={draft.skills.join(', ')}
          onChange={handleSkillsChange}
          placeholder="React, TypeScript, Node.js"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Guardar perfil</button>
        {saved && <span className="save-confirmation">✓ Guardado</span>}
      </div>
    </form>
  )
}
