import { describe, expect, it } from 'vitest'
import { applyPageSectionOverrides, type ManagedSection } from '@/lib/page-section-overrides'

const page = {
  eyebrow: { en: 'Default eyebrow', zh: '默认', ru: 'По умолчанию' },
  title: { en: 'Default hero', zh: '默认首屏', ru: 'Главный экран' },
  intro: { en: 'Default intro', zh: '默认介绍', ru: 'Описание' },
  heroImage: '/default.jpg',
  sections: [{ title: { en: 'First', zh: '第一', ru: 'Первый' }, body: { en: 'Body', zh: '正文', ru: 'Текст' }, image: '/first.jpg' }]
}
const record = (data: Partial<ManagedSection>): ManagedSection => ({ sectionKey: 'section-1', title: '', titleZh: '', titleRu: '', body: '', bodyZh: '', bodyRu: '', ctaLabel: '', ctaHref: '', imageUrl: '', enabled: true, status: 'PUBLISHED', sortOrder: 1, ...data })

describe('page section CMS overrides', () => {
  it('overrides only supplied localized values and image', () => {
    const result = applyPageSectionOverrides(page, [record({ title: 'Managed title', titleZh: '管理标题', imageUrl: '/managed.jpg' })])
    expect(result.sections[0].title).toEqual({ en: 'Managed title', zh: '管理标题', ru: 'Managed title' })
    expect(result.sections[0].body).toEqual(page.sections[0].body)
    expect(result.sections[0].image).toBe('/managed.jpg')
  })

  it('overrides the hero and ignores drafts', () => {
    const result = applyPageSectionOverrides(page, [record({ sectionKey: 'hero', title: 'Managed hero', body: 'Managed intro', imageUrl: '/hero.jpg' }), record({ title: 'Draft', status: 'DRAFT' })])
    expect(result.title.en).toBe('Managed hero')
    expect(result.intro.en).toBe('Managed intro')
    expect(result.heroImage).toBe('/hero.jpg')
    expect(result.sections[0].title.en).toBe('First')
  })

  it('can disable adjacent default sections without index drift', () => {
    const multi = { ...page, sections: [...page.sections, { title: { en: 'Second', zh: '第二', ru: 'Второй' }, body: { en: 'Two', zh: '二', ru: 'Два' } }] }
    const result = applyPageSectionOverrides(multi, [record({ sectionKey: 'section-1', enabled: false }), record({ sectionKey: 'section-2', enabled: false, sortOrder: 2 })])
    expect(result.sections).toHaveLength(0)
  })
})
