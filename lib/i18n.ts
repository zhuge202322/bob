export const locales = ['en', 'zh', 'ru'] as const
export type Locale = (typeof locales)[number]

export function parseLocale(value?: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : 'en'
}

export function localizePath(pathname: string, locale: Locale) {
  const parts = pathname.split('/').filter(Boolean)
  if (locales.includes(parts[0] as Locale)) parts.shift()
  return `/${locale}${parts.length ? `/${parts.join('/')}` : ''}`
}

export function localized<T>(locale: Locale, values: { en: T; zh: T; ru: T }): T {
  return values[locale] ?? values.en
}
