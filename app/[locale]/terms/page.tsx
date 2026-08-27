import { notFound } from 'next/navigation'
import ContentPage from '@/components/ContentPage'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale: raw } = await params; const locale = parseLocale(raw); return { title: locale === 'zh' ? '使用条款 | Zehongyan Biotech' : locale === 'ru' ? 'Условия использования | Zehongyan Biotech' : 'Terms of use | Zehongyan Biotech' } }
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); return <ContentPage locale={parseLocale(raw)} kind="terms" /> }
