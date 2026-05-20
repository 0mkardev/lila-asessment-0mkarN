import { parquetRead } from 'hyparquet';
import fs from 'fs';

const files = fs.readdirSync('public/player_data/February_12');
const filename = files.find(f => f.endsWith('.nakama-0'));
console.log('Testing file:', filename);

const buffer = fs.readFileSync('public/player_data/February_12/' + filename);

parquetRead({
  file: buffer.buffer, // wait, buffer itself works? hyparquet accepts ArrayBuffer
  onComplete: (data) => {
    console.log("Row 0 length:", data[0].length);
    console.log("Row 0:", data[0]);
  }
}).catch(e => console.error(e));
