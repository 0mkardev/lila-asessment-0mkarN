export type MapName = 'AmbroseValley' | 'GrandRift' | 'Lockdown';

export interface MapConfig {
  scale: number;
  originX: number;
  originZ: number;
  image: string;
}

export const MAP_CONFIGS: Record<MapName, MapConfig> = {
  AmbroseValley: {
    scale: 900,
    originX: -370,
    originZ: -473,
    image: '/player_data/minimaps/AmbroseValley_Minimap.png',
  },
  GrandRift: {
    scale: 581,
    originX: -290,
    originZ: -290,
    image: '/player_data/minimaps/GrandRift_Minimap.png',
  },
  Lockdown: {
    scale: 1000,
    originX: -500,
    originZ: -500,
    image: '/player_data/minimaps/Lockdown_Minimap.jpg',
  },
};

/**
 * Converts world (x, z) coordinates into UV coordinates for the 1024x1024 minimap plane.
 */
export function worldToMinimapCoords(x: number, z: number, mapName: MapName) {
  const config = MAP_CONFIGS[mapName];
  if (!config) return { u: 0, v: 0, pixelX: 0, pixelY: 0 };
  
  // 1. Convert to UV (0 to 1)
  const u = (x - config.originX) / config.scale;
  const v = (z - config.originZ) / config.scale;
  
  // 2. Convert to 1024x1024 Pixel Space (Top-left origin)
  const pixelX = u * 1024;
  const pixelY = (1 - v) * 1024; 
  
  return { u, v, pixelX, pixelY };
}
