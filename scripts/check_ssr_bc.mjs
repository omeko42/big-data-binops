import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  console.log("Has cms-bc-back?", code.includes("cms-bc-back"));
  console.log("Has cms-bc-sep?", code.includes("cms-bc-sep"));
'`;

console.log(runFE(cmd));
