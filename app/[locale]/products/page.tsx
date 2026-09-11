import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Download, Grid3X3, Search, TestTubes } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product, ProductCategory } from '@prisma/client'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import CatalogueCategoryTree, { type CatalogueCategoryItem } from '@/components/CatalogueCategoryTree'
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
  return { title: locale === 'zh' ? '产品目录 | ZEHOLYN BIOTECH' : locale === 'ru' ? 'Каталог продуктов | ZEHOLYN BIOTECH' : 'Product catalogue | ZEHOLYN BIOTECH', alternates: localeAlternates(process.env.APP_URL || 'http://localhost:3000', locale, '/products') }
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
  const searchQuery = typeof query.q === 'string' ? query.q.trim() : ''
  const brandQuery = typeof query.brand === 'string' ? query.brand : ''
  const temperatureQuery = typeof query.temperature === 'string' ? query.temperature : ''
  const selectedLine = lineQuery === 'Reagents' || lineQuery === 'Consumables' ? lineQuery : 'All'
  const allNodes = tree.flatMap((root) => [root, ...root.children, ...root.children.flatMap((child) => child.children)])
  const categoryById = new Map(allNodes.map((node) => [node.id, node]))
  const selectedCategory = allNodes.find((node) => node.slug === categoryQuery) || null
  const name = (item: Pick<ProductCategory, 'name' | 'nameZh' | 'nameRu'>) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : productCategoryLabel(item.name, 'en')
  const productName = (item: Pick<Product, 'name' | 'nameZh' | 'nameRu'>) => locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : item.name
  const visibleRoots = selectedLine === 'All' ? tree : tree.filter((node) => node.line === selectedLine)
  const scopedProducts = selectedCategory ? collectProducts(selectedCategory) : visibleRoots.flatMap(collectProducts)
  const allProducts = tree.flatMap(collectProducts)
  const brands = [...new Set(allProducts.map((product) => product.brand.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  const temperatures = [...new Set(allProducts.map((product) => product.temperature.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  const normalizedSearch = searchQuery.toLocaleLowerCase(locale)
  const visibleProducts = scopedProducts.filter((product) => {
    const productCategory = categoryById.get(product.categoryId)
    const haystack = [productName(product), product.name, product.nameZh, product.nameRu, product.brand, product.catNo, product.temperature, product.specification, product.application, productCategory ? name(productCategory) : ''].join(' ').toLocaleLowerCase(locale)
    return (!normalizedSearch || haystack.includes(normalizedSearch)) && (!brandQuery || product.brand === brandQuery) && (!temperatureQuery || product.temperature === temperatureQuery)
  })
  const heading = selectedCategory ? name(selectedCategory) : selectedLine === 'Reagents' ? (locale === 'zh' ? '科研试剂' : locale === 'ru' ? 'Реагенты' : 'Research reagents') : selectedLine === 'Consumables' ? (locale === 'zh' ? '实验室耗材' : locale === 'ru' ? 'Расходные материалы' : 'Lab consumables') : (locale === 'zh' ? '科研试剂与实验室耗材' : locale === 'ru' ? 'Реагенты и лабораторные материалы' : 'Research reagents and lab consumables')
  const copy = locale === 'zh' ? { all: '全部产品', reagents: '科研试剂', consumables: '实验室耗材', manuals: '下载产品手册', categories: '产品品类', filter: '按产品线筛选', products: '个产品', details: '查看详情', quote: '加入询盘', search: '搜索产品名称、品牌或货号', anyBrand: '全部品牌', anyTemperature: '全部温区', apply: '筛选', clear: '清除筛选' } : locale === 'ru' ? { all: 'Все продукты', reagents: 'Реагенты', consumables: 'Расходные материалы', manuals: 'Скачать каталоги', categories: 'Категории', filter: 'Фильтр по линии', products: 'продуктов', details: 'Подробнее', quote: 'Добавить в запрос', search: 'Продукт, бренд или CAT No.', anyBrand: 'Все бренды', anyTemperature: 'Все температуры', apply: 'Найти', clear: 'Сбросить' } : { all: 'All products', reagents: 'Research reagents', consumables: 'Lab consumables', manuals: 'Download manuals', categories: 'Product categories', filter: 'Filter by product line', products: 'products', details: 'View details', quote: 'Add to quote', search: 'Product name, brand or CAT No.', anyBrand: 'All brands', anyTemperature: 'All temperatures', apply: 'Apply filters', clear: 'Clear filters' }
  const persistentParams = (extras: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams()
    const values = { q: searchQuery, brand: brandQuery, temperature: temperatureQuery, ...extras }
    for (const [key, value] of Object.entries(values)) if (value) params.set(key, value)
    return params.toString()
  }
  const hrefFor = (slug: string) => `/${locale}/products?${persistentParams({ category: slug })}`
  const lineHref = (line?: string) => { const params = persistentParams({ line, category: undefined }); return `/${locale}/products${params ? `?${params}` : ''}` }
  const toCategoryItem = (node: CategoryNode): CatalogueCategoryItem => ({
    id: node.id,
    level: node.level,
    name: name(node),
    count: productCount(node),
    href: hrefFor(node.slug || slugify(node.name)),
    active: selectedCategory?.id === node.id,
    children: node.children.map(toCategoryItem),
  })
  const categoryItems = visibleRoots.map(toCategoryItem)

  return <main className="stitch-site stitch-catalogue-page">
    <SiteHeader locale={locale} socials={socials}/>
    <div className="stitch-catalogue-shell">
      <aside className="stitch-catalogue-sidebar">
        <span className="stitch-overline">{copy.categories}</span><h2>{copy.filter}</h2>
        <Link className={!selectedCategory && selectedLine === 'All' ? 'active' : ''} href={lineHref()}><Grid3X3 size={16}/>{copy.all}</Link>
        <Link className={!selectedCategory && selectedLine === 'Reagents' ? 'active' : ''} href={lineHref('Reagents')}><TestTubes size={16}/>{copy.reagents}</Link>
        <Link className={!selectedCategory && selectedLine === 'Consumables' ? 'active' : ''} href={lineHref('Consumables')}><TestTubes size={16}/>{copy.consumables}</Link>
        <div className="stitch-catalogue-category-list stitch-category-tree"><CatalogueCategoryTree key={categoryQuery || 'all'} items={categoryItems} expandLabel={locale === 'zh' ? '展开' : locale === 'ru' ? 'Развернуть' : 'Expand'} collapseLabel={locale === 'zh' ? '收起' : locale === 'ru' ? 'Свернуть' : 'Collapse'}/></div>
        <a className="stitch-manual-link" href={`/${locale}/resources`}><Download size={16}/>{copy.manuals}</a>
      </aside>
      <section className="stitch-catalogue-results">
        <div className="stitch-catalogue-heading"><div><span className="stitch-overline">{selectedCategory ? `${selectedCategory.line} · LEVEL ${selectedCategory.level}` : selectedLine === 'All' ? copy.all : selectedLine === 'Reagents' ? copy.reagents : copy.consumables}</span><h1>{heading}</h1></div><form className="stitch-catalogue-filters" action={`/${locale}/products`} method="get"><label><Search size={15}/><input name="q" defaultValue={searchQuery} placeholder={copy.search}/></label><select name="brand" defaultValue={brandQuery} aria-label={copy.anyBrand}><option value="">{copy.anyBrand}</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select><select name="temperature" defaultValue={temperatureQuery} aria-label={copy.anyTemperature}><option value="">{copy.anyTemperature}</option>{temperatures.map((temperature) => <option key={temperature} value={temperature}>{temperature}</option>)}</select>{lineQuery ? <input type="hidden" name="line" value={lineQuery}/> : null}{categoryQuery ? <input type="hidden" name="category" value={categoryQuery}/> : null}<button type="submit">{copy.apply}</button>{searchQuery || brandQuery || temperatureQuery ? <Link href={lineHref(selectedLine === 'All' ? undefined : selectedLine)}>{copy.clear}</Link> : null}</form></div>
        <div className="stitch-catalogue-result-meta"><strong>{visibleProducts.length}</strong> {copy.products}</div>
        {visibleProducts.length ? <div className="stitch-product-grid">{visibleProducts.map((product, index) => { const productCategory = categoryById.get(product.categoryId); const productCategoryName = productCategory ? name(productCategory) : product.application || 'Catalogue'; return <article className="stitch-product-card" key={product.id}><Link className="stitch-product-media" href={`/${locale}/product/${product.slug || slugify(product.name)}`}><Image src={product.imageUrl || '/products/molecular-biology.jpg'} alt={productName(product)} fill priority={index < 3} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 30vw"/><span>{productCategoryName}</span></Link><div><small>{product.brand || 'ZEHOLYN BIOTECH supply'}</small><h2><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{productName(product)}</Link></h2><dl><div><dt>CAT No.</dt><dd>{product.catNo || 'Confirm per request'}</dd></div><div><dt>{locale === 'zh' ? '储存' : locale === 'ru' ? 'Хранение' : 'Storage'}</dt><dd>{product.temperature}</dd></div></dl><div className="stitch-product-actions"><Link href={`/${locale}/product/${product.slug || slugify(product.name)}`}>{copy.details}</Link><Link href={`/${locale}/rfq?category=${encodeURIComponent(productCategoryName)}&catNo=${encodeURIComponent(product.catNo)}`}>{copy.quote}<ArrowRight size={14}/></Link></div></div></article> })}</div> : <div className="stitch-empty-state"><TestTubes/><p>{locale === 'zh' ? '没有符合当前分类与筛选条件的产品。' : locale === 'ru' ? 'Нет продуктов, соответствующих выбранной категории и фильтрам.' : 'No products match the selected category and filters.'}</p></div>}
      </section>
    </div>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
