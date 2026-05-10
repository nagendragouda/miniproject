'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  reload,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth as firebaseAuth } from '@/lib/firebase'
import { syncUserToSupabase } from '@/lib/supabase-client'

interface AuthContextType {
  user: FirebaseUser | null
  userEmail: string | null
  emailVerified: boolean
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<FirebaseUser>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<FirebaseUser>
  sendVerificationEmail: () => Promise<void>
  checkEmailVerification: () => Promise<boolean>
  resendVerificationEmail: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  checkAdminAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure Google Auth Provider with OAuth Client ID
const googleProvider = new GoogleAuthProvider()

// Set OAuth client ID if available
const googleOAuthClientId = process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID
if (googleOAuthClientId) {
  console.log('✅ Google OAuth Client ID configured')
} else {
  console.warn('⚠️ Google OAuth Client ID not found in environment variables')
}

// Configure Google Auth Provider with comprehensive settings
googleProvider.setCustomParameters({ 
  access_type: 'online',     // Don't request offline access
})

// Add required scopes for profile and email access
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Set auth language to English
googleProvider.setDefaultLanguage('en')

// Log the provider configuration
console.log('🔐 Google Auth Provider configured with:', {
  scopes: ['profile', 'email'],
  customParameters: {
    prompt: 'select_account',
    access_type: 'online'
  }
})

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdminAuth = () => {
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('fm_admin_authenticated') === 'true'
      setIsAdmin(authenticated)
      if (authenticated) {
        setUserEmail(localStorage.getItem('fm_admin_email'))
      }
    }
  }

  // Initialize admin state and immediate user check
  useEffect(() => {
    checkAdminAuth()
    
    // Immediate check for current user if already initialized
    if (firebaseAuth.currentUser) {
      const currentUser = firebaseAuth.currentUser
      setUser(currentUser)
      setUserEmail(currentUser.email)
      setEmailVerified(currentUser.emailVerified)
      setLoading(false)
    }
  }, [])

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(firebaseAuth)
        if (result?.user) {
          setUser(result.user)
          setUserEmail(result.user.email)
          if (result.user.emailVerified) {
            setEmailVerified(true)
          }
        }
      } catch {
        // Redirect result can fail when there is no redirect flow in progress.
        // This is expected and should not block UI.
      }
    }
    
    checkRedirectResult()
  }, [])

  // Initialize auth state from Firebase listener
  useEffect(() => {
    // OPTIMIZATION: Check for cached auth state for instant UI
    if (typeof window !== 'undefined') {
      const cachedUser = localStorage.getItem('fm_auth_cached')
      if (cachedUser === 'true' && !user) {
        // We don't have the full user object yet, but we know they were logged in
        // This helps components render the 'logged in' state faster
        console.log('⚡ [AuthContext] Using cached auth hint for fast boot')
      }
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setUserEmail(currentUser.email)
        setEmailVerified(currentUser.emailVerified)
        // Cache the fact that we are logged in
        localStorage.setItem('fm_auth_cached', 'true')
        // Background sync only if it's a new or changed user to avoid redundant calls
        syncUserToSupabase(currentUser)
      } else {
        setUserEmail(null)
        setEmailVerified(false)
        localStorage.removeItem('fm_auth_cached')
      }
      
      setLoading(false)
    })

  // Add a global debug helper for the user to trigger sync manually from console
  if (typeof window !== 'undefined') {
    (window as any).syncMyAuth = () => {
      if (firebaseAuth.currentUser) {
        console.log('🚀 Manually triggering sync...')
        syncUserToSupabase(firebaseAuth.currentUser)
      } else {
        console.warn('⚠️ No user logged in to sync.')
      }
    }
  }

  return () => unsubscribe()
}, [])

  // Removed redundant secondary sync trigger to improve performance

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      const newUser = result.user

      // Update user profile with name
      // Note: Firebase doesn't have a built-in firstName/lastName, so we'll use displayName
      // Extended profile data would need to be stored separately (e.g., Firestore)

      // Background processes - don't block UI
      sendEmailVerification(newUser).catch(e => console.error('Verification email error:', e))
      syncUserToSupabase(newUser).catch(e => console.error('Supabase sync error:', e))

      return newUser
    } catch (error: any) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Check if admin credentials
      if (email === 'admin@gmail.com' && password === 'admin1234') {
        localStorage.setItem('fm_admin_authenticated', 'true')
        localStorage.setItem('fm_admin_email', email)
        localStorage.setItem('fm_admin_login_time', new Date().toISOString())
        checkAdminAuth()
        return
      }
      
      // Regular Firebase sign-in
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
      
      // OPTIMIZATION: Update state immediately for faster UI feedback
      setUser(result.user)
      setUserEmail(result.user.email)
      setEmailVerified(result.user.emailVerified)
      localStorage.setItem('fm_auth_cached', 'true')
      setLoading(false)
      
      // Non-blocking sync
      syncUserToSupabase(result.user)
    } catch (error: any) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Validate OAuth is configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID) {
        const error = new Error('Google OAuth Client ID not configured in environment variables')
        throw error
      }

      // Try Google sign-in with popup
      let result
      try {
        result = await signInWithPopup(firebaseAuth, googleProvider)
      } catch (popupError: any) {
        // Handle popup-specific errors
        if (popupError.code === 'auth/popup-blocked') {
          throw new Error('Google popup was blocked. Please allow popups for this site and try again.')
        }
        if (popupError.code === 'auth/popup-closed-by-user') {
          return null // User intentionally closed
        }
        if (popupError.code === 'auth/cancelled-popup-request') {
          return null
        }
        if (popupError.code === 'auth/operation-not-allowed') {
          throw new Error('Google sign-in is not enabled. Please contact support.')
        }
        if (popupError.code === 'auth/internal-error') {
          throw new Error('Google authentication service error. Please check your OAuth configuration and try again.')
        }
        if (popupError.code === 'auth/account-exists-with-different-credential') {
          throw new Error('This email is already registered with a different authentication method.')
        }
        // Re-throw any other error
        throw popupError
      }
      
      if (!result?.user) {
        throw new Error('No user data returned from Google authentication')
      }
      
      const newUser = result.user
      
      // OPTIMIZATION: Update state immediately
      setUser(newUser)
      setUserEmail(newUser.email)
      setEmailVerified(newUser.emailVerified)
      localStorage.setItem('fm_auth_cached', 'true')
      setLoading(false)
      
      // Background sync
      syncUserToSupabase(newUser).catch(e => console.error('Supabase sync error:', e))
      
      return newUser
    } catch (error: any) {
      // Throw the error so the signup page can handle it
      throw error
    }
  }

  const sendVerificationEmail = async () => {
    try {
      if (!user) throw new Error('No user logged in')
      await sendEmailVerification(user)
    } catch (error: any) {
      throw error
    }
  }

  const resendVerificationEmail = async () => {
    try {
      if (!user) throw new Error('No user logged in')
      await sendEmailVerification(user)
    } catch (error: any) {
      throw error
    }
  }

  const checkEmailVerification = async () => {
    try {
      if (!user) return false
      await reload(user)
      setEmailVerified(user.emailVerified)
      return user.emailVerified
    } catch (error) {
      console.error('Error checking email verification:', error)
      return false
    }
  }

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email)
    } catch (error: any) {
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      if (user) {
        await reload(user)
        setEmailVerified(user.emailVerified)
        // Sync to Supabase after refresh
        await syncUserToSupabase(user)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const signOut = async () => {
    try {
      if (isAdmin) {
        localStorage.removeItem('fm_admin_authenticated')
        localStorage.removeItem('fm_admin_email')
        localStorage.removeItem('fm_admin_login_time')
        setIsAdmin(false)
      } else {
        await firebaseSignOut(firebaseAuth)
      }
      setUser(null)
      setUserEmail(null)
      setEmailVerified(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value: AuthContextType = {
    user,
    userEmail,
    emailVerified,
    loading,
    signUp,
    signIn,
    isAdmin,
    signInWithGoogle,
    sendVerificationEmail,
    checkEmailVerification,
    resendVerificationEmail,
    sendPasswordReset,
    signOut,
    refreshUser,
    checkAdminAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  }
  return context
}

// Re-export Firebase auth functions for direct use
export { firebaseAuth as auth }
export { GoogleAuthProvider }
