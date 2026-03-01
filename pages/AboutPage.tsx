
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto py-24">
        <h1 className="text-5xl font-black tracking-tighter mb-12">Bridging the Gap</h1>
        
        <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed text-lg space-y-8">
          <p>
            UniPro was born in Bangkok with a single mission: to redefine how the next generation of Thai builders find their professional footing. We believe an internship is more than just a 3-month tenure; it's a critical alignment phase for your future career.
          </p>
          
          <h2 className="text-3xl font-bold text-white mt-16 mb-6">Our DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 not-prose">
            <div className="p-8 glass-card rounded-[32px]">
              <h3 className="text-xl font-bold mb-4 text-resin-cyan">Algorithmic Integrity</h3>
              <p className="text-sm">We use stable matching algorithms to ensure students and companies are paired for success, not just filled for capacity.</p>
            </div>
            <div className="p-8 glass-card rounded-[32px]">
              <h3 className="text-xl font-bold mb-4 text-resin-purple">Thai-First Design</h3>
              <p className="text-sm">Our platform is optimized for the local academic calendar and corporate structures unique to the Thai ecosystem.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-16 mb-6">FAQ</h2>
          <div className="space-y-6 not-prose">
            {[
              { q: "Is UniPro free for students?", a: "Yes, our core matching features and browse capabilities are always free for university students." },
              { q: "How does SmartMatch work?", a: "It combines your CV data with professor recommendations to calculate a 95%+ accurate match for specific roles." },
              { q: "Can I apply from any university?", a: "We currently support all major public and private universities across Thailand." }
            ].map((faq, i) => (
              <div key={i} className="glass-card p-8 rounded-[32px]">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
