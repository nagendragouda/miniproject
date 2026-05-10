'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Map as MapIcon, 
  Grid3X3,
  Star,
  GraduationCap,
  Heart,
  ArrowLeft,
  Target,
  MapPin,
  Settings,
  Filter,
  ChevronRight,
  Loader2
} from 'lucide-react'
import CollegeCard from '@/components/CollegeCard'

import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { useActivityTracking } from '@/lib/hooks/useActivityTracking'
import toast from 'react-hot-toast'
import Link from 'next/link'
import FloatingShapes from '@/components/FloatingShapes'
import { useRouter } from 'next/navigation'
import Footer from '../../components/Footer'

// Master Link Resolver for Direct Access
const resolveCollegeWebsite = (name: string, currentWebsite?: string) => {
  const n = name.toLowerCase();
  // Guaranteed Mapping for Common Institutions
  if (n.includes('dayananda sagar') && n.includes('engineering')) return 'https://www.dsce.edu.in';
  if (n.includes('dayananda sagar') && n.includes('university')) return 'https://www.dsu.edu.in';
  if (n.includes('bms') && n.includes('engineering')) return 'https://www.bmsce.ac.in';
  if (n.includes('ms ramaiah') || n.includes('m.s. ramaiah')) return 'https://www.msrit.edu';
  if (n.includes('rv college') || n.includes('r.v. college')) return 'https://www.rvce.edu.in';
  if (n.includes('pes university') || n.includes('p.e.s. university')) return 'https://www.pes.edu';
  
  // If we already have a valid website from the DB, use it
  if (currentWebsite && currentWebsite !== '#' && currentWebsite.length > 5 && !currentWebsite.includes('google.com/search')) {
    return currentWebsite.startsWith('http') ? currentWebsite : `https://${currentWebsite}`;
  }

  // Smart Domain Guessing Fallback
  const domain = n.replace(/[^a-z0-9]/g, '');
  if (n.includes('iit')) return `https://www.iit${domain.replace('iit', '')}.ac.in`;
  if (n.includes('nit')) return `https://www.nit${domain.replace('nit', '')}.ac.in`;
  
  return `https://www.google.com/search?btnI=1&q=${encodeURIComponent(name + ' official website')}`; // btnI=1 is "I'm Feeling Lucky" (Direct)
};

const LeafletCollegesMap = dynamic(() => import('@/components/LeafletCollegesMap'), { ssr: false }) as any

interface College {
  id: string
  name: string
  location: string
  state: string
  city: string
  rating: number
  type: string
  latitude: number
  longitude: number
  fees: string
  established: number
  website: string
  description: string
}

export default function CollegesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  useActivityTracking('Colleges', user?.uid)
  
  // State
  const [activeTab, setActiveTab] = useState<'registry' | 'matching' | 'saved'>('registry')
  const [matchingRegion, setMatchingRegion] = useState('')
  const [matchingType, setMatchingType] = useState('')
  const [matchingLevel, setMatchingLevel] = useState('graduation')
  const [matchingInterest, setMatchingInterest] = useState('')
  const [matchingProfile, setMatchingProfile] = useState('')
  const [isMatching, setIsMatching] = useState(false)

  const [colleges, setColleges] = useState<College[]>([])
  const [fullSavedColleges, setFullSavedColleges] = useState<College[]>([])
  const [savedColleges, setSavedColleges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const adminAuth = localStorage.getItem('fm_admin_authenticated')
    if (adminAuth === 'true') {
      setIsAdmin(true)
      setIsRedirecting(false)
    } else if (!authLoading && !user) {
      router.push('/auth/signup?next=/colleges')
    } else {
      setIsRedirecting(false)
    }
  }, [authLoading, user, router])

  useEffect(() => {
    fetchColleges()
    if (user) fetchSavedColleges()
  }, [user])

  const fetchColleges = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/colleges')
      const data = await response.json()
      if (data.success) setColleges(data.colleges)
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedColleges = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/saved-colleges?userId=${user.uid}`)
      const data = await response.json()
      if (data.success) {
        setSavedColleges(data.savedColleges.map((sc: any) => sc.collegeId || sc.college_id))
        const fullSaved = data.savedColleges.map((sc: any) => ({
          id: sc.collegeId || sc.college_id,
          name: sc.collegeName || sc.college_name || 'Unknown Institution',
          location: sc.collegeLocation || sc.college_location || '',
          state: (sc.collegeLocation || sc.college_location || '').split(',').slice(-1)[0]?.trim() || '',
          city: (sc.collegeLocation || sc.college_location || '').split(',')[0]?.trim() || '',
          type: sc.collegeType || sc.college_type || 'University',
          rating: Number(sc.rating) || 4.5,
          fees: sc.fees || sc.college_fees || 'N/A',
          latitude: Number(sc.college_latitude || sc.latitude) || 0,
          longitude: Number(sc.college_longitude || sc.longitude) || 0,
          established: Number(sc.established || sc.college_established) || 0,
          website: sc.website || sc.college_website || '',
          description: sc.description || sc.college_description || sc.collegeDescription || ''
        }))
        setFullSavedColleges(fullSaved as College[])
      }
    } catch (error) {
      console.error('Saved fetch failed:', error)
    }
  }

  const toggleSave = async (college: College) => {
    if (!user) {
      toast.error('Sign in to save')
      return
    }
    const isSaved = savedColleges.includes(college.id)
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-colleges?userId=${user.uid}&collegeId=${college.id}`, { method: 'DELETE' })
        if ((await res.json()).success) {
          setSavedColleges(prev => prev.filter(id => id !== college.id))
          setFullSavedColleges(prev => prev.filter(c => c.id !== college.id))
          toast.success('Removed')
        }
      } else {
        const res = await fetch('/api/saved-colleges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.uid, 
            collegeId: college.id, 
            collegeName: college.name, 
            collegeLocation: college.location, 
            collegeType: college.type, 
            rating: college.rating, 
            fees: college.fees,
            collegeWebsite: college.website
          })
        })
        if ((await res.json()).success) {
          setSavedColleges(prev => [...prev, college.id])
          setFullSavedColleges(prev => [...prev, college])
          toast.success('Saved')
        }
      }
    } catch (error) {
      toast.error('Action failed')
    }
  }

  const getFilteredList = () => {
    let list = activeTab === 'registry' ? colleges : activeTab === 'saved' ? fullSavedColleges : []
    if (searchQuery && activeTab !== 'matching') {
      list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (selectedState && activeTab !== 'matching') list = list.filter(c => c.state === selectedState)
    if (selectedType && activeTab !== 'matching') list = list.filter(c => c.type === selectedType)
    if (minRating && activeTab !== 'matching') list = list.filter(c => c.rating >= minRating)
    
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })
  }

  const filteredColleges = getFilteredList()
  const states = Array.from(new Set(colleges.map(c => c.state))).filter(Boolean).sort()
  const types = Array.from(new Set(colleges.map(c => c.type))).filter(Boolean).sort()

  return (
    <>
      {isRedirecting ? (
        <div className="flex items-center justify-center min-h-screen bg-[#030712]">
          <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
        </div>
      ) : (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.05),_transparent_40%)]" />
          <FloatingShapes />

          {/* Navigation Bar */}
          <div className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
            <Link href="/" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all">
              <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-400/20 transition-all">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Return</span>
            </Link>

            <div className="flex items-center gap-6">
              {isAdmin && (
                <Link 
                  href="/admin"
                  className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                >
                  Admin Dashboard
                </Link>
              )}
              <div className="h-12 w-12 rounded-2xl bg-cyan-400 p-[1px] shadow-lg shadow-cyan-400/20">
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#030712]">
                  <GraduationCap className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-8 py-12">
              <div className="space-y-16">
                {/* Simplified Header */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                      COLLEGE <span className="text-cyan-400 italic">REGISTRY</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">Explore world-class educational institutions within the FutureMatrix network.</p>
                  </div>

                  <div className="flex p-1.5 rounded-[2rem] bg-white/5 border border-white/10">
                    <button
                      onClick={() => setActiveTab('registry')}
                      className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'registry' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      All Institutions
                    </button>
                    <button
                      onClick={() => setActiveTab('matching')}
                      className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'matching' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      AI Matcher
                    </button>
                    <button
                      onClick={() => { setActiveTab('saved'); if (user) fetchSavedColleges() }}
                      className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      Saved Nodes
                    </button>
                  </div>
                </div>

                {/* Filters & Actions - Hide for Matching Tab */}
                {activeTab !== 'matching' && (
                  <div className="space-y-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                          placeholder="Search registry..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-[2rem] border border-white/10 bg-white/5 py-5 pl-16 pr-8 text-sm outline-none focus:border-cyan-400/50 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setFiltersOpen(!filtersOpen)}
                          className={`flex items-center gap-2 px-8 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all ${filtersOpen ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
                        >
                          <Filter className="h-4 w-4" /> Filters
                        </button>
                        <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10">
                          <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-cyan-400 text-black' : 'text-slate-500 hover:text-white'}`}><Grid3X3 className="h-5 w-5" /></button>
                          <button onClick={() => setViewMode('map')} className={`p-3 rounded-xl transition-all ${viewMode === 'map' ? 'bg-cyan-400 text-black' : 'text-slate-500 hover:text-white'}`}><MapIcon className="h-5 w-5" /></button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {filtersOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Location</label>
                              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm outline-none focus:border-cyan-400/50">
                                <option value="">All Regions</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Type</label>
                              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm outline-none focus:border-cyan-400/50">
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Min Rating</label>
                              <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                                <Star className="h-4 w-4 text-cyan-400 fill-current" />
                                <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="flex-1 accent-cyan-400" />
                                <span className="text-xs font-black text-cyan-400 w-8">{minRating}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Sort</label>
                              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm outline-none focus:border-cyan-400/50">
                                <option value="rating">Rating</option>
                                <option value="name">Name</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* AI Matching Tab Content - Horizontal Diagnostic Bar */}
                {activeTab === 'matching' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <div className="text-center space-y-4">
                      <h3 className="text-4xl font-black uppercase tracking-tight text-white">Institutional <span className="text-cyan-400">Synthesis</span></h3>
                      <p className="text-slate-500 text-sm max-w-2xl mx-auto">Configure your academic parameters to initialize the matching engine.</p>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Location */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-2">Location</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Bangalore"
                            value={matchingRegion}
                            onChange={(e) => setMatchingRegion(e.target.value)}
                            className="w-full rounded-3xl bg-slate-900 border border-white/10 p-6 text-sm outline-none focus:border-cyan-400/50 transition-all"
                          />
                        </div>

                        {/* Institution Type */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-2">Inst. Type</label>
                          <select 
                            value={matchingType}
                            onChange={(e) => setMatchingType(e.target.value)}
                            className="w-full rounded-3xl bg-slate-900 border border-white/10 p-6 text-sm outline-none focus:border-cyan-400/50"
                          >
                            <option value="">Any Type</option>
                            <option value="government">Government</option>
                            <option value="private">Private</option>
                            <option value="deemed">Deemed</option>
                          </select>
                        </div>

                        {/* Education Level */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-2">Level</label>
                          <select 
                            value={matchingLevel}
                            onChange={(e) => setMatchingLevel(e.target.value)}
                            className="w-full rounded-3xl bg-slate-900 border border-white/10 p-6 text-sm outline-none focus:border-cyan-400/50"
                          >
                            <option value="10th">10th Standard</option>
                            <option value="puc">PUC / 12th</option>
                            <option value="diploma">Diploma</option>
                            <option value="graduation">Graduation</option>
                          </select>
                        </div>

                        {/* Current Stream */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-2">Current Stream</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Science"
                            value={matchingInterest}
                            onChange={(e) => setMatchingInterest(e.target.value)}
                            className="w-full rounded-3xl bg-slate-900 border border-white/10 p-6 text-sm outline-none focus:border-cyan-400/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 ml-2">Profile Insight</label>
                        <textarea 
                          placeholder="Describe your specific requirements or career goals..."
                          rows={2}
                          value={matchingProfile}
                          onChange={(e) => setMatchingProfile(e.target.value)}
                          className="w-full rounded-[2rem] bg-slate-900 border border-white/10 p-8 text-sm outline-none focus:border-cyan-400/50 transition-all resize-none"
                        />
                      </div>

                      <div className="flex justify-center pt-6">
                        <button
                          onClick={() => {
                            localStorage.setItem('fm_match_params', JSON.stringify({
                              location: matchingRegion,
                              type: matchingType,
                              level: matchingLevel,
                              stream: matchingInterest,
                              query: matchingProfile
                            }))
                            setIsMatching(true)
                            setTimeout(() => router.push('/colleges/ai-results'), 800)
                          }}
                          disabled={isMatching}
                          className="min-w-[400px] py-8 rounded-3xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-cyan-400/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                          {isMatching ? <Loader2 className="h-5 w-5 animate-spin" /> : <>EXECUTE ANALYSIS <ChevronRight className="h-5 w-5" /></>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results - Hide for Matching Tab as it has its own results view */}
                {activeTab !== 'matching' && (
                  <div className="relative">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-40 space-y-6">
                        <div className="h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Loading Registry...</p>
                      </div>
                    ) : viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                          {filteredColleges.map((college) => (
                            <CollegeCard 
                              key={college.id} 
                              college={college} 
                              isSaved={savedColleges.includes(college.id)}
                              onSave={() => toggleSave(college)}
                            />
                          ))}
                        </AnimatePresence>
                        {filteredColleges.length === 0 && (
                          <div className="col-span-full py-20 text-center bg-white/[0.01] rounded-[4rem] border border-dashed border-white/5 px-8">
                            <Target className="h-16 w-16 text-cyan-400 mx-auto mb-6 opacity-40" />
                            <h3 className="text-2xl font-black uppercase text-white mb-2 tracking-widest">No Colleges Found in this Area</h3>
                            <p className="text-slate-500 text-sm max-w-md mx-auto mb-12">We couldn't find any institutions matching your exact location filters. Explore our global registry below for elite alternatives.</p>
                            
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                              {colleges.slice(0, 3).map((college) => (
                                <CollegeCard 
                                  key={college.id} 
                                  college={college} 
                                  isSaved={savedColleges.includes(college.id)}
                                  onSave={() => toggleSave(college)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[700px] w-full overflow-hidden rounded-[4rem] border border-white/10 bg-black/40 relative">
                        <LeafletCollegesMap colleges={filteredColleges} />
                      </div>
                    )}
                  </div>
                )}
              </div>
          </div>
          <Footer />
        </main>
      )}
    </>
  )
}