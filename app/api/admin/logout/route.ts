import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-logout', { limit: 10, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  await destroySession()
  return NextResponse.json({ ok: true })
}
