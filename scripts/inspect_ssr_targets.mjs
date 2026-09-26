import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  const idx = code.indexOf("cms-bc-back");
  console.log("=== Around cms-bc-back ===");
  console.log(code.substring(idx - 50, idx + 250));
  
  const idx2 = code.indexOf("let ai=a?.name");
  console.log("=== Around ai ===");
  console.log(code.substring(idx2 - 50, idx2 + 250));
'`;

console.log(runFE(cmd));
