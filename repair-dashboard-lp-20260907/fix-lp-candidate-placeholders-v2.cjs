const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'lp-repair-candidate', 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts');
let source = fs.readFileSync(file, 'utf8');
const changes = [
  ['where.push(`(lp.no_laporan ilike ${params.length} or lp.satker_nama ilike ${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike ${params.length}))`);', 'where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $${params.length}))`);', 'search'],
  ['where.push(`lp.penanganan_level = ${params.length}`);', 'where.push(`lp.penanganan_level = $${params.length}`);', 'level'],
  ['where.push(`lp.model_lp = ${params.length}`);', 'where.push(`lp.model_lp = $${params.length}`);', 'model'],
  ["where.push(`coalesce((select sm.code from bdb_status_master sm where sm.id=lp.status_id),'LP') = ${params.length}`);", "where.push(`coalesce((select sm.code from bdb_status_master sm where sm.id=lp.status_id),'LP') = $${params.length}`);", 'status']
];
for (const [from, to, label] of changes) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one broken placeholder, found ${count}`);
  // Function replacement is required: a string replacement would interpret $$ as one $.
  source = source.replace(from, () => to);
}
const fixed = (source.match(/\$\$\{params\.length\}/g) || []).length;
if (fixed < 4) throw new Error(`expected at least four fixed placeholders, found ${fixed}`);
fs.writeFileSync(file, source);
console.log(JSON.stringify({ fixed: true, file, placeholderMarkers: fixed }));
