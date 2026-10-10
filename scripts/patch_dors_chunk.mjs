import fs from 'fs';
import vm from 'vm';

const original = fs.readFileSync('frontend-patch/2euu9hqyjbvnk.js', 'utf8');

// 1. Container style
const oldContainer = 'style:{background:"rgba(59, 130, 246, 0.12)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:10,padding:"0.85rem 1rem",marginBottom:"1rem"}';
const newContainer = 'style:{background:"rgba(59, 130, 246, 0.12)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:10,padding:"0.85rem 1rem",marginBottom:"1rem",maxWidth:"100%",boxSizing:"border-box",overflow:"hidden"}';

if (!original.includes(oldContainer)) {
  console.error('Old container not found!');
  process.exit(1);
}

// 2. Row style
const startMarker = '(0,t.jsxs)("div",{style:{display:"grid",gap:"0.15rem"}';
const endMarker = ']},e)';

const startIdx = original.indexOf(startMarker);
const endIdx = original.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const oldRowBlock = original.slice(startIdx, endIdx + endMarker.length);
console.log('Found old row block, length:', oldRowBlock.length);

const newRowBlock = `(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem",padding:"0.5rem 0.65rem",background:"rgba(0,0,0,0.18)",borderRadius:"8px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",fontSize:"0.8rem",width:"100%",minWidth:0,flexWrap:"wrap"},children:[(0,t.jsx)("span",{style:{fontWeight:700,color:"var(--text-color, #f1f5f9)",wordBreak:"break-word"},children:a}),(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.74rem",flexShrink:0},children:[(0,t.jsx)("span",{style:{color:i===r?"#22c55e":"#60a5fa",fontWeight:600,background:"rgba(59, 130, 246, 0.15)",padding:"0.1rem 0.4rem",borderRadius:"4px"},children:i===r?"Selesai":\`\${o}% (\${i}/\${r} periode)\`}),(0,t.jsx)("span",{style:{color:s>0?"#22c55e":"var(--text-color-secondary, #94a3b8)",fontWeight:500},children:s>0?\`\${s} baru\`:\`\${f} ditarik\`})]})]}),(0,t.jsx)("div",{style:{width:"100%",background:"rgba(59, 130, 246, 0.2)",borderRadius:999,height:8,overflow:"hidden"},children:(0,t.jsx)("div",{style:{width:\`\${o}%\`,background:l?"#f59e0b":i===r?"#16a34a":"#2563eb",height:"100%",transition:"width .3s"}})}),c&&(0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"error"===c.status?"#ef4444":"var(--text-color-secondary, #94a3b8)",marginTop:"0.1rem",wordBreak:"break-word"},children:["error"===c.status?\`Periode \${c.chunk_from}..\${c.chunk_to} (\${c.last_success_page||0}/\${c.pages||"?"} hal tersimpan, otomatis dicoba ulang): \${c.error}\`:\`Sedang di periode \${c.chunk_from} s/d \${c.chunk_to}, halaman \${c.last_success_page??0}/\${c.pages||"?"}\`]})]},e)`;

let patched = original.replace(oldContainer, newContainer).replace(oldRowBlock, newRowBlock);

fs.writeFileSync('frontend-patch/2euu9hqyjbvnk.patched.js', patched, 'utf8');
console.log('Saved frontend-patch/2euu9hqyjbvnk.patched.js');

// Validate syntax
try {
  new vm.Script(patched);
  console.log('SYNTAX CHECK VALID OK!');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
