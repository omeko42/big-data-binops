import { runFE } from './fe_exec.mjs';

const script = `
docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/3rxl-jt3pdxgx.js", "utf8");
  console.log("Length:", code.length);
  console.log("Snippet around 26219:\\n", code.substring(26150, 26400));
'
`;

console.log(runFE(script));
