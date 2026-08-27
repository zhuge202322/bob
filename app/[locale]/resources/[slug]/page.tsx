import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'

export default async function ResourceArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const article = await prisma.article.findFirst({ where: { slug, status: 'PUBLISHED' } })
  if (!article) notFound()
  const title = locale === 'zh' ? article.titleZh || article.title : locale === 'ru' ? article.titleRu || article.title : article.title
  const summary = locale === 'zh' ? article.summaryZh || article.summary : locale === 'ru' ? article.summaryRu || article.summary : article.summary
  const body = locale === 'zh' ? article.bodyZh || article.body : locale === 'ru' ? article.bodyRu || article.body : article.body
  const quote = locale === 'zh' ? '提交相关询盘' : locale === 'ru' ? 'Отправить запрос' : 'Request related sourcing'
  return <main className="generic-page"><header className="site-header"><Link className="brand" href={`/${locale}`}><span className="brand-mark">H</span><span>Hocore<small>biotech</small></span></Link><Link className="text-link" href={`/${locale}/resources`}><ArrowLeft size={15}/> Resources</Link><Link className="button primary" href={`/${locale}/rfq`}>{quote}<ArrowRight size={16}/></Link></header><article><section className="generic-hero"><div><p className="section-kicker">{article.topic}</p><h1>{title}</h1><p>{summary}</p></div></section><section className="generic-body"><div className="article-meta"><CalendarDays size={16}/><span>{article.updatedAt.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'ru' ? 'ru-RU' : 'en-GB')}</span><span>{article.reviewer}</span></div><div className="article-copy">{body.split(/\n{2,}/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="generic-cta"><div><h2>{quote}</h2><p>Brand, CAT No., specification and delivery requirements can be submitted in one structured RFQ.</p></div><Link className="button primary" href={`/${locale}/rfq`}>{quote}<ArrowRight size={16}/></Link></div></section></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: title, datePublished: article.publishedAt.toISOString(), dateModified: article.updatedAt.toISOString(), author: { '@type': 'Organization', name: article.reviewer } }) }} /></main>
}
