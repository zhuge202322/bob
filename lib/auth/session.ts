import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { isSessionExpired, type Role } from './policy'

const cookieName = () => process.env.SESSION_COOKIE_NAME || 'hocore_session'
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex')
  const hours = Number(process.env.SESSION_TTL_HOURS || 12)
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000)
  await prisma.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } })
  const store = await cookies()
  store.set(cookieName(), token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', expires: expiresAt, path: '/' })
  return expiresAt
}

export async function destroySession() {
  const store = await cookies()
  const token = store.get(cookieName())?.value
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } })
  store.delete(cookieName())
}

export async function getCurrentUser() {
  const token = (await cookies()).get(cookieName())?.value
  if (!token) return null
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
  if (!session || isSessionExpired(session.expiresAt) || !session.user.active) return null
  return { id: session.user.id, email: session.user.email, name: session.user.name, role: session.user.role as Role }
}

export async function requireUser(allowed?: Role[]) {
  const user = await getCurrentUser()
  if (!user || (allowed && !allowed.includes(user.role))) throw new Error('UNAUTHORIZED')
  return user
}
