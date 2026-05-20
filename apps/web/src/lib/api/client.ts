// Cliente HTTP mínimo del backend V2 (apps/api). Lee VITE_API_URL del
// entorno de Vite — nunca se hardcodea la URL.
//
// En Fase 5 solo se usa para health check y demo. El rewire completo de
// auth/CV operations al backend llega en Fase 6 cuando exista DB real.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

export interface HealthResponse {
  status: string
  service: string
  storage: string
  users: number
  uptime: number
  timestamp: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new ApiError(response.status, body.error ?? `HTTP ${response.status}`)
  }

  return (await response.json()) as T
}

export const api = {
  baseUrl: API_URL,
  health(): Promise<HealthResponse> {
    return request<HealthResponse>('/health')
  },
}
