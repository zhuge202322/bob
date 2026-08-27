import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
import { createUserSchema, publicUserSelect, updateUserSchema } from '@/lib/admin/users'

async function requireAdministrator() {
  const user = await requireUser()
  if (!can(user.role, 'users:manage')) throw new Error('FORBIDDEN')
  return user
}

function authError(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error && error.message === 'FORBIDDEN' ? 'Forbidden' : 'Unauthorized' },
    { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 401 }
  )
}

export async function GET() {
  try { await requireAdministrator() } catch (error) { return authError(error) }
  const users = await prisma.user.findMany({ select: publicUserSelect, orderBy: [{ active: 'desc' }, { createdAt: 'asc' }] })
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-users-write', { limit: 20, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let administrator
  try { administrator = await requireAdministrator() } catch (error) { return authError(error) }
  const parsed = createUserSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid user payload', issues: parsed.error.flatten() }, { status: 400 })

  try {
    const { password, ...userFields } = parsed.data
    const user = await prisma.user.create({
      data: { ...userFields, passwordHash: await bcrypt.hash(password, 12) },
      select: publicUserSelect
    })
    await prisma.auditLog.create({ data: { userId: administrator.id, action: 'CREATE', entityType: 'users', entityId: String(user.id), summary: `Created user ${user.email}` } })
    return NextResponse.json(user, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'admin-users-write', { limit: 20, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  let administrator
  try { administrator = await requireAdministrator() } catch (error) { return authError(error) }
  const parsed = updateUserSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid user payload', issues: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { id: parsed.data.id } })
  if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const removesAdminAccess = existing.role === 'ADMIN' && (parsed.data.active === false || (parsed.data.role && parsed.data.role !== 'ADMIN'))
  if (removesAdminAccess) {
    const activeAdmins = await prisma.user.count({ where: { role: 'ADMIN', active: true } })
    if (activeAdmins <= 1) return NextResponse.json({ error: 'The last active administrator cannot be disabled or demoted' }, { status: 409 })
  }

  const { id, password, ...fields } = parsed.data
  try {
    const user = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: { ...fields, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
        select: publicUserSelect
      })
      if (parsed.data.active === false || password) await tx.session.deleteMany({ where: { userId: id } })
      await tx.auditLog.create({ data: { userId: administrator.id, action: 'UPDATE', entityType: 'users', entityId: String(id), summary: `Updated user ${updated.email}` } })
      return updated
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Unable to update user' }, { status: 409 })
  }
}
