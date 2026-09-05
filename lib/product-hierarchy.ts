import { slugify } from '@/lib/slug'

export type ProductHierarchyRow = {
  level1: string
  level2: string
  level3: string
  productName: string
  brand: string
  catNo: string
  citationNote: string
  sourceNote: string
}

function unicodeSlug(value: string) {
  return Array.from(value.trim())
    .map((character) => `u${character.codePointAt(0)?.toString(16)}`)
    .join('-')
}

export function hierarchyCategorySlug(level: number, name: string, parentPath = '') {
  const part = slugify(name) || unicodeSlug(name)
  return [level, parentPath, part].filter(Boolean).join('-')
}

export function normalizeHierarchyRows(rows: Array<Record<string, unknown>>): ProductHierarchyRow[] {
  let level1 = ''
  let level2 = ''
  return rows.flatMap((row) => {
    level1 = String(row.level1 || level1).trim()
    level2 = String(row.level2 || level2).trim()
    const level3 = String(row.level3 || '').trim()
    const productName = String(row.productName || '').trim()
    if (!level1 || !level2 || !level3 || !productName) return []
    return [{ level1, level2, level3, productName, brand: String(row.brand || '').trim(), catNo: String(row.catNo || '').trim(), citationNote: String(row.citationNote || '').trim(), sourceNote: String(row.sourceNote || '').trim() }]
  })
}

export function hierarchySummary(rows: ProductHierarchyRow[]) {
  return {
    products: rows.length,
    level1: new Set(rows.map((row) => row.level1)).size,
    level2: new Set(rows.map((row) => `${row.level1}\u0000${row.level2}`)).size,
    level3: new Set(rows.map((row) => `${row.level1}\u0000${row.level2}\u0000${row.level3}`)).size
  }
}
