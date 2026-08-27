import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { prisma } from '@/lib/prisma'
import { resolveStorageKey } from '@/lib/media/storage'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const { key } = await params
    const storageKey = key.join('/')
    if (!storageKey.startsWith('public/')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const asset = await prisma.mediaAsset.findUnique({ where: { storageKey } })
    if (!asset || asset.visibility !== 'PUBLIC') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const bytes = await readFile(resolveStorageKey(storageKey))
    return new NextResponse(bytes, { headers: { 'content-type': asset.mimeType, 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' } })
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) }
}
