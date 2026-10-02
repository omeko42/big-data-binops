import fs from 'fs';

const filePath = 'frontend-patch/3def3ti6rk0vr.linkedin_v6.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldEt = `function eT() {
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

const newEt = `function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('u') || sp.get('id') || sp.get('uid')) : null;
  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/Authentication/user");
    myUser = myRes.data?.data || null;
  } catch(e) {}

  if (uToken) {
    var targetId = null;
    if (/^\\d+$/.test(uToken)) {
      targetId = uToken;
    } else {
      try {
        var decoded = atob(uToken);
        var parts = decoded.split(':');
        if (parts[0] === 'cas' && parts[1] === 'pers' && parts[2]) {
          targetId = parts[2];
        }
      } catch(err) {}
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

if (!content.includes(oldEt)) {
  console.error('oldEt not found');
  process.exit(1);
}

content = content.replace(oldEt, newEt);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched eT in 3def3ti6rk0vr.linkedin_v6.js');
