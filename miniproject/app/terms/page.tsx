'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Scale, 
  AlertTriangle,
  UserCheck,
  Shield,
  Gavel,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Target,
  Zap,
  Globe
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const TermsPage = () => {
  const router = useRouter()
  
  const sections = [
    {
      id: 'acceptance',
      title: 'Neural Acceptance',
      icon: CheckCircle,
      accent: 'text-cyan-400',
      content: `By accessing the FutureMatrix platform, you enter into a binding strategic agreement.
 
• These terms govern all neural syncs and data interactions
• Immediate termination of access is required if you dissent
• FutureMatrix reserves the right to calibrate these terms at any time
• Continuous interaction constitutes full strategic acceptance`
    },
    {
      id: 'description',
      title: 'Platform Directive',
      icon: Target,
      accent: 'text-secondary',
      content: `FutureMatrix provides high-fidelity career intelligence through:
 
• Proprietary AI Neural Assessments and career matching
• Strategic Roadmap generation and skill gap analysis
• Dynamic Industry sync and professional resource mapping
• Real-time progress tracking and career evolution metrics
 
The service is provided as-is, optimized for maximum predictive accuracy.`
    },
    {
      id: 'user-accounts',
      title: 'Identity Authentication',
      icon: UserCheck,
      accent: 'text-warning',
      content: `Accessing advanced modules requires verified identity parameters:
 
• You must maintain absolute integrity of your credentials
• Unauthorized access signals must be reported immediately
• Minimum age for neural sync is 13 standard years
• You are solely responsible for all actions within your Node`
    },
    {
      id: 'acceptable-use',
      title: 'Operational Integrity',
      icon: Shield,
      accent: 'text-purple-400',
      content: `Users must maintain system stability and respect ecosystem boundaries:
 
• No injection of malicious code or system interference
• No unauthorized scraping of proprietary intelligence
• No impersonation of other intelligence nodes
• No circumventing of security barriers or encryption protocols`
    }
  ]

  const quickStats = [
    { label: 'System Uptime', value: '99.9%', icon: Zap },
    { label: 'Security Level', value: 'Military', icon: Shield },
    { label: 'Data Sovereignty', value: 'Total', icon: Globe },
    { label: 'Legal Version', value: 'v4.2', icon: FileText }
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
                <Scale className="h-6 w-6 text-secondary" />
                <span className="text-secondary font-black tracking-widest uppercase text-xs">Legal Directive v4.2</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-none"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                Terms of Service
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 font-medium"
            >
              These regulations define the strategic boundaries and operational 
              integrity standards of the FutureMatrix intelligence platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Last Updated: May 2024</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-warning" />
                <span>Status: Fully Operational</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 text-slate-600 mx-auto mb-4" />
                <div className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Modules */}
      <section className="relative z-10 py-32">
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Article {index + 1}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{section.title}</h2>
                    <div className="text-slate-300 text-lg leading-relaxed font-medium whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Important Legal Disclaimer */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[5rem] border-2 border-warning/20 bg-warning/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.05),_transparent)]" />
            <div className="relative z-10 text-center">
              <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-8" />
              <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter">Strategic Disclaimer</h2>
              <div className="text-slate-300 text-xl leading-relaxed font-medium space-y-6">
                <p>
                  FutureMatrix provides career intelligence for strategic guidance only. We do not guarantee specific professional outcomes or placements. 
                  All career evolutions are subject to individual performance and external market volatility.
                </p>
                <p className="text-sm font-black uppercase tracking-widest text-warning/70">
                  Continued platform sync indicates total acceptance of these parameters.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Node Contact */}
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
              <Gavel className="h-20 w-20 text-secondary mx-auto mb-10" />
              <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Legal Inquiries</h2>
              <p className="text-2xl text-slate-300 mb-12 font-medium">
                For any clarification regarding these directives, initiate a transmission to our legal node.
              </p>
              <motion.a
                href="mailto:futurematrixofficiallll@gmail.com?subject=Legal Directive Inquiry"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-4 px-12 py-6 bg-gradient-to-r from-secondary to-warning rounded-[2rem] text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-secondary/20 relative z-20 cursor-pointer"
              >
                <span>Contact Legal Node</span>
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

export default TermsPage