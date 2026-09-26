import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  const idx = code.indexOf("ai=");
  console.log(code.substring(idx - 100, idx + 200));
'`;

console.log(runFE(cmd));
