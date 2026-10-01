function evaluateUser(e) {
  let isSuperTopbar = String(e?.id) === '1' || e?.username === 'omeko11' || String(e?.role_bdb || '').toLowerCase() === 'superadmin';
  let eo = (String(e?.id) === '1' || e?.username === 'omeko11')
    ? '@omeko11'
    : (isSuperTopbar && e?.callsign
        ? (String(e.callsign).startsWith('@') ? e.callsign : '@' + e.callsign)
        : (e?.name || e?.email || "Pengguna"));

  let role = (function() {
    var isSuper = String(e?.id) === '1' || e?.username === 'omeko11' || String(e?.role_bdb || '').toLowerCase() === 'superadmin';
    if (isSuper) return "Nasional";
    var r = String(e?.role_bdb || e?.requested_role_bdb || 'Operator').toUpperCase();
    var rLabel = "Operator";
    if (r === 'ADMIN_BINOPS' || r === 'BINOPS') rLabel = "Admin Binops";
    else if (r === 'VIEWER') rLabel = "Viewer";

    var s = e?.scope_satker_name || e?.satker || e?.satker_nama || e?.satuan || "";
    if (!s || s === 'BDB Superadmin' || s === '-') s = "Dit Res Siber Jatim";
    var sClean = s.replace(/DIT RES SIBER JAWA TIMUR/i, 'Dit Res Siber Jatim')
                  .replace(/DITRESKRIMSUS/i, 'Dit Reskrimsus')
                  .replace(/DITRESKRIMUM/i, 'Dit Reskrimum')
                  .replace(/DITRESNARKOBA/i, 'Dit Resnarkoba');
    return rLabel + " - " + sClean;
  })();

  return { name: eo, role: role };
}

console.log('Eko (Superadmin):', evaluateUser({ id: 1, username: 'omeko11', name: 'EKO', role_bdb: 'superadmin' }));
console.log('Hendrik (Operator):', evaluateUser({ id: 122, username: '02110642@polri.go.id', name: 'HENDRIK DWI HARIADI', role_bdb: 'OPERATOR', satker: 'DIT RES SIBER JAWA TIMUR' }));
console.log('Rachmat (Superadmin):', evaluateUser({ id: 16568, username: 'mat.doang7', callsign: '@mat.doang7', name: 'RACHMAT', role_bdb: 'superadmin' }));
