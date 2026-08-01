import { motion } from 'motion/react';
import { capabilities } from '../data';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay } },
});

const steps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Understanding the core problem, user needs, and business objectives through research and stakeholder interviews.',
  },
  {
    num: '02',
    title: 'Strategy',
    desc: 'Defining the product architecture, user flows, and wireframes to establish a solid foundation.',
  },
  {
    num: '03',
    title: 'Design',
    desc: 'Crafting high-fidelity interfaces with a focus on typography, spacing, and interaction design.',
  },
];

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">

      {/* Heading */}
      <motion.h1
        initial="hidden" animate="visible" variants={fadeUp(0)}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-16"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        About Me
      </motion.h1>

      {/* Intro grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {/* Photo with grayscale→color on scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&h=1000&fit=crop"
            alt="Working on a design"
            className="w-full aspect-[4/5] object-cover rounded-2xl"
            initial={{ filter: 'grayscale(100%) brightness(0.85)' }}
            whileInView={{ filter: 'grayscale(0%) brightness(1)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col justify-center"
        >
          <motion.h2
            variants={fadeUp()}
            className="text-2xl font-semibold mb-6 leading-snug"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Hello, I'm a digital product designer based in San Francisco.
          </motion.h2>
          <div className="space-y-5 text-neutral-400 leading-relaxed text-base">
            {[
              'I specialize in creating intuitive, visually compelling digital experiences that bridge the gap between user needs and business goals.',
              'With over a decade of experience, I\'ve had the opportunity to work with emerging startups and established global brands, helping them define their visual language and build scalable design systems.',
              'When I\'m not designing, you can find me exploring the outdoors, taking photographs, or experimenting with new technologies.',
            ].map((text, i) => (
              <motion.p key={i} variants={fadeUp()}>{text}</motion.p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Approach + Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">

        {/* My Approach */}
        <div>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp()}
            className="text-3xl font-bold tracking-tight mb-10"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            My Approach
          </motion.h2>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.55 }}
                className="group"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <motion.span
                    className="text-3xl font-bold text-white/10 tabular-nums transition-colors duration-300 group-hover:text-[#A1E000]/40"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {step.num}
                  </motion.span>
                  <h3 className="text-lg font-medium text-white group-hover:text-[#A1E000] transition-colors duration-300">
                    {step.title}
                  </h3>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed ml-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills & Tools */}
        <div>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp()}
            className="text-3xl font-bold tracking-tight mb-10"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Skills &amp; Tools
          </motion.h2>

          <div className="mb-10">
            <h3 className="text-neutral-600 text-xs font-medium mb-4 uppercase tracking-widest">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 220, damping: 16 }}
                  whileHover={{ scale: 1.07, backgroundColor: 'rgba(161,224,0,0.12)', color: '#A1E000', borderColor: 'rgba(161,224,0,0.4)' }}
                  className="px-4 py-2 rounded-full bg-neutral-900 border border-white/5 text-sm text-neutral-300 cursor-default transition-colors"
                >
                  {cap}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-neutral-600 text-xs font-medium mb-4 uppercase tracking-widest">Software</h3>
            <div className="flex flex-wrap gap-2">
              {['Figma', 'Framer', 'Webflow', 'React', 'Tailwind CSS', 'Adobe CC'].map((tool, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 + 0.3, duration: 0.4 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(161,224,0,0.4)', color: '#fff' }}
                  className="px-4 py-2 rounded-full border border-neutral-800 text-sm text-neutral-400 cursor-default transition-colors"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
