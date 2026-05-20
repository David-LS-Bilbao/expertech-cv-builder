export interface LocalUser {
  id: string
  displayName: string
  email: string
  password: string
  provider: string
  createdAt: string
}

export interface Session {
  userId: string
  displayName: string
  email: string
  provider: string
  loggedAt: string
}

export type AuthResult =
  | { ok: true; user: LocalUser; session: Session }
  | { ok: false; error: string }

export type RegisterResult =
  | { ok: true; user: LocalUser; session: Session; users: LocalUser[] }
  | { ok: false; error: string }
