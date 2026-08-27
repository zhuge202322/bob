import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')
  const [categories, products, articles] = await Promise.all([
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, name: true, updatedAt: true } }),
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, name: true, updatedAt: true } }),
    prisma.article.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } })
  ])
  const staticPaths = ['', '/products', '/solutions', '/quality', '/resources', '/about', '/contact', '/rfq', '/privacy', '/terms', '/faq']
  return ['en', 'zh', 'ru'].flatMap((locale) => [
    ...staticPaths.map((path) => ({ url: `${base}/${locale}${path}`, lastModified: new Date(), changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : 0.6 })),
    ...categories.map((item) => ({ url: `${base}/${locale}/products/${item.slug || slugify(item.name)}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...products.map((item) => ({ url: `${base}/${locale}/product/${item.slug || slugify(item.name)}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...articles.map((item) => ({ url: `${base}/${locale}/resources/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 }))
  ])
}
