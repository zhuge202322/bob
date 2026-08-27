import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(160),
  siteNameZh: z.string().trim().max(160),
  siteNameRu: z.string().trim().max(160),
  logoUrl: z.string().trim().max(500),
  faviconUrl: z.string().trim().max(500),
  defaultLocale: z.enum(['en', 'zh', 'ru'])
}).strict().partial()

export async function GET() {
  try { const user = await requireUser(); if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 }) } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  return NextResponse.json(await prisma.siteSetting.upsert({ where:{id:1}, update:{}, create:{id:1} }))
}
export async function PATCH(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-settings-write', { limit: 20, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = settingsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid settings payload', issues: parsed.error.flatten() }, { status: 400 })
  const data = parsed.data
  const item = await prisma.siteSetting.upsert({ where:{id:1}, update:data, create:{id:1,...data} })
  await prisma.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entityType: 'settings', entityId: '1', summary: 'Updated site settings' } })
  revalidatePath('/', 'layout')
  return NextResponse.json(item)
}
