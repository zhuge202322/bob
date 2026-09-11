import { notFound } from 'next/navigation'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale: raw } = await params; const locale = parseLocale(raw); return { title: locale === 'zh' ? '隐私政策 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Политика конфиденциальности | ZEHOLYN BIOTECH' : 'Privacy policy | ZEHOLYN BIOTECH' } }
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="privacy" /> }
