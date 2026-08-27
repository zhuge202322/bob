import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'

const statuses = new Set(['NEW', 'IN_REVIEW', 'QUOTED', 'WON', 'LOST', 'SPAM', 'ARCHIVED'])
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(); if (!can(user.role, 'rfq:read')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const status = new URL(request.url).searchParams.get('status') || ''
    const where = status === 'ARCHIVED' ? { archivedAt: { not: null } } : { archivedAt: null, ...(status && statuses.has(status) ? { status } : {}) }
    return NextResponse.json(await prisma.rfq.findMany({ where, include: { attachments: true, internalNotes: { include: { author: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } }))
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}
export async function PATCH(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-rfq-write', { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  try {
    const user = await requireUser(); if (!can(user.role, 'rfq:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const body = await request.json(); const id = Number(body.id); if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid RFQ id' }, { status: 400 })
    const status = body.status === undefined ? undefined : String(body.status); if (status !== undefined && !statuses.has(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    const note = typeof body.internalNote === 'string' ? body.internalNote.trim() : ''
    if (body.internalNote !== undefined && (note.length < 1 || note.length > 5000)) return NextResponse.json({ error: 'Internal note must be 1-5000 characters' }, { status: 400 })
    if (status !== undefined || body.archived !== undefined) await prisma.rfq.update({ where: { id }, data: { ...(status ? { status } : {}), ...(body.archived === true ? { archivedAt: new Date() } : body.archived === false ? { archivedAt: null } : {}) } })
    if (note) await prisma.rfqNote.create({ data: { rfqId: id, authorId: user.id, body: note } })
    const updated = await prisma.rfq.findUnique({ where: { id }, include: { attachments: true, internalNotes: { include: { author: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } } } })
    await prisma.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entityType: 'rfq', entityId: String(id), summary: `${status ? `RFQ status changed to ${status}` : 'RFQ note added'}` } })
    return NextResponse.json(updated)
  } catch { return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 }) }
}
