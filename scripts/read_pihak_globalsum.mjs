import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts", "utf8");
const idx = s.indexOf("globalSummary(");
console.log(s.slice(idx + 5500, idx + 8000));
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
