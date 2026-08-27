import type { Locale } from '@/lib/i18n'

export type PublishableRecord = { status?: string; deletedAt?: Date | null }

export function isPublished(record: PublishableRecord) {
  return record.status === 'PUBLISHED' && !record.deletedAt
}

export function getLocalizedValue(values: { en?: string | null; zh?: string | null; ru?: string | null }, locale: Locale) {
  const value = values[locale]
  return typeof value === 'string' ? value : ''
}
