
import React, { useRef, useState } from 'react';
import { Upload, ListOrdered, CheckCircle2, FileText, Sparkles, ChevronRight, Loader2, WifiOff } from 'lucide-react';
import { extractCv, matchCandidate } from '../services/api';
import { MOCK_INTERNSHIPS } from '../constants';
import type { CvExtractResult, MatchResult, SkillId } from '../types';

/** Skills assumed when the backend is unreachable (offline demo mode). */
const FALLBACK_SKILLS: SkillId[] = ['react', 'nodejs', 'python', 'aws', 'docker', 'kubernetes'];

/**
 * Offline fallback: same HSCR/SGI set math as the backend, computed against
 * the mock catalog tags, so the wizard still demos without FastAPI running.
 */
const localFallbackMatches = (skills: SkillId[]): MatchResult[] => {
  const candidate = new Set(skills.map(s => s.toLowerCase()));
  const tokens = (list: string[]) =>
    new Set(list.flatMap(s => s.toLowerCase().replace(/-/g, ' ').split(/[\s./]+/)));

  return MOCK_INTERNSHIPS.map(job => {
    const required = (job.skills ?? job.tags).map(t => t.toLowerCase());
    const matched = required.filter(r => candidate.has(r));
    const hscr = required.length ? matched.length / required.length : 1;
    const a = tokens([...candidate]);
    const b = tokens(required);
    const overlap = [...a].filter(t => b.has(t)).length;
    const union = new Set([...a, ...b]).size;
    return {
      jobId: job.id,
      company: job.company,
      role: job.title,
      hscr,
      sgi: 1 - hscr,
      sssa: union ? overlap / union : 0,
      matchedSkills: matched,
      missingSkills: required.filter(r => !candidate.has(r)),
    };
  })
    .sort((x, y) => y.hscr - x.hscr || y.sssa - x.sssa)
    .slice(0, 3);
};

const KPI_META: { key: keyof Pick<MatchResult, 'hscr' | 'sgi' | 'sssa'>; label: string; title: string; color: string; bar: string }[] = [
  { key: 'hscr', label: 'HSCR', title: 'Hard Skill Coverage', color: 'text-resin-cyan', bar: 'bg-resin-cyan' },
  { key: 'sgi', label: 'SGI', title: 'Skill Gap Index', color: 'text-resin-amber', bar: 'bg-resin-amber' },
  { key: 'sssa', label: 'SSSA', title: 'Semantic Alignment', color: 'text-resin-purple', bar: 'bg-resin-purple' },
];

const pct = (v: number) => `${Math.round(v * 100)}%`;

const SmartMatchPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractResult, setExtractResult] = useState<CvExtractResult | null>(null);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [offline, setOffline] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { num: 1, label: 'CV Upload', icon: <FileText size={20} /> },
    { num: 2, label: 'Preferences', icon: <ListOrdered size={20} /> },
    { num: 3, label: 'Match Results', icon: <CheckCircle2 size={20} /> },
  ];

  const candidateSkills = extractResult?.skills.length ? extractResult.skills : FALLBACK_SKILLS;

  const handleFileSelected = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setExtractResult(null);
    setMatches(null);
  };

  const handleNext = async () => {
    if (step === 1 && !file) {
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    try {
      if (step === 1 && file) {
        try {
          setExtractResult(await extractCv(file));
          setOffline(false);
        } catch {
          setExtractResult({ skills: FALLBACK_SKILLS, gpa: null, education: [], experience: [] });
          setOffline(true);
        }
      }
      if (step === 2) {
        try {
          setMatches(await matchCandidate(candidateSkills));
          setOffline(false);
        } catch {
          setMatches(localFallbackMatches(candidateSkills));
          setOffline(true);
        }
      }
      setStep(s => Math.min(3, s + 1));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-resin-cyan text-xs font-medium mb-6">
            <Sparkles size={14} /> AI Propelled Matching
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">SmartMatch AI Catalyst</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Complete our 3-step workflow to unlock precise internship alignments tailored to your unique profile.</p>
        </header>

        {/* Stepper */}
        <div className="flex justify-between mb-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.num ? 'bg-resin-cyan text-black scale-110 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-resin-bg border border-white/20 text-gray-500'}`}
              >
                {s.icon}
              </div>
              <span className={`mt-4 text-xs font-medium ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Workflow Content */}
        <div className="glass-card p-12 rounded-[40px] mb-12 min-h-[400px] flex flex-col justify-center relative">
          {isProcessing && (
            <div className="absolute inset-0 z-20 glass-card rounded-[40px] flex flex-col items-center justify-center bg-resin-bg/60 backdrop-blur-xl animate-[fadeIn_0.2s]">
              <Loader2 size={48} className="text-resin-cyan animate-spin mb-4" />
              <p className="text-sm font-medium text-white">
                {step === 1 ? 'Extracting CV Layout...' : 'Computing HSCR / SGI / SSSA...'}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s]">
              <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center mb-8 border border-white/10">
                <Upload size={32} className="text-resin-cyan" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Upload your Resume / CV</h3>
              <p className="text-gray-400 mb-10 max-w-sm">Our backend parses your PDF layout, maps skills to a normalized taxonomy, and builds your candidate profile.</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelected(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`w-full max-w-md border-2 border-dashed rounded-[32px] p-12 transition-all cursor-pointer group flex flex-col items-center justify-center
                ${file ? 'border-resin-cyan bg-resin-cyan/5' : 'border-white/10 hover:border-resin-cyan/50'}`}
              >
                <p className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors mb-2">
                  {file ? 'File Received' : 'Drag PDF or click to select'}
                </p>
                {file && (
                  <>
                    <span className="text-resin-cyan font-semibold">{file.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB</span>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeIn_0.3s]">
              <h3 className="text-2xl font-semibold mb-6">Rank your Ambitions</h3>
              <p className="text-gray-400 mb-8">Based on your extracted profile, we've identified these focus areas. Your skill set feeds the matching engine on the next step.</p>

              <div className="mb-10">
                <p className="text-sm font-medium text-resin-cyan mb-4">
                  Skills detected from your CV {offline && '(demo profile — backend offline)'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidateSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-resin-cyan/10 border border-resin-cyan/20 rounded-full text-xs text-resin-cyan font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                {extractResult?.gpa != null && (
                  <p className="text-sm text-gray-500 mt-3">GPA detected: {extractResult.gpa.toFixed(2)}</p>
                )}
              </div>

              <div className="space-y-4 mb-4">
                {['Distributed Systems Associate @ Agoda', 'UI/UX Design Intern @ Lineman', 'Data Science Intern @ SCB 10X'].map((item, i) => (
                  <div key={item} className="p-5 glass-card rounded-2xl flex items-center gap-6 cursor-grab active:cursor-grabbing hover:translate-x-2 transition-all group">
                    <span className="text-resin-cyan font-mono text-xl opacity-40 group-hover:opacity-100">0{i+1}</span>
                    <span className="font-semibold flex-1">{item}</span>
                    <ListOrdered size={16} className="text-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeIn_0.3s] text-center">
               <div className="w-24 h-24 bg-resin-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-resin-cyan/20">
                <Sparkles size={40} className="text-resin-cyan" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Matches Synthesized</h3>
              <p className="text-gray-400 mb-6">Each placement is scored on three KPIs: hard skill coverage, skill gap, and semantic alignment.</p>

              {offline && (
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-resin-amber/10 border border-resin-amber/20 rounded-full text-resin-amber text-xs font-medium">
                  <WifiOff size={12} /> Offline demo mode — start the FastAPI backend for real scores
                </div>
              )}

              <div className="space-y-6 max-w-2xl mx-auto mb-12">
                {(matches ?? []).map((match) => (
                  <div key={match.jobId} className="p-8 glass-card rounded-[24px] border-white/5 hover:border-resin-cyan/30 text-left transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{match.company}</h4>
                        <p className="text-xs text-gray-500">{match.role}</p>
                      </div>
                    </div>

                    {/* Multi-KPI panel: HSCR / SGI / SSSA */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {KPI_META.map(kpi => (
                        <div key={kpi.key} className="p-4 bg-white/5 rounded-2xl">
                          <p className="text-[0.7rem] font-mono text-gray-500 mb-1" title={kpi.title}>{kpi.label}</p>
                          <p className={`text-xl font-semibold ${kpi.color}`}>{pct(match[kpi.key])}</p>
                          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${kpi.bar}`} style={{ width: pct(match[kpi.key]) }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-resin-cyan/10 border border-resin-cyan/20 rounded-full text-xs text-resin-cyan font-medium">✓ {s}</span>
                      ))}
                      {match.missingSkills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500 font-medium">− {s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1 || isProcessing}
            className={`text-sm font-medium transition-all ${step === 1 ? 'opacity-0' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            className="bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-resin-cyan transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {step === 1 && !file ? 'Select CV File' : step === 3 ? 'Go to Dashboard' : 'Continue Workflow'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartMatchPage;
