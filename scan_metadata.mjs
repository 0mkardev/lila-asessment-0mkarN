import { parquetRead } from 'hyparquet';
import fs from 'fs';
import path from 'path';

async function scan() {
  const baseDir = 'public/player_data';
  const dates = fs.readdirSync(baseDir).filter(d => fs.statSync(path.join(baseDir, d)).isDirectory() && d !== 'minimaps');
  
  const newIndex = {};

  for (const date of dates) {
    newIndex[date] = [];
    const files = fs.readdirSync(path.join(baseDir, date)).filter(f => f.endsWith('.nakama-0'));
    
    for (const file of files) {
      const filepath = path.join(baseDir, date, file);
      const buffer = fs.readFileSync(filepath);
      
      let humans = new Set();
      let bots = new Set();
      let stormDeaths = 0;
      
      try {
        await new Promise((resolve, reject) => {
          parquetRead({
            file: buffer.buffer,
            onComplete: (data) => {
              for (const row of data) {
                if (!row) continue;
                const userId = String(row[0]);
                const eventStr = String(row[7]);
                
                const isBot = eventStr.includes('Bot');
                if (isBot) {
                  bots.add(userId);
                } else {
                  humans.add(userId);
                }
                
                if (eventStr.includes('KilledByStorm')) {
                  stormDeaths++;
                }
              }
              resolve();
            }
          }).catch(reject);
        });
        
        newIndex[date].push({
          filename: file,
          humans: humans.size,
          bots: bots.size,
          stormDeaths
        });
      } catch(e) {
        console.error(`Skipping corrupt file ${file}:`, e.message);
        // keep it in index but without metadata
        newIndex[date].push(file);
      }
    }
  }
  
  fs.writeFileSync('public/player_data/index.json', JSON.stringify(newIndex, null, 2));
  console.log('Saved to index.json');
}

scan();
