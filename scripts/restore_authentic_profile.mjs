import fs from 'fs';
import { execSync } from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';

const sourceFile = 'frontend-patch/3def3ti6rk0vr.patched.js';
let content = fs.readFileSync(sourceFile, 'utf8');

const targetStr = `async function eT() {
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

const replacementStr = `async function eT() {
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

if (!content.includes(targetStr)) {
  console.error('ERROR: targetStr not found in', sourceFile);
  process.exit(1);
}

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(sourceFile, content, 'utf8');
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.pilihan_b.js', content, 'utf8');

console.log('✓ Successfully patched eT in authentic 3def3ti6rk0vr.patched.js');

// Syntax check local
execSync(`node -c "${sourceFile}"`);
console.log('✓ Local syntax check passed');

// Upload to FE host
console.log('--- Uploading authentic patched chunk to FE host ---');
copyFileToFE(sourceFile, '/tmp/3def3ti6rk0vr.js');

console.log(runFE(`
  docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker exec bdb-web chmod 644 /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  rm -f /tmp/3def3ti6rk0vr.js
`));

const chk = runFE(`docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js`);
console.log('Syntax check in container:', chk.trim() === '' ? 'VALID OK' : chk);

const checkSections = runFE(`
  docker exec bdb-web node -e '
    const fs = require("fs");
    const p = fs.readFileSync("/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js", "utf8");
    console.log("Chunk length:", p.length);
    console.log("Has Bahasa profil:", p.includes("Bahasa profil"));
    console.log("Has cyber watermark:", p.includes("watermark"));
    console.log("Has sp.get(id):", p.includes("sp.get(\x27id\x27)"));
  '
`);
console.log('Verification check:\n', checkSections);

// Commit container
console.log('--- Committing bdb-web container ---');
const commitRes = runFE(`docker commit bdb-web bdb-web:latest`);
console.log('Docker commit bdb-web:', commitRes.trim());
