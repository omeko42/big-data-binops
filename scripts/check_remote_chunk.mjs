import { runFE } from './fe_exec.mjs';

const res = runFE('docker exec bdb-web grep -o "globalThis.maskEmail" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log("Found on bdb-web:", res.trim());
