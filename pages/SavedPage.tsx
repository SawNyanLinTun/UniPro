import React from 'react';
import { MOCK_INTERNSHIPS } from '../constants';
import InternshipCard from '../components/InternshipCard';
import { HeartOff, Bookmark } from 'lucide-react';

const SavedPage: React.FC = () => {
  // Mocking saved state by taking top 3 from constants
  const savedInternships = MOCK_INTERNSHIPS.slice(0, 3);

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-xs font-semibold mb-4">
            <Bookmark size={14} /> Saved
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-2">Saved roles</h1>
          <p className="text-text-secondary">Roles you bookmarked to apply later.</p>
        </div>

        {savedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInternships.map((internship, i) => (
              <InternshipCard key={internship.id} internship={internship} delay={`${i * 0.05}s`} />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-surface border border-border rounded-2xl">
            <HeartOff size={40} className="text-text-muted mb-4" />
            <p className="text-text-secondary text-sm font-medium mb-1">No roles saved yet</p>
            <p className="text-text-muted text-xs">Browse internships and click the save button to add them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
