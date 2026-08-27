type UploadLike = { name: string; type: string; size: number }
type UploadPurpose = 'rfq' | 'image'

const rfqTypes = new Set([
  'application/pdf', 'text/csv', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export function validateUpload(file: UploadLike, purpose: UploadPurpose) {
  const max = purpose === 'rfq' ? Number(process.env.RFQ_MAX_FILE_BYTES ?? 10_485_760) : 12_000_000
  const allowed = purpose === 'rfq' ? rfqTypes : imageTypes
  if (!allowed.has(file.type)) return { ok: false as const, error: 'Unsupported file type' }
  if (file.size <= 0 || file.size > max) return { ok: false as const, error: 'File size is outside the allowed range' }
  return { ok: true as const }
}

export async function validateUploadContent(file: File, purpose: UploadPurpose) {
  const metadata = validateUpload(file, purpose)
  if (!metadata.ok) return metadata
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const startsWith = (...values: number[]) => values.every((value, index) => bytes[index] === value)
  let matches = true
  if (purpose === 'image') {
    matches = file.type === 'image/jpeg' ? startsWith(0xff, 0xd8, 0xff)
      : file.type === 'image/png' ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
        : file.type === 'image/webp' ? startsWith(0x52, 0x49, 0x46, 0x46) && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
          : file.type === 'image/avif' ? String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp' && ['avif', 'avis'].includes(String.fromCharCode(...bytes.slice(8, 12)))
            : false
  } else if (file.type === 'application/pdf') {
    matches = startsWith(0x25, 0x50, 0x44, 0x46)
  } else if (file.type === 'application/vnd.ms-excel') {
    matches = startsWith(0x50, 0x4b, 0x03, 0x04) || startsWith(0xd0, 0xcf, 0x11, 0xe0)
  } else if (file.type.includes('spreadsheet') || file.type.includes('wordprocessing')) {
    matches = startsWith(0x50, 0x4b, 0x03, 0x04)
  }
  return matches ? ({ ok: true } as const) : ({ ok: false as const, error: 'File signature does not match its declared type' })
}
