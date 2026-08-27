type RequestLike = Pick<Request, 'headers' | 'url'>

type RateLimitOptions = {
  limit: number
  windowMs: number
  now?: number
}

type Bucket = { timestamps: number[] }

const buckets = new Map<string, Bucket>()

function forwardedIp(request: RequestLike) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Reject cross-site browser submissions. Requests without Origin/Referer are
 * retained for non-browser API clients; any supplied value must match an
 * explicitly trusted origin or the request URL origin.
 */
export function assertSameOrigin(request: RequestLike) {
  const origin = request.headers.get('origin') || request.headers.get('referer')
  if (!origin) return true
  if (origin === 'null') return false

  let supplied: URL
  let target: URL
  try {
    supplied = new URL(origin)
    target = new URL(request.url)
  } catch {
    return false
  }

  const configured = [process.env.APP_URL, ...(process.env.ALLOWED_ORIGINS || '').split(',')]
    .flatMap((item) => {
      try { return item?.trim() ? [new URL(item.trim()).origin] : [] } catch { return [] }
    })
  const trusted = new Set([target.origin, ...configured])
  return trusted.has(supplied.origin)
}

export function consumeRateLimit(request: RequestLike, scope: string, options: RateLimitOptions) {
  const now = options.now ?? Date.now()
  const key = `${scope}:${forwardedIp(request)}`
  if (buckets.size >= 5000 && !buckets.has(key)) {
    for (const [bucketKey, value] of buckets) {
      if (value.timestamps.every((timestamp) => now - timestamp >= options.windowMs)) buckets.delete(bucketKey)
    }
    if (buckets.size >= 5000) buckets.delete(buckets.keys().next().value as string)
  }
  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((timestamp) => now - timestamp < options.windowMs)
  const allowed = bucket.timestamps.length < options.limit
  if (allowed) bucket.timestamps.push(now)
  buckets.set(key, bucket)
  const retryAfterMs = allowed || bucket.timestamps.length === 0
    ? 0
    : Math.max(0, options.windowMs - (now - bucket.timestamps[0]))
  return { allowed, retryAfterMs }
}

export function resetRateLimits() {
  buckets.clear()
}
