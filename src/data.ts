import { Champion, CityLore, FrequencyPreset } from './types';

export const CHAMPIONS_DATA: Champion[] = [
  {
    id: 'jinx',
    name: 'JINX',
    title: 'THE LOOSE CANNON',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsXj_rabMTeh-pSExW_ivUTsMC2_4h0mv2xQWgd5Qu73Ka6qA6yZMTcEtlEuW3UNQ62jHleLOscA6AR3rJAR2ixDM818FC85E7dy0Rt6uDvwuzvsySZSn813BnELHwrjAgebO64rFJ5hKc9ozYJguRQhEEAYiNOunjA8tv_QzjguBbt2YucFDD0bo-CQ5GrGazNjdMQJg99Z65EsAVVaFX3HkvEO7SuP96LsUpoFFL8W19KTWE2N7au2JIHXbsgXNtHMQ7vFgOaL8',
    imageAlt: 'A gritty close-up portrait of Jinx from Arcane, with glowing blue tattoos and a chaotic, determined expression.',
    role: 'Zaunite Anarchist',
    tags: ['Marksman', 'Anarchy', 'Inventor'],
    description: 'Formerly Vi\'s sweet, sensitive sister Powder, a series of tragic events twisted her into Jinx—an impulsive, manic agent of chaos who wields customized firearms and volatile explosives in her war against Piltover.',
    weapons: ['Fishbones (Rocket Launcher)', 'Pow-Pow (Minigun)', 'Zapper (Pistol)', 'Flame Chompers'],
    quote: 'I thought maybe you could love me like you used to. Even though I\'m... different.',
    faction: 'Zaun',
    alliance: 'Silco / Undercity Rebels',
    stats: {
      combat: 95,
      hextech: 92,
      agility: 88,
      resilience: 60,
    }
  },
  {
    id: 'vi',
    name: 'VI',
    title: 'PILTOVER ENFORCER',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0SvrQngotXw4nxpyyMsx2C6axG_uAiA-l7yyO9B_fImWwYN_3VetwnuejJwnc1ITqNUGDMRqleDjPNnDFVQFEUZaiC8LClIAtJsanfsV19nAr8OKUJimuAZZeruSoHbAMbcEx8PeQpi2YJebZ8xRk5X3hTK3YVhPA-li4WML0TNAeL8RXXiZNgAZuCYTy39n9dvnQhB35OurxbYHZfCSnxeGPbtwBZmli5028zvA-s0H6Eelr8TNUURGIKBNZ87FYgky44eEgqb4',
    imageAlt: 'A cinematic action shot of Vi from Arcane wearing her massive mechanical Atlas Gauntlets which are glowing with hextech blue energy.',
    role: 'Officer of the Wardens',
    tags: ['Fighter', 'Enforcer', 'Brawler'],
    description: 'Raised on the unforgiving streets of Zaun, Vi is a hotheaded, fierce, and fearless young woman who possesses fine-tuned brawling instincts. Equipping the heavy Atlas Gauntlets, she fights to protect the people she loves, even if it leads her to conflict with her own blood.',
    weapons: ['Atlas Gauntlets (Hextech powered)', 'Steam-powered punches'],
    quote: 'We\'ve all got a monster inside us, Jinx. You just let yours out.',
    faction: 'Piltover',
    alliance: 'Caitlyn / Piltover Wardens',
    stats: {
      combat: 92,
      hextech: 75,
      agility: 80,
      resilience: 85,
    }
  },
  {
    id: 'ekko',
    name: 'EKKO',
    title: 'THE BOY SAVIOR',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHoBnZHRiA_ZO-FiYZ2wYGedlT03IJ2R6N0_akNQNkkBxeOibL0Zri788u51yWQC_16IlKMMsxAgsVTk41fvjLB8rMqFH7qGR4b1XEIWUX7Sl3e-Ri0-xIUVVhO1BmORL3zQm52HfnJMyOawow6G1oHCoC4RRG-aS3VRzIjlZEjvinVEND80k1zuz8_TXO3FngPi3GJptFkKAb7Z9evOeY_Fo2Bmq_7AGqjVYC0v7-2uFrUq__oUVeR-EFVCMyOvZPWjQ7pMMjRQc',
    imageAlt: 'An atmospheric portrait of Ekko from Arcane in his Firelight leader persona, wearing a white mask and green cloak with soft green particle effects.',
    role: 'Leader of the Firelights',
    tags: ['Skirmisher', 'Speedster', 'Inventor'],
    description: 'A prodigy of Zaun\'s rough lanes, Ekko builds gadgets to manipulate time to his advantage. As leader of the Firelights, he fights to build a safe haven for refugees of the drugs and violence of Silco\'s shimmer regime.',
    weapons: ['Z-Drive (Temporal Rewinder)', 'Chronoshift Hoverboard', 'Fluorescent Saber'],
    quote: 'It\'s not about how much time you have, it\'s how you use it.',
    faction: 'Zaun',
    alliance: 'The Firelights / Undercity Youth',
    stats: {
      combat: 85,
      hextech: 96,
      agility: 95,
      resilience: 78,
    }
  },
  {
    id: 'jayce',
    name: 'JAYCE',
    title: 'THE DEFENDER OF TOMORROW',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A handsome, confident man in a formal waistcoat symbolizing Jayce Talis, the pioneer of Hextech.',
    role: 'Head Councilor of Piltover',
    tags: ['Fighter', 'Statesman', 'Pioneer'],
    description: 'A brilliant inventor who combined raw Magic and technology to forge the field of Hextech. Equipped with his transformable Mercury Hammer, Jayce works tirelessly for the security and progress of Piltover, even when political currents threaten to break his ideals.',
    weapons: ['Mercury Hammer (Transformable Cannon)', 'Shock Blast Array', 'Hextech Surge Core'],
    quote: 'We can change the world. We can make everyone\'s life better.',
    faction: 'Piltover',
    alliance: 'House Talis / Piltover Council',
    stats: {
      combat: 88,
      hextech: 94,
      agility: 72,
      resilience: 80,
    }
  },
  {
    id: 'viktor',
    name: 'VIKTOR',
    title: 'PIONEER OF EVOLUTION',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A serious, contemplative young man in dramatic lighting representing Viktor, the Underworld scientist.',
    role: 'Underworld Scientist & Visionary',
    tags: ['Mage', 'Saviour', 'Futurist'],
    description: 'A brilliant investigator from the undercity who worked alongside Jayce to unleash the raw power of Hextech. Driven by a desperate race against his failing health, Viktor seeks salvation in the cold, mechanical efficiency of the glorious evolution.',
    weapons: ['Hex-Core Transmuter', 'Disintegration Beam Staff', 'Gravity Field Node'],
    quote: 'When you are going to change the world, don\'t ask for permission.',
    faction: 'Zaun',
    alliance: 'Self / Independent Research',
    stats: {
      combat: 80,
      hextech: 99,
      agility: 65,
      resilience: 82,
    }
  },
  {
    id: 'caitlyn',
    name: 'CAITLYN',
    title: 'THE SHERIFF OF PILTOVER',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A beautiful woman with striking, focused eyes symbolizing Caitlyn Kiramman, the investigator.',
    role: 'Sheriff of the Wardens',
    tags: ['Marksman', 'Investigator', 'Noble'],
    description: 'The daughter of an influential Piltover clan, Caitlyn is a sharp-witted warden officer who rejects status-quo complacency. Armed with a custom Hextech rifle, her impeccable observational skills and unwavering moral fiber guide her hunt.',
    weapons: ['Hextech sniper rifle', 'Entangling net launcher', 'Peacemaker cartridge'],
    quote: 'I\'m trying to keep us from tearing each other apart.',
    faction: 'Piltover',
    alliance: 'Vi / Piltover Wardens',
    stats: {
      combat: 85,
      hextech: 85,
      agility: 78,
      resilience: 64,
    }
  },
  {
    id: 'silco',
    name: 'SILCO',
    title: 'EYE OF THE UNDERCITY',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A scarred, dramatic silhouette representing Silco, the underworld syndicate boss.',
    role: 'Underworld Syndicate Boss',
    tags: ['Tactician', 'Ruler', 'Catalyst'],
    description: 'The visionary father figure of modern Zaun, Silco is a ruthless, high-stakes industrialist who spearheaded the development of Shimmer. He values undercity absolute sovereignty above all else and raised Jinx in his own image.',
    weapons: ['Toxic Shimmer gas vial', 'Concealed toxic blade', 'Chem-tech mercenaries'],
    quote: 'Is there anything so undoing as a daughter?',
    faction: 'Zaun',
    alliance: 'Jinx / Zaun Industrialists',
    stats: {
      combat: 70,
      hextech: 80,
      agility: 75,
      resilience: 82,
    }
  },
  {
    id: 'mel',
    name: 'MEL MEDARDA',
    title: 'THE GOLDEN COUNCILOR',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'An elegant black woman with regal posture and gold accessories representing Mel Medarda.',
    role: 'Diplomat & Trade Councilor',
    tags: ['Diplomat', 'Councilor', 'Patron'],
    description: 'Exiled from the militaristic Medarda dynasty of Noxus, Mel established herself as Piltover\'s most wealthy and politically persuasive council member. Her patronage catalyzed the Hextech revolution, seeking beauty and peace over raw violence.',
    weapons: ['Noxian trade network', 'Diplomatic immunity', 'Defensive runic armor'],
    quote: 'Piltover is a beacon of hope. Let\'s keep it that way.',
    faction: 'Piltover',
    alliance: 'Jayce / Piltover Council',
    stats: {
      combat: 60,
      hextech: 85,
      agility: 70,
      resilience: 90,
    }
  },
  {
    id: 'heimerdinger',
    name: 'HEIMERDINGER',
    title: 'THE REVERED INVENTOR',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'An scholarly, silver-haired older man with an intellectual expression, representing Professor Heimerdinger.',
    role: 'Founding Dean of Academics',
    tags: ['Inventor', 'Yordle', 'Historian'],
    description: 'A long-lived Yordle scientist who co-founded Piltover decades ago. Though cautious of magic\'s chaotic potential, Heimerdinger\'s brilliant mechanical mind can parse complex mathematics instantly and build defense turrets out of spare scrap.',
    weapons: ['H-28G Evolution Turret', 'Hextech Micro-Rockets', 'CH-3 Electro-Grenade'],
    quote: 'Progress is a slow, methodical march. It can never be rushed.',
    faction: 'Piltover',
    alliance: 'Ekko / Academic Board',
    stats: {
      combat: 75,
      hextech: 98,
      agility: 60,
      resilience: 95,
    }
  }
];

export const CITIES_DATA: CityLore[] = [
  {
    id: 'piltover',
    name: 'PILTOVER',
    title: 'THE CITY OF PROGRESS',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL_B8AY6_qrY7cD34jdBBAkkC6j813E69qZtBdlkyGRIRC2uQo88TqX4PGbk4_8M-OLJ2V_pAF-LlRlfQpTIp5iKCLjq7zcYAEOjwtNY4UnoBJg5CpgmxxMJtgGyQIHQgQqgp1GuZX-RMl1PcqYMm3kdImWFnF_GSQDUJSiZUZJcz3YluYdTCZZNRNO5-32xIWRcqUuelyOwXQ43e3lrAb-Umy6W-oXqOMJCFIJWrwmVJcGGEM-adZHp1ZVIe0i-BVgEbnxH8x5uo',
    imageAlt: 'A majestic aerial view of a futuristic steampunk city like Piltover, featuring towering white and gold spires.',
    faction: 'Piltover',
    shortDescription: 'Home to the bright minds of Hextech, where logic and order reign supreme above the clouds.',
    fullNarrative: 'Piltover is a thriving, progressive city whose power and influence are on the rise. It is Valoran\'s cultural center, where art, craftsmanship, trade, and innovation walk hand in hand. Its power comes not from military might, but from merchant commerce and pioneering thinking. However, the rise of Hextech—the fusion of arcane magic and science—has created a delicate political landscape, putting its academic elite in conflict with the underprivileged undercity.',
    keyLocations: [
      'The Academy of Science & Progress',
      'The Council Chambers',
      'Hextech Gates (Oceanic Transit Hub)',
      'The Sun Gates'
    ],
    keyFigures: [
      'Jayce Talis (The Defender of Tomorrow)',
      'Viktor (The Pioneer of Evolution)',
      'Caitlyn Kiramman (The Sheriff of Piltover)',
      'Heimerdinger (The Revered Inventor)'
    ],
    iconName: 'account_balance'
  },
  {
    id: 'zaun',
    name: 'ZAUN',
    title: 'THE UNDERCITY',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBir1V2iHBBPYa5I94LDryLaTap27ZIEQnmI6ZpvGBxqcmwHVJcGW1mWctT-L2NJQQVSELp1kplJLFbCDXoUct1vk3Co9vMDfFA7mAwvG4vy02VbJJZ4XeiL9nao3GGP8R7OBSxd2eoJqjYTVRrKVXpZuxhKaykYmaVmKfj0_ydH9NQ2jGFkjkRoBxktffg1epR_yeSu0CXCv_86v8lFO-qMw7I6AvvMt_72cVX8Jwxhue5GvDHUWCaDQ8WzfpvH6tjwFTrK8qKJYI',
    imageAlt: 'A gritty subterranean alleyway in Zaun, illuminated by toxic neon green lights and deep purple shadows.',
    faction: 'Zaun',
    shortDescription: 'A subterranean labyrinth of neon, chemical smog, and those willing to do whatever it takes to survive.',
    fullNarrative: 'Zaun, also known as the undercity, is a large, undercity district, nestled in deep canyons and valleys beneath Piltover. What light reaches here is filtered through chemical smog, reflected off rusted pipes, and stained by erratic neon signs. Zaun is a refuge for outlawed science, black market commerce, and raw grit. Shimmer, a powerful yet addictive substance engineered by Silco, transformed the district\'s economy and fueled a growing revolutionary spirit designed to liberate Zaun from Piltover\'s tax and warden chokeholds.',
    keyLocations: [
      'The Last Drop (Silco\'s Base)',
      'The Firelights Sanctuary',
      'The Fissures',
      'Singed\'s Underground Laboratory'
    ],
    keyFigures: [
      'Silco (The Eye of the Undercity)',
      'Vander (The Hound of Zaun)',
      'Singed (The Mad Chemist)',
      'Sevika (The Right Hand)'
    ],
    iconName: 'science'
  }
];

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    frequency: 101.3,
    label: 'SHIMMER RUSH',
    status: 'UNSTABLE',
    stability: 22,
    description: 'Violent purple biomorphic surges detected. High neural dependency rates. Unfit for Hextech engines.',
    color: 'from-purple-600 to-fuchsia-900',
  },
  {
    frequency: 310.4,
    label: 'FIRELIGHT RESONANCE',
    status: 'UNSTABLE',
    stability: 48,
    description: 'Dynamic green kinetic vibrations. Generates safe hoverboard velocity but leaks energy rapidly over time.',
    color: 'from-emerald-500 to-teal-800',
  },
  {
    frequency: 452.0,
    label: 'HARM-C CORE STABILIZATION',
    status: '"HARMONIC"',
    stability: 100,
    description: 'Optimal Blue Hextech equilibrium. Geometric lattice holds tight. Energy flows consistently without decay.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    frequency: 888.1,
    label: 'RUNIC HYPERCHARGE',
    status: 'OVERLOADED',
    stability: 10,
    description: 'Arcane singularity imminent. Core casing heating beyond 4000°C. Severe explosion warning for Piltover.',
    color: 'from-red-500 to-amber-600',
  }
];
