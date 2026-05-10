'use client'

import { motion } from 'framer-motion'
import { Home, Search, Rocket } from 'lucide-react'
import Link from 'next/link'
import FloatingShapes from '@/components/FloatingShapes'

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white flex items-center justify-center px-4">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/30 blur-3xl rounded-full" />
            <Rocket size={120} className="text-secondary relative z-10" />
          </div>
        </motion.div>
        
        <h1 className="text-9xl font-black mb-4 tracking-tighter">
          <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
            404
          </span>
        </h1>
        
        <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-widest">
          Dimension Lost
        </h2>
        
        <p className="text-xl text-slate-400 mb-12 max-w-lg mx-auto leading-relaxed">
          The coordinates you've entered seem to point to an empty void. 
          The page you're seeking has moved to a new sector or never existed in this reality.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-3 px-10 py-5 bg-gradient-to-r from-secondary to-warning rounded-2xl text-black font-black text-lg transition-all duration-300 shadow-xl shadow-secondary/20 hover:scale-105"
          >
            <Home className="w-6 h-6" />
            <span>RETURN TO BASE</span>
          </Link>
          
          <Link
            href="/career-prediction"
            className="flex items-center justify-center space-x-3 px-10 py-5 glass-card rounded-2xl text-white font-black text-lg transition-all duration-300 border border-white/10 hover:bg-white/5 hover:scale-105"
          >
            <Search className="w-6 h-6" />
            <span>EXPLORE CAREERS</span>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-20 opacity-20 text-xs font-mono tracking-widest uppercase">
          Sector: FutureMatrix-Core-Alpha | Status: Signal-Lost
        </div>
      </motion.div>
    </main>
  )
}
