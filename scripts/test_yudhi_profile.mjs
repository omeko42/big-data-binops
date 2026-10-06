const yudhi = {
  id: 14746,
  name: "YUDHI SATRIA",
  username: "kbonarco",
  callsign: "kbonarco",
  role_bdb: "operator",
  satker_nama: "Sat Narkoba Res Sijunjung",
  satker: "Sat Narkoba Res Sijunjung"
};

// Test with current deployed code in 3def3ti6rk0vr
function testDeployedProfile(a, isReadOnlyMode) {
  var isTargetSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
  var roleStr = isTargetSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
  var bColor = isTargetSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
  var bLabel = isTargetSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));

  var displayHandle = (function(){
    if (String(a?.id) === '1' || a?.username === 'omeko11' || a?.callsign === 'omeko11') return "@omeko11";
    var c = a?.callsign ? String(a.callsign).trim().replace(/^@/, '') : '';
    if (c && !c.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(c.toLowerCase())) return '@' + c;
    if (a?.name && String(a.name).trim()) return a.name;
    var u = a?.username ? String(a.username).trim().replace(/^@/, '') : '';
    if (u && !u.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(u.toLowerCase())) return '@' + u;
    return '@user_' + a?.id;
  })();

  var satkerSubline = (function(){
    var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
    if (isSuper) return "Robinopsnal Bareskrim Polri";
    var s = a?.scope_satker_name || a?.satker || a?.satker_nama || a?.satuan;
    return s || "Bareskrim Polri";
  })();

  return {
    handle: displayHandle,
    badgeColor: bColor,
    badgeLabel: bLabel,
    satker: satkerSubline
  };
}

console.log('Results for Yudhi Satria on own profile (isReadOnlyMode = false):');
console.log(testDeployedProfile(yudhi, false));
