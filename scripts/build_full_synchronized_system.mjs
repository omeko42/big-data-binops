import fs from 'fs';
import cp from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('=== [STEP 1] Building Synchronized 0-gigr76s0g8t.js ===');
let topbar = fs.readFileSync('frontend-patch/0-gigr76s0g8t.js', 'utf8');

// 1. Update role array a to include sharese
topbar = topbar.replace(
  'let a=["superadmin","admin_binops","operator","viewer"],t=["superadmin","admin_binops"],r=["superadmin"]',
  'let a=["superadmin","admin_binops","operator","viewer","sharese"],t=["superadmin","admin_binops"],r=["superadmin"]'
);

// 2. Insert Jukrahcaster and Pengaturan directly after Dashboard
const dashboardPattern = '{label:"Dashboard",items:[{key:"ringkasan",label:"Ringkasan",icon:"pi pi-fw pi-home",to:"/cms/dashboard/main",defaultRoles:a}]}';
const newSections = '{label:"Dashboard",items:[{key:"ringkasan",label:"Ringkasan",icon:"pi pi-fw pi-home",to:"/cms/dashboard/main",defaultRoles:a}]},{label:"Jukrahcaster",items:[{key:"jukrahcaster",label:"Feed",icon:"pi pi-fw pi-globe",to:"/cms/broadcaster",defaultRoles:a},{key:"kelola-jukrahcaster",label:"Kelola feed",icon:"pi pi-fw pi-megaphone",to:"/cms/pengumuman",defaultRoles:t}]},{label:"Pengaturan",items:[{key:"profil",label:"Profile saya",icon:"pi pi-fw pi-user",to:"/cms/profile",defaultRoles:a}]}';

if (!topbar.includes(dashboardPattern)) {
  console.error('dashboardPattern not found in 0-gigr');
  process.exit(1);
}
topbar = topbar.replace(dashboardPattern, newSections);

// 3. Remove old Pengaturan and Jukrah from after Master Data
const oldSections = '{label:"Pengaturan",items:[{key:"profil",label:"Profil",icon:"pi pi-fw pi-user",to:"/cms/profile",defaultRoles:a}]},{label:"Jukrah",items:[{key:"jukrah",label:"Jukrah",icon:"pi pi-fw pi-megaphone",to:"/cms/pengumuman",defaultRoles:a},{key:"jukrahcaster",label:"Jukrahcaster",icon:"pi pi-fw pi-send",to:"/cms/broadcaster",defaultRoles:t}]},';
if (!topbar.includes(oldSections)) {
  console.error('oldSections not found in 0-gigr');
  process.exit(1);
}
topbar = topbar.replace(oldSections, '');

// 4. Update breadcrumbs
topbar = topbar.replace('broadcaster:"Jukrahcaster"', 'broadcaster:"Feed"');
topbar = topbar.replace('profile:"Profil"', 'profile:"Profile saya"');

// 5. Insert safe helpers directly inside function L
const lTarget = 'function L({user:e,roleLabel:n,onToggleSidebar:l,onToggleCollapse:i}){';
if (!topbar.includes(lTarget)) {
  console.error('lTarget not found in 0-gigr');
  process.exit(1);
}

const safeHelpers = `function L({user:e,roleLabel:n,onToggleSidebar:l,onToggleCollapse:i}){
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
  }`;

topbar = topbar.replace(lTarget, safeHelpers);

// Replace let eo=e?.name||e?.email||"Pengguna"
const eoTarget = 'let eo=e?.name||e?.email||"Pengguna",ec=';
if (topbar.includes(eoTarget)) {
  topbar = topbar.replace(eoTarget, 'let eo=formatCallsign(e?.callsign,e?.id,e?.username),ec=');
}

// Replace satker role
const satkerTarget = '(0,a.jsx)("div",{className:"cms-user-role",children:(e?.satker_nama||e?.satuan||"Nasional")})';
if (topbar.includes(satkerTarget)) {
  topbar = topbar.replace(satkerTarget, '(0,a.jsx)("div",{className:"cms-user-role",children:toTitleCase(e?.satker_nama||e?.satuan||"Nasional")})');
}

fs.writeFileSync('frontend-patch/0-gigr76s0g8t.synchronized.js', topbar);
cp.execSync('node -c frontend-patch/0-gigr76s0g8t.synchronized.js');
console.log('✓ 0-gigr76s0g8t.synchronized.js built and syntax verified PASS');

console.log('\\n=== [STEP 2] Building Synchronized dashboard-perma-318125d33290_v2.js ===');
let dash = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.js', 'utf8');

// 1. Add state variable [casFeed,setCasFeed] and [casFeedLoading,setCasFeedLoading]
const stateTarget = '[dpoRows,setDpoRows]=(0,a.useState)([]),';
dash = dash.replace(stateTarget, stateTarget + '[casFeed,setCasFeed]=(0,a.useState)([]),[casFeedLoading,setCasFeedLoading]=(0,a.useState)(!0),');

// 2. Add useEffect to fetch /bdb/jukrah/feed?limit=5
const effectTarget = '(0,a.useEffect)(()=>{n((0,h.getUser)())},[]),';
const effectCode = `(0,a.useEffect)(()=>{try{p.apiAuth.get("/bdb/jukrah/feed",{params:{limit:5}}).then(r=>{setCasFeed((r.data?.data||[]).slice(0,5))}).catch(()=>{setCasFeed([])}).finally(()=>{setCasFeedLoading(!1)})}catch(e){setCasFeedLoading(!1)}},[]),`;
dash = dash.replace(effectTarget, effectTarget + effectCode);

// 3. Insert helpers safely inside default component closure
const fnTarget = 'e.s(["default",0,function(){let e=(0,v.useRouter)(';
const safeDashHelpers = `e.s(["default",0,function(){
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
  let e=(0,v.useRouter)(`;
dash = dash.replace(fnTarget, safeDashHelpers);

// 4. Update greeting in dash-head
const dashHeadTarget = 'children:["Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),".",l?.scoped&&(0,t.jsxs)("span",{className:"dash-scope-badge",children:[(0,t.jsx)("i",{className:"pi pi-sitemap",style:{fontSize:"0.7rem",marginRight:"0.3rem"}}),"Satker: ",l.scope_satker||"Belum ditetapkan"]})]';
const enhancedDashHead = 'children:["Selamat datang, ",(0,t.jsx)("strong",{children:formatCallsign(r?.callsign,r?.id,r?.username)})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?toTitleCase(l.scope_satker):"Nasional"}),".",l?.scoped&&(0,t.jsxs)("span",{className:"dash-scope-badge",children:[(0,t.jsx)("i",{className:"pi pi-sitemap",style:{fontSize:"0.7rem",marginRight:"0.3rem"}}),"Satker: ",toTitleCase(l.scope_satker)||"Belum ditetapkan"]})]';
dash = dash.replace(dashHeadTarget, enhancedDashHead);

// 5. Insert Ruang Kolaborasi Terkini feed card EXACTLY BELOW Search & Filter Periode
const boundary = '})]}),eh?';
if (!dash.includes(boundary)) {
  console.error('boundary not found in dashboard chunk');
  process.exit(1);
}

const feedCardCode = `(0,t.jsxs)("div",{
  className:"cms-card",
  style:{
    marginTop:"1rem",
    padding:"1rem 1.25rem",
    borderRadius:"12px",
    border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",
    background:"var(--cas-bg-card, #1e293b)",
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
  },
  children:[
    // Header
    (0,t.jsxs)("div",{
      style:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:"0.75rem",
        paddingBottom:"0.6rem",
        borderBottom:"1px solid rgba(255,255,255,0.06)"
      },
      children:[
        (0,t.jsxs)("div",{
          style:{display:"flex",alignItems:"center",gap:"0.5rem"},
          children:[
            (0,t.jsx)("span",{style:{fontSize:"1.1rem"},children:"📡"}),
            (0,t.jsx)("span",{
              style:{fontWeight:800,fontSize:"0.95rem",color:"var(--cas-text-primary, #f8fafc)"},
              children:"Ruang Kolaborasi Terkini"
            }),
            (0,t.jsx)("span",{
              style:{fontSize:"0.68rem",background:"rgba(56,189,248,0.15)",color:"#38bdf8",padding:"0.1rem 0.5rem",borderRadius:"999px",fontWeight:700},
              children:"Live Feed"
            })
          ]
        }),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>e.push("/cms/broadcaster"),
          style:{background:"transparent",border:"none",color:"#38bdf8",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
          children:["Lihat Semua Feed ➔"]
        })
      ]
    }),

    // Body: Exactly 5 compact rows with ellipsis and click navigation
    casFeedLoading ? (
      (0,t.jsx)("div",{style:{padding:"0.8rem",textAlign:"center",color:"#94a3b8",fontSize:"0.82rem"},children:"Memuat siaran taktis terkini…"})
    ) : casFeed.length === 0 ? (
      (0,t.jsxs)("div",{
        style:{padding:"0.8rem",textAlign:"center",color:"#94a3b8",fontSize:"0.82rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"},
        children:[
          (0,t.jsx)("span",{children:"📭"}),
          (0,t.jsx)("span",{children:"Belum ada catatan taktis baru di linimasa CAS."}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>e.push("/cms/broadcaster"),
            style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",textDecoration:"underline",fontSize:"0.82rem"},
            children:"Mulai Buat Postingan"
          })
        ]
      })
    ) : (
      (0,t.jsx)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.4rem"},
        children:casFeed.slice(0, 5).map(item => {
          let callsign = formatCallsign(item.author_callsign, item.author_id, item.author_username);
          let satker = toTitleCase(item.satker_name || item.satker || 'Robinops Bareskrim');
          let timeStr = item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Baru saja';
          return (0,t.jsxs)("div",{
            key:item.id,
            onClick:()=>e.push("/cms/broadcaster?post=" + item.id),
            title:"Klik untuk membuka postingan ini di Feed",
            style:{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"0.75rem",
              padding:"0.45rem 0.65rem",
              borderRadius:"6px",
              background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.04)",
              cursor:"pointer",
              fontSize:"0.82rem",
              transition:"background 0.15s ease"
            },
            onMouseEnter:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.05)",
            onMouseLeave:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.02)",
            children:[
              // Left: Author callsign & satker
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",flexShrink:0},
                children:[
                  (0,t.jsx)("span",{style:{fontWeight:800,color:"#38bdf8"},children:callsign}),
                  (0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(255,255,255,0.08)",color:"#cbd5e1",padding:"0.05rem 0.35rem",borderRadius:"4px"},children:satker}),
                  (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:"•"})
                ]
              }),
              // Middle: Truncated content with ellipsis
              (0,t.jsx)("div",{
                style:{
                  flex:1,
                  minWidth:0,
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  whiteSpace:"nowrap",
                  color:"var(--cas-text-primary, #e2e8f0)"
                },
                children:item.content || item.title || "-"
              }),
              // Right: Time & arrow
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",flexShrink:0,color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.72rem"},
                children:[
                  (0,t.jsx)("span",{children:timeStr}),
                  (0,t.jsx)("span",{style:{color:"#60a5fa",fontWeight:800},children:"➔"})
                ]
              })
            ]
          });
        })
      })
    )
  ]
})`;

dash = dash.replace(boundary, '})]}),' + feedCardCode + ',eh?');

fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js', dash);
cp.execSync('node -c frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js');
console.log('✓ dashboard-perma-318125d33290_v2.synchronized.js built and syntax verified PASS');

console.log('\\n=== [STEP 3] Validating 3pp0f_cp6yg-o.patched.js ===');
cp.execSync('node -c frontend-patch/3pp0f_cp6yg-o.patched.js');
console.log('✓ 3pp0f_cp6yg-o.patched.js syntax check PASS');

console.log('\\n=== [STEP 4] Deploying to bdb-web ===');
copyFileToFE('frontend-patch/0-gigr76s0g8t.synchronized.js', '/tmp/0-gigr76s0g8t.js');
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js', '/tmp/dashboard-perma-318125d33290_v2.js');
copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.js');
copyFileToFE('frontend-patch/_1ape-8d._.synchronized.js', '/tmp/_1ape-8d._.js');
copyFileToFE('frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js', '/tmp/app_cms_layout_tsx_0ml_4_3._.js');

const deployCmd = `
  # Copy client chunks
  docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
  docker cp /tmp/3pp0f_cp6yg-o.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js

  # Copy SSR chunks to server chunk directories
  docker cp /tmp/_1ape-8d._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/_1ape-8d._.js 2>/dev/null || true
  docker cp /tmp/app_cms_layout_tsx_0ml_4_3._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js 2>/dev/null || true

  rm -f /tmp/0-gigr76s0g8t.js /tmp/dashboard-perma-318125d33290_v2.js /tmp/3pp0f_cp6yg-o.js /tmp/_1ape-8d._.js /tmp/app_cms_layout_tsx_0ml_4_3._.js

  # Validate syntax inside container
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
  echo "ALL_REMOTE_SYNTAX_PASS"
`;

console.log(runFE(deployCmd));
console.log('=== [COMPLETE] Full Synchronized Deployment Finished ===');
