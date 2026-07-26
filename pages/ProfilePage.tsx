import React, { useEffect, useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Loader2, Pencil, Settings } from 'lucide-react';
import { getProfile } from '../services/api';
import { StudentProfile } from '../types';

const FALLBACK: StudentProfile = {
  id: '1',
  fullName: 'Supakorn Tech',
  university: 'Chulalongkorn University',
  degree: 'B.Eng Computer Engineering',
  graduationYear: 2025,
  gpa: 3.72,
  skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
  cvFileName: 'tech_resume_v2.pdf',
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile('1')
      .then(data => {
        if (!cancelled) {
          setProfile(data);
          setOffline(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(FALLBACK);
          setOffline(true);
        }
      })
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading || !profile) {
    return (
      <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
        <div className="max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-primary animate-spin mb-3" />
          <p className="text-sm text-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section className="bg-surface border border-border rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-primary-muted flex items-center justify-center shrink-0">
                  <User size={40} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="font-display text-2xl md:text-3xl font-bold text-text mb-1">{profile.fullName}</h1>
                      <p className="text-sm text-primary font-medium">
                        {profile.degree}{profile.degree && profile.university ? ' @ ' : ''}{profile.university}
                      </p>
                      {offline && (
                        <p className="text-xs text-accent mt-2">Demo profile — backend offline</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors">
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors">
                        <Settings size={14} /> Settings
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                    <span>GPA {profile.gpa.toFixed(2)}</span>
                    <span className="text-border">|</span>
                    <span>Graduation {profile.graduationYear}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-display font-semibold text-text flex items-center gap-2"><FileText size={18} className="text-primary" /> CV / Resume</h3>
                  <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">Update</button>
                </div>
                <div className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center">
                    <FileText className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{profile.cvFileName ?? 'resume.pdf'}</p>
                    <p className="text-xs text-text-muted">Updated 2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-display font-semibold text-text mb-5 flex items-center gap-2"><Briefcase size={18} className="text-primary" /> Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-elevated border border-border rounded-xl p-4">
                    <p className="text-xs text-text-muted mb-1">Match score</p>
                    <p className="text-2xl font-bold text-text">94%</p>
                  </div>
                  <div className="bg-surface-elevated border border-border rounded-xl p-4">
                    <p className="text-xs text-text-muted mb-1">Applied</p>
                    <p className="text-2xl font-bold text-text">8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
             <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-5">Education</h3>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-muted flex items-center justify-center shrink-0">
                    <GraduationCap className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{profile.university}</p>
                    <p className="text-xs text-text-secondary">{profile.degree}</p>
                    <p className="text-xs text-text-muted">Graduation {profile.graduationYear}</p>
                  </div>
                </div>
             </div>

             <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-5">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-surface-elevated border border-border rounded-full text-xs font-medium text-text-secondary">
                      {skill}
                    </span>
                  ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
