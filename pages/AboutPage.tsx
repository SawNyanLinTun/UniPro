import React from 'react';
import { Shield, MapPin, MessageCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto py-8 lg:py-12">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6 leading-tight">
          Built for Thai students, by Thai students.
        </h1>
        
        <div className="text-text-secondary leading-relaxed text-base space-y-6 mb-12">
          <p>
            UniPro started in Bangkok because we were tired of internship listings scattered across Facebook groups, company career pages, and alumni chats. We wanted one place where students could find real opportunities, understand what they were qualified for, and keep track of every application.
          </p>
          <p>
            An internship is more than a line on a resume. It is the first step into a career. Our job is to make that first step clearer.
          </p>
        </div>
        
        <h2 className="font-display text-xl font-bold text-text mb-5">What we care about</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center mb-4">
              <Shield size={20} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-text mb-2">Fair matching</h3>
            <p className="text-sm text-text-secondary leading-relaxed">We score roles based on skills, not connections. Every student gets the same transparent comparison.</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center mb-4">
              <MapPin size={20} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-text mb-2">Thai-first</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Timelines, locations, and university calendars are built around the Thai ecosystem, not copy-pasted from overseas.</p>
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-text mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is UniPro free for students?", a: "Yes. Browsing, saving, and SmartMatch are free. Some advanced features, like the scholarship ledger compare, use UniPro tokens." },
            { q: "How does SmartMatch work?", a: "You upload your CV and we compare your skills against each role. You get a ranked list of the openings where you are the strongest fit." },
            { q: "Can I use UniPro from any university?", a: "We support all major Thai universities. If yours is missing, tell us and we will add it." }
          ].map((faq, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-muted flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle size={12} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text mb-2">{faq.q}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
