import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
import { csvCell } from '@/lib/rfq/csv'
export async function GET(request: Request) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-rfq-export', { limit: 20, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  try { const user = await requireUser(); if (!can(user.role, 'rfq:export')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); const rows = await prisma.rfq.findMany({ orderBy: { createdAt: 'desc' } }); const header = ['Reference', 'Created', 'Status', 'Company', 'Contact', 'Email', 'Country', 'City', 'Brand', 'CAT No.', 'Description', 'Quantity', 'Temperature']; const body = rows.map((r) => [r.reference, r.createdAt.toISOString(), r.status, r.company, r.contactName, r.email, r.country, r.city, r.brand, r.catNo, r.description, r.quantity, r.temperature].map(csvCell).join(',')).join('\r\n'); return new NextResponse(`\uFEFF${header.map(csvCell).join(',')}\r\n${body}`, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="hocore-rfq-export.csv"' } }) } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}
