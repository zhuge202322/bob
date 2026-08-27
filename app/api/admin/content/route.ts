import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
import { isContentCollection, requiresPublicRevalidation, stripContentReadOnlyFields, validateContentPayload } from '@/lib/admin/validation'
import { revalidatePath } from 'next/cache'

const models = {
  categories: prisma.productCategory,
  products: prisma.product,
  contacts: prisma.contact,
  socials: prisma.socialLink,
  sections: prisma.pageSection,
  heroSlides: prisma.heroSlide,
  articles: prisma.article,
  faqs: prisma.faq
} as const

export async function GET(request: NextRequest) {
  try { await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const collection = request.nextUrl.searchParams.get('collection') as keyof typeof models | null
  if (!collection || !(collection in models)) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  const items = await (models[collection] as any).findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-content-write', { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!can(user.role, 'content:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json().catch(() => null)
  const collection = body?.collection
  const data = body?.data
  if (!isContentCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  const validation = validateContentPayload(collection, stripContentReadOnlyFields(data))
  if (!validation.success) return NextResponse.json({ error: 'Invalid content payload', issues: validation.error.flatten() }, { status: 400 })
  if ('status' in validation.data && validation.data.status === 'PUBLISHED' && !can(user.role, 'content:publish')) return NextResponse.json({ error: 'Publishing requires administrator permission' }, { status: 403 })
  try {
    const publishMeta = 'status' in validation.data && validation.data.status === 'PUBLISHED' && ['sections', 'heroSlides', 'articles'].includes(collection) ? { publishedAt: new Date() } : {}
    const item = await (models[collection] as any).create({ data: { ...validation.data, ...publishMeta } })
    await prisma.auditLog.create({ data: { userId: user.id, action: 'CREATE', entityType: collection, entityId: String(item.id), summary: `Created ${collection}` } })
    if (requiresPublicRevalidation(collection)) revalidatePath('/', 'layout')
    return NextResponse.json(item, { status: 201 })
  } catch { return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 }) }
}

export async function PATCH(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-content-write', { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!can(user.role, 'content:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json().catch(() => null)
  const collection = body?.collection
  const id = body?.id
  const data = body?.data
  if (!isContentCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  const validation = validateContentPayload(collection, stripContentReadOnlyFields(data), true)
  if (!validation.success) return NextResponse.json({ error: 'Invalid content payload', issues: validation.error.flatten() }, { status: 400 })
  if ('status' in validation.data && validation.data.status === 'PUBLISHED' && !can(user.role, 'content:publish')) return NextResponse.json({ error: 'Publishing requires administrator permission' }, { status: 403 })
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) return NextResponse.json({ error: 'Invalid record id' }, { status: 400 })
  try {
    const publishMeta = 'status' in validation.data && validation.data.status === 'PUBLISHED' && ['sections', 'heroSlides', 'articles'].includes(collection) ? { publishedAt: new Date() } : {}
    const item = await (models[collection] as any).update({ where: { id: Number(id) }, data: { ...validation.data, ...publishMeta } })
    await prisma.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entityType: collection, entityId: String(id), summary: `Updated ${collection}` } })
    if (requiresPublicRevalidation(collection)) revalidatePath('/', 'layout')
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 }) }
}

export async function DELETE(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-content-write', { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!can(user.role, 'content:write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json().catch(() => null)
  const collection = body?.collection
  const id = body?.id
  if (!isContentCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) return NextResponse.json({ error: 'Invalid record id' }, { status: 400 })
  if (collection === 'categories') {
    const count = await prisma.product.count({ where: { categoryId: Number(id) } })
    if (count > 0) return NextResponse.json({ error: 'Move products before deleting this category' }, { status: 409 })
  }
  try {
    await (models[collection] as any).delete({ where: { id: Number(id) } })
    await prisma.auditLog.create({ data: { userId: user.id, action: 'DELETE', entityType: collection, entityId: String(id), summary: `Deleted ${collection}` } })
    if (requiresPublicRevalidation(collection)) revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unable to delete record' }, { status: 409 }) }
}
