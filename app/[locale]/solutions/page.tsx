import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw)
  const title = locale === 'zh' ? '采购服务 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Решения по снабжению | ZEHOLYN BIOTECH' : 'Supply solutions | ZEHOLYN BIOTECH'
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''); return { title, alternates: { canonical: base + '/' + locale + '/solutions', languages: { en: base + '/en/solutions', 'zh-CN': base + '/zh/solutions', 'ru-RU': base + '/ru/solutions', 'x-default': base + '/en/solutions' } } }
}
export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="solutions" /> }
