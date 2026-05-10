'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const shapes = [
  { id: 1, size: 300, color: 'bg-cyan-500/20', blur: 'blur-[120px]', top: '-5%', left: '-5%' },
  { id: 2, size: 400, color: 'bg-fuchsia-600/15', blur: 'blur-[140px]', top: '20%', left: '60%' },
  { id: 3, size: 250, color: 'bg-blue-600/20', blur: 'blur-[110px]', top: '60%', left: '-10%' },
  { id: 4, size: 350, color: 'bg-indigo-600/20', blur: 'blur-[130px]', top: '70%', left: '70%' },
  { id: 5, size: 280, color: 'bg-cyan-400/15', blur: 'blur-[100px]', top: '80%', left: '30%' },
  { id: 6, size: 320, color: 'bg-purple-600/15', blur: 'blur-[120px]', top: '10%', left: '80%' },
  { id: 7, size: 240, color: 'bg-blue-400/20', blur: 'blur-[90px]', top: '40%', left: '40%' },
  { id: 8, size: 290, color: 'bg-teal-500/15', blur: 'blur-[110px]', top: '85%', left: '10%' },
  { id: 9, size: 350, color: 'bg-amber-500/10', blur: 'blur-[130px]', top: '30%', left: '10%' },
]

export default function FloatingShapes() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none" style={{ minHeight: '100%' }}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} ${shape.blur}`}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Dynamic Grid Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#030712_100%)] opacity-40" />
    </div>
  )
}
