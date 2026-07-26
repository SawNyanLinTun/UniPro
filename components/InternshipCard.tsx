import React from 'react';
import { MapPin, Wallet } from 'lucide-react';
import { Internship } from '../types';

interface InternshipCardProps {
  internship: Internship;
  delay?: string;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, delay = "0s" }) => {
  return (
    <div 
      className="group bg-surface border border-border rounded-2xl p-6 transition-all duration-300 hover:border-border-strong hover:bg-surface-elevated hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] opacity-0 translate-y-4 animate-[revealUp_0.6s_ease-out_forwards]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-surface-elevated text-text-secondary border border-border">
          {internship.category}
        </span>
      </div>
      
      <h3 className="font-display font-semibold text-lg text-text mb-2 leading-tight group-hover:text-primary-light transition-colors">
        {internship.title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-2">
        {internship.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {internship.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-xs font-medium text-primary border border-primary-muted px-2 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-4 border-t border-border">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {internship.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Wallet size={13} />
          {internship.stipend}
        </span>
      </div>
    </div>
  );
};

export default InternshipCard;
