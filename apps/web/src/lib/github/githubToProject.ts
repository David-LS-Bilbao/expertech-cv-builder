import { createProject } from '../domain/createProject'
import type { Project } from '../domain/types'
import type { GitHubRepository } from './types'

export function githubRepositoryToProject(repository: GitHubRepository): Project {
  return createProject({
    id: `github-repo-${repository.id}`,
    name: repository.name,
    description: repository.description,
    repoUrl: repository.repositoryUrl,
    demoUrl: repository.homepageUrl,
    stack: repository.language ? [repository.language] : [],
    featured: true,
    sourceProvider: 'github',
    sourceRepositoryId: String(repository.id),
    sourceRepositoryName: repository.name,
    sourceRepositoryFullName: repository.fullName,
    sourceRepositoryUrl: repository.repositoryUrl,
    sourceOwnerLogin: repository.ownerLogin,
    sourceOwnerType: repository.ownerType,
    sourceImportedAt: new Date().toISOString(),
    sourceRelation: repository.isFork ? 'fork' : 'owner',
  })
}
