import React, { useMemo, useRef, useState } from 'react';
import {
  Award,
  Code2,
  Calculator,
  Cpu,
  Link2,
  Upload,
  Coins,
  ChevronRight,
  Lock,
  Unlock,
  FileText,
  X,
} from 'lucide-react';
import CvRadarChart from '../components/CvRadarChart';
import {
  DEMO_PROFILE_SKILLS,
  MOCK_SCHOLARSHIP_ALUMNI,
  SCHOLARSHIP_TRACKS,
} from '../constants/scholarshipLedger';
import { truncateHash } from '../services/hashDisplay';
import { getTokenBalance, spendToken } from '../services/tokenWallet';
import { inferSkillsFromFileName, scoreCandidateRadar } from '../services/cvRadarScore';
import type { CvRadarScores, ScholarshipAlumni, ScholarshipTrack, SkillId } from '../types';

const TRACK_ICONS: Record<ScholarshipTrack, React.ReactNode> = {
  web_development: <Code2 size={16} />,
  accounting: <Calculator size={16} />,
  engineering: <Cpu size={16} />,
};

const ScholarshipLedgerPage: React.FC = () => {
  const [track, setTrack] = useState<ScholarshipTrack>('web_development');
  const [selected, setSelected] = useState<ScholarshipAlumni | null>(null);
  const [tokenBalance, setTokenBalance] = useState(() => getTokenBalance());
  const [cvSource, setCvSource] = useState<'none' | 'upload' | 'profile'>('none');
  const [fileName, setFileName] = useState<string | null>(null);
  const [candidateSkills, setCandidateSkills] = useState<SkillId[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [candidateRadar, setCandidateRadar] = useState<CvRadarScores | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const alumni = useMemo(
    () => MOCK_SCHOLARSHIP_ALUMNI.filter(a => a.track === track),
    [track],
  );

  const openCompare = (alum: ScholarshipAlumni) => {
    setSelected(alum);
    setCvSource('none');
    setFileName(null);
    setCandidateSkills([]);
    setUnlocked(false);
    setCandidateRadar(null);
    setError(null);
  };

  const closeCompare = () => {
    setSelected(null);
    setError(null);
  };

  const handleUseProfile = () => {
    setCvSource('profile');
    setFileName('profile_cv.pdf');
    setCandidateSkills(DEMO_PROFILE_SKILLS);
    setUnlocked(false);
    setCandidateRadar(null);
    setError(null);
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    setCvSource('upload');
    setFileName(file.name);
    setCandidateSkills(inferSkillsFromFileName(file.name));
    setUnlocked(false);
    setCandidateRadar(null);
    setError(null);
  };

  const handleUnlock = () => {
    if (!selected) return;
    if (cvSource === 'none' || candidateSkills.length === 0) {
      setError('Upload a CV or use your profile CV first.');
      return;
    }
    if (!spendToken(1)) {
      setError('Not enough tokens. You need 1 UniPro token to unlock the true radar.');
      setTokenBalance(getTokenBalance());
      return;
    }
    const scores = scoreCandidateRadar(candidateSkills, selected.skills, selected.radar);
    setCandidateRadar(scores);
    setUnlocked(true);
    setTokenBalance(getTokenBalance());
    setError(null);
  };

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-muted border border-primary-muted text-primary text-xs font-semibold mb-4">
              <Award size={14} /> Scholarship Ledger
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3">Scholarship alumni</h1>
            <p className="text-text-secondary max-w-2xl">
              See what past scholarship winners studied and how your CV compares. Unlock the full radar to see your coverage score.
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl px-5 py-4 flex items-center gap-3 self-start">
            <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
              <Coins size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-text-muted">UniPro Tokens</p>
              <p className="text-2xl font-bold text-accent">{tokenBalance}</p>
            </div>
          </div>
        </header>

        {/* Track switcher */}
        <div className="flex flex-wrap gap-2 mb-12">
          {SCHOLARSHIP_TRACKS.map(t => {
            const active = track === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTrack(t.id);
                  closeCompare();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-secondary hover:text-text hover:border-border-strong'
                }`}
              >
                {TRACK_ICONS[t.id]}
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Alumni list */}
          <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-4`}>
            {alumni.map(alum => (
              <button
                key={alum.id}
                onClick={() => openCompare(alum)}
                className={`w-full text-left bg-surface border border-border rounded-2xl p-5 transition-all hover:border-border-strong ${
                  selected?.id === alum.id ? 'border-primary bg-primary-muted' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center text-primary shrink-0">
                      {TRACK_ICONS[alum.track]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-text">{alum.maskedName}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[0.7rem] font-medium text-text-secondary">
                          <Link2 size={10} /> Verified
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{alum.role} · {alum.companyLabel}</p>
                      <div className="space-y-1 font-mono text-xs text-text-muted">
                        <p>Name hash · {truncateHash(alum.nameHash)}</p>
                        <p>Company hash · {truncateHash(alum.companyHash)}</p>
                        <p>Year · {alum.scholarshipYear}</p>
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary shrink-0">
                    Compare <ChevronRight size={14} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Compare panel */}
          {selected && (
            <div className="lg:col-span-3 bg-surface border border-border rounded-2xl p-6 md:p-8 relative animate-[fadeIn_0.3s]">
              <button
                onClick={closeCompare}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-text transition-colors"
                aria-label="Close compare"
              >
                <X size={18} />
              </button>

              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                CV Compare
              </p>
              <h2 className="font-display text-xl font-bold text-text mb-2">
                You vs {selected.maskedName}
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                The radar shows your skill overlap. Spend 1 token to reveal your exact coverage score.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    cvSource === 'upload' ? 'bg-primary-muted border border-primary text-primary' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text'
                  }`}
                >
                  <Upload size={16} /> Upload CV
                </button>
                <button
                  onClick={handleUseProfile}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    cvSource === 'profile' ? 'bg-primary-muted border border-primary text-primary' : 'bg-surface-elevated border border-border text-text-secondary hover:text-text'
                  }`}
                >
                  <FileText size={16} /> Use profile CV
                </button>
              </div>

              {fileName && (
                <p className="text-sm text-text-muted mb-6">
                  Source: <span className="text-primary">{fileName}</span>
                </p>
              )}

              <div className="flex flex-col items-center mb-6">
                <CvRadarChart
                  alumni={selected.radar}
                  candidate={candidateRadar}
                  locked={!unlocked}
                  size={260}
                />
                <div className="flex gap-6 mt-4 text-xs font-medium text-text-muted">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1 rounded bg-text-secondary" /> Alumni
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1 rounded bg-primary" /> Your CV
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-error mb-4">{error}</p>
              )}

              {!unlocked ? (
                <button
                  onClick={handleUnlock}
                  className="w-full bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock size={16} /> Unlock compare · 1 token
                </button>
              ) : (
                <div className="text-center text-sm font-medium text-primary flex items-center justify-center gap-2">
                  <Lock size={14} /> Radar unlocked · {tokenBalance} tokens left
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipLedgerPage;
