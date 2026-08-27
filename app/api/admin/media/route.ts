import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { savePublicImage } from '@/lib/media/storage'
import { validateUploadContent } from '@/lib/media/validation'
import { prisma } from '@/lib/prisma'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-media-write', { limit: 20, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  try { const user = await requireUser(); if (!can(user.role, 'content:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); const form = await request.formData(); const file = form.get('file'); if (!(file instanceof File)) return NextResponse.json({ error: 'Image is required' }, { status: 400 }); const validation = await validateUploadContent(file, 'image'); if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 }); const asset = await savePublicImage(file, { en: String(form.get('altEn') || '') }); await prisma.auditLog.create({ data: { userId: user.id, action: 'UPLOAD', entityType: 'media', entityId: String(asset.id), summary: `Uploaded ${asset.originalName}` } }); return NextResponse.json(asset, { status: 201 }) } catch { return NextResponse.json({ error: 'Unable to upload image' }, { status: 400 }) }
}
