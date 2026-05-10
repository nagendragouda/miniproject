'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, ChevronDown, Sparkles, MapPin, BookOpen, Zap, Target, Map, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

const PROJECT_IMAGE_URL = 'https://pdgsxesdxgtpyhohrmwi.supabase.co/storage/v1/object/public/project_img/Screenshot%202026-04-22%20214448.png'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false)
  const [isMobileFeatureDropdownOpen, setIsMobileFeatureDropdownOpen] = useState(false)
  const { user, isAdmin, emailVerified, signOut, loading } = useFirebaseAuth()
  const router = useRouter()
  const featureDropdownRef = useRef<HTMLDivElement>(null)
  const [profileName, setProfileName] = useState<string | null>(null)

  // Fetch profile name from Supabase
  useEffect(() => {
    if (isAdmin) {
      setProfileName('Administrator')
      return
    }

    if (!user) { 
      setProfileName(null)
      return 
    }
    
    if (!supabase) {
      setProfileName(user.displayName || user.email?.split('@')[0] || 'My Account')
      return
    }

    supabase
      .from('profiles')
      .select('full_name')
      .eq('firebase_uid', user.uid)
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setProfileName(user.displayName || user.email?.split('@')[0] || 'My Account')
        } else {
          setProfileName(data[0]?.full_name || user.displayName || user.email?.split('@')[0] || 'My Account')
        }
      })
      .catch(() => {
        setProfileName(user.displayName || user.email?.split('@')[0] || 'My Account')
      })
  }, [user, isAdmin])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enforce email verification
  useEffect(() => {
    if (!loading && user && !emailVerified) {
      const pathname = window.location.pathname
      // Allow access to auth pages, otherwise redirect to verify-email
      if (!pathname.startsWith('/auth/')) {
        router.push('/auth/verify-email')
      }
    }
  }, [user, loading, emailVerified, router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featureDropdownRef.current && !featureDropdownRef.current.contains(event.target as Node)) {
        setIsFeatureDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
    setIsFeatureDropdownOpen(false)
    setIsMobileFeatureDropdownOpen(false)
  }

  const handleProtectedRoute = (href: string) => {
    if (!user) {
      toast.error('Sign In or Sign Up to access this feature', {
        style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' },
        icon: '🔒'
      })
      router.push(`/auth/signup?next=${encodeURIComponent(href)}`)
      return
    }
    router.push(href)
    setIsMobileMenuOpen(false)
    setIsFeatureDropdownOpen(false)
    setIsMobileFeatureDropdownOpen(false)
  }

  const features = useMemo(() => [
    { 
      name: 'College Finder', 
      href: '/colleges', 
      icon: MapPin, 
      description: 'Find nearby government colleges',
      requiresAuth: true
    },
    { 
      name: 'Resume Analyzer', 
      href: '/resume-analyzer', 
      icon: Zap, 
      description: 'AI-powered resume optimization',
      requiresAuth: true
    },
    { 
      name: 'Career Prediction', 
      href: '/career-prediction', 
      icon: Target, 
      description: 'AI-powered career matching',
      requiresAuth: true
    },
    { 
      name: 'Career Roadmap', 
      href: '/career-roadmap', 
      icon: Map, 
      description: 'Interactive roadmap based on your profile',
      requiresAuth: true
    },
    { 
      name: 'Learning Resources', 
      href: '/learning-resources', 
      icon: BookOpen, 
      description: 'Educational materials & guides',
      requiresAuth: true
    },
    { 
      name: 'Job Hunting', 
      href: '/job-hunting', 
      icon: Briefcase, 
      description: 'AI-powered job searching',
      requiresAuth: true
    }
  ], [])

  const navItems = useMemo(() => {
    const items = [
      { name: 'Home', href: '/' }
    ]
    if (user) {
      items.push({ name: 'Dashboard', href: '/dashboard' })
    }
    return items
  }, [user])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_60px_rgba(0,0,0,0.35)]'
          : 'bg-slate-950/55 backdrop-blur-2xl border-b border-white/10'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 18, 0], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -16, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full justify-between">
          {/* Brand - Left Side */}
          <Link href="/" className="flex items-center space-x-3 group mr-8">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex-shrink-0 shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Image
                src={PROJECT_IMAGE_URL}
                alt="FutureMatrix project logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-white font-black text-xl tracking-tighter group-hover:text-cyan-400 transition-colors duration-300">
              <span className="text-cyan-400 group-hover:text-white transition-colors duration-300">Future</span>Matrix
            </span>
          </Link>

          {/* Desktop Navigation & Profile - Right Side */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <div className="flex items-center space-x-8 mr-6">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-slate-300 hover:text-cyan-300 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-slate-300 hover:text-cyan-300 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Features Dropdown */}
              <div className="relative" ref={featureDropdownRef}>
                <button
                  onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
                  className="text-slate-300 hover:text-cyan-300 transition-colors duration-200 font-medium flex items-center space-x-1 whitespace-nowrap"
                >
                  <span>Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeatureDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isFeatureDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl z-50"
                    >
                      <div className="relative p-2">
                        {features.map((feature) => {
                          const IconComponent = feature.icon
                          return (
                            <button
                              key={feature.name}
                              onClick={() => handleProtectedRoute(feature.href)}
                              className="w-full block p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-cyan-400/30">
                                  <IconComponent className="w-4 h-4 text-cyan-300" />
                                </div>
                                <div>
                                  <div className="font-medium text-white group-hover:text-cyan-300">{feature.name}</div>
                                  <div className="text-sm text-slate-400">{feature.description}</div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 mx-2" />

            {!loading && (user || isAdmin) ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl border border-white/15 backdrop-blur-sm transition-all font-semibold">
                  <div className={`w-7 h-7 rounded-full ${isAdmin ? 'bg-gradient-to-tr from-amber-400 to-orange-500' : 'bg-gradient-to-tr from-cyan-400 to-fuchsia-500'} flex items-center justify-center text-white text-xs font-bold`}>
                    {(profileName || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[140px] truncate text-sm">{profileName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 text-sm border-b border-white/10">
                      <p className="font-bold text-white">{profileName}</p>
                      <p className="text-slate-400 text-xs truncate">{isAdmin ? 'System Administrator' : user?.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link href="/admin" className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                        <Settings className="w-4 h-4 mr-2 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                        <User className="w-4 h-4 mr-2 text-cyan-400" />
                        My Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border-t border-white/10 mt-1">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : !loading && !user && !isAdmin ? (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-slate-300 hover:text-white transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-xl text-white font-semibold hover:shadow-lg transition-all">Sign Up</Link>
              </div>
            ) : (
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 rounded-b-2xl border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl px-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium text-left"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Mobile Features Dropdown */}
            <div className="border-t border-slate-300 pt-4">
              <button
                onClick={() => setIsMobileFeatureDropdownOpen(!isMobileFeatureDropdownOpen)}
                className="w-full flex items-center justify-between text-slate-300 hover:text-cyan-300 transition-colors font-medium text-left"
                aria-haspopup="true"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileFeatureDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isMobileFeatureDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                      className="mt-3 space-y-2 pl-4 border-l border-white/10"
                    role="menu"
                    aria-label="Mobile features menu"
                  >
                    {features.map((feature) => {
                      const IconComponent = feature.icon
                      return (
                        <div key={feature.name}>
                          <button
                            onClick={() => handleProtectedRoute(feature.href)}
                            className="w-full p-2 rounded-xl hover:bg-white/5 transition-colors group text-left flex items-center space-x-3"
                          >
                            <IconComponent className="w-4 h-4 text-cyan-300" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{feature.name}</div>
                              {!user && <div className="text-[8px] font-black uppercase tracking-widest text-red-400">Lock: Sign in required</div>}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="border-t border-slate-300 pt-4">
              {!loading && user ? (
                <div className="space-y-2">
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
                    <p className="font-bold text-white">👤 {user.displayName || 'Admin'}</p>
                    <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center px-4 py-2 text-slate-300 hover:bg-white/5 rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    👤 Profile
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-300 font-semibold hover:bg-red-500/10 rounded-xl border border-red-400/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    🚪 Sign Out
                  </button>
                </div>
              ) : !loading && !user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/auth/signin"
                    className="text-center px-4 py-2 text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-4 py-2 rounded-xl text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="w-8 h-8 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
