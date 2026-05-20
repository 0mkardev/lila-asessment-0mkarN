import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { worldToMinimapCoords } from '../../utils/coordinates';

// Geometries & Materials
const killGeo = new THREE.CircleGeometry(8, 16);
const killMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });

const deathGeo = new THREE.CircleGeometry(6, 16);
const deathMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

const lootGeo = new THREE.ConeGeometry(8, 16, 4);
const lootMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });

const stormGeo = new THREE.ConeGeometry(8, 16, 3);
const stormMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });

const dummy = new THREE.Object3D();

export const EventMarkers: React.FC = () => {
  const { allEvents, currentTimestamp, showKills, showLoot, showStormDeaths, heatmapMode, selectedMap } = useStore();

  const killMeshRef = useRef<THREE.InstancedMesh>(null);
  const deathMeshRef = useRef<THREE.InstancedMesh>(null);
  const lootMeshRef = useRef<THREE.InstancedMesh>(null);
  const stormMeshRef = useRef<THREE.InstancedMesh>(null);

  const { killCount, deathCount, lootCount, stormCount } = useMemo(() => {
    let kc = 0, dc = 0, lc = 0, sc = 0;
    if (heatmapMode !== 'none') return { killCount: 0, deathCount: 0, lootCount: 0, stormCount: 0 };
    
    for (const e of allEvents) {
      if (e.ts > currentTimestamp) break;
      if (showKills && (e.event === 'Kill' || e.event === 'BotKill')) kc++;
      if (showKills && (e.event === 'Killed' || e.event === 'BotKilled')) dc++;
      if (showLoot && e.event === 'Loot') lc++;
      if (showStormDeaths && e.event === 'KilledByStorm') sc++;
    }
    return { killCount: kc, deathCount: dc, lootCount: lc, stormCount: sc };
  }, [allEvents, currentTimestamp, showKills, showLoot, showStormDeaths, heatmapMode]);

  useEffect(() => {
    if (heatmapMode !== 'none') return;
    let ki = 0, di = 0, li = 0, si = 0;

    for (const e of allEvents) {
      if (e.ts > currentTimestamp) break;
      
      const { pixelX, pixelY } = worldToMinimapCoords(e.x, e.z, selectedMap);
      dummy.position.set(pixelX, pixelY, 5);
      
      if (e.event === 'Loot') {
        dummy.rotation.x = Math.PI / 2;
      } else if (e.event === 'KilledByStorm') {
        dummy.rotation.x = Math.PI / 2;
      } else {
        dummy.rotation.set(0,0,0);
      }
      dummy.updateMatrix();

      if (showKills && (e.event === 'Kill' || e.event === 'BotKill') && killMeshRef.current) {
        killMeshRef.current.setMatrixAt(ki++, dummy.matrix);
      }
      else if (showKills && (e.event === 'Killed' || e.event === 'BotKilled') && deathMeshRef.current) {
        deathMeshRef.current.setMatrixAt(di++, dummy.matrix);
      }
      else if (showLoot && e.event === 'Loot' && lootMeshRef.current) {
        lootMeshRef.current.setMatrixAt(li++, dummy.matrix);
      }
      else if (showStormDeaths && e.event === 'KilledByStorm' && stormMeshRef.current) {
        stormMeshRef.current.setMatrixAt(si++, dummy.matrix);
      }
    }

    if (killMeshRef.current) killMeshRef.current.instanceMatrix.needsUpdate = true;
    if (deathMeshRef.current) deathMeshRef.current.instanceMatrix.needsUpdate = true;
    if (lootMeshRef.current) lootMeshRef.current.instanceMatrix.needsUpdate = true;
    if (stormMeshRef.current) stormMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [allEvents, currentTimestamp, showKills, showLoot, showStormDeaths, heatmapMode, selectedMap, killCount, deathCount, lootCount, stormCount]);

  if (heatmapMode !== 'none') return null;

  return (
    <group>
      {killCount > 0 && <instancedMesh ref={killMeshRef} args={[killGeo, killMat, killCount]} />}
      {deathCount > 0 && <instancedMesh ref={deathMeshRef} args={[deathGeo, deathMat, deathCount]} />}
      {lootCount > 0 && <instancedMesh ref={lootMeshRef} args={[lootGeo, lootMat, lootCount]} />}
      {stormCount > 0 && <instancedMesh ref={stormMeshRef} args={[stormGeo, stormMat, stormCount]} />}
    </group>
  );
};
