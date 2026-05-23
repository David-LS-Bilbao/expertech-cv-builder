import type { JobOffer, JobsSearchSource } from '../../lib/api/client'
import { JobResultCard } from './JobResultCard'

interface Props {
  results: JobOffer[]
  source: JobsSearchSource
}

export function JobResultsList({ results, source }: Props) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center shadow-card">
        <h2 className="text-headline-md font-semibold text-on-surface">Sin resultados</h2>
        <p className="mx-auto mt-2 max-w-xl text-body-md text-on-surface-variant">
          Prueba con una tecnología más amplia, otra ubicación o una búsqueda remota.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((job) => (
        <JobResultCard key={job.id || `${job.title}-${job.url}`} job={job} source={source} />
      ))}
    </div>
  )
}
