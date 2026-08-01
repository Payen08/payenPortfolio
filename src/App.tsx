/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import AmbientBackground from './components/AmbientBackground';
import CustomCursor from './components/CustomCursor';

/**
 * Short opacity-only transition keeps navigation calm and predictable.
 */
function PageWrapper({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      {/* @ts-ignore - React 19 typing conflict */}
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/work"       element={<PageWrapper><Work /></PageWrapper>} />
        <Route path="/project/:id" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
        <Route path="/about"      element={<PageWrapper><About /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div
        className="min-h-screen bg-[#000000] text-white selection:bg-[#A1E000] selection:text-black overflow-x-hidden relative"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <CustomCursor />
        <AmbientBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
