import { describe, expect, it } from 'vitest'
import { validateUpload, validateUploadContent } from '@/lib/media/validation'

describe('upload validation', () => {
  it('accepts approved RFQ file types within the configured limit', () => {
    expect(validateUpload({ name: 'list.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1024 }, 'rfq')).toEqual({ ok: true })
  })

  it('rejects executable or oversized files', () => {
    expect(validateUpload({ name: 'list.exe', type: 'application/octet-stream', size: 1024 }, 'rfq').ok).toBe(false)
    expect(validateUpload({ name: 'photo.jpg', type: 'image/jpeg', size: 25_000_000 }, 'image').ok).toBe(false)
  })

  it('rejects an image whose bytes do not match its declared MIME type', async () => {
    const fake = new File([new TextEncoder().encode('not an image')], 'photo.jpg', { type: 'image/jpeg' })
    const result = await validateUploadContent(fake, 'image')
    expect(result.ok).toBe(false)
  })

  it('accepts a JPEG with a valid signature', async () => {
    const jpeg = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])], 'photo.jpg', { type: 'image/jpeg' })
    const result = await validateUploadContent(jpeg, 'image')
    expect(result).toEqual({ ok: true })
  })
})
