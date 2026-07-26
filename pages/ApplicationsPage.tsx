import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Loader2, WifiOff, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getApplications } from '../services/api';
import { Application, ApplicationStatus } from '../types';

const FALLBACK: Application[] = [
  { id: '1', internshipId: '1', role: 'Software Engineer', company: 'Agoda', status: 'interview', appliedDate: 'Mar 15, 2024' },
  { id: '2', internshipId: '2', role: 'UI/UX Designer', company: 'Lineman Wongnai', status: 'under_review', appliedDate: 'Mar 12, 2024' },
  { id: '3', internshipId: '3', role: 'Data Analyst', company: 'Shopee', status: 'applied', appliedDate: 'Mar 10, 2024' },
];

const statusMap: Record<ApplicationStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  applied: { label: 'Applied', color: 'text-primary', bg: 'bg-primary-muted', icon: <Send size={12} /> },
  under_review: { label: 'Under review', color: 'text-text-secondary', bg: 'bg-surface-elevated', icon: <Clock size={12} /> },
  interview: { label: 'Interviewing', color: 'text-accent', bg: 'bg-accent-muted', icon: <CheckCircle2 size={12} /> },
  accepted: { label: 'Offer received', color: 'text-success', bg: 'bg-success-muted', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Closed', color: 'text-error', bg: 'bg-error-muted', icon: <XCircle size={12} /> },
};

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getApplications('1')
      .then(data => {
        if (!cancelled) {
          setApplications(data.length ? data : FALLBACK);
          setOffline(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApplications(FALLBACK);
          setOffline(true);
        }
      })
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    offers: applications.filter(a => a.status === 'accepted').length,
  };

  const statItems = [
    { label: 'Submitted', val: stats.total },
    { label: 'Interviews', val: stats.interviews },
    { label: 'Under review', val: stats.underReview },
    { label: 'Offers', val: stats.offers },
  ];

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-2">Applications</h1>
            <p className="text-text-secondary">Track every role you have applied to.</p>
          </div>
          {offline && (
            <span className="inline-flex items-center gap-2 text-xs text-accent">
              <WifiOff size={12} /> Demo mode
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statItems.map(stat => (
            <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5">
              <p className="text-xs text-text-muted mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-text">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="border-b border-border text-xs text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Position</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Submitted</th>
                  <th className="px-6 py-4 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <Loader2 size={32} className="text-primary animate-spin mx-auto mb-3" />
                      <p className="text-sm text-text-muted">Loading applications...</p>
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.id} className="group hover:bg-surface-elevated transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-medium text-text">{app.role}</p>
                        <p className="text-xs text-text-muted">{app.company}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusMap[app.status].bg} ${statusMap[app.status].color}`}>
                          {statusMap[app.status].icon} {statusMap[app.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Calendar size={14} /> {app.appliedDate}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-text-muted hover:text-primary transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
