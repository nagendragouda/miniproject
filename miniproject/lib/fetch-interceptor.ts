/**
 * Fetch Interceptor
 * 
 * Intercepts all fetch calls and handles errors silently
 * Returns safe responses without throwing errors
 */

// Override global fetch to suppress errors
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  
  window.fetch = async function (...args: any[]): Promise<Response> {
    try {
      const response = await originalFetch.apply(this, args)
      
      // Even if response is not ok, return it (don't throw)
      return response
    } catch (error) {
      // Network error - return a safe empty response
      if (process.env.NODE_ENV === 'development') {
        console.log('[Fetch Interceptor] Network error:', error)
      }
      
      // Return a safe response instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'Network error', 
          message: 'Unable to complete request' 
        }),
        {
          status: 0,
          statusText: 'Network Error',
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

// Handle XMLHttpRequest errors
if (typeof window !== 'undefined') {
  const originalOpen = XMLHttpRequest.prototype.open
  
  XMLHttpRequest.prototype.open = function(...args: any[]) {
    const xhr = this as any
    
    // Override onerror handler
    const originalOnError = xhr.onerror
    xhr.onerror = function() {
      if (process.env.NODE_ENV === 'development') {
        console.log('[XHR] Request error:', this.statusText)
      }
      // Suppress the error event
      if (originalOnError) {
        originalOnError.call(this)
      }
    }
    
    return originalOpen.apply(this, args)
  }
}

export const safeApiCall = async <T>(
  url: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<T | null> => {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Safe API Call] Request failed: ${response.status} ${response.statusText}`)
      }
      return fallbackData ?? null
    }
    
    return await response.json()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Safe API Call] Error:', error)
    }
    return fallbackData ?? null
  }
}

export const safeJsonParse = <T>(json: string, fallback?: T): T | null => {
  try {
    return JSON.parse(json)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Safe JSON Parse] Parse error:', error)
    }
    return fallback ?? null
  }
}

export default {
  safeApiCall,
  safeJsonParse,
}
