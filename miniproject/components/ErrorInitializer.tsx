/**
 * Client-Side Error Initialization
 * 
 * Runs on app startup to initialize all error suppression
 * Must be imported early in the application
 */

'use client'

import { useEffect } from 'react'
import { suppressFirebaseErrors } from '@/lib/firebase-error-suppressor'

export function ErrorInitializer() {
  useEffect(() => {
    // Initialize Firebase error suppression
    suppressFirebaseErrors()
    
    // Suppress all HTML console warnings
    if (typeof window !== 'undefined') {
      // Suppress specific DOM warnings
      const originalConsoleError = console.error
      console.error = (...args: any[]) => {
        const message = args[0]?.toString?.() || ''
        
        // Suppress HTML parsing warnings
        if (
          message.includes('textContent') ||
          message.includes('innerHTML') ||
          message.includes('DOM') ||
          message.includes('React does not recognize')
        ) {
          return
        }
        
        originalConsoleError.apply(console, args)
      }
    }
  }, [])
  
  return null
}

export default ErrorInitializer
