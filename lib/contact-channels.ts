export const additionalPhone = {
  type: 'Phone',
  label: 'Additional phone',
  value: '+86 19372084145',
  href: 'tel:+8619372084145'
} as const

export const telegramChannel = {
  platform: 'Telegram',
  handle: '@BOBRICARDO001',
  url: 'https://t.me/BOBRICARDO001',
  qrImage: '/contact/telegram-bobricardo001.png'
} as const

export const maxChannel = {
  platform: 'Max',
  handle: 'luotan8888@qq.com',
  url: 'mailto:luotan8888@qq.com',
  qrImage: '/contact/max.png'
} as const

export type ManagedSocialChannel = {
  platform: string
  url: string
  displayValue?: string
  imageUrl?: string
}

export type CustomerServiceCard = {
  platform: 'WhatsApp' | 'VK' | 'Telegram' | 'Max'
  url: string
  displayValue: string
  imageUrl: string
}

export const customerServiceDefaults: CustomerServiceCard[] = [
  { platform: 'WhatsApp', url: 'https://wa.me/861857548378', displayValue: '+86 185 7584 8378', imageUrl: '' },
  { platform: 'VK', url: 'https://vk.com/', displayValue: '+86 130 1853 7275', imageUrl: '' },
  { platform: 'Telegram', url: telegramChannel.url, displayValue: telegramChannel.handle, imageUrl: telegramChannel.qrImage }
]

export function buildCustomerServiceCards(items: ManagedSocialChannel[]): CustomerServiceCard[] {
  return customerServiceDefaults.map((fallback) => {
    const managed = items.find((item) => item.platform.toLowerCase() === fallback.platform.toLowerCase())
    if (!managed) return fallback
    return {
      platform: fallback.platform,
      url: managed.url || fallback.url,
      displayValue: managed.displayValue?.trim() || fallback.displayValue,
      imageUrl: managed.imageUrl ?? fallback.imageUrl
    }
  })
}
