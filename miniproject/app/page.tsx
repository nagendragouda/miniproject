'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Sparkles,
  Target,
  Zap,
  Play,
  ArrowLeft,
  Search,
  Activity,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  Network,
  Rocket
} from 'lucide-react'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingShapes from '@/components/FloatingShapes'
import ModernFeatureGrid from '@/components/ModernFeatureGrid'
import HeroLines3D from '@/components/HeroLines3D'
import { useRouter } from 'next/navigation'
import { useScroll, useTransform } from 'framer-motion'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import toast from 'react-hot-toast'

const steps = [
  {
    title: 'ANALYZE PROFILE',
    description: 'Our AI scans your skills, interests, and experience to build a comprehensive intelligence graph',
  },
  {
    title: 'SIMULATE PATHS',
    description: 'Millions of career trajectories are simulated to find the paths with the highest success probability',
  },
  {
    title: 'OPTIMIZE ROADMAP',
    description: 'Receive a step-by-step execution plan with 100% precision and real-time market alignment',
  },
]

const interestOptions = [
  'Artificial Intelligence',
  'Sustainable Energy',
  'Financial Technology',
  'Creative Arts & Design',
  'Biotechnology',
  'Teaching & Communication',
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useFirebaseAuth()
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0)
  const [stepProgresses, setStepProgresses] = useState([0, 0, 0])

  // 3D Scroll Transforms
  const { scrollYProgress } = useScroll()
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const heroRotateX = useTransform(scrollYProgress, [0, 0.2], [0, 0])
  
  const statsScale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1])
  const statsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  
  const globalRotateX = useTransform(scrollYProgress, [0.3, 0.5], [15, 0])
  const globalOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])

  const logsRotateX = useTransform(scrollYProgress, [0.85, 1], [15, 0])
  const logsOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1])

  // Simulation Logic
  useEffect(() => {
    let isMounted = true
    
    const runSimulation = async () => {
      await new Promise(r => setTimeout(r, 1000))
      
      while (isMounted) {
        setCurrentWorkflowStep(0)
        setStepProgresses([0, 0, 0])
        
        for (let step = 0; step < 3; step++) {
          if (!isMounted) break
          setCurrentWorkflowStep(step)
          
          for (let p = 0; p <= 100; p += 4) {
            if (!isMounted) break
            setStepProgresses(prev => {
              const next = [...prev]
              next[step] = p
              return next
            })
            await new Promise(r => setTimeout(r, 40))
          }
          
          if (isMounted) {
            setStepProgresses(prev => {
              const next = [...prev]
              next[step] = 101
              return next
            })
            await new Promise(r => setTimeout(r, 1500))
          }
        }
        if (isMounted) await new Promise(r => setTimeout(r, 5000))
      }
    }

    runSimulation()
    return () => { isMounted = false }
  }, [])

  const [isRedirecting, setIsRedirecting] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fm_admin_authenticated') === 'true'
    }
    return false
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem('fm_admin_authenticated')
    if (adminAuth === 'true') {
      router.replace('/admin')
    } else {
      setIsRedirecting(false)
    }
  }, [router])

  const [studentName, setStudentName] = useState('')
  const [selectedInterest, setSelectedInterest] = useState('Artificial Intelligence')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictionReady, setPredictionReady] = useState(false)

  const handlePredict = () => {
    if (!user) {
      toast.error('Sign In or Sign Up to access this feature', {
        style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' },
        icon: '🔒'
      })
      router.push('/auth/signup')
      return
    }
    
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setPredictionReady(true)
    }, 2000)
  }

  return (
    <>
      {/* Invisible check overlay to prevent flash */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] bg-[#030712]" />
      )}
      
      <main className="relative min-h-screen w-full overflow-hidden text-white">
          <div className="fixed inset-0 -z-30 bg-[#030712]" />

          {/* Optimized Static Background */}
          <div className="fixed inset-0 -z-20 bg-[#030712]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(59,130,246,0.15),_transparent_80%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(168,85,247,0.1),_transparent_80%)]" />
          </div>

          <Navbar />
          <FloatingShapes />

          {/* Side Technical Decorations */}
          <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-24 z-10 opacity-20 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
             <div className="rotate-90 origin-left text-[8px] font-black uppercase tracking-[1em] text-white whitespace-nowrap">
                LAT: 40.7128° N / LONG: 74.0060° W
             </div>
             <div className="rotate-90 origin-left text-[8px] font-black uppercase tracking-[1em] text-cyan-400 whitespace-nowrap">
                SECURE_ENCRYPTION_ENABLED
             </div>
          </div>
          
          <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-24 z-10 opacity-20 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
             <div className="-rotate-90 origin-right text-[8px] font-black uppercase tracking-[1em] text-white whitespace-nowrap">
                SYSTEM_STABILITY: 99.98%
             </div>
             <div className="-rotate-90 origin-right text-[8px] font-black uppercase tracking-[1em] text-purple-400 whitespace-nowrap">
                QUANTUM_CORE_SYNCED
             </div>
          </div>
          
          {/* Hero Section */}
          <motion.section 
            style={{ opacity: heroOpacity, scale: heroScale, rotateX: heroRotateX }}
            className="relative pt-56 pb-0 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-10 py-4 text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 relative overflow-hidden group shadow-[0_0_30px_rgba(34,211,238,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <div className="relative flex items-center justify-center h-4 w-4">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20" />
                  <Cpu className="h-4 w-4 relative z-10" />
                </div>
                Quantum Architecture: Active
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75] mb-12"
              >
                <div className="flex flex-col items-center">
                  <motion.span 
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] block w-full"
                  >
                    DESIGN YOUR
                  </motion.span>
                  <motion.span 
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] block w-full"
                  >
                    FUTURE
                  </motion.span>
                  <motion.span 
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-600 bg-clip-text text-transparent italic drop-shadow-[0_0_40px_rgba(34,211,238,0.3)] pr-4 block w-full"
                  >
                    ELITE PATH
                  </motion.span>
                </div>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed tracking-wide italic"
              >
                The world's most advanced <span className="text-white font-bold">Quantum Career Intelligence</span> platform. 
                We engineer high-precision professional trajectories through neural simulation and global institutional alignment.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                <Link href="/career-prediction" className="group relative flex items-center gap-6 rounded-full bg-white px-16 py-8 text-base font-black uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_80px_rgba(255,255,255,0.3)] hover:shadow-[0_0_120px_rgba(255,255,255,0.5)]">
                   <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-10 transition-all duration-500 blur-md" />
                  Launch Engine <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-3" />
                </Link>

                {/* Scroll Indicator */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4 opacity-40 group"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/60">Initialize Neural Scroll</span>
                  <div className="h-6 w-[2px] bg-gradient-to-b from-white via-cyan-400/50 to-transparent" />
                </motion.div>
                
                <div className="w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.div>
            </div>
          </motion.section>

          {/* Stats / Intelligence Ticker Section (Restored in 3) */}
          {/* Feature Grid */}
          <section className="py-32 px-6 relative">
             <div className="max-w-7xl mx-auto text-center mb-24">
               <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">System <span className="text-cyan-400">Capabilities.</span></h2>
               <p className="mt-8 text-slate-500 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase">Hover over nodes for detailed professional briefings.</p>
             </div>
             <ModernFeatureGrid />
          </section>

          {/* Neural Workflow Simulation Section */}
          <section className="py-32 px-6 max-w-7xl mx-auto">
             <div className="text-center mb-24 space-y-4">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
                  Intelligent <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">Workflow</span>
                </h2>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
                  A multi-layered approach to career synthesis and institutional matching.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className={`relative p-10 rounded-[3.5rem] border transition-all duration-700 h-[480px] flex flex-col justify-between overflow-hidden group ${
                    stepProgresses[idx] === 101 
                      ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)]' 
                      : currentWorkflowStep === idx 
                        ? 'border-cyan-400/40 bg-cyan-400/5 shadow-[0_0_50px_rgba(34,211,238,0.1)]' 
                        : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="relative">
                      {/* Circular Progress Node */}
                      <svg className="h-24 w-24 -rotate-90 transform">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray="251.2"
                          animate={{ strokeDashoffset: 251.2 - (251.2 * Math.min(stepProgresses[idx], 100)) / 100 }}
                          className={stepProgresses[idx] === 101 ? 'text-emerald-500' : 'text-cyan-400'}
                          style={{ strokeLinecap: 'round' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {stepProgresses[idx] === 101 ? (
                          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                        ) : (
                          <span className="text-3xl font-black text-white">0{idx + 1}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                         stepProgresses[idx] === 101 ? 'text-emerald-500' : currentWorkflowStep === idx ? 'text-cyan-400' : 'text-slate-500'
                      }`}>
                        {stepProgresses[idx] === 101 ? 'SUCCESS' : currentWorkflowStep === idx ? 'RUNNING' : 'QUEUED'}
                      </div>
                      <div className={`text-4xl font-black tracking-tighter ${
                        stepProgresses[idx] === 101 ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {stepProgresses[idx] === 101 ? '100%' : `${stepProgresses[idx]}%`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-slate-400">{step.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      stepProgresses[idx] === 101 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                       <div className={`h-2 w-2 rounded-full ${stepProgresses[idx] === 101 ? 'bg-emerald-500' : currentWorkflowStep === idx ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                       {stepProgresses[idx] === 101 ? 'SYNTHESIS SUCCESS' : currentWorkflowStep === idx ? 'PROCESSING' : 'STANDBY'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Prediction Section - CAREER PREDICTION DEMO */}
           <section className="py-24 px-6 max-w-5xl mx-auto">
             <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                   Career Prediction <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">Demo</span>
                 </h2>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
                  Initialize the intelligence engine to map your optimal academic trajectory.
                </p>
            </div>

             <div className="rounded-[3rem] border border-white/5 bg-slate-950/80 p-12 relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-slate-950/95" />
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                   <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
                    Advanced Control Panel
                  </div>
                                    <div className="space-y-4">
                     <h3 className="text-xl font-black uppercase tracking-tight text-white/40">Node Input</h3>
                    <div className="space-y-6">
                      <input 
                        type="text" 
                        placeholder="Enter Student Name" 
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/50 transition-all text-base"
                       />
                      <select 
                        value={selectedInterest}
                        onChange={(e) => setSelectedInterest(e.target.value)}
                         className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/50 transition-all text-base"
                       >
                        {interestOptions.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                                    <button 
                     onClick={handlePredict}
                     disabled={isAnalyzing}
                     className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-cyan-400/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden"
                   >
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                    {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Sparkles className="h-6 w-6" /> Initialize Prediction</>}
                  </button>
                </div>
                
                <div className="space-y-12">
                   <div className="inline-flex items-center gap-3 rounded-full border border-purple-400/20 bg-purple-400/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">
                    Neural Output View
                  </div>
                    <div className="space-y-4">
                     <h3 className="text-xl font-black uppercase tracking-tight text-white/40">Neural Output</h3>
                    <div className="relative">
                       <AnimatePresence mode="wait">
                        {predictionReady ? (
                      <motion.div 
                         initial={{ opacity: 0, scale: 0.9, y: 20 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-8 backdrop-blur-3xl shadow-[0_0_100px_rgba(34,211,238,0.15)] space-y-8"
                       >
                          <div className="flex items-center gap-4">
                             <div className="h-16 w-16 rounded-2xl bg-cyan-400/20 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                               <Brain className="h-8 w-8 text-cyan-400" />
                             </div>
                             <div>
                               <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Apex Prediction Result</div>
                               <div className="text-2xl font-black uppercase text-white tracking-tighter">{selectedInterest} Strategist</div>
                             </div>
                          </div>
                         
                         <p className="text-slate-300 text-lg font-medium leading-relaxed">
                           Strategic analysis for <span className="text-white font-bold">{studentName || 'Candidate'}</span> reveals an <span className="text-cyan-400 font-bold uppercase tracking-widest">Optimal Match</span> in the {selectedInterest} domain.
                         </p>

                         {/* Detailed Info Missing in Last Version */}
                         <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5">
                               <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Growth Score</div>
                               <div className="text-3xl font-black text-cyan-400">9.2 / 10</div>
                            </div>
                            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5">
                               <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Success Rate</div>
                               <div className="text-3xl font-black text-cyan-400">98.4%</div>
                            </div>
                         </div>

                         {/* Roadmap Preview Steps */}
                         <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Trajectory Milestones</div>
                            {[
                              { icon: Layers, text: 'Advanced Skill Synthesis' },
                              { icon: Network, text: 'Global Institutional Alignment' },
                              { icon: Rocket, text: 'Strategic Execution Launch' }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <item.icon className="h-5 w-5 text-purple-400" />
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-tight">{item.text}</span>
                              </div>
                            ))}
                         </div>

                         <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
                               <ShieldCheck className="h-4 w-4" /> Data Verified
                            </div>
                            <Link href="/auth/signup" className="text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                               Unlock Full Roadmap <ChevronRight className="h-3 w-3" />
                            </Link>
                         </div>
                      </motion.div>
                    ) : (
                      <div className="aspect-square rounded-[4rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-6 text-slate-800 bg-white/[0.01]">
                        <Activity className="h-16 w-16 opacity-10 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Initialize Profile Node</span>
                      </div>
                    )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* Global Network Section */}
          <motion.section 
            style={{ rotateX: globalRotateX, opacity: globalOpacity }}
            className="py-32 px-6 max-w-7xl mx-auto overflow-hidden perspective-3000"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400"
                >
                  Global Reach
                </motion.div>
                <h2 className="text-6xl font-black uppercase tracking-tighter leading-none text-white">
                  Global <span className="text-indigo-400">Network</span> Matrix.
                </h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed italic opacity-80">
                  A high-fidelity architectural mapping of the world's most elite academic institutions and professional leadership networks.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Institutional Clusters</div>
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Academic Excellence Nodes</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Intelligence Mentors</div>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Global Industry Leaders</div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square flex items-center justify-center">
                <div className="absolute inset-0 rounded-[4rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-3xl overflow-hidden group shadow-2xl">
                   <motion.img 
                      src="/career_blocks.png"
                      alt="Neural Core"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                      initial={{ scale: 1.2, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 0.6 }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Project Mission / About Section */}
          <section className="py-40 px-6 max-w-7xl mx-auto relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] -z-10" />
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="inline-flex items-center gap-3 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-400">
                Project Mission
              </div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-white">
                Bridging the <span className="text-cyan-400">Gap Between</span> Potential and Reality.
              </h2>
              <div className="space-y-8 text-slate-400 text-2xl font-medium leading-relaxed italic opacity-80">
                <p>
                  FutureMatrix is a <span className="text-white">Neural Bridge</span> designed to democratize high-level career strategic planning. We believe that elite professional guidance should be accessible to every student, everywhere.
                </p>
                <p>
                  By leveraging <span className="text-white font-bold">Advanced AI Synthesis</span>, we provide real-time institutional matching and career path simulation that was previously only available to the world's top 1%.
                </p>
              </div>
            </div>
          </section>

          <Footer />
        </main>
    </>
  )
}
