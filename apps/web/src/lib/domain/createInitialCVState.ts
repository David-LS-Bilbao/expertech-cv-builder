import type { PortfolioCV } from './types'
import { createPortfolioCV } from './createPortfolioCV'

export function createInitialCVState(): PortfolioCV {
  return createPortfolioCV({
    profile: {
      fullName: '',
      headline: '',
      summary: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      githubUsername: '',
      skills: [],
    },
    projects: [],
    meta: {
      version: 1,
      lastUpdated: '',
      isDraft: true,
    },
  })
}
