import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw)
  const title = locale === 'zh' ? '资源中心 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Ресурсный центр | ZEHOLYN BIOTECH' : 'Resource centre | ZEHOLYN BIOTECH'
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''); return { title, alternates: { canonical: base + '/' + locale + '/resources', languages: { en: base + '/en/resources', 'zh-CN': base + '/zh/resources', 'ru-RU': base + '/ru/resources', 'x-default': base + '/en/resources' } } }
}
export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="resources" /> }
