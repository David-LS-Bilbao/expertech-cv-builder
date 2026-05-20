import type { PortfolioCV, Project } from '../../lib/domain/types'
import { getVisibleProjects } from '../../lib/utils/projects'

interface Props {
  cv: PortfolioCV
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <p className="project-card-name">{project.name}</p>
      {project.description && <p className="project-card-desc">{project.description}</p>}
      {project.stack.length > 0 && (
        <div className="project-card-stack">
          {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
        </div>
      )}
      {(project.repoUrl || project.demoUrl) && (
        <div className="project-card-links">
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">Repositorio</a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Demo</a>}
        </div>
      )}
      {project.sourceProvider && (
        <p className="project-card-source">{project.sourceProvider} · {project.sourceRepositoryFullName}</p>
      )}
    </div>
  )
}

export function CVPreview({ cv }: Props) {
  const { profile, projects } = cv
  const visibleProjects = getVisibleProjects(projects)

  const hasProfile = profile.fullName || profile.headline || profile.summary

  if (!hasProfile && visibleProjects.length === 0) {
    return (
      <div className="cv-preview">
        <p className="empty-state">Tu CV aparecerá aquí cuando añadas información en el editor.</p>
      </div>
    )
  }

  return (
    <div className="cv-preview">
      {profile.fullName && <h2 className="cv-preview-name">{profile.fullName}</h2>}
      {profile.headline && <p className="cv-preview-headline">{profile.headline}</p>}
      {profile.summary && <p className="cv-preview-summary">{profile.summary}</p>}

      {(profile.email || profile.phone || profile.location || profile.linkedinUrl || profile.githubUsername) && (
        <div className="cv-preview-contact">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>}
          {profile.githubUsername && <span>github.com/{profile.githubUsername}</span>}
        </div>
      )}

      {profile.skills.length > 0 && (
        <div className="cv-preview-skills">
          {profile.skills.map((skill) => (
            <span key={skill} className="skill-chip">{skill}</span>
          ))}
        </div>
      )}

      {visibleProjects.length > 0 && (
        <>
          <p className="cv-preview-section-title">Proyectos</p>
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id || project.name} project={project} />
          ))}
        </>
      )}
    </div>
  )
}
