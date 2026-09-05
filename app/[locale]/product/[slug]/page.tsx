import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, FileText, FlaskConical, Thermometer } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { productCategoryLabel } from '@/lib/product-category-labels'

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const [products, contacts, socials] = await Promise.all([
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, include: { category: true } }),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } })
  ])
  const product = products.find((item) => (item.slug || slugify(item.name)) === slug)
  if (!product || product.category.status !== 'PUBLISHED') notFound()
  const name = locale === 'zh' ? product.nameZh || product.name : locale === 'ru' ? product.nameRu || product.name : product.name
  const description = locale === 'zh' ? product.descriptionZh || product.description : locale === 'ru' ? product.descriptionRu || product.description : product.description
  const categoryName = locale === 'zh' ? product.category.nameZh || product.category.name : locale === 'ru' ? product.category.nameRu || product.category.name : productCategoryLabel(product.category.name, 'en')
  const copy = locale === 'zh'
    ? { back: '返回所属品类', quote: '询价此产品', specification: '规格说明', application: '用途范围', record: '采购信息', brand: '品牌', category: '所属品类', docs: '可提供文件', docsBody: 'COA、TDS、SDS 与批次资料按具体品牌和型号确认。' }
    : locale === 'ru'
      ? { back: 'Вернуться в категорию', quote: 'Запросить продукт', specification: 'Спецификация', application: 'Применение', record: 'Данные закупки', brand: 'Бренд', category: 'Категория', docs: 'Документы', docsBody: 'COA, TDS, SDS и данные партии подтверждаются для выбранного бренда и артикула.' }
      : { back: 'Back to category', quote: 'Request this product', specification: 'Specification', application: 'Application', record: 'Procurement record', brand: 'Brand', category: 'Category', docs: 'Available documents', docsBody: 'COA, TDS, SDS and batch information are confirmed for the selected brand and catalog number.' }

  return <main className="stitch-site stitch-detail-page">
    <SiteHeader locale={locale} socials={socials}/>
    <section className="stitch-product-detail stitch-container">
      <div className="stitch-product-detail-media">{product.imageUrl ? <Image src={product.imageUrl} alt={name} fill priority sizes="(max-width: 900px) 100vw, 46vw"/> : null}</div>
      <div className="stitch-product-detail-copy"><Link className="stitch-breadcrumb" href={`/${locale}/products/${product.category.slug || slugify(product.category.name)}`}>{copy.back}<ArrowRight size={13}/></Link><span className="stitch-overline">{product.brand || categoryName}</span><h1>{name}</h1><p>{description || product.specification}</p><dl><div><dt>CAT No.</dt><dd>{product.catNo || 'Confirm with specification'}</dd></div><div><dt><Thermometer size={15}/>{locale === 'zh' ? '储存温区' : locale === 'ru' ? 'Хранение' : 'Storage'}</dt><dd>{product.temperature}</dd></div><div><dt>{copy.brand}</dt><dd>{product.brand}</dd></div><div><dt>{copy.category}</dt><dd>{categoryName}</dd></div></dl><Link className="button primary" href={`/${locale}/rfq?category=${encodeURIComponent(categoryName)}&catNo=${encodeURIComponent(product.catNo)}`}>{copy.quote}<ArrowRight size={16}/></Link></div>
    </section>

    <section className="stitch-product-information">
      <div className="stitch-container">
        <article><FlaskConical/><span><small>01</small><h2>{copy.specification}</h2><p>{product.specification}</p></span></article>
        <article><FileText/><span><small>02</small><h2>{copy.application}</h2><p>{product.application}</p></span></article>
        <article><FileText/><span><small>03</small><h2>{copy.docs}</h2><p>{copy.docsBody}</p></span></article>
      </div>
    </section>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
