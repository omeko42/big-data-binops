import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { MinioService } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';
import { resolveScope } from '../common/scope.util';
import { isPrimaryClusterInstance } from '../common/cluster-instance.util';
import { LpMonitoringAccessService } from '../common/lp-monitoring-access.service';

type FieldDef = {
    field_key: string;
    label: string;
    type: string;
    required?: boolean;
    source?: string;
    options?: string[];
    lampiran?: boolean;
    visible_if?: { field: string; value: string };
};

const PERMA_CATEGORIES = new Set(['Tipiring', 'LHA PPATK']);

/** Field wajib diisi hanya kalau kondisi visible_if-nya (kalau ada) terpenuhi. */
function isFieldRequired(f: FieldDef, data: Record<string, any>): boolean {
    if (!f.required) return false;
    if (f.visible_if && data[f.visible_if.field] !== f.visible_if.value) return false;
    return true;
}

/**
 * Engine alur dokumen Laporan Polisi (config-driven state machine).
 * Jenis surat baru cukup tambah di bdb_document_type_master — tanpa ubah kode.
 */
@Injectable()
export class WorkflowService {
    private readonly logger = new Logger('WorkflowService');
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService,
        private readonly monitoring: LpMonitoringAccessService
    ) {}

    /**
     * Satker asal kehilangan akses begitu LP dilimpahkan (lp-pelimpahan mengubah satker_id) --
     * cek ini menjaga aksi alur dokumen (buat/ubah/hapus surat) tunduk pada aturan yang sama
     * dengan detail/list LP (resolveScope: superadmin/admin_binops semua, operator EXACT satkernya).
     */
    private async assertLpAccess(lpId: number, userId?: number) {
        return this.monitoring.assertCanAccessLp(userId, lpId);
    }

    private async permaCourtOptions(): Promise<{ id: number; nama: string }[]> {
        const rows = await this.dataSource.query(
            `select id, nama
             from bdb_satker_eksternal
             where nama ilike 'Pengadilan Negeri%'
                or coalesce(keterangan, '') ilike 'Kelompok: Pengadilan Negeri%'
             order by nama, id`
        );
        return rows.map((row: any) => ({ id: Number(row.id), nama: String(row.nama) }));
    }

    private async normalizePermaCourt(data: Record<string, any>, existingData?: Record<string, any>) {
        const pengadilan = String(data.pengadilan || '').trim();
        if (!pengadilan) return;
        const rows = await this.dataSource.query(
            `select id, nama
             from bdb_satker_eksternal
             where lower(trim(nama)) = lower($1)
               and (nama ilike 'Pengadilan Negeri%'
                    or coalesce(keterangan, '') ilike 'Kelompok: Pengadilan Negeri%')
             order by id
             limit 2`,
            [pengadilan]
        );
        if (rows.length) {
            data.pengadilan = String(rows[0].nama);
            data.pengadilan_eksternal_id = Number(rows[0].id);
            return;
        }
        const existingPengadilan = String(existingData?.pengadilan || '').trim();
        if (existingData && existingPengadilan.toLocaleLowerCase('id-ID') === pengadilan.toLocaleLowerCase('id-ID')) {
            data.pengadilan = existingData?.pengadilan;
            if (existingData?.pengadilan_eksternal_id) {
                data.pengadilan_eksternal_id = Number(existingData.pengadilan_eksternal_id);
            }
            return;
        }
        throw new BadRequestException('Pengadilan wajib dipilih dari Master Satker Eksternal — Pengadilan Negeri.');
    }

    // ---------- Master status ----------
    async statuses() {
        // Pertahankan guard aktif Limpah Eksternal: status inti lain tidak mendapat tombol
        // hapus, dan LIMPAH_EKSTERNAL hanya boleh dihapus ketika benar-benar tanpa referensi.
        const rows = await this.dataSource.query(
            `select s.id, s.code, s.nama, s.urutan, s.kategori,
                    (s.code = 'LIMPAH_EKSTERNAL'
                     and not exists (select 1 from bdb_laporan_polisi lp where lp.status_id=s.id)
                     and not exists (select 1 from bdb_document_type_master d where d.status_prasyarat_id=s.id or d.status_target_id=s.id)
                    ) as can_delete
             from bdb_status_master s order by s.urutan, s.id`
        );
        return { status: 1, data: rows };
    }
    async saveStatus(body: { id?: number; code: string; nama: string; urutan?: number; kategori?: string }) {
        if (!body.code || !body.nama) throw new BadRequestException('code & nama wajib.');
        const kategori = body.kategori === 'CC' ? 'CC' : 'CT';
        if (body.id) {
            await this.dataSource.query('update bdb_status_master set code=$2, nama=$3, urutan=$4, kategori=$5 where id=$1', [body.id, body.code.trim().toUpperCase(), body.nama.trim(), Number(body.urutan) || 0, kategori]);
            return { status: 1, message: 'Status diperbarui.' };
        }
        const r = await this.dataSource.query('insert into bdb_status_master (code, nama, urutan, kategori) values ($1,$2,$3,$4) on conflict (code) do update set nama=excluded.nama, urutan=excluded.urutan, kategori=excluded.kategori returning id', [body.code.trim().toUpperCase(), body.nama.trim(), Number(body.urutan) || 0, kategori]);
        return { status: 1, data: { id: r[0].id }, message: 'Status disimpan.' };
    }
    async deleteStatus(id: number) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const rows = await runner.query('select id, code, nama from bdb_status_master where id=$1 for update', [id]);
            if (!rows.length) throw new NotFoundException('Status tidak ditemukan.');
            if (rows[0].code !== 'LIMPAH_EKSTERNAL') {
                throw new BadRequestException('Status alur inti tidak boleh dihapus lewat aksi ini.');
            }
            const refs = await runner.query(
                `select
                    (select count(*)::int from bdb_laporan_polisi where status_id=$1) as lp_count,
                    (select count(*)::int from bdb_document_type_master where status_prasyarat_id=$1 or status_target_id=$1) as document_type_count`,
                [id]
            );
            if (Number(refs[0]?.lp_count || 0) > 0 || Number(refs[0]?.document_type_count || 0) > 0) {
                throw new BadRequestException('Status masih dipakai LP atau jenis surat dan tidak boleh dihapus.');
            }
            await runner.query('delete from bdb_status_master where id=$1', [id]);
            await runner.commitTransaction();
            return { status: 1, message: `Status "${rows[0].nama}" dihapus.` };
        } catch (e) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }
    }

    // ---------- Master pasal ----------
    async pasalList(search?: string) {
        const params: any[] = [];
        let where = '';
        if (search && search.trim()) {
            params.push(`%${search.trim()}%`);
            where = `where nomor_pasal ilike $1 or deskripsi ilike $1 or uu_referensi ilike $1`;
        }
        const rows = await this.dataSource.query(`select id, nomor_pasal, deskripsi, uu_referensi from bdb_pasal_master ${where} order by nomor_pasal limit 200`, params);
        return { status: 1, data: rows };
    }
    async savePasal(body: { id?: number; nomor_pasal: string; deskripsi?: string; uu_referensi?: string }) {
        if (!body.nomor_pasal || !body.nomor_pasal.trim()) throw new BadRequestException('Nomor pasal wajib.');
        if (body.id) {
            await this.dataSource.query('update bdb_pasal_master set nomor_pasal=$2, deskripsi=$3, uu_referensi=$4 where id=$1', [body.id, body.nomor_pasal.trim(), body.deskripsi ?? null, body.uu_referensi ?? null]);
            return { status: 1, data: { id: body.id }, message: 'Pasal diperbarui.' };
        }
        const r = await this.dataSource.query(
            `insert into bdb_pasal_master (nomor_pasal, deskripsi, uu_referensi) values ($1,$2,$3)
             on conflict (lower(nomor_pasal), lower(coalesce(uu_referensi,''))) do update set deskripsi=excluded.deskripsi returning id, nomor_pasal, deskripsi, uu_referensi`,
            [body.nomor_pasal.trim(), body.deskripsi ?? null, body.uu_referensi ?? null]
        );
        return { status: 1, data: r[0], message: 'Pasal disimpan.' };
    }

    // ---------- Master jenis surat ----------
    async documentTypes(includeInactive = false) {
        const rows = await this.dataSource.query(
            `select d.id, d.code, d.nama, d.status_prasyarat_id, d.dokumen_prasyarat_id, d.status_target_id, d.urutan_tahap, d.form_schema, d.aktif,
                    sp.code as status_prasyarat_code, st.code as status_target_code, dp.code as dokumen_prasyarat_code, st.kategori as kategori
             from bdb_document_type_master d
             left join bdb_status_master sp on sp.id=d.status_prasyarat_id
             left join bdb_status_master st on st.id=d.status_target_id
             left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
             ${includeInactive ? '' : 'where d.aktif=true'}
             order by d.urutan_tahap, d.code`
        );
        return { status: 1, data: rows };
    }
    async schemaByCode(code: string) {
        const rows = await this.dataSource.query('select code, nama, form_schema from bdb_document_type_master where code=$1', [code]);
        if (!rows.length) throw new NotFoundException('Jenis surat tidak ditemukan.');
        if (rows[0].code === 'PERMA') {
            const courts = await this.permaCourtOptions();
            const fields: FieldDef[] = rows[0].form_schema?.fields || [];
            rows[0].form_schema = {
                ...rows[0].form_schema,
                fields: fields.map((field) => field.field_key === 'pengadilan'
                    ? {
                        ...field,
                        type: 'select',
                        source: 'satker_eksternal:pengadilan_negeri',
                        options: courts.map((court) => court.nama)
                    }
                    : field)
            };
        }
        return { status: 1, data: rows[0] };
    }
    async saveDocumentType(body: any) {
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
        if (!vals[0] || !vals[1]) throw new BadRequestException('code & nama wajib.');
        if (body.id) {
            const updated = await this.dataSource.query(
                `update bdb_document_type_master set code=$2, nama=$3, status_prasyarat_id=$4, dokumen_prasyarat_id=$5, status_target_id=$6, urutan_tahap=$7, form_schema=$8::jsonb, aktif=$9, updated_at=now() where id=$1 returning id, dokumen_prasyarat_id`,
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
            `insert into bdb_document_type_master (${cols.join(',')}) values ($1,$2,$3,$4,$5,$6::jsonb,$7)
             on conflict (code) do update set nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, dokumen_prasyarat_id=excluded.dokumen_prasyarat_id,
                status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now()
             returning id`,
            [vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], vals[6], vals[7]]
        );
        return { status: 1, data: { id: r[0].id }, message: 'Jenis surat disimpan.' };
    }

    // ---------- Pasal inherit dari LP ----------
    async lpPasal(lpId: number, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        // gabungkan tindak pidana terkelola + dugaan dari payload (dedup by nomor_pasal)
        const managed = await this.dataSource.query('select nomor_pasal, nama_kategori as deskripsi, uu_referensi from bdb_lp_tindak_pidana where lp_id=$1 and nomor_pasal is not null', [lpId]);
        const seen = new Set<string>();
        const out: any[] = [];
        for (const m of managed) {
            const key = String(m.nomor_pasal).toLowerCase();
            if (seen.has(key)) continue;
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

    // ---------- Tindak pidana per LP (CRUD) ----------
    /** Seed sekali dari payload DORS bila belum ada baris sama sekali. */
    private async seedTindakPidanaIfEmpty(lpId: number) {
        const c = await this.dataSource.query('select count(*)::int n from bdb_lp_tindak_pidana where lp_id=$1', [lpId]);
        if (c[0].n > 0) return;
        const rows = await this.dataSource.query('select payload_json from bdb_laporan_polisi where id=$1', [lpId]);
        const tp = rows[0]?.payload_json?.tindak_pidana;
        if (!Array.isArray(tp) || !tp.length) return;
        for (const t of tp) {
            await this.dataSource.query(
                `insert into bdb_lp_tindak_pidana (lp_id, nomor_pasal, nama_kategori, uu_referensi, juncto, subsider, sumber)
                 values ($1,$2,$3,$4,$5,$6,'dugaan_lp')`,
                [lpId, t?.pasal_mapping || t?.pasal || null, t?.nama_kategori_kejahatan || null, t?.nama_uu || null, t?.juncto || null, t?.subsider || null]
            );
        }
    }

    async tindakPidanaList(lpId: number, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        await this.seedTindakPidanaIfEmpty(lpId);
        const rows = await this.dataSource.query(
            `select id, pasal_id, nomor_pasal, nama_kategori, uu_referensi, ayat, juncto, subsider, sumber, sumber_ref, dokumen_id, created_at
             from bdb_lp_tindak_pidana where lp_id=$1
             order by case sumber when 'dugaan_lp' then 0 when 'dari_dokumen' then 1 else 2 end, id`,
            [lpId]
        );
        return { status: 1, data: rows };
    }

    async saveTindakPidana(lpId: number, body: any, userId?: number) {
        const access = await this.assertLpAccess(lpId, userId);
        const vals = [
            body.nomor_pasal ? String(body.nomor_pasal).trim() : null,
            body.nama_kategori ? String(body.nama_kategori).trim() : null,
            body.uu_referensi ? String(body.uu_referensi).trim() : null,
            body.ayat ? String(body.ayat).trim() : null,
            body.juncto ? String(body.juncto).trim() : null,
            body.subsider ? String(body.subsider).trim() : null,
            body.pasal_id || null
        ];
        if (!vals[0] && !vals[1]) throw new BadRequestException('Nomor pasal atau kategori wajib diisi.');
        if (body.id) {
            await this.dataSource.query(
                `update bdb_lp_tindak_pidana set nomor_pasal=$3, nama_kategori=$4, uu_referensi=$5, ayat=$6, juncto=$7, subsider=$8, pasal_id=$9, updated_at=now()
                 where id=$1 and lp_id=$2`,
                [body.id, lpId, ...vals]
            );
            await this.audit.log({ userId, action: 'UPDATE_TINDAK_PIDANA', entity: 'laporan_polisi', entityId: lpId, meta: { tindak_pidana_id: body.id, monitoring_update: access.monitoring, owner_satker_id: access.lp.unit_satker_id ?? access.lp.satker_id } });
            return { status: 1, message: 'Tindak pidana diperbarui.' };
        }
        await this.dataSource.query(
            `insert into bdb_lp_tindak_pidana (lp_id, nomor_pasal, nama_kategori, uu_referensi, ayat, juncto, subsider, pasal_id, sumber)
             values ($1,$2,$3,$4,$5,$6,$7,$8,'manual')`,
            [lpId, ...vals]
        );
        await this.audit.log({ userId, action: 'CREATE_TINDAK_PIDANA', entity: 'laporan_polisi', entityId: lpId, meta: { monitoring_update: access.monitoring, owner_satker_id: access.lp.unit_satker_id ?? access.lp.satker_id } });
        return { status: 1, message: 'Tindak pidana ditambahkan.' };
    }

    async deleteTindakPidana(lpId: number, id: number, userId?: number) {
        const access = await this.assertLpAccess(lpId, userId);
        const row = await this.dataSource.query('select sumber from bdb_lp_tindak_pidana where id=$1 and lp_id=$2', [id, lpId]);
        if (!row.length) throw new NotFoundException('Data tidak ditemukan.');
        if (row[0].sumber === 'dugaan_lp') throw new BadRequestException('Data dugaan tindak pidana dari DORS tidak boleh dihapus.');
        await this.dataSource.query('delete from bdb_lp_tindak_pidana where id=$1 and lp_id=$2', [id, lpId]);
        await this.audit.log({ userId, action: 'DELETE_TINDAK_PIDANA', entity: 'laporan_polisi', entityId: lpId, meta: { tindak_pidana_id: id, monitoring_update: access.monitoring, owner_satker_id: access.lp.unit_satker_id ?? access.lp.satker_id } });
        return { status: 1, message: 'Tindak pidana dihapus.' };
    }

    /** Tarik pasal dari dokumen surat (mis. Surat Perintah Penyidikan) ke daftar tindak pidana LP. */
    async importTindakPidanaFromDocs(lpId: number, typeCodes: string[], userId?: number) {
        const access = await this.assertLpAccess(lpId, userId);
        const codes = typeCodes && typeCodes.length ? typeCodes : ['SP_SIDIK'];
        const src = await this.dataSource.query(
            `select dp.nomor_pasal, dp.pasal_id, pm.deskripsi, pm.uu_referensi, d.id as dokumen_id, d.nomor_dokumen, dt.nama as type_nama
             from bdb_dokumen d
             join bdb_document_type_master dt on dt.id=d.document_type_id
             join bdb_dokumen_pasal dp on dp.dokumen_id=d.id
             left join bdb_pasal_master pm on pm.id=dp.pasal_id
             where d.lp_id=$1 and dt.code = any($2) and dp.nomor_pasal is not null
             order by d.id`,
            [lpId, codes]
        );
        const existing: { nomor_pasal: string }[] = await this.dataSource.query('select lower(nomor_pasal) as nomor_pasal from bdb_lp_tindak_pidana where lp_id=$1 and nomor_pasal is not null', [lpId]);
        const seen = new Set(existing.map((e) => e.nomor_pasal));
        let imported = 0;
        for (const s of src) {
            const key = String(s.nomor_pasal).toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            await this.dataSource.query(
                `insert into bdb_lp_tindak_pidana (lp_id, pasal_id, nomor_pasal, nama_kategori, uu_referensi, sumber, sumber_ref, dokumen_id)
                 values ($1,$2,$3,$4,$5,'dari_dokumen',$6,$7)`,
                [lpId, s.pasal_id || null, s.nomor_pasal, s.deskripsi || null, s.uu_referensi || null, `${s.type_nama}${s.nomor_dokumen ? ' — ' + s.nomor_dokumen : ''}`, s.dokumen_id]
            );
            imported++;
        }
        if (imported) await this.audit.log({ userId, action: 'IMPORT_TINDAK_PIDANA', entity: 'laporan_polisi', entityId: lpId, meta: { imported, monitoring_update: access.monitoring, owner_satker_id: access.lp.unit_satker_id ?? access.lp.satker_id } });
        return { status: 1, data: { imported, tersedia: src.length }, message: imported ? `${imported} pasal ditarik dari dokumen.` : 'Tidak ada pasal baru untuk ditarik (semua sudah ada / belum ada surat).' };
    }

    // ---------- Prasyarat & available actions ----------
    /** Cek rantai dokumen prasyarat (rekursif): tiap jenis di rantai harus punya dokumen utk LP ini. */
    private async docChainSatisfied(lpId: number, docTypeId: number | null, guard = 0): Promise<boolean> {
        if (!docTypeId) return true;
        if (guard > 20) return true; // pengaman loop
        const has = await this.dataSource.query('select 1 from bdb_dokumen where lp_id=$1 and document_type_id=$2 limit 1', [lpId, docTypeId]);
        if (!has.length) return false;
        const dt = await this.dataSource.query('select dokumen_prasyarat_id from bdb_document_type_master where id=$1', [docTypeId]);
        return this.docChainSatisfied(lpId, dt[0]?.dokumen_prasyarat_id ?? null, guard + 1);
    }

    /**
     * Rantai DPO tidak cukup divalidasi pada level LP. Setiap tahap wajib merujuk
     * tersangka yang sama dan hasil tahap sebelumnya memang mengizinkan kelanjutan.
     * Nama dipakai exact setelah normalisasi; NIK, bila sama-sama tersedia, wajib exact.
     */
    private normalizeDpoName(value: any): string {
        return String(value || '').normalize('NFKC').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    private normalizeDpoNik(value: any): string {
        return String(value || '').replace(/\D/g, '');
    }

    private dpoPeople(data: any): any[] {
        return Array.isArray(data?.tersangka) ? data.tersangka.filter((p: any) => p && typeof p === 'object') : [];
    }

    private dpoPersonMatches(current: any, previous: any): boolean {
        const currentName = this.normalizeDpoName(current?.nama);
        const previousName = this.normalizeDpoName(previous?.nama);
        if (!currentName || currentName !== previousName) return false;
        const currentNik = this.normalizeDpoNik(current?.nik);
        const previousNik = this.normalizeDpoNik(previous?.nik);
        return !(currentNik && previousNik && currentNik !== previousNik);
    }

    private normalizeDpoDocumentNumber(value: any): string {
        return String(value || '').normalize('NFKC').trim().toUpperCase().replace(/\s+/g, '');
    }

    /**
     * LP Model A/DORS dapat sudah membawa pihak berstatus TERSANGKA tanpa pengguna
     * lebih dulu membuat dokumen PENETAPAN_TSK di CAS. Tahap Panggilan I karena itu
     * memeriksa tiga sumber tersangka yang sah pada LP yang sama: DORS, entri manual,
     * dan dokumen penetapan tersangka.
     */
    private async dpoKnownSuspectMatches(lpId: number, person: any): Promise<boolean> {
        const name = this.normalizeDpoName(person?.nama);
        const nik = this.normalizeDpoNik(person?.nik);
        if (!name) return false;
        const rows = await this.dataSource.query(
            `with suspect as (
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
             ) as cocok`,
            [lpId, name, nik]
        );
        return Boolean(rows[0]?.cocok);
    }

    private dpoDate(value: any): string {
        if (!value) return '';
        if (value instanceof Date) return value.toISOString().slice(0, 10);
        return String(value).slice(0, 10);
    }

    private async dpoDocuments(lpId: number, typeCode: string, excludeDocumentId?: number): Promise<any[]> {
        return this.dataSource.query(
            `select d.id,d.nomor_dokumen,d.tanggal_dokumen,d.data,d.created_at
             from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             where d.lp_id=$1 and t.code=$2
               and ($3::bigint is null or d.id<>$3::bigint)
             order by d.tanggal_dokumen desc nulls last,d.id desc`,
            [lpId, typeCode, excludeDocumentId ?? null]
        );
    }

    private async validateDpoPersonFlow(lpId: number, typeCode: string, data: any, excludeDocumentId?: number) {
        const flow: Record<string, { previousCode?: string; previousLabel: string; resultField?: string; allowedResults?: string[] }> = {
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
        if (!rule) return;

        const people = this.dpoPeople(data);
        if (!people.length) throw new BadRequestException('Minimal satu identitas tersangka wajib dipilih.');
        if (['SP_BAWA_TSK', 'PENETAPAN_DPO', 'CABUT_DPO'].includes(typeCode) && people.length !== 1) {
            throw new BadRequestException('Dokumen tahap ini hanya boleh diterbitkan untuk satu tersangka.');
        }
        for (let i = 0; i < people.length; i++) {
            const person = people[i];
            if (!this.normalizeDpoName(person?.nama)) throw new BadRequestException(`Nama tersangka pada baris ${i + 1} wajib diisi.`);
            for (let j = 0; j < i; j++) {
                if (this.dpoPersonMatches(person, people[j])) {
                    throw new BadRequestException(`Tersangka "${String(person.nama).trim()}" tercantum lebih dari satu kali.`);
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
                    throw new BadRequestException(`Tersangka "${label}" belum tercatat pada pihak DORS/manual atau dokumen penetapan tersangka LP ini.`);
                }
                continue;
            }
            let matchedDocument: any = null;
            for (const candidate of previousDocuments) {
                if (this.dpoPeople(candidate.data).some((prior: any) => this.dpoPersonMatches(person, prior))) {
                    matchedDocument = candidate;
                    break;
                }
            }
            const label = String(person.nama || '').trim();
            if (!matchedDocument) {
                throw new BadRequestException(`${rule.previousLabel} untuk tersangka "${label}" belum ditemukan pada LP ini.`);
            }

            const previousDate = this.dpoDate(matchedDocument.tanggal_dokumen || matchedDocument.data?.tanggal_dokumen);
            if (currentDate && previousDate && currentDate < previousDate) {
                throw new BadRequestException(`Tanggal dokumen untuk tersangka "${label}" tidak boleh lebih awal dari ${rule.previousLabel}.`);
            }

            if (rule.resultField && rule.allowedResults?.length) {
                const result = String(matchedDocument.data?.[rule.resultField] || '').trim();
                if (!rule.allowedResults.includes(result)) {
                    throw new BadRequestException(
                        `${rule.previousLabel} untuk tersangka "${label}" belum dapat dilanjutkan. Hasil tercatat: ${result || 'belum diisi'}.`
                    );
                }
            }

            if (typeCode === 'CABUT_DPO') {
                const expectedNumber = this.normalizeDpoDocumentNumber(
                    matchedDocument.nomor_dokumen || matchedDocument.data?.nomor_dokumen
                );
                const submittedNumber = this.normalizeDpoDocumentNumber(data?.nomor_dpo);
                if (!expectedNumber || submittedNumber !== expectedNumber) {
                    throw new BadRequestException(`Nomor DPO yang dicabut untuk tersangka "${label}" tidak cocok dengan DPO aktif.`);
                }
                const alreadyRevoked = existingRevocations.some((revocation: any) => {
                    const revocationDate = this.dpoDate(revocation.tanggal_dokumen || revocation.data?.tanggal_dokumen);
                    const revokedNumber = this.normalizeDpoDocumentNumber(revocation.data?.nomor_dpo);
                    return this.dpoPeople(revocation.data).some((prior: any) => this.dpoPersonMatches(person, prior))
                        && revokedNumber === expectedNumber
                        && (!previousDate || !revocationDate || revocationDate >= previousDate);
                });
                if (alreadyRevoked) throw new BadRequestException(`DPO atas nama "${label}" sudah pernah dicabut.`);
            }
        }
    }
    /** Status prasyarat: LP harus SUDAH pernah mencapai status tsb (status saat ini atau via dokumen). */
    private async statusReached(lpId: number, currentStatusId: number | null, statusPrasyaratId: number | null): Promise<boolean> {
        if (!statusPrasyaratId) return true;
        if (currentStatusId && Number(currentStatusId) === Number(statusPrasyaratId)) return true;
        const r = await this.dataSource.query(
            `select 1 from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id
             where d.lp_id=$1 and t.status_target_id=$2 limit 1`,
            [lpId, statusPrasyaratId]
        );
        return r.length > 0;
    }

    async availableActions(lpId: number, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        const lp = await this.dataSource.query('select id, status_id from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length) throw new NotFoundException('LP tidak ditemukan.');
        const currentStatusId = lp[0].status_id;
        const types = await this.dataSource.query(
            `select d.id, d.code, d.nama, d.urutan_tahap, d.status_prasyarat_id, d.dokumen_prasyarat_id,
                    st.code as status_target_code, st.nama as status_target_nama,
                    sp.code as status_prasyarat_code, sp.nama as status_prasyarat_nama,
                    dp.code as dokumen_prasyarat_code, dp.nama as dokumen_prasyarat_nama
             from bdb_document_type_master d
             left join bdb_status_master st on st.id=d.status_target_id
             left join bdb_status_master sp on sp.id=d.status_prasyarat_id
             left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
             where d.aktif=true order by d.urutan_tahap, d.code`
        );
        const out: any[] = [];
        for (const t of types) {
            const okStatus = await this.statusReached(lpId, currentStatusId, t.status_prasyarat_id);
            const okDoc = await this.docChainSatisfied(lpId, t.dokumen_prasyarat_id);
            const blockers: string[] = [];
            if (!okStatus) blockers.push(`Status prasyarat belum tercapai: ${t.status_prasyarat_nama || t.status_prasyarat_code || 'tahap sebelumnya'}.`);
            if (!okDoc) blockers.push(`Dokumen prasyarat belum dibuat: ${t.dokumen_prasyarat_nama || t.dokumen_prasyarat_code || 'dokumen sebelumnya'}.`);
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

    // ---------- Buat dokumen (efek: update status LP) ----------
    async createDokumen(lpId: number, documentTypeId: number, dataRaw: any, files: any[], userId?: number) {
        await this.assertLpAccess(lpId, userId);
        const lp = await this.dataSource.query('select id, status_id from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length) throw new NotFoundException('LP tidak ditemukan.');
        const dtRows = await this.dataSource.query(
            `select d.*, st.code as status_target_code, st.kategori as status_target_kategori
             from bdb_document_type_master d
             left join bdb_status_master st on st.id=d.status_target_id
             where d.id=$1 and d.aktif=true`,
            [documentTypeId]
        );
        if (!dtRows.length) throw new BadRequestException('Jenis surat tidak ditemukan/nonaktif.');
        const dt = dtRows[0];

        // Validasi prasyarat di server (jangan hanya UI)
        const okStatus = await this.statusReached(lpId, lp[0].status_id, dt.status_prasyarat_id);
        const okDoc = await this.docChainSatisfied(lpId, dt.dokumen_prasyarat_id);
        if (!okStatus || !okDoc) throw new BadRequestException('Prasyarat belum terpenuhi untuk membuat surat ini.');

        const data = typeof dataRaw === 'string' ? JSON.parse(dataRaw || '{}') : dataRaw || {};
        const fields: FieldDef[] = dt.form_schema?.fields || [];
        if (dt.code === 'PERMA') {
            if (dt.status_target_code !== 'PERMA' || dt.status_target_kategori !== 'CC') {
                throw new BadRequestException('Konfigurasi Perma tidak valid: target wajib PERMA (CC), bukan status lain.');
            }
            if (!PERMA_CATEGORIES.has(data.kategori_perma)) {
                throw new BadRequestException('Kategori Perma wajib Tipiring atau LHA PPATK.');
            }
            await this.normalizePermaCourt(data);
        }
        // Validasi required generic dari schema
        for (const f of fields) {
            if (f.lampiran || f.type === 'file') continue; // lampiran divalidasi terpisah
            if (isFieldRequired(f, data)) {
                const v = data[f.field_key];
                const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
                if (empty) throw new BadRequestException(`Field "${f.label}" wajib diisi.`);
            }
        }
        await this.validateDpoPersonFlow(lpId, dt.code, data);
        const requiredAttachment = fields.some((f) => (f.lampiran || f.type === 'file') && isFieldRequired(f, data));
        if (requiredAttachment && !(files || []).length) {
            throw new BadRequestException('Bukti / lampiran dokumen wajib diunggah.');
        }

        // Upload lampiran ke MinIO
        const lampiran: any[] = [];
        for (const file of files || []) {
            try {
                const key = await this.minio.upload(file, `dokumen/${lpId}`);
                lampiran.push({ name: file.originalname, key, size: file.size, mime: file.mimetype });
            } catch (e: any) {
                this.logger.warn('upload lampiran gagal: ' + (e?.message || e));
            }
        }
        if (requiredAttachment && !lampiran.length) {
            throw new BadRequestException('Bukti / lampiran gagal diunggah; dokumen belum disimpan.');
        }

        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const ins = await runner.query(
                `insert into bdb_dokumen (lp_id, document_type_id, nomor_dokumen, tanggal_dokumen, tanggal_mulai, tanggal_berakhir, data, lampiran, created_by)
                 values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9) returning id`,
                [lpId, documentTypeId, data.nomor_dokumen ?? null, data.tanggal_dokumen || null, data.tanggal_mulai || null, data.tanggal_berakhir || null, JSON.stringify(data), JSON.stringify(lampiran), userId ?? null]
            );
            const dokumenId = ins[0].id;
            // pasal
            const pasalArr = Array.isArray(data.pasal) ? data.pasal : [];
            for (const p of pasalArr) {
                const pasalId = p?.id || p?.pasal_id || null;
                const nomor = p?.nomor_pasal || (typeof p === 'string' ? p : null);
                const sumber = p?.sumber || (pasalId ? 'tambahan_manual' : 'tambahan_manual');
                await runner.query('insert into bdb_dokumen_pasal (dokumen_id, pasal_id, nomor_pasal, sumber) values ($1,$2,$3,$4)', [dokumenId, pasalId, nomor, sumber]);
            }
            // update status LP (satu-satunya jalur perubahan status)
            if (dt.status_target_id) {
                const statCat = await runner.query('select kategori from bdb_status_master where id=$1', [dt.status_target_id]);
                if (statCat[0]?.kategori === 'CC') {
                    // tanggal_selesai ditentukan dari tanggal dokumen CC ini (bukan tanggal sistem
                    // memproses), sesuai Ketentuan Penghitungan CT/CP/CC/CR/Indeks -- fallback ke
                    // hari ini kalau dokumennya entah kenapa tak punya tanggal_dokumen.
                    await runner.query(
                        'update bdb_laporan_polisi set status_id=$2, tanggal_selesai=coalesce($3::date, current_date), updated_at=now() where id=$1',
                        [lpId, dt.status_target_id, data.tanggal_dokumen || null]
                    );
                } else {
                    await runner.query('update bdb_laporan_polisi set status_id=$2, tanggal_selesai=null, updated_at=now() where id=$1', [lpId, dt.status_target_id]);
                }
            }
            await runner.commitTransaction();
            if (dt.code === 'PERMA') {
                try {
                    await this.audit.log({
                        userId,
                        action: 'CREATE_PERMA',
                        entity: 'laporan_polisi',
                        entityId: lpId,
                        meta: {
                            dokumen_id: dokumenId,
                            nomor_putusan: data.nomor_dokumen,
                            tanggal_putusan: data.tanggal_dokumen,
                            pengadilan: data.pengadilan,
                            pengadilan_eksternal_id: data.pengadilan_eksternal_id,
                            kategori_perma: data.kategori_perma,
                            nomor_sp2hp_a5: data.nomor_sp2hp_a5 || null,
                            tanggal_sp2hp_a5: data.tanggal_sp2hp_a5 || null,
                            status_baru: 'PERMA',
                            tanggal_selesai: data.tanggal_dokumen,
                            jumlah_lampiran: lampiran.length
                        },
                        outcome: 'SUCCESS'
                    });
                } catch (e: any) {
                    this.logger.warn('audit CREATE_PERMA gagal: ' + (e?.message || e));
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
            } catch (e: any) {
                this.logger.warn('audit CREATE_DOCUMENT gagal: ' + (e?.message || e));
            }
            const msg = dt.status_target_id ? `${dt.nama} tersimpan. Status LP diperbarui.` : `${dt.nama} tersimpan.`;
            return { status: 1, data: { dokumen_id: dokumenId, status_baru_id: dt.status_target_id }, message: msg };
        } catch (e: any) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }
    }

    // ---------- Timeline dokumen LP ----------
    async timeline(lpId: number, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        const lp = await this.dataSource.query(
            `select l.id, l.no_laporan, l.satker_nama, l.status_id, s.code as status_code, s.nama as status_nama
             from bdb_laporan_polisi l left join bdb_status_master s on s.id=l.status_id where l.id=$1`,
            [lpId]
        );
        if (!lp.length) throw new NotFoundException('LP tidak ditemukan.');
        const docs = await this.dataSource.query(
            `select d.id, d.nomor_dokumen, d.tanggal_dokumen, d.tanggal_mulai, d.tanggal_berakhir, d.data, d.lampiran, d.created_at, d.created_by,
                    u.name as created_by_nama,
                    t.code as type_code, t.nama as type_nama, t.urutan_tahap, st.code as status_target_code, st.nama as status_target_nama
             from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             left join bdb_status_master st on st.id=t.status_target_id
             left join auth_users u on u.id=d.created_by
             where d.lp_id=$1 order by t.urutan_tahap, d.tanggal_dokumen nulls last, d.id`,
            [lpId]
        );
        // presigned url utk lampiran
        for (const d of docs) {
            const lamp = Array.isArray(d.lampiran) ? d.lampiran : [];
            for (const f of lamp) {
                if (f.key) {
                    try {
                        f.url = await this.minio.presignedUrl(f.key);
                    } catch {
                        /* abaikan */
                    }
                }
            }
            const pr = await this.dataSource.query('select pasal_id, nomor_pasal, sumber from bdb_dokumen_pasal where dokumen_id=$1', [d.id]);
            d.pasal = pr;
        }
        return { status: 1, data: { lp: lp[0], dokumen: docs } };
    }

    // ---------- Edit / hapus dokumen ----------
    async updateDokumen(lpId: number, dokumenId: number, dataRaw: any, files: any[], keepKeysRaw: any, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        const rows = await this.dataSource.query(
            `select d.id, d.data as existing_data, d.lampiran, t.code as type_code, t.form_schema, t.status_target_id,
                    (select lp.status_id from bdb_laporan_polisi lp where lp.id=d.lp_id) as lp_status_id,
                    (select st.kategori from bdb_status_master st where st.id=t.status_target_id) as target_kategori,
                    (select st.code from bdb_status_master st where st.id=t.status_target_id) as target_status_code
             from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id where d.id=$1 and d.lp_id=$2`,
            [dokumenId, lpId]
        );
        if (!rows.length) throw new NotFoundException('Dokumen tidak ditemukan.');
        const doc = rows[0];
        const data = typeof dataRaw === 'string' ? JSON.parse(dataRaw || '{}') : dataRaw || {};
        const fields: FieldDef[] = doc.form_schema?.fields || [];
        if (doc.type_code === 'PERMA') {
            if (doc.target_status_code !== 'PERMA' || doc.target_kategori !== 'CC') {
                throw new BadRequestException('Konfigurasi Perma tidak valid: target wajib PERMA (CC), bukan status lain.');
            }
            if (!PERMA_CATEGORIES.has(data.kategori_perma)) {
                throw new BadRequestException('Kategori Perma wajib Tipiring atau LHA PPATK.');
            }
            await this.normalizePermaCourt(data, doc.existing_data || {});
        }
        for (const f of fields) {
            if (f.lampiran || f.type === 'file') continue;
            if (isFieldRequired(f, data)) {
                const v = data[f.field_key];
                const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
                if (empty) throw new BadRequestException(`Field "${f.label}" wajib diisi.`);
            }
        }
        await this.validateDpoPersonFlow(lpId, doc.type_code, data, dokumenId);
        // lampiran: pertahankan yang di keep_keys + upload file baru
        let keepKeys: string[] = [];
        try {
            keepKeys = Array.isArray(keepKeysRaw) ? keepKeysRaw : keepKeysRaw ? JSON.parse(keepKeysRaw) : [];
        } catch {
            keepKeys = [];
        }
        const existing = Array.isArray(doc.lampiran) ? doc.lampiran : [];
        const lampiran: any[] = existing.filter((l: any) => !l.key || keepKeys.includes(l.key));
        for (const file of files || []) {
            try {
                const key = await this.minio.upload(file, `dokumen/${lpId}`);
                lampiran.push({ name: file.originalname, key, size: file.size, mime: file.mimetype });
            } catch (e: any) {
                this.logger.warn('upload lampiran gagal: ' + (e?.message || e));
            }
        }
        const requiredAttachment = fields.some((f) => (f.lampiran || f.type === 'file') && isFieldRequired(f, data));
        if (requiredAttachment && !lampiran.length) {
            throw new BadRequestException('Bukti / lampiran dokumen wajib dipertahankan atau diunggah.');
        }
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            await runner.query(
                `update bdb_dokumen set nomor_dokumen=$3, tanggal_dokumen=$4, tanggal_mulai=$5, tanggal_berakhir=$6, data=$7::jsonb, lampiran=$8::jsonb where id=$1 and lp_id=$2`,
                [dokumenId, lpId, data.nomor_dokumen ?? null, data.tanggal_dokumen || null, data.tanggal_mulai || null, data.tanggal_berakhir || null, JSON.stringify(data), JSON.stringify(lampiran)]
            );
            await runner.query('delete from bdb_dokumen_pasal where dokumen_id=$1', [dokumenId]);
            const pasalArr = Array.isArray(data.pasal) ? data.pasal : [];
            for (const p of pasalArr) {
                const pasalId = p?.id || p?.pasal_id || null;
                const nomor = p?.nomor_pasal || (typeof p === 'string' ? p : null);
                await runner.query('insert into bdb_dokumen_pasal (dokumen_id, pasal_id, nomor_pasal, sumber) values ($1,$2,$3,$4)', [dokumenId, pasalId, nomor, p?.sumber || 'tambahan_manual']);
            }
            // kalau dokumen yang diedit ini adalah dokumen yg sedang jadi dasar status CC LP
            // (target statusnya kategori CC & sama dgn status LP saat ini), tanggal_selesai
            // harus ikut disesuaikan ke tanggal_dokumen yang baru diedit.
            if (doc.status_target_id && doc.status_target_id === doc.lp_status_id && doc.target_kategori === 'CC') {
                await runner.query('update bdb_laporan_polisi set tanggal_selesai=coalesce($2::date, current_date) where id=$1', [lpId, data.tanggal_dokumen || null]);
            }
            await runner.commitTransaction();
            if (doc.type_code === 'PERMA') {
                try {
                    await this.audit.log({
                        userId,
                        action: 'UPDATE_PERMA',
                        entity: 'laporan_polisi',
                        entityId: lpId,
                        meta: {
                            dokumen_id: dokumenId,
                            nomor_putusan: data.nomor_dokumen,
                            tanggal_putusan: data.tanggal_dokumen,
                            pengadilan: data.pengadilan,
                            pengadilan_eksternal_id: data.pengadilan_eksternal_id || null,
                            kategori_perma: data.kategori_perma,
                            nomor_sp2hp_a5: data.nomor_sp2hp_a5 || null,
                            tanggal_sp2hp_a5: data.tanggal_sp2hp_a5 || null,
                            tanggal_selesai: data.tanggal_dokumen,
                            jumlah_lampiran: lampiran.length
                        },
                        outcome: 'SUCCESS'
                    });
                } catch (e: any) {
                    this.logger.warn('audit UPDATE_PERMA gagal: ' + (e?.message || e));
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
            } catch (e: any) {
                this.logger.warn('audit UPDATE_DOCUMENT gagal: ' + (e?.message || e));
            }
            return { status: 1, message: 'Dokumen diperbarui.' };
        } catch (e: any) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }
    }

    async deleteDokumen(lpId: number, dokumenId: number, userId?: number) {
        await this.assertLpAccess(lpId, userId);
        const d = await this.dataSource.query(
            `select d.id, d.nomor_dokumen, d.tanggal_dokumen, d.data, d.lampiran, t.code as type_code
             from bdb_dokumen d join bdb_document_type_master t on t.id=d.document_type_id
             where d.id=$1 and d.lp_id=$2`,
            [dokumenId, lpId]
        );
        if (!d.length) throw new NotFoundException('Dokumen tidak ditemukan.');
        await this.dataSource.query('delete from bdb_dokumen where id=$1 and lp_id=$2', [dokumenId, lpId]);
        await this.recomputeLpStatus(lpId);
        if (d[0].type_code === 'PERMA') {
            try {
                await this.audit.log({
                    userId,
                    action: 'DELETE_PERMA',
                    entity: 'laporan_polisi',
                    entityId: lpId,
                    meta: {
                        dokumen_id: dokumenId,
                        nomor_putusan: d[0].nomor_dokumen,
                        tanggal_putusan: d[0].tanggal_dokumen,
                        pengadilan: d[0].data?.pengadilan || null,
                        kategori_perma: d[0].data?.kategori_perma || null,
                        nomor_sp2hp_a5: d[0].data?.nomor_sp2hp_a5 || null,
                        jumlah_lampiran: Array.isArray(d[0].lampiran) ? d[0].lampiran.length : 0,
                        status_dihitung_ulang: true
                    },
                    outcome: 'SUCCESS'
                });
            } catch (e: any) {
                this.logger.warn('audit DELETE_PERMA gagal: ' + (e?.message || e));
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
        } catch (e: any) {
            this.logger.warn('audit DELETE_DOCUMENT gagal: ' + (e?.message || e));
        }
        return { status: 1, message: 'Dokumen dihapus. Status LP disesuaikan.' };
    }

    /** Hitung ulang status LP dari dokumen tersisa (status terjauh yang tercapai; jika tak ada → LP). */
    private async recomputeLpStatus(lpId: number) {
        const r = await this.dataSource.query(
            `select st.id, st.kategori, d.tanggal_dokumen from bdb_dokumen d
             join bdb_document_type_master t on t.id=d.document_type_id
             join bdb_status_master st on st.id=t.status_target_id
             where d.lp_id=$1 and t.status_target_id is not null
             order by st.urutan desc, d.id desc limit 1`,
            [lpId]
        );
        let statusId = r[0]?.id;
        let isCc = r[0]?.kategori === 'CC';
        let ccDate = r[0]?.tanggal_dokumen || null;
        if (!statusId) {
            const base = await this.dataSource.query("select id from bdb_status_master where code='LP' limit 1");
            statusId = base[0]?.id ?? null;
            isCc = false;
        }
        // tanggal_selesai ikut status terjauh yg tersisa: kosongkan kalau status hasil recompute
        // bukan lagi kategori CC (mis. dokumen CC-nya baru dihapus), isi dari tanggal_dokumen
        // dokumen ybs kalau statusnya CC.
        await this.dataSource.query(
            'update bdb_laporan_polisi set status_id=$2, tanggal_selesai=$3::date, updated_at=now() where id=$1',
            [lpId, statusId, isCc ? ccDate || new Date().toISOString().slice(0, 10) : null]
        );
    }

    /**
     * Rekonsiliasi status SELURUH LP -- jaring pengaman terpisah dari recomputeLpStatus() (yg
     * cuma jalan per-LP tepat setelah hapus dokumen lewat deleteDokumen()). Kenapa perlu: status
     * LP yg tersimpan bisa "nyangkut" tak sesuai kenyataan lewat jalur LAIN yg tak pernah memicu
     * recompute -- data lama dari SEBELUM logic recompute ini ada, koreksi manual langsung ke DB,
     * migrasi data, atau bug lain yg belum ketemu. Daripada nunggu ketahuan manual satu-satu,
     * jalan otomatis tiap jam (lihat @Cron di bawah) + bisa dipaksa jalan kapan saja dari UI
     * (superadmin, lihat WorkflowController).
     *
     * Logika PERSIS SAMA dgn recomputeLpStatus() (status_target dari dokumen tersisa dgn urutan
     * status TERTINGGI, fallback ke status 'LP' kalau tak py dokumen sama sekali) -- cuma versi
     * SET-BASED (1 query SQL utk semua LP sekaligus, bukan loop per-LP) spy tetap cepat walau LP-
     * nya puluhan ribu baris. CTE `correct_status` dihitung SEKALI di awal statement (snapshot
     * sebelum UPDATE jalan), jadi status_id_lama di situ aman merujuk nilai SEBELUM diubah --
     * itulah cara detail "status lama -> baru" bisa dilaporkan tanpa query terpisah.
     */
    async reconcileAllLpStatus(): Promise<{ diperiksa: number; diperbaiki: number; detail: Array<{ lp_id: number; no_laporan: string; status_lama: string | null; status_baru: string }> }> {
        const [{ total }] = await this.dataSource.query('select count(*)::int as total from bdb_laporan_polisi where deleted_at is null');
        // PENTING (lihat riwayat bug sesi ini): DataSource.query() utk UPDATE...RETURNING balikin
        // TUPLE [rows[], affectedCount] -- BUKAN array baris langsung spt SELECT/INSERT. Tanpa
        // destructure [rows] di sini, rows.length akan selalu 2 (panjang tuple), bukan jumlah baris
        // yg benar2 diperbaiki -- sudah kena persis bug ini & diperbaiki 8 file lain sesi lalu.
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
        // detail DIBATASI 100 baris pertama (bukan diperbaiki, yg tetap hitungan PENUH) -- kalau ini
        // pertama kali jalan di data yg sudah lama "nyangkut" (banyak drift historis), rows bisa
        // ribuan -- payload sebesar itu ke UI/audit log tak berguna & cuma bikin lambat render.
        return { diperiksa: total, diperbaiki: rows.length, detail: rows.slice(0, 100) };
    }

    /** Catat SETIAP kali rekonsiliasi jalan (sql/bdb/088) -- termasuk saat diperbaiki=0, justru itu
     *  yg bikin "terakhir dijalankan kapan" di UI selalu akurat, bukan cuma tercatat pas kebetulan
     *  ada yg diperbaiki. Dipanggil oleh KEDUA jalur (cron & manual). */
    private async catatReconcileLog(triggeredBy: 'CRON' | 'MANUAL', r: { diperiksa: number; diperbaiki: number }, userId?: number, userName?: string) {
        await this.dataSource.query(
            'insert into bdb_lp_status_reconcile_log (triggered_by, user_id, user_name, diperiksa, diperbaiki) values ($1,$2,$3,$4,$5)',
            [triggeredBy, userId || null, userName || null, r.diperiksa, r.diperbaiki]
        );
    }

    /** Jalan otomatis tiap jam -- lihat catatan lengkap di reconcileAllLpStatus(). Cuma proses
     *  primer (lihat isPrimaryClusterInstance()) -- tanpa ini, cluster PM2 (32 proses) akan
     *  jalankan reconcile PENUH 32x tiap jam bersamaan (UPDATE bentrok/deadlock risk di
     *  bdb_laporan_polisi, plus 32 baris log & 32 entri audit redundan per jam -- sama kelas bug
     *  spt insiden rebuildHierarchy()/refreshSnapshot() 5 Agu 2026). */
    @Cron(CronExpression.EVERY_HOUR)
    private async cronReconcileLpStatus() {
        if (!isPrimaryClusterInstance()) return;
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
        } catch (e: any) {
            this.logger.error('Rekonsiliasi status LP (cron) gagal: ' + (e?.message || e));
        }
    }

    /** Dipicu manual dari UI (superadmin, "Paksa Jalankan") -- lihat WorkflowController. */
    async reconcileAllLpStatusManual(userId: number | undefined, userName: string | undefined) {
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Rekonsiliasi status LP hanya bisa dipicu superadmin.');
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

    /** Info utk UI: kapan terakhir jalan (cron & manual terpisah), interval jadwal, & kapan
     *  berikutnya (EVERY_HOUR = tiap pukul xx:00, dihitung deterministik dari jam sekarang -- tak
     *  perlu nyimpan state apa pun, cron NestJS sendiri anchor ke wall-clock, bukan relatif dari
     *  run terakhir). */
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
}
