'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  ExternalLink, 
  ArrowLeft, 
  Bookmark, 
  Loader2,
  Trash2,
  Sparkles,
  Search,
  LayoutGrid,
  Zap,
  BarChart3,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import FloatingShapes from '@/components/FloatingShapes'

interface SavedResource {
  id: string
  course_id?: string
  course_title: string
  instructor: string
  difficulty: string
  duration: string
  access_url: string
  is_paid: boolean
  created_at: string
}

export default function SavedCoursesPage() {
  const { user } = useAuth()
  const [savedResources, setSavedResources] = useState<SavedResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.uid) {
      fetchSavedResources()
    }
  }, [user])

  const fetchSavedResources = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/saved-resources?userId=${user?.uid}`)
      const data = await res.json()
      if (data.success) {
        setSavedResources(data.savedResources)
      }
    } catch (err) {
      console.error('Error fetching saved resources:', err)
      toast.error('Failed to load intelligence vault')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset from your vault?')) return
    
    setDeletingId(id)
    try {
      const res = await fetch(`/api/saved-resources/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSavedResources(prev => prev.filter(r => r.id !== id))
        toast.success('Resource removed from vault')
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove resource')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredResources = savedResources.filter(res => 
    res.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.15),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.1),_transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      <FloatingShapes />

      {/* Header */}
      <div className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <Link href="/learning-resources" className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all duration-500">
          <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-indigo-400 transition-colors leading-none mb-1">Return To</span>
            <span className="text-xs font-black uppercase tracking-widest leading-none">Knowledge Nexus</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1 italic">Security Status</span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Synchronized</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#030712]">
              <Bookmark className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
              <Zap className="h-3 w-3" />
              Secured Learning Path
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase sm:text-7xl leading-none">
              Intelligence <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Vault.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
              Access your permanently secured strategic knowledge assets and educational trajectories.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Vault..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Count</span>
              <div className="px-4 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black">
                {savedResources.length} Synchronized
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 space-y-6"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-spin" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Decrypting Vault Access...</p>
            </motion.div>
          ) : filteredResources.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredResources.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-10 rounded-[3.5rem] border border-white/10 bg-white/5 hover:border-blue-500/40 transition-all duration-700 hover:bg-blue-500/[0.02]"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-white group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {res.difficulty || 'Professional'}
                      </div>
                      {res.is_paid ? (
                        <div className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[8px] font-black text-amber-500 uppercase tracking-widest">Premium</div>
                      ) : (
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest">Open Access</div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 h-16 leading-tight">
                    {res.course_title}
                  </h3>
                  
                  <div className="flex flex-col gap-1 mb-8">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black italic">
                      Strategic Asset • {res.instructor}
                    </p>
                    <div className="h-1 w-12 bg-blue-500/30 rounded-full group-hover:w-24 transition-all duration-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center group-hover:bg-blue-500/5 transition-colors">
                      <Clock className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">{res.duration || 'Flexible'}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center group-hover:bg-fuchsia-500/5 transition-colors">
                      <BarChart3 className="w-5 h-5 text-fuchsia-400 mb-2" />
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">{res.difficulty || 'Expert'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => window.open(res.access_url, '_blank')}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-blue-500 text-black rounded-[1.5rem] text-[10px] font-black hover:bg-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20"
                    >
                      <ExternalLink className="h-4 w-4" /> Initialize
                    </button>
                    <button
                      onClick={() => handleDelete(res.id)}
                      disabled={deletingId === res.id}
                      className="w-16 flex items-center justify-center rounded-[1.5rem] bg-white/5 border border-white/10 text-slate-500 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all active:scale-95 disabled:opacity-30"
                    >
                      {deletingId === res.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-32 rounded-[5rem] border border-dashed border-white/10 bg-white/[0.01] text-center flex flex-col items-center"
            >
              <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Bookmark className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Vault Status: Offline</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-12 text-lg">
                No strategic learning assets have been secured yet. Visit the Knowledge Nexus to synthesize your educational trajectory.
              </p>
              <Link 
                href="/learning-resources"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-[1.5rem] text-[11px] font-black hover:bg-indigo-400 transition-all uppercase tracking-[0.3em] shadow-xl"
              >
                <Sparkles className="h-5 w-5" /> Harvest Intelligence
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Stats */}
        {!loading && savedResources.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <LayoutGrid className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Architecture</p>
                <p className="text-xl font-black text-white">Multi-Source</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Retrieval</p>
                <p className="text-xl font-black text-white">High Speed</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Secured Data</p>
                <p className="text-xl font-black text-white">Verified</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
