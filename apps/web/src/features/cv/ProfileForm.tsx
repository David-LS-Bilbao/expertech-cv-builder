import { useState } from 'react'
import { CheckCircle2, ChevronDown, Code2, Contact, FolderKanban, UserRound } from 'lucide-react'
import type { CandidateProfile } from '../../lib/domain/types'

interface Props {
  profile: CandidateProfile
  projectCount?: number
  onSave: (profile: CandidateProfile) => void
}

type SectionId = 'profile' | 'contact' | 'skills' | 'projects'

const inputClassName = 'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/40'
const labelClassName = 'block text-label-md font-medium text-on-surface'

export function ProfileForm({ profile, projectCount = 0, onSave }: Props) {
  const [draft, setDraft] = useState<CandidateProfile>(profile)
  const [saved, setSaved] = useState(false)
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    profile: true,
    contact: true,
    skills: true,
    projects: false,
  })

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

  function toggleSection(section: SectionId) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(draft)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
              Editor CV
            </p>
            <h2 className="mt-1 text-headline-md font-semibold text-on-surface">Contenido del perfil</h2>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed/50 px-3 py-2 text-label-sm font-semibold text-secondary">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Guardado
              </span>
            )}
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <EditorSection
        id="profile"
        title="Perfil profesional"
        icon={UserRound}
        open={openSections.profile}
        onToggle={toggleSection}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-name">Nombre completo</label>
            <input id="pf-name" className={inputClassName} type="text" value={draft.fullName} onChange={field('fullName')} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-headline">Titular profesional</label>
            <input id="pf-headline" className={inputClassName} type="text" value={draft.headline} onChange={field('headline')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName} htmlFor="pf-summary">Resumen</label>
            <textarea
              id="pf-summary"
              className={`${inputClassName} min-h-32 resize-y`}
              rows={4}
              value={draft.summary}
              onChange={field('summary')}
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection
        id="contact"
        title="Contacto"
        icon={Contact}
        open={openSections.contact}
        onToggle={toggleSection}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-email">Email</label>
            <input id="pf-email" className={inputClassName} type="email" value={draft.email} onChange={field('email')} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-phone">Teléfono</label>
            <input id="pf-phone" className={inputClassName} type="tel" value={draft.phone} onChange={field('phone')} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-location">Ubicación</label>
            <input id="pf-location" className={inputClassName} type="text" value={draft.location} onChange={field('location')} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-linkedin">LinkedIn URL</label>
            <input id="pf-linkedin" className={inputClassName} type="url" value={draft.linkedinUrl} onChange={field('linkedinUrl')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className={labelClassName} htmlFor="pf-github">GitHub username</label>
            <input id="pf-github" className={inputClassName} type="text" value={draft.githubUsername} onChange={field('githubUsername')} />
          </div>
        </div>
      </EditorSection>

      <EditorSection
        id="skills"
        title="Skills"
        icon={Code2}
        open={openSections.skills}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="pf-skills">Tecnologías</label>
            <input
              id="pf-skills"
              className={inputClassName}
              type="text"
              value={draft.skills.join(', ')}
              onChange={handleSkillsChange}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          {draft.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary-fixed px-3 py-1 text-label-sm font-semibold text-on-primary-fixed-variant">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </EditorSection>

      <EditorSection
        id="projects"
        title="Proyectos"
        icon={FolderKanban}
        open={openSections.projects}
        onToggle={toggleSection}
      >
        <div className="rounded-lg border border-dashed border-outline-variant bg-surface p-5">
          <p className="text-label-md font-semibold text-on-surface">
            {projectCount > 0 ? `${projectCount} proyectos cargados en el CV.` : 'No hay proyectos cargados todavía.'}
          </p>
          <p className="mt-2 text-label-md text-on-surface-variant">
            Los proyectos importados desde GitHub se añaden en la vista GitHub Sync.
          </p>
        </div>
      </EditorSection>
    </form>
  )
}

interface EditorSectionProps {
  id: SectionId
  title: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  open: boolean
  onToggle: (section: SectionId) => void
  children: React.ReactNode
}

function EditorSection({ id, title, icon: Icon, open, onToggle, children }: EditorSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-card">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-surface-container-low"
        onClick={() => onToggle(id)}
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
            <Icon className="h-5 w-5" aria-hidden={true} />
          </span>
          <span className="truncate text-headline-md font-semibold text-on-surface">{title}</span>
        </span>
        <ChevronDown
          className={['h-5 w-5 flex-shrink-0 text-on-surface-variant transition-transform', open ? 'rotate-180' : ''].join(' ')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-outline-variant/40 p-5">
          {children}
        </div>
      )}
    </section>
  )
}
