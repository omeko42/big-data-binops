function evaluateTopbar(curUser) {
  let isSuper = Boolean(curUser && (
    String(curUser?.id) === '1' ||
    String(curUser?.user_id) === '1' ||
    curUser?.username === 'omeko11' ||
    curUser?.callsign === 'omeko11' ||
    String(curUser?.role_bdb || curUser?.role?.role_name || curUser?.role || '').toLowerCase().includes('super') ||
    ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(curUser?.id || curUser?.user_id))
  ));

  let eo = (function() {
    if (!curUser) return "Pengguna";
    var uid = String(curUser.id || curUser.user_id || '');
    if (uid === '1' || curUser.username === 'omeko11' || curUser.callsign === 'omeko11') return '@omeko11';
    var c = curUser.callsign ? String(curUser.callsign).trim().replace(/^@/, '') : '';
    if (c && !c.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(c.toLowerCase())) return '@' + c;
    if (curUser.name && curUser.name.trim()) return curUser.name;
    var u = curUser.username ? String(curUser.username).trim().replace(/^@/, '') : '';
    if (u && !u.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(u.toLowerCase())) return '@' + u;
    return '@user_' + uid;
  })();

  let userSatkerDisp = isSuper ? 'Robinopsnal Bareskrim Polri' : (curUser?.satker_nama || curUser?.satker || 'Bareskrim Polri');
  let badge = isSuper ? 'Superadmin Terverifikasi' : 'Personil Terverifikasi';
  let initial = String(eo).replace(/^@/, '').charAt(0).toUpperCase();

  return { name: eo, satker: userSatkerDisp, badge, initial };
}

function evaluateProfile(a, mySelf, isReadOnlyMode) {
  var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) ||
    a?.username === 'omeko11' ||
    String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');

  var displayHandle = (function() {
    if (String(a?.id) === '1' || a?.username === 'omeko11' || a?.callsign === 'omeko11') return "@omeko11";
    var c = a?.callsign ? String(a.callsign).trim().replace(/^@/, '') : '';
    if (c && !c.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(c.toLowerCase())) return '@' + c;
    if (a?.name && a.name.trim()) return a.name;
    var u = a?.username ? String(a.username).trim().replace(/^@/, '') : '';
    if (u && !u.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(u.toLowerCase())) return '@' + u;
    return '@user_' + a?.id;
  })();

  var satker = isSuper ? "Robinopsnal Bareskrim Polri" : (a?.satker_nama || a?.satker || "Bareskrim Polri");
  var badge = isSuper ? "Superadmin Terverifikasi" : "Personil Terverifikasi";

  return { displayHandle, satker, badge };
}

// Test cases
const eko = { id: 1, name: 'EKO', username: 'omeko11', callsign: 'omeko11', role_bdb: 'superadmin' };
const henryNoCallsign = { id: 320, name: 'Henry', username: 'user_3204856', callsign: null, role_bdb: 'superadmin' };
const henryWithCallsign = { id: 320, name: 'Henry', username: 'henry', callsign: 'henry', role_bdb: 'superadmin' };
const rachmat = { id: 16568, name: 'Rachmat', username: 'mat.doang7', callsign: 'mat.doang7', role_bdb: 'superadmin' };
const idris = { id: 15403, name: 'IDRIS GANTENG', username: 'idrisganteng', callsign: 'idrisganteng', role_bdb: 'superadmin' };
const hendrik = { id: 122, name: 'HENDRIK DWI HARIADI', username: '02110642@polri.go.id', callsign: null, role_bdb: 'operator', satker: 'Dit Res Siber Jatim' };
const dolly = { id: 14481, name: 'DOLLY', username: 'dolly', callsign: 'dolly', role_bdb: 'admin_binops', satker: 'Robinops Bareskrim' };

console.log('=== TOPBAR TESTS ===');
console.log('Eko (Superadmin):', evaluateTopbar(eko));
console.log('Henry (Superadmin without callsign):', evaluateTopbar(henryNoCallsign));
console.log('Henry (Superadmin with callsign):', evaluateTopbar(henryWithCallsign));
console.log('Rachmat (Superadmin):', evaluateTopbar(rachmat));
console.log('Idris (Superadmin):', evaluateTopbar(idris));
console.log('Hendrik (Operator):', evaluateTopbar(hendrik));
console.log('Dolly (Admin Binops):', evaluateTopbar(dolly));

console.log('\n=== PROFILE TESTS (When viewing own profile) ===');
console.log('Eko viewing own profile:', evaluateProfile(eko, eko, false));
console.log('Henry viewing own profile (no callsign):', evaluateProfile(henryNoCallsign, henryNoCallsign, false));
console.log('Henry viewing own profile (with callsign):', evaluateProfile(henryWithCallsign, henryWithCallsign, false));
console.log('Hendrik viewing own profile:', evaluateProfile(hendrik, hendrik, false));
