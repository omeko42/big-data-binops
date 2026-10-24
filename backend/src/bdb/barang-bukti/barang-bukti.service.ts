import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { LpMonitoringAccessService } from '../common/lp-monitoring-access.service';

const STATUS_MANUAL = ['MASUK', 'KELUAR'];

/**
 * Barang Bukti: gabungan 2 sumber --
 *  1) bdb_laporan_polisi.payload_json->'barang_bukti' -- read-only, dari DORS tiap sync. Tak ada ID
 *     stabil per item (cuma elemen array JSON), jadi row_id disintesis "dors-<lp_id>-<urutan>".
 *  2) bdb_lp_barang_bukti_manual -- dicatat manual di halaman detail LP, field lengkap (bisa CRUD).
 */
@Injectable()
export class BarangBuktiService {
    private readonly logger = new Logger(BarangBuktiService.name);

    private readonly summaryCache = new Map<string, { expiresAt: number; data: any }>();

    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly monitoring: LpMonitoringAccessService
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

    private summaryKey(scope: { all: boolean; satkerId: number | null }, query: any): string {
        return JSON.stringify({
            all: !!scope.all,
            satkerId: scope.satkerId ?? null,
            search: (this.toText(query.search) || '').toLowerCase(),
            from: this.toText(query.from) || '',
            to: this.toText(query.to) || '',
        });
    }

    private applyPeriodFilter(query: any, params: any[], where: string[]): void {
        const search = this.toText(query.search);
        if (search) {
            return; // Pencarian teks bebas (kata kunci/nomor/deskripsi) berlaku global lintas periode
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const fromDate = this.toText(query.from);
        const toDate = this.toText(query.to);

        if (fromDate && toDate && datePattern.test(fromDate) && datePattern.test(toDate)) {
            const start = new Date(fromDate + 'T00:00:00Z');
            const end = new Date(toDate + 'T00:00:00Z');
            const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

            if (days < 1) {
                throw new BadRequestException('Tanggal akhir tidak boleh sebelum tanggal awal.');
            }

            // Batas 31 hari dilepas: didukung tabel snapshot agregat
        }

        for (const [name, op] of [['from', '>='], ['to', '<=']] as const) {
            const value = this.toText(query[name]);
            if (!value) continue;

            if (!datePattern.test(value)) {
                throw new BadRequestException(
                    `Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`
                );
            }

            params.push(value);
            where.push(
                `to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date ${op} $${params.length}::date`
            );
        }
    }

        async refreshSnapshot() {
        this.logger.log('Memperbarui bdb_barang_bukti_summary_snapshot...');
        await this.dataSource.query(`
            WITH bb_agg AS (
                SELECT 
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) as tanggal,
                    count(*)::int as semua,
                    count(*)::int as masuk,
                    0 as keluar,
                    count(*)::int as dors,
                    0 as manual
                FROM bdb_laporan_polisi lp
                CROSS JOIN LATERAL jsonb_array_elements(coalesce(lp.payload_json->'barang_bukti', '[]'::jsonb)) as elem
                WHERE lp.deleted_at IS NULL
                  AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) >= '2026-01-01'::date
                GROUP BY 1, 2
            )
            INSERT INTO bdb_barang_bukti_summary_snapshot
                (satker_id, tanggal, semua, masuk, keluar, dors, manual, refreshed_at)
            SELECT satker_id, tanggal, semua, masuk, keluar, dors, manual, now()
            FROM bb_agg
            WHERE satker_id IS NOT NULL AND tanggal IS NOT NULL
            ON CONFLICT (satker_id, tanggal)
            DO UPDATE SET
                semua = EXCLUDED.semua,
                masuk = EXCLUDED.masuk,
                keluar = EXCLUDED.keluar,
                dors = EXCLUDED.dors,
                manual = EXCLUDED.manual,
                refreshed_at = now();
        `);
        this.summaryCache.clear();
        this.logger.log('bdb_barang_bukti_summary_snapshot selesai diperbarui.');
    }

    private async globalSummary(scope: { all: boolean; satkerId: number | null }, query: any) {
        const key = this.summaryKey(scope, query);
        const cached = this.summaryCache.get(key);

        if (cached && cached.expiresAt > Date.now()) {
            return { ...cached.data, cached: true };
        }

        if (cached) this.summaryCache.delete(key);

        const params: any[] = [];
        const rekapSql = this.rekapUnionSql(scope, query, params);
        const where: string[] = ['1=1'];

        const search = this.toText(query.search);
        if (!search) {
            try {
                const sParams: any[] = [];
                const sWhere: string[] = ['1=1'];
                if (query.from) {
                    sParams.push(query.from);
                    sWhere.push(`tanggal >= $${sParams.length}::date`);
                }
                if (query.to) {
                    sParams.push(query.to);
                    sWhere.push(`tanggal <= $${sParams.length}::date`);
                }
                if (!scope.all && scope.satkerId) {
                    sWhere.push(`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = ${scope.satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )`);
                } else if (query.satker_id) {
                    const sid = Number(query.satker_id);
                    if (Number.isSafeInteger(sid) && sid > 0) {
                        sWhere.push(`satker_id in (
                            with recursive st as (
                                select id from bdb_satker where id = ${sid}
                                union all
                                select s.id from bdb_satker s join st on s.parent_id = st.id
                            ) select id from st
                        )`);
                    }
                }

                const sRows = await this.dataSource.query(
                    `select
                        coalesce(sum(semua), 0)::int as semua,
                        coalesce(sum(masuk), 0)::int as masuk,
                        coalesce(sum(keluar), 0)::int as keluar,
                        coalesce(sum(dors), 0)::int as dors,
                        coalesce(sum(manual), 0)::int as manual
                     from bdb_barang_bukti_summary_snapshot
                     where ${sWhere.join(' and ')}`,
                    sParams
                );

                if (sRows && sRows.length > 0) {
                    const row = sRows[0];
                    const summary = {
                        semua: Number(row.semua || 0),
                        masuk: Number(row.masuk || 0),
                        keluar: Number(row.keluar || 0),
                        dors: Number(row.dors || 0),
                        manual: Number(row.manual || 0),
                    };

                    const result = {
                        summary,
                        mode: 'snapshot-table-fast',
                        cached: false,
                    };

                    this.summaryCache.set(key, {
                        expiresAt: Date.now() + 300000,
                        data: result,
                    });

                    return result;
                }
            } catch (snapErr: any) {
                this.logger.warn('Gagal membaca snapshot BB: ' + snapErr?.message);
            }
        }

        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(c.jenis,'')) like $${p} or lower(coalesce(c.nomor_register,'')) like $${p} or lower(coalesce(c.no_laporan,'')) like $${p} or lower(coalesce(c.keterangan,'')) like $${p})`);
        }

        const rows = await this.dataSource.query(
            `select
                count(*)::int as semua,
                count(*) filter (where upper(coalesce(c.status,''))='MASUK')::int as masuk,
                count(*) filter (where upper(coalesce(c.status,''))='KELUAR')::int as keluar,
                count(*) filter (where upper(coalesce(c.sumber,''))='DORS')::int as dors,
                count(*) filter (where upper(coalesce(c.sumber,''))='MANUAL')::int as manual
             from (${rekapSql}) c
             where ${where.join(' and ')}`,
            params
        );

        const row = rows[0] || {};

        const summary = {
            semua: Number(row.semua || 0),
            masuk: Number(row.masuk || 0),
            keluar: Number(row.keluar || 0),
            dors: Number(row.dors || 0),
            manual: Number(row.manual || 0),
        };

        const result = {
            summary,
            mode: 'exact-scope-cache-5m',
            cached: false,
        };

        this.summaryCache.set(key, {
            expiresAt: Date.now() + 300000,
            data: result,
        });

        return result;
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

    /**
     * Union khusus halaman rekap.
     * Scope + periode LP didorong ke masing-masing branch SEBELUM JSON barang_bukti di-expand.
     * unionSql() lama tetap dipakai listByLpAll().
     */
    private rekapUnionSql(
        scope: { all: boolean; satkerId: number | null },
        query: any,
        params: any[]
    ): string {
        const lpWhere: string[] = ['lp.deleted_at is null'];
        lpWhere.push(this.scopeClause(scope, params));
        this.applyPeriodFilter(query, params, lpWhere);

        const lpFilter = lpWhere.join(' and ');

        return `
            select 'DORS' as sumber, concat('dors-', bb.id)::text as row_id, bb.lp_id,
                   null::text as nomor_register,
                   coalesce(bb.jenis_bb, bb.kode_bb, 'Barang Bukti') as jenis,
                   bb.jumlah,
                   null::text as kepemilikan,
                   null::date as tanggal_penyitaan,
                   'MASUK'::text as status,
                   nullif(trim(concat_ws(' · ', bb.keterangan,
                       nullif(concat_ws(' ', bb.ran_jenis, bb.ran_merk, bb.ran_type, bb.ran_no_registrasi), ''))), '') as keterangan,
                   false as can_delete,
                   lp.synced_at as created_at,
                   lp.no_laporan,
                   lp.satker_id,
                   lp.satker_nama,
                   lp.unit_nama,
                   lp.payload_json as payload_json
            from bdb_dors_lp_barang_bukti bb
            join bdb_laporan_polisi lp on lp.id = bb.lp_id
            where ${lpFilter}

            union all

            select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id,
                   m.nomor_register, m.jenis, m.jumlah, m.kepemilikan, m.tanggal_penyitaan, m.status, m.keterangan,
                   true as can_delete,
                   m.created_at,
                   lp.no_laporan,
                   lp.satker_id,
                   lp.satker_nama,
                   lp.unit_nama,
                   lp.payload_json as payload_json
            from bdb_lp_barang_bukti_manual m
            join bdb_laporan_polisi lp on lp.id = m.lp_id
            where m.deleted_at is null
              and ${lpFilter}
        `;
    }

    /** Rekap lintas-LP (dipaginasi) -- dipakai halaman Rekap Barang Bukti. */
    async list(authUser: any, query: any = {}) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);

        if (String(query.summary_only || '') === '1') {
            const result = await this.globalSummary(scope, query);
            return { data: [], meta: result };
        }

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const rekapSql = this.rekapUnionSql(scope, query, params);
        const outerWhere: string[] = ['1=1'];

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            outerWhere.push(`(lower(coalesce(c.jenis,'')) like $${p} or lower(coalesce(c.nomor_register,'')) like $${p} or lower(coalesce(c.no_laporan,'')) like $${p} or lower(coalesce(c.keterangan,'')) like $${p})`);
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
            from (${rekapSql}) c
            where ${outerWhere.join(' and ')}
        `;


        const rows = await this.dataSource.query(
            `select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.can_delete, c.created_at,
                    c.no_laporan, c.satker_id, c.satker_nama, c.unit_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(c.payload_json->'tindak_pidana')='array' then c.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             ${baseSql}
             order by c.created_at desc
             limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit + 1, offset]
        );

        const hasNext = rows.length > limit;
        return {
            data: rows.slice(0, limit),
            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'lookahead-no-count' }
        };
    }

    /** Gabungan DORS + MANUAL utk SATU LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    async listByLpAll(authUser: any, lpId: number) {
        await this.assertLpAccess(authUser, lpId);
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

    private async assertAccess(authUser: any, lp: { id: number; satker_id: number; unit_satker_id?: number | null }, scope: { all: boolean; satkerId: number | null }) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new ForbiddenException('Tidak berwenang mengelola barang bukti.');
        }
        await this.monitoring.assertCanMutateLp(authUser?.id ? Number(authUser.id) : undefined, Number(lp.id), authUser);
    }

    private async assertLpAccess(authUser: any, lpId: number) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, jenis_kejahatan_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        await this.assertAccess(authUser, lp, scope);
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
