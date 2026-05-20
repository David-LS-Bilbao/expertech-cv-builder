import type { Project } from './types'

export function createProject(data: Partial<Project> = {}): Project {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    description: data.description ?? '',
    repoUrl: data.repoUrl ?? '',
    demoUrl: data.demoUrl ?? '',
    stack: Array.isArray(data.stack) ? data.stack : [],
    featured: Boolean(data.featured),
    sourceProvider: data.sourceProvider ?? '',
    sourceRepositoryId: data.sourceRepositoryId ?? '',
    sourceRepositoryName: data.sourceRepositoryName ?? '',
    sourceRepositoryFullName: data.sourceRepositoryFullName ?? '',
    sourceRepositoryUrl: data.sourceRepositoryUrl ?? '',
    sourceOwnerLogin: data.sourceOwnerLogin ?? '',
    sourceOwnerType: data.sourceOwnerType ?? '',
    sourceImportedAt: data.sourceImportedAt ?? '',
    sourceRelation: data.sourceRelation ?? '',
  }
}
