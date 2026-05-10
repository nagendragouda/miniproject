'use client'

import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'

export default function VerifyFirebaseSetupPage() {
  const { user, loading, userEmail, emailVerified } = useFirebaseAuth()
  const [checks, setChecks] = useState<any>({})

  useEffect(() => {
    // Run verification checks
    const newChecks: any = {
      firebaseConfigured: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseOAuthClientId: !!process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID,
      authContextWorking: !!useFirebaseAuth,
      userAuthState: user ? 'Authenticated' : 'Not authenticated',
      userEmail: userEmail || 'No email',
      emailVerified: emailVerified ? 'Verified' : 'Not verified',
    }

    setChecks(newChecks)

    // Log to console
    console.log('🔍 Firebase Setup Verification:')
    console.log({
      'API Key Present': newChecks.firebaseConfigured,
      'Auth Domain Present': newChecks.firebaseAuthDomain,
      'Project ID Present': newChecks.firebaseProjectId,
      'OAuth Client ID Present': newChecks.firebaseOAuthClientId,
      'Auth Context': newChecks.authContextWorking,
      'User Status': newChecks.userAuthState,
      'User Email': newChecks.userEmail,
      'Email Verified': newChecks.emailVerified,
    })
  }, [user, userEmail, emailVerified])

  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔐 Firebase Connection Verification</h1>
          <p className="text-slate-600">Complete setup check for Firebase authentication</p>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-50 border border-slate-300 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-secondary">📋 Environment Variables</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center justify-between p-2 bg-slate-100 rounded">
              <span>API Key</span>
              <span className={checks.firebaseConfigured ? 'text-green-400' : 'text-red-400'}>
                {checks.firebaseConfigured ? '✅ Present' : '❌ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-100 rounded">
              <span>Auth Domain</span>
              <span className={checks.firebaseAuthDomain ? 'text-green-400' : 'text-red-400'}>
                {checks.firebaseAuthDomain ? '✅ Present' : '❌ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-100 rounded">
              <span>Project ID</span>
              <span className={checks.firebaseProjectId ? 'text-green-400' : 'text-red-400'}>
                {checks.firebaseProjectId ? '✅ Present' : '❌ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-100 rounded">
              <span>OAuth Client ID</span>
              <span className={checks.firebaseOAuthClientId ? 'text-green-400' : 'text-red-400'}>
                {checks.firebaseOAuthClientId ? '✅ Present' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Firebase Connection Status */}
        <div className="bg-slate-50 border border-slate-300 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-secondary">🔗 Firebase Connection Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-100 rounded">
              <span className="text-lg">Auth Context</span>
              <span className={checks.authContextWorking ? 'text-green-400 text-lg' : 'text-red-400'}>
                {checks.authContextWorking ? '✅ Working' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-100 rounded">
              <span className="text-lg">Auth State</span>
              <span className={user ? 'text-green-400 text-lg' : 'text-yellow-400'}>
                {loading ? '⏳ Loading...' : user ? '✅ Authenticated' : '⚪ Not signed in'}
              </span>
            </div>
            {user && (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded">
                  <span className="text-lg">Email</span>
                  <span className="text-blue-300">{userEmail}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded">
                  <span className="text-lg">Email Verified</span>
                  <span className={emailVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {emailVerified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Firebase Configuration Details */}
        <div className="bg-slate-50 border border-slate-300 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-secondary">⚙️ Configuration Details</h2>
          <div className="text-sm text-text-secondary space-y-2 font-mono">
            <div className="p-3 bg-slate-100 rounded">
              Project ID: <span className="text-warning">futurematrix-17e10</span>
            </div>
            <div className="p-3 bg-slate-100 rounded">
              Auth Domain: <span className="text-warning">futurematrix-17e10.firebaseapp.com</span>
            </div>
            <div className="p-3 bg-slate-100 rounded">
              Firebase Console: <a href="https://console.firebase.google.com/project/futurematrix-17e10" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">console.firebase.google.com</a>
            </div>
            <div className="p-3 bg-slate-100 rounded">
              Google Cloud Console: <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">console.cloud.google.com</a>
            </div>
          </div>
        </div>

        {/* All Checks Passed */}
        {checks.firebaseConfigured && 
         checks.firebaseAuthDomain && 
         checks.firebaseProjectId && 
         checks.firebaseOAuthClientId &&
         checks.authContextWorking ? (
          <div className="bg-green-900/30 border border-green-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">✅ Firebase Connection Perfect!</h3>
            <p className="text-green-300">
              All Firebase configurations are properly set up. Your authentication system is ready to use.
            </p>
          </div>
        ) : (
          <div className="bg-red-900/30 border border-red-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-red-400 mb-2">❌ Configuration Issues Found</h3>
            <p className="text-red-300 mb-4">
              Please check your .env.local file and ensure all Firebase credentials are properly set.
            </p>
            <a 
              href="/auth/signup" 
              className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-text-primary transition-colors"
            >
              Go to Signup
            </a>
          </div>
        )}

        {/* Guide */}
        <div className="mt-8 bg-blue-900/30 border border-blue-600 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-4">📚 Next Steps</h3>
          <ol className="text-blue-300 space-y-2 list-decimal list-inside">
            <li>
              <strong>Test Email/Password Signup:</strong> Go to <a href="/auth/signup" className="text-secondary hover:underline">/auth/signup</a>
            </li>
            <li>
              <strong>Test Google OAuth:</strong> Click "Sign up with Google" button
            </li>
            <li>
              <strong>If Google Error:</strong> Check <a href="/debug-oauth" className="text-secondary hover:underline">/debug-oauth</a> for details
            </li>
            <li>
              <strong>Verify Configuration:</strong> Check browser console (F12) for Firebase initialization logs
            </li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <a 
            href="/auth/signup" 
            className="bg-secondary text-space-dark px-6 py-3 rounded-lg font-semibold hover:bg-warning transition-colors text-center"
          >
            Try Sign Up
          </a>
          <a 
            href="/auth/signin" 
            className="bg-warning text-space-dark px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors text-center"
          >
            Try Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
