import fs from 'fs';
import cp from 'child_process';

let c = fs.readFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', 'utf8');

// 1. Update formatCallsign to filter pers_ and user_
const oldFormatFn = `function formatCallsign(rawCallsign, authorId, username) {
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
}`;

const newFormatFn = `function formatCallsign(rawCallsign, authorId, username) {
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
}`;

if (c.includes(oldFormatFn)) {
  c = c.replace(oldFormatFn, newFormatFn);
  console.log('✓ Updated formatCallsign in 3pp');
} else {
  console.log('formatCallsign already updated in 3pp');
}

// 2. In handleReact: compute initial total correctly
const oldHandleReactTotal = `        var oldCounts = { ...(p.reaction_counts || {}) };
        var total = p.total_reactions || 0;`;

const newHandleReactTotal = `        var oldCounts = { ...(p.reaction_counts || {}) };
        var total = (p.total_reactions != null && p.total_reactions > 0)
          ? p.total_reactions
          : Object.values(oldCounts).reduce((acc, v) => acc + Number(v || 0), 0);`;

if (c.includes(oldHandleReactTotal)) {
  c = c.replace(oldHandleReactTotal, newHandleReactTotal);
  console.log('✓ Updated handleReact total reactions calculation');
}

// 3. In post mapping: compute totalReactions
const oldPostStart = `var authorHandle = formatCallsign(post.author_callsign, post.author_id, post.author_username);
          var authorBadge = getVerificationBadge(post.author_role, isUserOne);`;

const newPostStart = `var authorHandle = formatCallsign(post.author_callsign, post.author_id, post.author_username);
          var authorBadge = getVerificationBadge(post.author_role, isUserOne);
          var totalReactions = (post.total_reactions != null && post.total_reactions > 0)
            ? post.total_reactions
            : Object.values(post.reaction_counts || {}).reduce((acc, val) => acc + Number(val || 0), 0);`;

if (c.includes(oldPostStart)) {
  c = c.replace(oldPostStart, newPostStart);
  console.log('✓ Added totalReactions definition in post mapping');
}

// 4. In post metrics row: replace post.total_reactions with totalReactions
c = c.replace('(post.total_reactions > 0)', '(totalReactions > 0)');
c = c.replace('"👍 ",post.total_reactions', '"👍 ",totalReactions');
console.log('✓ Replaced post.total_reactions with totalReactions in metrics row');

fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', c, 'utf8');
cp.execSync('node -c frontend-patch/3pp0f_cp6yg-o.patched.js');
console.log('✓ Syntax check 3pp0f_cp6yg-o.patched.js PASS');
