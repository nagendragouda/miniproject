'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowUp
} from 'lucide-react'

const PROJECT_IMAGE_URL = 'https://pdgsxesdxgtpyhohrmwi.supabase.co/storage/v1/object/public/project_img/Screenshot%202026-04-22%20214448.png'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'College Finder', href: '#colleges' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Team', href: '/team' },
      { name: 'Contact', href: '/contact' }
    ],
    resources: [
      { name: 'Help', href: '/help' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-text-secondary' }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = href
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900">
      {/* Animated Background Effects */}
      <motion.div
        animate={{
          opacity: [0.18, 0.36, 0.18],
          y: [0, -12, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.12, 0.28, 0.12],
          x: [0, 18, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                  <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_24px_rgba(56,189,248,0.22)]">
                    <Image
                      src={PROJECT_IMAGE_URL}
                      alt="FutureMatrix project logo"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">
                    Future<span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Matrix</span>
                  </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="max-w-md text-sm leading-relaxed text-slate-300"
              >
                Your comprehensive platform for career guidance and college recommendations powered by AI.
              </motion.p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 text-slate-300 text-sm"
                >
                    <Mail className="h-4 w-4 text-cyan-300" />
                  <span>futurematrixofficialll@gmail.com</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 text-slate-300 text-sm"
                >
                    <Phone className="h-4 w-4 text-cyan-300" />
                  <span>+91 7975239636</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 text-slate-300 text-sm"
                >
                    <MapPin className="h-4 w-4 text-cyan-300" />
                  <span>123 Innovation Drive, Tech City</span>
                </motion.div>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <div key={category} className="space-y-4">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="text-cyan-200 font-bold uppercase text-sm tracking-widest"
                >
                  {category === 'product' ? 'Product' : 
                   category === 'company' ? 'Company' : 
                   category === 'resources' ? 'Support' : 
                   category === 'legal' ? 'Legal' : 
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.h3>
                <div className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: categoryIndex * 0.1 + linkIndex * 0.05 
                      }}
                      viewport={{ once: true }}
                    >
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-slate-300 hover:text-cyan-300 transition-all duration-300 text-sm group flex items-center hover:translate-x-1"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-amber-600/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-slate-400 text-sm"
            >
              © {currentYear} FutureMatrix. All rights reserved. Built with 💫 for students everywhere.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.15, y: -3, boxShadow: '0 0 20px rgba(34, 211, 238, 0.28)' }}
              viewport={{ once: true }}
              onClick={scrollToTop}
              className="self-end md:self-auto p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:border-cyan-400/40 backdrop-blur-xl"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer