import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Download, Grid3X3, Search, TestTubes } from 'lucide-react'
import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  return { title: locale === 'zh' ? '产品目录 | Zehongyan Biotech' : locale === 'ru' ? 'Каталог продуктов | Zehongyan Biotech' : 'Product catalogue | Zehongyan Biotech', alternates: localeAlternates(process.env.APP_URL || 'http://localhost:3000', locale, '/products') }
}

export default async function ProductsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale: raw } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const query = searchParams ? await searchParams : {}
  const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : ''
  const selectedLine = query.line === 'Reagents' || query.line === 'Consumables' ? query.line : 'All'
  const [categories, contacts, socials] = await Promise.all([
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' }, include: { products: { where: { status: 'PUBLISHED' } } } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } })
  ])
  const copy = locale === 'zh'
    ? { title: '科研试剂与实验室耗材', intro: '从真实产品手册中的 16 个核心品类和代表产品开始，也可以直接提交品牌与 CAT No.。', all: '全部产品', reagents: '科研试剂', consumables: '实验室耗材', quote: '加入询盘', search: '搜索产品、品牌或 CAT No.', displaying: '当前显示', products: '个代表产品', manuals: '下载产品手册', categories: '产品品类', filter: '按产品线筛选', noResult: '没有匹配的产品，请更换关键词或直接提交询盘。', scope: '浏览品类范围' }
    : locale === 'ru'
      ? { title: 'Реагенты и лабораторные материалы', intro: 'Начните с 16 категорий и представленных позиций из исходных каталогов или отправьте бренд и CAT No.', all: 'Все продукты', reagents: 'Реагенты', consumables: 'Расходные материалы', quote: 'Добавить в запрос', search: 'Продукт, бренд или CAT No.', displaying: 'Показано', products: 'позиций', manuals: 'Скачать каталоги', categories: 'Категории', filter: 'Фильтр по линии', noResult: 'Совпадений нет. Измените запрос или отправьте спецификацию.', scope: 'Открыть категорию' }
      : { title: 'Research reagents and lab consumables', intro: 'Start with 16 core categories and representative items from the original manuals, or send a brand and CAT No. directly.', all: 'All products', reagents: 'Research reagents', consumables: 'Lab consumables', quote: 'Add to quote', search: 'Search product, brand or CAT No.', displaying: 'Displaying', products: 'representative products', manuals: 'Download manuals', categories: 'Product categories', filter: 'Filter by product line', noResult: 'No matching products. Try another term or send the exact specification.', scope: 'Browse category' }
  const name = (item: typeof categories[number]) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : item.name
  const productName = (item: typeof categories[number]['products'][number]) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : item.name
  const products = categories.flatMap((category) => category.products.map((product) => ({ product, category }))).filter(({ product, category }) => {
    if (selectedLine !== 'All' && category.line !== selectedLine) return false
    if (!q) return true
    return `${product.name} ${product.nameZh} ${product.nameRu} ${product.brand} ${product.catNo} ${category.name}`.toLowerCase().includes(q)
  })

  return <main className="stitch-site stitch-catalogue-page">
    <SiteHeader locale={locale} socials={socials}/>
    <div className="stitch-catalogue-shell">
      <aside className="stitch-catalogue-sidebar">
        <span className="stitch-overline">{copy.categories}</span>
        <h2>{copy.filter}</h2>
        <Link className={selectedLine === 'All' ? 'active' : ''} href={`/${locale}/products`}><Grid3X3 size={16}/>{copy.all}</Link>
        <Link className={selectedLine === 'Reagents' ? 'active' : ''} href={`/${locale}/products?line=Reagents`}><TestTubes size={16}/>{copy.reagents}</Link>
        <Link className={selectedLine === 'Consumables' ? 'active' : ''} href={`/${locale}/products?line=Consumables`}><TestTubes size={16}/>{copy.consumables}</Link>
        <div className="stitch-catalogue-category-list">{categories.map((category) => <Link key={category.id} href={`/${locale}/products/${category.slug || slugify(category.name)}`}><span>{name(category)}</span><small>{category.products.length}</small></Link>)}</div>
        <a className="stitch-manual-link" href={`/${locale}/resources`}><Download size={16}/>{copy.manuals}</a>
      </aside>

      <section className="stitch-catalogue-results">
        <div className="stitch-catalogue-heading">
          <div><span className="stitch-overline">{selectedLine === 'All' ? copy.all : selectedLine === 'Reagents' ? copy.reagents : copy.consumables}</span><h1>{copy.title}</h1><p>{copy.intro}</p></div>
          <form action={`/${locale}/products`} className="stitch-catalogue-search"><Search size={17}/><input name="q" defaultValue={typeof query.q === 'string' ? query.q : ''} placeholder={copy.search}/>{selectedLine !== 'All' ? <input type="hidden" name="line" value={selectedLine}/> : null}<button type="submit" title={copy.search} aria-label={copy.search}><ArrowRight size={16}/></button></form>
        </div>
        <p className="stitch-result-count">{copy.displaying} <strong>{products.length}</strong> {copy.products}</p>
        {products.length ? <div className="stitch-product-grid">{products.map(({ product, category }, index) => <article className="stitch-product-card" key={product.id}>
          <Link className="stitch-product-media" href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{product.imageUrl ? <Image src={product.imageUrl} alt={productName(product)} fill priority={index < 3} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 26vw"/> : null}<span>{category.line}</span></Link>
          <div><small>{product.brand || name(category)}</small><h2><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{productName(product)}</Link></h2><dl><div><dt>CAT No.</dt><dd>{product.catNo || 'Confirm per request'}</dd></div><div><dt>{locale === 'zh' ? '储存' : locale === 'ru' ? 'Хранение' : 'Storage'}</dt><dd>{product.temperature}</dd></div></dl><div className="stitch-product-actions"><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{locale === 'zh' ? '详情' : locale === 'ru' ? 'Подробнее' : 'Details'}</Link><Link href={`/${locale}/rfq?category=${encodeURIComponent(name(category))}&catNo=${encodeURIComponent(product.catNo)}`}>{copy.quote}<ArrowRight size={14}/></Link></div></div>
        </article>)}</div> : <div className="stitch-empty-state"><Search/><p>{copy.noResult}</p><Link className="button primary" href={`/${locale}/rfq`}>{copy.quote}</Link></div>}

        <section className="stitch-category-index"><div className="stitch-section-heading"><div><span className="stitch-overline">{copy.categories}</span><h2>{locale === 'zh' ? '按实验流程查看完整供应范围。' : locale === 'ru' ? 'Полный ассортимент по лабораторным процессам.' : 'Explore the full supply scope by workflow.'}</h2></div></div><div>{categories.map((category) => <Link key={category.id} href={`/${locale}/products/${category.slug || slugify(category.name)}`}><span>{category.line}</span><strong>{name(category)}</strong><small>{category.temperature}</small><b>{copy.scope}<ArrowRight size={14}/></b></Link>)}</div></section>
      </section>
    </div>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
