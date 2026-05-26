import React, { useState, useEffect, useRef } from 'react';
import { Menu, Zap } from 'lucide-react';

interface HeaderProps {
  onTuningClick: () => void;
}

export default function Header({ onTuningClick }: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header near the top of the page for immediate access
      if (currentScrollY <= 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> slide up out of frame
        setVisible(false);
      } else {
        // Scrolling up -> drop down into frame
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50  flex justify-between items-center px-6 py-4 md:px-12 transition-transform duration-500 ease-out transform ${visible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onTuningClick}
          className="p-1 hover:text-primary transition-colors text-on-surface hover:scale-105"
          title="Tuning Desk"
          id="header-menu-btn"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
      </div>

      <div className="flex flex-col items-center select-none">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-primary tracking-tighter drop-shadow-[0_0_12px_rgba(236,178,255,0.7)] animate-pulse-slow">
          ARCANE
        </h1>
        <p className="text-[9px] font-mono tracking-[0.3em] text-secondary select-none text-glow leading-none pt-1">
          EVERYONE IS A MONSTER
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const el = document.getElementById('globe-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center justify-center p-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all hover:scale-110 active:scale-95 animate-pulse"
          title="Secure Terminal Transmission"
          id="header-bolt-btn"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </div>
    </header>
  );
}
