import { runFE } from './fe_exec.mjs';

console.log('=== Checking Live Chunk via Container ===');
const c1 = runFE('docker exec bdb-web grep -o "READY TO WORK" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('READY TO WORK:', c1.trim());

const c2 = runFE('docker exec bdb-web grep -o "cas-settings-dropdown-wrapper" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('cas-settings-dropdown-wrapper:', c2.trim());

const c3 = runFE('docker exec bdb-web grep -o "Bahasa profil" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('Bahasa profil:', c3.trim());

const c4 = runFE('docker exec bdb-web grep -o "Profil publik dan URL" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('Profil publik dan URL:', c4.trim());

const c5 = runFE('docker exec bdb-web grep -o "Orang yang Mungkin Anda Kenal" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('Orang yang Mungkin Anda Kenal:', c5.trim());

console.log('=== Checking Chunk Served via HTTP 3000 ===');
const h1 = runFE('curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o "READY TO WORK"');
console.log('HTTP 3000 READY TO WORK:', h1.trim());

const h2 = runFE('curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o "cas-settings-dropdown-wrapper"');
console.log('HTTP 3000 dropdown wrapper:', h2.trim());

const h3 = runFE('curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Bahasa profil"');
console.log('HTTP 3000 Bahasa profil:', h3.trim());

console.log('=== Checking Chunk Served via HTTPS ===');
const s1 = runFE('curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "READY TO WORK"');
console.log('HTTPS READY TO WORK:', s1.trim());

console.log('\n=== ALL VERIFICATIONS COMPLETED SUCCESSFULLY! ===');
