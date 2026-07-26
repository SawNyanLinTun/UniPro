import type { ScholarshipAlumni, ScholarshipTrack } from '../types';

export const SCHOLARSHIP_TRACKS: {
  id: ScholarshipTrack;
  label: string;
}[] = [
  { id: 'web_development', label: 'Web Development' },
  { id: 'accounting', label: 'Accounting' },
  { id: 'engineering', label: 'Engineering' },
];

export const RADAR_AXES: { key: keyof import('../types').CvRadarScores; label: string }[] = [
  { key: 'technicalSkills', label: 'Technical Skills' },
  { key: 'experienceDepth', label: 'Experience Depth' },
  { key: 'projects', label: 'Projects' },
  { key: 'softSkills', label: 'Soft Skills' },
  { key: 'academicStrength', label: 'Academic Strength' },
  { key: 'toolsStack', label: 'Tools Stack' },
];

/** Demo profile skills used when the student picks "use profile CV". */
export const DEMO_PROFILE_SKILLS = [
  'react',
  'typescript',
  'nodejs',
  'git',
  'communication',
  'python',
];

export const MOCK_SCHOLARSHIP_ALUMNI: ScholarshipAlumni[] = [
  {
    id: 'alum-wd-1',
    track: 'web_development',
    maskedName: 'S****k T.',
    nameHash: 'a3f1c9e82b7d4e01f56a8c3d9e2b7f10c4d8a1e6b9f2c7d0e5a8b3c6d9f1e4a2',
    companyLabel: 'Agoda',
    companyHash: '7c2e9a1b4d6f8e0a3c5b7d9e1f2a4c6b8d0e2f4a6c8b0d2e4f6a8c0b2d4e6f8',
    scholarshipYear: 2024,
    role: 'Full Stack Intern',
    skills: ['react', 'typescript', 'nodejs', 'aws', 'docker', 'git', 'communication', 'system-design'],
    radar: {
      technicalSkills: 92,
      experienceDepth: 78,
      projects: 88,
      softSkills: 74,
      academicStrength: 86,
      toolsStack: 90,
    },
  },
  {
    id: 'alum-wd-2',
    track: 'web_development',
    maskedName: 'P****a W.',
    nameHash: 'b8e2d1c0a9f7e6d5c4b3a2918077665544332211ffeeddccbbaa9988776655',
    companyLabel: 'LINE MAN Wongnai',
    companyHash: '1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80',
    scholarshipYear: 2023,
    role: 'Frontend Intern',
    skills: ['react', 'figma', 'typescript', 'css', 'git', 'ux', 'communication'],
    radar: {
      technicalSkills: 85,
      experienceDepth: 70,
      projects: 92,
      softSkills: 80,
      academicStrength: 82,
      toolsStack: 76,
    },
  },
  {
    id: 'alum-ac-1',
    track: 'accounting',
    maskedName: 'N****n C.',
    nameHash: 'c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8',
    companyLabel: 'PwC Thailand',
    companyHash: '9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b4a39281706f5e4d3c2b1a0',
    scholarshipYear: 2024,
    role: 'Audit Intern',
    skills: ['excel', 'ifrs', 'audit', 'sap', 'communication', 'analytics', 'tax'],
    radar: {
      technicalSkills: 80,
      experienceDepth: 84,
      projects: 68,
      softSkills: 88,
      academicStrength: 94,
      toolsStack: 72,
    },
  },
  {
    id: 'alum-ac-2',
    track: 'accounting',
    maskedName: 'K****a R.',
    nameHash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    companyLabel: 'Deloitte',
    companyHash: '0a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789',
    scholarshipYear: 2023,
    role: 'Tax Advisory Intern',
    skills: ['tax', 'excel', 'powerbi', 'communication', 'ifrs', 'analytics'],
    radar: {
      technicalSkills: 76,
      experienceDepth: 80,
      projects: 72,
      softSkills: 90,
      academicStrength: 91,
      toolsStack: 70,
    },
  },
  {
    id: 'alum-en-1',
    track: 'engineering',
    maskedName: 'T****i M.',
    nameHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    companyLabel: 'SCG',
    companyHash: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    scholarshipYear: 2024,
    role: 'Process Engineering Intern',
    skills: ['cad', 'matlab', 'python', 'lean', 'communication', 'safety', 'six-sigma'],
    radar: {
      technicalSkills: 88,
      experienceDepth: 82,
      projects: 75,
      softSkills: 70,
      academicStrength: 90,
      toolsStack: 84,
    },
  },
  {
    id: 'alum-en-2',
    track: 'engineering',
    maskedName: 'A****a S.',
    nameHash: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
    companyLabel: 'Toyota Thailand',
    companyHash: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
    scholarshipYear: 2023,
    role: 'Quality Engineering Intern',
    skills: ['six-sigma', 'lean', 'python', 'excel', 'communication', 'cad'],
    radar: {
      technicalSkills: 82,
      experienceDepth: 86,
      projects: 70,
      softSkills: 78,
      academicStrength: 87,
      toolsStack: 80,
    },
  },
];
