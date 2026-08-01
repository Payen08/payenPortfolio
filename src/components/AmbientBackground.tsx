import React, { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        
        containerRef.current.style.setProperty('--x', `${x}%`);
        containerRef.current.style.setProperty('--y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      {/* Dim base ambient color */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Subtle colorful spots reacting to mouse */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-700 mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle 800px at var(--x) var(--y), rgba(161, 224, 0, 0.08), transparent 40%),
            radial-gradient(circle 600px at calc(var(--x) + 10%) calc(var(--y) + 10%), rgba(139, 92, 246, 0.06), transparent 50%),
            radial-gradient(circle 600px at calc(var(--x) - 10%) calc(var(--y) - 10%), rgba(6, 182, 212, 0.06), transparent 50%)
          `
        }}
      />
    </div>
  );
}
