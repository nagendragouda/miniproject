/**
 * API Error Handler Utility
 * Provides user-friendly error messages and recovery suggestions
 */

export interface ApiError {
  success: boolean
  error: string
  errorType?: string
  details?: any
  [key: string]: any
}

export interface ErrorDisplay {
  title: string
  message: string
  suggestion: string
  severity: 'error' | 'warning' | 'info'
  icon: string
}

const errorMessages: Record<string, ErrorDisplay> = {
  CONNECTION: {
    title: '🌐 Database Connection Error',
    message: 'Cannot connect to the database. Your internet connection or DNS settings may have issues.',
    suggestion: 'Try changing your DNS to 8.8.8.8 and refresh the page',
    severity: 'error',
    icon: '❌'
  },
  NETWORK_ERROR: {
    title: '🌐 Network Error',
    message: 'Network connection failed. Check your internet connectivity.',
    suggestion: 'Check your internet connection and try again',
    severity: 'error',
    icon: '❌'
  },
  NOT_FOUND: {
    title: '📋 Profile Not Found',
    message: 'This profile has not been created yet.',
    suggestion: 'Fill out your profile information and save it',
    severity: 'info',
    icon: 'ℹ️'
  },
  VALIDATION: {
    title: '⚠️ Validation Error',
    message: 'Invalid data was provided to the server.',
    suggestion: 'Please check your input and try again',
    severity: 'warning',
    icon: '⚠️'
  },
  UNKNOWN: {
    title: '⚠️ Unknown Error',
    message: 'An unexpected error occurred.',
    suggestion: 'Try refreshing the page or contacting support',
    severity: 'error',
    icon: '❌'
  }
}

/**
 * Parse API error response and return user-friendly message
 */
export function parseApiError(error: any): ErrorDisplay {
  if (!error) {
    return errorMessages.UNKNOWN
  }

  const errorType = error.errorType || 'UNKNOWN'
  const customMessage = error.error || error.message || ''

  if (errorMessages[errorType]) {
    const msg = errorMessages[errorType]
    return {
      ...msg,
      message: customMessage || msg.message
    }
  }

  return {
    ...errorMessages.UNKNOWN,
    message: customMessage || errorMessages.UNKNOWN.message
  }
}

/**
 * Log error for debugging (development only)
 */
export function logError(context: string, error: any, response?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`❌ API Error: ${context}`)
    console.error('Error object:', error)
    if (response) {
      console.error('Response:', response)
    }
    console.groupEnd()
  }
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: any): boolean {
  const message = error?.error || error?.message || String(error)
  return message.includes('fetch') ||
         message.includes('ENOTFOUND') ||
         message.includes('ECONNREFUSED') ||
         message.includes('ETIMEDOUT') ||
         message.includes('Network')
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const delay = initialDelayMs * Math.pow(2, i)
      
      if (i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * Format error for display in UI
 */
export function formatErrorForUI(error: any): string {
  const display = parseApiError(error)
  return `${display.icon} ${display.title}\n${display.message}\n\n💡 Tip: ${display.suggestion}`
}
