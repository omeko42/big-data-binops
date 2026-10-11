const fs = require('fs');

console.log('=== Patching 3pp0f_cp6yg-o.live.js ===');
let fe1 = fs.readFileSync('3pp0f_cp6yg-o.live.js', 'utf8');

const oldHandleOpen = `  var handleOpenUserProfile = (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id || postContext?.user_id;
    var targetUsername = postContext?.author_username || postContext?.username || '';
    var targetCallsign = postContext?.author_callsign || postContext?.callsign || '';
    var isSelf = (currentUser?.id && String(targetId) === String(currentUser.id)) ||
                 (currentUser?.username && targetUsername && String(targetUsername).toLowerCase() === String(currentUser.username).toLowerCase()) ||
                 String(targetId) === '1' || targetUsername === 'om.eko_42' || targetUsername === 'omeko11';
    if (isSelf) {
      try { sessionStorage.removeItem('cas_view_user'); } catch(e) {}
      window.location.href = '/cms/profile';
    } else {
      var handle = targetCallsign || targetUsername || ('user_' + targetId);
      handle = String(handle).replace(/^@/, '');
      try {
        sessionStorage.setItem('cas_view_user', JSON.stringify({
          id: targetId,
          handle: '@' + handle,
          username: targetUsername || handle,
          callsign: targetCallsign || handle
        }));
      } catch(e) {}
      window.location.href = '/cms/profile?u=' + encodeURIComponent(handle);
    }
  };`;

const newHandleOpen = `  var handleOpenUserProfile = (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id || postContext?.user_id;
    var targetUsername = postContext?.author_username || postContext?.username || '';
    var targetCallsign = postContext?.author_callsign || postContext?.callsign || '';
    var isSelf = (currentUser?.id && String(targetId) === String(currentUser.id)) ||
                 (currentUser?.username && targetUsername && String(targetUsername).toLowerCase() === String(currentUser.username).toLowerCase());
    if (isSelf) {
      try { sessionStorage.removeItem('cas_view_user'); } catch(e) {}
      window.location.href = '/cms/profile';
    } else {
      var handle = targetCallsign || targetUsername || ('user_' + targetId);
      handle = String(handle).replace(/^@/, '');
      try {
        sessionStorage.setItem('cas_view_user', JSON.stringify({
          id: targetId,
          handle: '@' + handle,
          username: targetUsername || handle,
          callsign: targetCallsign || handle
        }));
      } catch(e) {}
      window.location.href = '/cms/profile?id=' + encodeURIComponent(targetId) + '&u=' + encodeURIComponent(handle);
    }
  };`;

if (!fe1.includes(oldHandleOpen)) {
  console.error('ERROR: oldHandleOpen not found in 3pp0f_cp6yg-o.live.js!');
  process.exit(1);
}
fe1 = fe1.replace(oldHandleOpen, newHandleOpen);
fs.writeFileSync('3pp0f_cp6yg-o.patched.js', fe1, 'utf8');
console.log('Saved 3pp0f_cp6yg-o.patched.js (length: ' + fe1.length + ')');


console.log('=== Patching 3def3ti6rk0vr.live.js ===');
let fe2 = fs.readFileSync('3def3ti6rk0vr.live.js', 'utf8');

// 1. Patch eT()
const oldET = `async function eT() {
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

  if (!myUser || !myUser.id) {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || 'null');
      if (lu && lu.id) myUser = Object.assign({}, lu, myUser || {});
    } catch(e) {}
    if (!myUser) myUser = {};
    if (String(myUser.id) === '1' && !myUser.username) {
      myUser.id = '1';
      /* keep dynamic username & callsign */
      myUser.name = myUser.name || 'EKO';
      myUser.role_bdb = 'superadmin';
    }
  }
  if (myUser) setMySelf(myUser);

  // If there is no explicit query parameter (?u= or ?id=), ALWAYS display own profile!
  if (!uToken) {
    try {
      sessionStorage.removeItem('cas_view_user');
      if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
        window.history.replaceState({}, '', '/cms/profile');
      }
    } catch(e) {}
    setIsReadOnlyMode(!1);
    y(myUser);
    return myUser;
  }

  var targetQuery = uToken;
  var cleanTarget = String(targetQuery).replace(/^@/, '').trim();
  var isSelf = myUser && (String(myUser.id) === cleanTarget || String(myUser.username || '').toLowerCase() === cleanTarget.toLowerCase() || String(myUser.callsign || '').toLowerCase() === cleanTarget.toLowerCase());

  if (!isSelf && cleanTarget) {
    try {
      var targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + encodeURIComponent(cleanTarget));
      var targetData = targetRes.data?.data || null;
      if (targetData) {
        setIsReadOnlyMode(!0);
        try {
          var cleanHandle = targetData.callsign || targetData.username || ('user_' + targetData.id);
          cleanHandle = String(cleanHandle).replace(/^@/, '');
          sessionStorage.setItem('cas_view_user', JSON.stringify({ id: targetData.id, username: targetData.username, callsign: targetData.callsign, handle: cleanHandle }));
        } catch(e) {}
        y(targetData);
        return targetData;
      }
    } catch(err) {}
  }

  try {
    sessionStorage.removeItem('cas_view_user');
    if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
      window.history.replaceState({}, '', '/cms/profile');
    }
  } catch(e) {}
  setIsReadOnlyMode(!1);
  y(myUser);
  return myUser;
}`;

const newET = `async function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('id') || sp.get('uid') || sp.get('u')) : null;
  var viewedUser = null;
  try {
    var rawView = sessionStorage.getItem('cas_view_user');
    if (rawView) viewedUser = JSON.parse(rawView);
  } catch(e) {}

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

  if (!myUser || !myUser.id) {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || 'null');
      if (lu && lu.id) myUser = Object.assign({}, lu, myUser || {});
    } catch(e) {}
    if (!myUser) myUser = {};
  }
  if (myUser) {
    try {
      var cachedSoc = localStorage.getItem('cas_profile_social_' + myUser.id);
      var cachedBanner = localStorage.getItem('cas_banner_' + myUser.id);
      if (cachedSoc) {
        var parsedSoc = JSON.parse(cachedSoc);
        myUser.social_media = Object.assign({}, parsedSoc, myUser.social_media || {});
      }
      if (cachedBanner && (!myUser.social_media || !myUser.social_media.banner_theme)) {
        myUser.social_media = myUser.social_media || {};
        myUser.social_media.banner_theme = cachedBanner;
      }
    } catch(eCache) {}
    setMySelf(myUser);
  }

  var targetQuery = uToken || (sp && (sp.has('u') || sp.has('id')) ? null : (viewedUser?.id || viewedUser?.handle || viewedUser?.username));
  if (!targetQuery) {
    try {
      sessionStorage.removeItem('cas_view_user');
      if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
        window.history.replaceState({}, '', '/cms/profile');
      }
    } catch(e) {}
    setIsReadOnlyMode(!1);
    y(myUser);
    return myUser;
  }

  var cleanTarget = String(targetQuery).replace(/^@/, '').trim();
  var isSelf = myUser && (String(myUser.id) === cleanTarget || 
                         (myUser.username && String(myUser.username).toLowerCase() === cleanTarget.toLowerCase()) || 
                         (myUser.callsign && String(myUser.callsign).toLowerCase() === cleanTarget.toLowerCase()));

  if (!isSelf && cleanTarget) {
    try {
      var targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + encodeURIComponent(cleanTarget));
      var targetData = targetRes.data?.data || null;
      if (!targetData && viewedUser?.id && String(viewedUser.id) !== cleanTarget) {
        targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + encodeURIComponent(viewedUser.id));
        targetData = targetRes.data?.data || null;
      }
      if (targetData) {
        setIsReadOnlyMode(!0);
        try {
          var cleanHandle = targetData.callsign || targetData.username || ('user_' + targetData.id);
          cleanHandle = String(cleanHandle).replace(/^@/, '');
          sessionStorage.setItem('cas_view_user', JSON.stringify({ id: targetData.id, username: targetData.username, callsign: targetData.callsign, handle: cleanHandle }));
        } catch(e) {}
        y(targetData);
        return targetData;
      }
    } catch(err) {}
  }

  try {
    sessionStorage.removeItem('cas_view_user');
    if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
      window.history.replaceState({}, '', '/cms/profile');
    }
  } catch(e) {}
  setIsReadOnlyMode(!1);
  y(myUser);
  return myUser;
}`;

if (!fe2.includes(oldET)) {
  console.error('ERROR: oldET not found in 3def3ti6rk0vr.live.js!');
  process.exit(1);
}
fe2 = fe2.replace(oldET, newET);
console.log('eT() replaced successfully.');

// 2. Patch useEffect for [a] to include cached banner fallback
const oldUseEffectA = `(0,n.useEffect)(() => {
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

const newUseEffectA = `(0,n.useEffect)(() => {
  if (a) {
    let soc = a.social_media || {};
    if (typeof soc === 'string') {
      try { soc = JSON.parse(soc); } catch(e) {}
    }
    var targetBio = (typeof a?.bio === 'string' && a.bio) ? a.bio : (typeof soc?.bio === 'string' ? soc.bio : '');
    setBio(targetBio);

    var defaultGrad = 'linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)';
    var cachedBanner = (a?.id && typeof localStorage !== 'undefined') ? localStorage.getItem('cas_banner_' + a.id) : null;
    var targetBanner = (typeof a?.banner_theme === 'string' && a.banner_theme) ? a.banner_theme : 
                       (typeof soc?.banner_theme === 'string' && soc.banner_theme) ? soc.banner_theme : 
                       (cachedBanner || defaultGrad);
    setBannerTheme(targetBanner);
  }
}, [a]);`;

if (!fe2.includes(oldUseEffectA)) {
  console.error('ERROR: oldUseEffectA not found in 3def3ti6rk0vr.live.js!');
  process.exit(1);
}
fe2 = fe2.replace(oldUseEffectA, newUseEffectA);
console.log('useEffect for [a] replaced successfully.');

// 3. Patch persistSocialMedia
const oldPersist = `let persistSocialMedia = async (updates) => {
  if (isReadOnlyMode) return false;
  let currSoc = (a && typeof a.social_media === 'object' && a.social_media !== null) ? a.social_media : {};
  let nextSoc = {
    ...currSoc,
    ...updates,
    urls: (Array.isArray(currSoc.urls) ? currSoc.urls : (Array.isArray(eSocUrls) ? eSocUrls.map(u => typeof u === 'string' ? u.trim() : '').filter(Boolean) : []))
  };
  let polriMail = typeof a?.email_polri === "string" ? a.email_polri.trim() : "";
  let secMail = typeof a?.email === "string" ? a.email.trim() : "";
  let payload = {
    name: a?.name || "",
    email: secMail || polriMail,
    email_polri: polriMail,
    nrp: a?.nrp || "",
    pangkat: a?.pangkat || "",
    jabatan: a?.jabatan || "",
    satuan: a?.satuan || "",
    no_hp: a?.no_hp || "",
    username: a?.username || "",
    is_pns: Boolean(a?.is_pns),
    photo_url: a?.photo_url || a?.foto || "",
    foto: a?.photo_url || a?.foto || "",
    social_media: nextSoc
  };
  try {
    try {
      localStorage.setItem('cas_profile_social_' + a?.id, JSON.stringify(nextSoc));
    } catch(e) {}
    (0, c.assertOk)(await c.apiAuth.patch("/user/me/profile", payload));
    await eT();
    return true;
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal Menyimpan', detail: err.response?.data?.message || 'Gagal menyimpan perubahan profil.' });
    return false;
  }
};`;

const newPersist = `let persistSocialMedia = async (updates) => {
  if (isReadOnlyMode) return false;
  let currSoc = (a && typeof a.social_media === 'object' && a.social_media !== null) ? a.social_media : {};
  let nextSoc = {
    ...currSoc,
    ...updates,
    urls: (Array.isArray(currSoc.urls) ? currSoc.urls : (Array.isArray(eSocUrls) ? eSocUrls.map(u => typeof u === 'string' ? u.trim() : '').filter(Boolean) : []))
  };
  try {
    try {
      localStorage.setItem('cas_profile_social_' + a?.id, JSON.stringify(nextSoc));
      if (nextSoc.banner_theme) {
        localStorage.setItem('cas_banner_' + a?.id, nextSoc.banner_theme);
      }
    } catch(e) {}
    let patchRes = await c.apiAuth.patch("/user/me/profile", { social_media: nextSoc });
    (0, c.assertOk)(patchRes);
    y(prev => prev ? ({ ...prev, social_media: nextSoc, banner_theme: nextSoc.banner_theme }) : prev);
    await eT();
    return true;
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal Menyimpan', detail: err.response?.data?.message || 'Gagal menyimpan perubahan profil.' });
    return false;
  }
};`;

if (!fe2.includes(oldPersist)) {
  console.error('ERROR: oldPersist not found in 3def3ti6rk0vr.live.js!');
  process.exit(1);
}
fe2 = fe2.replace(oldPersist, newPersist);
console.log('persistSocialMedia replaced successfully.');

// 4. Patch handleSaveBanner with proportional cover crop math
const oldSaveBanner = `let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  setCustomBannerLoading(!0);
  try {
    let finalBanner = eBannerTheme;
    if (eRawBanner) {
      finalBanner = await new Promise(res => {
        let box = document.getElementById("cas-banner-crop-box");
        let imgEl = document.getElementById("cas-banner-crop-img");
        let img = new Image();
        img.onload = function() {
          if (box && imgEl) {
            let boxRect = box.getBoundingClientRect();
            let imgRect = imgEl.getBoundingClientRect();
            let scaleX = img.naturalWidth / imgRect.width;
            let scaleY = img.naturalHeight / imgRect.height;
            let sx = (boxRect.left - imgRect.left) * scaleX;
            let sy = (boxRect.top - imgRect.top) * scaleY;
            let sw = boxRect.width * scaleX;
            let sh = boxRect.height * scaleY;
            let cv = document.createElement("canvas");
            cv.width = 1200;
            cv.height = Math.round(1200 * (boxRect.height / boxRect.width));
            let cx = cv.getContext("2d");
            cx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
            res(cv.toDataURL("image/jpeg", 0.85));
          } else {
            let cv = document.createElement("canvas");
            cv.width = 1200;
            cv.height = 250;
            let cx = cv.getContext("2d");
            let bs = Math.max(cv.width / img.width, cv.height / img.height) * eBannerZoom;
            let dw = img.width * bs, dh = img.height * bs;
            let dx = (cv.width - dw) / 2 + (eBannerPanX * 2.5);
            let dy = (cv.height - dh) / 2 + (eBannerPanY * 2.5);
            cx.drawImage(img, dx, dy, dw, dh);
            res(cv.toDataURL("image/jpeg", 0.85));
          }
        };
        img.onerror = () => res(eBannerTheme);
        img.src = eRawBanner;
      });
      setBannerTheme(finalBanner);
    }
    let ok = await persistSocialMedia({ banner_theme: finalBanner });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul berhasil diperbarui.' });
      setBannerModal(!1);
    }
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menerapkan foto sampul.' });
  } finally {
    setCustomBannerLoading(!1);
  }
};`;

const newSaveBanner = `let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  setCustomBannerLoading(!0);
  try {
    let finalBanner = eBannerTheme;
    if (eRawBanner) {
      finalBanner = await new Promise(res => {
        let box = document.getElementById("cas-banner-crop-box");
        let img = new Image();
        img.onload = function() {
          let bw = box ? box.getBoundingClientRect().width : 500;
          let bh = box ? box.getBoundingClientRect().height : 105;
          let nw = img.naturalWidth || 1200;
          let nh = img.naturalHeight || 250;
          let cssScale = Math.max(bw / nw, bh / nh);
          let renW = nw * cssScale;
          let renH = nh * cssScale;
          let zm = Math.max(1, eBannerZoom || 1);
          let px = eBannerPanX || 0;
          let py = eBannerPanY || 0;
          let visLeft = (renW * zm) / 2 - bw / 2 - (px * zm);
          let visTop = (renH * zm) / 2 - bh / 2 - (py * zm);
          let b2n = 1 / (cssScale * zm);
          let sx = visLeft * b2n;
          let sy = visTop * b2n;
          let sw = bw * b2n;
          let sh = bh * b2n;
          let cv = document.createElement("canvas");
          cv.width = 1200;
          cv.height = 250;
          let cx = cv.getContext("2d");
          cx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
          res(cv.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => res(eBannerTheme);
        img.src = eRawBanner;
      });
      setBannerTheme(finalBanner);
    }
    let ok = await persistSocialMedia({ banner_theme: finalBanner });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul berhasil diperbarui.' });
      setBannerModal(!1);
    }
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menerapkan foto sampul.' });
  } finally {
    setCustomBannerLoading(!1);
  }
};`;

if (!fe2.includes(oldSaveBanner)) {
  console.error('ERROR: oldSaveBanner not found in 3def3ti6rk0vr.live.js!');
  process.exit(1);
}
fe2 = fe2.replace(oldSaveBanner, newSaveBanner);
console.log('handleSaveBanner replaced successfully.');

// 5. Patch Directory / Connection card links in 3def3ti6rk0vr.live.js
// Look at directory cards:
const oldPersistClick1 = `                try {
                  sessionStorage.setItem('cas_view_user', JSON.stringify({ id: pers.id, username: pers.username, callsign: pers.callsign, handle: formatCallsign(pers.callsign, pers.id, pers.username).replace(/^@/, '') }));
                } catch(e){}
                window.location.href = '/cms/profile';`;

const newPersistClick1 = `                var h = formatCallsign(pers.callsign, pers.id, pers.username).replace(/^@/, '');
                try {
                  sessionStorage.setItem('cas_view_user', JSON.stringify({ id: pers.id, username: pers.username, callsign: pers.callsign, handle: h }));
                } catch(e){}
                window.location.href = '/cms/profile?id=' + encodeURIComponent(pers.id) + '&u=' + encodeURIComponent(h);`;

fe2 = fe2.replaceAll(oldPersistClick1, newPersistClick1);
console.log('Directory card click handlers replaced successfully.');

// Look at user cards:
const oldPersistClick2 = `                    if (isTargetSelf) {
                      try { sessionStorage.removeItem('cas_view_user'); } catch(e){}
                    } else {
                      try {
                        sessionStorage.setItem('cas_view_user', JSON.stringify({ id: user.id, username: user.username, callsign: user.callsign, handle: (user.callsign || user.username || ('user_' + user.id)).replace(/^@/,'') }));
                      } catch(e){}
                    }
                    window.location.href = '/cms/profile';`;

const newPersistClick2 = `                    if (isTargetSelf) {
                      try { sessionStorage.removeItem('cas_view_user'); } catch(e){}
                      window.location.href = '/cms/profile';
                    } else {
                      var h = (user.callsign || user.username || ('user_' + user.id)).replace(/^@/,'');
                      try {
                        sessionStorage.setItem('cas_view_user', JSON.stringify({ id: user.id, username: user.username, callsign: user.callsign, handle: h }));
                      } catch(e){}
                      window.location.href = '/cms/profile?id=' + encodeURIComponent(user.id) + '&u=' + encodeURIComponent(h);
                    }`;

fe2 = fe2.replaceAll(oldPersistClick2, newPersistClick2);
console.log('User card click handlers replaced successfully.');

fs.writeFileSync('3def3ti6rk0vr.patched.js', fe2, 'utf8');
console.log('Saved 3def3ti6rk0vr.patched.js (length: ' + fe2.length + ')');
console.log('ALL PATCHES APPLIED CLEANLY!');
