'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface SafePageProps {
  children: ReactNode
  title: string
  loading?: boolean
  error?: string | null
}

export default function SafePage({ 
  children, 
  title, 
  loading = false, 
  error = null 
}: SafePageProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="text-red-400 mb-4">⚠️ {title} Loading Error</div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-secondary to-warning rounded-lg text-space-dark font-semibold"
          >
            Reload Page
          </button>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-2 border-secondary/50 border-t-secondary rounded-full"
        />
      </div>
    )
  }

  return <>{children}</>
}
