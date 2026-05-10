'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Brain, 
  Map, 
  GraduationCap, 
  BookOpen, 
  FileSearch,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import toast from 'react-hot-toast'

function useInViewOnce<T extends HTMLElement>(threshold = 0.1): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null)
  const [hasBeenInView, setHasBeenInView] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, hasBeenInView]
}

function SectionReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const variants = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: Brain,
    title: 'Career Prediction',
    thumbnail: '/career_growth.png',
    description: 'Advanced intelligence logic mapping your unique professional profile to high-potential career growth paths',
    extendedInfo: {
      narrative: 'Our system executes a deep analysis of your unique professional signature, evaluating complex patterns in your expertise and aptitude to identify the most sustainable and high-impact career directions for your specific trajectory'
    },
    href: '/career-prediction',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    icon: Map,
    title: 'Strategic Roadmap',
    thumbnail: '/career_analytics.png',
    description: 'Precision-engineered step-by-step guides for navigating complex career transitions and milestones',
    extendedInfo: {
      narrative: 'We provide an intelligent progression framework that identifies critical skill requirements and strategic milestones, offering a clear and authoritative path from your current position to your ultimate professional objectives'
    },
    href: '/career-roadmap',
    color: 'from-indigo-400 to-purple-600'
  },
  {
    icon: GraduationCap,
    title: 'Institution Finder',
    thumbnail: '/global_edu.png',
    description: 'Curated recommendations for academic excellence, matching your goals with elite global programs',
    extendedInfo: {
      narrative: 'Our global intelligence network matches your professional ambitions with the world’s most prestigious institutions, ensuring that your educational investments perfectly align with your long-term career success and institutional fit'
    },
    href: '/colleges',
    color: 'from-fuchsia-400 to-pink-600'
  },
  {
    icon: BookOpen,
    title: 'Resource Vault',
    thumbnail: '/skill_certification.png',
    description: 'Access an exclusive library of learning materials designed for rapid skill acquisition and mastery',
    extendedInfo: {
      narrative: 'Gain immediate access to an elite collection of curated intelligence and professional resources, specifically engineered to accelerate your expertise and provide a competitive edge in high-stakes industries'
    },
    href: '/learning-resources',
    color: 'from-emerald-400 to-teal-600'
  },
  {
    icon: FileSearch,
    title: 'Resume Auditor',
    thumbnail: '/job_hunter.png',
    description: 'Deep strategic analysis of your professional profile to optimize for ATS performance and impact',
    extendedInfo: {
      narrative: 'Our elite auditing engine performs an exhaustive linguistic and structural analysis of your resume, optimizing every detail for maximum performance and ensuring your professional narrative commands attention in the global job market'
    },
    href: '/resume-analyzer',
    color: 'from-amber-400 to-orange-600'
  }
]

export default function ModernFeatureGrid() {
  const { user } = useFirebaseAuth()
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [containerRef, inView] = useInViewOnce<HTMLDivElement>(0.2)

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto py-8 px-4">
      {/* RGB Lighting Vertical Connector Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-[2px] -translate-x-1/2 hidden md:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-500 via-purple-500 via-fuchsia-500 to-transparent opacity-50 blur-[2px]" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-cyan-400 via-purple-400 via-fuchsia-400 to-transparent" />
      </div>

      <div className="space-y-12">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isEven = index % 2 === 0
          const isHovered = hoveredIndex === index
          const isActive = true
          const isCurrentlyActivating = false
          
          return (
            <div 
              key={feature.title} 
              className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Content Panel */}
              <div 
                className="w-full md:w-1/2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <SectionReveal direction={isEven ? 'left' : 'right'} delay={0.1}>
                  <Link 
                    href={feature.href} 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault()
                        toast.error('Sign In or Sign Up to access this feature', {
                          style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' },
                          icon: '🔒'
                        })
                        router.push('/auth/signup')
                      }
                    }}
                    className="group block relative p-[1px] rounded-[3rem] overflow-hidden"
                  >
                    {/* RGB Animated Border Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-fuchsia-500 transition-opacity duration-700 ${isActive || isHovered ? 'opacity-40 group-hover:opacity-100' : 'opacity-10'}`} />
                    
                    <motion.div 
                      whileHover={{ rotateX: 5, rotateY: -5, z: 50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`relative overflow-hidden rounded-[3rem] border transition-all duration-700 ${isActive || isHovered ? 'border-white/10 bg-slate-950/90' : 'border-white/5 bg-slate-950/40'} backdrop-blur-3xl group-hover:bg-slate-950/80`}
                    >
                      {/* Feature Thumbnail Image - Optimized Framing */}
                      <div className="relative h-64 w-full overflow-hidden">
                        <img 
                          src={feature.thumbnail} 
                          alt={feature.title} 
                          className="h-full w-full object-cover object-top opacity-70 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      </div>

                      <div className="p-10 pt-0">
                        {/* Iridescent Gradient Glow */}
                        <div className={`absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-20`} />
                        
                        <div className={`mb-10 -mt-8 relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white shadow-2xl transition-all duration-700 ${isActive || isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}>
                          <Icon className="h-full w-full" />
                        </div>
                        
                        <h3 className={`text-3xl font-black text-white tracking-tight mb-4 uppercase transition-all duration-700 ${isActive || isHovered ? 'opacity-100 translate-x-0' : 'opacity-60 -translate-x-1'}`}>
                          {feature.title}
                        </h3>
                      
                      <p className={`text-slate-400 leading-relaxed font-medium mb-8 text-lg transition-all duration-700 ${isActive || isHovered ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2'}`}>
                        {feature.description}
                      </p>
                      
                      <div className={`flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-white transition-all duration-700 ${isActive || isHovered ? 'opacity-100 translate-x-2' : 'opacity-20 translate-x-0'}`}>
                        Execute Module <ChevronRight className="h-4 w-4" />
                      </div>
                      </div>
                    </motion.div>
                  </Link>
                </SectionReveal>
              </div>

              {/* Central Node Indicator */}
              <div className="relative hidden md:flex h-12 w-12 items-center justify-center">
                <div className={`absolute h-full w-full rounded-full border border-white/10 bg-slate-950 backdrop-blur-3xl transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-20'}`} />
                <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${feature.color} transition-all duration-700 ${isActive ? 'animate-pulse scale-150' : 'scale-50 opacity-20'} shadow-[0_0_15px_rgba(255,255,255,0.5)]`} />
                {isCurrentlyActivating && (
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                  />
                )}
              </div>

              {/* Extended Info Panel (Opposite Side) */}
              <div className="hidden md:flex w-1/2 justify-center">
                <AnimatePresence mode="wait">
                  {isHovered && (
                    <motion.div
                      key={`briefing-${index}`}
                      initial={{ opacity: 0, x: isEven ? 40 : -40, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: isEven ? 40 : -40, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="p-10 rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.3)]"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-6">Apex Intelligence</p>
                      
                      <div className="space-y-6">
                        <p className="text-slate-200 text-base leading-relaxed font-medium">
                          {feature.extendedInfo.narrative}
                        </p>
                      </div>

                      <div className={`mt-8 h-[2px] w-full bg-gradient-to-r from-transparent ${feature.color} to-transparent opacity-30`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
