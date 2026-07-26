import type { Application, CvExtractResult, Internship, MatchResult, SkillId, StudentProfile } from '../types';

/**
 * Central client for the UniPro FastAPI backend.
 * Local dev: FastAPI on http://localhost:8000 (see backend/README.md).
 * Production: set VITE_API_URL to the deployed API base URL.
 */
const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new ApiError(`Backend unreachable at ${API_BASE}${path}`);
  }
  if (!response.ok) {
    throw new ApiError(`${path} failed: ${response.status} ${response.statusText}`, response.status);
  }
  return (await response.json()) as T;
}

/** Upload a real CV file; the backend parses it and maps text to the skill taxonomy. */
export async function extractCv(file: File): Promise<CvExtractResult> {
  const formData = new FormData();
  formData.append('file', file);
  return request<CvExtractResult>('/cv/extract', { method: 'POST', body: formData });
}

/** Score the candidate skill set against open jobs. Returns HSCR/SGI/SSSA per job. */
export async function matchCandidate(skills: SkillId[], topK = 3): Promise<MatchResult[]> {
  const data = await request<{ matches: MatchResult[] }>('/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills, top_k: topK }),
  });
  return data.matches;
}

export interface AdviceResult {
  recommendedCategories: string[];
  keySkills: string[];
  advice: string;
}

/** Career advice, proxied through the backend so the Gemini key stays server-side. */
export async function getAdvice(query: string): Promise<AdviceResult> {
  return request<AdviceResult>('/advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
}

/** All active job postings from the backend. */
export async function getJobs(): Promise<Internship[]> {
  return request<Internship[]>('/jobs');
}

/** Student profile plus latest CV skills. */
export async function getProfile(id: string): Promise<StudentProfile> {
  return request<StudentProfile>(`/profile/${id}`);
}

/** Application history for a student. */
export async function getApplications(studentId: string): Promise<Application[]> {
  return request<Application[]>(`/applications?student_id=${encodeURIComponent(studentId)}`);
}

/** Submit a new application for a job. */
export async function applyToJob(studentId: string, internshipId: string): Promise<Application> {
  return request<Application>('/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, internship_id: internshipId }),
  });
}
