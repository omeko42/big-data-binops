import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
const s = fs.readFileSync(p, "utf8");

console.log("CACHE KEY:", s.match(/bdb-dashboard-v[0-9]+/)?.[0]);
console.log("CARD 1 REGIONAL TEXT FOUND:", s.includes("10 Kejahatan Tertinggi (Regional)"));
console.log("CARD 1 ROW OVERRIDE FOUND:", s.includes("totalOverride:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)"));
console.log("BAR CHART SCOPED TOP_SATKER_CT FOUND:", s.includes("l?.scoped&&Array.isArray(l?.top_satker_ct)"));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
