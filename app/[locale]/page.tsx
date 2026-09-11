import { notFound } from 'next/navigation'
import LocalizedHome from '@/components/LocalizedHome'
import { locales, parseLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = parseLocale(raw); const title = locale === 'zh' ? 'ZEHOLYN BIOTECH | 科研试剂与实验室耗材全球供应' : locale === 'ru' ? 'ZEHOLYN BIOTECH | Поставка реагентов и лабораторных материалов' : 'ZEHOLYN BIOTECH | Global Life Science Sourcing'; const description = locale === 'zh' ? '科研试剂、实验室耗材、指定寻源与温控交付。' : locale === 'ru' ? 'Реагенты, лабораторные материалы, поиск по CAT No. и температурная доставка.' : 'Research reagents, laboratory consumables, specified sourcing and temperature-aware delivery.'; return { title, description, alternates: localeAlternates(process.env.APP_URL || 'http://localhost:3000', locale) }
}

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; if (!locales.includes(raw as (typeof locales)[number])) notFound();
  const locale = parseLocale(raw)
  const [settings, dbCategories, dbSlides, contacts, socials, managedSections] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } }),
    prisma.heroSlide.findMany({ where: { status: 'PUBLISHED', enabled: true, deletedAt: null }, orderBy: { sortOrder: 'asc' } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.pageSection.findMany({ where: { pageKey: 'home', status: 'PUBLISHED', enabled: true, deletedAt: null, NOT: { sectionKey: { startsWith: 'hero-' } } }, orderBy: { sortOrder: 'asc' } })
  ])
  const siteName = locale === 'zh' ? settings?.siteNameZh || settings?.siteName : locale === 'ru' ? settings?.siteNameRu || settings?.siteName : settings?.siteName
  return <LocalizedHome locale={locale} siteName={siteName} logoUrl={settings?.logoUrl} dbCategories={dbCategories} dbSlides={dbSlides} contacts={contacts} socials={socials} managedSections={managedSections} />
}
