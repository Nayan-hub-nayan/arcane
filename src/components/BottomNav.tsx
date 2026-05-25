import React, { useState, useEffect } from 'react';
import { Home, Eye, Compass, Swords, Zap } from 'lucide-react';

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState<'home' | 'champions' | 'weapons' | 'world' | 'core'>('home');

  const scrollToSection = (id: string, tab: 'home' | 'champions' | 'weapons' | 'world' | 'core') => {
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
      const coreEl = document.getElementById('hextech-core-section');

      if (coreEl && scrollPos >= coreEl.offsetTop - height / 2) {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:max-w-md rounded-full bg-surface-container/70 backdrop-blur-2xl border border-outline-variant/30 shadow-[0_0_35px_rgba(0,238,252,0.12)] z-40 flex justify-around items-center h-16 px-4">
      {/* Home / Hero top */}
      <button 
        onClick={() => scrollToSection('home', 'home')}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          activeTab === 'home'
            ? 'bg-secondary-container/20 text-secondary-fixed shadow-[inset_0_0_12px_rgba(0,238,252,0.35)] scale-110'
            : 'text-on-surface-variant/60 hover:text-white hover:scale-105'
        }`}
        id="nav-btn-home"
        title="Scroll to Top"
      >
        <Home className="w-5 h-5" />
      </button>

      {/* Champions Gallery */}
      <button 
        onClick={() => scrollToSection('champions-section', 'champions')}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          activeTab === 'champions'
            ? 'bg-secondary-container/20 text-secondary-fixed shadow-[inset_0_0_12px_rgba(0,238,252,0.35)] scale-110'
            : 'text-on-surface-variant/60 hover:text-white hover:scale-105'
        }`}
        id="nav-btn-champions"
        title="View Champions"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Weapons Showcase */}
      <button 
        onClick={() => scrollToSection('weapons-showcase', 'weapons')}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          activeTab === 'weapons'
            ? 'bg-secondary-container/20 text-secondary-fixed shadow-[inset_0_0_12px_rgba(0,238,252,0.35)] scale-110'
            : 'text-on-surface-variant/60 hover:text-white hover:scale-105'
        }`}
        id="nav-btn-weapons"
        title="Weapons Blueprint"
      >
        <Swords className="w-5 h-5" />
      </button>

      {/* Divided World / Cities Lore */}
      <button 
        onClick={() => scrollToSection('world-section', 'world')}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          activeTab === 'world'
            ? 'bg-secondary-container/20 text-secondary-fixed shadow-[inset_0_0_12px_rgba(0,238,252,0.35)] scale-110'
            : 'text-on-surface-variant/60 hover:text-white hover:scale-105'
        }`}
        id="nav-btn-world"
        title="Explore World"
      >
        <Compass className="w-5 h-5" />
      </button>

      {/* Hextech Core stabilizer */}
      <button 
        onClick={() => scrollToSection('hextech-core-section', 'core')}
        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          activeTab === 'core'
            ? 'bg-secondary-container/20 text-secondary-fixed shadow-[inset_0_0_12px_rgba(0,238,252,0.35)] scale-110'
            : 'text-on-surface-variant/60 hover:text-white hover:scale-105'
        }`}
        id="nav-btn-core"
        title="Tuning Desk"
      >
        <Zap className="w-5 h-5" />
      </button>
    </nav>
  );
}
