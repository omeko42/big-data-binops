import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");
let idx = s.indexOf(",U]=");
if (idx === -1) idx = s.indexOf("U]=");
if (idx === -1) idx = s.indexOf("U)");
console.log("FOUND @ " + idx);
console.log(s.slice(Math.max(0, idx - 100), Math.min(s.length, idx + 100)));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
