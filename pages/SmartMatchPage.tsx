
import React, { useState } from 'react';
import { Upload, ListOrdered, CheckCircle2, FileText, Share2, Sparkles, ChevronRight, Loader2, Copy } from 'lucide-react';

const SmartMatchPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const steps = [
    { num: 1, label: 'CV Upload', icon: <FileText size={20} /> },
    { num: 2, label: 'Evaluation', icon: <Share2 size={20} /> },
    { num: 3, label: 'Preferences', icon: <ListOrdered size={20} /> },
    { num: 4, label: 'Match Results', icon: <CheckCircle2 size={20} /> },
  ];

  const handleNext = () => {
    if (step === 1 && !fileName) {
      // Mock upload if button clicked without file
      setFileName("resume_2024_draft.pdf");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(s => Math.min(4, s + 1));
    }, 800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("unipro.co.th/eval/auth-882-991");
    alert("Evaluation link copied!");
  };

  return (
    <div className="px-8 md:px-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-resin-cyan text-[0.6rem] font-mono uppercase tracking-widest mb-6">
            <Sparkles size={14} /> AI Propelled Matching
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">SmartMatch AI Catalyst</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Complete our 4-step workflow to unlock precise internship alignments tailored to your unique profile.</p>
        </header>

        {/* Stepper */}
        <div className="flex justify-between mb-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.num ? 'bg-resin-cyan text-black scale-110 shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-resin-bg border border-white/20 text-gray-500'}`}
              >
                {s.icon}
              </div>
              <span className={`mt-4 font-mono text-[0.6rem] uppercase tracking-widest ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Workflow Content */}
        <div className="glass-card p-12 rounded-[40px] mb-12 min-h-[400px] flex flex-col justify-center relative">
          {isProcessing && (
            <div className="absolute inset-0 z-20 glass-card rounded-[40px] flex flex-col items-center justify-center bg-resin-bg/60 backdrop-blur-xl animate-[fadeIn_0.2s]">
              <Loader2 size={48} className="text-resin-cyan animate-spin mb-4" />
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-white">Synthesizing Data...</p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s]">
              <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center mb-8 border border-white/10">
                <Upload size={32} className="text-resin-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Upload your Resume / CV</h3>
              <p className="text-gray-400 mb-10 max-w-sm">Our AI will parse your skills, experience, and academic trajectory to build your vector profile.</p>
              
              <div 
                onClick={() => setFileName("academic_cv_v2.pdf")}
                className={`w-full max-w-md border-2 border-dashed rounded-[32px] p-12 transition-all cursor-pointer group flex flex-col items-center justify-center
                ${fileName ? 'border-resin-cyan bg-resin-cyan/5' : 'border-white/10 hover:border-resin-cyan/50'}`}
              >
                <p className="text-sm font-mono text-gray-500 group-hover:text-white transition-colors mb-2 uppercase">
                  {fileName ? 'File Received' : 'DRAG PDF OR CLICK TO SELECT'}
                </p>
                {fileName && <span className="text-resin-cyan font-bold">{fileName}</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeIn_0.3s]">
              <h3 className="text-2xl font-bold mb-6">Academic Endorsement</h3>
              <p className="text-gray-400 mb-10">Generate a secure evaluation link for your professor or mentor. Their insights account for 30% of your total match score.</p>
              <div className="glass-input p-4 rounded-2xl flex items-center justify-between mb-10">
                <code className="text-xs text-resin-cyan overflow-hidden whitespace-nowrap">unipro.co.th/eval/auth-882-991</code>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-[0.6rem] font-mono bg-white text-black px-4 py-2 rounded-lg hover:bg-resin-cyan transition-colors"
                >
                  <Copy size={12} /> COPY LINK
                </button>
              </div>
              <div className="p-6 bg-resin-purple/5 border border-resin-purple/20 rounded-[24px]">
                <p className="text-xs text-resin-purple uppercase font-mono tracking-widest mb-2">Why this matters</p>
                <p className="text-sm text-gray-400">Stable matching requires qualitative data. A mentor's rating on work ethic and communication bridges the gap between code and career.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeIn_0.3s]">
              <h3 className="text-2xl font-bold mb-6">Rank your Ambitions</h3>
              <p className="text-gray-400 mb-10">Based on initial processing, we've identified these top matches. Drag to rank them by your preference.</p>
              <div className="space-y-4 mb-10">
                {['Distributed Systems Associate @ Agoda', 'UI/UX Design Intern @ Lineman', 'Data Science Intern @ SCB 10X'].map((item, i) => (
                  <div key={item} className="p-5 glass-card rounded-2xl flex items-center gap-6 cursor-grab active:cursor-grabbing hover:translate-x-2 transition-all group">
                    <span className="text-resin-cyan font-mono text-xl opacity-40 group-hover:opacity-100">0{i+1}</span>
                    <span className="font-bold flex-1">{item}</span>
                    <ListOrdered size={16} className="text-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-[fadeIn_0.3s] text-center">
               <div className="w-24 h-24 bg-resin-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-resin-cyan/20">
                <Sparkles size={40} className="text-resin-cyan" />
              </div>
              <h3 className="text-3xl font-black mb-4">Matches Synthesized</h3>
              <p className="text-gray-400 mb-12">We've calculated your optimal placements using the Gale-Shapley algorithm.</p>
              
              <div className="space-y-4 max-w-lg mx-auto mb-12">
                {[
                  { company: 'Agoda', role: 'Distributed Systems', score: '98%' },
                  { company: 'KBTG', role: 'Business Development', score: '92%' },
                  { company: 'Omise', role: 'ML Engineer', score: '87%' },
                ].map((match, i) => (
                  <div key={i} className="p-6 glass-card rounded-[24px] border-white/5 hover:border-resin-cyan/30 flex justify-between items-center text-left transition-all">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{match.company}</h4>
                      <p className="text-[0.6rem] text-gray-500 font-mono uppercase">{match.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-resin-cyan">{match.score}</span>
                      <p className="text-[0.5rem] font-mono text-gray-600 uppercase">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1 || isProcessing}
            className={`font-mono text-[0.7rem] uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            className="bg-white text-black px-10 py-4 rounded-full font-mono text-xs font-bold uppercase hover:bg-resin-cyan transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {step === 4 ? 'Go to Dashboard' : 'Continue Workflow'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartMatchPage;
