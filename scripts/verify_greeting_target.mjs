import fs from 'fs';

const content = fs.readFileSync('0w77m6y2tq5qr.js', 'utf8');

const target = '"Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," — role ",(0,t.jsx)("strong",{children:ed.label}),"."';
console.log("Greeting target found:", content.includes(target));
