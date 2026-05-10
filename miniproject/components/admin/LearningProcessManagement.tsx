'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Search, AlertCircle, CheckCircle, Edit2, X, BookOpen, Clock, BarChart, DollarSign, ExternalLink, Loader2, Sparkles, Filter, Info, ChevronRight, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LearningProcess {
  id: string
  title: string
  instructor: string
  category: string
  duration: string
  rating: number
  skills: string[]
  difficulty_level: string
  is_paid: boolean
  price?: number
  description?: string
  access_url?: string
  icon_emoji?: string
}

export default function LearningProcessManagement() {
  const [learningProcesses, setLearningProcesses] = useState<LearningProcess[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    difficulty_level: 'Beginner',
    is_paid: false,
    price: '',
    access_url: ''
  })

  const fetchLearningProcesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/learning-processes')
      const result = await response.json()
      if (result.success) setLearningProcesses(result.data)
    } catch (error) {
      console.error('Error fetching learning processes:', error)
      setMessage({ type: 'error', text: 'Failed to fetch learning processes' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLearningProcesses()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const highlights = formData.highlights.split(',').map(s => s.trim()).filter(s => s)
      const response = await fetch('/api/admin/learning-processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingId ? 'update' : 'add',
          id: editingId,
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          highlights
        })
      })
      const result = await response.json()
      if (result.success) {
        setMessage({ type: 'success', text: editingId ? 'Resource updated!' : 'Resource added!' })
        resetForm()
        fetchLearningProcesses()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving resource' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      difficulty_level: 'Beginner',
      is_paid: false,
      price: '',
      access_url: '',
      highlights: ''
    })
    setEditingId(null)
  }

  const handleEdit = (process: LearningProcess) => {
    setEditingId(process.id)
    setFormData({
      title: process.title,
      description: process.description || '',
      instructor: process.instructor,
      duration: process.duration,
      difficulty_level: process.difficulty_level,
      is_paid: process.is_paid,
      price: process.price?.toString() || '',
      access_url: process.access_url || ''
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    try {
      const response = await fetch('/api/admin/learning-processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })
      if ((await response.json()).success) {
        setMessage({ type: 'success', text: 'Resource deleted!' })
        fetchLearningProcesses()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete failed' })
    }
  }

  const filteredProcesses = learningProcesses.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-fuchsia-400" />
          Learning Intelligence Hub
        </h2>
        <p className="text-sm text-slate-400">Architect and manage professional learning pathways.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-bold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Part: Catalog (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-fuchsia-400" />
            <input
              type="text"
              placeholder="Search resources by title or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-fuchsia-500/50 transition-all"
            />
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProcesses.map(process => (
              <motion.div
                key={process.id}
                layout
                className={`group p-4 rounded-2xl border transition-all cursor-pointer ${editingId === process.id ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                onClick={() => handleEdit(process)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-fuchsia-400 transition-colors">{process.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {process.duration}</span>
                      <span className="flex items-center gap-1"><BarChart className="h-3 w-3" /> {process.difficulty_level}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${process.is_paid ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                        {process.is_paid ? `₹${process.price}` : 'FREE'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(process.id); }} className="p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Part: Editor (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingId ? <Sparkles className="h-5 w-5 text-fuchsia-400" /> : <Plus className="h-5 w-5 text-fuchsia-400" />}
                {editingId ? 'Edit Resource' : 'Create New Resource'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instructor</label>
                  <input name="instructor" value={formData.instructor} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duration</label>
                  <input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 12h" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Difficulty</label>
                  <select name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access URL</label>
                  <input name="access_url" value={formData.access_url} onChange={handleInputChange} required placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <DollarSign className={`h-5 w-5 ${formData.is_paid ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-bold">Paid Resource</span>
                </div>
                <input type="checkbox" name="is_paid" checked={formData.is_paid} onChange={handleInputChange} className="h-5 w-5 rounded border-white/10 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500" />
              </div>

              {formData.is_paid && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Price (INR)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500/50 outline-none" />
                </motion.div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 py-4 rounded-2xl font-bold text-white shadow-lg shadow-fuchsia-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {editingId ? 'Update Intelligence' : 'Deploy Resource'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
