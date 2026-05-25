export type Faction = 'Piltover' | 'Zaun';

export interface Champion {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  role: string;
  tags: string[];
  description: string;
  weapons: string[];
  quote: string;
  faction: Faction;
  alliance: string;
  stats: {
    combat: number;
    hextech: number;
    agility: number;
    resilience: number;
  };
}

export interface CityLore {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  faction: Faction;
  shortDescription: string;
  fullNarrative: string;
  keyLocations: string[];
  keyFigures: string[];
  iconName: string;
}

export interface FrequencyPreset {
  frequency: number;
  label: string;
  status: 'UNSTABLE' | '"HARMONIC"' | 'OVERLOADED';
  stability: number;
  description: string;
  color: string;
}
