import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('scratch/3def3ti6rk0vr.live.js', 'utf8');

// 1. Patch formatCallsign fallback
const targetFC = `  if (!idStr && !rawCallsign && !username) {
    if (!isReadOnlyMode) return '@omeko11';
    return '@personil';
  }`;

const replFC = `  if (!idStr && !rawCallsign && !username) {
    try {
      var lu = (typeof localStorage !== 'undefined') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      if (String(lu.id) === '1' || lu.username === 'omeko11' || lu.callsign === 'omeko11') return '@omeko11';
      if (lu.callsign && !String(lu.callsign).startsWith('user_')) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.name && String(lu.name).trim()) return lu.name;
      if (lu.username && !String(lu.username).startsWith('user_')) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@personil';
  }`;

if (!content.includes(targetFC)) {
  console.error('ERROR: targetFC not found!');
  process.exit(1);
}
content = content.replace(targetFC, replFC);
console.log('✓ 1. Patched formatCallsign fallback');

// 2. Patch isSelf target check
const targetSelf = `var isSelf = (myUser && (String(myUser.id) === cleanTarget || String(myUser.username).toLowerCase() === cleanTarget.toLowerCase() || String(myUser.callsign || '').toLowerCase() === cleanTarget.toLowerCase())) || cleanTarget === 'omeko11';`;
const replSelf = `var isSelf = (myUser && (String(myUser.id) === cleanTarget || String(myUser.username || '').toLowerCase() === cleanTarget.toLowerCase() || String(myUser.callsign || '').toLowerCase() === cleanTarget.toLowerCase())) || (String(myUser?.id) === '1' && cleanTarget === 'omeko11');`;

if (!content.includes(targetSelf)) {
  console.error('ERROR: targetSelf not found!');
  process.exit(1);
}
content = content.replace(targetSelf, replSelf);
console.log('✓ 2. Patched isSelf target check');

// 3. Patch Avatar Badge
const targetAvatarBadge = `var isTargetSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
            var isUserOne = !isReadOnlyMode || isTargetSuper;
            var roleStr = isReadOnlyMode ? String(a?.role_bdb || a?.role || '').toLowerCase() : 'superadmin';
            var bColor = (roleStr === 'superadmin' || isUserOne) ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
            var bLabel = (roleStr === 'superadmin' || isUserOne) ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));`;

const replAvatarBadge = `var isTargetSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
            var roleStr = isTargetSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
            var bColor = isTargetSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
            var bLabel = isTargetSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));`;

if (!content.includes(targetAvatarBadge)) {
  console.error('ERROR: targetAvatarBadge not found!');
  process.exit(1);
}
content = content.replace(targetAvatarBadge, replAvatarBadge);
console.log('✓ 3. Patched Avatar Badge');

// 4. Patch Identity Row Badge
const targetIdentityBadge = `(function(){
          var isSuper = (!isReadOnlyMode) || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          var roleStr = isSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
          var bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));`;

const replIdentityBadge = `(function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
          var roleStr = isSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
          var bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));`;

if (!content.includes(targetIdentityBadge)) {
  console.error('ERROR: targetIdentityBadge not found!');
  process.exit(1);
}
content = content.replace(targetIdentityBadge, replIdentityBadge);
console.log('✓ 4. Patched Identity Row Badge');

// 5. Patch Hero Prominent Name / Callsign
const targetHeroName = `        // Callsign / Username (Large, prominent)
        (0,t.jsx)("span",{
          style:{fontSize:"1.65rem",fontWeight:800,color:"var(--cas-text-primary, #ffffff)",lineHeight:1.2},
          children:(function(){
            if (!isReadOnlyMode) return "@omeko11";
            if (String(a?.id) === '1' || a?.username === 'omeko11') return "@omeko11";
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()
        }),`;

const replHeroName = `        // Callsign / Username (Large, prominent)
        (0,t.jsx)("span",{
          style:{fontSize:"1.65rem",fontWeight:800,color:"var(--cas-text-primary, #ffffff)",lineHeight:1.2},
          children:(function(){
            if (String(a?.id) === '1' || a?.username === 'omeko11' || a?.callsign === 'omeko11') return "@omeko11";
            var c = a?.callsign ? String(a.callsign).trim().replace(/^@/, '') : '';
            if (c && !c.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(c.toLowerCase())) return '@' + c;
            if (a?.name && String(a.name).trim()) return a.name;
            var u = a?.username ? String(a.username).trim().replace(/^@/, '') : '';
            if (u && !u.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(u.toLowerCase())) return '@' + u;
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()
        }),`;

if (!content.includes(targetHeroName)) {
  console.error('ERROR: targetHeroName not found!');
  process.exit(1);
}
content = content.replace(targetHeroName, replHeroName);
console.log('✓ 5. Patched Hero Prominent Name');

// 6. Patch Satker Subline
const targetSatker = `(function(){
          var isSuper = (!isReadOnlyMode) || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
          if (isSuper) return "Robinopsnal Bareskrim Polri";`;

const replSatker = `(function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
          if (isSuper) return "Robinopsnal Bareskrim Polri";`;

if (!content.includes(targetSatker)) {
  console.error('ERROR: targetSatker not found!');
  process.exit(1);
}
content = content.replace(targetSatker, replSatker);
console.log('✓ 6. Patched Satker Subline');

// Write out patched file
fs.writeFileSync('scratch/3def3ti6rk0vr.patched.js', content);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', content);

// Syntax validation
try {
  execSync('node -c scratch/3def3ti6rk0vr.patched.js');
  console.log('✓ Syntax check passed on scratch/3def3ti6rk0vr.patched.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
