const fs = require('fs');

const sourcePath = process.argv[2];
const outputPath = process.argv[3];
if (!sourcePath || !outputPath) throw new Error('source dan output wajib');

function replaceExactlyOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`Target ${label} tidak ditemukan`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`Target ${label} tidak unik`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

let source = fs.readFileSync(sourcePath, 'utf8');

source = replaceExactlyOnce(
  source,
  'onChange:e=>p(e.target.value),rows:12',
  'onChange:e=>{let t=e.target.value;p(t);try{let e=JSON.parse(t),n=Array.isArray(e?.fields)?e.fields:Array.isArray(e)?e:null;if(!n)throw Error("no fields");a(n),f("")}catch{f("JSON belum valid — perubahan terakhir belum akan disimpan.")}},rows:12',
  'sinkronisasi editor JSON'
);

source = replaceExactlyOnce(
  source,
  '(0,v.assertOk)(await v.apiAuth.post("/bdb/wf/document-types",{id:G.id,code:G.code,nama:G.nama,status_prasyarat_id:G.status_prasyarat_id||null,dokumen_prasyarat_id:G.dokumen_prasyarat_id??null,status_target_id:G.status_target_id||null,urutan_tahap:G.urutan_tahap||0,aktif:G.aktif??!0,form_schema:{fields:t}})),',
  'let n=(0,v.assertOk)(await v.apiAuth.post("/bdb/wf/document-types",{id:G.id,code:G.code,nama:G.nama,status_prasyarat_id:G.status_prasyarat_id||null,dokumen_prasyarat_id:G.dokumen_prasyarat_id??null,status_target_id:G.status_target_id||null,urutan_tahap:G.urutan_tahap||0,aktif:G.aktif??!0,form_schema:{fields:t}})),a=(0,v.assertOk)(await v.apiAuth.get(`/bdb/wf/document-types/${encodeURIComponent(G.code)}/schema`)),r=e=>Array.isArray(e)?e.map(r):e&&"object"==typeof e?Object.fromEntries(Object.keys(e).sort().map(t=>[t,r(e[t])])):e;if(JSON.stringify(r(a.form_schema?.fields||[]))!==JSON.stringify(r(t)))throw Error("Konfigurasi field belum tersimpan di database. Silakan coba lagi.");',
  'verifikasi baca balik field'
);

source = replaceExactlyOnce(
  source,
  'e.current?.show({severity:"success",summary:"Tersimpan",detail:"Jenis surat disimpan"}),K(!1),await M()',
  'e.current?.show({severity:"success",summary:"Tersimpan",detail:"Konfigurasi field sudah tersimpan di database."}),K(!1),await M()',
  'pesan sukses terverifikasi'
);

source = replaceExactlyOnce(
  source,
  'detail:t.response?.data?.message||"Gagal menyimpan"',
  'detail:t.response?.data?.message||t.message||"Gagal menyimpan"',
  'pesan error verifikasi'
);

fs.writeFileSync(outputPath, source);
console.log('FRONTEND_FIELD_SAVE_V2_PATCHED=1');
