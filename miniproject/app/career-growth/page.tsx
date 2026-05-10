'use client'

/**
 * 🎯 Career Growth Tracker Page
 * Demonstrates the career growth tracking dashboard
 */

import CareerGrowthDashboard from '@/components/CareerGrowthDashboard'
import BackButton from '@/components/BackButton'

export default function CareerGrowthPage() {
  return (
    <main className="w-full relative">
      {/* Back Button */}
      <div className="absolute top-4 right-4 z-50">
        <BackButton />
      </div>
      <CareerGrowthDashboard userId="current_user" />
    </main>
  )
}
