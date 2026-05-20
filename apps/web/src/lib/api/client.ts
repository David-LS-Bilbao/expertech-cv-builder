import type { PortfolioCV } from '../domain/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'
const TOKEN_KEY = 'expertech-auth-token'

export interface PublicUser {
  id: string
  displayName: string
  email: string
  provider: string
  createdAt: string
}

export interface AuthSession {
  token: string
  userId: string
  loggedAt: string
}

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

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, init: RequestInit = {}, useAuth = false): Promise<T> {
  const token = useAuth ? getToken() : null
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })

  if (response.status === 401 && useAuth) {
    setToken(null)
  }

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

  auth: {
    register(displayName: string, email: string, password: string): Promise<{ user: PublicUser; session: AuthSession }> {
      return request('/auth/register', { method: 'POST', body: JSON.stringify({ displayName, email, password }) })
    },
    login(email: string, password: string): Promise<{ user: PublicUser; session: AuthSession }> {
      return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    },
    logout(): Promise<{ ok: true }> {
      return request('/auth/logout', { method: 'POST' }, true)
    },
  },

  users: {
    me(): Promise<{ user: PublicUser }> {
      return request('/users/me', {}, true)
    },
  },

  cvs: {
    me(): Promise<{ cv: PortfolioCV }> {
      return request('/cvs/me', {}, true)
    },
    save(cv: PortfolioCV): Promise<{ cv: PortfolioCV }> {
      return request('/cvs/me', { method: 'PUT', body: JSON.stringify(cv) }, true)
    },
  },
}
