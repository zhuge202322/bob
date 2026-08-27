import React, { type CSSProperties } from 'react'
import { networkHotspots } from '@/lib/stitch-ui'

const hubs = [
  { id: 'north-america', label: 'North America', x: 226, y: 236 },
  { id: 'south-america', label: 'South America', x: 344, y: 388 },
  { id: 'europe', label: 'Europe', x: 505, y: 192 },
  { id: 'china', label: 'China', x: 701, y: 250 },
  { id: 'southeast-asia', label: 'Asia-Pacific', x: 766, y: 333 },
  { id: 'australia', label: 'Australia', x: 835, y: 421 }
] as const

const land = {
  northAmerica: 'M92 136 L126 109 183 98 225 112 261 142 286 183 270 206 235 207 224 238 189 245 161 224 131 229 105 205 79 177 Z',
  southAmerica: 'M286 273 L322 286 342 322 337 353 359 384 344 424 316 452 294 422 300 385 278 347 265 314 Z',
  europe: 'M454 140 L484 117 522 123 546 143 535 164 504 166 483 184 452 169 431 153 Z',
  africa: 'M460 211 L507 202 548 223 559 270 545 319 513 369 478 344 455 300 438 257 Z',
  asia: 'M548 130 L603 102 677 109 738 130 788 162 846 185 882 223 856 255 807 251 772 272 727 257 694 274 652 250 620 225 583 206 548 177 Z',
  india: 'M651 265 L693 277 704 320 680 345 655 315 Z',
  australia: 'M762 377 L808 361 860 374 890 405 877 438 835 452 795 435 769 413 Z'
} as const

export default function NetworkMap({ className = '' }: { className?: string }) {
  return <div className={`network-map-vector ${className}`.trim()}>
    <svg viewBox="0 0 1000 520" role="img" aria-label="Global distribution network" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="network-ocean" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f4fbf8" />
          <stop offset="1" stopColor="#e6f3ee" />
        </linearGradient>
        <linearGradient id="network-land" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d5eee3" />
          <stop offset="1" stopColor="#afd8c7" />
        </linearGradient>
        <filter id="network-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="1000" height="520" fill="url(#network-ocean)" />
      <g className="network-map-grid" aria-hidden="true">
        <path d="M60 110H940M45 210H955M40 310H960M70 410H930" />
        <path d="M170 50V470M330 42V478M500 35V485M670 42V478M830 55V465" />
      </g>
      <g className="network-map-routes" fill="none" strokeLinecap="round">
        <path className="network-map-route" d="M226 236 Q358 110 505 192 T701 250" />
        <path className="network-map-route network-map-route-alt" d="M226 236 Q295 320 344 388 T701 250" />
        <path className="network-map-route" d="M505 192 Q590 240 701 250 T835 421" />
        <path className="network-map-route network-map-route-alt" d="M344 388 Q530 420 766 333 T835 421" />
        <path className="network-map-route" d="M505 192 Q637 105 835 421" />
        <path className="network-map-route network-map-route-alt" d="M226 236 Q520 70 835 421" />
      </g>
      <g className="network-map-land" fill="url(#network-land)" stroke="#8fc6b1" strokeWidth="2" strokeLinejoin="round">
        <path d={land.northAmerica} /><path d={land.southAmerica} /><path d={land.europe} /><path d={land.africa} />
        <path d={land.asia} /><path d={land.india} /><path d={land.australia} />
      </g>
      <g className="network-map-labels" aria-hidden="true">
        <text x="91" y="82">GLOBAL SOURCING ROUTES</text>
        <text x="112" y="275">AMERICAS</text><text x="450" y="405">AFRICA</text>
        <text x="590" y="88">EUROPE · ASIA</text><text x="792" y="475">APAC</text>
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
