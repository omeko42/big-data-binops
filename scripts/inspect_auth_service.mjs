import { runBE } from './be_exec.mjs';

const res = runBE(`
docker exec bdb-api node -e '
const fs = require("fs");
const path = "/usr/src/app/dist/app_core/auth/";
function scan(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of list) {
    const full = dir + "/" + ent.name;
    if (ent.isDirectory()) scan(full);
    else if (ent.isFile() && ent.name.endsWith(".service.js")) {
      const txt = fs.readFileSync(full, "utf8");
      if (txt.includes("login") || txt.includes("validateUser")) {
        console.log("File:", full);
        const lines = txt.split("\\n");
        lines.forEach((l, i) => {
          if (l.includes("login(") || l.includes("verifyOtp(") || l.includes("passkey")) {
            console.log("  Line " + (i+1) + ": " + l.trim().substring(0, 150));
          }
        });
      }
    }
  }
}
scan(path);
'
`);
console.log(res);
