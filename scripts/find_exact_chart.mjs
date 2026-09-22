import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
let s = fs.readFileSync(p, "utf8");
const startChart = s.indexOf("if(\\"ct_cc\\"===F)");
console.log("startChart:", startChart);
const endChart = s.indexOf("let e=[...$];", startChart);
console.log("endChart:", endChart);
if (startChart !== -1 && endChart !== -1) {
    console.log("CHART SUBSTRING:");
    console.log(JSON.stringify(s.slice(startChart, endChart)));
}
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
