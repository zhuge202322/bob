import { describe, expect, it } from 'vitest'
import { createUserSchema, publicUserSelect, updateUserSchema } from '@/lib/admin/users'

describe('admin user management validation', () => {
  it('normalizes email and accepts only supported roles', () => {
    const result = createUserSchema.parse({ email: 'Admin@Example.COM ', name: 'Admin', password: 'a-secure-password', role: 'ADMIN', active: true })
    expect(result.email).toBe('admin@example.com')
    expect(() => createUserSchema.parse({ ...result, password: 'a-secure-password', role: 'OWNER' })).toThrow()
  })

  it('requires a real update and never selects the password hash', () => {
    expect(updateUserSchema.safeParse({ id: 1 }).success).toBe(false)
    expect(updateUserSchema.safeParse({ id: 1, active: false }).success).toBe(true)
    expect('passwordHash' in publicUserSelect).toBe(false)
  })
})
