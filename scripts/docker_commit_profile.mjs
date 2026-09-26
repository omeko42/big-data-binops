import { runBE } from './be_exec.mjs';
import { runFE } from './fe_exec.mjs';

console.log('1. Committing bdb-api on 10.0.0.x...');
const beRes = runBE('docker commit bdb-api bdb-api:profile-social-pns-20260926');
console.log('BE commit:', beRes.trim());

console.log('2. Committing bdb-web on 10.0.0.x...');
const feRes = runFE('docker commit bdb-web bdb-web:profile-social-pns-20260926');
console.log('FE commit:', feRes.trim());

console.log('All docker containers committed safely.');
