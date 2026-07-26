import type { CvRadarScores, SkillId } from '../types';

const AXIS_SKILL_GROUPS: Record<keyof CvRadarScores, string[]> = {
  technicalSkills: ['react', 'typescript', 'nodejs', 'python', 'go', 'matlab', 'ifrs', 'audit', 'tax', 'system-design'],
  experienceDepth: ['internship', 'work', 'lean', 'six-sigma', 'audit', 'system-design'],
  projects: ['react', 'figma', 'powerbi', 'cad', 'docker', 'aws', 'projects'],
  softSkills: ['communication', 'ux', 'leadership', 'teamwork'],
  academicStrength: ['gpa', 'academic', 'ifrs', 'matlab', 'analytics'],
  toolsStack: ['git', 'docker', 'aws', 'excel', 'sap', 'powerbi', 'cad', 'css'],
};

/**
 * Demo coverage scorer: maps candidate skill overlap onto the 6 radar axes (0–100).
 * Alumni baseline is provided separately; this returns the new student's scores.
 */
export function scoreCandidateRadar(
  candidateSkills: SkillId[],
  alumniSkills: SkillId[],
  alumniRadar: CvRadarScores,
): CvRadarScores {
  const candidate = new Set(candidateSkills.map(s => s.toLowerCase()));
  const alumni = new Set(alumniSkills.map(s => s.toLowerCase()));

  const scoreAxis = (key: keyof CvRadarScores): number => {
    const group = AXIS_SKILL_GROUPS[key];
    const relevantAlumni = group.filter(s => alumni.has(s) || alumniSkills.some(a => a.toLowerCase().includes(s)));
    const pool = relevantAlumni.length ? relevantAlumni : group.slice(0, 3);
    const hits = pool.filter(s => candidate.has(s) || [...candidate].some(c => c.includes(s) || s.includes(c))).length;
    const ratio = pool.length ? hits / pool.length : 0.4;
    // Cap below alumni so the radar shows a coverage gap by default.
    return Math.round(Math.min(alumniRadar[key], alumniRadar[key] * (0.35 + ratio * 0.65)));
  };

  return {
    technicalSkills: scoreAxis('technicalSkills'),
    experienceDepth: scoreAxis('experienceDepth'),
    projects: scoreAxis('projects'),
    softSkills: scoreAxis('softSkills'),
    academicStrength: scoreAxis('academicStrength'),
    toolsStack: scoreAxis('toolsStack'),
  };
}

/** Lightweight skill guess from a filename / free text for upload demo. */
export function inferSkillsFromFileName(name: string): SkillId[] {
  const lower = name.toLowerCase();
  const skills: SkillId[] = ['communication', 'git'];
  if (/react|frontend|web/.test(lower)) skills.push('react', 'typescript', 'css');
  if (/node|full.?stack|backend/.test(lower)) skills.push('nodejs', 'typescript');
  if (/data|python|ml/.test(lower)) skills.push('python', 'analytics');
  if (/account|audit|tax|finance/.test(lower)) skills.push('excel', 'ifrs', 'audit', 'tax');
  if (/engineer|cad|mech|process/.test(lower)) skills.push('cad', 'matlab', 'lean');
  if (skills.length <= 2) skills.push('react', 'python', 'excel');
  return [...new Set(skills)];
}
