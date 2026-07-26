import React, { useEffect, useState, useMemo } from 'react';
import { Search, WifiOff, Loader2, SlidersHorizontal } from 'lucide-react';
import InternshipCard from '../components/InternshipCard';
import { MOCK_INTERNSHIPS } from '../constants';
import { getJobs } from '../services/api';
import { Internship, InternshipCategory } from '../types';

const BrowsePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const locations = ['All', 'Bangkok', 'Phuket', 'Chiang Mai', 'Nonthaburi'];
  const categories = ['All', ...Object.values(InternshipCategory)];

  useEffect(() => {
    let cancelled = false;
    getJobs()
      .then(data => {
        if (!cancelled) {
          setJobs(data.length ? data : MOCK_INTERNSHIPS);
          setOffline(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJobs(MOCK_INTERNSHIPS);
          setOffline(true);
        }
      })
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const filteredInternships = useMemo(() => {
    return jobs.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchQuery, selectedCategory, selectedLocation]);

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3">Browse opportunities</h1>
          <p className="text-text-secondary max-w-xl">Find internships by role, field, or location.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-8">
            <div className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-text-muted" />
                <h3 className="text-sm font-semibold text-text">Filters</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Category</h4>
                <div className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-primary text-white font-medium' : 'text-text-secondary hover:text-text hover:bg-surface-elevated'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Location</h4>
                <div className="flex flex-col gap-1">
                  {locations.map(loc => (
                    <button 
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${selectedLocation === loc ? 'bg-primary text-white font-medium' : 'text-text-secondary hover:text-text hover:bg-surface-elevated'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* List */}
          <div className="flex-1">
            <div className="glass-input flex items-center p-2 pl-4 mb-6">
              <Search className="text-text-muted mr-3" size={18} />
              <input 
                type="text" 
                placeholder="Search roles, companies, or skills..." 
                className="bg-transparent border-none outline-none flex-1 py-2.5 text-text placeholder-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-text-muted">
                {loading ? 'Loading...' : `${filteredInternships.length} result${filteredInternships.length !== 1 ? 's' : ''}`}
              </span>
              {offline && (
                <span className="inline-flex items-center gap-2 text-xs text-accent">
                  <WifiOff size={12} /> Demo mode
                </span>
              )}
            </div>

            {loading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center bg-surface border border-border rounded-2xl">
                <Loader2 size={36} className="text-primary animate-spin mb-3" />
                <p className="text-sm text-text-muted">Loading opportunities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                {filteredInternships.map((internship, i) => (
                  <InternshipCard key={internship.id} internship={internship} delay={`${i * 0.05}s`} />
                ))}
                {filteredInternships.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-surface border border-border rounded-2xl flex flex-col items-center">
                    <Search size={40} className="text-text-muted mb-4" />
                    <p className="text-text-secondary text-sm font-medium mb-1">No matches found</p>
                    <p className="text-text-muted text-xs">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
