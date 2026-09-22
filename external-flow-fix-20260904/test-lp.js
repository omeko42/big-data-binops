'use strict';
const fs = require('fs');
const Module = require('module');
const path = require('path');
const assert = require('node:assert/strict');

const dir = '/tmp/external-flow-fix-20260904';
function load(file, liveFile) {
  const m = new Module(liveFile, module);
  m.filename = liveFile;
  m.paths = Module._nodeModulePaths(path.dirname(liveFile));
  m._compile(fs.readFileSync(file, 'utf8'), liveFile);
  return m.exports;
}

const laporanLive = '/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js';
const pelimpahanLive = '/usr/src/app/dist/bdb/lp-pelimpahan/lp-pelimpahan.service.js';
const laporanFile = process.env.VERIFY_LIVE === '1' ? laporanLive : `${dir}/laporan-polisi.service.js`;
const pelimpahanFile = process.env.VERIFY_LIVE === '1' ? pelimpahanLive : `${dir}/lp-pelimpahan.service.js`;
const laporanCode = fs.readFileSync(laporanFile, 'utf8');
const pelimpahanCode = fs.readFileSync(pelimpahanFile, 'utf8');
for (const marker of [
  'satker_eksternal_nama ilike',
  "r.satker_nama = r.satker_eksternal_nama",
  'dilimpahkan_eksternal=false',
  'rollback_pelimpahan_eksternal',
  'Pelimpahan eksternal dibatalkan'
]) assert.ok(laporanCode.includes(marker), `missing laporan contract: ${marker}`);
assert.ok(pelimpahanCode.includes('case when lp.dilimpahkan_eksternal then'));
assert.ok(pelimpahanCode.includes('else coalesce(lp.unit_satker_nama, lp.satker_nama) end as tujuan_terakhir_nama'));

const scopeUtil = require('/usr/src/app/dist/bdb/common/scope.util.js');
const oldResolveScope = scopeUtil.resolveScope;
scopeUtil.resolveScope = async () => ({ all: true, isSuper: true, satkerId: null });

(async () => {
  try {
    const { LaporanPolisiService } = load(laporanFile, laporanLive);
    let updateSql = '';
    let auditEntry = null;
    const listDs = {
      query: async (sql) => {
        if (/select count\(\*\)::int c from bdb_laporan_polisi/.test(sql)) return [{ c: 1 }];
        if (/select lp\.id, lp\.dors_lp_id/.test(sql)) return [{
          id: 71,
          dors_lp_id: 1,
          satker_id: 11,
          satker_nama: 'SATKER ASAL',
          unit_satker_id: 12,
          unit_satker_nama: 'UNIT ASAL',
          unit_satker_kode: 'UNIT-ASAL',
          unit_nama: 'DITKRIMSUS',
          unit_level: 'polda',
          kode_pusiknas: 'OLD-CODE',
          penanganan_level: 'Polres',
          dilimpahkan_eksternal: true,
          satker_eksternal_id: 91,
          satker_eksternal_nama: 'INSTANSI TUJUAN'
        }];
        throw new Error(`unexpected list query: ${String(sql).slice(0, 80)}`);
      }
    };
    const listService = new LaporanPolisiService(listDs, { log: async () => {} });
    listService.ensureTable = async () => {};
    const listed = await listService.list({ page: 1, row: 25 }, 1);
    assert.equal(listed.data[0].satker_nama, 'INSTANSI TUJUAN');
    assert.equal(listed.data[0].satker_asal_nama, 'UNIT ASAL');
    assert.equal(listed.data[0].satker_id, null);
    assert.equal(listed.data[0].unit_satker_id, null);
    assert.equal(listed.data[0].unit_satker_nama, null);
    assert.equal(listed.data[0].unit_nama, null);
    assert.equal(listed.data[0].unit_level, null);
    assert.equal(listed.data[0].kode_pusiknas, null);
    assert.equal(listed.data[0].penanganan_level, 'Eksternal');

    const correctionDs = {
      query: async (sql) => {
        if (/select id, no_laporan, satker_id/.test(sql)) return [{ id: 71, no_laporan: 'REDACTED', satker_id: 11, satker_nama: 'SATKER ASAL', unit_satker_id: null, unit_satker_nama: null, dilimpahkan_eksternal: true }];
        if (/^update bdb_laporan_polisi/.test(String(sql).trim())) { updateSql = sql; return []; }
        if (/select name from auth_users/.test(sql)) return [];
        throw new Error(`unexpected correction query: ${String(sql).slice(0, 80)}`);
      }
    };
    const correctionService = new LaporanPolisiService(correctionDs, { log: async (entry) => { auditEntry = entry; } });
    correctionService.ensureTable = async () => {};
    correctionService.resolveSatkerPlacement = async () => ({
      selected: { id: 11, deskripsi: 'SATKER ASAL' },
      satker: { id: 11, deskripsi: 'SATKER ASAL' },
      unit: null
    });
    const corrected = await correctionService.correctSatker(71, 11, 'koreksi tujuan', 1);
    assert.match(updateSql, /dilimpahkan_eksternal=false/);
    assert.match(corrected.message, /dibatalkan/);
    assert.equal(auditEntry.meta.rollback_pelimpahan_eksternal, true);

    const { LpPelimpahanService } = load(pelimpahanFile, pelimpahanLive);
    let archiveSql = '';
    const archiveDs = { query: async (sql) => {
      if (/select count\(\*\)::int as c/.test(sql)) return [{ c: 0 }];
      if (/select lp\.id, lp\.no_laporan/.test(sql)) { archiveSql = sql; return []; }
      throw new Error(`unexpected archive query: ${String(sql).slice(0, 80)}`);
    }};
    const archiveService = new LpPelimpahanService(archiveDs, {});
    archiveService.ensureTable = async () => {};
    await archiveService.arsip({ userId: 1, page: 1, row: 25 });
    assert.match(archiveSql, /case when lp\.dilimpahkan_eksternal then/);
    assert.match(archiveSql, /else coalesce\(lp\.unit_satker_nama, lp\.satker_nama\)/);

    console.log(JSON.stringify({ verified: true, live: process.env.VERIFY_LIVE === '1', listUsesExternalDestination: true, oldInternalLabelsCleared: true, superadminSameOriginRollback: true, statusMutation: false, archiveUsesEffectiveDestination: true, caseContentRead: false }));
  } finally {
    scopeUtil.resolveScope = oldResolveScope;
  }
})().catch((error) => { console.error(error.stack); process.exitCode = 1; });
