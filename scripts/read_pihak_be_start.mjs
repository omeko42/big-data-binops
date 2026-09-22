import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts", "utf8");
const lines = s.split(String.fromCharCode(10));
for (let i = 88; i < Math.min(lines.length, 150); i++) {
    console.log("L" + (i + 1) + ": " + lines[i]);
}
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
