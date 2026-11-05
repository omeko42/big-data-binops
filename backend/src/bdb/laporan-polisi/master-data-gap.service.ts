import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

type Dimension =
    | 'jenis_kejahatan'
    | 'kategori_lokasi'
    | 'motif_kejahatan'
    | 'modus_operandi'
    | 'undang_undang'
    | 'provinsi'
    | 'kabupaten'
    | 'kecamatan'
    | 'desa';

const DIMENSION_LABEL: Record<Dimension, string> = {
    jenis_kejahatan: 'Jenis Kejahatan',
    kategori_lokasi: 'Kategori Lokasi',
    motif_kejahatan: 'Motif Kejahatan',
    modus_operandi: 'Modus Operandi',
    undang_undang: 'Undang-Undang',
    provinsi: 'Provinsi (TKP)',
    kabupaten: 'Kabupaten/Kota (TKP)',
    kecamatan: 'Kecamatan (TKP)',
    desa: 'Desa (TKP)',
};

/**
 * Notifikasi: nilai ID master (jenis kejahatan, lokasi, motif, modus, UU, wilayah TKP) yang
 * dikirim DORS tapi TIDAK ada padanannya di master data (cm_*) kita -- baik yang sudah terjadi
 * maupun yang akan muncul di sync berikutnya (linkMasterData berjalan tiap sync, lihat
 * LaporanPolisiService.mapFromDors). Nama entitas diambil dari payload DORS sendiri (yang
 * biasanya ikut mengirim nama di sebelah ID-nya) supaya operator tahu apa yang perlu ditambah
 * ke master data.
 */
@Injectable()
export class MasterDataGapService {
    private static readonly CACHE_TTL_MS = 5 * 60 * 1000;
    private statsCache: { expiresAt: number; payload: any } | null = null;
    private readonly listCache = new Map<string, { expiresAt: number; payload: any }>();
    private indexesEnsured = false;

    constructor(private readonly dataSource: DataSource) {}

    private async ensureIndexesAndSnapshotTable() {
        if (this.indexesEnsured) return;
        this.indexesEnsured = true;
        try {
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS bdb_master_data_gap_snapshot (
                    cache_key text PRIMARY KEY,
                    payload jsonb NOT NULL,
                    updated_at timestamptz NOT NULL DEFAULT now()
                );
                CREATE INDEX IF NOT EXISTS idx_lp_master_gap_unlinked
                ON bdb_laporan_polisi (id)
                WHERE jenis_kejahatan_id IS NULL
                   OR kategori_lokasi_id IS NULL
                   OR motif_kejahatan_id IS NULL
                   OR modus_operandi_id IS NULL
                   OR tkp_provinsi_code IS NULL
                   OR tkp_kabupaten_code IS NULL
                   OR tkp_kecamatan_code IS NULL
                   OR tkp_desa_code IS NULL;
                CREATE INDEX IF NOT EXISTS idx_tp_dors_uu_null
                ON bdb_lp_tindak_pidana_dors (laporan_polisi_id)
                WHERE undang_undang_id IS NULL;
            `);
        } catch {
            // ignore index creation errors if concurrent
        }
    }

    // dimensi skalar level bdb_laporan_polisi (bukan array tindak_pidana)
    private static readonly SCALAR_DIMENSIONS: Record<
        Exclude<Dimension, 'undang_undang'>,
        { rawIdExpr: string; namaExpr: string; fkCol: string }
    > = {
        jenis_kejahatan: {
            rawIdExpr: `nullif(payload_json->'kategori_gk'->>'id','')`,
            namaExpr: `payload_json->'kategori_gk'->>'keterangan'`,
            fkCol: 'jenis_kejahatan_id',
        },
        kategori_lokasi: {
            rawIdExpr: `nullif(payload_json->>'id_kategori_lokasi','')`,
            namaExpr: `payload_json->'kategori_lokasi'->>'lokasi'`,
            fkCol: 'kategori_lokasi_id',
        },
        motif_kejahatan: {
            rawIdExpr: `nullif(payload_json->>'id_emp_motif_kejahatan','')`,
            namaExpr: `nullif(payload_json->>'motif_kejahatan','')`,
            fkCol: 'motif_kejahatan_id',
        },
        modus_operandi: {
            rawIdExpr: `nullif(payload_json->>'id_emp_modus_operandi','')`,
            namaExpr: `nullif(payload_json->>'modus_operandi','')`,
            fkCol: 'modus_operandi_id',
        },
        provinsi: {
            rawIdExpr: `nullif(payload_json->>'tkp_id_provinsi','')`,
            namaExpr: `payload_json->'tkp_provinsi'->>'provinsi'`,
            fkCol: 'tkp_provinsi_code',
        },
        kabupaten: {
            rawIdExpr: `nullif(payload_json->>'tkp_id_kota','')`,
            namaExpr: `payload_json->'tkp_kota'->>'kabupaten'`,
            fkCol: 'tkp_kabupaten_code',
        },
        kecamatan: {
            rawIdExpr: `nullif(payload_json->>'tkp_id_kecamatan','')`,
            namaExpr: `payload_json->'tkp_kecamatan'->>'kecamatan'`,
            fkCol: 'tkp_kecamatan_code',
        },
        desa: {
            rawIdExpr: `nullif(payload_json->>'tkp_id_desa','')`,
            namaExpr: `payload_json->'tkp_desa'->>'desa'`,
            fkCol: 'tkp_desa_code',
        },
    };

    private scalarCte(dim: Exclude<Dimension, 'undang_undang'>): string {
        const { rawIdExpr, namaExpr, fkCol } = MasterDataGapService.SCALAR_DIMENSIONS[dim];
        return `
            select '${dim}' as dimensi, ${rawIdExpr} as raw_id, ${namaExpr} as nama, no_laporan
            from bdb_laporan_polisi
            where ${fkCol} is null and ${rawIdExpr} ~ '^[0-9]+$'
        `;
    }

    private uuCte(): string {
        return `
            select 'undang_undang' as dimensi,
                   coalesce(nullif(tp.dors_tp_id::text, ''), '0') as raw_id,
                   tp.nama_uu as nama,
                   lp.no_laporan
            from bdb_lp_tindak_pidana_dors tp
            join bdb_laporan_polisi lp on lp.id = tp.laporan_polisi_id
            where tp.undang_undang_id is null
              and nullif(btrim(coalesce(tp.nama_uu, '')), '') is not null
        `;
    }

    private allDimensionsUnion(): string {
        const dims = Object.keys(MasterDataGapService.SCALAR_DIMENSIONS) as Exclude<Dimension, 'undang_undang'>[];
        return [...dims.map((d) => this.scalarCte(d)), this.uuCte()].join('\nunion all\n');
    }

    async stats(forceRefresh = false) {
        const now = Date.now();
        if (!forceRefresh && this.statsCache && this.statsCache.expiresAt > now) {
            return this.statsCache.payload;
        }
        await this.ensureIndexesAndSnapshotTable();
        if (!forceRefresh) {
            const snap = await this.dataSource.query(
                `SELECT payload, (updated_at > now() - interval '5 minutes') AS is_fresh FROM bdb_master_data_gap_snapshot WHERE cache_key = 'stats' LIMIT 1`
            ).catch(() => []);
            if (snap.length && snap[0].payload) {
                this.statsCache = { expiresAt: now + MasterDataGapService.CACHE_TTL_MS, payload: snap[0].payload };
                if (!snap[0].is_fresh) {
                    setImmediate(() => this.stats(true).catch(() => {}));
                }
                return snap[0].payload;
            }
        }
        const rows = await this.dataSource.query(`
            with base as (${this.allDimensionsUnion()})
            select dimensi, count(distinct raw_id)::int as id_unik, count(*)::int as lp_terdampak
            from base group by dimensi order by dimensi
        `);
        const payload = {
            status: 1,
            data: rows.map((r: any) => ({ dimensi: r.dimensi, label: DIMENSION_LABEL[r.dimensi as Dimension], id_unik: r.id_unik, lp_terdampak: r.lp_terdampak })),
        };
        this.statsCache = { expiresAt: now + MasterDataGapService.CACHE_TTL_MS, payload };
        await this.dataSource.query(
            `INSERT INTO bdb_master_data_gap_snapshot (cache_key, payload, updated_at)
             VALUES ('stats', $1::jsonb, now())
             ON CONFLICT (cache_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
            [JSON.stringify(payload)]
        ).catch(() => {});
        return payload;
    }

    async list(opts: { dimensi?: Dimension; search?: string; page?: number; row?: number; refresh?: boolean }) {
        const page = Math.max(opts.page || 1, 1);
        const row = Math.min(Math.max(opts.row || 25, 1), 1000);
        const offset = (page - 1) * row;
        const cacheKey = `list:${opts.dimensi || 'ALL'}:${(opts.search || '').trim().toUpperCase()}:${page}:${row}`;
        const now = Date.now();

        if (!opts.refresh) {
            const mem = this.listCache.get(cacheKey);
            if (mem && mem.expiresAt > now) {
                return mem.payload;
            }
            await this.ensureIndexesAndSnapshotTable();
            const snap = await this.dataSource.query(
                `SELECT payload, (updated_at > now() - interval '5 minutes') AS is_fresh FROM bdb_master_data_gap_snapshot WHERE cache_key = $1 LIMIT 1`,
                [cacheKey]
            ).catch(() => []);
            if (snap.length && snap[0].payload) {
                this.listCache.set(cacheKey, { expiresAt: now + MasterDataGapService.CACHE_TTL_MS, payload: snap[0].payload });
                if (!snap[0].is_fresh) {
                    setImmediate(() => this.list({ ...opts, refresh: true }).catch(() => {}));
                }
                return snap[0].payload;
            }
        } else {
            await this.ensureIndexesAndSnapshotTable();
        }

        const union = opts.dimensi
            ? opts.dimensi === 'undang_undang'
                ? this.uuCte()
                : this.scalarCte(opts.dimensi as Exclude<Dimension, 'undang_undang'>)
            : this.allDimensionsUnion();

        const params: any[] = [];
        let searchClause = '';
        if (opts.search) {
            params.push(`%${opts.search.toUpperCase()}%`);
            searchClause = `where upper(coalesce(nama,'')) like $${params.length} or raw_id like $${params.length}`;
        }

        const rows = await this.dataSource.query(
            `
            with base as (${union}),
            grouped as (
                select dimensi, raw_id, max(nama) as nama, count(*)::int as lp_terdampak,
                       (array_agg(no_laporan order by no_laporan))[1:3] as contoh_no_laporan
                from base
                group by dimensi, raw_id
            )
            select * from grouped
            ${searchClause}
            order by lp_terdampak desc, dimensi, raw_id
            limit ${row} offset ${offset}
            `,
            params
        );
        const countRes = await this.dataSource.query(
            `
            with base as (${union}),
            grouped as (select dimensi, raw_id, max(nama) as nama from base group by dimensi, raw_id)
            select count(*)::int as c from grouped ${searchClause}
            `,
            params
        );
        const payload = {
            status: 1,
            data: rows.map((r: any) => ({
                dimensi: r.dimensi,
                label: DIMENSION_LABEL[r.dimensi as Dimension],
                raw_id: r.raw_id,
                nama: r.nama,
                lp_terdampak: r.lp_terdampak,
                contoh_no_laporan: r.contoh_no_laporan || [],
            })),
            total: countRes[0]?.c || 0,
            page,
            row,
        };
        this.listCache.set(cacheKey, { expiresAt: now + MasterDataGapService.CACHE_TTL_MS, payload });
        await this.dataSource.query(
            `INSERT INTO bdb_master_data_gap_snapshot (cache_key, payload, updated_at)
             VALUES ($1, $2::jsonb, now())
             ON CONFLICT (cache_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
            [cacheKey, JSON.stringify(payload)]
        ).catch(() => {});
        return payload;
    }
}
