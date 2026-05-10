'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-slate-600 mb-8">{error.message || 'An error occurred during authentication'}</p>
        
        <div className="space-y-3">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink px-6 py-3 rounded-lg text-space-dark font-bold hover:shadow-lg hover:shadow-neon-cyan/25 transition-all"
          >
            Try Again
          </motion.button>
          
          <Link
            href="/"
            className="block w-full bg-slate-200 hover:bg-slate-100-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
