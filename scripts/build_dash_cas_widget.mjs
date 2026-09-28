import fs from 'fs';

let content = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.js', 'utf8');

// Prepend helper functions formatCallsign and toTitleCase
const helpers = `
function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
    return '@' + c.toLowerCase();
  }
  var seed = idStr || username || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + code;
}
function toTitleCase(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/(?:^|\\s|-|\\/)[a-z]/g, function(c) {
    return c.toUpperCase();
  });
}
`;

content = helpers + content;

// 1. Add state variable [casWidgets,setCasWidgets]
const stateTarget = '[dpoRows,setDpoRows]=(0,a.useState)([]),';
if (!content.includes(stateTarget)) {
  console.error('Could not find stateTarget');
  process.exit(1);
}
content = content.replace(stateTarget, stateTarget + '[casWidgets,setCasWidgets]=(0,a.useState)(null),');

// 2. Add useEffect to fetch /bdb/jukrah/dashboard-widgets
const effectTarget = '(0,a.useEffect)(()=>{n((0,h.getUser)())},[]),';
if (!content.includes(effectTarget)) {
  console.error('Could not find effectTarget');
  process.exit(1);
}
const effectCode = `(0,a.useEffect)(()=>{try{p.apiAuth.get("/bdb/jukrah/dashboard-widgets").then(r=>{setCasWidgets(r.data?.data||null)}).catch(()=>{})}catch(e){}},[]),`;
content = content.replace(effectTarget, effectTarget + effectCode);

// 3. Update dash-head welcome message: formatCallsign & toTitleCase satker
const dashHeadTarget = 'children:["Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),".",l?.scoped&&(0,t.jsxs)("span",{className:"dash-scope-badge",children:[(0,t.jsx)("i",{className:"pi pi-sitemap",style:{fontSize:"0.7rem",marginRight:"0.3rem"}}),"Satker: ",l.scope_satker||"Belum ditetapkan"]})]';
if (!content.includes(dashHeadTarget)) {
  console.error('Could not find dashHeadTarget');
  process.exit(1);
}
const enhancedDashHead = 'children:["Selamat datang, ",(0,t.jsx)("strong",{children:formatCallsign(r?.callsign,r?.id,r?.username)})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?toTitleCase(l.scope_satker):"Nasional"}),".",l?.scoped&&(0,t.jsxs)("span",{className:"dash-scope-badge",children:[(0,t.jsx)("i",{className:"pi pi-sitemap",style:{fontSize:"0.7rem",marginRight:"0.3rem"}}),"Satker: ",toTitleCase(l.scope_satker)||"Belum ditetapkan"]})]';
content = content.replace(dashHeadTarget, enhancedDashHead);

// 4. Insert 1-line CAS widget row right after dash-head
const jsxTarget = '(0,t.jsx)(g.default,{refreshing:eo,updatedAt:ec,onRefresh:dashForceRefresh})]}),';
if (!content.includes(jsxTarget)) {
  console.error('Could not find jsxTarget');
  process.exit(1);
}

const widgetCode = `(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"0.85rem",marginTop:"1rem"},children:[
  (0,t.jsxs)("div",{onClick:()=>e.push("/cms/broadcaster"),style:{background:"var(--cas-bg-card, #1e293b)",border:"1px solid rgba(59,130,246,0.3)",borderLeft:"4px solid #3b82f6",borderRadius:"10px",padding:"0.85rem 1rem",cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.4rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",transition:"transform 0.15s ease"},children:[
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
      (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800,color:"#60a5fa",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:"📢 SIARAN DINAS TERKINI"}),
      casWidgets?.latest_jukrah?.acknowledged?(0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(34,197,94,0.12)",color:"#22c55e",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700},children:"✓ Siap Laksanakan"}):(0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(239,68,68,0.12)",color:"#ef4444",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700},children:"Belum Dikonfirmasi"})
    ]}),
    (0,t.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:700,color:"var(--cas-text-primary, #f8fafc)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:casWidgets?.latest_jukrah?.title||"Belum ada siaran kedinasan terbaru."}),
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:[
      (0,t.jsx)("span",{children:toTitleCase(casWidgets?.latest_jukrah?.satker)||"Robinops Bareskrim"}),
      (0,t.jsx)("span",{style:{color:"#60a5fa",fontWeight:700},children:"Buka Siaran ➔"})
    ]})
  ]}),
  (0,t.jsxs)("div",{onClick:()=>e.push("/cms/broadcaster"),style:{background:"var(--cas-bg-card, #1e293b)",border:"1px solid rgba(245,158,11,0.3)",borderLeft:"4px solid #f59e0b",borderRadius:"10px",padding:"0.85rem 1rem",cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.4rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",transition:"transform 0.15s ease"},children:[
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
      (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800,color:"#f59e0b",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:"🔥 DISKUSI HANGAT ANAK SERSE"}),
      (0,t.jsxs)("span",{style:{fontSize:"0.68rem",background:"rgba(245,158,11,0.12)",color:"#f59e0b",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700},children:[casWidgets?.top_trending?.comments_count||0," tanggapan"]})
    ]}),
    (0,t.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:700,color:"var(--cas-text-primary, #f8fafc)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:casWidgets?.top_trending?.snippet||"Belum ada diskusi publik yang aktif."}),
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:[
      (0,t.jsx)("span",{children:casWidgets?.top_trending?.author_handle ? casWidgets.top_trending.author_handle : formatCallsign(casWidgets?.top_trending?.author_callsign, casWidgets?.top_trending?.author_id, casWidgets?.top_trending?.author_handle)}),
      (0,t.jsx)("span",{style:{color:"#f59e0b",fontWeight:700},children:"Ikuti Diskusi ➔"})
    ]})
  ]}),
  (0,t.jsxs)("div",{onClick:()=>e.push("/cms/profile"),style:{background:"var(--cas-bg-card, #1e293b)",border:"1px solid rgba(139,92,246,0.3)",borderLeft:"4px solid #8b5cf6",borderRadius:"10px",padding:"0.85rem 1rem",cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.4rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",transition:"transform 0.15s ease"},children:[
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
      (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800,color:"#a78bfa",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:"👮‍♂️ COMMUNITY ANAK SERSE"}),
      (0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(139,92,246,0.15)",color:"#a78bfa",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:800},children:casWidgets?.quick_stats?.callsign || formatCallsign(r?.callsign, r?.id, r?.username)})
    ]}),
    (0,t.jsxs)("div",{style:{fontSize:"0.84rem",fontWeight:700,color:"var(--cas-text-primary, #f8fafc)"},children:["Catatan Taktis Saya: ",casWidgets?.quick_stats?.my_posts||0," postingan"]}),
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:[
      (0,t.jsx)("span",{children:"Profil & Lini Masa Pribadi"}),
      (0,t.jsx)("span",{style:{color:"#a78bfa",fontWeight:700},children:"Kelola ➔"})
    ]})
  ]})
]}),`;

content = content.replace(jsxTarget, jsxTarget + widgetCode);

fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.patched.js', content);
console.log('Successfully generated frontend-patch/dashboard-perma-318125d33290_v2.patched.js. Size:', content.length);
