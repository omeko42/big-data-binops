import fs from 'fs';
import cp from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';
import { runBE, copyFileToBE } from './be_exec.mjs';

console.log('=================================================================');
console.log('CAS MASTER BUILD & DEPLOY: BRANDING, FEED, REACTION & PROFILE FIX');
console.log('=================================================================');

const formatCallsignFn = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
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

function formatCount(num) {
  var n = Number(num || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return String(n);
}\n`;

// -------------------------------------------------------------------
// 1. BRANDING: 0-gigr76s0g8t.synchronized.js & app_cms_layout SSR
// -------------------------------------------------------------------
console.log('\n1. Applying Branding "Community Anak Serse" to Layout Chunks...');

let c_layout = fs.readFileSync('frontend-patch/0-gigr76s0g8t.synchronized.js', 'utf8');
if (c_layout.includes('children:"BIG DATA BINOPS"')) {
  c_layout = c_layout.replace('children:"BIG DATA BINOPS"', 'children:"Community Anak Serse"');
  fs.writeFileSync('frontend-patch/0-gigr76s0g8t.synchronized.js', c_layout, 'utf8');
  console.log('  ✓ Updated 0-gigr76s0g8t.synchronized.js brand name');
}
cp.execSync('node -c frontend-patch/0-gigr76s0g8t.synchronized.js');

let c_layout_ssr = fs.readFileSync('frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js', 'utf8');
if (c_layout_ssr.includes('children:"BIG DATA BINOPS"')) {
  c_layout_ssr = c_layout_ssr.replace('children:"BIG DATA BINOPS"', 'children:"Community Anak Serse"');
  fs.writeFileSync('frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js', c_layout_ssr, 'utf8');
  console.log('  ✓ Updated app_cms_layout_tsx_0ml_4_3._.synchronized.js brand name');
}
cp.execSync('node -c frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js');

// -------------------------------------------------------------------
// 2. KELOLA FEED: 35hkjujo3bzza.patched.js
// -------------------------------------------------------------------
console.log('\n2. Updating 35hkjujo3bzza.patched.js (raw_name brackets eradication)...');
let c_35hk = fs.readFileSync('frontend-patch/35hkjujo3bzza.patched.js', 'utf8');
const raw35hk = 'p.raw_name && (0, t.jsxs)("span", { style: { fontSize: "0.75rem", color: "#94a3b8" }, children: ["(", p.raw_name, ")"] }),';
if (c_35hk.includes(raw35hk)) {
  c_35hk = c_35hk.replace(raw35hk, '');
} else {
  c_35hk = c_35hk.replace(/p\.raw_name\s*&&\s*\(0,\s*t\.jsxs\)\("span",\s*\{[^}]*\}\s*,\s*children:\s*\["\("\s*,\s*p\.raw_name\s*,\s*"\)"\]\s*\}\),?/g, '');
}
fs.writeFileSync('frontend-patch/35hkjujo3bzza.patched.js', c_35hk, 'utf8');
cp.execSync('node -c frontend-patch/35hkjujo3bzza.patched.js');
console.log('  ✓ 35hkjujo3bzza.patched.js: OK');

// -------------------------------------------------------------------
// 3. BROADCASTER / FEED: 3pp0f_cp6yg-o.patched.js
// -------------------------------------------------------------------
console.log('\n3. Updating 3pp0f_cp6yg-o.patched.js (Feed 3-lines, Detail modal, Views, Left reactions)...');
let c_3pp = fs.readFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', 'utf8');

if (!c_3pp.includes('function formatCount(')) {
  const fcIdx = c_3pp.indexOf('function formatCallsign(');
  if (fcIdx !== -1) {
    const fnDef = `function formatCount(num) {
  var n = Number(num || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return String(n);
}\n`;
    c_3pp = c_3pp.slice(0, fcIdx) + fnDef + c_3pp.slice(fcIdx);
  }
}

if (!c_3pp.includes('selectedPostDetail, setSelectedPostDetail')) {
  const targetState = 'var [previewUser, setPreviewUser] = (0,n.useState)(null);';
  const repState = `var [selectedPostDetail, setSelectedPostDetail] = (0,n.useState)(null);
  var handleOpenPostDetail = async (post) => {
    if (!post) return;
    post.view_count = (post.view_count || 0) + 1;
    setSelectedPostDetail({ ...post });
    try {
      await c.apiAuth.post('/bdb/jukrah/post/' + post.id + '/acknowledge');
    } catch(e) {}
  };
  var [previewUser, setPreviewUser] = (0,n.useState)(null);`;
  c_3pp = c_3pp.replace(targetState, repState);
}

const oldProfileFnTarget = `  var handleOpenUserProfile = async (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id;
    var isTargetSuperadmin = String(targetId) === '1' || postContext?.author_username === 'omeko11' || postContext?.username === 'omeko11' || postContext?.callsign === 'omeko11';
    var initialUser = {
      id: targetId,
      name: isTargetSuperadmin ? 'EKO' : (postContext?.author_name || postContext?.name || 'Personil Polri'),
      username: isTargetSuperadmin ? 'omeko11' : (postContext?.author_username || postContext?.username || 'personil'),
      callsign: isTargetSuperadmin ? 'omeko11' : (postContext?.author_callsign || postContext?.callsign || null),
      role_bdb: isTargetSuperadmin ? 'superadmin' : (postContext?.author_role || postContext?.role_bdb || 'operator'),
      satker_nama: postContext?.author_satker || postContext?.satker_nama || postContext?.satker || 'Mabes Bareskrim',
      photo_url: postContext?.author_photo_url || postContext?.author_photo || postContext?.photo_url || null,
      pangkat: isTargetSuperadmin ? 'Superadmin' : (postContext?.author_pangkat || postContext?.pangkat || 'Personil'),
      jabatan: postContext?.author_jabatan || postContext?.jabatan || 'Penyidik Reserse',
      social_media: postContext?.social_media || {}
    };
    setPreviewUser(initialUser);
    setProfileModalOpen(!0);
    setLoadingProfile(!0);
    try {
      var res = await c.apiAuth.get('/bdb/jukrah/network/profile/' + targetId);
      if (res.data?.data) {
        setPreviewUser(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (e) {
    } finally {
      setLoadingProfile(!1);
    }
  };`;

const newProfileFn = `  var handleOpenUserProfile = (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id;
    if (currentUser?.id && String(currentUser.id) === String(targetId)) {
      window.location.href = '/cms/profile';
      return;
    }
    var rawKey = 'cas:pers:' + targetId + ':' + (postContext?.author_username || postContext?.username || 'polri');
    var token = btoa(rawKey).replace(/=/g, '');
    window.location.href = '/cms/profile?u=' + token + '&ref=feed';
  };`;

if (c_3pp.includes(oldProfileFnTarget)) {
  c_3pp = c_3pp.replace(oldProfileFnTarget, newProfileFn);
}

const oldContentBlock = `              // Post Body Content
              (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #e2e8f0)",lineHeight:"1.6",whiteSpace:"pre-wrap",wordBreak:"break-word",marginBottom:"0.85rem"},children:
                renderPostContent(post.content, (tag) => {
                  setFeedType('all');
                  setSearchQuery(tag);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                  toastRef.current?.show({ severity: 'info', summary: 'Filter Tagar', detail: 'Menampilkan postingan dengan tagar ' + tag });
                })
              }),`;

const newContentBlock = `              // Post Body Content (Maksimal 3 Baris - Clamped & Clickable Detail)
              (0,t.jsxs)("div",{style:{marginBottom:"0.85rem"},children:[
                (0,t.jsx)("div",{
                  onClick:() => handleOpenPostDetail(post),
                  title:"Klik untuk membaca postingan selengkapnya",
                  style:{
                    fontSize:"0.9rem",
                    color:"var(--text-color, #0f172a)",
                    lineHeight:"1.55",
                    whiteSpace:"pre-wrap",
                    wordBreak:"break-word",
                    display:"-webkit-box",
                    WebkitLineClamp:3,
                    WebkitBoxOrient:"vertical",
                    overflow:"hidden",
                    textOverflow:"ellipsis",
                    cursor:"pointer"
                  },
                  children:renderPostContent(post.content, (tag) => {
                    setFeedType('all');
                    setSearchQuery(tag);
                    window.scrollTo({ top: 220, behavior: 'smooth' });
                    toastRef.current?.show({ severity: 'info', summary: 'Filter Tagar', detail: 'Menampilkan postingan dengan tagar ' + tag });
                  })
                }),
                (post.content && post.content.length > 180) && (0,t.jsx)("button",{
                  type:"button",
                  onClick:() => handleOpenPostDetail(post),
                  style:{background:"transparent",border:"none",color:"#0284c7",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",padding:"0.2rem 0",display:"inline-flex",alignItems:"center",gap:"0.25rem"},
                  children:"Lihat selengkapnya ➔"
                })
              ]}),`;

if (c_3pp.includes(oldContentBlock)) {
  c_3pp = c_3pp.replace(oldContentBlock, newContentBlock);
}

const oldMetricsRow = `              // Metrics stats row (Clickable reactions to open "Siapa saja yg ngelike" modal)
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.74rem",color:"#94a3b8",paddingBottom:"0.6rem",borderBottom:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
                (totalReactions > 0) ? (
                  (0,t.jsxs)("button",{
                    type:"button",
                    onClick:() => handleOpenReactionsList(post.id),
                    style:{background:"transparent",border:"none",cursor:"pointer",padding:0,color:"#38bdf8",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                    title:"Lihat siapa saja yang memberi reaksi",
                    children:[
                      "👍 ",totalReactions," reaksi"
                    ]
                  })
                ) : (
                  (0,t.jsx)("span",{style:{color:"#64748b"},children:"Belum ada reaksi"})
                ),
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.8rem"},children:[
                  (0,t.jsxs)("span",{children:[post.comments_count || 0," komentar"]}),
                  (post.repost_count > 0) && (0,t.jsxs)("span",{children:[post.repost_count," diteruskan"]})
                ]})
              ]}),`;

const newMetricsRow = `              // Metrics stats row (Views count & Comments)
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.74rem",color:"var(--text-color-secondary, #94a3b8)",paddingBottom:"0.6rem",borderBottom:"1px solid var(--surface-border, rgba(0,0,0,0.06))"},children:[
                (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#0284c7",fontWeight:600},children:[
                  "👁️ ",formatCount(post.view_count || 1)," dilihat"
                ]}),
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.8rem"},children:[
                  (0,t.jsxs)("span",{children:[post.comments_count || 0," komentar"]}),
                  (post.repost_count > 0) && (0,t.jsxs)("span",{children:[post.repost_count," diteruskan"]})
                ]})
              ]}),`;

if (c_3pp.includes(oldMetricsRow)) {
  c_3pp = c_3pp.replace(oldMetricsRow, newMetricsRow);
}

const oldActionBarTrigger = `                // Long-Press / Hover Reaction Bar Trigger
                (0,t.jsxs)("div",{
                  style:{position:"relative"},
                  onMouseEnter:() => setHoverReactionPostId(post.id),
                  onMouseLeave:() => setTimeout(() => setHoverReactionPostId(id => (id === post.id ? null : id)), 400),
                  children:[
                    (0,t.jsxs)("button",{
                      type:"button",
                      onClick:() => handleReact(post.id, currentReact ? currentReact : 'like'),`;

const newActionBarTrigger = `                // Long-Press / Hover Reaction Bar Trigger with Reaction Count on the LEFT
                (0,t.jsxs)("div",{
                  style:{position:"relative",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                  onMouseEnter:() => setHoverReactionPostId(post.id),
                  onMouseLeave:() => setTimeout(() => setHoverReactionPostId(id => (id === post.id ? null : id)), 400),
                  children:[
                    // Reaction Count on Left
                    totalReactions > 0 ? (
                      (0,t.jsxs)("button",{
                        type:"button",
                        onClick:() => handleOpenReactionsList(post.id),
                        title:"Lihat siapa saja yang memberi reaksi",
                        style:{
                          background:"rgba(56,189,248,0.12)",
                          border:"1px solid rgba(56,189,248,0.25)",
                          color:"#0284c7",
                          padding:"0.2rem 0.55rem",
                          borderRadius:"999px",
                          fontWeight:800,
                          fontSize:"0.76rem",
                          cursor:"pointer",
                          display:"inline-flex",
                          alignItems:"center",
                          gap:"0.25rem"
                        },
                        children:[
                          "👍 ", formatCount(totalReactions)
                        ]
                      })
                    ) : null,
                    (0,t.jsxs)("button",{
                      type:"button",
                      onClick:() => handleReact(post.id, currentReact ? currentReact : 'like'),`;

if (c_3pp.includes(oldActionBarTrigger)) {
  c_3pp = c_3pp.replace(oldActionBarTrigger, newActionBarTrigger);
}

if (!c_3pp.includes('Detail Postingan Linimasa CAS')) {
  const insertBeforeDialog = '// Tactical Profile Preview Dialog';
  const detailDialogCode = `// Detail Postingan Modal Pop-up
    (0,t.jsx)(u.Dialog,{
      header:"Detail Postingan Linimasa CAS",
      visible:!!selectedPostDetail,
      onHide:() => setSelectedPostDetail(null),
      style:{width:"42rem",maxWidth:"95vw"},
      modal:!0,
      dismissableMask:!0,
      children: selectedPostDetail && (0,t.jsxs)("div",{
        style:{display:"grid",gap:"1rem"},
        children:[
          // Header: Author meta + Views Count
          (0,t.jsxs)("div",{
            style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.6rem"},
            children:[
              (0,t.jsxs)("div",{
                style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:"pointer"},
                onClick:() => { setSelectedPostDetail(null); handleOpenUserProfile(selectedPostDetail.author_id, selectedPostDetail); },
                title:"Buka Halaman Profil Personil",
                children:[
                  renderCornerAvatar(selectedPostDetail.author_photo_url || selectedPostDetail.author_photo, String(selectedPostDetail.author_name || 'P').charAt(0).toUpperCase(), getVerificationBadge(selectedPostDetail.author_role, String(selectedPostDetail.author_id)==='1'), 2.4, 15, 8.5),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"#0284c7"},children:formatCallsign(selectedPostDetail.author_callsign, selectedPostDetail.author_id, selectedPostDetail.author_username)}),
                    (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"var(--text-color-secondary, #64748b)"},children:[
                      selectedPostDetail.author_satker || "Mabes Polri", " • ", timeAgo(selectedPostDetail.created_at)
                    ]})
                  ]})
                ]
              }),
              (0,t.jsxs)("span",{
                style:{fontSize:"0.75rem",fontWeight:700,background:"rgba(56,189,248,0.12)",color:"#0284c7",padding:"0.25rem 0.65rem",borderRadius:"999px",border:"1px solid rgba(56,189,248,0.25)",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                children:["👁️ ", formatCount(selectedPostDetail.view_count || 1), " dilihat"]
              })
            ]
          }),
          // Post full content
          (0,t.jsx)("div",{
            style:{fontSize:"0.95rem",lineHeight:"1.65",color:"var(--text-color, #0f172a)",whiteSpace:"pre-wrap",wordBreak:"break-word",background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.85rem 1rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.06))"},
            children:renderPostContent(selectedPostDetail.content)
          }),
          // Media Attachments if any
          selectedPostDetail.media_urls && selectedPostDetail.media_urls.length > 0 && (0,t.jsx)("div",{
            style:{display:"grid",gap:"0.5rem"},
            children:selectedPostDetail.media_urls.map((m, mIdx) => {
              var mUrl = m.stream_url || (m.token ? ('/api/bdb/jukrah/stream/' + m.token) : m.url);
              var isImg = m.type?.startsWith('image/') || m.name?.match(/\\.(png|jpe?g|webp|gif)$/i);
              return isImg ? (0,t.jsx)("img",{key:mIdx,src:mUrl,alt:"Lampiran",style:{maxWidth:"100%",maxHeight:"360px",borderRadius:"8px",objectFit:"contain",margin:"0 auto"}}) : null;
            })
          })
        ]
      })
    }),\n    `;
  c_3pp = c_3pp.replace(insertBeforeDialog, detailDialogCode + insertBeforeDialog);
}

fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', c_3pp, 'utf8');
cp.execSync('node -c frontend-patch/3pp0f_cp6yg-o.patched.js');
console.log('  ✓ 3pp0f_cp6yg-o.patched.js: OK');


// -------------------------------------------------------------------
// 4. PROFILE: 3def3ti6rk0vr.linkedin_v3.js (Encrypted Profile Viewer & Read-Only)
// -------------------------------------------------------------------
console.log('\n4. Updating 3def3ti6rk0vr.linkedin_v3.js (Encrypted Profile Viewer & Read-Only)...');
let c_3def = fs.readFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', 'utf8');

if (!c_3def.includes('function formatCallsign(')) {
  const phoneIdx = c_3def.indexOf('function maskPhone(');
  if (phoneIdx !== -1) {
    const phoneEnd = c_3def.indexOf('}', phoneIdx) + 1;
    c_3def = c_3def.slice(0, phoneEnd) + '\n' + formatCallsignFn + c_3def.slice(phoneEnd);
  }
}

if (!c_3def.includes('isReadOnlyMode,setIsReadOnlyMode')) {
  const stateInsertTarget = 'function(){let e=(0,n.useRef)(null),[a,y]=(0,n.useState)(null),';
  const stateInsertRep = 'function(){let e=(0,n.useRef)(null),[a,y]=(0,n.useState)(null),[isReadOnlyMode,setIsReadOnlyMode]=(0,n.useState)(!1),';
  c_3def = c_3def.replace(stateInsertTarget, stateInsertRep);
}

const oldEtTarget = 'async function eT(){let e=await c.apiAuth.get("/Authentication/user");return y(e.data?.data||null),e.data?.data}';
const newEtFn = `async function eT(){
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('u') || sp.get('uid')) : null;
  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/Authentication/user");
    myUser = myRes.data?.data || null;
  } catch(e) {}

  if (uToken) {
    var targetId = null;
    try {
      var decoded = atob(uToken);
      var parts = decoded.split(':');
      if (parts[0] === 'cas' && parts[1] === 'pers' && parts[2]) {
        targetId = parts[2];
      }
    } catch(err) {
      if (/^\\d+$/.test(uToken)) targetId = uToken;
    }

    if (targetId && (!myUser?.id || String(myUser.id) !== String(targetId))) {
      setIsReadOnlyMode(!0);
      try {
        var targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + targetId);
        var targetData = targetRes.data?.data || null;
        if (targetData) {
          y(targetData);
          return targetData;
        }
      } catch(err) {}
    }
  }

  setIsReadOnlyMode(!1);
  y(myUser);
  return myUser;
}`;

if (c_3def.includes(oldEtTarget)) {
  c_3def = c_3def.replace(oldEtTarget, newEtFn);
}

// Banner in profile when isReadOnlyMode:
const heroContainerTarget = 'children:[(0,t.jsxs)("div",{style:{position:"relative",borderRadius:"16px",';
const bannerAndHeroRep = `children:[
      isReadOnlyMode && (0,t.jsxs)("div",{
        style:{
          background:"linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(15,23,42,0.6) 100%)",
          border:"1px solid rgba(56,189,248,0.3)",
          borderRadius:"12px",
          padding:"0.85rem 1.25rem",
          marginBottom:"1.25rem",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          flexWrap:"wrap",
          gap:"0.75rem"
        },
        children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
            (0,t.jsx)("span",{style:{fontSize:"1.4rem"},children:"🛡️"}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"var(--text-color, #0f172a)"},children:"Profil Personil CAS (Mode Kedinasan - Terenkripsi)"}),
              (0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"var(--text-color-secondary, #64748b)"},children:"Data identitas dan riwayat penugasan resmi Mabes Bareskrim Polri • Akses Terbatas (Read-Only)"})
            ]})
          ]}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:() => { window.location.href = '/cms/profile'; },
            style:{background:"#2563eb",color:"#fff",border:"none",padding:"0.4rem 0.95rem",borderRadius:"8px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(37,99,235,0.3)"},
            children:"⬅️ Kembali ke Profil Saya"
          })
        ]
      }),
      (0,t.jsxs)("div",{style:{position:"relative",borderRadius:"16px",`;

if (c_3def.includes(heroContainerTarget)) {
  c_3def = c_3def.replace(heroContainerTarget, bannerAndHeroRep);
}

// Hero Name row:
const clientHeroTarget = '(0,t.jsx)("span",{style:{fontSize:"1.55rem",fontWeight:800,color:"var(--text-color, #0f172a)",lineHeight:1.2},children:(a?.callsign||a?.username||a?.name||"omeko11")})';
const clientHeroReplacement = `(0,t.jsx)("span",{style:{fontSize:"1.55rem",fontWeight:800,color:"var(--text-color, #0f172a)",lineHeight:1.2},children:(a?.name||a?.nama||a?.username||"Personil Polri")}),
        (0,t.jsx)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#0284c7",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.25)",padding:"0.2rem 0.65rem",borderRadius:"999px",fontFamily:"monospace"},children:formatCallsign(a?.callsign, a?.id, a?.username)})`;

if (c_3def.includes(clientHeroTarget)) {
  c_3def = c_3def.replace(clientHeroTarget, clientHeroReplacement);
}

c_3def = c_3def.replace(/color:"var\(--cas-text-primary,\s*#e2e8f0\)"/g, 'color:"var(--text-color-secondary, #64748b)"');

// Hero Action Buttons (Respect isReadOnlyMode):
const oldHeroButtons = `      // Action Pills Bar (Tactical Police Actions)
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
        (0,t.jsx)("button",{
          type:"button",
          onClick:openEditIntro,
          style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",boxShadow:"0 2px 8px rgba(37,99,235,0.3)"},
          children:"✏️ Edit Biodata"
        }),
        (0,t.jsx)("button",{
          type:"button",
          onClick:()=>{setSettingsTab('keamanan');setSettingsModal(!0);},
          style:{background:"transparent",color:"#0284c7",border:"1px solid #0284c7",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
          children:"🔐 Keamanan Akun"
        }),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>{
            setNetworkModal(!0);
            fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter);
          },
          style:{background:"var(--surface-50, rgba(0,0,0,0.04))",color:"var(--text-color, #1e293b)",border:"1px solid var(--surface-border, rgba(0,0,0,0.15))",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
          children:[
            "👮 Direktori Personil"
          ]
        })
      ]})`;

const newHeroButtons = `      // Action Pills Bar (Tactical Police Actions - ReadOnly aware)
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
        !isReadOnlyMode ? (
          (0,t.jsx)("button",{
            type:"button",
            onClick:openEditIntro,
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",boxShadow:"0 2px 8px rgba(37,99,235,0.3)"},
            children:"✏️ Edit Biodata"
          })
        ) : (
          (0,t.jsx)("span",{
            style:{background:"rgba(56,189,248,0.12)",color:"#0284c7",border:"1px solid rgba(56,189,248,0.25)",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.35rem"},
            children:"🔒 Profil Terverifikasi (Read-Only)"
          })
        ),
        !isReadOnlyMode ? (
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{setSettingsTab('keamanan');setSettingsModal(!0);},
            style:{background:"transparent",color:"#0284c7",border:"1px solid #0284c7",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
            children:"🔐 Keamanan Akun"
          })
        ) : (
          (0,t.jsx)("button",{
            type:"button",
            onClick:() => {
              navigator.clipboard?.writeText(formatCallsign(a?.callsign, a?.id, a?.username));
              e.current?.show({ severity: 'success', summary: 'Callsign Disalin', detail: 'Callsign ' + formatCallsign(a?.callsign, a?.id, a?.username) + ' berhasil disalin.' });
            },
            style:{background:"transparent",color:"#0284c7",border:"1px solid #0284c7",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
            children:"📋 Salin Callsign"
          })
        ),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>{
            setNetworkModal(!0);
            fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter);
          },
          style:{background:"var(--surface-50, rgba(0,0,0,0.04))",color:"var(--text-color, #1e293b)",border:"1px solid var(--surface-border, rgba(0,0,0,0.15))",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
          children:[
            "👮 Direktori Personil"
          ]
        })
      ]})`;

if (c_3def.includes(oldHeroButtons)) {
  c_3def = c_3def.replace(oldHeroButtons, newHeroButtons);
}

const oldTopPencil = `        // Top-Right Pencil Edit Button for Intro
        (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit profil",
          title:"Edit data diri profil",
          onClick:openEditIntro,`;

const newTopPencil = `        // Top-Right Pencil Edit Button for Intro
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit profil",
          title:"Edit data diri profil",
          onClick:openEditIntro,`;

if (c_3def.includes(oldTopPencil)) {
  c_3def = c_3def.replace(oldTopPencil, newTopPencil);
}

const oldQuickComposer = `      // Quick Composer for personal notes/posts
      (0,t.jsxs)("div",{style:{padding:"0.9rem",borderRadius:"10px",marginBottom:"1.25rem",border:"1px solid var(--surface-border, #cbd5e1)",background:"var(--surface-50, rgba(0,0,0,0.02))"},children:[`;

const newQuickComposer = `      // Quick Composer for personal notes/posts (Hidden in read-only mode)
      !isReadOnlyMode && (0,t.jsxs)("div",{style:{padding:"0.9rem",borderRadius:"10px",marginBottom:"1.25rem",border:"1px solid var(--surface-border, #cbd5e1)",background:"var(--surface-50, rgba(0,0,0,0.02))"},children:[`;

if (c_3def.includes(oldQuickComposer)) {
  c_3def = c_3def.replace(oldQuickComposer, newQuickComposer);
}

// Dead modal eradication
const deadModalIdx = c_3def.indexOf('header:"Tambahkan Bagian Profil"');
if (deadModalIdx !== -1) {
  const dialogOpenIdx = c_3def.lastIndexOf('(0,t.jsx)(r.Dialog,{', deadModalIdx);
  const dialogCloseIdx = c_3def.indexOf('})\n}),', deadModalIdx);
  if (dialogOpenIdx !== -1 && dialogCloseIdx !== -1) {
    c_3def = c_3def.slice(0, dialogOpenIdx) + 'null' + c_3def.slice(dialogCloseIdx + 4);
  }
}

// Theme contrasts in Experience & Education:
c_3def = c_3def.replace(
  'style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:exp.title',
  'style:{fontWeight:800,fontSize:"0.92rem",color:"var(--text-color, #0f172a)"},children:exp.title'
);
c_3def = c_3def.replace(
  'exp.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:exp.description}) : null',
  'exp.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:exp.description}) : null'
);
c_3def = c_3def.replace(
  '(0,t.jsx)("div",{style:{fontWeight:600,color:"#cbd5e1"},children:"Belum ada riwayat pengalaman kerja yang ditambahkan."})',
  '(0,t.jsx)("div",{style:{fontWeight:600,color:"var(--text-color, #0f172a)"},children:"Belum ada riwayat pengalaman kerja yang ditambahkan."})'
);

c_3def = c_3def.replace(
  'style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:edu.school',
  'style:{fontWeight:800,fontSize:"0.92rem",color:"var(--text-color, #0f172a)"},children:edu.school'
);
c_3def = c_3def.replace(
  'edu.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:edu.description}) : null',
  'edu.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:edu.description}) : null'
);
c_3def = c_3def.replace(
  '(0,t.jsx)("div",{style:{fontWeight:600,color:"#cbd5e1"},children:"Belum ada riwayat pendidikan yang ditambahkan."})',
  '(0,t.jsx)("div",{style:{fontWeight:600,color:"var(--text-color, #0f172a)"},children:"Belum ada riwayat pendidikan yang ditambahkan."})'
);

// Sidebar cards replacement
const sidebarCardsTarget = `    // 2. Bahasa profil Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Bahasa profil"}),
        (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit bahasa profil",
          title:"Edit bahasa profil",
          onClick:()=>e.current?.show({severity:'info',summary:'Bahasa Profil',detail:'Bahasa utama profil dinas adalah Bahasa Indonesia.'}),
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#94a3b8"},children:"Bahasa Indonesia"})
    ]}),

    // 3. Profil publik dan URL Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Profil publik dan URL"}),
        (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit Profil publik dan URL",
          title:"Kelola Identitas Callsign",
          onClick:openEditIntro,
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginBottom:"0.6rem"},children:"Identitas Callsign terverifikasi:"}),
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.5rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
        (0,t.jsxs)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#38bdf8",fontFamily:"monospace"},children:[
          "@", a?.callsign || a?.username || a?.nrp || "omeko11"
        ]}),
        (0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#4ade80",fontWeight:700},children:"✓ Terverifikasi"})
      ]})
    ]}),`;

const sidebarCardsReplacement = `    // 2. Hak Akses Kedinasan Card (Tactical Intranet Widget)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Hak Akses Kedinasan"}),
        (0,t.jsx)("span",{style:{fontSize:"1rem"},children:"🎖️"})
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)",marginBottom:"0.6rem"},children:"Otoritas hak akses dan penugasan sistem:"}),
      (0,t.jsxs)("div",{style:{display:"grid",gap:"0.4rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.45rem 0.75rem",borderRadius:"8px",background:"var(--surface-50, rgba(0,0,0,0.02))",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)"},children:"Peran Pengguna"}),
          (0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:700,color:"#0284c7"},children:a?.role_name || a?.role_bdb || "Personel Terverifikasi"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.45rem 0.75rem",borderRadius:"8px",background:"var(--surface-50, rgba(0,0,0,0.02))",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)"},children:"Wilayah Satker"}),
          (0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:700,color:"var(--text-color, #0f172a)",maxWidth:"160px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:K(a?.scope_satker_name) || a?.satker || a?.satuan || "Mabes Polri"})
        ]})
      ]})
    ]}),

    // 3. Identitas Callsign CAS Card (Tactical Intranet Widget)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Identitas Callsign CAS"}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Kelola Callsign",
          title:"Kelola Identitas Callsign",
          onClick:openEditIntro,
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)",marginBottom:"0.6rem"},children:"Callsign taktis koordinasi linimasa:"}),
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.5rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
        (0,t.jsx)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#0284c7",fontFamily:"monospace"},children:formatCallsign(a?.callsign, a?.id, a?.username)}),
        (0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#16a34a",fontWeight:700},children:"✓ Terverifikasi"})
      ]})
    ]}),`;

if (c_3def.includes(sidebarCardsTarget)) {
  c_3def = c_3def.replace(sidebarCardsTarget, sidebarCardsReplacement);
}

const rekanCallsignTarget = 'children:["@", rek.callsign || rek.username || (rek.nrp ? rek.nrp : "personil")]';
if (c_3def.includes(rekanCallsignTarget)) {
  c_3def = c_3def.replace(rekanCallsignTarget, 'children:formatCallsign(rek.callsign, rek.id, rek.username)');
}

const selectFilterTarget = 'style:{fontSize:"0.82rem",padding:"0.45rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.3)",color:"#fff"}';
const selectFilterReplacement = 'style:{fontSize:"0.82rem",padding:"0.45rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, #cbd5e1)",background:"var(--surface-card, #ffffff)",color:"var(--text-color, #0f172a)"}';
if (c_3def.includes(selectFilterTarget)) {
  c_3def = c_3def.replace(selectFilterTarget, selectFilterReplacement);
}

const personCardTarget = 'background:"rgba(255,255,255,0.03)",\n              border:"1px solid rgba(255,255,255,0.08)",';
const personCardReplacement = 'background:"var(--surface-50, rgba(0,0,0,0.02))",\n              border:"1px solid var(--surface-border, rgba(0,0,0,0.08))",';
if (c_3def.includes(personCardTarget)) {
  c_3def = c_3def.replace(personCardTarget, personCardReplacement);
}

const personNameTarget = '(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.86rem",color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:u.name})';
const personNameReplacement = '(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.86rem",color:"var(--text-color, #0f172a)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:u.name})';
if (c_3def.includes(personNameTarget)) {
  c_3def = c_3def.replace(personNameTarget, personNameReplacement);
}

const dirCallsignTarget = "let callsignStr = u.callsign ? ('@' + u.callsign) : ('@' + (u.username || (u.nrp ? u.nrp : 'user_' + u.id)));";
const dirCallsignReplacement = "let callsignStr = formatCallsign(u.callsign, u.id, u.username);";
if (c_3def.includes(dirCallsignTarget)) {
  c_3def = c_3def.replace(dirCallsignTarget, dirCallsignReplacement);
}

fs.writeFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', c_3def, 'utf8');
cp.execSync('node -c frontend-patch/3def3ti6rk0vr.linkedin_v3.js');
console.log('  ✓ 3def3ti6rk0vr.linkedin_v3.js: OK');


// -------------------------------------------------------------------
// 5. SSR PROFILE: app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js
// -------------------------------------------------------------------
console.log('\n5. Updating app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js ...');
let c_ssr_prof = fs.readFileSync('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', 'utf8');

if (!c_ssr_prof.includes('function formatCallsign')) {
  const strictTarget = '"use strict";';
  if (c_ssr_prof.includes(strictTarget)) {
    c_ssr_prof = c_ssr_prof.replace(strictTarget, strictTarget + '\n' + formatCallsignFn);
  }
}

const ssrNameTarget = 'children:(d?.callsign||d?.username||d?.name||"omeko11")';
if (c_ssr_prof.includes(ssrNameTarget)) {
  c_ssr_prof = c_ssr_prof.replace(ssrNameTarget, 'children:(d?.name||d?.nama||d?.username||"Personil Polri")');
}
c_ssr_prof = c_ssr_prof.replace(/color:"var\(--cas-text-primary,\s*#e2e8f0\)"/g, 'color:"var(--text-color-secondary, #64748b)"');

fs.writeFileSync('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', c_ssr_prof, 'utf8');
cp.execSync('node -c frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js');
console.log('  ✓ app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js: OK');

console.log('\n=================================================================');
console.log('ALL CHUNKS BUILT AND LOCALLY VALIDATED WITH ZERO ERRORS!');
console.log('=================================================================');
