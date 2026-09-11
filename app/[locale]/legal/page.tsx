import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const title = locale === 'zh' ? '法律声明 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Правовое заявление | ZEHOLYN BIOTECH' : 'Legal statement | ZEHOLYN BIOTECH'
  return { title, alternates: localeAlternates(process.env.APP_URL || 'http://localhost:3000', locale, '/legal') }
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!locales.includes(raw as Locale)) notFound()
  return <ContentPage locale={parseLocale(raw)} kind="legal" />
}
