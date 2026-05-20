import { parquetRead } from 'hyparquet';
import type { ParsedEvent, GameEvent } from '../store/useStore';
import type { MapName } from './coordinates';

export async function fetchMatchFiles(date: string, files: string[]): Promise<ParsedEvent[]> {
  const allEvents: ParsedEvent[] = [];
  
  for (const filename of files) {
    try {
      const response = await fetch(`/player_data/${date}/${filename}`);
      if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
      
      const arrayBuffer = await response.arrayBuffer();
      
      await new Promise<void>((resolve, reject) => {
        parquetRead({
          file: arrayBuffer,
          onComplete: (data) => {
            for (let i = 0; i < data.length; i++) {
              const row = data[i];
              if (!row) continue;

              const user_id = String(row[0]);
              const match_id = String(row[1]);
              const map_id = row[2] as MapName;
              const x = Number(row[3]);
              const z = Number(row[5]);
              const ts = row[6] instanceof Date ? row[6].getTime() : Number(row[6]);
              
              let eventStr = String(row[7]);
              if (eventStr.startsWith('b\'')) {
                eventStr = eventStr.replace(/^b'|'$/g, '');
              }

              const isBot = eventStr.includes('Bot');

              allEvents.push({
                user_id,
                match_id,
                map_id,
                x,
                z,
                ts,
                event: eventStr as GameEvent,
                isBot
              });
            }
            resolve();
          }
        }).catch(reject);
      });
    } catch (e) {
      console.error('Error parsing file:', filename, e);
    }
  }

  // Sort by timestamp
  allEvents.sort((a, b) => a.ts - b.ts);
  return allEvents;
}

export type MatchMetadata = {
  filename: string;
  humans: number;
  bots: number;
  stormDeaths: number;
};

export async function fetchIndex(): Promise<Record<string, MatchMetadata[] | string[]>> {
  const res = await fetch('/player_data/index.json');
  if (!res.ok) return {};
  return await res.json();
}
