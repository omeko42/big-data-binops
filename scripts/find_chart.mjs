import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");
["polda", "poldaData", "Distribusi", "CT vs CC", "Perbandingan CT"].forEach(k => {
    let idx = 0;
    while ((idx = s.indexOf(k, idx)) !== -1) {
        console.log("=== FOUND " + k + " @ " + idx + " ===");
        console.log(s.slice(Math.max(0, idx - 100), Math.min(s.length, idx + 250)));
        idx += k.length;
    }
});
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
