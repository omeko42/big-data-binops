
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
