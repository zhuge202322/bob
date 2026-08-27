import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import SiteFooter from '@/components/SiteFooter'

describe('SiteFooter', () => {
  it('keeps the Telegram contact link without rendering its QR image', () => {
    const markup = renderToStaticMarkup(
      <SiteFooter
        locale="zh"
        socials={[
          {
            platform: 'Telegram',
            url: 'https://t.me/BOBRICARDO001',
            displayValue: '@BOBRICARDO001',
            imageUrl: '/contact/telegram-bobricardo001.png'
          }
        ]}
      />
    )

    expect(markup).toContain('Telegram @BOBRICARDO001')
    expect(markup).toContain('href="https://t.me/BOBRICARDO001"')
    expect(markup).not.toContain('stitch-footer-telegram')
    expect(markup).not.toContain('telegram-bobricardo001.png')
  })
})
