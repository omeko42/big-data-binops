import fs from 'fs';

let content = fs.readFileSync('frontend-patch/0-gigr76s0g8t.patched.js', 'utf8');

// Prepend helper functions formatCallsign, toTitleCase, getRoleBadgeColor
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
function getRoleBadgeColor(r, isOmeko) {
  if (isOmeko) return '#f59e0b';
  var role = String(r || '').toLowerCase();
  if (role === 'superadmin') return '#f59e0b';
  if (role.includes('binops')) return '#10b981';
  return '#3b82f6';
}
`;

content = helpers + content;

// 1. Add state variable [notifTab,setNotifTab]
const stateTarget = '[V,X]=(0,t.useState)(!1),Z=(0,t.useRef)(null);';
if (!content.includes(stateTarget)) {
  console.error('Could not find stateTarget');
  process.exit(1);
}
content = content.replace(stateTarget, stateTarget + 'let [notifTab,setNotifTab]=(0,t.useState)("dinas");');

// 2. Add switchNotifTab function and enhance ei
const eiTarget = 'async function ei(){let e=!q;if(J(e),e){X(!0);try{let e=await M.apiAuth.get("/bdb/notifications/list");H(e.data?.data||[]),await M.apiAuth.post("/bdb/notifications/mark-seen",{}),G({total:0,per_entity:[]})}catch{}finally{X(!1)}}}';
if (!content.includes(eiTarget)) {
  console.error('Could not find eiTarget');
  process.exit(1);
}

const enhancedEi = `async function ei(tab){
  let targetTab = typeof tab === "string" ? tab : (notifTab || "dinas");
  let e = !q;
  if (typeof tab === "string") e = !0;
  if (J(e), e) {
    X(!0);
    try {
      let res = await M.apiAuth.get("/bdb/jukrah/notifications", { params: { category: targetTab } });
      H(res.data?.data || []);
      G({ total: 0, per_entity: [] });
    } catch {
      try {
        let legacy = await M.apiAuth.get("/bdb/notifications/list");
        H(legacy.data?.data || []);
      } catch {}
    } finally {
      X(!1);
    }
  }
}
async function switchNotifTab(t){
  setNotifTab(t);
  X(!0);
  try {
    let res = await M.apiAuth.get("/bdb/jukrah/notifications", { params: { category: t } });
    H(res.data?.data || []);
  } catch {
    H([]);
  } finally {
    X(!1);
  }
}`;

content = content.replace(eiTarget, enhancedEi);

// 3. Replace popover content
const popStartMarker = 'q&&(0,a.jsxs)("div",{className:"cms-status-pop",style:{width:"22rem"';
const startIdx = content.indexOf(popStartMarker);
if (startIdx === -1) {
  console.error('Could not find popStartMarker');
  process.exit(1);
}
const afterMarker = ']}),(0,a.jsx)("button"';
const endIdx = content.indexOf(afterMarker, startIdx);
if (endIdx === -1) {
  console.error('Could not find afterMarker');
  process.exit(1);
}

const enhancedPopover = `q&&(0,a.jsxs)("div",{className:"cms-status-pop",style:{width:"23.5rem",right:0,padding:"0.75rem"},children:[
  (0,a.jsxs)("div",{className:"cms-status-pop-title",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
      (0,a.jsx)(j,{size:15}),
      (0,a.jsx)("span",{style:{fontWeight:800},children:"Notifikasi CAS"})
    ]}),
    (0,a.jsx)("button",{
      type:"button",
      onClick:async()=>{
        try {
          await M.apiAuth.post("/bdb/jukrah/notifications/read-all", { category: notifTab });
          H(prev => prev.map(item => ({ ...item, is_read: !0 })));
        } catch {}
      },
      style:{background:"none",border:"none",color:"#3b82f6",fontSize:"0.72rem",cursor:"pointer",fontWeight:700},
      children:"Tandai Semua Dibaca"
    })
  ]}),
  (0,a.jsxs)("div",{style:{display:"flex",gap:"0.3rem",marginBottom:"0.5rem",background:"rgba(255,255,255,0.06)",padding:"0.2rem",borderRadius:"8px"},children:[
    (0,a.jsx)("button",{
      type:"button",
      onClick:()=>switchNotifTab("dinas"),
      style:{
        flex:1,
        padding:"0.3rem 0.5rem",
        fontSize:"0.76rem",
        fontWeight:700,
        borderRadius:"6px",
        border:"none",
        cursor:"pointer",
        background:notifTab==="dinas"?"#2563eb":"transparent",
        color:notifTab==="dinas"?"#fff":"var(--cas-text-secondary, #94a3b8)",
        transition:"all 0.15s ease"
      },
      children:"📢 Dinas / Jukrah"
    }),
    (0,a.jsx)("button",{
      type:"button",
      onClick:()=>switchNotifTab("social"),
      style:{
        flex:1,
        padding:"0.3rem 0.5rem",
        fontSize:"0.76rem",
        fontWeight:700,
        borderRadius:"6px",
        border:"none",
        cursor:"pointer",
        background:notifTab==="social"?"#2563eb":"transparent",
        color:notifTab==="social"?"#fff":"var(--cas-text-secondary, #94a3b8)",
        transition:"all 0.15s ease"
      },
      children:"💬 Sosial & Interaksi"
    })
  ]}),
  V?(0,a.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",padding:"0.75rem 0",textAlign:"center"},children:"Memuat…"}):0===F.length?(0,a.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",padding:"0.75rem 0",textAlign:"center"},children:notifTab==="dinas"?"Tidak ada notifikasi kedinasan baru.":"Tidak ada interaksi baru."}):(0,a.jsx)("div",{style:{display:"grid",gap:"0.4rem",maxHeight:"22rem",overflowY:"auto"},children:F.map((e,idx)=>(0,a.jsxs)(s.default,{href:e.link||"/cms/broadcaster",onClick:()=>J(!1),style:{display:"flex",gap:"0.55rem",alignItems:"flex-start",textDecoration:"none",color:"inherit",padding:"0.5rem 0.55rem",borderRadius:8,background:"var(--surface-hover, rgba(255,255,255,0.04))",borderLeft:e.category==="dinas"?"3px solid #3b82f6":"3px solid #8b5cf6"},children:[
    (0,a.jsx)("span",{style:{color:e.category==="dinas"?"#2563eb":"#8b5cf6",flex:"0 0 auto",marginTop:"0.15rem"},children:e.category==="dinas"?(0,a.jsx)(v.Megaphone,{size:15}):(0,a.jsx)(j,{size:15})}),
    (0,a.jsxs)("span",{style:{minWidth:0,flex:1},children:[
      (0,a.jsx)("span",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-primary, #f8fafc)"},children:e.title||e.message}),
      (0,a.jsx)("span",{style:{display:"block",fontSize:"0.75rem",color:"var(--cas-text-secondary, #94a3b8)",margin:"0.1rem 0",wordBreak:"break-word"},children:e.message}),
      (0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#64748b"},children:function(e){if(!e)return"baru saja";let a=Math.floor((Date.now()-new Date(e).getTime())/6e4);if(a<1)return"baru saja";if(a<60)return\`\${a} mnt lalu\`;let t=Math.floor(a/60);return t<24?\`\${t} jam lalu\`:\`\${Math.floor(t/24)} hr lalu\`}(e.created_at)})
    ]})
  ]},idx))})
]})`;

content = content.slice(0, startIdx) + enhancedPopover + content.slice(endIdx);

// 4. Update Topbar username, satker (Title Case), and avatar corner verified badge
const userMetaTarget = 'let eo=e?.name||e?.email||"Pengguna",ec=(livePhoto||e?.photo_url||e?.foto)?(0,a.jsx)("img",{src:livePhoto||e?.photo_url||e?.foto,alt:eo,style:{width:"100%",height:"100%",borderRadius:"999px",objectFit:"cover"}}):String(eo).charAt(0).toUpperCase()';
if (!content.includes(userMetaTarget)) {
  console.error('Could not find userMetaTarget');
  process.exit(1);
}

const enhancedUserMeta = `let isOmekoAccount = String(e?.id) === '1' || e?.username === 'omeko11' || e?.callsign === 'omeko11';
let eo = formatCallsign(e?.callsign, e?.id, e?.username);
let topbarBadgeColor = getRoleBadgeColor(e?.role_bdb, isOmekoAccount);
let ec = (0,a.jsxs)("div",{style:{position:"relative",width:"100%",height:"100%",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:[
  (livePhoto||e?.photo_url||e?.foto)?(0,a.jsx)("img",{src:livePhoto||e?.photo_url||e?.foto,alt:eo,style:{width:"100%",height:"100%",borderRadius:"999px",objectFit:"cover"}}):(0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.82rem",color:"#38bdf8"},children:String(e?.name||eo).charAt(0).toUpperCase()}),
  (0,a.jsx)("div",{title:"Terverifikasi CAS",style:{position:"absolute",bottom:"-2px",right:"-2px",width:"12px",height:"12px",borderRadius:"999px",background:topbarBadgeColor,border:"1.5px solid #0f172a",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 4px "+topbarBadgeColor+"aa"},children:(0,a.jsx)("svg",{viewBox:"0 0 12 12",width:"7px",height:"7px",fill:"none",stroke:"#fff",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round",children:(0,a.jsx)("path",{d:"m2.5 6 2.5 2.5 5-5"})})})
]})`;

content = content.replace(userMetaTarget, enhancedUserMeta);

// 5. Update Satker in Topbar to toTitleCase
const satkerTarget = '(0,a.jsx)("div",{className:"cms-user-role",children:(e?.satker_nama||e?.satuan||"Nasional")})';
if (!content.includes(satkerTarget)) {
  console.error('Could not find satkerTarget');
  process.exit(1);
}
content = content.replace(satkerTarget, '(0,a.jsx)("div",{className:"cms-user-role",children:toTitleCase(e?.satker_nama||e?.satuan||"Nasional")})');

fs.writeFileSync('frontend-patch/0-gigr76s0g8t.enhanced.js', content);
console.log('Successfully generated frontend-patch/0-gigr76s0g8t.enhanced.js. Size:', content.length);
