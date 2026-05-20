import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause } from 'lucide-react';

export const TimelineControls: React.FC = () => {
  const store = useStore();
  const { 
    currentTimestamp, 
    minTimestamp, 
    maxTimestamp, 
    isPlaying, 
    playbackSpeed, 
    allEvents 
  } = store;

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateTimeline = (time: number) => {
      if (isPlaying) {
        const deltaMs = time - lastTime;
        const newTs = currentTimestamp + deltaMs * playbackSpeed;
        
        if (newTs >= maxTimestamp) {
          store.setCurrentTimestamp(maxTimestamp);
          store.setIsPlaying(false);
        } else {
          store.setCurrentTimestamp(newTs);
        }
      }
      lastTime = time;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(updateTimeline);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateTimeline);
    }
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentTimestamp, maxTimestamp, playbackSpeed]);

  if (allEvents.length === 0) return null;

  const progress = Math.max(0, Math.min(100, ((currentTimestamp - minTimestamp) / (maxTimestamp - minTimestamp || 1)) * 100));
  
  const formatTime = (ts: number) => {
    const totalSeconds = Math.floor(ts / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-gray-900/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl flex items-center gap-4 z-10">
      <button 
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition"
        onClick={() => store.setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
      </button>

      <div className="flex-1 flex flex-col gap-2 relative">
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span>{formatTime(minTimestamp)}</span>
          <span className="text-white font-bold">{formatTime(currentTimestamp)}</span>
          <span>{formatTime(maxTimestamp)}</span>
        </div>
        
        <input 
          type="range" 
          min={minTimestamp} 
          max={maxTimestamp} 
          value={currentTimestamp}
          onChange={(e) => store.setCurrentTimestamp(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div 
          className="absolute bottom-0 left-0 h-2 bg-blue-500 rounded-l-lg pointer-events-none" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
        {[1, 2, 5, 10].map(speed => (
          <button
            key={speed}
            onClick={() => store.setPlaybackSpeed(speed)}
            className={`px-2 py-1 text-xs font-bold rounded transition ${playbackSpeed === speed ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};
