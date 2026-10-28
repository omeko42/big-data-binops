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
    private statsCache: { exp: number; data: any } | null = null;
    private static readonly STATS_CACHE_TTL_MS = 10 * 60 * 1000;

    constructor(private readonly dataSource: DataSource) {}

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

    private recentLpsCte(): string {
        return `
            select id, no_laporan, payload_json,
                   jenis_kejahatan_id, kategori_lokasi_id, motif_kejahatan_id, modus_operandi_id,
                   tkp_provinsi_code, tkp_kabupaten_code, tkp_kecamatan_code, tkp_desa_code
            from bdb_laporan_polisi
            order by id desc
            limit 5000
        `;
    }

    private scalarCte(dim: Exclude<Dimension, 'undang_undang'>): string {
        const { rawIdExpr, namaExpr, fkCol } = MasterDataGapService.SCALAR_DIMENSIONS[dim];
        return `
            select '${dim}' as dimensi, ${rawIdExpr} as raw_id, ${namaExpr} as nama, no_laporan
            from recent_lps
            where ${fkCol} is null and ${rawIdExpr} ~ '^[0-9]+$'
        `;
    }

    private uuCte(): string {
        return `
            select 'undang_undang' as dimensi,
                   nullif(elem->>'id_uu','') as raw_id,
                   elem->>'nama_uu' as nama,
                   lp.no_laporan
            from recent_lps lp
            cross join lateral jsonb_array_elements(coalesce(lp.payload_json->'tindak_pidana', '[]'::jsonb)) elem
            where nullif(elem->>'id_uu','') ~ '^[0-9]+$'
              and not exists (select 1 from cm_undang_undang u where u.id = (elem->>'id_uu')::bigint)
        `;
    }

    private allDimensionsUnion(): string {
        const dims = Object.keys(MasterDataGapService.SCALAR_DIMENSIONS) as Exclude<Dimension, 'undang_undang'>[];
        return [...dims.map((d) => this.scalarCte(d)), this.uuCte()].join('\nunion all\n');
    }

    async stats() {
        const now = Date.now();
        if (this.statsCache && this.statsCache.exp > now) {
            return this.statsCache.data;
        }
        const rows = await this.dataSource.query(`
            with recent_lps as materialized (${this.recentLpsCte()}),
            base as (${this.allDimensionsUnion()})
            select dimensi, count(distinct raw_id)::int as id_unik, count(*)::int as lp_terdampak
            from base group by dimensi order by dimensi
        `);
        const res = {
            status: 1,
            data: rows.map((r: any) => ({ dimensi: r.dimensi, label: DIMENSION_LABEL[r.dimensi as Dimension], id_unik: r.id_unik, lp_terdampak: r.lp_terdampak })),
        };
        this.statsCache = { exp: now + MasterDataGapService.STATS_CACHE_TTL_MS, data: res };
        return res;
    }

    async list(opts: { dimensi?: Dimension; search?: string; page?: number; row?: number }) {
        const page = Math.max(opts.page || 1, 1);
        const row = Math.min(Math.max(opts.row || 25, 1), 1000);
        const offset = (page - 1) * row;

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
            with recent_lps as materialized (${this.recentLpsCte()}),
            base as (${union}),
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
            with recent_lps as materialized (${this.recentLpsCte()}),
            base as (${union}),
            grouped as (select dimensi, raw_id, max(nama) as nama from base group by dimensi, raw_id)
            select count(*)::int as c from grouped ${searchClause}
            `,
            params
        );
        return {
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
    }
}
