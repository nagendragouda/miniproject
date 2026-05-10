'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import BackButton from '@/components/BackButton'
import { 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  Building,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  CheckCircle,
  Zap,
  Heart,
  Star,
  ArrowLeft,
  Rocket,
  Activity
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'

const ContactPage = () => {
  const { user, userEmail } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || userEmail || prev.email
      }))
    }
  }, [user, userEmail])

  const contactMethods = [
    {
      icon: Mail,
      title: 'Elite Support',
      description: 'Get high-priority assistance with your account, technical issues, or general questions',
      value: 'futurematrixofficiallll@gmail.com',
      action: 'https://mail.google.com/mail/?view=cm&fs=1&to=futurematrixofficiallll@gmail.com',
      responseTime: 'Under 2 hours',
      color: 'text-secondary'
    },
    {
      icon: Phone,
      title: 'Direct Line',
      description: 'Connect with our team for immediate project consultation and high-level support',
      value: '+91 7975239636',
      action: 'tel:+917975239636',
      responseTime: 'Instant',
      color: 'text-warning'
    },
    {
      icon: MapPin,
      title: 'Digital HQ',
      description: 'We operate as a global distributed network with core nodes in India.',
      value: 'Mangalore, Karnataka, India',
      action: 'https://www.google.com/maps/search/?api=1&query=Mangalore,Karnataka,India',
      responseTime: 'Global',
      color: 'text-green-400'
    }
  ]

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Intelligence' },
    { value: 'billing', label: 'Ecosystem Access' },
    { value: 'partnership', label: 'Strategic Alliance' },
    { value: 'career', label: 'Career Evolution' },
    { value: 'feedback', label: 'Intelligence Feedback' }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/nagendra',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      name: 'GitHub',
      url: 'https://github.com/nagendra',
      color: 'text-slate-300'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com/nagendra',
      color: 'text-cyan-400'
    }
  ]

  const stats = [
    { value: '24/7', label: 'Active Intelligence', icon: Clock },
    { value: '<2hrs', label: 'Quantum Response', icon: Zap },
    { value: '98%', label: 'Sync Success', icon: Heart },
    { value: '4.9★', label: 'User Rating', icon: Star }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct mailto link
    const subject = encodeURIComponent(`[${formData.category.toUpperCase()}] ${formData.subject}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Company: ${formData.company || 'N/A'}\n\n` +
      `Message:\n${formData.message}`
    )
    
    const mailtoLink = `mailto:futurematrixofficialll@gmail.com?subject=${subject}&body=${body}`
    
    // Trigger the email client
    window.location.href = mailtoLink
    
    setIsSubmitted(true)
    
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        category: 'general'
      })
    }, 3000)
  }

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
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center space-x-3 px-6 py-3 glass-card rounded-full border border-secondary/30">
                <MessageCircle className="h-6 w-6 text-secondary" />
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">Direct Link</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black mb-8 tracking-tighter"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                Sync With Us
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Have questions about your strategic career path? Need elite technical assistance? 
              Our team is ready to accelerate your journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 bg-white/5 border-y border-white/10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <IconComponent className="h-10 w-10 text-secondary mx-auto mb-4" />
                  <div className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              Communication <span className="text-secondary">Nodes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-[1.5rem] text-center hover:scale-[1.02] transition-all duration-500 group border border-white/5 hover:border-secondary/50 relative overflow-hidden flex flex-col h-[340px] bg-white/[0.02]"
                >
                  <div className="flex-grow">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5 group-hover:border-secondary/30`}>
                      <IconComponent className={`h-6 w-6 ${method.color} transition-transform duration-500 group-hover:rotate-12`} />
                    </div>

                    <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tighter">{method.title}</h3>
                    <p className="text-slate-500 text-[9px] mb-5 leading-relaxed font-bold uppercase tracking-widest opacity-60">{method.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="text-lg font-black text-white tracking-tighter group-hover:text-secondary transition-colors break-words leading-tight px-2">
                        {method.value}
                      </div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Activity className="h-2 w-2 text-secondary animate-pulse" />
                        <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em]">{method.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <motion.a
                      href={method.action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[8px] tracking-[0.2em] uppercase hover:bg-secondary hover:text-black hover:border-secondary transition-all duration-300"
                    >
                      INITIALIZE SYNC
                    </motion.a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-10 py-32 bg-[#050a18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Transmit <span className="text-warning">Data</span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
              Initialize a secure communication channel.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[4rem] border border-secondary/20 shadow-2xl shadow-secondary/5"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Signal Received</h3>
                <p className="text-xl text-slate-400 mb-8 font-medium">
                  Communication established. Our team will decrypt and respond shortly.
                </p>
                <div className="flex items-center justify-center space-x-3 text-secondary font-black tracking-widest text-xs uppercase">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span>Processing Quantum Sync</span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Full Identity
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Strategic Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 transition-all font-medium"
                        placeholder="john@futurematrix.ai"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Sector / Company
                    </label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 transition-all font-medium"
                        placeholder="Organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Priority Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-secondary/50 transition-all font-medium appearance-none cursor-pointer"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value} className="bg-slate-900 text-white">
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    Signal Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 transition-all font-medium"
                    placeholder="Brief description"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    Transmission Content
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 transition-all font-medium resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-6 bg-gradient-to-r from-secondary to-warning rounded-[2rem] text-black font-black text-xl transition-all duration-300 shadow-2xl shadow-secondary/30 hover:shadow-secondary/50 flex items-center justify-center space-x-3 uppercase tracking-tighter"
                >
                  <Send className="h-6 w-6" />
                  <span>Execute Transmission</span>
                </motion.button>

                <p className="text-slate-600 text-[10px] font-bold text-center uppercase tracking-widest">
                  Secure End-to-End Encryption Enabled
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Social Links */}
      <section className="relative z-10 py-32 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter">
                Global <span className="text-secondary">Nodes</span>
              </h3>
              
              <div className="grid gap-6">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, x: 10 }}
                      className="flex items-center space-x-6 p-8 glass-card rounded-[2.5rem] hover:bg-white/5 border border-white/5 transition-all group"
                    >
                      <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                        <IconComponent className={`h-8 w-8 ${link.color}`} />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-white uppercase tracking-tight">{link.name}</div>
                        <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Follow for intelligence updates</div>
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter">
                Sync <span className="text-warning">Schedule</span>
              </h3>
              
              <div className="glass-card p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent -z-10" />
                <div className="space-y-8">
                  {[
                    { day: 'Mon - Fri', time: '09:00 - 18:00 IST', status: 'Active' },
                    { day: 'Saturday', time: '10:00 - 16:00 IST', status: 'Limited' },
                    { day: 'Sunday', time: 'Offline', status: 'Standby' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-6 border-b border-white/5 last:border-0 last:pb-0">
                      <div>
                        <div className="text-xl font-black text-white uppercase tracking-tight">{item.day}</div>
                        <div className="text-secondary font-bold tracking-widest text-xs uppercase">{item.time}</div>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        item.status === 'Active' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                        item.status === 'Limited' ? 'text-warning border-warning/30 bg-warning/10' :
                        'text-slate-500 border-white/10 bg-white/5'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] border border-secondary/30 text-center">
                <Rocket className="h-10 w-10 text-secondary mx-auto mb-6" />
                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Emergency Signal?</h4>
                <p className="text-slate-400 font-medium mb-6">
                  Apex response units are on standby 24/7 for critical system failures.
                </p>
                <div className="text-secondary font-black tracking-widest uppercase text-xs">Priority Sync Enabled</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage