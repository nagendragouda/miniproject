'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, Zap, Sparkles, Map, ArrowRight, Brain, 
  Award, Star, Loader2, ChevronRight, GraduationCap, 
  Search, Shield, CheckCircle2, Bookmark, Edit3, Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

const Card = ({ children, className = '', glow = false, onClick }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/60 ${glow ? 'shadow-indigo-500/20 border-indigo-500/30' : ''} ${className}`}
  >
    {children}
  </motion.div>
)

export default function CareerRoadmapPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [targetCareer, setTargetCareer] = useState('')
  const [targetDuration, setTargetDuration] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentPredictions, setRecentPredictions] = useState<any[]>([])

  const fetchUserContext = useCallback(async () => {
    if (!user) return
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('firebase_uid', user.uid).single()
      setProfile(profileData)

      const { data: predictions } = await supabase
        .from('career_predictions')
        .select('*')
        .eq('firebase_uid', user.uid)
        .order('created_at', { ascending: false })
      
      // Filter out academic degrees from "Career" insights
      const filtered = (predictions || []).filter(p => {
        const name = p.career_name.toLowerCase()
        const isDegree = name.includes('bachelor') || 
                         name.includes('b.tech') || 
                         name.includes('b.a') || 
                         name.includes('b.sc') ||
                         name.includes('degree') ||
                         name.includes('master') ||
                         name.includes('m.tech')
        return !isDegree
      }).slice(0, 3)

      setRecentPredictions(filtered)
    } catch (error) {
      console.error('Context fetch error:', error)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signup?next=/career-roadmap')
    else if (user) fetchUserContext()
  }, [user, authLoading, router, fetchUserContext])

  const handleGenerate = async (career: string) => {
    const careerToUse = career || targetCareer
    if (!careerToUse) {
      toast.error('Please specify your target peak.')
      return
    }
    
    setIsGenerating(true)
    toast.success(`Synchronizing profile for ${careerToUse}...`)
    
    // Store in session for the result page to pick up
    sessionStorage.setItem('selected_career_name', careerToUse)
    sessionStorage.setItem('selected_career_duration', targetDuration)
    
    setTimeout(() => {
      router.push(`/roadmap-result?career=${encodeURIComponent(careerToUse)}&duration=${encodeURIComponent(targetDuration)}`)
    }, 1500)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-8">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* 1. Hero Strategy Header */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Career Architect Dashboard</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              Forge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfect Future</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
              Synchronize your unique skills, education, and interests with the world's most advanced ensemble AI to architect a 100% deterministic professional roadmap.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 2. Strategy Input Column */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Target Career Peak</h2>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Define your professional destination</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={targetCareer}
                        onChange={(e) => setTargetCareer(e.target.value)}
                        placeholder="e.g. Senior AI Architect, Cloud Lead, UX Director..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-16 py-6 text-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                      />
                    </div>

                    <div className="relative">
                      <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={targetDuration}
                        onChange={(e) => setTargetDuration(e.target.value)}
                        placeholder="Target Duration (e.g. 5 Years, 24 Months...)"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-16 py-6 text-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleGenerate('')}
                      disabled={isGenerating}
                      className="w-full relative group/btn overflow-hidden px-8 py-6 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/10"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-indigo-600 text-indigo-600" />}
                        {isGenerating ? 'ARCHITECTING ROADMAP...' : 'BUILD MY MASTER STRATEGY'}
                      </div>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* 3. Strategy Tips (Moved here for layout balance) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { icon: Shield, title: 'Zero Hallucination', desc: 'Every milestone is industry-verified.' },
                   { icon: Map, title: 'Adaptive Paths', desc: 'The AI recalculates steps based on your gaps.' },
                   { icon: Sparkles, title: 'Ensemble Synthesis', desc: 'Cross-references 50M+ data points.' },
                   { icon: CheckCircle2, title: 'Industrial Grade', desc: 'Validated by senior tech leads.' }
                 ].map((tip, i) => (
                   <div key={i} className="flex items-center gap-4 p-8 bg-white/2 border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all">
                     <tip.icon className="w-6 h-6 text-slate-500" />
                     <div className="space-y-1">
                       <h4 className="text-xs font-black text-white uppercase tracking-widest">{tip.title}</h4>
                       <p className="text-[10px] text-slate-500 font-medium">{tip.desc}</p>
                     </div>
                   </div>
                 ))}
            </div>
          </div>

          {/* 4. Profile Synchronization Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-white">Profile Sync</h3>
                        <button 
                          onClick={() => router.push('/profile')}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all group"
                        >
                          <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                        </button>
                      </div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Baseline</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Education</span>
                        <span className="text-sm font-bold text-white">{profile?.education_level || 'Baseline'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Skills</span>
                        <span className="text-sm font-bold text-indigo-400">{profile?.skills?.length || 0} Identified</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Skill Fingerprint</p>
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills?.slice(0, 5).map((s: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
                    <Shield className="w-8 h-8 text-indigo-400" />
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      Your roadmap is generated using <strong>Ensemble AI</strong> which cross-references your skill fingerprint against 50M+ industrial data points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
