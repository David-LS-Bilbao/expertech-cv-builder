import { Code2, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import type { PortfolioCV, Project } from '../../lib/domain/types'
import { getVisibleProjects } from '../../lib/utils/projects'

interface Props {
  cv: PortfolioCV
  compact?: boolean
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-outline-variant/60 bg-surface p-4 transition hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <p className="text-label-md font-semibold text-on-surface">{project.name}</p>
        {project.sourceProvider === 'github' && (
          <span className="rounded-full bg-secondary-fixed/40 px-2 py-1 text-[10px] font-bold uppercase text-secondary">
            GitHub
          </span>
        )}
      </div>
      {project.description && <p className="mt-2 text-label-md text-on-surface-variant">{project.description}</p>}
      {project.stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-sm bg-surface-container-high px-2 py-1 text-label-sm font-semibold text-on-surface-variant">
              {tech}
            </span>
          ))}
        </div>
      )}
      {(project.repoUrl || project.demoUrl) && (
        <div className="mt-3 flex flex-wrap gap-3 text-label-sm font-semibold">
          {project.repoUrl && (
            <a className="inline-flex items-center gap-1 text-primary hover:text-on-primary-fixed-variant" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              Repositorio
            </a>
          )}
          {project.demoUrl && (
            <a className="inline-flex items-center gap-1 text-primary hover:text-on-primary-fixed-variant" href={project.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Demo
            </a>
          )}
        </div>
      )}
      {project.sourceRepositoryFullName && (
        <p className="mt-3 truncate text-label-sm text-outline">
          {project.sourceRepositoryFullName}
        </p>
      )}
    </article>
  )
}

export function CVPreview({ cv, compact = false }: Props) {
  const { profile, projects } = cv
  const visibleProjects = getVisibleProjects(projects)

  const hasProfile = profile.fullName || profile.headline || profile.summary

  if (!hasProfile && visibleProjects.length === 0) {
    return (
      <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
        <p className="rounded-lg border border-dashed border-outline-variant bg-surface p-8 text-center text-label-md text-on-surface-variant">
          Tu CV aparecerá aquí cuando añadas información en el editor.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-card sm:p-6">
      <div className="rounded-sm border border-outline-variant/70 bg-white p-6 shadow-card sm:p-8">
        <header className="flex flex-col gap-6 border-b-2 border-primary pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {profile.fullName && (
              <h2 className={['font-bold uppercase text-on-surface', compact ? 'text-2xl leading-tight' : 'text-headline-lg-mobile sm:text-headline-lg'].join(' ')}>
                {profile.fullName}
              </h2>
            )}
            {profile.headline && (
              <p className="mt-2 text-body-md font-semibold uppercase tracking-[0.05em] text-primary">
                {profile.headline}
              </p>
            )}
            <p className="mt-3 text-label-sm font-semibold uppercase text-outline">
              Technical resume
            </p>
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
          <div className="mt-5 grid grid-cols-1 gap-2 text-label-sm text-on-surface-variant sm:grid-cols-2">
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
              <a className="inline-flex items-center gap-2 text-primary hover:text-on-primary-fixed-variant" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
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
          </div>
        )}

        <div className={['mt-8 grid grid-cols-1 gap-6', compact ? '' : 'md:grid-cols-[0.8fr_1.2fr]'].join(' ')}>
          {profile.skills.length > 0 && (
            <section>
              <p className="border-b border-outline-variant pb-2 text-label-sm font-bold uppercase tracking-[0.05em] text-on-surface">
                Skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="rounded-sm bg-primary-fixed px-2 py-1 text-label-sm font-semibold text-on-primary-fixed-variant">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {profile.summary && (
            <section>
              <p className="border-b border-outline-variant pb-2 text-label-sm font-bold uppercase tracking-[0.05em] text-on-surface">
                Resumen
              </p>
              <p className="mt-3 text-label-md leading-6 text-on-surface-variant">{profile.summary}</p>
            </section>
          )}
        </div>

        {visibleProjects.length > 0 && (
          <section className="mt-8">
            <p className="border-b border-outline-variant pb-2 text-label-sm font-bold uppercase tracking-[0.05em] text-on-surface">
              Proyectos
            </p>
            <div className="mt-4 space-y-3">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id || project.name} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
