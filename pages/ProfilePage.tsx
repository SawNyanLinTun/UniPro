
import React, { useEffect, useState } from 'react';
import { User, Settings, FileText, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
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
      <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
        <div className="max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-resin-cyan animate-spin mb-4" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            <section className="glass-card p-12 rounded-[60px] flex items-center gap-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-resin-cyan to-resin-purple flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-resin-bg flex items-center justify-center overflow-hidden">
                   <User size={64} className="text-white/20" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight mb-2">{profile.fullName}</h1>
                <p className="text-sm text-resin-cyan font-medium">
                  {profile.degree}{profile.degree && profile.university ? ' @ ' : ''}{profile.university}
                </p>
                {offline && (
                  <p className="text-xs text-resin-amber mt-2">Demo profile — backend offline</p>
                )}
                <div className="flex gap-4 mt-6">
                  <button className="text-xs font-medium border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10">Edit Profile</button>
                  <button className="text-xs font-medium border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10">Settings</button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[40px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold flex items-center gap-3"><FileText size={20} className="text-resin-cyan" /> CV / Resume</h3>
                  <button className="text-sm text-resin-cyan hover:underline">Update</button>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                  <FileText className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{profile.cvFileName ?? 'resume.pdf'}</p>
                    <p className="text-xs text-gray-500">Updated 2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[40px]">
                <h3 className="text-xl font-semibold mb-8 flex items-center gap-3"><Briefcase size={20} className="text-resin-purple" /> Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-xs text-gray-500 mb-1">Match Score</p>
                    <p className="text-2xl font-semibold">94%</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-xs text-gray-500 mb-1">Applied</p>
                    <p className="text-2xl font-semibold">08</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
             <div className="glass-card p-8 rounded-[40px]">
                <h3 className="text-sm font-medium text-resin-cyan mb-6">Education</h3>
                <div className="flex gap-4 mb-6">
                  <GraduationCap className="text-gray-500 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium">{profile.university}</p>
                    <p className="text-xs text-gray-500">{profile.degree}</p>
                    <p className="text-xs text-gray-500">Graduation {profile.graduationYear}</p>
                  </div>
                </div>
             </div>

             <div className="glass-card p-8 rounded-[40px]">
                <h3 className="text-sm font-medium text-resin-cyan mb-6">Skill Inventory</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">
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
