import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth/session'
import { can } from '@/lib/auth/policy'
import { resolveStorageKey } from '@/lib/media/storage'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); if (!can(user.role, 'rfq:read')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params; const attachment = await prisma.rfqAttachment.findUnique({ where: { id: Number(id) } })
    if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const bytes = await readFile(resolveStorageKey(attachment.storageKey))
    const filename = attachment.originalName.replace(/["\r\n]/g, '_')
    return new NextResponse(bytes, { headers: { 'content-type': attachment.mimeType, 'content-disposition': `attachment; filename="${filename}"`, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' } })
  } catch { return NextResponse.json({ error: 'Unauthorized or missing attachment' }, { status: 401 }) }
}
