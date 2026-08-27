'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Dna,
  FileCheck2,
  FlaskConical,
  Globe2,
  Microscope,
  Search,
  ShieldCheck,
  Snowflake,
  TestTubes
} from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import NetworkMap from '@/components/NetworkMap'
import { categories as staticCategories, heroSlides as staticHeroSlides } from '@/lib/data'
import type { Locale } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { localizeManagedSection, type ManagedSection } from '@/lib/page-section-overrides'

type DbCategory = {
  id: number
  slug?: string
  name: string
  nameZh: string
  nameRu: string
  line: string
  description: string
  descriptionZh: string
  descriptionRu: string
  temperature: string
  imageUrl: string
}

type DbSlide = {
  id: number
  kicker: string
  kickerZh: string
  kickerRu: string
  title: string
  titleZh: string
  titleRu: string
  body: string
  bodyZh: string
  bodyRu: string
  imageUrl: string
  focalPoint: string
  ctaLabel: string
  ctaLabelZh: string
  ctaLabelRu: string
}

type ContactItem = { type: string; label: string; value: string; href: string }
type SocialItem = { platform: string; url: string }

const applicationIcons = [Dna, TestTubes, Microscope, FlaskConical]

export default function LocalizedHome({
  locale,
  siteName = 'Zehongyan Biotech',
  logoUrl = '/manuals/company-logo.jpg',
  dbCategories = [],
  dbSlides = [],
  contacts = [],
  socials = [],
  managedSections = []
}: {
  locale: Locale
  siteName?: string
  logoUrl?: string
  dbCategories?: DbCategory[]
  dbSlides?: DbSlide[]
  contacts?: ContactItem[]
  socials?: SocialItem[]
  managedSections?: ManagedSection[]
}) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [categoryLine, setCategoryLine] = useState<'All' | 'Reagents' | 'Consumables'>('All')
  const t = (en: string, zh: string, ru: string) => locale === 'zh' ? zh : locale === 'ru' ? ru : en

  const catalogue = useMemo(() => dbCategories.length
    ? dbCategories.map((item) => ({
      id: item.id,
      slug: item.slug || slugify(item.name),
      title: locale === 'zh' ? item.nameZh || item.name : locale === 'ru' ? item.nameRu || item.name : item.name,
      kind: item.line as 'Reagents' | 'Consumables',
      detail: locale === 'zh' ? item.descriptionZh || item.description : locale === 'ru' ? item.descriptionRu || item.description : item.description,
      temperature: item.temperature,
      imageUrl: item.imageUrl
    }))
    : staticCategories.map((item, index) => ({ id: index, slug: slugify(item.title), title: item.title, kind: item.kind, detail: item.detail, temperature: item.tags[0], imageUrl: '' })), [dbCategories, locale])

  const slides = useMemo(() => dbSlides.length
    ? dbSlides.map((item) => ({
      kicker: locale === 'zh' ? item.kickerZh || item.kicker : locale === 'ru' ? item.kickerRu || item.kicker : item.kicker,
      title: locale === 'zh' ? item.titleZh || item.title : locale === 'ru' ? item.titleRu || item.title : item.title,
      text: locale === 'zh' ? item.bodyZh || item.body : locale === 'ru' ? item.bodyRu || item.body : item.body,
      image: item.imageUrl,
      focalPoint: item.focalPoint || '50% 50%'
    }))
    : staticHeroSlides.map((item) => ({ ...item, focalPoint: '50% 50%' })), [dbSlides, locale])

  useEffect(() => {
    if (paused || slides.length < 2) return
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const current = slides[slide % slides.length]
  const visibleCategories = catalogue.filter((item) => categoryLine === 'All' || item.kind === categoryLine).slice(0, 6)
  const applications = [
    t('Genomics', '基因组学', 'Геномика'),
    t('Proteomics', '蛋白质组学', 'Протеомика'),
    t('Cell research', '细胞研究', 'Клеточные исследования'),
    t('Drug discovery', '药物发现', 'Разработка препаратов')
  ]

  return <main className="stitch-site stitch-home">
    <SiteHeader locale={locale} siteName={siteName} logoUrl={logoUrl} socials={socials}/>

    <section
      className="stitch-home-hero"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(247,250,248,.98) 0%, rgba(247,250,248,.88) 36%, rgba(247,250,248,.2) 70%), url(${current.image})`, backgroundPosition: current.focalPoint }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="stitch-container stitch-home-hero-inner">
        <div className="stitch-home-hero-copy">
          <span className="stitch-overline">{current.kicker}</span>
          <h1>{current.title}</h1>
          <p>{current.text}</p>
          <div className="stitch-action-row">
            <Link className="button primary" href={`/${locale}/products`}>{t('Explore catalogue', '浏览产品目录', 'Открыть каталог')}<ArrowRight size={17}/></Link>
            <Link className="button secondary" href={`/${locale}/rfq`}>{t('Request a quote', '提交询盘', 'Запросить предложение')}</Link>
          </div>
        </div>
        <div className="stitch-slide-controls" aria-label="Hero slides">
          <button type="button" onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Previous slide"><ChevronLeft/></button>
          <span>{String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Next slide"><ChevronRight/></button>
        </div>
      </div>
    </section>

    <section className="stitch-category-stage">
      <aside className="stitch-category-rail">
        <span className="stitch-overline">{t('Product categories', '产品品类', 'Категории продуктов')}</span>
        <h2>{t('Filter by laboratory workflow', '按实验流程浏览', 'По лабораторному процессу')}</h2>
        <button className={categoryLine === 'All' ? 'active' : ''} type="button" onClick={() => setCategoryLine('All')}><Search size={16}/>{t('All categories', '全部品类', 'Все категории')}</button>
        <button className={categoryLine === 'Reagents' ? 'active' : ''} type="button" onClick={() => setCategoryLine('Reagents')}><FlaskConical size={16}/>{t('Research reagents', '科研试剂', 'Реагенты')}</button>
        <button className={categoryLine === 'Consumables' ? 'active' : ''} type="button" onClick={() => setCategoryLine('Consumables')}><TestTubes size={16}/>{t('Lab consumables', '实验室耗材', 'Расходные материалы')}</button>
        <Link href={`/${locale}/products`}>{t('View all 16 categories', '查看全部 16 个品类', 'Все 16 категорий')}<ArrowRight size={15}/></Link>
      </aside>
      <div className="stitch-category-content">
        <div className="stitch-section-heading">
          <div><span className="stitch-overline">{t('Research supply catalogue', '科研供应目录', 'Каталог для исследований')}</span><h2>{t('One catalogue, two complete product lines.', '一个目录，覆盖两大完整产品线。', 'Один каталог, две полные продуктовые линии.')}</h2></div>
          <p>{t('Representative categories from the two original product manuals. Send a brand, CAT No. or complete list for item-level confirmation.', '基于两份原始产品手册展示代表品类，可提交品牌、CAT No. 或完整清单进行逐项确认。', 'Категории основаны на двух исходных каталогах. Отправьте бренд, CAT No. или полный список для проверки.')}</p>
        </div>
        <div className="stitch-category-cards">
          {visibleCategories.map((item) => <Link href={`/${locale}/products/${item.slug}`} className="stitch-category-card" key={item.id}>
            <div className="stitch-category-image">{item.imageUrl ? <Image src={item.imageUrl} alt="" fill sizes="(max-width: 760px) 100vw, 28vw"/> : <FlaskConical/>}</div>
            <div><span>{item.kind} · {item.temperature}</span><h3>{item.title}</h3><p>{item.detail}</p><b>{t('View supply scope', '查看供应范围', 'Смотреть ассортимент')}<ArrowRight size={14}/></b></div>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="stitch-network-band">
      <div className="stitch-container stitch-network-grid">
        <div>
          <span className="stitch-overline">{t('Global distribution network', '全球供应网络', 'Глобальная сеть поставок')}</span>
          <h2>{t('Sourcing across major life-science markets.', '连接全球主要生命科学供应市场。', 'Закупки на ключевых рынках life science.')}</h2>
          <p>{t('Brand coverage spans the Americas, Europe, Asia-Pacific and China. One sourcing desk coordinates product matching, quotation, documents and the delivery path.', '品牌网络覆盖美洲、欧洲、亚太和中国，由同一采购窗口协调产品匹配、报价、文件与交付路径。', 'Сеть брендов охватывает Америку, Европу, Азиатско-Тихоокеанский регион и Китай. Один отдел координирует подбор, расчёт, документы и поставку.')}</p>
          <div className="stitch-network-facts"><span><strong>4</strong>{t('source regions', '主要供应区域', 'региона')}</span><span><strong>16</strong>{t('product categories', '核心产品品类', 'категорий')}</span><span><strong>3</strong>{t('temperature lanes', '运输温区', 'температурных режима')}</span></div>
        </div>
        <NetworkMap className="stitch-network-map" />
      </div>
    </section>

    <section className="stitch-container stitch-expertise">
      <div className="stitch-section-heading"><div><span className="stitch-overline">{t('Professional expertise', '专业服务能力', 'Профессиональная экспертиза')}</span><h2>{t('Built around real procurement decisions.', '围绕真实科研采购决策展开。', 'Работа строится вокруг реальных закупочных решений.')}</h2></div></div>
      <div className="stitch-expertise-grid">
        <article><Search/><h3>{t('Specified sourcing', '指定寻源', 'Поиск по спецификации')}</h3><p>{t('Brand, CAT No., specification or workflow becomes a documented sourcing brief.', '将品牌、CAT No.、规格或实验流程转化为清晰的寻源任务。', 'Бренд, CAT No., спецификация или процесс превращаются в чёткий запрос.')}</p></article>
        <article><ShieldCheck/><h3>{t('Document coordination', '文件协调', 'Координация документов')}</h3><p>{t('Available COA, TDS, SDS and batch information are aligned to the selected item before dispatch.', '在发货前按具体产品协调可提供的 COA、TDS、SDS 与批次信息。', 'Доступные COA, TDS, SDS и данные партии согласуются до отправки.')}</p></article>
        <article><Snowflake/><h3>{t('Temperature-aware delivery', '温控交付', 'Температурная доставка')}</h3><p>{t('Ambient, 2–8°C and -20°C requirements are confirmed against packing and handover needs.', '按常温、2–8°C 和 -20°C 要求确认包装与交接方案。', 'Условия от комнатной температуры до 2–8°C и -20°C согласуются с упаковкой и передачей.')}</p></article>
      </div>
    </section>

    <section className="stitch-application-band">
      <div className="stitch-container">
        <div className="stitch-section-heading"><div><span className="stitch-overline">{t('Industry applications', '科研应用方向', 'Научные направления')}</span><h2>{t('Products organized around the work at the bench.', '按实验台上的实际工作组织产品。', 'Продукты организованы вокруг лабораторной работы.')}</h2></div><Link href={`/${locale}/products`}>{t('Explore applications', '浏览应用方向', 'Открыть направления')}<ArrowRight size={15}/></Link></div>
        <div className="stitch-application-grid">{applications.map((item, index) => { const Icon = applicationIcons[index]; return <Link href={`/${locale}/products`} key={item}><Icon/><span>{item}</span><ArrowRight size={15}/></Link> })}</div>
      </div>
    </section>

    <section className="stitch-container stitch-competencies">
      <div className="stitch-section-heading"><div><span className="stitch-overline">{t('Technical competencies', '技术服务能力', 'Технические компетенции')}</span><h2>{t('Selection and delivery stay connected.', '从选型到交付保持同一条信息链。', 'Подбор и поставка остаются одной цепочкой.')}</h2></div></div>
      <div className="stitch-competency-grid">
        <article><div><FileCheck2/><h3>{t('Specification and document review', '规格与文件审核', 'Проверка спецификации и документов')}</h3><p>{t('We compare brand, catalog number, pack size, application, storage and available documentation before a sourcing option is presented.', '在提供寻源方案前，核对品牌、货号、包装、用途、储存条件及可提供文件。', 'До предложения варианта проверяются бренд, артикул, фасовка, применение, хранение и документы.')}</p><Link href={`/${locale}/quality`}>{t('Quality workflow', '查看质量流程', 'Процесс качества')}<ArrowRight size={14}/></Link></div><Image src="/stitch/home-enhanced-4.jpg" alt="Pipetting into a multiwell plate" width={640} height={420}/></article>
        <article><div><Globe2/><h3>{t('Cross-border procurement coordination', '跨境采购协调', 'Координация международных закупок')}</h3><p>{t('One accountable desk connects source communication, quotation, packaging, documents, customs handover and destination delivery.', '由一个负责窗口衔接供应沟通、报价、包装、文件、清关交接与目的地配送。', 'Один ответственный контакт связывает поставщика, расчёт, упаковку, документы, таможню и доставку.')}</p><Link href={`/${locale}/solutions`}>{t('Procurement services', '查看采购服务', 'Услуги снабжения')}<ArrowRight size={14}/></Link></div><Image src="/stitch/home-enhanced-1.jpg" alt="Professional life science laboratory" width={640} height={420}/></article>
      </div>
    </section>

    <section className="stitch-inventory-band">
      <div className="stitch-container">
        <div className="stitch-section-heading"><div><span className="stitch-overline">{t('Featured inventory', '重点供应品类', 'Основной ассортимент')}</span><h2>{t('Start from a category, finish with an exact item.', '从品类开始，落实到具体产品。', 'Начните с категории и перейдите к точной позиции.')}</h2></div><Link href={`/${locale}/products`}>{t('Full catalogue', '完整目录', 'Полный каталог')}<ArrowRight size={15}/></Link></div>
        <div className="stitch-inventory-grid">{catalogue.slice(0, 4).map((item) => <Link href={`/${locale}/products/${item.slug}`} key={item.id}><div>{item.imageUrl ? <Image src={item.imageUrl} alt="" fill sizes="(max-width: 700px) 100vw, 25vw"/> : null}</div><span>{item.kind}</span><h3>{item.title}</h3><p>{item.temperature}</p><b>{t('Details', '查看详情', 'Подробнее')}<ArrowRight size={14}/></b></Link>)}</div>
      </div>
    </section>

    {managedSections.length ? <section className="stitch-managed-sections"><div className="stitch-container">{managedSections.map((raw) => { const section = localizeManagedSection(raw, locale); return <article key={section.sectionKey}><div>{section.imageUrl ? <Image src={section.imageUrl} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" /> : null}</div><div><span className="stitch-overline">{section.sectionKey.replace(/-/g, ' ')}</span><h2>{section.title}</h2><p>{section.body}</p>{section.ctaLabel && section.ctaHref ? <Link className="button primary" href={section.ctaHref}>{section.ctaLabel}<ArrowRight size={15} /></Link> : null}</div></article> })}</div></section> : null}

    <section className="stitch-home-cta">
      <div><CircleCheck/><span><strong>{t('A documented path from request to delivery', '从需求到交付的清晰记录', 'Документированный путь от запроса до поставки')}</strong><small>{t('Send a product name, brand, CAT No. or complete purchase list.', '发送产品名称、品牌、CAT No. 或完整采购清单。', 'Отправьте название, бренд, CAT No. или полный список.')}</small></span></div>
      <Link className="button secondary light" href={`/${locale}/rfq`}>{t('Start an RFQ', '开始询盘', 'Начать запрос')}<ArrowRight size={16}/></Link>
    </section>

    <SiteFooter locale={locale} siteName={siteName} logoUrl={logoUrl} contacts={contacts} socials={socials}/>
  </main>
}
