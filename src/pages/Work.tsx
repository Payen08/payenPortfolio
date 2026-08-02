import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data';
import TiltCard from '../components/TiltCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } },
};

export default function Work() {
  const [filter, setFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            项目案例
          </h1>
          <p className="text-neutral-500 max-w-md text-base leading-relaxed">
            汇集数字产品、品牌视觉与交互体验等项目案例。
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                filter === cat
                  ? 'bg-[#A1E000] text-black'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-white/[0.07]'
              }`}
            >
              {filter === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-[#A1E000] -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Count label */}
      <motion.div
        key={filter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-neutral-600 mb-8 uppercase tracking-widest"
      >
        {filteredProjects.length} 个项目
      </motion.div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              variants={cardVariants}
              exit="exit"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link to={`/project/${project.id}`} className="block h-full outline-none">
                <TiltCard className="h-full flex flex-col p-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-neutral-900 relative">
                    <motion.img
                      layoutId={`project-img-${project.id}`}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={hoveredId === project.id ? { scale: 1.06 } : { scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />

                    {/* Category chip */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-medium uppercase tracking-widest bg-black/70 text-[#A1E000] backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Arrow overlay */}
                    <AnimatePresence>
                      {hoveredId === project.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#A1E000] text-black flex items-center justify-center"
                        >
                          <ArrowUpRight size={14} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold tracking-tight mb-0.5 text-white">{project.title}</h3>
                      <p className="text-neutral-500 text-xs">{project.year}</p>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
