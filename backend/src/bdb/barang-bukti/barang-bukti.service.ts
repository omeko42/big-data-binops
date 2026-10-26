import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { LpMonitoringAccessService } from '../common/lp-monitoring-access.service';

const STATUS_MANUAL = ['MASUK', 'KELUAR'];

/**
 * Barang Bukti: gabungan 2 sumber --
 *  1) bdb_dors_lp_barang_bukti / bdb_laporan_polisi.payload_json->'barang_bukti' -- read-only, dari DORS tiap sync.
 *  2) bdb_lp_barang_bukti_manual -- dicatat manual di halaman detail LP, field lengkap (bisa CRUD).
 */
@Injectable()
export class BarangBuktiService implements OnApplicationBootstrap {
    private readonly logger = new Logger(BarangBuktiService.name);

    private readonly summaryCache = new Map<string, { expiresAt: number; data: any }>();
    private readonly listCache = new Map<string, { expiresAt: number; data: any }>();
    private readonly satkerTreeCache = new Map<number, { expiresAt: number; ids: number[] }>();

    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly monitoring: LpMonitoringAccessService
    ) {}

    async onApplicationBootstrap() {
        try {
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_dors_bb_lp_id_id
                ON bdb_dors_lp_barang_bukti (lp_id DESC, id DESC);
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_manual_bb_created
                ON bdb_lp_barang_bukti_manual (created_at DESC);
            `);
            await this.dataSource.query(`
                CREATE INDEX IF NOT EXISTS idx_lp_eff_satker_id_desc
                ON bdb_laporan_polisi (coalesce(unit_satker_id, satker_id), id DESC)
                WHERE deleted_at IS NULL;
            `);
        } catch (err: any) {
            this.logger.warn('BarangBuktiService index bootstrap warning: ' + (err?.message || err));
        }
    }

    private async resolveSatkerTreeIds(targetSatkerId: number): Promise<number[]> {
        const cached = this.satkerTreeCache.get(targetSatkerId);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.ids;
        }
        const rows = await this.dataSource.query(
            targetSatkerId === 13
                ? `with recursive tree as (
                       select id from bdb_satker where id = 13 or upper(coalesce(nama_singkat,'')) like '%BARESKRIM%' or upper(coalesce(deskripsi,'')) like '%BARESKRIM%'
                       union
                       select s.id from bdb_satker s join tree t on s.parent_id = t.id
                   ) select id::int as id from tree`
                : `with recursive tree as (
                       select id from bdb_satker where id = $1
                       union
                       select s.id from bdb_satker s join tree t on s.parent_id = t.id
                   ) select id::int as id from tree`,
            targetSatkerId === 13 ? [] : [targetSatkerId]
        );
        const ids = rows.map((r: any) => Number(r.id)).filter((n: number) => Number.isSafeInteger(n) && n > 0);
        const finalIds = ids.length > 0 ? ids : [targetSatkerId];
        this.satkerTreeCache.set(targetSatkerId, { expiresAt: Date.now() + 600000, ids: finalIds });
        return finalIds;
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

    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[], query?: any): string {
        const isNational = query?.scope === 'national';
        const qSatkerId = Number(query?.satker_id || 0);
        const hasExplicitSatker = Number.isSafeInteger(qSatkerId) && qSatkerId > 0;
        const targetSatkerId = hasExplicitSatker
            ? qSatkerId
            : (!isNational && !scope.all ? scope.satkerId : null);

        if (!scope.all && !scope.satkerId && !hasExplicitSatker) {
            return '1=0';
        }
        if (!targetSatkerId) {
            return '1=1';
        }
        if (targetSatkerId === 13) {
            return `(coalesce(lp.unit_satker_id, lp.satker_id) in (
                with recursive st as (
                    select id from bdb_satker where id = 13
                    union all
                    select s.id from bdb_satker s join st on s.parent_id = st.id
                ) select id from st
            ) or lp.satker_id = 13 or upper(coalesce(lp.satker_nama,'')) like '%BARESKRIM%' or upper(coalesce(lp.unit_satker_nama,'')) like '%BARESKRIM%')`;
        }
        return `(coalesce(lp.unit_satker_id, lp.satker_id) in (
            with recursive st as (
                select id from bdb_satker where id = ${targetSatkerId}
                union all
                select s.id from bdb_satker s join st on s.parent_id = st.id
            ) select id from st
        ) or lp.satker_id = ${targetSatkerId})`;
    }

    private summaryKey(scope: { all: boolean; satkerId: number | null }, query: any): string {
        return JSON.stringify({
            all: !!scope.all,
            satkerId: scope.satkerId ?? null,
            querySatkerId: Number(query?.satker_id || 0),
            search: (this.toText(query.search) || '').toLowerCase(),
            from: this.toText(query.from) || '',
            to: this.toText(query.to) || '',
        });
    }

    private listKey(scope: { all: boolean; satkerId: number | null }, query: any, page: number, limit: number): string {
        return JSON.stringify({
            all: !!scope.all,
            satkerId: scope.satkerId ?? null,
            querySatkerId: Number(query?.satker_id || 0),
            search: (this.toText(query.search) || '').toLowerCase(),
            status: (this.toText(query.status) || 'ALL').toUpperCase(),
            sumber: (this.toText(query.sumber) || 'ALL').toUpperCase(),
            from: this.toText(query.from) || '',
            to: this.toText(query.to) || '',
            page,
            limit,
        });
    }

    private normalizedJenisSql(alias = 'bb'): string {
        return `case
            when upper(trim(coalesce(${alias}.jenis_bb, ''))) not in ('', '-', 'TIDAK DIKETAHUI', 'LAIN-LAIN', 'LAINNYA', 'NIHIL', 'NULL')
                then trim(${alias}.jenis_bb)
            when nullif(trim(coalesce(${alias}.ran_jenis, '')), '') is not null
                 or nullif(trim(coalesce(${alias}.ran_merk, '')), '') is not null
                 or upper(coalesce(${alias}.keterangan, '')) ~ '(SEPEDA MOTOR|MOBIL|KENDARAAN|STNK|BPKB|NOPOL|PLAT NOMOR|HONDA|YAMAHA|SUZUKI|TOYOTA|DAIHATSU|MITSUBISHI|KAWASAKI|TRUK|PICK UP)'
                then 'Kendaraan / Ranmor'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(HANDPHONE|HP |IPHONE|SAMSUNG|XIAOMI|OPPO|VIVO|REALME|INFINIX|LAPTOP|KOMPUTER|FLASHDISK|REKAMAN|CCTV|SIM CARD|SCREENSHOT|TANGKAPAN LAYAR|ELEKTRONIK)'
                then 'Elektronik / Digital'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(UANG|RUPIAH|RP\\.|RP |REKENING|BUKTI TRANSFER|MUTASI|ATM|CEK |GIRO|TUNAI|STRUK|KWITANSI)'
                then 'Uang / Bukti Keuangan'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(SURAT|DOKUMEN|AKTA|SERTIFIKAT|IJAZAH|KTP|KARTU KELUARGA|PERJANJIAN|KONTRAK|BERKAS|NOTA|FAKTUR|INVOICE)'
                then 'Dokumen / Surat'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(SABU|GANJA|EKSTASI|NARKOBA|NARKOTIKA|OBAT|PIL |TRAMADOL|HEXYMER|TEMBAKAU|BONG |PIPET|TIMBANGAN)'
                then 'Narkotika / Obat'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(SENJATA|PISAU|PARANG|CELURIT|GOLOK|BADIK|PEDANG|SENPI|PELURU|AMUNISI|AIRSOFT|TAJAM|BESI|KAYU|BATU)'
                then 'Senjata / Tajam'
            when upper(coalesce(${alias}.keterangan, '')) ~ '(BAJU|KAOS|CELANA|JAKET|PAKAIAN|SEPATU|SANDAL|TAS |DOMPET|HELM|TOPI|JAM TANGAN|EMAS|PERHIASAN|CINCIN|KALUNG)'
                then 'Pakaian / Barang Pribadi'
            else coalesce(nullif(trim(${alias}.kode_bb), ''), 'Barang Bukti Umum')
        end`;
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
            WITH dors_agg AS (
                SELECT 
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) as tanggal,
                    count(*)::int as semua,
                    count(*)::int as masuk,
                    0::int as keluar,
                    count(*)::int as dors,
                    0::int as manual
                FROM bdb_dors_lp_barang_bukti bb
                JOIN bdb_laporan_polisi lp ON lp.id = bb.lp_id
                WHERE lp.deleted_at IS NULL
                  AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) >= '2026-01-01'::date
                GROUP BY 1, 2
            ),
            manual_agg AS (
                SELECT 
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(m.created_at::date, CURRENT_DATE) as tanggal,
                    count(*)::int as semua,
                    count(*) filter (where upper(coalesce(m.status, 'MASUK')) = 'MASUK')::int as masuk,
                    count(*) filter (where upper(coalesce(m.status, 'MASUK')) = 'KELUAR')::int as keluar,
                    0::int as dors,
                    count(*)::int as manual
                FROM bdb_lp_barang_bukti_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id
                WHERE m.deleted_at IS NULL AND lp.deleted_at IS NULL
                GROUP BY 1, 2
            ),
            combined AS (
                SELECT
                    satker_id,
                    tanggal,
                    sum(semua)::int as semua,
                    sum(masuk)::int as masuk,
                    sum(keluar)::int as keluar,
                    sum(dors)::int as dors,
                    sum(manual)::int as manual
                FROM (
                    SELECT * FROM dors_agg
                    UNION ALL
                    SELECT * FROM manual_agg
                ) u
                WHERE satker_id IS NOT NULL AND tanggal IS NOT NULL
                GROUP BY 1, 2
            )
            INSERT INTO bdb_barang_bukti_summary_snapshot
                (satker_id, tanggal, semua, masuk, keluar, dors, manual, refreshed_at)
            SELECT satker_id, tanggal, semua, masuk, keluar, dors, manual, now()
            FROM combined
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
        this.listCache.clear();
        this.logger.log('bdb_barang_bukti_summary_snapshot selesai diperbarui.');
    }

    private async globalSummary(scope: { all: boolean; satkerId: number | null }, query: any) {
        const key = this.summaryKey(scope, query);
        const cached = this.summaryCache.get(key);

        if (cached && cached.expiresAt > Date.now()) {
            return { ...cached.data, cached: true };
        }

        if (cached) this.summaryCache.delete(key);

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

                const qSid = Number(query.satker_id || 0);
                const targetSid = (Number.isSafeInteger(qSid) && qSid > 0)
                    ? qSid
                    : (!scope.all && scope.satkerId ? scope.satkerId : null);

                if (targetSid) {
                    if (targetSid === 13) {
                        sWhere.push(`satker_id in (
                            with recursive st as (
                                select id from bdb_satker where id = 13 or upper(coalesce(nama_singkat,'')) like '%BARESKRIM%' or upper(coalesce(deskripsi,'')) like '%BARESKRIM%'
                                union all
                                select s.id from bdb_satker s join st on s.parent_id = st.id
                            ) select id from st
                        )`);
                    } else {
                        sWhere.push(`satker_id in (
                            with recursive st as (
                                select id from bdb_satker where id = ${targetSid}
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

        const params: any[] = [];
        const rekapSql = this.rekapUnionSql(scope, query, params);
        const where: string[] = ['1=1'];

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

    /** Subquery gabungan DORS (dari JSON payload) + MANUAL, dipakai listByLpAll(). */
    private unionSql(): string {
        return `
            select 'DORS' as sumber, concat('dors-', lp.id, '-', elem.ord)::text as row_id, lp.id as lp_id,
                   null::text as nomor_register,
                   case
                       when upper(trim(coalesce(elem.item->>'jenis_bb', ''))) not in ('', '-', 'TIDAK DIKETAHUI', 'LAIN-LAIN', 'LAINNYA', 'NIHIL', 'NULL')
                           then trim(elem.item->>'jenis_bb')
                       when nullif(trim(coalesce(elem.item->>'ran_jenis', '')), '') is not null
                            or nullif(trim(coalesce(elem.item->>'ran_merk', '')), '') is not null
                            or upper(coalesce(elem.item->>'keterangan', '')) ~ '(SEPEDA MOTOR|MOBIL|KENDARAAN|STNK|BPKB|NOPOL|PLAT NOMOR|HONDA|YAMAHA|SUZUKI|TOYOTA|DAIHATSU|MITSUBISHI|KAWASAKI|TRUK|PICK UP)'
                           then 'Kendaraan / Ranmor'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(HANDPHONE|HP |IPHONE|SAMSUNG|XIAOMI|OPPO|VIVO|REALME|INFINIX|LAPTOP|KOMPUTER|FLASHDISK|REKAMAN|CCTV|SIM CARD|SCREENSHOT|TANGKAPAN LAYAR|ELEKTRONIK)'
                           then 'Elektronik / Digital'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(UANG|RUPIAH|RP\\.|RP |REKENING|BUKTI TRANSFER|MUTASI|ATM|CEK |GIRO|TUNAI|STRUK|KWITANSI)'
                           then 'Uang / Bukti Keuangan'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(SURAT|DOKUMEN|AKTA|SERTIFIKAT|IJAZAH|KTP|KARTU KELUARGA|PERJANJIAN|KONTRAK|BERKAS|NOTA|FAKTUR|INVOICE)'
                           then 'Dokumen / Surat'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(SABU|GANJA|EKSTASI|NARKOBA|NARKOTIKA|OBAT|PIL |TRAMADOL|HEXYMER|TEMBAKAU|BONG |PIPET|TIMBANGAN)'
                           then 'Narkotika / Obat'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(SENJATA|PISAU|PARANG|CELURIT|GOLOK|BADIK|PEDANG|SENPI|PELURU|AMUNISI|AIRSOFT|TAJAM|BESI|KAYU|BATU)'
                           then 'Senjata / Tajam'
                       when upper(coalesce(elem.item->>'keterangan', '')) ~ '(BAJU|KAOS|CELANA|JAKET|PAKAIAN|SEPATU|SANDAL|TAS |DOMPET|HELM|TOPI|JAM TANGAN|EMAS|PERHIASAN|CINCIN|KALUNG)'
                           then 'Pakaian / Barang Pribadi'
                       else coalesce(nullif(trim(elem.item->>'kode_bb'), ''), 'Barang Bukti Umum')
                   end as jenis,
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
     * Scope + periode LP didorong ke masing-masing branch.
     */
    private rekapUnionSql(
        scope: { all: boolean; satkerId: number | null },
        query: any,
        params: any[]
    ): string {
        const lpWhere: string[] = ['lp.deleted_at is null'];
        lpWhere.push(this.scopeClause(scope, params, query));
        this.applyPeriodFilter(query, params, lpWhere);

        const lpFilter = lpWhere.join(' and ');

        return `
            select 'DORS' as sumber, concat('dors-', bb.id)::text as row_id, bb.lp_id,
                   null::text as nomor_register,
                   ${this.normalizedJenisSql('bb')} as jenis,
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
        const fetchLimit = offset + limit + 1;

        const cacheKey = this.listKey(scope, query, page, limit);
        const cached = this.listCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data;
        }
        if (cached) this.listCache.delete(cacheKey);

        const params: any[] = [];
        const isNational = query?.scope === 'national';
        const qSatkerId = Number(query?.satker_id || 0);
        const hasExplicitSatker = Number.isSafeInteger(qSatkerId) && qSatkerId > 0;
        const targetSatkerId = hasExplicitSatker
            ? qSatkerId
            : (!isNational && !scope.all ? scope.satkerId : null);

        let satkerArrParamIdx = 0;
        if (targetSatkerId) {
            const satkerIds = await this.resolveSatkerTreeIds(targetSatkerId);
            params.push(satkerIds);
            satkerArrParamIdx = params.length;
        }

        const periodWhere: string[] = [];
        this.applyPeriodFilter(query, params, periodWhere);

        const lpWhere: string[] = ['lp.deleted_at is null'];
        if (satkerArrParamIdx > 0) {
            lpWhere.push(`coalesce(lp.unit_satker_id, lp.satker_id) = any($${satkerArrParamIdx}::bigint[])`);
        } else {
            lpWhere.push(this.scopeClause(scope, params, query));
        }
        lpWhere.push(...periodWhere);
        const lpFilter = lpWhere.join(' and ');

        const search = this.toText(query.search);
        let searchParamIdx = 0;
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            searchParamIdx = params.length;
        }

        const statusRaw = (this.toText(query.status) || 'ALL').toUpperCase();
        const statusFilter = (statusRaw !== 'ALL' && statusRaw !== 'SEMUA') ? statusRaw : null;

        const sumberRaw = (this.toText(query.sumber) || 'ALL').toUpperCase();
        const sumberFilter = (sumberRaw !== 'ALL' && sumberRaw !== 'SEMUA') ? sumberRaw : null;

        const includeDors = (!sumberFilter || sumberFilter === 'DORS') && (!statusFilter || statusFilter === 'MASUK');
        const includeManual = (!sumberFilter || sumberFilter === 'MANUAL');

        const dorsWhere: string[] = [lpFilter];
        if (searchParamIdx > 0) {
            dorsWhere.push(
                `(lower(coalesce(bb.jenis_bb,'')) like $${searchParamIdx} or lower(coalesce(bb.keterangan,'')) like $${searchParamIdx} or lower(coalesce(bb.ran_jenis,'')) like $${searchParamIdx} or lower(coalesce(bb.ran_merk,'')) like $${searchParamIdx} or lower(coalesce(lp.no_laporan,'')) like $${searchParamIdx})`
            );
        }

        const manualWhere: string[] = ['m.deleted_at is null', lpFilter];
        if (statusFilter) {
            params.push(statusFilter);
            manualWhere.push(`upper(coalesce(m.status, 'MASUK')) = $${params.length}`);
        }
        if (searchParamIdx > 0) {
            manualWhere.push(
                `(lower(coalesce(m.jenis,'')) like $${searchParamIdx} or lower(coalesce(m.nomor_register,'')) like $${searchParamIdx} or lower(coalesce(m.keterangan,'')) like $${searchParamIdx} or lower(coalesce(lp.no_laporan,'')) like $${searchParamIdx})`
            );
        }

        const branches: string[] = [];
        if (includeDors) {
            if (satkerArrParamIdx > 0 && searchParamIdx === 0) {
                const lateralPeriod = periodWhere.length > 0 ? `and ${periodWhere.join(' and ')}` : '';
                branches.push(`(
                    with matching_lps as materialized (
                        select lp.*
                        from unnest($${satkerArrParamIdx}::bigint[]) as sid
                        cross join lateral (
                            select lp.id, lp.synced_at, lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama
                            from bdb_laporan_polisi lp
                            where lp.deleted_at is null
                              and coalesce(lp.unit_satker_id, lp.satker_id) = sid
                              ${lateralPeriod}
                            order by lp.id desc
                            limit ${Math.max(50, fetchLimit * 2)}
                        ) lp
                        order by lp.id desc
                        limit ${Math.max(100, fetchLimit * 4)}
                    )
                    select 'DORS'::text as sumber,
                           concat('dors-', bb.id)::text as row_id,
                           bb.lp_id,
                           null::text as nomor_register,
                           ${this.normalizedJenisSql('bb')} as jenis,
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
                           lp.unit_nama
                    from matching_lps lp
                    join bdb_dors_lp_barang_bukti bb on bb.lp_id = lp.id
                    order by (bb.lp_id + 0) desc, bb.id desc
                    limit ${fetchLimit}
                )`);
            } else {
                branches.push(`(
                    select 'DORS'::text as sumber,
                           concat('dors-', bb.id)::text as row_id,
                           bb.lp_id,
                           null::text as nomor_register,
                           ${this.normalizedJenisSql('bb')} as jenis,
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
                           lp.unit_nama
                    from bdb_dors_lp_barang_bukti bb
                    join bdb_laporan_polisi lp on lp.id = bb.lp_id
                    where ${dorsWhere.join(' and ')}
                    order by bb.lp_id desc, bb.id desc
                    limit ${fetchLimit}
                )`);
            }
        }

        if (includeManual) {
            branches.push(`(
                select 'MANUAL'::text as sumber,
                       m.id::text as row_id,
                       m.lp_id,
                       m.nomor_register,
                       m.jenis,
                       m.jumlah,
                       m.kepemilikan,
                       m.tanggal_penyitaan,
                       m.status,
                       m.keterangan,
                       true as can_delete,
                       m.created_at,
                       lp.no_laporan,
                       lp.satker_id,
                       lp.satker_nama,
                       lp.unit_nama
                from bdb_lp_barang_bukti_manual m
                join bdb_laporan_polisi lp on lp.id = m.lp_id
                where ${manualWhere.join(' and ')}
                order by m.created_at desc, m.id desc
                limit ${fetchLimit}
            )`);
        }

        if (branches.length === 0) {
            return {
                data: [],
                meta: { total: 0, estimatedTotal: 0, page, limit, hasNext: false, totalPages: 0, mode: 'lookahead-no-count' }
            };
        }

        params.push(limit + 1, offset);
        const limitParam = params.length - 1;
        const offsetParam = params.length;

        const rows = await this.dataSource.query(
            `with paged as (
                select *
                from (
                    ${branches.join(' union all ')}
                ) c
                order by c.created_at desc nulls last, c.lp_id desc
                limit $${limitParam} offset $${offsetParam}
             )
             select p.sumber, p.row_id, p.lp_id, p.nomor_register, p.jenis, p.jumlah, p.kepemilikan, p.tanggal_penyitaan,
                    p.status, p.keterangan, p.can_delete, p.created_at,
                    p.no_laporan, p.satker_id, p.satker_nama, p.unit_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(lp_tp.payload_json->'tindak_pidana')='array' then lp_tp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             from paged p
             left join bdb_laporan_polisi lp_tp on lp_tp.id = p.lp_id`,
            params
        );

        const hasNext = rows.length > limit;
        const response = {
            data: rows.slice(0, limit),
            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'lookahead-no-count' }
        };

        this.listCache.set(cacheKey, {
            expiresAt: Date.now() + 60000,
            data: response,
        });

        return response;
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

        this.summaryCache.clear();
        this.listCache.clear();

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

        this.summaryCache.clear();
        this.listCache.clear();

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

        this.summaryCache.clear();
        this.listCache.clear();

        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'barang_bukti_manual', entityId: id, meta: { lp_id: rows[0].lp_id, jenis: rows[0].jenis } });

        return { status: 1, message: 'Barang bukti manual dihapus.' };
    }
}
