/**
 * Firebase Admin Account Setup Helper
 * 
 * This utility provides methods to set up and manage the admin account in Firebase.
 * 
 * Usage in your development environment:
 * 1. Run this from the browser console after installing firebase-admin on your server
 * 2. Or use the manual setup guide below
 */

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_PASSWORD = 'admin1234'

/**
 * Try to create admin account
 * This should be called once during development setup
 */
export async function setupAdminAccountInClient() {
  try {
    console.log('🔐 Attempting to create admin account...')
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    )
    
    // Update profile
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: 'Admin User',
      })
      
      console.log('✅ Admin account created successfully!')
      console.log('Email:', ADMIN_EMAIL)
      console.log('UID:', userCredential.user.uid)
    }
    
    return userCredential.user
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Admin account already exists')
      
      // Try to sign in to verify
      try {
        const result = await signInWithEmailAndPassword(
          auth,
          ADMIN_EMAIL,
          ADMIN_PASSWORD
        )
        console.log('✅ Admin account verified and accessible')
        return result.user
      } catch (signInError: any) {
        console.error('❌ Admin account exists but sign-in failed:')
        console.error('Error:', signInError.message)
        throw signInError
      }
    } else {
      console.error('❌ Error creating admin account:')
      console.error('Code:', error.code)
      console.error('Message:', error.message)
      throw error
    }
  }
}

/**
 * Verify admin account exists and is accessible
 */
export async function verifyAdminAccount() {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    )
    console.log('✅ Admin account verified')
    return result.user
  } catch (error: any) {
    console.error('❌ Admin account verification failed:')
    console.error('The admin account does not exist or credentials are incorrect')
    throw error
  }
}

/**
 * Manual setup instructions
 */
export const SETUP_INSTRUCTIONS = {
  title: 'Admin Account Setup Instructions',
  steps: [
    {
      step: 1,
      title: 'Go to Firebase Console',
      action: 'Open https://console.firebase.google.com/project/futurematrix-17e10',
    },
    {
      step: 2,
      title: 'Navigate to Authentication',
      action: 'Click on "Authentication" in the left sidebar',
    },
    {
      step: 3,
      title: 'Create New User',
      action: 'Click "Add user" button in the Users tab',
    },
    {
      step: 4,
      title: 'Enter Admin Credentials',
      action: `
        Email: admin@gmail.com
        Password: admin1234
        Set email as verified (optional)
      `,
    },
    {
      step: 5,
      title: 'Save User',
      action: 'Click "Create user" button',
    },
    {
      step: 6,
      title: 'Test Sign In',
      action: 'Go to /auth/signin and use the credentials',
    },
  ],
  firebaseConsoleUrl: 'https://console.firebase.google.com/project/futurematrix-17e10/authentication/users',
}

export default {
  setupAdminAccountInClient,
  verifyAdminAccount,
  SETUP_INSTRUCTIONS,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
}
