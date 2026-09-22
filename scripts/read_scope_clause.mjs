import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts", "utf8");
const idx = s.indexOf("scopeClause(");
console.log("=== SCOPE CLAUSE ===");
console.log(s.slice(idx, idx + 2000));
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
