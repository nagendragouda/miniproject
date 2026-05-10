'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Brain } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

// ── Quiz Data ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: 'When you face a complex problem, what do you do first?',
    category: 'Problem Solving Style',
    options: [
      { key: 'A', text: 'Break it into smaller logical steps' },
      { key: 'B', text: 'Think of creative or unusual solutions' },
      { key: 'C', text: 'Ask others and discuss' },
      { key: 'D', text: 'Try quick solutions and learn by doing' },
    ],
  },
  {
    id: 2,
    question: 'Which type of work do you enjoy most?',
    category: 'Work Preference',
    options: [
      { key: 'A', text: 'Working with data and analysis' },
      { key: 'B', text: 'Designing or creating something new' },
      { key: 'C', text: 'Helping or interacting with people' },
      { key: 'D', text: 'Managing tasks or leading a team' },
    ],
  },
  {
    id: 3,
    question: 'How comfortable are you with learning new technologies?',
    category: 'Technology Comfort',
    options: [
      { key: 'A', text: 'Very comfortable, I enjoy it' },
      { key: 'B', text: 'Somewhat comfortable' },
      { key: 'C', text: 'Only if required' },
      { key: 'D', text: 'Not comfortable' },
    ],
  },
  {
    id: 4,
    question: 'How do you usually make decisions?',
    category: 'Decision Making',
    options: [
      { key: 'A', text: 'Based on logic and data' },
      { key: 'B', text: 'Based on intuition and creativity' },
      { key: 'C', text: 'Based on advice from others' },
      { key: 'D', text: 'Based on risks and rewards' },
    ],
  },
  {
    id: 5,
    question: 'What motivates you the most in a career?',
    category: 'Career Motivation',
    options: [
      { key: 'A', text: 'Solving challenging problems' },
      { key: 'B', text: 'Expressing creativity' },
      { key: 'C', text: 'Helping others' },
      { key: 'D', text: 'Earning money and growth' },
    ],
  },
  {
    id: 6,
    question: 'How do you prefer to learn new things?',
    category: 'Learning Style',
    options: [
      { key: 'A', text: 'Practice and hands-on work' },
      { key: 'B', text: 'Watching and understanding concepts' },
      { key: 'C', text: 'Group discussions' },
      { key: 'D', text: 'Trial and error' },
    ],
  },
  {
    id: 7,
    question: 'Which environment suits you best?',
    category: 'Work Environment',
    options: [
      { key: 'A', text: 'Structured and organized' },
      { key: 'B', text: 'Flexible and creative' },
      { key: 'C', text: 'Collaborative and social' },
      { key: 'D', text: 'Competitive and fast-paced' },
    ],
  },
  {
    id: 8,
    question: 'How do you handle risk?',
    category: 'Risk Handling',
    options: [
      { key: 'A', text: 'Avoid risk, prefer stability' },
      { key: 'B', text: 'Take calculated risks' },
      { key: 'C', text: 'Prefer guidance before acting' },
      { key: 'D', text: 'Enjoy taking risks' },
    ],
  },
  {
    id: 9,
    question: 'Which task would you choose?',
    category: 'Task Preference',
    options: [
      { key: 'A', text: 'Analyze a dataset' },
      { key: 'B', text: 'Design a user interface' },
      { key: 'C', text: 'Guide a team or mentor others' },
      { key: 'D', text: 'Start a business idea' },
    ],
  },
  {
    id: 10,
    question: 'Where do you see yourself in the future?',
    category: 'Long-term Vision',
    options: [
      { key: 'A', text: 'Technical expert' },
      { key: 'B', text: 'Creative professional' },
      { key: 'C', text: 'Social impact role' },
      { key: 'D', text: 'Business leader' },
    ],
  },
]

// ── Personality Result Config ────────────────────────────────────────────────
const PERSONALITY: Record<string, { label: string; color: string; gradient: string; careers: string[]; desc: string }> = {
  Analytical: {
    label: 'Analytical Thinker',
    color: 'text-cyan-300',
    gradient: 'from-cyan-500 to-blue-600',
    desc: 'You excel at logical reasoning, data-driven decisions, and systematic problem solving.',
    careers: ['Data Scientist', 'Software Engineer', 'Financial Analyst', 'AI/ML Engineer', 'Research Scientist'],
  },
  Creative: {
    label: 'Creative Innovator',
    color: 'text-fuchsia-300',
    gradient: 'from-fuchsia-500 to-purple-600',
    desc: 'You shine in designing, storytelling, and bringing original ideas to life.',
    careers: ['UX/UI Designer', 'Product Designer', 'Content Strategist', 'Architect', 'Game Developer'],
  },
  Social: {
    label: 'Social Connector',
    color: 'text-emerald-300',
    gradient: 'from-emerald-500 to-teal-600',
    desc: 'You thrive in human-centered roles — teaching, guiding, and collaborating with others.',
    careers: ['HR Manager', 'Counselor', 'Teacher/Trainer', 'Social Worker', 'Community Manager'],
  },
  Entrepreneurial: {
    label: 'Entrepreneurial Leader',
    color: 'text-amber-300',
    gradient: 'from-amber-500 to-orange-600',
    desc: 'You love leading, taking initiative, and turning vision into action.',
    careers: ['Product Manager', 'Entrepreneur', 'Business Development', 'Marketing Lead', 'Operations Manager'],
  },
}

function computePersonality(answers: Record<number, string>) {
  const counts = { A: 0, B: 0, C: 0, D: 0 }
  Object.values(answers).forEach(v => { if (v in counts) counts[v as keyof typeof counts]++ })
  const max = Math.max(...Object.values(counts))
  const winner = Object.entries(counts).find(([, v]) => v === max)![0]
  const map: Record<string, string> = { A: 'Analytical', B: 'Creative', C: 'Social', D: 'Entrepreneurial' }
  return { type: map[winner], counts }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  firebaseUid: string
  onClose: () => void
  onComplete: () => void
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CareerQuiz({ firebaseUid, onClose, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const q = QUESTIONS[current]
  const answered = answers[q.id]
  const totalAnswered = Object.keys(answers).length
  const progress = (totalAnswered / QUESTIONS.length) * 100

  const selectAnswer = (key: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: key }))
  }

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1)
  }

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const handleSubmit = async () => {
    if (totalAnswered < QUESTIONS.length) return
    setSubmitting(true)
    const { type, counts } = computePersonality(answers)
    try {
      await supabase.from('career_quiz_responses').upsert({
        firebase_uid: firebaseUid,
        q1: answers[1], q2: answers[2], q3: answers[3], q4: answers[4], q5: answers[5],
        q6: answers[6], q7: answers[7], q8: answers[8], q9: answers[9], q10: answers[10],
        personality_type: type,
        score_analytical: counts.A,
        score_creative: counts.B,
        score_social: counts.C,
        score_entrepreneurial: counts.D,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'firebase_uid' })
      // Go straight to career result — no intermediate screen
      onComplete()
    } catch (e) {
      console.error(e)
      setSubmitting(false)
    }
  }

  const optionColors = ['bg-cyan-500/15 border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/25',
    'bg-fuchsia-500/15 border-fuchsia-400/30 text-fuchsia-100 hover:bg-fuchsia-500/25',
    'bg-emerald-500/15 border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/25',
    'bg-amber-500/15 border-amber-400/30 text-amber-100 hover:bg-amber-500/25']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.2)] overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Submitting overlay ── */}
        {submitting && (
          <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">Saving your answers...</p>
              <p className="text-slate-400 text-sm">Preparing your AI career analysis</p>
            </div>
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mt-2" />
          </div>
        )}

        {/* ── Quiz Screen ── */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{q.category}</p>
              <p className="text-xs text-slate-400">Question {current + 1} of {QUESTIONS.length}</p>
            </div>
            <div className="ml-auto flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < current ? 'bg-emerald-400' : i === current ? 'bg-indigo-400' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
              <h3 className="text-xl font-bold text-white mb-6 leading-snug">{q.question}</h3>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={opt.key}
                    onClick={() => selectAnswer(opt.key)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                      answered === opt.key
                        ? `${optionColors[idx]} ring-2 ring-offset-2 ring-offset-slate-900 ${['ring-cyan-400', 'ring-fuchsia-400', 'ring-emerald-400', 'ring-amber-400'][idx]}`
                        : `bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/15 hover:bg-slate-800/70`
                    }`}
                  >
                    <span className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      answered === opt.key ? optionColors[idx] : 'bg-slate-700/50 border-slate-600 text-slate-400'
                    }`}>{opt.key}</span>
                    <span className="text-sm font-medium">{opt.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={handleBack} disabled={current === 0 || submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {current < QUESTIONS.length - 1 ? (
              <button onClick={handleNext} disabled={!answered || submitting}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 transition-all shadow-md">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={totalAnswered < QUESTIONS.length || submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 transition-all shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                Submit Quiz
              </button>
            )}
          </div>

          {/* Progress text */}
          <p className="text-center text-xs text-slate-500 mt-4">
            {totalAnswered} of {QUESTIONS.length} answered
            {totalAnswered === QUESTIONS.length && current < QUESTIONS.length - 1 && ' · Go to last question to submit'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
