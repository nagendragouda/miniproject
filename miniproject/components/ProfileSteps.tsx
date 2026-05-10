'use client'
import React, { useRef, ChangeEvent } from 'react'
import { COUNTRIES, INDIAN_STATES } from '@/lib/locations'
import { motion } from 'framer-motion'
import { User, Mail, X, Briefcase, Github, Linkedin, Globe, Check, Image as ImageIcon, Award, Heart, Shield, Sparkles, GraduationCap, AlertCircle } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ProfileData {
  full_name: string; profile_image_url: string; gender: string
  email: string; country: string; state: string; phone: string
  education_level: string; course_stream: string; institution_name: string; academic_score: string
  skills: string[]; interests: string[]; experience_years: string
  experience_details: string; linkedin_url: string; github_url: string; portfolio_url: string
}

export const BLANK: ProfileData = {
  full_name: '', profile_image_url: '', gender: '', email: '',
  country: '', state: '', phone: '',
  education_level: '', course_stream: '', institution_name: '', academic_score: '',
  skills: [], interests: [],
  experience_years: '', experience_details: '', linkedin_url: '', github_url: '', portfolio_url: ''
}

const PREDEFINED_SKILLS = ['Programming', 'Communication', 'Design', 'Data Analysis', 'Problem Solving', 'Marketing', 'Leadership', 'Project Management']

// ── Shared style constants ─────────────────────────────────────────────────────
const L = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5'
const validInput   = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm'
const invalidInput = 'w-full px-4 py-3 bg-red-50 border border-red-400 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-500 transition-all text-sm'

function fi(invalid: boolean) { return invalid ? invalidInput : validInput }

// ── Inline error/success helpers ────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-600">
      <AlertCircle size={12} className="flex-shrink-0" /> {msg}
    </p>
  )
}
function FieldOk({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-600">
      <Check size={12} className="flex-shrink-0" /> {msg}
    </p>
  )
}

// ── Validation helpers (return error string or null) ────────────────────────────
const v = {
  fullName:    (s: string) => !s.trim() ? 'Name is required' : s.trim().length < 3 ? 'Must be at least 3 characters' : null,
  gender:      (s: string) => !s ? 'Please select your gender' : null,
  phone:       (s: string) => !s ? 'Phone number is required' : !/^\d{10}$/.test(s) ? `Enter exactly 10 digits — you entered ${s.length}` : null,
  country:     (s: string) => !s ? 'Please select a country' : null,
  state:       (s: string) => !s ? 'State / Region is required' : null,
  eduLevel:    (s: string) => !s ? 'Please select your education level' : null,
  courseStream:(s: string) => !s.trim() ? 'Course / Stream is required' : s.trim().length < 2 ? 'Must be at least 2 characters' : null,
  institution: (s: string) => !s.trim() ? 'Institution name is required' : s.trim().length < 3 ? 'Must be at least 3 characters' : null,
  score:       (s: string) => {
    if (!s.trim()) return 'Academic score is required'
    const n = parseFloat(s)
    if (isNaN(n))      return 'Must be a number (e.g. 85.5 or 8.7)'
    if (n < 0 || n > 100) return 'Score must be between 0 and 100'
    return null
  },
  url: (s: string, label: string) =>
    s && !/^https?:\/\/.+\..+/.test(s) ? `Enter a valid ${label} URL starting with https://` : null,
  expYears: (s: string) => {
    if (!s.trim()) return null // optional
    const n = Number(s)
    return isNaN(n) || n < 0 || n > 60 ? 'Enter a valid number between 0 and 60' : null
  }
}

// ── Card wrapper ───────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {children}
    </motion.div>
  )
}

function SectionHead({ icon: Icon, title, sub }: { icon: any; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Icon size={20} className="text-indigo-600" /></div>
      <div><p className="font-bold text-slate-800">{title}</p>{sub && <p className="text-xs text-slate-400">{sub}</p>}</div>
    </div>
  )
}

// ── Step 0: Header ─────────────────────────────────────────────────────────────
export function StepHeader({ data, onChange, onImagePick, fileRef, submitted }: any) {
  const nameErr = v.fullName(data.full_name)
  const showErr = (err: string | null, val: string) => err && (val || submitted)
  return (
    <Card>
      <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      <div className="px-6 pb-6">
        <div className="relative w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-slate-100 -mt-12 mb-4 overflow-hidden">
          {data.profile_image_url ? <img src={data.profile_image_url} alt="Avatar" className="w-full h-full object-cover" /> : <User size={36} className="absolute inset-0 m-auto text-slate-300" />}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
            <ImageIcon size={18} className="text-white" />
            <input ref={fileRef} type="file" accept="image/*" onChange={onImagePick} className="hidden" />
          </label>
        </div>
        <label className={L}>Full Name *</label>
        <input name="full_name" value={data.full_name} onChange={onChange}
          placeholder="Your full name"
          className={fi(!!showErr(nameErr, data.full_name))} />
        {showErr(nameErr, data.full_name) ? <FieldError msg={nameErr!} /> : data.full_name && !nameErr ? <FieldOk msg="Looks good!" /> : null}
      </div>
    </Card>
  )
}

// ── Step 1: Basic Info ─────────────────────────────────────────────────────────
export function StepBasic({ data, onChange, submitted }: any) {
  const se = (err: string | null, val: string) => !!(err && (val || submitted))
  const phoneErr   = v.phone(data.phone)
  const countryErr = v.country(data.country)
  const stateErr   = v.state(data.state)
  const genderErr  = v.gender(data.gender)

  return (
    <Card>
      <SectionHead icon={Shield} title="Basic Information" sub="All fields marked * are required" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Gender */}
        <div>
          <label className={L}>Gender *</label>
          <select name="gender" value={data.gender} onChange={onChange} className={fi(se(genderErr, data.gender))}>
            <option value="">Select gender</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          {se(genderErr, data.gender) ? <FieldError msg={genderErr!} /> : data.gender && !genderErr ? <FieldOk msg="Selected" /> : null}
        </div>

        {/* Email (read-only) */}
        <div className="md:col-span-2">
          <label className={L}>Email (from account)</label>
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl text-slate-500 text-sm border border-slate-200">
            <Mail size={14} className="text-slate-400 flex-shrink-0" />{data.email}
          </div>
          <p className="text-xs text-slate-400 mt-1">Auto-filled · cannot be changed here</p>
        </div>

        {/* Phone */}
        <div>
          <label className={L}>Phone Number *</label>
          <input type="tel" name="phone" value={data.phone} onChange={onChange}
            placeholder="Enter 10 digit phone number" className={fi(se(phoneErr, data.phone))} />
          {se(phoneErr, data.phone)
            ? <FieldError msg={phoneErr!} />
            : data.phone && !phoneErr
              ? <FieldOk msg="Valid phone number" />
              : <p className="text-xs text-slate-400 mt-1">Digits only, exactly 10 characters</p>}
        </div>

        {/* Country */}
        <div>
          <label className={L}>Country *</label>
          <select name="country" value={data.country} onChange={onChange} className={fi(se(countryErr, data.country))}>
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {se(countryErr, data.country) ? <FieldError msg={countryErr!} /> : data.country && !countryErr ? <FieldOk msg="Selected" /> : null}
        </div>

        {/* State */}
        <div className="md:col-span-2">
          <label className={L}>State / Region *</label>
          {data.country === 'India'
            ? <select name="state" value={data.state} onChange={onChange} className={fi(se(stateErr, data.state))}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            : <input name="state" value={data.state} onChange={onChange} placeholder="Enter your state or region" className={fi(se(stateErr, data.state))} />
          }
          {se(stateErr, data.state) ? <FieldError msg={stateErr!} /> : data.state && !stateErr ? <FieldOk msg="Looks good" /> : null}
        </div>

      </div>
    </Card>
  )
}

// ── Step 2: Education ──────────────────────────────────────────────────────────
export function StepEducation({ data, onChange, submitted }: any) {
  const se = (err: string | null, val: string) => !!(err && (val || submitted))
  const levelErr  = v.eduLevel(data.education_level)
  const courseErr = v.courseStream(data.course_stream)
  const instErr   = v.institution(data.institution_name)
  const scoreErr  = v.score(data.academic_score)

  return (
    <Card>
      <SectionHead icon={GraduationCap} title="Education Details" sub="All fields marked * are required" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Education Level */}
        <div>
          <label className={L}>Education Level *</label>
          <select name="education_level" value={data.education_level} onChange={onChange} className={fi(se(levelErr, data.education_level))}>
            <option value="">Select education level</option>
            <option value="10th">10th Standard</option>
            <option value="PUC">PUC / 12th</option>
            <option value="Diploma">Diploma</option>
            <option value="Graduation">Graduation (Bachelor's)</option>
          </select>
          {se(levelErr, data.education_level) ? <FieldError msg={levelErr!} /> : data.education_level ? <FieldOk msg="Selected" /> : null}
        </div>

        {/* Course / Stream */}
        <div>
          <label className={L}>Course / Stream *</label>
          <input name="course_stream" value={data.course_stream} onChange={onChange}
            placeholder="e.g. Computer Science, Science, MBA…" className={fi(se(courseErr, data.course_stream))} />
          {se(courseErr, data.course_stream) ? <FieldError msg={courseErr!} /> : data.course_stream && !courseErr ? <FieldOk msg="Looks good" /> : null}
        </div>

        {/* Institution Name */}
        <div className="md:col-span-2">
          <label className={L}>College / Institution Name *</label>
          <input name="institution_name" value={data.institution_name} onChange={onChange}
            placeholder="Enter your school or college name" className={fi(se(instErr, data.institution_name))} />
          {se(instErr, data.institution_name) ? <FieldError msg={instErr!} /> : data.institution_name && !instErr ? <FieldOk msg="Looks good" /> : null}
        </div>

        {/* Academic Score */}
        <div className="md:col-span-2">
          <label className={L}>Last Year Percentage *</label>
          <input type="number" name="academic_score" value={data.academic_score} onChange={onChange}
            min="0" max="100" step="0.01" placeholder="e.g. 85.50"
            className={fi(se(scoreErr, data.academic_score))} />
          {se(scoreErr, data.academic_score)
            ? <FieldError msg={scoreErr!} />
            : data.academic_score && !scoreErr
              ? <FieldOk msg="Valid percentage" />
              : <p className="text-xs text-slate-400 mt-1">Enter your final percentage from last year (0–100)</p>}
        </div>

      </div>
    </Card>
  )
}

// ── Step 3: Skills ─────────────────────────────────────────────────────────────
export function StepSkills({ data, setData, customSkill, setCustomSkill }: any) {
  const toggle = (sk: string) => setData((p: ProfileData) => ({
    ...p, skills: p.skills.includes(sk) ? p.skills.filter(x => x !== sk) : [...p.skills, sk]
  }))
  const add = () => {
    const val = customSkill.trim()
    if (val && !data.skills.includes(val)) setData((p: ProfileData) => ({ ...p, skills: [...p.skills, val] }))
    setCustomSkill('')
  }
  return (
    <Card>
      <SectionHead icon={Award} title="Skills" sub="Select predefined or add your own — at least 1 required" />
      <div className="p-6 space-y-4">
        {data.skills.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
            <AlertCircle size={14} /> Please add at least one skill
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_SKILLS.map(sk => {
            const sel = data.skills.includes(sk)
            return (
              <button key={sk} type="button" onClick={() => toggle(sk)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sel ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                {sel && <Check size={10} className="inline mr-1" />}{sk}
              </button>
            )
          })}
        </div>
        {data.skills.filter((s: string) => !PREDEFINED_SKILLS.includes(s)).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.skills.filter((s: string) => !PREDEFINED_SKILLS.includes(s)).map((sk: string) => (
              <span key={sk} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                {sk}<button type="button" onClick={() => toggle(sk)}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input value={customSkill} onChange={e => setCustomSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            placeholder="Add custom skill and press Enter…"
            className={validInput} />
          <button type="button" onClick={add} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 whitespace-nowrap">Add</button>
        </div>
        {data.skills.length > 0 && <FieldOk msg={`${data.skills.length} skill${data.skills.length > 1 ? 's' : ''} added`} />}
      </div>
    </Card>
  )
}

// ── Step 4: Interests ──────────────────────────────────────────────────────────
export function StepInterests({ data, setData, customInterest, setCustomInterest }: any) {
  const remove = (i: string) => setData((p: ProfileData) => ({ ...p, interests: p.interests.filter(x => x !== i) }))
  const add = () => {
    const val = customInterest.trim()
    if (val && !data.interests.includes(val)) setData((p: ProfileData) => ({ ...p, interests: [...p.interests, val] }))
    setCustomInterest('')
  }
  return (
    <Card>
      <SectionHead icon={Heart} title="Interests" sub="What excites you? At least 1 required" />
      <div className="p-6 space-y-4">
        {data.interests.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
            <AlertCircle size={14} /> Please add at least one interest
          </div>
        )}
        <div className="flex flex-wrap gap-2 min-h-[36px]">
          {data.interests.map((i: string) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-100">
              {i}<button type="button" onClick={() => remove(i)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={customInterest} onChange={e => setCustomInterest(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            placeholder="e.g. Technology, AI, Design, Finance…"
            className={validInput} />
          <button type="button" onClick={add} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 whitespace-nowrap">Add</button>
        </div>
        {data.interests.length > 0 && <FieldOk msg={`${data.interests.length} interest${data.interests.length > 1 ? 's' : ''} added`} />}
      </div>
    </Card>
  )
}

// ── Step 5: Experience ─────────────────────────────────────────────────────────
export function StepExperience({ data, onChange }: any) {
  const yearsErr = data.experience_years ? v.expYears(data.experience_years) : null
  return (
    <Card>
      <SectionHead icon={Briefcase} title="Experience" sub="Optional — skip if not applicable" />
      <div className="p-6 space-y-5">
        <div>
          <label className={L}>Years of Experience</label>
          <input type="number" name="experience_years" value={data.experience_years} onChange={onChange}
            min="0" max="60" step="0.5" placeholder="e.g. 2 or 0.5"
            className={fi(!!yearsErr && !!data.experience_years) + ' max-w-xs'} />
          {yearsErr && data.experience_years ? <FieldError msg={yearsErr} /> : data.experience_years && !yearsErr ? <FieldOk msg="Valid" /> : null}
        </div>
        <div>
          <label className={L}>Internship / Project Description</label>
          <textarea name="experience_details" value={data.experience_details} onChange={onChange} rows={4}
            placeholder="Describe internships, projects, certifications…" className={validInput + ' resize-none'} />
        </div>
      </div>
    </Card>
  )
}

// ── Step 6: Social Links ───────────────────────────────────────────────────────
export function StepSocial({ data, onChange }: any) {
  const liErr = v.url(data.linkedin_url, 'LinkedIn')
  const ghErr = v.url(data.github_url, 'GitHub')
  const ptErr = v.url(data.portfolio_url, 'Portfolio')

  const fields = [
    { name: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', ph: 'https://linkedin.com/in/username', color: 'text-blue-600 bg-blue-50', err: liErr },
    { name: 'github_url',   icon: Github,   label: 'GitHub',   ph: 'https://github.com/username',      color: 'text-slate-800 bg-slate-100', err: ghErr },
    { name: 'portfolio_url',icon: Globe,    label: 'Portfolio',ph: 'https://yourportfolio.com',         color: 'text-purple-600 bg-purple-50', err: ptErr },
  ]

  return (
    <Card>
      <SectionHead icon={Sparkles} title="Social Links" sub="Optional — paste your profile URLs" />
      <div className="p-6 space-y-5">
        {fields.map(({ name, icon: Icon, label, ph, color, err }) => (
          <div key={name}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={18} /></div>
              <div className="flex-1">
                <label className={L}>{label}</label>
                <input type="url" name={name} value={(data as any)[name]} onChange={onChange}
                  placeholder={ph} className={fi(!!err && !!(data as any)[name])} />
              </div>
            </div>
            {err && (data as any)[name] ? <FieldError msg={err} /> : (data as any)[name] && !err ? <FieldOk msg="Valid URL" /> : null}
          </div>
        ))}
      </div>
    </Card>
  )
}
