import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  const idx = code.indexOf("children:aj");
  console.log("=== Around aj ===");
  console.log(code.substring(idx - 400, idx + 100));
'`;

console.log(runFE(cmd));
