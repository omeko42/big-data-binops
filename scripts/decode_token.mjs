import { runFE } from './fe_inspect.mjs';

const backupCmd = "docker exec bdb-web cp /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js.bak-20260913";
const bumpCmd = `docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js";
let s = fs.readFileSync(p, "utf8");
s = s.replace("bdb-pihak-summary-v5:", "bdb-pihak-summary-v6:");
s = s.replace("bdb-pihak-list-v5:", "bdb-pihak-list-v6:");
fs.writeFileSync(p, s, "utf8");
console.log("Bumped FE cache prefixes to v6!");
'`;

console.log("Backing up FE chunk...");
console.log(runFE(backupCmd));
console.log("Bumping cache prefixes...");
console.log(runFE(bumpCmd));

