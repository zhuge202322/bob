import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/slug'

describe('slugify', () => {
  it('creates stable catalogue paths', () => {
    expect(slugify('Protein & Biochemistry')).toBe('protein-biochemistry')
    expect(slugify('PCR / qPCR Reagents')).toBe('pcr-qpcr-reagents')
  })
})
