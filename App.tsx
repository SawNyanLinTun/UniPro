import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrbBackground from './components/OrbBackground';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

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
  <div className="h-screen w-full flex items-center justify-center text-primary text-sm animate-pulse">
    Loading UniPro...
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen text-text font-sans selection:bg-primary selection:text-white pt-16">
          <OrbBackground />
          <Navigation />
          <AuthModal />

          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/smartmatch" element={<SmartMatchPage />} />
                <Route path="/scholarship-ledger" element={<ScholarshipLedgerPage />} />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute>
                      <SavedPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <ApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="border-t border-border mt-24 bg-surface">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
              <div className="flex flex-col md:flex-row justify-between gap-12">
                <div className="max-w-sm">
                  <div className="font-display font-bold text-lg tracking-tight mb-4">
                    UniPro
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Internships and scholarships for Thai university students. Built by students, for students.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Platform</h4>
                    <ul className="text-sm space-y-3">
                      <li><a href="#/browse" className="text-text-secondary hover:text-text transition-colors">Browse</a></li>
                      <li><a href="#/smartmatch" className="text-text-secondary hover:text-text transition-colors">SmartMatch</a></li>
                      <li><a href="#/scholarship-ledger" className="text-text-secondary hover:text-text transition-colors">Scholarships</a></li>
                      <li><a href="#/about" className="text-text-secondary hover:text-text transition-colors">About</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Account</h4>
                    <ul className="text-sm space-y-3">
                      <li><a href="#/saved" className="text-text-secondary hover:text-text transition-colors">Saved</a></li>
                      <li><a href="#/applications" className="text-text-secondary hover:text-text transition-colors">Applications</a></li>
                      <li><a href="#/profile" className="text-text-secondary hover:text-text transition-colors">Profile</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Connect</h4>
                    <ul className="text-sm space-y-3">
                      <li><a href="#" className="text-text-secondary hover:text-text transition-colors">LinkedIn</a></li>
                      <li><a href="#" className="text-text-secondary hover:text-text transition-colors">X / Twitter</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-border text-xs text-text-muted flex flex-col md:flex-row justify-between gap-4">
                <span>&copy; 2024 UniPro Thailand</span>
                <span>Built to help Thai students land their first big opportunity.</span>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
