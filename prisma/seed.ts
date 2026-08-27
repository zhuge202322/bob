import { PrismaClient } from '@prisma/client'
import { categories } from '../lib/data'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categoryTranslations: Record<string, { zh: string; ru: string }> = {
  'Molecular Biology': { zh: '分子生物学试剂', ru: 'Реагенты для молекулярной биологии' },
  'Cell Biology': { zh: '细胞生物学试剂', ru: 'Реагенты для клеточной биологии' },
  'Protein & Biochemistry': { zh: '蛋白质与生化试剂', ru: 'Белки и биохимия' },
  Immunology: { zh: '免疫学试剂', ru: 'Иммунология' },
  Microbiology: { zh: '微生物培养与鉴定试剂', ru: 'Микробиология' },
  'Nucleic Acid Purification': { zh: '核酸与蛋白纯化试剂', ru: 'Очистка нуклеиновых кислот' },
  'Staining & Detection': { zh: '染色与显色试剂', ru: 'Окрашивание и детекция' },
  'Buffers & Solutions': { zh: '缓冲液与常用溶液', ru: 'Буферы и растворы' },
  'General Lab Consumables': { zh: '通用基础实验耗材', ru: 'Общие лабораторные расходные материалы' },
  'Cell Culture Consumables': { zh: '细胞生物学专用耗材', ru: 'Расходные материалы для клеточной культуры' },
  'Molecular Biology Consumables': { zh: '分子生物学专用耗材', ru: 'Расходные материалы для молекулярной биологии' },
  'Protein & Biochemistry Consumables': { zh: '蛋白质与生物化学耗材', ru: 'Расходные материалы для белков и биохимии' },
  'Microbiology & Histopathology': { zh: '微生物与组织病理耗材', ru: 'Микробиология и гистопатология' },
  'Filtration & Chromatography': { zh: '过滤纯化与色谱分析耗材', ru: 'Фильтрация и хроматография' },
  'Sample Storage': { zh: '样本采集与低温存储耗材', ru: 'Сбор и хранение образцов' },
  'Safety & Animal Research': { zh: '安全防护与动物实验耗材', ru: 'Безопасность и исследования на животных' }
}

const categoryImages: Record<string, string> = {
  'Molecular Biology': '/products/molecular-biology.jpg', 'Cell Biology': '/products/cell-culture.jpg',
  'Protein & Biochemistry': '/products/protein-biochemistry.jpg', Immunology: '/products/microscopy.jpg',
  Microbiology: '/products/lab-consumables.jpg', 'Nucleic Acid Purification': '/products/molecular-biology.jpg',
  'Staining & Detection': '/products/microscopy.jpg', 'Buffers & Solutions': '/products/quality-control.jpg',
  'General Lab Consumables': '/products/lab-consumables.jpg', 'Cell Culture Consumables': '/products/cell-culture.jpg',
  'Molecular Biology Consumables': '/products/molecular-biology.jpg', 'Protein & Biochemistry Consumables': '/products/protein-biochemistry.jpg',
  'Microbiology & Histopathology': '/products/microscopy.jpg', 'Filtration & Chromatography': '/products/quality-control.jpg',
  'Sample Storage': '/products/cold-chain.jpg', 'Safety & Animal Research': '/products/lab-consumables.jpg'
}

async function main() {
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: { siteName: 'Zehongyan Biotech', siteNameZh: 'Zehongyan Biotech', siteNameRu: 'Zehongyan Biotech' }, create: { id: 1, siteName: 'Zehongyan Biotech', siteNameZh: 'Zehongyan Biotech', siteNameRu: 'Zehongyan Biotech' } })
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hocore.bio'
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-before-production'
  await prisma.user.upsert({ where: { email: adminEmail }, update: {}, create: { email: adminEmail, name: 'Site Administrator', role: 'ADMIN', passwordHash: await bcrypt.hash(adminPassword, 12) } })
  if (await prisma.productCategory.count() === 0) {
    await prisma.productCategory.createMany({ data: categories.map((item, index) => ({ name: item.title, line: item.kind, description: item.detail, sortOrder: index + 1 })) })
  }
  for (const [name, translation] of Object.entries(categoryTranslations)) {
    await prisma.productCategory.updateMany({ where: { name }, data: { nameZh: translation.zh, nameRu: translation.ru, imageUrl: categoryImages[name] || '' } })
  }
  if (await prisma.product.count() === 0) {
    const seededProducts = [
      ['Molecular Biology', '2× Universal PCR Master Mix', 'Vazyme', 'P112-01', 'PCR / qPCR', '/products/molecular-biology.jpg'],
      ['Cell Biology', 'Fetal Bovine Serum, Premium', 'Gibco', '10099-141', 'Cell culture', '/products/cell-culture.jpg'],
      ['Protein & Biochemistry', 'BCA Protein Assay Kit', 'Thermo Scientific', '23225', 'Protein quantification', '/products/protein-biochemistry.jpg'],
      ['Immunology', 'Goat Anti-Rabbit IgG Secondary Antibody', 'Jackson ImmunoResearch', '111-035-144', 'Western blot / IHC', '/products/microscopy.jpg'],
      ['Microbiology', 'LB Broth, Molecular Biology Grade', 'Solarbio', 'L8290', 'Bacterial culture', '/products/lab-consumables.jpg'],
      ['Nucleic Acid Purification', 'Magnetic Beads for DNA Cleanup', 'BeaverBeads', 'BEAVERBEADS-01', 'DNA purification', '/products/molecular-biology.jpg'],
      ['Staining & Detection', 'DAPI Fluorescent Stain', 'Beyotime', 'C1002', 'Fluorescence microscopy', '/products/microscopy.jpg'],
      ['Buffers & Solutions', '10× TBS Buffer', 'Yeasen', 'B541017', 'Routine molecular workflows', '/products/quality-control.jpg'],
      ['General Lab Consumables', 'Low Retention Pipette Tips, 10 μL', 'Eppendorf', '0030073312', 'Liquid handling', '/products/lab-consumables.jpg'],
      ['Cell Culture Consumables', 'T75 Tissue Culture Flask', 'Corning', '430641', 'Mammalian cell culture', '/products/cell-culture.jpg'],
      ['Molecular Biology Consumables', '96-Well PCR Plate, Low Profile', 'Bio-Rad', 'MLL9601', 'PCR / qPCR', '/products/molecular-biology.jpg'],
      ['Protein & Biochemistry Consumables', 'PVDF Transfer Membrane 0.22 μm', 'Merck', 'IPVH00010', 'Western blot', '/products/protein-biochemistry.jpg'],
      ['Microbiology & Histopathology', 'Microscope Slides, Positive Charge', 'CITOTEST', '188105', 'Histology', '/products/microscopy.jpg'],
      ['Filtration & Chromatography', 'Syringe Filter PES 0.22 μm', 'Sartorius', '16534', 'Sample filtration', '/products/quality-control.jpg'],
      ['Sample Storage', 'Cryogenic Vial 2 mL, External Thread', 'NEST', '607001', '−80°C storage', '/products/cold-chain.jpg'],
      ['Safety & Animal Research', 'Nitrile Examination Gloves', 'Ansell', '92-600', 'Laboratory PPE', '/products/lab-consumables.jpg']
    ]
    const categoryRows = await prisma.productCategory.findMany({ select: { id: true, name: true } })
    await prisma.product.createMany({ data: seededProducts.flatMap(([categoryName, name, brand, catNo, application, imageUrl], index) => { const category = categoryRows.find((item) => item.name === categoryName); return category ? [{ name, categoryId: category.id, brand, catNo, specification: application, application, description: `${name} for ${application.toLowerCase()} workflows.`, imageUrl, status: 'PUBLISHED', slug: `${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${index + 1}` }] : [] }) })
  }
  if (await prisma.contact.count() === 0) {
    await prisma.contact.createMany({ data: [
      { type: 'Phone', label: 'Luo', value: '+86 185 7584 8378', href: 'tel:+861857548378', sortOrder: 1 },
      { type: 'Phone', label: 'Bob', value: '+86 130 1853 7275', href: 'tel:+8613018537275', sortOrder: 2 },
      { type: 'Email', label: 'Business email', value: 'zehongyan2025@outlook.com', href: 'mailto:zehongyan2025@outlook.com', sortOrder: 3 }
    ] })
  }
  if (await prisma.socialLink.count() === 0) {
    await prisma.socialLink.createMany({ data: [
      { platform: 'WhatsApp', url: 'https://wa.me/861857548378', sortOrder: 1 },
      { platform: 'VK', url: 'https://vk.com/', sortOrder: 2 }
    ] })
  }
  if (await prisma.pageSection.count() === 0) {
    await prisma.pageSection.createMany({ data: [
      { pageKey: 'home', sectionKey: 'hero-1', title: 'Reliable access to research reagents and lab consumables', imageUrl: '/hero-lab.jpg', sortOrder: 1, status: 'PUBLISHED', publishedAt: new Date() },
      { pageKey: 'home', sectionKey: 'hero-2', title: 'Temperature-aware logistics for every critical shipment', imageUrl: '/hero-cold.jpg', sortOrder: 2, status: 'PUBLISHED', publishedAt: new Date() },
      { pageKey: 'home', sectionKey: 'hero-3', title: 'From brand and CAT No. to a complete supply plan', imageUrl: '/hero-procurement.jpg', sortOrder: 3, status: 'PUBLISHED', publishedAt: new Date() }
    ] })
  }
  if (await prisma.heroSlide.count() === 0) {
    await prisma.heroSlide.createMany({ data: [
      { kicker: 'GLOBAL LIFE SCIENCE SOURCING', title: 'Reliable access to research reagents and lab consumables', body: 'Global brands. One procurement partner. Compliant delivery across Russia.', imageUrl: '/hero-lab.jpg', ctaLabel: 'Request a quote', sortOrder: 1, status: 'PUBLISHED', publishedAt: new Date() },
      { kicker: 'CONTROLLED DELIVERY', title: 'Temperature-aware logistics for every critical shipment', body: 'Ambient, 2–8°C and -20°C routes with traceable handover documentation.', imageUrl: '/hero-cold.jpg', ctaLabel: 'Request a quote', sortOrder: 2, status: 'PUBLISHED', publishedAt: new Date() },
      { kicker: 'A CLEARER PROCUREMENT PATH', title: 'From brand and CAT No. to a complete supply plan', body: 'Send a specification or purchase list. Our sourcing desk returns options, timing and documents.', imageUrl: '/hero-procurement.jpg', ctaLabel: 'Request a quote', sortOrder: 3, status: 'PUBLISHED', publishedAt: new Date() }
    ] })
  }
  if (await prisma.article.count() === 0) {
    await prisma.article.createMany({ data: [
      { topic: 'Procurement Guide', slug: 'prepare-a-clear-sourcing-request', title: 'How to prepare a sourcing request that gets a clear answer', titleZh: '如何准备一份能得到明确回复的寻源需求', titleRu: 'Как подготовить запрос и получить точный ответ', summary: 'The essential fields for brand, CAT No., pack size, quantity and delivery.', summaryZh: '品牌、CAT No.、包装规格、数量和交付信息的关键字段。', summaryRu: 'Ключевые поля: бренд, CAT No., фасовка, количество и доставка.', body: 'Start with the exact product identity whenever possible: brand, catalogue number and pack size. Add the quantity, delivery city and desired date.\n\nFor temperature-sensitive products, include the required storage lane. Attach the original purchase list when several brands are involved.\n\nA complete brief lets the sourcing desk verify availability, documentation and delivery together instead of resolving missing fields one by one.', coverImageUrl: '/products/molecular-biology.jpg', status: 'PUBLISHED' },
      { topic: 'Storage & Shipping', slug: 'choose-the-right-temperature-lane', title: 'Choosing the right temperature lane for laboratory products', titleZh: '如何为实验室产品选择正确温区', titleRu: 'Как выбрать температурный режим для лабораторных продуктов', summary: 'Ambient, 2–8°C and -20°C are different logistics workflows, not just labels.', summaryZh: '常温、2–8°C 和 -20°C 是不同的物流流程，而不仅是标签。', summaryRu: 'Ambient, 2–8°C и -20°C — разные логистические процессы.', body: 'The temperature lane should follow the manufacturer storage statement and the planned transit time. Packaging, coolant and handover steps are selected from that requirement.\n\nAt receipt, compare the shipment condition with the expected lane and preserve any temperature record or packing document.\n\nIf a product can tolerate a temporary excursion, rely on documented manufacturer guidance rather than an informal assumption.', coverImageUrl: '/products/cold-chain.jpg', status: 'PUBLISHED' },
      { topic: 'Quality Documents', slug: 'coa-tds-sds-explained', title: 'COA, TDS and SDS: what each document tells you', titleZh: 'COA、TDS 和 SDS 分别说明什么', titleRu: 'COA, TDS и SDS: что сообщает каждый документ', summary: 'Use the right document for identity, technical specification and safe handling.', summaryZh: '分别使用对应文件核验身份、技术规格和安全操作。', summaryRu: 'Используйте правильный документ для идентичности, спецификации и безопасности.', body: 'A Certificate of Analysis normally records batch-specific results or release information. A Technical Data Sheet describes product characteristics and use. A Safety Data Sheet focuses on hazards, handling and emergency information.\n\nNot every consumable requires all three documents, and availability varies by brand and product.\n\nRequest documents by exact CAT No. and, when relevant, batch so the file matches the supplied item.', coverImageUrl: '/products/quality-control.jpg', status: 'PUBLISHED' },
      { topic: 'Receiving Guide', slug: 'cold-chain-receipt-checklist', title: 'Cold-chain receipt checklist for research laboratories', titleZh: '科研实验室冷链收货检查清单', titleRu: 'Чек-лист приёмки холодовой цепи для лаборатории', summary: 'What to record when a refrigerated or frozen shipment arrives.', summaryZh: '冷藏或冷冻货物到达时需要记录的事项。', summaryRu: 'Что зафиксировать при получении охлаждённой или замороженной отправки.', body: 'Confirm the package identity before opening and note the delivery time. Inspect the external condition, coolant and product packaging.\n\nMove products to the required storage condition promptly. Retain temperature records and shipping documents with the procurement file.\n\nReport visible damage, thawing or a temperature concern before using the product so the supply team can investigate against the handover record.', coverImageUrl: '/products/cold-chain.jpg', status: 'PUBLISHED' }
    ] })
  }
  if (await prisma.faq.count() === 0) {
    await prisma.faq.createMany({ data: [
      { topic: 'Sourcing', question: 'Can you source a specified brand and CAT No.?', questionZh: '可以按指定品牌和 CAT No. 寻源吗？', questionRu: 'Можно найти продукт по бренду и CAT No.?', answer: 'Yes. Send the exact brand, catalogue number, pack size and quantity. We will confirm availability, documents and delivery route.', answerZh: '可以。请提交品牌、目录号、包装规格和数量，我们将确认货期、文件和交付路径。', answerRu: 'Да. Укажите бренд, каталожный номер, фасовку и количество — мы подтвердим срок, документы и маршрут.', sortOrder: 1 },
      { topic: 'Documents', question: 'Which quality documents can be provided?', questionZh: '可以提供哪些质量文件？', questionRu: 'Какие документы качества доступны?', answer: 'COA, TDS, SDS and product statements are supplied where they exist for the exact item and source. Availability is confirmed before dispatch.', answerZh: '可按具体产品和来源提供存在的 COA、TDS、SDS 及产品声明，发货前确认。', answerRu: 'COA, TDS, SDS и заявления предоставляются при наличии для конкретной позиции; доступность подтверждается до отправки.', sortOrder: 2 },
      { topic: 'Delivery', question: 'How are refrigerated and frozen products shipped?', questionZh: '冷藏和冷冻产品如何运输？', questionRu: 'Как перевозятся охлаждённые и замороженные продукты?', answer: 'The lane is selected from the product requirement: ambient, 2–8°C or -20°C. Packaging and handover documents are matched to that lane.', answerZh: '根据产品要求选择常温、2–8°C 或 -20°C 温区，并匹配包装和交接文件。', answerRu: 'Режим выбирается по продукту: Ambient, 2–8°C или -20°C; упаковка и документы соответствуют режиму.', sortOrder: 3 },
      { topic: 'Commercial', question: 'Why are prices and stock not shown publicly?', questionZh: '为什么不公开展示价格和库存？', questionRu: 'Почему цены и остатки не показаны публично?', answer: 'This is a B2B sourcing catalogue. Price, availability and lead time depend on the exact item, quantity, source, documents and delivery city.', answerZh: '这是 B2B 寻源目录，价格、货期和库存取决于具体型号、数量、来源、文件和交付城市。', answerRu: 'Это B2B-каталог. Цена, наличие и срок зависят от позиции, количества, источника, документов и города.', sortOrder: 4 }
    ] })
  }
}

main().finally(() => prisma.$disconnect())
