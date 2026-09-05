import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Download, Grid3X3, TestTubes } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product, ProductCategory } from '@prisma/client'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { localeAlternates } from '@/lib/seo'
import { productCategoryLabel } from '@/lib/product-category-labels'

type CategoryNode = ProductCategory & { products: Product[]; children: CategoryNode[] }

function buildCategoryTree(categories: Array<ProductCategory & { products: Product[] }>) {
  const nodes = new Map<number, CategoryNode>()
  for (const category of categories) nodes.set(category.id, { ...category, products: category.products, children: [] })
  const roots: CategoryNode[] = []
  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) nodes.get(node.parentId)!.children.push(node)
    else roots.push(node)
  }
  const sort = (items: CategoryNode[]) => { items.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id); items.forEach((item) => sort(item.children)) }
  sort(roots)
  return roots
}

function collectProducts(node: CategoryNode): Product[] {
  return [...node.products, ...node.children.flatMap(collectProducts)]
}

function productCount(node: CategoryNode): number {
  return node.products.length + node.children.reduce((total, child) => total + productCount(child), 0)
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  return { title: locale === 'zh' ? '产品目录 | Zehongyan Biotech' : locale === 'ru' ? 'Каталог продуктов | Zehongyan Biotech' : 'Product catalogue | Zehongyan Biotech', alternates: localeAlternates(process.env.APP_URL || 'http://localhost:3000', locale, '/products') }
}

export default async function ProductsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale: raw } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const [rawCategories, contacts, socials] = await Promise.all([
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' }, include: { products: { where: { status: 'PUBLISHED' }, orderBy: { id: 'asc' } } } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } })
  ])
  const tree = buildCategoryTree(rawCategories)
  const query = searchParams ? await searchParams : {}
  const lineQuery = typeof query.line === 'string' ? query.line : ''
  const categoryQuery = typeof query.category === 'string' ? query.category : ''
  const selectedLine = lineQuery === 'Reagents' || lineQuery === 'Consumables' ? lineQuery : 'All'
  const allNodes = tree.flatMap((root) => [root, ...root.children, ...root.children.flatMap((child) => child.children)])
  const selectedCategory = allNodes.find((node) => node.slug === categoryQuery) || null
  const name = (item: Pick<ProductCategory, 'name' | 'nameZh' | 'nameRu'>) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : productCategoryLabel(item.name, 'en')
  const productName = (item: Pick<Product, 'name' | 'nameZh' | 'nameRu'>) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : item.name
  const visibleRoots = selectedLine === 'All' ? tree : tree.filter((node) => node.line === selectedLine)
  const visibleProducts = selectedCategory ? collectProducts(selectedCategory) : visibleRoots.flatMap(collectProducts)
  const heading = selectedCategory ? name(selectedCategory) : selectedLine === 'Reagents' ? (locale === 'zh' ? '科研试剂' : locale === 'ru' ? 'Реагенты' : 'Research reagents') : selectedLine === 'Consumables' ? (locale === 'zh' ? '实验室耗材' : locale === 'ru' ? 'Расходные материалы' : 'Lab consumables') : (locale === 'zh' ? '科研试剂与实验室耗材' : locale === 'ru' ? 'Реагенты и лабораторные материалы' : 'Research reagents and lab consumables')
  const copy = locale === 'zh' ? { intro: '左侧按一级、二级、三级分类筛选，右侧查看对应产品；默认展示全部产品。', all: '全部产品', reagents: '科研试剂', consumables: '实验室耗材', manuals: '下载产品手册', categories: '产品品类', filter: '按产品线筛选', products: '个产品', details: '查看详情', quote: '加入询盘' } : locale === 'ru' ? { intro: 'Выберите уровень категории слева, чтобы справа увидеть соответствующие продукты. По умолчанию показан весь каталог.', all: 'Все продукты', reagents: 'Реагенты', consumables: 'Расходные материалы', manuals: 'Скачать каталоги', categories: 'Категории', filter: 'Фильтр по линии', products: 'продуктов', details: 'Подробнее', quote: 'Добавить в запрос' } : { intro: 'Use the three-level category tree on the left to filter the matching products on the right. The full catalogue is shown by default.', all: 'All products', reagents: 'Research reagents', consumables: 'Lab consumables', manuals: 'Download manuals', categories: 'Product categories', filter: 'Filter by product line', products: 'products', details: 'View details', quote: 'Add to quote' }
  const hrefFor = (slug: string, line?: string) => `/${locale}/products?category=${encodeURIComponent(slug)}${line ? `&line=${line}` : ''}`
  const lineHref = (line?: string) => line ? `/${locale}/products?line=${line}` : `/${locale}/products`
  const renderTree = (node: CategoryNode): React.ReactNode => {
    const isOpen = node.level === 1 || selectedCategory?.id === node.id || node.children.some((child) => child.id === selectedCategory?.id || child.children.some((leaf) => leaf.id === selectedCategory?.id))
    return <li key={node.id} className={`stitch-category-tree-item level-${node.level} ${isOpen ? 'is-open' : ''}`}><Link className={selectedCategory?.id === node.id ? 'active' : ''} href={hrefFor(node.slug || slugify(node.name), node.line)}><span>{name(node)}</span><small>{productCount(node)}</small>{node.level === 2 && node.children.length ? <b aria-hidden="true">{isOpen ? '−' : '+'}</b> : null}</Link>{node.children.length && isOpen ? <ul>{node.children.map(renderTree)}</ul> : null}</li>
  }

  return <main className="stitch-site stitch-catalogue-page">
    <SiteHeader locale={locale} socials={socials}/>
    <div className="stitch-catalogue-shell">
      <aside className="stitch-catalogue-sidebar">
        <span className="stitch-overline">{copy.categories}</span><h2>{copy.filter}</h2>
        <Link className={!selectedCategory && selectedLine === 'All' ? 'active' : ''} href={lineHref()}><Grid3X3 size={16}/>{copy.all}</Link>
        <Link className={!selectedCategory && selectedLine === 'Reagents' ? 'active' : ''} href={lineHref('Reagents')}><TestTubes size={16}/>{copy.reagents}</Link>
        <Link className={!selectedCategory && selectedLine === 'Consumables' ? 'active' : ''} href={lineHref('Consumables')}><TestTubes size={16}/>{copy.consumables}</Link>
        <div className="stitch-catalogue-category-list stitch-category-tree"><ul>{visibleRoots.map(renderTree)}</ul></div>
        <a className="stitch-manual-link" href={`/${locale}/resources`}><Download size={16}/>{copy.manuals}</a>
      </aside>
      <section className="stitch-catalogue-results">
        <div className="stitch-catalogue-heading"><div><span className="stitch-overline">{selectedCategory ? `${selectedCategory.line} · LEVEL ${selectedCategory.level}` : selectedLine === 'All' ? copy.all : selectedLine === 'Reagents' ? copy.reagents : copy.consumables}</span><h1>{heading}</h1><p>{copy.intro}</p></div></div>
        <div className="stitch-catalogue-result-meta"><strong>{visibleProducts.length}</strong> {copy.products}</div>
        {visibleProducts.length ? <div className="stitch-product-grid">{visibleProducts.map((product, index) => { const productCategory = allNodes.find((node) => node.id === product.categoryId); const productCategoryName = productCategory ? name(productCategory) : product.application || 'Catalogue'; return <article className="stitch-product-card" key={product.id}><Link className="stitch-product-media" href={`/${locale}/product/${product.slug || slugify(product.name)}`}><Image src={product.imageUrl || '/products/molecular-biology.jpg'} alt={productName(product)} fill priority={index < 3} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 30vw"/><span>{productCategoryName}</span></Link><div><small>{product.brand || 'Zehongyan Biotech supply'}</small><h2><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{productName(product)}</Link></h2><dl><div><dt>CAT No.</dt><dd>{product.catNo || 'Confirm per request'}</dd></div><div><dt>{locale === 'zh' ? '储存' : locale === 'ru' ? 'Хранение' : 'Storage'}</dt><dd>{product.temperature}</dd></div></dl><div className="stitch-product-actions"><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{copy.details}</Link><Link href={`/${locale}/rfq?category=${encodeURIComponent(productCategoryName)}&catNo=${encodeURIComponent(product.catNo)}`}>{copy.quote}<ArrowRight size={14}/></Link></div></div></article> })}</div> : <div className="stitch-empty-state"><TestTubes/><p>{locale === 'zh' ? '该分类暂无已发布产品。' : locale === 'ru' ? 'В этой категории пока нет опубликованных продуктов.' : 'No published products are available for this category yet.'}</p></div>}
      </section>
    </div>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
