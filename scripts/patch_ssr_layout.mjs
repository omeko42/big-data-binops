import fs from 'fs';
import vm from 'vm';
import { runFE, copyFileToFE } from './fe_exec.mjs';

let code = fs.readFileSync('app_cms_layout_tsx_0ml_4_3._.js', 'utf8');

// 1. Remove cms-bc-back and separator
const bcTarget = '(0,b.jsxs)("button",{type:"button",className:"cms-bc-back",onClick:()=>c.back(),title:"Kembali",children:[(0,b.jsx)("i",{className:"pi pi-arrow-left"})," Kembali"]}),(0,b.jsx)("span",{className:"cms-bc-sep",children:"|"}),';
if (!code.includes(bcTarget)) throw new Error("bcTarget not found in SSR layout");
code = code.replace(bcTarget, '');
console.log("Patched 1: Removed cms-bc-back and separator in SSR chunk");

// 2. Avatar renders photo_url or foto if present
const ajTarget = 'let ai=a?.name||a?.email||"Pengguna",aj=String(ai).charAt(0).toUpperCase()';
const ajReplacement = 'let ai=a?.name||a?.email||"Pengguna",aj=(a?.photo_url||a?.foto)?(0,b.jsx)("img",{src:a.photo_url||a.foto,alt:ai,style:{width:"100%",height:"100%",borderRadius:"999px",objectFit:"cover"}}):String(ai).charAt(0).toUpperCase()';
if (!code.includes(ajTarget)) throw new Error("ajTarget not found in SSR layout");
code = code.replace(ajTarget, ajReplacement);
console.log("Patched 2: Avatar now renders photo_url if present in SSR chunk");

// 3. User block click to /cms/profile and role replaced with Satker/Nasional
const userTarget = '(0,b.jsxs)("div",{className:"cms-user",children:[(0,b.jsxs)("div",{className:"cms-user-meta",children:[(0,b.jsx)("div",{className:"cms-user-name",children:ai}),(0,b.jsx)("div",{className:"cms-user-role",children:f})]}),(0,b.jsx)("div",{className:"cms-user-avatar",children:aj}),(0,b.jsx)("button",{type:"button",className:"cms-logout"';
const userReplacement = '(0,b.jsxs)("div",{className:"cms-user",children:[(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",cursor:"pointer"},onClick:()=>h.push("/cms/profile"),title:"Klik untuk membuka Profil Saya",children:[(0,b.jsxs)("div",{className:"cms-user-meta",children:[(0,b.jsx)("div",{className:"cms-user-name",children:ai}),(0,b.jsx)("div",{className:"cms-user-role",children:(a?.satker_nama||a?.satuan||"Nasional")})]}),(0,b.jsx)("div",{className:"cms-user-avatar",children:aj})]}),(0,b.jsx)("button",{type:"button",className:"cms-logout"';
if (!code.includes(userTarget)) throw new Error("userTarget not found in SSR layout");
code = code.replace(userTarget, userReplacement);
console.log("Patched 3: User block click & role in SSR chunk");

new vm.Script(code);
console.log("Syntax valid!");

fs.writeFileSync('app_cms_layout_tsx_0ml_4_3._.patched.js', code, 'utf8');

// Copy to server
copyFileToFE('app_cms_layout_tsx_0ml_4_3._.patched.js', '/tmp/app_cms_layout_tsx_0ml_4_3._.js');
const res = runFE(`
    docker exec bdb-web cp /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js.bak2 2>/dev/null || true
    docker cp /tmp/app_cms_layout_tsx_0ml_4_3._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
    rm -f /tmp/app_cms_layout_tsx_0ml_4_3._.js
    docker exec bdb-web ls -lh /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
`);
console.log(res);
