const fs = require("fs");
const path = require("path");

const root = process.argv[2] || "/usr/src/app/.next/static/chunks";
const needle = process.argv[3] || "DPO";
const rootStat = fs.statSync(root);
const names = rootStat.isFile() ? [path.basename(root)] : fs.readdirSync(root);
const base = rootStat.isFile() ? path.dirname(root) : root;
for (const name of names) {
  if (!name.endsWith(".js")) continue;
  const file = path.join(base, name);
  const source = fs.readFileSync(file, "utf8");
  let cursor = 0;
  let printed = false;
  while ((cursor = source.indexOf(needle, cursor)) !== -1) {
    if (!printed) {
      console.log("\nFILE " + name);
      printed = true;
    }
    console.log(source.slice(Math.max(0, cursor - 240), cursor + 420));
    cursor += needle.length;
  }
}
