import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Download, Grid3X3, TestTubes } from 'lucide-react'
import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { productCategoryLabel } from '@/lib/product-category-labels'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = parseLocale(raw)
  const category = await prisma.productCategory.findFirst({ where: { status: 'PUBLISHED', slug } })
  const title = category ? (locale === 'zh' ? category.nameZh || category.name : locale === 'ru' ? category.nameRu || category.name : category.name) : 'Product category'
  return { title: `${title} | Zehongyan Biotech` }
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const [category, contacts, socials] = await Promise.all([
    prisma.productCategory.findFirst({ where: { status: 'PUBLISHED', slug }, include: { parent: true, products: { where: { status: 'PUBLISHED' } }, children: { where: { status: 'PUBLISHED' }, include: { products: { where: { status: 'PUBLISHED' } }, children: { where: { status: 'PUBLISHED' }, include: { products: { where: { status: 'PUBLISHED' } } } } } } } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } })
  ])
  if (!category) notFound()
  const name = (item: { name: string; nameZh: string; nameRu: string }) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : productCategoryLabel(item.name, 'en')
  const isLeaf = category.level === 3
  const copy = locale === 'zh' ? { back: '产品目录', quote: '提交此分类询盘', children: '下一级分类', products: '产品', manuals: '下载产品手册', browse: '浏览分类', empty: '该分类暂无产品。' } : locale === 'ru' ? { back: 'Каталог', quote: 'Запросить категорию', children: 'Следующий уровень', products: 'Продукты', manuals: 'Скачать каталоги', browse: 'Открыть категорию', empty: 'В этой категории пока нет продуктов.' } : { back: 'Product catalogue', quote: 'Request this category', children: 'Next category level', products: 'Products', manuals: 'Download manuals', browse: 'Browse category', empty: 'No products are listed in this category yet.' }
  const parentHref = category.parent ? `/${locale}/products/${category.parent.slug || slugify(category.parent.name)}` : `/${locale}/products`
  const productItems = isLeaf ? category.products : []
  const childProductCount = (child: typeof category.children[number]) => child.level === 3 ? child.products.length : child.children.reduce((total, leaf) => total + leaf.products.length, 0)
  return <main className="stitch-site stitch-detail-page">
    <SiteHeader locale={locale} socials={socials}/>
    <section className="stitch-detail-hero stitch-container">
      <div className="stitch-detail-copy"><Link className="stitch-breadcrumb" href={parentHref}>{copy.back}<ArrowRight size={13}/></Link><span className="stitch-overline">{category.line} · LEVEL {category.level}</span><h1>{name(category)}</h1><p>{category.description || name(category)}</p><div className="stitch-detail-actions"><Link className="button primary" href={`/${locale}/rfq?category=${encodeURIComponent(name(category))}`}>{copy.quote}<ArrowRight size={16}/></Link><a className="button secondary" href={`/${locale}/resources`}><Download size={15}/>{copy.manuals}</a></div></div>
      <div className="stitch-detail-visual">{category.imageUrl ? <Image src={category.imageUrl} alt={name(category)} fill priority sizes="(max-width: 900px) 100vw, 44vw"/> : null}</div>
    </section>
    <section className="stitch-category-detail stitch-container">
      <div className="stitch-specification-copy"><span className="stitch-overline">{isLeaf ? copy.products : copy.children}</span><h2>{isLeaf ? `${productItems.length} ${copy.products}` : `${category.children.length} ${copy.children}`}</h2><p>{category.specifications || category.description || name(category)}</p></div>
      <aside>
        {!isLeaf ? category.children.map((child) => <Link className="stitch-category-product" key={child.id} href={`/${locale}/products/${child.slug || slugify(child.name)}`}><div><Grid3X3 size={22}/></div><span><strong>{name(child)}</strong><small>{childProductCount(child)} {copy.products}</small></span><b>{copy.browse}<ArrowRight size={13}/></b></Link>) : productItems.map((product) => <Link className="stitch-category-product" key={product.id} href={`/${locale}/product/${product.slug || slugify(product.name)}`}><div>{product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="84px"/> : <TestTubes size={22}/>}</div><span><strong>{name(product)}</strong><small>{product.brand} · {product.catNo}</small></span><b>{copy.browse}<ArrowRight size={13}/></b></Link>)}
        {!category.children.length && !productItems.length ? <p>{copy.empty}</p> : null}
      </aside>
    </section>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
