import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, FileText, PackageCheck, Snowflake } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const [all, contacts, socials] = await Promise.all([
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, include: { products: { where: { status: 'PUBLISHED' } } }, orderBy: { sortOrder: 'asc' } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } })
  ])
  const category = all.find((item) => (item.slug || slugify(item.name)) === slug)
  if (!category) notFound()
  const name = locale === 'zh' ? category.nameZh || category.name : locale === 'ru' ? category.nameRu || category.name : category.name
  const description = locale === 'zh' ? category.descriptionZh || category.description : locale === 'ru' ? category.descriptionRu || category.description : category.description
  const copy = locale === 'zh'
    ? { back: '产品目录', quote: '按此品类提交询盘', scope: '产品范围与主力规格', brands: '代表性供应品牌', products: '个代表产品', docs: '文件按具体品牌与型号确认', process: '采购提示', processBody: '请提供品牌、CAT No.、规格、数量、储存温度和交付城市，以便逐项确认货期与文件。', details: '查看产品' }
    : locale === 'ru'
      ? { back: 'Каталог', quote: 'Запросить категорию', scope: 'Ассортимент и основные спецификации', brands: 'Представленные бренды', products: 'позиций', docs: 'Документы подтверждаются для каждой позиции', process: 'Для закупки', processBody: 'Укажите бренд, CAT No., спецификацию, количество, хранение и город доставки для проверки сроков и документов.', details: 'Открыть продукт' }
      : { back: 'Product catalogue', quote: 'Request this category', scope: 'Supply scope and core specifications', brands: 'Representative supply brands', products: 'listed products', docs: 'Documents are confirmed for the selected brand and item', process: 'Procurement note', processBody: 'Share brand, CAT No., specification, quantity, storage temperature and delivery city so timing and documentation can be checked item by item.', details: 'View product' }

  return <main className="stitch-site stitch-detail-page">
    <SiteHeader locale={locale} socials={socials}/>
    <section className="stitch-detail-hero stitch-container">
      <div className="stitch-detail-copy"><Link className="stitch-breadcrumb" href={`/${locale}/products`}>{copy.back}<ArrowRight size={13}/></Link><span className="stitch-overline">{category.line}</span><h1>{name}</h1><p>{description}</p><div className="stitch-detail-actions"><Link className="button primary" href={`/${locale}/rfq?category=${encodeURIComponent(name)}`}>{copy.quote}<ArrowRight size={16}/></Link><a className="button secondary" href={`/${locale}/resources`}>{locale === 'zh' ? '下载产品手册' : locale === 'ru' ? 'Скачать каталоги' : 'Download manuals'}</a></div></div>
      <div className="stitch-detail-visual">{category.imageUrl ? <Image src={category.imageUrl} alt={name} fill priority sizes="(max-width: 900px) 100vw, 44vw"/> : null}</div>
    </section>

    <section className="stitch-detail-facts"><div className="stitch-container"><span><Snowflake/><small>Temperature lane</small><strong>{category.temperature}</strong></span><span><FileText/><small>Documentation</small><strong>{copy.docs}</strong></span><span><PackageCheck/><small>{locale === 'zh' ? '目录产品' : locale === 'ru' ? 'В каталоге' : 'Catalogue entries'}</small><strong>{category.products.length} {copy.products}</strong></span></div></section>

    <section className="stitch-category-detail stitch-container">
      <div className="stitch-specification-copy"><span className="stitch-overline">{copy.scope}</span><h2>{copy.scope}</h2><p>{category.specifications || description}</p><h3>{copy.brands}</h3><p>{category.brands}</p><div className="stitch-procurement-note"><FileText/><div><strong>{copy.process}</strong><p>{copy.processBody}</p></div></div></div>
      <aside><span className="stitch-overline">{category.products.length} {copy.products}</span>{category.products.map((product) => <Link className="stitch-category-product" key={product.id} href={`/${locale}/product/${product.slug || slugify(product.name)}`}><div>{product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="84px"/> : null}</div><span><strong>{locale === 'zh' ? product.nameZh || product.name : locale === 'ru' ? product.nameRu || product.name : product.name}</strong><small>{product.brand} · {product.catNo}</small></span><b>{copy.details}<ArrowRight size={13}/></b></Link>)}</aside>
    </section>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
