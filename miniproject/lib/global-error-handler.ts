/**
 * Global Error Handler
 * 
 * Suppress and handle all unhandled errors, rejections, and exceptions
 * Logs errors for debugging without showing them to users
 */

// Suppress console errors in production
if (typeof window !== 'undefined') {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Store original console methods
  const originalError = console.error
  const originalWarn = console.warn
  const originalLog = console.log
  
  // List of errors to completely suppress
  const suppressedErrorPatterns = [
    'hydration',
    'mismatch',
    'Client and Server',
    'Warning: ReactDOM.render',
    'Warning: useLayoutEffect',
    'act() warning',
    'Not implemented',
    'firebase',
    'Google',
    'Analytics',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'cookies',
    'message channel',
    'asynchronous response',
  ]
  
  // Check if error should be suppressed
  const shouldSuppress = (message: string): boolean => {
    if (!message) return false
    const msg = String(message).toLowerCase()
    return suppressedErrorPatterns.some(pattern => 
      msg.includes(pattern.toLowerCase())
    )
  }
  
  // Override console.error
  console.error = (...args: any[]) => {
    const message = args[0]?.toString?.() || ''
    
    // In production, suppress most errors
    if (!isDevelopment) {
      if (shouldSuppress(message)) {
        return // Completely suppress
      }
      // Log critical errors only (API failures, security issues)
      if (message.includes('CRITICAL') || message.includes('SECURITY')) {
        originalError.apply(console, args)
      }
      return
    }
    
    // In development, show all errors
    originalError.apply(console, args)
  }
  
  // Override console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString?.() || ''
    
    // In production, suppress warnings
    if (!isDevelopment) {
      if (shouldSuppress(message)) {
        return // Suppress warning
      }
    }
    
    originalWarn.apply(console, args)
  }
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.toString?.() || ''
    
    if (shouldSuppress(reason)) {
      // Suppress the error
      event.preventDefault()
      return
    }
    
    if (!isDevelopment) {
      // In production, prevent error display
      event.preventDefault()
    }
  })
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    const message = event.message?.toString?.() || ''
    
    if (shouldSuppress(message)) {
      // Suppress the error
      event.preventDefault()
      return
    }
    
    if (!isDevelopment) {
      // In production, prevent error display
      event.preventDefault()
    }
  })
  
  // Suppress specific Firebase warnings
  window.addEventListener('storage', (event) => {
    // Suppress localStorage/sessionStorage warnings
  }, false)
}

// Export error handler utilities
export const errorHandler = {
  // Safely execute async code without throwing
  async executeAsync<T>(
    fn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in executeAsync:', error)
      }
      return fallback
    }
  },
  
  // Safely execute sync code without throwing
  executeSync<T>(
    fn: () => T,
    fallback?: T
  ): T | undefined {
    try {
      return fn()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in executeSync:', error)
      }
      return fallback
    }
  },
  
  // Suppress specific error for logging only
  suppressAndLog(error: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context || 'Error'}]`, error)
    }
    // Error is suppressed in production
  },
}

export default errorHandler
