'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

import FloatingShapes from '@/components/FloatingShapes'
import BackButton from '@/components/BackButton'

interface FeaturesList {
  name: string
  included: boolean
}

export default function PricingPage() {
  const { user } = useAuth()

  const features: FeaturesList[] = [
    { name: 'Career Personality Quiz', included: true },
    { name: 'Career Predictions (12 careers)', included: true },
    { name: 'College Finder Database', included: true },
    { name: 'AI-Powered Chat Support', included: true },
    { name: 'Career Roadmaps', included: true },
    { name: 'Resume Analyzer', included: true },
    { name: 'Career Growth Support', included: true },
    { name: 'Education Guidance', included: true },
    { name: 'Saved Collections', included: true },
    { name: 'Career Growth Dashboard', included: true }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-secondary/20 to-primary/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
          >
            <Info size={20} className="text-secondary" />
            <span className="text-text-primary font-medium">Platform Access</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
          >
            All Features
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {' '}Completely Free
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto mb-8"
          >
            Enjoy unlimited access to all career guidance tools, AI features, and resources at no cost. 
            No subscriptions, no hidden fees, no payment required.
          </motion.p>
        </div>

        {/* Main Offer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-100-dark/50 via-slate-900/50 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-secondary/30 p-12 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Free Plan</h2>
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-secondary to-primary bg-clip-text mb-2">
              $0
            </div>
            <p className="text-text-secondary text-lg">Forever free, no limits</p>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                  <Check size={12} className="text-black font-bold" />
                </div>
                <span className="text-text-secondary text-sm">{feature.name}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            {user ? (
              <p className="text-text-secondary">✓ You're all set! Explore all features in your dashboard.</p>
            ) : (
              <a
                href="/auth/signup"
                className="inline-block px-8 py-4 bg-gradient-to-r from-secondary to-primary text-black font-bold rounded-xl hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300 hover:scale-105"
              >
                Sign Up Free
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-100/10 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
            <h3 className="text-lg font-semibold text-text-primary mb-3">No Credit Card</h3>
            <p className="text-text-secondary text-sm">Sign up instantly without any payment information required</p>
          </div>

          <div className="bg-slate-100/10 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Unlimited Access</h3>
            <p className="text-text-secondary text-sm">Use all features, career paths, and AI tools without any restrictions</p>
          </div>

          <div className="bg-slate-100/10 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Always Free</h3>
            <p className="text-text-secondary text-sm">No surprise charges, no hidden costs, no future paywall changes</p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8">Questions?</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Is this really free?</h4>
              <p className="text-slate-600">Yes! We've removed all subscription functionality. All features are completely free to use.</p>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Will it always be free?</h4>
              <p className="text-slate-600">Yes, all core features are permanently free with no plans to introduce paid tiers.</p>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Do I need to sign up?</h4>
              <p className="text-slate-600">Yes, creating a free account lets you save your progress and access all features.</p>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-text-primary mb-3">How do I get started?</h4>
              <p className="text-slate-600">Click "Sign Up Free" above, create your account, and start exploring career guidance tools.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
