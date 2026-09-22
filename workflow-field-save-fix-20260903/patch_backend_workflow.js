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
        }
        const r = await this.dataSource.query(
            \`insert into bdb_document_type_master (\${cols.join(',')}) values ($1,$2,$3,$4,$5,$6::jsonb,$7)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id\`,
            [vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], vals[6], vals[7]]
        );
        return { status: 1, data: { id: r[0].id }, message: 'Jenis surat disimpan.' };`;

const tsAfter = `        const requestedSchema = body.form_schema && typeof body.form_schema === 'object' ? body.form_schema : { fields: [] };
        if (!Array.isArray(requestedSchema.fields)) throw new BadRequestException('Format field formulir tidak valid.');
        if (body.id) {
            const updated = await this.dataSource.query(
                \`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, code, dokumen_prasyarat_id, form_schema, updated_at\`,
                [body.id, ...vals]
            );
            if (!updated.length) throw new NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            const savedFields = updated[0].form_schema?.fields;
            if (savedPrerequisite !== requestedPrerequisite || JSON.stringify(savedFields) !== JSON.stringify(requestedSchema.fields)) {
                throw new BadRequestException('Perubahan konfigurasi formulir tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), code: updated[0].code, dokumen_prasyarat_id: savedPrerequisite, form_schema: updated[0].form_schema, updated_at: updated[0].updated_at }, message: 'Jenis surat diperbarui.' };
        }
        const r = await this.dataSource.query(
            \`insert into bdb_document_type_master (\${cols.join(',')}) values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id, code, dokumen_prasyarat_id, form_schema, updated_at\`,
            vals
        );
        return { status: 1, data: { id: Number(r[0].id), code: r[0].code, dokumen_prasyarat_id: r[0].dokumen_prasyarat_id == null ? null : Number(r[0].dokumen_prasyarat_id), form_schema: r[0].form_schema, updated_at: r[0].updated_at }, message: 'Jenis surat disimpan.' };`;

const jsBefore = `        if (body.id) {
            const updated = await this.dataSource.query(\`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, dokumen_prasyarat_id\`, [body.id, ...vals]);
            if (!updated.length)
                throw new common_1.NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            if (savedPrerequisite !== requestedPrerequisite) {
                throw new common_1.BadRequestException('Perubahan dokumen prasyarat tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), dokumen_prasyarat_id: savedPrerequisite }, message: 'Jenis surat diperbarui.' };
        }
        const r = await this.dataSource.query(\`insert into bdb_document_type_master (\${cols.join(',')}) values ($1,$2,$3,$4,$5,$6::jsonb,$7)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id\`, [vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], vals[6], vals[7]]);
        return { status: 1, data: { id: r[0].id }, message: 'Jenis surat disimpan.' };`;

const jsAfter = `        const requestedSchema = body.form_schema && typeof body.form_schema === 'object' ? body.form_schema : { fields: [] };
        if (!Array.isArray(requestedSchema.fields))
            throw new common_1.BadRequestException('Format field formulir tidak valid.');
        if (body.id) {
            const updated = await this.dataSource.query(\`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, code, dokumen_prasyarat_id, form_schema, updated_at\`, [body.id, ...vals]);
            if (!updated.length)
                throw new common_1.NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            const savedFields = updated[0].form_schema?.fields;
            if (savedPrerequisite !== requestedPrerequisite || JSON.stringify(savedFields) !== JSON.stringify(requestedSchema.fields)) {
                throw new common_1.BadRequestException('Perubahan konfigurasi formulir tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), code: updated[0].code, dokumen_prasyarat_id: savedPrerequisite, form_schema: updated[0].form_schema, updated_at: updated[0].updated_at }, message: 'Jenis surat diperbarui.' };
        }
        const r = await this.dataSource.query(\`insert into bdb_document_type_master (\${cols.join(',')}) values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id, code, dokumen_prasyarat_id, form_schema, updated_at\`, vals);
        return { status: 1, data: { id: Number(r[0].id), code: r[0].code, dokumen_prasyarat_id: r[0].dokumen_prasyarat_id == null ? null : Number(r[0].dokumen_prasyarat_id), form_schema: r[0].form_schema, updated_at: r[0].updated_at }, message: 'Jenis surat disimpan.' };`;

replaceExactlyOnce(tsPath, tsBefore, tsAfter);
replaceExactlyOnce(jsPath, jsBefore, jsAfter);
console.log('BACKEND_FIELD_SAVE_PATCHED=1');
