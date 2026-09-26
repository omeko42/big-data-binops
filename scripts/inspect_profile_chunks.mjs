import { runFE } from './fe_exec.mjs';

function main() {
    const res = runFE(`
docker exec bdb-web node -e '
  const fs = require("fs");
  const dir = "/usr/src/app/.next/static/chunks";
  const files = fs.readdirSync(dir);
  console.log("3def:", files.filter(f => f.includes("3def")));
  console.log("user:", files.filter(f => f.includes("user") || f.includes("dfbc")));
  console.log("profile:", files.filter(f => f.includes("profile") || f.includes("eedb")));
'
    `);
    console.log(res);
}

main();
