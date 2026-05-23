import type { GitHubProfile, GitHubPublicData, GitHubRepository } from './types'

const GITHUB_API_BASE_URL = 'https://api.github.com'
const DEFAULT_REPOSITORIES_LIMIT = 30

const DEFAULT_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

type GitHubProfileResponse = {
  id?: number
  login?: string
  name?: string | null
  avatar_url?: string | null
  bio?: string | null
  html_url?: string | null
  company?: string | null
  blog?: string | null
  location?: string | null
  public_repos?: number
  followers?: number
  following?: number
}

type GitHubRepositoryResponse = {
  id?: number
  name?: string | null
  full_name?: string | null
  description?: string | null
  html_url?: string | null
  homepage?: string | null
  language?: string | null
  owner?: {
    login?: string | null
    type?: string | null
  } | null
  stargazers_count?: number
  forks_count?: number
  updated_at?: string | null
  fork?: boolean
  archived?: boolean
  private?: boolean
}

export class GitHubRequestError extends Error {
  status: number
  isRateLimited: boolean

  constructor(status: number, message: string, isRateLimited = false) {
    super(message)
    this.name = 'GitHubRequestError'
    this.status = status
    this.isRateLimited = isRateLimited
  }
}

export function normalizeGitHubUsername(username: string): string {
  return String(username ?? '').trim().replace(/^@+/, '')
}

async function readGitHubErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string }
    return body.message || 'Error desconocido al consultar GitHub.'
  } catch {
    return 'Error desconocido al consultar GitHub.'
  }
}

async function createGitHubRequestError(response: Response, username: string): Promise<GitHubRequestError> {
  const remaining = response.headers.get('x-ratelimit-remaining')
  const isRateLimited = response.status === 403 && remaining === '0'

  if (response.status === 404) {
    return new GitHubRequestError(404, `No se ha encontrado el perfil público de GitHub "${username}".`)
  }

  if (isRateLimited) {
    return new GitHubRequestError(
      403,
      'GitHub ha limitado temporalmente las peticiones públicas. Prueba de nuevo más tarde.',
      true,
    )
  }

  if (response.status === 403) {
    return new GitHubRequestError(
      403,
      'GitHub ha rechazado temporalmente la petición pública.',
      true,
    )
  }

  const apiMessage = await readGitHubErrorMessage(response)
  return new GitHubRequestError(response.status, `No se pudo consultar GitHub: ${apiMessage}`)
}

async function requestGitHubJson<T>(url: string, username: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  })

  if (!response.ok) {
    throw await createGitHubRequestError(response, username)
  }

  return (await response.json()) as T
}

function normalizeProfile(profile: GitHubProfileResponse): GitHubProfile {
  return {
    id: profile.id ?? 0,
    login: profile.login ?? '',
    name: profile.name ?? '',
    avatarUrl: profile.avatar_url ?? '',
    bio: profile.bio ?? '',
    profileUrl: profile.html_url ?? '',
    company: profile.company ?? '',
    blog: profile.blog ?? '',
    location: profile.location ?? '',
    publicRepos: profile.public_repos ?? 0,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
  }
}

function normalizeRepository(repository: GitHubRepositoryResponse): GitHubRepository {
  return {
    id: repository.id ?? 0,
    name: repository.name ?? '',
    fullName: repository.full_name ?? '',
    description: repository.description ?? '',
    repositoryUrl: repository.html_url ?? '',
    homepageUrl: repository.homepage ?? '',
    language: repository.language ?? '',
    ownerLogin: repository.owner?.login ?? '',
    ownerType: repository.owner?.type ?? '',
    stars: repository.stargazers_count ?? 0,
    forks: repository.forks_count ?? 0,
    updatedAt: repository.updated_at ?? '',
    isFork: Boolean(repository.fork),
    isArchived: Boolean(repository.archived),
    isPrivate: Boolean(repository.private),
  }
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const normalizedUsername = normalizeGitHubUsername(username)

  if (!normalizedUsername) {
    throw new GitHubRequestError(0, 'Debes indicar un usuario de GitHub válido.')
  }

  const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(normalizedUsername)}`
  const profile = await requestGitHubJson<GitHubProfileResponse>(url, normalizedUsername)
  return normalizeProfile(profile)
}

export async function fetchGitHubRepositories(
  username: string,
  { limit = DEFAULT_REPOSITORIES_LIMIT, excludeForks = true } = {},
): Promise<{ repositories: GitHubRepository[]; excludedForks: number }> {
  const normalizedUsername = normalizeGitHubUsername(username)

  if (!normalizedUsername) {
    throw new GitHubRequestError(0, 'Debes indicar un usuario de GitHub válido.')
  }

  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, DEFAULT_REPOSITORIES_LIMIT) : DEFAULT_REPOSITORIES_LIMIT
  const url =
    `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(normalizedUsername)}/repos` +
    `?sort=updated&direction=desc&per_page=${safeLimit}&type=owner`

  const repositoriesData = await requestGitHubJson<GitHubRepositoryResponse[]>(url, normalizedUsername)
  const normalized = Array.isArray(repositoriesData)
    ? repositoriesData
      .map(normalizeRepository)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : []

  const repositories = excludeForks ? normalized.filter((repo) => !repo.isFork) : normalized

  return {
    repositories,
    excludedForks: normalized.length - repositories.length,
  }
}

export async function fetchGitHubPublicData(username: string): Promise<GitHubPublicData> {
  const normalizedUsername = normalizeGitHubUsername(username)

  if (!normalizedUsername) {
    throw new GitHubRequestError(0, 'Debes indicar un usuario de GitHub válido.')
  }

  const [profile, repositoryResult] = await Promise.all([
    fetchGitHubProfile(normalizedUsername),
    fetchGitHubRepositories(normalizedUsername),
  ])

  return {
    username: normalizedUsername,
    profile,
    repositories: repositoryResult.repositories,
    excludedForks: repositoryResult.excludedForks,
  }
}
