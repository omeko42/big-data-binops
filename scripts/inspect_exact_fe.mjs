import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");

// 1. Inspect Card 1
const startC1 = s.indexOf("10 Kejahatan Tertinggi");
console.log("=== CARD 1 SNIPPET ===");
console.log(s.slice(startC1 - 50, startC1 + 2200));

// 2. Inspect Bar Chart
const startChart = s.indexOf("if(\\"ct_cc\\"===F)");
console.log("=== BAR CHART SNIPPET ===");
console.log(s.slice(startChart - 50, startChart + 400));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
