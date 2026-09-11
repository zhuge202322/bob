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

  it('renders the multilingual legal navigation and research-use disclosure', () => {
    const markup = renderToStaticMarkup(<SiteFooter locale="en" siteName="ZEHOLYN BIOTECH" />)

    expect(markup).toContain('href="/en/privacy"')
    expect(markup).toContain('href="/en/terms"')
    expect(markup).toContain('href="/en/legal"')
    expect(markup).toContain('Research Use Only')
    expect(markup).toContain('independent')
    expect(markup).toContain('ZEHOLYN BIOTECH')
  })
})
