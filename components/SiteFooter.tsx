import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { publicNavigation } from '@/lib/stitch-ui'
import { telegramChannel } from '@/lib/contact-channels'

type ContactItem = { type?: string; label: string; value: string; href: string }
type SocialItem = { platform: string; url: string }

export default function SiteFooter({
  locale,
  siteName = 'Zehongyan Biotech',
  logoUrl = '/manuals/company-logo.jpg',
  contacts = [],
  socials = []
}: {
  locale: Locale
  siteName?: string
  logoUrl?: string
  contacts?: ContactItem[]
  socials?: SocialItem[]
}) {
  const whatsapp = socials.find((item) => item.platform.toLowerCase() === 'whatsapp')?.url || 'https://wa.me/861857548378'
  const vk = socials.find((item) => item.platform.toLowerCase() === 'vk')?.url || 'https://vk.com/'
  const telegram = socials.find((item) => item.platform.toLowerCase() === 'telegram')?.url || telegramChannel.url
  const email = contacts.find((item) => item.type?.toLowerCase() === 'email')
  const phones = contacts.filter((item) => item.type?.toLowerCase() === 'phone')
  const labels = locale === 'zh'
    ? { line: '科研试剂、实验室耗材与跨境供应服务。', catalogue: '目录', company: '企业', legal: '网站信息仅供科研采购参考，实际供应规格、文件、货期与商务条款以最终确认为准。', quote: '提交询盘' }
    : locale === 'ru'
      ? { line: 'Реагенты, лабораторные расходные материалы и международные поставки.', catalogue: 'Каталог', company: 'Компания', legal: 'Информация предназначена для исследовательских закупок. Спецификации, документы, сроки и условия подтверждаются отдельно.', quote: 'Запросить' }
      : { line: 'Research reagents, laboratory consumables and cross-border supply support.', catalogue: 'Catalogue', company: 'Company', legal: 'Information is for research procurement. Specifications, documents, lead times and commercial terms are confirmed per request.', quote: 'Request a quote' }

  return <>
    <footer className="stitch-footer site-footer">
      <div className="stitch-footer-brand">
        <Link className="stitch-brand" href={`/${locale}`}><Image src={logoUrl} alt="" width={34} height={34}/><span>{siteName}</span></Link>
        <p>{labels.line}</p>
      </div>
      <div><p className="footer-label">{labels.catalogue}</p>{publicNavigation.slice(0, 3).map((item) => <Link key={item.href} href={`/${locale}${item.href}`}>{item.label[locale]}</Link>)}</div>
      <div><p className="footer-label">{labels.company}</p>{publicNavigation.slice(3).map((item) => <Link key={item.href} href={`/${locale}${item.href}`}>{item.label[locale]}</Link>)}</div>
      <div className="stitch-footer-contact"><p className="footer-label">CONTACT</p>{email ? <a href={email.href}>{email.value}</a> : <a href="mailto:zehongyan2025@outlook.com">zehongyan2025@outlook.com</a>}{phones.map((phone) => <a key={`${phone.label}-${phone.value}`} href={phone.href}>{phone.value}</a>)}<a href={whatsapp}>WhatsApp</a><a href={vk}>VK</a><a href={telegram} target="_blank" rel="noreferrer">Telegram {telegramChannel.handle}</a><a className="stitch-footer-telegram" href={telegram} target="_blank" rel="noreferrer"><Image src={telegramChannel.qrImage} alt={`Telegram QR code for ${telegramChannel.handle}`} width={96} height={116}/></a></div>
      <div className="stitch-footer-legal"><span>{labels.legal}</span><span>© 2026 {siteName}</span></div>
    </footer>
    <nav className="stitch-mobile-contact" aria-label="Quick contact">
      <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15}/>WhatsApp</a>
      <a href={vk} target="_blank" rel="noreferrer">VK</a>
      <a href={telegram} target="_blank" rel="noreferrer">Telegram</a>
      <Link href={`/${locale}/rfq`}>{labels.quote}</Link>
    </nav>
  </>
}
