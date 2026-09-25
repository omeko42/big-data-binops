import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
    const fs = require("fs");
    const s = fs.readFileSync("/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js", "utf8");
    const idx2 = s.indexOf("unifiedFilterTab === 2");
    const idx3 = s.indexOf("unifiedFilterTab === 3");
    console.log(s.slice(idx2, idx3));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e);
}
