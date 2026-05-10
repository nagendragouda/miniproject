'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sliders, BookOpen, Target, Sparkles, ArrowLeft, GraduationCap, Zap, Globe, Brain } from 'lucide-react'
import LearningProcessCard from '@/components/LearningProcessCard'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'

interface LearningProcess {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  duration: string
  rating: number
  skills: string[]
  difficulty_level: string
  is_paid: boolean
  price?: number
  access_url?: string
  icon_emoji?: string
}

export default function LearningResourcesPage() {
  const [learningProcesses, setLearningProcesses] = useState<LearningProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [paidOnly, setPaidOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Fetch learning processes from database
  useEffect(() => {
    const fetchLearningProcesses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/learning-processes')
        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          setLearningProcesses(result.data)
        } else {
          setLearningProcesses([])
        }
      } catch (error) {
        console.error('Error fetching learning processes:', error)
        setLearningProcesses([])
      } finally {
        setLoading(false)
      }
    }

    fetchLearningProcesses()
  }, [])

  // Get unique categories and difficulty levels
  const categories = Array.from(new Set(learningProcesses.map(lp => lp.category))).sort()
  const levels = Array.from(new Set(learningProcesses.map(lp => lp.difficulty_level))).sort()

  // Filter learning processes
  const filteredProcesses = learningProcesses.filter(lp => {
    const matchesSearch =
      lp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || lp.category === selectedCategory
    const matchesLevel = !selectedLevel || lp.difficulty_level === selectedLevel
    const matchesRating = lp.rating >= minRating
    const matchesPaid = !paidOnly || lp.is_paid

    return matchesSearch && matchesCategory && matchesLevel && matchesRating && matchesPaid
  })

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLevel('')
    setMinRating(0)
    setPaidOnly(false)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      <FloatingShapes />

      {/* Header Navigation */}
      <div className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-400/40 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">Go Back</span>
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/20">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20 pt-10">
        {/* Title Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 mb-6"
          >
            <Brain className="h-4 w-4" />
            Neural Skill Acquisition Engine
          </motion.div>
          <h1 className="text-5xl font-black leading-tight sm:text-7xl text-white mb-6">
            Master Every <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence Skill.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400 text-lg leading-relaxed">
            Access industrial-grade learning pathways and curated academic resources designed to transform your career trajectory.
          </p>
        </div>

        {/* Intelligence Controls */}
        <div className="relative mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search courses, mentors, or specific technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-5 rounded-[2rem] border font-black text-xs tracking-widest transition-all ${
                  filtersOpen ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 text-slate-300 hover:border-purple-400/40'
                }`}
              >
                <Sliders className="h-4 w-4" />
                FILTERS
              </button>
              
              <div className="hidden lg:flex items-center gap-2 px-6 py-5 rounded-[2rem] bg-white/5 border border-white/10">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{filteredProcesses.length} COURSES</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 mt-6 z-40 bg-[#0f172a]/95 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Domain Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-purple-400 transition-all text-white"
                    >
                      <option value="" className="bg-slate-900">All Domains</option>
                      {categories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Mastery Level</label>
                    <select 
                      value={selectedLevel} 
                      onChange={(e) => setSelectedLevel(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-purple-400 transition-all text-white"
                    >
                      <option value="" className="bg-slate-900">All Levels</option>
                      {levels.map(level => <option key={level} value={level} className="bg-slate-900">{level}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Minimum Quality</label>
                    <select 
                      value={minRating} 
                      onChange={(e) => setMinRating(parseFloat(e.target.value))} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-purple-400 transition-all text-white"
                    >
                      <option value={0} className="bg-slate-900">Any Rating</option>
                      <option value={3.5} className="bg-slate-900">3.5+ ⭐</option>
                      <option value={4} className="bg-slate-900">4.0+ ⭐</option>
                      <option value={4.5} className="bg-slate-900">4.5+ ⭐</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-3">
                    <label className="flex-1 flex items-center justify-between gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-purple-400 transition-all">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Only</span>
                      <input
                        type="checkbox"
                        checked={paidOnly}
                        onChange={(e) => setPaidOnly(e.target.checked)}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                    </label>
                    <button 
                      onClick={handleResetFilters} 
                      className="p-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                      title="Reset Filters"
                    >
                      <Zap className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Learning Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative h-20 w-20 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-purple-400/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-400 animate-spin" />
              <Brain className="absolute inset-0 m-auto h-8 w-8 text-purple-400" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.3em] text-[10px] uppercase animate-pulse">Initializing Skill Engine...</p>
          </div>
        ) : filteredProcesses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl"
          >
            <Search className="h-20 w-20 text-slate-800 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-white mb-4">No Curriculum Found</h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Adjust your neural filters to discover more curriculum pathways.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProcesses.map((lp, idx) => (
              <LearningProcessCard key={lp.id} learningProcess={lp} />
            ))}
          </div>
        )}

        {/* Analytics Summary */}
        {!loading && filteredProcesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { label: 'Avg Quality', value: (filteredProcesses.reduce((sum, lp) => sum + lp.rating, 0) / filteredProcesses.length).toFixed(1), icon: Star, color: 'text-yellow-400' },
              { label: 'Skill Paths', value: filteredProcesses.length, icon: Target, color: 'text-cyan-400' },
              { label: 'Knowledge Domains', value: categories.length, icon: Sparkles, color: 'text-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/2 border border-white/5 text-center">
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
    </main>
  )
}
