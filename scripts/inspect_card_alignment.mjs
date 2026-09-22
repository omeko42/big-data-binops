import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
const s = fs.readFileSync(p, "utf8");

const c1Idx = s.indexOf("10 Kejahatan Tertinggi");
console.log("=== CONTAINER & CARD 1, 2, 3 ===");
// print 300 chars before c1Idx and 3500 chars after
console.log(s.slice(Math.max(0, c1Idx - 400), c1Idx + 3500));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
