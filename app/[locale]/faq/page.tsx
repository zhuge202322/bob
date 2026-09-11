import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  return { title: locale === 'zh' ? '常见问题 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Частые вопросы | ZEHOLYN BIOTECH' : 'FAQ | ZEHOLYN BIOTECH' }
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const [faqs, contacts, socials, settings] = await Promise.all([
    prisma.faq.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 1 } })
  ])
  const t = (en: string, zh: string, ru: string) => locale === 'zh' ? zh : locale === 'ru' ? ru : en

  return <main className="stitch-site stitch-content-page">
    <SiteHeader locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} socials={socials}/>
    <section className="stitch-page-hero stitch-container"><div><span className="stitch-overline">FAQ</span><h1>{t('Answers about sourcing, documents and delivery.', '关于寻源、文件和交付的常见问题。', 'Ответы по поиску, документам и доставке.')}</h1><p>{t('Learn how to submit an item, confirm available files, select a temperature lane and manage a multi-brand request.', '了解如何提交型号、确认可提供文件、选择温区以及处理多品牌采购。', 'Как отправить позицию, подтвердить доступные документы, выбрать температуру и вести мультибрендовый заказ.')}</p></div><div><Image src="/products/microscopy.jpg" alt="" fill priority sizes="(max-width: 900px) 100vw, 48vw"/></div></section>
    <section className="faq-overlay"><div>{faqs.map((item) => <details key={item.id}><summary>{locale === 'zh' ? item.questionZh || item.question : locale === 'ru' ? item.questionRu || item.question : item.question}</summary><p>{locale === 'zh' ? item.answerZh || item.answer : locale === 'ru' ? item.answerRu || item.answer : item.answer}</p></details>)}</div></section>
    <section className="stitch-global-cta"><div><span className="stitch-overline">{t('Still have a question?', '仍有问题？', 'Остались вопросы?')}</span><h2>{t('Send the exact product or purchase list to the sourcing desk.', '把具体产品或采购清单发给寻源团队。', 'Отправьте конкретный продукт или список закупки.')}</h2></div><Link className="button secondary light" href={`/${locale}/rfq`}>{t('Request a quote', '提交询盘', 'Запросить предложение')}<ArrowRight size={16}/></Link></section>
    <SiteFooter locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} contacts={contacts} socials={socials}/>
  </main>
}
