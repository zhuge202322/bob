import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw)
  const title = locale === 'zh' ? '关于 Zehongyan | Zehongyan Biotech' : locale === 'ru' ? 'О Zehongyan | Zehongyan Biotech' : 'About Zehongyan | Zehongyan Biotech'
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, ''); return { title, alternates: { canonical: base + '/' + locale + '/about', languages: { en: base + '/en/about', 'zh-CN': base + '/zh/about', 'ru-RU': base + '/ru/about', 'x-default': base + '/en/about' } } }
}
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="about" /> }
