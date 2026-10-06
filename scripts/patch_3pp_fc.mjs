import fs from 'fs';

let feed = fs.readFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', 'utf8');

const oldFC = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c)) return '@' + c;
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\\d{6,10}$/.test(u)) return '@' + u;
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}`;

const newFC = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c) && !c.startsWith('user_')) return '@' + c;
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\\d{6,10}$/.test(u) && !u.startsWith('user_')) return '@' + u;
  if (c && !invalid.includes(c.toLowerCase()) && !/^\\d{6,10}$/.test(c)) return '@' + c;
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}`;

if (!feed.includes(oldFC)) {
  throw new Error('oldFC not found in 3pp0f!');
}

feed = feed.replace(oldFC, newFC);
new Function(feed);
fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', feed);
console.log('Successfully updated formatCallsign in 3pp0f_cp6yg-o.patched.js!');
