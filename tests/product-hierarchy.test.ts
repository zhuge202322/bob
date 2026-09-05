import { describe, expect, it } from 'vitest'
import { hierarchyCategorySlug, hierarchySummary, normalizeHierarchyRows } from '@/lib/product-hierarchy'

describe('product hierarchy import contract', () => {
  it('forward-fills spreadsheet hierarchy and counts three levels', () => {
    const rows = normalizeHierarchyRows([
      { level1: '科研试剂', level2: '分子生物学试剂', level3: 'PCR与qPCR试剂', productName: 'A', brand: 'B', catNo: 'C' },
      { level1: '', level2: '', level3: '逆转录与cDNA合成', productName: 'D', citationNote: '高引用', sourceNote: '已查证' },
      { level1: '实验室耗材', level2: '通用实验室耗材', level3: '移液器吸头', productName: 'E' }
    ])
    expect(hierarchySummary(rows)).toEqual({ products: 3, level1: 2, level2: 2, level3: 3 })
    expect(rows[1].level1).toBe('科研试剂')
    expect(rows[1].level2).toBe('分子生物学试剂')
    expect(hierarchyCategorySlug(3, rows[0].level3)).toBe('3-pcr-qpcr')
    expect(hierarchyCategorySlug(1, '科研试剂')).toMatch(/^1-u/)
    expect(hierarchyCategorySlug(1, '科研试剂')).not.toBe(hierarchyCategorySlug(1, '实验室耗材'))
    expect(hierarchyCategorySlug(2, '通用耗材', hierarchyCategorySlug(1, '科研试剂'))).not.toBe(hierarchyCategorySlug(2, '通用耗材', hierarchyCategorySlug(1, '实验室耗材')))
  })

  it('creates distinct non-empty slugs for Chinese hierarchy names', () => {
    const names = ['科研试剂', '实验室耗材', 'PCR与qPCR试剂', '细胞培养基']
    const slugs = names.map((name, index) => hierarchyCategorySlug(index < 2 ? 1 : 3, name))
    expect(slugs.every(Boolean)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
