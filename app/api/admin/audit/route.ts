import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'

export async function GET(request: NextRequest) {
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!can(user.role, 'users:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)
  const pageSize = Math.min(100, Math.max(10, Number(request.nextUrl.searchParams.get('pageSize')) || 30))
  const action = request.nextUrl.searchParams.get('action')?.trim()
  const entityType = request.nextUrl.searchParams.get('entityType')?.trim()
  const where = { ...(action ? { action } : {}), ...(entityType ? { entityType } : {}) }
  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, email: true, name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.auditLog.count({ where })
  ])
  return NextResponse.json({ items, page, pageSize, total, pages: Math.max(1, Math.ceil(total / pageSize)) })
}
