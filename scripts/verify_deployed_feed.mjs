import { runFE } from './fe_exec.mjs';

console.log('--- Step 1: Check Unduh Berkas in 3pp0f_cp6yg-o.js ---');
const unduh = runFE(`docker exec bdb-web grep -o "Unduh Berkas" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js`);
console.log('Found "Unduh Berkas":', unduh.trim());

console.log('--- Step 2: Check window.location.href to profile in 3pp0f_cp6yg-o.js ---');
const profLink = runFE(`docker exec bdb-web grep -o "/cms/profile?u=" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 3`);
console.log('Found "/cms/profile?u=":', profLink.trim());

console.log('--- Step 3: Check Pratinjau button ---');
const prat = runFE(`docker exec bdb-web grep -o "Pratinjau" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 3`);
console.log('Found "Pratinjau":', prat.trim());

console.log('--- Step 4: Check HTTP /cms/broadcaster ---');
const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/broadcaster`);
console.log('HTTP status /cms/broadcaster:', code.trim());

console.log('--- Step 5: Commit bdb-web container ---');
const commit = runFE(`docker commit bdb-web bdb-web:latest`);
console.log('Docker commit bdb-web:', commit.trim());
