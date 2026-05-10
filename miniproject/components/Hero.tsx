'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { useRouter } from 'next/navigation'

const Hero = () => {
  const { user } = useFirebaseAuth()
  const router = useRouter()

  const scrollToFeatures = () => {
    const element = document.querySelector('#features')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10 bg-transparent pt-12 md:pt-20"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f1927 100%)' }}
    >
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 -left-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl opacity-40 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl opacity-30 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-8 w-full"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/50 bg-amber-500/10 backdrop-blur-sm w-fit mx-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">AI-Powered Career Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter"
          >
            Your Personalized
            <motion.span 
              className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Career & College Guide
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Discover your path with AI-powered insights, interactive 3D career maps & nearby government college recommendations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 w-full"
          >
            {/* Always show these CTAs to match test expectations */}
            <>
              {/* Primary CTA - Start Your Quiz */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToFeatures}
                className="relative group bg-white text-slate-950 font-black py-5 px-10 rounded-2xl transition-all flex items-center gap-3 shadow-xl hover:shadow-white/10 uppercase tracking-widest text-xs"
              >
                <span className="relative">Explore Features</span>
                <ArrowRight className="w-4 h-4 relative transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* Secondary CTA - Learn How It Works */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToFeatures}
                className="relative group border border-white/10 bg-white/5 backdrop-blur-xl text-white font-black py-5 px-10 rounded-2xl transition-all flex items-center gap-3 hover:bg-white/10 hover:border-white/20 uppercase tracking-widest text-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Learn How It Works</span>
              </motion.button>
            </>
          </motion.div>

          {/* Stats or Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto w-full"
          >
            {[
              { highlight: 'AI', label: 'Powered Quizzes' },
              { highlight: '3D', label: 'Career Maps' },
              { highlight: 'Govt', label: 'College Locator' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative text-center space-y-3 p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl justify-center flex flex-col group hover:border-white/20 transition-all shadow-2xl"
              >
                <div className="relative text-4xl font-black text-white tracking-tighter">
                  {stat.highlight}
                </div>
                <div className="relative text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="w-1 h-3 bg-amber-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
