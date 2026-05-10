'use client'

import React from 'react'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import Link from 'next/link'
import { 
  Target, 
  Users, 
  Heart,
  Award,
  Lightbulb,
  Globe,
  TrendingUp,
  Star,
  Code,
  Brain,
  Compass,
  Shield,
  Zap,
  BookOpen,
  Coffee,
  Mail,
  Rocket,
  Palette,
  Activity,
  Cpu,
  Layers
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Student-Centric',
      description: 'Every feature we build puts students first. Your success is our primary goal and driving force.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and technology to provide personalized, data-driven career guidance.'
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'Your personal information and career data are protected with enterprise-grade security measures.'
    }
  ]

  const techStack = [
    { name: 'Next.js 14', icon: Rocket, description: 'High-performance React framework for server-side rendering and static generation.' },
    { name: 'Three.js / WebGL', icon: Compass, description: 'Powering our immersive 3D career visualizations and interactive career trees.' },
    { name: 'Multi-Model AI', icon: Brain, description: 'Integrating Gemini, Llama 3, and Cohere for precise career analysis and roadmap generation.' },
    { name: 'Framer Motion', icon: Zap, description: 'Fluid, hardware-accelerated animations for a premium user experience.' }
  ]

  const team = [
    {
      name: 'Nagendra',
      role: 'Founder & Lead Architect',
      description: 'A visionary full-stack developer and AI strategist building the future of career intelligence. Expert in Next.js, Three.js, and neural network integrations.',
      image: '/teams/suraj.jpg',
      social: {
        email: 'nagendra@gmail.com'
      },
      skills: ['Next.js', 'Three.js', 'AI Engineering', 'Product Design']
    }
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-50">
        <BackButton />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center space-x-3 px-6 py-3 glass-card rounded-full border border-secondary/30">
                <Activity className="h-5 w-5 text-secondary animate-pulse" />
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">The Future of Guidance</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-9xl font-black mb-8 tracking-tighter"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                FutureMatrix
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Building the world's most advanced neural career intelligence platform. 
              We bridge the gap between academic potential and industry reality.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-transparent blur-2xl group-hover:from-secondary/30 transition-all" />
              <div className="relative glass-card p-12 rounded-[3rem] border border-secondary/20">
                <Cpu className="h-16 w-16 text-secondary mb-8" />
                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Our Mission</h2>
                <p className="text-slate-200 text-xl leading-relaxed mb-6 font-medium">
                  To democratize elite career guidance through industrial-grade AI.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed">
                  We leverage deep neural networks to provide every student with a personalized roadmap 
                  to success, regardless of their starting point.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-warning/20 to-transparent blur-2xl group-hover:from-warning/30 transition-all" />
              <div className="relative glass-card p-12 rounded-[3rem] border border-warning/20">
                <Layers className="h-16 w-16 text-warning mb-8" />
                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Our Vision</h2>
                <p className="text-slate-200 text-xl leading-relaxed mb-6 font-medium">
                  To be the global neural backbone of professional evolution.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed">
                  We envision a world where career uncertainty is eliminated by data, 
                  allowing human passion to find its perfect professional expression.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 py-32 bg-[#050a18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Powered By Innovation</h2>
            <div className="h-2 w-24 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-secondary/40 transition-all group"
                >
                  <IconComponent className="h-10 w-10 text-secondary mb-8 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-4">{tech.name}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{tech.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* The Architect */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="glass-card p-16 rounded-[4rem] border border-secondary/30 max-w-4xl w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-warning to-secondary" />
                
                <div className="w-48 h-48 bg-gradient-to-br from-secondary to-warning rounded-full mx-auto mb-10 flex items-center justify-center p-1 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                  <div className="w-full h-full bg-[#030712] rounded-full overflow-hidden flex items-center justify-center">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <Code size={80} className="text-secondary" />
                    )}
                  </div>
                </div>

                <h3 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">{member.name}</h3>
                <div className="text-secondary font-black tracking-[0.3em] uppercase text-sm mb-10">{member.role}</div>
                <p className="text-slate-200 text-2xl mb-12 leading-relaxed font-semibold italic">
                  "{member.description}"
                </p>

                <div className="flex flex-wrap gap-3 justify-center mb-12">
                  {member.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center">
                  {[
                    { icon: Mail, href: `mailto:${member.social.email}`, color: 'text-secondary' }
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="p-3.5 glass-card rounded-xl border border-white/10 hover:border-secondary/40 transition-all flex items-center justify-center shadow-lg shadow-black/20"
                    >
                      <s.icon size={20} className={s.color} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card p-20 rounded-[5rem] border border-secondary/30 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-warning/10 -z-10" />
            <Rocket className="h-16 w-16 text-warning mx-auto mb-10" />
            <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">Ready to Evolve?</h2>
            <p className="text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
              Join the new era of career guidance. Your future self will thank you.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link
                href="/"
                className="px-16 py-6 bg-gradient-to-r from-secondary to-warning rounded-[2rem] text-black font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-secondary/30"
              >
                INITIALIZE NOW
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
