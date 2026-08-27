import React, { type CSSProperties } from 'react'
import { networkHotspots } from '@/lib/stitch-ui'

const hubs = [
  { id: 'north-america', label: 'North America', x: 294, y: 161 },
  { id: 'south-america', label: 'South America', x: 358, y: 347 },
  { id: 'europe', label: 'Europe', x: 528, y: 121 },
  { id: 'china', label: 'China', x: 792, y: 165 },
  { id: 'southeast-asia', label: 'Asia-Pacific', x: 789, y: 290 },
  { id: 'australia', label: 'Australia', x: 920, y: 391 }
] as const

export default function NetworkMap({ className = '' }: { className?: string }) {
  return <div className={`network-map-vector ${className}`.trim()}>
    <svg viewBox="0 0 1000 520" role="img" aria-label="Global distribution network" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="network-ocean" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f4fbf8" />
          <stop offset="1" stopColor="#e6f3ee" />
        </linearGradient>
        <filter id="network-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="1000" height="520" fill="url(#network-ocean)" />
      <g className="network-map-grid" aria-hidden="true">
        <path d="M0 112H1000M0 204H1000M0 296H1000M0 388H1000M0 480H1000" />
        <path d="M100 0V520M200 0V520M300 0V520M400 0V520M500 0V520M600 0V520M700 0V520M800 0V520M900 0V520" />
      </g>
      <image className="network-map-borders" href="/maps/world-countries.svg" x="0" y="0" width="1000" height="520" preserveAspectRatio="none" />
      <g className="network-map-routes" fill="none" strokeLinecap="round">
        <path className="network-map-route" d="M294 161 Q408 72 528 121 T792 165" />
        <path className="network-map-route network-map-route-alt" d="M294 161 Q318 276 358 347 T789 290" />
        <path className="network-map-route" d="M528 121 Q660 148 792 165 T920 391" />
        <path className="network-map-route network-map-route-alt" d="M358 347 Q566 414 789 290 T920 391" />
        <path className="network-map-route" d="M528 121 Q724 74 920 391" />
        <path className="network-map-route network-map-route-alt" d="M294 161 Q618 24 920 391" />
      </g>
      <g className="network-map-labels" aria-hidden="true">
        <text x="36" y="34">GLOBAL SOURCING ROUTES</text>
        <text x="116" y="242">AMERICAS</text><text x="462" y="354">AFRICA</text>
        <text x="604" y="38">EUROPE · ASIA</text><text x="838" y="476">APAC</text>
      </g>
      <g className="network-map-hubs">
        {hubs.map((hub, index) => {
          const hotspot = networkHotspots[index]
          return <g className="network-map-hub" key={hub.id} tabIndex={0} aria-label={hub.label} data-region={hub.id} style={{ '--hub-delay': `${index * -0.35}s` } as CSSProperties}>
            <title>{hub.label}</title>
            <circle className="network-map-hub-glow" cx={hub.x} cy={hub.y} r="17" />
            <circle className="network-map-hub-ring" cx={hub.x} cy={hub.y} r="12" />
            <circle className="network-map-hub-core" cx={hub.x} cy={hub.y} r="5" />
            <text x={hub.x + 15} y={hub.y - 14}>{hotspot.id === 'southeast-asia' ? 'APAC' : hub.label.replace('South ', 'S. ').replace('North ', 'N. ')}</text>
          </g>
        })}
      </g>
    </svg>
  </div>
}
