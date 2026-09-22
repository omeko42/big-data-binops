import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';

const STATUS_MANUAL = ['MASUK', 'KELUAR'];

/**
 * Barang Bukti: gabungan 2 sumber --
 *  1) bdb_laporan_polisi.payload_json->'barang_bukti' -- read-only, dari DORS tiap sync. Tak ada ID
 *     stabil per item (cuma elemen array JSON), jadi row_id disintesis "dors-<lp_id>-<urutan>".
 *  2) bdb_lp_barang_bukti_manual -- dicatat manual di halaman detail LP, field lengkap (bisa CRUD).
 */
@Injectable()
export class BarangBuktiService {
    constructor(
        private readonly dataSource: DataSource,
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

    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[]): string {
        if (scope.all) return '1=1';
        if (!scope.satkerId) return '1=0';
        params.push(scope.satkerId);
        return `lp.satker_id = $${params.length}`;
    }

    /** Subquery gabungan DORS (dari JSON payload) + MANUAL, dipakai list() & listByLpAll(). */
    private unionSql(): string {
        return `
            select 'DORS' as sumber, concat('dors-', lp.id, '-', elem.ord)::text as row_id, lp.id as lp_id,
                   null::text as nomor_register,
                   coalesce(elem.item->>'jenis_bb', elem.item->>'kode_bb', 'Barang Bukti') as jenis,
                   elem.item->>'jumlah' as jumlah,
                   null::text as kepemilikan,
                   null::date as tanggal_penyitaan,
                   'MASUK'::text as status,
                   nullif(trim(concat_ws(' · ', elem.item->>'keterangan',
                       nullif(concat_ws(' ', elem.item->>'ran_jenis', elem.item->>'ran_merk', elem.item->>'ran_type', elem.item->>'ran_no_registrasi'), ''))), '') as keterangan,
                   false as can_delete,
                   lp.synced_at as created_at
            from bdb_laporan_polisi lp
            cross join lateral jsonb_array_elements(coalesce(lp.payload_json->'barang_bukti', '[]'::jsonb)) with ordinality as elem(item, ord)
            where lp.deleted_at is null

            union all

            select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id,
                   m.nomor_register, m.jenis, m.jumlah, m.kepemilikan, m.tanggal_penyitaan, m.status, m.keterangan,
                   true as can_delete, m.created_at
            from bdb_lp_barang_bukti_manual m
            where m.deleted_at is null
        `;
    }

    /** Rekap lintas-LP (dipaginasi) -- dipakai halaman Rekap Barang Bukti. */
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
            outerWhere.push(`(lower(coalesce(c.jenis,'')) like $${p} or lower(coalesce(c.nomor_register,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
        }

        const status = this.toText(query.status);
        if (status && status.toUpperCase() !== 'ALL' && status.toUpperCase() !== 'SEMUA') {
            params.push(status.toUpperCase());
            outerWhere.push(`c.status = $${params.length}`);
        }

        const sumber = this.toText(query.sumber);
        if (sumber && sumber.toUpperCase() !== 'ALL') {
            params.push(sumber.toUpperCase());
            outerWhere.push(`c.sumber = $${params.length}`);
        }

        const baseSql = `
            from (${this.unionSql()}) c
            join bdb_laporan_polisi lp on lp.id = c.lp_id
            where ${outerWhere.join(' and ')}
        `;

        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql}`, params);
        const total = Number(countRows?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.can_delete, c.created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             ${baseSql}
             order by c.created_at desc
             limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit, offset]
        );

        return {
            data: rows,
            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
        };
    }

    /** Gabungan DORS + MANUAL utk SATU LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    async listByLpAll(lpId: number) {
        const rows = await this.dataSource.query(
            `select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.can_delete, c.created_at
             from (${this.unionSql()}) c
             where c.lp_id = $1
             order by c.created_at desc`,
            [lpId]
        );
        return { data: rows };
    }

    private assertAccess(authUser: any, lp: { satker_id: number }, scope: { all: boolean; satkerId: number | null }) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new ForbiddenException('Tidak berwenang mengelola barang bukti.');
        }
        if (!scope.all && Number(lp.satker_id) !== Number(scope.satkerId)) {
            throw new ForbiddenException('Anda hanya dapat mengelola barang bukti untuk LP di satker Anda sendiri.');
        }
    }

    private async assertLpAccess(authUser: any, lpId: number) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        this.assertAccess(authUser, lp, scope);
        return lp;
    }

    async addManual(authUser: any, lpId: number, dto: any) {
        const lp = await this.assertLpAccess(authUser, lpId);

        const jenis = this.toText(dto?.jenis);
        if (!jenis) throw new BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status)) throw new BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);

        const rows = await this.dataSource.query(
            `insert into bdb_lp_barang_bukti_manual (lp_id, nomor_register, jenis, jumlah, kepemilikan, tanggal_penyitaan, status, keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             returning id`,
            [
                lpId,
                this.toText(dto?.nomor_register),
                jenis,
                this.toText(dto?.jumlah),
                this.toText(dto?.kepemilikan),
                this.toDate(dto?.tanggal_penyitaan),
                status,
                this.toText(dto?.keterangan),
                authUser?.id ? Number(authUser.id) : null
            ]
        );

        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'barang_bukti_manual', entityId: rows[0].id, meta: { lp_id: lpId, no_laporan: lp.no_laporan, jenis, status } });

        return this.detail(rows[0].id);
    }

    async detail(id: number) {
        const rows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length) throw new NotFoundException('Data tidak ditemukan.');
        return { sumber: 'MANUAL', row_id: rows[0].id, can_delete: true, ...rows[0] };
    }

    async updateManual(authUser: any, rowId: number, dto: any) {
        const existingRows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [rowId]);
        if (!existingRows.length) throw new NotFoundException('Data tidak ditemukan.');
        const existing = existingRows[0];
        const lp = await this.assertLpAccess(authUser, Number(existing.lp_id));

        const jenis = this.toText(dto?.jenis);
        if (!jenis) throw new BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || existing.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status)) throw new BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);

        await this.dataSource.query(
            `update bdb_lp_barang_bukti_manual set
                nomor_register=$2, jenis=$3, jumlah=$4, kepemilikan=$5, tanggal_penyitaan=$6, status=$7, keterangan=$8, updated_at=now()
             where id=$1`,
            [
                rowId,
                this.toText(dto?.nomor_register),
                jenis,
                this.toText(dto?.jumlah),
                this.toText(dto?.kepemilikan),
                this.toDate(dto?.tanggal_penyitaan) ?? existing.tanggal_penyitaan,
                status,
                this.toText(dto?.keterangan)
            ]
        );

        await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'barang_bukti_manual', entityId: rowId, meta: { lp_id: existing.lp_id, no_laporan: lp.no_laporan, jenis, status } });

        return this.detail(rowId);
    }

    async removeManual(authUser: any, id: number) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus entri barang bukti manual.');
        }
        const rows = await this.dataSource.query('select id, lp_id, jenis from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length) throw new NotFoundException('Data tidak ditemukan.');

        await this.dataSource.query('update bdb_lp_barang_bukti_manual set deleted_at = now() where id=$1', [id]);

        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'barang_bukti_manual', entityId: id, meta: { lp_id: rows[0].lp_id, jenis: rows[0].jenis } });

        return { status: 1, message: 'Barang bukti manual dihapus.' };
    }
}
