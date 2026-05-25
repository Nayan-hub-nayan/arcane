import React, { useState, useEffect } from 'react';
import { Home, Eye, Compass, Swords, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'home' | 'champions' | 'weapons' | 'world' | 'core';

interface NavItem {
  id: Tab;
  sectionId: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', sectionId: 'home', label: 'Top', icon: Home },
  { id: 'champions', sectionId: 'champions-section', label: 'Champions', icon: Eye },
  { id: 'weapons', sectionId: 'weapons-showcase', label: 'Weapons', icon: Swords },
  { id: 'world', sectionId: 'world-section', label: 'World', icon: Compass },
  { id: 'core', sectionId: 'globe-section', label: 'Terminal', icon: Zap },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);

  const scrollToSection = (id: string, tab: Tab) => {
    setActiveTab(tab);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Setup intersection observer to automatically highlight current navigation node as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = window.innerHeight;

      const championsEl = document.getElementById('champions-section');
      const weaponsEl = document.getElementById('weapons-showcase');
      const worldEl = document.getElementById('world-section');
      const globeEl = document.getElementById('globe-section');

      if (globeEl && scrollPos >= globeEl.offsetTop - height / 2) {
        setActiveTab('core');
      } else if (worldEl && scrollPos >= worldEl.offsetTop - height / 2) {
        setActiveTab('world');
      } else if (weaponsEl && scrollPos >= weaponsEl.offsetTop - height / 2) {
        setActiveTab('weapons');
      } else if (championsEl && scrollPos >= championsEl.offsetTop - height / 2) {
        setActiveTab('champions');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 w-[92%] md:max-w-lg rounded-full bg-surface-container/70 backdrop-blur-2xl border border-outline-variant/30 shadow-[0_15px_35px_rgba(0,238,252,0.15)] z-40 flex justify-between items-center h-16 px-3"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isHovered = hoveredTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.sectionId, item.id)}
            onMouseEnter={() => setHoveredTab(item.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className="relative px-4 py-2.5 rounded-full flex flex-col items-center justify-center transition-colors duration-300 select-none flex-1 outline-none group cursor-pointer"
            id={`nav-btn-${item.id}`}
            title={item.label}
          >
            {/* Sliding Capsule Highlight (layoutId animation) */}
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="absolute inset-0 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full border border-primary/30 shadow-[inset_0_0_12px_rgba(0,238,252,0.25)] z-0"
              />
            )}

            {/* Hover Background Accent */}
            <AnimatePresence>
              {isHovered && !isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-white/5 rounded-full z-0"
                />
              )}
            </AnimatePresence>

            {/* Glowing Dot Above Active Icon */}
            {isActive && (
              <motion.div 
                layoutId="nav-dot"
                className="absolute -top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(0,238,252,1)]"
              />
            )}

            {/* Icon representation */}
            <motion.div
              animate={{ 
                scale: isActive ? 1.15 : isHovered ? 1.1 : 1,
                y: isActive ? -1 : isHovered ? -2 : 0,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`relative z-10 ${
                isActive ? 'text-primary' : 'text-on-surface-variant/60 group-hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
            </motion.div>

            {/* Micro Caption on Big Screens */}
            <span className={`absolute -bottom-5 text-[8px] font-mono tracking-widest uppercase transition-all duration-300 ${
              isActive 
                ? 'opacity-85 text-primary scale-100 translateY(0px)' 
                : isHovered 
                ? 'opacity-60 text-white/70 scale-95 translateY(-1px)' 
                : 'opacity-0 scale-75 translate-y-1 invisible'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
