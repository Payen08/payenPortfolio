import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  role: string;
  year: string;
}

interface DeviceShowcaseProps {
  projects: Project[];
}

export default function DeviceShowcase({ projects }: DeviceShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activeProject = projects[activeIndex] ?? projects[0];

  useEffect(() => {
    if (reducedMotion) return;

    let ctx = gsap.context(() => {
      gsap.set(deviceRef.current, { y: '30vh', scale: 0.82, opacity: 0, rotateX: 8 });
      const tl = gsap.timeline();
      tl.to(deviceRef.current, {
        y: 0, scale: 1, opacity: 1, rotateX: 0,
        duration: 0.15, ease: 'power3.out',
      });
      tl.to({}, { duration: 0.85 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${projects.length * 120}%`,
        pin: wrapperRef.current,
        scrub: true,
        pinSpacing: true,
        animation: tl,
        onUpdate: (self) => {
          const index = Math.min(projects.length - 1, Math.floor(self.progress * projects.length));
          setActiveIndex(Math.max(0, index));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects.length, reducedMotion]);

  if (!activeProject) return null;

  if (reducedMotion) {
    return (
      <div className="py-24 px-6 md:px-12 flex flex-col gap-16 max-w-7xl mx-auto">
        {projects.map((p) => (
          <div key={p.id} className="flex flex-col gap-6">
            <Link
              to={`/project/${p.id}`}
              aria-label={`查看项目：${p.title}`}
              className="cursor-pointer block aspect-[16/10] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A1E000]"
            >
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            </Link>
            <div>
              <p className="text-sm text-[#A1E000] mb-2">{p.category}</p>
              <h3 className="text-2xl font-semibold mb-4 text-white">{p.title}</h3>
              <p className="text-neutral-400 mb-4">{p.description}</p>
              <Link to={`/project/${p.id}`} className="text-white hover:text-[#A1E000] flex items-center gap-2 transition-colors">
                View Project <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden md:block w-full bg-black min-h-screen">
      <div ref={wrapperRef} className="h-screen w-full flex items-center justify-center overflow-hidden relative">
        <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* ── Text Section (Left) ── */}
          <div className="col-span-5 relative">
            {/* Project counter */}
            <div className="flex items-center gap-3 mb-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeIndex}
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl font-bold text-white/10 tabular-nums"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {String(activeIndex + 1).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              <span className="text-neutral-700 text-xl font-light">
                / {String(projects.length).padStart(2, '0')}
              </span>
            </div>

            {/* Current project — one source of truth for text and route */}
            <div className="relative h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col justify-start"
                >
                  <span className="text-[#A1E000] text-xs font-medium tracking-[0.2em] uppercase mb-4">
                    {activeProject.category}
                  </span>
                  <h3
                    className="text-4xl lg:text-5xl font-semibold text-white mb-5 leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {activeProject.title}
                  </h3>
                  <p className="text-neutral-500 text-base mb-8 max-w-md leading-relaxed">
                    {activeProject.description}
                  </p>
                  <Link
                    to={`/project/${activeProject.id}`}
                    className="inline-flex items-center gap-2.5 text-white bg-white/8 hover:bg-white/14 rounded-full px-5 py-2.5 transition-all w-fit text-sm font-medium border border-white/10 hover:border-white/20 group/link"
                  >
                    <span>View Project</span>
                    <ArrowRight size={15} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Vertical progress indicator */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {projects.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full transition-all duration-500"
                  animate={{
                    height: i === activeIndex ? 32 : 12,
                    backgroundColor: i === activeIndex ? '#A1E000' : 'rgba(255,255,255,0.12)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Device Frame (Right) ── */}
          <div className="col-span-7 flex justify-center" style={{ perspective: '1200px' }}>
            <div
              ref={deviceRef}
              className="relative w-full max-w-[900px] aspect-[16/10] rounded-[2rem] bg-black overflow-hidden"
              style={{
                border: '12px solid #1a1a1a',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 60px rgba(161,224,0,0.04)',
                willChange: 'transform',
              }}
            >
              {/* Inner screen */}
              <div className="relative w-full h-full overflow-hidden bg-neutral-950 rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeProject.id}
                    src={activeProject.image}
                    alt={activeProject.title}
                    initial={{ opacity: 0, scale: 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
                  }}
                />
              </div>

              {/* Screen glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none rounded-xl" />

              {/* Screen notch/camera */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-[#111] z-10" />

              {/* Make the full device banner open the active project */}
              <Link
                to={`/project/${activeProject.id}`}
                aria-label={`查看项目：${activeProject.title}`}
                className="cursor-pointer absolute inset-0 z-20 rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#A1E000]"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden py-24 px-6 flex flex-col gap-16">
        {projects.map((p) => (
          <div key={p.id} className="flex flex-col gap-8">
            <Link
              to={`/project/${p.id}`}
              aria-label={`查看项目：${p.title}`}
              className="cursor-pointer block aspect-[16/10] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A1E000]"
            >
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            </Link>
            <div>
              <p className="text-sm text-[#A1E000] font-medium mb-3">{p.category}</p>
              <h3 className="text-3xl font-semibold mb-4 text-white">{p.title}</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">{p.description}</p>
              <Link to={`/project/${p.id}`} className="text-white inline-flex items-center gap-2 border-b border-white/30 pb-1 hover:border-white transition-colors">
                View Project <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
