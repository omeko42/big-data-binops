import { runFE } from './fe_exec.mjs';
import fs from 'fs';

runFE(`docker exec bdb-web cat /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js > /tmp/0-gigr76s0g8t.js`);
const content = runFE(`cat /tmp/0-gigr76s0g8t.js`);
fs.writeFileSync('0-gigr76s0g8t.js', content, 'utf8');
console.log('Saved 0-gigr76s0g8t.js locally, length:', content.length);
