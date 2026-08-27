import { z } from 'zod'

export const adminRoles = ['ADMIN', 'EDITOR', 'RFQ_OPERATOR'] as const

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase())
const password = z.string().min(10).max(128)

export const createUserSchema = z.object({
  email,
  name: z.string().trim().min(1).max(120),
  password,
  role: z.enum(adminRoles),
  active: z.boolean().default(true)
}).strict()

export const updateUserSchema = z.object({
  id: z.number().int().positive(),
  email: email.optional(),
  name: z.string().trim().min(1).max(120).optional(),
  password: password.optional(),
  role: z.enum(adminRoles).optional(),
  active: z.boolean().optional()
}).strict().refine((value) => Object.keys(value).some((key) => key !== 'id'), {
  message: 'At least one field must be updated'
})

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true
} as const
