import { Code2, ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react'
import type { PortfolioCV, Project } from '../../lib/domain/types'
import { getVisibleProjects } from '../../lib/utils/projects'

interface Props {
  cv: PortfolioCV
  displayName: string
  slug: string
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-outline-variant/70 bg-surface-container-low p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-body-md font-semibold text-on-surface">{project.name || 'Proyecto destacado'}</h3>
          {project.sourceProvider === 'github' && project.sourceRepositoryFullName && (
            <p className="mt-1 text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
              {project.sourceRepositoryFullName}
            </p>
          )}
        </div>
        {(project.demoUrl || project.repoUrl) && (
          <a
            href={project.demoUrl || project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary transition hover:text-on-primary-fixed-variant"
            aria-label={`Abrir ${project.name}`}
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </a>
        )}
      </div>

      {project.description && (
        <p className="mt-3 text-label-md leading-6 text-on-surface-variant">{project.description}</p>
      )}

      {project.stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-sm bg-surface-container-high px-2 py-1 text-label-sm font-semibold uppercase text-on-surface-variant">
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function PublicCVView({ cv, displayName, slug }: Props) {
  const { profile } = cv
  const visibleProjects = getVisibleProjects(cv.projects)
  const title = profile.fullName || displayName

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant/60 bg-surface/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-margin-desktop">
          <a href="/" className="text-body-md font-bold text-on-surface">EXPERTECH CV</a>
          <div className="flex items-center gap-4 text-label-md">
            <span className="hidden text-on-surface-variant sm:inline">/p/{slug}</span>
            <a href="/" className="font-semibold text-primary hover:text-on-primary-fixed-variant">Crear CV</a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-margin-desktop md:py-12">
        <section className="relative overflow-hidden rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-6 shadow-card md:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {(profile.avatarBase64 || profile.avatarUrl) && (
                <img
                  src={profile.avatarBase64 || profile.avatarUrl}
                  alt={title}
                  className="h-28 w-28 rounded-full border-4 border-primary-fixed object-cover md:h-36 md:w-36"
                />
              )}
              <div>
                <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
                  Perfil técnico publicado
                </p>
                <h1 className="text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
                  {title}
                </h1>
                {profile.headline && <p className="mt-1 text-body-md font-semibold text-primary">{profile.headline}</p>}
                <div className="mt-4 flex flex-wrap gap-4 text-label-md text-on-surface-variant">
                  {profile.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-primary">
                      <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.githubUsername && (
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      GitHub
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {profile.summary && (
              <section className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-6 shadow-card md:p-8">
                <h2 className="border-b border-outline-variant pb-3 text-headline-md font-semibold text-on-surface">
                  Perfil profesional
                </h2>
                <p className="mt-5 text-body-md leading-7 text-on-surface-variant">{profile.summary}</p>
              </section>
            )}

            {visibleProjects.length > 0 && (
              <section className="space-y-4">
                <div>
                  <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">Portfolio</p>
                  <h2 className="mt-1 text-headline-md font-semibold text-on-surface">Proyectos destacados</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id || project.name} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-secondary" />
                <h2 className="text-label-md font-bold uppercase tracking-[0.05em] text-secondary">
                  Disponible online
                </h2>
              </div>
              <dl className="mt-5 space-y-4 text-label-md">
                <div className="flex justify-between gap-4 border-b border-outline-variant/50 pb-3">
                  <dt className="text-on-surface-variant">Ubicación</dt>
                  <dd className="font-semibold text-on-surface">{profile.location || 'No indicada'}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-outline-variant/50 pb-3">
                  <dt className="text-on-surface-variant">Proyectos</dt>
                  <dd className="font-semibold text-on-surface">{visibleProjects.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-on-surface-variant">Skills</dt>
                  <dd className="font-semibold text-on-surface">{profile.skills.length}</dd>
                </div>
              </dl>
            </section>

            {profile.skills.length > 0 && (
              <section className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-6 shadow-card">
                <h2 className="text-label-md font-bold uppercase tracking-[0.05em] text-on-surface">Technical toolkit</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="rounded-sm bg-primary-fixed px-3 py-1.5 text-label-sm font-semibold text-on-primary-fixed-variant">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-lg border border-outline-variant/70 bg-inverse-surface p-6 text-inverse-on-surface shadow-card">
              <h2 className="inline-flex items-center gap-2 text-label-md font-bold uppercase tracking-[0.05em]">
                <Code2 className="h-4 w-4 text-primary-fixed-dim" aria-hidden="true" />
                EXPERTECH CV
              </h2>
              <p className="mt-4 text-label-md text-inverse-on-surface/80">
                CV público técnico generado desde la plataforma EXPERTECH CV.
              </p>
            </section>
          </aside>
        </div>
      </main>

      <footer className="mt-12 bg-surface-container-highest px-5 py-8 md:px-margin-desktop">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-body-md font-bold text-on-surface">EXPERTECH CV</p>
          <p className="text-label-sm text-on-surface-variant">Perfil público read-only</p>
        </div>
      </footer>
    </div>
  )
}
