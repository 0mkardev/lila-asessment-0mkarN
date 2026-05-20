import { create } from 'zustand';
import type { MapName } from '../utils/coordinates';

export type GameEvent = 'Position' | 'BotPosition' | 'Kill' | 'Killed' | 'BotKill' | 'BotKilled' | 'Loot' | 'KilledByStorm';

export interface ParsedEvent {
  user_id: string;
  match_id: string;
  map_id: MapName;
  x: number;
  z: number;
  ts: number;
  event: GameEvent;
  isBot: boolean;
}

export type HeatmapMode = 'none' | 'traffic' | 'killzone';

interface AppState {
  selectedMap: MapName;
  selectedDate: string | null;
  selectedMatch: string | null;
  
  availableMatches: string[];
  allEvents: ParsedEvent[];
  
  // Filters
  showHumans: boolean;
  showBots: boolean;
  showKills: boolean;
  showLoot: boolean;
  showStormDeaths: boolean;
  
  heatmapMode: HeatmapMode;
  
  // Playback
  currentTimestamp: number;
  maxTimestamp: number;
  minTimestamp: number;
  playbackSpeed: number;
  isPlaying: boolean;

  // Actions
  setSelectedMap: (map: MapName) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedMatch: (match: string | null) => void;
  setAvailableMatches: (matches: string[]) => void;
  setAllEvents: (events: ParsedEvent[]) => void;
  
  toggleFilter: (filter: keyof AppState) => void;
  setHeatmapMode: (mode: HeatmapMode) => void;
  
  setCurrentTimestamp: (ts: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedMap: 'AmbroseValley',
  selectedDate: 'February_10',
  selectedMatch: null,
  
  availableMatches: [],
  allEvents: [],
  
  showHumans: true,
  showBots: false,
  showKills: true,
  showLoot: true,
  showStormDeaths: true,
  
  heatmapMode: 'none',
  
  currentTimestamp: 0,
  maxTimestamp: 0,
  minTimestamp: 0,
  playbackSpeed: 1,
  isPlaying: false,

  setSelectedMap: (map) => set({ selectedMap: map }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  setAvailableMatches: (matches) => set({ availableMatches: matches }),
  setAllEvents: (events) => {
    let min = Infinity;
    let max = -Infinity;
    events.forEach(e => {
      if (e.ts < min) min = e.ts;
      if (e.ts > max) max = e.ts;
    });
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 0;
    
    set({ allEvents: events, minTimestamp: min, maxTimestamp: max, currentTimestamp: max });
  },
  
  toggleFilter: (filter) => set((state) => ({ [filter]: !state[filter as keyof AppState] })),
  setHeatmapMode: (mode) => set({ heatmapMode: mode }),
  
  setCurrentTimestamp: (ts) => set({ currentTimestamp: ts }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
