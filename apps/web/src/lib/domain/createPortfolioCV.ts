import type { CandidateProfile, CVMeta, PortfolioCV, Project } from './types'
import { createCandidateProfile } from './createCandidateProfile'
import { createProject } from './createProject'

type PortfolioCVInput = {
  profile?: Partial<CandidateProfile>
  projects?: Partial<Project>[]
  meta?: Partial<CVMeta>
}

export function createPortfolioCV(data: PortfolioCVInput = {}): PortfolioCV {
  return {
    profile: createCandidateProfile(data.profile),
    projects: Array.isArray(data.projects)
      ? data.projects.map((p) => createProject(p))
      : [],
    meta: {
      version: data.meta?.version ?? 1,
      lastUpdated: data.meta?.lastUpdated ?? '',
      isDraft: data.meta?.isDraft ?? true,
    },
  }
}
