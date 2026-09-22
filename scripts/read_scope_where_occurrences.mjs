import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts", "utf8");
let idx = s.indexOf("scopeWhereClause");
while (idx !== -1) {
    console.log("=== scopeWhereClause @ " + idx + " ===");
    console.log(s.slice(Math.max(0, idx - 50), idx + 200));
    idx = s.indexOf("scopeWhereClause", idx + 1);
}
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
