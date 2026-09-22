import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
const s = fs.readFileSync(p, "utf8");

console.log("CACHE KEY:", s.match(/bdb-dashboard-v[0-9]+/)?.[0]);
console.log("ALIGN ITEMS STRETCH FOUND:", s.includes("dash-section dash-grid\\",style:{alignItems:\\"stretch\\"}"));
console.log("CARD 1 FLEX COLUMN FOUND:", s.includes("className:\\"cms-card\\",style:{minWidth:0,display:\\"flex\\",flexDirection:\\"column\\",height:\\"100%\\"}"));
console.log("CARD 1 LABEL UNIFORM:", s.includes("title:l?.scoped?\\"10 Kejahatan Regional · Tertinggi\\":\\"10 Kejahatan Tertinggi\\""));
'
`;

try {
    console.log(runFE(cmd));
    const httpStatus = runFE('curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:3000/cms/dashboard/main');
    console.log('HTTP STATUS:', httpStatus.trim());
} catch (e) {
    console.error(e.message);
}
