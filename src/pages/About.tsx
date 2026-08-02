import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { capabilities, experiences } from '../data';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay } },
});

const steps = [
  {
    num: '01',
    title: '工业机器人与柔性制造系统设计',
    desc: '面向制造业产线自动化与柔性生产场景，独立负责复合机器人 HMI、柔性制造管理系统及平台端调度产品的 UI/UX 设计；同时主导工业数字孪生系统设计，完成三维场景、模型渲染及 URDF 仿真相关功能。',
  },
  {
    num: '02',
    title: '商用服务机器人与软硬件交互设计',
    desc: '负责七款商用服务机器人的产品界面及功能迭代，应用场景覆盖医院、商超、写字楼、公寓、酒店、展厅和餐厅；从零参与机器人底盘部署工具、远程部署、智能客服、状态可视化等产品设计，并负责机器人配送小程序、官方网站及海外广告平台等配套产品，积累了设备状态、软件功能与现场服务流程之间的协同设计经验。',
  },
  {
    num: '03',
    title: 'B 端管理产品设计',
    desc: '在新大陆科技负责厨神通、财神通等食品安全监管产品的规划与设计，通过主体追溯、交易监控、数据分析和可视化大屏，支持政府部门掌握批发市场、农贸市场及餐饮行业交易情况；在大管加软件负责独立的 B 端物业管理产品，完成大管加 App 约 15 个模块及 PC、移动端交互设计，统一产品设计规范，并参与线上线下推广物料设计。',
  },
];

const software = ['Figma', 'Framer', 'Webflow', 'Keyshot', 'Cinema 4D', 'Adobe CC'];

export default function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== '#work-experience') return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById('work-experience');
      if (!target) return;

      const headerOffset = 88;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp()}
        className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-10 md:mb-16 font-display"
      >
        About Me
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 lg:gap-16 mb-20 md:mb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <motion.img
            src={`${import.meta.env.BASE_URL}portfolio/about-photo.png`}
            alt="梁佩雯 Payen"
            fetchPriority="high"
            decoding="async"
            className="w-full aspect-[4/5] object-cover rounded-2xl"
            initial={{ filter: 'grayscale(100%) brightness(0.85)' }}
            whileInView={{ filter: 'grayscale(0%) brightness(1)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col justify-center"
        >
          <motion.h2 variants={fadeUp()} className="text-2xl font-semibold mb-6 leading-snug font-display">
            梁佩雯 Payen | UI&amp;UX设计师
          </motion.h2>
          <div className="space-y-5 text-neutral-400 leading-relaxed text-base">
            {[
              '10年UI/UX设计与产品规划经验，覆盖B端SaaS、政企系统及机器人领域，具备从0到1搭建及复杂系统重构的落地能力。',
              '横跨C端商用服务机器人与B端工业机器人场景，能够基于体验驱动与效率优先的设计范式间进行切换，形成完整的人机交互设计方法论。',
              '独立负责工业场景复合机器人HMI及平台端交互设计，打通设备控制与系统调度的操作闭环，主导数字孪生系统搭建。具备从底层控制逻辑出发的系统设计能力，能准确梳理设备行为与调度关系，并转化为高可用的交互方案，适配高复杂度、低容错的工业环境。',
            ].map((text) => (
              <motion.p key={text} variants={fadeUp()}>{text}</motion.p>
            ))}
          </div>

          <motion.div variants={fadeUp()} className="mt-7 pt-6 border-t border-white/[0.09]">
            <h3 className="text-sm font-semibold text-white mb-4 font-display">Skills &amp; Tools</h3>
            <div className="mb-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600 mb-2.5">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap, index) => (
                  <motion.span
                    key={cap}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="px-3 py-1.5 rounded-full bg-neutral-900 border border-white/[0.07] text-xs text-neutral-300"
                  >
                    {cap}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600 mb-2.5">Software</p>
              <div className="flex flex-wrap gap-2">
                {software.map((tool, index) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="px-3 py-1.5 rounded-full bg-neutral-900 border border-white/[0.07] text-xs text-neutral-300"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.section
        id="work-experience"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="scroll-mt-24 mb-20 md:mb-28"
        aria-labelledby="work-experience-title"
      >
        <motion.div variants={fadeUp()} className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A1E000] mb-3">Career</p>
            <h2 id="work-experience-title" className="text-3xl md:text-4xl font-bold tracking-tight font-display">
              Work Experience
            </h2>
          </div>
          <span className="hidden sm:block text-xs text-neutral-600">2017 — Present</span>
        </motion.div>

        <div className="border-t border-white/[0.09]">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.id}
              variants={fadeUp(index * 0.03)}
              className="grid grid-cols-1 md:grid-cols-[170px_minmax(0,1fr)] gap-3 md:gap-10 py-7 md:py-9 border-b border-white/[0.09]"
            >
              <p className="text-sm font-mono tabular-nums text-[#A1E000]">{experience.period}</p>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-5 mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">{experience.company}</h3>
                  <p className="text-sm text-neutral-400 whitespace-nowrap">{experience.role}</p>
                </div>
                <p className="text-sm md:text-[15px] text-neutral-400 leading-7">{experience.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mb-16 md:mb-24"
      >
        <motion.h2 variants={fadeUp()} className="text-3xl font-bold tracking-tight mb-8 md:mb-10 font-display">
          My Project
        </motion.h2>
        <div className="border-t border-white/[0.09]">
          {steps.map((step, index) => (
            <motion.article
              key={step.num}
              variants={fadeUp(index * 0.04)}
              className="group grid grid-cols-[48px_minmax(0,1fr)] md:grid-cols-[88px_minmax(0,1fr)] gap-4 md:gap-8 py-7 md:py-9 border-b border-white/[0.09]"
            >
              <span className="text-2xl md:text-3xl font-bold text-white/10 tabular-nums group-hover:text-[#A1E000]/40 transition-colors font-display">
                {step.num}
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-medium text-white group-hover:text-[#A1E000] transition-colors mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-7">{step.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
