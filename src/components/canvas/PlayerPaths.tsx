import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { worldToMinimapCoords } from '../../utils/coordinates';

export const PlayerPaths: React.FC = () => {
  const { allEvents, currentTimestamp, showHumans, showBots, heatmapMode, selectedMap } = useStore();

  const paths = useMemo(() => {
    if (heatmapMode !== 'none') return [];

    const userPaths: Record<string, { points: [number, number, number][], isBot: boolean }> = {};

    for (const event of allEvents) {
      if (event.ts > currentTimestamp) break;

      if (event.event === 'Position' || event.event === 'BotPosition') {
        if (event.isBot && !showBots) continue;
        if (!event.isBot && !showHumans) continue;

        if (!userPaths[event.user_id]) {
          userPaths[event.user_id] = { points: [], isBot: event.isBot };
        }

        const { pixelX, pixelY } = worldToMinimapCoords(event.x, event.z, selectedMap);
        userPaths[event.user_id].points.push([pixelX, pixelY, 0]);
      }
    }

    return Object.entries(userPaths)
      .filter(([_, path]) => path.points.length > 1)
      .map(([id, path]) => ({
        id,
        points: path.points,
        isBot: path.isBot,
        start: path.points[0],
        end: path.points[path.points.length - 1]
      }));
  }, [allEvents, currentTimestamp, showHumans, showBots, heatmapMode, selectedMap]);

  if (heatmapMode !== 'none') return null;

  return (
    <group>
      {paths.map(path => (
        <group key={path.id}>
          <Line
            points={path.points}
            color={path.isBot ? '#ff0000' : '#3b82f6'}
            lineWidth={path.isBot ? 2 : 3}
            transparent
            opacity={path.isBot ? 0.9 : 0.9}
          />
          {/* Start Marker (Green) */}
          <mesh position={[path.start[0], path.start[1], 2]}>
            <circleGeometry args={[4, 16]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* End Marker (Orange/White based on type) */}
          <mesh position={[path.end[0], path.end[1], 2]}>
            <circleGeometry args={[4, 16]} />
            <meshBasicMaterial color={path.isBot ? '#f97316' : '#ffffff'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
