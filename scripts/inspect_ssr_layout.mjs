import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js", "utf8");
  console.log("Has livePhoto?", code.includes("livePhoto"));
  console.log("Has photo_url in avatar?", code.includes("photo_url"));
  const idx = code.indexOf("cms-user-avatar");
  console.log("=== Around cms-user-avatar ===");
  console.log(code.substring(idx - 100, idx + 100));
'`;

console.log(runFE(cmd));
