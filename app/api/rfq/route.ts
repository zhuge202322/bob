import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { prisma } from '@/lib/prisma'
import { rfqSchema } from '@/lib/rfq/validation'
import { resolveStorageKey, savePrivateFile } from '@/lib/media/storage'
import { validateUploadContent } from '@/lib/media/validation'
import { assertSameOrigin, consumeRateLimit } from '@/lib/security'
import { processRfqNotification } from '@/lib/rfq/notify'

function makeReference() { return `RFQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.floor(1000 + Math.random() * 9000)}` }

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  const limit = consumeRateLimit(request, 'rfq-submit', { limit: 8, windowMs: 10 * 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } })
  const contentType = request.headers.get('content-type') || ''
  let raw: Record<string, unknown>; let attachment: File | null = null
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData(); raw = Object.fromEntries(form.entries()); const value = form.get('attachment'); attachment = value instanceof File && value.size > 0 ? value : null
    raw.consent = raw.consent === 'true' || raw.consent === 'on'
  } else raw = await request.json().catch(() => ({}))
  const parsed = rfqSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: 'Please complete the required fields', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  if (attachment) { const validation = await validateUploadContent(attachment, 'rfq'); if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 }) }
  const idempotencyKey = request.headers.get('idempotency-key') || (typeof raw.idempotencyKey === 'string' ? raw.idempotencyKey : randomUUID())
  const existing = await prisma.rfq.findFirst({ where: { idempotencyKey } }); if (existing) return NextResponse.json(existing, { status: 200 })
  const input = parsed.data
  const created = await prisma.rfq.create({ data: { reference: makeReference(), idempotencyKey, customerType: input.customerType, company: input.company, contactName: input.contactName, email: input.email, messenger: input.messenger, country: input.country, city: input.city, brand: input.brand, catNo: input.catNo, brandCatNo: input.catNo || input.brand, description: input.productDescription, quantity: input.quantity, temperature: input.temperature, desiredDeliveryDate: input.desiredDeliveryDate ? new Date(input.desiredDeliveryDate) : null, notes: input.notes, locale: input.locale, sourcePath: input.sourcePath, consentAt: new Date() } })
  if (attachment) {
    let storageKey = ''
    try {
      const saved = await savePrivateFile(attachment)
      storageKey = saved.storageKey
      await prisma.rfqAttachment.create({ data: { rfqId: created.id, storageKey: saved.storageKey, originalName: attachment.name, mimeType: attachment.type, byteSize: attachment.size, sha256: saved.sha256 } })
    } catch (error) {
      if (storageKey) await unlink(resolveStorageKey(storageKey)).catch(() => undefined)
      await prisma.rfq.delete({ where: { id: created.id } }).catch(() => undefined)
      throw error
    }
  }
  await processRfqNotification(created.id)
  return NextResponse.json({ reference: created.reference, id: created.id }, { status: 201 })
}
