import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrailerModal from './components/TrailerModal';
import ChampionGallery from './components/ChampionGallery';
import WeaponShowcase from './components/WeaponShowcase';
import CityLoreSection from './components/CityLoreSection';
import BottomNav from './components/BottomNav';
import Globe from './components/Globe';
import { Play, Shield, ShieldAlert, Swords, Heart, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  // Implement the requested smooth parallax scrolling logic for the hero image
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-on-background selection:bg-primary-container selection:text-white bg-background relative min-h-screen">
      {/* Background Vintage Film Grain Overlay */}
      <div className="grain-overlay pointer-events-none"></div>

      {/* Navigation Header */}
      <Header onTuningClick={() => {
        const el = document.getElementById('globe-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Sliding Sheet Stacking Envelope: 
          Keeps all top-page content elevated (z-10) with solid backdrop to hide the sticky footer (z-0) 
          lying underneath until the user reaches the end of the page page. */}
      <div className="relative z-10 bg-background shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
        {/* Hero Section */}
        <section 
          id="home" 
          className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img 
              alt="Arcane Cinematic Fight" 
              className="w-full h-full object-cover brightness-[0.55]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkD4fgjNp2HYFycVy6PBYFGv3lL2xu9_C1_q7-LgfwIxHmrl6vLdtZEBaKQ69pybsDrc370Pn1wAJIeclSgPWyieeEpHLrqZiui2Ca_uALrP5BCamSEzNI78l9TxWWAJexhlgmeF-2Uh9BIYiN2N9_7yRdx-SrLbscH0Na6ZYwNCzZ7yA4OVuJ9yHO8C7mYnf5TaicrhjwOVwbGhNynaU9w3XNCpkmcQx7CmNtSEHBOygcts8ZaclO1FfGW87gf0I49U_x3gtSizI"
              style={{ 
                transform: `translateY(${scrollY * 0.4}px) scale(1.05)`,
                transition: 'transform 0.05s ease-out'
              }}
              referrerPolicy="no-referrer"
            />
            {/* Ambient overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-background/50"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 text-center px-6 flex flex-col items-center">
            {/* Animated decorative line */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-0.5 bg-primary mb-6"
            />

            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-5xl sm:text-6xl md:text-8xl leading-tight uppercase tracking-tighter mb-4 max-w-4xl select-none"
            >
              EVERYONE IS A <span className="text-primary text-glow font-black block sm:inline">MONSTER</span>
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-mono text-xs sm:text-sm text-on-surface-variant max-w-lg mb-10 tracking-[0.15em] uppercase"
            >
              Unbind the twin fates of Piltover and the Undercity.
            </motion.p>

            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={() => setIsTrailerOpen(true)}
              className="bg-primary-container text-on-primary-container hover:bg-primary-container/85 px-8 py-4 rounded-full font-mono text-xs font-bold flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 hextech-glow group cursor-pointer"
              id="watch-trailer-hero-btn"
            >
              <Play className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform duration-350" />
              WATCH TRAILER
            </motion.button>
          </div>

          {/* Floating scroll guide */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[9px] text-primary/70 animate-bounce cursor-pointer"
               onClick={() => {
                 const el = document.getElementById('champions-section');
                 if (el) el.scrollIntoView({ behavior: 'smooth' });
               }}
          >
            <span>DESCEND TO CHAMPIONS</span>
            <ChevronDown className="w-4.5 h-4.5 text-primary" />
          </div>
        </section>

        {/* Main interactive sections content */}
        <main className="relative bg-background">
          
          {/* Champions Carousel Frame */}
          <ChampionGallery />

          {/* Dynamic Weapons Stacking Exhibit Section */}
          <WeaponShowcase />

          {/* Hextech Divider Bar */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4"></div>

          {/* Piltover vs Zaun Divided Factions Story/Lore */}
          <CityLoreSection />
        </main>
      </div>

      {/* Globe Footer Integration */}
      <Globe />

      {/* Cinematic Modal Player */}
      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
      />

      {/* Bottom Floating Navigation Console */}
      <BottomNav />
    </div>
  );
}
