'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface PastQuizResult {
  id: string
  career_path: string
  score: number
  created_at: string
}

import FloatingShapes from '@/components/FloatingShapes'
import BackButton from '@/components/BackButton'
import { motion } from 'framer-motion'
import { Calendar, Award, ChevronRight, History } from 'lucide-react'

export default function PastQuizResultsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [results, setResults] = useState<PastQuizResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?next=/quiz/past-results')
      return
    }
    loadResults()
  }, [user, router])

  const loadResults = async () => {
    try {
      const response = await fetch('/api/quiz/past-results')
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20'
    if (score >= 60) return 'from-yellow-500/20 to-amber-500/20'
    return 'from-orange-500/20 to-red-500/20'
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-50">
        <BackButton />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-warning rounded-2xl mx-auto flex items-center justify-center mb-6">
            <History className="w-10 h-10 text-space-dark" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
            Your Assessment History
          </h1>
          <p className="text-xl text-text-secondary">Track your career evolution and matching accuracy over time</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-text-secondary text-lg">Retrieving your career history...</p>
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-3xl"
          >
            <Award className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <p className="text-2xl font-bold text-white mb-4">No assessments yet</p>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">Take your first career discovery quiz to start building your personalized career profile.</p>
            <button
              onClick={() => router.push('/quiz')}
              className="px-8 py-4 bg-gradient-to-r from-secondary to-warning text-space-dark font-bold rounded-2xl hover:shadow-lg transition-all"
            >
              Start First Quiz
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group hover:bg-white/5 transition-all p-8 rounded-2xl cursor-pointer border border-white/10 hover:border-secondary/50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getScoreBackground(result.score)} ${getScoreColor(result.score)}`}>
                        {result.score}% Match
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(result.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">
                      {result.career_path}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
                      View Details
                    </button>
                    <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-secondary transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
