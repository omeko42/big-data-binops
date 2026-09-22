import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js";
const s = fs.readFileSync(p, "utf8");

// Search for cas_pt_jump or params
let idx = s.indexOf("cas_pt_jump");
console.log("=== cas_pt_jump in register-pihak ===");
console.log(s.slice(Math.max(0, idx - 100), idx + 1000));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
