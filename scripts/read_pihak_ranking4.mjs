import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts", "utf8");
const idx = s.indexOf("// 2. DASHBOARD VIEW");
if (idx !== -1) {
    console.log(s.slice(idx, idx + 1500));
} else {
    const idx2 = s.indexOf("isMaster");
    console.log(s.slice(idx2 + 1000, idx2 + 2500));
}
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
