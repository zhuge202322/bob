import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { hierarchyCategorySlug, normalizeHierarchyRows, hierarchySummary } from '../lib/product-hierarchy'

const prisma = new PrismaClient()
const lineFor = (level1: string) => level1 === '科研试剂' ? 'Reagents' : 'Consumables'
const manualImages = {
  Reagents: [
    '/manuals/reagents/01-i1b96fe9d9ba6c8e3c6060a90b02365bb1.jpg',
    '/manuals/reagents/02-i7c7b137275919d7fffc81c0e39f5318e1.jpg',
    '/manuals/reagents/03-ib48b72e09e4ad533a282e11c172de7461.jpg',
    '/manuals/reagents/04-ic1299ceb7c4c8feb17e6e3c8e469492c1.jpg',
    '/manuals/reagents/05-id498c1e266452c586f4d0d29ba05ae3c1.jpg',
    '/manuals/reagents/06-i0a7b18fe87214813670dd8da8e95443e1.jpg',
    '/manuals/reagents/07-i8a47786f004a51a8039e9921a084a2301.jpg',
    '/manuals/reagents/08-i642b62d82de91b9ef8291ad826dba4a11.jpg'
  ],
  Consumables: [
    '/manuals/consumables/00-i8346f2024cc5ff366f1ccf18ae4951df1.jpg',
    '/manuals/consumables/01-i6baca1811ac6bd491da75573b642d8da1.jpg',
    '/manuals/consumables/02-i1491b2048528bd9a975745e5221802a01.jpg',
    '/manuals/consumables/03-ib58adaf19312d335a4288f73367eb9701.jpg',
    '/manuals/consumables/04-ie4d8ab290605a4add3e551cd8cc594651.jpg',
    '/manuals/consumables/05-i83e04d2813b19e48d948255730e20c6b1.jpg',
    '/manuals/consumables/06-id98146026ee71ddf36b34f1b26f89ac71.jpg',
    '/manuals/consumables/07-id57679c2fc7a2fdc06c838c71df9a7aa1.jpg',
    '/manuals/consumables/08-ia28cce65388516f41dbe07ec80a5a09a1.jpg'
  ]
} as const
const imageFor = (line: string, level2Index = 0) => manualImages[line as keyof typeof manualImages][level2Index] || manualImages[line as keyof typeof manualImages][0]

async function main() {
  execFileSync(process.env.PYTHON || 'python', ['scripts/convert-product-workbook.py'], { stdio: 'inherit' })
  const rows = normalizeHierarchyRows(JSON.parse(await readFile(path.join('storage', 'product-workbook.json'), 'utf8')))
  const summary = hierarchySummary(rows)
  const level2Index = new Map<string, number>()
  const lineCounters = new Map<string, number>()
  for (const key of [...new Set(rows.map((row) => `${row.level1}\u0000${row.level2}`))]) {
    const [level1] = key.split('\u0000')
    const index = lineCounters.get(level1) || 0
    level2Index.set(key, index)
    lineCounters.set(level1, index + 1)
  }
  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany({})
    await tx.productCategory.deleteMany({})
    const level1Ids = new Map<string, number>()
    const level2Ids = new Map<string, number>()
    const level3Ids = new Map<string, number>()
    let order = 0
    for (const name of [...new Set(rows.map((row) => row.level1))]) {
      const line = lineFor(name)
      const firstImage = line === 'Reagents' ? '/manuals/reagents/00-i758290f093508846081afea3db2597471.jpg' : imageFor(line, 0)
      const row = await tx.productCategory.create({ data: { name, nameZh: name, nameRu: name, slug: hierarchyCategorySlug(1, name) || `1-${++order}`, line, level: 1, description: `${name} product portfolio`, descriptionZh: `${name}产品体系`, descriptionRu: name, imageUrl: firstImage, sortOrder: ++order } })
      level1Ids.set(name, row.id)
    }
    for (const name of [...new Set(rows.map((row) => `${row.level1}\u0000${row.level2}`))]) {
      const [level1, level2] = name.split('\u0000')
      const parentId = level1Ids.get(level1)
      if (!parentId) continue
      const parentSlug = hierarchyCategorySlug(1, level1)
      const line = lineFor(level1)
      const row = await tx.productCategory.create({ data: { name: level2, nameZh: level2, nameRu: level2, slug: hierarchyCategorySlug(2, level2, parentSlug), line, level: 2, parentId, description: `${level2} category`, descriptionZh: `${level2}产品分类`, descriptionRu: level2, imageUrl: imageFor(line, level2Index.get(name) || 0), sortOrder: ++order } })
      level2Ids.set(name, row.id)
    }
    for (const name of [...new Set(rows.map((row) => `${row.level1}\u0000${row.level2}\u0000${row.level3}`))]) {
      const [level1, level2, level3] = name.split('\u0000')
      const parentId = level2Ids.get(`${level1}\u0000${level2}`)
      if (!parentId) continue
      const parentSlug = hierarchyCategorySlug(2, level2, hierarchyCategorySlug(1, level1))
      const line = lineFor(level1)
      const row = await tx.productCategory.create({ data: { name: level3, nameZh: level3, nameRu: level3, slug: hierarchyCategorySlug(3, level3, parentSlug), line, level: 3, parentId, description: `${level3} products`, descriptionZh: `${level3}产品`, descriptionRu: level3, imageUrl: imageFor(line, level2Index.get(`${level1}\u0000${level2}`) || 0), sortOrder: ++order } })
      level3Ids.set(name, row.id)
    }
    for (const [index, item] of rows.entries()) {
      const categoryId = level3Ids.get(`${item.level1}\u0000${item.level2}\u0000${item.level3}`)
      if (!categoryId) continue
      const line = lineFor(item.level1)
      await tx.product.create({ data: { name: item.productName, nameZh: item.productName, nameRu: item.productName, slug: `product-${index + 1}-${item.catNo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, categoryId, brand: item.brand, catNo: item.catNo, specification: item.citationNote, description: item.citationNote, descriptionZh: item.citationNote, descriptionRu: item.citationNote, application: item.level3, citationNote: item.citationNote, sourceNote: item.sourceNote, temperature: 'Confirm per item', imageUrl: imageFor(line, level2Index.get(`${item.level1}\u0000${item.level2}`) || 0), status: 'PUBLISHED' } })
    }
  })
  console.log(`Imported ${summary.products} products, ${summary.level1} level-1 categories, ${summary.level2} level-2 categories and ${summary.level3} level-3 categories.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
