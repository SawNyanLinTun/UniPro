
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const slides = [
  { title: "UniPro Thailand", content: "Matching Talent with Opportunity in the Land of Smiles.", type: "cover" },
  { title: "The Problem", content: "Students apply blindly; companies sift through irrelevant profiles. A broken pipeline costing ฿5B in hiring inefficiencies annually.", type: "text" },
  { title: "The Solution", content: "An AI-powered professional catalyst. Vector-based skill alignment + stable matching algorithm.", type: "text" },
  { title: "SmartMatch AI", content: "70% CV Vector Analysis + 30% Recommender Insights. 85% placement success rate predicted.", type: "feature" },
  { title: "Market Opportunity", content: "500K+ University students in Thailand seeking internships. ฿2B TAM in corporate placement fees.", type: "text" },
  { title: "Competitive Edge", content: "Deep Thailand localization. Gale-Shapley implementation. Exclusive Thai University network.", type: "text" },
  { title: "Monetization", content: "B2B SaaS for companies. University licensing. Premium student career acceleration.", type: "text" },
  { title: "Roadmap", content: "Q3 2024: Pilot Launch. Q1 2025: 50+ Partner Universities. Q3 2025: ASEAN Expansion.", type: "text" },
  { title: "The Ask", content: "฿10M Seed for infrastructure and network expansion. Join the future of work.", type: "text" }
];

const PitchDeckPage: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(c => Math.min(slides.length - 1, c + 1));
  const prev = () => setCurrent(c => Math.max(0, c - 1));

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center px-8 md:px-20 overflow-hidden">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <div className="flex-1 glass-card rounded-[60px] p-16 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-10 left-10 font-mono text-xs text-resin-cyan opacity-40">SLIDE {current + 1} / {slides.length}</div>
          
          <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
            <h2 className={`font-black tracking-tighter mb-8 ${current === 0 ? 'text-8xl' : 'text-6xl'}`}>
              {slides[current].title}
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed">
              {slides[current].content}
            </p>
          </div>
          
          <div className="absolute bottom-10 inset-x-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === current ? 'w-8 bg-resin-cyan' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <div className="py-10 flex justify-between items-center">
          <div className="flex gap-4">
            <button onClick={prev} disabled={current === 0} className="w-12 h-12 glass-card rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} disabled={current === slides.length - 1} className="w-12 h-12 glass-card rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30">
              <ChevronRight size={24} />
            </button>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Maximize2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckPage;
