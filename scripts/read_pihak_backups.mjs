import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const fs = require("fs");
const files = [
    "/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts.bak-operator-20260912",
    "/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts.bak-dashboard-nat"
];
for (const f of files) {
    if (fs.existsSync(f)) {
        console.log("=== FILE:", f);
        const s = fs.readFileSync(f, "utf8");
        const idx = s.indexOf("scopeClause(");
        if (idx !== -1) console.log(s.slice(idx, idx + 800));
    }
}
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
