import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
const s = fs.readFileSync(p, "utf8");

const start = s.indexOf("dash-section dash-grid");
const end = s.indexOf("(0,t.jsx)(O,{icon:(0,t.jsx)(b.AlertTriangle", start);
console.log("EXACT SECTION SNIPPET (len " + (end - start) + "):");
console.log(JSON.stringify(s.slice(start, end)));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
