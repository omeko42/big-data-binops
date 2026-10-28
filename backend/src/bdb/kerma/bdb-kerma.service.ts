import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService, UploadedFileLike } from './minio.service';

type KermaPayload = Record<string, any>;

@Injectable()
export class BdbKermaService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService
    ) {}

    private async ensureAttachmentTable() {
        await this.dataSource.query(`
            create table if not exists bdb_kerma_attachments (
                id bigserial primary key,
                kerma_id bigint not null,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamp not null default now()
            );
            create index if not exists bdb_kerma_attachments_kerma_id_idx on bdb_kerma_attachments (kerma_id);
        `);
    }

    /** Upload beberapa file ke MinIO + simpan metadata. Kembalikan daftar lampiran (dengan URL). */
    async addAttachments(kermaId: number, files: UploadedFileLike[]) {
        await this.ensureAttachmentTable();
        if (!files?.length) return this.listAttachments(kermaId);
        for (const f of files) {
            const key = await this.minio.upload(f, 'kerma');
            await this.dataSource.query(
                `insert into bdb_kerma_attachments (kerma_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`,
                [kermaId, f.originalname, key, f.mimetype || null, f.size || null]
            );
        }
        return this.listAttachments(kermaId);
    }

    /** Daftar lampiran + presigned URL untuk dilihat/diunduh. */
    async listAttachments(kermaId: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at from bdb_kerma_attachments where kerma_id = $1 order by id desc`, [kermaId]);
        const data = [];
        for (const r of rows) {
            let url = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            } catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }

    async removeAttachment(attId: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select object_key from bdb_kerma_attachments where id = $1`, [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan');
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* biarkan hapus metadata walau objek gagal dihapus */
        }
        await this.dataSource.query(`delete from bdb_kerma_attachments where id = $1`, [attId]);
        return { status: 1, message: 'Lampiran dihapus' };
    }

    private async ensureTable() {
        await this.ensureAttachmentTable();
        await this.dataSource.query(`
            create table if not exists bdb_kerma_master (
                id bigserial primary key,
                tahun_data integer,
                institusi text,
                nomor_dokumen_mitra text,
                nomor_dokumen_polri text,
                jenis_naskah text,
                tentang text,
                tanggal_mulai date,
                tanggal_akhir date,
                masa_berlaku_text text,
                satker_terkait text,
                sub_satker_terkait text,
                catatan text,
                pedoman_pelaksanaan text,
                status text default 'AKTIF',
                file_dokumen_url text,
                is_tampil boolean default true,
                created_by text,
                updated_by text,
                created_at timestamptz default now(),
                updated_at timestamptz default now(),
                deleted_at timestamptz
            );
        `);

        await this.dataSource.query(`create index if not exists idx_bdb_kerma_deleted on bdb_kerma_master(deleted_at);`);
        await this.dataSource.query(`create index if not exists idx_bdb_kerma_tanggal_akhir on bdb_kerma_master(tanggal_akhir);`);
        await this.dataSource.query(`create index if not exists idx_bdb_kerma_tahun on bdb_kerma_master(tahun_data);`);
        await this.dataSource.query(`create index if not exists idx_bdb_kerma_status on bdb_kerma_master(status);`);

        // Master Jenis Naskah (dropdown, bukan input bebas lagi) -- diisi via migration
        // sql/bdb/057_kerma_perbaikan.sql; create+seed di sini cuma jaga2 utk install fresh yg
        // belum sempat jalankan migration itu (aman diulang, on conflict do nothing).
        await this.dataSource.query(`
            create table if not exists bdb_kerma_jenis_naskah (
                id bigserial primary key,
                nama text not null unique,
                urutan int not null default 0,
                created_at timestamptz not null default now()
            );
        `);
        await this.dataSource.query(`
            insert into bdb_kerma_jenis_naskah (nama, urutan) values
                ('Nota Kesepahaman', 1), ('Perjanjian Kerja Sama', 2), ('Adendum Perjanjian Kerja Sama', 3),
                ('Pedoman Kerja', 4), ('Pedoman Kerja Bersama', 5), ('Peraturan Bersama', 6),
                ('Kesepakatan Bersama', 7), ('Keputusan Bersama', 8)
            on conflict (nama) do nothing;
        `);
    }

    /** Daftar master Jenis Naskah (dropdown Kelola Kerma). */
    async listJenisNaskah() {
        await this.ensureTable();
        const rows = await this.dataSource.query('select id, nama from bdb_kerma_jenis_naskah order by urutan, nama');
        return { status: 1, data: rows };
    }

    private toText(value: any): string | null {
        if (value === undefined || value === null) return null;
        const text = String(value).trim();
        return text.length ? text : null;
    }

    private toNumber(value: any): number | null {
        if (value === undefined || value === null || value === '') return null;
        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? numberValue : null;
    }

    private toDate(value: any): string | null {
        if (value === undefined || value === null || value === '') return null;
        if (value instanceof Date && !isNaN(value.getTime())) {
            const jkt = new Date(value.getTime() + 7 * 3600 * 1000);
            return jkt.toISOString().slice(0, 10);
        }
        const text = String(value).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
        const dmy = text.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
        if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
        if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
            const parsed = new Date(text);
            if (!isNaN(parsed.getTime())) {
                const jkt = new Date(parsed.getTime() + 7 * 3600 * 1000);
                return jkt.toISOString().slice(0, 10);
            }
            return text.slice(0, 10);
        }
        return null;
    }

    private toBoolean(value: any): boolean {
        if (value === undefined || value === null || value === '') return true;
        if (typeof value === 'boolean') return value;

        const text = String(value).trim().toLowerCase();
        if (['false', '0', 'tidak', 'no', 'off'].includes(text)) return false;
        return true;
    }

    private toStatus(value: any): string {
        const status = String(value || 'AKTIF').trim().toUpperCase();
        const allowed = ['AKTIF', 'NONAKTIF'];
        return allowed.includes(status) ? status : 'AKTIF';
    }

    private normalizePayload(dto: KermaPayload, partial = false): KermaPayload {
        const source = dto || {};
        const payload: KermaPayload = {
            tahun_data: this.toNumber(source.tahun_data),
            institusi: this.toText(source.institusi),
            nomor_dokumen_mitra: this.toText(source.nomor_dokumen_mitra),
            nomor_dokumen_polri: this.toText(source.nomor_dokumen_polri),
            jenis_naskah: this.toText(source.jenis_naskah),
            tentang: this.toText(source.tentang),
            tanggal_mulai: this.toDate(source.tanggal_mulai),
            tanggal_akhir: this.toDate(source.tanggal_akhir),
            masa_berlaku_text: this.toText(source.masa_berlaku_text),
            satker_terkait: this.toText(source.satker_terkait),
            sub_satker_terkait: this.toText(source.sub_satker_terkait),
            catatan: this.toText(source.catatan),
            pedoman_pelaksanaan: this.toText(source.pedoman_pelaksanaan),
            status: this.toStatus(source.status),
            file_dokumen_url: this.toText(source.file_dokumen_url),
            is_tampil: this.toBoolean(source.is_tampil),
            updated_by: this.toText(source.updated_by)
        };

        if (!payload.tahun_data && payload.tanggal_mulai) {
            payload.tahun_data = Number(String(payload.tanggal_mulai).slice(0, 4));
        }

        if (!partial) {
            payload.created_by = this.toText(source.created_by);
            return payload;
        }

        const partialPayload: KermaPayload = {};
        for (const key of Object.keys(payload)) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                partialPayload[key] = payload[key];
            }
        }

        return partialPayload;
    }

    private buildBaseSelect() {
        return `
            select
                id,
                tahun_data,
                institusi,
                nomor_dokumen_mitra,
                nomor_dokumen_polri,
                jenis_naskah,
                tentang,
                to_char(tanggal_mulai, 'YYYY-MM-DD') as tanggal_mulai,
                to_char(tanggal_akhir, 'YYYY-MM-DD') as tanggal_akhir,
                case
                    when tanggal_akhir is null then null
                    else tanggal_akhir - current_date
                end as sisa_hari,
                masa_berlaku_text,
                satker_terkait,
                sub_satker_terkait,
                catatan,
                pedoman_pelaksanaan,
                status,
                -- Status efektif ikut masa berlaku dokumen: kalau ada tanggal_akhir, aktif/nonaktif
                -- SEPENUHNYA otomatis dari tanggal (mengabaikan kolom status manual). Dokumen tanpa
                -- tanggal_akhir (tanpa batas waktu) tetap ikut toggle manual sampai dinonaktifkan.
                case
                    when deleted_at is not null then 'DIHAPUS'
                    when tanggal_mulai is not null and tanggal_mulai > current_date then 'NONAKTIF'
                    when tanggal_akhir is not null and tanggal_akhir < current_date then 'NONAKTIF'
                    when tanggal_akhir is not null then 'AKTIF'
                    else upper(coalesce(status, 'AKTIF'))
                end as status_tampil,
                file_dokumen_url,
                (select count(*)::int from bdb_kerma_attachments a where a.kerma_id = bdb_kerma_master.id) as attachment_count,
                is_tampil,
                created_by,
                updated_by,
                created_at,
                updated_at
            from bdb_kerma_master
        `;
    }

    private getPaging(query: any) {
        const page = Math.max(1, Number(query?.page || 1));
        const rawLimit = Number(query?.limit || 10);
        const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? rawLimit : 10, 100));
        const offset = (page - 1) * limit;
        return { page, limit, offset };
    }

    async list(query: any = {}) {
        await this.ensureTable();

        const { page, limit, offset } = this.getPaging(query);
        const params: any[] = [];
        const innerWhere: string[] = ['deleted_at is null'];
        const outerWhere: string[] = ['1=1'];

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            innerWhere.push(`
                (
                    lower(coalesce(institusi, '')) like $${params.length}
                    or lower(coalesce(tentang, '')) like $${params.length}
                    or lower(coalesce(jenis_naskah, '')) like $${params.length}
                    or lower(coalesce(satker_terkait, '')) like $${params.length}
                    or lower(coalesce(sub_satker_terkait, '')) like $${params.length}
                    or lower(coalesce(nomor_dokumen_mitra, '')) like $${params.length}
                    or lower(coalesce(nomor_dokumen_polri, '')) like $${params.length}
                )
            `);
        }

        const tahun = this.toNumber(query.tahun);
        if (tahun) {
            params.push(tahun);
            innerWhere.push(`tahun_data = $${params.length}`);
        }

        // Halaman "Lihat Kerma" (semua role) hanya menampilkan yang sudah dipublikasikan --
        // sama seperti Jukrah: dikelola/di-draft vs ditampilkan ke semua orang beda halaman.
        if (query.only_published) {
            innerWhere.push(`is_tampil = true`);
        }

        const status = this.toText(query.status);
        if (status && status.toUpperCase() !== 'ALL') {
            params.push(status.toUpperCase());
            outerWhere.push(`status_tampil = $${params.length}`);
        }

        const baseSql = `
            from (
                ${this.buildBaseSelect()}
                where ${innerWhere.join(' and ')}
            ) kerma
            where ${outerWhere.join(' and ')}
        `;

        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql}`, params);
        const total = Number(countRows?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `
                select *
                ${baseSql}
                order by
                    case when tanggal_akhir is null then 1 else 0 end asc,
                    tanggal_akhir asc,
                    updated_at desc,
                    id desc
                limit $${params.length + 1}
                offset $${params.length + 2}
            `,
            [...params, limit, offset]
        );

        const summaryRows = await this.dataSource.query(`
            select
                count(*)::int as total,
                sum(case
                    when tanggal_mulai is not null and tanggal_mulai > current_date then 0
                    when tanggal_akhir is not null and tanggal_akhir < current_date then 0
                    when tanggal_akhir is not null then 1
                    when upper(coalesce(status, 'AKTIF')) = 'AKTIF' then 1
                    else 0
                end)::int as aktif
            from bdb_kerma_master
            where deleted_at is null
        `);
        const total0 = Number(summaryRows?.[0]?.total || 0);
        const aktif0 = Number(summaryRows?.[0]?.aktif || 0);

        return {
            status: 1,
            data: rows,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(1, Math.ceil(total / limit))
            },
            summary: { total: total0, aktif: aktif0, nonaktif: total0 - aktif0 }
        };
    }

    async findOne(id: number) {
        await this.ensureTable();

        const rows = await this.dataSource.query(
            `
                select *
                from (
                    ${this.buildBaseSelect()}
                    where deleted_at is null
                ) kerma
                where id = $1
                limit 1
            `,
            [id]
        );

        if (!rows.length) {
            throw new NotFoundException('Data kerma tidak ditemukan');
        }

        return rows[0];
    }

    async create(dto: KermaPayload) {
        await this.ensureTable();

        const payload = this.normalizePayload(dto);
        const keys = Object.keys(payload).filter((key) => payload[key] !== undefined);

        const columns = keys.join(', ');
        const values = keys.map((_, index) => `$${index + 1}`).join(', ');
        const params = keys.map((key) => payload[key]);

        const rows = await this.dataSource.query(
            `
                insert into bdb_kerma_master (${columns})
                values (${values})
                returning id
            `,
            params
        );

        return this.findOne(Number(rows[0].id));
    }

    async update(id: number, dto: KermaPayload) {
        await this.ensureTable();

        await this.findOne(id);

        const payload = this.normalizePayload(dto, true);
        const keys = Object.keys(payload);

        if (!keys.length) {
            return this.findOne(id);
        }

        const sets = keys.map((key, index) => `${key} = $${index + 1}`);
        sets.push(`updated_at = now()`);

        const params = keys.map((key) => payload[key]);
        params.push(id);

        await this.dataSource.query(
            `
                update bdb_kerma_master
                set ${sets.join(', ')}
                where id = $${params.length}
                  and deleted_at is null
            `,
            params
        );

        return this.findOne(id);
    }

    async remove(id: number) {
        await this.ensureTable();

        await this.findOne(id);

        await this.dataSource.query(
            `
                update bdb_kerma_master
                set deleted_at = now(),
                    updated_at = now()
                where id = $1
                  and deleted_at is null
            `,
            [id]
        );

        return { id, deleted: true };
    }
}

