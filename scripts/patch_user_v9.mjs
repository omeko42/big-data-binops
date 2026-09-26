import fs from 'fs';

let content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.js', 'utf8');

const replacements = [
  // 1. Primary email font
  {
    target: '(0,a.jsx)("span",{style:{fontWeight:600,color:"#0f172a"},children:mp})',
    replacement: '(0,a.jsx)("span",{style:{fontWeight:600,color:"var(--cas-text-primary, #0f172a)"},children:mp})'
  },
  // 2. Polri badge
  {
    target: 'style:{fontSize:"0.62rem",background:"#eff6ff",color:"#2563eb",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid #bfdbfe"}',
    replacement: 'style:{fontSize:"0.62rem",background:"var(--cas-info-subtle, #eff6ff)",color:"var(--cas-info, #2563eb)",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid var(--cas-border-subtle, #bfdbfe)"}'
  },
  // 3. Secondary email & badge
  {
    target: 'style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"#64748b"}',
    replacement: 'style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"var(--cas-text-muted, #64748b)"}'
  },
  {
    target: 'style:{fontSize:"0.6rem",background:"#f1f5f9",color:"#64748b",padding:"0.05rem 0.25rem",borderRadius:"3px"}',
    replacement: 'style:{fontSize:"0.6rem",background:"var(--cas-bg-hover, #f1f5f9)",color:"var(--cas-text-muted, #64748b)",padding:"0.05rem 0.25rem",borderRadius:"3px"}'
  },
  // 4. Satker Melekat
  {
    target: 'e=>"superadmin"===e.role_bdb?(0,a.jsx)("span",{style:{color:"#94a3b8"},children:"Nasional"}):e.scope_satker_name?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)(P.Building2,{size:13,style:{color:"#2563eb"}}),e.scope_satker_name]}):(0,a.jsx)("span",{style:{color:"#cbd5e1"},children:"—"})',
    replacement: 'e=>"superadmin"===e.role_bdb?(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #94a3b8)",fontWeight:600},children:"Nasional"}):e.scope_satker_name?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"var(--cas-text-secondary, #334155)"},children:[(0,a.jsx)(P.Building2,{size:14,style:{color:"var(--cas-info, #2563eb)"}}),e.scope_satker_name]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #cbd5e1)"},children:"—"})'
  },
  // 5. Login Terakhir
  {
    target: '(0,a.jsx)(i.Column,{header:"Login Terakhir",body:e=>{let s=V(e.last_login_at);return s?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",fontSize:"0.82rem"},children:[(0,a.jsx)(C.Clock,{size:12,style:{color:"#94a3b8"}}),s]}):(0,a.jsx)("span",{style:{color:"#cbd5e1"},children:"Belum pernah"})},sortable:!0,sortField:"last_login_at"})',
    replacement: '(0,a.jsx)(i.Column,{header:"Login Terakhir",body:e=>{let s=V(e.last_login_at);return s?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.82rem",color:"var(--cas-text-secondary, #334155)"},children:[(0,a.jsx)(C.Clock,{size:13,style:{color:"var(--cas-text-muted, #94a3b8)"}}),s]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #cbd5e1)"},children:"Belum pernah"})},sortable:!0,sortField:"last_login_at"})'
  },
  // 6. Action icon sizes
  {
    target: '(0,a.jsx)(S.Eye,{size:16})',
    replacement: '(0,a.jsx)(S.Eye,{size:17})'
  },
  {
    target: '(0,a.jsx)(R.UserCog,{size:15})',
    replacement: '(0,a.jsx)(R.UserCog,{size:17})'
  },
  {
    target: '(0,a.jsx)(D.KeyRound,{size:15})',
    replacement: '(0,a.jsx)(D.KeyRound,{size:17})'
  },
  // 7. Activity Detail Modal header card
  {
    target: 'style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.2rem",background:"#f8fafc",borderRadius:"10px",border:"1px solid #e2e8f0"}',
    replacement: 'style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.2rem",background:"var(--cas-bg-subtle, #f8fafc)",borderRadius:"10px",border:"1px solid var(--cas-border-card, #e2e8f0)"}'
  },
  {
    target: '(0,a.jsx)("div",{style:{fontSize:"1.05rem",fontWeight:700,color:"#0f172a"},children:actUser.name})',
    replacement: '(0,a.jsx)("div",{style:{fontSize:"1.05rem",fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},children:actUser.name})'
  },
  {
    target: 'style:{fontSize:"0.82rem",color:"#64748b",marginTop:"0.2rem"}',
    replacement: 'style:{fontSize:"0.82rem",color:"var(--cas-text-muted, #64748b)",marginTop:"0.2rem"}'
  }
];

let replacedCount = 0;
for (const r of replacements) {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    replacedCount++;
  } else {
    console.warn('Target NOT found:', r.target.slice(0, 60));
  }
}

// Global replacements in modal
const miniCardTarget = 'style:{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"0.65rem 0.6rem"}';
const miniCardRepl = 'style:{background:"var(--cas-bg-surface, #ffffff)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"8px",padding:"0.65rem 0.6rem"}';
const countMiniCards = (content.match(new RegExp(miniCardTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
content = content.replaceAll(miniCardTarget, miniCardRepl);
console.log('Replaced mini-cards:', countMiniCards);

const miniValTarget = 'style:{fontSize:"1.2rem",fontWeight:800,color:"#0f172a",marginTop:"0.25rem"}';
const miniValRepl = 'style:{fontSize:"1.2rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginTop:"0.25rem"}';
const countMiniVals = (content.match(new RegExp(miniValTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
content = content.replaceAll(miniValTarget, miniValRepl);
console.log('Replaced mini-card values:', countMiniVals);

const miniLabelTarget = 'style:{fontSize:"0.74rem",color:"#64748b",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}';
const miniLabelRepl = 'style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}';
const countMiniLabels = (content.match(new RegExp(miniLabelTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
content = content.replaceAll(miniLabelTarget, miniLabelRepl);
console.log('Replaced mini-card labels:', countMiniLabels);

fs.writeFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.patched.js', content, 'utf8');
console.log(`Success! Replaced ${replacedCount} single targets + ${countMiniCards} mini cards + ${countMiniVals} values + ${countMiniLabels} labels.`);
