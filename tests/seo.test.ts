import { describe, expect, it } from 'vitest'
import { localeAlternates } from '@/lib/seo'

describe('locale alternates', () => {
  it('returns canonical, three language links and x-default', () => {
    const result = localeAlternates('https://hocore.example', 'ru', '/products')
    expect(result.canonical).toBe('https://hocore.example/ru/products')
    expect(result.languages['zh-CN']).toBe('https://hocore.example/zh/products')
    expect(result.languages['x-default']).toBe('https://hocore.example/en/products')
  })
})
