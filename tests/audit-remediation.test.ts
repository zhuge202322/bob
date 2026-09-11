import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getPageContent } from '@/lib/page-content'

const source = (path: string) => readFileSync(path, 'utf8')

describe('website audit remediation', () => {
  it('publishes a complete legal statement in all three languages', () => {
    const legal = getPageContent('legal')
    expect(legal.sections.length).toBeGreaterThanOrEqual(5)
    expect(legal.sections.map((section) => section.body.en).join(' ')).toContain('independent')
    expect(legal.sections.map((section) => section.body.zh).join(' ')).toContain('仅供科研')
    expect(legal.sections.map((section) => section.body.ru).join(' ')).toContain('исследователь')
  })

  it('shows an item-level legal disclosure on product details', () => {
    const page = source('app/[locale]/product/[slug]/page.tsx')
    expect(page).toContain('stitch-product-legal')
    expect(page).toContain('product.brand')
    expect(page).toContain('Research Use Only')
  })

  it('supports catalogue search by product, brand, CAT No., category and temperature', () => {
    const page = source('app/[locale]/products/page.tsx')
    expect(page).toContain('query.q')
    expect(page).toContain('query.brand')
    expect(page).toContain('query.temperature')
    expect(page).toContain('product.catNo')
    expect(page).toContain('product.brand')
  })

  it('keeps all three language choices available in the mobile navigation', () => {
    const header = source('components/SiteHeader.tsx')
    expect(header).toContain('stitch-mobile-language')
    expect(header).toContain("(['en', 'zh', 'ru'] as Locale[])")
  })

  it('removes the explanatory catalogue filtering paragraph', () => {
    const page = source('app/[locale]/products/page.tsx')
    expect(page).not.toContain('左侧按一级、二级、三级分类筛选；也可按产品名称、品牌、货号和温区组合检索。')
    expect(page).not.toContain('Use the three-level tree on the left')
    expect(page).not.toContain('Фильтруйте по трёхуровневому каталогу слева')
    expect(page).not.toContain('<p>{copy.intro}</p>')
  })

  it('describes all three supported transport temperatures in the resource guide', () => {
    const resources = getPageContent('resources')
    const storageAndShipping = resources.sections[1]

    expect(storageAndShipping.body).toEqual({
      en: 'A practical checklist covering ambient, -20°C and 2–8°C transport, from shipping documents to receipt inspection.',
      zh: '覆盖常温、-20℃和2℃～8℃运输的实用清单，从发运文件到收货检查。',
      ru: 'Практический чек-лист для перевозки при комнатной температуре, -20 °C и 2–8 °C: от отгрузочных документов до проверки при получении.'
    })
  })
})
