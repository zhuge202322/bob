import { describe, expect, it } from 'vitest'
import { can, isSessionExpired } from '@/lib/auth/policy'

describe('admin authorization', () => {
  it('limits editors and RFQ operators to their work areas', () => {
    expect(can('EDITOR', 'content:write')).toBe(true)
    expect(can('EDITOR', 'users:manage')).toBe(false)
    expect(can('RFQ_OPERATOR', 'rfq:write')).toBe(true)
    expect(can('RFQ_OPERATOR', 'content:write')).toBe(false)
  })

  it('expires sessions at or before the current time', () => {
    const now = new Date('2026-08-26T10:00:00Z')
    expect(isSessionExpired(new Date('2026-08-26T10:00:00Z'), now)).toBe(true)
    expect(isSessionExpired(new Date('2026-08-26T10:00:01Z'), now)).toBe(false)
  })
})
