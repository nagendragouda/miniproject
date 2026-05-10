'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function SignInPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, user, emailVerified, loading: authLoading } = useFirebaseAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  useEffect(() => {
    const adminAuth = localStorage.getItem('fm_admin_authenticated')
    if (adminAuth === 'true') {
      router.replace('/admin')
      return
    }

    // Aggressive prefetch for speed
    router.prefetch('/')
    router.prefetch('/admin')

    if (user && !authLoading) {
      if (!emailVerified) {
        router.replace('/auth/verify-email')
        return
      }
      // FAST REDIRECT: If already logged in, go home immediately
      router.replace('/')
    }
  }, [user, emailVerified, authLoading, router])

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Check if admin credentials first for instant login
    const adminEmailCheck = formData.email.trim().toLowerCase()
    if ((adminEmailCheck === 'admin@gmail.com' || adminEmailCheck === 'admin@gamil.com') && formData.password === 'admin1234') {
      localStorage.setItem('fm_admin_authenticated', 'true')
      localStorage.setItem('fm_admin_email', formData.email)
      localStorage.setItem('fm_admin_login_time', new Date().toISOString())
      router.replace('/admin?tab=dashboard')
      return
    }

    setLoading(true)
    setErrors({})
    
    // Regular Firebase sign-in for non-admin users
    try {
      await signIn(formData.email, formData.password)
      router.replace('/')
    } catch (error: any) {
      // Handle Firebase-specific errors
      if (error.code === 'auth/user-not-found') {
        setErrors({ general: 'No account found with this email. Please sign up.' })
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ general: 'Invalid password. Please try again.' })
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ general: 'Invalid email address.' })
      } else if (error.code === 'auth/user-disabled') {
        setErrors({ general: 'This account has been disabled.' })
      } else if (error.code === 'auth/invalid-credential') {
        setErrors({ general: 'Invalid email or password. Please try again.' })
      } else {
        setErrors({ general: error.message || 'Invalid credentials. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setErrors({})

    try {
      await signInWithGoogle()
      router.replace('/')
    } catch (error: any) {
      setGoogleLoading(false)
      let userMessage = 'Google sign-in failed. Please try again.'

      if (error.code === 'auth/popup-blocked') {
        userMessage = 'Popup was blocked. Please enable popups and try again.'
      } else if (error.message?.includes('popup')) {
        userMessage = 'Popup blocked. Please allow popups for this site.'
      }

      setErrors({ general: userMessage })
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-200">
      {/* Home Page Matching Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-cyan-500 rounded-full blur-[100px] opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-fuchsia-500 rounded-full blur-[100px] opacity-30"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content starts here */}
      <div className="relative z-10 w-full max-w-lg mt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] p-10 sm:p-12 border border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-300 to-fuchsia-300 bg-clip-text text-transparent mb-2 tracking-tight"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 font-medium"
            >
              Continue your AI career journey
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 backdrop-blur-sm"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{errors.general}</p>
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              type="button"
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 border border-slate-200 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]"
            >
              {googleLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="px-3 text-slate-400 text-sm font-semibold">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all font-medium ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/10'
                      : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/5'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all font-medium ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/10'
                      : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 text-slate-400 font-medium"
          >
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 transition font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
