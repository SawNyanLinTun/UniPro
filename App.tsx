
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

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center font-mono text-resin-cyan text-xs animate-pulse">
    SYNCHRONIZING_INTERFACE...
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
               <div className="flex items-center gap-3 font-mono font-bold text-lg tracking-tighter mb-4">
                <div className="w-5 h-5 bg-gradient-to-br from-resin-cyan to-resin-purple rounded transform rotate-45 shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
                UNIPRO
              </div>
              <p className="text-gray-500 text-sm max-w-xs">Connecting Thailand's next generation of talent with global opportunities.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-mono text-[0.7rem] uppercase text-white mb-6 tracking-widest">Platform</h4>
                <ul className="text-gray-500 text-sm space-y-3">
                  <li><a href="#/browse" className="hover:text-white transition-colors">Browse</a></li>
                  <li><a href="#/smartmatch" className="hover:text-white transition-colors">SmartMatch</a></li>
                  <li><a href="#/about" className="hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
               <div>
                <h4 className="font-mono text-[0.7rem] uppercase text-white mb-6 tracking-widest">Social</h4>
                <ul className="text-gray-500 text-sm space-y-3">
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-[0.6rem] font-mono text-gray-600 flex justify-between uppercase tracking-widest">
            <span>&copy; 2024 UNIPRO Thailand</span>
            <span>Created with passion for future builders</span>
          </div>
        </footer>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
