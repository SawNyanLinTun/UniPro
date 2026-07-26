
import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, ArrowRight, Loader2, WifiOff } from 'lucide-react';
import { getApplications } from '../services/api';
import { Application, ApplicationStatus } from '../types';

const FALLBACK: Application[] = [
  { id: '1', internshipId: '1', role: 'Software Engineer', company: 'Agoda', status: 'interview', appliedDate: 'Mar 15, 2024' },
  { id: '2', internshipId: '2', role: 'UI/UX Designer', company: 'Lineman Wongnai', status: 'under_review', appliedDate: 'Mar 12, 2024' },
  { id: '3', internshipId: '3', role: 'Data Analyst', company: 'Shopee', status: 'applied', appliedDate: 'Mar 10, 2024' },
];

const statusMap: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  applied: { label: 'Applied', color: 'text-resin-cyan', bg: 'bg-resin-cyan/10' },
  under_review: { label: 'Under Review', color: 'text-resin-purple', bg: 'bg-resin-purple/10' },
  interview: { label: 'Interviewing', color: 'text-resin-amber', bg: 'bg-resin-amber/10' },
  accepted: { label: 'Offer Received', color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected: { label: 'Closed', color: 'text-red-400', bg: 'bg-red-400/10' },
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
    { label: 'Total Submitted', val: String(stats.total).padStart(2, '0') },
    { label: 'Interviews', val: String(stats.interviews).padStart(2, '0') },
    { label: 'Under Review', val: String(stats.underReview).padStart(2, '0') },
    { label: 'Offers', val: String(stats.offers).padStart(2, '0') },
  ];

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Track Applications</h1>
          {offline && (
            <span className="inline-flex items-center gap-2 text-xs text-resin-amber">
              <WifiOff size={12} /> Demo mode — backend offline
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {statItems.map(stat => (
            <div key={stat.label} className="glass-card p-8 rounded-[32px]">
              <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
              <p className="text-4xl font-semibold">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[40px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-xs text-gray-500">
              <tr>
                <th className="px-10 py-6">Internship Position</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Submitted</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <Loader2 size={32} className="text-resin-cyan animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading applications...</p>
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-10 py-8">
                      <p className="font-semibold text-lg mb-1">{app.role}</p>
                      <p className="text-xs text-gray-500">{app.company}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${statusMap[app.status].bg} ${statusMap[app.status].color}`}>
                        {statusMap[app.status].label}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} /> {app.appliedDate}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="text-gray-500 group-hover:text-resin-cyan transition-colors">
                        <ArrowRight size={20} />
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
  );
};

export default ApplicationsPage;
