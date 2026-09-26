import { runFE, copyFileToFE } from './fe_exec.mjs';
import fs from 'fs';

// Write the script to be run inside node
const innerScript = `
const fs = require("fs");
const dir = "/usr/src/app/.next/static/chunks/";
const target = '"Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," — role ",(0,t.jsx)("strong",{children:ed.label}),"."';
const replacement = '"Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),"."';

const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
let count = 0;

for (const file of files) {
  const full = dir + file;
  try {
    let content = fs.readFileSync(full, "utf8");
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      fs.writeFileSync(full, content, "utf8");
      console.log("Patched:", file);
      count++;
    }
  } catch(e) {
    console.error("Error in " + file + ":", e.message);
  }
}
console.log("SUCCESS: Patched files count:", count);
`;

fs.writeFileSync('scripts/inner_patch_dash.js', innerScript, 'utf8');

// Copy to remote
copyFileToFE('scripts/inner_patch_dash.js', '/tmp/inner_patch_dash.js');

// Execute inside bdb-web
const res = runFE('docker cp /tmp/inner_patch_dash.js bdb-web:/tmp/inner_patch_dash.js && docker exec bdb-web node /tmp/inner_patch_dash.js');
console.log(res);
