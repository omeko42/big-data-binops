import { runFE } from './fe_exec.mjs';
import fs from 'fs';

const content = runFE('docker exec bdb-web cat /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js');
fs.writeFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.js', content, 'utf8');
console.log('Saved user-page-pagination-v9-dfbc949b.js, length:', content.length);
