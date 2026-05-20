import { PrismaClient } from '@prisma/client'

// Singleton del cliente Prisma. Una sola instancia por proceso.
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
})
