import type { Locale } from './i18n'

export const clinicalPrecision = {
  colors: {
    primary: '#006b47',
    accent: '#00875a',
    background: '#f7faf8',
    surface: '#ffffff',
    ink: '#181c1b',
    muted: '#3e4942',
    border: '#bdcac0'
  },
  containerMax: 1280,
  radius: 4
} as const

type LocalizedLabel = Record<Locale, string>

export const publicNavigation: Array<{ href: string; label: LocalizedLabel }> = [
  { href: '/products', label: { en: 'Products', zh: '产品中心', ru: 'Продукты' } },
  { href: '/solutions', label: { en: 'Services', zh: '采购服务', ru: 'Услуги' } },
  { href: '/quality', label: { en: 'Quality', zh: '质量与合规', ru: 'Качество' } },
  { href: '/resources', label: { en: 'Resources', zh: '资源中心', ru: 'Ресурсы' } },
  { href: '/about', label: { en: 'About', zh: '关于我们', ru: 'О компании' } },
  { href: '/contact', label: { en: 'Contact', zh: '联系我们', ru: 'Контакты' } }
]

export const networkHotspots = [
  { id: 'north-america', x: 23, y: 47 },
  { id: 'south-america', x: 35, y: 76 },
  { id: 'europe', x: 51, y: 39 },
  { id: 'china', x: 70, y: 50 },
  { id: 'southeast-asia', x: 76, y: 66 },
  { id: 'australia', x: 83, y: 81 }
] as const

const unsupportedClaims = [
  /iso\s*9001(?::?2015)?\s*certified/i,
  /iso\/?iec\s*17025\s*accredited/i
]

export function isUnsupportedPublicClaim(value: string) {
  return unsupportedClaims.some((claim) => claim.test(value))
}
