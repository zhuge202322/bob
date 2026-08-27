import { describe, expect, it } from 'vitest'
import { getLocalizedValue, isPublished } from '@/lib/content/public'

describe('public content helpers', () => {
  it('excludes drafts and deleted records from public output', () => {
    expect(isPublished({ status: 'PUBLISHED', deletedAt: null })).toBe(true)
    expect(isPublished({ status: 'DRAFT', deletedAt: null })).toBe(false)
    expect(isPublished({ status: 'PUBLISHED', deletedAt: new Date() })).toBe(false)
  })

  it('does not leak English copy when a translation is missing', () => {
    expect(getLocalizedValue({ en: 'English', zh: '', ru: 'Русский' }, 'zh')).toBe('')
    expect(getLocalizedValue({ en: 'English', zh: '', ru: 'Русский' }, 'ru')).toBe('Русский')
  })
})
