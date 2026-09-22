const fs = require('fs');

function replaceExactlyOnce(path, before, after) {
  const source = fs.readFileSync(path, 'utf8');
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`Target patch tidak ditemukan: ${path}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`Target patch tidak unik: ${path}`);
  fs.writeFileSync(path, source.slice(0, first) + after + source.slice(first + before.length));
}

const tsPath = '/usr/src/app/src/bdb/workflow/workflow.service.ts';
const jsPath = '/usr/src/app/dist/bdb/workflow/workflow.service.js';

const tsBefore = `        if (body.id) {
            await this.dataSource.query(
                \`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1\`,
                [body.id, ...vals]
            );
            return { status: 1, data: { id: body.id }, message: 'Jenis surat diperbarui.' };
        }`;

const tsAfter = `        if (body.id) {
            const updated = await this.dataSource.query(
                \`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, dokumen_prasyarat_id\`,
                [body.id, ...vals]
            );
            if (!updated.length) throw new NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            if (savedPrerequisite !== requestedPrerequisite) {
                throw new BadRequestException('Perubahan dokumen prasyarat tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), dokumen_prasyarat_id: savedPrerequisite }, message: 'Jenis surat diperbarui.' };
        }`;

const jsBefore = `        if (body.id) {
            await this.dataSource.query(\`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1\`, [body.id, ...vals]);
            return { status: 1, data: { id: body.id }, message: 'Jenis surat diperbarui.' };
        }`;

const jsAfter = `        if (body.id) {
            const updated = await this.dataSource.query(\`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, dokumen_prasyarat_id\`, [body.id, ...vals]);
            if (!updated.length)
                throw new common_1.NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            if (savedPrerequisite !== requestedPrerequisite) {
                throw new common_1.BadRequestException('Perubahan dokumen prasyarat tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), dokumen_prasyarat_id: savedPrerequisite }, message: 'Jenis surat diperbarui.' };
        }`;

replaceExactlyOnce(tsPath, tsBefore, tsAfter);
replaceExactlyOnce(jsPath, jsBefore, jsAfter);
console.log('BACKEND_PATCHED=1');

