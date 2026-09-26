import { runFE } from './fe_exec.mjs';

const script = `
docker exec bdb-web node -e '
const fs = require("fs");
const dir = "/usr/src/app/.next/static/chunks/";
const target = "\"Selamat datang, \",(0,t.jsx)(\"strong\",{children:r?.name||r?.email||\"Pengguna\"}),\" — role \",(0,t.jsx)(\"strong\",{children:ed.label}),\".\"";
const replacement = "\"Selamat datang, \",(0,t.jsx)(\"strong\",{children:r?.name||r?.email||\"Pengguna\"}),\" - \",(0,t.jsx)(\"strong\",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:\"Nasional\"}),\".\"";

const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
let patchedCount = 0;

for (const file of files) {
  const fullPath = dir + file;
  try {
    let content = fs.readFileSync(fullPath, "utf8");
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      fs.writeFileSync(fullPath, content, "utf8");
      console.log("Patched greeting in:", file);
      patchedCount++;
    }
  } catch(e) {
    console.error("Error patching " + file, e.message);
  }
}
console.log("Total files patched with EKO - Nasional:", patchedCount);
'
`;

console.log(runFE(script));
