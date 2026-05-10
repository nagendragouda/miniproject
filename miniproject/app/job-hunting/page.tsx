'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle, AlertCircle, Briefcase, Sparkles, X, Loader2, ArrowRight, MapPin, Building, IndianRupee, ExternalLink } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function JobHuntingPage() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()
  const [profileName, setProfileName] = useState<string | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [extractedTitle, setExtractedTitle] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?next=/job-hunting')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('firebase_uid', user.uid)
        
        if (data && data.length > 0 && data[0].full_name) {
          setProfileName(data[0].full_name)
        } else {
          setProfileName(user.displayName || user.email?.split('@')[0] || 'User')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfileName(user.displayName || user.email?.split('@')[0] || 'User')
      }
    }
    fetchProfile()
  }, [user])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      if (selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
        setFile(selectedFile)
        setJobs([]) // Reset previous jobs
        setExtractedTitle(null)
        toast.success('Resume attached successfully!')
      } else {
        toast.error('File size exceeds 5MB limit.')
      }
    } else {
      toast.error('Please upload a valid PDF file.')
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setJobs([])
    setExtractedTitle(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSearchJobs = async () => {
    if (!file) {
      toast.error('Please upload your resume first.')
      return
    }
    
    setIsUploading(true)
    const loadingToast = toast.loading('Analyzing resume with AI and finding jobs...', { id: 'job-search' })
    
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/job-hunting/search', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to search jobs')
      }

      setJobs(data.jobs || [])
      setExtractedTitle(data.extractedTitle)

      if (data.jobs && data.jobs.length > 0) {
        toast.success(`Found ${data.jobs.length} matching roles for ${data.extractedTitle}!`, { id: loadingToast })
      } else {
        toast.success('Analysis complete, but no direct matching jobs found in our database.', { id: loadingToast })
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'An error occurred during job search.', { id: loadingToast })
    } finally {
      setIsUploading(false)
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="relative isolate w-full min-h-screen overflow-hidden bg-[#030712] text-white pt-24 pb-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
        
        <div className="pointer-events-none absolute left-6 top-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-36 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-6">
                <Briefcase className="w-4 h-4" />
                AI Job Hunter
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                Welcome, <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">{profileName || 'Seeker'}</span>!
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                Upload your resume and let our AI match your unique skills with the perfect job roles instantly via the Adzuna Jobs API.
              </p>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {jobs.length === 0 ? (
              <motion.div 
                key="upload-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 p-4 rounded-3xl bg-slate-900/50 border border-white/5">
                      <Sparkles className="w-8 h-8 text-cyan-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
                    <p className="text-slate-400 text-sm mb-8 text-center max-w-md">
                      We'll extract your skills, experience, and education to match you with top-tier job opportunities.
                    </p>

                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`w-full relative group transition-all duration-300 rounded-[2rem] border-2 border-dashed ${
                        isDragging 
                          ? 'border-cyan-400 bg-cyan-400/5' 
                          : file 
                            ? 'border-fuchsia-500/30 bg-fuchsia-500/5' 
                            : 'border-white/10 bg-black/20 hover:border-cyan-500/30 hover:bg-white/5'
                      } p-10 flex flex-col items-center justify-center cursor-pointer`}
                      onClick={() => !file && fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                      />

                      <AnimatePresence mode="wait">
                        {!file ? (
                          <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all">
                              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <p className="text-white font-bold text-lg mb-1">Click or drag and drop</p>
                            <p className="text-slate-500 text-xs font-medium tracking-wide">PDF ONLY (MAX. 5MB)</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="file-info"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center w-full"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-4">
                              <FileText className="w-8 h-8 text-fuchsia-400" />
                            </div>
                            <p className="text-white font-bold text-lg mb-1 line-clamp-1 break-all px-4 text-center">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1 rounded-full mt-2">
                              <CheckCircle className="w-4 h-4" />
                              Ready for Analysis
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                              }}
                              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-slate-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={handleSearchJobs}
                      disabled={!file || isUploading}
                      className={`mt-8 w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        file && !isUploading
                          ? 'bg-white text-slate-950 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                          : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          ANALYZING & HUNTING...
                        </>
                      ) : (
                        <>
                          FIND MATCHING JOBS
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="jobs-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                  <div>
                    <h2 className="text-2xl font-black text-white">AI Identified Role: <span className="text-cyan-400">{extractedTitle}</span></h2>
                    <p className="text-slate-400 text-sm mt-1">Based on your resume, we searched for the best matching opportunities.</p>
                  </div>
                  <button 
                    onClick={() => { setJobs([]); setFile(null); }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold text-sm transition-colors"
                  >
                    Upload Another Resume
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job, idx) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={job.id}
                      className="bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded-3xl p-6 transition-all group hover:bg-white/10 flex flex-col h-full"
                    >
                      <div className="mb-4">
                        <div className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest">{job.category?.label || 'Technology'}</div>
                        <h3 className="text-xl font-black text-white leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: job.title }}></h3>
                      </div>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                          <Building className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">{job.company?.display_name || 'Confidential Company'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span className="truncate">{job.location?.display_name || 'Remote / Unknown'}</span>
                        </div>
                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold bg-emerald-400/10 w-fit px-3 py-1 rounded-lg">
                            <IndianRupee className="w-4 h-4" />
                            {job.salary_min ? `₹${Math.round(job.salary_min).toLocaleString()}` : ''} 
                            {job.salary_min && job.salary_max ? ' - ' : ''} 
                            {job.salary_max ? `₹${Math.round(job.salary_max).toLocaleString()}` : ''}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-auto">
                        <p className="text-xs text-slate-500 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: job.description }}></p>
                        <a 
                          href={job.redirect_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
