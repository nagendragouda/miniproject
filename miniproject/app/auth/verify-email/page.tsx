'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight, RefreshCw, Sparkles, ShieldCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import FloatingShapes from '@/components/FloatingShapes'
import Navbar from '@/components/Navbar'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user, userEmail, emailVerified, checkEmailVerification, resendVerificationEmail } =
    useFirebaseAuth()
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [verificationChecked, setVerificationChecked] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const [error, setError] = useState<string>('')
  const [resendMessage, setResendMessage] = useState<string>('')

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  // Auto-check verification status on mount
  useEffect(() => {
    const checkVerification = async () => {
      if (user && !emailVerified) {
        try {
          setLoading(true)
          const isVerified = await checkEmailVerification()
          setVerificationChecked(true)

          if (isVerified) {
            router.push('/')
          }
        } catch (err: any) {
          setError(err.message || 'Failed to check verification status')
        } finally {
          setLoading(false)
        }
      } else if (emailVerified) {
        router.push('/')
      }
    }

    checkVerification()
  }, [user, emailVerified, checkEmailVerification, router])

  // Auto-check verification every 3 seconds while page is open
  useEffect(() => {
    if (!user || emailVerified) return

    const interval = setInterval(async () => {
      try {
        const isVerified = await checkEmailVerification()
        setCheckCount(prev => prev + 1)

        if (isVerified) {
          router.push('/')
        }
      } catch (err) {
        // Silently fail on auto-check errors
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [user, emailVerified, checkEmailVerification, router])

  const handleManualCheck = async () => {
    if (loading) return

    try {
      setLoading(true)
      setError('')
      const isVerified = await checkEmailVerification()

      if (isVerified) {
        router.push('/')
      } else {
        setError('Email not verified yet. Please check your inbox and verify your email.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check verification status')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (resendLoading) return

    try {
      setResendLoading(true)
      setResendMessage('')
      setError('')

      await resendVerificationEmail()

      setResendMessage('Verification email sent! Check your inbox and spam folder.')
      setTimeout(() => setResendMessage(''), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email')
    } finally {
      setResendLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="relative isolate min-h-screen w-full overflow-hidden bg-[#030712] text-white flex items-center justify-center py-20 px-4">
        {/* Home Page Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
        <FloatingShapes />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div 
                className="flex justify-center mb-8"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-40 animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-600 to-fuchsia-600 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/20">
                    <Mail className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 mb-6 backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4" />
                Account Security Verification
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-white mb-4">
                Verify Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">Email</span>
              </h1>
              <p className="text-slate-400 font-medium">We've sent a secure verification link to your inbox.</p>
            </div>

            {/* Content Card - Glassmorphism */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_100px_rgba(0,0,0,0.5)] p-8 border border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              
              {/* Email Display */}
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center group transition-all hover:bg-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Verification Target</p>
                <p className="text-white font-bold text-lg break-all selection:bg-cyan-500/30">{userEmail}</p>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
                {resendMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{resendMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instructions */}
              <div className="space-y-4 bg-black/40 rounded-2xl p-6 border border-white/5">
                <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Instructions</p>
                <ol className="space-y-3 text-slate-300 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] font-bold text-cyan-400 shrink-0 mt-0.5">1</span>
                    <span>Check your inbox for <span className="text-white font-bold">FutureMatrix</span> email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] font-bold text-cyan-400 shrink-0 mt-0.5">2</span>
                    <span>Click the <span className="text-white font-bold">Verification Link</span> provided</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] font-bold text-cyan-400 shrink-0 mt-0.5">3</span>
                    <span>The page will <span className="text-white font-bold">automatically redirect</span></span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Verified? Continue</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-slate-300 font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-white/10"
                >
                  {resendLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Resend Verification Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Banner */}
              <div className="text-[10px] text-slate-500 text-center bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-2" />
                Automatic sync active (checking every 3s)
              </div>
            </div>

            {/* Switch Account */}
            <div className="text-center mt-10">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                Wrong Email?{' '}
                <Link
                  href="/auth/signup"
                  className="text-cyan-400 hover:text-fuchsia-400 transition-colors font-black ml-2"
                >
                  Change Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

