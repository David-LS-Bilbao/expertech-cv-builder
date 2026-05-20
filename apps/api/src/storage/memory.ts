// Storage en memoria para Fase 5. Se sustituye por PostgreSQL + Prisma en Fase 6.
// No persiste entre reinicios del servidor (limitación documentada del MVP).

import type { LocalUser, PortfolioCV, Session } from '../types.js'

const usersByEmail = new Map<string, LocalUser>()
const usersById = new Map<string, LocalUser>()
const sessionsByToken = new Map<string, Session>()
const cvsByUserId = new Map<string, PortfolioCV>()

export const userStore = {
  findByEmail(email: string): LocalUser | undefined {
    return usersByEmail.get(email.trim().toLowerCase())
  },
  findById(id: string): LocalUser | undefined {
    return usersById.get(id)
  },
  create(user: LocalUser): LocalUser {
    usersByEmail.set(user.email, user)
    usersById.set(user.id, user)
    return user
  },
  update(user: LocalUser): LocalUser {
    usersByEmail.set(user.email, user)
    usersById.set(user.id, user)
    return user
  },
  count(): number {
    return usersById.size
  },
}

export const sessionStore = {
  create(session: Session): Session {
    sessionsByToken.set(session.token, session)
    return session
  },
  findByToken(token: string): Session | undefined {
    return sessionsByToken.get(token)
  },
  delete(token: string): void {
    sessionsByToken.delete(token)
  },
}

export const cvStore = {
  get(userId: string): PortfolioCV | undefined {
    return cvsByUserId.get(userId)
  },
  set(userId: string, cv: PortfolioCV): PortfolioCV {
    cvsByUserId.set(userId, cv)
    return cv
  },
  delete(userId: string): void {
    cvsByUserId.delete(userId)
  },
}
