// Proxy de Jooble. Mantiene el contrato estable del legacy
// (server/server.js): { results, fallbackWarning, source }.

import type { JobOffer, JobsSearchResponse } from '../types.js'

const JOOBLE_ENDPOINT = 'https://es.jooble.org/api'

const MOCK_RESULTS: JobOffer[] = [
  {
    id: 'mock-1',
    title: 'Frontend Developer (React + TypeScript)',
    company: 'Empresa Demo',
    location: 'Remoto',
    url: 'https://example.com/jobs/mock-1',
    snippet: 'Oferta de demo. Se devuelve cuando la API de Jooble no está disponible.',
    updated: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Junior Web Developer',
    company: 'Empresa Demo',
    location: 'Bilbao, España',
    url: 'https://example.com/jobs/mock-2',
    snippet: 'Otra oferta de demo para mantener UX cuando el proxy falla.',
    updated: new Date().toISOString(),
  },
]

function mockResponse(reason: string): JobsSearchResponse {
  return {
    results: MOCK_RESULTS,
    fallbackWarning: reason,
    source: 'mock',
  }
}

interface JoobleApiJob {
  id?: string | number
  title?: string
  company?: string
  location?: string
  link?: string
  snippet?: string
  updated?: string
}

interface JoobleApiResponse {
  jobs?: JoobleApiJob[]
}

function mapJoobleJobs(jobs: JoobleApiJob[]): JobOffer[] {
  return jobs.map((job, index) => ({
    id: String(job.id ?? `jooble-${index}`),
    title: String(job.title ?? ''),
    company: String(job.company ?? ''),
    location: String(job.location ?? ''),
    url: String(job.link ?? ''),
    snippet: String(job.snippet ?? ''),
    updated: String(job.updated ?? ''),
  }))
}

export async function searchJobs(keywords: string, location: string): Promise<JobsSearchResponse> {
  const apiKey = process.env.JOOBLE_API_KEY?.trim()

  if (!apiKey || apiKey === 'YOUR_REAL_KEY_HERE') {
    return mockResponse('JOOBLE_API_KEY no configurada en el backend. Resultados de demo.')
  }

  try {
    const response = await fetch(`${JOOBLE_ENDPOINT}/${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, location }),
    })

    if (!response.ok) {
      return mockResponse(`Jooble respondió ${response.status}. Resultados de demo.`)
    }

    const data = (await response.json()) as JoobleApiResponse
    const jobs = Array.isArray(data.jobs) ? data.jobs : []
    return { results: mapJoobleJobs(jobs), fallbackWarning: null, source: 'jooble' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error desconocido'
    return mockResponse(`Fallo al contactar con Jooble (${message}). Resultados de demo.`)
  }
}
