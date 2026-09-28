import { runFE } from './fe_exec.mjs';

const cmd = `
curl -s http://localhost:3000/_next/static/chunks/0-gigr76s0g8t.js | grep -o "formatCallsign" | wc -l
curl -s http://localhost:3000/_next/static/chunks/3pp0f_cp6yg-o.js | grep -o "Profil Personil CAS" | wc -l
curl -s http://localhost:3000/_next/static/chunks/dashboard-perma-318125d33290_v2.js | grep -o "casWidgets" | wc -l
`;

console.log(runFE(cmd));
