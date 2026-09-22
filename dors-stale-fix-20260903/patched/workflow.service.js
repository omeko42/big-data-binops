"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
const minio_service_1 = require("../kerma/minio.service");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
const cluster_instance_util_1 = require("../common/cluster-instance.util");
const lp_scope_util_1 = require("../common/lp-scope.util");
function isFieldRequired(f, data) {
    if (!f.required)
        return false;
    if (f.visible_if && data[f.visible_if.field] !== f.visible_if.value)
        return false;
    return true;
}
let WorkflowService = class WorkflowService {
    dataSource;
    minio;
    audit;
    logger = new common_1.Logger('WorkflowService');
    constructor(dataSource, minio, audit) {
        this.dataSource = dataSource;
        this.minio = minio;
        this.audit = audit;
    }
    async assertLpAccess(lpId, userId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (scope.all)
            return;
        // Schema is deployment-owned; access checks must never acquire DDL locks.
        const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const satkerMatch = await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp[0], scope.satkerId);
        if (!satkerMatch || lp[0].dilimpahkan_eksternal) {
            throw new common_1.ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
        }
    }
    async statuses() {
        const rows = await this.dataSource.query(`select s.id, s.code, s.nama, s.urutan, s.kategori,
                    (s.code = 'LIMPAH_EKSTERNAL'
                     and not exists (select 1 from bdb_laporan_polisi lp where lp.status_id=s.id)
                     and not exists (select 1 from bdb_document_type_master d where d.status_prasyarat_id=s.id or d.status_target_id=s.id)
                    ) as can_delete
             from bdb_status_master s order by s.urutan, s.id`);
        return { status: 1, data: rows };
    }
    async saveStatus(body) {
        if (!body.code || !body.nama)
            throw new common_1.BadRequestException('code & nama wajib.');
        const kategori = body.kategori === 'CC' ? 'CC' : 'CT';
        if (body.id) {
            await this.dataSource.query('update bdb_status_master set code=$2, nama=$3, urutan=$4, kategori=$5 where id=$1', [body.id, body.code.trim().toUpperCase(), body.nama.trim(), Number(body.urutan) || 0, kategori]);
            return { status: 1, message: 'Status diperbarui.' };
        }
        const r = await this.dataSource.query('insert into bdb_status_master (code, nama, urutan, kategori) values ($1,$2,$3,$4) on conflict (code) do update set nama=excluded.nama, urutan=excluded.urutan, kategori=excluded.kategori returning id', [body.code.trim().toUpperCase(), body.nama.trim(), Number(body.urutan) || 0, kategori]);
        return { status: 1, data: { id: r[0].id }, message: 'Status disimpan.' };
    }
    async deleteStatus(id) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const rows = await runner.query('select id, code, nama from bdb_status_master where id=$1 for update', [id]);
            if (!rows.length)
                throw new common_1.NotFoundException('Status tidak ditemukan.');
            if (rows[0].code !== 'LIMPAH_EKSTERNAL')
                throw new common_1.BadRequestException('Status alur inti tidak boleh dihapus lewat aksi ini.');
            const refs = await runner.query(`select
                    (select count(*)::int from bdb_laporan_polisi where status_id=$1) as lp_count,
                    (select count(*)::int from bdb_document_type_master where status_prasyarat_id=$1 or status_target_id=$1) as document_type_count`, [id]);
            if (Number(refs[0]?.lp_count || 0) > 0 || Number(refs[0]?.document_type_count || 0) > 0)
                throw new common_1.BadRequestException('Status masih dipakai LP atau jenis surat dan tidak boleh dihapus.');
            await runner.query('delete from bdb_status_master where id=$1', [id]);
            await runner.commitTransaction();
            return { status: 1, message: `Status "${rows[0].nama}" dihapus.` };
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
    }
    async pasalList(search) {
        const params = [];
        let where = '';
        if (search && search.trim()) {
            params.push(`%${search.trim()}%`);
            where = `where nomor_pasal ilike $1 or deskripsi ilike $1 or uu_referensi ilike $1`;
        }
        const rows = await this.dataSource.query(`select id, nomor_pasal, deskripsi, uu_referensi from bdb_pasal_master ${where} order by nomor_pasal limit 200`, params);
        return { status: 1, data: rows };
    }
    async savePasal(body) {
        if (!body.nomor_pasal || !body.nomor_pasal.trim())
            throw new common_1.BadRequestException('Nomor pasal wajib.');
        if (body.id) {
            await this.dataSource.query('update bdb_pasal_master set nomor_pasal=$2, deskripsi=$3, uu_referensi=$4 where id=$1', [body.id, body.nomor_pasal.trim(), body.deskripsi ?? null, body.uu_referensi ?? null]);
            return { status: 1, data: { id: body.id }, message: 'Pasal diperbarui.' };
        }
        const r = await this.dataSource.query(`insert into bdb_pasal_master (nomor_pasal, deskripsi, uu_referensi) values ($1,$2,$3)
             on conflict (lower(nomor_pasal), lower(coalesce(uu_referensi,''))) do update set deskripsi=excluded.deskripsi returning id, nomor_pasal, deskripsi, uu_referensi`, [body.nomor_pasal.trim(), body.deskripsi ?? null, body.uu_referensi ?? null]);
        return { status: 1, data: r[0], message: 'Pasal disimpan.' };
    }
    async documentTypes(includeInactive = false) {
        const rows = await this.dataSource.query(`select d.id, d.code, d.nama, d.status_prasyarat_id, d.dokumen_prasyarat_id, d.status_target_id, d.urutan_tahap, d.form_schema, d.aktif,
                    sp.code as status_prasyarat_code, st.code as status_target_code, dp.code as dokumen_prasyarat_code, st.kategori as kategori
             from bdb_document_type_master d
             left join bdb_status_master sp on sp.id=d.status_prasyarat_id
             left join bdb_status_master st on st.id=d.status_target_id
             left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
             ${includeInactive ? '' : 'where d.aktif=true'}
             order by d.urutan_tahap, d.code`);
        return { status: 1, data: rows };
    }
    async schemaByCode(code) {
        const rows = await this.dataSource.query('select code, nama, form_schema from bdb_document_type_master where code=$1', [code]);
        if (!rows.length)
            throw new common_1.NotFoundException('Jenis surat tidak ditemukan.');
        return { status: 1, data: rows[0] };
    }
    async saveDocumentType(body) {
        const cols = ['code', 'nama', 'status_prasyarat_id', 'dokumen_prasyarat_id', 'status_target_id', 'urutan_tahap', 'form_schema', 'aktif'];
        const vals = [
            String(body.code || '').trim().toUpperCase(),
            String(body.nama || '').trim(),
            body.status_prasyarat_id || null,
            body.dokumen_prasyarat_id || null,
            body.status_target_id || null,
            Number(body.urutan_tahap) || 0,
            JSON.stringify(body.form_schema || { fields: [] }),
            body.aktif === undefined ? true : !!body.aktif
        ];
        if (!vals[0] || !vals[1])
            throw new common_1.BadRequestException('code & nama wajib.');
        if (body.id) {
            const updated = await this.dataSource.query(`update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, dokumen_prasyarat_id`, [body.id, ...vals]);
            if (!updated.length)
                throw new common_1.NotFoundException('Jenis surat tidak ditemukan.');
            const requestedPrerequisite = vals[3] == null ? null : Number(vals[3]);
            const savedPrerequisite = updated[0].dokumen_prasyarat_id == null ? null : Number(updated[0].dokumen_prasyarat_id);
            if (savedPrerequisite !== requestedPrerequisite) {
                throw new common_1.BadRequestException('Perubahan dokumen prasyarat tidak tersimpan. Silakan muat ulang dan coba lagi.');
            }
            return { status: 1, data: { id: Number(updated[0].id), dokumen_prasyarat_id: savedPrerequisite }, message: 'Jenis surat diperbarui.' };
        }
        const r = await this.dataSource.query(`insert into bdb_document_type_master (${cols.join(',')}) values ($1,$2,$3,$4,$5,$6::jsonb,$7)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id`, [vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], vals[6], vals[7]]);
        return { status: 1, data: { id: r[0].id }, message: 'Jenis surat disimpan.' };
    }
    async lpPasal(lpId) {
        const managed = await this.dataSource.query('select nomor_pasal, nama_kategori as deskripsi, uu_referensi from bdb_lp_tindak_pidana where lp_id=$1 and nomor_pasal is not null', [lpId]);
        const seen = new Set();
        const out = [];
        for (const m of managed) {
            const key = String(m.nomor_pasal).toLowerCase();
            if (seen.has(key))
                continue;
            seen.add(key);
            out.push({ nomor_pasal: String(m.nomor_pasal), deskripsi: m.deskripsi || null, uu_referensi: m.uu_referensi || null, sumber: 'dari_lp' });
        }
        const rows = await this.dataSource.query('select payload_json from bdb_laporan_polisi where id=$1', [lpId]);
        const tp = rows[0]?.payload_json?.tindak_pidana;
        if (Array.isArray(tp)) {
            for (const t of tp) {
                const nomor = t?.pasal_mapping || t?.pasal;
                if (nomor && !seen.has(String(nomor).toLowerCase())) {
                    seen.add(String(nomor).toLowerCase());
                    out.push({ nomor_pasal: String(nomor), deskripsi: t?.nama_kategori_kejahatan || null, uu_referensi: t?.nama_uu || null, sumber: 'dari_lp' });
                }
            }
        }
        return { status: 1, data: out };
    }
    async seedTindakPidanaIfEmpty(lpId) {
        const c = await this.dataSource.query('select count(*)::int n from bdb_lp_tindak_pidana where lp_id=$1', [lpId]);
        if (c[0].n > 0)
            return;
        const rows = await this.dataSource.query('select payload_json from bdb_laporan_polisi where id=$1', [lpId]);
        const tp = rows[0]?.payload_json?.tindak_pidana;
        if (!Array.isArray(tp) || !tp.length)
            return;
        for (const t of tp) {
            await this.dataSource.query(`insert into bdb_lp_tindak_pidana (lp_id, nomor_pasal, nama_kategori, uu_referensi, juncto, subsider, sumber)
                 values ($1,$2,$3,$4,$5,$6,'dugaan_lp')`, [lpId, t?.pasal_mapping || t?.pasal || null, t?.nama_kategori_kejahatan || null, t?.nama_uu || null, t?.juncto || null, t?.subsider || null]);
        }
    }
    async tindakPidanaList(lpId) {
        await this.seedTindakPidanaIfEmpty(lpId);
        const rows = await this.dataSource.query(`select id, pasal_id, nomor_pasal, nama_kategori, uu_referensi, ayat, juncto, subsider, sumber, sumber_ref, dokumen_id, created_at
             from bdb_lp_tindak_pidana where lp_id=$1
             order by case sumber when 'dugaan_lp' then 0 when 'dari_dokumen' then 1 else 2 end, id`, [lpId]);
        return { status: 1, data: rows };
    }
    async saveTindakPidana(lpId, body) {
        const vals = [
            body.nomor_pasal ? String(body.nomor_pasal).trim() : null,
            body.nama_kategori ? String(body.nama_kategori).trim() : null,
            body.uu_referensi ? String(body.uu_referensi).trim() : null,
            body.ayat ? String(body.ayat).trim() : null,
            body.juncto ? String(body.juncto).trim() : null,
            body.subsider ? String(body.subsider).trim() : null,
            body.pasal_id || null
        ];
        if (!vals[0] && !vals[1])
            throw new common_1.BadRequestException('Nomor pasal atau kategori wajib diisi.');
        if (body.id) {
            await this.dataSource.query(`update bdb_lp_tindak_pidana set nomor_pasal=$3, nama_kategori=$4, uu_referensi=$5, ayat=$6, juncto=$7, subsider=$8, pasal_id=$9, updated_at=now()
                 where id=$1 and lp_id=$2`, [body.id, lpId, ...vals]);
            return { status: 1, message: 'Tindak pidana diperbarui.' };
        }
        await this.dataSource.query(`insert into bdb_lp_tindak_pidana (lp_id, nomor_pasal, nama_kategori, uu_referensi, ayat, juncto, subsider, pasal_id, sumber)
             values ($1,$2,$3,$4,$5,$6,$7,$8,'manual')`, [lpId, ...vals]);
        return { status: 1, message: 'Tindak pidana ditambahkan.' };
    }
    async deleteTindakPidana(lpId, id) {
        const row = await this.dataSource.query('select sumber from bdb_lp_tindak_pidana where id=$1 and lp_id=$2', [id, lpId]);
        if (!row.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        if (row[0].sumber === 'dugaan_lp')
            throw new common_1.BadRequestException('Data dugaan tindak pidana dari DORS tidak boleh dihapus.');
        await this.dataSource.query('delete from bdb_lp_tindak_pidana where id=$1 and lp_id=$2', [id, lpId]);
        return { status: 1, message: 'Tindak pidana dihapus.' };
    }
    async importTindakPidanaFromDocs(lpId, typeCodes) {
        const codes = typeCodes && typeCodes.length ? typeCodes : ['SP_SIDIK'];
        const src = await this.dataSource.query(`select dp.nomor_pasal, dp.pasal_id, pm.deskripsi, pm.uu_referensi, d.id as dokumen_id, d.nomor_dokumen, dt.nama as type_nama
             from bdb_dokumen d
             join bdb_document_type_master dt on dt.id=d.document_type_id
             join bdb_dokumen_pasal dp on dp.dokumen_id=d.id
             left join bdb_pasal_master pm on pm.id=dp.pasal_id
             where d.lp_id=$1 and dt.code = any($2) and dp.nomor_pasal is not null
             order by d.id`, [lpId, codes]);
        const existing = await this.dataSource.query('select lower(nomor_pasal) as nomor_pasal from bdb_lp_tindak_pidana where lp_id=$1 and nomor_pasal is not null', [lpId]);
        const seen = new Set(existing.map((e) => e.nomor_pasal));
        let imported = 0;
        for (const s of src) {
            const key = String(s.nomor_pasal).toLowerCase();
            if (seen.has(key))
                continue;
            seen.add(key);
            await this.dataSource.query(`insert into bdb_lp_tindak_pidana (lp_id, pasal_id, nomor_pasal, nama_kategori, uu_referensi, sumber, sumber_ref, dokumen_id)
                 values ($1,$2,$3,$4,$5,'dari_dokumen',$6,$7)`, [lpId, s.pasal_id || null, s.nomor_pasal, s.deskripsi || null, s.uu_referensi || null, `${s.type_nama}${s.nomor_dokumen ? ' — ' + s.nomor_dokumen : ''}`, s.dokumen_id]);
            imported++;
        }
        return { status: 1, data: { imported, tersedia: src.length }, message: imported ? `${imported} pasal ditarik dari dokumen.` : 'Tidak ada pasal baru untuk ditarik (semua sudah ada / belum ada surat).' };
    }
    async docChainSatisfied(lpId, docTypeId, guard = 0) {
        if (!docTypeId)
            return true;
        if (guard > 20)
            return true;
        const has = await this.dataSource.query('select 1 from bdb_dokumen where lp_id=$1 and document_type_id=$2 limit 1', [lpId, docTypeId]);
        if (!has.length)
            return false;
        const dt = await this.dataSource.query('select dokumen_prasyarat_id from bdb_document_type_master where id=$1', [docTypeId]);
        return this.docChainSatisfied(lpId, dt[0]?.dokumen_prasyarat_id ?? null, guard + 1);
    }
    normalizeDpoName(value) {
        return String(value || '').normalize('NFKC').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    normalizeDpoNik(value) {
        return String(value || '').replace(/\D/g, '');
    }
    dpoPeople(data) {
        return Array.isArray(data?.tersangka) ? data.tersangka.filter((p) => p && typeof p === 'object') : [];
    }
    dpoPersonMatches(current, previous) {
        const currentName = this.normalizeDpoName(current?.nama);
        const previousName = this.normalizeDpoName(previous?.nama);
        if (!currentName || currentName !== previousName)
            return false;
        const currentNik = this.normalizeDpoNik(current?.nik);
        const previousNik = this.normalizeDpoNik(previous?.nik);
        return !(currentNik && previousNik && currentNik !== previousNik);
    }
    normalizeDpoDocumentNumber(value) {
        return String(value || '').normalize('NFKC').trim().toUpperCase().replace(/\s+/g, '');
    }
    async dpoKnownSuspectMatches(lpId, person) {
        const name = this.normalizeDpoName(person?.nama);
        const nik = this.normalizeDpoNik(person?.nik);
        if (!name)
            return false;
        const rows = await this.dataSource.query(`with suspect as (
                 select t.nama,t.nik
                 from bdb_laporan_polisi lp
                 join bdb_dors_lp d on d.dors_lp_id=lp.dors_lp_id and d.model_lp=lp.model_lp
                 join bdb_dors_lp_terlibat t on t.lp_id=d.id
                 where lp.id=$1 and upper(coalesce(t.keterlibatan,''))='TERSANGKA'
                 union all
                 select m.nama,m.nik
                 from bdb_lp_pihak_manual m
                 where m.lp_id=$1 and m.deleted_at is null and upper(coalesce(m.keterlibatan,''))='TERSANGKA'
                 union all
                 select item->>'nama',item->>'nik'
                 from bdb_dokumen d
                 join bdb_document_type_master dt on dt.id=d.document_type_id and dt.code='PENETAPAN_TSK'
                 cross join lateral jsonb_array_elements(
                     case when jsonb_typeof(d.data->'tersangka')='array'
                          then d.data->'tersangka' else '[]'::jsonb end
                 ) item
                 where d.lp_id=$1
             )
             select exists (
                 select 1 from suspect s
                 where upper(regexp_replace(coalesce(s.nama,''),'[^A-Za-z0-9]+','','g'))=$2
                   and ($3='' or nullif(regexp_replace(coalesce(s.nik,''),'\\D','','g'),'') is null
                        or regexp_replace(coalesce(s.nik,''),'\\D','','g')=$3)
             ) as cocok`, [lpId, name, nik]);
        return Boolean(rows[0]?.cocok);
    }
    dpoDate(value) {
        if (!value)
            return '';
        if (value instanceof Date)
            return value.toISOString().slice(0, 10);
        return String(value).slice(0, 10);
    }
    async dpoDocuments(lpId, typeCode, excludeDocumentId) {
        return this.dataSource.query(`select d.id,d.nomor_dokumen,d.tanggal_dokumen,d.data,d.created_at
             from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             where d.lp_id=$1 and t.code=$2
               and ($3::bigint is null or d.id<>$3::bigint)
             order by d.tanggal_dokumen desc nulls last,d.id desc`, [lpId, typeCode, excludeDocumentId ?? null]);
    }
    async validateDpoPersonFlow(lpId, typeCode, data, excludeDocumentId) {
        const flow = {
            PANGGILAN_TSK_1: {
                previousLabel: 'Data tersangka DORS/manual atau Surat Ketetapan Penetapan Tersangka',
            },
            PANGGILAN_TSK_2: {
                previousCode: 'PANGGILAN_TSK_1',
                previousLabel: 'Surat Panggilan I',
                resultField: 'hasil_panggilan',
                allowedResults: ['Tidak hadir tanpa alasan yang sah', 'Alamat tidak ditemukan'],
            },
            SP_BAWA_TSK: {
                previousCode: 'PANGGILAN_TSK_2',
                previousLabel: 'Surat Panggilan II',
                resultField: 'hasil_panggilan',
                allowedResults: ['Tidak hadir tanpa alasan yang sah', 'Alamat tidak ditemukan'],
            },
            PENETAPAN_DPO: {
                previousCode: 'SP_BAWA_TSK',
                previousLabel: 'Surat Perintah Membawa / Penangkapan Tersangka',
                resultField: 'hasil_pelaksanaan',
                allowedResults: ['Tersangka tidak ditemukan / tidak berada di tempat', 'Alamat tidak ditemukan'],
            },
            CABUT_DPO: {
                previousCode: 'PENETAPAN_DPO',
                previousLabel: 'Penetapan DPO',
            },
        };
        const rule = flow[typeCode];
        if (!rule)
            return;
        const people = this.dpoPeople(data);
        if (!people.length)
            throw new common_1.BadRequestException('Minimal satu identitas tersangka wajib dipilih.');
        if (['SP_BAWA_TSK', 'PENETAPAN_DPO', 'CABUT_DPO'].includes(typeCode) && people.length !== 1) {
            throw new common_1.BadRequestException('Dokumen tahap ini hanya boleh diterbitkan untuk satu tersangka.');
        }
        for (let i = 0; i < people.length; i++) {
            const person = people[i];
            if (!this.normalizeDpoName(person?.nama))
                throw new common_1.BadRequestException(`Nama tersangka pada baris ${i + 1} wajib diisi.`);
            for (let j = 0; j < i; j++) {
                if (this.dpoPersonMatches(person, people[j])) {
                    throw new common_1.BadRequestException(`Tersangka "${String(person.nama).trim()}" tercantum lebih dari satu kali.`);
                }
            }
        }
        const previousDocuments = rule.previousCode ? await this.dpoDocuments(lpId, rule.previousCode, excludeDocumentId) : [];
        const existingRevocations = typeCode === 'CABUT_DPO' ? await this.dpoDocuments(lpId, 'CABUT_DPO', excludeDocumentId) : [];
        const currentDate = this.dpoDate(data?.tanggal_dokumen);
        for (const person of people) {
            if (typeCode === 'PANGGILAN_TSK_1') {
                if (!(await this.dpoKnownSuspectMatches(lpId, person))) {
                    const label = String(person.nama || '').trim();
                    throw new common_1.BadRequestException(`Tersangka "${label}" belum tercatat pada pihak DORS/manual atau dokumen penetapan tersangka LP ini.`);
                }
                continue;
            }
            let matchedDocument = null;
            for (const candidate of previousDocuments) {
                if (this.dpoPeople(candidate.data).some((prior) => this.dpoPersonMatches(person, prior))) {
                    matchedDocument = candidate;
                    break;
                }
            }
            const label = String(person.nama || '').trim();
            if (!matchedDocument) {
                throw new common_1.BadRequestException(`${rule.previousLabel} untuk tersangka "${label}" belum ditemukan pada LP ini.`);
            }
            const previousDate = this.dpoDate(matchedDocument.tanggal_dokumen || matchedDocument.data?.tanggal_dokumen);
            if (currentDate && previousDate && currentDate < previousDate) {
                throw new common_1.BadRequestException(`Tanggal dokumen untuk tersangka "${label}" tidak boleh lebih awal dari ${rule.previousLabel}.`);
            }
            if (rule.resultField && rule.allowedResults?.length) {
                const result = String(matchedDocument.data?.[rule.resultField] || '').trim();
                if (!rule.allowedResults.includes(result)) {
                    throw new common_1.BadRequestException(`${rule.previousLabel} untuk tersangka "${label}" belum dapat dilanjutkan. Hasil tercatat: ${result || 'belum diisi'}.`);
                }
            }
            if (typeCode === 'CABUT_DPO') {
                const expectedNumber = this.normalizeDpoDocumentNumber(matchedDocument.nomor_dokumen || matchedDocument.data?.nomor_dokumen);
                const submittedNumber = this.normalizeDpoDocumentNumber(data?.nomor_dpo);
                if (!expectedNumber || submittedNumber !== expectedNumber) {
                    throw new common_1.BadRequestException(`Nomor DPO yang dicabut untuk tersangka "${label}" tidak cocok dengan DPO aktif.`);
                }
                const alreadyRevoked = existingRevocations.some((revocation) => {
                    const revocationDate = this.dpoDate(revocation.tanggal_dokumen || revocation.data?.tanggal_dokumen);
                    const revokedNumber = this.normalizeDpoDocumentNumber(revocation.data?.nomor_dpo);
                    return this.dpoPeople(revocation.data).some((prior) => this.dpoPersonMatches(person, prior))
                        && revokedNumber === expectedNumber
                        && (!previousDate || !revocationDate || revocationDate >= previousDate);
                });
                if (alreadyRevoked)
                    throw new common_1.BadRequestException(`DPO atas nama "${label}" sudah pernah dicabut.`);
            }
        }
    }
    async statusReached(lpId, currentStatusId, statusPrasyaratId) {
        if (!statusPrasyaratId)
            return true;
        if (currentStatusId && Number(currentStatusId) === Number(statusPrasyaratId))
            return true;
        const r = await this.dataSource.query(`select 1 from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id
             where d.lp_id=$1 and t.status_target_id=$2 limit 1`, [lpId, statusPrasyaratId]);
        return r.length > 0;
    }
    async availableActions(lpId) {
        const lp = await this.dataSource.query('select id, status_id from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const currentStatusId = lp[0].status_id;
        const types = await this.dataSource.query(`select d.id, d.code, d.nama, d.urutan_tahap, d.status_prasyarat_id, d.dokumen_prasyarat_id,
                    st.code as status_target_code, st.nama as status_target_nama,
                    sp.code as status_prasyarat_code, sp.nama as status_prasyarat_nama,
                    dp.code as dokumen_prasyarat_code, dp.nama as dokumen_prasyarat_nama
             from bdb_document_type_master d
             left join bdb_status_master st on st.id=d.status_target_id
             left join bdb_status_master sp on sp.id=d.status_prasyarat_id
             left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
             where d.aktif=true order by d.urutan_tahap, d.code`);
        const out = [];
        for (const t of types) {
            const okStatus = await this.statusReached(lpId, currentStatusId, t.status_prasyarat_id);
            const okDoc = await this.docChainSatisfied(lpId, t.dokumen_prasyarat_id);
            const blockers = [];
            if (!okStatus)
                blockers.push(`Status prasyarat belum tercapai: ${t.status_prasyarat_nama || t.status_prasyarat_code || 'tahap sebelumnya'}.`);
            if (!okDoc)
                blockers.push(`Dokumen prasyarat belum dibuat: ${t.dokumen_prasyarat_nama || t.dokumen_prasyarat_code || 'dokumen sebelumnya'}.`);
            out.push({
                id: t.id,
                code: t.code,
                nama: t.nama,
                urutan_tahap: t.urutan_tahap,
                status_target_code: t.status_target_code,
                status_target_nama: t.status_target_nama,
                allowed: okStatus && okDoc,
                blockers,
                block_reason: blockers.join(' '),
            });
        }
        return { status: 1, data: out };
    }
    async createDokumen(lpId, documentTypeId, dataRaw, files, userId) {
        await this.assertLpAccess(lpId, userId);
        const lp = await this.dataSource.query('select id, status_id from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const dtRows = await this.dataSource.query(`select d.*, st.code as status_target_code, st.kategori as status_target_kategori
             from bdb_document_type_master d
             left join bdb_status_master st on st.id=d.status_target_id
             where d.id=$1 and d.aktif=true`, [documentTypeId]);
        if (!dtRows.length)
            throw new common_1.BadRequestException('Jenis surat tidak ditemukan/nonaktif.');
        const dt = dtRows[0];
        const okStatus = await this.statusReached(lpId, lp[0].status_id, dt.status_prasyarat_id);
        const okDoc = await this.docChainSatisfied(lpId, dt.dokumen_prasyarat_id);
        if (!okStatus || !okDoc)
            throw new common_1.BadRequestException('Prasyarat belum terpenuhi untuk membuat surat ini.');
        const data = typeof dataRaw === 'string' ? JSON.parse(dataRaw || '{}') : dataRaw || {};
        const fields = dt.form_schema?.fields || [];
        if (dt.code === 'PUTUSAN_TIPIRING' && (dt.status_target_code !== 'PUTUSAN_TIPIRING' || dt.status_target_kategori !== 'CC')) {
            throw new common_1.BadRequestException('Konfigurasi Putusan Tipiring tidak valid: target wajib PUTUSAN_TIPIRING (CC), bukan SP3.');
        }
        for (const f of fields) {
            if (f.lampiran || f.type === 'file')
                continue;
            if (isFieldRequired(f, data)) {
                const v = data[f.field_key];
                const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
                if (empty)
                    throw new common_1.BadRequestException(`Field "${f.label}" wajib diisi.`);
            }
        }
        await this.validateDpoPersonFlow(lpId, dt.code, data);
        const requiredAttachment = fields.some((f) => (f.lampiran || f.type === 'file') && isFieldRequired(f, data));
        if (requiredAttachment && !(files || []).length) {
            throw new common_1.BadRequestException('Bukti / lampiran dokumen wajib diunggah.');
        }
        const lampiran = [];
        for (const file of files || []) {
            try {
                const key = await this.minio.upload(file, `dokumen/${lpId}`);
                lampiran.push({ name: file.originalname, key, size: file.size, mime: file.mimetype });
            }
            catch (e) {
                this.logger.warn('upload lampiran gagal: ' + (e?.message || e));
            }
        }
        if (requiredAttachment && !lampiran.length) {
            throw new common_1.BadRequestException('Bukti / lampiran gagal diunggah; dokumen belum disimpan.');
        }
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const ins = await runner.query(`insert into bdb_dokumen (lp_id, document_type_id, nomor_dokumen, tanggal_dokumen, tanggal_mulai, tanggal_berakhir, data, lampiran, created_by)
                 values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9) returning id`, [lpId, documentTypeId, data.nomor_dokumen ?? null, data.tanggal_dokumen || null, data.tanggal_mulai || null, data.tanggal_berakhir || null, JSON.stringify(data), JSON.stringify(lampiran), userId ?? null]);
            const dokumenId = ins[0].id;
            const pasalArr = Array.isArray(data.pasal) ? data.pasal : [];
            for (const p of pasalArr) {
                const pasalId = p?.id || p?.pasal_id || null;
                const nomor = p?.nomor_pasal || (typeof p === 'string' ? p : null);
                const sumber = p?.sumber || (pasalId ? 'tambahan_manual' : 'tambahan_manual');
                await runner.query('insert into bdb_dokumen_pasal (dokumen_id, pasal_id, nomor_pasal, sumber) values ($1,$2,$3,$4)', [dokumenId, pasalId, nomor, sumber]);
            }
            if (dt.status_target_id) {
                const statCat = await runner.query('select kategori from bdb_status_master where id=$1', [dt.status_target_id]);
                if (statCat[0]?.kategori === 'CC') {
                    await runner.query('update bdb_laporan_polisi set status_id=$2, tanggal_selesai=coalesce($3::date, current_date), updated_at=now() where id=$1', [lpId, dt.status_target_id, data.tanggal_dokumen || null]);
                }
                else {
                    await runner.query('update bdb_laporan_polisi set status_id=$2, tanggal_selesai=null, updated_at=now() where id=$1', [lpId, dt.status_target_id]);
                }
            }
            await runner.commitTransaction();
            if (dt.code === 'PUTUSAN_TIPIRING') {
                try {
                    await this.audit.log({
                        userId,
                        action: 'CREATE_PUTUSAN_TIPIRING',
                        entity: 'laporan_polisi',
                        entityId: lpId,
                        meta: {
                            dokumen_id: dokumenId,
                            nomor_putusan: data.nomor_dokumen,
                            tanggal_putusan: data.tanggal_dokumen,
                            pengadilan: data.pengadilan,
                            nomor_sp2hp_a5: data.nomor_sp2hp_a5 || null,
                            tanggal_sp2hp_a5: data.tanggal_sp2hp_a5 || null,
                            status_baru: 'PUTUSAN_TIPIRING',
                            tanggal_selesai: data.tanggal_dokumen,
                            jumlah_lampiran: lampiran.length
                        },
                        outcome: 'SUCCESS'
                    });
                }
                catch (e) {
                    this.logger.warn('audit CREATE_PUTUSAN_TIPIRING gagal: ' + (e?.message || e));
                }
            }
            try {
                await this.audit.log({
                    userId,
                    action: 'CREATE_DOCUMENT',
                    entity: 'laporan_polisi',
                    entityId: lpId,
                    meta: { dokumen_id: dokumenId, type_code: dt.code, status_baru_id: dt.status_target_id || null },
                    outcome: 'SUCCESS'
                });
            }
            catch (e) {
                this.logger.warn('audit CREATE_DOCUMENT gagal: ' + (e?.message || e));
            }
            const msg = dt.status_target_id ? `${dt.nama} tersimpan. Status LP diperbarui.` : `${dt.nama} tersimpan.`;
            return { status: 1, data: { dokumen_id: dokumenId, status_baru_id: dt.status_target_id }, message: msg };
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
    }
    async timeline(lpId) {
        const lp = await this.dataSource.query(`select l.id, l.no_laporan, l.satker_nama, l.status_id, s.code as status_code, s.nama as status_nama
             from bdb_laporan_polisi l left join bdb_status_master s on s.id=l.status_id where l.id=$1`, [lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const docs = await this.dataSource.query(`select d.id, d.nomor_dokumen, d.tanggal_dokumen, d.tanggal_mulai, d.tanggal_berakhir, d.data, d.lampiran, d.created_at, d.created_by,
                    u.name as created_by_nama,
                    t.code as type_code, t.nama as type_nama, t.urutan_tahap, st.code as status_target_code, st.nama as status_target_nama
             from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             left join bdb_status_master st on st.id=t.status_target_id
             left join auth_users u on u.id=d.created_by
             where d.lp_id=$1 order by t.urutan_tahap, d.tanggal_dokumen nulls last, d.id`, [lpId]);
        for (const d of docs) {
            const lamp = Array.isArray(d.lampiran) ? d.lampiran : [];
            for (const f of lamp) {
                if (f.key) {
                    try {
                        f.url = await this.minio.presignedUrl(f.key);
                    }
                    catch {
                    }
                }
            }
            const pr = await this.dataSource.query('select pasal_id, nomor_pasal, sumber from bdb_dokumen_pasal where dokumen_id=$1', [d.id]);
            d.pasal = pr;
        }
        return { status: 1, data: { lp: lp[0], dokumen: docs } };
    }
    async updateDokumen(lpId, dokumenId, dataRaw, files, keepKeysRaw, userId) {
        await this.assertLpAccess(lpId, userId);
        const rows = await this.dataSource.query(`select d.id, d.lampiran, t.code as type_code, t.form_schema, t.status_target_id,
                    (select lp.status_id from bdb_laporan_polisi lp where lp.id=d.lp_id) as lp_status_id,
                    (select st.kategori from bdb_status_master st where st.id=t.status_target_id) as target_kategori,
                    (select st.code from bdb_status_master st where st.id=t.status_target_id) as target_status_code
             from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id where d.id=$1 and d.lp_id=$2`, [dokumenId, lpId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Dokumen tidak ditemukan.');
        const doc = rows[0];
        const data = typeof dataRaw === 'string' ? JSON.parse(dataRaw || '{}') : dataRaw || {};
        const fields = doc.form_schema?.fields || [];
        if (doc.type_code === 'PUTUSAN_TIPIRING' && (doc.target_status_code !== 'PUTUSAN_TIPIRING' || doc.target_kategori !== 'CC')) {
            throw new common_1.BadRequestException('Konfigurasi Putusan Tipiring tidak valid: target wajib PUTUSAN_TIPIRING (CC), bukan SP3.');
        }
        for (const f of fields) {
            if (f.lampiran || f.type === 'file')
                continue;
            if (isFieldRequired(f, data)) {
                const v = data[f.field_key];
                const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
                if (empty)
                    throw new common_1.BadRequestException(`Field "${f.label}" wajib diisi.`);
            }
        }
        await this.validateDpoPersonFlow(lpId, doc.type_code, data, dokumenId);
        let keepKeys = [];
        try {
            keepKeys = Array.isArray(keepKeysRaw) ? keepKeysRaw : keepKeysRaw ? JSON.parse(keepKeysRaw) : [];
        }
        catch {
            keepKeys = [];
        }
        const existing = Array.isArray(doc.lampiran) ? doc.lampiran : [];
        const lampiran = existing.filter((l) => !l.key || keepKeys.includes(l.key));
        for (const file of files || []) {
            try {
                const key = await this.minio.upload(file, `dokumen/${lpId}`);
                lampiran.push({ name: file.originalname, key, size: file.size, mime: file.mimetype });
            }
            catch (e) {
                this.logger.warn('upload lampiran gagal: ' + (e?.message || e));
            }
        }
        const requiredAttachment = fields.some((f) => (f.lampiran || f.type === 'file') && isFieldRequired(f, data));
        if (requiredAttachment && !lampiran.length) {
            throw new common_1.BadRequestException('Bukti / lampiran dokumen wajib dipertahankan atau diunggah.');
        }
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            await runner.query(`update bdb_dokumen set nomor_dokumen=$3, tanggal_dokumen=$4, tanggal_mulai=$5, tanggal_berakhir=$6, data=$7::jsonb, lampiran=$8::jsonb where id=$1 and lp_id=$2`, [dokumenId, lpId, data.nomor_dokumen ?? null, data.tanggal_dokumen || null, data.tanggal_mulai || null, data.tanggal_berakhir || null, JSON.stringify(data), JSON.stringify(lampiran)]);
            await runner.query('delete from bdb_dokumen_pasal where dokumen_id=$1', [dokumenId]);
            const pasalArr = Array.isArray(data.pasal) ? data.pasal : [];
            for (const p of pasalArr) {
                const pasalId = p?.id || p?.pasal_id || null;
                const nomor = p?.nomor_pasal || (typeof p === 'string' ? p : null);
                await runner.query('insert into bdb_dokumen_pasal (dokumen_id, pasal_id, nomor_pasal, sumber) values ($1,$2,$3,$4)', [dokumenId, pasalId, nomor, p?.sumber || 'tambahan_manual']);
            }
            if (doc.status_target_id && doc.status_target_id === doc.lp_status_id && doc.target_kategori === 'CC') {
                await runner.query('update bdb_laporan_polisi set tanggal_selesai=coalesce($2::date, current_date) where id=$1', [lpId, data.tanggal_dokumen || null]);
            }
            await runner.commitTransaction();
            if (doc.type_code === 'PUTUSAN_TIPIRING') {
                try {
                    await this.audit.log({
                        userId,
                        action: 'UPDATE_PUTUSAN_TIPIRING',
                        entity: 'laporan_polisi',
                        entityId: lpId,
                        meta: {
                            dokumen_id: dokumenId,
                            nomor_putusan: data.nomor_dokumen,
                            tanggal_putusan: data.tanggal_dokumen,
                            pengadilan: data.pengadilan,
                            nomor_sp2hp_a5: data.nomor_sp2hp_a5 || null,
                            tanggal_sp2hp_a5: data.tanggal_sp2hp_a5 || null,
                            tanggal_selesai: data.tanggal_dokumen,
                            jumlah_lampiran: lampiran.length
                        },
                        outcome: 'SUCCESS'
                    });
                }
                catch (e) {
                    this.logger.warn('audit UPDATE_PUTUSAN_TIPIRING gagal: ' + (e?.message || e));
                }
            }
            try {
                await this.audit.log({
                    userId,
                    action: 'UPDATE_DOCUMENT',
                    entity: 'laporan_polisi',
                    entityId: lpId,
                    meta: { dokumen_id: dokumenId, type_code: doc.type_code },
                    outcome: 'SUCCESS'
                });
            }
            catch (e) {
                this.logger.warn('audit UPDATE_DOCUMENT gagal: ' + (e?.message || e));
            }
            return { status: 1, message: 'Dokumen diperbarui.' };
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
    }
    async deleteDokumen(lpId, dokumenId, userId) {
        await this.assertLpAccess(lpId, userId);
        const d = await this.dataSource.query(`select d.id, d.nomor_dokumen, d.tanggal_dokumen, d.data, d.lampiran, t.code as type_code
             from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id
             where d.id=$1 and d.lp_id=$2`, [dokumenId, lpId]);
        if (!d.length)
            throw new common_1.NotFoundException('Dokumen tidak ditemukan.');
        await this.dataSource.query('delete from bdb_dokumen where id=$1 and lp_id=$2', [dokumenId, lpId]);
        await this.recomputeLpStatus(lpId);
        if (d[0].type_code === 'PUTUSAN_TIPIRING') {
            try {
                await this.audit.log({
                    userId,
                    action: 'DELETE_PUTUSAN_TIPIRING',
                    entity: 'laporan_polisi',
                    entityId: lpId,
                    meta: {
                        dokumen_id: dokumenId,
                        nomor_putusan: d[0].nomor_dokumen,
                        tanggal_putusan: d[0].tanggal_dokumen,
                        pengadilan: d[0].data?.pengadilan || null,
                        nomor_sp2hp_a5: d[0].data?.nomor_sp2hp_a5 || null,
                        jumlah_lampiran: Array.isArray(d[0].lampiran) ? d[0].lampiran.length : 0,
                        status_dihitung_ulang: true
                    },
                    outcome: 'SUCCESS'
                });
            }
            catch (e) {
                this.logger.warn('audit DELETE_PUTUSAN_TIPIRING gagal: ' + (e?.message || e));
            }
        }
        try {
            await this.audit.log({
                userId,
                action: 'DELETE_DOCUMENT',
                entity: 'laporan_polisi',
                entityId: lpId,
                meta: { dokumen_id: dokumenId, type_code: d[0].type_code, status_dihitung_ulang: true },
                outcome: 'SUCCESS'
            });
        }
        catch (e) {
            this.logger.warn('audit DELETE_DOCUMENT gagal: ' + (e?.message || e));
        }
        return { status: 1, message: 'Dokumen dihapus. Status LP disesuaikan.' };
    }
    async recomputeLpStatus(lpId) {
        const r = await this.dataSource.query(`select st.id, st.kategori, d.tanggal_dokumen from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             join bdb_status_master st on st.id=t.status_target_id
             where d.lp_id=$1 and t.status_target_id is not null
             order by st.urutan desc, d.id desc limit 1`, [lpId]);
        let statusId = r[0]?.id;
        let isCc = r[0]?.kategori === 'CC';
        let ccDate = r[0]?.tanggal_dokumen || null;
        if (!statusId) {
            const base = await this.dataSource.query("select id from bdb_status_master where code='LP' limit 1");
            statusId = base[0]?.id ?? null;
            isCc = false;
        }
        await this.dataSource.query('update bdb_laporan_polisi set status_id=$2, tanggal_selesai=$3::date, updated_at=now() where id=$1', [lpId, statusId, isCc ? ccDate || new Date().toISOString().slice(0, 10) : null]);
    }
    async reconcileAllLpStatus() {
        const [{ total }] = await this.dataSource.query('select count(*)::int as total from bdb_laporan_polisi where deleted_at is null');
        const [rows] = await this.dataSource.query(`
            with base as (
                select id from bdb_status_master where code = 'LP' limit 1
            ),
            correct_status as (
                select
                    lp.id as lp_id,
                    lp.no_laporan,
                    lp.status_id as status_id_lama,
                    coalesce(best.status_id, (select id from base)) as status_id_benar,
                    case when best.kategori = 'CC' then coalesce(best.tanggal_dokumen, current_date) else null end as tanggal_selesai_benar
                from bdb_laporan_polisi lp
                left join lateral (
                    select st.id as status_id, st.kategori, d.tanggal_dokumen
                    from bdb_dokumen d
                    join bdb_document_type_master t on t.id = d.document_type_id
                    join bdb_status_master st on st.id = t.status_target_id
                    where d.lp_id = lp.id and t.status_target_id is not null
                    order by st.urutan desc, d.id desc
                    limit 1
                ) best on true
                where lp.deleted_at is null
            ),
            mismatch as (
                select * from correct_status where status_id_lama is distinct from status_id_benar
            )
            update bdb_laporan_polisi lp
            set status_id = m.status_id_benar, tanggal_selesai = m.tanggal_selesai_benar, updated_at = now()
            from mismatch m
            where lp.id = m.lp_id
            returning
                lp.id as lp_id,
                m.no_laporan,
                (select code from bdb_status_master where id = m.status_id_lama) as status_lama,
                (select code from bdb_status_master where id = m.status_id_benar) as status_baru
        `);
        return { diperiksa: total, diperbaiki: rows.length, detail: rows.slice(0, 100) };
    }
    async catatReconcileLog(triggeredBy, r, userId, userName) {
        await this.dataSource.query('insert into bdb_lp_status_reconcile_log (triggered_by, user_id, user_name, diperiksa, diperbaiki) values ($1,$2,$3,$4,$5)', [triggeredBy, userId || null, userName || null, r.diperiksa, r.diperbaiki]);
    }
    async cronReconcileLpStatus() {
        if (!(0, cluster_instance_util_1.isPrimaryClusterInstance)())
            return;
        try {
            const r = await this.reconcileAllLpStatus();
            await this.catatReconcileLog('CRON', r);
            if (r.diperbaiki > 0) {
                this.logger.warn(`Rekonsiliasi status LP (cron): ${r.diperbaiki} dari ${r.diperiksa} LP diperbaiki -- status tersimpan sebelumnya TIDAK sesuai dokumen aktualnya.`);
                await this.audit.log({
                    action: 'RECONCILE_LP_STATUS_CRON',
                    entity: 'laporan_polisi',
                    meta: { diperiksa: r.diperiksa, diperbaiki: r.diperbaiki, detail: r.detail.slice(0, 100) },
                    outcome: 'SUCCESS'
                });
            }
        }
        catch (e) {
            this.logger.error('Rekonsiliasi status LP (cron) gagal: ' + (e?.message || e));
        }
    }
    async reconcileAllLpStatusManual(userId, userName) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new common_1.ForbiddenException('Rekonsiliasi status LP hanya bisa dipicu superadmin.');
        }
        const r = await this.reconcileAllLpStatus();
        await this.catatReconcileLog('MANUAL', r, userId, userName);
        await this.audit.log({
            userId,
            userName,
            action: 'RECONCILE_LP_STATUS_MANUAL',
            entity: 'laporan_polisi',
            meta: { diperiksa: r.diperiksa, diperbaiki: r.diperbaiki, detail: r.detail.slice(0, 100) },
            outcome: 'SUCCESS'
        });
        return { status: 1, data: r };
    }
    async reconcileStatusInfo() {
        const [lastCron, lastManual] = await Promise.all([
            this.dataSource.query("select created_at, diperiksa, diperbaiki from bdb_lp_status_reconcile_log where triggered_by='CRON' order by created_at desc limit 1"),
            this.dataSource.query("select created_at, diperiksa, diperbaiki, user_name from bdb_lp_status_reconcile_log where triggered_by='MANUAL' order by created_at desc limit 1")
        ]);
        const now = new Date();
        const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
        return {
            status: 1,
            data: {
                interval_jam: 1,
                jadwal_berikutnya: nextRun.toISOString(),
                terakhir_cron: lastCron[0] || null,
                terakhir_manual: lastManual[0] || null
            }
        };
    }
};
exports.WorkflowService = WorkflowService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowService.prototype, "cronReconcileLpStatus", null);
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService,
        audit_service_1.AuditService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map
