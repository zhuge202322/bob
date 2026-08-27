import { createHash, randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/lib/prisma'

const root = () => path.resolve(process.env.UPLOAD_ROOT || './storage')

export async function savePublicImage(file: File, alt: { en?: string; zh?: string; ru?: string } = {}) {
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name).toLowerCase() || '.bin'
  const storageKey = `public/${randomUUID()}${ext}`
  const absolute = path.join(root(), storageKey)
  await mkdir(path.dirname(absolute), { recursive: true })
  await writeFile(absolute, bytes, { flag: 'wx' })
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  return prisma.mediaAsset.create({ data: { storageKey, publicUrl: `/api/media/${storageKey}`, originalName: file.name, mimeType: file.type, byteSize: bytes.byteLength, sha256, altEn: alt.en || '', altZh: alt.zh || '', altRu: alt.ru || '' } })
}

export async function savePrivateFile(file: File, folder = 'rfq') {
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name).toLowerCase() || '.bin'
  const storageKey = `private/${folder}/${randomUUID()}${ext}`
  const absolute = path.join(root(), storageKey)
  await mkdir(path.dirname(absolute), { recursive: true })
  await writeFile(absolute, bytes, { flag: 'wx' })
  return { storageKey, bytes, sha256: createHash('sha256').update(bytes).digest('hex') }
}

export function resolveStorageKey(storageKey: string) {
  const base = root()
  const target = path.resolve(base, storageKey)
  if (!target.startsWith(base + path.sep)) throw new Error('Invalid storage key')
  return target
}
