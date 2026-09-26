import { runFE } from './fe_exec.mjs';
import fs from 'fs';

const content = runFE('docker exec bdb-web cat /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js');
fs.writeFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/laporan-filter-perma-a15e28ec2e81.js', content, 'utf8');
console.log('Saved laporan-filter-perma-a15e28ec2e81.js, length:', content.length);
