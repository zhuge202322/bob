import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FileCheck2, FlaskConical, MessageCircle, Snowflake } from 'lucide-react'
import RfqForm from '@/components/RfqForm'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { locales, parseLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export default async function RfqPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale: raw } = await params
  if (!locales.includes(raw as Locale)) notFound()
  const locale = parseLocale(raw)
  const query = searchParams ? await searchParams : {}
  const initialCategory = typeof query.category === 'string' ? query.category : ''
  const initialCatNo = typeof query.catNo === 'string' ? query.catNo : ''
  const [contacts, socials, settings] = await Promise.all([
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 1 } })
  ])
  const copy = locale === 'zh'
    ? { overline: '提交询盘', title: '把产品规格和采购清单交给我们的寻源团队。', body: '填写品牌、CAT No.、数量、温区和交付城市；资料越完整，越便于逐项确认供应选项、文件与周期。', evidence: '产品级文件核验', evidenceBody: 'COA、TDS、SDS 和批次资料按具体品牌与型号确认。', grade: '科研用途产品', gradeBody: '网站目录面向科研采购，不作为临床诊断或治疗用途声明。', cold: '温控交付协调', coldBody: '常温、2–8°C 与 -20°C 路径按产品要求确认。', chat: '也可通过 WhatsApp 快速沟通' }
    : locale === 'ru'
      ? { overline: 'ЗАПРОС ПРЕДЛОЖЕНИЯ', title: 'Передайте спецификацию и список закупки отделу снабжения.', body: 'Укажите бренд, CAT No., количество, температуру и город доставки. Полные данные помогают проверить варианты, документы и сроки по каждой позиции.', evidence: 'Документы по позиции', evidenceBody: 'COA, TDS, SDS и данные партии подтверждаются для бренда и артикула.', grade: 'Для исследований', gradeBody: 'Каталог предназначен для исследовательских закупок и не заявляет клиническое применение.', cold: 'Температурная доставка', coldBody: 'Режимы Ambient, 2–8°C и -20°C подтверждаются по требованиям продукта.', chat: 'Для быстрого диалога используйте WhatsApp' }
      : { overline: 'REQUEST FOR QUOTATION', title: 'Put the specification and purchase list in front of the sourcing desk.', body: 'Include brand, CAT No., quantity, temperature and delivery city. Complete details help us confirm sourcing options, documents and timing item by item.', evidence: 'Item-level document review', evidenceBody: 'COA, TDS, SDS and batch information are confirmed for the selected brand and catalog number.', grade: 'Research-use products', gradeBody: 'The catalogue supports research procurement and does not present clinical diagnostic or therapeutic claims.', cold: 'Temperature-aware delivery', coldBody: 'Ambient, 2–8°C and -20°C routes are confirmed against the product requirement.', chat: 'Use WhatsApp for a quick conversation' }
  const whatsapp = socials.find((item) => item.platform.toLowerCase() === 'whatsapp')?.url || 'https://wa.me/861857548378'

  return <main className="stitch-site stitch-rfq-page">
    <SiteHeader locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} socials={socials}/>
    <section className="stitch-rfq-heading stitch-container"><span className="stitch-overline">{copy.overline}</span><h1>{copy.title}</h1><p>{copy.body}</p></section>
    <section className="stitch-rfq-layout stitch-container">
      <RfqForm locale={locale} initialCategory={initialCategory} initialCatNo={initialCatNo}/>
      <aside>
        <article><FileCheck2/><div><h2>{copy.evidence}</h2><p>{copy.evidenceBody}</p></div></article>
        <article><FlaskConical/><div><h2>{copy.grade}</h2><p>{copy.gradeBody}</p></div></article>
        <article><Snowflake/><div><h2>{copy.cold}</h2><p>{copy.coldBody}</p></div></article>
        <div className="stitch-rfq-aside-image"><Image src="/stitch/inquiry-1.jpg" alt="Laboratory workflow" fill sizes="(max-width: 900px) 100vw, 28vw"/></div>
        <a className="stitch-rfq-chat" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/>{copy.chat}</a>
      </aside>
    </section>
    <SiteFooter locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} contacts={contacts} socials={socials}/>
  </main>
}
