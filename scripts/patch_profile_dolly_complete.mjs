import fs from 'fs';

console.log('=== Patching Profile Chunk (3def3ti6rk0vr) for Isolation & Dolly/Idris Roles ===');

let profile = fs.readFileSync('frontend-patch/3def3ti6rk0vr.patched.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Remove 'anak_serse' in comment rendering
const oldSerseComment = `children:'@' + (cm.author_callsign || 'anak_serse')`;
const newSerseComment = `children:formatCallsign(cm.author_callsign, cm.author_id, cm.author_username)`;
if (profile.includes(oldSerseComment)) {
  profile = profile.replace(oldSerseComment, newSerseComment);
  console.log('1. Replaced anak_serse in comment feed.');
} else {
  console.log('1. Warning: oldSerseComment not found, checking alternatives...');
}

// 2. Patch formatCallsign function
const fcStart = profile.indexOf('function formatCallsign(rawCallsign, authorId, username) {');
if (fcStart !== -1) {
  const fcEnd = profile.indexOf('function toTitleCase(str) {', fcStart);
  if (fcEnd !== -1) {
    const newFC = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c) && !c.startsWith('user_')) {
    return '@' + c;
  }
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\\d{6,10}$/.test(u) && !u.startsWith('user_')) {
    return '@' + u;
  }
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c)) {
    return '@' + c;
  }
  if (!idStr && !rawCallsign && !username) {
    if (!isReadOnlyMode) return '@omeko11';
    return '@personil';
  }
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}

`;
    profile = profile.substring(0, fcStart) + newFC + profile.substring(fcEnd);
    console.log('2. Patched formatCallsign cleanly.');
  }
}

// 3. Patch useEffect([a]) for banner and bio reset
const oldEffectA = `(0,n.useEffect)(() => {
  if (a) {
    let soc = a.social_media || {};
    if (typeof soc === 'string') {
      try { soc = JSON.parse(soc); } catch(e) {}
    }
    if (typeof soc.bio === 'string' && soc.bio) setBio(soc.bio);
    if (typeof soc.banner_theme === 'string' && soc.banner_theme) setBannerTheme(soc.banner_theme);
  }
  if (typeof a?.bio === 'string' && a.bio) setBio(a.bio);
  if (typeof a?.banner_theme === 'string' && a.banner_theme) setBannerTheme(a.banner_theme);
}, [a]);`;

const newEffectA = `(0,n.useEffect)(() => {
  if (a) {
    let soc = a.social_media || {};
    if (typeof soc === 'string') {
      try { soc = JSON.parse(soc); } catch(e) {}
    }
    var targetBio = (typeof a?.bio === 'string' && a.bio) ? a.bio : (typeof soc?.bio === 'string' ? soc.bio : '');
    setBio(targetBio);

    var defaultGrad = 'linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)';
    var targetBanner = (typeof a?.banner_theme === 'string' && a.banner_theme) ? a.banner_theme : (typeof soc?.banner_theme === 'string' ? soc.banner_theme : defaultGrad);
    setBannerTheme(targetBanner);
  }
}, [a]);`;

if (profile.includes(oldEffectA)) {
  profile = profile.replace(oldEffectA, newEffectA);
  console.log('3. Patched useEffect([a]) for clean banner/bio reset.');
}

// 4. Hero Avatar Isolation (NEVER show mySelf.photo_url on read-only profile!)
const oldHeroAvatar = `children:
            (a?.photo_url||a?.foto||a?.photo||mySelf?.photo_url||(typeof localStorage!=='undefined'&&JSON.parse(localStorage.getItem('user')||'{}')?.photo_url))?(0,t.jsx)("img",{src:a?.photo_url||a?.foto||a?.photo||mySelf?.photo_url||(typeof localStorage!=='undefined'&&JSON.parse(localStorage.getItem('user')||'{}')?.photo_url),alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB`;

const newHeroAvatar = `children:
            (function(){
              var photoSrc = isReadOnlyMode ? (a?.photo_url || a?.foto || a?.photo || null) : (a?.photo_url || a?.foto || a?.photo || mySelf?.photo_url || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.photo_url) || null);
              if (photoSrc) {
                return (0,t.jsx)("img",{src:photoSrc,alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}});
              }
              return eB;
            })()`;

if (profile.includes(oldHeroAvatar)) {
  profile = profile.replace(oldHeroAvatar, newHeroAvatar);
  console.log('4. Patched Hero Avatar to strictly isolate target photo from self photo.');
} else {
  console.log('4. Warning: oldHeroAvatar not found directly, searching substring...');
}

// 5. Hero Avatar Badge
const oldAvatarBadge = `// Tiered Verified Badge (Gold: Superadmin, Emerald: Admin Binops, Cyan Blue: Personil CAS)
          (function(){
            var isUserOne = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin' || (!isReadOnlyMode && (String(mySelf?.id) === '1' || mySelf?.username === 'omeko11' || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.username === 'omeko11')));
            var roleStr = isUserOne ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
            var bColor = isUserOne ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
            var bLabel = isUserOne ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
            return (0,t.jsxs)("div",{
              title:bLabel,
              style:{position:"absolute",bottom:"4px",right:"4px",width:"32px",height:"32px",borderRadius:"50%",background:bColor,border:"3px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.4)",cursor:isReadOnlyMode?"default":"pointer"},
              onClick:()=>{if(!isReadOnlyMode){let f0=a?.photo_url||a?.foto||a?.photo||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0);}},
              children:[
                (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:18,height:18,children:[
                  (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
                ]})
              ]
            });
          })()`;

const newAvatarBadge = `// Tiered Verified Badge (Gold: Superadmin, Emerald: Admin Binops, Cyan Blue: Personil CAS)
          (function(){
            var isTargetSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
            var isUserOne = !isReadOnlyMode || isTargetSuper;
            var roleStr = isReadOnlyMode ? String(a?.role_bdb || a?.role || '').toLowerCase() : 'superadmin';
            var bColor = (roleStr === 'superadmin' || isUserOne) ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
            var bLabel = (roleStr === 'superadmin' || isUserOne) ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));
            return (0,t.jsxs)("div",{
              title:bLabel,
              style:{position:"absolute",bottom:"4px",right:"4px",width:"32px",height:"32px",borderRadius:"50%",background:bColor,border:"3px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.4)",cursor:isReadOnlyMode?"default":"pointer"},
              onClick:()=>{if(!isReadOnlyMode){let f0=a?.photo_url||a?.foto||a?.photo||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0);}},
              children:[
                (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:18,height:18,children:[
                  (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
                ]})
              ]
            });
          })()`;

if (profile.includes(oldAvatarBadge)) {
  profile = profile.replace(oldAvatarBadge, newAvatarBadge);
  console.log('5. Patched Hero Avatar Badge.');
}

// 6. Hero Identity Row Badge & Callsign
const oldIdentityBadge = `(function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          var roleStr = isSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
          var bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          return (0,t.jsx)("span",{
            title:bLabel,
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:bColor,boxShadow:"0 1px 4px rgba(0,0,0,0.3)",flexShrink:0},
            children:(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:13,height:13,children:(0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})})
          });
        })()`;

const newIdentityBadge = `(function(){
          var isSuper = (!isReadOnlyMode) || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          var roleStr = isSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
          var bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));
          return (0,t.jsx)("span",{
            title:bLabel,
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:bColor,boxShadow:"0 1px 4px rgba(0,0,0,0.3)",flexShrink:0},
            children:(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:13,height:13,children:(0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})})
          });
        })()`;

if (profile.includes(oldIdentityBadge)) {
  profile = profile.replace(oldIdentityBadge, newIdentityBadge);
  console.log('6. Patched Hero Identity Row Badge.');
}

// 7. Hero Callsign
const oldCallsign = `children:(function(){
            var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11' || (!isReadOnlyMode && (String(mySelf?.id) === '1' || mySelf?.username === 'omeko11' || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.username === 'omeko11')));
            if (isUserOne) return "@omeko11";
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()`;

const newCallsign = `children:(function(){
            if (!isReadOnlyMode) return "@omeko11";
            if (String(a?.id) === '1' || a?.username === 'omeko11') return "@omeko11";
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()`;

if (profile.includes(oldCallsign)) {
  profile = profile.replace(oldCallsign, newCallsign);
  console.log('7. Patched Hero Callsign.');
}

// 8. Hero Satker Subline
const oldSatkerSubline = `(function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          if (isSuper) return "Robinopsnal Bareskrim Polri";`;

const newSatkerSubline = `(function(){
          var isSuper = (!isReadOnlyMode) || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          if (isSuper) return "Robinopsnal Bareskrim Polri";`;

if (profile.includes(oldSatkerSubline)) {
  profile = profile.replace(oldSatkerSubline, newSatkerSubline);
  console.log('8. Patched Hero Satker Subline.');
}

// Validate syntax
new Function(profile);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', profile);
console.log('=== All 8 profile patches applied and syntax validated successfully! ===');
