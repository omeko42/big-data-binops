const CAS_CONFIG_SHEET = 'CONFIG';
const CAS_PIC_SHEET = 'PIC';
const CAS_SUPPORT_SHEET = 'DUKUNGAN';
const CAS_FIRST_DATA_ROW = 5;
const CAS_WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CAS Petunjuk')
    .addItem('Tampilkan URL Webhook Saweria', 'tampilkanUrlWebhook')
    .addSeparator()
    .addItem('Tambah PIC', 'tambahPic')
    .addItem('Kurangi PIC Terakhir', 'kurangiPicTerakhir')
    .addToUi();
}

function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  template.appConfig = getAppConfig_();
  template.picList = getPicList_();

  return template
    .evaluate()
    .setTitle(template.appConfig.siteTitle || 'Petunjuk Pendataan Akun')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const config = getAppConfig_();
  const expectedKey = String(config.webhookKey || '').trim();
  const suppliedKey = String((e && e.parameter && e.parameter.hookKey) || '').trim();

  if (!expectedKey || suppliedKey !== expectedKey) {
    return jsonOutput_({ ok: false, error: 'Webhook key tidak valid.' });
  }

  const rawBody = String((e && e.postData && e.postData.contents) || '').trim();
  let payload;

  try {
    payload = rawBody ? JSON.parse(rawBody) : Object.assign({}, e.parameter || {});
  } catch (error) {
    throw new Error('Payload webhook bukan JSON yang valid.');
  }

  const donation = normalizeDonationPayload_(payload);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const sheet = ensureSupportSheet_();
    if (donation.id && supportIdExists_(sheet, donation.id)) {
      return jsonOutput_({ ok: true, duplicate: true, id: donation.id });
    }

    sheet.appendRow([
      new Date(),
      safeSheetText_(donation.id, 160),
      safeSheetText_(donation.createdAt, 80),
      safeSheetText_(donation.type, 80),
      safeSheetText_(donation.name, 120),
      donation.amount,
      donation.cut,
      safeSheetText_(donation.message, 500),
      safeSheetText_(JSON.stringify(redactSensitiveFields_(payload)), 45000)
    ]);

    return jsonOutput_({ ok: true, id: donation.id });
  } finally {
    lock.releaseLock();
  }
}

function tampilkanUrlWebhook() {
  const ui = SpreadsheetApp.getUi();
  const baseUrl = ScriptApp.getService().getUrl();
  const key = String(getAppConfig_().webhookKey || '').trim();

  if (!baseUrl) {
    ui.alert(
      'Web App belum di-deploy',
      'Deploy project sebagai Web App terlebih dahulu, lalu jalankan menu ini lagi.',
      ui.ButtonSet.OK
    );
    return;
  }

  if (!key) {
    ui.alert('Kunci webhook belum tersedia di tab CONFIG.');
    return;
  }

  const separator = baseUrl.indexOf('?') === -1 ? '?' : '&';
  const webhookUrl = baseUrl + separator + 'hookKey=' + encodeURIComponent(key);

  ui.alert(
    'URL Webhook Saweria',
    'Salin seluruh URL berikut ke kolom Webhook URL di Saweria:\n\n' + webhookUrl,
    ui.ButtonSet.OK
  );
}

function getSupportDashboard() {
  const config = getAppConfig_();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAS_SUPPORT_SHEET);
  const target = Math.max(0, Number(config.milestoneTarget || 0));
  const leaderboardLimit = Math.min(10, Math.max(3, Number(config.leaderboardLimit || 5)));
  const recentLimit = Math.min(12, Math.max(3, Number(config.recentLimit || 6)));
  const week = getJakartaWeekRange_(new Date());
  const weekLabel = formatSupportWeekLabel_(week.start, week.end);

  if (!sheet || sheet.getLastRow() < CAS_FIRST_DATA_ROW) {
    return {
      recent: [],
      leaderboard: [],
      total: 0,
      target: target,
      milestoneLabel: String(config.milestoneLabel || 'Target dukungan'),
      progressPercent: 0,
      weekStart: week.start.toISOString(),
      weekEnd: new Date(week.end.getTime() - 1).toISOString(),
      weekLabel: weekLabel,
      updatedAt: new Date().toISOString()
    };
  }

  const lastRow = sheet.getLastRow();
  const firstRow = CAS_FIRST_DATA_ROW;
  const rows = sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 8).getValues();
  const donations = rows
    .map((row) => ({
      receivedAt: row[0] instanceof Date ? row[0] : new Date(row[0]),
      id: String(row[1] || ''),
      createdAt: String(row[2] || ''),
      type: String(row[3] || ''),
      name: String(row[4] || '').trim() || 'Anonim',
      amount: Math.max(0, Number(row[5] || 0)),
      message: String(row[7] || '').trim(),
      eventDate: parseSupportDate_(row[2], row[0])
    }))
    .filter((item) => item.amount > 0 && item.eventDate)
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());

  const weeklyDonations = donations.filter((item) => (
    item.eventDate.getTime() >= week.start.getTime() &&
    item.eventDate.getTime() < week.end.getTime()
  ));

  const totalsByName = {};
  donations.forEach((item) => {
    const key = item.name.toLocaleLowerCase('id-ID');
    if (!totalsByName[key]) totalsByName[key] = { name: item.name, amount: 0, count: 0 };
    totalsByName[key].amount += item.amount;
    totalsByName[key].count += 1;
  });

  const leaderboard = Object.keys(totalsByName)
    .map((key) => totalsByName[key])
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, 'id-ID'))
    .slice(0, leaderboardLimit);

  const total = weeklyDonations.reduce((sum, item) => sum + item.amount, 0);

  return {
    recent: weeklyDonations.slice(0, recentLimit).map((item) => ({
      name: item.name,
      amount: item.amount,
      message: item.message,
      createdAt: item.eventDate.toISOString()
    })),
    leaderboard: leaderboard,
    total: total,
    target: target,
    milestoneLabel: String(config.milestoneLabel || 'Target dukungan'),
    progressPercent: target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0,
    weekStart: week.start.toISOString(),
    weekEnd: new Date(week.end.getTime() - 1).toISOString(),
    weekLabel: weekLabel,
    updatedAt: new Date().toISOString()
  };
}

function getJakartaWeekRange_(now) {
  const jakartaNow = new Date(now.getTime() + CAS_WIB_OFFSET_MS);
  const daysSinceMonday = (jakartaNow.getUTCDay() + 6) % 7;
  const mondayWallTime = Date.UTC(
    jakartaNow.getUTCFullYear(),
    jakartaNow.getUTCMonth(),
    jakartaNow.getUTCDate() - daysSinceMonday,
    0,
    0,
    0,
    0
  );
  const start = new Date(mondayWallTime - CAS_WIB_OFFSET_MS);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

  return { start: start, end: end };
}

function parseSupportDate_(createdAt, receivedAt) {
  const rawCreatedAt = String(createdAt || '').trim();
  const normalizedCreatedAt = rawCreatedAt.replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T');
  const eventDate = new Date(normalizedCreatedAt);

  if (normalizedCreatedAt && !isNaN(eventDate.getTime())) return eventDate;

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

  if (first.month === last.month && first.year === last.year) {
    return 'Senin ' + first.day + ' ' + months[first.month] + ' ' + first.year +
      ' s.d. ' + last.day + ' ' + months[last.month] + ' ' + last.year;
  }

  return 'Senin ' + first.day + ' ' + months[first.month] + ' ' + first.year +
    ' s.d. ' + last.day + ' ' + months[last.month] + ' ' + last.year;
}

function getJakartaDateParts_(date) {
  const jakartaDate = new Date(date.getTime() + CAS_WIB_OFFSET_MS);
  return {
    day: jakartaDate.getUTCDate(),
    month: jakartaDate.getUTCMonth(),
    year: jakartaDate.getUTCFullYear()
  };
}

function normalizeDonationPayload_(payload) {
  const nested = payload && typeof payload.data === 'object' && payload.data !== null ? payload.data : {};
  const source = Object.assign({}, payload || {}, nested);
  const etc = source.etc && typeof source.etc === 'object' ? source.etc : {};

  return {
    id: String(firstDefined_(source.id, source.donation_id, source.transaction_id, Utilities.getUuid())),
    createdAt: String(firstDefined_(source.created_at, source.createdAt, source.timestamp, new Date().toISOString())),
    type: String(firstDefined_(source.type, source.event, 'donation')),
    name: String(firstDefined_(source.donator_name, source.donor_name, source.donatorName, source.name, 'Anonim')),
    amount: Math.max(0, Number(firstDefined_(source.amount_raw, source.amount, etc.amount_to_display, 0)) || 0),
    cut: Math.max(0, Number(firstDefined_(source.cut, source.fee, 0)) || 0),
    message: String(firstDefined_(source.message, source.donateMessage, source.note, ''))
  };
}

function firstDefined_() {
  for (let i = 0; i < arguments.length; i += 1) {
    if (arguments[i] !== undefined && arguments[i] !== null && arguments[i] !== '') return arguments[i];
  }
  return '';
}

function redactSensitiveFields_(value) {
  if (Array.isArray(value)) return value.map(redactSensitiveFields_);
  if (!value || typeof value !== 'object') return value;

  return Object.keys(value).reduce((result, key) => {
    if (/email|phone|telepon|whatsapp|contact/i.test(key)) {
      result[key] = '[DIHAPUS]';
    } else {
      result[key] = redactSensitiveFields_(value[key]);
    }
    return result;
  }, {});
}

function safeSheetText_(value, maxLength) {
  let text = String(value === undefined || value === null ? '' : value).slice(0, maxLength || 500);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function supportIdExists_(sheet, id) {
  if (!id || sheet.getLastRow() < CAS_FIRST_DATA_ROW) return false;
  return sheet
    .getRange(CAS_FIRST_DATA_ROW, 2, sheet.getLastRow() - CAS_FIRST_DATA_ROW + 1, 1)
    .createTextFinder(String(id))
    .matchEntireCell(true)
    .findNext() !== null;
}

function ensureSupportSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CAS_SUPPORT_SHEET);
  if (sheet) return sheet;

  sheet = spreadsheet.insertSheet(CAS_SUPPORT_SHEET);
  sheet.getRange('A1:I2').merge().setValue('Dukungan Saweria\nDiisi otomatis melalui webhook');
  sheet.getRange('A4:I4').setValues([[
    'Diterima', 'ID Transaksi', 'Waktu Saweria', 'Tipe', 'Nama Tampilan',
    'Nominal', 'Potongan', 'Pesan', 'Payload Aman'
  ]]);
  sheet.setFrozenRows(4);
  return sheet;
}

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppConfig_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAS_CONFIG_SHEET);
  if (!sheet) throw new Error('Tab CONFIG tidak ditemukan.');

  const lastRow = sheet.getLastRow();
  if (lastRow < CAS_FIRST_DATA_ROW) return {};

  const rows = sheet
    .getRange(CAS_FIRST_DATA_ROW, 1, lastRow - CAS_FIRST_DATA_ROW + 1, 2)
    .getDisplayValues();

  return rows.reduce((result, row) => {
    const key = String(row[0] || '').trim();
    if (key) result[key] = String(row[1] || '').trim();
    return result;
  }, {});
}

function getPicList_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAS_PIC_SHEET);
  if (!sheet || sheet.getLastRow() < CAS_FIRST_DATA_ROW) return [];

  const rows = sheet
    .getRange(CAS_FIRST_DATA_ROW, 1, sheet.getLastRow() - CAS_FIRST_DATA_ROW + 1, 6)
    .getValues();

  return rows
    .filter((row) => row[5] === true && String(row[1] || '').trim())
    .sort((a, b) => Number(a[0] || 999) - Number(b[0] || 999))
    .map((row) => ({
      order: Number(row[0] || 0),
      name: String(row[1] || '').trim(),
      unit: String(row[2] || '').trim(),
      channel: String(row[3] || '').trim(),
      url: String(row[4] || '').trim()
    }));
}

function tambahPic() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAS_PIC_SHEET);
  if (!sheet) throw new Error('Tab PIC tidak ditemukan.');

  const lastRow = Math.max(sheet.getLastRow(), CAS_FIRST_DATA_ROW - 1);
  const targetRow = lastRow + 1;
  const nextNumber = Math.max(1, lastRow - CAS_FIRST_DATA_ROW + 2);

  sheet.getRange(targetRow, 1, 1, 6).setValues([[
    nextNumber,
    'PIC ' + nextNumber,
    'Isi unit/jabatan',
    'WhatsApp',
    'GANTI_DENGAN_URL_PIC_' + nextNumber,
    true
  ]]);

  sheet
    .getRange(CAS_FIRST_DATA_ROW, 1, 1, 6)
    .copyFormatToRange(sheet, 1, 6, targetRow, targetRow);

  const channelRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['WhatsApp', 'Google Chat', 'Email', 'Telepon', 'Lainnya'], true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(targetRow, 4).setDataValidation(channelRule);
  sheet.getRange(targetRow, 6).insertCheckboxes().setValue(true);
  sheet.getRange(targetRow, 1, 1, 6).activate();
}

function kurangiPicTerakhir() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CAS_PIC_SHEET);
  if (!sheet) throw new Error('Tab PIC tidak ditemukan.');

  const lastRow = sheet.getLastRow();
  const ui = SpreadsheetApp.getUi();

  if (lastRow < CAS_FIRST_DATA_ROW) {
    ui.alert('Belum ada PIC yang bisa dikurangi.');
    return;
  }

  if (lastRow === CAS_FIRST_DATA_ROW) {
    ui.alert('Minimal satu PIC harus tetap tersedia. Nonaktifkan checkbox jika PIC tidak ingin ditampilkan.');
    return;
  }

  const picName = sheet.getRange(lastRow, 2).getDisplayValue() || ('baris ' + lastRow);
  const answer = ui.alert(
    'Kurangi PIC',
    'Hapus PIC terakhir: ' + picName + '?',
    ui.ButtonSet.YES_NO
  );

  if (answer === ui.Button.YES) {
    sheet.deleteRow(lastRow);
  }
}
