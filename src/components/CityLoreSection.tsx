import React, { useState } from 'react';
import { Landmark, FlaskConical, MapPin, Users, BookOpen, X, ArrowDown, ExternalLink } from 'lucide-react';
import { CITIES_DATA } from '../data';
import { CityLore } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function CityLoreSection() {
  const [activeLore, setActiveLore] = useState<CityLore | null>(null);

  return (
    <section id="world-section" className="py-20 px-6 md:px-12 bg-surface-container-lowest/30 relative">
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <span className="font-mono text-xs text-primary uppercase tracking-widest pb-2 block">The Setting</span>
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
          A WORLD DIVIDED
        </h3>
        <div className="w-20 h-1 bg-gradient-to-r from-secondary-container to-primary mx-auto my-4 rounded-full"></div>
        <p className="text-on-surface-variant max-w-xl mx-auto font-sans text-base sm:text-lg">
          Explore the fragile balance and tectonic social divide between the glistening city of progress and the neon-soaked undercity below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {CITIES_DATA.map((city) => {
          const isZaun = city.faction === 'Zaun';
          return (
            <motion.div
              key={city.id}
              whileHover={{ y: -6 }}
              className={`group relative aspect-[4/5] sm:aspect-square md:aspect-video lg:aspect-[4/5] overflow-hidden rounded-2xl border bg-surface-container-low transition-all duration-500 ${
                isZaun 
                  ? 'border-primary/20 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(189,0,255,0.15)]' 
                  : 'border-secondary/20 hover:border-secondary/60 hover:shadow-[0_0_30px_rgba(0,238,252,0.15)]'
              }`}
              id={`city-card-${city.id}`}
            >
              {/* Background cover image with hover scale */}
              <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700">
                <img 
                  className="w-full h-full object-cover" 
                  src={city.imageUrl} 
                  alt={city.imageAlt}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Dark-cyan/blue-gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent z-10"></div>

              {/* Card visual content */}
              <div className="relative z-20 p-6 sm:p-8 h-full flex flex-col justify-end">
                <span className={`font-mono text-xs font-bold mb-2 flex items-center gap-2 ${
                  isZaun ? 'text-primary' : 'text-secondary'
                }`}>
                  {isZaun ? <FlaskConical className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                  {city.name}
                </span>

                <h4 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  {city.title}
                </h4>

                <p className="text-on-surface-variant text-xs sm:text-sm mb-6 max-w-md transition-all duration-300">
                  {city.shortDescription}
                </p>

                <button 
                  onClick={() => setActiveLore(city)}
                  className={`w-fit px-5 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 border ${
                    isZaun 
                      ? 'border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(189,0,255,0.4)]' 
                      : 'border-secondary text-secondary hover:bg-secondary hover:text-black hover:shadow-[0_0_15px_rgba(0,238,252,0.4)]'
                  }`}
                  id={`city-enter-btn-${city.id}`}
                >
                  {isZaun ? 'DESCEND' : 'ENTER ARCHIVES'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* City Archives Detail Dialog */}
      <AnimatePresence>
        {activeLore && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
            onClick={() => setActiveLore(null)}
            id="archives-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-3xl overflow-hidden rounded-2xl border ${
                activeLore.faction === 'Zaun' 
                  ? 'border-primary/40 bg-surface-container shadow-[0_0_40px_rgba(189,0,255,0.2)]' 
                  : 'border-secondary/40 bg-surface-container shadow-[0_0_40px_rgba(0,238,252,0.15)]'
              }`}
              onClick={(e) => e.stopPropagation()}
              id="archives-modal-content"
            >
              {/* Header Cover Banner */}
              <div className="relative h-44 sm:h-52 overflow-hidden flex items-end">
                <img 
                  className="absolute inset-0 w-full h-full object-cover brightness-50" 
                  src={activeLore.imageUrl}
                  alt={activeLore.imageAlt}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
                <div className="relative z-10 p-6">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-black/50 border mb-2 ${
                    activeLore.faction === 'Zaun' ? 'border-primary/50 text-primary' : 'border-secondary/50 text-secondary'
                  }`}>
                    {activeLore.faction === 'Zaun' ? <FlaskConical className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                    {activeLore.faction} Historical Record
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase drop-shadow">
                    {activeLore.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLore(null)}
                  className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/60 border border-outline-variant/35 text-white hover:text-primary transition-colors hover:scale-105"
                  id="close-archives-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Areas */}
              <div className="p-6 overflow-y-auto max-h-[60vh] no-scrollbar grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-container">
                {/* Full Narrative Text */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-outline-variant/20 pb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" /> Chronicles & Lore
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                    {activeLore.fullNarrative}
                  </p>
                </div>

                {/* Locations / Key Figures Sidebar */}
                <div className="md:col-span-5 space-y-6">
                  {/* Locations */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-outline-variant/20 pb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" /> Key Sectors
                    </h5>
                    <ul className="text-xs font-mono text-on-surface-variant space-y-1.5">
                      {activeLore.keyLocations.map((loc, idx) => (
                        <li key={idx} className="flex gap-2 items-center bg-surface-container-low px-2 py-1.5 rounded">
                          <span className={`w-1.5 h-1.5 rounded-full ${activeLore.faction === 'Zaun' ? 'bg-primary' : 'bg-secondary'}`}></span>
                          {loc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Figures */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-outline-variant/20 pb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" /> Notable Influencers
                    </h5>
                    <ul className="text-xs font-mono text-on-surface-variant space-y-1.5">
                      {activeLore.keyFigures.map((fig, idx) => (
                        <li key={idx} className="flex gap-2 items-center bg-surface-container-low px-2 py-1.5 rounded">
                          <ArrowDown className="w-3 h-3 text-white -rotate-90" />
                          {fig}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer status line */}
              <div className="bg-surface-container-lowest p-4 border-t border-outline-variant/20 flex justify-between items-center text-xs font-mono text-on-surface-variant">
                <span>EST: IN-GAME CHRONOLOGY</span>
                <span className="text-secondary tracking-widest bg-secondary/15 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse">
                  ARCHIVES EXPANDED
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
