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

      {/* Always-visible author attribution badge */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          background: 'rgba(15, 15, 25, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '12px',
          padding: '10px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxShadow: '0 4px 24px rgba(139,92,246,0.18), 0 1.5px 6px rgba(0,0,0,0.5)',
          minWidth: '220px',
        }}
      >
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#a78bfa,#6d28d9)',
            flexShrink: 0,
            boxShadow: '0 0 6px #a78bfa',
          }} />
          <span style={{
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.01em',
            background: 'linear-gradient(90deg,#c4b5fd,#e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Omkar Nakate
          </span>
        </div>

        {/* Email row */}
        <a
          href="mailto:omkarndev@gmail.com"
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            textDecoration: 'none',
            paddingLeft: '16px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
          📧 omkarndev@gmail.com
        </a>

        {/* GitHub row */}
        <a
          href="https://github.com/0mkardev/lila-asessment-0mkarN"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            textDecoration: 'none',
            paddingLeft: '16px',
            transition: 'color 0.2s',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
          🔗 github.com/0mkardev/lila-asessment-0mkarN
        </a>
      </div>
    </div>
  );
};
