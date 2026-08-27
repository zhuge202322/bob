import { describe, expect, it } from 'vitest'
import { additionalPhone, telegramChannel } from '@/lib/contact-channels'

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
})
