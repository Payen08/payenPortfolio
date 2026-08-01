import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/about', label: 'About' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <Link
        to="/"
        className="text-xl font-semibold tracking-tight relative group"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Portfolio
        <motion.span
          className="text-[#A1E000]"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          .
        </motion.span>
      </Link>

      <div className="flex gap-8">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={() => setHoveredLink(link.path)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative text-sm font-medium py-1 text-white transition-colors"
            >
              <span className={isActive ? 'text-[#A1E000]' : hoveredLink === link.path ? 'text-white' : 'text-neutral-400'}>
                {link.label}
              </span>

              {/* Active underline */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#A1E000]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Hover underline */}
              {!isActive && hoveredLink === link.path && (
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/40 origin-left"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
