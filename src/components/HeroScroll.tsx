import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ChevronDown, ShieldAlert, Cpu, Sparkles, Navigation } from 'lucide-react';

const TOTAL_FRAMES = 1320;
const PRELOAD_CRITICAL_COUNT = 60; // Number of initial frames required to start scrolling

// Custom hook to preload images for the sequence with advanced queue/network choking prevention
function getFramePath(frameNum: number): string {
  if (frameNum <= 240) {
    const padded = String(frameNum).padStart(3, '0');
    return `/seq-1/ezgif-frame-${padded}.jpg`;
  } else if (frameNum <= 540) {
    const subIdx = frameNum - 240;
    const padded = String(subIdx).padStart(3, '0');
    return `/seq-2/ezgif-frame-${padded}.jpg`;
  } else if (frameNum <= 840) {
    const subIdx = frameNum - 540;
    const padded = String(subIdx).padStart(3, '0');
    return `/seq-3/ezgif-frame-${padded}.jpg`;
  } else if (frameNum <= 1140) {
    const subIdx = frameNum - 840;
    const padded = String(subIdx).padStart(3, '0');
    return `/seq-4/ezgif-frame-${padded}.jpg`;
  } else {
    const subIdx = frameNum - 1140;
    const padded = String(subIdx).padStart(3, '0');
    return `/seq-5/ezgif-frame-${padded}.jpg`;
  }
}

function useImageLoader(onProgress: (percent: number) => void) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [hasResolvedSomeCount, setHasResolvedSomeCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let active = true;

    // Create chunks of indices for preloading without duplicates
    const criticalIndices: number[] = [];
    for (let i = 1; i <= PRELOAD_CRITICAL_COUNT; i++) {
      criticalIndices.push(i);
    }

    const coarseIndices: number[] = [];
    for (let i = PRELOAD_CRITICAL_COUNT + 1; i <= TOTAL_FRAMES; i += 3) {
      coarseIndices.push(i);
    }

    const backgroundIndices: number[] = [];
    const loadedTempSet = new Set([...criticalIndices, ...coarseIndices]);
    for (let i = PRELOAD_CRITICAL_COUNT + 1; i <= TOTAL_FRAMES; i++) {
      if (!loadedTempSet.has(i)) {
        backgroundIndices.push(i);
      }
    }

    const allIndices = [...criticalIndices, ...coarseIndices, ...backgroundIndices];
    const totalToLoad = allIndices.length;
    let resolvedCount = 0;
    let successCount = 0;

    // Dynamic queue loader using pipeline slots
    const CHUNK_SIZE = 10;
    let queueIndex = 0;

    const loadNextChunk = () => {
      if (!active || queueIndex >= allIndices.length) return;

      const chunk = allIndices.slice(queueIndex, queueIndex + CHUNK_SIZE);
      queueIndex += CHUNK_SIZE;

      let chunkResolvedCount = 0;

      chunk.forEach((frameNum) => {
        const img = new Image();
        img.src = getFramePath(frameNum);

        img.onload = () => {
          if (!active) return;
          imagesRef.current[frameNum] = img;
          resolvedCount++;
          successCount++;
          chunkResolvedCount++;

          const percent = Math.round((resolvedCount / totalToLoad) * 100);
          onProgress(percent);

          if (successCount >= PRELOAD_CRITICAL_COUNT && !criticalLoaded) {
            setCriticalLoaded(true);
          }

          setLoadedCount(successCount);
          setHasResolvedSomeCount(resolvedCount);

          if (chunkResolvedCount === chunk.length) {
            loadNextChunk();
          }
        };

        img.onerror = () => {
          if (!active) return;
          resolvedCount++;
          chunkResolvedCount++;

          const percent = Math.round((resolvedCount / totalToLoad) * 100);
          onProgress(percent);

          setHasResolvedSomeCount(resolvedCount);

          if (chunkResolvedCount === chunk.length) {
            loadNextChunk();
          }
        };
      });
    };

    // Spawn 5 independent loading pipelines to parallelize fetching without clogging browser limits
    for (let i = 0; i < 5; i++) {
      loadNextChunk();
    }

    return () => {
      active = false;
    };
  }, []);

  return {
    images: imagesRef.current,
    loadedCount,
    isReady: criticalLoaded || loadedCount >= PRELOAD_CRITICAL_COUNT || hasResolvedSomeCount >= PRELOAD_CRITICAL_COUNT,
  };
}

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setHasScrolled(true);
      }
    };
    if (window.scrollY > 30) {
      setHasScrolled(true);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload sequence
  const { images, isReady } = useImageLoader((progress) => {
    setLoadProgress(progress);
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scale, opacity, and positioning of overlays
  const overlay2Opacity = useTransform(scrollYProgress, [0.22, 0.30, 0.45, 0.52], [0, 1, 1, 0]);
  const overlay2Y = useTransform(scrollYProgress, [0.22, 0.30, 0.45, 0.52], [30, 0, 0, -30]);

  const overlay3Opacity = useTransform(scrollYProgress, [0.52, 0.60, 0.75, 0.82], [0, 1, 1, 0]);
  const overlay3Y = useTransform(scrollYProgress, [0.52, 0.60, 0.75, 0.82], [30, 0, 0, -30]);

  const overlay4Opacity = useTransform(scrollYProgress, [0.82, 0.90, 1.0], [0, 1, 1]);
  const overlay4Y = useTransform(scrollYProgress, [0.82, 0.90, 1.0], [30, 0, 0]);

  // Frame calculation based on scroll progress
  useEffect(() => {
    if (!isReady || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      const progress = scrollYProgress.get();
      // Map progress [0, 1] to frame number [1, TOTAL_FRAMES]
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      // Find closest loaded image if exact index is loading
      let img = images[frameIndex];
      if (!img) {
        // Search outwards for nearest cached image
        for (let offset = 1; offset < 100; offset++) {
          if (images[frameIndex - offset]) {
            img = images[frameIndex - offset];
            break;
          }
          if (images[frameIndex + offset]) {
            img = images[frameIndex + offset];
            break;
          }
        }
      }

      if (img) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect ratio cover logic
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          // Canvas is wider than image
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          // Canvas is taller than image
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        // Draw image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    // Responsive high-DPI scaling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isReady, images, scrollYProgress]);

  return (
    <div 
      ref={containerRef} 
      id="home" 
      className="relative w-full h-[400vh] bg-[#02050e]"
    >
      {/* Loading overlay for progressive image sequence buffering */}
      <AnimatePresence>
        {!isReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#02050c] z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25" />
            
            <div className="relative text-center flex flex-col items-center max-w-sm">
              {/* Spinning Hextech core loader icon */}
              <div className="relative w-24 h-24 mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-cyan-400/60"
                />
                <div className="absolute inset-4 rounded-full bg-cyan-950/50 backdrop-blur border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <span className="font-mono text-[9px] tracking-[0.35em] text-cyan-400/80 uppercase block mb-2">
                HEXTECH STREAM PRELOADER
              </span>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-4">
                BUFFERING CLOUD SCROLLWAYS
              </h3>

              {/* Loader percentage bar */}
              <div className="w-full bg-[#111827] h-1.5 rounded-full border border-white/5 overflow-hidden mb-3">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-primary shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(12, loadProgress))}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <span className="font-mono text-[10px] text-cyan-300">
                {loadProgress}% DIAGNOSTIC_OK
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Content Window */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-20">
        
        {/* Canvas renderer for the sequence */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Dark Overlay to ensure highly legible text overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-[#030712] pointer-events-none z-1" />

        {/* Dynamic Telemetry HUD Layout details */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12 font-mono text-[9px] text-[#8299C4]/60">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>DIAGNOSTIC CORE: FREQUENCY_STABLE</span>
            </div>
            <div>FPS: 60Hz // HDR_ONLINE</div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>SCROLL-STREAM ACTIVE</div>
            <div>SECTOR_ZN // PL-P.09</div>
          </div>
        </div>

        {/* Synchronized Cinematic Text Layers */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl px-6 text-center flex flex-col items-center">

            {/* Stage 1 copy */}
            <AnimatePresence>
              {!hasScrolled && (
                <motion.div 
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute flex flex-col items-center"
                >
                  <div className="h-[1px] w-12 bg-primary mb-4" />
                  <span className="font-mono text-xs text-primary tracking-[0.4em] uppercase mb-3">ACT I: TWO WORLDS</span>
                  <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight text-white drop-shadow-2xl">
                    EVERYONE IS <br/>A <span className="text-primary text-glow font-black">MONSTER</span>
                  </h1>
                  <p className="font-mono text-[10px] sm:text-xs text-[#8299C4] uppercase max-w-sm tracking-[0.2em] mt-6 leading-relaxed">
                    SCROLL DOWN TO REVEAL THE ENTIRE COGNITIVE HEXTECH TRANSMISSION
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-1 animate-bounce opacity-80">
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 2 copy */}
            <motion.div 
              style={{ opacity: overlay2Opacity, y: overlay2Y }}
              className="absolute flex flex-col items-center"
            >
              <span className="font-mono text-xs text-[#06b6d4] tracking-[0.4em] uppercase mb-3">CONTRADISTINCTION</span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-7xl font-semibold uppercase tracking-tight text-white drop-shadow-2xl">
                GOLDEN <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">PILTOVER</span> <br/>
                VS COAL <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">ZAUN</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#8299C4] max-w-md mt-6 leading-relaxed">
                The high towers of academic achievement sit precariously above the chemical sump-fumes of undercity commercial resistance.
              </p>
            </motion.div>

            {/* Stage 3 copy */}
            <motion.div 
              style={{ opacity: overlay3Opacity, y: overlay3Y }}
              className="absolute flex flex-col items-center"
            >
              <span className="font-mono text-xs text-[#06b6d4] tracking-[0.4em] uppercase mb-3">ARCANE MUTATION</span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-7xl font-semibold uppercase tracking-tight text-white drop-shadow-2xl">
                THE UNLEASHING <br/>OF <span className="text-glow font-black text-[#00EEFC] drop-shadow-[0_0_20px_rgba(0,238,252,0.5)]">SHIMMER</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#8299C4] max-w-md mt-6 leading-relaxed">
                Harnessing raw hextech crystals transforms organic matter, creating volatile loops of unstable chemical energy.
              </p>
            </motion.div>

            {/* Stage 4 copy */}
            <motion.div 
              style={{ opacity: overlay4Opacity, y: overlay4Y }}
              className="absolute flex flex-col items-center"
            >
              <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-pink-500 mb-6 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <span className="font-mono text-xs text-[#a21caf] tracking-[0.4em] uppercase mb-3">ACT IV: CROSSING</span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                UNBIND <br/>YOUR <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-pink-500 font-extrabold drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">DESTINY</span>
              </h2>
              <p className="font-mono text-[9px] sm:text-xs text-cyan-400/80 tracking-[0.2em] mt-6 max-w-md uppercase leading-relaxed">
                DESCENT VERIFIED. CONTINUING STREAM TRANSMISSION INTO CHAMPIONS INDEX FOR EXPLORATION BELOW.
              </p>
              <div className="mt-8">
                <ChevronDown className="w-5 h-5 text-pink-500 animate-bounce" />
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
