import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/profile-password-v2-eedb4a42b164.js", "utf8");
  const idx = code.indexOf("/Authentication/reset-password");
  console.log(code.substring(idx - 500, idx + 500));
'`);
console.log(res);
