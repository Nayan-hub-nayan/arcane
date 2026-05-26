import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Zap, Crosshair, Sparkles, AlertCircle, Compass, CircleDot, RefreshCw, BarChart2, Shield } from 'lucide-react';

// Import weapon artwork assets from the assets directory
import imgFishbones from '../assets/ar-1.png';
import imgAtlasGauntlets from '../assets/ar-2.png';
import imgHextechPistol from '../assets/ar-3.png';
import imgJinxGatling from '../assets/ar-4.png';
import imgViGatling from '../assets/ar-5.png';




interface WeaponStat {
    label: string;
    value: number; // 0 to 100
    prefix: string;
}

interface Weapon {
    id: string;
    name: string;
    title: string;
    faction: 'Zaun' | 'Piltover';
    creator: string;
    archetype: string;
    serialNumber: string;
    description: string;
    imageUrl: string;
    primaryColor: string; // Tailwind tint/glow classes
    borderColor: string;
    glowColor: string;
    accentText: string;
    bgGradient: string;
    stats: WeaponStat[];
    specs: {
        origin: string;
        energySource: string;
        lethality: string;
        volatility: string;
    };
}

const WEAPONS_DATA: Weapon[] = [
    {
        id: 'fishbones',
        name: 'FISHBONES ROCKET LAUNCHER',
        title: 'THE SHARK-MOUTH OBLITERATOR',
        faction: 'Zaun',
        creator: 'Jinx',
        archetype: 'Heavy Chemtech Rocket Artillery',
        serialNumber: 'FB-99-CHAOS',
        description: 'Jinx’s beloved shark-jawed rocket launcher. Built using scrap and Shimmer residue canisters found in the depths of the Sump, this heavy-impact weapon delivers highly destructive blasts with extreme visual flares.',
        imageUrl: imgFishbones,
        primaryColor: 'from-pink-900/40 to-purple-950/40',
        borderColor: 'border-pink-500/30 group-hover:border-pink-400',
        glowColor: 'shadow-[0_0_20px_rgba(236,72,153,0.15)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]',
        accentText: 'text-pink-400',
        bgGradient: 'bg-pink-950/20',
        stats: [
            { label: 'DESTRUCTIVE IMPACT', value: 96, prefix: '96 KT' },
            { label: 'RANGE AMPLITUDE', value: 78, prefix: '4.5 KM' },
            { label: 'VOLATILITY RATING', value: 92, prefix: 'CRITICAL' },
            { label: 'RATE OF DISCHARGE', value: 85, prefix: '120 RPM' }
        ],
        specs: {
            origin: 'Zaun - Sump Siphon',
            energySource: 'Crude Shimmer Resins & Flame-Core Chargers',
            lethality: 'S-Grade (Mass Disruption)',
            volatility: 'Unstable (92% Resonance Overload)'
        }
    },
    {
        id: 'atlas-gauntlets',
        name: 'ATLAS GAUNTLETS',
        title: 'HEXTECH KINETIC IMPACT',
        faction: 'Piltover',
        creator: 'Jayce & Vi',
        archetype: 'Industrial Demolition Gauntlets',
        serialNumber: 'HG-VI-MK2',
        description: 'Gargantuan brawling tools retrofitted with high-yield reactive Hextech resonators. Delivers physical kinetic compression forces capable of leveling solid titanium gates and breaking undercity crime rings.',
        imageUrl: imgAtlasGauntlets,
        primaryColor: 'from-amber-950/40 to-yellow-900/40',
        borderColor: 'border-amber-500/30 group-hover:border-amber-400',
        glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        accentText: 'text-amber-400',
        bgGradient: 'bg-amber-950/20',
        stats: [
            { label: 'FORCE IMPACT', value: 98, prefix: '1200 kN' },
            { label: 'RANGE AMPLITUDE', value: 24, prefix: 'CLOSE RM' },
            { label: 'VOLATILITY RATING', value: 45, prefix: 'STABLE' },
            { label: 'REACTIVE SHIELDING', value: 82, prefix: '82% RESIST' }
        ],
        specs: {
            origin: 'Piltover - High Academy Lab',
            energySource: 'Refined Hextech Crystal (Dual Cores)',
            lethality: 'A-Grade (Demolition Impact)',
            volatility: 'Regulated (18% Thermal Decay)'
        }
    },
    {
        id: 'mercury-hammer',
        name: 'MERCURY BEAM PISTOL',
        title: 'HEXTECH RESONANCE FIREARM',
        faction: 'Piltover',
        creator: 'Jayce Talis',
        archetype: 'High-Precision Laser Core Pistol',
        serialNumber: 'MT-01-REVOLVER',
        description: 'A revolutionary prototype Hextech firearm that concentrates pure crystal magic into high-voltage energy projectiles. Beautifully detailed with gold engravings and an integrated glowing surge containment cylinder.',
        imageUrl: imgHextechPistol,
        primaryColor: 'from-cyan-950/40 to-blue-900/40',
        borderColor: 'border-cyan-500/30 group-hover:border-cyan-400',
        glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
        accentText: 'text-cyan-400',
        bgGradient: 'bg-cyan-950/20',
        stats: [
            { label: 'ENERGY VELOCITY', value: 92, prefix: 'MACH 3' },
            { label: 'RANGE AMPLITUDE', value: 86, prefix: '6.0 KM' },
            { label: 'VOLATILITY RATING', value: 50, prefix: 'OPTIMAL' },
            { label: 'TRANSITION DEPTH', value: 95, prefix: '0.1 SEC' }
        ],
        specs: {
            origin: 'Piltover - Forge Precinct',
            energySource: 'Pure Raw Hex-Crystal Cluster',
            lethality: 'S-Grade (High-Voltage Shock)',
            volatility: 'Highly Controlled (Active Dampeners)'
        }
    },
    {
        id: 'pow-pow',
        name: 'POW-POW CHAOS MINIGUN',
        title: 'RAPID CHEMT_GATLING ARRAY',
        faction: 'Zaun',
        creator: 'Jinx',
        archetype: 'Multi-Barrel Chemical Gatling Gun',
        serialNumber: 'PW-PW-MK1',
        description: 'A multi-barrel heavy minigun that fires a relentless hail of bullet storms. Powered by volatile purple toxic gas feeds, Jinx uses it to slice through barricades and spread manic undercity mischief.',
        imageUrl: imgJinxGatling,
        primaryColor: 'from-emerald-950/40 to-teal-900/40',
        borderColor: 'border-emerald-500/30 group-hover:border-emerald-400',
        glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
        accentText: 'text-emerald-400',
        bgGradient: 'bg-emerald-950/20',
        stats: [
            { label: 'RATE OF DISCHARGE', value: 99, prefix: '1200 RPM' },
            { label: 'COHESION STABILITY', value: 62, prefix: 'FRAGILE' },
            { label: 'VOLATILITY RATING', value: 88, prefix: 'CHAOTIC' },
            { label: 'QUANTUM RESONANCE', value: 95, prefix: 'HIGH SPRAY' }
        ],
        specs: {
            origin: 'Zaun - Sump Scrap Heap',
            energySource: 'Volatile Chemical Gas Feed',
            lethality: 'S-Grade (Rapid-Fire Piercing)',
            volatility: 'Severe (Hazardous Overheat)'
        }
    },
    {
        id: 'z-drive',
        name: 'Z-DRIVE RESONATOR',
        title: 'TEMPORAL RECONSTITUTION ENGINE',
        faction: 'Zaun',
        creator: 'Ekko',
        archetype: 'Zero-Drive Temporal Rewind Engine',
        serialNumber: 'Z-DRV-MK1',
        description: 'A miraculous time-manipulating device crafted by Ekko using salvaged hextech shards. By accelerating local pocket dimensions, it allows him to fracture and rewind timelines to rewrite tactical mistakes in battle.',
        imageUrl: imgViGatling,
        primaryColor: 'from-cyan-950/40 to-teal-900/40',
        borderColor: 'border-cyan-500/30 group-hover:border-cyan-400',
        glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
        accentText: 'text-cyan-400',
        bgGradient: 'bg-cyan-950/20',
        stats: [
            { label: 'TEMPORAL FLUIDITY', value: 95, prefix: '0.1 SEC' },
            { label: 'CHRONO CAPACITY', value: 85, prefix: '4 SEC REWIND' },
            { label: 'VOLATILITY RATING', value: 75, prefix: 'STABLE' },
            { label: 'QUANTUM RESONANCE', value: 90, prefix: 'RESONANT' }
        ],
        specs: {
            origin: 'Zaun - Firelights Hideout',
            energySource: 'Cracked Hextech Resonance Fragment',
            lethality: 'T-Grade (Tactical Time-Warp)',
            volatility: 'Severe (Probability Cascade Warning)'
        }
    }
];

export function InteractiveWeaponCardBody({ weapon, isSelected }: { weapon: Weapon; isSelected: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for horizontal / vertical normalized offset mapping
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Glare positions and dynamic opacity
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);
    const glareOpacity = useMotionValue(0);
    // Inner image depth parallax shifts
    const imgShiftX = useMotionValue(0);
    const imgShiftY = useMotionValue(0);

    // Springs for silky smooth hover tracking
    const rotateX = useSpring(y, { stiffness: 150, damping: 22 });
    const rotateY = useSpring(x, { stiffness: 150, damping: 22 });
    const glareXSpring = useSpring(glareX, { stiffness: 150, damping: 22 });
    const glareYSpring = useSpring(glareY, { stiffness: 150, damping: 22 });
    const glareOpacitySpring = useSpring(glareOpacity, { stiffness: 150, damping: 22 });

    const imgShiftXSpring = useSpring(imgShiftX, { stiffness: 150, damping: 22 });
    const imgShiftYSpring = useSpring(imgShiftY, { stiffness: 150, damping: 22 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Normal coordinates from -0.5 to 0.5 center origin
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate 3D tilt rotation (up to 15 degrees)
        // Left/right mouse movement tilts around Y axis, up/down tilts around X axis
        x.set(normX * 15);
        y.set(-normY * 15);
        // Position glossy glare hotspot
        glareX.set(((e.clientX - rect.left) / rect.width) * 100);
        glareY.set(((e.clientY - rect.top) / rect.height) * 100);
        glareOpacity.set(0.45);

        // Apply parallax distance to the weapon image container
        imgShiftX.set(normX * 12);
        imgShiftY.set(normY * 12);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        glareOpacity.set(0);
        imgShiftX.set(0);
        imgShiftY.set(0);
    };

    // Maps coordinates to radial glare gradient background
    const glareBackgroundStyle = useTransform(
        [glareXSpring, glareYSpring, glareOpacitySpring],
        ([gX, gY, gOpacity]) => {
            return `radial-gradient(circle at ${gX}% ${gY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 60%)`;
        }
    );

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className="w-full h-full flex items-center justify-center select-none overflow-hidden group relative cursor-pointer"
            id={`interactive-card-${weapon.id}`}
        >
            {/* 3D Parallax Layer for Weapon artwork (Popped forward on Z-axis) */}
            <motion.div
                style={{
                    x: imgShiftXSpring,
                    y: imgShiftYSpring,
                    z: 35,
                    transformStyle: 'preserve-3d',
                }}
                className="relative z-10 w-[90%] h-[90%] flex items-center justify-center"
            >
                <img
                    src={weapon.imageUrl}
                    alt={weapon.name}
                    className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                />
            </motion.div>
        </motion.div>
    );
}

export default function WeaponShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState<number>(0);

    // Link scroll progress to the entire component scroll size (e.g. 350vh height of wrapper)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Track the current scroll progress to update which dossier card is currently topmost and active
    useMotionValueEvent(scrollYProgress, "change", (latestVal) => {
        // 0.0 to 1.0 mapping across 4 weapons
        // Let's set the active indexes symmetrically
        const segment = 1 / WEAPONS_DATA.length;
        let index = Math.floor(latestVal / segment);
        if (index >= WEAPONS_DATA.length) index = WEAPONS_DATA.length - 1;
        if (index < 0) index = 0;
        // Smooth transitions between active cards
        if (index !== activeIdx) {
            setActiveIdx(index);
        }
    });

    const activeWeapon = WEAPONS_DATA[activeIdx];

    // Helper to generate framer motion scroll bindings for cards
    // Dynamic opacity transforms ensure that as a new card slides in, the previous card beautifully fades to hidden, maintaining a clean visual stacking context.
    const getTransformsForCard = (i: number) => {
        const totalSteps = WEAPONS_DATA.length;

        // Calculate own entrance intervals
        const startProgress = i === 0 ? 0 : ((i - 1) / (totalSteps - 1)) + 0.04;
        const endProgress = i === 0 ? 0 : (i / (totalSteps - 1)) - 0.04;

        // Calculate next card's entrance intervals (if any exists)
        const hasNext = i < totalSteps - 1;
        const startProgressNext = hasNext ? (i / (totalSteps - 1)) + 0.04 : 1.0;
        const endProgressNext = hasNext ? ((i + 1) / (totalSteps - 1)) - 0.04 : 1.0;

        let x, rotate, scale, opacity;

        if (i === 0) {
            x = "0%";
            rotate = 0;
            scale = 1;
            // Card 0 fades to 0 when Card 1 fully covers it (at endProgressNext)
            opacity = useTransform(
                scrollYProgress,
                [0, startProgressNext, endProgressNext, 1],
                [1, 1, 0, 0]
            );
        } else {
            // For sliding cards (i > 0)
            // Sliding in from the right with a 45 degree rotation
            x = useTransform(
                scrollYProgress,
                [0, startProgress, endProgress, 1],
                ['110%', '110%', '0%', '0%']
            );

            rotate = useTransform(
                scrollYProgress,
                [0, startProgress, endProgress, 1],
                [45, 45, 0, 0]
            );

            scale = useTransform(
                scrollYProgress,
                [0, startProgress, endProgress, 1],
                [0.92, 0.92, 1, 1]
            );

            if (hasNext) {
                // Safe middle cards: fades in during own entrance, is active at 1.0, and fades out when next card is arriving
                opacity = useTransform(
                    scrollYProgress,
                    [0, startProgress, endProgress, startProgressNext, endProgressNext, 1],
                    [0, 0, 1, 1, 0, 0]
                );
            } else {
                // Final card: fades in and stays active
                opacity = useTransform(
                    scrollYProgress,
                    [0, startProgress, endProgress, 1],
                    [0, 0, 1, 1]
                );
            }
        }

        return { x, rotate, scale, opacity };
    };

    return (
        <section
            ref={containerRef}
            id="weapons-showcase"
            className="relative h-[380vh] bg-[#02050f] text-white"
        >
            {/* Sticky full screen viewport wrapper */}
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 py-8 select-none z-10">

                {/* Abstract Hexagonal Cyber Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#091224_1px,transparent_1px),linear-gradient(to_bottom,#091224_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none z-0" />

                {/* Dynamic Glowing Ambient Aura matching active weapon */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] blur-[150px] rounded-full transition-all duration-1000"
                        style={{
                            background: activeWeapon.id === 'fishbones' ? 'rgba(236,72,153,0.12)' :
                                activeWeapon.id === 'atlas-gauntlets' ? 'rgba(245,158,11,0.12)' :
                                    activeWeapon.id === 'mercury-hammer' ? 'rgba(6,182,212,0.12)' :
                                        'rgba(16,185,129,0.12)'
                        }}
                    />
                </div>

                {/* ==================== LEFT COLUMN: FIXED CONSOLE HEADLINE & ACTIVE DATA ==================== */}
                <div className="relative z-10 w-full md:w-5/12 flex flex-col justify-between h-[38vh] md:h-full py-4 md:py-12 pr-0 md:pr-10 border-b md:border-b-0 md:border-r border-white/5">
                    {/* Section Header Title & Subtitles */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Compass className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
                            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-cyan-400">
                                P&Z REGISTRY // SECURITY CLEARANCE LEVEL-4
                            </span>
                        </div>

                        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none uppercase">
                            ARMAMENT <br />
                            <span className="text-glow bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">SHOWCASE</span>
                        </h2>

                        <p className="font-mono text-[9px] sm:text-[10px] text-gray-500 mt-2 uppercase tracking-wide">
                            Scroll down on mousewheel or trackpad to stack blueprints
                        </p>
                    </div>

                    {/* DYNAMIC TELEMETRY DISPLAY PANEL (Linked to active card index) */}
                    <div className="flex-1 flex flex-col justify-center my-4 md:my-6 max-w-md">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeWeapon.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                {/* Active weapon identification tag */}
                                <div className="flex items-center gap-2.5">
                                    <span className={`font-mono text-[9px] sm:text-[10px] font-bold px-2 py-0.5 border rounded-sm uppercase bg-black/40 ${activeWeapon.faction === 'Zaun' ? 'text-purple-400 border-purple-500/20' : 'text-cyan-400 border-cyan-500/20'
                                        }`}>
                                        {activeWeapon.faction} ORIGIN
                                    </span>
                                    <span className="font-mono text-[9px] sm:text-[10px] text-gray-500">
                                        S/N: {activeWeapon.serialNumber}
                                    </span>
                                </div>

                                {/* Big Dynamic Primary Name with custom highlight */}
                                <div>
                                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white uppercase leading-none">
                                        {activeWeapon.name}
                                    </h3>
                                    <div className={`font-mono text-[9px] sm:text-[11px] font-semibold uppercase mt-0.5 tracking-wider ${activeWeapon.accentText}`}>
                                        {activeWeapon.title}
                                    </div>
                                </div>

                                {/* Technical description */}
                                <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-sm">
                                    {activeWeapon.description}
                                </p>

                                {/* Dynamic Stats Bars */}
                                <div className="space-y-2 pt-1">
                                    <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-gray-400 mb-1 font-bold">
                                        <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>HEXTECH STRENGTH METRICS</span>
                                    </div>
                                    {activeWeapon.stats.map((stat, sIdx) => (
                                        <div key={sIdx} className="space-y-0.5">
                                            <div className="flex justify-between font-mono text-[9px] text-gray-400">
                                                <span>{stat.label}</span>
                                                <span className={`font-bold ${activeWeapon.accentText}`}>{stat.prefix}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                                                {/* Static light ticking grid lines inside the stats bar */}
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.value}%` }}
                                                    transition={{ duration: 0.6, delay: sIdx * 0.05 }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${activeWeapon.id === 'fishbones' ? 'from-pink-500 to-purple-500' :
                                                        activeWeapon.id === 'atlas-gauntlets' ? 'from-amber-600 to-yellow-400' :
                                                            activeWeapon.id === 'mercury-hammer' ? 'from-cyan-500 to-blue-500' :
                                                                'from-emerald-500 to-teal-400'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Core Calibration Hud readout */}
                    <div className="hidden md:flex items-center gap-3 p-3 border border-white/5 bg-slate-950/40 rounded-lg max-w-sm">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-500/10 border border-cyan-500/20">
                            <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                        </div>
                        <div className="font-mono text-[8.5px] uppercase text-gray-400 leading-normal">
                            <span>Framer Motion Spring Decoupling: Active</span>
                            <br />
                            <span className="text-secondary/70">Origin anchor [bottom left] rotation calibrated.</span>
                        </div>
                    </div>

                </div>

                {/* ==================== RIGHT COLUMN: MOTION BLUEPRINT CONTAINER GRID ==================== */}
                <div id="weapon-frame-viewport" className="w-full md:w-7/12 h-[54vh] md:h-full flex items-center justify-center relative select-none mt-4 md:mt-0">
                    {/* Central Compass dial grid backdrop */}
                    <div className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[500px] lg:h-[500px] border border-white/5 rounded-full pointer-events-none flex items-center justify-center z-0">
                        <div className="absolute w-[80%] h-[80%] border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute w-[45%] h-[45%] border border-[#1e293b]/40 rounded-full" />

                        <CircleDot className="w-8 h-8 text-slate-800 absolute opacity-20" />

                        {/* Dynamic radar tracking line sweeps */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 transform rotate-45" />
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 transform rotate-135" />
                    </div>

                    {/* Absolute Stack of Cards */}
                    {/* Framer motion mappings ensure the stack sits centered and layers on scroll */}
                    <div className="relative w-[280px] h-[370px] sm:w-[330px] sm:h-[450px] md:w-[360px] md:h-[480px]">
                        {WEAPONS_DATA.map((weapon, idx) => {
                            // Retrieve specific scroll binding metrics
                            const motionProps = getTransformsForCard(idx);
                            const isSelected = activeIdx === idx;

                            return (
                                <motion.div
                                    key={weapon.id}
                                    style={{
                                        x: motionProps.x,
                                        rotate: motionProps.rotate,
                                        scale: motionProps.scale,
                                        opacity: motionProps.opacity,
                                        // Rigid bottom-left anchor origin for the rotating arc
                                        transformOrigin: 'bottom left',
                                        zIndex: idx + 10,
                                        perspective: '1200px',
                                        transformStyle: 'preserve-3d',
                                    }}
                                    className="absolute inset-0 rounded-2xl select-none"
                                    id={`weapon-card-${weapon.id}`}
                                >
                                    <InteractiveWeaponCardBody weapon={weapon} isSelected={isSelected} />
                                </motion.div>
                            );
                        })}
                    </div>

                </div>

            </div>

            {/* Aesthetic bottom divider separating pages */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10" />
        </section>
    );
}
