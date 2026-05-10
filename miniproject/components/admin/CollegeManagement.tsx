'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader, Edit2, Search, MapPin, GraduationCap, Star, Calendar, DollarSign, Award, Info, Image as ImageIcon, Globe, Save, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface College {
  id: string
  name: string
  city: string
  state: string
  type: string
  rating: number
  location: string
  established: number
  fees: string
  description: string
  latitude?: number
  longitude?: number
  website: string
}

export default function CollegeManagement() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Government',
    established: new Date().getFullYear(),
    rating: '4.5',
    fees: '',
    description: '',
    latitude: '',
    longitude: '',
    website: ''
  })

  // Fetch colleges
  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/colleges')
      const data = await response.json()
      if (data.success) setColleges(data.colleges)
    } catch (error) {
      console.error('Error fetching colleges:', error)
      toast.error('Failed to load colleges')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/admin/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingId ? 'update' : 'add',
          id: editingId,
          ...formData,
          rating: parseFloat(formData.rating),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null
        })
      })
      const result = await response.json()
      if (result.success) {
        toast.success(editingId ? 'Intelligence Updated' : 'Institution Registered')
        resetForm()
        fetchColleges()
      } else {
        toast.error(result.error || 'Operation failed')
      }
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      type: 'Government',
      established: new Date().getFullYear(),
      rating: '4.5',
      fees: '',
      description: '',
      latitude: '',
      longitude: '',
      website: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (college: College) => {
    setEditingId(college.id)
    setFormData({
      name: college.name,
      location: college.location,
      type: college.type,
      established: college.established,
      rating: college.rating.toString(),
      fees: college.fees || '',
      description: college.description || '',
      latitude: college.latitude?.toString() || '',
      longitude: college.longitude?.toString() || '',
      website: college.website || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (collegeId: string) => {
    if (!confirm('Are you sure you want to delete this institution?')) return
    try {
      const response = await fetch('/api/admin/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', collegeId })
      })
      if ((await response.json()).success) {
        toast.success('Institution deleted')
        fetchColleges()
      }
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-cyan-400" />
            Institution Registry
          </h2>
          <p className="text-sm text-slate-400">Manage global educational database nodes.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Abort Operation' : 'Register Institution'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-12">
            <div className={`rounded-[3rem] border p-8 backdrop-blur-xl ${editingId ? 'border-purple-500/30 bg-purple-500/5' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                {editingId ? <Edit2 className="h-6 w-6 text-purple-400" /> : <Plus className="h-6 w-6 text-cyan-400" />}
                {editingId ? 'Edit Institution Intel' : 'New Registry Node'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Official Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Geographic Node (City, State)</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Sector</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none">
                      <option>Government</option>
                      <option>Private</option>
                      <option>Deemed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Established Year</label>
                    <input type="number" name="established" value={formData.established} onChange={handleInputChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Global Rating (0-5)</label>
                    <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Annual Fee Structure</label>
                    <input name="fees" value={formData.fees} onChange={handleInputChange} required placeholder="e.g. ₹2.5L / Year" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Registry Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Latitude</label>
                      <input type="number" step="0.0001" name="latitude" value={formData.latitude} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Longitude</label>
                      <input type="number" step="0.0001" name="longitude" value={formData.longitude} onChange={handleInputChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Institutional Intelligence Summary</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-cyan-400/50 outline-none resize-none" />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-500 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className={`rounded-2xl px-10 py-3 font-black text-xs tracking-widest uppercase shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 ${editingId ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-cyan-400 text-black shadow-cyan-400/20'}`}>
                    {submitting ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {editingId ? 'Update Node' : 'Deploy Node'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-10 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
        <input type="text" placeholder="Filter global registry by name or geographic region..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-[2rem] border border-white/10 bg-white/5 pl-16 pr-8 py-5 text-sm text-white focus:border-cyan-400/30 outline-none transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map(college => (
          <motion.div key={college.id} layout className="group relative flex flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/30 hover:bg-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-3 border border-cyan-400/20">
                  {college.type}
                </div>
                <h3 className="text-xl font-black text-white truncate group-hover:text-cyan-400 transition-colors">{college.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="h-3 w-3" /> {college.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(college)} className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:bg-purple-500/20 hover:text-purple-400 transition-all"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(college.id)} className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-white/5">
              <div className="bg-white/2 rounded-2xl p-3 border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1 flex items-center gap-1"><Star className="h-2.5 w-2.5 text-yellow-500" /> Rating</p>
                <p className="text-sm font-black text-white">{college.rating}</p>
              </div>
              <div className="bg-white/2 rounded-2xl p-3 border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1 flex items-center gap-1"><DollarSign className="h-2.5 w-2.5 text-cyan-400" /> Fees</p>
                <p className="text-sm font-black text-white">{college.fees}</p>
              </div>
            </div>
            
            <button onClick={() => handleEdit(college)} className="mt-4 w-full py-3 rounded-2xl bg-white/5 text-[10px] font-black tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
              VIEW NODE DETAILS <ChevronRight className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
