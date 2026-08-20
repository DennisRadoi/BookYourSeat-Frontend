// ─── Simple In-Memory Cache ────────────────────────────────────────────────────
// Keeps the result of a Promise for `ttlMs` milliseconds.
// After TTL expires the next call re-fetches and repopulates the cache.
// Concurrent calls for the same key share a single in-flight Promise so we
// never fire duplicate network requests.

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const inFlight = new Map<string, Promise<unknown>>()

export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 30_000, // 30 s default
): Promise<T> {
  const now = Date.now()
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry && entry.expiresAt > now) {
    return Promise.resolve(entry.value)
  }

  // If a request is already in-flight for this key, reuse it
  const existing = inFlight.get(key) as Promise<T> | undefined
  if (existing) return existing

  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs })
      inFlight.delete(key)
      return value
    })
    .catch((err: unknown) => {
      inFlight.delete(key)
      throw err
    })

  inFlight.set(key, promise as Promise<unknown>)
  return promise
}

/** Manually invalidate a cache key (e.g. after a write operation). */
export function invalidateCache(key: string): void {
  cache.delete(key)
  inFlight.delete(key)
}

/** Invalidate all keys that start with a given prefix. */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
  for (const key of inFlight.keys()) {
    if (key.startsWith(prefix)) inFlight.delete(key)
  }
}

