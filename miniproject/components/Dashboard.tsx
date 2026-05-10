'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  ExternalLink, 
  Download, 
  History,
  TrendingUp,
  Award,
  UserCheck,
  School,
  BookOpen,
  Map,
  MapPin,
  Sparkles,
  ChevronRight,
  DollarSign,
  Star,
  Clock,
  BarChart3,
  LayoutGrid
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { supabase } from '@/lib/supabase-client'
import NeuralBackground from '@/components/NeuralBackground'
import FloatingShapes from '@/components/FloatingShapes'

// Neural Link Resolver for Direct Institution Access
const resolveCollegeWebsite = (name: string, currentWebsite?: string) => {
  const n = name.toLowerCase();
  // Layer 1: Hardcoded Master Mapping
  if (n.includes('dayananda sagar') && n.includes('engineering')) return 'https://www.dsce.edu.in';
  if (n.includes('dayananda sagar') && n.includes('university')) return 'https://www.dsu.edu.in';
  if (n.includes('bms') && n.includes('engineering')) return 'https://www.bmsce.ac.in';
  if (n.includes('ms ramaiah') || n.includes('m.s. ramaiah')) return 'https://www.msrit.edu';
  if (n.includes('rv college') || n.includes('r.v. college')) return 'https://www.rvce.edu.in';
  if (n.includes('pes university') || n.includes('p.e.s. university')) return 'https://www.pes.edu';
  
  // Layer 2: Sanitized Database URL
  if (currentWebsite && currentWebsite !== '#' && currentWebsite.length > 5 && !currentWebsite.includes('google.com/search')) {
    return currentWebsite.startsWith('http') ? currentWebsite : `https://${currentWebsite}`;
  }

  // Layer 3: Smart Domain Guessing
  const domain = n.replace(/[^a-z0-9]/g, '');
  if (n.includes('iit')) return `https://www.iit${domain.replace('iit', '')}.ac.in`;
  if (n.includes('nit')) return `https://www.nit${domain.replace('nit', '')}.ac.in`;
  
  // Final Fallback: "I'm Feeling Lucky" (Direct to first search result)
  return `https://www.google.com/search?btnI=1&q=${encodeURIComponent(name + ' official website')}`;
};

export default function Dashboard() {
  const { user } = useFirebaseAuth()
  const [profileName, setProfileName] = useState<string | null>(null)
  const [savedPredictions, setSavedPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // New Stats State
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [savedCollegesCount, setSavedCollegesCount] = useState(0)
  const [savedLearningCount, setSavedLearningCount] = useState(0)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([])
  const [savedColleges, setSavedColleges] = useState<any[]>([])
  const [savedResources, setSavedResources] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        if (!supabase) {
          console.warn('Supabase client not initialized')
          return
        }

        // Fetch Profile Data for Completion
        const { data: profileList, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('firebase_uid', user.uid)

        const profileData = profileList && profileList.length > 0 ? profileList[0] : null

        if (profileData) {
          setProfileName(profileData.full_name)
          
          // Calculate Profile Completion
          const sections = {
            header: !!profileData.full_name?.trim(),
            basic: !!(profileData.gender && profileData.country && profileData.state && profileData.phone),
            education: !!(profileData.education_level && profileData.course_stream && profileData.institution_name && profileData.academic_score),
            skills: Array.isArray(profileData.skills) && profileData.skills.length > 0,
            interests: Array.isArray(profileData.interests) && profileData.interests.length > 0
          }
          
          const completedCount = Object.values(sections).filter(Boolean).length
          setProfileCompletion(Math.round((completedCount / 5) * 100))
        } else {
          setProfileName(user.displayName || user.email?.split('@')[0] || 'User')
          setProfileCompletion(0)
        }

        // Fetch Saved Predictions
        const { data: predictions, error: predError } = await supabase
          .from('career_predictions')
          .select('*')
          .eq('firebase_uid', user.uid)
          .eq('is_saved_by_user', true)
          .order('created_at', { ascending: false })

        if (predictions) setSavedPredictions(predictions)

        // Fetch Saved Resumes
        const { data: resumes, error: resumeError } = await supabase
          .from('resume_analyses')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })

        if (resumes) setSavedResumes(resumes)

        // Fetch Saved Roadmaps
        const { data: roadmaps } = await supabase
          .from('saved_roadmaps')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(6)

        if (roadmaps) setSavedRoadmaps(roadmaps)

        // Fetch Saved Colleges using the internal API (Bypasses RLS issues)
        try {
          const res = await fetch(`/api/saved-colleges?userId=${user.uid}`)
          const data = await res.json()
          if (data.success) {
            // Map API format to component format
            const mappedColleges = data.savedColleges.map((sc: any) => ({
              id: sc.id,
              college_id: sc.collegeId,
              college_name: sc.collegeName,
              college_location: sc.collegeLocation,
              college_type: sc.collegeType,
              saved_at: sc.savedAt,
              website: sc.website,
              rating: sc.rating,
              fees: sc.fees,
              description: sc.description
            }))
            setSavedColleges(mappedColleges)
            setSavedCollegesCount(data.count || 0)
          }
        } catch (error) {
          console.error('Failed to sync saved institutions:', error)
        }

        // Fetch Saved Resources (Courses) via Internal API
        try {
          const res = await fetch(`/api/saved-resources?userId=${user.uid}`)
          const data = await res.json()
          if (data.success) {
            setSavedResources(data.savedResources)
            setSavedLearningCount(data.count || 0)
          }
        } catch (error) {
          console.error('Failed to sync saved resources:', error)
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-1]">
        <FloatingShapes />
        <NeuralBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712]" />
      </div>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[50vh] px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-2xl"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Strategic Command Center
          </motion.div>
 
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
            Welcome, <br />
            <span className="text-glow drop-shadow-[0_0_50px_rgba(34,211,238,0.2)]">
              {profileName || 'Strategist'}
            </span>
          </h1>
          <p className="mt-8 text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Your personalized <span className="text-white font-medium">career intelligence</span> hub is synchronized and ready for deployment.
          </p>

          {/* Advanced Intelligence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl mx-auto px-4">
            {[
              { label: 'Profile Status', val: `${profileCompletion}%`, icon: UserCheck, color: 'fuchsia', href: '/profile', progress: profileCompletion },
              { label: 'Predictions', val: savedPredictions.length, icon: TrendingUp, color: 'indigo', href: '/career-prediction', sub: 'Neural Engine' },
              { label: 'Resume Audits', val: savedResumes.length, icon: FileText, color: 'cyan', href: '/resume-analyzer', sub: 'ATS Analysis' },
              { label: 'Institutions', val: savedCollegesCount, icon: School, color: 'cyan', href: '/saved-colleges', sub: 'Global Reach' },
              { label: 'Learning Paths', val: savedLearningCount, icon: BookOpen, color: 'blue', href: '/learning-resources', sub: 'Skill Acquisition' },
              { label: 'Strategic Roadmaps', val: savedRoadmaps.length, icon: Map, color: 'indigo', href: '/career-roadmap', sub: 'Path Planning' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => window.location.href = stat.href}
                className="relative group p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] overflow-hidden"
              >
                {/* Decorative Glow */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 blur-3xl group-hover:bg-${stat.color}-500/20 transition-all duration-500`} />
                
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  {stat.sub && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">{stat.sub}</span>}
                </div>

                <div className="text-left">
                  <p className="text-4xl font-black text-white tracking-tighter mb-1">{stat.val}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>

                {stat.progress !== undefined && (
                  <div className="mt-6 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${stat.progress}%` }} 
                      className={`h-full bg-${stat.color}-500 shadow-[0_0_10px_rgba(stat.color===fuchsia?217,70,239:stat.color===indigo?99,102,241:34,211,238,0.5)]`} 
                    />
                  </div>
                )}
                
                <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ExternalLink className={`h-4 w-4 text-${stat.color}-400`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto mt-24 space-y-24">
        
        {/* Saved Predictions Section */}
        <section className="p-10 md:p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <TrendingUp className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Career Predictions</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Neural Intelligence Reports • Synchronized</p>
              </div>
            </div>
            {savedPredictions.length > 0 && (
              <div className="hidden md:block bg-indigo-500/5 border border-indigo-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                {savedPredictions.length} Active Modules
              </div>
            )}
          </div>

          {savedPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedPredictions.map((pred, i) => (
                <motion.div 
                  key={pred.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }} 
                  className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:border-indigo-500/50 transition-all duration-700 hover:bg-indigo-500/[0.02]"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-indigo-500 group-hover:text-black transition-all duration-500">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Created At</span>
                      <span className="text-[10px] font-bold text-white uppercase">{new Date(pred.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">{pred.career_name}</h3>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="h-1 w-12 bg-emerald-500/30 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${pred.match_score}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{pred.match_score}% Match</span>
                  </div>
                  
                  <button 
                    onClick={() => window.location.href = `/career-result?id=${pred.id}`} 
                    className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-white text-black rounded-2xl text-[10px] font-black hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
                  >
                    <ExternalLink className="h-4 w-4" /> Open Command File
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-24 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-white/5 border border-white/10">
                <TrendingUp className="h-10 w-10 text-slate-500" />
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Command Logs Empty • No Predictions Detected</p>
            </div>
          )}
        </section>

        {/* Saved Resumes Section */}
        <section className="p-10 md:p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <FileText className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Resume Audits</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">ATS Performance Logs • Verified</p>
              </div>
            </div>
            {savedResumes.length > 0 && (
              <div className="hidden md:block bg-cyan-500/5 border border-cyan-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-cyan-300 uppercase tracking-widest">
                {savedResumes.length} Active Audits
              </div>
            )}
          </div>

          {savedResumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedResumes.map((resume, i) => (
                <motion.div 
                  key={resume.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }} 
                  className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:border-cyan-500/50 transition-all duration-700 hover:bg-cyan-500/[0.02]"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-white leading-none mb-1 group-hover:text-cyan-400 transition-colors">{resume.score}</div>
                      <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">ATS Match Score</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{resume.file_name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-10">{resume.detected_role} • {new Date(resume.created_at).toLocaleDateString()}</p>
                  
                  <button 
                    onClick={() => {
                      localStorage.setItem('resume_analyzer_restore', JSON.stringify(resume.analysis_result));
                      window.location.href = '/resume-analyzer';
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-cyan-500 text-black rounded-2xl text-[10px] font-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20"
                  >
                    <History className="h-4 w-4" /> Restore Analytics
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-24 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-white/5 border border-white/10">
                <FileText className="h-10 w-10 text-slate-500" />
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">No Audit Data Found • System Ready</p>
              <button onClick={() => window.location.href = '/resume-analyzer'} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Initialize Audit</button>
            </div>
          )}
        </section>

        <section className="p-10 md:p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <Map className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Strategic Roadmaps</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Phase-Based Path Mapping • Operational</p>
              </div>
            </div>
            {savedRoadmaps.length > 0 && (
              <div className="hidden md:block bg-indigo-500/5 border border-indigo-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                {savedRoadmaps.length} Roadmap(s) Linked
              </div>
            )}
          </div>

          {savedRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedRoadmaps.map((rm, i) => (
                <motion.div key={rm.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:border-indigo-500/50 transition-all duration-700 hover:bg-indigo-500/[0.02]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-indigo-500 group-hover:text-black transition-all duration-500"><Map className="h-6 w-6" /></div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">{rm.stage_count || rm.roadmap_data?.roadmap?.length || '—'}</div>
                      <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Active Phases</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{rm.career_name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-10">{new Date(rm.created_at).toLocaleDateString()} • {rm.source || 'Neural AI'}</p>
                  <button onClick={() => window.location.href = `/roadmap-result?career=${encodeURIComponent(rm.career_name)}`} className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-indigo-500 text-white rounded-2xl text-[10px] font-black hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">Execute Roadmap</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-24 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-white/5 border border-white/10"><Map className="h-10 w-10 text-slate-500" /></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">No Roadmap Sequences Found</p>
              <button onClick={() => window.location.href = '/career-roadmap'} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Initialize Sequence</button>
            </div>
          )}
        </section>

        {/* Saved Institutions Section */}
        <section className="p-10 md:p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <School className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Target Institutions</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Global Educational Clusters • Selected</p>
              </div>
            </div>
            {savedColleges.length > 0 && (
              <div className="hidden md:block bg-cyan-500/5 border border-cyan-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-cyan-300 uppercase tracking-widest">
                {savedColleges.length} Clusters Locked
              </div>
            )}
          </div>

          {savedColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedColleges.map((college, i) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:border-cyan-500/50 transition-all duration-700 hover:bg-cyan-500/[0.02]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500"><School className="h-6 w-6" /></div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{college.college_type || 'Institution'}</div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[9px] font-black text-yellow-500"><Star className="h-3 w-3 fill-current" /> {college.rating || '4.0'}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 leading-tight">{college.college_name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 mb-8 uppercase tracking-widest text-[9px] font-black"><MapPin className="h-3 w-3 text-cyan-400" /> {college.college_location}</div>
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest"><DollarSign className="h-4 w-4" /> Est. Investment: {college.fees || 'TBD'}</div>
                    {college.description && <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 italic border-l-2 border-white/10 pl-4">{college.description}</p>}
                  </div>
                  <button onClick={() => window.open(resolveCollegeWebsite(college.college_name, college.website), '_blank')} className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-cyan-500 text-black rounded-2xl text-[10px] font-black hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-lg shadow-cyan-500/20">Establish Connection</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-24 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-white/5 border border-white/10"><School className="h-10 w-10 text-slate-500" /></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">No Institutions Saved • Database Scanned</p>
              <button onClick={() => window.location.href = '/colleges'} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Scan Clusters</button>
            </div>
          )}
        </section>

        {/* Saved Learning Resources Section */}
        <section className="p-10 md:p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Intelligence Vault</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Knowledge Assets & Skills • Secured</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {savedResources.length > 0 && (
                <button 
                  onClick={() => window.location.href = '/saved-courses'}
                  className="hidden md:flex items-center gap-2 bg-blue-500/5 border border-blue-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-blue-300 uppercase tracking-widest hover:bg-blue-500/10 transition-all"
                >
                  <LayoutGrid className="h-4 w-4" /> View Full Vault ({savedResources.length})
                </button>
              )}
            </div>
          </div>

          {savedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedResources.map((res, i) => (
                <motion.div key={res.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:border-blue-500/50 transition-all duration-700 hover:bg-blue-500/[0.02]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-blue-500 group-hover:text-black transition-all duration-500"><BookOpen className="h-6 w-6" /></div>
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">{res.difficulty || 'All Levels'}</div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 h-16 leading-tight">{res.course_title || res.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-10">{res.instructor || res.author} • {res.is_paid ? 'Premium' : 'Free'}</p>
                  <div className="grid grid-cols-2 gap-5 mb-10">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                      <Clock className="w-5 h-5 text-indigo-400 mb-2" />
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">{res.duration || 'Self-paced'}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                      <BarChart3 className="w-5 h-5 text-fuchsia-400 mb-2" />
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">{res.difficulty || 'Expert'}</p>
                    </div>
                  </div>
                  <button onClick={() => window.open(res.access_url || res.link || res.url, '_blank')} className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-blue-500 text-black rounded-2xl text-[10px] font-black hover:bg-blue-400 transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20">Access Intelligence</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-24 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02] text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-white/5 border border-white/10"><BookOpen className="h-10 w-10 text-slate-500" /></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">Intelligence Vault Offline • Harvest Required</p>
              <button onClick={() => window.location.href = '/learning-resources'} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Harvest Skills</button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
