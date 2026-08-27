import { describe, expect, it, beforeEach } from 'vitest'
import { assertSameOrigin, consumeRateLimit, resetRateLimits } from '@/lib/security'
import { stripContentReadOnlyFields, validateContentPayload } from '@/lib/admin/validation'

describe('request security helpers', () => {
  beforeEach(() => resetRateLimits())

  it('accepts same-origin requests and rejects a foreign origin', () => {
    const same = new Request('https://example.test/api/action', {
      method: 'POST',
      headers: { origin: 'https://example.test' }
    })
    const foreign = new Request('https://example.test/api/action', {
      method: 'POST',
      headers: { origin: 'https://evil.test' }
    })
    expect(assertSameOrigin(same)).toBe(true)
    expect(assertSameOrigin(foreign)).toBe(false)
  })

  it('allows a small burst then blocks until the window expires', () => {
    const request = new Request('https://example.test/api/action', {
      headers: { 'x-forwarded-for': '203.0.113.10' }
    })
    expect(consumeRateLimit(request, 'login', { limit: 2, windowMs: 1000, now: 100 })).toMatchObject({ allowed: true })
    expect(consumeRateLimit(request, 'login', { limit: 2, windowMs: 1000, now: 200 })).toMatchObject({ allowed: true })
    expect(consumeRateLimit(request, 'login', { limit: 2, windowMs: 1000, now: 300 })).toMatchObject({ allowed: false })
    expect(consumeRateLimit(request, 'login', { limit: 2, windowMs: 1000, now: 1201 })).toMatchObject({ allowed: true })
  })

  it('rejects unknown admin content fields and invalid collection names', () => {
    expect(validateContentPayload('contacts', { type: 'Email', label: 'Sales', value: 'sales@example.test', href: '', enabled: true, sortOrder: 0 }).success).toBe(true)
    expect(validateContentPayload('contacts', { type: 'Email', label: 'Sales', value: 'sales@example.test', passwordHash: 'oops' }).success).toBe(false)
    expect(validateContentPayload('users', { email: 'admin@example.test' }).success).toBe(false)
    const echoed = stripContentReadOnlyFields({ name: 'Sales', updatedAt: '2026-01-01T00:00:00.000Z', passwordHash: 'oops' })
    expect(echoed).toEqual({ name: 'Sales', passwordHash: 'oops' })
  })

  it('allowlists hero slide fields for CMS writes', () => {
    const result = validateContentPayload('heroSlides', {
      title: 'Research supply, simplified', imageUrl: '/hero.jpg', ctaHref: '/en/rfq', enabled: true, sortOrder: 0
    })
    expect(result.success).toBe(true)
  })
})
