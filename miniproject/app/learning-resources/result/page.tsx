'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Star, 
  BookOpen, 
  Target, 
  Zap, 
  Sparkles,
  BarChart3,
  Download,
  Share2,
  CheckCircle2,
  History,
  Layout,
  Globe
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FloatingShapes from '@/components/FloatingShapes'
import NeuralBackground from '@/components/NeuralBackground'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Resource {
  id: string
  title: string
  type: string
  category: string
  difficulty: string
  duration: string
  rating: number
  description: string
  access_url: string
  author: string
  topics: string[]
  free: boolean
  learning_process?: string[]
  learners_count?: string
  accuracy_score?: number
}

export default function SynthesisResultPage() {
  const router = useRouter()
  const { user } = useFirebaseAuth()
  const [results, setResults] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [savedNodes, setSavedNodes] = useState<Set<string>>(new Set())

  const handleSaveNode = async (e: React.MouseEvent, resource: Resource) => {
    e.preventDefault() // Prevent opening the link
    if (!user) {
      toast.error('Authentication Required', { description: 'Please sign in to save learning resources.' })
      return
    }

    try {
      // 1. Save to User's Private Vault
      const response = await fetch('/api/saved-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, resource })
      })
      const data = await response.json()
      
      if (data.success || data.message === 'Already saved') {
        // 2. Also save to Global Verified Registry (learning_processes table)
        await fetch('/api/admin/learning-processes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add',
            title: resource.title,
            description: resource.description,
            instructor: resource.author || 'Apex AI',
            category: resource.category || 'General Intelligence',
            duration: resource.duration || 'Self-paced',
            rating: resource.rating || 4.5,
            skills: resource.topics || [],
            difficulty_level: resource.difficulty || 'Intermediate',
            is_paid: !resource.free,
            access_url: resource.access_url,
            icon_emoji: '✨',
            status: 'Active'
          })
        })

        setSavedNodes(prev => new Set(prev).add(resource.id || resource.title))
        toast.success(data.message === 'Already saved' ? 'Already in Vault' : 'Node Saved', { 
          description: 'Course added to your vault and the global Registry.' 
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error('Save Failed', { description: error.message || 'Could not save the node.' })
    }
  }

  useEffect(() => {
    const savedResults = localStorage.getItem('fm_learning_synthesis')
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults))
      } catch (e) {
        console.error('Failed to parse results')
      }
    }
    setLoading(false)
  }, [])

  const handleGoBack = () => {
    router.push('/learning-resources')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-fuchsia-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <main className="relative min-h-screen w-full bg-[#030712] text-white selection:bg-fuchsia-500/30 overflow-x-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0">
        <NeuralBackground />
        <FloatingShapes />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712]" />
      </div>

      {/* Header Navigation */}
      <div className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <button 
          onClick={handleGoBack}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-fuchsia-500/30 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">Back to Hub</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {/* Page Title */}
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-400/10 border border-fuchsia-400/20 text-fuchsia-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Synthesized Learning Path
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8"
          >
            Your <span className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Apex Path.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
          >
            We've architected a personalized educational roadmap based on your unique goals and mastery levels.
          </motion.p>
        </header>

        {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {results.map((resource, index) => (
                  <motion.a
                    key={resource.id}
                    href={resource.access_url || (resource as any).link || (resource as any).url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-fuchsia-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.1)] flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 border border-fuchsia-400/20 shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => handleSaveNode(e, resource)}
                            className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-400/30 transition-all z-20"
                          >
                            {savedNodes.has(resource.id || resource.title) ? (
                              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <span className={`px-3 py-1 flex items-center rounded-xl text-[8px] font-black uppercase tracking-widest border ${resource.free ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                            {resource.free ? 'FREE' : 'PREMIUM'}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-lg font-black text-white group-hover:text-fuchsia-400 transition-colors line-clamp-2 leading-tight mb-2">{resource.title}</h2>
                      <div className="flex items-center gap-3 mb-4">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{resource.author}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{resource.accuracy_score || 98}% Accuracy</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.1em]">{resource.learners_count || '10,000+'} Global Learners</p>
                      </div>

                      <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3">
                        {resource.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <Clock className="w-4 h-4 text-indigo-400 mb-1" />
                          <p className="text-[9px] font-black text-white uppercase">{resource.duration}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <BarChart3 className="w-4 h-4 text-fuchsia-400 mb-1" />
                          <p className="text-[9px] font-black text-white uppercase">{resource.difficulty}</p>
                        </div>
                      </div>

                      {resource.learning_process && resource.learning_process.length > 0 && (
                        <div className="space-y-2 mb-6">
                          {resource.learning_process.slice(0, 3).map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2 opacity-60">
                              <CheckCircle2 className="w-3 h-3 text-fuchsia-500" />
                              <p className="text-[9px] font-bold text-slate-300 truncate">{step}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full py-3 bg-fuchsia-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl group-hover:bg-fuchsia-400 transition-all flex items-center justify-center gap-2">
                      <ExternalLink className="w-3 h-3" /> Launch Node
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
            <BookOpen className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-white mb-4">No Data Synchronized</h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Please return to the Knowledge Hub and initiate a new synthesis request.</p>
            <button 
              onClick={handleGoBack}
              className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all"
            >
              Back to Hub
            </button>
          </div>
        )}
      </div>

      <footer className="relative z-10 py-20 border-t border-white/5 text-center px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-fuchsia-400" /> Powered by Apex Strategic Intelligence
          </div>
          <p className="text-slate-600 text-[9px] max-w-2xl font-medium tracking-widest leading-relaxed">
            THIS REPORT IS GENERATED USING MULTI-ENGINE AI AGGREGATION AND IS INTENDED FOR STRATEGIC CAREER PLANNING ONLY.
            FUTUREMATRIX IS NOT RESPONSIBLE FOR CONTENT ACCURACY ON EXTERNAL PLATFORMS.
          </p>
        </div>
      </footer>
    </main>
  )
}
