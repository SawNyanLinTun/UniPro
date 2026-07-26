
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
  web_development: <Code2 size={18} />,
  accounting: <Calculator size={18} />,
  engineering: <Cpu size={18} />,
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
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-resin-cyan text-xs font-medium mb-6">
              <Award size={14} /> On-chain Scholarship Ledger
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Scholarship Ledger</h1>
            <p className="text-gray-400 max-w-2xl">
              Students who earned scholarships through UniPro — identity hashed on-chain. Compare your CV
              coverage against theirs on a radar chart. Unlocking the true answer costs 1 token.
            </p>
          </div>
          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-3 self-start">
            <Coins size={18} className="text-resin-amber" />
            <div>
              <p className="text-xs text-gray-500">UniPro Tokens</p>
              <p className="text-2xl font-semibold text-resin-amber">{tokenBalance}</p>
            </div>
          </div>
        </header>

        {/* Track switcher */}
        <div className="flex flex-wrap gap-3 mb-12">
          {SCHOLARSHIP_TRACKS.map(t => {
            const active = track === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTrack(t.id);
                  closeCompare();
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-resin-cyan text-black'
                    : 'glass-card text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {TRACK_ICONS[t.id]}
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Alumni list */}
          <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-4`}>
            {alumni.map(alum => (
              <button
                key={alum.id}
                onClick={() => openCompare(alum)}
                className={`w-full text-left glass-card p-6 rounded-[28px] transition-all hover:border-resin-cyan/30 ${
                  selected?.id === alum.id ? 'border-resin-cyan/40 bg-resin-cyan/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-resin-cyan">
                      {TRACK_ICONS[alum.track]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{alum.maskedName}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-resin-purple/10 border border-resin-purple/20 text-[0.7rem] font-medium text-resin-purple">
                          <Link2 size={10} /> On-chain
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{alum.role} · {alum.companyLabel}</p>
                      <div className="space-y-1 mono-data text-gray-500">
                        <p>Name hash · {truncateHash(alum.nameHash)}</p>
                        <p>Company hash · {truncateHash(alum.companyHash)}</p>
                        <p>Scholarship · {alum.scholarshipYear}</p>
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-resin-cyan shrink-0">
                    Compare CV <ChevronRight size={14} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Compare panel */}
          {selected && (
            <div className="lg:col-span-3 glass-card p-8 md:p-10 rounded-[40px] relative animate-[fadeIn_0.3s]">
              <button
                onClick={closeCompare}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
                aria-label="Close compare"
              >
                <X size={20} />
              </button>

              <p className="label text-resin-cyan mb-2">
                CV Coverage Compare
              </p>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                You vs {selected.maskedName}
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Results appear only as a radar. Spend 1 token to reveal how much your CV covers this scholarship alumni profile.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-medium transition-all ${
                    cvSource === 'upload' ? 'bg-resin-cyan/15 border border-resin-cyan/40 text-resin-cyan' : 'glass-card hover:bg-white/5'
                  }`}
                >
                  <Upload size={16} /> Upload CV
                </button>
                <button
                  onClick={handleUseProfile}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-medium transition-all ${
                    cvSource === 'profile' ? 'bg-resin-cyan/15 border border-resin-cyan/40 text-resin-cyan' : 'glass-card hover:bg-white/5'
                  }`}
                >
                  <FileText size={16} /> Use Profile CV
                </button>
              </div>

              {fileName && (
                <p className="text-sm text-gray-500 mb-6">
                  Source: <span className="text-resin-cyan">{fileName}</span>
                </p>
              )}

              <div className="flex flex-col items-center mb-8">
                <CvRadarChart
                  alumni={selected.radar}
                  candidate={candidateRadar}
                  locked={!unlocked}
                  size={300}
                />
                <div className="flex gap-6 mt-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1 rounded bg-resin-purple" /> Alumni
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1 rounded bg-resin-cyan" /> Your CV
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-red-400 mb-4">{error}</p>
              )}

              {!unlocked ? (
                <button
                  onClick={handleUnlock}
                  className="w-full bg-white text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-resin-cyan transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Unlock size={16} /> Unlock true compare · 1 token
                </button>
              ) : (
                <div className="text-center text-xs font-medium text-resin-cyan flex items-center justify-center gap-2">
                  <Lock size={14} /> True radar unlocked · {tokenBalance} tokens left
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
