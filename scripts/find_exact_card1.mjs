import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
let s = fs.readFileSync(p, "utf8");
const startIdx = s.indexOf("children:[(0,t.jsx)(\\"span\\",{children:\\"10 Kejahatan Tertinggi\\"})");
console.log("startIdx:", startIdx);
const endIdx = s.indexOf("loading:J,total:l?.ct||0})", startIdx);
console.log("endIdx:", endIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const fullEnd = endIdx + "loading:J,total:l?.ct||0})".length;
    console.log("EXACT SUBSTRING (len " + (fullEnd - startIdx) + "):");
    console.log(JSON.stringify(s.slice(startIdx, fullEnd)));
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
