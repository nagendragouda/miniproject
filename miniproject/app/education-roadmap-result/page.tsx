'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Download, Save, CheckCircle, AlertCircle, Loader2, Map,
  BookOpen, Target, Zap, Award, TrendingUp, Clock, Trophy, 
  ArrowRight, ChevronRight, FileText, ExternalLink, ShieldCheck, Cpu, RefreshCcw, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

interface EducationRoadmapData {
  success: boolean
  title: string
  description: string
  current_education: string
  next_education: string
  duration: string
  steps: Array<{
    phase: number
    title: string
    duration: string
    description: string
    keyActivities: string[]
    resources: Array<{
      title: string
      type: string
    }>
    milestones: string[]
  }>
  projects: Array<{
    title: string
    description: string
    duration: string
    difficulty: string
    skillsBuilt: string[]
  }>
  timeline: {
    month1_2: string
    month3_6: string
    month7_12: string
    after12: string
  }
  commonMistakes: string[]
  successCriteria: string[]
  estimatedCost?: string
}

function EducationRoadmapResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const [roadmap, setRoadmap] = useState<EducationRoadmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activePhase, setActivePhase] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchOrLoadRoadmap = async () => {
      setLoading(true)
      
      // 1. Try Session Storage first
      const storedRoadmap = sessionStorage.getItem('education_roadmap')
      if (storedRoadmap) {
        try {
          const parsed = JSON.parse(storedRoadmap)
          // Ensure it's the correct roadmap for the current query
          if (parsed.current_education === from && parsed.next_education === to) {
            setRoadmap(parsed)
            setLoading(false)
            return
          }
        } catch (e) {}
      }

      // 2. If from/to params exist, generate via AI
      if (from && to) {
        setIsGenerating(true)
        try {
          const response = await fetch('/api/education/deep-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to })
          })
          const data = await response.json()
          if (data.success) {
            setRoadmap(data)
            sessionStorage.setItem('education_roadmap', JSON.stringify(data))
          } else {
            toast.error('Neural synthesis failed. Please try again.')
          }
        } catch (err) {
          toast.error('Critical link failure during synthesis.')
        } finally {
          setIsGenerating(false)
        }
      }
      
      setLoading(false)
    }

    fetchOrLoadRoadmap()
  }, [from, to])

  const handleDownload = () => {
    window.print()
  }

  if (loading || isGenerating) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15),_transparent_70%)] animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-[2rem] border-2 border-cyan-500/30 border-t-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
            />
            <Cpu className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Deep Neural Synthesis</h2>
            <p className="text-slate-500 text-sm font-bold animate-pulse">Architecting your path from {from} to {to}...</p>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Roadmap Identification Failed</h2>
          <p className="text-slate-400 text-sm mb-6">We couldn't synthesize your educational path. Please return to the generator and ensure all fields are correct.</p>
          <button 
            onClick={() => router.push('/career-roadmap')}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            Return to Generator
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      {/* Back Button - Premium Style */}
      <div className="fixed top-8 left-8 z-50 print:hidden">
        <motion.button
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-2xl"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          Return to Hub
        </motion.button>
      </div>

      {/* Dynamic Background - Enhanced for Perfection */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-8"
          >
            <Sparkles className="w-3 h-3" /> Educational Intelligence Report
          </motion.div>

          <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight mb-8 tracking-tighter">
            Path <span className="text-slate-500">Blueprint</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 pt-4 mb-12">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">From</span>
                <span className="text-base font-bold text-white">{from}</span>
              </div>
            </div>
            
            <ChevronRight className="hidden md:block w-6 h-6 text-slate-800" />
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target</span>
                <span className="text-base font-bold text-white">{to}</span>
              </div>
            </div>
          </div>

          <p className="text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium mb-12 italic">
            "{roadmap.description}"
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-black uppercase">Estimated Duration</p>
                <p className="text-sm font-bold text-white">{roadmap.duration}</p>
              </div>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-black uppercase">Resource Intensity</p>
                <p className="text-sm font-bold text-white">{roadmap.estimatedCost || 'Optimized'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Timeline Track */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Phase I', content: roadmap.timeline.month1_2, icon: Target, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
              { label: 'Phase II', content: roadmap.timeline.month3_6, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { label: 'Phase III', content: roadmap.timeline.month7_12, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Completion', content: roadmap.timeline.after12, icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-all duration-500"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${item.color}`}>{item.label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed italic">"{item.content}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Phases Detail */}
        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 mb-10">
              <Map className="w-8 h-8 text-cyan-400" /> Strategic Execution Phases
            </h2>
            
            <div className="space-y-6">
              {roadmap.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden ${
                    activePhase === idx 
                    ? 'bg-white/5 border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.1)]' 
                    : 'bg-white/2 border-white/10 hover:border-white/20'
                  }`}
                >
                  {activePhase === idx && <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xl text-white">
                        0{step.phase}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">{step.duration}</p>
                      </div>
                    </div>
                    {activePhase === idx ? <CheckCircle className="w-6 h-6 text-cyan-400" /> : <ChevronRight className="w-6 h-6 text-slate-700" />}
                  </div>

                  <p className="text-slate-400 mb-8 leading-relaxed font-medium">{step.description}</p>

                  <AnimatePresence>
                    {activePhase === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5"
                      >
                        <div>
                          <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Critical Activities</h4>
                          <ul className="space-y-3">
                            {step.keyActivities.map((a, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" /> {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Milestones</h4>
                          <ul className="space-y-3">
                            {step.milestones.map((m, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <Trophy className="w-4 h-4 text-amber-500/50 mt-0.5" /> {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            {/* Suggested Projects */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-5 h-5 text-fuchsia-400" /> Portfolio Projects
              </h3>
              <div className="space-y-4">
                {roadmap.projects.map((p, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-fuchsia-400/30 transition-all">
                    <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex gap-2 mt-4">
                      {p.skillsBuilt.slice(0, 2).map(s => (
                        <span key={s} className="px-2 py-1 rounded-lg bg-fuchsia-400/10 text-[9px] font-black text-fuchsia-400 uppercase tracking-widest">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" /> Pitfalls to Avoid
              </h3>
              <div className="space-y-3">
                {roadmap.commonMistakes.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-red-400/5 border border-red-400/10 rounded-xl text-xs text-slate-400 font-medium">
                    <span className="text-red-400">×</span> {m}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Final CTA / Social / Footer */}
        <footer className="pt-20 border-t border-white/5 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 print:hidden">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.05] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" /> Download Blueprint
            </button>
            <button 
              onClick={() => router.push('/career-roadmap')}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <RefreshCcw className="w-5 h-5" /> Generate Alternative
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-4 opacity-40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Neural-Sync v4.0
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Cpu className="w-3 h-3 text-fuchsia-400" /> AI-Driven Trajectory
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Education Blueprint ID: EDU-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function EducationRoadmapResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    }>
      <EducationRoadmapResultContent />
    </Suspense>
  )
}
