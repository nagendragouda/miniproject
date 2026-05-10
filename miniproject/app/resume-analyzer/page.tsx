'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  TrendingUp, 
  Zap, 
  Brain, 
  Target, 
  Map, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  RefreshCcw,
  Download,
  Layout,
  MessageSquare,
  Award,
  Globe,
  Rocket,
  Layers,
  ChevronRight,
  PieChart,
  BookOpen,
  Github,
  Linkedin,
  Lightbulb,
  FileEdit,
  History,
  Save,
  ArrowLeft,
  Loader2,
  UserCheck,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { supabase } from '@/lib/supabase-client'

type AnalysisResult = {
  score_report: {
    total_score: number
    breakdown: {
      skills: number
      experience: number
      formatting: number
      ats_compatibility: number
    }
    ats_check: {
      status: string
      missing_keywords: string[]
      optimization_tips: string[]
    }
  }
  professional_profile: {
    experience_level: string
    detected_role: string
    strengths: string[]
    weaknesses: string[]
    grammar_check: string
    action_verb_fixes: Array<{ original: string; suggested: string }>
  }
  skill_intelligence: {
    extracted_skills: string[]
    skill_gaps: string[]
    job_match_percentage: number
    visual_data: {
      labels: string[]
      values: number[]
    }
  }
  section_feedback: {
    education: string
    skills: string
    experience: string
    formatting: string
  }
  career_growth: {
    prediction: string
    roadmap: string[]
    recommended_courses: string[]
    suggested_projects: string[]
    certifications: string[]
  }
  online_presence: {
    linkedin_tips: string[]
    portfolio_suggestions: string[]
    github_critique: string
  }
  interview_kit: {
    likely_questions: string[]
    ai_suggested_answers: string[]
  }
  one_click_improvements: Array<{
    section: string
    original_text: string
    improved_text: string
  }>
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { user, loading: authLoading } = useFirebaseAuth()
  const [profileLoading, setProfileLoading] = useState(true)
  const [educationLevel, setEducationLevel] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signup?next=/resume-analyzer')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('education_level')
          .eq('firebase_uid', user.uid)
          .single()
        
        if (data) {
          setEducationLevel(data.education_level)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    } else if (!authLoading) {
      setProfileLoading(false)
    }
  }, [user, authLoading])
  const [activeTab, setActiveTab] = useState<'score' | 'skills' | 'roadmap' | 'interview' | 'optimize' | 'online'>('score')
  
  const [jobDescription, setJobDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const analysisInterval = useRef<any>(null)

  useEffect(() => {
    const restoreData = localStorage.getItem('resume_analyzer_restore')
    if (restoreData) {
      try {
        setResult(JSON.parse(restoreData))
        setIsSaved(true)
        localStorage.removeItem('resume_analyzer_restore')
      } catch (e) {}
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setResult(null)
      toast.success('Resume uploaded successfully!')
    } else {
      toast.error('Please upload a valid PDF file')
    }
  }

  const startAnalysis = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    
    analysisInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) return prev + 0.5
        return prev
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('/api/resume-analyzer/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Analysis Data received:', data.data);
        clearInterval(analysisInterval.current)
        setProgress(100)
        setTimeout(() => {
          setResult(data.data)
          setIsAnalyzing(false)
          setIsSaved(false)
          toast.success('Ultra-Deep Analysis Complete!')
        }, 800)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error: any) {
      console.error('❌ Analysis Error:', error)
      clearInterval(analysisInterval.current)
      setIsAnalyzing(false)
      setProgress(0)
      toast.error(error.message || 'Deep Audit Failed.')
    }
  }

  const saveToDatabase = async (data: any) => {
    if (!user) {
      // Fallback to local storage for guests
      try {
        const history = JSON.parse(localStorage.getItem('resume_history') || '[]')
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          score: data.score_report?.total_score,
          role: data.professional_profile?.detected_role,
          data: data
        }
        localStorage.setItem('resume_history', JSON.stringify([newEntry, ...history].slice(0, 10)))
      } catch (e) {}
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch('/api/resume-analyzer/save-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          fileName: file?.name || 'Resume',
          jobDescription,
          analysisResult: data,
          score: data.score_report?.total_score,
          detectedRole: data.professional_profile?.detected_role
        })
      })
      const resData = await response.json()
      if (resData.success) {
        setIsSaved(true)
        toast.success('Saved to Dashboard Successfully!', {
          style: {
            border: '1px solid #10b981',
            padding: '16px',
            color: '#10b981',
            background: '#030712',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#FFFAEE',
          },
        })
      }
    } catch (e) {
      console.error('Failed to save to database:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const downloadReport = () => {
    window.print()
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-bold tracking-widest uppercase text-[10px]">Initializing Neural Audit...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* Go Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
        </button>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      <div className="pointer-events-none fixed left-6 top-20 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="pointer-events-none fixed right-8 top-36 -z-10 h-80 w-80 rounded-full bg-cyan-400/12 blur-3xl" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Intelligence
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-fuchsia-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent"
          >
            Resume <span className="text-white">Analyzer</span>
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Transform your professional profile with deep strategic auditing, 
            ATS optimization, and personalized career roadmaps.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {educationLevel === '10th' ? (
            <motion.div
              key="restricted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-red-500/20 rounded-[3rem] overflow-hidden p-12 text-center relative group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-amber-500/5 opacity-100 transition-opacity duration-700" />
                
                <div className="mb-8 relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center border border-red-500/30 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Access Restricted</h3>
                  <p className="text-slate-400 font-medium tracking-wide text-lg leading-relaxed mb-8">
                    The Resume Analyzer is optimized for students from <span className="text-cyan-400 font-bold">PUC/12th Grade onwards</span>. 
                    Resume auditing is not available for 10th Standard students at this stage.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-5 h-5" /> Update Education Level
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full py-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-sm font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden p-12 text-center relative group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div 
                  className="mb-8 cursor-pointer relative z-10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} />
                  
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center border transition-all duration-500 ${file ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 group-hover:border-cyan-400/30 group-hover:bg-cyan-500/5'}`}>
                    {file ? <FileText className="w-12 h-12 text-cyan-400" /> : <Upload className="w-12 h-12 text-slate-500 group-hover:text-cyan-400" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">{file ? file.name : 'Upload Your Resume'}</h3>
                  <p className="text-slate-500 font-medium tracking-wide text-sm">Quantum Intelligence Parsing • PDF Only • Max 5MB</p>
                </div>

                <div className="mt-10 mb-10 text-left relative z-10">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-fuchsia-400" /> Target Job Context
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description or role name for laser-focused skill gap analysis..."
                    className="w-full h-36 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm text-slate-300 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 focus:outline-none transition-all resize-none shadow-inner"
                  />
                </div>

                {file && !isAnalyzing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                    className="w-full py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 relative z-10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Zap className="w-6 h-6 fill-black" />
                    <span className="relative">START DEEP ANALYSIS</span>
                  </button>
                )}

                {isAnalyzing && (
                  <div className="mt-10 space-y-6 relative z-10">
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-1">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full" 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <p className="text-xs text-cyan-400 font-black uppercase tracking-[0.2em] animate-pulse">Running Neural Audit...</p>
                      <span className="text-xs font-bold text-slate-500">{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Tabs Sidebar */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/5 p-2">
                  {[
                    { id: 'score', label: 'Score Dashboard', icon: Layout },
                    { id: 'skills', label: 'Skill Intelligence', icon: Brain },
                    { id: 'optimize', label: 'Optimize Content', icon: FileEdit },
                    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
                    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
                    { id: 'online', label: 'Web Presence', icon: Globe },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-500 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw className="w-4 h-4" /> Start New Audit
                </button>
              </div>

              {/* Content Engine */}
              <div className="lg:col-span-9 space-y-8 print:col-span-12">
                <div className="flex items-center justify-between gap-4 mb-2 print:hidden">
                  <div className="text-xs text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-cyan-400" /> Advanced Strategic Intelligence Report
                  </div>
                  <div className="flex items-center gap-3">
                    {user && (
                      <button 
                        onClick={() => !isSaved && result && saveToDatabase(result)}
                        disabled={isSaving || isSaved}
                        className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSaved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' : 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/20'}`}
                      >
                        {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : isSaved ? 'Saved successfully' : 'Save to Dashboard'}
                      </button>
                    )}
                    <button 
                      onClick={downloadReport}
                      className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Report
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                  
                  {activeTab === 'score' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 p-10 bg-gradient-to-br from-white/10 to-white/5 rounded-[2.5rem] border border-white/10 flex items-center gap-12 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                          
                          <div className="relative w-40 h-40 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                              <motion.circle 
                                cx="80" cy="80" r="72" 
                                stroke="currentColor" strokeWidth="12" 
                                strokeDasharray={452} 
                                initial={{ strokeDashoffset: 452 }} 
                                animate={{ strokeDashoffset: 452 - (452 * (result?.score_report?.total_score || 0)) / 100 }} 
                                transition={{ duration: 2, ease: "easeOut" }} 
                                strokeLinecap="round" fill="transparent" 
                                className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-5xl font-black tracking-tighter text-white">{result?.score_report?.total_score || 0}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4 relative z-10">
                            <div>
                              <h3 className="text-3xl font-black tracking-tight text-white mb-1">Quality Report</h3>
                              <p className="text-cyan-400 text-sm font-bold uppercase tracking-[0.2em]">
                                {result?.professional_profile?.experience_level} • {result?.professional_profile?.detected_role}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${result?.score_report?.ats_check?.status === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                {result?.score_report?.ats_check?.status || 'Processing'} ATS Match
                              </span>
                              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                                AI Audited
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all duration-300">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Skills Accuracy</div>
                            <div className="flex items-end gap-2">
                              <div className="text-3xl font-black text-white">{result?.score_report?.breakdown?.skills || 0}%</div>
                              <div className="h-1 flex-1 bg-white/5 rounded-full mb-2 overflow-hidden">
                                <motion.div className="h-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: `${result?.score_report?.breakdown?.skills || 0}%` }} transition={{ delay: 0.5, duration: 1 }} />
                              </div>
                            </div>
                          </div>
                          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all duration-300">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">ATS Optimization Score</div>
                            <div className="flex items-end gap-2">
                              <div className="text-3xl font-black text-white">{result?.score_report?.breakdown?.ats_compatibility || 0}%</div>
                              <div className="h-1 flex-1 bg-white/5 rounded-full mb-2 overflow-hidden">
                                <motion.div className="h-full bg-fuchsia-400" initial={{ width: 0 }} animate={{ width: `${result?.score_report?.breakdown?.ats_compatibility || 0}%` }} transition={{ delay: 0.7, duration: 1 }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-sm font-black text-slate-500 uppercase flex items-center gap-2"><Target className="w-4 h-4" /> Core Strengths</h4>
                          <div className="space-y-2">
                            {(result?.professional_profile?.strengths || []).map((s, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-sm text-emerald-100">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> {s}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-black text-slate-500 uppercase flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Priority Fixes</h4>
                          <div className="space-y-2">
                            {(result?.professional_profile?.weaknesses || []).map((w, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-sm text-red-100">
                                <AlertCircle className="w-4 h-4 text-red-500" /> {w}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ATS Deep Audit Section */}
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Search className="w-24 h-24 text-fuchsia-400" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-fuchsia-400" /> ATS Deep Audit
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Critical Missing Keywords</p>
                              <div className="flex flex-wrap gap-2">
                                {(result?.score_report?.ats_check?.missing_keywords || []).length > 0 ? (
                                  result.score_report.ats_check.missing_keywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400">
                                      {kw}
                                    </span>
                                  ))
                                ) : (
                                  <p className="text-sm text-emerald-400 font-bold flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> All critical keywords identified
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Optimization Strategies</p>
                              <div className="space-y-3">
                                {(result?.score_report?.ats_check?.optimization_tips || []).map((tip, i) => (
                                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed font-medium">
                                    <ArrowRight className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'skills' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-20">
                            <Brain className="w-20 h-20 text-cyan-400" />
                          </div>
                          <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                            <Zap className="w-5 h-5 text-cyan-400" /> Skill Intelligence
                          </h4>
                          <div className="space-y-6">
                            {(result?.skill_intelligence?.visual_data?.labels || []).map((label, i) => (
                              <div key={label} className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                  <span>{label}</span>
                                  <span className="text-cyan-400">{result?.skill_intelligence?.visual_data?.values?.[i] || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${result?.skill_intelligence?.visual_data?.values?.[i] || 0}%` }} 
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] relative group">
                            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">Core Competencies</h4>
                            <div className="flex flex-wrap gap-2">
                              {(result?.skill_intelligence?.extracted_skills || []).map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-xs font-bold text-emerald-100 hover:scale-105 transition-all cursor-default">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem]">
                            <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Target className="w-4 h-4" /> Detected Skill Gaps
                            </h4>
                            <div className="space-y-3">
                              {(result?.skill_intelligence?.skill_gaps || []).map((gap, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  {gap}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'optimize' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                        <Lightbulb className="w-6 h-6 text-amber-400 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-amber-100">Smart Rewrite Engine</h4>
                          <p className="text-sm text-amber-200/60 leading-relaxed">AI has identified high-impact rewrites for your experience section to improve ATS ranking and executive impression.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {(result?.one_click_improvements || []).map((imp, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                            <div className="px-6 py-3 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                              {imp?.section} Optimization
                            </div>
                            <div className="p-8 grid md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Current</p>
                                <p className="text-sm text-slate-400 italic">"{imp?.original_text}"</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] text-cyan-500 uppercase font-bold">AI Improved</p>
                                <p className="text-sm text-white font-medium">"{imp?.improved_text}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                        <h4 className="text-sm font-black text-slate-500 uppercase mb-6">Action Verb Upgrades</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {(result?.professional_profile?.action_verb_fixes || []).map((fix, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                              <span className="text-xs text-slate-500 line-through">{fix?.original}</span>
                              <ChevronRight className="w-3 h-3 text-cyan-500" />
                              <span className="text-xs text-cyan-400 font-bold">{fix?.suggested}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'roadmap' && (
                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
                      <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
                        <div className="flex items-center gap-6 mb-10">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                            <Map className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-white leading-tight">Career Trajectory</h3>
                            <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest mt-1">{result?.career_growth?.prediction || 'Analyzing...'}</p>
                          </div>
                        </div>

                        <div className="relative pl-12 space-y-10">
                          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent" />
                          {Array.isArray(result?.career_growth?.roadmap) && result.career_growth.roadmap.length > 0 ? (
                            result.career_growth.roadmap.map((step: any, i: number) => {
                              const isObject = typeof step === 'object' && step !== null;
                              const title = isObject ? step.title : step;
                              const strategy = isObject ? step.strategy : null;
                              const duration = isObject ? step.duration : (i === 0 ? '0-3 Months' : i === 1 ? '3-6 Months' : i === 2 ? '6-12 Months' : '1-2 Years');
                              const phaseLabel = isObject && step.phase ? step.phase : `Phase ${i + 1}`;

                              return (
                                <div key={i} className="relative group">
                                  <div className="absolute -left-12 w-8 h-8 bg-slate-900 border-2 border-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform z-10">
                                    {i + 1}
                                  </div>
                                  <div className="pt-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                        <Clock className="w-3 h-3" />
                                        {phaseLabel}: {duration}
                                      </div>
                                    </div>
                                    <h4 className="text-xl text-slate-100 font-black leading-relaxed group-hover:text-indigo-300 transition-colors mb-2">
                                      {title}
                                    </h4>
                                    {strategy && (
                                      <p className="text-sm text-slate-400 leading-relaxed font-medium mb-4">
                                        {strategy}
                                      </p>
                                    )}
                                    {isObject && Array.isArray(step.milestones) && step.milestones.length > 0 && (
                                      <div className="space-y-2 mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Key Milestones</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {step.milestones.map((m: string, mi: number) => (
                                            <div key={mi} className="flex items-center gap-2 text-xs text-slate-300">
                                              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                                <Target className="w-2 h-2 text-emerald-400" />
                                              </div>
                                              {m}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-slate-500 italic font-medium">Detailed trajectory steps are being calculated based on your profile depth...</div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                          <h4 className="text-sm font-black text-slate-500 uppercase mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Recommended Learning</h4>
                          <div className="space-y-4">
                            {(result?.career_growth?.recommended_courses || []).map((course: any, i: number) => {
                              const isObj = typeof course === 'object' && course !== null;
                              return (
                                <div key={i} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-3 text-sm text-slate-200 font-bold">
                                    <ChevronRight className="w-3 h-3 text-indigo-500" /> {isObj ? course.title : course}
                                  </div>
                                  {isObj && (
                                    <div className="flex items-center gap-2 ml-6">
                                      <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase font-black">{course.duration}</span>
                                      <span className="text-[9px] px-2 py-0.5 bg-white/5 text-slate-500 border border-white/5 rounded uppercase font-black">{course.level}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                          <h4 className="text-sm font-black text-slate-500 uppercase mb-6 flex items-center gap-2"><Layers className="w-4 h-4" /> Suggested Projects</h4>
                          <div className="space-y-4">
                            {(result?.career_growth?.suggested_projects || []).map((proj: any, i: number) => {
                              const isObj = typeof proj === 'object' && proj !== null;
                              return (
                                <div key={i} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-3 text-sm text-slate-200 font-bold">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> {isObj ? proj.title : proj}
                                  </div>
                                  {isObj && (
                                    <div className="flex items-center gap-2 ml-6">
                                      <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded uppercase font-black">{proj.duration}</span>
                                      <span className="text-[9px] px-2 py-0.5 bg-white/5 text-slate-500 border border-white/5 rounded uppercase font-black">{proj.complexity}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'interview' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-black text-white flex items-center gap-4"><MessageSquare className="w-6 h-6 text-cyan-400" /> Interview Success Kit</h3>
                        <p className="text-slate-400 text-sm font-medium">Advanced psychological and technical preparation matrix.</p>
                      </div>

                      {/* Pros and Cons Analysis */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                          <div className="absolute top-0 right-0 p-6 opacity-10">
                            <TrendingUp className="w-20 h-20 text-emerald-400" />
                          </div>
                          <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                            <CheckCircle className="w-4 h-4" /> Strategic Advantages (Pros)
                          </h4>
                          <div className="space-y-4 relative z-10">
                            {(result?.professional_profile?.strengths || []).map((pro, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                                <p className="text-sm text-emerald-50 leading-relaxed font-medium">{pro}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] relative overflow-hidden group hover:bg-rose-500/10 transition-all">
                          <div className="absolute top-0 right-0 p-6 opacity-10">
                            <AlertCircle className="w-20 h-20 text-rose-400" />
                          </div>
                          <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                            <Target className="w-4 h-4" /> Potential Red Flags (Cons)
                          </h4>
                          <div className="space-y-4 relative z-10">
                            {(result?.professional_profile?.weaknesses || []).map((con, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                                <p className="text-sm text-rose-50 leading-relaxed font-medium">{con}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        {(result?.interview_kit?.likely_questions || []).map((q, i) => (
                          <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:bg-white/10 transition-all">
                            <p className="text-xl font-bold text-white mb-4">"{q}"</p>
                            <div className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                              <p className="text-[10px] font-black text-cyan-400 uppercase mb-3">AI Coach Answer Logic</p>
                              <p className="text-sm text-slate-400 leading-relaxed italic">"{result?.interview_kit?.ai_suggested_answers?.[i] || 'No specific advice'}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
 
                      {/* Strategic Interview Resources */}
                      <div className="mt-12 p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_40%)]" />
                        <h4 className="text-xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
                          <Rocket className="w-5 h-5 text-cyan-400" /> Strategic Resources
                        </h4>
                        
                        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                          {[
                            { 
                              title: 'STAR Method Mastery', 
                              desc: 'The gold standard for behavioral questions', 
                              link: 'https://hbr.org/2021/11/how-to-use-the-star-method-to-ace-your-next-job-interview',
                              icon: Target 
                            },
                            { 
                              title: 'Technical Prep Guide', 
                              desc: 'Algorithms and systems design mastery', 
                              link: 'https://github.com/jwasham/coding-interview-university',
                              icon: Cpu 
                            },
                            { 
                              title: 'Professional Etiquette', 
                              desc: 'Communication and presentation strategies', 
                              link: 'https://www.forbes.com/sites/jacquelynsmith/2013/03/11/10-body-language-tips-for-your-next-job-interview/',
                              icon: UserCheck 
                            },
                            { 
                              title: 'Salary Negotiation', 
                              desc: 'Maximize your compensation potential', 
                              link: 'https://www.levels.fyi/blog/salary-negotiation.html',
                              icon: Zap 
                            }
                          ].map((resource, i) => (
                            <a 
                              key={i} 
                              href={resource.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 hover:bg-white/10 transition-all flex items-start gap-4"
                            >
                              <div className="p-3 bg-cyan-400/10 rounded-xl group-hover:scale-110 transition-transform">
                                <resource.icon className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <h5 className="font-bold text-white mb-1 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                                  {resource.title} <ChevronRight className="w-3 h-3" />
                                </h5>
                                <p className="text-xs text-slate-400 font-medium">{resource.desc}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Advanced Details Matrix */}
                      <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                          <Brain className="w-24 h-24 text-fuchsia-400" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                          <Brain className="w-5 h-5 text-fuchsia-400" /> Advanced Psychological Protocol
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">1. The Halo Effect</h5>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">Establish extreme competence in the first 3 minutes. Interviewers subconsciously bias all subsequent answers based on your initial impression.</p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">2. Tactical Mirroring</h5>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">Subtly match the interviewer's tempo, vocabulary, and posture. This triggers neural resonance and builds instant, unspoken rapport.</p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">3. The Reverse Interview</h5>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">Never leave without asking 2 high-level strategic questions. This shifts power dynamics and frames you as an evaluator, not just a candidate.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'online' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4"><Linkedin className="w-6 h-6 text-blue-500" /> LinkedIn Optimization</h3>
                        <div className="grid gap-4">
                          {(result?.online_presence?.linkedin_tips || []).map((tip, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                              <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black">{i + 1}</div>
                              <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                          <h4 className="text-sm font-black text-slate-500 uppercase mb-6 flex items-center gap-2"><Github className="w-4 h-4" /> Portfolio & GitHub</h4>
                          <p className="text-sm text-slate-400 italic mb-6 leading-relaxed">"{result?.online_presence?.github_critique || 'No critique available'}"</p>
                          <div className="space-y-2">
                            {(result?.online_presence?.portfolio_suggestions || []).map((s, i) => (
                              <div key={i} className="text-xs text-slate-500 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> {s}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
                          <Award className="w-12 h-12 text-cyan-400 mb-4" />
                          <h4 className="text-xl font-bold mb-2">Analysis Verified</h4>
                          <p className="text-xs text-slate-500 max-w-[200px]">This report was generated using Dual-Engine Apex Processing and verified against current market standards.</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4 opacity-40">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" /> APILayer Structural Intelligence
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Cpu className="w-3 h-3 text-fuchsia-400" /> Advanced Platform Sync v2.1
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Audit ID: RM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
