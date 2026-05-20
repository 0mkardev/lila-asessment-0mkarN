import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { MAP_CONFIGS } from '../../utils/coordinates';
import { useStore } from '../../store/useStore';

export const MapPlane: React.FC = () => {
  const mapName = useStore(state => state.selectedMap);
  const config = MAP_CONFIGS[mapName];
  
  if (!config) return null;

  const texture = useLoader(THREE.TextureLoader, config.image);
  
  // Use proper color space, but keep default flipY = true for plane geometry
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[512, 512, -1]}>
      <planeGeometry args={[1024, 1024]} />
      <meshBasicMaterial map={texture} depthTest={false} />
    </mesh>
  );
};
