import fs from 'node:fs'
import path from 'node:path'

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) {
  throw new Error('Usage: node scripts/generate-network-map.mjs <geojson> <svg>')
}

const source = JSON.parse(fs.readFileSync(input, 'utf8'))
const minLat = -58
const maxLat = 84
const project = ([longitude, latitude]) => [
  ((longitude + 180) / 360) * 1000,
  ((maxLat - latitude) / (maxLat - minLat)) * 520
]

function simplify(points, tolerance = 0.075) {
  if (points.length <= 3) return points
  const squaredTolerance = tolerance * tolerance
  const squaredDistance = (point, start, end) => {
    let x = start[0]
    let y = start[1]
    let dx = end[0] - x
    let dy = end[1] - y
    if (dx !== 0 || dy !== 0) {
      const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)
      if (t > 1) {
        x = end[0]
        y = end[1]
      } else if (t > 0) {
        x += dx * t
        y += dy * t
      }
    }
    dx = point[0] - x
    dy = point[1] - y
    return dx * dx + dy * dy
  }
  const keep = new Uint8Array(points.length)
  keep[0] = keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [start, end] = stack.pop()
    let maxDistance = squaredTolerance
    let split = -1
    for (let index = start + 1; index < end; index += 1) {
      const distance = squaredDistance(points[index], points[start], points[end])
      if (distance > maxDistance) {
        split = index
        maxDistance = distance
      }
    }
    if (split !== -1) {
      keep[split] = 1
      stack.push([start, split], [split, end])
    }
  }
  return points.filter((_, index) => keep[index])
}

const formatPoint = (point) => {
  const [x, y] = project(point)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

function ringPath(ring) {
  const points = simplify(ring)
  if (points.length < 3) return ''
  return `M${formatPoint(points[0])} ${points.slice(1).map(formatPoint).join(' L')} Z`
}

function geometryPath(geometry) {
  if (!geometry) return ''
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : []
  return polygons.flatMap((polygon) => polygon.map(ringPath)).filter(Boolean).join(' ')
}

const paths = source.features
  .map((feature) => ({ name: feature.properties?.ADMIN || feature.properties?.NAME || 'Country', d: geometryPath(feature.geometry) }))
  .filter((feature) => feature.d)

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 520" role="presentation" aria-hidden="true">
  <g fill="#c7e8da" fill-opacity="0.94" stroke="#77baa2" stroke-width="0.9" stroke-linejoin="round" vector-effect="non-scaling-stroke" fill-rule="evenodd">
${paths.map(({ name, d }) => `    <path class="network-map-country" data-country="${String(name).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}" d="${d}"/>`).join('\n')}
  </g>
  <g fill="none" stroke="#5d9e88" stroke-opacity="0.9" stroke-width="1.05" stroke-linejoin="round" vector-effect="non-scaling-stroke" fill-rule="evenodd">
${paths.map(({ d }) => `    <path class="network-map-country-border" d="${d}"/>`).join('\n')}
  </g>
</svg>
`

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, svg)
console.log(`Generated ${paths.length} country paths at ${output}`)
