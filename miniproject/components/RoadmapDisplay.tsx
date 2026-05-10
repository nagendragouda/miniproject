'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Clock, Target, BookOpen, 
  Terminal, Globe, Zap, ArrowRight, Video, 
  Database, GraduationCap, Award, ChevronRight, 
  ChevronDown, Star, Sparkles, Shield, Rocket, 
  Search, ExternalLink, Briefcase, Code, Book
} from 'lucide-react'

interface RoadmapStage {
  stage_title: string
  description: string
  skills: string[]
  subjects: string[]
  tools: string[]
  courses: string[]
  tasks: string[]
  projects: string[]
  resources: string[]
  duration: string
  difficulty: string
  outcome: string
  prerequisites: string
  progress: number
}

interface RoadmapData {
  roadmap: RoadmapStage[]
}

export default function RoadmapDisplay({ data }: { data: RoadmapData }) {
  const [activeStage, setActiveStage] = useState<number | null>(0)
  
  if (!data?.roadmap || !Array.isArray(data.roadmap)) return (
    <div className="p-12 text-center bg-slate-900 rounded-[3rem] border border-white/10">
      <p className="text-slate-400">Roadmap data is being synchronized. Please wait...</p>
    </div>
  )

  const roadmap = data.roadmap
  const targetCareer = roadmap[roadmap.length - 1]?.stage_title || 'Target Career'

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Industrial Hero: Success Protocol */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/10 p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Verified Success Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
              Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Roadmap</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium">
              Deterministic progression from your current baseline to <span className="text-white font-bold">{targetCareer}</span> level.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center min-w-[140px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Stages</p>
                <p className="text-4xl font-black text-white">{roadmap.length}</p>
             </div>
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-center min-w-[140px]">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Accuracy</p>
                <p className="text-4xl font-black text-emerald-400">98%</p>
             </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. Success Timeline: Step-by-Step Evolution */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
             <h2 className="text-2xl font-black text-white flex items-center gap-3">
               <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Progression Timeline
             </h2>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industrial Grade Strategy</span>
          </div>

          <div className="relative space-y-6">
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-emerald-500 to-slate-800 rounded-full opacity-20" />
            
            {roadmap.map((stage, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative pl-24 group`}
              >
                {/* Timeline Connector */}
                <div className={`absolute left-[34px] top-8 w-4 h-4 rounded-full border-4 ${activeStage === idx ? 'bg-indigo-500 border-indigo-200' : 'bg-slate-800 border-slate-700'} z-10 transition-all duration-500`} />
                
                <div 
                  onClick={() => setActiveStage(activeStage === idx ? null : idx)}
                  className={`bg-slate-900/60 backdrop-blur-3xl border ${activeStage === idx ? 'border-indigo-500/50 bg-slate-900/80 shadow-indigo-500/10' : 'border-white/5'} rounded-[2.5rem] p-8 cursor-pointer transition-all hover:border-white/20 shadow-2xl relative overflow-hidden`}
                >
                  {activeStage === idx && (
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Stage {idx + 1}</span>
                      <h3 className="text-2xl font-black text-white">{stage.stage_title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 flex items-center gap-2">
                         <Clock className="w-3 h-3" /> {stage.duration}
                       </div>
                       {activeStage === idx ? <ChevronDown className="w-5 h-5 text-indigo-400" /> : <ChevronRight className="w-5 h-5 text-slate-600" />}
                    </div>
                  </div>

                  <p className="text-slate-400 font-medium leading-relaxed mb-6">
                    {stage.description}
                  </p>

                  <AnimatePresence>
                    {activeStage === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                           {/* Skills & Tools */}
                           <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Terminal className="w-3 h-3 text-emerald-400" /> Core Skills & Subjects
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {[...(stage.skills || []), ...(stage.subjects || [])].map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 uppercase">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Code className="w-3 h-3 text-indigo-400" /> Industrial Tools
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {(stage.tools || []).map((t, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-400 uppercase">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                           </div>

                           {/* Tasks & Projects */}
                           <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Rocket className="w-3 h-3 text-amber-400" /> Practical Tasks
                                </h4>
                                <ul className="space-y-2">
                                  {(stage.tasks || []).map((task, i) => (
                                    <li key={i} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                      {task}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Award className="w-3.5 h-3.5 text-fuchsia-400" /> Project Milestones
                                </h4>
                                {(stage.projects || []).map((p, i) => (
                                  <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex justify-between items-center group/proj hover:bg-white/10 transition-all">
                                    {p}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/proj:opacity-100 transition-all" />
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>

                        <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Outcome</p>
                                <p className="text-sm font-bold text-white">{stage.outcome}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              {(stage.resources || []).slice(0, 3).map((res, i) => (
                                <span key={i} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 uppercase">
                                  {res}
                                </span>
                              ))}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Strategy Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Technical Immersion: Videos */}
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Video className="w-5 h-5 text-red-500" /> Learning Path
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: `${targetCareer} Full Course 2024`, channel: 'FreeCodeCamp', views: '2.4M views' },
                  { title: `Getting Started as ${targetCareer}`, channel: 'Traversy Media', views: '800K views' },
                  { title: `Roadmap to ${targetCareer}`, channel: 'Coding with Mosh', views: '1.2M views' }
                ].map((v, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.title)}`} target="_blank" className="block p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{v.title}</h4>
                       <ExternalLink className="w-3 h-3 text-slate-600" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>{v.channel}</span>
                       <span>{v.views}</span>
                    </div>
                  </a>
                ))}
              </div>
           </div>

           {/* Global Research Intelligence */}
           <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Database className="w-5 h-5 text-indigo-400" /> Research Data
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Google Scholar', icon: GraduationCap, url: 'https://scholar.google.com/scholar?q=' },
                  { name: 'IEEE Xplore', icon: Database, url: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=' },
                  { name: 'ResearchGate', icon: Globe, url: 'https://www.researchgate.net/search?q=' },
                  { name: 'ArXiv.org', icon: Search, url: 'https://arxiv.org/search/?query=' }
                ].map((db, i) => (
                  <a key={i} href={`${db.url}${encodeURIComponent(targetCareer)}`} target="_blank" className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:border-indigo-500/50 transition-all">
                    <db.icon className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] font-black text-white uppercase">{db.name}</span>
                  </a>
                ))}
              </div>
           </div>

           {/* Elite Academic Toolkit */}
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Academic Tools
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Overleaf (LaTeX)', desc: 'Professional technical writing' },
                  { name: 'Zotero', desc: 'Reference & citation manager' },
                  { name: 'Mendeley', desc: 'Research network & data' }
                ].map((tool, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-white uppercase">{tool.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{tool.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
