'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useActivityTracking } from '@/lib/hooks/useActivityTracking'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { 
  Users, 
  TrendingUp, 
  Activity, 
  LogOut, 
  BarChart3, 
  Download, 
  Loader2, 
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  Brain,
  GraduationCap,
  BookOpen,
  PieChart as PieIcon,
  Search,
  Globe
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'

// Modularized Components
import CollegeManagement from '@/components/admin/CollegeManagement'
import LearningProcessManagement from '@/components/admin/LearningProcessManagement'
import { useAuth } from '@/contexts/AuthContext'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

type TabType = 'dashboard' | 'colleges' | 'learning-resources' | 'analytics'

function AdminContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabType) || 'dashboard'
  const { signOut } = useAuth()
  
  const adminTrackingUser =
    typeof window !== 'undefined' ? localStorage.getItem('adminEmail') || 'admin' : 'admin'
  
  useActivityTracking('Admin Console', adminTrackingUser)
  
  const [isAdminAuth, setIsAdminAuth] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    conversionRate: 0,
    activeSession: 0,
    collegePartnerships: 0,
    predictionsMade: 0,
    avgMatchScore: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<'report' | 'export' | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [lastSync, setLastSync] = useState<string>('')
  const [analyticsData, setAnalyticsData] = useState<{
    eduData: Array<{ name: string; value: number }>,
    topCareers: Array<{ name: string; count: number }>,
    pageViewsTrend: Array<{ date: string; count: number }>
  }>({ eduData: [], topCareers: [], pageViewsTrend: [] })

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('API Sync Failed')
      const data = await response.json()
      setStats(data.stats)
      if (data.analytics) {
        setAnalyticsData(data.analytics)
      }
      setLastSync(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Sync Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const adminAuth = localStorage.getItem('fm_admin_authenticated')
    const email = localStorage.getItem('fm_admin_email')
    
    if (adminAuth === 'true' && email) {
      setIsAdminAuth(true)
      setAdminEmail(email)
      fetchStats()
    } else {
      setIsAdminAuth(false)
      setTimeout(() => router.push('/auth/signin'), 300)
    }
    setIsMounted(true)
    setIsChecking(false)
  }, [router])

  const handleTabChange = (tab: TabType) => {
    router.push(`/admin?tab=${tab}`)
  }

  const handleGenerateReport = async () => {
    setActionLoading('report')
    try {
      const doc = new jsPDF()
      doc.setFillColor(3, 7, 18)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text('FUTUREMATRIX AI', 15, 25)
      doc.setFontSize(10)
      doc.text('System Intelligence & Analytics Report', 15, 32)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.text('Core Platform Metrics', 15, 55)
      autoTable(doc, {
        startY: 60,
        head: [['Metric', 'Value', 'Status']],
        body: [
          ['Total Users', stats.totalUsers.toString(), 'Verified'],
          ['Active Sessions (24h)', stats.activeSession.toString(), 'Live'],
          ['AI Predictions', stats.predictionsMade.toString(), 'Healthy'],
          ['Avg Match Score', `${stats.avgMatchScore}%`, 'Optimized']
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }
      })
      doc.save(`FutureMatrix_Report_${Date.now()}.pdf`)
      setActionMessage({ type: 'success', text: '✅ PDF report generated!' })
    } catch (error) {
      setActionMessage({ type: 'error', text: '❌ Report failed' })
    } finally {
      setActionLoading(null)
      setTimeout(() => setActionMessage(null), 3000)
    }
  }

  const handleExportData = async () => {
    setActionLoading('export')
    try {
      const { data: allProfiles } = await supabase.from('profiles').select('*')
      const exportData = { metadata: { project: "FutureMatrix AI", date: new Date().toISOString() }, stats, profiles: allProfiles }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const element = document.createElement('a')
      element.href = url
      element.download = `futurematrix-export-${Date.now()}.json`
      element.click()
      setActionMessage({ type: 'success', text: '✅ Data exported!' })
    } catch (error) {
      setActionMessage({ type: 'error', text: '❌ Export failed' })
    } finally {
      setActionLoading(null)
      setTimeout(() => setActionMessage(null), 3000)
    }
  }

  const handleSignOut = async () => {
    localStorage.removeItem('fm_admin_authenticated')
    localStorage.removeItem('fm_admin_email')
    setIsAdminAuth(false)
    signOut().catch(e => console.error('Error signing out', e))
    router.push('/')
  }

  if (!isMounted || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712]">
        <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!isAdminAuth) return null

  const navigation = [
    { name: 'Dashboard', id: 'dashboard' as TabType, icon: LayoutDashboard },
    { name: 'Colleges', id: 'colleges' as TabType, icon: GraduationCap },
    { name: 'Resources', id: 'learning-resources' as TabType, icon: BookOpen },
    { name: 'Analytics', id: 'analytics' as TabType, icon: PieIcon }
  ]

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-cyan-400 to-blue-500' },
    { title: 'Platform Reach', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'from-fuchsia-400 to-purple-600' },
    { title: 'Active Today', value: stats.activeSession, icon: Activity, color: 'from-emerald-400 to-teal-600' },
    { title: 'Predictions', value: stats.predictionsMade, icon: Brain, color: 'from-amber-400 to-orange-500' }
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.15),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%)]" />

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase">FutureMatrix</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">FutureMatrix Advanced Access</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden flex-col items-end sm:flex mr-4">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{adminEmail}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">{lastSync ? `SYNCED: ${lastSync}` : 'SYNCING...'}</p>
            </div>
            <button onClick={handleSignOut} className="group flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-white">
              <LogOut className="h-4 w-4" />
              EXIT
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Live Platform Intelligence
                </div>
                <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl mb-4 uppercase">
                  Control <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Center.</span>
                </h2>
                <p className="text-slate-400 max-w-2xl text-lg font-medium">Real-time telemetry and core infrastructure management.</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {statCards.map((stat, index) => (
                  <motion.div 
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-xl mb-6 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.title}</p>
                    <h3 className="text-4xl font-black text-white">{loading ? '---' : stat.value}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 overflow-hidden rounded-[3rem] border border-white/10 bg-[#0c1222]/50 p-10 backdrop-blur-3xl relative">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4 mb-10 uppercase tracking-tighter">
                    <ShieldCheck className="h-8 w-8 text-cyan-400" />
                    Strategic Commands
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <button onClick={handleGenerateReport} disabled={actionLoading === 'report'} className="group flex flex-col items-start gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-cyan-400/40 hover:bg-white/10 disabled:opacity-50">
                      <div className="h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                        {actionLoading === 'report' ? <Loader2 className="h-6 w-6 animate-spin" /> : <BarChart3 className="h-6 w-6" />}
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">Generate Intelligence Report</h4>
                    </button>
                    <button onClick={handleExportData} disabled={actionLoading === 'export'} className="group flex flex-col items-start gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-emerald-400/40 hover:bg-white/10 disabled:opacity-50">
                      <div className="h-12 w-12 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                        {actionLoading === 'export' ? <Loader2 className="h-6 w-6 animate-spin" /> : <Download className="h-6 w-6" />}
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">Export Core Database</h4>
                    </button>
                  </div>
                  {actionMessage && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 p-4 rounded-2xl border text-sm font-bold ${actionMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      {actionMessage.text}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'colleges' && (
            <motion.div key="colleges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CollegeManagement />
            </motion.div>
          )}
          {activeTab === 'learning-resources' && (
            <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LearningProcessManagement />
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-6">
                  <PieIcon className="h-3 w-3 animate-pulse" />
                  Neural Analytics Suite
                </div>
                <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl mb-4 uppercase">
                  Deep <span className="bg-gradient-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Intelligence.</span>
                </h2>
                <p className="text-slate-400 max-w-2xl text-lg font-medium">Visualizing user behavior and platform growth metrics.</p>
              </div>

              {/* Traffic Trend Chart */}
              <div className="rounded-[3rem] border border-white/10 bg-slate-900/50 p-10 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <TrendingUp className="h-32 w-32 text-cyan-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  Traffic & Engagement (Last 7 Days)
                </h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                  {analyticsData.pageViewsTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.pageViewsTrend}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          fontWeight="bold" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          fontWeight="bold" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                          itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorViews)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-600">
                      <Activity className="h-12 w-12 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">No traffic data recorded in last 7 days</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Education Level Chart */}
                <div className="rounded-[3rem] border border-white/10 bg-slate-900/50 p-10 backdrop-blur-3xl">
                  <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-cyan-400" />
                    Education Distribution
                  </h3>
                  <div className="h-[400px] w-full flex items-center justify-center">
                    {analyticsData.eduData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.eduData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="rgba(255,255,255,0.05)"
                          >
                            {analyticsData.eduData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={[
                                '#22d3ee', // cyan
                                '#a855f7', // purple
                                '#f472b6', // pink
                                '#34d399', // emerald
                                '#fbbf24'  // amber
                              ][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-slate-600">
                        <GraduationCap className="h-12 w-12 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">User database empty</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Career Paths Chart */}
                <div className="rounded-[3rem] border border-white/10 bg-slate-900/50 p-10 backdrop-blur-3xl">
                  <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                    <Brain className="h-5 w-5 text-fuchsia-400" />
                    Top Career Predictions
                  </h3>
                  <div className="h-[400px] w-full flex items-center justify-center">
                    {analyticsData.topCareers.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.topCareers} layout="vertical" margin={{ left: 20, right: 40, top: 20, bottom: 20 }}>
                          <defs>
                            <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            fontWeight="bold" 
                            width={220}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="url(#colorBar)" 
                            radius={[0, 10, 10, 0]}
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-slate-600">
                        <Brain className="h-12 w-12 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No career data generated yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#030712]"><Loader2 className="h-12 w-12 text-cyan-400 animate-spin" /></div>}>
      <AdminContent />
    </Suspense>
  )
}
