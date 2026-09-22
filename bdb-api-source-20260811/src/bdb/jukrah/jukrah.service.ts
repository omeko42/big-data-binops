import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';

/** Jukrahcaster / Pengumuman — CRUD sederhana: nama, deskripsi, aktif, lampiran PDF. */
@Injectable()
export class JukrahService {
    private ready = false;
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
    ) {}

    private async ensureTable() {
        if (this.ready) return;
        await this.dataSource.query(`
            create table if not exists bdb_jukrah (
                id          bigserial primary key,
                nama        text not null,
                deskripsi   text,
                aktif       boolean not null default true,
                lampiran    jsonb,
                tanggal_publish date not null default current_date,
                created_by  bigint,
                created_at  timestamptz not null default now(),
                updated_at  timestamptz not null default now()
            )`);
        await this.dataSource.query('alter table bdb_jukrah add column if not exists tanggal_publish date not null default current_date');
        // pencatatan siapa yang melihat (distinct per user) + audit log umum
        await this.dataSource.query(`
            create table if not exists bdb_jukrah_view (
                id bigserial primary key,
                jukrah_id bigint not null,
                user_id bigint not null,
                viewed_at timestamptz not null default now(),
                unique (jukrah_id, user_id)
            )`);
        this.ready = true;
    }

    /** Catat 1x per user (distinct) bahwa sebuah pengumuman dilihat, + audit log umum. */
    private async recordView(jukrahId: number, user: any, nama?: string) {
        const uid = user?.id;
        if (!uid) return;
        const ins = await this.dataSource.query('insert into bdb_jukrah_view (jukrah_id, user_id) values ($1,$2) on conflict (jukrah_id, user_id) do nothing returning id', [jukrahId, uid]);
        if (ins.length) {
            await this.audit.log({ user, action: 'VIEW', entity: 'jukrah', entityId: jukrahId, meta: { nama } });
        }
    }

    private async withUrl(rows: any[]) {
        for (const r of rows) {
            if (r.lampiran?.key) {
                try {
                    r.lampiran.url = await this.minio.presignedUrl(r.lampiran.key);
                } catch {
                    /* abaikan */
                }
            }
        }
        return rows;
    }

    private async uploadPdf(file: any) {
        if (!file) return null;
        if (file.mimetype !== 'application/pdf') throw new BadRequestException('Lampiran harus berupa file PDF.');
        const key = await this.minio.upload(file, 'jukrah');
        return { name: file.originalname, key, size: file.size, mime: file.mimetype };
    }

    /** Daftar kelola (admin): dengan pencarian & filter status. */
    async list(opts: { search?: string; aktif?: string }) {
        await this.ensureTable();
        const params: any[] = [];
        const wh: string[] = [];
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            wh.push(`(b.nama ilike $${params.length} or b.deskripsi ilike $${params.length})`);
        }
        if (opts.aktif === 'true') wh.push('b.aktif=true');
        else if (opts.aktif === 'false') wh.push('b.aktif=false');
        const where = wh.length ? 'where ' + wh.join(' and ') : '';
        const rows = await this.dataSource.query(
            `select b.id, b.nama, b.deskripsi, b.aktif, b.lampiran, b.tanggal_publish, b.created_at, b.updated_at, u.name as created_by_nama,
                    (select count(*) from bdb_jukrah_view v where v.jukrah_id=b.id)::int as view_count
             from bdb_jukrah b left join auth_users u on u.id=b.created_by ${where} order by b.tanggal_publish desc, b.id desc`,
            params
        );
        return { status: 1, data: await this.withUrl(rows) };
    }

    /** Daftar untuk semua user (hanya yang aktif) + pencarian. Mencatat view (distinct per user) + audit. */
    async active(user: any, opts: { search?: string }) {
        await this.ensureTable();
        const params: any[] = [];
        // hanya yang aktif DAN sudah waktunya terbit (tanggal_publish <= hari ini)
        let where = 'where aktif=true and tanggal_publish <= current_date';
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            where += ' and (nama ilike $1 or deskripsi ilike $1)';
        }
        const rows = await this.dataSource.query(`select id, nama, deskripsi, lampiran, tanggal_publish from bdb_jukrah ${where} order by tanggal_publish desc, id desc`, params);
        // catat view untuk user ini (idempoten per user), lalu ambil jumlah penonton
        for (const r of rows) await this.recordView(r.id, user, r.nama);
        if (rows.length) {
            const counts = await this.dataSource.query(
                `select jukrah_id, count(*)::int c from bdb_jukrah_view where jukrah_id = any($1) group by jukrah_id`,
                [rows.map((r: any) => r.id)]
            );
            const map = new Map<number, number>(counts.map((c: any) => [Number(c.jukrah_id), c.c]));
            for (const r of rows) r.view_count = map.get(Number(r.id)) || 0;
        }
        return { status: 1, data: await this.withUrl(rows) };
    }

    async create(user: any, body: any, file: any) {
        await this.ensureTable();
        const nama = (body.nama || '').trim();
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date) as bad', [body.tanggal_publish]);
            if (chk[0]?.bad) throw new BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        const lampiran = await this.uploadPdf(file);
        const aktif = !(body.aktif === 'false' || body.aktif === false);
        const r = await this.dataSource.query(
            'insert into bdb_jukrah (nama, deskripsi, aktif, lampiran, tanggal_publish, created_by) values ($1,$2,$3,$4,coalesce($5::date, current_date),$6) returning id',
            [nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null, user?.id || null]
        );
        await this.audit.log({ user, action: 'CREATE', entity: 'jukrah', entityId: r[0].id, meta: { nama } });
        return { status: 1, data: { id: r[0].id }, message: 'Pengumuman ditambahkan.' };
    }

    async update(user: any, id: number, body: any, file: any, keepLampiran: any) {
        await this.ensureTable();
        const ex = await this.dataSource.query('select * from bdb_jukrah where id=$1', [id]);
        if (!ex.length) throw new NotFoundException('Data tidak ditemukan.');
        const nama = (body.nama || '').trim();
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        // backdate hanya ditolak bila tanggalnya DIUBAH ke masa lalu (biar edit item lama tetap boleh)
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date and $1::date <> tanggal_publish) as bad from bdb_jukrah where id=$2', [body.tanggal_publish, id]);
            if (chk[0]?.bad) throw new BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        let lampiran = ex[0].lampiran;
        if (file) lampiran = await this.uploadPdf(file);
        else if (keepLampiran === 'false' || keepLampiran === false) lampiran = null;
        const aktif = body.aktif === undefined ? ex[0].aktif : !(body.aktif === 'false' || body.aktif === false);
        await this.dataSource.query(
            'update bdb_jukrah set nama=$2, deskripsi=$3, aktif=$4, lampiran=$5, tanggal_publish=coalesce($6::date, tanggal_publish), updated_at=now() where id=$1',
            [id, nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null]
        );
        await this.audit.log({ user, action: 'UPDATE', entity: 'jukrah', entityId: id, meta: { nama } });
        return { status: 1, message: 'Pengumuman diperbarui.' };
    }

    async remove(user: any, id: number) {
        await this.ensureTable();
        // DELETE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
        const [r] = await this.dataSource.query('delete from bdb_jukrah where id=$1 returning id, nama', [id]);
        if (!r.length) throw new NotFoundException('Data tidak ditemukan.');
        await this.audit.log({ user, action: 'DELETE', entity: 'jukrah', entityId: id, meta: { nama: r[0].nama } });
        return { status: 1, message: 'Pengumuman dihapus.' };
    }
}
