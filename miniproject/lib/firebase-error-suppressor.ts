/**
 * Firebase Error Suppressor
 * 
 * Suppresses Firebase-specific errors and warnings
 * Prevents Firebase from logging errors to console
 */

import { setLogLevel } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Suppress Firebase logging in production
if (typeof window !== 'undefined') {
  // Set Firebase log level to silent in production
  if (process.env.NODE_ENV === 'production') {
    try {
      setLogLevel('silent')
    } catch (error) {
      // Ignore if setLogLevel is not available
    }
  }
}

// Override Firebase error reporting
export const suppressFirebaseErrors = () => {
  if (typeof window === 'undefined') return
  
  // Suppress Firebase auth errors
  try {
    const auth = getAuth()
    
    // Prevent Firebase from logging in console
    auth.onAuthStateChanged(
      (user) => {
        // Silently handle auth state change
      },
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Firebase Auth] Error:', error?.message)
        }
        // Don't rethrow the error
      }
    )
  } catch (error) {
    // Ignore Firebase initialization errors
  }
}

// Suppress specific Firebase warning messages
if (typeof window !== 'undefined') {
  const firebaseWarnings = [
    'FIREBASE_WARNING',
    'Firebase App named',
    'Analytics already',
    'Performance Monitoring',
  ]
  
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString?.() || ''
    
    // Suppress Firebase warnings
    if (firebaseWarnings.some(warning => message.includes(warning))) {
      if (process.env.NODE_ENV === 'development') {
        // Log for debugging in dev
        console.log('[Firebase Warning Suppressed]', message)
      }
      return
    }
    
    // Show other warnings
    originalWarn.apply(console, args)
  }
}

export default {
  suppressFirebaseErrors,
}
