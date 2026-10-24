import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DpoService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
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

    private async resolveUrl(urlOrKey: string | null): Promise<string | null> {
        if (!urlOrKey) return null;
        if (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://')) {
            return urlOrKey;
        }
        try {
            return await this.minio.presignedUrl(urlOrKey);
        } catch {
            return urlOrKey;
        }
    }

    /** Statistik Ringkasan DPO Nasional */
    async stats(user: any) {
        const row = await this.dataSource.query(`
            SELECT 
                count(*)::int as total_semua,
                count(*) filter (where status_dpo = 'AKTIF')::int as total_aktif,
                count(*) filter (where status_dpo = 'DICABUT')::int as total_dicabut,
                count(*) filter (where foto_dpo_url is not null and trim(foto_dpo_url) != '')::int as dengan_foto,
                count(*) filter (where scan_dokumen_url is not null and trim(scan_dokumen_url) != '')::int as dengan_dokumen,
                count(*) filter (where lp_id is not null or (nomor_lp is not null and trim(nomor_lp) != ''))::int as terhubung_lp
            FROM bdb_dpo;
        `);
        return { status: 1, data: row[0] || {} };
    }

    /** Daftar DPO (Paginasi, Filter Status, Search, Satker) */
    async list(user: any, query: Record<string, any>) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const where: string[] = ['1=1'];

        // Filter status: AKTIF (default), DICABUT, ALL
        const status = this.toText(query.status)?.toUpperCase();
        if (status && status !== 'ALL') {
            params.push(status);
            where.push(`status_dpo = $${params.length}`);
        } else if (!status) {
            where.push(`status_dpo = 'AKTIF'`);
        }

        // Search: nama, nik, nomor_dpo, nomor_lp
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(
                lower(coalesce(nama_dpo,'')) like $${p} or 
                lower(coalesce(nomor_identitas,'')) like $${p} or 
                lower(coalesce(nomor_dpo,'')) like $${p} or 
                lower(coalesce(nomor_lp,'')) like $${p}
            )`);
        }

        // Filter Satker / Wilayah
        const satker = this.toText(query.satker);
        if (satker) {
            params.push(`%${satker.toLowerCase()}%`);
            const p = params.length;
            where.push(`(
                lower(coalesce(satker_nama,'')) like $${p} or 
                lower(coalesce(nama_polda,'')) like $${p} or 
                lower(coalesce(nama_polres,'')) like $${p}
            )`);
        }

        // Filter Kategori Kejahatan
        const kategori = this.toText(query.kategori);
        if (kategori && kategori !== 'ALL') {
            params.push(kategori);
            where.push(`kategori_kejahatan = $${params.length}`);
        }

        const whereSql = where.join(' AND ');

        const countRes = await this.dataSource.query(
            `SELECT count(*)::int as total FROM bdb_dpo WHERE ${whereSql}`,
            params
        );
        const total = countRes[0]?.total || 0;

        params.push(limit, offset);
        const rows = await this.dataSource.query(
            `SELECT 
                d.id, d.nama_dpo, d.foto_dpo_url, d.nomor_identitas, d.jenis_identitas,
                d.kewarganegaraan, d.alamat_terakhir, d.nomor_dpo, d.tanggal_dpo,
                d.scan_dokumen_url, d.satker_nama, d.nama_polda, d.nama_polres, d.nama_polsek,
                d.penyidik_nama, d.penyidik_telp, d.kategori_kejahatan, d.nama_kejahatan,
                d.status_dpo, d.nomor_surat_cabut, d.tanggal_cabut, d.alasan_cabut,
                d.keterangan_cabut, d.scan_dokumen_cabut_url, d.lp_id, d.nomor_lp,
                d.created_at,
                lp.no_laporan as lp_no_laporan,
                lp.tgl_laporan as lp_tgl_laporan
             FROM bdb_dpo d
             LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
             WHERE ${whereSql}
             ORDER BY d.created_at DESC, d.id DESC
             LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        for (const r of rows) {
            r.foto_dpo_url = await this.resolveUrl(r.foto_dpo_url);
            r.scan_dokumen_url = await this.resolveUrl(r.scan_dokumen_url);
            r.scan_dokumen_cabut_url = await this.resolveUrl(r.scan_dokumen_cabut_url);
        }

        return {
            status: 1,
            data: rows,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        };
    }

    /** Detail Satu DPO */
    async detail(id: number) {
        const rows = await this.dataSource.query(
            `SELECT d.*, lp.no_laporan as lp_no_laporan, lp.tgl_laporan as lp_tgl_laporan, lp.uraian_kejadian as lp_uraian
             FROM bdb_dpo d
             LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
             WHERE d.id = $1`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Data DPO tidak ditemukan.');
        const item = rows[0];
        item.foto_dpo_url = await this.resolveUrl(item.foto_dpo_url);
        item.scan_dokumen_url = await this.resolveUrl(item.scan_dokumen_url);
        item.scan_dokumen_cabut_url = await this.resolveUrl(item.scan_dokumen_cabut_url);
        return { status: 1, data: item };
    }

    /** Tambah DPO Cepat (Bypass Alur Dokumen) */
    async create(user: any, body: any, files?: { foto?: any; dokumen?: any }) {
        const nama = this.toText(body.nama_dpo);
        const noDpo = this.toText(body.nomor_dpo);
        if (!nama) throw new BadRequestException('Nama DPO wajib diisi.');
        if (!noDpo) throw new BadRequestException('Nomor penerbitan DPO wajib diisi.');

        let fotoUrl: string | null = this.toText(body.foto_dpo_url);
        let scanUrl: string | null = this.toText(body.scan_dokumen_url);

        if (files?.foto) {
            try {
                fotoUrl = await this.minio.upload(files.foto, 'dpo/foto');
            } catch {
                /* abaikan upload bila gagal */
            }
        }
        if (files?.dokumen) {
            try {
                scanUrl = await this.minio.upload(files.dokumen, 'dpo/dokumen');
            } catch {
                /* abaikan upload bila gagal */
            }
        }

        let lpId: number | null = null;
        const noLp = this.toText(body.nomor_lp);
        if (noLp) {
            const lpCheck = await this.dataSource.query(
                `SELECT id FROM bdb_laporan_polisi WHERE lower(trim(no_laporan)) = lower(trim($1)) AND deleted_at IS NULL LIMIT 1`,
                [noLp]
            );
            if (lpCheck.length) {
                lpId = Number(lpCheck[0].id);
            }
        }

        const tglDpo = this.toDate(body.tanggal_dpo);
        const satkerNama = this.toText(body.satker_nama) || user?.satker_nama || null;
        const satkerId = Number(body.satker_id) || Number(user?.satker_id) || null;

        const res = await this.dataSource.query(
            `INSERT INTO bdb_dpo (
                nama_dpo, nomor_dpo, tanggal_dpo, foto_dpo_url, scan_dokumen_url,
                nomor_identitas, jenis_identitas, kewarganegaraan, alamat_terakhir,
                satker_nama, satker_id, nama_polda, nama_polres, nama_polsek,
                penyidik_nama, penyidik_telp, kategori_kejahatan, nama_kejahatan,
                status_dpo, nomor_lp, lp_id
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12, $13, $14,
                $15, $16, $17, $18,
                'AKTIF', $19, $20
            ) RETURNING id`,
            [
                nama, noDpo, tglDpo, fotoUrl, scanUrl,
                this.toText(body.nomor_identitas), this.toText(body.jenis_identitas) || 'KTP',
                this.toText(body.kewarganegaraan) || 'WNI', this.toText(body.alamat_terakhir),
                satkerNama, satkerId, this.toText(body.nama_polda), this.toText(body.nama_polres), this.toText(body.nama_polsek),
                this.toText(body.penyidik_nama), this.toText(body.penyidik_telp),
                this.toText(body.kategori_kejahatan), this.toText(body.nama_kejahatan),
                noLp, lpId
            ]
        );

        const newId = res[0]?.id;
        await this.audit.log({
            user,
            action: 'CREATE',
            entity: 'dpo',
            entityId: newId,
            meta: { nama_dpo: nama, nomor_dpo: noDpo, satker: satkerNama }
        });

        return { status: 1, message: 'Data DPO berhasil ditambahkan.', data: { id: newId } };
    }

    /** Pencabutan DPO (Status berubah menjadi DICABUT & Langsung hilang dari daftar aktif) */
    async cabut(user: any, id: number, body: any, file?: any) {
        const check = await this.dataSource.query(`SELECT id, nama_dpo, nomor_dpo FROM bdb_dpo WHERE id = $1`, [id]);
        if (!check.length) throw new NotFoundException('Data DPO tidak ditemukan.');
        const dpo = check[0];

        const noCabut = this.toText(body.nomor_surat_cabut);
        if (!noCabut) throw new BadRequestException('Nomor surat perintah pencabutan DPO wajib diisi.');

        let scanCabutUrl: string | null = this.toText(body.scan_dokumen_cabut_url);
        if (file) {
            try {
                scanCabutUrl = await this.minio.upload(file, 'dpo/pencabutan');
            } catch {
                /* abaikan upload bila gagal */
            }
        }

        const tglCabut = this.toDate(body.tanggal_cabut) || new Date().toISOString().split('T')[0];
        const alasan = this.toText(body.alasan_cabut) || 'TERTANGKAP';
        const ket = this.toText(body.keterangan_cabut);

        await this.dataSource.query(
            `UPDATE bdb_dpo SET
                status_dpo = 'DICABUT',
                nomor_surat_cabut = $1,
                tanggal_cabut = $2,
                alasan_cabut = $3,
                keterangan_cabut = $4,
                scan_dokumen_cabut_url = coalesce($5, scan_dokumen_cabut_url),
                updated_at = NOW()
             WHERE id = $6`,
            [noCabut, tglCabut, alasan, ket, scanCabutUrl, id]
        );

        await this.audit.log({
            user,
            action: 'REVOKE',
            entity: 'dpo',
            entityId: id,
            meta: { nama_dpo: dpo.nama_dpo, nomor_dpo: dpo.nomor_dpo, nomor_surat_cabut: noCabut, alasan }
        });

        return { status: 1, message: `Status DPO atas nama ${dpo.nama_dpo} berhasil dicabut (${alasan}).` };
    }

    /** Menghubungkan DPO ke Nomor LP */
    async linkLp(user: any, id: number, body: { nomor_lp: string }) {
        const noLp = this.toText(body.nomor_lp);
        if (!noLp) throw new BadRequestException('Nomor LP wajib diisi.');

        const check = await this.dataSource.query(`SELECT id, nama_dpo FROM bdb_dpo WHERE id = $1`, [id]);
        if (!check.length) throw new NotFoundException('Data DPO tidak ditemukan.');

        const lpRows = await this.dataSource.query(
            `SELECT id, no_laporan, tgl_laporan, satker_nama 
             FROM bdb_laporan_polisi 
             WHERE lower(trim(no_laporan)) = lower(trim($1)) AND deleted_at IS NULL 
             LIMIT 1`,
            [noLp]
        );

        let lpId: number | null = null;
        let matched = false;
        let lpInfo = null;

        if (lpRows.length) {
            lpId = Number(lpRows[0].id);
            matched = true;
            lpInfo = lpRows[0];
        }

        await this.dataSource.query(
            `UPDATE bdb_dpo SET lp_id = $1, nomor_lp = $2, updated_at = NOW() WHERE id = $3`,
            [lpId, noLp, id]
        );

        await this.audit.log({
            user,
            action: 'LINK_LP',
            entity: 'dpo',
            entityId: id,
            meta: { nomor_lp: noLp, lp_id: lpId, matched }
        });

        return {
            status: 1,
            message: matched ? `Berhasil dihubungkan ke LP ${noLp}` : `Nomor LP ${noLp} disimpan (perkara belum terdaftar di database CAS).`,
            data: { lp_id: lpId, nomor_lp: noLp, matched, lp_info: lpInfo }
        };
    }
}
