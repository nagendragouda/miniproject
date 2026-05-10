'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ProfessionalBackground } from '@/components/ProfessionalBackground'
import UserProfileForm from '@/components/UserProfileForm'
import { Check, AlertCircle } from 'lucide-react'

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false, loading: () => <div className="h-20" /> })

export type SectionId =
  | 'section-header'
  | 'section-basic'
  | 'section-education'
  | 'section-skills'
  | 'section-interests'
  | 'section-experience'
  | 'section-social'

const SECTIONS: { label: string; id: SectionId; color: string; mandatory: boolean }[] = [
  { label: 'Header',       id: 'section-header',     color: 'indigo',  mandatory: false },
  { label: 'Basic Info',   id: 'section-basic',      color: 'blue',    mandatory: true  },
  { label: 'Education',    id: 'section-education',  color: 'teal',    mandatory: true  },
  { label: 'Skills',       id: 'section-skills',     color: 'violet',  mandatory: true  },
  { label: 'Interests',    id: 'section-interests',  color: 'pink',    mandatory: true  },
  { label: 'Experience',   id: 'section-experience', color: 'amber',   mandatory: false },
  { label: 'Social Links', id: 'section-social',     color: 'emerald', mandatory: false },
]

const ACTIVE_COLORS: Record<string, string> = {
  indigo:  'bg-indigo-600  border-indigo-600  text-white',
  blue:    'bg-blue-600    border-blue-600    text-white',
  teal:    'bg-teal-600    border-teal-600    text-white',
  violet:  'bg-violet-600  border-violet-600  text-white',
  pink:    'bg-pink-600    border-pink-600    text-white',
  amber:   'bg-amber-500   border-amber-500   text-white',
  emerald: 'bg-emerald-600 border-emerald-600 text-white',
}

const IDLE_COLORS: Record<string, string> = {
  indigo:  'border-indigo-400/40  text-indigo-300  hover:bg-indigo-500/20',
  blue:    'border-blue-400/40    text-blue-300    hover:bg-blue-500/20',
  teal:    'border-teal-400/40    text-teal-300    hover:bg-teal-500/20',
  violet:  'border-violet-400/40  text-violet-300  hover:bg-violet-500/20',
  pink:    'border-pink-400/40    text-pink-300    hover:bg-pink-500/20',
  amber:   'border-amber-400/40   text-amber-300   hover:bg-amber-500/20',
  emerald: 'border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/20',
}

export default function ProfilePage() {
  const [active, setActive] = useState<SectionId>('section-header')
  // Completion map updated by the form via callback
  const [completionMap, setCompletionMap] = useState<Record<SectionId, boolean>>({
    'section-header':     false,
    'section-basic':      false,
    'section-education':  false,
    'section-skills':     false,
    'section-interests':  false,
    'section-experience': true,  // optional — always green
    'section-social':     true,  // optional — always green
  })

  const currentSection = SECTIONS.find(s => s.id === active)!
  const mandatorySections = ['section-header', 'section-basic', 'section-education', 'section-skills', 'section-interests']
  const completedMandatory = mandatorySections.filter(id => completionMap[id as SectionId]).length
  const completionPercentage = Math.round((completedMandatory / mandatorySections.length) * 100)

  return (
    <>
      <div className="fixed inset-0 z-0"><ProfessionalBackground /></div>
      <div className="relative z-40 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-20">
          {/* ── Hero Banner ──────────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 py-10 px-4">
            <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                FutureMatrix · AI Career OS
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Your Career{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Profile
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm max-w-xl">
                Click a section below to view or edit it. Sections marked{' '}
                <span className="text-red-400 font-semibold">required</span> must be completed.
              </p>

              {/* ── Profile Completion Bar ─────────────────────────── */}
              <div className="mt-8 max-w-sm">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300 uppercase tracking-wider">Profile Completeness</span>
                  <span className="text-indigo-300">{completionPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${completionPercentage}%` }} 
                  />
                </div>
              </div>

              {/* ── Section Tabs ───────────────────────────────────── */}
              <div className="flex flex-wrap gap-2 mt-6">
                {SECTIONS.map(({ label, id, color, mandatory }) => {
                  const isActive = active === id
                  const isDone   = completionMap[id]
                  const isWarn   = mandatory && !isDone

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActive(id)}
                      className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                        hover:scale-105 active:scale-95 shadow-sm
                        ${isActive ? ACTIVE_COLORS[color] : IDLE_COLORS[color]}`}
                    >
                      {/* completion dot */}
                      {isDone ? (
                        <Check size={11} className="flex-shrink-0" />
                      ) : mandatory ? (
                        <AlertCircle size={11} className="flex-shrink-0 text-red-400" />
                      ) : null}
                      {label}
                      {mandatory && !isDone && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Active section label */}
              <p className="mt-4 text-xs text-slate-400">
                Viewing: <span className="text-white font-semibold">{currentSection.label}</span>
                {currentSection.mandatory && !completionMap[active] && (
                  <span className="ml-2 text-red-400 font-semibold">· Required — please fill this section</span>
                )}
              </p>
            </div>
          </div>

          {/* ── Profile Form ────────────────────────────────────────── */}
          <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/60 to-purple-50/80">
            <UserProfileForm
              activeSection={active}
              onSectionChange={setActive}
              onCompletionChange={setCompletionMap}
            />
          </div>
        </main>

      </div>
    </>
  )
}
