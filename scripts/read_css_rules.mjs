import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const css = fs.readFileSync("/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css", "utf8");
let idx = css.indexOf(".dash-grid");
if (idx !== -1) {
    console.log("dash-grid CSS:", css.slice(idx, idx + 200));
}
let cIdx = css.indexOf(".cms-card");
if (cIdx !== -1) {
    console.log("cms-card CSS:", css.slice(cIdx, cIdx + 200));
}
let lIdx = css.indexOf(".cms-card-label");
if (lIdx !== -1) {
    console.log("cms-card-label CSS:", css.slice(lIdx, lIdx + 200));
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
