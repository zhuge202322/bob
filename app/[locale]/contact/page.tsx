import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw)
  const title = locale === 'zh' ? '联系采购团队 | Zehongyan Biotech' : locale === 'ru' ? 'Связаться с нами | Zehongyan Biotech' : 'Contact the sourcing desk | Zehongyan Biotech'
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''); return { title, alternates: { canonical: base + '/' + locale + '/contact', languages: { en: base + '/en/contact', 'zh-CN': base + '/zh/contact', 'ru-RU': base + '/ru/contact', 'x-default': base + '/en/contact' } } }
}
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="contact" /> }
