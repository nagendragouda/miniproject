'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Loader2,
  Target,
  Zap,
  Star,
  DollarSign,
  ExternalLink,
  MapPin,
  Calendar,
  Heart,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FloatingShapes from '@/components/FloatingShapes'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface AICollege {
  id: string
  institution_name: string
  location: string
  institution_type: string
  category: { government: boolean; private: boolean; deemed: boolean }
  coordinates: { latitude: number; longitude: number }
  rating: number
  annual_fees: string
  established_year: number
  website_url: string
  description: string
  matchScore?: number
}

interface MatchParams {
  location?: string
  type?: string
  level?: string
  stream?: string
  query?: string
}

function AICollegeCard({ 
  college, 
  index,
  isSaved,
  onToggleSave
}: { 
  college: AICollege
  index: number
  isSaved: boolean
  onToggleSave: (college: AICollege) => void 
}) {
  const [saving, setSaving] = useState(false)
  
  const categoryLabel = college.category?.government ? 'Government' 
    : college.category?.private ? 'Private' 
    : college.category?.deemed ? 'Deemed' 
    : college.institution_type || 'University'

  const matchPct = Math.min(Math.round((college.rating / 5) * 99), 99)

  const handleClick = async () => {
    setSaving(true)
    await onToggleSave(college)
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group relative flex flex-col rounded-[2.5rem] border border-white/10 bg-[#030712]/80 backdrop-blur-3xl overflow-hidden hover:border-cyan-400/40 hover:shadow-[0_30px_60px_rgba(34,211,238,0.08)] transition-all duration-500"
    >
      {/* Top glow bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Match Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest shadow-lg shadow-cyan-400/30">
          <Zap className="h-3 w-3 fill-current" />
          {matchPct}% Match
        </div>
      </div>

      {/* Save / Unsave Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleClick}
          disabled={saving}
          title={isSaved ? 'Click to unsave' : 'Save institution'}
          className={`h-10 w-10 rounded-2xl border flex items-center justify-center transition-all ${
            isSaved 
              ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-400'
          }`}
        >
          {saving 
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          }
        </button>
      </div>

      <div className="p-8 pt-16 space-y-6">
        {/* Name & Location */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors tracking-tight">
            {college.institution_name}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium">{college.location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-black uppercase tracking-wider text-cyan-300">
            {categoryLabel}
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider text-purple-300">
            {college.institution_type}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/3 border border-white/5 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-3.5 w-3.5 text-cyan-400 fill-current" />
              <span className="text-sm font-black text-white">{college.rating}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Rating</span>
          </div>
          <div className="rounded-2xl bg-white/3 border border-white/5 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-sm font-black text-white">{college.established_year || '—'}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Estd.</span>
          </div>
          <div className="rounded-2xl bg-white/3 border border-white/5 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Fees/yr</span>
            <p className="text-[10px] font-bold text-white mt-0.5 truncate">{college.annual_fees || 'N/A'}</p>
          </div>
        </div>

        {/* Description */}
        {college.description && (
          <div className="rounded-2xl bg-white/2 border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">AI Insight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">"{college.description}"</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-8 pb-8">
        <Link
          href={college.website_url || `https://www.google.com/search?q=${encodeURIComponent(college.institution_name)}`}
          target="_blank"
          className="group/btn flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-slate-300 hover:border-cyan-400/40 hover:text-cyan-400 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          Visit Institution
        </Link>
      </div>
    </motion.div>
  )
}

export default function AIResultsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [results, setResults] = useState<AICollege[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useState<MatchParams | null>(null)
  const [enginesUsed, setEnginesUsed] = useState(0)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [locationExact, setLocationExact] = useState(true)
  const [fallbackMessage, setFallbackMessage] = useState('')

  useEffect(() => {
    const savedParams = localStorage.getItem('fm_match_params')
    if (!savedParams) {
      router.push('/colleges')
      return
    }
    const parsed: MatchParams = JSON.parse(savedParams)
    setParams(parsed)
    runAISynthesis(parsed)
  }, [])

  // Load already-saved colleges for the current user
  useEffect(() => {
    if (!user) return
    fetch(`/api/saved-colleges?userId=${user.uid}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const ids = new Set<string>(data.savedColleges.map((sc: any) => sc.collegeId || sc.college_id))
          setSavedIds(ids)
        }
      })
      .catch(() => {})
  }, [user])

  const handleToggleSave = async (college: AICollege) => {
    // Use institution_name as stable ID (ai-generated IDs change each session)
    const id = college.institution_name?.trim().toLowerCase().replace(/\s+/g, '_') || college.id

    if (!user) {
      toast.error('Please sign in to save colleges')
      return
    }

    const isSaved = savedIds.has(id)

    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-colleges?userId=${user.uid}&collegeId=${encodeURIComponent(id)}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next })
          toast.success('College Removed')
        } else {
          toast.error(data.error || 'Remove failed')
        }
      } else {
        const res = await fetch('/api/saved-colleges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            collegeId: id,
            collegeName: college.institution_name,
            collegeLocation: college.location,
            collegeType: college.institution_type,
            rating: college.rating,
            fees: college.annual_fees,
            latitude: college.coordinates?.latitude || 0,
            longitude: college.coordinates?.longitude || 0,
            collegeDescription: college.description,
            collegeWebsite: college.website_url,
          })
        })
        const data = await res.json()
        if (data.success) {
          setSavedIds(prev => new Set([...prev, id]))
          toast.success('College Added Successfully!')
        } else {
          toast.error(data.error || 'Save failed')
          console.error('Save error:', data)
        }
      }
    } catch (err: any) {
      toast.error('Network error: ' + (err?.message || 'Unknown'))
      console.error('Save exception:', err)
    }
  }

  const runAISynthesis = async (p: MatchParams) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: p.location || '',
          type: p.type || '',
          level: p.level || '',
          stream: p.stream || '',
          query: p.query || ''
        })
      })
      const data = await res.json()
      if (data.success && data.recommendations?.length > 0) {
        setResults(data.recommendations)
        setEnginesUsed(data.successful_engines || 1)
        setLocationExact(data.location_exact ?? true)
        setFallbackMessage(data.location_fallback_message || '')
      } else {
        setError(data.error || 'No institutions found for your parameters.')
      }
    } catch (err: any) {
      setError('Neural synthesis connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.08),_transparent_50%)]" />
      <FloatingShapes />

      {/* Navigation */}
      <div className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
        <Link href="/colleges" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all">
          <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-400/20 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Refine Search</span>
        </Link>

        {!loading && enginesUsed > 0 && (
          <div className="px-6 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{enginesUsed} AI Engine{enginesUsed > 1 ? 's' : ''} Active</span>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12 pb-32">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-48 gap-12"
            >
              <div className="relative">
                <div className="h-32 w-32 border border-cyan-400/20 rounded-full animate-ping absolute inset-0" />
                <div className="h-32 w-32 border-4 border-t-cyan-400 border-r-indigo-500 border-b-purple-600 border-l-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-10 w-10 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter">
                  Synthesizing <span className="text-cyan-400">Optimal</span> Nodes
                </h2>
                <p className="text-slate-500 text-sm font-medium">Analyzing institutional databases across multiple intelligence engines...</p>
              </div>
            </motion.div>

          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-8"
            >
              <Target className="h-20 w-20 text-slate-700 opacity-30" />
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black uppercase text-white">Synthesis Error</h2>
                <p className="text-slate-500 text-sm max-w-md">{error}</p>
              </div>
              <Link href="/colleges" className="px-8 py-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-cyan-400/20 transition-all">
                Return & Refine
              </Link>
            </motion.div>

          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* Header */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" /> Synthesis Complete — {results.length} Institutions Found
                </div>
                <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                  Your Optimal <span className="italic text-cyan-400">Nodes</span>
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  {params?.location && <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">📍 {params.location}</span>}
                  {params?.stream && <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">📚 {params.stream}</span>}
                  {params?.type && <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">🏛 {params.type}</span>}
                  {params?.level && <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">🎓 {params.level}</span>}
                </div>
              </div>

              {/* Fallback Warning */}
              {!locationExact && fallbackMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto max-w-3xl p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4"
                >
                  <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-amber-400 font-bold uppercase tracking-wider text-sm mb-1">Region Expanded</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{fallbackMessage}</p>
                  </div>
                </motion.div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((college, index) => (
                  <AICollegeCard 
                    key={college.id || index} 
                    college={college} 
                    index={index}
                    isSaved={savedIds.has(
                      college.institution_name?.trim().toLowerCase().replace(/\s+/g, '_') || college.id
                    )}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {/* Refine CTA */}
              <div className="flex flex-col items-center gap-6 pt-16 border-t border-white/5">
                <p className="text-slate-500 text-sm">Not satisfied with these results?</p>
                <Link href="/colleges" className="px-12 py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                  Refine Parameters
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
