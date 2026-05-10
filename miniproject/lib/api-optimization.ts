/**
 * Optimized API Handler with Automatic Caching
 * Provides response caching, compression, and rate limiting
 */

import { NextResponse } from 'next/server'

interface CachedResponse {
  data: any
  timestamp: number
  ttl: number
}

class APICache {
  private cache: Map<string, CachedResponse> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    // Auto cleanup
    setTimeout(() => this.cache.delete(key), ttl)
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(pattern?: string | RegExp) {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }
}

export const apiCache = new APICache()

/**
 * Create optimized API response with caching
 */
export function createCachedResponse<T>(
  data: T,
  options: {
    status?: number
    cacheTTL?: number
    cacheKey?: string
    headers?: Record<string, string>
  } = {}
) {
  const {
    status = 200,
    cacheTTL = 5 * 60 * 1000,
    cacheKey,
    headers = {},
  } = options

  // Cache if key provided
  if (cacheKey) {
    apiCache.set(cacheKey, data, cacheTTL)
  }

  const response = NextResponse.json(data, { status })

  // Add caching headers
  response.headers.set('Cache-Control', `public, max-age=${Math.floor(cacheTTL / 1000)}, stale-while-revalidate=86400`)
  response.headers.set('X-Cache-TTL', String(cacheTTL))
  response.headers.set('X-Response-Time', String(Date.now()))

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Enable compression
  response.headers.set('Accept-Encoding', 'gzip, deflate, br')

  return response
}

/**
 * Create error response with appropriate status
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    backoff?: number
    timeout?: number
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    timeout = 30000,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          controller.signal.addEventListener('abort', () =>
            reject(new Error('Request timeout'))
          )
        ),
      ])

      clearTimeout(timeoutId)
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoff, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

/**
 * Rate limiter for API endpoints
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private limit: number
  private window: number // milliseconds

  constructor(limit: number = 100, windowMs: number = 60 * 1000) {
    this.limit = limit
    this.window = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []

    // Remove old requests outside window
    const validRequests = requests.filter(timestamp => now - timestamp < this.window)

    if (validRequests.length >= this.limit) {
      return false
    }

    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter(timestamp => now - timestamp < this.window)
    return Math.max(0, this.limit - validRequests.length)
  }

  reset(key?: string) {
    if (key) {
      this.requests.delete(key)
    } else {
      this.requests.clear()
    }
  }
}

/**
 * Create rate limited response
 */
export function createRateLimitedResponse(
  limiter: RateLimiter,
  key: string,
  onLimit: () => any
) {
  if (!limiter.isAllowed(key)) {
    const response = NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: 60,
      },
      { status: 429 }
    )

    const remaining = limiter.getRemainingRequests(key)
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('Retry-After', '60')

    return response
  }

  return null // Allow request
}

export default {
  apiCache,
  createCachedResponse,
  createErrorResponse,
  retryAsync,
  RateLimiter,
  createRateLimitedResponse,
}
