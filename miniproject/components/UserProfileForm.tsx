'use client'
import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase-client'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, Github, Linkedin, Globe, Edit2, ArrowRight, Award, Heart, Shield, Sparkles, ChevronLeft, GraduationCap, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ProfileData, BLANK, StepHeader, StepBasic, StepEducation, StepSkills, StepInterests, StepExperience, StepSocial } from './ProfileSteps'
import type { SectionId } from '@/app/profile/page'

const STEPS = ['Profile', 'Basic Info', 'Education', 'Skills', 'Interests', 'Experience', 'Social Links']

const MANDATORY: SectionId[] = ['section-basic', 'section-education', 'section-skills', 'section-interests']

function isComplete(id: SectionId, d: ProfileData): boolean {
  if (id === 'section-header')     return !!d.full_name?.trim()
  if (id === 'section-basic')      return !!(d.gender && d.country && d.state && /^\d{10}$/.test(d.phone))
  if (id === 'section-education')  return !!(d.education_level && d.course_stream && d.institution_name && d.academic_score)
  if (id === 'section-skills')     return d.skills.length > 0
  if (id === 'section-interests')  return d.interests.length > 0
  return true // optional sections always "done"
}

function isProfileComplete(d: ProfileData) {
  return MANDATORY.every(id => isComplete(id, d))
}

function validate(step: number, data: ProfileData): string | null {
  if (step === 0 && data.full_name.trim().length < 3) return 'Name must be at least 3 characters'
  if (step === 1) {
    if (!data.gender)  return 'Gender is required'
    if (!data.country) return 'Country is required'
    if (!data.state)   return 'State / Region is required'
    if (!/^\d{10}$/.test(data.phone)) return 'Phone must be exactly 10 digits'
  }
  if (step === 2) {
    if (!data.education_level)               return 'Education level is required'
    if (data.course_stream.trim().length < 2) return 'Course/Stream must be at least 2 characters'
    if (data.institution_name.trim().length < 3) return 'Institution name must be at least 3 characters'
    if (!data.academic_score) return 'Academic score is required'
    const s = parseFloat(data.academic_score)
    if (isNaN(s) || s < 0 || s > 100) return 'Score must be between 0 and 100'
  }
  if (step === 3 && data.skills.length === 0)    return 'Add at least 1 skill'
  if (step === 4 && data.interests.length === 0) return 'Add at least 1 interest'
  return null
}

// ── Red warning banner ─────────────────────────────────────────────────────────
function MandatoryWarning({ label, onEdit }: { label: string; onEdit: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-700 mb-1">Required Section Incomplete</h3>
        <p className="text-red-500 text-sm mb-5">
          <span className="font-semibold">{label}</span> is required to power your AI career prediction.
          Please fill in all fields.
        </p>
        <button onClick={onEdit}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow">
          <Edit2 size={14} /> Fill in {label}
        </button>
      </div>
    </motion.div>
  )
}

// ── Section summary cards ──────────────────────────────────────────────────────
function SummaryHeader({ data, onEdit }: { data: ProfileData; onEdit: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-slate-100 overflow-hidden flex items-center justify-center">
              {data.profile_image_url ? <img src={data.profile_image_url} alt="Avatar" className="w-full h-full object-cover" /> : <User size={36} className="text-slate-300" />}
            </div>
            <button onClick={onEdit} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow transition-colors">
              <Edit2 size={13} /> Edit
            </button>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">{data.full_name || <span className="text-slate-400">No name set</span>}</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5"><Mail size={13} />{data.email}</p>
        </div>
      </div>
    </motion.div>
  )
}

function SummarySection({ icon: Icon, title, color, children, onEdit }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon size={18} className={color} /> {title}
          </h3>
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
            <Edit2 size={12} /> Edit
          </button>
        </div>
        {children}
      </div>
    </motion.div>
  )
}

const chip = (label: string, color: string) => (
  <span key={label} className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>
)

// ── Main Component ──────────────────────────────────────────────────────────────
interface Props {
  activeSection?: SectionId
  onSectionChange?: (id: SectionId) => void
  onCompletionChange?: (map: Record<SectionId, boolean>) => void
  onSaved?: () => void
}

export default function UserProfileForm({ activeSection = 'section-header', onSectionChange, onCompletionChange, onSaved }: Props) {
  const [data, setData]         = useState<ProfileData>(BLANK)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [uid, setUid]           = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [step, setStep]         = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [mode, setMode]         = useState<'wizard' | 'summary'>('wizard')
  const [editSection, setEditSection] = useState<SectionId | null>(null)
  const [customSkill, setCustomSkill]       = useState('')
  const [customInterest, setCustomInterest] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Sync completion map to parent whenever data changes
  useEffect(() => {
    if (!onCompletionChange) return
    const map = {} as Record<SectionId, boolean>
    ;(['section-header','section-basic','section-education','section-skills','section-interests','section-experience','section-social'] as SectionId[])
      .forEach(id => { map[id] = isComplete(id, data) })
    onCompletionChange(map)
  }, [data, onCompletionChange])

  // Auth
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (user) {
        setUid(user.uid)
        setUsername(user.displayName ?? user.email?.split('@')[0] ?? '')
        setData(p => ({ ...p, email: user.email ?? '' }))
        await loadProfile(user.uid, user.email ?? '')
      } else { setLoading(false) }
    })
    return unsub
  }, [])

  const loadProfile = async (uid: string, email: string) => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized')
        setLoading(false)
        return
      }

      const { data: rows, error } = await supabase.from('profiles').select('*').eq('firebase_uid', uid)
      
      if (error || !rows || rows.length === 0) {
        console.log('No profile found - new user')
        setLoading(false)
        return
      }

      const row = rows[0]
      const loaded: ProfileData = {
        full_name: row.full_name ?? '', profile_image_url: row.profile_image_url ?? '',
        gender: row.gender ?? '', email,
        country: row.country ?? '', state: row.state ?? '', phone: row.phone ?? '',
        education_level: row.education_level ?? '', course_stream: row.course_stream ?? '',
        institution_name: row.institution_name ?? '',
        academic_score: row.academic_score != null ? String(row.academic_score) : '',
        skills: row.skills ?? [], interests: row.interests ?? [],
        experience_years: row.experience_years != null ? String(row.experience_years) : '',
        experience_details: row.experience_details ?? '',
        linkedin_url: row.linkedin_url ?? '', github_url: row.github_url ?? '', portfolio_url: row.portfolio_url ?? ''
      }
      setData(loaded)
      if (isProfileComplete(loaded)) setMode('summary')
    } catch (err) {
      console.error('Profile load error:', err)
      /* new user */
    } finally { 
      setLoading(false) 
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData(p => name === 'country' && p.country !== value ? { ...p, country: value, state: '' } : { ...p, [name]: value })
  }

  const onImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be < 2 MB'); return }
    const reader = new FileReader()
    reader.onloadend = () => setData(p => ({ ...p, profile_image_url: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const saveStep = async (isLast = false, mode: 'save' | 'continue' = 'continue') => {
    if (!uid) { toast.error('Please sign in first'); return }
    const err = validate(step, data)
    if (err) {
      setSubmitted(true)   // trigger inline errors on all fields
      toast.error(err)
      return
    }
    setSubmitted(false)    // reset for next step
    setSaving(true)
    const nullIfEmpty = (v: string) => v.trim() === '' ? null : v.trim()
    const numOrNull   = (v: string) => v.trim() === '' ? null : Number(v)
    const payload = {
      firebase_uid: uid, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      email: data.email, full_name: nullIfEmpty(data.full_name), profile_image_url: nullIfEmpty(data.profile_image_url),
      gender: nullIfEmpty(data.gender), phone: nullIfEmpty(data.phone),
      country: nullIfEmpty(data.country), state: nullIfEmpty(data.state),
      education_level: nullIfEmpty(data.education_level), course_stream: nullIfEmpty(data.course_stream),
      institution_name: nullIfEmpty(data.institution_name), academic_score: data.academic_score ? parseFloat(data.academic_score) : null,
      skills: data.skills, interests: data.interests,
      experience_years: numOrNull(data.experience_years), experience_details: nullIfEmpty(data.experience_details),
      linkedin_url: nullIfEmpty(data.linkedin_url), github_url: nullIfEmpty(data.github_url), portfolio_url: nullIfEmpty(data.portfolio_url),
    }
    try {
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'firebase_uid' })
      if (error) throw new Error(error.message || error.details)
      
      if (mode === 'save') {
        toast.success('Progress saved to database')
      } else {
        if (isLast) { 
          toast.success('Profile finalized! 🎉'); setMode('summary'); setEditSection(null) 
        } else { 
          setStep(s => s + 1) 
        }
      }
      // Notify parent that a save happened
      onSaved?.()
    } catch (e: any) { toast.error(e.message ?? 'Save failed'); console.error('[ProfileSave]', e) }
    finally { setSaving(false) }
  }

  const startEdit = (id: SectionId) => {
    const stepMap: Record<SectionId, number> = {
      'section-header': 0, 'section-basic': 1, 'section-education': 2,
      'section-skills': 3, 'section-interests': 4, 'section-experience': 5, 'section-social': 6
    }
    setEditSection(id); setStep(stepMap[id]); setMode('wizard')
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      <p className="text-slate-400 text-sm">Loading your profile…</p>
    </div>
  )

  // ── WIZARD MODE ──────────────────────────────────────────────────────────────
  if (mode === 'wizard') {
    const isLast     = step === STEPS.length - 1
    const isOptional = step >= 5
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-slate-600">Step {step + 1} of {STEPS.length}</p>
            <p className="text-sm text-indigo-600 font-bold">{STEPS[step]}</p>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-emerald-400' : i === step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {step === 0 && <StepHeader data={data} onChange={onChange} onImagePick={onImagePick} fileRef={fileRef} submitted={submitted} />}
        {step === 1 && <StepBasic data={data} onChange={onChange} submitted={submitted} />}
        {step === 2 && <StepEducation data={data} onChange={onChange} submitted={submitted} />}
        {step === 3 && <StepSkills data={data} setData={setData} customSkill={customSkill} setCustomSkill={setCustomSkill} />}
        {step === 4 && <StepInterests data={data} setData={setData} customInterest={customInterest} setCustomInterest={setCustomInterest} />}
        {step === 5 && <StepExperience data={data} onChange={onChange} />}
        {step === 6 && <StepSocial data={data} onChange={onChange} />}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-30 transition-colors">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            {editSection ? (
              <button 
                onClick={() => saveStep(true, 'continue')} 
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-60"
              >
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                ✓ Save Changes
              </button>
            ) : (
              <>
                {isOptional && (
                  isLast ? (
                    <button
                      onClick={() => saveStep(true, 'continue')}
                      disabled={saving}
                      className="px-5 py-2.5 text-slate-500 text-sm font-medium hover:text-slate-700 disabled:opacity-50"
                    >
                      Skip & Finish
                    </button>
                  ) : (
                    <button onClick={() => setStep(s => s + 1)} className="px-5 py-2.5 text-slate-500 text-sm font-medium hover:text-slate-700">Skip</button>
                  )
                )}
                <button 
                  onClick={() => saveStep(isLast, 'save')} 
                  disabled={saving}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  Save Data
                </button>
                <button 
                  onClick={() => saveStep(isLast, 'continue')} 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 active:scale-95 disabled:opacity-60 transition-all"
                >
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isLast ? '✓ Finish Profile' : <> Continue <ArrowRight size={15} /></>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── SUMMARY MODE — show one section at a time ─────────────────────────────────
  const sec = activeSection
  const sectionLabels: Record<SectionId, string> = {
    'section-header': 'Header', 'section-basic': 'Basic Information',
    'section-education': 'Education Details', 'section-skills': 'Skills',
    'section-interests': 'Interests', 'section-experience': 'Experience', 'section-social': 'Social Links'
  }

  // If mandatory and incomplete → show red warning
  if (MANDATORY.includes(sec) && !isComplete(sec, data)) {
    return <MandatoryWarning label={sectionLabels[sec]} onEdit={() => startEdit(sec)} />
  }

  if (sec === 'section-header') return <SummaryHeader data={data} onEdit={() => startEdit('section-header')} />

  if (sec === 'section-basic') return (
    <SummarySection icon={Shield} title="Basic Information" color="text-indigo-500" onEdit={() => startEdit('section-basic')}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Gender', val: data.gender },
          { label: 'Phone', val: data.phone },
          { label: 'Country', val: data.country },
          { label: 'State', val: data.state },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-slate-800 font-medium mt-0.5">{val || '—'}</p>
          </div>
        ))}
      </div>
    </SummarySection>
  )

  if (sec === 'section-education') return (
    <SummarySection icon={GraduationCap} title="Education Details" color="text-teal-500" onEdit={() => startEdit('section-education')}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Level', val: data.education_level },
          { label: 'Course / Stream', val: data.course_stream },
          { label: 'Last Year Percentage', val: data.academic_score },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-slate-800 font-medium mt-0.5">{val || '—'}</p>
          </div>
        ))}
        <div className="col-span-2 md:col-span-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Institution</p>
          <p className="text-slate-800 font-medium mt-0.5">{data.institution_name || '—'}</p>
        </div>
      </div>
    </SummarySection>
  )

  if (sec === 'section-skills') return (
    <SummarySection icon={Award} title="Skills" color="text-violet-500" onEdit={() => startEdit('section-skills')}>
      <div className="flex flex-wrap gap-2">
        {data.skills.length > 0 ? data.skills.map(s => chip(s, 'bg-indigo-50 text-indigo-700')) : <p className="text-slate-400 text-sm">No skills added</p>}
      </div>
    </SummarySection>
  )

  if (sec === 'section-interests') return (
    <SummarySection icon={Heart} title="Interests" color="text-pink-500" onEdit={() => startEdit('section-interests')}>
      <div className="flex flex-wrap gap-2">
        {data.interests.length > 0 ? data.interests.map(i => chip(i, 'bg-pink-50 text-pink-700')) : <p className="text-slate-400 text-sm">No interests added</p>}
      </div>
    </SummarySection>
  )

  if (sec === 'section-experience') return (
    <SummarySection icon={Briefcase} title="Experience" color="text-amber-500" onEdit={() => startEdit('section-experience')}>
      {data.experience_years && <p className="text-slate-700 font-semibold mb-2">{data.experience_years} year(s)</p>}
      {data.experience_details && <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.experience_details}</p>}
      {!data.experience_years && !data.experience_details && <p className="text-slate-400 text-sm">Not provided (optional)</p>}
    </SummarySection>
  )

  if (sec === 'section-social') return (
    <SummarySection icon={Sparkles} title="Social Links" color="text-emerald-500" onEdit={() => startEdit('section-social')}>
      <div className="space-y-3">
        {data.linkedin_url && <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline text-sm"><Linkedin size={18} className="bg-blue-50 p-1 rounded-lg w-8 h-8 flex-shrink-0" />{data.linkedin_url}</a>}
        {data.github_url && <a href={data.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-800 hover:underline text-sm"><Github size={18} className="bg-slate-100 p-1 rounded-lg w-8 h-8 flex-shrink-0" />{data.github_url}</a>}
        {data.portfolio_url && <a href={data.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-purple-600 hover:underline text-sm"><Globe size={18} className="bg-purple-50 p-1 rounded-lg w-8 h-8 flex-shrink-0" />{data.portfolio_url}</a>}
        {!data.linkedin_url && !data.github_url && !data.portfolio_url && <p className="text-slate-400 text-sm">No links added (optional)</p>}
      </div>
    </SummarySection>
  )

  return null
}
