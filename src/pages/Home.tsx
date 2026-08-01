import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Briefcase, Award, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { experiences, capabilities, stats, projects } from '../data';
import TiltCard from '../components/TiltCard';
import ScrollGallery from '../components/ScrollGallery';
import DeviceShowcase from '../components/DeviceShowcase';
import { Counter } from '../components/Counter';

/* ── Clip-path text reveal animation variants ── */
const clipReveal = (delay = 0) => ({
  hidden: { clipPath: 'inset(100% 0 0 0)', y: 30, opacity: 0 },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 22, stiffness: 120, delay },
  },
});

const fadeUp = (delay = 0) => ({
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay } },
});

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  /* Subtle parallax on scroll for hero text */
  const { scrollY } = useScroll();
  const rawParallax = useTransform(scrollY, [0, 600], [0, -60]);
  const parallax = useSpring(rawParallax, { stiffness: 80, damping: 20 });

  const textStyle = {
    fontSize: 'clamp(44px, 5vw, 68px)',
    lineHeight: '1.08',
    letterSpacing: '-0.025em',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
  };

  return (
    <div className="pt-24 min-h-screen bg-black">

      {/* ── Hero Section ────────────────────────────────── */}
      <div
        ref={heroRef}
        className="h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden relative noise-overlay"
      >
        <motion.div style={{ y: parallax }} className="relative w-[300px] h-[300px]">

          {/* "Designing Digital" – slides up from left */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.4)}
            className="absolute text-right whitespace-nowrap z-0"
            style={{ ...textStyle, left: -128, top: -172 }}
          >
            Designing<br />Digital
          </motion.div>

          {/* "Products That" – slides from right */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.55)}
            className="absolute text-right whitespace-nowrap z-0"
            style={{ ...textStyle, left: -310, top: 4 }}
          >
            Products<br />That
          </motion.div>

          {/* "Impact Innovation" – slides up from right */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.7)}
            className="absolute whitespace-nowrap z-0"
            style={{ ...textStyle, bottom: -88, right: -248 }}
          >
            Impact<br />Innovation
          </motion.div>

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute flex items-center gap-2 z-30 whitespace-nowrap"
            style={{ right: -168, top: 4 }}
          >
            {/* Pulsing dot */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1E000] opacity-50" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A1E000] animate-blink-dot" />
            </span>
            <span className="text-sm font-medium tracking-tight text-neutral-300">
              Available now
            </span>
          </motion.div>

          {/* Portrait image with glow */}
          <motion.div
            initial={{ scale: 2.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 90, delay: 0.2 }}
            className="w-full h-full relative z-20"
          >
            {/* Glow halo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute inset-[-20px] rounded-[28px] z-[-1]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(161,224,0,0.18) 0%, transparent 70%)',
              }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop"
              alt="Portrait"
              className="w-full h-full object-cover rounded-[18px] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              animate={{ boxShadow: ['0 0 40px rgba(161,224,0,0)', '0 0 60px rgba(161,224,0,0.12)', '0 0 40px rgba(161,224,0,0)'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-neutral-500 uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} className="text-neutral-500" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll Gallery ────────────────────────────────── */}
      <ScrollGallery />

      {/* ── Device Showcase ───────────────────────────────── */}
      <DeviceShowcase projects={projects.slice(0, 4)} />

      {/* ── Bento Grid ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[250px]">

          {/* Main Intro (2×2) */}
          <TiltCard className="md:col-span-2 md:row-span-2 p-10 flex flex-col justify-end bg-gradient-to-br from-neutral-900 to-black">
            <div className="mb-auto">
              <motion.div
                whileInView={{ scale: [0.8, 1.1, 1], opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-12 h-12 bg-[#A1E000] rounded-full mb-8 flex items-center justify-center text-black animate-pulse-glow"
              >
                <Briefcase size={22} />
              </motion.div>
            </div>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.15)}
              className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Bridging the gap between user needs and business goals.
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.3)}
              className="text-neutral-400 text-base leading-relaxed"
            >
              Specializing in UX/UI, design systems, and crafting interactive prototypes that bring ideas to life.
            </motion.p>
          </TiltCard>

          {/* Capabilities */}
          <TiltCard className="md:col-span-2 md:row-span-1 p-8 flex flex-col justify-center">
            <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-5">
              Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 15 }}
                  whileHover={{ scale: 1.06, backgroundColor: 'rgba(161,224,0,0.15)', borderColor: 'rgba(161,224,0,0.5)', color: '#A1E000' }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 cursor-default transition-colors"
                >
                  {cap}
                </motion.span>
              ))}
            </div>
          </TiltCard>

          {/* Projects Delivered */}
          <TiltCard className="md:col-span-1 md:row-span-1 p-8 flex flex-col justify-between items-center text-center">
            <motion.div
              whileInView={{ rotate: [0, -10, 10, -5, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Award className="text-[#A1E000] mb-4" size={32} />
            </motion.div>
            <div>
              <div className="text-5xl font-bold tracking-tighter mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                <Counter to={stats.projectsDelivered} suffix="+" />
              </div>
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-widest">Projects Delivered</div>
            </div>
          </TiltCard>

          {/* Client Satisfaction */}
          <TiltCard className="md:col-span-1 md:row-span-1 p-8 flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-center items-end h-16 gap-1.5 mb-4">
              {[40, 70, 45, 90, 60, 80].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: `${h}%`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
                  whileHover={{ backgroundColor: '#ffffff' }}
                  className="flex-1 bg-[#A1E000] rounded-t-sm transition-colors"
                />
              ))}
            </div>
            <div>
              <div className="text-5xl font-bold tracking-tighter mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                <Counter to={100} suffix="%" />
              </div>
              <div className="text-xs text-neutral-500 font-medium uppercase tracking-widest">Client Satisfaction</div>
            </div>
          </TiltCard>

          {/* Recent Experience */}
          <TiltCard className="md:col-span-2 md:row-span-1 p-8 overflow-hidden relative">
            <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-5">
              Recent Experience
            </h3>
            <div className="space-y-4 relative z-10">
              {experiences.slice(0, 2).map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex justify-between items-start border-b border-white/[0.07] pb-4 last:border-0 last:pb-0 group/exp"
                >
                  <div>
                    <h4 className="font-medium text-white group-hover/exp:text-[#A1E000] transition-colors text-sm">{exp.role}</h4>
                    <div className="text-xs text-neutral-500 mt-0.5 relative inline-block">
                      {exp.company}
                      <span className="absolute -bottom-px left-0 w-0 group-hover/exp:w-full h-px bg-[#A1E000]/50 transition-all duration-300 ease-out" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-600 bg-black/50 px-2 py-1 rounded-md flex-shrink-0">
                    {exp.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </TiltCard>

          {/* Contact CTA */}
          <TiltCard className="md:col-span-2 md:row-span-1 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group bg-[#A1E000] text-black border-none overflow-hidden relative">
          {/* Shimmer — pure CSS, only plays on group hover */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)',
                backgroundSize: '250% 100%',
                backgroundPosition: '200% 0',
                animation: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.animation = 'shimmer 0.8s ease forwards';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.animation = 'none';
                (e.currentTarget as HTMLElement).style.backgroundPosition = '200% 0';
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Let's work together
              </h2>
              <p className="text-black/60 font-medium text-sm">Available for new opportunities.</p>
            </div>
            <motion.a
              href="mailto:hello@example.com"
              whileHover={{ scale: 1.12, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative z-10 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 shadow-lg"
            >
              <ArrowRight size={22} />
            </motion.a>
          </TiltCard>

        </div>
      </div>
    </div>
  );
}
