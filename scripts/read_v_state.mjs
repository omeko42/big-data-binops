import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js";
const s = fs.readFileSync(p, "utf8");

const idx = s.indexOf("[V,");
if (idx !== -1) {
    console.log("=== V STATE DECLARATION ===");
    console.log(s.slice(idx, idx + 800));
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
