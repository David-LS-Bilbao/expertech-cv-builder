import type { PortfolioCV } from '../domain/types'

interface PlannedPublicCvUrl {
  url: string
  slug: string
  isPlaceholder: true
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPlannedPublicCvUrl(cv: PortfolioCV): PlannedPublicCvUrl {
  const rawSlug = cv.profile.githubUsername || cv.profile.fullName || 'expertech-cv-preview'
  const slug = slugify(rawSlug) || 'expertech-cv-preview'
  const origin = typeof window === 'undefined' ? 'http://localhost:8090' : window.location.origin

  return {
    url: `${origin}/p/${slug}`,
    slug,
    isPlaceholder: true,
  }
}
