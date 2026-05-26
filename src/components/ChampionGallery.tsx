import React, { useRef, useState, useEffect } from 'react';
import { X, Quote, Swords, Diamond, Activity, Shield, Hammer, Info, Radio, Compass, Orbit, AlertCircle } from 'lucide-react';
import { CHAMPIONS_DATA } from '../data';
import { Champion } from '../types';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

export default function ChampionGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedChamp, setSelectedChamp] = useState<Champion | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Set up Framer Motion scroll tracker linked directly to the parent section height
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Fade out and translate the header frame up as we scroll down to keep the wheel viewport clean
  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [0, -100]);

  // Calculate the mechanical lock audio frequency synthesis
  const playLockSound = (index: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Crisp retro computer mechanical clicks
      osc.type = 'triangle';
      const baseFreq = index === 0 ? 300 : 300 + index * 40;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Define steps of the timeline and scale
  const totalCards = 9;
  const startProgress = 0.08;
  const endProgress = 0.92;
  const steps = 8; // Card 2 to 9
  const stepSize = (endProgress - startProgress) / steps; // around 0.105 per card

  // Track active index based on scroll progress to spotlight on side list and central HUD
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let activeIdx = 0;
    if (latest <= startProgress) {
      activeIdx = 0;
    } else if (latest >= endProgress) {
      activeIdx = totalCards - 1;
    } else {
      const stage = Math.floor((latest - startProgress) / stepSize);
      activeIdx = Math.min(totalCards - 1, Math.max(0, stage + 1));
    }
    
    if (activeIdx !== activeIndex) {
      setActiveIndex(activeIdx);
      playLockSound(activeIdx);
    }
  });

  // Mathematically derive the positional and rotational keyframe timelines for each card.
  // Radius defines the circular span in percentage units relative to the square container parent.
  const RADIUS = 40; 

  const getTargetCoordinates = (index: number) => {
    // Top-center starts at -90 degrees (-PI/2), and sweeps clockwise in 40-degree chunks (360/9)
    const angleRad = -Math.PI / 2 + index * (2 * Math.PI / totalCards);
    const pctX = 50 + RADIUS * Math.cos(angleRad);
    const pctY = 50 + RADIUS * Math.sin(angleRad);
    const rotDeg = index * (360 / totalCards);
    return { x: `${pctX}%`, y: `${pctY}%`, rotate: rotDeg };
  };

  const getTimelinesForCard = (i: number) => {
    // Pre-generate timelines for useTransform
    // This allows Framer to map positions completely declaratively without state re-render triggers.
    // The input array: [0, t_start, t_0, t_1, t_2, t_3, t_4, t_5, t_6, t_7, t_8, 1]
    const t: number[] = [0];
    for (let j = 0; j <= steps; j++) {
      t.push(startProgress + j * stepSize);
    }
    t.push(1);

    const xAr: string[] = [];
    const yAr: string[] = [];
    const rAr: number[] = [];

    for (let j = 0; j < t.length; j++) {
      const scrollVal = t[j];
      
      let tgt;
      if (j === 0) {
        // Start high up, right near the headline line so it glides down
        tgt = { x: "50%", y: "-15%", rotate: 0 };
      } else {
        let relativeTargetIdx = 0;
        if (j === t.length - 1) {
          relativeTargetIdx = i;
        } else {
          const landmarkIdx = j - 1; // goes from 0 to 8
          relativeTargetIdx = Math.min(landmarkIdx, i);
        }
        tgt = getTargetCoordinates(relativeTargetIdx);
      }

      xAr.push(tgt.x);
      yAr.push(tgt.y);
      rAr.push(tgt.rotate);
    }

    return {
      input: t,
      x: xAr,
      y: yAr,
      rotate: rAr
    };
  };

  // Function to scroll the viewport to a specific section percentage
  const scrollToCard = (index: number) => {
    if (sectionRef.current) {
      const scrollHeight = sectionRef.current.scrollHeight - window.innerHeight;
      let targetT = 0;
      if (index === 0) {
        targetT = 0;
      } else if (index === totalCards - 1) {
        targetT = 0.98;
      } else {
        // Scroll to the midpoint of the card's active locked-in section
        targetT = startProgress + (index - 0.5) * stepSize;
      }
      
      const targetTop = sectionRef.current.offsetTop + scrollHeight * targetT;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  const activeChamp = CHAMPIONS_DATA[activeIndex];

  return (
    <section 
      ref={sectionRef}
      id="champions-section" 
      className="relative h-[380vh] bg-[#030712] text-white"
    >
      {/* Sticky viewport container (100vh) holding the layout in place */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32 select-none z-10">
        
        {/* Futuristic Grid Overlay on background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 pointer-events-none z-0" />
        
        {/* Central atmospheric lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[580px] sm:h-[580px] blur-[130px] rounded-full transition-all duration-1000 ${
            activeChamp.faction === 'Zaun' ? 'bg-purple-600/10' : 'bg-cyan-600/10'
          }`} />
        </div>

        {/* Centered Premium HUD Info Header */}
        <motion.div 
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-6 sm:top-8 z-20 flex flex-col items-center text-center"
        >
          <p className="text-cyan-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            CORE ARCHIVE // STABILITY MATRIX
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none text-white">
            RADIAL CORE <span className="text-purple-400 text-glow">DOSSIERS</span>
          </h2>
          <p className="text-gray-500 font-mono text-[8px] sm:text-[10px] mt-1.5 uppercase tracking-wider max-w-md hidden sm:block">
            Scroll vertically to rotate sequence. Dossiers expand upon selection.
          </p>
        </motion.div>

        {/* Centered Component Core Radial Alignment Wheel */}
        <div className="w-full max-w-4xl h-full flex items-center justify-center relative select-none mt-10 md:mt-6">
          
          {/* Compass ring grid & degree markings */}
          <div className="absolute w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[640px] lg:h-[640px] border border-white/5 rounded-full pointer-events-none flex items-center justify-center z-0">
            <div className="absolute w-[80%] h-[80%] border border-dashed border-white/10 rounded-full" />
            <div className="absolute w-[50%] h-[50%] border border-white/5 rounded-full" />
            
            {/* Compass degree increments ticks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div 
                key={deg} 
                style={{ transform: `rotate(${deg}deg)` }} 
                className="absolute inset-0 flex flex-col justify-between items-center py-2.5"
              >
                <span className="text-[7.5px] font-mono text-gray-600 font-bold">{deg}°</span>
                <span className="text-[7.5px] font-mono text-gray-600 font-bold">{(deg + 180) % 360}°</span>
              </div>
            ))}
            
            {/* Spinning reticle lines */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-[linear-gradient(to_bottom,rgba(6,182,212,0.15),transparent_40%,transparent_60%,rgba(6,182,212,0.15))] animate-[spin_50s_linear_infinite]" />
            <div className="absolute left-0 right-0 h-[1px] bg-[linear-gradient(to_right,rgba(6,182,212,0.15),transparent_40%,transparent_60%,rgba(6,182,212,0.15))] animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          {/* ACTIVE CENTRAL SPECS DISPLAY PANEL (The Core HUD inside empty center space) */}
          <div className="absolute w-[125px] h-[125px] sm:w-[175px] sm:h-[175px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full bg-[#030712]/95 border border-white/10 flex flex-col items-center justify-center text-center p-4 select-none z-30 shadow-[0_0_35px_rgba(0,0,0,0.95)] overflow-hidden">
            <div className={`absolute inset-x-0 bottom-0 h-1 transition-all duration-700 ${
              activeChamp.faction === 'Zaun' ? 'bg-purple-500' : 'bg-cyan-400'
            }`} />
            
            {/* Mini orbit animated aura */}
            <div className="absolute inset-2.5 border border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className={`absolute -inset-1 blur-md opacity-35 animate-pulse rounded-full transition-colors duration-1000 ${
              activeChamp.faction === 'Zaun' ? 'bg-purple-900/40' : 'bg-cyan-950/40'
            }`} />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className={`text-[7px] sm:text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded ${
                activeChamp.faction === 'Zaun' ? 'text-purple-400 bg-purple-950/40 border border-purple-900/20' : 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/20'
              }`}>
                {activeChamp.faction}
              </span>
              
              <h3 className="font-display text-xs sm:text-base md:text-lg lg:text-xl font-black tracking-tight text-white uppercase leading-none mt-1.5 sm:mt-2 truncate max-w-[110px] sm:max-w-[160px]">
                {activeChamp.name}
              </h3>
              
              <p className="text-[7.5px] sm:text-[99px] font-mono text-gray-400 uppercase tracking-wider mt-0.5 max-w-[100px] sm:max-w-[140px] truncate leading-none">
                {activeChamp.title}
              </p>

              <div className="flex items-center gap-1.5 font-mono text-[7px] sm:text-[8px] text-cyan-400/80 mt-2 sm:mt-3 hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setSelectedChamp(activeChamp)}>
                <Orbit className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
                <span className="font-bold tracking-wider">EXPAND DATA</span>
              </div>
            </div>
          </div>

          {/* Core container of 9 absolutely-positioned cards */}
          {/* We apply a responsive scale factor to ensure the coordinate map fits smaller viewports */}
          <div className="absolute w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[640px] lg:h-[640px] transform scale-95 sm:scale-110 md:scale-100 flex items-center justify-center">
            {CHAMPIONS_DATA.map((champ, idx) => {
              // Retrieve the pre-computed animation coordinate profiles for this card
              const timelines = getTimelinesForCard(idx);

              // Map Framer scroll position to relative coordinates
              const xComputed = useTransform(scrollYProgress, timelines.input, timelines.x);
              const yComputed = useTransform(scrollYProgress, timelines.input, timelines.y);
              const rComputed = useTransform(scrollYProgress, timelines.input, timelines.rotate);

              const isZaun = champ.faction === 'Zaun';
              const isCurrentActive = activeIndex === idx;

              // Determine z-index:
              // Card 1 has index 0, Card 9 has index 8.
              // To enable nested stacking, we need Card 1 to remain above Card 2, Card 2 above Card 3 etc.
              // Thus Card 1 (idx 0) has highest z-index, Card 9 (idx 8) has lowest.
              const zIndex = 100 - idx;

              return (
                <motion.div
                  key={champ.id}
                  style={{
                    left: xComputed,
                    top: yComputed,
                    x: "-50%",
                    y: "-50%",
                    rotate: rComputed,
                    zIndex: zIndex,
                  }}
                  onClick={() => setSelectedChamp(champ)}
                  className={`absolute w-[84px] h-[118px] sm:w-[110px] sm:h-[154px] md:w-[124px] md:h-[174px] lg:w-[136px] lg:h-[190px] rounded-lg overflow-hidden cursor-pointer select-none transition-shadow border bg-[#090d16] shadow-[0_12px_30px_rgba(0,0,0,0.9)] flex flex-col justify-end p-2.5 sm:p-3 group ${
                    isZaun 
                      ? 'border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                      : 'border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  } ${
                    isCurrentActive 
                      ? isZaun 
                        ? 'border-purple-400/85 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-1 ring-purple-500/40' 
                        : 'border-cyan-400/85 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-500/40'
                      : ''
                  }`}
                  id={`champ-card-${champ.id}`}
                >
                  {/* Portrait art */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={champ.imageUrl} 
                      alt={champ.imageAlt}
                      className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark gradient mapping matching the district of heritage */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isZaun ? 'from-purple-950/95 via-purple-950/30' : 'from-cyan-950/95 via-cyan-950/30'
                    } to-transparent opacity-95`} />
                  </div>

                  {/* Mechanical corner tick borders */}
                  <div className={`absolute top-1 left-1 w-2.5 h-2.5 border-t border-l pointer-events-none z-10 ${isZaun ? 'border-purple-400/40' : 'border-cyan-400/40'}`} />
                  <div className={`absolute top-1 right-1 w-2.5 h-2.5 border-t border-r pointer-events-none z-10 ${isZaun ? 'border-purple-400/40' : 'border-cyan-400/40'}`} />
                  <div className={`absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l pointer-events-none z-10 ${isZaun ? 'border-purple-400/40' : 'border-cyan-400/40'}`} />
                  <div className={`absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r pointer-events-none z-10 ${isZaun ? 'border-purple-400/40' : 'border-cyan-400/40'}`} />

                  {/* Card Front Content with readable spacing */}
                  <div className="relative z-20 flex flex-col items-start translate-y-0 text-left select-none">
                    <span className={`inline-block text-[6.5px] sm:text-[7.5px] font-mono px-1.5 py-0.2 rounded-full border mb-1 uppercase ${
                      isZaun ? 'border-purple-500/30 bg-purple-950/20 text-purple-400' : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400'
                    }`}>
                      {champ.faction.toUpperCase()}
                    </span>
                    
                    <h4 className="font-display text-[11px] sm:text-xs md:text-sm lg:text-base font-extrabold text-white leading-none tracking-tight">
                      {champ.name}
                    </h4>
                    
                    <p className="font-mono text-[7px] sm:text-[8px] text-gray-400 uppercase tracking-widest mt-0.5 leading-none overflow-hidden text-ellipsis whitespace-nowrap w-full">
                      {champ.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Subtle Bottom index controller for direct click navigate (Aesthetic & accessible) */}
        <div className="absolute bottom-6 sm:bottom-10 z-20 flex flex-row items-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto px-4 no-scrollbar">
          {CHAMPIONS_DATA.map((champ, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={champ.id}
                onClick={() => scrollToCard(idx)}
                className={`flex flex-col items-center gap-1 group relative outline-none transition-all duration-300 ${
                  isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
                id={`bottom-btn-${champ.id}`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 font-mono text-[9px] sm:text-[10px] font-bold rounded border flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]' 
                    : 'border-white/10 text-gray-400 bg-white/5'
                }`}>
                  0{idx + 1}
                </div>
                {isSelected && (
                  <motion.span 
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)] mt-0.5" 
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Full Modal Profile Dossier Report Viewport */}
      <AnimatePresence>
        {selectedChamp && (
          <div 
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedChamp(null)}
            id="champ-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`relative w-full max-w-4xl overflow-hidden rounded-2xl border ${
                selectedChamp.faction === 'Zaun' 
                  ? 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] bg-[#0c0813]' 
                  : 'border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-[#030912]'
              }`}
              onClick={(e) => e.stopPropagation()}
              id="champ-modal-content"
            >
              <button
                onClick={() => setSelectedChamp(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white hover:text-cyan-400 transition-all duration-300 hover:scale-105"
                id="close-champ-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Visual portrait panel */}
                <div className="relative h-56 md:h-auto md:min-h-[500px] md:col-span-5 bg-black overflow-hidden flex items-center justify-center">
                  <img 
                    className="w-full h-full object-cover object-top" 
                    src={selectedChamp.imageUrl} 
                    alt={selectedChamp.imageAlt}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09080e] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0c0d12]" />
                  
                  <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                    <span className={`px-3 py-1 font-mono text-xs font-bold rounded shadow-md uppercase ${
                      selectedChamp.faction === 'Zaun' 
                        ? 'bg-purple-900/80 border border-purple-500 text-purple-400' 
                        : 'bg-cyan-950/80 border border-cyan-500 text-cyan-400'
                    }`}>
                      {selectedChamp.faction}
                    </span>
                  </div>
                </div>

                {/* Specific biography & matrix metrics */}
                <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between max-h-[75vh] md:max-h-[85vh] overflow-y-auto no-scrollbar">
                  <div>
                    <div>
                      <p className="font-mono text-xs text-cyan-400 tracking-wider leading-none uppercase">
                        {selectedChamp.role}
                      </p>
                      
                      <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-2 ${
                        selectedChamp.faction === 'Zaun' ? 'text-purple-400' : 'text-cyan-400'
                      }`}>
                        {selectedChamp.name}
                      </h2>
                      
                      <p className="font-mono text-xs opacity-75 tracking-widest text-gray-300 uppercase border-b border-white/5 pb-4">
                        {selectedChamp.title}
                      </p>
                    </div>

                    {/* Meta tags */}
                    <div className="flex flex-wrap gap-1.5 my-4">
                      {selectedChamp.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full font-mono text-[9px] bg-slate-900 border border-white/10 text-gray-300"
                        >
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Quote speech box */}
                    {selectedChamp.quote && (
                      <div className="relative my-4 p-4 rounded-lg bg-slate-950/60 border-l-2 border-cyan-500/50 text-gray-100">
                        <Quote className="absolute right-3 top-2 w-10 h-10 text-cyan-400/10 rotate-180" />
                        <p className="font-sans italic text-xs sm:text-sm leading-relaxed relative z-10">
                          "{selectedChamp.quote}"
                        </p>
                      </div>
                    )}

                    {/* Narrative biography */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {selectedChamp.description}
                    </p>

                    {/* Specialist weapons arsenal */}
                    <div className="mb-6">
                      <h4 className="font-mono text-[10px] md:text-xs tracking-wider text-white border-b border-white/10 pb-1 mb-2.5 uppercase flex items-center gap-2">
                        <Hammer className="w-4 h-4 text-cyan-400" /> SPECIALIST ARSENAL
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-400">
                        {selectedChamp.weapons.map((w, idx) => (
                          <li key={idx} className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded border border-white/5">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Power rating sliders */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-[10px] md:text-xs tracking-wider text-white border-b border-white/10 pb-1 mb-2.5 uppercase flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" /> COHERENCY COEFFICIENTS
                      </h4>
                      
                      {/* Combat rating */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Swords className="w-3.5 h-3.5 text-rose-400" /> PHYSICAL COMBAT OVERMATCH
                          </span>
                          <span>{selectedChamp.stats.combat}%</span>
                        </div>
                        <div className="h-1 bg-gray-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedChamp.stats.combat}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-rose-600 to-rose-400"
                          />
                        </div>
                      </div>

                      {/* Hextech rating */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Diamond className="w-3.5 h-3.5 text-cyan-400" /> ARCANE LATENT equilibrium
                          </span>
                          <span>{selectedChamp.stats.hextech}%</span>
                        </div>
                        <div className="h-1 bg-gray-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedChamp.stats.hextech}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Agility rating */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" /> TACTICAL RESPONSE VELOCITY
                          </span>
                          <span>{selectedChamp.stats.agility}%</span>
                        </div>
                        <div className="h-1 bg-gray-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedChamp.stats.agility}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Resilience rating */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-amber-400" /> STRUCTURAL KINETIC INTEGRITY
                          </span>
                          <span>{selectedChamp.stats.resilience}%</span>
                        </div>
                        <div className="h-1 bg-gray-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedChamp.stats.resilience}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Profile record footnote */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>AFFILIATION: {selectedChamp.alliance}</span>
                    <button 
                      onClick={() => setSelectedChamp(null)}
                      className="text-cyan-400 hover:underline hover:text-white transition-colors uppercase font-bold"
                    >
                      DISMISS RECORD
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
