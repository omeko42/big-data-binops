import { runFE } from './fe_exec.mjs';

const script = `
docker exec bdb-web node -e '
  const fs = require("fs");
  const code = fs.readFileSync("/usr/src/app/.next/static/chunks/00l7wgk9jmf2_.js", "utf8");
  const idx = code.indexOf("59008");
  console.log(code.substring(idx + 1000, idx + 2500));
'
`;

console.log(runFE(script));
