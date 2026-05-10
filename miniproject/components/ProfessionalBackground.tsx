'use client'

import React from 'react'

/**
 * Professional Calm Background
 * Static, elegant design with soothing colors
 * Used consistently across all pages
 */
export function ProfessionalBackground() {

  return (
    <>
      {/* Main static background with dark slate and amber theme */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        {/* Base gradient - dark slate to slate-800 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Subtle overlay with warm amber accents */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-800/40" />
        
        {/* Warm amber accent on right */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-b from-amber-600/15 via-amber-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle amber glow on left side */}
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-amber-600/12 via-amber-500/8 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle footer accent - dark with amber tint */}
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-gradient-to-t from-amber-700/20 via-amber-600/12 to-transparent rounded-full blur-3xl" />
        
        {/* Soft light reflection for depth */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 via-transparent to-transparent" />
      </div>
    </>
  )
}
