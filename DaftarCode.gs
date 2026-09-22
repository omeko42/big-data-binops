const CAS_CONFIG = {
  SOURCE_MASTER_SHEET: 'Daftar Satker',
  MASTER_SHEET: 'MASTER PILIHAN CAS',
  RESPONSE_SHEET: 'RESPONS CAS',
  IMPORT_SHEET: 'SIAP IMPORT CAS',
  CACHE_KEY: 'CAS_MASTER_SATKER_V3_FLAT',
  CACHE_SECONDS: 21600,
  ROLE_DEFAULT: 'operator',
  PETUNJUK_SPREADSHEET_ID: '1_1AApGaR8_lh1zB6BKMY9oH3vRL0r9KXmPyt73sD2Ks',
  SUPPORT_FIRST_ROW: 5,
  WIB_OFFSET_MS: 7 * 60 * 60 * 1000
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Pendataan Username CAS Polri')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Jalankan sekali setelah file template dibuka sebagai Google Sheets. */
function setupCAS() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('CAS_SPREADSHEET_ID', ss.getId());
  ensureCasSheets_(ss);
  rebuildMasterPilihanCAS_(ss);
  clearCacheCAS();
  SpreadsheetApp.getUi().alert(
    'Setup CAS selesai. Master pilihan satker sudah dibuat tanpa tanda pemisah. Selanjutnya perbarui deployment Web App.'
  );
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CAS')
    .addItem('Setup / Perbaiki Sheet', 'setupCAS')
    .addItem('Perbarui Master Pilihan CAS', 'refreshMasterPilihanCAS')
    .addItem('Bersihkan Cache Satker', 'clearCacheCAS')
    .addItem('Cek Data Siap Import', 'cekDataImportCAS')
    .addToUi();
}

function refreshMasterPilihanCAS() {
  const ss = openCasSpreadsheet_();
  rebuildMasterPilihanCAS_(ss);
  clearCacheCAS();
  SpreadsheetApp.getUi().alert('Master Pilihan CAS berhasil diperbarui.');
}

function getInitialData() {
  const satker = getSatkerList_();
  return {
    satker: satker.map(x => x.label),
    total: satker.length
  };
}

function getSupportPanelData() {
  const source = SpreadsheetApp.openById(CAS_CONFIG.PETUNJUK_SPREADSHEET_ID);
  return {
    support: getWeeklySupport_(source),
    contacts: getTechnicalContacts_(source)
  };
}

function getWeeklySupport_(source) {
  const config = getSupportConfig_(source);
  const sheet = source.getSheetByName('DUKUNGAN');
  const target = Math.max(0, Number(config.milestoneTarget || 0));
  const leaderboardLimit = Math.min(10, Math.max(3, Number(config.leaderboardLimit || 5)));
  const recentLimit = Math.min(12, Math.max(3, Number(config.recentLimit || 6)));
  const week = getJakartaWeekRange_(new Date());
  const weekLabel = formatSupportWeekLabel_(week.start, week.end);

  if (!sheet || sheet.getLastRow() < CAS_CONFIG.SUPPORT_FIRST_ROW) {
    return {
      recent: [], leaderboard: [], total: 0, target: target,
      milestoneLabel: String(config.milestoneLabel || 'Target dukungan'),
      progressPercent: 0, weekLabel: weekLabel, updatedAt: new Date().toISOString()
    };
  }

  const lastRow = sheet.getLastRow();
  const firstRow = CAS_CONFIG.SUPPORT_FIRST_ROW;
  const rows = sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 8).getValues();
  const donations = rows.map(row => ({
    receivedAt: row[0] instanceof Date ? row[0] : new Date(row[0]),
    createdAt: String(row[2] || ''),
    name: String(row[4] || '').trim() || 'Anonim',
    amount: Math.max(0, Number(row[5] || 0)),
    eventDate: parseSupportDate_(row[2], row[0])
  })).filter(item => item.amount > 0 && item.eventDate)
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());

  const weeklyDonations = donations.filter(item => (
    item.eventDate.getTime() >= week.start.getTime() &&
    item.eventDate.getTime() < week.end.getTime()
  ));

  const totalsByName = Object.create(null);
  donations.forEach(item => {
    const key = item.name.toLowerCase();
    if (!totalsByName[key]) totalsByName[key] = { name: item.name, amount: 0, count: 0 };
    totalsByName[key].amount += item.amount;
    totalsByName[key].count += 1;
  });

  const leaderboard = Object.keys(totalsByName)
    .map(key => totalsByName[key])
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, 'id'))
    .slice(0, leaderboardLimit);
  const total = weeklyDonations.reduce((sum, item) => sum + item.amount, 0);

  return {
    recent: weeklyDonations.slice(0, recentLimit).map(item => ({
      name: item.name,
      amount: item.amount,
      createdAt: item.eventDate.toISOString()
    })),
    leaderboard: leaderboard,
    total: total,
    target: target,
    milestoneLabel: String(config.milestoneLabel || 'Target dukungan'),
    progressPercent: target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0,
    weekLabel: weekLabel,
    updatedAt: new Date().toISOString()
  };
}

function getSupportConfig_(source) {
  const sheet = source.getSheetByName('CONFIG');
  if (!sheet || sheet.getLastRow() < CAS_CONFIG.SUPPORT_FIRST_ROW) return {};
  return sheet
    .getRange(CAS_CONFIG.SUPPORT_FIRST_ROW, 1, sheet.getLastRow() - CAS_CONFIG.SUPPORT_FIRST_ROW + 1, 2)
    .getDisplayValues()
    .reduce((result, row) => {
      const key = String(row[0] || '').trim();
      if (key) result[key] = String(row[1] || '').trim();
      return result;
    }, {});
}

function getTechnicalContacts_(source) {
  const sheet = source.getSheetByName('PIC');
  if (!sheet || sheet.getLastRow() < CAS_CONFIG.SUPPORT_FIRST_ROW) return [];
  return sheet
    .getRange(CAS_CONFIG.SUPPORT_FIRST_ROW, 1, sheet.getLastRow() - CAS_CONFIG.SUPPORT_FIRST_ROW + 1, 6)
    .getValues()
    .filter(row => row[5] === true && String(row[1] || '').trim())
    .sort((a, b) => Number(a[0] || 999) - Number(b[0] || 999))
    .map(row => ({
      name: String(row[1] || '').trim(),
      unit: String(row[2] || '').trim(),
      channel: String(row[3] || '').trim(),
      url: String(row[4] || '').trim()
    }));
}

function getJakartaWeekRange_(now) {
  const jakartaNow = new Date(now.getTime() + CAS_CONFIG.WIB_OFFSET_MS);
  const daysSinceMonday = (jakartaNow.getUTCDay() + 6) % 7;
  const mondayWallTime = Date.UTC(
    jakartaNow.getUTCFullYear(), jakartaNow.getUTCMonth(),
    jakartaNow.getUTCDate() - daysSinceMonday, 0, 0, 0, 0
  );
  const start = new Date(mondayWallTime - CAS_CONFIG.WIB_OFFSET_MS);
  return { start: start, end: new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000) };
}

function parseSupportDate_(createdAt, receivedAt) {
  const normalized = String(createdAt || '').trim().replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T');
  const eventDate = new Date(normalized);
  if (normalized && !isNaN(eventDate.getTime())) return eventDate;
  const fallback = receivedAt instanceof Date ? receivedAt : new Date(receivedAt);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function formatSupportWeekLabel_(start, endExclusive) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const first = getJakartaDateParts_(start);
  const last = getJakartaDateParts_(new Date(endExclusive.getTime() - 1));
  return 'Senin ' + first.day + ' ' + months[first.month] + ' ' + first.year +
    ' s.d. ' + last.day + ' ' + months[last.month] + ' ' + last.year;
}

function getJakartaDateParts_(date) {
  const jakartaDate = new Date(date.getTime() + CAS_CONFIG.WIB_OFFSET_MS);
  return {
    day: jakartaDate.getUTCDate(),
    month: jakartaDate.getUTCMonth(),
    year: jakartaDate.getUTCFullYear()
  };
}

function submitData(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = normalizePayload_(payload);
    validatePayload_(data);

    const ss = openCasSpreadsheet_();
    ensureCasSheets_(ss);

    const satkerMap = getSatkerMap_();
    const selected = satkerMap[normalizeSatkerKey_(data.satkerLabel)];
    if (!selected) {
      throw new Error('Satker tidak ditemukan. Pilih satker dari daftar pencarian yang tersedia.');
    }

    const importSheet = ss.getSheetByName(CAS_CONFIG.IMPORT_SHEET);
    const importLastRow = importSheet.getLastRow();
    const emailFinder = importLastRow >= 2
      ? importSheet.getRange(2, 4, importLastRow - 1, 1)
          .createTextFinder(data.email)
          .matchEntireCell(true)
          .matchCase(false)
          .findNext()
      : null;
    if (emailFinder) {
      throw new Error('Email Polri tersebut sudah pernah didata.');
    }

    const now = new Date();
    const responseSheet = ss.getSheetByName(CAS_CONFIG.RESPONSE_SHEET);
    responseSheet.appendRow([
      now,
      data.nama,
      data.nrp,
      data.email,
      data.noWa,
      selected.label,
      selected.code,
      selected.sourceName,
      data.keterangan
    ]);

    // Susunan wajib mengikuti template import aplikasi CAS.
    importSheet.appendRow([
      data.nama,                  // Nama
      data.nrp,                   // NRP/NIP
      data.email,                 // Email
      data.email,                 // Email Dinas Polri
      '',                         // Username
      CAS_CONFIG.ROLE_DEFAULT,    // Role
      selected.code,              // Kode atau Nama Satker
      ''                          // Status: sengaja dikosongkan
    ]);

    return {
      ok: true,
      message: 'Pendataan berhasil dikirim.',
      satker: selected.label
    };
  } finally {
    lock.releaseLock();
  }
}

function cekDataImportCAS() {
  const ss = openCasSpreadsheet_();
  ensureCasSheets_(ss);
  const sh = ss.getSheetByName(CAS_CONFIG.IMPORT_SHEET);
  const lastRow = sh.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Belum ada data pengguna yang masuk.');
    return;
  }

  const values = sh.getRange(2, 1, lastRow - 1, 8).getDisplayValues();
  const errors = [];
  const seen = new Set();
  values.forEach((r, i) => {
    const rowNo = i + 2;
    if (!r[0]) errors.push(`Baris ${rowNo}: Nama kosong.`);
    if (!isPolriEmail_(r[3])) errors.push(`Baris ${rowNo}: Email Polri tidak valid.`);
    if (!r[6]) errors.push(`Baris ${rowNo}: Kode satker kosong.`);
    const key = String(r[3]).toLowerCase();
    if (key && seen.has(key)) errors.push(`Baris ${rowNo}: Email duplikat.`);
    seen.add(key);
  });

  SpreadsheetApp.getUi().alert(
    errors.length
      ? `Ditemukan ${errors.length} masalah:\n\n${errors.slice(0, 20).join('\n')}`
      : `Data siap import: ${values.length} akun. Tidak ditemukan masalah utama.`
  );
}

function clearCacheCAS() {
  CacheService.getScriptCache().remove(CAS_CONFIG.CACHE_KEY);
}

function openCasSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('CAS_SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error('Spreadsheet CAS belum dihubungkan. Jalankan setupCAS dari Google Sheets.');
  return active;
}

function ensureCasSheets_(ss) {
  const sourceMaster = ss.getSheetByName(CAS_CONFIG.SOURCE_MASTER_SHEET);
  if (!sourceMaster) {
    throw new Error(`Sheet "${CAS_CONFIG.SOURCE_MASTER_SHEET}" tidak ditemukan.`);
  }

  let master = ss.getSheetByName(CAS_CONFIG.MASTER_SHEET);
  if (!master) master = ss.insertSheet(CAS_CONFIG.MASTER_SHEET);

  let response = ss.getSheetByName(CAS_CONFIG.RESPONSE_SHEET);
  if (!response) response = ss.insertSheet(CAS_CONFIG.RESPONSE_SHEET);
  if (response.getLastRow() === 0) {
    response.getRange(1, 1, 1, 9).setValues([[
      'Timestamp', 'Nama', 'NRP/NIP', 'Email Polri', 'Nomor WhatsApp',
      'Nama Satker Pilihan', 'Kode Satker', 'Nama Satker Sumber', 'Keterangan'
    ]]);
  }

  let output = ss.getSheetByName(CAS_CONFIG.IMPORT_SHEET);
  if (!output) output = ss.insertSheet(CAS_CONFIG.IMPORT_SHEET);
  if (output.getLastRow() === 0) {
    output.getRange(1, 1, 1, 8).setValues([[
      'Nama', 'NRP/NIP', 'Email', 'Email Dinas Polri',
      'Username', 'Role', 'Kode atau Nama Satker', 'Status'
    ]]);
  }

  [master, response, output].forEach(sh => {
    if (sh.getLastColumn() > 0) {
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, sh.getLastColumn())
        .setFontWeight('bold')
        .setBackground('#172554')
        .setFontColor('#ffffff')
        .setHorizontalAlignment('center');
      sh.autoResizeColumns(1, sh.getLastColumn());
    }
  });

  output.getRange('H2').setNote('Dikosongkan. Status akun ditentukan oleh admin CAS.');
}

/**
 * Membuat master khusus yang benar-benar dipakai oleh formulir.
 * Tidak memakai kolom "Jalur" dan tidak menampilkan tanda >.
 * Hanya memasukkan satker fungsi reserse yang relevan untuk CAS.
 */
function rebuildMasterPilihanCAS_(ss) {
  const source = ss.getSheetByName(CAS_CONFIG.SOURCE_MASTER_SHEET);
  if (!source) throw new Error(`Sheet "${CAS_CONFIG.SOURCE_MASTER_SHEET}" tidak ditemukan.`);

  const lastRow = source.getLastRow();
  if (lastRow < 2) throw new Error('Daftar Satker masih kosong.');

  const values = source.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
  const rows = values
    .map(r => ({ code: cleanText_(r[0]), name: cleanText_(r[1]) }))
    .filter(x => x.code && x.name)
    .map(x => ({
      code: x.code,
      name: x.name,
      parts: x.code.split('.').filter(Boolean)
    }));

  const poldaByKey = Object.create(null);
  const polresByKey = Object.create(null);
  const satresJurByPolresKey = Object.create(null);

  rows.forEach(x => {
    const len = x.parts.length;
    if (len === 3 && /^POLDA\s+/i.test(x.name)) {
      poldaByKey[x.parts.slice(0, 3).join('.')] = x.name;
    }
    if (len === 4) {
      polresByKey[x.parts.slice(0, 4).join('.')] = x.name;
    }
    if (len === 6 && /^SAT\s+RESKRIM\b/i.test(x.name)) {
      const key = x.parts.slice(0, 4).join('.');
      const jur = cleanText_(x.name.replace(/^SAT\s+RESKRIM\s+/i, ''));
      if (jur && !satresJurByPolresKey[key]) satresJurByPolresKey[key] = jur;
    }
  });

  const seenLabels = new Set();
  const result = [];

  rows.forEach(x => {
    if (!isEligibleCasSatker_(x)) return;

    const label = buildCasSatkerLabel_(x, poldaByKey, polresByKey, satresJurByPolresKey);
    const labelKey = normalizeSatkerKey_(label);
    if (!label || seenLabels.has(labelKey)) return;

    seenLabels.add(labelKey);
    result.push({ code: x.code, label: label, sourceName: x.name });
  });

  result.sort((a, b) => a.label.localeCompare(b.label, 'id'));

  let master = ss.getSheetByName(CAS_CONFIG.MASTER_SHEET);
  if (!master) master = ss.insertSheet(CAS_CONFIG.MASTER_SHEET);
  master.clearContents();
  master.getRange(1, 1, 1, 3).setValues([['Kode', 'Nama Pilihan CAS', 'Nama Satker Sumber']]);
  if (result.length) {
    master.getRange(2, 1, result.length, 3).setValues(
      result.map(x => [x.code, x.label, x.sourceName])
    );
  }
  master.setFrozenRows(1);
  master.getRange(1, 1, 1, 3)
    .setFontWeight('bold')
    .setBackground('#172554')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');
  master.autoResizeColumns(1, 3);
  master.hideColumns(1); // Kode tetap tersimpan tetapi tidak perlu dilihat pengisi.
}

function isEligibleCasSatker_(x) {
  const name = cleanText_(x.name).toUpperCase();
  const len = x.parts.length;

  // Tingkat Bareskrim yang relevan.
  if (name === 'BARESKRIM POLRI') return true;
  if (/^(RO WAS SIDIK|PUSIKNAS|DIT TIPID|KORTAS TIPIDKOR)\b/.test(name)) return true;

  // Direktorat fungsi reserse pada Polda.
  if (len === 6 && /^DIT\s+(KRIMUM|KRIMSUS|NARKOBA|RES\s+SIBER|RES\s+PPA|PPA|TIPID)\b/.test(name)) {
    return true;
  }

  // Satres pada Polres/Polresta/Polrestabes.
  if (len === 6 && /^SAT\s+(RESKRIM|NARKOBA|RES\s+PPA|PPA)\b/.test(name)) {
    return true;
  }

  // Unit Reskrim pada Polsek.
  if (len === 6 && /^UNIT\s*RESKRIM\b/.test(name)) {
    return true;
  }

  return false;
}

function buildCasSatkerLabel_(x, poldaByKey, polresByKey, satresJurByPolresKey) {
  const name = cleanText_(x.name).toUpperCase();
  const parts = x.parts;

  if (name.includes('BARESKRIM') || name === 'KORTAS TIPIDKOR') {
    return name;
  }

  const poldaKey = parts.slice(0, 3).join('.');
  const poldaName = cleanText_(poldaByKey[poldaKey] || '');
  const poldaArea = cleanText_(poldaName.replace(/^POLDA\s+/i, ''));

  // Contoh: DIT KRIMUM ACEH -> DIT KRIMUM POLDA ACEH.
  if (/^DIT\s+/i.test(name)) {
    const unitName = stripTrailingArea_(name, poldaArea);
    return cleanText_(`${unitName} ${poldaName}`);
  }

  // Contoh: SAT RESKRIM RESTABES SEMARANG POLDA JAWA TENGAH.
  if (/^SAT\s+/i.test(name)) {
    return cleanText_(`${name} ${poldaName}`);
  }

  // Contoh: UNIT RESKRIM POLSEK BANYUMANIK RESTABES SEMARANG POLDA JAWA TENGAH.
  if (/^UNIT\s*RESKRIM\b/i.test(name)) {
    const polresKey = parts.slice(0, 4).join('.');
    let jurisdiction = extractJurisdiction_(polresByKey[polresKey] || '');
    if (!jurisdiction) jurisdiction = cleanText_(satresJurByPolresKey[polresKey] || '');
    return cleanText_(`${name} ${jurisdiction} ${poldaName}`);
  }

  return name;
}

function extractJurisdiction_(value) {
  const text = cleanText_(value).toUpperCase();
  const match = text.match(/\b(POLRES METRO|POLRESTABES|POLRESTA|POLRES)\b\s+(.+)$/i);
  if (!match) return '';

  const typeMap = {
    'POLRES METRO': 'RES METRO',
    'POLRESTABES': 'RESTABES',
    'POLRESTA': 'RESTA',
    'POLRES': 'RES'
  };
  return cleanText_(`${typeMap[match[1].toUpperCase()]} ${match[2]}`);
}

function stripTrailingArea_(text, area) {
  const value = cleanText_(text).toUpperCase();
  const suffix = cleanText_(area).toUpperCase();
  if (!suffix) return value;
  if (value === suffix) return '';
  if (value.endsWith(` ${suffix}`)) {
    return value.slice(0, -(suffix.length + 1)).trim();
  }
  return value;
}

function getSatkerList_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CAS_CONFIG.CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const ss = openCasSpreadsheet_();
  ensureCasSheets_(ss);

  let sh = ss.getSheetByName(CAS_CONFIG.MASTER_SHEET);
  if (!sh || sh.getLastRow() < 2) {
    rebuildMasterPilihanCAS_(ss);
    sh = ss.getSheetByName(CAS_CONFIG.MASTER_SHEET);
  }

  const lastRow = sh.getLastRow();
  const rows = sh.getRange(2, 1, lastRow - 1, 3).getDisplayValues();
  const list = rows
    .map(r => ({
      code: cleanText_(r[0]),
      label: cleanText_(r[1]),
      sourceName: cleanText_(r[2])
    }))
    .filter(x => x.code && x.label)
    .sort((a, b) => a.label.localeCompare(b.label, 'id'));

  const json = JSON.stringify(list);
  if (json.length < 95000) cache.put(CAS_CONFIG.CACHE_KEY, json, CAS_CONFIG.CACHE_SECONDS);
  return list;
}

function getSatkerMap_() {
  const map = Object.create(null);
  getSatkerList_().forEach(x => {
    map[normalizeSatkerKey_(x.label)] = x;
  });
  return map;
}

function normalizePayload_(payload) {
  payload = payload || {};
  return {
    nama: clean_(payload.nama),
    nrp: clean_(payload.nrp),
    email: clean_(payload.email).toLowerCase(),
    konfirmasiEmail: clean_(payload.konfirmasiEmail).toLowerCase(),
    noWa: clean_(payload.noWa),
    satkerLabel: cleanText_(payload.satkerLabel || payload.satkerPath),
    keterangan: clean_(payload.keterangan)
  };
}

function validatePayload_(data) {
  if (!data.nama) throw new Error('Nama lengkap wajib diisi.');
  if (!isPolriEmail_(data.email)) {
    throw new Error('Gunakan email resmi Polri, termasuk subdomain yang berakhiran polri.go.id.');
  }
  if (data.email !== data.konfirmasiEmail) {
    throw new Error('Konfirmasi email tidak sama dengan email Polri.');
  }
  if (!data.satkerLabel) throw new Error('Satker yang akan diakses wajib dipilih.');
  if (data.nama.length > 150 || data.keterangan.length > 500) {
    throw new Error('Isian terlalu panjang.');
  }
}

function isPolriEmail_(email) {
  return /^[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)*polri\.go\.id$/i.test(String(email || '').trim());
}

function normalizeSatkerKey_(value) {
  return cleanText_(value).toLocaleLowerCase('id-ID');
}

function cleanText_(value) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
}

function clean_(value) {
  return cleanText_(value).replace(/[<>]/g, '');
}
