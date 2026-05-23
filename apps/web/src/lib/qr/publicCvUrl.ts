import type { PortfolioCV } from '../domain/types'
import type { PublicProfileSettings } from '../api/client'

export interface PublicCvUrlState {
  url: string
  path: string
  slug: string
  isPlaceholder: boolean
  isPublished: boolean
}

export function normalizePublicSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '')
}

export function buildAbsolutePublicUrl(path: string): string {
  const origin = typeof window === 'undefined' ? 'http://localhost:8090' : window.location.origin
  return `${origin}${path}`
}

export function getFallbackPublicSlug(cv: PortfolioCV): string {
  const rawSlug = cv.profile.githubUsername || cv.profile.fullName || 'expertech-cv-preview'
  return normalizePublicSlug(rawSlug) || 'expertech-cv-preview'
}

export function getPublicCvUrl(cv: PortfolioCV, publicProfile?: PublicProfileSettings | null): PublicCvUrlState {
  if (publicProfile?.isPublic && publicProfile.slug) {
    const slug = normalizePublicSlug(publicProfile.slug)
    const path = publicProfile.publicPath || `/p/${slug}`

    return {
      url: buildAbsolutePublicUrl(path),
      path,
      slug,
      isPlaceholder: false,
      isPublished: true,
    }
  }

  const slug = getFallbackPublicSlug(cv)
  const path = `/p/${slug}`

  return {
    url: buildAbsolutePublicUrl(path),
    path,
    slug,
    isPlaceholder: true,
    isPublished: false,
  }
}

export function getPlannedPublicCvUrl(cv: PortfolioCV): PublicCvUrlState {
  return getPublicCvUrl(cv)
}
