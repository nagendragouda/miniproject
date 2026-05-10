'use client'
import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Loader2, AlertTriangle, CheckCircle2, ArrowRight, Star, Zap,
  BarChart3, Wrench, Lightbulb, TrendingUp, Shield, BookOpen, Youtube,
  ChevronRight, GraduationCap, Target, Award, User, Sparkles, Globe, Play, XCircle, Download, ExternalLink
} from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { supabase } from '@/lib/supabase-client'
import { generateCareerPredictionToken } from '@/lib/careerPdfToken'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'

// ── Premium UI Components ──────────────────────────────────────────────────────
const Card = ({ children, className = '', glow = false }: any) => (
  <motion.div whileHover={{ y: -2 }}
    className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl ${glow ? 'shadow-indigo-500/10 border-indigo-500/20' : ''} ${className}`}
  >
    {children}
  </motion.div>
)

const STitle = ({ icon: I, label, color = 'text-cyan-400' }: any) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="p-2 rounded-xl bg-white/5 border border-white/10"><I className={`w-4 h-4 ${color}`} /></div>
    <p className={`text-xs font-black uppercase tracking-widest ${color}`}>{label}</p>
  </div>
)

const Tag = ({ children, color = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' }: any) => (
  <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border ${color}`}>{children}</span>
)

const List = ({ items, icon: I = CheckCircle2, color = 'text-cyan-400' }: any) => {
  if (!items || !Array.isArray(items) || items.length === 0) return null
  return (
    <ul className="space-y-2.5">
      {items.map((s: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-300 group">
          <I className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color} group-hover:scale-110 transition-transform`} />
          <span className="leading-relaxed">{s}</span>
        </li>
      ))}
    </ul>
  )
}

const scoreColor = (n: number) => n >= 80 ? 'text-emerald-400' : n >= 65 ? 'text-amber-400' : 'text-rose-400'
const scoreBg = (n: number) => n >= 80 ? 'from-emerald-500 to-teal-600' : n >= 65 ? 'from-amber-500 to-orange-600' : 'from-rose-500 to-pink-600'

// ── Career Detail Component (100% JSON Coverage) ─────────────────────────────
function CareerDetail({ item, idx, personality }: { item: any; idx: number; personality: string }) {
  const [videoPage, setVideoPage] = useState(0)
  const videosPerPage = 12

  const name = item.careerName || item.pathName || item.streamName || item.courseName || 'Career Path'
  const score = item.matchScore || 0
  const overview = item.careerOverview || item.overview || item.courseOverview || item.reason || 'Career path with promising opportunities'
  const personalityFit = item.careerPersonalityFit || item.personalityFit || 'Matches your professional profile'

  // JSON Template Mapping - ALWAYS ENSURE ARRAYS ARE POPULATED
  const subjects = item.suggestedSubjects || ['Core Theory', 'Applied Concepts', 'Practical Skills']
  const skills = item.requiredSkills || item.skillsToDevelop || ['Problem-solving', 'Communication', 'Technical knowledge']
  const projects = item.recommendedProjects || ['Portfolio project', 'Real-world case study', 'Capstone project']
  const tools = item.toolsAndTechnologies || ['Industry standard tools', 'Frameworks', 'Platforms']
  const resources = item.learningResources || ['Official documentation', 'Online courses', 'Mentorship programs']
  const roadmap = item.roadmap || { step1: 'Build foundations', step2: 'Advanced development', beginner: [], intermediate: [] }
  const actionPlan = item.actionPlan || { next30Days: ['Set goals', 'Start learning', 'Build first project'], midTerm: ['Gain experience', 'Develop expertise'] }
  const mistakes = item.commonMistakesToAvoid || ['Ignoring basics', 'Poor communication', 'Not practicing']
  const gap = item.skillGapAnalysis || { currentSkills: [], missingSkills: ['Advanced techniques'], improvementAreas: ['Technical depth'] }
  const salary = item.salaryGrowth || { entryLevel: '₹5-10 LPA', midLevel: '₹15-30 LPA', seniorLevel: '₹50-100+ LPA' }
  const market = item.marketDemand || { currentDemand: 'High demand', growthRate: '5-8% annually', futureScope: 'Positive outlook' }
  const risk = item.riskAnalysis || { automationRisk: 'Moderate', competitionLevel: 'Moderate' }
  const relatedVideos = item.relatedVideos || []

  // Pagination for videos
  const totalPages = Math.ceil(relatedVideos.length / videosPerPage)
  const paginatedVideos = relatedVideos.slice(
    videoPage * videosPerPage,
    (videoPage + 1) * videosPerPage
  )

  const careerType = item.careerType || null
  const duration = item.duration || null

  // New stage-specific JSON fields
  const streamSubjects = item.streamSubjects || []
  const coursesAfter10th = item.coursesAfter10th || []
  const careerPreview = item.careerPreview || []
  const entranceExams = item.entranceExams || []
  const topColleges = item.topColleges || []
  const lateralEntryOptions = item.lateralEntryOptions || []
  const specializationAreas = item.specializationAreas || []
  const recommendedCertifications = item.recommendedCertifications || []

  return (
    <AnimatePresence mode="wait">
      <motion.div key={name + idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8 pb-24">

        {/* Header Hero */}
        <div className={`bg-gradient-to-br ${scoreBg(score)} rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white/20`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40" />
          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <Tag color="bg-white/20 text-white border-white/30 backdrop-blur-md">ANALYSIS RANK #{idx + 1}</Tag>
              {item.basedOnStream && <Tag color="bg-black/20 text-white border-white/10">{item.basedOnStream} Stream</Tag>}
              {careerType && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/25 border border-white/40 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  <GraduationCap className="w-3.5 h-3.5" /> {careerType}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/25 border border-white/40 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  ⏱ {duration}
                </span>
              )}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">{name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 font-medium italic"><Sparkles className="w-4 h-4" />{personalityFit || `Strong match for ${personality} personality.`}</div>
          </div>
          <div className="relative z-10 text-center bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 flex-shrink-0">
            <div className="text-5xl font-black text-white mb-1">{score}<span className="text-xl opacity-60">%</span></div>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Match Score</p>
            {careerType && <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider mt-2 border-t border-white/20 pt-2">{careerType}</p>}
          </div>
        </div>

        {/* Career Type & Duration Banner */}
        {(careerType || duration) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careerType && (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                  <GraduationCap className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Path Type</p>
                  <p className="text-white font-black text-lg">{careerType}</p>
                </div>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
                  <BookOpen className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-white font-black text-lg">{duration}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Stage-Specific Information (Entrance Exams, Specializations, etc) */}
        {(entranceExams.length > 0 || topColleges.length > 0 || specializationAreas.length > 0 || lateralEntryOptions.length > 0 || coursesAfter10th.length > 0 || streamSubjects.length > 0 || recommendedCertifications.length > 0 || careerPreview.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {streamSubjects.length > 0 && (
              <Card className="bg-indigo-500/5 border-indigo-500/20">
                <STitle icon={BookOpen} label="Stream Subjects" color="text-indigo-400" />
                <div className="flex flex-wrap gap-2">{streamSubjects.map((s: string, i: number) => <Tag key={i} color="bg-indigo-500/10 text-indigo-300 border-indigo-500/30">{s}</Tag>)}</div>
              </Card>
            )}
            
            {entranceExams.length > 0 && (
              <Card className="bg-rose-500/5 border-rose-500/20">
                <STitle icon={Target} label="Entrance Exams Required" color="text-rose-400" />
                <div className="flex flex-wrap gap-2">{entranceExams.map((e: string, i: number) => <Tag key={i} color="bg-rose-500/10 text-rose-300 border-rose-500/30 font-bold uppercase">{e}</Tag>)}</div>
              </Card>
            )}

            {topColleges.length > 0 && (
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <STitle icon={Award} label="Top Institutions / Companies" color="text-emerald-400" />
                <List items={topColleges} icon={Award} color="text-emerald-400" />
              </Card>
            )}

            {specializationAreas.length > 0 && (
              <Card className="bg-cyan-500/5 border-cyan-500/20">
                <STitle icon={Sparkles} label="Specialization Areas" color="text-cyan-400" />
                <div className="flex flex-wrap gap-2">{specializationAreas.map((s: string, i: number) => <Tag key={i} color="bg-cyan-500/10 text-cyan-300 border-cyan-500/30">{s}</Tag>)}</div>
              </Card>
            )}

            {recommendedCertifications.length > 0 && (
              <Card className="bg-amber-500/5 border-amber-500/20">
                <STitle icon={Award} label="Recommended Certifications" color="text-amber-400" />
                <List items={recommendedCertifications} icon={Star} color="text-amber-400" />
              </Card>
            )}

            {coursesAfter10th.length > 0 && (
              <Card className="bg-purple-500/5 border-purple-500/20">
                <STitle icon={BookOpen} label="Courses Alongside Stream" color="text-purple-400" />
                <List items={coursesAfter10th} icon={Lightbulb} color="text-purple-400" />
              </Card>
            )}

            {lateralEntryOptions.length > 0 && (
              <Card className="bg-fuchsia-500/5 border-fuchsia-500/20">
                <STitle icon={TrendingUp} label="Lateral Entry Options" color="text-fuchsia-400" />
                <List items={lateralEntryOptions} icon={TrendingUp} color="text-fuchsia-400" />
              </Card>
            )}

            {careerPreview.length > 0 && (
              <Card className="bg-teal-500/5 border-teal-500/20 xl:col-span-3">
                <STitle icon={Globe} label="Ultimate Career Paths" color="text-teal-400" />
                <div className="flex flex-wrap gap-3">{careerPreview.map((p: string, i: number) => <Tag key={i} color="bg-teal-500/10 text-teal-300 border-teal-500/30 text-sm py-2 px-4">{p}</Tag>)}</div>
              </Card>
            )}
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card><STitle icon={Brain} label="Logical Reason for Path" color="text-fuchsia-400" /><p className="text-slate-300 text-sm leading-relaxed">{overview}</p></Card>
            <Card><STitle icon={BookOpen} label="Suggested Subjects" color="text-indigo-400" />
              <div className="flex flex-wrap gap-2.5">{subjects && subjects.length > 0 ? subjects.map((s: string, i: number) => <Tag key={i} color="bg-indigo-500/10 text-indigo-300 border-indigo-400/20">{s}</Tag>) : <span className="text-slate-400 text-sm">Core theory and practical concepts</span>}</div>
            </Card>
            <Card><STitle icon={Star} label="Growth Skills to Develop" color="text-amber-400" />
              <div className="flex flex-wrap gap-2.5">{skills && skills.length > 0 ? skills.map((s: string, i: number) => <Tag key={i} color="bg-amber-500/10 text-amber-300 border-amber-400/20">{s}</Tag>) : <span className="text-slate-400 text-sm">Technical and soft skills</span>}</div>
            </Card>
            <Card><STitle icon={BarChart3} label="Skill Gap Analysis" color="text-rose-400" />
              <div className="space-y-4">
                {gap?.currentSkills && gap.currentSkills.length > 0 && (<div><p className="text-[10px] uppercase font-black text-slate-500 mb-2">Your Current Assets</p><div className="flex flex-wrap gap-1.5">{gap.currentSkills.map((s: any, i: any) => <span key={i} className="text-xs text-emerald-400 font-bold">✓ {s}</span>)}</div></div>)}
                {gap?.missingSkills && gap.missingSkills.length > 0 && (<div><p className="text-[10px] uppercase font-black text-slate-500 mb-2">Priority Gaps to Fill</p><List items={gap.missingSkills} icon={AlertTriangle} color="text-rose-400" /></div>)}
                {gap?.improvementAreas && gap.improvementAreas.length > 0 && (<div className="mt-4"><p className="text-[10px] uppercase font-black text-slate-500 mb-2">Improvement Areas</p><List items={gap.improvementAreas} icon={TrendingUp} color="text-cyan-400" /></div>)}
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card><STitle icon={TrendingUp} label="Salary Potential (India)" color="text-emerald-400" />
              <div className="space-y-3">
                {salary && [
                  { l: 'Entry Level', v: salary.entryLevel || '₹5-10 LPA' },
                  { l: 'Mid Career', v: salary.midLevel || '₹15-30 LPA' },
                  { l: 'Senior Executive', v: salary.seniorLevel || '₹50-100+ LPA' }
                ].map(lvl => (
                  <div key={lvl.l} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"><span className="text-[10px] font-black text-slate-500 uppercase">{lvl.l}</span><span className="font-black text-emerald-400">{lvl.v}</span></div>
                ))}
              </div>
            </Card>
            <Card><STitle icon={Zap} label="Market Sentiment" color="text-cyan-400" />
              <div className="space-y-3">
                {market && (
                  <>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Demand</span>
                      <Tag color="bg-cyan-500/10 text-cyan-400 border-cyan-400/20">{market.currentDemand || 'High Demand'}</Tag>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Growth Rate</span>
                      <span className="text-emerald-400 font-black">{market.growthRate || '5-8% annually'}</span>
                    </div>
                    {market.futureScope && <p className="text-slate-400 text-xs italic px-2 border-l-2 border-cyan-400/30">{market.futureScope}</p>}
                  </>
                )}
              </div>
            </Card>
            <Card><STitle icon={Shield} label="Risk Assessment" color="text-orange-400" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">AI Risk</p><p className="text-sm font-bold text-white">{risk?.automationRisk || 'Moderate'}</p></div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Competition</p><p className="text-sm font-bold text-white">{risk?.competitionLevel || 'Moderate'}</p></div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card className="border-yellow-500/20">
            <STitle icon={Lightbulb} label="Short-term Action Plan" color="text-yellow-400" />
            <div className="space-y-5">
              {(actionPlan.next30Days && actionPlan.next30Days.length > 0) && (<div><p className="text-[10px] uppercase font-black text-slate-500 mb-3 tracking-widest">Next 30 Days Strategy</p><List items={actionPlan.next30Days} color="text-yellow-400" /></div>)}
              {actionPlan.midTerm && actionPlan.midTerm.length > 0 && (<div className="mt-4"><p className="text-[10px] uppercase font-black text-slate-500 mb-3 tracking-widest">Months 3-6 Focus</p><List items={actionPlan.midTerm} color="text-cyan-400" /></div>)}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card><STitle icon={Wrench} label="Practical Projects" color="text-teal-400" /><List items={projects && projects.length > 0 ? projects : ['Portfolio project', 'Real-world implementation', 'Capstone project']} icon={Star} color="text-teal-400" /></Card>
          <Card><STitle icon={Zap} label="Tools & Stack" color="text-purple-400" /><div className="flex flex-wrap gap-2">{(tools && tools.length > 0 ? tools : ['Industry tools', 'Frameworks', 'Platforms']).map((t: any, i: any) => <Tag key={i} color="bg-purple-500/10 text-purple-300 border-purple-500/20">{t}</Tag>)}</div></Card>
          <Card className="bg-red-500/5 border-red-500/20"><STitle icon={XCircle} label="Mistakes to Avoid" color="text-red-400" /><List items={mistakes && mistakes.length > 0 ? mistakes : ['Ignoring basics', 'Poor planning', 'Lack of practice']} icon={XCircle} color="text-red-400" /></Card>
        </div>

        <div className="space-y-6">
        {/* Career Resources Grid: Videos, Databases, Tools */}
        <div className="space-y-12">
          {/* 1. Career Learning Videos */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white flex items-center gap-2"><Play className="w-6 h-6 text-red-500" /> Career Learning Videos</h3>
                <Tag color="bg-red-500/20 text-red-300 border-red-500/30">{relatedVideos.length}+ Videos</Tag>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedVideos.map((v: any, i: number) => (
                <motion.a
                  key={videoPage * videosPerPage + i}
                  href={v.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' career guide')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-[1.5rem] p-5 group hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/20"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-red-600/30">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-red-400 font-black uppercase tracking-widest mb-1">#{videoPage * videosPerPage + i + 1}</p>
                      <h4 className="text-sm font-bold text-white leading-tight line-clamp-3 group-hover:text-red-300 transition-colors">
                        {v.title || `${name} Industry Insights`}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors">
                    <ChevronRight className="w-3 h-3" />
                    <span>Watch Professional Insights</span>
                  </div>
                </motion.a>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/10">
                <button onClick={() => setVideoPage(Math.max(0, videoPage - 1))} disabled={videoPage === 0} className="px-6 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all">← Previous</button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, page) => (
                    <button key={page} onClick={() => setVideoPage(page)} className={`w-8 h-8 rounded-lg font-bold transition-all ${videoPage === page ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{page + 1}</button>
                  ))}
                </div>
                <button onClick={() => setVideoPage(Math.min(totalPages - 1, videoPage + 1))} disabled={videoPage === totalPages - 1} className="px-6 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all">Next →</button>
              </div>
            )}
          </div>

          {/* 2. Research Databases & Industry Papers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white flex items-center gap-2"><Globe className="w-6 h-6 text-emerald-500" /> Research Databases</h3>
                <Tag color="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Verified Sources</Tag>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: 'Google Scholar', url: `https://scholar.google.com/scholar?q=${encodeURIComponent(name + ' research papers')}`, desc: 'Search scholarly literature across disciplines', icon: 'GS' },
                { name: 'IEEE Xplore', url: `https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=${encodeURIComponent(name)}`, desc: 'Technical literature for engineering and tech', icon: 'IE' },
                { name: 'ACM Digital Library', url: `https://dl.acm.org/action/doSearch?AllField=${encodeURIComponent(name)}`, desc: 'Computing research and publications', icon: 'ACM' },
                { name: 'ScienceDirect', url: `https://www.sciencedirect.com/search?qs=${encodeURIComponent(name)}`, desc: 'Scientific, technical, and medical research', icon: 'SD' },
                { name: 'ResearchGate', url: `https://www.researchgate.net/search?q=${encodeURIComponent(name)}`, desc: 'Access publications and connect with researchers', icon: 'RG' }
              ].map((db, i) => (
                <motion.a
                  key={i}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-[1.5rem] p-5 group hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-all">
                      <span className="font-black text-emerald-400 text-xs">{db.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{db.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">{db.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Database</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* 3. Academic Writing & Documentation Tools */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white flex items-center gap-2"><BookOpen className="w-6 h-6 text-blue-500" /> Academic Writing Tools</h3>
                <Tag color="bg-blue-500/20 text-blue-300 border-blue-500/30">Industry Standard</Tag>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: 'Overleaf (LaTeX)', url: 'https://www.overleaf.com/', desc: 'Collaborative cloud-based LaTeX editor for papers', icon: 'OL' },
                { name: 'Zotero', url: 'https://www.zotero.org/', desc: 'Personal research assistant to manage references', icon: 'ZO' },
                { name: 'Grammarly', url: 'https://www.grammarly.com/', desc: 'AI-powered writing assistant for clarity and grammar', icon: 'GR' },
                { name: 'Mendeley', url: 'https://www.mendeley.com/', desc: 'Reference manager and academic social network', icon: 'ME' },
                { name: 'Hemingway Editor', url: 'https://hemingwayapp.com/', desc: 'Make your writing bold and clear', icon: 'HE' }
              ].map((tool, i) => (
                <motion.a
                  key={i}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-[1.5rem] p-5 group hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-all">
                      <span className="font-black text-blue-400 text-xs">{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{tool.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">{tool.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 group-hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>Access Tool</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function CareerResultContent() {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const savedId = searchParams.get('id')

  const [result, setResult] = useState<any>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAlreadySaved, setIsAlreadySaved] = useState(false)
  const [pdfToken, setPdfToken] = useState<string>('')
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)

  const checkSavedStatus = useCallback(async (careerName: string) => {
    if (!user || savedId) {
      setIsAlreadySaved(!!savedId)
      return
    }
    try {
      const { count } = await supabase
        .from('career_predictions')
        .select('*', { count: 'exact', head: true })
        .eq('firebase_uid', user.uid)
        .eq('career_name', careerName)

      setIsAlreadySaved(!!(count && count > 0))
    } catch (err) {
      console.error('Check saved error:', err)
    }
  }, [user, savedId])

  const load = useCallback(async () => {
    if (!user) return
    setFetching(true)
    setError(null)
    try {
      if (!supabase) {
        throw new Error('Database connection unavailable')
      }

      if (savedId) {
        const { data, error: fetchError } = await supabase.from('career_predictions').select('*').eq('id', savedId)
        if (fetchError) throw fetchError
        if (data && data.length > 0) {
          setResult({
            success: true,
            analysis: { recommendedStreams: [data[0].analysis_data], summary: { topCareer: data[0].career_name } },
            personalityType: 'Saved Result'
          })
        } else {
          throw new Error('Prediction not found')
        }
      } else {
        const { data: profileList, error: profileError } = await supabase.from('profiles').select('*').eq('firebase_uid', user.uid)
        const { data: quizList, error: quizError } = await supabase.from('career_quiz_responses').select('*').eq('firebase_uid', user.uid)

        const profile = profileList && profileList.length > 0 ? profileList[0] : null
        const quiz = quizList && quizList.length > 0 ? quizList[0] : null

        if (!profile || !quiz) throw new Error('Profile or Quiz data missing')
        const res = await fetch('/api/career-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile, quiz }) })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Analysis failed')
        setResult(data)
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred')
    } finally {
      setFetching(false)
    }
  }, [user, savedId])

  useEffect(() => { if (!loading && user) load(); else if (!loading && !user) router.push('/auth/signin?next=/career-result') }, [user, loading, load, router])

  // Generate PDF token on mount
  useEffect(() => {
    const token = generateCareerPredictionToken()
    setPdfToken(token)
  }, [])

  useEffect(() => {
    if (result) {
      const items = result.analysis.recommendedStreams || result.analysis.recommendedCourses || result.analysis.recommendedPaths || result.analysis.careers || []
      const getName = (it: any) => it.careerName || it.pathName || it.streamName || it.courseName || 'Path'
      if (items[selected]) {
        checkSavedStatus(getName(items[selected]))
      }
    }
  }, [result, selected, checkSavedStatus])

  const [loadingStep, setLoadingStep] = useState(0)
  
  useEffect(() => {
    const loadingSteps = [
      'Decoding Profile Data...',
      'Analyzing Cognitive Patterns...',
      'Matching Global Datasets...',
      'Synthesizing Predictions...',
      'Finalizing Result...'
    ]
    if (loading || fetching) {
      const interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingSteps.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [loading, fetching])

  const stepsList = [
    'Decoding Profile Data...',
    'Analyzing Cognitive Patterns...',
    'Matching Global Datasets...',
    'Synthesizing Predictions...',
    'Finalizing Result...'
  ]

  if (loading || fetching) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-14 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Core */}
      <div className="relative group z-10">
        <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-[3rem] flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.4)] overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          {/* Inner glowing core */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20"></div>
          
          {/* Spinning rings around the brain */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-[150%] h-[150%] border border-white/10 rounded-[4rem] border-t-white/40" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[180%] h-[180%] border border-indigo-400/20 rounded-[5rem] border-b-indigo-400/50" />
          
          <Brain className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 animate-pulse" />
        </div>
      </div>

      {/* Text Sequence & Progress */}
      <div className="flex flex-col items-center gap-6 z-10">
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStep}
              initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="text-white font-black tracking-[0.2em] uppercase text-sm drop-shadow-md text-center"
            >
              {stepsList[loadingStep]}
            </motion.p>
          </AnimatePresence>
        </div>
        
        {/* Futuristic Progress Bar */}
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 relative"
          >
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-white mb-2">Error Loading Result</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">{error}</p>
      <button onClick={() => router.push('/career-prediction')} className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">BACK</button>
    </div>
  )

  if (!result) return null
  const { analysis, stage, personalityType } = result

  // Always read from 'careers' — unified key
  const items = analysis.careers || analysis.recommendedStreams || analysis.recommendedCourses || analysis.recommendedPaths || []
  const getName = (it: any) => it.careerName || it.pathName || it.streamName || it.courseName || 'Path'

  // Extract next-step context from first item (same for all 3)
  const nextStepLabel = items[0]?.nextStepLabel || null
  const currentEducation = items[0]?.currentEducation || null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <style jsx global>{`
        @media print {
          .no-print, nav, aside, button { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-slate-950 { background: white !important; }
          .text-white { color: black !important; }
          .border-white/10 { border-color: #eee !important; }
          .bg-gradient-to-br { background: #f8fafc !important; color: black !important; border: 1px solid #ddd !important; }
          .print-header { display: block !important; }
          .token-display { display: block !important; color: black !important; opacity: 1 !important; }
        }
        .print-header { display: none; }
        .token-display { display: none; }
      `}</style>
      <Navbar />

      {/* Print-only Header */}
      <div className="print-header hidden w-full py-6 border-b-2 border-slate-900 mb-8">
        <div className="px-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">FutureMatrix Career Prediction Report</h1>
              <p className="text-sm font-bold text-slate-600">Official Career Analysis & Roadmap</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="token-display mt-4 p-3 bg-slate-100 border border-slate-300 rounded">
            <p className="text-[10px] font-bold text-slate-900">VALIDATION TOKEN:</p>
            <p className="text-xs font-mono text-slate-800 break-all">{pdfToken}</p>
          </div>
        </div>
      </div>

      {/* Hidden token metadata for PDF embedding */}
      <div className="hidden" style={{ display: 'none' }}>
        <p>FM-AI-CP-{pdfToken}</p>
      </div>
      <div className="pt-32 pb-12 border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20"><Award className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-4xl font-black text-white tracking-tight">Career <span className="text-indigo-400">Mastery Hub</span></h1></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              GO HOME
            </button>
            <button onClick={() => router.push('/career-prediction')} className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">RETRAIN AI</button>
          </div>
        </div>
      </div>
      {/* AI Prediction Context Card */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden"
        >
          {/* Top bar — Education Journey */}
          <div className="flex flex-col sm:flex-row items-stretch border-b border-white/5">
            <div className="flex items-center gap-4 px-6 py-4 flex-1 border-r border-white/5">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-0.5">Current Education</p>
                <p className="text-white font-black text-base leading-none">{currentEducation || stage || 'Your education level'}</p>
              </div>
            </div>

            <div className="flex items-center justify-center px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <div className="w-6 h-px bg-gradient-to-r from-indigo-400 to-cyan-400" />
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <div className="w-6 h-px bg-gradient-to-r from-cyan-400 to-purple-400" />
                <div className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 flex-1 justify-end border-l border-white/5">
              <div className="text-right">
                <p className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-0.5">AI Predicted</p>
                <p className="text-white font-black text-base leading-none">{items.length} Next Step Options</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/20 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* Predicted Options Row */}
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Predicted Next Steps — Based on Your Skills & Interests</p>
            <div className="flex flex-wrap gap-3">
              {items.map((it: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all group ${selected === i ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10'}`}
                >
                  <span className={`text-[9px] font-black ${scoreColor(it.matchScore)}`}>#{i + 1}</span>
                  <span className={`text-xs font-black transition-colors ${selected === i ? 'text-white' : 'text-white/70 group-hover:text-indigo-300'}`}>{getName(it)}</span>
                  {it.careerType && <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-black">{it.careerType}</span>}
                  {it.duration && <span className="text-[8px] text-slate-500 font-black">⏱ {it.duration}</span>}
                  <span className={`text-xs font-black ml-1 ${scoreColor(it.matchScore)}`}>{it.matchScore}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prediction basis */}
          <div className="px-6 py-3 flex flex-wrap gap-4 items-center">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Prediction based on:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ✓ Education Level
              </span>
              <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ✓ Skills & Strengths
              </span>
              <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                ✓ Interests
              </span>
              <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ✓ Quiz Personality
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-12">
        {/* Sticky Sidebar — Quick Navigator */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-[180px] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-4">Quick Navigate</p>
            {items.map((it: any, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setSelected(i)
                  window.scrollTo({ top: 300, behavior: 'smooth' })
                }}
                className={`block w-full text-left p-5 rounded-[1.5rem] border transition-all hover:scale-[1.01] ${selected === i ? 'bg-indigo-500/20 border-indigo-500/50 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:border-white/10'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-500">CAREER #{i + 1}</span>
                  <span className={`text-sm font-black ${scoreColor(it.matchScore)}`}>{it.matchScore}%</span>
                </div>
                <p className="font-black text-sm leading-tight mb-2">{getName(it)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {it.careerType && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {it.careerType}
                    </span>
                  )}
                  {it.duration && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      ⏱ {it.duration}
                    </span>
                  )}
                </div>
              </button>
            ))}

            <div className="pt-4 space-y-3 border-t border-white/10">
              <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-white/10">
                <Download className="w-4 h-4" /> DOWNLOAD PDF
              </button>
              <button
                onClick={() => {
                  setIsGeneratingRoadmap(true)
                  const it = items[selected]
                  const careerName = getName(it)
                  toast.success('Initializing AI Roadmap Generator...')
                  setTimeout(() => {
                    router.push(`/roadmap-result?career=${encodeURIComponent(careerName)}`)
                  }, 1500)
                }}
                disabled={isGeneratingRoadmap}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isGeneratingRoadmap ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02]'}`}
              >
                {isGeneratingRoadmap ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                {isGeneratingRoadmap ? 'PREPARING...' : 'GENERATE ROADMAP'}
              </button>
              {isAlreadySaved ? (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-[10px] font-black tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> SAVED
                </div>
              ) : (
                <button
                  disabled={isSaving}
                  onClick={async () => {
                    try {
                      setIsSaving(true)
                      if (!supabase) throw new Error('Database connection unavailable')
                      const it = items[selected]
                      const predictionId = (it as any).dbId
                      if (predictionId) {
                        const { error } = await supabase.from('career_predictions').update({ is_saved_by_user: true }).eq('id', predictionId)
                        if (error) throw error
                      } else {
                        const { data: existingResults } = await supabase.from('career_results').select('id').eq('firebase_uid', user.uid).order('created_at', { ascending: false }).limit(1)
                        let resultId = existingResults?.[0]?.id
                        if (!resultId) {
                          const { data: newRes } = await supabase.from('career_results').insert({ firebase_uid: user.uid, personality_type: personalityType || 'Balanced', top_match_score: it.matchScore }).select().single()
                          resultId = newRes?.id
                        }
                        const { error } = await supabase.from('career_predictions').insert({ result_id: resultId, firebase_uid: user.uid, career_name: getName(it), match_score: it.matchScore, analysis_data: it, rank: selected + 1, is_saved_by_user: true })
                        if (error) throw error
                      }
                      setIsAlreadySaved(true)
                      setShowSuccess(true)
                      toast.success('Career result saved to your dashboard!')
                      setTimeout(() => setShowSuccess(false), 3000)
                    } catch (err: any) {
                      toast.error('Save failed: ' + (err.message || 'Database error'))
                    } finally {
                      setIsSaving(false)
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black tracking-widest transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  {isSaving ? 'SAVING...' : 'SAVE TO DASHBOARD'}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content — ONLY 1 career shown at a time */}
        <main className="flex-1 min-w-0">
          <section id={`career-${selected}`} className="scroll-mt-56">
            {/* Career number divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Career Prediction</span>
                <span className={`text-base font-black ${scoreColor(items[selected]?.matchScore || 0)}`}>#{selected + 1}</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            {items[selected] && (
              <CareerDetail item={items[selected]} idx={selected} personality={personalityType || 'Balanced'} />
            )}
          </section>
        </main>
      </div>

      {/* Custom Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-[0_20px_50px_rgba(16,185,129,0.4)] flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Successfully saved to your dashboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CareerResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CareerResultContent />
    </Suspense>
  )
}
