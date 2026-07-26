import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, Heart, Briefcase, Sparkles, Home, Info, LogIn, UserPlus, ChevronRight, LogOut, Award } from 'lucide-react';
import ThemePanel from './ThemePanel';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setShowThemePanel(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Browse Internships', path: '/browse', icon: <Briefcase size={20} /> },
    { name: 'SmartMatch', path: '/smartmatch', icon: <Sparkles size={20} /> },
    { name: 'Scholarship Ledger', path: '/scholarship-ledger', icon: <Award size={20} /> },
    { name: 'Saved Opportunities', path: '/saved', icon: <Heart size={20} /> },
    { name: 'My Applications', path: '/applications', icon: <Briefcase size={20} /> },
    { name: 'About UniPro', path: '/about', icon: <Info size={20} /> },
  ];

  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex justify-between items-center">
          <NavLink to="/" className="font-display font-bold text-lg tracking-tight text-text hover:opacity-80 transition-opacity">
            UniPro
          </NavLink>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <span className="text-sm font-medium text-text-secondary">
              {isOpen ? 'Close' : 'Menu'}
            </span>
            <span className="text-text-secondary">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Full Screen Overlay Menu */}
      <div 
        className={`fixed inset-0 z-[90] transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-bg/95 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
        
        <div className="relative h-full max-w-7xl mx-auto px-8 md:px-20 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Navigation Section */}
            <div className="space-y-4">
              <p className="label mb-6">Navigation</p>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                      ${isActive ? 'border-border bg-surface-elevated translate-x-2' : 'border-transparent hover:bg-surface-elevated hover:translate-x-1'}
                    `}
                    style={{ transitionDelay: `${index * 25}ms` }}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${location.pathname === link.path ? 'bg-primary text-white' : 'bg-surface-elevated text-text-muted group-hover:text-text'}`}>
                        {link.icon}
                      </div>
                      <span className={`text-xl font-display font-semibold ${location.pathname === link.path ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight size={18} className={`transition-all ${location.pathname === link.path ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-40 text-text-muted'}`} />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Account & Meta Section */}
            <div className="flex flex-col justify-center space-y-10">
              <div className="space-y-6">
                <p className="label">Member access</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!isLoggedIn ? (
                    <>
                      <button 
                        onClick={toggleAuth}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-surface border border-border rounded-xl hover:bg-surface-elevated transition-colors text-sm font-medium text-text"
                      >
                        <LogIn size={18} className="text-primary" /> Sign in
                      </button>
                      <button 
                        onClick={toggleAuth}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors text-sm font-semibold"
                      >
                        <UserPlus size={18} /> Create account
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={toggleAuth}
                      className="col-span-full flex items-center justify-center gap-2 px-6 py-4 bg-surface border border-error/20 hover:bg-error-muted rounded-xl transition-colors text-sm font-medium text-error"
                    >
                      <LogOut size={18} /> Sign out
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <p className="label">Account</p>
                <NavLink 
                  to="/profile"
                  className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-5 hover:border-border-strong transition-colors group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isLoggedIn ? 'bg-primary-muted' : 'bg-surface-elevated'}`}>
                    <User size={28} className={isLoggedIn ? 'text-primary' : 'text-text-muted'} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-lg text-text group-hover:text-primary transition-colors">
                      {isLoggedIn ? 'Supakorn Tech' : 'Guest User'}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {isLoggedIn ? 'Chulalongkorn University' : 'Sign in to sync your data'}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-text-muted group-hover:text-text transition-colors" />
                </NavLink>
              </div>

              <div className="pt-4">
                <p className="label mb-3">Appearance</p>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => setShowThemePanel(!showThemePanel)}
                    className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text transition-colors"
                  >
                    {showThemePanel ? 'Hide theme panel' : 'Change theme'}
                  </button>
                  {showThemePanel && <ThemePanel onClose={() => setShowThemePanel(false)} />}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">Privacy</a>
                <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">Terms</a>
                <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">Support</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
