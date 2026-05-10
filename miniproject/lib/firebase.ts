import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('❌ Firebase configuration is incomplete:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
  })
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Set auth persistence to LOCAL (survives page reloads)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(error => {
    console.warn('⚠️ Failed to set persistence:', error)
  })
}

// Configure auth language
auth.languageCode = 'en'

// Initialize Analytics lazily so auth pages can render faster.
if (typeof window !== 'undefined') {
  const initAnalytics = async () => {
    try {
      const { getAnalytics } = await import('firebase/analytics')
      getAnalytics(app)
    } catch {
      // Analytics is optional and should never block app startup.
    }
  }

  if ('requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(initAnalytics)
  } else {
    setTimeout(initAnalytics, 1500)
  }
}

export default app
