import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (previewIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewIndex(null);
      if (event.key === 'ArrowLeft') {
        setPreviewIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setPreviewIndex((index) => index === null ? null : (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, previewIndex]);

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

  return (
    <div className="min-h-screen bg-black pb-32">
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
          <motion.h1 variants={fadeIn()} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 md:mb-10 leading-none font-display">
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
                onOpen={() => setPreviewIndex(index)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-6 mt-24 md:mt-32 space-y-16">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}>
          <motion.p variants={fadeUp()} className="text-xs uppercase tracking-widest text-[#A1E000] font-semibold mb-5">项目概述</motion.p>
          <motion.p variants={fadeUp()} className="text-xl md:text-2xl text-white leading-relaxed font-light">{project.description}</motion.p>
          {project.overview?.split('\n').map((paragraph, index) => (
            <motion.p key={index} variants={fadeUp()} className="text-neutral-400 leading-relaxed text-lg mt-4">{paragraph}</motion.p>
          ))}
        </motion.section>

        {project.challenge && <TextSection label="设计挑战" text={project.challenge} />}
        {project.solution && <TextSection label="解决方案" text={project.solution} />}
      </div>

      {project.link && (
        <div className="max-w-6xl mx-auto px-6 mt-20">
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

      <div className="max-w-6xl mx-auto px-6 mt-32">
        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-white/[0.07] pt-14">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6">下一个项目</p>
          <Link to={`/project/${nextProject.id}`} className="group flex items-center justify-between gap-6 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A1E000]">
            <div>
              <p className="text-neutral-500 text-sm mb-1">{nextProject.category}</p>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white group-hover:text-[#A1E000] transition-colors duration-300 font-display">{nextProject.title}</h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-[#A1E000] group-hover:text-black group-hover:border-[#A1E000] transition-colors duration-300 flex-shrink-0">
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {previewIndex !== null && (
          <Lightbox
            images={images}
            index={previewIndex}
            title={project.title}
            onClose={() => setPreviewIndex(null)}
            onPrevious={() => setPreviewIndex((previewIndex - 1 + images.length) % images.length)}
            onNext={() => setPreviewIndex((previewIndex + 1) % images.length)}
            reduceMotion={Boolean(reduceMotion)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryImage({ src, alt, eager, reduceMotion, separated, onOpen }: { key?: string; src: string; alt: string; eager: boolean; reduceMotion: boolean; separated: boolean; onOpen: () => void }) {
  const containerRef = useRef<HTMLButtonElement>(null);
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
    <motion.button
      ref={containerRef}
      type="button"
      onClick={onOpen}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={`全屏查看：${alt}`}
      style={isGif && !isVisible ? { aspectRatio: aspectRatio ?? 16 / 9 } : undefined}
      className={`cursor-zoom-in block w-full overflow-hidden bg-neutral-950 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#A1E000] ${
        separated
          ? 'rounded-xl md:rounded-2xl focus-visible:outline-offset-4'
          : 'focus-visible:outline-offset-0'
      }`}
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
    </motion.button>
  );
}

function Lightbox({ images, index, title, onClose, onPrevious, onNext, reduceMotion }: { images: string[]; index: number; title: string; onClose: () => void; onPrevious: () => void; onNext: () => void; reduceMotion: boolean }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 图片预览`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
    >
      <button type="button" onClick={onClose} autoFocus aria-label="关闭预览" className="cursor-pointer absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors">
        <X size={20} aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button type="button" onClick={(event) => { event.stopPropagation(); onPrevious(); }} aria-label="上一张" className="cursor-pointer absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); onNext(); }} aria-label="下一张" className="cursor-pointer absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1E000] transition-colors">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </>
      )}

      <motion.img
        key={images[index]}
        src={images[index]}
        alt={`${title} — 全屏图片 ${index + 1}`}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onClick={(event) => event.stopPropagation()}
        className="max-w-full max-h-full w-auto h-auto object-contain select-none"
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tabular-nums text-neutral-400 bg-black/50 px-3 py-1.5 rounded-full">{index + 1} / {images.length}</div>
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
