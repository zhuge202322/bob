import React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import NetworkMap from '@/components/NetworkMap'

describe('NetworkMap', () => {
  it('renders detailed country geography with routes and labelled supply hubs', () => {
    const markup = renderToStaticMarkup(<NetworkMap />)

    expect(markup).toContain('viewBox="0 0 1000 520"')
    expect(markup).toContain('aria-label="Global distribution network"')
    expect(markup).toContain('class="network-map-borders"')
    const mapAsset = fs.readFileSync(path.join(process.cwd(), 'public/maps/world-countries.svg'), 'utf8')
    expect((mapAsset.match(/class="network-map-country"/g) || []).length).toBeGreaterThanOrEqual(150)
    expect((mapAsset.match(/class="network-map-country-border"/g) || []).length).toBeGreaterThanOrEqual(150)
    expect((markup.match(/class="network-map-route/g) || []).length).toBeGreaterThanOrEqual(4)
    expect((markup.match(/class="network-map-hub"/g) || []).length).toBe(6)
    expect(markup).toContain('North America')
    expect(markup).toContain('Asia-Pacific')
  })
})
