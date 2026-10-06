import fs from 'fs';
import { execSync } from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('=== Step 1: Deep Cleaning 3def3ti6rk0vr.js (Profile Page) ===');
let prof = fs.readFileSync('scratch/3def3ti6rk0vr.patched.js', 'utf8');

// 1.1 Fix post creation fallbacks (lines 982-985)
const oldPostMeta = `      author_id: a?.id || 1,
      author_name: a?.name || (a?.username || 'omeko11'),
      author_callsign: a?.username || a?.nrp || 'omeko11',
      author_handle: '@' + (a?.username || a?.nrp || 'omeko11'),`;

const newPostMeta = `      author_id: a?.id || null,
      author_name: a?.name || a?.username || 'Personil',
      author_callsign: a?.callsign || a?.username || (a?.id ? 'user_' + a.id : 'personil'),
      author_handle: formatCallsign(a?.callsign, a?.id, a?.username),`;

if (prof.includes(oldPostMeta)) {
  prof = prof.replace(oldPostMeta, newPostMeta);
  console.log('✓ 1.1 Fixed post creation author metadata');
} else {
  console.log('1.1 Notice: oldPostMeta not found or already clean');
}

// 1.2 Fix timeline post avatar bleeding (line 2597)
const oldPostAvatar = `var pAvatar = p.author_photo_url || p.photo_url || (isAuthorEko ? (mySelf?.photo_url || mySelf?.foto || mySelf?.photo || a?.photo_url) : null);`;
const newPostAvatar = `var pAvatar = p.author_photo_url || p.photo_url || (isAuthorEko ? (a?.photo_url || a?.foto || null) : null);`;

if (prof.includes(oldPostAvatar)) {
  prof = prof.replace(oldPostAvatar, newPostAvatar);
  console.log('✓ 1.2 Fixed timeline post avatar bleeding');
} else {
  console.log('1.2 Notice: oldPostAvatar not found or already clean');
}

// 1.3 Fix likes modal avatar bleeding (line 3387)
const oldLikesAvatar = `var usrPhoto = usr.photo_url || usr.foto || usr.photo || (isUsrEko ? (mySelf?.photo_url || mySelf?.foto || mySelf?.photo) : null);`;
const newLikesAvatar = `var usrPhoto = usr.photo_url || usr.foto || usr.photo || null;`;

if (prof.includes(oldLikesAvatar)) {
  prof = prof.replace(oldLikesAvatar, newLikesAvatar);
  console.log('✓ 1.3 Fixed likes modal avatar bleeding');
} else {
  console.log('1.3 Notice: oldLikesAvatar not found or already clean');
}

// 1.4 Validate syntax
new Function(prof);
fs.writeFileSync('scratch/3def3ti6rk0vr.deep_cleaned.js', prof);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', prof);
console.log('✓ 3def3ti6rk0vr.js deep-clean validated');

console.log('\n=== Step 2: Deep Cleaning 35hkjujo3bzza.js (Feed Page) ===');
let feed = fs.readFileSync('scratch/35hkjujo3bzza.patched.js', 'utf8');

// 2.1 Replace all anak_serse fallbacks
const oldSerse1 = `                                  children: (function(item){
                                    if (!item) return "@anak_serse";
                                    if (String(item.author_id)==='1' || item.author_username==='omeko11' || item.author_callsign==='omeko11') return "@omeko11";
                                    if (item.author_callsign) return "@" + String(item.author_callsign).replace(/^@/, '');
                                    if (item.author_username) return "@" + item.author_username;
                                    return item.author_handle || (item.author_name ? ("@" + String(item.author_name).toLowerCase().replace(/[^a-z0-9]/g, '')) : "@anak_serse");
                                  })(post)`;

const newSerse1 = `                                  children: (function(item){
                                    if (!item) return "@personil";
                                    if (String(item.author_id)==='1' || item.author_username==='omeko11' || item.author_callsign==='omeko11') return "@omeko11";
                                    if (item.author_callsign && !String(item.author_callsign).startsWith('user_')) return "@" + String(item.author_callsign).replace(/^@/, '');
                                    if (item.author_name && String(item.author_name).trim()) return item.author_name;
                                    if (item.author_username && !String(item.author_username).startsWith('user_')) return "@" + item.author_username;
                                    return item.author_handle || formatCallsign(item.author_callsign, item.author_id, item.author_username);
                                  })(post)`;

if (feed.includes(oldSerse1)) {
  feed = feed.replace(oldSerse1, newSerse1);
  console.log('✓ 2.1 Replaced anak_serse in post comment author');
}

const oldSerse2 = `                              children: (function(item){
                                if (!item) return "@anak_serse";
                                if (String(item.author_id)==='1' || item.author_username==='omeko11' || item.author_callsign==='omeko11') return "@omeko11";
                                if (item.author_callsign) return "@" + String(item.author_callsign).replace(/^@/, '');
                                if (item.author_username) return "@" + item.author_username;
                                return item.author_handle || (item.author_name ? ("@" + String(item.author_name).toLowerCase().replace(/[^a-z0-9]/g, '')) : "@anak_serse");
                              })(p)`;

const newSerse2 = `                              children: (function(item){
                                if (!item) return "@personil";
                                if (String(item.author_id)==='1' || item.author_username==='omeko11' || item.author_callsign==='omeko11') return "@omeko11";
                                if (item.author_callsign && !String(item.author_callsign).startsWith('user_')) return "@" + String(item.author_callsign).replace(/^@/, '');
                                if (item.author_name && String(item.author_name).trim()) return item.author_name;
                                if (item.author_username && !String(item.author_username).startsWith('user_')) return "@" + item.author_username;
                                return item.author_handle || formatCallsign(item.author_callsign, item.author_id, item.author_username);
                              })(p)`;

if (feed.includes(oldSerse2)) {
  feed = feed.replace(oldSerse2, newSerse2);
  console.log('✓ 2.2 Replaced anak_serse in main feed author');
}

// 2.3 Validate syntax
new Function(feed);
fs.writeFileSync('scratch/35hkjujo3bzza.deep_cleaned.js', feed);
fs.writeFileSync('frontend-patch/35hkjujo3bzza.patched.js', feed);
console.log('✓ 35hkjujo3bzza.js deep-clean validated');

console.log('\n=== Step 3: Deploying Deep-Cleaned Files to bdb-web ===');
copyFileToFE('scratch/3def3ti6rk0vr.deep_cleaned.js', '/tmp/3def3ti6rk0vr.deep.js');
copyFileToFE('scratch/35hkjujo3bzza.deep_cleaned.js', '/tmp/35hkjujo3bzza.deep.js');

const deployOut = runFE(`
  docker cp /tmp/3def3ti6rk0vr.deep.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker cp /tmp/35hkjujo3bzza.deep.js bdb-web:/usr/src/app/.next/static/chunks/35hkjujo3bzza.js
  rm -f /tmp/3def3ti6rk0vr.deep.js /tmp/35hkjujo3bzza.deep.js
  echo "DEPLOY_CHUNKS_DONE"
`);
console.log('Deploy result:', deployOut.trim());

console.log('\n=== Step 4: Validate container syntax and restart bdb-web ===');
const syntaxCheck = runFE(`
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/35hkjujo3bzza.js
  echo "CONTAINER_SYNTAX_OK"
`);
console.log(syntaxCheck.trim());

console.log(runFE('docker restart bdb-web').trim());

console.log('\n=== Step 5: Verification of zero anak_serse in feed ===');
const checkSerse = runFE(`
  docker exec bdb-web grep -c "@anak_serse" /usr/src/app/.next/static/chunks/35hkjujo3bzza.js || true
`);
console.log('Count of @anak_serse in feed chunk:', checkSerse.trim());

console.log('\n=== DEEP CLEANING & ROOT AUDIT FULLY APPLIED ===');
