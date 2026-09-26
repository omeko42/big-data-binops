import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  console.log(code.substring(1500, 2600));
'`;

console.log(runFE(cmd));
