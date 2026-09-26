import fs from 'fs';

// 1. Patch 0-gigr76s0g8t.js
let layoutCode = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');

const bcTarget = '(0,a.jsxs)("button",{type:"button",className:"cms-bc-back",onClick:()=>t.back(),title:"Kembali",children:[(0,a.jsx)("i",{className:"pi pi-arrow-left"})," Kembali"]}),(0,a.jsx)("span",{className:"cms-bc-sep",children:"|"}),';
if (!layoutCode.includes(bcTarget)) throw new Error("bcTarget not found in layout chunk");
layoutCode = layoutCode.replace(bcTarget, '');
console.log("Patched 1: Removed breadcrumb back button and separator");

const ecTarget = 'let eo=e?.name||e?.email||"Pengguna",ec=String(eo).charAt(0).toUpperCase()';
const ecReplacement = 'let eo=e?.name||e?.email||"Pengguna",ec=(e?.photo_url||e?.foto)?(0,a.jsx)("img",{src:e.photo_url||e.foto,alt:eo,style:{width:"100%",height:"100%",borderRadius:"999px",objectFit:"cover"}}):String(eo).charAt(0).toUpperCase()';
if (!layoutCode.includes(ecTarget)) throw new Error("ecTarget not found in layout chunk");
layoutCode = layoutCode.replace(ecTarget, ecReplacement);
console.log("Patched 2: Avatar now renders photo_url if present");

const userTarget = '(0,a.jsxs)("div",{className:"cms-user",children:[(0,a.jsxs)("div",{className:"cms-user-meta",children:[(0,a.jsx)("div",{className:"cms-user-name",children:eo}),(0,a.jsx)("div",{className:"cms-user-role",children:n})]}),(0,a.jsx)("div",{className:"cms-user-avatar",children:ec}),(0,a.jsx)("button",{type:"button",className:"cms-logout"';
const userReplacement = '(0,a.jsxs)("div",{className:"cms-user",children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",cursor:"pointer"},onClick:()=>o.push("/cms/profile"),title:"Klik untuk membuka Profil Saya",children:[(0,a.jsxs)("div",{className:"cms-user-meta",children:[(0,a.jsx)("div",{className:"cms-user-name",children:eo}),(0,a.jsx)("div",{className:"cms-user-role",children:(e?.satker_nama||e?.satuan||"Nasional")})]}),(0,a.jsx)("div",{className:"cms-user-avatar",children:ec})]}),(0,a.jsx)("button",{type:"button",className:"cms-logout"';
if (!layoutCode.includes(userTarget)) throw new Error("userTarget not found in layout chunk");
layoutCode = layoutCode.replace(userTarget, userReplacement);
console.log("Patched 3: Top-right user block clickable to /cms/profile and role replaced with Satker/Nasional");

fs.writeFileSync('0-gigr76s0g8t.patched.js', layoutCode, 'utf8');
console.log("Created 0-gigr76s0g8t.patched.js");

// 2. Patch 0w77m6y2tq5qr.js (Greeting)
let greetingCode = fs.readFileSync('0w77m6y2tq5qr.js', 'utf8');

const greetTarget = '"Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," — role ",(0,t.jsx)("strong",{children:ed.label}),"."';
const greetReplacement = '"Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),"."';
if (!greetingCode.includes(greetTarget)) throw new Error("greetTarget not found in greeting chunk");
greetingCode = greetingCode.replace(greetTarget, greetReplacement);
console.log("Patched 4: Ringkasan greeting role replaced with EKO - Nasional");

fs.writeFileSync('0w77m6y2tq5qr.patched.js', greetingCode, 'utf8');
console.log("Created 0w77m6y2tq5qr.patched.js");
