import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Briefcase, Target, Clock, BrainCircuit, Loader2, ArrowRight } from 'lucide-react';
import { getAdvice } from '../services/api';

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
      const result = await getAdvice(searchQuery);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.6s_ease-out]">
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        {/* Hero */}
        <section className="max-w-3xl mb-20 lg:mb-28">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-muted border border-primary-muted text-primary text-xs font-semibold mb-6">
            <Sparkles size={14} /> For Thai university students
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-6 leading-[1.1]">
            Find internships that actually fit you.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-8">
            UniPro matches your studies and skills with internships and scholarships across Thailand — no more scrolling through listings that don't matter.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <button 
              onClick={() => navigate('/browse')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
            >
              <Search size={16} /> Browse opportunities
            </button>
            <button 
              onClick={() => navigate('/smartmatch')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text rounded-lg text-sm font-semibold hover:bg-surface transition-colors"
            >
              <Target size={16} /> Try SmartMatch
            </button>
          </div>

          <div className="relative max-w-2xl">
            <div className="glass-input flex items-center p-2 pl-4">
              <input 
                type="text" 
                placeholder="What are you studying? e.g. Computer Science, Marketing, Finance" 
                className="bg-transparent border-none outline-none flex-1 text-base py-3 text-text placeholder-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiInsights()}
              />
              <button 
                onClick={handleAiInsights}
                disabled={isAiLoading}
                className="bg-text text-bg px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                {isAiLoading ? 'Analyzing...' : 'Get advice'}
              </button>
            </div>
          </div>
        </section>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mb-20 lg:mb-28 bg-surface border border-primary-muted rounded-2xl p-8 lg:p-10 animate-[revealUp_0.5s_ease-out_forwards]">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <h3 className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} /> Personalized advice
                </h3>
                <p className="text-lg text-text leading-relaxed">"{aiAnalysis.advice}"</p>
              </div>
              <div className="lg:w-1/3 space-y-6">
                <div>
                  <h3 className="text-text-secondary text-sm font-semibold mb-3">Growth areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.recommendedCategories.map(cat => (
                      <span key={cat} className="bg-primary-muted border border-primary-muted px-3 py-1 rounded-full text-xs text-primary font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-text-secondary text-sm font-semibold mb-3">Skills to build</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.keySkills.map(skill => (
                      <span key={skill} className="bg-accent-muted border border-accent-muted px-3 py-1 rounded-full text-xs text-accent font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 lg:mb-28">
          {[
            { icon: <Search className="text-primary" size={22} />, title: "Curated listings", desc: "Every role is vetted and tagged by field, location, and stipend so you find real options fast." },
            { icon: <Target className="text-primary" size={22} />, title: "Smart matching", desc: "Upload your CV and we compare your skills to what each role actually asks for." },
            { icon: <Clock className="text-primary" size={22} />, title: "Track everything", desc: "Save roles, track applications, and see your progress in one simple dashboard." }
          ].map((item, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6 lg:p-8 hover:border-border-strong transition-colors">
              <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-text mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* SmartMatch CTA */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10 p-8 lg:p-12">
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text mb-4">Let your CV do the searching</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                SmartMatch reads your resume, compares your skills against each opening, and shows you the roles where you have the strongest shot.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Skill coverage score
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Clear gap analysis
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Top matches ranked
                </li>
              </ul>
              <button 
                onClick={() => navigate('/smartmatch')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
              >
                Launch SmartMatch <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-56 h-56 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary opacity-10 blur-[80px] rounded-full" />
                <div className="relative bg-surface-elevated border border-border w-40 h-40 rounded-2xl flex items-center justify-center">
                  <Briefcase size={48} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
