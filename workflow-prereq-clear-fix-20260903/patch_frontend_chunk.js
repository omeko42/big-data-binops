const fs = require('fs');

const sourcePath = process.argv[2];
const outputPath = process.argv[3];
if (!sourcePath || !outputPath) throw new Error('source dan output wajib');

let source = fs.readFileSync(sourcePath, 'utf8');
const before = 'await v.apiAuth.post("/bdb/wf/document-types",{id:G.id,code:G.code,nama:G.nama,status_prasyarat_id:G.status_prasyarat_id||null,dokumen_prasyarat_id:G.dokumen_prasyarat_id||null,status_target_id:G.status_target_id||null,urutan_tahap:G.urutan_tahap||0,aktif:G.aktif??!0,form_schema:{fields:t}}),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Jenis surat disimpan"})';
const after = '(0,v.assertOk)(await v.apiAuth.post("/bdb/wf/document-types",{id:G.id,code:G.code,nama:G.nama,status_prasyarat_id:G.status_prasyarat_id||null,dokumen_prasyarat_id:G.dokumen_prasyarat_id??null,status_target_id:G.status_target_id||null,urutan_tahap:G.urutan_tahap||0,aktif:G.aktif??!0,form_schema:{fields:t}})),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Jenis surat disimpan"})';
const first = source.indexOf(before);
if (first < 0) throw new Error('Target simpan jenis surat tidak ditemukan');
if (source.indexOf(before, first + before.length) >= 0) throw new Error('Target simpan jenis surat tidak unik');
source = source.slice(0, first) + after + source.slice(first + before.length);
fs.writeFileSync(outputPath, source);
console.log('FRONTEND_PATCHED=1');

