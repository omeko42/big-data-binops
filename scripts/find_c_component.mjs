import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  const idx = code.indexOf("(0,a.jsx)(L,{id:");
  console.log("=== 10000 chars before L ===");
  console.log(code.substring(Math.max(0, idx - 6000), Math.max(0, idx - 4500)));
'`;

console.log(runFE(cmd));
