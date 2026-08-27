import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/session'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-login', { limit: 10, windowMs: 15 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many login attempts' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  await createSession(user.id)
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } })
}
