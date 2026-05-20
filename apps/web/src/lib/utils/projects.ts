import type { Project } from '../domain/types'

export function isRenderableProject(project: Partial<Project>): boolean {
  const name = String(project.name ?? '').trim()
  const description = String(project.description ?? '').trim()
  const repoUrl = String(project.repoUrl ?? '').trim()
  const demoUrl = String(project.demoUrl ?? '').trim()
  const stack = Array.isArray(project.stack) ? project.stack : []
  return Boolean(name || description || repoUrl || demoUrl || stack.length > 0)
}

export function getVisibleProjects(projects: Project[]): Project[] {
  if (!Array.isArray(projects)) return []
  const renderable = projects.filter(isRenderableProject)
  const featured = renderable.filter((p) => Boolean(p.featured))
  return featured.length > 0 ? featured : renderable
}
