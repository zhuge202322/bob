export type ManagedSection = {
  sectionKey: string
  title: string
  titleZh: string
  titleRu: string
  body: string
  bodyZh: string
  bodyRu: string
  ctaLabel: string
  ctaHref: string
  imageUrl: string
  enabled: boolean
  status: string
  sortOrder: number
}

type Localized = { en: string; zh: string; ru: string }
type DefaultSection = { title: Localized; body: Localized; image?: string; bullets?: Record<'en' | 'zh' | 'ru', string[]> }
type DefaultPage = { eyebrow: Localized; title: Localized; intro: Localized; heroImage: string; sections: DefaultSection[] } & Record<string, unknown>

const localized = (en: string, zh: string, ru: string, fallback: Localized): Localized => ({
  en: en || fallback.en,
  zh: zh || en || fallback.zh,
  ru: ru || en || fallback.ru
})

function sectionIndex(key: string) {
  const match = key.match(/^(?:section|content)-(\d+)$/i)
  return match ? Number(match[1]) - 1 : -1
}

/** Overlay CMS records on the catalogue-derived copy without making the database a single point of failure. */
export function applyPageSectionOverrides<T extends DefaultPage>(page: T, records: ManagedSection[]): T {
  if (!records.length) return page
  const result = { ...page, sections: page.sections.map((section) => ({ ...section })) }
  const disabledIndexes = new Set<number>()
  for (const record of [...records].sort((a, b) => a.sortOrder - b.sortOrder)) {
    if (record.status !== 'PUBLISHED') continue
    if (record.sectionKey === 'hero') {
      if (!record.enabled) continue
      result.title = localized(record.title, record.titleZh, record.titleRu, result.title)
      result.intro = localized(record.body, record.bodyZh, record.bodyRu, result.intro)
      if (record.imageUrl) result.heroImage = record.imageUrl
      continue
    }
    const index = sectionIndex(record.sectionKey)
    if (index >= 0 && index < result.sections.length) {
      if (!record.enabled) { disabledIndexes.add(index); continue }
      const current = result.sections[index]
      result.sections[index] = { ...current, title: localized(record.title, record.titleZh, record.titleRu, current.title), body: localized(record.body, record.bodyZh, record.bodyRu, current.body), image: record.imageUrl || current.image }
      continue
    }
    if (record.enabled && !/^hero-\d+$/i.test(record.sectionKey)) {
      result.sections.push({ title: localized(record.title, record.titleZh, record.titleRu, { en: '', zh: '', ru: '' }), body: localized(record.body, record.bodyZh, record.bodyRu, { en: '', zh: '', ru: '' }), image: record.imageUrl || undefined })
    }
  }
  result.sections = result.sections.filter((_, index) => !disabledIndexes.has(index))
  return result as T
}

export function localizeManagedSection(section: ManagedSection, locale: 'en' | 'zh' | 'ru') {
  return {
    ...section,
    title: locale === 'zh' ? section.titleZh || section.title : locale === 'ru' ? section.titleRu || section.title : section.title,
    body: locale === 'zh' ? section.bodyZh || section.body : locale === 'ru' ? section.bodyRu || section.body : section.body
  }
}
