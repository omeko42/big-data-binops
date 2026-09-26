import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  const idx = code.indexOf("(0,a.jsx)(L,{id:");
  // Let us print 2000 characters before this
  console.log(code.substring(Math.max(0, idx - 1800), idx + 100));
'`;

console.log(runFE(cmd));
