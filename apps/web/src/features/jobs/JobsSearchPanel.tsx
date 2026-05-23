import { useState } from 'react'
import { AlertTriangle, BriefcaseBusiness, CheckCircle2, Loader2 } from 'lucide-react'
import { ApiError, api, type JobsSearchResponse } from '../../lib/api/client'
import { JobSearchForm } from './JobSearchForm'
import { JobResultsList } from './JobResultsList'

type JobsStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export function JobsSearchPanel() {
  const [keywords, setKeywords] = useState('react')
  const [location, setLocation] = useState('Bilbao')
  const [status, setStatus] = useState<JobsStatus>('idle')
  const [response, setResponse] = useState<JobsSearchResponse | null>(null)
  const [feedback, setFeedback] = useState('')

  async function handleSearch() {
    const normalizedKeywords = keywords.trim()

    if (!normalizedKeywords) {
      setStatus('error')
      setFeedback('El campo keywords es obligatorio para buscar ofertas.')
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const result = await api.jobs.search({
        keywords: normalizedKeywords,
        location: location.trim(),
      })
      setResponse(result)
      setStatus(result.results.length > 0 ? 'success' : 'empty')
      setFeedback(result.fallbackWarning ?? '')
    } catch (error) {
      setResponse(null)
      setStatus('error')
      setFeedback(error instanceof ApiError ? error.message : 'No se pudo buscar ofertas.')
    }
  }

  const results = response?.results ?? []
  const source = response?.source ?? 'mock'
  const isFallback = Boolean(response?.fallbackWarning) || source === 'mock'

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
        <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">Jobs Search</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
              Busca empleo tech
            </h1>
            <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Consulta el backend V2 para encontrar ofertas por tecnología y ubicación. Si Jooble no está configurado, verás resultados demo controlados.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/60 bg-surface px-3 py-2 text-label-sm font-semibold text-on-surface-variant">
            <BriefcaseBusiness className="h-4 w-4 text-primary" aria-hidden="true" />
            `/jobs/search`
          </div>
        </div>

        <div className="mt-6">
          <JobSearchForm
            keywords={keywords}
            location={location}
            isLoading={status === 'loading'}
            onKeywordsChange={setKeywords}
            onLocationChange={setLocation}
            onSubmit={() => void handleSearch()}
          />
        </div>
      </section>

      {feedback && (
        <div
          className={[
            'flex items-start gap-3 rounded-lg border p-4 text-label-md shadow-card',
            status === 'error'
              ? 'border-error-container bg-error-container/70 text-error'
              : isFallback
                ? 'border-tertiary-fixed-dim bg-tertiary-fixed/50 text-tertiary'
                : 'border-secondary-fixed-dim bg-secondary-fixed/30 text-secondary',
          ].join(' ')}
          role="status"
        >
          {status === 'error' || isFallback
            ? <AlertTriangle className="mt-0.5 h-5 w-5" aria-hidden="true" />
            : <CheckCircle2 className="mt-0.5 h-5 w-5" aria-hidden="true" />}
          <p>{feedback}</p>
        </div>
      )}

      {status === 'idle' && (
        <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed">
            <BriefcaseBusiness className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-headline-md font-semibold text-on-surface">Prepara tu próxima búsqueda</h2>
          <p className="mx-auto mt-2 max-w-xl text-body-md text-on-surface-variant">
            Usa keywords como React, TypeScript o Full Stack y una ciudad como Bilbao para iniciar la consulta.
          </p>
        </div>
      )}

      {status === 'loading' && (
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-10 text-center shadow-card">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-body-md font-semibold text-on-surface">Buscando ofertas...</p>
        </div>
      )}

      {(status === 'success' || status === 'empty') && (
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Resultados</h2>
              <p className="mt-1 text-label-md text-on-surface-variant">
                Fuente: {source === 'jooble' ? 'Jooble' : 'mock/fallback'}.
              </p>
            </div>
            <span className="w-fit rounded-full bg-surface-container-high px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
              {results.length} ofertas
            </span>
          </div>
          <JobResultsList results={results} source={source} />
        </section>
      )}
    </div>
  )
}
