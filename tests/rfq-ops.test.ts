import { describe, expect, it } from 'vitest'
import { csvCell } from '@/lib/rfq/csv'
import { buildRfqNotification } from '@/lib/rfq/notify'

describe('RFQ operations', () => {
  it('escapes spreadsheet formula prefixes in CSV cells', () => {
    expect(csvCell('=HYPERLINK("https://evil.example")')).toBe('"\'=HYPERLINK(""https://evil.example"")"')
    expect(csvCell('normal value')).toBe('"normal value"')
  })

  it('builds a notification with the RFQ reference and sourcing details', () => {
    const message = buildRfqNotification({
      reference: 'RFQ-20260826-1234', company: 'Acme Lab', contactName: 'Ada', email: 'ada@acme.example',
      productDescription: 'PCR master mix', quantity: '2 kits', country: 'Russia', city: 'Moscow',
      catNo: 'ABC-123', brand: 'ExampleBio', temperature: '2_8', notes: 'Need COA', sourcePath: '/en/rfq'
    })
    expect(message.subject).toContain('RFQ-20260826-1234')
    expect(message.text).toContain('PCR master mix')
    expect(message.text).toContain('ABC-123')
  })
})
