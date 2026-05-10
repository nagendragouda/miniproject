'use client'

import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?next=/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="relative isolate w-full overflow-hidden bg-[#030712] text-white pt-16">
        {/* Same background as home page */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

        <Dashboard />
      </main>
    </>
  )
}
