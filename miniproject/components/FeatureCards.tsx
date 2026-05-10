'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sparkles, MapPin, Zap, BookOpen, Target, ArrowRight, X } from 'lucide-react'
import Image from 'next/image'

const colorClassMap = {
  secondary: {
    glow: 'bg-sky-300/30',
    chip: 'bg-sky-100 text-sky-700',
    icon: 'text-sky-600',
    bg: 'from-sky-50 to-sky-100'
  },
  warning: {
    glow: 'bg-slate-300/30',
    chip: 'bg-slate-100 text-slate-700',
    icon: 'text-slate-600',
    bg: 'from-slate-50 to-slate-100'
  },
  primary: {
    glow: 'bg-indigo-300/30',
    chip: 'bg-indigo-100 text-indigo-700',
    icon: 'text-indigo-600',
    bg: 'from-indigo-50 to-indigo-100'
  }
}

interface Feature {
  id: string
  icon: any
  title: string
  description: string
  color?: string
  gradient?: string
  image?: string
  fullInfo?: string
  benefits?: string[]
}

interface InfoModalProps {
  feature: Feature | null
  isOpen: boolean
  onClose: () => void
}

const InfoModal = ({ feature, isOpen, onClose }: InfoModalProps) => {
  if (!isOpen || !feature) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg z-10 bg-white shadow-md"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
          {feature.image && (
            <div className="relative w-full h-80 overflow-hidden bg-slate-200">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{feature.title}</h2>
            <p className="text-lg text-slate-700 mb-8">{feature.fullInfo}</p>
            {feature.benefits && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Benefits:</h3>
                <ul className="space-y-2">
                  {feature.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-slate-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface FeatureCardProps {
  feature: Feature
  index: number
  onOpen: (feature: Feature) => void
}

const FeatureCard = ({ feature, index, onOpen }: FeatureCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const IconComponent = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -15 }}
      onClick={() => onOpen(feature)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-full shadow-2xl hover:shadow-2xl transition-all bg-gradient-to-br from-black to-slate-900 border border-amber-500/20 hover:border-amber-400/60"
    >
      {/* Animated Border Glow */}
      <motion.div
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(217, 119, 6, 0.2)',
            '0 0 40px rgba(217, 119, 6, 0.4)',
            '0 0 20px rgba(217, 119, 6, 0.2)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
      />

      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>

      {/* Icon Section */}
      <div className={`relative h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden`}>
        {/* Radial Glow */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-radial-gradient from-amber-600/20 to-transparent opacity-50 pointer-events-none"
        />

        {/* Icon Container */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(217, 119, 6, 0.3)',
                '0 0 60px rgba(217, 119, 6, 0.6)',
                '0 0 30px rgba(217, 119, 6, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="rounded-full p-2"
          >
            <IconComponent className="w-24 h-24 text-amber-300" />
          </motion.div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 p-8">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-300 mb-6 line-clamp-2 group-hover:text-amber-50 transition-colors duration-300">
          {feature.description}
        </p>
        <motion.div 
          className="flex items-center gap-2 text-amber-300 font-semibold text-sm group-hover:gap-4 transition-all duration-300"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>View Details</span>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const AdditionalCard = ({ feature, index, onOpen }: FeatureCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const IconComponent = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.08, y: -8 }}
      onClick={() => onOpen(feature)}
      className="group relative p-8 rounded-2xl cursor-pointer shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-600/40 hover:border-amber-400/80 overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(400px at 10% 20%, rgba(217, 119, 6, 0.05) 0%, transparent 80%)',
            'radial-gradient(400px at 90% 80%, rgba(217, 119, 6, 0.05) 0%, transparent 80%)',
            'radial-gradient(400px at 10% 20%, rgba(217, 119, 6, 0.05) 0%, transparent 80%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon Container */}
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(217, 119, 6, 0.2)',
              '0 0 40px rgba(217, 119, 6, 0.4)',
              '0 0 20px rgba(217, 119, 6, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`p-4 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white flex-shrink-0 group-hover:scale-125 transition-transform`}
          whileHover={{ rotate: 10 }}
        >
          <IconComponent className={`w-8 h-8`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
            {feature.title}
          </h4>
          <p className="text-gray-300 text-sm mb-4 group-hover:text-amber-50 transition-colors duration-300">
            {feature.description}
          </p>
          <motion.div
            className="text-amber-300 text-sm font-semibold flex items-center gap-2"
            animate={{ 
              opacity: [0.7, 1, 0.7],
              x: [0, 4, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-transparent to-amber-600/10 rounded-2xl pointer-events-none"
      />
    </motion.div>
  )
}

const FeatureCards = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mainFeatures: Feature[] = [
    {
      id: '3d',
      icon: Sparkles,
      title: '3D Career Visualization',
      description: 'Explore interactive 3D maps of career paths and opportunities',
      color: 'secondary',
      gradient: 'from-sky-500 to-blue-400',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      fullInfo: 'Experience an immersive 3D visualization system that maps diverse career paths and their interconnections. Explore multiple trajectories, see advancement opportunities, and understand how different roles and industries connect.',
      benefits: [
        'Visualize career trajectories in 3D',
        'Explore role interconnections',
        'Identify advancement opportunities',
        'Discover related industries'
      ]
    },
    {
      id: 'college',
      icon: MapPin,
      title: 'Smart College Finder',
      description: 'Find colleges aligned with your career goals and aspirations',
      color: 'warning',
      gradient: 'from-slate-500 to-slate-400',
      image: 'https://images.unsplash.com/photo-1427504494785-cdedibb9b77f?w=800&q=80',
      fullInfo: 'Discover colleges perfectly matched to your academic interests and career aspirations. Our intelligent system analyzes thousands of institutions to find the best fit for your unique profile and goals.',
      benefits: [
        'Personalized recommendations',
        'Compare programs',
        'Analyze placements',
        'Connect with alumni'
      ]
    }
  ]

  const additionalFeatures: Feature[] = [
    {
      id: 'ai',
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Get real-time career recommendations powered by AI',
      color: 'primary',
      image: 'https://images.unsplash.com/photo-1677442d019cecf8d9b5b61f41a3a10d3c6e7d48?w=800&q=80',
      fullInfo: 'Harness artificial intelligence to receive personalized career insights and real-time recommendations based on market trends.',
      benefits: [
        'AI recommendations',
        'Market analysis',
        'Skill assessment',
        'Personalized paths'
      ]
    },
    {
      id: 'study',
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Curated learning resources for continuous growth',
      color: 'secondary',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70570ec0?w=800&q=80',
      fullInfo: 'Access a comprehensive library of study materials curated specifically for your career path and skill development.',
      benefits: [
        'Curated resources',
        'Skill courses',
        'Progress tracking',
        'Certifications'
      ]
    },
    {
      id: 'goals',
      icon: Target,
      title: 'Goal Framework',
      description: 'Set and track meaningful career milestones',
      color: 'warning',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      fullInfo: 'Define clear, achievable goals and track progress with our comprehensive framework designed for career success.',
      benefits: [
        'SMART goals',
        'Progress tracking',
        'Performance analytics',
        'Success celebrations'
      ]
    }
  ]

  const handleOpen = (feature: Feature) => {
    setSelectedFeature(feature)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedFeature(null), 300)
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-amber-600/10 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 rounded-full bg-amber-500/10 opacity-30 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful Features for Your
            <span className="block bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Career Journey
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to make informed decisions and unlock your full potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              onOpen={handleOpen}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-black text-center mb-12">Additional Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <AdditionalCard
                key={feature.id}
                feature={feature}
                index={index}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-black hover:bg-gray-900 text-amber-300 font-bold py-5 px-10 rounded-full transition-all inline-flex items-center gap-3 text-lg shadow-xl border-2 border-amber-600"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>

      <InfoModal feature={selectedFeature} isOpen={isModalOpen} onClose={handleClose} />
    </section>
  )
}

export default FeatureCards
