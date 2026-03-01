
import React, { useEffect, useState } from 'react';

const OrbBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-[#0d1117] to-[#05070a]">
      <div 
        className="orb absolute w-[600px] h-[600px] bg-resin-purple opacity-30 rounded-full -top-[10%] -left-[10%] animate-float"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="orb absolute w-[500px] h-[500px] bg-resin-cyan opacity-30 rounded-full -bottom-[10%] -right-[5%] animate-float"
        style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`, animationDelay: '-5s' }}
      />
      <div 
        className="orb absolute w-[400px] h-[400px] bg-resin-amber opacity-10 rounded-full top-[40%] right-[20%] animate-float"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, animationDelay: '-10s' }}
      />
    </div>
  );
};

export default OrbBackground;
