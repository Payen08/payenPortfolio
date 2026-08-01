/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  作品集数据文件 — 按字段说明替换成你自己的内容                  ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  详情图：放入 public/work/<slug>/，按文件名数字顺序自动读取     ║
 * ║  支持 PNG、WebP、GIF，无需在这里逐张配置                        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// GitHub Pages 子路径部署：图片路径需带上 base 前缀
const base = import.meta.env.BASE_URL;

const img = (path: string) => `${base}${path.replace(/^\//, '')}`;

export type Project = {
  id: string;
  title: string;
  category: string;

  // ── 详情页图片文件夹名：public/work/<slug>/ ──
  slug: string;

  // ── 详情页图片布局（可选）──
  imageLayout?: 'full' | 'contained';
  imageGap?: number;

  // ── 卡片缩略图（用于 Work 列表页 & 照片墙）──
  image: string;

  description: string;        // 卡片/列表页的简短描述（1-2 句）
  overview?: string;          // 详情页的项目背景/概述（可多段，用 \n 换行）
  challenge?: string;         // 设计挑战/问题描述
  solution?: string;          // 设计解决方案

  role: string;
  year: string;
  client?: string;            // 客户/公司名（可选）
  tags?: string[];            // 技能/工具标签（可选）
  link?: string;              // 线上链接（可选）
};

export const projects: Project[] = [
  {
    id: '1',
    slug: 'project-01',
    title: '项目名称 01',
    category: 'Web',

    // 卡片封面图
    image: img('portfolio/project-01.png'),
    imageLayout: 'contained',
    imageGap: 0,

    description: '一句话简介，显示在 Work 列表卡片上。',
    overview: '项目背景和目标，这里可以写得详细一些。\n比如为什么做这个项目、面向什么用户、你负责哪些部分。',
    challenge: '描述设计上遇到的核心挑战，比如信息架构复杂、用户认知负担重等。',
    solution: '你如何解决这些挑战，用了哪些设计策略、方法论、工具。',

    role: '产品设计师',
    year: '2025',
    client: '客户/公司名称',
    tags: ['Figma', '用户研究', '设计系统', '原型测试'],
    link: 'https://your-live-site.com',
  },
  {
    id: '2',
    slug: 'project-02',
    title: '熊猫师傅Panda',
    category: 'App',
    image: img('portfolio/project-02-cover.png'),
    imageGap: 0,
    description: '一句话简介，显示在 Work 列表卡片上。',
    overview: '项目背景描述。',
    challenge: '核心设计挑战。',
    solution: '解决方案思路。',
    role: '交互设计师',
    year: '2024',
    client: '客户/公司名称',
    tags: ['Figma', 'Principle', '用户访谈'],
  },
  {
    id: '3',
    slug: 'project-03',
    title: 'Deca用户体验设计',
    category: 'Brand',
    image: img('portfolio/project-03-cover.png'),
    description: '一句话简介。',
    overview: '项目背景描述。',
    challenge: '核心设计挑战。',
    solution: '解决方案思路。',
    role: '视觉设计师',
    year: '2024',
    tags: ['品牌设计', 'Illustrator', 'Photoshop'],
  },
  {
    id: '4',
    slug: 'project-04',
    title: '大管加APP改版',
    category: 'Web',
    image: img('portfolio/project-04-cover.png'),
    description: '一句话简介。',
    overview: '项目背景描述。',
    role: '产品设计师',
    year: '2023',
    tags: ['Figma', 'Webflow'],
  },
  {
    id: '5',
    slug: 'project-05',
    title: '项目名称 05',
    category: 'App',
    image: img('portfolio/project-05-cover.png'),
    description: '一句话简介。',
    overview: '项目背景描述。',
    role: 'UX 设计师',
    year: '2023',
    tags: ['用户研究', 'Figma', 'Maze 测试'],
  },
  {
    id: '6',
    slug: 'project-06',
    title: '项目名称 06',
    category: 'Brand',
    image: img('portfolio/project-06-cover.png'),
    description: '一句话简介。',
    overview: '项目背景描述。',
    role: '创意总监',
    year: '2022',
    tags: ['品牌策略', 'Illustrator'],
  },
];

// ──────────────────────────────────────────────────────
// 工作经历
// ──────────────────────────────────────────────────────
export const experiences = [
  {
    id: 1,
    role: '你的职位',
    company: '公司名称',
    period: '2023 - 至今',
    description: '简短描述主要职责。',
  },
  {
    id: 2,
    role: '你的职位',
    company: '公司名称',
    period: '2020 - 2023',
    description: '简短描述主要职责。',
  },
  {
    id: 3,
    role: '你的职位',
    company: '公司名称',
    period: '2018 - 2020',
    description: '简短描述主要职责。',
  },
];

// ──────────────────────────────────────────────────────
// 技能标签
// ──────────────────────────────────────────────────────
export const capabilities = [
  '产品设计 (UX/UI)',
  '设计系统',
  '交互原型',
  '用户研究',
  '品牌设计',
  '前端开发',
];

// ──────────────────────────────────────────────────────
// 首页统计数据
// ──────────────────────────────────────────────────────
export const stats = {
  projectsDelivered: 30,
  happyClients: 20,
  yearsExperience: 5,
  awardsWon: 3,
};
