import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { processRfqNotification } from '@/lib/rfq/notify'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!assertSameOrigin(_request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(_request, 'admin-rfq-retry', { limit: 20, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  try {
    const user = await requireUser(); if (!can(user.role, 'rfq:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid RFQ id' }, { status: 400 })
    await prisma.rfq.update({ where: { id }, data: { notificationStatus: 'PENDING' } })
    const updated = await processRfqNotification(id)
    await prisma.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entityType: 'rfq', entityId: String(id), summary: 'RFQ notification retried' } })
    return NextResponse.json(updated)
  } catch { return NextResponse.json({ error: 'Unable to retry notification' }, { status: 400 }) }
}
