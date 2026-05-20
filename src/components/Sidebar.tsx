import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchIndex, fetchMatchFiles } from '../utils/parquetParser';
import { Users, Bot, Skull, Coins, CloudLightning, Activity, Map as MapIcon, Calendar, Gamepad2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const store = useStore();
  const [index, setIndex] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchIndex().then(data => {
      setIndex(data);
      const dates = Object.keys(data);
      if (dates.length > 0 && !store.selectedDate) {
        store.setSelectedDate(dates[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (store.selectedDate && index[store.selectedDate]) {
      const entries = index[store.selectedDate];
      if (entries.length > 0 && !store.selectedMatch) {
        const first = entries[0];
        store.setSelectedMatch(typeof first === 'string' ? first : first.filename);
      }
    }
  }, [store.selectedDate, index]);

  useEffect(() => {
    if (!store.selectedDate || !store.selectedMatch) return;
    
    // We pass an array of files, for now just the single match file
    const files = [store.selectedMatch];
    fetchMatchFiles(store.selectedDate, files).then(events => {
      store.setAllEvents(events);
      if (events.length > 0) {
        store.setSelectedMap(events[0].map_id);
      }
    });
  }, [store.selectedDate, store.selectedMatch]);

  const dates = Object.keys(index).sort();
  const currentMatches = (store.selectedDate ? index[store.selectedDate] : null) || [];

  return (
    <div className="w-80 h-full bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-6 overflow-y-auto z-10 shadow-2xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="text-blue-500" /> Lila Black
        </h1>
        <p className="text-sm text-gray-400">Player Journey Visualization</p>
      </div>

      {/* Selectors */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
            <Calendar size={14}/> Date
          </label>
          <select 
            className="w-full bg-gray-800 text-white rounded-md p-2 text-sm border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            value={store.selectedDate || ''}
            onChange={(e) => {
              store.setSelectedDate(e.target.value);
              store.setSelectedMatch(null);
            }}
          >
            <option value="" disabled>Select Date...</option>
            {dates.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
            <Gamepad2 size={14}/> Match
          </label>
          <select 
            className="w-full bg-gray-800 text-white rounded-md p-2 text-sm border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            value={store.selectedMatch || ''}
            onChange={(e) => store.setSelectedMatch(e.target.value)}
            disabled={!store.selectedDate}
          >
            <option value="" disabled>Select Match...</option>
            {currentMatches.map((m: any) => {
              const filename = typeof m === 'string' ? m : m.filename;
              const metaText = typeof m === 'object' 
                ? ` [H:${m.humans} B:${m.bots} Storm:${m.stormDeaths}]`
                : '';
              return (
                <option key={filename} value={filename}>
                  {filename.substring(0, 8)}...{filename.slice(-8)}{metaText}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="h-px bg-gray-800 w-full" />

      {/* View Options */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
          <MapIcon size={14}/> Visualization
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            className={`p-2 text-xs rounded-md border transition ${store.heatmapMode === 'none' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
            onClick={() => store.setHeatmapMode('none')}
          >
            Paths & Events
          </button>
          <button 
            className={`p-2 text-xs rounded-md border transition ${store.heatmapMode === 'traffic' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
            onClick={() => store.setHeatmapMode('traffic')}
          >
            Traffic Heatmap
          </button>
          <button 
            className={`p-2 text-xs rounded-md border transition ${store.heatmapMode === 'killzone' ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
            onClick={() => store.setHeatmapMode('killzone')}
          >
            Killzone Heatmap
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-800 w-full" />

      {/* Filters */}
      <div className={`space-y-3 ${store.heatmapMode !== 'none' ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="text-xs font-semibold text-gray-500 uppercase">Filters</label>
        
        <div className="space-y-2">
          <ToggleOption 
            label="Human Players" 
            active={store.showHumans} 
            onClick={() => store.toggleFilter('showHumans')}
            icon={<Users size={16} className="text-blue-400"/>}
          />
          <ToggleOption 
            label="Bots" 
            active={store.showBots} 
            onClick={() => store.toggleFilter('showBots')}
            icon={<Bot size={16} className="text-gray-400"/>}
          />
          <ToggleOption 
            label="Kills & Deaths" 
            active={store.showKills} 
            onClick={() => store.toggleFilter('showKills')}
            icon={<Skull size={16} className="text-red-400"/>}
          />
          <ToggleOption 
            label="Loot Events" 
            active={store.showLoot} 
            onClick={() => store.toggleFilter('showLoot')}
            icon={<Coins size={16} className="text-yellow-400"/>}
          />
          <ToggleOption 
            label="Storm Deaths" 
            active={store.showStormDeaths} 
            onClick={() => store.toggleFilter('showStormDeaths')}
            icon={<CloudLightning size={16} className="text-purple-400"/>}
          />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Loaded Events</div>
          <div className="text-xl font-mono text-white">{store.allEvents.length.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

const ToggleOption = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${active ? 'bg-gray-800/80 text-white' : 'bg-transparent text-gray-500 hover:bg-gray-800/50'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-gray-700'}`}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-4.5 right-0.5' : 'left-0.5'}`} />
    </div>
  </button>
);
