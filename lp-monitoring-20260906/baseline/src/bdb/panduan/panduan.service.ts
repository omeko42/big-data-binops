import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';

const ALLOWED_TIPE = ['VIDEO', 'PDF'];

function assertMimetypeMatchesTipe(tipe: string, file: UploadedFileLike) {
    const mt = file.mimetype || '';
    if (tipe === 'PDF' && mt && mt !== 'application/pdf') {
        throw new BadRequestException('File yang diunggah harus berformat PDF.');
    }
    if (tipe === 'VIDEO' && mt && !mt.startsWith('video/')) {
        throw new BadRequestException('File yang diunggah harus berupa video.');
    }
}

/** Panduan Pengguna (video/PDF). Lihat = semua role login. Kelola = superadmin-only. */
@Injectable()
export class PanduanService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
    ) {}

    private assertSuperadmin(authUser: any, action: string) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin') {
            void this.audit.log({ user: authUser, action, entity: 'panduan_pengguna', meta: { outcome: 'ERROR', message: 'Bukan superadmin' } });
            throw new ForbiddenException('Hanya superadmin yang dapat mengelola Panduan Pengguna.');
        }
    }

    /**
     * Daftar panduan. Role selain superadmin (atau superadmin tanpa includeInactive) cuma
     * lihat yang AKTIF. Superadmin di halaman Kelola minta includeInactive=true utk lihat semua.
     */
    async list(authUser: any, includeInactive: boolean) {
        const isSuper = String(authUser?.role_bdb || '').toLowerCase() === 'superadmin';
        const where = includeInactive && isSuper ? '' : "where status = 'AKTIF'";
        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, content_type, size, urutan, status, created_at
             from bdb_panduan_pengguna ${where} order by urutan asc, created_at desc`
        );
        return { status: 1, data: rows };
    }

    /** Detail 1 panduan + presigned URL segar (URL lama bisa kedaluwarsa). */
    async detail(authUser: any, id: number) {
        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, object_key, content_type, size, status, created_at from bdb_panduan_pengguna where id=$1`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        const row = rows[0];
        const isSuper = String(authUser?.role_bdb || '').toLowerCase() === 'superadmin';
        if (row.status !== 'AKTIF' && !isSuper) {
            throw new NotFoundException('Panduan tidak ditemukan.');
        }
        let url: string | null = null;
        try {
            url = await this.minio.presignedUrl(row.object_key, 3600);
        } catch {
            url = null;
        }
        delete row.object_key;
        return { status: 1, data: { ...row, url } };
    }

    async create(authUser: any, dto: { judul?: string; deskripsi?: string; kategori?: string; tipe?: string; urutan?: string }, file?: UploadedFileLike) {
        this.assertSuperadmin(authUser, 'CREATE');
        const judul = (dto.judul || '').trim();
        if (!judul) throw new BadRequestException('Judul panduan wajib diisi.');
        const tipe = (dto.tipe || '').toUpperCase();
        if (!ALLOWED_TIPE.includes(tipe)) throw new BadRequestException('Tipe harus VIDEO atau PDF.');
        if (!file) throw new BadRequestException('File panduan wajib diunggah.');
        assertMimetypeMatchesTipe(tipe, file);

        const key = await this.minio.upload(file, 'panduan');
        const ins = await this.dataSource.query(
            `insert into bdb_panduan_pengguna (judul, deskripsi, kategori, tipe, file_name, object_key, content_type, size, urutan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`,
            [judul, dto.deskripsi?.trim() || null, dto.kategori?.trim() || null, tipe, file.originalname, key, file.mimetype || null, file.size || null, Number(dto.urutan) || 0, authUser?.id || null]
        );

        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'panduan_pengguna', entityId: ins[0].id, meta: { judul, tipe, file_name: file.originalname } });
        return { status: 1, message: 'Panduan ditambahkan.', data: { id: ins[0].id } };
    }

    async update(authUser: any, id: number, dto: { judul?: string; deskripsi?: string; kategori?: string; urutan?: string }, file?: UploadedFileLike) {
        this.assertSuperadmin(authUser, 'UPDATE');
        const rows = await this.dataSource.query('select id, object_key, judul, tipe from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        const existing = rows[0];

        let objectKey = existing.object_key;
        let fileName: string | undefined;
        let contentType: string | undefined;
        let size: number | undefined;
        if (file) {
            assertMimetypeMatchesTipe(existing.tipe, file);
            objectKey = await this.minio.upload(file, 'panduan');
            fileName = file.originalname;
            contentType = file.mimetype;
            size = file.size;
            try {
                await this.minio.remove(existing.object_key);
            } catch {
                /* file lama dibiarkan kalau gagal dihapus */
            }
        }

        await this.dataSource.query(
            `update bdb_panduan_pengguna set
                judul = coalesce($2, judul),
                deskripsi = $3,
                kategori = $4,
                urutan = coalesce($5, urutan),
                object_key = $6,
                file_name = coalesce($7, file_name),
                content_type = coalesce($8, content_type),
                size = coalesce($9, size),
                updated_at = now()
             where id = $1`,
            [id, dto.judul?.trim() || null, dto.deskripsi?.trim() || null, dto.kategori?.trim() || null, dto.urutan !== undefined ? Number(dto.urutan) : null, objectKey, fileName || null, contentType || null, size || null]
        );

        await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'panduan_pengguna', entityId: id, meta: { judul: dto.judul || existing.judul, file_replaced: !!file } });
        return { status: 1, message: 'Panduan diperbarui.' };
    }

    async updateStatus(authUser: any, id: number, status: string) {
        this.assertSuperadmin(authUser, 'UPDATE_STATUS');
        const s = (status || '').toUpperCase();
        if (!['AKTIF', 'NONAKTIF'].includes(s)) throw new BadRequestException('Status harus AKTIF atau NONAKTIF.');
        const rows = await this.dataSource.query('select judul from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        await this.dataSource.query('update bdb_panduan_pengguna set status=$2, updated_at=now() where id=$1', [id, s]);
        await this.audit.log({ user: authUser, action: 'UPDATE_STATUS', entity: 'panduan_pengguna', entityId: id, meta: { judul: rows[0].judul, status: s } });
        return { status: 1, message: `Panduan ${s === 'AKTIF' ? 'diaktifkan' : 'dinonaktifkan'}.`, data: { status: s } };
    }

    async remove(authUser: any, id: number) {
        this.assertSuperadmin(authUser, 'DELETE');
        const rows = await this.dataSource.query('select object_key, judul from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* metadata tetap dihapus walau objek gagal dihapus */
        }
        await this.dataSource.query('delete from bdb_panduan_pengguna where id=$1', [id]);
        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'panduan_pengguna', entityId: id, meta: { judul: rows[0].judul } });
        return { status: 1, message: 'Panduan dihapus.' };
    }
}
