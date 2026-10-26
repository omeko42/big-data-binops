import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';

type Payload = Record<string, any>;
const SUMBER_OPTS = ['pimpinan', 'internal', 'media', 'masyarakat', 'instansi lain'];
const LEVEL_OPTS = ['tinggi', 'sedang', 'biasa'];
const STATUS_OPTS = ['aktif', 'selesai'];

/**
 * Kasus Atensi (Susatensi) -- penandaan kasus yg mendapat perhatian khusus pimpinan atau
 * butuh monitoring internal. Struktur & pola identik dgn BdbKasusMenonjolService (Susjol),
 * cuma field spesifiknya beda (sumber/level/status atensi vs skala_viral/rilis).
 */
@Injectable()
export class BdbKasusAtensiService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService
    ) {}

    private tableEnsured = false;
    async ensureTables() {
        if (this.tableEnsured) return;
        this.tableEnsured = true;
        await this.dataSource.query(`
            create table if not exists bdb_kasus_atensi (
                id bigserial primary key,
                judul text not null,
                sumber_atensi text,
                level_atensi text,
                tanggal_atensi date,
                status_atensi text not null default 'aktif',
                keterangan text,
                satker_id bigint,
                created_by bigint,
                updated_by bigint,
                created_at timestamptz not null default now(),
                updated_at timestamptz not null default now(),
                deleted_at timestamptz
            );
            create table if not exists bdb_kasus_atensi_lp (
                id bigserial primary key,
                kasus_atensi_id bigint not null,
                lp_id bigint not null,
                created_at timestamptz not null default now(),
                unique (kasus_atensi_id, lp_id)
            );
            create table if not exists bdb_kasus_atensi_attachments (
                id bigserial primary key,
                kasus_atensi_id bigint not null,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamptz not null default now()
            );
        `);
    }

    private toText(v: any): string | null {
        if (v === undefined || v === null) return null;
        const t = String(v).trim();
        return t ? t : null;
    }
    private toDate(v: any): string | null {
        if (!v) return null;
        const t = String(v).trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
    }
    private toSumber(v: any): string | null {
        const s = String(v ?? '').trim().toLowerCase();
        return SUMBER_OPTS.includes(s) ? s : null;
    }
    private toLevel(v: any): string | null {
        const s = String(v ?? '').trim().toLowerCase();
        return LEVEL_OPTS.includes(s) ? s : null;
    }
    private toStatus(v: any): string {
        const s = String(v ?? '').trim().toLowerCase();
        return STATUS_OPTS.includes(s) ? s : 'aktif';
    }
    private toLpIds(v: any): number[] {
        const arr = Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v];
        return [...new Set(arr.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))];
    }

    /** Pastikan LP yg mau ditautkan benar ada & (kalau bukan admin) semuanya di satker pemanggil. */
    private async validateLpIds(lpIds: number[], scope: { all: boolean; satkerId: number | null }): Promise<{ id: number; satker_id: number | null }[]> {
        if (!lpIds.length) return [];
        const rows = await this.dataSource.query(`select id, satker_id from bdb_laporan_polisi where id = any($1) and deleted_at is null`, [lpIds]);
        if (rows.length !== lpIds.length) throw new BadRequestException('Ada LP yang dipilih tidak ditemukan.');
        if (!scope.all) {
            const outside = rows.filter((r: any) => Number(r.satker_id) !== scope.satkerId);
            if (outside.length) throw new ForbiddenException('Semua LP yang ditautkan harus dari satker Anda sendiri.');
        }
        return rows;
    }
    private async enrichGenericTitle(judul: string, lpIds: number[]): Promise<string> {
        const isGeneric = /^(pihak\s+)?terlibat\s+(wna|anggota\s+polri|polri)$/i.test(judul.trim()) ||
                          /^(perhatian\s+publik)$/i.test(judul.trim());
        if (!isGeneric || !lpIds.length) return judul;

        const rows = await this.dataSource.query(
            `select tempat_kejadian, unit_nama, satker_nama, payload_json from bdb_laporan_polisi where id = $1 limit 1`,
            [lpIds[0]]
        );
        if (!rows.length) return judul;
        const r = rows[0];
        const rawTkp = (r.tempat_kejadian || r.payload_json?.tempat_kejadian || '').replace(/^JL\.?\s*/i, '').split(',')[0].trim();
        const tag = rawTkp ? rawTkp.slice(0, 45) : (r.unit_nama || r.satker_nama || '').trim();
        return tag ? `${judul.trim().toUpperCase()} - ${tag.toUpperCase()}` : judul;
    }

    private satkerDepthExpr() {
        return `coalesce((
            select case
                when s.id in (1,2,3,4,13) or s.parent_id = 13
                  or upper(coalesce(s.deskripsi,'')) like '%BARESKRIM%'
                  or upper(coalesce(s.deskripsi,'')) like '%MABES%'
                  or upper(coalesce(s.deskripsi,'')) like '%DITTIPID%'
                  or upper(coalesce(s.deskripsi,'')) like '%DENSUS%'
                  or upper(coalesce(s.deskripsi,'')) like '%BAHARKAM%'
                  or upper(coalesce(s.nama_singkat,'')) like '%BARESKRIM%' then 1
                when upper(coalesce(s.deskripsi,'')) like '%POLSEK%' then 4
                when upper(coalesce(s.deskripsi,'')) like '%POLRES%'
                  or upper(coalesce(s.deskripsi,'')) like '%POLRESTA%'
                  or upper(coalesce(s.deskripsi,'')) like 'RES %'
                  or upper(coalesce(s.deskripsi,'')) like '% RES %' then 3
                when upper(coalesce(s.deskripsi,'')) like '%POLDA%' or s.depth <= 2 then 2
                else greatest(2, least(4, coalesce(s.depth::int, 4)))
            end
            from bdb_satker s
            where s.id = coalesce(
                k.satker_id,
                (select coalesce(lp0.unit_satker_id, lp0.satker_id) from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_atensi_id = k.id order by l0.id limit 1)
            )
            limit 1
        ), 99)`;
    }

    private buildBaseSelect() {
        return `
            select
                k.id, k.judul, k.sumber_atensi, k.level_atensi, k.tanggal_atensi::text as tanggal_atensi, k.status_atensi, k.keterangan, k.satker_id,
                ${this.satkerDepthExpr()} as satker_depth,
                coalesce(
                    (select coalesce(nullif(s.nama_singkat,''), s.deskripsi) from bdb_satker s where s.id = k.satker_id limit 1),
                    (select lp0.satker_nama from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_atensi_id = k.id order by l0.id limit 1)
                ) as satker_nama,
                k.created_by, k.updated_by, k.created_at, k.updated_at,
                (select count(*)::int from bdb_kasus_atensi_lp l where l.kasus_atensi_id = k.id) as jumlah_lp,
                (select count(*)::int from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id) as jumlah_lampiran,
                (select string_agg(distinct s.satker_nama, ', ') from bdb_kasus_atensi_lp l
                    join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_atensi_id = k.id) as satker_terkait,
                (select lp0.no_laporan from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                    where l0.kasus_atensi_id = k.id order by l0.id limit 1) as first_no_laporan,
                (select lp0.tgl_laporan from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                    where l0.kasus_atensi_id = k.id order by l0.id limit 1) as first_tgl_laporan
            from bdb_kasus_atensi k
        `;
    }

    async list(userId: number | undefined, query: any = {}) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const where: string[] = ['k.deleted_at is null'];
        if (query.scope === 'scoped' && !scope.all) {
            if (!scope.satkerId) {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 1,
                        summary: { total_all: 0, tinggi: 0, sedang: 0, biasa: 0, aktif: 0, selesai: 0, total_lp_terkait: 0 }
                    }
                };
            }
            params.push(scope.satkerId);
            where.push(`k.satker_id = $${params.length}`);
        }

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(
                lower(coalesce(k.judul,'')) like $${p}
                or lower(coalesce(k.keterangan,'')) like $${p}
                or exists (
                    select 1 from bdb_kasus_atensi_lp l_s
                    join bdb_laporan_polisi lp_s on lp_s.id = l_s.lp_id
                    where l_s.kasus_atensi_id = k.id
                      and (lower(coalesce(lp_s.no_laporan,'')) like $${p} or lower(coalesce(lp_s.satker_nama,'')) like $${p})
                )
            )`);
        }

        const summaryWhereSql = where.join(' and ');
        const summaryParams = [...params];

        const status = this.toText(query.status_atensi)?.toLowerCase() || null;
        if (status && !['all', 'semua'].includes(status)) {
            params.push(status);
            where.push(`lower(coalesce(k.status_atensi,'aktif')) = $${params.length}`);
        }

        const level = this.toText(query.level_atensi)?.toLowerCase() || null;
        if (level && !['all', 'semua'].includes(level)) {
            params.push(level);
            where.push(`lower(coalesce(k.level_atensi,'')) = $${params.length}`);
        }

        const sumber = this.toText(query.sumber_atensi)?.toLowerCase() || null;
        if (sumber && !['all', 'semua'].includes(sumber)) {
            params.push(sumber);
            where.push(`lower(coalesce(k.sumber_atensi,'')) = $${params.length}`);
        }

        const whereSql = where.join(' and ');

        const orderBy = `order by
            (select count(*)::int from bdb_kasus_atensi_lp l where l.kasus_atensi_id = k.id) desc,
            ${this.satkerDepthExpr()} asc,
            case when lower(coalesce(k.level_atensi,'')) = 'tinggi' then 1
                 when lower(coalesce(k.level_atensi,'')) = 'sedang' then 2
                 else 3 end asc,
            case when lower(coalesce(k.status_atensi,'aktif')) = 'aktif' then 0 else 1 end asc,
            coalesce(k.tanggal_atensi::timestamptz, k.created_at) desc,
            k.created_at desc,
            k.id desc`;

        const [totalRow, summaryRow, rows] = await Promise.all([
            this.dataSource.query(`select count(*)::int as total from bdb_kasus_atensi k where ${whereSql}`, params),
            this.dataSource.query(
                `select
                    count(*)::int as total_all,
                    count(*) filter (where lower(coalesce(k.level_atensi,'')) = 'tinggi')::int as tinggi,
                    count(*) filter (where lower(coalesce(k.level_atensi,'')) = 'sedang')::int as sedang,
                    count(*) filter (where lower(coalesce(k.level_atensi,'')) = 'biasa' or coalesce(k.level_atensi,'') = '')::int as biasa,
                    count(*) filter (where lower(coalesce(k.status_atensi,'aktif')) = 'aktif')::int as aktif,
                    count(*) filter (where lower(coalesce(k.status_atensi,'aktif')) = 'selesai')::int as selesai,
                    coalesce((
                        select count(*)::int
                        from bdb_kasus_atensi_lp l_cnt
                        join bdb_kasus_atensi k on k.id = l_cnt.kasus_atensi_id
                        where ${summaryWhereSql}
                    ), 0) as total_lp_terkait
                 from bdb_kasus_atensi k
                 where ${summaryWhereSql}`,
                summaryParams
            ),
            this.dataSource.query(
                `${this.buildBaseSelect()} where ${whereSql} ${orderBy} limit $${params.length + 1} offset $${params.length + 2}`,
                [...params, limit, offset]
            )
        ]);
        const total = Number(totalRow?.[0]?.total || 0);
        const s = summaryRow?.[0] || {};
        const summary = {
            total_all: Number(s.total_all || 0),
            tinggi: Number(s.tinggi || 0),
            sedang: Number(s.sedang || 0),
            biasa: Number(s.biasa || 0),
            aktif: Number(s.aktif || 0),
            selesai: Number(s.selesai || 0),
            total_lp_terkait: Number(s.total_lp_terkait || 0)
        };

        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)), summary } };
    }

    async findOne(id: number, userId: number | undefined) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);
        const rows = await this.dataSource.query(`${this.buildBaseSelect()} where k.id = $1 and k.deleted_at is null`, [id]);
        const row = rows[0];
        if (!row) throw new NotFoundException('Kasus atensi tidak ditemukan.');
        return row;
    }

    async listLp(kasusId: number, userId: number | undefined) {
        await this.findOne(kasusId, userId); // scope-check
        return this.dataSource.query(
            `select lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.tgl_laporan,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama
             from bdb_kasus_atensi_lp l
             join bdb_laporan_polisi lp on lp.id = l.lp_id
             left join bdb_status_master sm on sm.id = lp.status_id
             where l.kasus_atensi_id = $1
             order by l.id`,
            [kasusId]
        );
    }

    private async replaceLpLinks(kasusId: number, lpIds: number[]) {
        await this.dataSource.query(`delete from bdb_kasus_atensi_lp where kasus_atensi_id = $1`, [kasusId]);
        for (const lpId of lpIds) {
            await this.dataSource.query(`insert into bdb_kasus_atensi_lp (kasus_atensi_id, lp_id) values ($1,$2) on conflict do nothing`, [kasusId, lpId]);
        }
    }

    async create(userId: number | undefined, dto: Payload) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);

        let judul = this.toText(dto.judul);
        if (!judul) throw new BadRequestException('Judul wajib diisi.');

        const lpIds = this.toLpIds(dto.lp_ids);
        const lpRows = await this.validateLpIds(lpIds, scope);
        judul = await this.enrichGenericTitle(judul, lpIds);

        let satkerId: number | null = null;
        if (lpRows.length) satkerId = Number(lpRows[0].satker_id) || null;
        else if (!scope.all) satkerId = scope.satkerId;

        const payload = {
            judul,
            sumber_atensi: this.toSumber(dto.sumber_atensi),
            level_atensi: this.toLevel(dto.level_atensi),
            tanggal_atensi: this.toDate(dto.tanggal_atensi),
            status_atensi: this.toStatus(dto.status_atensi),
            keterangan: this.toText(dto.keterangan),
            satker_id: satkerId,
            created_by: userId ?? null,
            updated_by: userId ?? null
        };
        const keys = Object.keys(payload);
        const rows = await this.dataSource.query(
            `insert into bdb_kasus_atensi (${keys.join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) returning id`,
            keys.map((k) => (payload as any)[k])
        );
        const id = Number(rows[0].id);
        if (lpIds.length) await this.replaceLpLinks(id, lpIds);
        return this.findOne(id, userId);
    }

    async update(id: number, userId: number | undefined, dto: Payload) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);
        const existing = await this.findOne(id, userId); // scope-checked
        if (!scope.all && Number(existing.satker_id) !== scope.satkerId) {
            throw new ForbiddenException('Tidak memiliki akses mengubah kasus ini.');
        }

        const lpIds = dto.lp_ids !== undefined ? this.toLpIds(dto.lp_ids) : null;
        const lpRows = lpIds !== null ? await this.validateLpIds(lpIds, scope) : null;

        let satkerId = existing.satker_id;
        if (lpRows !== null) {
            if (lpRows.length) satkerId = Number(lpRows[0].satker_id) || null;
            else if (!scope.all) satkerId = scope.satkerId;
            else satkerId = null;
        }

        const payload: Payload = { updated_by: userId ?? null, satker_id: satkerId };
        if (dto.judul !== undefined) {
            let judul = this.toText(dto.judul);
            if (!judul) throw new BadRequestException('Judul wajib diisi.');
            const targetLpIds = lpIds !== null ? lpIds : (await this.dataSource.query('select lp_id from bdb_kasus_atensi_lp where kasus_atensi_id = $1 limit 1', [id])).map((r: any) => r.lp_id);
            judul = await this.enrichGenericTitle(judul, targetLpIds);
            payload.judul = judul;
        }
        if (dto.sumber_atensi !== undefined) payload.sumber_atensi = this.toSumber(dto.sumber_atensi);
        if (dto.level_atensi !== undefined) payload.level_atensi = this.toLevel(dto.level_atensi);
        if (dto.tanggal_atensi !== undefined) payload.tanggal_atensi = this.toDate(dto.tanggal_atensi);
        if (dto.status_atensi !== undefined) payload.status_atensi = this.toStatus(dto.status_atensi);
        if (dto.keterangan !== undefined) payload.keterangan = this.toText(dto.keterangan);

        const keys = Object.keys(payload);
        const sets = keys.map((k, i) => `${k} = $${i + 1}`);
        sets.push('updated_at = now()');
        const params = keys.map((k) => payload[k]);
        params.push(id);
        await this.dataSource.query(`update bdb_kasus_atensi set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);

        if (lpIds !== null) await this.replaceLpLinks(id, lpIds);
        return this.findOne(id, userId);
    }

    async remove(id: number, userId: number | undefined) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);
        const existing = await this.findOne(id, userId); // scope-checked
        if (!scope.all && Number(existing.satker_id) !== scope.satkerId) {
            throw new ForbiddenException('Tidak memiliki akses menghapus kasus ini.');
        }
        await this.dataSource.query('update bdb_kasus_atensi set deleted_at = now() where id = $1', [id]);
        return { status: 1, message: 'Kasus atensi dihapus.' };
    }

    // ===== Lampiran (MinIO) =====
    async addAttachments(kasusId: number, userId: number | undefined, files: UploadedFileLike[]) {
        await this.findOne(kasusId, userId); // scope-check
        if (!files?.length) return this.listAttachments(kasusId, userId);
        for (const f of files) {
            const key = await this.minio.upload(f, 'kasus-atensi');
            await this.dataSource.query(
                `insert into bdb_kasus_atensi_attachments (kasus_atensi_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`,
                [kasusId, f.originalname, key, f.mimetype || null, f.size || null]
            );
        }
        return this.listAttachments(kasusId, userId);
    }

    async listAttachments(kasusId: number, userId: number | undefined) {
        await this.findOne(kasusId, userId); // scope-check
        const rows = await this.dataSource.query(
            `select id, file_name, object_key, content_type, size, created_at from bdb_kasus_atensi_attachments where kasus_atensi_id = $1 order by id desc`,
            [kasusId]
        );
        const data = [];
        for (const r of rows) {
            let url: string | null = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            } catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }

    async removeAttachment(attId: number, userId: number | undefined) {
        const rows = await this.dataSource.query(`select kasus_atensi_id, object_key from bdb_kasus_atensi_attachments where id = $1`, [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan.');
        await this.findOne(Number(rows[0].kasus_atensi_id), userId); // scope-check
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* biarkan hapus metadata walau objek gagal dihapus */
        }
        await this.dataSource.query(`delete from bdb_kasus_atensi_attachments where id = $1`, [attId]);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
}
