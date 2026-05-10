'use client'
 
import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye,
  Database,
  UserCheck,
  Globe,
  Mail,
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  Zap,
  Activity
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PrivacyPage = () => {
  const router = useRouter()
  
  const sections = [
    {
      id: 'information-collection',
      title: 'Neural Data Collection',
      icon: Database,
      accent: 'text-cyan-400',
      content: `We collect strategic information provided during your interaction with the FutureMatrix ecosystem:
      
      • Identity Parameters (Full name, encrypted email, verified contact)
      • Professional Matrix (Education history, technical skills, career goals)
      • Cognitive Assessment Data (Neural responses and interest mapping)
      • System Interaction Logs (Navigation patterns and module usage)
      • Technical Metadata (Device specifications, browser architecture)
      • Geolocation Signals (Access points, provided only with explicit sync)`
    },
    {
      id: 'information-use',
      title: 'Strategic Data Utilization',
      icon: Zap,
      accent: 'text-secondary',
      content: `Your data is processed to optimize the FutureMatrix intelligence engine:
      
      • Generating high-fidelity career roadmaps and predictions
      • Engineering AI-powered skill gap analyses and educational paths
      • Curating personalized industry opportunities and learning assets
      • Refining neural algorithms for enhanced recommendation accuracy
      • Maintaining system integrity and defending against unauthorized access
      • Validating compliance with global data protection protocols`
    },
    {
      id: 'information-sharing',
      title: 'Non-Disclosure Protocols',
      icon: Globe,
      accent: 'text-warning',
      content: `FutureMatrix maintains a zero-sale policy. Your data is never traded or rented. Sharing occurs only under strict operational directives:
      
      • Explicit User Authorization for external sync
      • Verified Service Providers under strict NDA
      • Legal Mandatory Disclosure via judicial warrant
      • Aggregated, Anonymized Signals for global industry research
      • Corporate Restructuring events (maintaining existing privacy standards)`
    },
    {
      id: 'data-security',
      title: 'Encryption & Defense',
      icon: Lock,
      accent: 'text-purple-400',
      content: `We implement military-grade security infrastructure:
      
      • AES-256 End-to-End Encryption for all data at rest
      • TLS 1.3 Secure Channels for real-time transmission
      • Multi-Factor Neural Authentication options
      • Real-time Vulnerability Monitoring and threat detection
      • Continuous Security Audits and SOC 2 Type II compliance
      • Automated Incident Response and breach neutralization protocols`
    }
  ]

  const rights = [
    {
      title: 'Full Access',
      desc: 'Request complete export of your neural profile',
      icon: FileText
    },
    {
      title: 'Erasure',
      desc: 'Permanently delete your data from all nodes',
      icon: AlertCircle
    },
    {
      title: 'Calibration',
      desc: 'Correct or update any strategic profile data',
      icon: Activity
    },
    {
      title: 'Sync Control',
      desc: 'Manage external data sharing permissions',
      icon: Fingerprint
    }
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* High-Tech Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-300 shadow-2xl"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/20 group-hover:bg-secondary transition-colors">
            <svg className="h-4 w-4 text-secondary group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Nexus</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-10"
            >
              <div className="flex items-center space-x-3 px-8 py-4 glass-card rounded-full border border-secondary/30 bg-secondary/5">
                <Shield className="h-6 w-6 text-secondary" />
                <span className="text-secondary font-black tracking-widest uppercase text-xs">Security Protocol 4.0</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-none"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 font-medium"
            >
              At FutureMatrix, your data is handled with absolute strategic integrity. 
              This policy outlines our neural encryption standards and non-disclosure protocols.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              <div className="flex items-center space-x-3 px-6 py-2 border border-white/5 rounded-full bg-white/5">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Last Updated: May 2024</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-2 border border-white/5 rounded-full bg-white/5">
                <Shield className="h-4 w-4 text-warning" />
                <span>Encryption: AES-256</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Sections Grid */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {sections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-12 rounded-[4rem] border border-white/5 hover:border-secondary/30 transition-all duration-500 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-secondary/30 transition-all">
                        <IconComponent className={`h-8 w-8 ${section.accent}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Module {index + 1}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{section.title}</h2>
                    <div className="text-slate-300 text-lg leading-relaxed font-medium whitespace-pre-line space-y-4">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Rights Summary */}
      <section className="relative z-10 py-32 bg-white/[0.02] border-y border-white/5 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black text-white mb-8 uppercase tracking-tighter">Your <span className="text-secondary">Directives</span></h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium">You maintain total sovereignty over your neural profile data.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rights.map((right, index) => {
              const Icon = right.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-10 rounded-[3rem] border border-white/10 hover:border-warning/30 text-center transition-all"
                >
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Icon className="h-8 w-8 text-warning" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">{right.title}</h3>
                  <p className="text-slate-500 text-xs font-bold leading-relaxed">{right.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[5rem] border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent z-0" />
            <div className="relative z-10">
              <Mail className="h-20 w-20 text-secondary mx-auto mb-10" />
              <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Strategic Inquiries</h2>
              <p className="text-2xl text-slate-300 mb-12 font-medium">
                Direct all privacy recalibration requests or security signals to our core intelligence node.
              </p>
              <motion.a
                href="mailto:futurematrixofficiallll@gmail.com?subject=Privacy Strategic Inquiry"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-4 px-12 py-6 bg-gradient-to-r from-secondary to-warning rounded-[2rem] text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-secondary/20 relative z-20 cursor-pointer"
              >
                <span>Contact Privacy Node</span>
                <ChevronRight className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 py-10 text-center border-t border-white/5">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} FutureMatrix Intelligence Systems. All Rights Reserved.
        </p>
      </footer>
    </main>
  )
}

export default PrivacyPage