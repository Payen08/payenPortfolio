import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import workImages from 'virtual:work-images';
import { projects } from '../data';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut', delay } },
});

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const project = projects.find((item) => item.id === id);
  const currentIndex = projects.findIndex((item) => item.id === id);
  const nextProject = projects[currentIndex + 1] ?? projects[0];
  const images = project ? (workImages[project.slug] ?? []) : [];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-medium">项目未找到</h1>
        <Link to="/work" className="text-[#A1E000] hover:underline text-sm">← 返回作品列表</Link>
      </div>
    );
  }

  const galleryWidth = project.imageLayout === 'full' ? 'max-w-[1800px]' : 'max-w-7xl';
  const imageGap = project.imageGap ?? 0;
  const hasProjectDetails = Boolean(project.overview || project.challenge || project.solution);

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-32">
      <header className={`${galleryWidth} mx-auto px-4 md:px-6 pt-24 md:pt-28`}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.2 }}
          className="flex items-center justify-between mb-10 md:mb-12"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
            className="cursor-pointer inline-flex items-center gap-2.5 text-neutral-400 hover:text-white text-sm font-medium bg-white/[0.035] hover:bg-white/[0.07] px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#A1E000] transition-colors"
          >
            <ArrowLeft size={15} aria-hidden="true" /> 返回
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="关闭项目详情"
            className="cursor-pointer w-11 h-11 rounded-full bg-white/[0.035] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#A1E000] transition-colors"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}>
          <motion.h1 variants={fadeIn()} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 md:mb-10 leading-[0.98] font-display break-words">
            {project.title}
          </motion.h1>

          <motion.div variants={fadeIn(0.08)} className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 py-6 md:py-7 border-y border-white/[0.08]">
            <MetaItem label="角色" value={project.role} />
            <MetaItem label="类别" value={project.category} />
            <MetaItem label="年份" value={project.year} />
          </motion.div>
        </motion.div>
      </header>

      {images.length > 0 && (
        <section className={`${galleryWidth} mx-auto px-4 md:px-6 mt-10 md:mt-12`} aria-label={`${project.title} 项目图片`}>
          <div
            className={`flex flex-col ${imageGap === 0 ? 'overflow-hidden rounded-xl md:rounded-2xl' : ''}`}
            style={{ gap: `${imageGap}px` }}
          >
            {images.map((src, index) => (
              <GalleryImage
                key={src}
                src={src}
                alt={`${project.title} — 项目图片 ${index + 1}`}
                eager={index === 0}
                reduceMotion={Boolean(reduceMotion)}
                separated={imageGap > 0}
              />
            ))}
          </div>
        </section>
      )}

      {hasProjectDetails && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 md:mt-32 space-y-12 md:space-y-16">
          {project.overview && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}>
              <motion.p variants={fadeUp()} className="text-xs uppercase tracking-widest text-[#A1E000] font-semibold mb-5">项目概述</motion.p>
              {project.description && (
                <motion.p variants={fadeUp()} className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed font-light">{project.description}</motion.p>
              )}
              {project.overview.split('\n').map((paragraph, index) => (
                <motion.p key={index} variants={fadeUp()} className="text-neutral-400 leading-relaxed text-lg mt-4">{paragraph}</motion.p>
              ))}
            </motion.section>
          )}

          {project.challenge && <TextSection label="设计挑战" text={project.challenge} />}
          {project.solution && <TextSection label="解决方案" text={project.solution} />}
        </div>
      )}

      {project.link && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 md:mt-20">
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cursor-pointer inline-flex items-center gap-3 text-sm font-medium text-white bg-white/6 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors"
          >
            <ExternalLink size={15} aria-hidden="true" /> 查看线上作品
          </motion.a>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 md:mt-32">
        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-white/[0.07] pt-14">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6">下一个项目</p>
          <Link to={`/project/${nextProject.id}`} className="group flex items-center justify-between gap-6 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A1E000]">
            <div>
              <p className="text-neutral-500 text-sm mb-1">{nextProject.category}</p>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white group-hover:text-[#A1E000] transition-colors duration-300 font-display break-words">{nextProject.title}</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-[#A1E000] group-hover:text-black group-hover:border-[#A1E000] transition-colors duration-300 flex-shrink-0">
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
          </Link>
        </motion.div>
      </div>

    </div>
  );
}

function GalleryImage({ src, alt, eager, reduceMotion, separated }: { key?: string; src: string; alt: string; eager: boolean; reduceMotion: boolean; separated: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isGif = /\.gif(?:$|\?)/i.test(src);
  const [isVisible, setIsVisible] = useState(eager);
  const [aspectRatio, setAspectRatio] = useState<number>();

  useEffect(() => {
    if (!isGif || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '240px 0px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isGif]);

  return (
    <motion.div
      ref={containerRef}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={isGif && !isVisible ? { aspectRatio: aspectRatio ?? 16 / 9 } : undefined}
      className={`block w-full overflow-hidden bg-neutral-950 ${separated ? 'rounded-xl md:rounded-2xl' : ''}`}
    >
      {(!isGif || isVisible) && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={(event) => setAspectRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
          className="w-full h-auto block"
        />
      )}
    </motion.div>
  );
}

function TextSection({ label, text }: { label: string; text: string }) {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.p variants={fadeUp()} className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-5">{label}</motion.p>
      <motion.p variants={fadeUp()} className="text-neutral-300 leading-relaxed text-lg">{text}</motion.p>
    </motion.section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">{label}</div>
      <div className="font-medium text-white text-sm">{value}</div>
    </div>
  );
}
