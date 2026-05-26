import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrailerModal from './components/TrailerModal';
import HeroScroll from './components/HeroScroll';
import ChampionGallery from './components/ChampionGallery';
import WeaponShowcase from './components/WeaponShowcase';
import CityLoreSection from './components/CityLoreSection';
import BottomNav from './components/BottomNav';
import Globe from './components/Globe';
import { Play, Shield, ShieldAlert, Swords, Heart, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);

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
          lying underneath until the user reaches the end of the page. */}
      <div className="relative z-10 bg-background shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
        {/* Dynamic Canvas-Based Image Sequence Scrollytelling Hero */}
        <HeroScroll />

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
