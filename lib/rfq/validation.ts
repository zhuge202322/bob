import { z } from 'zod'

const optionalText = z.string().trim().max(500).optional().default('')

export const rfqSchema = z.object({
  customerType: z.enum(['END_USER', 'DISTRIBUTOR', 'OTHER']).default('END_USER'),
  company: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(100).default('Not provided'),
  email: z.string().trim().email().max(200),
  messenger: optionalText,
  country: z.string().trim().min(2).max(100).default('Not provided'),
  city: z.string().trim().min(2).max(100).default('Not provided'),
  brand: optionalText,
  catNo: optionalText,
  productDescription: z.string().trim().min(3).max(5000),
  quantity: z.string().trim().max(200).default(''),
  temperature: z.enum(['AMBIENT', '2_8', 'MINUS_20', 'UNKNOWN']).default('UNKNOWN'),
  desiredDeliveryDate: z.string().trim().optional().default(''),
  notes: z.string().trim().max(5000).optional().default(''),
  locale: z.enum(['en', 'zh', 'ru']).default('en'),
  sourcePath: z.string().trim().max(300).default('/en/rfq'),
  consent: z.literal(true),
  website: z.string().max(0).optional().default('')
})

export type RfqInput = z.infer<typeof rfqSchema>
