import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');

// Check 1: Breadcrumb back button
const bcTarget = '(0,a.jsxs)("button",{type:"button",className:"cms-bc-back",onClick:()=>t.back(),title:"Kembali",children:[(0,a.jsx)("i",{className:"pi pi-arrow-left"})," Kembali"]}),(0,a.jsx)("span",{className:"cms-bc-sep",children:"|"}),';
console.log("bcTarget found:", content.includes(bcTarget));

// Check 2: cms-user block
const userTarget = '(0,a.jsxs)("div",{className:"cms-user",children:[(0,a.jsxs)("div",{className:"cms-user-meta",children:[(0,a.jsx)("div",{className:"cms-user-name",children:eo}),(0,a.jsx)("div",{className:"cms-user-role",children:n})]}),(0,a.jsx)("div",{className:"cms-user-avatar",children:ec}),(0,a.jsx)("button",{type:"button",className:"cms-logout"';
console.log("userTarget found:", content.includes(userTarget));

// Check 3: ec avatar definition
const ecTarget = 'let eo=e?.name||e?.email||"Pengguna",ec=String(eo).charAt(0).toUpperCase()';
console.log("ecTarget found:", content.includes(ecTarget));
