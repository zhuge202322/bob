import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { publicNavigation } from '@/lib/stitch-ui'
import { buildCustomerServiceCards } from '@/lib/contact-channels'

type ContactItem = { type?: string; label: string; value: string; href: string }
type SocialItem = { platform: string; url: string; displayValue?: string; imageUrl?: string }

export default function SiteFooter({
  locale,
  siteName = 'ZEHOLYN BIOTECH',
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
  const customerServiceCards = buildCustomerServiceCards(socials)
  const [whatsappCard, vkCard, telegramCard] = customerServiceCards
  const whatsapp = whatsappCard.url
  const vk = vkCard.url
  const telegram = telegramCard.url
  const email = contacts.find((item) => item.type?.toLowerCase() === 'email')
  const phones = contacts.filter((item) => item.type?.toLowerCase() === 'phone')
  const labels = locale === 'zh'
    ? { line: '科研试剂、实验室耗材与跨境供应服务。', catalogue: '目录', company: '企业', policies: '政策与声明', privacy: '隐私政策', terms: '使用条款', legalPage: '法律声明', legal: '仅供科研使用，不用于人体诊断、治疗或临床用途。第三方品牌名称及商标归各权利人所有；深圳泽鸿衍生生物科技有限公司（ZEHOLYN BIOTECH）为独立采购与供应服务商，与所列品牌不存在代理、授权或合作关系，除非另有书面说明。产品信息、文件、供货条件及进出口合规责任以具体订单、品牌文件和适用法律为准。', quote: '提交询盘' }
    : locale === 'ru'
      ? { line: 'Реагенты, лабораторные расходные материалы и международные поставки.', catalogue: 'Каталог', company: 'Компания', policies: 'Правовая информация', privacy: 'Конфиденциальность', terms: 'Условия использования', legalPage: 'Правовое заявление', legal: 'Только для исследовательского использования; не для диагностики, лечения или клинического применения у человека. Товарные знаки принадлежат их владельцам. 深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) действует как независимый поставщик и не заявляет об агентских, авторизованных или партнёрских отношениях с указанными брендами без отдельного письменного подтверждения. Данные, документы, условия поставки и обязанности по импорту подтверждаются по заказу и применимому праву.', quote: 'Запросить' }
      : { line: 'Research reagents, laboratory consumables and cross-border supply support.', catalogue: 'Catalogue', company: 'Company', policies: 'Policies', privacy: 'Privacy policy', terms: 'Terms of use', legalPage: 'Legal statement', legal: 'Research Use Only. Not for human diagnosis, treatment or clinical use. Third-party names and trademarks belong to their respective owners. 深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) operates as an independent procurement and supply provider and does not claim agency, authorization or partnership with listed brands unless separately confirmed in writing. Product information, documents, supply conditions and import compliance responsibilities are confirmed per order, manufacturer documentation and applicable law.', quote: 'Request a quote' }

  return <>
    <footer className="stitch-footer site-footer">
      <div className="stitch-footer-brand">
        <Link className="stitch-brand" href={`/${locale}`}><Image src={logoUrl} alt="" width={34} height={34}/><span>{siteName}</span></Link>
        <p>{labels.line}</p>
      </div>
      <div><p className="footer-label">{labels.catalogue}</p>{publicNavigation.slice(0, 3).map((item) => <Link key={item.href} href={`/${locale}${item.href}`}>{item.label[locale]}</Link>)}</div>
      <div><p className="footer-label">{labels.company}</p>{publicNavigation.slice(3).map((item) => <Link key={item.href} href={`/${locale}${item.href}`}>{item.label[locale]}</Link>)}</div>
      <div className="stitch-footer-contact"><p className="footer-label">CONTACT</p>{email ? <a href={email.href}>{email.value}</a> : <a href="mailto:zehongyan2025@outlook.com">zehongyan2025@outlook.com</a>}{phones.map((phone) => <a key={`${phone.label}-${phone.value}`} href={phone.href}>{phone.value}</a>)}<a href={whatsapp}>WhatsApp</a><a href={vk}>VK</a><a href={telegram} target="_blank" rel="noreferrer">Telegram {telegramCard.displayValue}</a></div>
      <div className="stitch-footer-policies"><p className="footer-label">{labels.policies}</p><Link href={`/${locale}/privacy`}>{labels.privacy}</Link><Link href={`/${locale}/terms`}>{labels.terms}</Link><Link href={`/${locale}/legal`}>{labels.legalPage}</Link></div>
      <div className="stitch-footer-legal"><p>{labels.legal}</p><span>© 2026 {siteName}</span></div>
    </footer>
    <nav className="stitch-mobile-contact" aria-label="Quick contact">
      <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15}/>WhatsApp</a>
      <a href={vk} target="_blank" rel="noreferrer">VK</a>
      <a href={telegram} target="_blank" rel="noreferrer">Telegram</a>
      <Link href={`/${locale}/rfq`}>{labels.quote}</Link>
    </nav>
  </>
}
