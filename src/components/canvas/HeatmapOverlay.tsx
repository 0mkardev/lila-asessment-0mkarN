import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { worldToMinimapCoords } from '../../utils/coordinates';

// Generate radial gradient texture for heatmap
const createRadialGradient = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const heatmapTex = createRadialGradient();
const heatmapGeo = new THREE.PlaneGeometry(64, 64);

const dummy = new THREE.Object3D();

export const HeatmapOverlay: React.FC = () => {
  const { allEvents, currentTimestamp, heatmapMode, selectedMap } = useStore();

  const meshRef = useRef<THREE.InstancedMesh>(null);

  const points = useMemo(() => {
    if (heatmapMode === 'none') return [];
    
    const validPoints: [number, number][] = [];
    
    for (const e of allEvents) {
      if (e.ts > currentTimestamp) break;
      
      let isRelevant = false;
      if (heatmapMode === 'traffic' && (e.event === 'Position' || e.event === 'BotPosition')) {
        isRelevant = true;
      } else if (heatmapMode === 'killzone' && (e.event === 'Kill' || e.event === 'Killed' || e.event === 'BotKill' || e.event === 'BotKilled')) {
        isRelevant = true;
      }
      
      if (isRelevant) {
        const { pixelX, pixelY } = worldToMinimapCoords(e.x, e.z, selectedMap);
        validPoints.push([pixelX, pixelY]);
      }
    }
    return validPoints;
  }, [allEvents, currentTimestamp, heatmapMode, selectedMap]);

  // Use a custom material based on the mode
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: heatmapTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: heatmapMode === 'traffic' ? 0xffd700 : 0xff3333,
      opacity: heatmapMode === 'traffic' ? 0.15 : 0.6
    });
  }, [heatmapMode]);

  useEffect(() => {
    if (heatmapMode === 'none' || !meshRef.current) return;
    
    for (let i = 0; i < points.length; i++) {
      dummy.position.set(points[i][0], points[i][1], 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, heatmapMode]);

  if (heatmapMode === 'none' || points.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[heatmapGeo, material, points.length]} />
  );
};
