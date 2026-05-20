import type { AuthResult, LocalUser, RegisterResult, Session } from './types'
import { getSafeStorage } from '../storage/SafeStorageService'

const AUTH_USERS_KEY = 'expertech-auth-users'
const AUTH_SESSION_KEY = 'expertech-auth-session'

function createId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function normalize(value: string): string {
  return value.trim()
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function safeParseJSON<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T } catch { return fallback }
}

function createUserRecord(data: Partial<LocalUser> = {}): LocalUser {
  return {
    id: normalize(data.id ?? createId()),
    displayName: normalize(data.displayName ?? ''),
    email: normalizeEmail(data.email ?? ''),
    password: String(data.password ?? ''),
    provider: normalize(data.provider ?? 'local'),
    createdAt: normalize(data.createdAt ?? new Date().toISOString()),
  }
}

function createSessionRecord(data: Partial<Session> = {}): Session {
  return {
    userId: normalize(data.userId ?? ''),
    displayName: normalize(data.displayName ?? ''),
    email: normalizeEmail(data.email ?? ''),
    provider: normalize(data.provider ?? 'local'),
    loggedAt: normalize(data.loggedAt ?? new Date().toISOString()),
  }
}

export function loadUsers(): LocalUser[] {
  const raw = getSafeStorage().getItem(AUTH_USERS_KEY)
  if (!raw) return []
  const parsed = safeParseJSON<unknown[]>(raw, [])
  if (!Array.isArray(parsed)) return []
  return parsed.map((u) => createUserRecord(u as Partial<LocalUser>))
}

export function saveUsers(users: LocalUser[]): LocalUser[] {
  const normalized = users.map(createUserRecord)
  try {
    getSafeStorage().setItem(AUTH_USERS_KEY, JSON.stringify(normalized))
  } catch (err) {
    console.error('[AuthStorage] Error al guardar usuarios:', (err as Error).message)
  }
  return normalized
}

export function findUserByEmail(email: string): LocalUser | null {
  const normalized = normalizeEmail(email)
  if (!hasText(normalized)) return null
  return loadUsers().find((u) => u.email === normalized) ?? null
}

export function saveSession(data: Partial<Session>): Session {
  const session = createSessionRecord(data)
  try {
    getSafeStorage().setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    console.error('[AuthStorage] Error al guardar sesión:', (err as Error).message)
  }
  return session
}

export function loadSession(): Session | null {
  const raw = getSafeStorage().getItem(AUTH_SESSION_KEY)
  if (!raw) return null
  const parsed = safeParseJSON<Partial<Session> | null>(raw, null)
  if (!parsed || typeof parsed !== 'object') return null
  const session = createSessionRecord(parsed)
  if (!hasText(session.userId) || !hasText(session.email)) return null
  return session
}

export function hasStoredSession(): boolean {
  return loadSession() !== null
}

export function clearSession(): void {
  getSafeStorage().removeItem(AUTH_SESSION_KEY)
}

export function logoutUser(): void {
  clearSession()
}

export function registerUser(displayName: string, email: string, password: string): RegisterResult {
  if (!hasText(normalize(displayName))) return { ok: false, error: 'El nombre visible es obligatorio.' }
  if (!hasText(normalizeEmail(email))) return { ok: false, error: 'El email es obligatorio.' }
  if (!hasText(password)) return { ok: false, error: 'La contraseña es obligatoria.' }
  if (findUserByEmail(email)) return { ok: false, error: 'Ya existe una cuenta con ese email.' }

  const user = createUserRecord({ displayName, email, password, provider: 'local' })
  const users = saveUsers([...loadUsers(), user])
  const session = saveSession({ userId: user.id, displayName: user.displayName, email: user.email, provider: user.provider })
  return { ok: true, user, session, users }
}

export function loginUser(email: string, password: string): AuthResult {
  if (!hasText(normalizeEmail(email))) return { ok: false, error: 'El email es obligatorio.' }
  if (!hasText(password)) return { ok: false, error: 'La contraseña es obligatoria.' }

  const user = findUserByEmail(email)
  if (!user) return { ok: false, error: 'No existe una cuenta con ese email.' }
  if (user.password !== password) return { ok: false, error: 'La contraseña no es correcta.' }

  const session = saveSession({ userId: user.id, displayName: user.displayName, email: user.email, provider: user.provider })
  return { ok: true, user, session }
}
