// Factories de dominio del backend. Equivalentes a las del frontend
// (apps/web/src/lib/domain/) pero ejecutándose en Node.

import { randomBytes } from 'node:crypto'
import type {
  CandidateProfile,
  LocalUser,
  PortfolioCV,
  Project,
  PublicUser,
  Session,
} from './types.js'

function normalize(s: string): string {
  return s.trim()
}

function normalizeEmail(s: string): string {
  return s.trim().toLowerCase()
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}`
}

export function createToken(): string {
  return randomBytes(32).toString('hex')
}

export function toPublicUser(user: LocalUser): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    provider: user.provider,
    createdAt: user.createdAt,
  }
}

export function createCandidateProfile(data: Partial<CandidateProfile> = {}): CandidateProfile {
  return {
    fullName: data.fullName ?? '',
    headline: data.headline ?? '',
    summary: data.summary ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    location: data.location ?? '',
    linkedinUrl: data.linkedinUrl ?? '',
    githubUsername: data.githubUsername ?? '',
    avatarUrl: data.avatarUrl ?? '',
    avatarBase64: data.avatarBase64 ?? '',
    skills: Array.isArray(data.skills) ? data.skills : [],
  }
}

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

type PortfolioCVInput = {
  profile?: Partial<CandidateProfile>
  projects?: Partial<Project>[]
  meta?: Partial<PortfolioCV['meta']>
}

export function createPortfolioCV(data: PortfolioCVInput = {}): PortfolioCV {
  return {
    profile: createCandidateProfile(data.profile),
    projects: Array.isArray(data.projects) ? data.projects.map((p) => createProject(p)) : [],
    meta: {
      version: data.meta?.version ?? 1,
      lastUpdated: data.meta?.lastUpdated ?? '',
      isDraft: data.meta?.isDraft ?? true,
    },
  }
}

export function createInitialCVState(): PortfolioCV {
  return createPortfolioCV({ profile: {}, projects: [], meta: { version: 1, isDraft: true } })
}

export function createUserRecord(input: {
  displayName: string
  email: string
  password: string
  provider?: string
}): LocalUser {
  return {
    id: createId('user'),
    displayName: normalize(input.displayName),
    email: normalizeEmail(input.email),
    password: input.password,
    provider: normalize(input.provider ?? 'local'),
    createdAt: new Date().toISOString(),
  }
}

export function createSessionRecord(user: LocalUser): Session {
  return {
    token: createToken(),
    userId: user.id,
    displayName: user.displayName,
    email: user.email,
    provider: user.provider,
    loggedAt: new Date().toISOString(),
  }
}
