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
  'e.current?.show({severity:"success",summary:"Tersimpan",detail:"Jenis surat disimpan"}),K(!1),await M()',
  'e.current?.show({severity:"success",summary:"Tersimpan",detail:"Konfigurasi field sudah tersimpan di database."}),K(!1),await M()',
  'pesan sukses terverifikasi'
);

fs.writeFileSync(outputPath, source);
console.log('FRONTEND_FIELD_SAVE_PATCHED=1');
