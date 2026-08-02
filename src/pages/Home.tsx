import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Mail, Phone, X, Briefcase, Award, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<(typeof experiences)[number] | null>(null);

  useEffect(() => {
    if (!contactOpen && !selectedExperience) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false);
        setSelectedExperience(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contactOpen, selectedExperience]);

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
        className="min-h-[calc(100svh-6rem)] md:h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden relative noise-overlay"
      >
        {/* Mobile composition: a dedicated vertical layout avoids shrinking desktop absolute positions. */}
        <div className="md:hidden relative z-10 w-full px-5 py-10 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[#A1E000] text-xs font-semibold uppercase tracking-[0.22em] mb-4"
            >
              Digital Product Designer
            </motion.p>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={clipReveal(0.3)}
              className="text-[clamp(2.65rem,12vw,3.75rem)] leading-[0.94] tracking-[-0.045em] font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Designing Digital Experiences<br />Products Thinking<br />Brand Identity
            </motion.h1>

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.45 }}
              className="relative w-[min(66vw,250px)] aspect-square mx-auto mt-8"
            >
              <div
                className="absolute inset-[-14px] rounded-[24px] -z-10"
                style={{ background: 'radial-gradient(ellipse at center, rgba(161,224,0,0.17) 0%, transparent 70%)' }}
              />
              <img
                src={`${import.meta.env.BASE_URL}portfolio/home-avatar.png`}
                alt="梁佩雯 Payen"
                className="w-full h-full object-cover rounded-2xl shadow-[0_0_48px_rgba(0,0,0,0.65)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.45 }}
              className="mt-7 flex items-center justify-center gap-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1E000] opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A1E000]" />
              </span>
              <span className="text-sm font-medium text-neutral-300">Available now</span>
            </motion.div>
          </div>
        </div>

        <motion.div style={{ y: parallax }} className="hidden md:block relative w-[300px] h-[300px]">

          {/* "Designing Digital Experiences" – slides up from left */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.4)}
            className="absolute whitespace-nowrap z-10 text-center"
            style={{ ...textStyle, width: 900, left: -300, top: -210 }}
          >
            Designing Digital<br />Experiences
          </motion.div>

          {/* "Products Thinking" – slides from right */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.55)}
            className="absolute text-right whitespace-nowrap z-10"
            style={{ ...textStyle, right: 340, top: 12 }}
          >
            Products<br />Thinking
          </motion.div>

          {/* "Brand Identity" – slides up from right */}
          <motion.div
            initial="hidden" animate="visible" variants={clipReveal(0.7)}
            className="absolute whitespace-nowrap z-10"
            style={{ ...textStyle, left: 340, bottom: -76 }}
          >
            Brand<br />Identity
          </motion.div>

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute flex items-center gap-2 z-30 whitespace-nowrap"
            style={{ left: 340, top: 10 }}
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
              src={`${import.meta.env.BASE_URL}portfolio/home-avatar.png`}
              alt="梁佩雯 Payen"
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
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 sm:gap-6 md:auto-rows-[250px]">

          {/* Main Intro (2×2) */}
          <TiltCard className="md:col-span-2 md:row-span-2 p-6 md:p-10 min-h-[360px] md:min-h-0 flex flex-col justify-end bg-gradient-to-br from-neutral-900 to-black">
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
              用户需求与商业目标之间建立连接<br />Bridging the gap between user needs and business goals.
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.3)}
              className="text-neutral-400 text-base leading-relaxed"
            >
              专注于 UX/UI 设计、设计系统与交互原型，将想法转化为清晰、可验证、可实施的产品体验。<br />Specializing in UX/UI, design systems, and crafting interactive prototypes that bring ideas to life.
            </motion.p>
          </TiltCard>

          {/* Capabilities */}
          <TiltCard className="md:col-span-2 md:row-span-1 p-6 md:p-8 min-h-[220px] md:min-h-0 flex flex-col justify-center">
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
          <TiltCard className="md:col-span-1 md:row-span-1 p-6 md:p-8 min-h-[220px] md:min-h-0 flex flex-col justify-between items-center text-center">
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
          <TiltCard className="md:col-span-1 md:row-span-1 p-6 md:p-8 min-h-[220px] md:min-h-0 flex flex-col justify-between items-center text-center">
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
          <TiltCard className="md:col-span-2 md:row-span-1 p-6 md:p-8 min-h-[250px] md:min-h-0 overflow-hidden relative">
            <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-5">
              Recent Experience
            </h3>
            <div className="space-y-4 relative z-10">
              {experiences.slice(0, 2).map((exp, i) => (
                <motion.button
                  type="button"
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  aria-label={`查看${exp.company}工作经历`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="cursor-pointer w-full text-left flex justify-between items-start gap-4 border-b border-white/[0.07] pb-4 last:border-0 last:pb-0 group/exp rounded-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#A1E000]"
                >
                  <div className="min-w-0">
                    <h4 className="font-medium text-white group-hover/exp:text-[#A1E000] transition-colors text-sm">{exp.role}</h4>
                    <div className="text-xs text-neutral-500 mt-0.5 relative inline-block break-words">
                      {exp.company}
                      <span className="absolute -bottom-px left-0 w-0 group-hover/exp:w-full h-px bg-[#A1E000]/50 transition-all duration-300 ease-out" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-600 bg-black/50 px-2 py-1 rounded-md flex-shrink-0">
                    {exp.period}
                  </span>
                </motion.button>
              ))}
            </div>
          </TiltCard>

          {/* Contact CTA */}
          <TiltCard className="md:col-span-2 md:row-span-1 p-6 md:p-8 min-h-[260px] md:min-h-0 flex flex-col items-start justify-between group bg-[#A1E000] text-black border-none overflow-hidden relative">
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
                Contact Me
              </h2>
              <p className="text-black/60 font-medium text-sm">联系方式</p>
            </div>
            <motion.button
              type="button"
              onClick={() => setContactOpen(true)}
              aria-label="打开联系方式"
              whileHover={{ scale: 1.12, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="cursor-pointer relative z-10 mt-8 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <ArrowRight size={22} aria-hidden="true" />
            </motion.button>
          </TiltCard>

        </div>
      </div>

      <AnimatePresence>
        {contactOpen && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-dialog-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-8 shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#A1E000]" />
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                autoFocus
                aria-label="关闭联系方式"
                className="cursor-pointer absolute top-5 right-5 w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A1E000] mb-3">Contact</p>
              <h2 id="contact-dialog-title" className="text-3xl font-bold tracking-tight text-white font-display mb-2">Contact Me</h2>
              <p className="text-neutral-400 mb-8">梁佩雯 Payen</p>

              <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                <div className="flex items-center gap-4 py-5">
                  <span className="w-10 h-10 rounded-full bg-white/[0.05] text-[#A1E000] flex items-center justify-center flex-none">
                    <Phone size={17} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">电话</p>
                    <p className="text-base text-white tabular-nums select-text">15975531034</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-5">
                  <span className="w-10 h-10 rounded-full bg-white/[0.05] text-[#A1E000] flex items-center justify-center flex-none">
                    <Mail size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 mb-1">邮箱</p>
                    <p className="text-base text-white break-all select-text">896536245@qq.com</p>
                  </div>
                </div>
              </div>

            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedExperience(null)}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="experience-dialog-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-8 shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#A1E000]" />
              <button
                type="button"
                onClick={() => setSelectedExperience(null)}
                autoFocus
                aria-label="关闭工作经历"
                className="cursor-pointer absolute top-5 right-5 w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A1E000] mb-4">Recent Experience</p>
              <h2 id="experience-dialog-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display pr-12 mb-3">
                {selectedExperience.company}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-7">
                <span className="text-sm text-white">{selectedExperience.role}</span>
                <span className="text-sm font-mono tabular-nums text-neutral-500">{selectedExperience.period}</span>
              </div>
              <div className="border-t border-white/[0.08] pt-6">
                <p className="text-sm sm:text-base text-neutral-300 leading-7 sm:leading-8">{selectedExperience.description}</p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
