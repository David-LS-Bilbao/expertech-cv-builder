import { Building2, CalendarClock, ExternalLink, MapPin } from 'lucide-react'
import type { JobOffer } from '../../lib/api/client'

interface Props {
  job: JobOffer
  source: 'jooble' | 'mock'
}

function formatUpdated(value: string): string {
  if (!value) return 'Fecha no disponible'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  }).format(date)
}

function extractTags(job: JobOffer): string[] {
  const text = `${job.title} ${job.snippet}`.toLowerCase()
  const tags = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Frontend', 'Backend', 'Full Stack', 'Remote']
  return tags.filter((tag) => text.includes(tag.toLowerCase())).slice(0, 5)
}

export function JobResultCard({ job, source }: Props) {
  const tags = extractTags(job)

  return (
    <article className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <BriefCompanyIcon company={job.company} />
            </div>

            <div className="min-w-0">
              <h3 className="text-headline-md font-semibold text-on-surface">{job.title || 'Oferta sin título'}</h3>
              <div className="mt-2 flex flex-wrap gap-3 text-label-md text-on-surface-variant">
                {job.company && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    {job.company}
                  </span>
                )}
                {job.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    {job.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatUpdated(job.updated)}
                </span>
              </div>
            </div>
          </div>

          {job.snippet && (
            <p className="mt-4 text-body-md leading-7 text-on-surface-variant">{job.snippet}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.length > 0 ? tags.map((tag) => (
              <span key={tag} className="rounded-sm bg-surface-container-high px-2 py-1 text-label-sm font-semibold text-on-surface-variant">
                {tag}
              </span>
            )) : (
              <span className="rounded-sm bg-surface-container px-2 py-1 text-label-sm font-semibold text-on-surface-variant">
                Oferta tech
              </span>
            )}
            {source === 'mock' && (
              <span className="rounded-sm bg-tertiary-fixed px-2 py-1 text-label-sm font-semibold text-tertiary">
                Demo
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <span className="w-fit rounded-full bg-secondary-fixed/50 px-3 py-1 text-label-sm font-semibold text-secondary">
            {source === 'jooble' ? 'Jooble' : 'Fallback'}
          </span>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container"
            >
              Ver oferta
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function BriefCompanyIcon({ company }: { company: string }) {
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'CV'

  return <span className="text-label-md font-bold">{initials}</span>
}
