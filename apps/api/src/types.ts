// Tipos del dominio compartido con el frontend (apps/web/src/lib/domain/types.ts
// y apps/web/src/lib/auth/types.ts). Se duplican localmente en Fase 5; se moverán
// a un paquete compartido cuando aporte valor real (probablemente Fase 6).

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

export interface LocalUser {
  id: string
  displayName: string
  email: string
  password: string // texto plano en MVP; bcrypt en Fase 6/8
  provider: string
  createdAt: string
}

export interface PublicUser {
  id: string
  displayName: string
  email: string
  provider: string
  createdAt: string
}

export interface Session {
  token: string
  userId: string
  displayName: string
  email: string
  provider: string
  loggedAt: string
}

// Contrato estable del proxy de jobs (idéntico al legacy server/server.js).
export interface JobOffer {
  id: string
  title: string
  company: string
  location: string
  url: string
  snippet: string
  updated: string
}

export type JobsSearchSource = 'jooble' | 'mock'

export interface JobsSearchResponse {
  results: JobOffer[]
  fallbackWarning: string | null
  source: JobsSearchSource
}
