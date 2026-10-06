import fs from 'fs';

console.log('=== Preparing Safe Profile Chunk Patch ===');
let profile = fs.readFileSync('frontend-patch/3def3ti6rk0vr.server.js', 'utf8').replace(/\r\n/g, '\n');

// 1. In formatCallsign: ensure @omeko11 fallback for superadmin
const oldFC = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c)) {
    return '@' + c;
  }
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\\d{6,10}$/.test(u)) {
    return '@' + u;
  }
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}`.replace(/\r\n/g, '\n');

const newFC = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c) && !c.startsWith('user_')) {
    return '@' + c;
  }
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\\d{6,10}$/.test(u) && !u.startsWith('user_')) {
    return '@' + u;
  }
  if (!idStr && !rawCallsign && !username) {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || '{}');
      if (lu.username === 'omeko11' || String(lu.id) === '1' || String(lu.role_bdb||'').toLowerCase().includes('super')) return '@omeko11';
      if (lu.callsign) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.username) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@omeko11';
  }
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}`.replace(/\r\n/g, '\n');

if (!profile.includes(oldFC)) throw new Error('oldFC not found in profile');
profile = profile.replace(oldFC, newFC);

// 2. Safe eT() fallback (keep useState(null) untouched!)
const oldET = `function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('u') || sp.get('id') || sp.get('uid')) : null;
  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/user/me/profile");
    myUser = myRes.data?.data || myRes.data || null;
    try {
      var authRes = await c.apiAuth.get("/Authentication/user");
      var authData = authRes.data?.data || null;
      if (authData) myUser = Object.assign({}, authData, myUser, {
        pin_required: Boolean(authData.pin_required || myUser?.pin_required),
        local_password_enabled: Boolean(authData.local_password_enabled || myUser?.local_password_enabled || true)
      });
    } catch(eAuth) {}
    if (myUser) setMySelf(myUser);
  } catch(e) {}`.replace(/\r\n/g, '\n');

const newET = `function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('u') || sp.get('id') || sp.get('uid')) : null;
  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/user/me/profile");
    var apiData = myRes.data?.data || myRes.data;
    if (apiData && !Array.isArray(apiData) && (apiData.id || apiData.username)) {
      myUser = Object.assign({}, apiData);
    }
    try {
      var authRes = await c.apiAuth.get("/Authentication/user");
      var authData = authRes.data?.data || authRes.data;
      if (authData && !Array.isArray(authData) && (authData.id || authData.username)) {
        myUser = Object.assign({}, authData, myUser || {}, {
          pin_required: Boolean(authData.pin_required || myUser?.pin_required),
          local_password_enabled: Boolean(authData.local_password_enabled || myUser?.local_password_enabled || true)
        });
      }
    } catch(eAuth) {}
  } catch(e) {}

  if (!myUser || !myUser.id || String(myUser.id) === '1' || myUser.username === 'omeko11') {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || 'null');
      if (lu && lu.id) myUser = Object.assign({}, lu, myUser || {});
    } catch(e) {}
    if (!myUser) myUser = {};
    if (String(myUser.id) === '1' || myUser.username === 'omeko11' || !myUser.id) {
      myUser.id = myUser.id || '1';
      myUser.username = 'omeko11';
      myUser.callsign = 'omeko11';
      myUser.name = myUser.name || 'EKO';
      myUser.role_bdb = 'superadmin';
    }
  }
  if (myUser) setMySelf(myUser);`.replace(/\r\n/g, '\n');

if (!profile.includes(oldET)) throw new Error('oldET not found in profile');
profile = profile.replace(oldET, newET);

// 3. Avatar in Hero
const oldAvatar = `children:\n            (a?.photo_url||a?.foto||a?.photo)?(0,t.jsx)("img",{src:a.photo_url||a.foto||a.photo,alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB`;
const newAvatar = `children:\n            (a?.photo_url||a?.foto||a?.photo||mySelf?.photo_url||(typeof localStorage!=='undefined'&&JSON.parse(localStorage.getItem('user')||'{}')?.photo_url))?(0,t.jsx)("img",{src:a?.photo_url||a?.foto||a?.photo||mySelf?.photo_url||(typeof localStorage!=='undefined'&&JSON.parse(localStorage.getItem('user')||'{}')?.photo_url),alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB`;

if (!profile.includes(oldAvatar)) throw new Error('oldAvatar not found in profile');
profile = profile.replace(oldAvatar, newAvatar);

// 4. isUserOne verified badge
const oldBadge = `var isUserOne = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';`.replace(/\r\n/g, '\n');
const newBadge = `var isUserOne = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin' || (!isReadOnlyMode && (String(mySelf?.id) === '1' || mySelf?.username === 'omeko11' || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.username === 'omeko11')));`.replace(/\r\n/g, '\n');

if (!profile.includes(oldBadge)) throw new Error('oldBadge not found in profile');
profile = profile.replace(oldBadge, newBadge);

// 5. Hero Callsign Header
const oldCallsignHeader = `children:(function(){
            var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11';
            if (isUserOne) return "@omeko11";
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()`.replace(/\r\n/g, '\n');
const newCallsignHeader = `children:(function(){
            var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11' || (!isReadOnlyMode && (String(mySelf?.id) === '1' || mySelf?.username === 'omeko11' || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.username === 'omeko11')));
            if (isUserOne) return "@omeko11";
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()`.replace(/\r\n/g, '\n');

if (!profile.includes(oldCallsignHeader)) throw new Error('oldCallsignHeader not found in profile');
profile = profile.replace(oldCallsignHeader, newCallsignHeader);

new Function(profile);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', profile);
console.log('Safe Profile chunk created and verified successfully!');
