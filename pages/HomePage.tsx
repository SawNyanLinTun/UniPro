
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Briefcase, Zap, BrainCircuit, Loader2 } from 'lucide-react';
import { getInternshipRecommendations } from '../services/geminiService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ 
    recommendedCategories: string[], 
    keySkills: string[], 
    advice: string 
  } | null>(null);

  const handleAiInsights = async () => {
    if (!searchQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await getInternshipRecommendations(searchQuery);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.8s_ease-out]">
      <div className="max-w-7xl mx-auto py-24">
        <section className="max-w-4xl mb-24">
          <span className="font-mono text-[0.7rem] text-resin-cyan tracking-[0.2em] uppercase mb-4 block">
            The Future of Internships in Thailand
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-10 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Matching talent <br/> with opportunity.
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            UniPro is Thailand's premier professional catalyst, using AI to perfectly align university students with top-tier career paths.
          </p>
          
          <div className="relative max-w-2xl group mb-8">
            <div className="glass-input p-2 pl-8 rounded-full flex items-center transition-all duration-300 focus-within:ring-1 ring-resin-cyan/30 group-hover:shadow-[0_20px_40px_rgba(0,242,255,0.1)]">
              <input 
                type="text" 
                placeholder="What are you studying? (e.g. Computer Science, Marketing...)" 
                className="bg-transparent border-none outline-none flex-1 text-lg py-3 text-white placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiInsights()}
              />
              <button 
                onClick={handleAiInsights}
                disabled={isAiLoading}
                className="bg-white text-black px-8 py-3 rounded-full font-mono text-[0.7rem] font-bold uppercase hover:bg-resin-cyan transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                {isAiLoading ? 'Analyzing...' : 'AI Insights'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <button 
              onClick={() => navigate('/browse')}
              className="text-gray-400 hover:text-white px-6 py-2 rounded-full font-mono text-[0.65rem] font-bold uppercase border border-white/5 hover:border-white/20 transition-all"
            >
              Browse All Roles
            </button>
            <button 
              onClick={() => navigate('/smartmatch')}
              className="text-resin-cyan hover:text-white px-6 py-2 rounded-full font-mono text-[0.65rem] font-bold uppercase border border-resin-cyan/10 hover:border-resin-cyan/50 transition-all flex items-center gap-2"
            >
              <Sparkles size={14} /> SmartMatch Workflow
            </button>
          </div>
        </section>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mb-24 glass-card rounded-[40px] p-10 border-resin-cyan/20 animate-[revealUp_0.6s_ease-out_forwards]">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <h3 className="text-resin-cyan font-mono text-[0.7rem] uppercase mb-6 tracking-widest flex items-center gap-2">
                  <BrainCircuit size={16} /> Personalized Advice
                </h3>
                <p className="text-xl text-gray-200 leading-relaxed italic">"{aiAnalysis.advice}"</p>
              </div>
              <div className="lg:w-1/3 space-y-8">
                <div>
                  <h3 className="text-resin-purple font-mono text-[0.6rem] uppercase mb-4 tracking-widest">Growth Sectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.recommendedCategories.map(cat => (
                      <span key={cat} className="bg-resin-purple/10 border border-resin-purple/20 px-3 py-1 rounded-full text-[0.65rem] text-resin-purple font-mono uppercase">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-resin-amber font-mono text-[0.6rem] uppercase mb-4 tracking-widest">Skills to Polish</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.keySkills.map(skill => (
                      <span key={skill} className="bg-resin-amber/10 border border-resin-amber/20 px-3 py-1 rounded-full text-[0.65rem] text-resin-amber font-mono uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: <Search className="text-resin-cyan" />, title: "Intelligent Search", desc: "Filter through 500+ curated roles in tech, design, and business." },
            { icon: <Sparkles className="text-resin-purple" />, title: "AI-Powered Matching", desc: "Our proprietary algorithm maps your CV to the perfect residency." },
            { icon: <Zap className="text-resin-amber" />, title: "Instant Access", desc: "Direct connections with Thailand's leading innovation hubs." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 rounded-[40px] hover:border-white/20 transition-all">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="glass-card p-16 rounded-[60px] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-5xl font-black tracking-tighter mb-8">SmartMatch AI Deep Dive</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Stop applying blindly. SmartMatch analyzes your technical trajectory, soft skills, and academic evaluations to predict placement success.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-resin-cyan" /> CV Vector Analysis
                </li>
                <li className="flex items-center gap-3 text-sm font-mono text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-resin-purple" /> Recommender Integration
                </li>
                <li className="flex items-center gap-3 text-sm font-mono text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-resin-amber" /> Stable Matching Algorithm
                </li>
              </ul>
              <button 
                onClick={() => navigate('/smartmatch')}
                className="bg-resin-cyan text-black px-8 py-3 rounded-full font-mono text-xs font-bold uppercase hover:opacity-90 transition-all"
              >
                Launch SmartMatch
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 bg-resin-cyan/20 blur-[80px] rounded-full animate-pulse" />
                <div className="relative glass-card w-full h-full rounded-[40px] flex items-center justify-center border-resin-cyan/30">
                  <Sparkles size={80} className="text-resin-cyan" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
