import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { hierarchyCategorySlug } from '../lib/product-hierarchy'

type PdfRow = {
  level1: string; level1Zh: string; level1Ru: string
  level2: string; level2Zh: string; level2Ru: string
  level3: string; level3Zh: string; level3Ru: string
  productName: string; productNameZh: string; productNameRu: string
  brand: string; catNo: string
  specification: string; specificationZh: string; specificationRu: string
  storage: string; storageZh: string; storageRu: string
  type: string; typeZh: string; typeRu: string
  features: string; featuresZh: string; featuresRu: string
  application: string; applicationZh: string; applicationRu: string
  shipping: string; shippingZh: string; shippingRu: string
  packaging: string; packagingZh: string; packagingRu: string
  sourceNote: string; imageUrl: string
}

const prisma = new PrismaClient()
const lineFor = (level1: string) => level1 === 'Research Reagents' ? 'Reagents' : 'Consumables'
const joinSpec = (row: PdfRow, lang: 'en' | 'zh' | 'ru') => {
  const suffix = lang === 'en' ? '' : lang === 'zh' ? 'Zh' : 'Ru'
  const get = (key: keyof PdfRow) => String(row[`${key}${suffix}` as keyof PdfRow] || '')
  const labels = lang === 'en'
    ? ['Type', 'Features', 'Storage', 'Shipping', 'Packaging']
    : lang === 'zh' ? ['类型', '特性', '储存', '运输', '包装'] : ['Тип', 'Характеристики', 'Хранение', 'Транспортировка', 'Упаковка']
  return [
    `${labels[0]}: ${get('type')}`,
    `${labels[1]}: ${get('features')}`,
    `${labels[2]}: ${get('storage')}`,
    `${labels[3]}: ${get('shipping')}`,
    `${labels[4]}: ${get('packaging')}`
  ].filter((item) => !item.endsWith(': ')).join(' · ')
}

async function main() {
  execFileSync(process.env.PYTHON || 'python', ['scripts/extract-product-pdfs.py'], { stdio: 'inherit' })
  const rows = JSON.parse(await readFile('storage/product-pdf-import.json', 'utf8')) as PdfRow[]
  if (rows.length !== 450) throw new Error(`Expected 450 rows, got ${rows.length}`)

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany({})
    await tx.productCategory.deleteMany({ where: { level: 3 } })
    await tx.productCategory.deleteMany({ where: { level: 2 } })
    await tx.productCategory.deleteMany({ where: { level: 1 } })
    await tx.productCategory.deleteMany({})

    const level1Ids = new Map<string, number>()
    const level2Ids = new Map<string, number>()
    const level3Ids = new Map<string, number>()
    const firstImage = new Map<string, string>()
    for (const row of rows) {
      const key2 = `${row.level1}\u0000${row.level2}`
      const key3 = `${key2}\u0000${row.level3}`
      if (!firstImage.has(key2)) firstImage.set(key2, row.imageUrl)
      if (!firstImage.has(key3)) firstImage.set(key3, row.imageUrl)
    }

    let sortOrder = 0
    for (const row of rows.filter((item, index, all) => all.findIndex((candidate) => candidate.level1 === item.level1) === index)) {
      const line = lineFor(row.level1)
      const created = await tx.productCategory.create({ data: {
        name: row.level1, nameZh: row.level1Zh, nameRu: row.level1Ru,
        slug: hierarchyCategorySlug(1, row.level1), line, level: 1,
        description: `${row.level1} portfolio`, descriptionZh: `${row.level1Zh}产品体系`, descriptionRu: row.level1Ru,
        imageUrl: row.imageUrl, sortOrder: ++sortOrder
      } })
      level1Ids.set(row.level1, created.id)
    }
    for (const row of rows.filter((item, index, all) => all.findIndex((candidate) => candidate.level1 === item.level1 && candidate.level2 === item.level2) === index)) {
      const parentId = level1Ids.get(row.level1)
      if (!parentId) continue
      const line = lineFor(row.level1)
      const created = await tx.productCategory.create({ data: {
        name: row.level2, nameZh: row.level2Zh, nameRu: row.level2Ru,
        slug: hierarchyCategorySlug(2, row.level2, hierarchyCategorySlug(1, row.level1)), line, level: 2, parentId,
        description: `${row.level2} category`, descriptionZh: `${row.level2Zh}产品分类`, descriptionRu: row.level2Ru,
        imageUrl: firstImage.get(`${row.level1}\u0000${row.level2}`) || row.imageUrl, sortOrder: ++sortOrder
      } })
      level2Ids.set(`${row.level1}\u0000${row.level2}`, created.id)
    }
    for (const row of rows.filter((item, index, all) => all.findIndex((candidate) => candidate.level1 === item.level1 && candidate.level2 === item.level2 && candidate.level3 === item.level3) === index)) {
      const key2 = `${row.level1}\u0000${row.level2}`
      const parentId = level2Ids.get(key2)
      if (!parentId) continue
      const created = await tx.productCategory.create({ data: {
        name: row.level3, nameZh: row.level3Zh, nameRu: row.level3Ru,
        slug: hierarchyCategorySlug(3, row.level3, hierarchyCategorySlug(2, row.level2, hierarchyCategorySlug(1, row.level1))), line: lineFor(row.level1), level: 3, parentId,
        description: `${row.level3} products`, descriptionZh: `${row.level3Zh}产品`, descriptionRu: row.level3Ru,
        imageUrl: firstImage.get(`${key2}\u0000${row.level3}`) || row.imageUrl, sortOrder: ++sortOrder
      } })
      level3Ids.set(`${key2}\u0000${row.level3}`, created.id)
    }

    for (const [index, row] of rows.entries()) {
      const categoryId = level3Ids.get(`${row.level1}\u0000${row.level2}\u0000${row.level3}`)
      if (!categoryId) continue
      const slugCat = row.catNo.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `item-${index + 1}`
      const description = `${row.features}. Application: ${row.application}`
      const descriptionZh = `${row.featuresZh}。应用：${row.applicationZh}`
      const descriptionRu = `${row.featuresRu}. Применение: ${row.applicationRu}`
      const technicalData = JSON.stringify({
        en: { type: row.type, features: row.features, application: row.application, shipping: row.shipping, packaging: row.packaging, specification: row.specification, storage: row.storage },
        zh: { type: row.typeZh, features: row.featuresZh, application: row.applicationZh, shipping: row.shippingZh, packaging: row.packagingZh, specification: row.specificationZh, storage: row.storageZh },
        ru: { type: row.typeRu, features: row.featuresRu, application: row.applicationRu, shipping: row.shippingRu, packaging: row.packagingRu, specification: row.specificationRu, storage: row.storageRu }
      })
      await tx.product.create({ data: {
        name: row.productName, nameZh: row.productNameZh, nameRu: row.productNameRu,
        slug: `product-${index + 1}-${slugCat}`, categoryId, brand: row.brand, catNo: row.catNo,
        specification: joinSpec(row, 'en'),
        description, descriptionZh: `${descriptionZh}。规格：${joinSpec(row, 'zh')}`, descriptionRu: `${descriptionRu}. Спецификация: ${joinSpec(row, 'ru')}`,
        application: row.application, citationNote: row.type, sourceNote: row.sourceNote,
        technicalData,
        temperature: row.storage || 'Confirm per item', imageUrl: row.imageUrl, status: 'PUBLISHED'
      } })
    }
  })
  console.log(`Imported ${rows.length} products from the September 2026 multilingual PDF catalogues.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
