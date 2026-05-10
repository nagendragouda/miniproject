'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Clock, ExternalLink, GraduationCap, ArrowUpRight, Zap } from 'lucide-react'

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

interface LearningProcessCardProps {
  learningProcess: LearningProcess
}

const LearningProcessCard: React.FC<LearningProcessCardProps> = ({ learningProcess: lp }) => {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => router.push(`/learning-processes/${lp.id}`)}
      className="group relative flex flex-col h-full rounded-[2.5rem] border border-white/10 bg-[#0c1222]/80 backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] cursor-pointer"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative p-8 flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 text-2xl group-hover:scale-110 transition-transform duration-500">
            {lp.icon_emoji || '📚'}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
              lp.is_paid 
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {lp.is_paid ? 'PREMIUM' : 'OPEN SOURCE'}
            </span>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-xl">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-[11px] font-black text-white">{lp.rating}</span>
            </div>
          </div>
        </div>

        {/* Title & Instructor */}
        <div className="mb-4">
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-cyan-300 transition-colors mb-2">
            {lp.title}
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            {lp.instructor}
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {lp.description}
        </p>

        {/* Skills Grid */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lp.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
              {skill}
            </span>
          ))}
          {lp.skills.length > 3 && (
            <span className="px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-black text-cyan-400">
              +{lp.skills.length - 3} MORE
            </span>
          )}
        </div>

        {/* Bottom Metrics */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-[11px] font-black text-white">{lp.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
              lp.difficulty_level === 'Beginner' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
              lp.difficulty_level === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
              'border-orange-500/30 text-orange-400 bg-orange-500/5'
            }`}>
              {lp.difficulty_level}
            </div>
          </div>
        </div>

        {lp.access_url && (
          <motion.a
            href={lp.access_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 transition-all"
          >
            <div className="w-full h-full bg-[#0c1222] rounded-2xl flex items-center justify-center gap-3 py-3 transition-colors hover:bg-transparent group/btn">
              <Zap className="h-4 w-4 text-cyan-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white">ACCESS CONTENT</span>
              <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

export default LearningProcessCard
