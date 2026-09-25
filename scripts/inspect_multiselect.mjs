import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
    const fs = require("fs");
    const s = fs.readFileSync("/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js", "utf8");
    
    // Find all MultiSelect in kinerja-perma
    const regex = /MultiSelect/g;
    let count = 0;
    while (regex.exec(s)) count++;
    console.log("Total MultiSelect references:", count);
    
    // Check how MultiSelect is called in Tab 2
    const idxTab2 = s.indexOf("unifiedFilterTab === 2");
    console.log("=== TAB 2 SNIPPET ===");
    console.log(s.slice(idxTab2 + 1000, idxTab2 + 2500));
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e);
}
