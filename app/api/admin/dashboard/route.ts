import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'

export async function GET() {
  let user
  try { user = await requireUser() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const [categories, products, articles, openRfqs, recentRfqs] = await Promise.all([
    prisma.productCategory.count(),
    prisma.product.count(),
    prisma.article.count(),
    can(user.role, 'rfq:read') ? prisma.rfq.count({ where: { status: { in: ['NEW', 'IN_REVIEW'] } } }) : Promise.resolve(0),
    can(user.role, 'rfq:read') ? prisma.rfq.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, reference: true, company: true, status: true, createdAt: true } }) : Promise.resolve([])
  ])
  return NextResponse.json({ user, counts: { categories, products, articles, openRfqs }, recentRfqs })
}
