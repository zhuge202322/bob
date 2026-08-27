import { describe, expect, it } from 'vitest'
import { localizePath, parseLocale } from '@/lib/i18n'

describe('locale routing', () => {
  it('uses English as the default root locale', () => {
    expect(parseLocale(undefined)).toBe('en')
    expect(parseLocale('de')).toBe('en')
  })

  it('preserves the current path when switching locale', () => {
    expect(localizePath('/en/products/reagents', 'ru')).toBe('/ru/products/reagents')
    expect(localizePath('/products', 'zh')).toBe('/zh/products')
  })
})
