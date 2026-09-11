import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

type Page = { title: string; intro: string; items: string[] }
type LocalizedPage = Record<Locale, Page>

const page = (en: Page, zh: Page, ru: Page): LocalizedPage => ({ en, zh, ru })
const pages: Record<string, LocalizedPage> = {
  'consolidated-procurement': page(
    { title: 'Consolidated procurement', intro: 'One accountable desk for multi-brand specifications, documents and coordinated delivery.', items: ['Unified specification review', 'Order-level quotation', 'Consolidated shipment planning', 'Document handover'] },
    { title: '集中采购', intro: '由一个负责窗口统一处理多品牌规格、文件与交付。', items: ['统一规格审核', '订单级报价', '合并发运规划', '文件交接'] },
    { title: 'Консолидированные закупки', intro: 'Один ответственный контакт для мультибрендовых спецификаций, документов и доставки.', items: ['Проверка спецификации', 'Расчёт по заказу', 'Планирование отправки', 'Передача документов'] }
  ),
  'specified-sourcing': page(
    { title: 'Specified sourcing', intro: 'Submit a brand, CAT No. or full specification for an item-level sourcing response.', items: ['Identity and pack-size check', 'Availability confirmation', 'Document checklist', 'Reference delivery route'] },
    { title: '指定型号寻源', intro: '提交品牌、CAT No. 或完整规格，获得逐项寻源回复。', items: ['身份与包装核对', '货期确认', '文件清单', '参考交付路径'] },
    { title: 'Поиск по спецификации', intro: 'Отправьте бренд, CAT No. или полную спецификацию для ответа по позиции.', items: ['Проверка позиции и фасовки', 'Подтверждение наличия', 'Список документов', 'Ориентировочный маршрут'] }
  ),
  'alternative-selection': page(
    { title: 'Alternative selection', intro: 'Comparable options for discontinued, constrained or high-cost research products.', items: ['Use-case review', 'Specification comparison', 'Storage and pack alignment', 'Customer approval before supply'] },
    { title: '替代选型', intro: '针对停产、受限或高成本科研产品提供可比较方案。', items: ['用途核对', '规格比较', '储存与包装匹配', '确认后供货'] },
    { title: 'Подбор альтернативы', intro: 'Сопоставимые варианты для снятых с производства, дефицитных или дорогих позиций.', items: ['Проверка применения', 'Сравнение характеристик', 'Сверка хранения и фасовки', 'Согласование до поставки'] }
  ),
  'distributor-program': page(
    { title: 'Distributor programme', intro: 'Order-specific support for regional partners without unsupported commercial promises.', items: ['Trial orders', 'Tiered quotations by order', 'Product-level MOQ confirmation', 'Drop shipment and materials'] },
    { title: '经销商合作', intro: '面向区域合作伙伴提供按订单确认、不过度承诺的供货支持。', items: ['试采订单', '按订单阶梯报价', '逐产品确认 MOQ', '代发货与资料支持'] },
    { title: 'Программа для дистрибьюторов', intro: 'Поддержка региональных партнёров с подтверждением условий по каждому заказу.', items: ['Пробные заказы', 'Ступенчатый расчёт', 'MOQ по позиции', 'Дропшиппинг и материалы'] }
  ),
  'source-traceability': page(
    { title: 'Source and identity review', intro: 'Supplier route, product identity and available evidence are aligned before dispatch.', items: ['Brand and CAT No.', 'Pack and storage requirement', 'Available batch evidence', 'No unsupported authorization claim'] },
    { title: '来源与身份审核', intro: '发运前对齐供应路径、产品身份及可获得证据。', items: ['品牌与 CAT No.', '包装与储存要求', '可用批次证据', '不作未经证实的授权声明'] },
    { title: 'Проверка источника и позиции', intro: 'Маршрут, идентичность продукта и доступные сведения сверяются до отправки.', items: ['Бренд и CAT No.', 'Фасовка и хранение', 'Доступные данные партии', 'Без неподтверждённой авторизации'] }
  ),
  documents: page(
    { title: 'Quality documents', intro: 'Available documents are matched to the exact item and source.', items: ['COA and batch data', 'TDS and specifications', 'SDS and handling', 'Item-specific statements'] },
    { title: '质量文件', intro: '将可提供文件与具体产品和来源逐项匹配。', items: ['COA 与批次资料', 'TDS 与规格', 'SDS 与操作说明', '产品专项声明'] },
    { title: 'Документы качества', intro: 'Доступные документы сопоставляются с точной позицией и источником.', items: ['COA и партия', 'TDS и характеристики', 'SDS и обращение', 'Заявления по продукту'] }
  ),
  'cold-chain': page(
    { title: 'Temperature-aware handling', intro: 'Packing and handover are matched to the manufacturer storage requirement.', items: ['Ambient 15–25°C', 'Refrigerated 2–8°C', 'Frozen -20°C', 'Receiving and storage transfer'] },
    { title: '温控处理', intro: '按厂商储存要求匹配包装与交接。', items: ['常温 15–25°C', '冷藏 2–8°C', '冷冻 -20°C', '收货与转储'] },
    { title: 'Температурный контроль', intro: 'Упаковка и передача соответствуют требованиям производителя.', items: ['15–25°C', '2–8°C', '-20°C', 'Приёмка и перенос в хранение'] }
  ),
  'customs-delivery': page(
    { title: 'Customs and delivery', intro: 'Export, customs and destination delivery are reviewed as one compliant route.', items: ['Export document check', 'Destination restrictions', 'Consignee responsibility', 'Early exception communication'] },
    { title: '清关与交付', intro: '将出口、清关和目的地交付作为一条合规路径审核。', items: ['出口文件检查', '目的地限制', '收货方责任', '异常提前沟通'] },
    { title: 'Таможня и доставка', intro: 'Экспорт, таможня и конечная доставка проверяются как единый маршрут.', items: ['Экспортные документы', 'Ограничения страны', 'Ответственность получателя', 'Раннее сообщение об отклонениях'] }
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string[] }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) return {}
  const content = pages[slug.at(-1) || '']?.[parseLocale(raw)]
  return content ? { title: `${content.title} | ZEHOLYN BIOTECH` } : {}
}

export default async function GenericLocalePage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale: raw, slug } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const content = pages[slug.at(-1) || '']?.[locale]
  if (!content) notFound()
  const [contacts, socials, settings] = await Promise.all([
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 1 } })
  ])
  const quote = locale === 'zh' ? '提交询盘' : locale === 'ru' ? 'Запросить предложение' : 'Request a quote'

  return <main className="stitch-site generic-page">
    <SiteHeader locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} socials={socials}/>
    <section className="generic-hero"><div><p className="section-kicker">ZEHOLYN BIOTECH</p><h1>{content.title}</h1><p>{content.intro}</p></div></section>
    <section className="generic-body"><div className="generic-grid">{content.items.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><CheckCircle2 size={19}/><h2>{item}</h2><p>{locale === 'zh' ? '具体范围、文件和交付条件按产品与订单逐项确认。' : locale === 'ru' ? 'Объём, документы и условия поставки подтверждаются по позиции и заказу.' : 'Scope, documents and delivery conditions are confirmed for the item and order.'}</p></article>)}</div><div className="generic-cta"><FileText size={24}/><div><h2>{locale === 'zh' ? '需要具体型号？' : locale === 'ru' ? 'Нужна конкретная позиция?' : 'Have a specific item?'}</h2><p>{locale === 'zh' ? '提交品牌、CAT No. 或采购清单。' : locale === 'ru' ? 'Отправьте бренд, CAT No. или список закупки.' : 'Send a brand, CAT No. or purchase list.'}</p></div><Link className="button primary" href={`/${locale}/rfq`}>{quote}<ArrowRight size={17}/></Link></div></section>
    <SiteFooter locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} contacts={contacts} socials={socials}/>
  </main>
}
