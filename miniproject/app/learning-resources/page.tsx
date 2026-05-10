'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  Clock, 
  Star, 
  ArrowLeft, 
  Download, 
  Play, 
  Brain, 
  Sparkles, 
  Target, 
  Zap, 
  Globe,
  GraduationCap,
  Bookmark,
  Check,
  Loader2,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import FloatingShapes from '@/components/FloatingShapes'

interface DatabaseCourse {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  duration: string
  rating: number
  skills: string[]
  link: string
  type: string
  level: string
  price: string
  is_free: boolean
  thumbnail_url: string
}

interface Resource {
  id: string
  title: string
  type: 'course' | 'video' | 'article' | 'book' | 'practice'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  rating: number
  description: string
  link: string
  author: string
  topics: string[]
  free: boolean
  learning_process?: string[]
}

const transformCourseToResource = (course: DatabaseCourse): Resource => ({
  id: course.id,
  title: course.title,
  type: (course.type?.toLowerCase() as any) || 'course',
  category: course.category || 'General',
  difficulty: (course.level as any) || 'Beginner',
  duration: course.duration || 'Self-paced',
  rating: Number(course.rating) || 4.5,
  description: course.description || '',
  link: course.link || '#',
  author: course.instructor || 'FutureMatrix Academy',
  topics: course.skills || [],
  free: course.is_free
})

const categories = ['All', 'Computer Science', 'Business', 'Data Science', 'Design', 'Marketing', 'Personal Development', 'Engineering']
const types = ['All', 'course', 'video', 'article', 'book', 'practice']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function LearningResourcesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    const adminAuth = localStorage.getItem('fm_admin_authenticated')
    if (adminAuth === 'true') {
      router.replace('/admin')
    } else if (!authLoading && !user) {
      router.push('/auth/signup?next=/learning-resources')
    } else {
      setIsRedirecting(false)
    }
  }, [router, authLoading, user])

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
        <p className="text-emerald-400 font-bold tracking-widest uppercase text-[10px]">Accessing Resource Vault...</p>
      </div>
    )
  }

  if (!user) return null
  
  const [learningResources, setLearningResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [filterDuration, setFilterDuration] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [discoveryMode, setDiscoveryMode] = useState<'verified' | 'ai' | 'saved'>('verified')
  const [savedResources, setSavedResources] = useState<any[]>([])

  // AI Synthesis state
  const [aiQuery, setAiQuery] = useState('')
  const [aiCategory, setAiCategory] = useState('')
  const [aiLevel, setAiLevel] = useState('')
  const [aiCourses, setAiCourses] = useState('')
  const [aiDuration, setAiDuration] = useState('')
  const [aiPrice, setAiPrice] = useState('Any')
  const [aiResults, setAiResults] = useState<Resource[]>([])
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/learning-processes')
        const result = await response.json()
        if (result.success && Array.isArray(result.data)) {
          setLearningResources(result.data.map(transformCourseToResource))
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (user?.uid) {
      fetch(`/api/saved-resources?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSavedResources(data.savedResources)
        })
        .catch(err => console.error('Error fetching saved resources:', err))
    }
  }, [user])

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDuration = !filterDuration || resource.duration.toLowerCase().includes(filterDuration.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty
    return matchesSearch && matchesDuration && matchesDifficulty
  })

  const handleAISynthesis = async () => {
    if (!aiQuery && !aiLevel && !aiCourses) {
      toast.error('Please describe what you want to learn and specify courses')
      return
    }
    setAiLoading(true)
    setAiResults([])
    try {
      console.log('📡 [APEX V5.0] Synchronizing with Gemini Pro Clusters...')

      const response = await fetch('/api/ai-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          objective: aiQuery || 'General',
          level: aiLevel || 'Any',
          preferredTopics: aiCourses || 'Any',
          duration: aiDuration || 'Any',
          pricing: aiPrice || 'Any'
        })
      })

      // Robust response check
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Our AI engines couldn\'t find specific courses for this query. Try a broader objective or check your spelling.')
        }
        const errorText = await response.text()
        console.error('📡 Server Sync Failed:', errorText)
        throw new Error(`Intelligence Link Severed: ${response.status}`)
      }

      let result
      try {
        result = await response.json()
      } catch (e) {
        console.error('📡 Response Parsing Error:', e)
        throw new Error('Intelligence Stream Corrupted (Non-JSON response)')
      }

      if (!result.success) {
        throw new Error(result.error || 'Intelligence Synthesis Failed')
      }

      const parsedData = result.data
      console.log('✅ Strategic Intelligence V3.5 Synchronized')

      if (parsedData && Array.isArray(parsedData.resources)) {
        const mapped: Resource[] = parsedData.resources.map((r: any) => ({
          id: r.id || `ai_${Math.random()}`,
          title: r.course_title || r.title || 'Unknown Strategic Asset',
          type: r.type || 'course',
          category: r.category || aiCategory || 'General Intelligence',
          difficulty: r.difficulty || 'Intermediate',
          duration: r.duration || 'Dynamic',
          rating: Number(r.rating) || 4.9,
          description: r.description || 'No summary available for this strategic resource.',
          link: r.access_url || r.link || '#',
          author: r.instructor || r.author || 'Apex Intelligence Provider',
          topics: Array.isArray(r.topics) ? r.topics : [],
          free: !Boolean(r.is_paid),
          learning_process: Array.isArray(r.learning_process) ? r.learning_process : []
        }))
        
        localStorage.setItem('fm_learning_synthesis', JSON.stringify(mapped))
        setAiResults(mapped)
        toast.success(`Apex Path Architected: ${mapped.length} Nodes Synchronized!`)
        setTimeout(() => {
          router.push('/learning-resources/result')
        }, 1200)
      } else {
        throw new Error('Synthesis resulted in an empty path.')
      }
    } catch (error: any) {
      console.error('🚨 APEX CORE ERROR:', error)
      toast.error(error.message || 'Synthesis failed. Contacting recovery nodes...')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <>
      {/* Invisible overlay during admin redirect check — no flash */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] bg-[#030712]" />
      )}
      <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.1),_transparent_30%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
          <FloatingShapes />

          <div className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
            <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-400/20 transition-all">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Secure Return</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#030712]">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="space-y-12">
              <div className="flex justify-center">
                <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <button 
                    onClick={() => setDiscoveryMode('verified')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      discoveryMode === 'verified' ? 'bg-indigo-400 text-black shadow-lg shadow-indigo-400/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    Verified Registry
                  </button>
                  <button 
                    onClick={() => setDiscoveryMode('ai')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      discoveryMode === 'ai' ? 'bg-fuchsia-400 text-black shadow-lg shadow-fuchsia-400/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Synthesis Discovery
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {discoveryMode === 'verified' ? (
                  <motion.div 
                    key="verified"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center md:text-left">
                      <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl">
                        Knowledge <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Nexus.</span>
                      </h2>
                      <p className="mt-2 text-slate-400 font-medium">Curated world-class educational assets for your career trajectory.</p>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                          type="text"
                          placeholder="Search intelligence vault..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm font-medium text-white outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all ${showFilters ? 'bg-indigo-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                      >
                        <Filter className="h-5 w-5" />
                        Filters
                      </button>
                    </div>

                    <AnimatePresence>
                      {showFilters && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Course Name</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. React"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm outline-none focus:border-indigo-400/50 text-white placeholder:text-slate-600"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duration</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. 4 weeks"
                                  value={filterDuration}
                                  onChange={(e) => setFilterDuration(e.target.value)}
                                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm outline-none focus:border-indigo-400/50 text-white placeholder:text-slate-600"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mastery Level</label>
                                <select 
                                  value={selectedDifficulty}
                                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm outline-none focus:border-indigo-400/50"
                                >
                                  {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <button 
                                onClick={() => setShowFilters(false)}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-colors"
                              >
                                <Search className="w-4 h-4" /> Apply Search
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t border-white/5 pt-8">
                      <Link 
                        href="/saved-courses"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border bg-white/5 text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
                      >
                        <Bookmark className="h-4 w-4" />
                        View Saved Courses ({savedResources.length})
                      </Link>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Accessing Knowledge Vault...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource) => (
                          <motion.div 
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative flex flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-indigo-500/30 hover:bg-white/10"
                          >
                            <div className="mb-6 flex items-center justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                                {resource.type === 'video' ? <Video className="h-6 w-6" /> : resource.type === 'article' ? <FileText className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                              </div>
                              <div className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-400">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {resource.rating}
                              </div>
                            </div>

                            <h3 className="mb-3 text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{resource.title}</h3>
                            <p className="mb-6 text-sm font-medium text-slate-400 line-clamp-3">{resource.description}</p>
                            
                            <div className="mt-auto space-y-6">
                              <div className="flex flex-wrap gap-2">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-wider text-slate-300 border border-white/5">
                                  <Clock className="h-3 w-3 text-indigo-400" /> {resource.duration}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-wider text-slate-300 border border-white/5">
                                  <BarChart3 className="h-3 w-3 text-indigo-400" /> {resource.difficulty}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${resource.free ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                  {resource.free ? 'FREE' : 'PAID'}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {resource.topics.slice(0, 3).map((topic, i) => (
                                  <span key={i} className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-white/5">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source</p>
                                  <p className="text-xs font-bold text-white">{resource.author}</p>
                                </div>
                                <a 
                                  href={resource.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400 text-black shadow-lg shadow-indigo-400/20 hover:scale-110 transition-all"
                                >
                                  <ExternalLink className="h-5 w-5" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="ai"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="text-center mb-12">
                       <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-6">
                        <Brain className="h-3 w-3 animate-pulse" />
                        Intelligent Asset Synthesis
                      </div>
                      <h2 className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl mb-4">
                        Apex <span className="bg-gradient-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Curator.</span>
                      </h2>
                      <p className="text-slate-400 text-lg font-medium">Define your learning objective and let the AI architect your perfect resource stack.</p>
                    </div>

                    <div className="p-10 rounded-[3rem] border border-white/10 bg-[#0c1222]/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-32 w-32 text-fuchsia-400" />
                      </div>
                      
                      <div className="space-y-8 relative z-10">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Learning Objective</label>
                          <textarea 
                            placeholder="e.g., I want to master full-stack development with Next.js and Supabase starting from scratch..."
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            className="w-full h-32 rounded-3xl bg-black/60 border border-white/10 p-6 text-white placeholder:text-slate-600 focus:border-fuchsia-400/50 focus:bg-black/80 transition-all outline-none text-lg font-medium resize-none"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Mastery Level</label>
                          <select 
                            value={aiLevel}
                            onChange={(e) => setAiLevel(e.target.value)}
                            className="w-full rounded-2xl bg-black/60 border border-white/10 p-4 text-white outline-none focus:border-fuchsia-400/50"
                          >
                            {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'Dynamic Leveling' : d}</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Preferred Courses</label>
                            <input 
                              type="text"
                              placeholder="e.g. React, Python, Data Science..."
                              value={aiCourses}
                              onChange={(e) => setAiCourses(e.target.value)}
                              className="w-full rounded-2xl bg-black/60 border border-white/10 p-4 text-white outline-none focus:border-fuchsia-400/50 text-sm"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Time Duration</label>
                            <input 
                              type="text"
                              placeholder="e.g. 4 weeks, 20 hours"
                              value={aiDuration}
                              onChange={(e) => setAiDuration(e.target.value)}
                              className="w-full rounded-2xl bg-black/60 border border-white/10 p-4 text-white outline-none focus:border-fuchsia-400/50"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Pricing Options</label>
                            <select 
                              value={aiPrice}
                              onChange={(e) => setAiPrice(e.target.value)}
                              className="w-full rounded-2xl bg-black/60 border border-white/10 p-4 text-white outline-none focus:border-fuchsia-400/50"
                            >
                              <option value="Any">Any Price</option>
                              <option value="Free">Free Resources Only</option>
                              <option value="Paid">Premium/Paid Courses</option>
                            </select>
                          </div>
                        </div>

                        <motion.button 
                          onClick={handleAISynthesis}
                          disabled={aiLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-fuchsia-500 to-purple-600 text-black font-black uppercase tracking-[0.4em] shadow-xl shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all disabled:opacity-50 relative overflow-hidden group/btn"
                        >
                          <div className="relative flex items-center justify-center gap-3">
                            {aiLoading ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="h-6 w-6" />
                                Synthesize Path
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </div>


                  </motion.div>
                )}

                {discoveryMode === 'saved' && (
                  <motion.div 
                    key="saved"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center md:text-left">
                      <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl">
                        Intelligence <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Vault.</span>
                      </h2>
                      <p className="mt-2 text-slate-400 font-medium">Your permanently secured learning trajectories.</p>
                    </div>

                    {savedResources.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedResources.map((res, i) => (
                          <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-5">
                              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
                                <BookOpen className="h-7 w-7" />
                              </div>
                              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {res.difficulty || 'All Levels'}
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 h-14">
                              {res.course_title || res.title}
                            </h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-6">
                              {res.instructor || res.author} • {res.is_paid ? 'Premium' : 'Free'}
                            </p>

                            <button
                              onClick={() => window.open(res.access_url || res.link, '_blank')}
                              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white hover:bg-white/10 transition-all"
                            >
                              <ExternalLink className="h-4 w-4" /> ACCESS ASSET
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 text-center">
                        <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">Vault Empty</h3>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">You have not secured any courses. Synthesize a path or explore the verified registry to save resources.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Statistics Footer */}
              {!loading && discoveryMode === 'verified' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/5"
                >
                  {[
                    { label: 'Avg Quality', value: '4.8', icon: Star, color: 'text-yellow-400' },
                    { label: 'Learning Assets', value: learningResources.length, icon: Target, color: 'text-indigo-400' },
                    { label: 'Domains', value: categories.length - 1, icon: Sparkles, color: 'text-cyan-400' }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white/2 border border-white/5 text-center hover:border-indigo-500/20 transition-colors">
                      <div className="inline-flex p-3 rounded-xl bg-white/5 mb-4">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                      <p className="text-4xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </main>
    </>
  )
}
