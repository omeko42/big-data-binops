import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';
import { effectiveLpScopeSql, hasEffectiveLpAccess, LpOwnershipRow } from '../common/lp-scope.util';

const KETERLIBATAN_MANUAL = ['SAKSI', 'AHLI', 'TERSANGKA'];

/**
 * Register Pihak Terlibat: gabungan 2 sumber --
 *  1) bdb_dors_lp_terlibat -- read-only, disalin dari DORS tiap sync (saksi/terlapor/korban/pelapor).
 *  2) bdb_lp_pihak_manual -- diisi manual di halaman detail LP: SAKSI, AHLI, TERSANGKA saja, dengan
 *     field detail personil sama seperti punya DORS.
 */
@Injectable()
export class PihakTerlibatService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly minio: MinioService
    ) {}

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

    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[]): string {
        if (scope.all) return '1=1';
        if (!scope.satkerId) return '1=0';
        params.push(scope.satkerId);
        return effectiveLpScopeSql('lp', `$${params.length}`);
    }

    async list(authUser: any, query: any = {}) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const outerWhere: string[] = ['lp.deleted_at is null'];
        outerWhere.push(this.scopeClause(scope, params));

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            outerWhere.push(`(lower(coalesce(c.nama,'')) like $${p} or lower(coalesce(c.nik,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
        }

        const keterlibatan = this.toText(query.keterlibatan);
        if (keterlibatan && keterlibatan.toUpperCase() !== 'ALL') {
            params.push(keterlibatan.toUpperCase());
            outerWhere.push(`c.keterlibatan = $${params.length}`);
        }

        const sumber = this.toText(query.sumber);
        if (sumber && sumber.toUpperCase() !== 'ALL') {
            params.push(sumber.toUpperCase());
            outerWhere.push(`c.sumber = $${params.length}`);
        }

        const satkerId = query.satker_id ? Number(query.satker_id) : null;
        if (satkerId) {
            params.push(satkerId);
            outerWhere.push(effectiveLpScopeSql('lp', `$${params.length}`));
        }

        // bdb_dors_lp_terlibat.lp_id -> bdb_dors_lp.id (bukan bdb_laporan_polisi.id -- dua sequence
        // independen, jangan disamakan langsung). bdb_laporan_polisi dicocokkan lewat pasangan
        // (dors_lp_id, model_lp), sama seperti cara laporan-polisi.service.ts memetakan LP.
        const baseSql = `
            from (
                select 'DORS' as sumber, t.id::text as row_id, lp0.id as lp_id, t.nama, t.nik,
                       upper(coalesce(t.keterlibatan, '-')) as keterlibatan,
                       null::text as nomor_dokumen, null::date as tanggal_dokumen, null::date as bap_tanggal,
                       null::text as keterangan, false as has_lampiran,
                       d.synced_at as created_at
                from bdb_dors_lp_terlibat t
                join bdb_dors_lp d on d.id = t.lp_id
                join bdb_laporan_polisi lp0 on lp0.dors_lp_id = d.dors_lp_id and lp0.model_lp = d.model_lp
                where t.nama is not null

                union all

                select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id, m.nama, m.nik,
                       upper(m.keterlibatan) as keterlibatan,
                       m.nomor_dokumen, m.tanggal_dokumen, m.bap_tanggal,
                       m.keterangan, (m.lampiran_object_key is not null) as has_lampiran,
                       m.created_at
                from bdb_lp_pihak_manual m
                where m.deleted_at is null
            ) c
            join bdb_laporan_polisi lp on lp.id = c.lp_id
            left join cm_jenis_kejahatan jk on jk.id = lp.jenis_kejahatan_id
            where ${outerWhere.join(' and ')}
        `;

        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql}`, params);
        const total = Number(countRows?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `
                select c.sumber, c.row_id, c.lp_id, c.nama, c.nik, c.keterlibatan, c.nomor_dokumen, c.tanggal_dokumen, c.bap_tanggal,
                       c.keterangan, c.has_lampiran,
                       lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, jk.keterangan as kejahatan, c.created_at
                ${baseSql}
                order by c.created_at desc
                limit $${params.length + 1} offset $${params.length + 2}
            `,
            [...params, limit, offset]
        );

        return {
            data: rows,
            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
        };
    }

    private assertAccess(authUser: any, lp: LpOwnershipRow, scope: { all: boolean; satkerId: number | null }) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new ForbiddenException('Tidak berwenang menambahkan pihak terlibat.');
        }
        if (!scope.all && !hasEffectiveLpAccess(lp, scope.satkerId)) {
            throw new ForbiddenException('Anda hanya dapat menambahkan pihak terlibat untuk LP di satker Anda sendiri.');
        }
    }

    async addManual(authUser: any, lpId: number, dto: any, file?: UploadedFileLike) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);

        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];

        this.assertAccess(authUser, lp, scope);

        const nama = this.toText(dto?.nama);
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        const keterlibatan = String(dto?.keterlibatan || '').trim().toUpperCase();
        if (!KETERLIBATAN_MANUAL.includes(keterlibatan)) {
            throw new BadRequestException(`Keterlibatan harus salah satu dari: ${KETERLIBATAN_MANUAL.join(', ')}.`);
        }

        const bapTanggal = this.toDate(dto?.bap_tanggal);
        const nomorDokumen = this.toText(dto?.nomor_dokumen);
        const tanggalDokumen = this.toDate(dto?.tanggal_dokumen);

        // Syarat per jenis -- SAKSI & TERSANGKA wajib dokumen pendukung + lampirannya, AHLI bebas.
        if (keterlibatan === 'SAKSI') {
            if (!bapTanggal) throw new BadRequestException('Tanggal BAP wajib diisi untuk menambahkan Saksi.');
            if (!file) throw new BadRequestException('Lampiran BAP wajib diunggah untuk menambahkan Saksi.');
        } else if (keterlibatan === 'TERSANGKA') {
            if (!nomorDokumen) throw new BadRequestException('Nomor surat penetapan tersangka wajib diisi.');
            if (!tanggalDokumen) throw new BadRequestException('Tanggal surat penetapan tersangka wajib diisi.');
            if (!file) throw new BadRequestException('Lampiran surat penetapan tersangka wajib diunggah.');
        }

        let lampiran: { key: string; name: string; type: string; size: number } | null = null;
        if (file) {
            const key = await this.minio.upload(file, 'pihak-terlibat');
            lampiran = { key, name: file.originalname, type: file.mimetype, size: file.size };
        }

        const rows = await this.dataSource.query(
            `insert into bdb_lp_pihak_manual
                (lp_id, keterlibatan, nama, nik, jenis_kelamin, tempat_lahir, tgl_lahir, pekerjaan, alamat, no_hp,
                 bap_tanggal, nomor_dokumen, tanggal_dokumen, lampiran_file_name, lampiran_object_key, lampiran_content_type, lampiran_size,
                 keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
             returning id`,
            [
                lpId,
                keterlibatan,
                nama,
                this.toText(dto?.nik),
                this.toText(dto?.jenis_kelamin),
                this.toText(dto?.tempat_lahir),
                this.toText(dto?.tgl_lahir),
                this.toText(dto?.pekerjaan),
                this.toText(dto?.alamat),
                this.toText(dto?.no_hp),
                bapTanggal,
                nomorDokumen,
                tanggalDokumen,
                lampiran?.name || null,
                lampiran?.key || null,
                lampiran?.type || null,
                lampiran?.size || null,
                this.toText(dto?.keterangan),
                authUser?.id ? Number(authUser.id) : null
            ]
        );

        await this.audit.log({
            user: authUser,
            action: 'CREATE',
            entity: 'pihak_terlibat_manual',
            entityId: rows[0].id,
            meta: { lp_id: lpId, no_laporan: lp.no_laporan, nama, keterlibatan }
        });

        return this.detail(rows[0].id);
    }

    async detail(id: number) {
        const rows = await this.dataSource.query('select * from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length) throw new NotFoundException('Data tidak ditemukan.');
        const row = rows[0];
        let lampiran_url: string | null = null;
        if (row.lampiran_object_key) {
            try {
                lampiran_url = await this.minio.presignedUrl(row.lampiran_object_key, 3600);
            } catch {
                lampiran_url = null;
            }
        }
        return { ...row, lampiran_url };
    }

    async listByLp(authUser: any, lpId: number) {
        await this.assertLpAccess(authUser, lpId);
        const rows = await this.dataSource.query(
            `select id, keterlibatan, nama, nik, jenis_kelamin, tempat_lahir, tgl_lahir, pekerjaan, alamat, no_hp,
                    bap_tanggal, nomor_dokumen, tanggal_dokumen, lampiran_file_name, lampiran_object_key, keterangan, created_at
             from bdb_lp_pihak_manual
             where lp_id = $1 and deleted_at is null
             order by created_at desc`,
            [lpId]
        );
        const data = [];
        for (const r of rows) {
            let lampiran_url: string | null = null;
            if (r.lampiran_object_key) {
                try {
                    lampiran_url = await this.minio.presignedUrl(r.lampiran_object_key, 3600);
                } catch {
                    lampiran_url = null;
                }
            }
            data.push({ sumber: 'MANUAL', row_id: r.id, ...r, lampiran_url });
        }
        return { data };
    }

    /** Gabungan DORS + MANUAL utk SATU LP -- dipakai tab "Pihak Terkait" di halaman detail LP (bisa diedit semua). */
    async listByLpAll(authUser: any, lpId: number) {
        await this.assertLpAccess(authUser, lpId);
        const dorsRows = await this.dataSource.query(
            `select t.id as row_id, upper(coalesce(t.keterlibatan,'-')) as keterlibatan, t.nama, t.nik, t.jenis_kelamin,
                    t.tempat_lahir, t.tgl_lahir, t.pekerjaan, t.alamat, t.no_hp
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id = t.lp_id
             join bdb_laporan_polisi lp0 on lp0.dors_lp_id = d.dors_lp_id and lp0.model_lp = d.model_lp
             where lp0.id = $1 and t.nama is not null
             order by t.id`,
            [lpId]
        );
        const dorsData = dorsRows.map((r: any) => ({ sumber: 'DORS', ...r, bap_tanggal: null, nomor_dokumen: null, tanggal_dokumen: null, lampiran_url: null, keterangan: null }));

        const manual = await this.listByLp(authUser, lpId);
        return { data: [...dorsData, ...manual.data] };
    }

    private async assertLpAccess(authUser: any, lpId: number) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        this.assertAccess(authUser, lp, scope);
        return lp;
    }

    async updateDors(authUser: any, rowId: number, dto: any) {
        const rows = await this.dataSource.query(
            `select t.id, lp0.id as lp_id, lp0.no_laporan
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id = t.lp_id
             join bdb_laporan_polisi lp0 on lp0.dors_lp_id = d.dors_lp_id and lp0.model_lp = d.model_lp
             where t.id = $1`,
            [rowId]
        );
        if (!rows.length) throw new NotFoundException('Data tidak ditemukan.');
        const row = rows[0];
        await this.assertLpAccess(authUser, Number(row.lp_id));

        const nama = this.toText(dto?.nama);
        if (!nama) throw new BadRequestException('Nama wajib diisi.');

        await this.dataSource.query(
            `update bdb_dors_lp_terlibat
             set nama=$2, nik=$3, keterlibatan=$4, jenis_kelamin=$5, tempat_lahir=$6, tgl_lahir=$7, pekerjaan=$8, alamat=$9, no_hp=$10
             where id=$1`,
            [
                rowId,
                nama,
                this.toText(dto?.nik),
                (this.toText(dto?.keterlibatan) || 'saksi').toLowerCase(),
                this.toText(dto?.jenis_kelamin),
                this.toText(dto?.tempat_lahir),
                this.toText(dto?.tgl_lahir),
                this.toText(dto?.pekerjaan),
                this.toText(dto?.alamat),
                this.toText(dto?.no_hp)
            ]
        );

        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            entity: 'pihak_terlibat_dors',
            entityId: rowId,
            meta: { lp_id: row.lp_id, no_laporan: row.no_laporan, nama }
        });

        return { status: 1, message: 'Data pihak terlibat (DORS) diperbarui.' };
    }

    async updateManual(authUser: any, rowId: number, dto: any, file?: UploadedFileLike) {
        const existingRows = await this.dataSource.query('select * from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [rowId]);
        if (!existingRows.length) throw new NotFoundException('Data tidak ditemukan.');
        const existing = existingRows[0];

        const lp = await this.assertLpAccess(authUser, Number(existing.lp_id));

        const nama = this.toText(dto?.nama);
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        const keterlibatan = String(dto?.keterlibatan || existing.keterlibatan || '').trim().toUpperCase();
        if (!KETERLIBATAN_MANUAL.includes(keterlibatan)) {
            throw new BadRequestException(`Keterlibatan harus salah satu dari: ${KETERLIBATAN_MANUAL.join(', ')}.`);
        }

        const bapTanggal = this.toDate(dto?.bap_tanggal) || existing.bap_tanggal;
        const nomorDokumen = this.toText(dto?.nomor_dokumen) ?? existing.nomor_dokumen;
        const tanggalDokumen = this.toDate(dto?.tanggal_dokumen) || existing.tanggal_dokumen;
        const willHaveLampiran = !!file || !!existing.lampiran_object_key;

        if (keterlibatan === 'SAKSI') {
            if (!bapTanggal) throw new BadRequestException('Tanggal BAP wajib diisi untuk Saksi.');
            if (!willHaveLampiran) throw new BadRequestException('Lampiran BAP wajib diunggah untuk Saksi.');
        } else if (keterlibatan === 'TERSANGKA') {
            if (!nomorDokumen) throw new BadRequestException('Nomor surat penetapan tersangka wajib diisi.');
            if (!tanggalDokumen) throw new BadRequestException('Tanggal surat penetapan tersangka wajib diisi.');
            if (!willHaveLampiran) throw new BadRequestException('Lampiran surat penetapan tersangka wajib diunggah.');
        }

        let lampiran: { key: string; name: string; type: string; size: number } | null = null;
        if (file) {
            const key = await this.minio.upload(file, 'pihak-terlibat');
            lampiran = { key, name: file.originalname, type: file.mimetype, size: file.size };
            if (existing.lampiran_object_key) {
                try {
                    await this.minio.remove(existing.lampiran_object_key);
                } catch {
                    /* biarkan, jangan gagalkan update krn file lama tak terhapus */
                }
            }
        }

        await this.dataSource.query(
            `update bdb_lp_pihak_manual set
                keterlibatan=$2, nama=$3, nik=$4, jenis_kelamin=$5, tempat_lahir=$6, tgl_lahir=$7, pekerjaan=$8, alamat=$9, no_hp=$10,
                bap_tanggal=$11, nomor_dokumen=$12, tanggal_dokumen=$13, keterangan=$14, updated_at=now()
                ${lampiran ? ', lampiran_file_name=$15, lampiran_object_key=$16, lampiran_content_type=$17, lampiran_size=$18' : ''}
             where id=$1`,
            [
                rowId,
                keterlibatan,
                nama,
                this.toText(dto?.nik),
                this.toText(dto?.jenis_kelamin),
                this.toText(dto?.tempat_lahir),
                this.toText(dto?.tgl_lahir),
                this.toText(dto?.pekerjaan),
                this.toText(dto?.alamat),
                this.toText(dto?.no_hp),
                bapTanggal,
                nomorDokumen,
                tanggalDokumen,
                this.toText(dto?.keterangan),
                ...(lampiran ? [lampiran.name, lampiran.key, lampiran.type, lampiran.size] : [])
            ]
        );

        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            entity: 'pihak_terlibat_manual',
            entityId: rowId,
            meta: { lp_id: existing.lp_id, no_laporan: lp.no_laporan, nama, keterlibatan }
        });

        return this.detail(rowId);
    }

    async removeManual(authUser: any, id: number) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus entri pihak terlibat manual.');
        }
        const rows = await this.dataSource.query('select id, lp_id, nama, lampiran_object_key from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length) throw new NotFoundException('Data tidak ditemukan.');

        await this.dataSource.query('update bdb_lp_pihak_manual set deleted_at = now() where id=$1', [id]);

        await this.audit.log({
            user: authUser,
            action: 'DELETE',
            entity: 'pihak_terlibat_manual',
            entityId: id,
            meta: { lp_id: rows[0].lp_id, nama: rows[0].nama }
        });

        return { status: 1, message: 'Pihak terlibat manual dihapus.' };
    }
}
