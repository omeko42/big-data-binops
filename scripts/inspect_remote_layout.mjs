import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  const idx = code.indexOf("cms-user-avatar");
  console.log("=== Around cms-user-avatar ===");
  console.log(code.substring(idx - 200, idx + 200));
  
  const idx2 = code.indexOf("livePhoto");
  console.log("=== Around livePhoto ===");
  console.log(code.substring(idx2 - 100, idx2 + 200));
'`;
console.log(runFE(cmd));
