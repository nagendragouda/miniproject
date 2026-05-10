'use client'

import { useEffect, useState } from 'react'

export default function DebugOAuthPage() {
  const [config, setConfig] = useState<any>({})
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Log configuration to page
    const newLogs = []

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const oauthClientId = process.env.NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID

    newLogs.push(`API Key: ${apiKey ? '✅ Present' : '❌ Missing'}`)
    newLogs.push(`Auth Domain: ${authDomain ? '✅ ' + authDomain : '❌ Missing'}`)
    newLogs.push(`Project ID: ${projectId ? '✅ ' + projectId : '❌ Missing'}`)
    newLogs.push(`OAuth Client ID: ${oauthClientId ? '✅ ' + oauthClientId : '❌ Missing'}`)
    newLogs.push(`Origin: ${window.location.origin}`)

    setConfig({ apiKey, authDomain, projectId, oauthClientId })
    setLogs(newLogs)

    // Also log to console
    console.log('🔍 OAuth Configuration Debug Info:')
    console.log(newLogs)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Firebase OAuth Debug</h1>

        <div className="bg-slate-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          <div className="space-y-3 font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="text-text-secondary">
                {log.includes('✅') ? (
                  <span className="text-green-400">{log}</span>
                ) : log.includes('❌') ? (
                  <span className="text-red-400">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 How to Debug</h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>1. Open DevTools: <span className="font-mono bg-slate-100 px-2 py-1">F12</span> or Right-click → Inspect</p>
            <p>2. Go to <span className="font-mono bg-slate-100 px-2 py-1">Console</span> tab</p>
            <p>3. Look for "🔍 OAuth Configuration Debug Info"</p>
            <p>4. Try clicking Google signup button</p>
            <p>5. Look for error logs starting with <span className="font-mono bg-slate-100 px-2 py-1">❌</span></p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">🔧 What to Check</h2>
          <ul className="space-y-2 text-sm text-text-secondary list-disc list-inside">
            <li>
              <strong>OAuth Consent Screen created?</strong>
              <br />
              Visit: <a href="https://console.cloud.google.com/apis/consent" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">console.cloud.google.com/apis/consent</a>
            </li>
            <li>
              <strong>Localhost added to origins?</strong>
              <br />
              Visit: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">console.cloud.google.com/apis/credentials</a>
              <br />
              Add: <span className="font-mono bg-slate-100 px-2 py-1">http://localhost:3003</span> (and save!)
            </li>
            <li>
              <strong>Google provider enabled in Firebase?</strong>
              <br />
              Visit: <a href="https://console.firebase.google.com/project/futurematrix-17e10/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">firebase.google.com → Authentication</a>
              <br />
              Check Google has green toggle
            </li>
          </ul>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-600/50 p-4 rounded-lg">
          <p className="text-yellow-300 text-sm">
            <strong>⚠️ Important:</strong> After making changes in Google Cloud, restart your dev server (Ctrl+C, then npm.cmd run dev)
          </p>
        </div>

        <div className="mt-8">
          <a 
            href="/auth/signup" 
            className="inline-block bg-secondary text-space-dark px-6 py-2 rounded-lg font-semibold hover:bg-warning transition-colors"
          >
            ← Back to Signup
          </a>
        </div>
      </div>
    </div>
  )
}
