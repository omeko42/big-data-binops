import { runFE } from './fe_exec.mjs';

const res = runFE('curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "user-photo-file-input"');
console.log("Verified on HTTPS:", res.trim());
