import { Code2, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import type { PortfolioCV, Project } from '../../lib/domain/types'
import { getVisibleProjects } from '../../lib/utils/projects'
import { QRCodeBlock } from './QRCodeBlock'

interface Props {
  cv: PortfolioCV
  publicUrl: string
  qrDataUrl: string
  qrStatus: 'loading' | 'ready' | 'error'
}

function PrintableProject({ project }: { project: Project }) {
  return (
    <article className="break-inside-avoid rounded-sm border border-outline-variant/70 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-body-md font-semibold text-on-surface">{project.name || 'Proyecto sin título'}</h3>
          {project.sourceProvider === 'github' && project.sourceRepositoryFullName && (
            <p className="mt-1 text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
              GitHub · {project.sourceRepositoryFullName}
            </p>
          )}
        </div>
        {(project.repoUrl || project.demoUrl) && (
          <div className="flex flex-wrap gap-3 text-label-sm font-semibold text-primary">
            {project.repoUrl && (
              <a href={project.repoUrl} className="inline-flex items-center gap-1">
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                Repo
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} className="inline-flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Demo
              </a>
            )}
          </div>
        )}
      </div>

      {project.description && (
        <p className="mt-3 text-label-md leading-6 text-on-surface-variant">{project.description}</p>
      )}

      {project.stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-sm bg-surface-container px-2 py-1 text-label-sm font-semibold text-on-surface-variant">
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function PrintableCV({ cv, publicUrl, qrDataUrl, qrStatus }: Props) {
  const { profile } = cv
  const visibleProjects = getVisibleProjects(cv.projects)

  return (
    <article className="printable-cv mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-8 text-on-surface shadow-card sm:p-10">
      <header className="flex flex-col gap-6 border-b-2 border-primary pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-label-sm font-bold uppercase tracking-[0.05em] text-primary">Expertech CV</p>
          <h2 className="mt-3 text-headline-lg-mobile font-bold uppercase leading-tight text-on-surface sm:text-headline-lg">
            {profile.fullName || 'Nombre profesional'}
          </h2>
          {profile.headline && (
            <p className="mt-2 text-body-md font-semibold text-primary">{profile.headline}</p>
          )}
        </div>

        {(profile.avatarBase64 || profile.avatarUrl) && (
          <img
            src={profile.avatarBase64 || profile.avatarUrl}
            alt={profile.fullName || 'Avatar del perfil'}
            className="h-20 w-20 rounded-full border-4 border-primary-fixed object-cover"
          />
        )}
      </header>

      {(profile.email || profile.phone || profile.location || profile.linkedinUrl || profile.githubUsername) && (
        <section className="mt-5 grid grid-cols-1 gap-2 text-label-sm text-on-surface-variant sm:grid-cols-2">
          {profile.email && (
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {profile.email}
            </span>
          )}
          {profile.phone && (
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {profile.phone}
            </span>
          )}
          {profile.location && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {profile.location}
            </span>
          )}
          {profile.linkedinUrl && (
            <a className="inline-flex items-center gap-2 text-primary" href={profile.linkedinUrl}>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              LinkedIn
            </a>
          )}
          {profile.githubUsername && (
            <span className="inline-flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              github.com/{profile.githubUsername}
            </span>
          )}
        </section>
      )}

      <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-7">
          {profile.summary && (
            <section className="break-inside-avoid">
              <h3 className="border-b border-primary-container pb-2 text-body-md font-semibold text-on-surface">
                Perfil profesional
              </h3>
              <p className="mt-3 text-label-md leading-6 text-on-surface-variant">{profile.summary}</p>
            </section>
          )}

          {visibleProjects.length > 0 && (
            <section>
              <h3 className="border-b border-primary-container pb-2 text-body-md font-semibold text-on-surface">
                Proyectos destacados
              </h3>
              <div className="mt-4 space-y-3">
                {visibleProjects.map((project) => (
                  <PrintableProject key={project.id || project.name} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          {profile.skills.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="border-b border-primary-container pb-2 text-body-md font-semibold text-on-surface">
                Skills
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="rounded-sm bg-primary-fixed px-2 py-1 text-label-sm font-semibold text-on-primary-fixed-variant">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="break-inside-avoid">
            <h3 className="border-b border-primary-container pb-2 text-body-md font-semibold text-on-surface">
              Perfil público planificado
            </h3>
            <p className="mt-3 text-label-sm leading-5 text-on-surface-variant">
              El QR apunta a la URL prevista para el futuro perfil público. La publicación real se implementará en otro sprint.
            </p>
            <div className="mt-3">
              <QRCodeBlock publicUrl={publicUrl} qrDataUrl={qrDataUrl} status={qrStatus} compact />
            </div>
          </section>
        </aside>
      </div>
    </article>
  )
}
