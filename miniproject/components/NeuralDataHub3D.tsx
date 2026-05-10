'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function DataBar({ position, height, color, delay }: { position: [number, number, number], height: number, color: string, delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() + delay
    const pulse = Math.sin(time * 2) * 0.5 + 1.5
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, pulse * height, 0.1)
      meshRef.current.position.y = (meshRef.current.scale.y / 2) - 2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.4, 1, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1.5} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  )
}

function NeuralNode({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2
  })

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.12, 16, 16]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          speed={2}
          distort={0.4}
        />
      </Sphere>
      <pointLight color={color} intensity={1} distance={3} />
    </group>
  )
}

function MovingDataHub() {
  const groupRef = useRef<THREE.Group>(null!)
  const [stats, setStats] = useState({ users: 12453, sync: 98.4 })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 5),
        sync: 98 + Math.random() * 1.5
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  const bars = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      position: [Math.cos((i / 12) * Math.PI * 2) * 4, 0, Math.sin((i / 12) * Math.PI * 2) * 4] as [number, number, number],
      height: 1 + Math.random() * 3,
      color: i % 2 === 0 ? '#22d3ee' : '#d946ef',
      delay: Math.random() * Math.PI
    }))
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`NEURAL LOAD: ${stats.users}`}
        </Text>
      </Float>

      {bars.map((bar, i) => (
        <DataBar key={i} {...bar} />
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <NeuralNode 
          key={i} 
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 10
          ]} 
          color={Math.random() > 0.5 ? '#22d3ee' : '#d946ef'}
        />
      ))}

      <gridHelper args={[20, 20, '#444444', '#222222']} position={[0, -2.1, 0]} />
    </group>
  )
}

export default function NeuralDataHub3D() {
  return (
    <div className="h-[600px] w-full relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
      <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MovingDataHub />
      </Canvas>
      
      {/* Real-time Overlay Labels */}
      <div className="absolute bottom-10 left-10 space-y-2 border-l-2 border-cyan-500/50 pl-6">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Global Intelligence Pulse</p>
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <p className="text-3xl font-black text-white tracking-tighter uppercase">Real-time Data Stream</p>
        </div>
      </div>
    </div>
  )
}
