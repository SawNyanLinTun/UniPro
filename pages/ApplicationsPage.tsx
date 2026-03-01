
import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

const ApplicationsPage: React.FC = () => {
  const applications = [
    { id: '1', role: 'Software Engineer', company: 'Agoda', status: 'interview', date: 'Mar 15, 2024' },
    { id: '2', role: 'UI/UX Designer', company: 'Lineman Wongnai', status: 'under_review', date: 'Mar 12, 2024' },
    { id: '3', role: 'Data Analyst', company: 'Shopee', status: 'applied', date: 'Mar 10, 2024' },
  ];

  const statusMap = {
    applied: { label: 'Applied', color: 'text-resin-cyan', bg: 'bg-resin-cyan/10' },
    under_review: { label: 'Under Review', color: 'text-resin-purple', bg: 'bg-resin-purple/10' },
    interview: { label: 'Interviewing', color: 'text-resin-amber', bg: 'bg-resin-amber/10' },
    accepted: { label: 'Offer Received', color: 'text-green-400', bg: 'bg-green-400/10' },
    rejected: { label: 'Closed', color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter mb-12">Track Applications</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Total Submitted', val: '08' },
            { label: 'Interviews', val: '02' },
            { label: 'Under Review', val: '04' },
            { label: 'Offers', val: '01' }
          ].map(stat => (
            <div key={stat.label} className="glass-card p-8 rounded-[32px]">
              <p className="font-mono text-[0.6rem] text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-4xl font-black">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[40px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 font-mono text-[0.6rem] uppercase text-gray-500 tracking-widest">
              <tr>
                <th className="px-10 py-6">Internship Position</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Submitted</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map(app => (
                <tr key={app.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-10 py-8">
                    <p className="font-bold text-lg mb-1">{app.role}</p>
                    <p className="text-xs text-gray-500 font-mono uppercase">{app.company}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[0.6rem] font-mono uppercase tracking-widest ${statusMap[app.status as keyof typeof statusMap].bg} ${statusMap[app.status as keyof typeof statusMap].color}`}>
                      {statusMap[app.status as keyof typeof statusMap].label}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} /> {app.date}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="text-gray-500 group-hover:text-resin-cyan transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
