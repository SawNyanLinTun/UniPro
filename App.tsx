
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrbBackground from './components/OrbBackground';
import Navigation from './components/Navigation';

// Page Imports
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SmartMatchPage from './pages/SmartMatchPage';
import SavedPage from './pages/SavedPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ScholarshipLedgerPage from './pages/ScholarshipLedgerPage';

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center text-resin-cyan text-sm animate-pulse">
    Synchronizing interface...
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen text-white font-sans selection:bg-resin-cyan selection:text-black pt-20">
        <OrbBackground />
        <Navigation />
        
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/smartmatch" element={<SmartMatchPage />} />
              <Route path="/scholarship-ledger" element={<ScholarshipLedgerPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="px-8 md:px-20 py-20 border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
            <div>
               <div className="flex items-center gap-3 font-bold text-lg tracking-tight mb-4">
                <div className="w-5 h-5 bg-gradient-to-br from-resin-cyan to-resin-purple rounded transform rotate-45 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                UNIPRO
              </div>
              <p className="text-gray-500 text-sm max-w-xs">Connecting Thailand's next generation of talent with global opportunities.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-sm font-medium text-white mb-6">Platform</h4>
                <ul className="text-gray-500 text-sm space-y-3">
                  <li><a href="#/browse" className="hover:text-white transition-colors">Browse</a></li>
                  <li><a href="#/smartmatch" className="hover:text-white transition-colors">SmartMatch</a></li>
                  <li><a href="#/scholarship-ledger" className="hover:text-white transition-colors">Scholarship Ledger</a></li>
                  <li><a href="#/about" className="hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
               <div>
                <h4 className="text-sm font-medium text-white mb-6">Social</h4>
                <ul className="text-gray-500 text-sm space-y-3">
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-xs text-gray-600 flex justify-between">
            <span>&copy; 2024 UniPro Thailand</span>
            <span>Created with passion for future builders</span>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
