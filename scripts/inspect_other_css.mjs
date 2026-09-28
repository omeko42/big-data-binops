import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web node -e '
const fs = require("fs");
for (const file of ["/usr/src/app/.next/static/chunks/34oh417k1w4ti.css", "/usr/src/app/.next/static/chunks/233p45nuh4m5b.css"]) {
  const content = fs.readFileSync(file, "utf8");
  console.log(file, "length:", content.length, "first 200 chars:", content.slice(0, 200));
}
'`;
console.log(runFE(cmd));
