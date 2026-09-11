import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw)
  const title = locale === 'zh' ? '质量与合规 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Качество и соответствие | ZEHOLYN BIOTECH' : 'Quality & compliance | ZEHOLYN BIOTECH'
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''); return { title, alternates: { canonical: base + '/' + locale + '/quality', languages: { en: base + '/en/quality', 'zh-CN': base + '/zh/quality', 'ru-RU': base + '/ru/quality', 'x-default': base + '/en/quality' } } }
}
export default async function QualityPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="quality" /> }
