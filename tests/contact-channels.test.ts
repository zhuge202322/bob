import { describe, expect, it } from 'vitest'
import { additionalPhone, telegramChannel } from '@/lib/contact-channels'
import { validateContentPayload } from '@/lib/admin/validation'

describe('public contact channels', () => {
  it('keeps the requested phone in international and callable formats', () => {
    expect(additionalPhone.value).toBe('+86 19372084145')
    expect(additionalPhone.href).toBe('tel:+8619372084145')
  })

  it('uses the supplied Telegram account and public QR asset', () => {
    expect(telegramChannel.handle).toBe('@BOBRICARDO001')
    expect(telegramChannel.url).toBe('https://t.me/BOBRICARDO001')
    expect(telegramChannel.qrImage).toBe('/contact/telegram-bobricardo001.png')
  })

  it('builds three managed customer-service cards in the requested order', async () => {
    const channels = await import('@/lib/contact-channels') as Record<string, unknown>
    expect(typeof channels.buildCustomerServiceCards).toBe('function')
    if (typeof channels.buildCustomerServiceCards !== 'function') return

    const buildCustomerServiceCards = channels.buildCustomerServiceCards as (items: Array<Record<string, unknown>>) => Array<Record<string, unknown>>
    const cards = buildCustomerServiceCards([
      { platform: 'WhatsApp', url: 'https://wa.me/100', displayValue: '+1 00', imageUrl: '/uploads/whatsapp.png' },
      { platform: 'VK', url: 'https://vk.com/example', displayValue: '@example', imageUrl: '' },
      { platform: 'Telegram', url: 'https://t.me/example', displayValue: '@example', imageUrl: '/uploads/telegram.png' }
    ])

    expect(cards.map((card) => card.platform)).toEqual(['WhatsApp', 'VK', 'Telegram'])
    expect(cards.map((card) => card.displayValue)).toEqual(['+1 00', '@example', '@example'])
    expect(cards.map((card) => card.imageUrl)).toEqual(['/uploads/whatsapp.png', '', '/uploads/telegram.png'])
  })

  it('accepts a managed contact value and QR image for social links', () => {
    const result = validateContentPayload('socials', {
      platform: 'WhatsApp',
      url: 'https://wa.me/861857548378',
      displayValue: '+86 185 7584 8378',
      imageUrl: '/uploads/whatsapp-qr.png',
      enabled: true,
      sortOrder: 1
    })

    expect(result.success).toBe(true)
  })

  it('marks social-link updates as public content that requires revalidation', async () => {
    const validation = await import('@/lib/admin/validation') as Record<string, unknown>
    expect(typeof validation.requiresPublicRevalidation).toBe('function')
    if (typeof validation.requiresPublicRevalidation !== 'function') return
    expect(validation.requiresPublicRevalidation('socials')).toBe(true)
  })
})
