import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  let idx = 0;
  while ((idx = code.indexOf("getUser", idx)) !== -1) {
    console.log(idx, code.substring(idx - 30, idx + 60));
    idx += 7;
  }
'`;

console.log(runFE(cmd));
