import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Box, FileCheck2, FileText, FlaskConical, ShieldCheck, Thermometer, Truck } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { prisma } from '@/lib/prisma'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { productCategoryLabel } from '@/lib/product-category-labels'

type TechnicalData = { type?: string; features?: string; application?: string; shipping?: string; packaging?: string; specification?: string; storage?: string }

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
  let technical: TechnicalData = {}
  try {
    const parsed = JSON.parse(product.technicalData || '{}') as Record<string, TechnicalData>
    technical = parsed[locale] || parsed.en || {}
  } catch {
    technical = {}
  }
  const technicalValue = (key: keyof TechnicalData, fallback = '') => technical[key] || fallback
  const categoryName = locale === 'zh' ? product.category.nameZh || product.category.name : locale === 'ru' ? product.category.nameRu || product.category.name : productCategoryLabel(product.category.name, 'en')
  const copy = locale === 'zh'
    ? { back: '返回所属品类', quote: '询价此产品', specification: '规格说明', application: '用途范围', record: '采购信息', brand: '品牌', category: '所属品类', docs: '可提供文件', docsBody: 'COA、TDS、SDS 与批次资料按具体品牌和型号确认。', type: '类型', features: '特性', shipping: '运输', packaging: '包装', storage: '储存条件', legalTitle: '产品法律与使用声明', legalBody: `本产品由深圳泽鸿衍生生物科技有限公司（ZEHOLYN BIOTECH）按订单确认的贸易渠道独立采购与供应。${product.brand || '相关'}品牌名称及商标归其权利人所有；除非另有书面说明，ZEHOLYN BIOTECH 与该品牌不存在代理、授权或合作关系。本产品仅供科研使用，不用于人体诊断、治疗或临床用途。页面信息仅作采购参考，具体规格、包装、批次、文件与适用性以品牌说明书、实物及最终合同为准。` }
    : locale === 'ru'
      ? { back: 'Вернуться в категорию', quote: 'Запросить продукт', specification: 'Спецификация', application: 'Применение', record: 'Данные закупки', brand: 'Бренд', category: 'Категория', docs: 'Документы', docsBody: 'COA, TDS, SDS и данные партии подтверждаются для выбранного бренда и артикула.', type: 'Тип', features: 'Характеристики', shipping: 'Транспортировка', packaging: 'Упаковка', storage: 'Хранение', legalTitle: 'Правовое заявление и назначение', legalBody: `Продукт независимо закупается и поставляется 深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) через подтверждённый для заказа торговый канал. Название и товарные знаки ${product.brand || 'соответствующего бренда'} принадлежат их владельцу; ZEHOLYN BIOTECH не заявляет об агентских, авторизованных или партнёрских отношениях без отдельного письменного подтверждения. Только для исследовательского использования, не для диагностики, лечения или клинического применения у человека. Данные страницы являются справочными; приоритет имеют инструкции бренда, фактический товар и окончательный договор.` }
      : { back: 'Back to category', quote: 'Request this product', specification: 'Specification', application: 'Application', record: 'Procurement record', brand: 'Brand', category: 'Category', docs: 'Available documents', docsBody: 'COA, TDS, SDS and batch information are confirmed for the selected brand and catalog number.', type: 'Type', features: 'Features', shipping: 'Shipping', packaging: 'Packaging', storage: 'Storage conditions', legalTitle: 'Product legal and use statement', legalBody: `This product is independently procured and supplied by 深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) through a trade channel confirmed for the order. The ${product.brand || 'relevant'} brand name and trademarks belong to their owner; ZEHOLYN BIOTECH does not claim agency, authorization or partnership unless separately confirmed in writing. Research Use Only. Not for human diagnosis, treatment or clinical use. Page information is a procurement reference; manufacturer instructions, the delivered item and the final contract govern specifications, packaging, batch documents and suitability.` }

  return <main className="stitch-site stitch-detail-page">
    <SiteHeader locale={locale} socials={socials}/>
    <section className="stitch-product-detail stitch-container">
      <div className="stitch-product-detail-media">{product.imageUrl ? <Image src={product.imageUrl} alt={name} fill priority sizes="(max-width: 900px) 100vw, 46vw"/> : null}</div>
      <div className="stitch-product-detail-copy"><Link className="stitch-breadcrumb" href={`/${locale}/products/${product.category.slug || slugify(product.category.name)}`}>{copy.back}<ArrowRight size={13}/></Link><span className="stitch-overline">{product.brand || categoryName}</span><h1>{name}</h1><p>{description || product.specification}</p><dl><div><dt>CAT No.</dt><dd>{product.catNo || 'Confirm with specification'}</dd></div><div><dt><Thermometer size={15}/>{locale === 'zh' ? '储存温区' : locale === 'ru' ? 'Хранение' : 'Storage'}</dt><dd>{product.temperature}</dd></div><div><dt>{copy.brand}</dt><dd>{product.brand}</dd></div><div><dt>{copy.category}</dt><dd>{categoryName}</dd></div></dl><Link className="button primary" href={`/${locale}/rfq?category=${encodeURIComponent(categoryName)}&catNo=${encodeURIComponent(product.catNo)}`}>{copy.quote}<ArrowRight size={16}/></Link></div>
    </section>

    <section className="stitch-product-technical">
      <div className="stitch-container">
        <div className="stitch-section-heading"><div><span className="stitch-overline">{locale === 'zh' ? '产品技术资料' : locale === 'ru' ? 'Технические данные продукта' : 'Product technical data'}</span><h2>{locale === 'zh' ? '完整参数与规格' : locale === 'ru' ? 'Полные параметры и спецификация' : 'Complete parameters and specifications'}</h2></div><p>{locale === 'zh' ? '以下内容根据最新产品目录整理，具体批次和包装以品牌官方文件为准。' : locale === 'ru' ? 'Данные собраны из актуального каталога; конкретная партия и упаковка подтверждаются официальными документами бренда.' : 'Compiled from the latest product catalogue; exact batch and pack details are confirmed against the manufacturer documents.'}</p></div>
        <dl className="stitch-product-technical-grid">
          <div><dt>{copy.type}</dt><dd>{technicalValue('type')}</dd></div>
          <div><dt>{copy.features}</dt><dd>{technicalValue('features')}</dd></div>
          <div><dt>{copy.application}</dt><dd>{technicalValue('application', product.application)}</dd></div>
          <div><dt><FileText size={15}/>{copy.specification}</dt><dd>{technicalValue('specification', product.specification)}</dd></div>
          <div><dt><Truck size={15}/>{copy.shipping}</dt><dd>{technicalValue('shipping')}</dd></div>
          <div><dt><Box size={15}/>{copy.packaging}</dt><dd>{technicalValue('packaging')}</dd></div>
          <div className="stitch-product-technical-storage"><dt><Thermometer size={15}/>{copy.storage}</dt><dd>{technicalValue('storage', product.temperature)}</dd></div>
        </dl>
      </div>
    </section>
    <section className="stitch-product-information">
      <div className="stitch-container">
        <article><FlaskConical/><span><small>01</small><h2>{copy.specification}</h2><p>{technicalValue('specification', product.specification)}</p></span></article>
        <article><FileText/><span><small>02</small><h2>{copy.application}</h2><p>{technicalValue('application', product.application)}</p></span></article>
        <article><FileCheck2/><span><small>03</small><h2>{copy.docs}</h2><p>{copy.docsBody}</p></span></article>
      </div>
    </section>
    <section className="stitch-product-legal">
      <div className="stitch-container"><ShieldCheck/><div><h2>{copy.legalTitle}</h2><p>{copy.legalBody}</p><Link href={`/${locale}/legal`}>{locale === 'zh' ? '查看完整法律声明' : locale === 'ru' ? 'Полное правовое заявление' : 'Read the full legal statement'}<ArrowRight size={14}/></Link></div></div>
    </section>
    <SiteFooter locale={locale} contacts={contacts} socials={socials}/>
  </main>
}
