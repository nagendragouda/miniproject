'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    // Check if we're in demo mode by checking environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    const isConfigured = (
      url && 
      key && 
      url !== 'https://your-project-id.supabase.co' && 
      key !== 'your-anon-key-here' &&
      url.startsWith('https://') &&
      key.startsWith('eyJ')
    )
    
    setIsDemoMode(!isConfigured)
  }, [])

  // Don't render until hydration is complete
  if (!isHydrated || isDemoMode === null || !isDemoMode || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <div className="text-sm font-medium text-slate-100">
                <span className="font-semibold">Demo Mode:</span> Premium features unlocked.
                <span className="hidden sm:inline text-slate-300 ml-1">Try • demo@example.com/demo123</span>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors duration-200 p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}