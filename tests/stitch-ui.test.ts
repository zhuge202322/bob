import { describe, expect, it } from 'vitest'
import { clinicalPrecision, publicNavigation, isUnsupportedPublicClaim, networkHotspots } from '@/lib/stitch-ui'

describe('Stitch Clinical Precision contract', () => {
  it('locks the approved visual tokens', () => {
    expect(clinicalPrecision.colors.primary).toBe('#006b47')
    expect(clinicalPrecision.colors.accent).toBe('#00875a')
    expect(clinicalPrecision.colors.background).toBe('#f7faf8')
    expect(clinicalPrecision.containerMax).toBe(1280)
    expect(clinicalPrecision.radius).toBe(4)
  })

  it('keeps every public route in the shared navigation contract', () => {
    expect(publicNavigation.map((item) => item.href)).toEqual([
      '/products',
      '/solutions',
      '/quality',
      '/resources',
      '/about',
      '/contact'
    ])
    expect(publicNavigation.every((item) => item.label.en && item.label.zh && item.label.ru)).toBe(true)
  })

  it('flags generated certification claims that are not supported by the manuals', () => {
    expect(isUnsupportedPublicClaim('ISO 9001:2015 certified')).toBe(true)
    expect(isUnsupportedPublicClaim('ISO/IEC 17025 accredited')).toBe(true)
    expect(isUnsupportedPublicClaim('COA, TDS and SDS availability is confirmed per item')).toBe(false)
  })

  it('keeps the sales-network highlights inside the map', () => {
    expect(networkHotspots).toHaveLength(6)
    expect(networkHotspots.every((point) => point.x >= 0 && point.x <= 100)).toBe(true)
    expect(networkHotspots.every((point) => point.y >= 0 && point.y <= 100)).toBe(true)
  })
})
