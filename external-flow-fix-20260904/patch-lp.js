const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'candidate');
function once(text, oldText, newText, label) {
  text = text.replace(/\r\n/g, '\n');
  oldText = oldText.replace(/\r\n/g, '\n');
  newText = newText.replace(/\r\n/g, '\n');
  const first = text.indexOf(oldText);
  if (first < 0 || first !== text.lastIndexOf(oldText)) throw new Error(`${label}: expected exactly one anchor`);
  return text.slice(0, first) + newText + text.slice(first + oldText.length);
}

for (const ext of ['ts', 'js']) {
  const file = path.join(dir, `laporan-polisi.service.${ext}`);
  let code = fs.readFileSync(file, 'utf8');
  code = once(code,
    "where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length})`);",
    "where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $${params.length}))`);",
    `${ext} search external target`);
  code = once(code,
    '                    lp.unit_satker_id, lp.unit_satker_nama, lp.unit_satker_kode, lp.data_scope, lp.status, lp.synced_at,',
    [
      '                    lp.unit_satker_id, lp.unit_satker_nama, lp.unit_satker_kode, lp.data_scope, lp.status, lp.synced_at,',
      '                    lp.dilimpahkan_eksternal,',
      '                    (select px.satker_eksternal_id from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null order by px.created_at desc, px.id desc limit 1) as satker_eksternal_id,',
      '                    (select px.satker_eksternal_nama from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null order by px.created_at desc, px.id desc limit 1) as satker_eksternal_nama,'
    ].join('\n'),
    `${ext} list external fields`);
  const pidLine = ext === 'ts' ? '            r.pid = encodeId(r.id);' : '            r.pid = (0, id_cipher_util_1.encodeId)(r.id);';
  const revealLine = ext === 'ts'
    ? '            if (!revealDors) r.dors_lp_id = null; // ID DORS hanya untuk superadmin'
    : '            if (!revealDors)\n                r.dors_lp_id = null;';
  code = once(code, [pidLine, revealLine].join('\n'), [
    pidLine,
    '            if (r.dilimpahkan_eksternal && r.satker_eksternal_nama) {',
    '                r.satker_asal_id = r.unit_satker_id ?? r.satker_id;',
    '                r.satker_asal_nama = r.unit_satker_nama ?? r.satker_nama;',
    '                // UI lama membaca satker_nama/unit_satker_nama. Untuk tujuan eksternal,',
    '                // arahkan field tampilan yang sama ke tabel satker eksternal tanpa memalsukan FK internal.',
    '                r.satker_id = null;',
    '                r.satker_nama = r.satker_eksternal_nama;',
    '                r.unit_satker_id = null;',
    '                r.unit_satker_nama = null;',
    '                r.unit_satker_kode = null;',
    "                r.penanganan_level = 'Eksternal';",
    '            }',
    revealLine
  ].join('\n'), `${ext} list display mapping`);
  if (ext === 'js') {
    code = once(code,
      "select id, no_laporan, satker_id, satker_nama, unit_satker_id, unit_satker_nama from bdb_laporan_polisi where id=$1",
      "select id, no_laporan, satker_id, satker_nama, unit_satker_id, unit_satker_nama, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1",
      `${ext} correction state`);
    code = once(code,
      '        if (Number(lp.satker_id) === Number(placement.satker.id) &&',
      '        if (!lp.dilimpahkan_eksternal && Number(lp.satker_id) === Number(placement.satker.id) &&',
      `${ext} allow external rollback to same origin`);
    code = once(code,
      '                 unit_satker_id=$4, unit_satker_nama=$5, unit_satker_kode=$6,\n                 updated_at=now()',
      '                 unit_satker_id=$4, unit_satker_nama=$5, unit_satker_kode=$6,\n                 dilimpahkan_eksternal=false, updated_at=now()',
      `${ext} clear external active flag`);
  } else {
    code = once(code,
      "select id, no_laporan, satker_id, satker_nama from bdb_laporan_polisi where id=$1",
      "select id, no_laporan, satker_id, satker_nama, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1",
      `${ext} correction state`);
    code = once(code,
      '        if (Number(lp.satker_id) === Number(satker.id)) {',
      '        if (!lp.dilimpahkan_eksternal && Number(lp.satker_id) === Number(satker.id)) {',
      `${ext} allow external rollback to same origin`);
    code = once(code,
      '             set satker_id=$2, satker_nama=$3, unit_satker_id=null, unit_satker_nama=null, unit_satker_kode=null, updated_at=now()',
      '             set satker_id=$2, satker_nama=$3, unit_satker_id=null, unit_satker_nama=null, unit_satker_kode=null, dilimpahkan_eksternal=false, updated_at=now()',
      `${ext} clear external active flag`);
  }
  code = once(code,
    '                keterangan: keterangan || null',
    '                keterangan: keterangan || null,\n                rollback_pelimpahan_eksternal: !!lp.dilimpahkan_eksternal',
    `${ext} audit rollback flag`);
  if (ext === 'js') {
    code = once(code,
      '            message: `Satker penanganan diperbarui ke "${selected.deskripsi}".`',
      '            message: lp.dilimpahkan_eksternal\n                ? `Pelimpahan eksternal dibatalkan dan penanganan dikembalikan ke "${selected.deskripsi}".`\n                : `Satker penanganan diperbarui ke "${selected.deskripsi}".`',
      `${ext} correction message`);
  } else {
    code = once(code,
      '        return { status: 1, data: { id, satker_id: satker.id, satker_nama: satker.deskripsi }, message: `Satker penanganan diperbarui ke "${satker.deskripsi}".` };',
      '        return { status: 1, data: { id, satker_id: satker.id, satker_nama: satker.deskripsi }, message: lp.dilimpahkan_eksternal ? `Pelimpahan eksternal dibatalkan dan penanganan dikembalikan ke "${satker.deskripsi}".` : `Satker penanganan diperbarui ke "${satker.deskripsi}".` };',
      `${ext} correction message`);
  }
  fs.writeFileSync(file, code);
}

for (const ext of ['ts', 'js']) {
  const file = path.join(dir, `lp-pelimpahan.service.${ext}`);
  let code = fs.readFileSync(file, 'utf8');
  code = once(code,
    '                    (select coalesce(p5.satker_tujuan_nama, p5.satker_eksternal_nama) from bdb_lp_pelimpahan p5 where p5.lp_id = lp.id order by p5.created_at desc limit 1) as tujuan_terakhir_nama',
    [
      '                    case when lp.dilimpahkan_eksternal then',
      '                        (select coalesce(p5.satker_tujuan_nama, p5.satker_eksternal_nama) from bdb_lp_pelimpahan p5 where p5.lp_id = lp.id order by p5.created_at desc, p5.id desc limit 1)',
      '                    else coalesce(lp.unit_satker_nama, lp.satker_nama) end as tujuan_terakhir_nama'
    ].join('\n'),
    `${ext} archive effective target`);
  code = once(code,
    'lp.satker_id as satker_saat_ini_id, lp.satker_nama as satker_saat_ini_nama,',
    'coalesce(lp.unit_satker_id, lp.satker_id) as satker_saat_ini_id, coalesce(lp.unit_satker_nama, lp.satker_nama) as satker_saat_ini_nama,',
    `${ext} archive effective internal owner`);
  fs.writeFileSync(file, code);
}
console.log(JSON.stringify({ patched: true, behavior: 'external_target_uses_existing_satker_display_and_correctSatker_rolls_back' }));
