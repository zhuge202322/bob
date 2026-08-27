'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe2, Menu, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { localizePath, type Locale } from '@/lib/i18n'
import { publicNavigation } from '@/lib/stitch-ui'

type SocialItem = { platform: string; url: string }

export default function SiteHeader({
  locale,
  siteName = 'Zehongyan Biotech',
  logoUrl = '/manuals/company-logo.jpg',
  socials = []
}: {
  locale: Locale
  siteName?: string
  logoUrl?: string
  socials?: SocialItem[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const whatsapp = socials.find((item) => item.platform.toLowerCase() === 'whatsapp')?.url || 'https://wa.me/861857548378'
  const vk = socials.find((item) => item.platform.toLowerCase() === 'vk')?.url || 'https://vk.com/'
  const quote = locale === 'zh' ? '提交询盘' : locale === 'ru' ? 'Запросить' : 'Request a quote'
  const contact = locale === 'zh' ? '即时咨询' : locale === 'ru' ? 'Связаться' : 'Contact us'

  return <header className="stitch-header site-header">
    <Link className="stitch-brand brand" href={`/${locale}`} aria-label={`${siteName} home`}>
      <Image src={logoUrl} alt="" className="brand-image" width={44} height={44}/>
      <span>{siteName}</span>
    </Link>

    <nav className={open ? 'stitch-nav main-nav open' : 'stitch-nav main-nav'} aria-label="Primary navigation">
      {publicNavigation.map((item) => {
        const href = `/${locale}${item.href}`
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return <Link key={item.href} className={active ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{item.label[locale]}</Link>
      })}
      <div className="stitch-mobile-actions">
        <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>
        <a href={vk} target="_blank" rel="noreferrer">VK</a>
        <Link className="button primary" href={`/${locale}/rfq`} onClick={() => setOpen(false)}>{quote}</Link>
      </div>
    </nav>

    <div className="stitch-header-actions header-actions">
      <div className="stitch-language locale"><Globe2 size={15}/>{(['en', 'zh', 'ru'] as Locale[]).map((item) => <a className={item === locale ? 'active' : ''} key={item} href={localizePath(pathname, item)}>{item === 'en' ? 'EN' : item === 'zh' ? '中文' : 'Рус'}</a>)}</div>
      <a className="stitch-contact-link" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15}/>{contact}</a>
      <Link className="button primary stitch-quote-button" href={`/${locale}/rfq`}>{quote}</Link>
    </div>

    <button className="stitch-menu-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
  </header>
}
