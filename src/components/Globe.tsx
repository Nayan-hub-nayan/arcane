import React from 'react';
import { motion } from 'motion/react';

// Import the video asset created in the workspace
import arcaneBoll from '../assets/arcane-boll.mp4';

export default function Globe() {
  const headingText = "ARCANE CONFIGURATION PROTOCOLS";

  return (
    <footer 
      id="globe-section" 
      className="sticky bottom-0 w-full h-screen overflow-hidden border-t border-white/10 bg-[#02050E] flex items-center justify-center px-6 z-0"
      /* 
        STACKING CONTEXT & PERFORMANCE:
        - Position: "sticky" with "bottom-0" ensures the footer sits pinned to the viewport.
        - "z-0" places the footer at the base of the stack, behind the main contents (wrapped in "relative z-10").
        - Rendering natively uses the GPU compositor via sticky/transform positioning, completely bypassing JS onScroll lag.
        - High-contrast, high-definition backdrop uses HTML5 video with low opacity and high-performance blending mode.
      */
    >
      {/* HTML5 video element running behind everything (z-0) */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-50 mix-blend-screen pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={arcaneBoll} type="video/mp4" />
          <source src="/src/assets/arcane-boll.mp4" type="video/mp4" />
          <source src="/src/assets/arcane-ball.mp4" type="video/mp4" />
          <source src="assets/arcane-ball.mp4" type="video/mp4" />
          <source src="/assets/arcane-ball.mp4" type="video/mp4" />
        </video>
        {/* Soft vignette to blend video edges smoothly into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050E] via-transparent to-[#02050E]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02050E] via-transparent to-[#02050E]" />
      </div>

      {/* Grid line overlay matching Hextech schematics */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-25 pointer-events-none z-1" />

      {/* Centered Animated Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] text-cyan-400/80 uppercase animate-pulse">
            TRANSMISSION SECURED
          </span>
          <h2 className="font-sans text-lg sm:text-xl md:text-2xl font-bold tracking-[0.25em] text-white uppercase bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            {headingText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.03 + 0.2,
                  ease: "easeOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </h2>
          <div className="w-16 h-[2px] bg-cyan-500/30 rounded shadow-[0_0_8px_rgba(6,182,212,0.5)] mt-2" />
        </motion.div>
      </div>
    </footer>
  );
}
