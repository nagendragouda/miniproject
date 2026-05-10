/**
 * Safe Async Wrapper
 * 
 * Wraps async functions to catch and suppress errors silently
 * Useful for event handlers, API calls, and other async operations
 */

/**
 * Wraps an async function to suppress errors
 * @param fn - The async function to wrap
 * @param options - Configuration options
 * @returns Wrapped function that suppresses errors
 */
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    onError?: (error: Error) => void
    fallback?: R
    timeout?: number
  }
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      if (options?.timeout) {
        return await Promise.race([
          fn(...args),
          new Promise<R>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), options.timeout)
          ),
        ])
      }
      return await fn(...args)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeAsync] Error caught:', error)
      }
      if (options?.onError && error instanceof Error) {
        options.onError(error)
      }
      return options?.fallback
    }
  }
}

/**
 * Wraps a sync function to suppress errors
 * @param fn - The sync function to wrap
 * @param options - Configuration options
 * @returns Wrapped function that suppresses errors
 */
export function safeSync<T extends any[], R>(
  fn: (...args: T) => R,
  options?: {
    onError?: (error: Error) => void
    fallback?: R
  }
): (...args: T) => R | undefined {
  return (...args: T): R | undefined => {
    try {
      return fn(...args)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeSync] Error caught:', error)
      }
      if (options?.onError && error instanceof Error) {
        options.onError(error)
      }
      return options?.fallback
    }
  }
}

/**
 * Safe event handler wrapper
 * @param handler - Event handler function
 * @returns Safe event handler that won't throw
 */
export function safeEventHandler(
  handler: (event: Event | React.SyntheticEvent) => Promise<void> | void
) {
  return async (event: Event | React.SyntheticEvent) => {
    try {
      const result = handler(event)
      if (result instanceof Promise) {
        await result
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeEventHandler] Error:', error)
      }
    }
  }
}

/**
 * Safe API request wrapper
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Response or null on error
 */
export async function safeRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[SafeRequest] HTTP ${response.status}`)
      }
      return null
    }
    return await response.json()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SafeRequest] Error:', error)
    }
    return null
  }
}

/**
 * Safe localStorage wrapper
 */
export const safeStorage = {
  getItem(key: string, fallback?: string): string | null | undefined {
    try {
      return localStorage.getItem(key) ?? fallback
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeStorage] getItem error:', error)
      }
      return fallback
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeStorage] setItem error:', error)
      }
      return false
    }
  },

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SafeStorage] removeItem error:', error)
      }
      return false
    }
  },
}

export default {
  safeAsync,
  safeSync,
  safeEventHandler,
  safeRequest,
  safeStorage,
}
