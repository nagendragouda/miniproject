'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import BackButton from '@/components/BackButton'
import RoadmapDisplay from '@/components/RoadmapDisplay'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Download, Save, CheckCircle, 
  AlertCircle, Loader2, Map, FileText, Share2,
  ChevronRight, Award, Zap, Target, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase-client'
import Navbar from '@/components/Navbar'

function RoadmapResultContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const career = searchParams.get('career') || searchParams.get('to') || 'your future career'
  const duration = searchParams.get('duration') || ''
  
  const [profileData, setProfileData] = useState<any>(null)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [generating, setGenerating] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [source, setSource] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', user.uid)
      if (data && data.length > 0) setProfileData(data[0])
      else setProfileData({ education_level: 'Not specified', skills: [] }) // allow fallback
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfileData({ education_level: 'Not specified', skills: [] })
    }
  }, [user])

  const generateRoadmap = useCallback(async (profile: any, targetDuration: string) => {
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_education: profile?.education_level || 'High School',
          predicted_path: career,
          current_skills: profile?.skills || [],
          current_score: profile?.academic_score || '',
          target_duration: targetDuration
        }),
      })

      const data = await response.json()
      if (data.success && data.roadmap) {
        setRoadmap(data.roadmap)
        setSource(data.source)
      } else {
        setError(data.error || 'Failed to generate roadmap. Please try again.')
        toast.error('Generation failed. Click Retry.')
      }
    } catch (err: any) {
      console.error('Roadmap generation error:', err)
      setError('Network error. Please check your connection and retry.')
      toast.error('Network error. Please retry.')
    } finally {
      setGenerating(false)
    }
  }, [career])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin?next=/roadmap-result')
    else if (user) fetchProfile()
  }, [user, loading, router, fetchProfile])

  useEffect(() => {
    if (profileData && !roadmap && !error) generateRoadmap(profileData, duration)
  }, [profileData, roadmap, error, generateRoadmap, duration])

  const handleSave = async () => {
    if (!user || !roadmap) return
    setIsSaving(true)
    const loadingToast = toast.loading('Saving to your dashboard...')
    try {
      const { error } = await supabase.from('saved_roadmaps').insert({
        user_id: user.uid,
        career_name: career,
        roadmap_data: roadmap,
        source: source || 'dual-ai-race',
      })
      if (error) throw error
      setIsSaved(true)
      toast.success('Roadmap saved! Check your dashboard.', { id: loadingToast })
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error('Failed to save roadmap: ' + (error.message || 'Unknown error'), { id: loadingToast })
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-white">Generation Failed</h2>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={() => profileData && generateRoadmap(profileData, duration)}
            className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
          >
            {generating ? 'Retrying...' : 'Retry Now'}
          </button>
          <button onClick={() => router.back()} className="block text-slate-500 text-sm hover:text-white transition-colors">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading || (!roadmap && generating)) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="relative w-32 h-32 mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-l-2 border-cyan-400 rounded-full blur-[2px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-b-2 border-r-2 border-fuchsia-500 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
            Forging Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Success Path</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Synthesizing market data and your unique profile for <span className="text-white font-bold">{career}</span>...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Back Button - Premium Style */}
      <div className="fixed top-8 left-8 z-50 print:hidden">
        <motion.button
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-2xl"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
            <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
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

      <div className="relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Action Header - Matching Image Exactly */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-12 print:hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                  AI Generated Strategy
                </div>
                {source && (
                  <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {source.includes('ensemble') ? 'Ensemble Intelligence' : source.toUpperCase()}
                  </div>
                )}
                <div className="px-4 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400">
                  Premium Report
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none text-white">
                Career <span className="text-slate-500">Roadmap</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-400 pt-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">From</span>
                    <span className="text-base font-bold text-white">{profileData?.education_level || 'PUC'}</span>
                  </div>
                </div>
                
                <ChevronRight className="hidden md:block w-6 h-6 text-slate-800" />
                
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target</span>
                    <span className="text-base font-bold text-white">{career}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => window.print()}
                className="group relative px-8 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Download className="w-5 h-5 text-slate-400 transition-transform group-hover:-translate-y-0.5" /> 
                  <span className="text-slate-300">Export PDF</span>
                </div>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`group relative px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all shadow-2xl
                  ${isSaved 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                    : 'bg-white text-slate-950 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  <span>{isSaved ? 'Analysis Saved' : 'Save To Dashboard'}</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Main Roadmap Display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Print Only Branding */}
            <div className="print-only hidden mb-12 text-slate-900 border-b-4 border-slate-900 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter">FUTUREMATRIX</h1>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Career Prediction & Roadmap Engine</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase opacity-40">Verification ID: FM-AI-RM-{user?.uid.slice(0,8)}</p>
                  <p className="text-xs font-bold opacity-60">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-slate-100 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Subject: {profileData?.full_name}</h3>
                <p className="text-sm">Target Career: <strong>{career}</strong></p>
              </div>
            </div>

            <RoadmapDisplay data={roadmap} />
          </motion.div>
          
          {/* Footer CTA */}
          {!isSaved && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-24 p-12 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-fuchsia-500/10 border border-white/5 rounded-[3rem] text-center print:hidden"
            >
              <h3 className="text-3xl font-black text-white mb-4">Happy with this Roadmap?</h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Lock in this strategy to access it anytime from your personal dashboard and track your progress.</p>
              <button 
                onClick={handleSave}
                className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Save My Personalized Plan
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-hidden { display: none !important; }
          .print-only { display: block !important; }
          main { background: white !important; padding: 0 !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          nav { display: none !important; }
          .selection:bg-cyan-500/30 { background: transparent !important; }
        }
        .print-only { display: none; }
      `}</style>
    </main>
  )
}

export default function RoadmapResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <RoadmapResultContent />
    </Suspense>
  )
}
