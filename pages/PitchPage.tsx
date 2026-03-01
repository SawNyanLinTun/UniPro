
import React from 'react';
import { Target, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react';

const PitchPage: React.FC = () => {
  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-5xl mx-auto py-24">
        <header className="mb-24">
          <h1 className="text-6xl font-black tracking-tighter mb-8">Investor Memorandum</h1>
          <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed">
            UniPro is building the professional operating system for Thailand's 500,000+ university students.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-4"><Target className="text-resin-cyan" /> The Problem</h2>
            <p className="text-gray-400 leading-relaxed">
              Thailand faces a "Qualification Gap." Companies receive 1,000+ irrelevant resumes for every internship slot, while students waste hundreds of hours applying to roles that don't match their vector.
            </p>
            <div className="p-8 glass-card rounded-[32px] bg-red-400/5 border-red-400/20">
              <p className="text-sm text-red-400 font-mono mb-2">COST OF INEFFICIENCY</p>
              <p className="text-3xl font-black">฿5,000,000,000+</p>
              <p className="text-xs text-gray-500 mt-2">Estimated annual corporate loss in hiring cycles.</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-4"><Zap className="text-resin-purple" /> The Solution</h2>
            <p className="text-gray-400 leading-relaxed">
              UniPro provides an end-to-end catalyst platform. We use CV Vectorization and the Gale-Shapley matching algorithm to create stable, high-value professional pairings.
            </p>
            <div className="p-8 glass-card rounded-[32px] bg-resin-cyan/5 border-resin-cyan/20">
              <p className="text-sm text-resin-cyan font-mono mb-2">TARGET EFFICIENCY</p>
              <p className="text-3xl font-black">70% REDUCTION</p>
              <p className="text-xs text-gray-500 mt-2">In time-to-hire for our enterprise partners.</p>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">Competitive Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp />, title: "Market Timing", desc: "Thailand's 4.0 initiative is creating massive demand for skilled tech/business interns." },
              { icon: <Users />, title: "Network Moat", desc: "Strategic partnerships with 20+ top-tier Thai universities from Day 1." },
              { icon: <ShieldCheck />, title: "Proprietary Data", desc: "Unique recommender-loop providing qualitative data no other platform tracks." }
            ].map((item, i) => (
              <div key={i} className="glass-card p-10 rounded-[40px] text-center">
                <div className="mb-6 flex justify-center text-resin-cyan">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center p-20 glass-card rounded-[60px]">
          <h2 className="text-4xl font-black mb-6">Join the Revolution</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">We are currently closing our Seed round. Contact our founding team for details on the memorandum.</p>
          <button className="bg-white text-black px-12 py-4 rounded-full font-mono font-bold uppercase hover:bg-resin-cyan transition-all">
            Contact Founders
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PitchPage;
