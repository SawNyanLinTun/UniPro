import React, { useRef, useState } from 'react';
import { Upload, ListOrdered, CheckCircle2, FileText, Sparkles, ChevronRight, Loader2, WifiOff, ArrowRight } from 'lucide-react';
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
  { key: 'hscr', label: 'Coverage', title: 'Hard Skill Coverage', color: 'text-primary', bar: 'bg-primary' },
  { key: 'sgi', label: 'Gap', title: 'Skill Gap Index', color: 'text-accent', bar: 'bg-accent' },
  { key: 'sssa', label: 'Alignment', title: 'Semantic Alignment', color: 'text-text-secondary', bar: 'bg-text-secondary' },
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
    { num: 1, label: 'Upload CV' },
    { num: 2, label: 'Review skills' },
    { num: 3, label: 'See matches' },
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
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-muted border border-primary-muted text-primary text-xs font-semibold mb-4">
            <Sparkles size={14} /> SmartMatch
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3">Upload your CV, get matched</h1>
          <p className="text-text-secondary max-w-lg mx-auto">We compare your skills against each opening and rank the roles where you are strongest.</p>
        </header>

        {/* Stepper */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center bg-bg px-2">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= s.num ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted'
                }`}
              >
                {s.num}
              </div>
              <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-text' : 'text-text-muted'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Workflow Content */}
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 mb-8 min-h-[400px] flex flex-col justify-center relative">
          {isProcessing && (
            <div className="absolute inset-0 z-20 bg-surface/90 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center animate-[fadeIn_0.2s]">
              <Loader2 size={40} className="text-primary animate-spin mb-3" />
              <p className="text-sm font-medium text-text">
                {step === 1 ? 'Reading your CV...' : 'Finding your best matches...'}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s]">
              <div className="w-14 h-14 bg-primary-muted rounded-xl flex items-center justify-center mb-6">
                <Upload size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text mb-2">Upload your resume</h3>
              <p className="text-text-secondary text-sm mb-8 max-w-sm">PDF or text files work best. We extract your skills and education to build your profile.</p>

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
                className={`w-full max-w-md border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer group flex flex-col items-center justify-center
                ${file ? 'border-primary bg-primary-muted' : 'border-border hover:border-primary'}`}
              >
                <p className="text-sm font-medium text-text-secondary group-hover:text-text transition-colors mb-1">
                  {file ? 'File ready' : 'Drag PDF here or click to browse'}
                </p>
                {file && (
                  <>
                    <span className="text-primary font-semibold text-sm">{file.name}</span>
                    <span className="text-xs text-text-muted mt-1">{(file.size / 1024).toFixed(0)} KB</span>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeIn_0.3s]">
              <h3 className="font-display text-xl font-semibold text-text mb-2">Review your skills</h3>
              <p className="text-text-secondary text-sm mb-8">Here is what we found. We use these to score your fit against each role.</p>

              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Skills detected {offline && '(demo profile)'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidateSkills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-primary-muted border border-primary-muted rounded-full text-xs text-primary font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                {extractResult?.gpa != null && (
                  <p className="text-sm text-text-muted mt-4">GPA detected: {extractResult.gpa.toFixed(2)}</p>
                )}
              </div>

              <div className="bg-surface-elevated border border-border rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Your top priorities</p>
                <div className="space-y-2">
                  {['Distributed Systems Associate @ Agoda', 'UI/UX Design Intern @ Lineman', 'Data Science Intern @ SCB 10X'].map((item, i) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="text-text-muted font-mono w-5">0{i+1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeIn_0.3s] text-center">
              <div className="w-14 h-14 bg-primary-muted rounded-xl flex items-center justify-center mx-auto mb-5">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-text mb-2">Your top matches</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">Ranked by how well your CV lines up with each role.</p>

              {offline && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-accent-muted border border-accent-muted rounded-full text-accent text-xs font-medium">
                  <WifiOff size={12} /> Demo mode — connect the backend for live scoring
                </div>
              )}

              <div className="space-y-4 max-w-2xl mx-auto mb-8 text-left">
                {(matches ?? []).map((match) => (
                  <div key={match.jobId} className="bg-surface-elevated border border-border rounded-xl p-5 hover:border-border-strong transition-colors">
                    <div className="mb-4">
                      <h4 className="font-display font-semibold text-text">{match.company}</h4>
                      <p className="text-xs text-text-muted">{match.role}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {KPI_META.map(kpi => (
                        <div key={kpi.key} className="bg-surface border border-border rounded-lg p-3">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-muted mb-1" title={kpi.title}>{kpi.label}</p>
                          <p className={`text-lg font-bold ${kpi.color}`}>{pct(match[kpi.key])}</p>
                          <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                            <div className={`h-full ${kpi.bar}`} style={{ width: pct(match[kpi.key]) }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.slice(0, 5).map(s => (
                        <span key={s} className="px-2 py-1 bg-primary-muted border border-primary-muted rounded-full text-xs text-primary font-medium">{s}</span>
                      ))}
                      {match.missingSkills.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-1 bg-surface border border-border rounded-full text-xs text-text-muted">{s}</span>
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
            className={`text-sm font-medium transition-colors ${step === 1 ? 'opacity-0' : 'text-text-muted hover:text-text disabled:opacity-30'}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {step === 1 && !file ? 'Select a file' : step === 3 ? 'Go to dashboard' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartMatchPage;
