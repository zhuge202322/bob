import type { Metadata } from 'next'
import './globals.css'
import { prisma } from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } }).catch(() => null)
  return {
    title: `${settings?.siteName || 'ZEHOLYN BIOTECH'} | Global Life Science Sourcing`,
    description: 'Research reagents and laboratory consumables with compliant delivery across Russia.',
    ...(settings?.faviconUrl ? { icons: { icon: settings.faviconUrl } } : {})
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
