import React from 'react';
import { useTheme } from './ThemeProvider';

const OrbBackground: React.FC = () => {
  const { preset } = useTheme();

  const backgrounds: Record<typeof preset, string> = {
    midnight: 'bg-gradient-to-br from-[#0d1116] via-[#0b0c10] to-[#08090d]',
    slate: 'bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#0b1120]',
    warm: 'bg-gradient-to-br from-[#1e1a16] via-[#1a1714] to-[#14110e]',
    light: 'bg-[#f8fafc]',
  };

  return (
    <div className={`fixed inset-0 z-[-1] transition-colors duration-500 ${backgrounds[preset]}`}>
      {preset !== 'light' && (
        <>
          <div 
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[120px]"
            style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[120px]"
            style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
          />
        </>
      )}
    </div>
  );
};

export default OrbBackground;
