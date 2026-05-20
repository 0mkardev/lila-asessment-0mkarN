import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { MapPlane } from './MapPlane';
import { PlayerPaths } from './PlayerPaths';
import { EventMarkers } from './EventMarkers';
import { HeatmapOverlay } from './HeatmapOverlay';

export const MinimapScene: React.FC = () => {
  return (
    <>
      {/* OrbitControls configured for 2D top-down panning on X-Y plane */}
      <OrbitControls 
        enableRotate={false} 
        enableDamping={true}
        zoomToCursor={true}
        maxZoom={10}
        minZoom={0.5}
        target={[512, 512, 0]}
        mouseButtons={{
          LEFT: 2, // THREE.MOUSE.PAN is 2
          MIDDLE: 1, // THREE.MOUSE.DOLLY is 1
          RIGHT: 2 // Also pan on right click
        }}
        touches={{
          ONE: 1, // THREE.TOUCH.PAN is 1
          TWO: 2 // THREE.TOUCH.DOLLY_PAN is 2
        }}
      />

      <MapPlane />
      <PlayerPaths />
      <EventMarkers />
      <HeatmapOverlay />
    </>
  );
};
