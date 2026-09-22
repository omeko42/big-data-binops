import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");
let idx = 0;
while ((idx = s.indexOf("bdb-dashboard-", idx)) !== -1) {
    console.log("CACHE KEY @ " + idx + ": " + s.slice(idx, idx + 30));
    idx += 14;
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
