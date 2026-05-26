import React, { useState, useEffect, useRef } from 'react';
import { Diamond, ShieldAlert, CheckCircle, Zap, ShieldAlert as AlertTriangle, Info, Play, Volume2, VolumeX } from 'lucide-react';
import { FREQUENCY_PRESETS } from '../data';
import { FrequencyPreset } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function HextechCoreConsole() {
  const [frequency, setFrequency] = useState<number>(452.0); // Default to optimum
  const [activePreset, setActivePreset] = useState<FrequencyPreset | null>(FREQUENCY_PRESETS[2]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [tuningActive, setTuningActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synchronize preset when slider modifications are made manually
  useEffect(() => {
    // Find closest preset frequency
    const matched = FREQUENCY_PRESETS.find(
      (p) => Math.abs(p.frequency - frequency) < 2.0
    );
    if (matched) {
      setActivePreset(matched);
    } else {
      setActivePreset(null);
    }
  }, [frequency]);

  // Determine current Core state based on frequency range
  const getCoreState = () => {
    if (activePreset) {
      return {
        status: activePreset.status,
        stability: activePreset.stability,
        description: activePreset.description,
        colorClass: getHueClass(activePreset.status),
        glowStyle: getGlowShadow(activePreset.status),
      };
    }

    // Dynamic state estimation
    if (frequency < 200) {
      return {
        status: 'UNSTABLE (SHIMMER SPIKE)',
        stability: Math.round(15 + (frequency / 200) * 15),
        description: 'Vaporized chemical vapors interacting with runes. Lethal volatility rates.',
        colorClass: 'from-purple-500/80 to-pink-700/80 text-purple-400 border-purple-500',
        glowStyle: 'rgba(189, 0, 255, 0.4)',
      };
    } else if (frequency >= 200 && frequency < 430) {
      return {
        status: 'KINETIC FLUCTUATION',
        stability: Math.round(35 + ((frequency - 200) / 230) * 35),
        description: 'Hoverboard firelight speed levels detected, but grid decay is constant.',
        colorClass: 'from-emerald-500 to-teal-700 text-emerald-400 border-emerald-500',
        glowStyle: 'rgba(16, 185, 129, 0.4)',
      };
    } else if (frequency >= 430 && frequency <= 470) {
      // Very close to sweet spot
      const err = Math.abs(frequency - 452.0) / 20;
      const stab = Math.round(100 - err * 80);
      return {
        status: stab > 95 ? '"HARMONIC"' : 'STABILIZING GRID',
        stability: stab,
        description: 'Ideal blue Hextech matrix. Spatially coherent and locking in geometry.',
        colorClass: 'from-cyan-400 to-blue-600 text-cyan-400 border-cyan-500',
        glowStyle: 'rgba(0, 238, 252, 0.8)',
      };
    } else {
      return {
        status: 'RUNIC OVERLOAD',
        stability: Math.max(5, Math.round(40 - ((frequency - 470) / 530) * 35)),
        description: 'Runic thermal index escalating dangerous levels. Thermal burst likely.',
        colorClass: 'from-red-600 to-amber-700 text-rose-500 border-rose-500',
        glowStyle: 'rgba(239, 68, 68, 0.6)',
      };
    }
  };

  const currentCore = getCoreState();

  function getHueClass(status: string) {
    if (status === '"HARMONIC"') return 'from-cyan-400 to-cyan-700 text-cyan-400 border-cyan-400';
    if (status === 'UNSTABLE') return 'from-purple-500 to-purple-800 text-primary border-primary';
    if (status === 'OVERLOADED') return 'from-rose-500 to-orange-700 text-rose-500 border-rose-500';
    return 'from-emerald-400 to-teal-700 text-emerald-400 border-emerald-500';
  }

  function getGlowShadow(status: string) {
    if (status === '"HARMONIC"') return '0 0 35px rgba(0, 238, 252, 0.8)';
    if (status === 'UNSTABLE') return '0 0 35px rgba(189, 0, 255, 0.6)';
    if (status === 'OVERLOADED') return '0 0 45px rgba(239, 68, 68, 0.9)';
    return '0 0 35px rgba(52, 211, 153, 0.6)';
  }

  // Handle zapping sound synthesis using Web Audio API
  const startSynthesizer = () => {
    if (isAudioMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume if suspended (browser safety)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop previous if exists
      stopSynthesizer();

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Connect
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Core hum configuration
      osc.type = 'sawtooth'; // Hextech mechanical sawtooth tone/distortion
      
      // We divide the visual frequency to make it comfortable to hear (e.g. 100 - 300 Hz)
      const audibleFreq = 60 + (frequency / 3);
      osc.frequency.setValueAtTime(audibleFreq, ctx.currentTime);

      // Lowpass Filter for that warm underwater sci-fi vibe
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(8, ctx.currentTime);
      filter.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime);
      
      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      // Fine gain control
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1); // gentle fade-in

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setTuningActive(true);
    } catch (e) {
      console.warn('Audio Context error: ', e);
    }
  };

  const updateSynthesizerFrequency = (newFreq: number) => {
    if (oscillatorRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const audible = 60 + (newFreq / 3);
      // Smooth slide tone transition
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(audible, ctx.currentTime + 0.05);
    }
  };

  const stopSynthesizer = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15); // fade out
        
        const osc = oscillatorRef.current;
        setTimeout(() => {
          try {
            osc.stop();
          } catch(e){}
        }, 150);
      } catch(ex){}
      
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
    setTuningActive(false);
  };

  // Trigger synthesizer zaps on frequency adjustment
  useEffect(() => {
    if (tuningActive && oscillatorRef.current) {
      updateSynthesizerFrequency(frequency);
    }
  }, [frequency]);

  // Clean-up audio nodes
  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  const handleCoreClick = () => {
    // Quick core stabilization highlight animation
    const core = document.getElementById('hextech-core-element');
    if (core) {
      core.classList.remove('animate-pulse-energy');
      core.style.boxShadow = `0 0 100px ${currentCore.status.includes('HARMONIC') ? 'rgba(0, 238, 252, 1)' : 'rgba(189, 0, 255, 1)'}`;
      core.style.transform = "scale(1.15) rotate(45deg)";
      
      // Synthesize a cool sci-fi discharge click
      if (audioCtxRef.current && !isAudioMuted) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 3, ctx.currentTime + 0.25);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (isAudioMuted) {
        // Unmute automatically to allow auditory feedback!
        setIsAudioMuted(false);
      }

      setTimeout(() => {
        core.style.boxShadow = "";
        core.style.transform = "";
        core.classList.add('animate-pulse-energy');
      }, 500);
    }
  };

  // Mute/unmute state updates
  useEffect(() => {
    if (isAudioMuted) {
      stopSynthesizer();
    } else if (!tuningActive) {
      startSynthesizer();
    }
  }, [isAudioMuted]);

  return (
    <section id="hextech-core-section" className="py-24 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-surface-container-lowest/10 to-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] blur-[120px] rounded-full transition-all duration-700 opacity-20 ${
          currentCore.status.includes('"HARMONIC"') ? 'bg-cyan-500' :
          currentCore.status.includes('UNSTABLE') ? 'bg-purple-600' :
          currentCore.status.includes('OVERLOAD') ? 'bg-rose-600' : 'bg-emerald-500'
        }`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 w-full">
        
        {/* Audio Toggle control */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="absolute -top-4 right-6 p-2 rounded-full border border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-white transition-all bg-surface-container-low"
          title={isAudioMuted ? 'Muted. Click to unmute custom Hextech sonic hum' : 'Hextech acoustic hum enabled. Click to mute'}
          id="toggle-audio-btn"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce-slow" />}
        </button>

        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-primary uppercase tracking-widest pb-1.5 block">Experimental Lab</span>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter text-white uppercase">
            Interactive Rune Core
          </h3>
          <p className="font-mono text-[9px] text-on-surface-variant/70 tracking-[0.2em] uppercase mt-1">
            STABILIZING ARCANE FREQUENCY...
          </p>
        </div>

        {/* Hextech Core Visual */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-12">
          {/* Rotating outer ring */}
          <div 
            className="absolute inset-0 border-[3px] rounded-full animate-[spin_12s_linear_infinite] transition-colors duration-500"
            style={{ 
              borderColor: currentCore.status.includes('HARMONIC') ? 'rgba(0, 238, 252, 0.15)' :
                           currentCore.status.includes('UNSTABLE') ? 'rgba(189, 0, 255, 0.15)' :
                           currentCore.status.includes('OVERLOAD') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)'
            }}
          ></div>
          <div 
            className="absolute inset-3 border-[1.5px] rounded-full animate-[spin_8s_linear_infinite_reverse] transition-colors duration-300"
            style={{ 
              borderColor: currentCore.status.includes('HARMONIC') ? 'rgba(0, 238, 252, 0.3)' :
                           currentCore.status.includes('UNSTABLE') ? 'rgba(189, 0, 255, 0.3)' :
                           currentCore.status.includes('OVERLOAD') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(52, 211, 153, 0.3)',
              borderStyle: 'dashed'
            }}
          ></div>

          {/* Core Shape itself */}
          <div 
            id="hextech-core-element"
            onClick={handleCoreClick}
            className="absolute inset-10 sm:inset-12 bg-surface-container/70 rounded-2xl animate-pulse-energy backdrop-blur-md flex flex-col items-center justify-center border transition-all duration-500 cursor-pointer group select-none overflow-hidden"
            style={{ 
              borderColor: currentCore.status.includes('HARMONIC') ? '#00eefc' :
                           currentCore.status.includes('UNSTABLE') ? '#bd00ff' :
                           currentCore.status.includes('OVERLOAD') ? '#ef4444' : '#10b981',
              boxShadow: currentCore.glowStyle
            }}
          >
            {/* Energy sparkles within core */}
            <div className="absolute inset-0 bg-shimmer-bg opacity-20 pointer-events-none"></div>
            
            <Diamond className={`w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-500 group-hover:scale-125 ${
              currentCore.status.includes('HARMONIC') ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,238,252,0.8)]' :
              currentCore.status.includes('UNSTABLE') ? 'text-primary drop-shadow-[0_0_8px_rgba(236,178,255,0.8)]' :
              currentCore.status.includes('OVERLOAD') ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
            }`} />

            <span className="text-[9px] font-mono mt-1 text-white/50 tracking-wider">TAP LATTICE</span>
          </div>
        </div>

        {/* Console Panel Details & Presets */}
        <div className="w-full max-w-xl p-6 rounded-2xl border border-outline-variant/20 bg-surface-container-low shadow-lg">
          
          {/* Live readouts */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-outline-variant/10">
            <div>
              <p className="text-[10px] font-mono text-on-surface-variant/70 uppercase">Lattice Density</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-base font-bold text-white tracking-wider">
                  {frequency.toFixed(1)} Hz
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant/70 uppercase">Mesh Integrity</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                {currentCore.stability > 85 ? (
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                )}
                <span className={`font-mono text-base font-bold tracking-wider ${
                  currentCore.stability > 80 ? 'text-cyan-400' :
                  currentCore.stability > 40 ? 'text-yellow-400' : 'text-rose-500'
                }`}>
                  {currentCore.stability}%
                </span>
              </div>
            </div>
          </div>

          {/* Target Frequency HUD feedback indicator */}
          <div className={`p-3 rounded-lg mb-6 border text-xs font-mono transition-all duration-300 ${
            currentCore.status.includes('"HARMONIC"') 
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200' 
              : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface'
          }`}>
            <div className="flex justify-between font-bold uppercase mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 inline-block text-primary" /> Core State
              </span>
              <span className={currentCore.status.includes('"HARMONIC"') ? 'text-cyan-400' : 'text-primary'}>
                {currentCore.status}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-85">
              {currentCore.description}
            </p>
          </div>

          {/* Fader Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1 text-[11px] font-mono text-on-surface-variant">
              <span>50.0 Hz</span>
              <span className="text-white px-2 py-0.5 bg-background rounded-full font-bold">
                DIAL: {frequency.toFixed(1)} Hz
              </span>
              <span>1000.0 Hz</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="1000" 
              step="0.5" 
              value={frequency}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFrequency(val);
                if (!isAudioMuted && !tuningActive) {
                  startSynthesizer();
                }
              }}
              onMouseDown={() => startSynthesizer()}
              onMouseUp={() => stopSynthesizer()}
              onTouchStart={() => startSynthesizer()}
              onTouchEnd={() => stopSynthesizer()}
              className="w-full h-1 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
              id="frequency-slider"
            />
          </div>

          {/* Quick preset buttons */}
          <div>
            <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-2.5">Preset Coordinates</p>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_PRESETS.map((p, idx) => {
                const isActive = activePreset?.frequency === p.frequency;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setFrequency(p.frequency);
                      // Trigger audio feedback sweep
                      if (!isAudioMuted) {
                        try {
                          if (!audioCtxRef.current) {
                            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                          }
                          const ctx = audioCtxRef.current;
                          const osc = ctx.createOscillator();
                          const gain = ctx.createGain();
                          osc.connect(gain);
                          gain.connect(ctx.destination);
                          
                          osc.type = 'sine';
                          osc.frequency.setValueAtTime(frequency / 2, ctx.currentTime);
                          osc.frequency.exponentialRampToValueAtTime(p.frequency, ctx.currentTime + 0.3);
                          
                          gain.gain.setValueAtTime(0.06, ctx.currentTime);
                          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.32);
                        } catch(ex){}
                      }
                    }}
                    className={`p-2.5 rounded font-mono text-[10px] text-left transition-all border outline-none active:scale-95 ${
                      isActive 
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_10px_rgba(0,238,252,0.15)] font-bold' 
                        : 'bg-surface-container-lowest hover:bg-surface-variant border-outline-variant/10 text-on-surface-variant hover:text-white'
                    }`}
                    id={`preset-${p.label.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="font-extrabold uppercase truncate">{p.label}</div>
                    <div className="text-[9px] opacity-70 mt-0.5">{p.frequency.toFixed(1)} Hz</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Audio helper instructions */}
        <p className="text-[10px] font-mono text-on-surface-variant/60 flex items-center gap-1.5 mt-4 text-center">
          <Info className="w-3.5 h-3.5" /> Drag slider, tap the presets, or click the metallic core sphere to listen to the energy hum!
        </p>

      </div>
    </section>
  );
}
