import React from 'react';
import { Menu, Zap } from 'lucide-react';

interface HeaderProps {
  onTuningClick: () => void;
}

export default function Header({ onTuningClick }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center px-6 py-4 md:px-12 transition-all duration-300">
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
            const el = document.getElementById('hextech-core-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center justify-center p-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all hover:scale-110 active:scale-95 animate-pulse"
          title="Stabilize Hextech Core"
          id="header-bolt-btn"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </div>
    </header>
  );
}
