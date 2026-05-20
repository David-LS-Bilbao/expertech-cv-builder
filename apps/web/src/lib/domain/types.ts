export interface CandidateProfile {
  fullName: string
  headline: string
  summary: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  githubUsername: string
  avatarUrl: string
  avatarBase64: string
  skills: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  repoUrl: string
  demoUrl: string
  stack: string[]
  featured: boolean
  sourceProvider: string
  sourceRepositoryId: string
  sourceRepositoryName: string
  sourceRepositoryFullName: string
  sourceRepositoryUrl: string
  sourceOwnerLogin: string
  sourceOwnerType: string
  sourceImportedAt: string
  sourceRelation: string
}

export interface CVMeta {
  version: number
  lastUpdated: string
  isDraft: boolean
}

export interface PortfolioCV {
  profile: CandidateProfile
  projects: Project[]
  meta: CVMeta
}

export type StorageType = 'localStorage' | 'sessionStorage' | 'memory'

export interface SafeStorage {
  type: StorageType
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
  length: number
  key(index: number): string | null
}
