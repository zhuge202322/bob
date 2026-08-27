import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.platform === 'linux' ? 'standalone' : undefined,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/products', destination: '/en/products', permanent: false },
      { source: '/solutions', destination: '/en/solutions', permanent: false },
      { source: '/quality', destination: '/en/quality', permanent: false },
      { source: '/resources', destination: '/en/resources', permanent: false },
      { source: '/about', destination: '/en/about', permanent: false },
      { source: '/contact', destination: '/en/contact', permanent: false },
      { source: '/rfq', destination: '/en/rfq', permanent: false }
    ]
  }
}
export default nextConfig
