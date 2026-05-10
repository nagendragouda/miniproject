'use client'

import React, { createContext, useContext } from 'react'
import { useFirebaseAuth } from './FirebaseAuthContext'

// This context wraps Firebase auth for backward compatibility
// Existing components using useAuth() will now use Firebase authentication
// Previously this was Supabase-based, but database has been disconnected

interface AuthContextType {
  user: any | null
  userEmail: string | null
  emailVerified: boolean
  profile: any | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<{ error: any }>
  checkEmailVerification: () => Promise<boolean>
  resendVerificationEmail: () => Promise<void>
  authLoading?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useFirebaseAuth()

  // Wrap signOut to also clear admin auth flag
  const wrappedSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fm_admin_authenticated')
    }
    await firebaseAuth.signOut()
  }

  // Wrap Firebase auth for backward compatibility
  const value: AuthContextType = {
    user: firebaseAuth.user,
    userEmail: firebaseAuth.userEmail,
    emailVerified: firebaseAuth.emailVerified,
    profile: null, // Profile data no longer available (database disconnected)
    session: null, // Session no longer available (database disconnected)
    loading: firebaseAuth.loading,
    authLoading: firebaseAuth.loading,
    
    // Auth methods
    signIn: firebaseAuth.signIn,
    signUp: firebaseAuth.signUp,
    signInWithGoogle: firebaseAuth.signInWithGoogle,
    signOut: wrappedSignOut,
    checkEmailVerification: firebaseAuth.checkEmailVerification,
    resendVerificationEmail: firebaseAuth.resendVerificationEmail,
    
    // Profile updates not available (database disconnected)
    updateProfile: async (updates: any) => {
      console.warn('⚠️ Profile updates are not available - database has been disconnected. Only Firebase user data is available.')
      return { error: 'Database disconnected. Profile persistence is not available.' }
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
