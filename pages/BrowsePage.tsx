
import React, { useEffect, useState, useMemo } from 'react';
import { Search, MapPin, Building2, Clock, Coins, Loader2, WifiOff } from 'lucide-react';
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
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Browse Opportunities</h1>
          <div className="glass-input max-w-2xl flex items-center p-2 pl-6 rounded-full">
            <Search className="text-gray-500 mr-4" size={20} />
            <input 
              type="text" 
              placeholder="Search companies, roles, or skills..." 
              className="bg-transparent border-none outline-none flex-1 py-3 text-white placeholder-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 space-y-10">
            <div>
              <h3 className="text-sm font-medium text-resin-cyan mb-6">Categories</h3>
              <div className="flex flex-col gap-3">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-sm py-2 px-4 rounded-xl transition-all ${selectedCategory === cat ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-resin-cyan mb-6">Location</h3>
              <div className="flex flex-col gap-3">
                {locations.map(loc => (
                  <button 
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`text-left text-sm py-2 px-4 rounded-xl transition-all ${selectedLocation === loc ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-white'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10">
              <span className="text-sm text-gray-500">
                Showing {filteredInternships.length} results
              </span>
              {offline && (
                <span className="inline-flex items-center gap-2 text-xs text-resin-amber">
                  <WifiOff size={12} /> Demo mode — backend offline
                </span>
              )}
            </div>

            {loading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center glass-card rounded-[40px]">
                <Loader2 size={40} className="text-resin-cyan animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading opportunities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
                {filteredInternships.map((internship, i) => (
                  <InternshipCard key={internship.id} internship={internship} delay={`${i * 0.05}s`} />
                ))}
                {filteredInternships.length === 0 && (
                  <div className="col-span-full py-24 text-center glass-card rounded-[40px] flex flex-col items-center">
                    <Coins size={40} className="text-gray-800 mb-4" />
                    <p className="text-gray-500 text-sm">No positions match your current filters.</p>
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
