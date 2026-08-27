import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Globe2,
  ListChecks,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck
} from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getPageContent } from '@/lib/page-content'
import { prisma } from '@/lib/prisma'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { applyPageSectionOverrides } from '@/lib/page-section-overrides'

const serviceIcons = [Search, PackageCheck, ListChecks, Globe2]

export default async function ContentPage({ locale, kind }: { locale: Locale; kind: string }) {
  const defaultPage = getPageContent(kind)
  const [articles, contacts, socials, settings, managedSections] = await Promise.all([
    kind === 'resources' ? prisma.article.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } }) : Promise.resolve([]),
    prisma.contact.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.pageSection.findMany({ where: { pageKey: kind, status: 'PUBLISHED', deletedAt: null }, orderBy: { sortOrder: 'asc' } })
  ])
  const page = applyPageSectionOverrides(defaultPage, managedSections)
  const text = (value: Record<Locale, string>) => value[locale]
  const t = (en: string, zh: string, ru: string) => locale === 'zh' ? zh : locale === 'ru' ? ru : en
  const whatsapp = socials.find((item) => item.platform.toLowerCase() === 'whatsapp')?.url || 'https://wa.me/861857548378'
  const vk = socials.find((item) => item.platform.toLowerCase() === 'vk')?.url || 'https://vk.com/'
  const heroImages: Record<string, string> = {
    solutions: '/stitch/services-1.jpg',
    quality: '/stitch/quality-1.jpg',
    resources: '/stitch/home-enhanced-2.jpg',
    about: '/stitch/about-1.jpg',
    contact: '/stitch/inquiry-1.jpg'
  }
  const heroImage = managedSections.find((section) => section.sectionKey === 'hero' && section.enabled)?.imageUrl || heroImages[kind] || page.heroImage
  const quote = t('Request a quote', '提交询盘', 'Запросить предложение')

  let content: React.ReactNode

  if (kind === 'solutions') {
    content = <>
      <section className="stitch-page-hero stitch-container">
        <div><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p><div className="stitch-action-row"><Link className="button primary" href={`/${locale}/rfq`}>{t('Start an inquiry', '开始询盘', 'Начать запрос')}<ArrowRight size={16}/></Link><a className="button secondary" href="/manuals/reagents-catalogue.pdf" download>{t('Download capabilities', '下载能力手册', 'Скачать каталог')}<Download size={15}/></a></div></div>
        <div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 48vw"/></div>
      </section>
      {page.stats ? <section className="stitch-stat-rail"><div className="stitch-container">{page.stats.map((stat) => <span key={stat.value}><strong>{stat.value}</strong><small>{text(stat.label)}</small></span>)}</div></section> : null}
      <section className="stitch-container stitch-service-section"><div className="stitch-section-heading"><div><span className="stitch-overline">{t('Comprehensive procurement services', '综合采购服务', 'Комплексные услуги снабжения')}</span><h2>{t('One workflow for sourcing, coordination and delivery.', '从寻源、协调到交付的一体化流程。', 'Один процесс для поиска, координации и доставки.')}</h2></div><p>{t('Each service can support a single difficult item or a recurring multi-brand programme.', '每项服务既可支持单个难找产品，也可支持长期多品牌采购项目。', 'Каждая услуга подходит как для одной сложной позиции, так и для регулярной мультибрендовой программы.')}</p></div><div className="stitch-service-grid">{page.sections.map((section, index) => { const Icon = serviceIcons[index] || Search; return <article key={text(section.title)}><Icon/><span>0{index + 1}</span><h3>{text(section.title)}</h3><p>{text(section.body)}</p>{section.bullets ? <ul>{section.bullets[locale].map((bullet) => <li key={bullet}><CheckCircle2 size={15}/>{bullet}</li>)}</ul> : null}</article> })}</div></section>
      {page.steps ? <section className="stitch-process-band"><div className="stitch-container"><div><span className="stitch-overline">{t('Service path', '服务流程', 'Процесс')}</span><h2>{t('From requirement to a documented response.', '从需求到有记录的反馈。', 'От требования к документированному ответу.')}</h2></div><div>{page.steps.map((step, index) => <article key={text(step.title)}><span>0{index + 1}</span><h3>{text(step.title)}</h3><p>{text(step.body)}</p></article>)}</div></div></section> : null}
      {page.proof ? <section className="stitch-container stitch-customer-fit"><div><span className="stitch-overline">{t('Customer fit', '合作对象', 'Для кого')}</span><h2>{text(page.proof.heading)}</h2><p>{text(page.proof.intro)}</p></div><div>{page.proof.items.map((item, index) => <article key={text(item.title)}><span>0{index + 1}</span><h3>{text(item.title)}</h3><p>{text(item.body)}</p></article>)}</div></section> : null}
    </>
  } else if (kind === 'quality') {
    content = <div className="stitch-quality-layout">
      <aside><span className="stitch-overline">{t('Quality framework', '质量框架', 'Система качества')}</span><a href="#source">{t('Source review', '来源审核', 'Проверка источника')}</a><a href="#documents">{t('Document pack', '文件包', 'Пакет документов')}</a><a href="#handling">{t('Temperature handling', '温控处理', 'Температурный режим')}</a><a href="#handover">{t('Handover', '交接记录', 'Передача')}</a></aside>
      <div>
        <section className="stitch-quality-hero"><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p><div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 70vw"/></div></section>
        <section id="documents" className="stitch-document-types"><div className="stitch-section-heading"><div><span className="stitch-overline">{t('Item-level evidence', '产品级证据', 'Данные по позиции')}</span><h2>{t('Documents matched to the selected product.', '文件与所选产品逐项匹配。', 'Документы сопоставлены с выбранным продуктом.')}</h2></div></div><div>{page.stats?.map((stat) => <article key={stat.value}><FileCheck2/><span><strong>{stat.value}</strong><p>{text(stat.label)}</p></span></article>)}</div></section>
        <section id="source" className="stitch-quality-control"><div><span className="stitch-overline">{text(page.sections[0].title)}</span><h2>{text(page.sections[0].title)}</h2><p>{text(page.sections[0].body)}</p><ul><li><CheckCircle2/>{t('Brand and catalog number matching', '品牌与目录号核对', 'Сверка бренда и артикула')}</li><li><CheckCircle2/>{t('Pack size and storage review', '包装与储存条件审核', 'Проверка фасовки и хранения')}</li><li><CheckCircle2/>{t('Available batch records confirmed', '确认可提供的批次资料', 'Подтверждение данных партии')}</li></ul></div><div><Image src="/stitch/quality-2.jpg" alt="Laboratory quality control equipment" fill sizes="(max-width: 900px) 100vw, 34vw"/></div></section>
        <section id="handling" className="stitch-quality-sections">{page.sections.slice(1).map((section, index) => <article id={index === 2 ? 'handover' : undefined} key={text(section.title)}><span>0{index + 2}</span><div><h2>{text(section.title)}</h2><p>{text(section.body)}</p>{section.bullets ? <ul>{section.bullets[locale].map((bullet) => <li key={bullet}><CheckCircle2 size={15}/>{bullet}</li>)}</ul> : null}</div>{section.image ? <div><Image src={section.image} alt="" fill sizes="(max-width: 900px) 100vw, 26vw"/></div> : null}</article>)}</section>
        <section className="stitch-quality-cta"><ShieldCheck/><div><h2>{t('Need documents for a specific item?', '需要核验具体产品文件？', 'Нужны документы по конкретной позиции?')}</h2><p>{t('Send the brand and CAT No. so the sourcing desk can confirm what is available before quotation.', '发送品牌和 CAT No.，采购团队将在报价前确认可提供的文件。', 'Отправьте бренд и CAT No., чтобы отдел снабжения подтвердил доступные документы до расчёта.')}</p></div><Link className="button primary" href={`/${locale}/rfq`}>{quote}</Link></section>
      </div>
    </div>
  } else if (kind === 'resources') {
    content = <>
      <section className="stitch-resource-hero"><div className="stitch-container"><div><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p></div><div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 45vw"/></div></div></section>
      <section className="stitch-manual-library stitch-container"><div><span className="stitch-overline">{t('Original product manuals', '原始产品手册', 'Исходные каталоги')}</span><h2>{t('The complete reagent and consumable scope.', '完整的试剂与耗材供应范围。', 'Полный ассортимент реагентов и расходников.')}</h2><p>{t('Download the two source PDFs for categories, detailed uses, specifications and high-resolution product imagery.', '下载两份原始 PDF，查看品类、详细用途、规格与高清产品图片。', 'Скачайте два исходных PDF с категориями, применением, спецификациями и изображениями.')}</p></div><div><a href="/manuals/reagents-catalogue.pdf" download><FileText/><span><strong>{t('Research Reagents Manual', '生物科研试剂产品手册', 'Каталог исследовательских реагентов')}</strong><small>PDF · 8 pages</small></span><Download/></a><a href="/manuals/consumables-catalogue.pdf" download><FileText/><span><strong>{t('Laboratory Consumables Manual', '生物科研实验室耗材产品手册', 'Каталог лабораторных расходных материалов')}</strong><small>PDF · 8 pages</small></span><Download/></a></div></section>
      <section className="stitch-resource-guides"><div className="stitch-container"><div className="stitch-section-heading"><div><span className="stitch-overline">{t('Procurement references', '采购参考资料', 'Материалы по закупкам')}</span><h2>{t('Useful before the order is placed.', '在下单前先把关键问题弄清楚。', 'Полезно до оформления заказа.')}</h2></div></div><div>{page.sections.map((section, index) => <article key={text(section.title)}><span>0{index + 1}</span><div>{section.image ? <Image src={section.image} alt="" fill sizes="(max-width: 700px) 100vw, 25vw"/> : null}</div><h3>{text(section.title)}</h3><p>{text(section.body)}</p></article>)}</div></div></section>
      {articles.length ? <section className="stitch-article-index stitch-container"><div className="stitch-section-heading"><div><span className="stitch-overline">{t('Latest guidance', '最新资料', 'Новые материалы')}</span><h2>{t('Guidance for procurement and receiving.', '可用于采购与收货的实用内容。', 'Материалы для закупки и приёмки.')}</h2></div></div><div>{articles.map((article, index) => <Link key={article.id} href={`/${locale}/resources/${article.slug}`}><div><Image src={article.coverImageUrl || '/resource-lab.jpg'} alt="" fill priority={index === 0} sizes="(max-width: 700px) 100vw, 33vw"/></div><span>{article.topic}</span><h3>{locale === 'zh' ? article.titleZh || article.title : locale === 'ru' ? article.titleRu || article.title : article.title}</h3><p>{locale === 'zh' ? article.summaryZh || article.summary : locale === 'ru' ? article.summaryRu || article.summary : article.summary}</p><b>{t('Read guide', '阅读资料', 'Читать')}<ArrowRight size={14}/></b></Link>)}</div></section> : null}
    </>
  } else if (kind === 'about') {
    content = <>
      <section className="stitch-about-hero stitch-container"><div><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p></div><div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 48vw"/></div></section>
      {page.stats ? <section className="stitch-stat-rail"><div className="stitch-container">{page.stats.map((stat) => <span key={stat.value}><strong>{stat.value}</strong><small>{text(stat.label)}</small></span>)}</div></section> : null}
      {page.proof ? <section className="stitch-about-principles stitch-container"><article><span>01</span><h2>{text(page.proof.items[0].title)}</h2><p>{text(page.proof.items[0].body)}</p></article><article><span>02</span><h2>{text(page.proof.items[2].title)}</h2><p>{text(page.proof.items[2].body)}</p></article></section> : null}
      <section className="stitch-about-capability stitch-container"><div><span className="stitch-overline">{t('Company capability', '企业能力', 'Возможности компании')}</span><h2>{t('A supply company built around accountable coordination.', '以明确负责的协调机制构建供应能力。', 'Поставщик, построенный вокруг ответственной координации.')}</h2><p>{text(page.sections[0].body)}</p><ul><li><CheckCircle2/>{t('Research institutes and universities', '科研院所与高校实验室', 'НИИ и университеты')}</li><li><CheckCircle2/>{t('Biopharma and testing laboratories', '生物医药与检测实验室', 'Биофарма и диагностические лаборатории')}</li><li><CheckCircle2/>{t('Industrial R&D and regional distributors', '工业研发与区域经销商', 'Промышленные R&D-команды и дистрибьюторы')}</li></ul></div><div className="stitch-about-images"><div><Image src="/stitch/about-2.jpg" alt="Laboratory automation" fill sizes="(max-width: 900px) 100vw, 28vw"/></div><div><Image src="/stitch/about-3.jpg" alt="Controlled laboratory environment" fill sizes="(max-width: 900px) 100vw, 28vw"/></div></div></section>
      <section className="stitch-about-network"><div className="stitch-container"><div><span className="stitch-overline">{text(page.sections[1].title)}</span><h2>{text(page.sections[1].title)}</h2><p>{text(page.sections[1].body)}</p></div><div><Image src="/stitch/home-enhanced-3.jpg" alt="Global supply network" fill sizes="(max-width: 900px) 100vw, 50vw"/></div></div></section>
    </>
  } else if (kind === 'contact') {
    content = <>
      <section className="stitch-contact-hero stitch-container"><div><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p><div className="stitch-action-row"><a className="button primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/>WhatsApp</a><a className="button secondary" href={vk} target="_blank" rel="noreferrer">VK</a></div></div><div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 45vw"/></div></section>
      <section className="stitch-contact-directory stitch-container"><div><span className="stitch-overline">{t('Business contacts', '商务联系信息', 'Контактные данные')}</span><h2>{t('Choose the channel that fits the request.', '根据需求选择合适的沟通方式。', 'Выберите канал под ваш запрос.')}</h2></div><div>{contacts.map((contact) => <article key={contact.id}><span>{contact.label}</span>{contact.href ? <a href={contact.href}>{contact.value}</a> : <strong>{contact.value}</strong>}</article>)}</div></section>
      <section className="stitch-contact-channels"><div className="stitch-container">{page.sections.map((section, index) => <article key={text(section.title)}><span>0{index + 1}</span>{index === 0 ? <MessageCircle/> : index === 1 ? <Globe2/> : <FileCheck2/>}<h3>{text(section.title)}</h3><p>{text(section.body)}</p><a href={index === 0 ? whatsapp : index === 1 ? vk : `/${locale}/rfq`}>{index < 2 ? t('Start a conversation', '开始沟通', 'Начать диалог') : quote}<ArrowRight size={14}/></a></article>)}</div></section>
      <section className="stitch-contact-rfq stitch-container"><div><FileCheck2/><span><h2>{t('Need a documented response?', '需要正式、可记录的回复？', 'Нужен документированный ответ?')}</h2><p>{t('Use the RFQ form for multi-brand lists, cold-chain items or attachments.', '涉及多品牌、冷链或附件时，请使用结构化询盘表单。', 'Используйте форму для мультибрендовых списков, холодовой цепи и вложений.')}</p></span></div><Link className="button primary" href={`/${locale}/rfq`}>{quote}<ArrowRight size={16}/></Link></section>
    </>
  } else {
    content = <>
      <section className="stitch-page-hero stitch-container"><div><span className="stitch-overline">{text(page.eyebrow)}</span><h1>{text(page.title)}</h1><p>{text(page.intro)}</p></div><div><Image src={heroImage} alt="" fill priority sizes="(max-width: 900px) 100vw, 48vw"/></div></section>
      <section className="stitch-policy-content stitch-container">{page.sections.map((section, index) => <article key={text(section.title)}><span>0{index + 1}</span><div><h2>{text(section.title)}</h2><p>{text(section.body)}</p></div></article>)}</section>
    </>
  }

  return <main className={`stitch-site stitch-content-page stitch-${kind}-page`}>
    <SiteHeader locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} socials={socials}/>
    {content}
    {kind !== 'contact' && kind !== 'quality' && kind !== 'resources' ? <section className="stitch-global-cta"><div><span className="stitch-overline">{t('Ready to start', '准备开始', 'Готовы начать')}</span><h2>{t('Send the brand, CAT No. or purchase list.', '发送品牌、CAT No. 或采购清单。', 'Отправьте бренд, CAT No. или список закупки.')}</h2></div><Link className="button secondary light" href={`/${locale}/rfq`}>{quote}<ArrowRight size={16}/></Link></section> : null}
    <SiteFooter locale={locale} siteName={settings?.siteName} logoUrl={settings?.logoUrl} contacts={contacts} socials={socials}/>
  </main>
}
