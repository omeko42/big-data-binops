import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { effectiveLpOwnerId, hasEffectiveLpAccess } from '../common/lp-scope.util';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';

type Payload = Record<string, any>;
const SKALA_OPTS = ['nasional', 'regional', 'tidak viral'];

@Injectable()
export class BdbKasusMenonjolService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService
    ) {}

    private async ensureTables() {
        await this.dataSource.query(`
            create table if not exists bdb_kasus_menonjol (
                id bigserial primary key,
                judul text not null,
                skala_viral text,
                tanggal_rilis date,
                rilis boolean not null default false,
                keterangan text,
                satker_id bigint,
                created_by bigint,
                updated_by bigint,
                created_at timestamptz not null default now(),
                updated_at timestamptz not null default now(),
                deleted_at timestamptz
            );
            create table if not exists bdb_kasus_menonjol_lp (
                id bigserial primary key,
                kasus_menonjol_id bigint not null,
                lp_id bigint not null,
                created_at timestamptz not null default now(),
                unique (kasus_menonjol_id, lp_id)
            );
            create table if not exists bdb_kasus_menonjol_attachments (
                id bigserial primary key,
                kasus_menonjol_id bigint not null,
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
    private toBoolean(v: any): boolean {
        if (typeof v === 'boolean') return v;
        return ['true', '1', 'ya', 'yes'].includes(String(v ?? '').trim().toLowerCase());
    }
    private toSkala(v: any): string | null {
        const s = String(v ?? '').trim().toLowerCase();
        return SKALA_OPTS.includes(s) ? s : null;
    }
    private toLpIds(v: any): number[] {
        const arr = Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v];
        return [...new Set(arr.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))];
    }

    /** Pastikan LP yg mau ditautkan benar ada & (kalau bukan admin) semuanya di satker pemanggil. */
    private async validateLpIds(lpIds: number[], scope: { all: boolean; satkerId: number | null }): Promise<{ id: number; satker_id: number | null; unit_satker_id: number | null }[]> {
        if (!lpIds.length) return [];
        const rows = await this.dataSource.query(`select id, satker_id, unit_satker_id from bdb_laporan_polisi where id = any($1) and deleted_at is null`, [lpIds]);
        if (rows.length !== lpIds.length) throw new BadRequestException('Ada LP yang dipilih tidak ditemukan.');
        if (!scope.all) {
            const outside = rows.filter((r: any) => !hasEffectiveLpAccess(r, scope.satkerId));
            if (outside.length) throw new ForbiddenException('Semua LP yang ditautkan harus dari satker Anda sendiri.');
        }
        return rows;
    }

    private buildBaseSelect() {
        return `
            select
                k.id, k.judul, k.skala_viral, k.tanggal_rilis, k.rilis, k.keterangan, k.satker_id,
                k.created_by, k.updated_by, k.created_at, k.updated_at,
                (select count(*)::int from bdb_kasus_menonjol_lp l where l.kasus_menonjol_id = k.id) as jumlah_lp,
                (select count(*)::int from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id) as jumlah_lampiran,
                (select string_agg(distinct s.satker_nama, ', ') from bdb_kasus_menonjol_lp l
                    join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_menonjol_id = k.id) as satker_terkait,
                (select lp0.no_laporan from bdb_kasus_menonjol_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                    where l0.kasus_menonjol_id = k.id order by l0.id limit 1) as first_no_laporan
            from bdb_kasus_menonjol k
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
        if (!scope.all) {
            if (!scope.satkerId) {
                return { data: [], meta: { total: 0, page, limit, totalPages: 1 } };
            }
            params.push(scope.satkerId);
            where.push(`k.satker_id = $${params.length}`);
        }

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            where.push(`lower(coalesce(k.judul,'')) like $${params.length}`);
        }
        const skala = this.toText(query.skala_viral);
        if (skala && SKALA_OPTS.includes(skala)) {
            params.push(skala);
            where.push(`k.skala_viral = $${params.length}`);
        }

        const whereSql = where.join(' and ');
        const totalRow = await this.dataSource.query(`select count(*)::int as total from bdb_kasus_menonjol k where ${whereSql}`, params);
        const total = Number(totalRow?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `${this.buildBaseSelect()} where ${whereSql} order by k.created_at desc, k.id desc limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit, offset]
        );

        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }

    async findOne(id: number, userId: number | undefined) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);
        const rows = await this.dataSource.query(`${this.buildBaseSelect()} where k.id = $1 and k.deleted_at is null`, [id]);
        const row = rows[0];
        if (!row) throw new NotFoundException('Kasus menonjol tidak ditemukan.');
        if (!scope.all && Number(row.satker_id) !== scope.satkerId) throw new NotFoundException('Kasus menonjol tidak ditemukan.');
        return row;
    }

    async listLp(kasusId: number, userId: number | undefined) {
        await this.findOne(kasusId, userId); // scope-check
        return this.dataSource.query(
            `select lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.tgl_laporan,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama
             from bdb_kasus_menonjol_lp l
             join bdb_laporan_polisi lp on lp.id = l.lp_id
             left join bdb_status_master sm on sm.id = lp.status_id
             where l.kasus_menonjol_id = $1
             order by l.id`,
            [kasusId]
        );
    }

    private async replaceLpLinks(kasusId: number, lpIds: number[]) {
        await this.dataSource.query(`delete from bdb_kasus_menonjol_lp where kasus_menonjol_id = $1`, [kasusId]);
        for (const lpId of lpIds) {
            await this.dataSource.query(`insert into bdb_kasus_menonjol_lp (kasus_menonjol_id, lp_id) values ($1,$2) on conflict do nothing`, [kasusId, lpId]);
        }
    }

    async create(userId: number | undefined, dto: Payload) {
        await this.ensureTables();
        const scope = await resolveScope(this.dataSource, userId);

        const judul = this.toText(dto.judul);
        if (!judul) throw new BadRequestException('Judul wajib diisi.');

        const lpIds = this.toLpIds(dto.lp_ids);
        const lpRows = await this.validateLpIds(lpIds, scope);

        let satkerId: number | null = null;
        if (lpRows.length) satkerId = effectiveLpOwnerId(lpRows[0]);
        else if (!scope.all) satkerId = scope.satkerId;

        const rilis = this.toBoolean(dto.rilis);
        const tanggalRilis = this.toDate(dto.tanggal_rilis);
        if (rilis && !tanggalRilis) throw new BadRequestException('Tanggal rilis wajib diisi jika sudah dirilis.');

        const payload = {
            judul,
            skala_viral: this.toSkala(dto.skala_viral),
            tanggal_rilis: tanggalRilis,
            rilis,
            keterangan: this.toText(dto.keterangan),
            satker_id: satkerId,
            created_by: userId ?? null,
            updated_by: userId ?? null
        };
        const keys = Object.keys(payload);
        const rows = await this.dataSource.query(
            `insert into bdb_kasus_menonjol (${keys.join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) returning id`,
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

        const lpIds = dto.lp_ids !== undefined ? this.toLpIds(dto.lp_ids) : null;
        const lpRows = lpIds !== null ? await this.validateLpIds(lpIds, scope) : null;

        let satkerId = existing.satker_id;
        if (lpRows !== null) {
            if (lpRows.length) satkerId = effectiveLpOwnerId(lpRows[0]);
            else if (!scope.all) satkerId = scope.satkerId;
            else satkerId = null;
        }

        const payload: Payload = { updated_by: userId ?? null, satker_id: satkerId };
        if (dto.judul !== undefined) {
            const judul = this.toText(dto.judul);
            if (!judul) throw new BadRequestException('Judul wajib diisi.');
            payload.judul = judul;
        }
        if (dto.skala_viral !== undefined) payload.skala_viral = this.toSkala(dto.skala_viral);
        if (dto.tanggal_rilis !== undefined) payload.tanggal_rilis = this.toDate(dto.tanggal_rilis);
        if (dto.rilis !== undefined) payload.rilis = this.toBoolean(dto.rilis);
        if (dto.keterangan !== undefined) payload.keterangan = this.toText(dto.keterangan);

        const rilisFinal = dto.rilis !== undefined ? payload.rilis : existing.rilis;
        const tanggalRilisFinal = dto.tanggal_rilis !== undefined ? payload.tanggal_rilis : existing.tanggal_rilis;
        if (rilisFinal && !tanggalRilisFinal) throw new BadRequestException('Tanggal rilis wajib diisi jika sudah dirilis.');

        const keys = Object.keys(payload);
        const sets = keys.map((k, i) => `${k} = $${i + 1}`);
        sets.push('updated_at = now()');
        const params = keys.map((k) => payload[k]);
        params.push(id);
        await this.dataSource.query(`update bdb_kasus_menonjol set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);

        if (lpIds !== null) await this.replaceLpLinks(id, lpIds);
        return this.findOne(id, userId);
    }

    async remove(id: number, userId: number | undefined) {
        await this.ensureTables();
        await this.findOne(id, userId); // scope-checked
        await this.dataSource.query('update bdb_kasus_menonjol set deleted_at = now() where id = $1', [id]);
        return { status: 1, message: 'Kasus menonjol dihapus.' };
    }

    // ===== Lampiran (MinIO) =====
    async addAttachments(kasusId: number, userId: number | undefined, files: UploadedFileLike[]) {
        await this.findOne(kasusId, userId); // scope-check
        if (!files?.length) return this.listAttachments(kasusId, userId);
        for (const f of files) {
            const key = await this.minio.upload(f, 'kasus-menonjol');
            await this.dataSource.query(
                `insert into bdb_kasus_menonjol_attachments (kasus_menonjol_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`,
                [kasusId, f.originalname, key, f.mimetype || null, f.size || null]
            );
        }
        return this.listAttachments(kasusId, userId);
    }

    async listAttachments(kasusId: number, userId: number | undefined) {
        await this.findOne(kasusId, userId); // scope-check
        const rows = await this.dataSource.query(
            `select id, file_name, object_key, content_type, size, created_at from bdb_kasus_menonjol_attachments where kasus_menonjol_id = $1 order by id desc`,
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
        const rows = await this.dataSource.query(`select kasus_menonjol_id, object_key from bdb_kasus_menonjol_attachments where id = $1`, [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan.');
        await this.findOne(Number(rows[0].kasus_menonjol_id), userId); // scope-check
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* biarkan hapus metadata walau objek gagal dihapus */
        }
        await this.dataSource.query(`delete from bdb_kasus_menonjol_attachments where id = $1`, [attId]);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
}
