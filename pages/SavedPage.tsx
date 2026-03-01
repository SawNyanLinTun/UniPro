
import React from 'react';
import { MOCK_INTERNSHIPS } from '../constants';
import InternshipCard from '../components/InternshipCard';
import { HeartOff } from 'lucide-react';

const SavedPage: React.FC = () => {
  // Mocking saved state by taking top 3 from constants
  const savedInternships = MOCK_INTERNSHIPS.slice(0, 3);

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Saved Roles</h1>
        <p className="text-gray-400 mb-16">Your curated selection of professional catalysts in Thailand.</p>

        {savedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedInternships.map((internship, i) => (
              <InternshipCard key={internship.id} internship={internship} delay={`${i * 0.1}s`} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center glass-card rounded-[40px]">
            <HeartOff size={48} className="text-gray-700 mb-6" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No roles saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
