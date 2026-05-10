'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-dark">
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
        
        <h1 className="text-3xl font-bold text-white mb-2">Critical Error</h1>
        <p className="text-slate-600 mb-2 text-sm">{error.message || 'A critical error occurred'}</p>
        {error.digest && <p className="text-slate-500 text-xs mb-6">Error ID: {error.digest}</p>}
        
        <button
          onClick={reset}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink px-6 py-3 rounded-lg text-space-dark font-bold hover:shadow-lg hover:shadow-neon-cyan/25 transition-all"
        >
          Reload Page
        </button>
      </motion.div>
    </div>
  )
}
