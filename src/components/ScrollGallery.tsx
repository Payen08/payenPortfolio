import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

/**
 * Dual-column counter-scroll gallery.
 *
 * The viewport is pinned while:
 *   • Left column  scrolls UP   (yPercent: 0 → -40)
 *   • Right column scrolls DOWN (yPercent: -40 → 0)
 *
 * Right column is pre-shifted to -40% so both columns have visible,
 * centered content at the moment the gallery enters the screen.
 * After the pin ends, the next section slides in naturally.
 *
 * 8 images per column → plenty of content without DOM bloat.
 */

// Stagger starting image so the two columns feel varied
const LEFT_ITEMS  = projects.slice(0, 8);
const RIGHT_ITEMS = [...projects.slice(5), ...projects.slice(0, 3)]; // shift for variety

export default function ScrollGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Right column starts 40% above natural position so it enters
      // the viewport from the top while scrolling downward.
      gsap.set(leftRef.current,  { yPercent: 0   });
      gsap.set(rightRef.current, { yPercent: -40 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      // Left  → moves UP
      tl.to(leftRef.current,  { yPercent: -40, force3D: true }, 0);
      // Right → moves DOWN (counter direction)
      tl.to(rightRef.current, { yPercent:   0, force3D: true }, 0);

      ScrollTrigger.create({
        trigger:    containerRef.current,
        start:      'top top',
        end:        '+=220%',      // how long the pin lasts (220% of vh)
        pin:        wrapperRef.current,
        pinSpacing: true,          // pushes next section down → natural release
        animation:  tl,
        scrub:      1.2,           // silky lag behind finger
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative hidden md:block w-full bg-black">
      {/* Pinned viewport */}
      <div
        ref={wrapperRef}
        className="h-screen overflow-hidden relative flex justify-center bg-black"
      >
        {/* Section label — sits above the fade mask */}
        <div className="absolute top-0 inset-x-0 z-20 pointer-events-none flex justify-center pt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-600 font-medium select-none">
            Selected Work
          </p>
        </div>

        {/* ── Two counter-scrolling columns ── */}
        <div className="flex gap-6 w-full max-w-[1400px] mx-auto px-8 h-full">

          {/* Left column — scrolls UP */}
          <div
            ref={leftRef}
            className="w-1/2 flex flex-col gap-5 pt-20 pb-10"
            style={{ willChange: 'transform' }}
          >
            {LEFT_ITEMS.map((p, i) => (
              <GalleryCard key={`l-${i}`} project={p} />
            ))}
          </div>

          {/* Right column — scrolls DOWN (counter) */}
          <div
            ref={rightRef}
            className="w-1/2 flex flex-col gap-5 pt-20 pb-10"
            style={{ willChange: 'transform' }}
          >
            {RIGHT_ITEMS.map((p, i) => (
              <GalleryCard key={`r-${i}`} project={p} />
            ))}
          </div>
        </div>

        {/* ── Fade masks ── */}
        {/* Top: hides cards entering from above */}
        <div
          className="absolute inset-x-0 top-0 z-10 pointer-events-none"
          style={{
            height: '22%',
            background: 'linear-gradient(to bottom, #000000 0%, #000000 40%, transparent 100%)',
          }}
        />
        {/* Bottom: hides cards about to leave below */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{
            height: '22%',
            background: 'linear-gradient(to top, #000000 0%, #000000 40%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

const GalleryCard: React.FC<{ project: any }> = ({ project }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      to={`/project/${project.id}`}
      className="relative block flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-950"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fixed aspect ratio */}
      <div className="aspect-[4/3] relative overflow-hidden">

        {/* Image with subtle zoom on hover */}
        <motion.img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Hover info overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end p-5"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)',
              }}
            >
              <motion.span
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.18, delay: 0.03 }}
                className="text-[10px] uppercase tracking-widest text-[#A1E000] font-semibold mb-1"
              >
                {project.category}
              </motion.span>
              <motion.h3
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.18, delay: 0.07 }}
                className="text-white font-medium text-sm leading-snug"
              >
                {project.title}
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle inset border */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.05] pointer-events-none" />
      </div>
    </Link>
  );
};
