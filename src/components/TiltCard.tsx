import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  layoutId?: string;
}

export default function TiltCard({ children, className = '', onClick, layoutId }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  
  const scale = useSpring(1, springConfig);
  const yLift = useSpring(0, springConfig);
  
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseEnter = () => {
    if (isReducedMotion) return;
    scale.set(1.05);
    yLift.set(-12);
  };

  const handleMouseLeave = () => {
    if (isReducedMotion) return;
    x.set(0.5);
    y.set(0.5);
    scale.set(1);
    yLift.set(0);
  };

  // Only apply the default dark background when the caller hasn't specified one
  const hasBg = className.includes('bg-');

  // Safe wrapper for motion.div style
  const motionStyle = isReducedMotion ? {} : {
    rotateX,
    rotateY,
    scale,
    y: yLift,
    transformStyle: 'preserve-3d' as const,
  };

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={motionStyle}
      className={`group relative rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_40px_rgba(161,224,0,0.1)] ${hasBg ? '' : 'bg-neutral-900'} ${className}`}
    >
      {/* Breathing Light Effect */}
      {!isReducedMotion && (
        <motion.div 
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: useTransform(
              [springX, springY],
              ([latestX, latestY]: any[]) => `radial-gradient(800px circle at ${(latestX as number) * 100}% ${(latestY as number) * 100}%, rgba(161,224,0,0.08), transparent 40%)`
            )
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
