$file = 'c:\Users\nagen\OneDrive\Documents\mini project\miniproject\app\page.tsx'
$lines = Get-Content $file -Encoding UTF8
$before = $lines[0..581]   # lines 1-582 (0-indexed)
$after  = $lines[821..($lines.Length - 1)]    # lines 822+ (0-indexed)

$newSection = @'
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionReveal>
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-fuchsia-200">How It Works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">A simple three-step journey to a better career decision.</h2>
          </div>
        </SectionReveal>
        <div className="relative">
          <div className="absolute left-6 right-6 top-1/2 hidden h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 opacity-40 lg:block" />
          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <SectionReveal key={step.title} delay={index * 0.08}>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/40">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Step {index + 1}</p>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionReveal>
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Live Demo</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Try a quick AI prediction right now.</h2>
          </div>
        </SectionReveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950/40 p-6 backdrop-blur-2xl shadow-[0_25px_110px_rgba(0,0,0,0.35)]">
              <div className="relative space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Your Name</p>
                  <input
                    type="text"
                    placeholder="Enter your name (optional)"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/40"
                  />
                </div>
                <label className="block">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Your Primary Interest</p>
                  <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    {interestOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={runPrediction}
                  disabled={isAnalyzing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(59,130,246,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-80"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isAnalyzing ? 'Analyzing...' : 'Predict Career'}
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Career fit score', 'Roadmap generation', 'Resume insights', 'Learning match'].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-950/40 p-6 backdrop-blur-2xl shadow-[0_25px_110px_rgba(0,0,0,0.35)]">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Prediction Result</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">Your AI-generated suggestion</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">Premium output</div>
              </div>
              <div className="relative mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div key="loading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex min-h-[280px] flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                        <Loader2 className="h-7 w-7 animate-spin" />
                      </div>
                      <p className="mt-5 text-lg font-semibold text-white">Analyzing...</p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-slate-300">We are comparing your profile against career patterns, skill signals, and high-fit pathways.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="min-h-[280px]">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Ready</div>
                        <p className="text-sm text-slate-400">{analysisMessage}</p>
                      </div>
                      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{prediction.title}</p>
                        <div className="mt-2 flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-2xl font-bold text-white">{prediction.role}</h4>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{prediction.description}</p>
                          </div>
                          <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200 md:block">
                            <Target className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {prediction.path.map((item, i) => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-xs font-semibold text-white">{i + 1}</div>
                              <p className="text-sm text-slate-200">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
'@

$newLines = $newSection -split "`n"
$combined = $before + $newLines + $after
[System.IO.File]::WriteAllLines($file, $combined, [System.Text.Encoding]::UTF8)
Write-Host "Done. File saved. Total lines: $($combined.Count)"
