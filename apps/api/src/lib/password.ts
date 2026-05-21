import bcrypt from 'bcryptjs'

// Default 10 rounds (safe for most environments). Set BCRYPT_ROUNDS=12
// or higher in production for stronger hashing at the cost of login speed.
const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10)

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS)
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
