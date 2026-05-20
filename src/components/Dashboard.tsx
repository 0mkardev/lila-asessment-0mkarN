import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sidebar } from './Sidebar';
import { TimelineControls } from './TimelineControls';
import { MinimapScene } from './canvas/MinimapScene';
import { useStore } from '../store/useStore';

export const Dashboard: React.FC = () => {
  const selectedMatch = useStore(state => state.selectedMatch);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white font-sans relative">
      <Sidebar />
      
      <main className="flex-1 relative">
        {!selectedMatch && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="text-4xl">🗺️</div>
              <h2 className="text-2xl font-bold">Select a Match to Begin</h2>
              <p className="text-gray-400 max-w-sm">
                Choose a date and match from the sidebar to visualize player telemetry data on the map.
              </p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 z-0">
          <Canvas orthographic camera={{ position: [512, 512, 100], zoom: 1, near: 0.1, far: 1000 }}>
            <Suspense fallback={null}>
              <MinimapScene />
            </Suspense>
          </Canvas>
        </div>

        {selectedMatch && <TimelineControls />}
      </main>
    </div>
  );
};
