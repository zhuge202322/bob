import { z } from 'zod'

const text = (max = 500) => z.string().trim().max(max)
const optionalText = (max = 500) => text(max).optional()
const externalUrl = z.string().trim().url().or(z.literal(''))
const assetPath = text(500).refine((value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value), 'Invalid asset URL')
const safeHref = text(500).refine((value) => value === '' || value.startsWith('/') || /^(https?:|mailto:|tel:)/i.test(value), 'Invalid link URL')

const category = z.object({
  name: text(160), nameZh: optionalText(160), nameRu: optionalText(160), slug: optionalText(180),
  line: text(120), description: optionalText(5000), descriptionZh: optionalText(5000), descriptionRu: optionalText(5000),
  specifications: optionalText(5000), brands: optionalText(1000), temperature: text(40).default('AMBIENT'), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  imageUrl: assetPath, sortOrder: z.number().int().min(-100000).max(100000)
}).strict()

const product = z.object({
  name: text(200), nameZh: optionalText(200), nameRu: optionalText(200), slug: optionalText(220), categoryId: z.number().int().positive(),
  brand: optionalText(160), catNo: optionalText(160), specification: optionalText(5000), description: optionalText(5000),
  descriptionZh: optionalText(5000), descriptionRu: optionalText(5000), application: optionalText(2000), temperature: text(40), imageUrl: assetPath,
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT')
}).strict()

const contact = z.object({ type: text(40), label: text(120), value: text(300), href: safeHref, enabled: z.boolean(), sortOrder: z.number().int().min(-100000).max(100000) }).strict()
const social = z.object({ platform: text(40), url: externalUrl, displayValue: optionalText(160), imageUrl: assetPath, enabled: z.boolean(), sortOrder: z.number().int().min(-100000).max(100000) }).strict()
const section = z.object({
  pageKey: text(120), sectionKey: text(120), title: optionalText(300), titleZh: optionalText(300), titleRu: optionalText(300),
  body: optionalText(10000), bodyZh: optionalText(10000), bodyRu: optionalText(10000), ctaLabel: optionalText(120), ctaHref: safeHref,
  imageUrl: assetPath, enabled: z.boolean(), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'), sortOrder: z.number().int().min(-100000).max(100000)
}).strict()
const article = z.object({
  topic: text(120), title: text(300), titleZh: optionalText(300), titleRu: optionalText(300), slug: text(220), summary: optionalText(5000), summaryZh: optionalText(5000), summaryRu: optionalText(5000),
  body: optionalText(30000), bodyZh: optionalText(30000), bodyRu: optionalText(30000), coverImageUrl: assetPath, reviewer: optionalText(200), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
}).strict()
const faq = z.object({ topic: text(120), question: text(500), questionZh: optionalText(500), questionRu: optionalText(500), answer: text(10000), answerZh: optionalText(10000), answerRu: optionalText(10000), sortOrder: z.number().int().min(-100000).max(100000), enabled: z.boolean() }).strict()

const heroSlide = z.object({
  kicker: optionalText(200), kickerZh: optionalText(200), kickerRu: optionalText(200), title: text(300), titleZh: optionalText(300), titleRu: optionalText(300),
  body: optionalText(5000), bodyZh: optionalText(5000), bodyRu: optionalText(5000), imageUrl: assetPath, mobileImageUrl: assetPath.optional().default(''),
  focalPoint: text(40).optional().default('50% 50%'), ctaLabel: optionalText(120), ctaLabelZh: optionalText(120), ctaLabelRu: optionalText(120),
  ctaHref: safeHref, enabled: z.boolean(), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'), sortOrder: z.number().int().min(-100000).max(100000)
}).strict()

const schemas = { categories: category, products: product, contacts: contact, socials: social, sections: section, articles: article, faqs: faq, heroSlides: heroSlide } as const
export type ContentCollection = keyof typeof schemas

export function isContentCollection(value: unknown): value is ContentCollection {
  return typeof value === 'string' && value in schemas
}

export function requiresPublicRevalidation(value: unknown) {
  return isContentCollection(value)
}

export function validateContentPayload(collection: string, data: unknown, partial = false) {
  const schema = schemas[collection as ContentCollection]
  if (!schema) return z.never().safeParse(data)
  return (partial ? schema.partial() : schema).safeParse(data)
}

/** Fields returned by Prisma that the browser may echo but must never be written. */
export function stripContentReadOnlyFields(data: unknown) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data
  const readOnly = new Set(['id', 'createdAt', 'updatedAt', 'publishedAt', 'deletedAt', 'attachments', 'internalNotes', 'consentAt', 'idempotencyKey'])
  return Object.fromEntries(Object.entries(data).filter(([key]) => !readOnly.has(key)))
}
