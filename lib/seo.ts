import type { Locale } from './i18n'
export function localeAlternates(base: string, locale: Locale, pathname = '') {
  const root = base.replace(/\/$/, '')
  const suffix = pathname.startsWith('/') ? pathname : `/${pathname}`
  return { canonical: `${root}/${locale}${suffix}`, languages: { en: `${root}/en${suffix}`, 'zh-CN': `${root}/zh${suffix}`, 'ru-RU': `${root}/ru${suffix}`, 'x-default': `${root}/en${suffix}` } }
}
