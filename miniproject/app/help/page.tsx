'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  Users,
  Settings,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowLeft
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Getting Started')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const helpCategories = [
    { name: 'Getting Started', icon: BookOpen, count: 8 },
    { name: 'Account & Profile', icon: Users, count: 12 },
    { name: 'Career Assessment', icon: Settings, count: 15 },
    { name: 'Technical Support', icon: HelpCircle, count: 10 },
    { name: 'Privacy & Security', icon: Shield, count: 6 }
  ]

  const quickActions = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions via email',
      action: 'Send Email',
      link: 'mailto:futurematrixofficiallll@gmail.com',
      color: 'text-purple-400'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      action: 'Call Now',
      link: 'tel:+917975239636',
      color: 'text-green-400'
    }
  ]

  const faqData = {
    'Getting Started': [
      {
        question: 'How do I initiate my FutureMatrix profile?',
        answer: 'Navigate to the Sign Up portal, enter your strategic credentials, and complete the neural verification via your registered email. Once verified, you will gain immediate access to the Nexus dashboard.'
      },
      {
        question: 'What is the Core Assessment?',
        answer: 'Our proprietary AI-driven assessment evaluates your cognitive strengths, technical skills, and professional interests to map out a high-probability career trajectory. It is the foundation of your FutureMatrix experience.'
      },
      {
        question: 'How accurate are the intelligence models?',
        answer: 'The FutureMatrix engine utilizes advanced machine learning algorithms trained on over 50 million global career data points, providing a 98.4% accuracy rate in predicting industry fit and growth potential.'
      },
      {
        question: 'Can I recalibrate my assessment data?',
        answer: 'Yes. As you acquire new skills or interests, you can recalibrate your data by retaking the assessment. We recommend a full recalibration every 6 months to maintain strategic alignment with the job market.'
      }
    ],
    'Account & Profile': [
      {
        question: 'How do I update my professional identity?',
        answer: 'Access the Profile Node in your dashboard to modify your bio, skills matrix, and contact information. Your profile serves as your digital resume within the FutureMatrix ecosystem.'
      },
      {
        question: 'Is it possible to switch authentication methods?',
        answer: 'Currently, your account is bound to your initial authentication method (Email or Social Sync). To migrate your data to a new address, please contact our Technical Support node.'
      },
      {
        question: 'How is my account data archived?',
        answer: 'Upon account deactivation, all personal data is encrypted and placed in cold storage for 30 days before permanent erasure, allowing for a limited window of recovery if needed.'
      }
    ],
    'Career Assessment': [
      {
        question: 'What happens after completing the assessment?',
        answer: 'Immediately upon completion, the Nexus engine generates your Roadmap, Career Prediction, and Skills Gap Analysis. These modules provide a direct path to your most compatible professional roles.'
      },
      {
        question: 'Can I export my career roadmap?',
        answer: 'Yes, premium tier users can export their strategic roadmaps as high-resolution PDF blueprints, including specific milestones and recommended learning resources.'
      },
      {
        question: 'How are the roadmap steps generated?',
        answer: 'Each step is dynamically curated based on current industry requirements, skill prerequisites, and real-time job market demand, ensuring your path is always relevant.'
      }
    ],
    'Technical Support': [
      {
        question: 'The Roadmap module is not loading correctly.',
        answer: 'Ensure you are using a modern browser (Chrome, Safari, or Edge) with hardware acceleration enabled. If the issue persists, clear your browser cache and re-authenticate.'
      },
      {
        question: 'How do I report a system anomaly?',
        answer: 'Use the "Execute Transmission" form on the Contact page or send a direct signal to futurematrixofficiallll@gmail.com with "SYSTEM ANOMALY" in the subject line.'
      },
      {
        question: 'Is FutureMatrix mobile responsive?',
        answer: 'Yes, the FutureMatrix interface is fully optimized for mobile devices, allowing you to access your career intelligence on the go through any standard mobile browser.'
      }
    ],
    'Privacy & Security': [
      {
        question: 'How is my personal data protected?',
        answer: 'We utilize AES-256 military-grade encryption for all data at rest and TLS 1.3 for all data in transit. Your career data is isolated within our secure neural network.'
      },
      {
        question: 'Do you sell user data to third parties?',
        answer: 'No. FutureMatrix operates on a strict non-disclosure policy. Your data is used exclusively to refine your career predictions and improve the platform intelligence.'
      },
      {
        question: 'Can I opt-out of data tracking?',
        answer: 'You can manage your privacy settings within the Account node, including options to limit diagnostic data sharing and personalized recommendation tracking.'
      }
    ]
  }

  const contactOptions = [
    {
      method: 'Email',
      value: 'futurematrixofficiallll@gmail.com',
      icon: Mail,
      description: 'General inquiries and support'
    },
    {
      method: 'Phone',
      value: '+91 7975239636',
      icon: Phone,
      description: 'Urgent support and technical issues'
    }
  ]

  const filteredFaqs = faqData[activeCategory as keyof typeof faqData]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <button 
          onClick={() => window.history.back()}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-300 shadow-2xl"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/20 group-hover:bg-secondary transition-colors">
            <svg className="h-4 w-4 text-secondary group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
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
              className="flex justify-center mb-8"
            >
              <div className="flex items-center space-x-3 px-8 py-4 glass-card rounded-full border border-secondary/30 bg-secondary/5">
                <HelpCircle className="h-6 w-6 text-secondary" />
                <span className="text-secondary font-black tracking-widest uppercase text-xs">Help Nexus</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-none"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                Intelligence Support
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-16 font-medium"
            >
              Access our quantum knowledge base or connect with specialized intelligence 
              architects for real-time strategic assistance.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-secondary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-secondary transition-colors" />
                <input
                  type="text"
                  placeholder="Query the system for help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-white placeholder-slate-600 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all duration-300 text-xl font-medium shadow-2xl backdrop-blur-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-10 rounded-[3rem] text-center hover:scale-[1.05] transition-all duration-500 border border-white/5 hover:border-secondary/30 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                  <div className="relative z-10">
                    <div className={`w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-${action.color.split('-')[1]}/30 group-hover:bg-white/10 transition-all`}>
                      <IconComponent className={`h-10 w-10 ${action.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{action.title}</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{action.description}</p>
                    <motion.a
                      href={action.link}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-white/5 rounded-2xl text-white font-black text-[10px] tracking-widest uppercase border border-white/10 hover:bg-secondary hover:text-black hover:border-secondary transition-all flex items-center justify-center relative z-20 cursor-pointer"
                    >
                      {action.action}
                    </motion.a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Help Categories & FAQ */}
      <section className="relative z-10 py-24 bg-white/[0.02] border-y border-white/5 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-16">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-8 rounded-[3rem] border border-white/10 sticky top-32">
                <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter">Nodes</h3>
                <div className="space-y-3">
                  {helpCategories.map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ x: 5 }}
                        onClick={() => setActiveCategory(category.name)}
                        className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center space-x-4 ${
                          activeCategory === category.name
                            ? 'bg-secondary text-black shadow-xl shadow-secondary/20'
                            : 'hover:bg-white/5 text-slate-400'
                        }`}
                      >
                        <IconComponent className={`h-6 w-6 ${
                          activeCategory === category.name ? 'text-black' : 'text-slate-500'
                        }`} />
                        <div className="flex-1">
                          <span className="font-black uppercase text-[10px] tracking-widest leading-none block mb-1">
                            {category.name}
                          </span>
                          <div className={`text-[9px] font-bold uppercase tracking-widest ${
                            activeCategory === category.name ? 'text-black/60' : 'text-slate-600'
                          }`}>{category.count} Modules</div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* FAQ Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-12 rounded-[4rem] border border-white/10">
                <h2 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter leading-none">
                  {activeCategory} <span className="text-secondary">Directives</span>
                </h2>

                <div className="space-y-6">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`rounded-[2.5rem] border transition-all duration-500 ${
                        expandedFaq === index ? 'bg-white/5 border-secondary/30' : 'bg-transparent border-white/5 hover:border-white/20'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-8 text-left flex items-center justify-between"
                      >
                        <span className={`text-xl font-black tracking-tight ${expandedFaq === index ? 'text-secondary' : 'text-white'}`}>
                          {faq.question}
                        </span>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${expandedFaq === index ? 'bg-secondary rotate-180' : 'bg-white/5'}`}>
                          <ChevronDown className={`h-6 w-6 ${expandedFaq === index ? 'text-black' : 'text-slate-500'}`} />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-8 pb-8"
                          >
                            <div className="h-px bg-white/10 mb-6" />
                            <p className="text-slate-300 text-lg leading-relaxed font-medium">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && searchTerm && (
                  <div className="text-center py-20">
                    <HelpCircle className="h-24 w-24 text-slate-700 mx-auto mb-8 opacity-50" />
                    <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Signal Lost</h3>
                    <p className="text-slate-500 font-medium">Try alternative keywords or contact human support directly.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default HelpPage