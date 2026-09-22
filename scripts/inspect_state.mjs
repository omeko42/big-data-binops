import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");
console.log(s.slice(37000, 39000));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
