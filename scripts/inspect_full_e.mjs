import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
const s = fs.readFileSync(p, "utf8");

const idxE = s.indexOf("function E({");
console.log(s.slice(idxE, idxE + 1600));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
