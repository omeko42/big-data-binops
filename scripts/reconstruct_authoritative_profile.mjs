import cp from 'child_process';
import fs from 'fs';

console.log('=== RECONSTRUCTING CAS AUTHORITATIVE POLICE PROFILE ===');

// 1. Load pristine code from commit 5a60b99
let code = cp.execSync('git show 5a60b99:3def3ti6rk0vr.patched.js').toString();
console.log('Loaded base code from commit 5a60b99, length:', code.length);

// 2. Define formatCallsign & formatCount at module 34850
const formatFn = `
function formatCallsign(rawCallsign, authorId, username) {
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
}

if (typeof globalThis !== 'undefined') {
  globalThis.formatCallsign = formatCallsign;
  globalThis.formatCount = formatCount;
}
`;

// Insert formatCallsign & formatCount in module 34850 right after maskPhone
const maskPhoneTarget = 'function maskPhone(e){return!e||"string"!=typeof e||e.length<8?e:e.slice(0,4)+"****"+e.slice(-3)}';
if (!code.includes(maskPhoneTarget)) throw new Error('maskPhoneTarget not found');
code = code.replace(maskPhoneTarget, maskPhoneTarget + '\n' + formatFn);
console.log('✓ Added formatCallsign & formatCount to module 34850');

// 3. Add isReadOnlyMode state
const stateTarget = '[a,y]=(0,n.useState)(null),';
const stateRep = '[a,y]=(0,n.useState)(null),[isReadOnlyMode,setIsReadOnlyMode]=(0,n.useState)(!1),';
if (!code.includes(stateTarget)) throw new Error('stateTarget not found');
code = code.replace(stateTarget, stateRep);
console.log('✓ Added isReadOnlyMode state');

// 4. Update eT() to support encrypted ?u= token from linimasa / feed
const oldEt = 'async function eT(){let e=await c.apiAuth.get("/Authentication/user");return y(e.data?.data||null),e.data?.data}';
const newEt = `async function eT(){
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

if (!code.includes(oldEt)) throw new Error('oldEt not found');
code = code.replace(oldEt, newEt);
console.log('✓ Updated eT() with encrypted query param handler');

// 5. Add Top Tactical Banner above profile card
const bannerTarget = '(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem"},children:';
const bannerRep = `isReadOnlyMode && (0,t.jsxs)("div",{
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
    }),\n    (0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem"},children:`;

if (!code.includes(bannerTarget)) throw new Error('bannerTarget not found');
code = code.replace(bannerTarget, bannerRep);
console.log('✓ Added Top Tactical Banner');

// 6. Update Hero with Callsign badge & hide avatar edit pencil if isReadOnlyMode
const oldAvatarClick = `onClick:()=>{let f0=a.photo_url||a.foto||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0)},title:"Klik untuk melihat atau mengganti foto profil"`;
const newAvatarClick = `onClick:()=>{if(isReadOnlyMode)return;let f0=a.photo_url||a.foto||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0)},title:isReadOnlyMode?"Foto Profil Resmi":"Klik untuk melihat atau mengganti foto profil"`;
if (code.includes(oldAvatarClick)) {
  code = code.replace(oldAvatarClick, newAvatarClick);
}

const oldPencilAvatar = `,(0,t.jsx)("div",{style:{position:"absolute",bottom:"-2px",right:"-2px",width:"1.55rem",height:"1.55rem",borderRadius:"999px",background:"#2563eb",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 2px 5px rgba(0,0,0,0.25)"},children:(0,t.jsx)(I.Pencil,{size:11})})`;
const newPencilAvatar = `,!isReadOnlyMode && (0,t.jsx)("div",{style:{position:"absolute",bottom:"-2px",right:"-2px",width:"1.55rem",height:"1.55rem",borderRadius:"999px",background:"#2563eb",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 2px 5px rgba(0,0,0,0.25)"},children:(0,t.jsx)(I.Pencil,{size:11})})`;
if (code.includes(oldPencilAvatar)) {
  code = code.replace(oldPencilAvatar, newPencilAvatar);
  console.log('✓ Avatar edit pencil conditioned on !isReadOnlyMode');
}

// Add Callsign pill next to Name in Hero
const oldHeroName = '(0,t.jsx)("div",{style:{fontSize:"1.35rem",fontWeight:800,color:"#fff",lineHeight:1.2,wordBreak:"break-word"},children:a.name||"-"})';
const newHeroName = `(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap"},children:[
                (0,t.jsx)("div",{style:{fontSize:"1.35rem",fontWeight:800,color:"#fff",lineHeight:1.2,wordBreak:"break-word"},children:a.name||"-"}),
                (0,t.jsx)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#38bdf8",background:"rgba(56,189,248,0.18)",border:"1px solid rgba(56,189,248,0.35)",padding:"0.15rem 0.65rem",borderRadius:"999px",fontFamily:"monospace"},children:formatCallsign(a?.callsign, a?.id, a?.username)})
              ]})`;
if (code.includes(oldHeroName)) {
  code = code.replace(oldHeroName, newHeroName);
  console.log('✓ Added Callsign pill next to Name in Hero');
}

// 7. Data Personil Card: Edit button vs Read-Only Callsign Copy Button
const oldDataPersonilBtn = `(0,t.jsx)("div",{className:"cms-card-label",children:"Data Personil"}),(0,t.jsxs)(o.Button,{onClick:function(){`;
const newDataPersonilBtn = `(0,t.jsx)("div",{className:"cms-card-label",children:"Data Personil"}),!isReadOnlyMode ? (0,t.jsxs)(o.Button,{onClick:function(){`;

if (code.includes(oldDataPersonilBtn)) {
  const btnCloseTarget = 'children:["Edit"]})';
  const btnCloseIdx = code.indexOf(btnCloseTarget, code.indexOf(oldDataPersonilBtn));
  if (btnCloseIdx !== -1) {
    const afterBtn = btnCloseIdx + btnCloseTarget.length;
    code = code.substring(0, code.indexOf(oldDataPersonilBtn)) +
      newDataPersonilBtn +
      code.substring(code.indexOf(oldDataPersonilBtn) + oldDataPersonilBtn.length, btnCloseIdx) +
      `children:["Edit"]}) : (
        (0,t.jsx)("button",{
          type:"button",
          onClick:() => {
            navigator.clipboard?.writeText(formatCallsign(a?.callsign, a?.id, a?.username));
            e.current?.show({ severity: 'success', summary: 'Callsign Disalin', detail: 'Callsign ' + formatCallsign(a?.callsign, a?.id, a?.username) + ' berhasil disalin.' });
          },
          style:{background:"rgba(56,189,248,0.12)",color:"#0284c7",border:"1px solid rgba(56,189,248,0.25)",borderRadius:"999px",padding:"0.25rem 0.75rem",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
          children:["📋 Salin Callsign"]
        })
      )` +
      code.substring(afterBtn);
    console.log('✓ Data Personil Card Edit Button conditioned with Read-Only copy button');
  }
}

// 8. Keamanan Akun Card: Show full interactive 2FA card for owner; show Otoritas Akses Kedinasan card for isReadOnlyMode!
const secCardStart = '(0,t.jsxs)("div",{className:"cms-card",children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.9rem"},children:[(0,t.jsx)("div",{className:"cms-card-label",children:"Keamanan Akun"})';
const secCardEndStr = 'Siap Didaftarkan"})]})})]}),';

if (code.includes(secCardStart)) {
  const secIdx = code.indexOf(secCardStart);
  const secEndIdx = code.indexOf(secCardEndStr, secIdx) + secCardEndStr.length;
  if (secIdx !== -1 && secEndIdx !== -1) {
    const ownerSecCard = code.substring(secIdx, secEndIdx).trim().replace(/,\s*$/, '');
    const readOnlySecCard = `!isReadOnlyMode ? (
      ${ownerSecCard}
    ) : (
      (0,t.jsxs)("div",{className:"cms-card",children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.9rem"},children:[
          (0,t.jsx)("div",{className:"cms-card-label",children:"Otoritas Akses Kedinasan"}),
          (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"#0284c7",background:"rgba(56,189,248,0.12)",padding:"0.2rem 0.6rem",borderRadius:"999px"},children:"🔒 Mode Terenkripsi"})
        ]}),
        (0,t.jsx)(W,{icon:(0,t.jsx)(O.ShieldCheck,{size:15}),label:"Hak Akses Sistem",value:H[eH]||eH}),
        (0,t.jsx)(W,{icon:(0,t.jsx)(k.MapPin,{size:15}),label:"Wilayah Penugasan",value:K(a.scope_satker_name)||K(a.scope_access_display)||"Mabes Polri"}),
        (0,t.jsx)(W,{icon:(0,t.jsx)(C,{size:15}),label:"Identitas Callsign",value:formatCallsign(a.callsign, a.id, a.username)}),
        (0,t.jsx)(W,{icon:(0,t.jsx)(x.Mail,{size:15}),label:"Email Dinas Polri",value:maskEmail(a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:""))||"Terverifikasi",last:!0})
      ]})
    ),`;
    code = code.substring(0, secIdx) + readOnlySecCard + code.substring(secEndIdx);
    console.log('✓ Keamanan Akun Card preserved 100% for owner, protected with Otoritas Akses Kedinasan for read-only view');
  }
}

// 9. Data Wilayah Satker: Condition edit button on !isReadOnlyMode
const satkerEditTarget = `(0,t.jsxs)(o.Button,{onClick:function(){`;
const satkerLabelIdx = code.indexOf('children:"Data Wilayah Satker"');
if (satkerLabelIdx !== -1) {
  const satkerBtnIdx = code.indexOf(satkerEditTarget, satkerLabelIdx);
  if (satkerBtnIdx !== -1) {
    code = code.substring(0, satkerBtnIdx) + '!isReadOnlyMode && ' + code.substring(satkerBtnIdx);
    console.log('✓ Data Wilayah Satker Edit button conditioned on !isReadOnlyMode');
  }
}

// Write to frontend-patch/3def3ti6rk0vr.linkedin_v3.js (which is the deployed target chunk)
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', code, 'utf8');
cp.execSync('node -c frontend-patch/3def3ti6rk0vr.linkedin_v3.js');
console.log('✓ frontend-patch/3def3ti6rk0vr.linkedin_v3.js compiled with 0 syntax errors!');

// Write also to frontend-patch/3def3ti6rk0vr.fixed.js as backup
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.fixed.js', code, 'utf8');
console.log('✓ Backup saved to frontend-patch/3def3ti6rk0vr.fixed.js');
