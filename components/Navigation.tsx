
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, Heart, Briefcase, Sparkles, Home, Info, LogIn, UserPlus, ChevronRight, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Browse Internships', path: '/browse', icon: <Briefcase size={20} /> },
    { name: 'SmartMatch AI', path: '/smartmatch', icon: <Sparkles size={20} /> },
    { name: 'Saved Opportunities', path: '/saved', icon: <Heart size={20} /> },
    { name: 'My Applications', path: '/applications', icon: <Briefcase size={20} /> },
    { name: 'About UniPro', path: '/about', icon: <Info size={20} /> },
  ];

  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
    // Visual feedback
    if (!isLoggedIn) {
      console.log("Mock Login Successful");
    } else {
      console.log("Mock Logout Successful");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-resin-bg/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-3 font-mono font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-gradient-to-br from-resin-cyan to-resin-purple rounded transform rotate-45 shadow-[0_0_20px_rgba(0,242,255,0.5)]" />
            UNIPRO
          </NavLink>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-6 py-2 glass-card rounded-full hover:bg-white/10 transition-all group"
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">
              {isOpen ? 'Close' : 'Menu'}
            </span>
            <div className="text-resin-cyan">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Overlay Menu */}
      <div 
        className={`fixed inset-0 z-[90] transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop blur */}
        <div className="absolute inset-0 bg-resin-bg/80 backdrop-blur-2xl" onClick={() => setIsOpen(false)} />
        
        <div className="relative h-full max-w-7xl mx-auto px-8 md:px-20 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            
            {/* Navigation Section */}
            <div className="space-y-4">
              <p className="font-mono text-[0.6rem] text-resin-cyan uppercase tracking-[0.3em] mb-8 opacity-50">Navigation</p>
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      group flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                      ${isActive ? 'bg-white/10 translate-x-4' : 'hover:bg-white/5 hover:translate-x-2'}
                    `}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-xl transition-colors ${location.pathname === link.path ? 'bg-resin-cyan text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        {link.icon}
                      </div>
                      <span className={`text-2xl font-bold tracking-tight ${location.pathname === link.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight size={20} className={`transition-all ${location.pathname === link.path ? 'text-resin-cyan opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Account & Meta Section */}
            <div className="flex flex-col justify-center space-y-12">
              <div className="space-y-6">
                <p className="font-mono text-[0.6rem] text-resin-purple uppercase tracking-[0.3em] opacity-50">Member Access</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!isLoggedIn ? (
                    <>
                      <button 
                        onClick={toggleAuth}
                        className="flex items-center justify-center gap-3 px-8 py-5 glass-card rounded-[24px] hover:bg-white/10 transition-all font-mono text-[0.7rem] uppercase tracking-widest text-white active:scale-95"
                      >
                        <LogIn size={18} className="text-resin-cyan" /> Sign In
                      </button>
                      <button 
                        onClick={toggleAuth}
                        className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-black rounded-[24px] hover:bg-resin-cyan transition-all font-mono text-[0.7rem] font-bold uppercase tracking-widest active:scale-95"
                      >
                        <UserPlus size={18} /> Create Account
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={toggleAuth}
                      className="col-span-full flex items-center justify-center gap-3 px-8 py-5 glass-card rounded-[24px] hover:bg-red-500/10 border-red-500/20 hover:border-red-500/40 transition-all font-mono text-[0.7rem] uppercase tracking-widest text-red-400 active:scale-95"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <p className="font-mono text-[0.6rem] text-resin-amber uppercase tracking-[0.3em] opacity-50">User Profile</p>
                <NavLink 
                  to="/profile"
                  className="glass-card p-6 rounded-[32px] flex items-center gap-6 hover:border-white/20 transition-all group"
                >
                  <div className={`w-16 h-16 rounded-full p-1 transition-all ${isLoggedIn ? 'bg-gradient-to-br from-resin-cyan to-resin-purple animate-pulse' : 'bg-white/5'}`}>
                    <div className="w-full h-full rounded-full bg-resin-bg flex items-center justify-center overflow-hidden">
                      <User size={32} className={isLoggedIn ? 'text-white' : 'text-white/20'} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg group-hover:text-resin-cyan transition-colors">
                      {isLoggedIn ? 'Supakorn Tech' : 'Guest User'}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono">
                      {isLoggedIn ? 'Chulalongkorn University' : 'Sign in to sync your data'}
                    </p>
                  </div>
                  <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-colors" />
                </NavLink>
              </div>

              <div className="pt-8 flex gap-8 font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
