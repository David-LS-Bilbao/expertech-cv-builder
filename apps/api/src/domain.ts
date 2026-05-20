// Factories de dominio que normalizan shapes antes de persistir.
// Los IDs de User/CV/PublicProfile los genera Prisma (cuid).
// Los tokens de sesión se generan con crypto.randomBytes.

import { randomBytes } from 'node:crypto'
import type { CandidateProfile, PortfolioCV, Project, PublicUser } from './types.js'

export function createToken(): string {
  return randomBytes(32).toString('hex')
}

export interface UserLike {
  id: string
  displayName: string
  email: string
  provider: string
  createdAt: Date | string
}

export function toPublicUser(user: UserLike): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    provider: user.provider,
    createdAt: typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString(),
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
  return createPortfolioCV()
}
