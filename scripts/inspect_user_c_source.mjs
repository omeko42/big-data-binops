import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  const idx = code.indexOf("user:c");
  console.log("=== Around user:c ===");
  console.log(code.substring(idx - 600, idx + 100));
'`;
console.log(runFE(cmd));
