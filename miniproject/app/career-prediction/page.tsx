'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Loader2, Sparkles, ArrowRight, BrainCircuit,
  Rocket, User, Mail, Phone, GraduationCap, Award, Heart,
  Briefcase, Linkedin, Github, Globe, MapPin, BookOpen
} from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { supabase } from '@/lib/supabase-client'
import UserProfileForm from '@/components/UserProfileForm'
import CareerQuiz from '@/components/CareerQuiz'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import { AnimatePresence } from 'framer-motion'

export default function CareerPredictionPage() {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [isInitialCheck, setIsInitialCheck] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)
  const [predictionReady, setPredictionReady] = useState(false)

  const checkProfileCompletion = useCallback(async () => {
    if (!user) return
    setIsChecking(true)
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized')
        setProfileComplete(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', user.uid)

      if (error) {
        console.warn('Profile fetch error:', error.message)
        setProfileComplete(false)
        return
      }

      if (data && data.length > 0) {
        const profileData = data[0]
        setProfileData(profileData)
        // Mandatory: name, basic info, education, skills, interests
        // Experience and social links are OPTIONAL — do not block
        const hasName = !!profileData.full_name?.trim()
        const hasBasic = !!(profileData.gender && profileData.country && profileData.state && profileData.phone)
        const hasEdu = !!(profileData.education_level && profileData.course_stream && profileData.institution_name && profileData.academic_score)
        const hasSkills = !!(profileData.skills && profileData.skills.length > 0)
        const hasInterests = !!(profileData.interests && profileData.interests.length > 0)

        if (hasName && hasBasic && hasEdu && hasSkills && hasInterests) {
          setProfileComplete(true)
        } else {
          setProfileComplete(false)
        }
      } else {
        setProfileComplete(false)
      }
    } catch (err) {
      console.error(err)
      setProfileComplete(false)
    } finally {
      setIsChecking(false)
      setIsInitialCheck(false)
    }
  }, [user])

  useEffect(() => {
    if (!loading && user) {
      checkProfileCompletion()
    } else if (!loading && !user) {
      router.push('/auth/signup?next=/career-prediction')
    }
  }, [user, loading, checkProfileCompletion])


  if (loading || (isChecking && isInitialCheck)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <p className="text-cyan-400 font-medium animate-pulse">Loading AI Prediction Core...</p>
      </div>
    )
  }

  if (!user) return null

  // ── helper chips ────────────────────────────────────────────────────────────
  const Chip = ({ label, color }: { label: string; color: string }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}>{label}</span>
  )

  const InfoCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5 shadow-inner flex gap-3 items-start">
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
      <div className="min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${color}`}>{label}</p>
        <p className="font-semibold text-white text-sm truncate">{value || <span className="text-slate-500 font-normal">Not provided</span>}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative z-10">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-6 flex justify-start">
            <BackButton />
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles size={14} /> AI-Powered Career Matching
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Future Career</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Our advanced AI analyzes your full profile — education, skills, interests, and experience — to predict the most high-growth career paths for you.
            </p>
          </motion.div>


          {/* ── Conditional: Form OR Profile Card + Prediction Engine ────────── */}
          {!profileComplete ? (
            /* ── INCOMPLETE: show only the form ─────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Warning Banner */}
              <div className="bg-amber-500/10 border-b border-amber-500/20 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-amber-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-lg">Complete Your Profile to Continue</h3>
                  <p className="text-amber-200/70 text-sm mt-1">
                    Fill in all <span className="text-amber-300 font-semibold">mandatory sections</span> — Name, Basic Info, Education, <span className="text-amber-300 font-semibold">Skills</span>, and <span className="text-amber-300 font-semibold">Interests</span> — then save each step to unlock AI Career Prediction.
                  </p>
                </div>
              </div>

              {/* Embedded Form */}
              <div className="bg-slate-50 relative pb-10 rounded-b-3xl">
                <UserProfileForm onSaved={checkProfileCompletion} />
              </div>
            </motion.div>
          ) : (
            /* ── COMPLETE: show profile card + prediction engine ─────────────── */
            <>
              {/* Profile Summary Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl mb-8 shadow-[0_0_50px_rgba(99,102,241,0.1)] overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 pt-7 pb-5 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Your Profile Information</h2>
                  <button
                    onClick={() => router.push('/profile')}
                    className="mt-3 sm:mt-0 text-sm font-semibold text-cyan-400 border border-cyan-400/30 px-4 py-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard icon={User} label="Full Name" value={profileData?.full_name} color="text-amber-400" />
                  <InfoCard icon={Mail} label="Email" value={user?.email} color="text-indigo-400" />
                  <InfoCard icon={Phone} label="Phone" value={profileData?.phone} color="text-emerald-400" />
                  <InfoCard icon={User} label="Gender" value={profileData?.gender} color="text-pink-400" />
                  <InfoCard icon={MapPin} label="Location" value={profileData?.state && profileData?.country ? `${profileData.state}, ${profileData.country}` : null} color="text-orange-400" />
                  <InfoCard
                    icon={GraduationCap}
                    label="Education"
                    value={profileData?.education_level && profileData?.course_stream
                      ? `${profileData.education_level} · ${profileData.course_stream}`
                      : profileData?.education_level}
                    color="text-teal-400"
                  />
                  <InfoCard icon={BookOpen} label="Institution" value={profileData?.institution_name} color="text-cyan-400" />
                  <InfoCard icon={Award} label="Score / CGPA" value={profileData?.academic_score ? String(profileData.academic_score) : null} color="text-violet-400" />
                  {profileData?.experience_years && (
                    <InfoCard icon={Briefcase} label="Experience" value={`${profileData.experience_years} year(s)`} color="text-yellow-400" />
                  )}
                  {profileData?.linkedin_url && (
                    <InfoCard icon={Linkedin} label="LinkedIn" value={profileData.linkedin_url} color="text-blue-400" />
                  )}
                  {profileData?.github_url && (
                    <InfoCard icon={Github} label="GitHub" value={profileData.github_url} color="text-slate-300" />
                  )}
                  {profileData?.portfolio_url && (
                    <InfoCard icon={Globe} label="Portfolio" value={profileData.portfolio_url} color="text-purple-400" />
                  )}
                </div>

                {/* Skills */}
                <div className="px-8 pb-5">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.skills?.map((s: string, i: number) => (
                      <Chip key={i} label={s} color="bg-indigo-500/15 border-indigo-500/30 text-indigo-300" />
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="px-8 pb-8">
                  <p className="text-xs font-semibold text-fuchsia-400 uppercase tracking-wide mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.interests?.map((interest: string, i: number) => (
                      <Chip key={i} label={interest} color="bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Prediction Engine */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

                {!predictionReady ? (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                      <BrainCircuit className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Profile Complete & Ready</h2>
                    <p className="text-slate-400 max-w-lg mb-8">
                      Your full profile is locked in. Our AI is ready to analyze your unique combination of skills, interests, education, and experience.
                    </p>
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-cyan-50 hover:scale-105 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      Take Career Quiz
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6">
                      <Rocket className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Prediction Generated!</h2>
                    <p className="text-slate-400 max-w-lg mb-8">
                      We've discovered high-growth career paths perfectly suited to your profile.
                    </p>
                    <button
                      onClick={() => router.push('/career-result')}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                    >
                      View Your Results
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}

        </div>
      </main>

      {/* Career Quiz Modal */}
      <AnimatePresence>
        {showQuiz && user && (
          <CareerQuiz
            firebaseUid={user.uid}
            onClose={() => setShowQuiz(false)}
            onComplete={() => {
              setShowQuiz(false)
              router.push('/career-result')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

