import { describe, expect, it } from 'vitest'
import { rfqSchema } from '@/lib/rfq/validation'

describe('RFQ validation', () => {
  it('accepts a complete business request', () => {
    const result = rfqSchema.safeParse({
      customerType: 'END_USER', company: 'Acme Lab', contactName: 'Ada',
      email: 'ada@acme.example', country: 'Russia', city: 'Moscow',
      productDescription: 'PCR master mix, 500 reactions', quantity: '2 kits',
      temperature: '2_8', locale: 'en', consent: true
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email addresses and missing consent', () => {
    const result = rfqSchema.safeParse({ company: 'Acme', email: 'not-an-email', productDescription: 'PCR mix', consent: false })
    expect(result.success).toBe(false)
  })
})
