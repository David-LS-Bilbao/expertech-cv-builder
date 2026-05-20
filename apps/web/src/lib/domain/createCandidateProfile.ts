import type { CandidateProfile } from './types'

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
