import { runFE } from './fe_exec.mjs';

const res = runFE('curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "URL Foto Profil"');
console.log("URL Foto Profil occurrences on HTTPS:", res.trim().split("\n").filter(Boolean).length);
