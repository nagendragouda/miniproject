'use client'

import { useState, useEffect } from 'react'
import { auth as firebaseAuth } from '@/lib/firebase'

export default function GoogleOAuthTest() {
  const [config, setConfig] = useState<any>(null)
  const [authState, setAuthState] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Check config on mount
    const cfg = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      oauthClientId: process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID,
      currentOrigin: window.location.origin,
      currentUrl: window.location.href,
    }
    setConfig(cfg)
    setAuthState(firebaseAuth?.currentUser || null)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-text-primary p-8">
      <h1 className="text-3xl font-bold mb-8">🔧 Google OAuth Debug Test</h1>

      {/* Config Check */}
      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">📋 Firebase Configuration</h2>
        <pre className="bg-black p-4 rounded overflow-auto text-sm">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      {/* Auth State */}
      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">👤 Current Auth State</h2>
        <pre className="bg-black p-4 rounded overflow-auto text-sm">
          {authState ? (
            JSON.stringify({
              uid: authState.uid,
              email: authState.email,
              displayName: authState.displayName,
              emailVerified: authState.emailVerified,
              isAnonymous: authState.isAnonymous,
              metadata: authState.metadata,
            }, null, 2)
          ) : (
            'No user signed in'
          )}
        </pre>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 p-6 rounded-lg mb-6 border border-red-500">
          <h2 className="text-xl font-bold mb-2">❌ Error</h2>
          <pre className="bg-black p-4 rounded overflow-auto text-sm text-red-300">
            {error}
          </pre>
        </div>
      )}

      {/* Checks */}
      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">✅ System Checks</h2>
        <div className="space-y-2">
          {config?.apiKey && <p className="text-green-400">✅ API Key configured</p>}
          {config?.authDomain && <p className="text-green-400">✅ Auth domain set</p>}
          {config?.projectId && <p className="text-green-400">✅ Project ID set</p>}
          {config?.oauthClientId && <p className="text-green-400">✅ OAuth Client ID set</p>}
          {config?.currentOrigin === 'http://localhost:3000' && (
            <p className="text-green-400">✅ Running on localhost:3000</p>
          )}
          {!config?.oauthClientId && (
            <p className="text-red-400">❌ OAuth Client ID not in .env.local</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📖 If You See auth/internal-error:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Go to Google Cloud Console: console.cloud.google.com</li>
          <li>Search for "OAuth consent screen"</li>
          <li>Create consent screen (if not done)</li>
          <li>Go to "Credentials"</li>
          <li>Click your Web OAuth app</li>
          <li>Add Authorized JavaScript origins: http://localhost:3000</li>
          <li>Save changes</li>
          <li>Restart dev server</li>
          <li>Hard refresh browser: Ctrl+Shift+R</li>
        </ol>
      </div>
    </div>
  )
}
