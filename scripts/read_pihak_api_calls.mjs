import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js";
const s = fs.readFileSync(p, "utf8");

let idx = s.indexOf("/bdb/pihak-terlibat");
while (idx !== -1) {
    console.log("=== API CALL @ " + idx + " ===");
    console.log(s.slice(Math.max(0, idx - 100), idx + 800));
    idx = s.indexOf("/bdb/pihak-terlibat", idx + 1);
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
