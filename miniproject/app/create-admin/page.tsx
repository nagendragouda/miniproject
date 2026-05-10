'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function CreateAdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [adminUid, setAdminUid] = useState('')

  const handleCreateAdmin = async () => {
    setStatus('loading')
    setMessage('Creating admin account in Firebase...')

    try {
      console.log('🔐 Starting admin account creation...')
      
      // Create the admin account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@gmail.com',
        'admin1234'
      )

      const user = userCredential.user

      setAdminUid(user.uid)
      setStatus('success')
      setMessage(
        `✅ Admin account created successfully!\n\n` +
        `UID: ${user.uid}\n` +
        `Email: ${user.email}\n` +
        `You can now sign in with:\n` +
        `Email: admin@gmail.com\n` +
        `Password: admin1234`
      )

      console.log('✅ Admin account created successfully!')
      console.log('User UID:', user.uid)
      console.log('Email:', user.email)
    } catch (error: any) {
      console.error('❌ Error creating admin account:', error)

      if (error.code === 'auth/email-already-in-use') {
        setStatus('success')
        setMessage(
          `✅ Admin account already exists!\n\n` +
          `You can sign in with:\n` +
          `Email: admin@gmail.com\n` +
          `Password: admin1234\n\n` +
          `Try signing in now.`
        )
      } else if (error.code === 'auth/weak-password') {
        setStatus('error')
        setMessage('❌ Password is too weak (min 6 characters)')
      } else if (error.code === 'auth/invalid-email') {
        setStatus('error')
        setMessage('❌ Invalid email address')
      } else {
        setStatus('error')
        setMessage(
          `❌ Error: ${error.message}\n\n` +
          `Code: ${error.code}\n\n` +
          `Please try the manual method below.`
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔐 Create Admin Account</h1>
          <p className="text-gray-600">One-click admin account setup for Firebase</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ What this does:</strong> Creates an admin account in your Firebase project with:
            </p>
            <div className="mt-2 font-mono text-sm text-gray-600 space-y-1 ml-4">
              <p>• Email: <code className="bg-gray-100 px-2 py-1 rounded">admin@gmail.com</code></p>
              <p>• Password: <code className="bg-gray-100 px-2 py-1 rounded">admin1234</code></p>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 whitespace-pre-wrap text-sm font-mono ${
                status === 'success'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : status === 'error'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-blue-50 border-blue-500 text-blue-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={handleCreateAdmin}
            disabled={status === 'loading' || status === 'success'}
            className={`w-full py-4 rounded-lg font-bold transition-all text-white mb-4 ${
              status === 'success'
                ? 'bg-green-500 cursor-not-allowed'
                : status === 'error'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
            }`}
          >
            {status === 'loading' && '⏳ Creating account...'}
            {status === 'success' && '✅ Admin account created!'}
            {status === 'error' && '🔄 Try again'}
            {status === 'idle' && '🚀 Create Admin Account'}
          </button>

          {/* Next Steps */}
          {status === 'success' && (
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="block w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all text-center"
              >
                👤 Go to Sign In Page
              </Link>
              <Link
                href="/admin/signin"
                className="block w-full py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all text-center"
              >
                👨‍💼 Go to Admin Sign In
              </Link>
              <div className="text-center text-gray-600 text-sm">
                Or try the credentials above directly
              </div>
            </div>
          )}
        </div>

        {/* Manual Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 If automatic method doesn't work:</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 1: Open Firebase Console</h3>
              <a
                href="https://console.firebase.google.com/project/futurematrix-17e10/authentication/users"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline break-all text-sm"
              >
                https://console.firebase.google.com/project/futurematrix-17e10/authentication/users
              </a>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 2: Click "Add user" button</h3>
              <p className="text-gray-600 text-sm">Look for a red button labeled "Add user" in the Users tab</p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 3: Enter credentials</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-700 space-y-1">
                <p>Email: <strong>admin@gmail.com</strong></p>
                <p>Password: <strong>admin1234</strong></p>
              </div>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Step 4: Create user</h3>
              <p className="text-gray-600 text-sm">Click "Create user" button and wait for confirmation</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded">
              <h3 className="font-semibold text-green-900 mb-2">✅ Done!</h3>
              <p className="text-green-800 text-sm">The admin account is now created. You can sign in at /auth/signin or /admin/signin</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
