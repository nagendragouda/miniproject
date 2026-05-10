'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Star, 
  Heart, 
  TrendingUp,
  DollarSign,
  BookOpen,
  Zap,
  Loader,
  ExternalLink,
  Map as MapIcon,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Building,
  Navigation2,
  Cpu
} from 'lucide-react'
import dynamic from 'next/dynamic'

const LeafletCollegesMap = dynamic(() => import('@/components/LeafletCollegesMap'), { ssr: false }) as any

// Neural Link Resolver for Direct Institution Access
const resolveCollegeWebsite = (name: string, currentWebsite?: string) => {
  const n = name.toLowerCase();
  // Layer 1: Hardcoded Master Mapping
  if (n.includes('dayananda sagar') && n.includes('engineering')) return 'https://www.dsce.edu.in';
  if (n.includes('dayananda sagar') && n.includes('university')) return 'https://www.dsu.edu.in';
  if (n.includes('bms') && n.includes('engineering')) return 'https://www.bmsce.ac.in';
  if (n.includes('ms ramaiah') || n.includes('m.s. ramaiah')) return 'https://www.msrit.edu';
  if (n.includes('rv college') || n.includes('r.v. college')) return 'https://www.rvce.edu.in';
  if (n.includes('pes university') || n.includes('p.e.s. university')) return 'https://www.pes.edu';
  
  // Layer 2: Sanitized Database URL
  if (currentWebsite && currentWebsite !== '#' && currentWebsite.length > 5 && !currentWebsite.includes('google.com/search')) {
    return currentWebsite.startsWith('http') ? currentWebsite : `https://${currentWebsite}`;
  }

  // Layer 3: Smart Domain Guessing
  const domain = n.replace(/[^a-z0-9]/g, '');
  if (n.includes('iit')) return `https://www.iit${domain.replace('iit', '')}.ac.in`;
  if (n.includes('nit')) return `https://www.nit${domain.replace('nit', '')}.ac.in`;
  
  // Final Fallback: "I'm Feeling Lucky" (Direct to first search result)
  return `https://www.google.com/search?btnI=1&q=${encodeURIComponent(name + ' official website')}`;
};

interface College {
  id: string
  name: string
  location: string
  state: string
  city: string
  type: string
  established: number
  website?: string
  courses: string[]
  rating: number
  fees: string
  cutoff?: string
  image?: string
  imageUrl?: string 
  distance?: number
  description?: string
  latitude?: number
  longitude?: number
}

interface CollegeCardProps {
  college: College
  onSave?: (collegeId: string) => void
  isSaved?: boolean
  compatibility?: number
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college, onSave, isSaved = false, compatibility }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [showMiniMap, setShowMiniMap] = useState(false)

  const cardImage = college.imageUrl || college.image

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (isSaving) return

    if (onSave) {
      setIsSaving(true)
      try {
        await onSave(college.id)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const city = college.city || college.location?.split(',')[0]?.trim() || 'Unknown City'
  const state = college.state || college.location?.split(',')[1]?.trim() || 'India'

  // Ensure website has protocol
  const getWebsiteUrl = () => {
    let url = college.website
    if (!url || url === '#' || url.trim() === '') {
      return `https://www.google.com/search?q=${encodeURIComponent(college.name)}`
    }
    if (!url.startsWith('http')) {
      return `https://${url}`
    }
    return url
  }
  const processedWebsite = getWebsiteUrl()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex flex-col h-full rounded-[3rem] border border-white/10 bg-[#030712]/60 backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_30px_60px_rgba(34,211,238,0.1)]"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 -z-10 opacity-10 transition-opacity group-hover:opacity-20 overflow-hidden">
        {cardImage ? (
          <img src={cardImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-indigo-900/50" />
        )}
      </div>

      {/* Compatibility Badge */}
      {compatibility && (
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-400/20">
            <Zap className="h-3 w-3 fill-current" />
            {compatibility}% Match
          </div>
        </div>
      )}

      <div className="p-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors tracking-tight">
              {college.name}
            </h3>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`p-4 rounded-2xl border transition-all ${
              isSaved 
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-400'
            }`}
          >
            {isSaving ? <Loader className="h-5 w-5 animate-spin" /> : <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />}
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
              {college.type || 'University'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">
              ESTD {college.established || '---'}
            </span>
          </div>
          {college.latitude && college.longitude && college.latitude !== 0 && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <Navigation2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {college.latitude.toFixed(2)}, {college.longitude.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <MapPin className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-slate-300">
              {city}, {state}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
            <Star className="h-4 w-4 text-cyan-400 fill-current" />
            <span className="text-sm font-black text-white">{college.rating || '4.0'}</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 flex-1 min-h-[180px]">
        <AnimatePresence mode="wait">
          {showMiniMap ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-full min-h-[160px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative"
            >
              <div className="absolute inset-0 grayscale contrast-125 opacity-70">
                <LeafletCollegesMap colleges={[college as any]} zoom={12} />
              </div>
              <button 
                onClick={() => setShowMiniMap(false)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 border border-white/10 text-white hover:bg-black transition-colors z-[1000]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex flex-col rounded-3xl bg-white/2 border border-white/5 p-5 group-hover:border-cyan-400/20 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Profile</span>
                </div>
                <p className="text-lg font-black text-white leading-tight">
                  {college.fees || 'Contact for Fees'} <span className="text-[10px] font-medium text-slate-500">{college.fees !== 'N/A' ? '/ YEAR' : ''}</span>
                </p>
              </div>

              {college.description && (
                <div className="relative overflow-hidden group/insight rounded-3xl bg-white/2 border border-white/5 p-6 hover:border-cyan-400/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/insight:opacity-100 transition-opacity">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-cyan-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Matching Insight</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed line-clamp-4 italic">
                    "{college.description}"
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 pt-4 flex gap-3">
        <button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
            showMiniMap ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-400'
          }`}
        >
          <MapIcon className="h-5 w-5" />
        </button>
        
        <Link
          href={resolveCollegeWebsite(college.name, college.website)}
          target="_blank"
          className="group/btn relative flex-1 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-full h-full bg-[#030712] rounded-2xl flex items-center justify-center gap-3 py-4 transition-colors group-hover/btn:bg-transparent">
            <Zap className="h-4 w-4 text-cyan-400 group-hover/btn:text-white transition-colors" />
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase">ACCESS INSTITUTION</span>
            <ExternalLink className="h-3 w-3 text-slate-500 group-hover/btn:text-white transition-colors" />
          </div>
        </Link>
      </div>
    </motion.div>
  )
}

export default CollegeCard