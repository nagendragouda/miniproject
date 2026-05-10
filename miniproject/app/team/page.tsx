'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Users,
  Code,
  Palette,
  Shield,
  Target,
  Mail,
  Crown,
  Rocket,
  Activity,
  Star
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'
import BackButton from '@/components/BackButton'
import { useRouter } from 'next/navigation'

const TeamPage = () => {
  const router = useRouter()
  const allTeamMembers = [
    {
      name: 'Nagendra',
      role: 'Founder & Lead Architect',
      bio: 'Architecting the FutureMatrix ecosystem through neural innovation and strategic engineering. Expert in full-stack architecture and AI systems integration.',
      skills: ['Leadership', 'Full-Stack', 'Neural Systems', 'Strategy'],
      profileImage: '/teams/suraj.jpg',
      icon: Code,
      color: 'from-secondary to-cyan-400',
      glow: 'shadow-secondary/20',
      isLeader: true,
      email: 'nagendra@gmail.com'
    },
    {
      name: 'Naman',
      role: 'QA & Optimization Lead',
      bio: 'Master of system resilience and industrial-grade optimization. Ensures that every neural node within the platform operates at peak performance.',
      skills: ['QA Engineering', 'Optimization', 'Security', 'Resilience'],
      profileImage: '/teams/nagendra.jpg',
      icon: Shield,
      color: 'from-warning to-orange-400',
      glow: 'shadow-warning/20',
      isLeader: false,
      email: 'namanshetty@gmail.com'
    },
    {
      name: 'Suraj',
      role: 'Project Evolution Coordinator',
      bio: 'Orchestrating complex project lifecycles and team dynamics. Specializes in strategic scaling and cross-functional synchronization.',
      skills: ['Coordination', 'Project Sync', 'Operations', 'Scaling'],
      profileImage: '/teams/naman.jpg',
      icon: Target,
      color: 'from-purple-500 to-fuchsia-500',
      glow: 'shadow-purple-500/20',
      isLeader: false,
      email: 'surajsalian@gmail.com'
    }
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white selection:bg-secondary/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.15),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.05),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:128px_128px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      <FloatingShapes />

      {/* Return Navigation */}
      <div className="fixed top-8 left-8 z-50">
        <motion.button
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="group flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-secondary/50 transition-all duration-300"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-secondary group-hover:border-secondary transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:text-black" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Nexus</span>
        </motion.button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
        {/* Elite Header */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-10"
          >
            <Users className="w-3 h-3" /> Technical Intelligence Guild
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-10"
          >
            <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
              Elite Architects
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            A collective of specialists dedicated to synchronizing human potential with neural systems.
          </motion.p>
        </div>

        {/* Member Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTeamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 blur-[80px] transition-opacity duration-700`} />

              <div className="relative glass-card p-10 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col items-center text-center h-full">
                {/* Profile Frame */}
                <div className="relative mb-10">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                  <div className={`relative w-40 h-40 rounded-full p-1.5 bg-gradient-to-br ${member.color} shadow-2xl transition-transform duration-700 group-hover:scale-105`}>
                    <div className="w-full h-full rounded-full bg-[#030712] overflow-hidden border-4 border-[#030712]">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          width={200}
                          height={200}
                          priority
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <member.icon className="w-16 h-16 text-white/20" />
                        </div>
                      )}
                    </div>
                  </div>
                  {member.isLeader && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-warning flex items-center justify-center shadow-lg border border-black/20">
                      <Crown className="w-5 h-5 text-black" />
                    </div>
                  )}
                </div>

                <h3 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase">
                  {member.name}
                </h3>
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                  {member.role}
                </p>

                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 italic px-4">
                  "{member.bio}"
                </p>

                {/* Skills Container */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-1 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:border-white/10 group-hover:text-slate-300 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className="mt-auto pt-8 border-t border-white/5 w-full">
                  <motion.a
                    whileHover={{ y: -2 }}
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all w-full justify-center"
                  >
                    <Mail className="w-4 h-4" /> Secure Communication
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
  </svg>
)

export default TeamPage
