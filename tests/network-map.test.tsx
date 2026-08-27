import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NetworkMap from '@/components/NetworkMap'

describe('NetworkMap', () => {
  it('renders a scalable vector map with routes and labelled supply hubs', () => {
    const markup = renderToStaticMarkup(<NetworkMap />)

    expect(markup).toContain('viewBox="0 0 1000 520"')
    expect(markup).toContain('aria-label="Global distribution network"')
    expect((markup.match(/class="network-map-route/g) || []).length).toBeGreaterThanOrEqual(4)
    expect((markup.match(/class="network-map-hub"/g) || []).length).toBe(6)
    expect(markup).toContain('North America')
    expect(markup).toContain('Asia-Pacific')
  })
})
