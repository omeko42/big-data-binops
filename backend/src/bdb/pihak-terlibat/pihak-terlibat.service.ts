import { Cron } from '@nestjs/schedule';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { isPrimaryClusterInstance } from '../common/cluster-instance.util';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';
import { LpMonitoringAccessService } from '../common/lp-monitoring-access.service';

const KETERLIBATAN_MANUAL = ['SAKSI', 'AHLI', 'TERSANGKA'];

/**
 * Register Pihak Terlibat: gabungan 3 sumber --
 *  1) bdb_dors_lp_terlibat -- read-only, disalin dari DORS tiap sync (saksi/terlapor/korban/pelapor).
 *  2) bdb_lp_pihak_manual -- diisi manual di halaman detail LP: SAKSI, AHLI, TERSANGKA saja, dengan
 *     field detail personil sama seperti punya DORS.
 *  3) bdb_dokumen PENETAPAN_TSK -- read-only, sumber resmi tersangka dari alur dokumen LP.
 */
@Injectable()
export class PihakTerlibatService implements OnApplicationBootstrap {
    private readonly logger = new Logger(PihakTerlibatService.name);
    private readonly summaryCache = new Map<string, { expiresAt: number; data: any }>();
    private readonly rankingCache = new Map<string, { expiresAt: number; data: any }>();
    private readonly rankingCacheTtlMs = 2 * 60 * 1000;

    async onApplicationBootstrap() {
        if (!isPrimaryClusterInstance()) return;
        try {
            await this.dataSource.query(`ALTER TABLE bdb_pihak_terlibat_ranking_snapshot ADD COLUMN IF NOT EXISTS kasta text;`);
            await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_pihak_ranking_snap_main ON bdb_pihak_terlibat_ranking_snapshot (tahun, coalesce(bulan, 0), kategori_filter, tipe_subjek, nasional_score DESC);`);
            await this.dataSource.query(`CREATE INDEX IF NOT EXISTS idx_pihak_ranking_snap_kasta ON bdb_pihak_terlibat_ranking_snapshot (tahun, coalesce(bulan, 0), kategori_filter, kasta);`);
            const checkRes = await this.dataSource.query(
                `SELECT count(*)::int as c FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 2026 AND bulan IS NULL;`
            );
            const count = Number(checkRes[0]?.c || 0);
            if (count === 0) {
                this.logger.warn('Snapshot ranking tahun 2026 kosong. Menjalankan inisialisasi di background...');
                this.refreshRankingSnapshot(null).catch(err => {
                    this.logger.error('Inisialisasi ranking snapshot gagal: ' + err?.message);
                });
            }
        } catch (e: any) {
            this.logger.error('Gagal memeriksa snapshot ranking saat startup: ' + e?.message);
        }
    }


    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly minio: MinioService,
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

    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[], query?: any): string {
        if (scope.all) return '1=1';
        const isNational = query?.scope === 'national';
        const hasSearch = Boolean(this.toText(query?.search));
        const satkerId = Number(query?.satker_id || 0);
        const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;

        // Jika user memfilter satker spesifik, biarkan filter satker ditangani oleh selected_tree
        if (hasExplicitSatker) return '1=1';

        // Jika query eksplisit nasional atau sedang mencari pihak/NIK tertentu, buka scope pencarian nasional
        if (isNational || hasSearch) return '1=1';

        // Default operator: batasi ke pohon satker wilayah kewenangannya
        if (!scope.satkerId) return '1=0';
        const rootId = Number(scope.satkerId);
        if (!Number.isSafeInteger(rootId) || rootId <= 0) return '1=0';
        return `coalesce(lp.unit_satker_id, lp.satker_id) in (
            with recursive scope_tree as (
                select id from bdb_satker where id=${rootId}
                union
                select s.id
                from bdb_satker s
                join scope_tree t on s.parent_id=t.id
            )
            select id from scope_tree
        )`;
    }
    private async readOnlyQuery(sql: string, params: any[], timeoutMs = 12000) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            await runner.query('set transaction read only');
            await runner.query(`set local statement_timeout = '${Math.max(1000, Math.min(timeoutMs, 15000))}ms'`);
            const rows = await runner.query(sql, params);
            await runner.commitTransaction();
            return rows;
        } catch (error) {
            await runner.rollbackTransaction();
            if (String((error as any)?.code || '') === '57014') {
                throw new BadRequestException('Filter terlalu berat dan melewati batas 12 detik. Persempit periode, area, atau kata pencarian lalu klik Terapkan kembali.');
            }
            throw error;
        } finally {
            await runner.release();
        }
    }

    private summaryKey(scope: { all: boolean; satkerId: number | null }, query: any) {
        return JSON.stringify({ scope: scope.all ? 'ALL' : Number(scope.satkerId || 0), queryScope: query.scope || '', search: query.search || '', sumber: query.sumber || 'ALL', from: query.from || '', to: query.to || '', kejahatan: query.kejahatan || '', area: query.area || '', satker_id: query.satker_id || null });
    }

    private hasCommonFilter(query: any) {
        return !!(this.toText(query.search) || this.toText(query.from) || this.toText(query.to) || this.toText(query.kejahatan) || this.toText(query.area) || query.satker_id || (this.toText(query.sumber) && String(query.sumber).toUpperCase() !== 'ALL'));
    }

    private buildWhere(scope: { all: boolean; satkerId: number | null }, query: any, includeFacetFilters: boolean) {
        const params: any[] = [];
        const where: string[] = ['lp.deleted_at is null', this.scopeClause(scope, params, query)];
        const addLike = (column: string, value: any) => {
            const text = this.toText(value);
            if (!text) return;
            params.push(`%${text.toLowerCase()}%`);
            where.push(`lower(coalesce(${column},'')) like $${params.length}`);
        };
        const search = this.toText(query.search);
        if (search) {
            let cleanSearch = search.trim();
            if (cleanSearch.startsWith('KORP:')) {
                cleanSearch = cleanSearch.replace(/^KORP:/, '').replace(/_/g, ' ').trim();
            }
            const isNik = /^\d{8,16}$/.test(cleanSearch);
            if (isNik) {
                params.push(cleanSearch);
                const pExact = params.length;
                params.push(`%${cleanSearch.toLowerCase()}%`);
                const pLike = params.length;
                where.push(`(c.nik = $${pExact} or c.nik like $${pLike} or lower(coalesce(c.nama,'')) like $${pLike})`);
            } else {
                const words = cleanSearch.split(/\s+/).filter(Boolean);
                const wildcardPattern = '%' + words.join('%').toLowerCase() + '%';
                params.push(wildcardPattern);
                const p = params.length;
                where.push(`(lower(coalesce(c.nama,'')) like $${p} or lower(coalesce(c.nik,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
            }
        }
        const sumber = this.toText(query.sumber);
        if (sumber && sumber.toUpperCase() !== 'ALL') {
            params.push(sumber.toUpperCase());
            where.push(`c.sumber=$${params.length}`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const fromDate = this.toText(query.from);
        const toDate = this.toText(query.to);
        if (fromDate && toDate && datePattern.test(fromDate) && datePattern.test(toDate)) {
            const start = new Date(fromDate + 'T00:00:00Z');
            const end = new Date(toDate + 'T00:00:00Z');
            const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
            if (days < 1) throw new BadRequestException('Tanggal akhir tidak boleh sebelum tanggal awal.');


        }
        for (const [name, op] of [['from', '>='], ['to', '<=']] as const) {
            const value = this.toText(query[name]);
            if (!value) continue;
            if (!datePattern.test(value)) throw new BadRequestException(`Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`);
            params.push(value);
            where.push(`to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date ${op} $${params.length}::date`);
        }
        addLike('jk.keterangan', query.kejahatan);
        const area = this.toText(query.area);
        if (area) {
            params.push(`%${area.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(lp.satker_nama,'')) like $${p} or lower(coalesce(lp.unit_satker_nama,'')) like $${p})`);
        }
        const satkerId = Number(query.satker_id || 0);
        if (Number.isSafeInteger(satkerId) && satkerId > 0) {
            where.push(`coalesce(lp.unit_satker_id, lp.satker_id) in (
                with recursive selected_tree as (
                    select id from bdb_satker where id=${satkerId}
                    union
                    select s.id
                    from bdb_satker s
                    join selected_tree t on s.parent_id=t.id
                )
                select id from selected_tree
            )`);
        }
        if (includeFacetFilters) {
            const keterlibatan = this.toText(query.keterlibatan);
            if (keterlibatan && keterlibatan.toUpperCase() !== 'ALL') {
                params.push(keterlibatan.toUpperCase());
                where.push(`c.keterlibatan=$${params.length}`);
            }
            const status = this.toText(query.status);
            if (status && status.toUpperCase() !== 'ALL') {
                params.push(status.toUpperCase() === 'LIDIK' ? 'PENYELIDIKAN' : status.toUpperCase());
                where.push(`coalesce(sm.code,'LP')=$${params.length}`);
            }
        }
        return { params, where };
    }

    /**
     * Summary memakai jalur langsung per sumber supaya tabel LP tidak di-join dua kali.
     * Data DORS dan manual sengaja dibaca terpisah lalu dijumlahkan di aplikasi. Selain
     * lebih ringan pada jutaan baris, bentuk ini tetap mempertahankan semesta LP aktif
     * dan scope owner/unit yang sama dengan tabel register.
     */
    private buildDirectSummaryWhere(
        scope: { all: boolean; satkerId: number | null },
        query: any,
        partyAlias: 't' | 'm' | 'x',
        source: 'DORS' | 'MANUAL' | 'DOKUMEN',
        includeFacetFilters = false
    ) {
        const params: any[] = [];
        const where: string[] = ['lp.deleted_at is null', this.scopeClause(scope, params, query)];
        const selectedSource = (this.toText(query.sumber) || 'ALL').toUpperCase();
        if (selectedSource !== 'ALL' && selectedSource !== source) {
            return { params, where: ['1=0'], skip: true };
        }

        const keterlibatan = (this.toText(query.keterlibatan) || 'ALL').toUpperCase();
        const isDpoQuery = keterlibatan === 'DPO';

        if (isDpoQuery && (source === 'DORS' || source === 'MANUAL')) {
            return { params, where: ['1=0'], skip: true };
        }

        const search = this.toText(query.search);
        if (search) {
            let cleanSearch = search.trim();
            if (cleanSearch.startsWith('KORP:')) {
                cleanSearch = cleanSearch.replace(/^KORP:/, '').replace(/_/g, ' ').trim();
            }
            const isNik = /^\d{8,16}$/.test(cleanSearch);
            if (isNik) {
                params.push(cleanSearch);
                const pExact = params.length;
                params.push(`%${cleanSearch.toLowerCase()}%`);
                const pLike = params.length;
                where.push(`(${partyAlias}.nik = $${pExact} or ${partyAlias}.nik like $${pLike} or lower(coalesce(${partyAlias}.nama,'')) like $${pLike})`);
            } else {
                const words = cleanSearch.split(/\s+/).filter(Boolean);
                const wildcardPattern = '%' + words.join('%').toLowerCase() + '%';
                params.push(wildcardPattern);
                const p = params.length;
                where.push(`(lower(coalesce(${partyAlias}.nama,'')) like $${p} or lower(coalesce(${partyAlias}.nik,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
            }
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const fromDate = this.toText(query.from);
        const toDate = this.toText(query.to);
        if (fromDate && toDate && datePattern.test(fromDate) && datePattern.test(toDate)) {
            const start = new Date(fromDate + 'T00:00:00Z');
            const end = new Date(toDate + 'T00:00:00Z');
            const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
            if (days < 1) throw new BadRequestException('Tanggal akhir tidak boleh sebelum tanggal awal.');

            // Pembatasan 31 hari hanya untuk query terbuka se-Indonesia tanpa filter satker dan tanpa kata kunci NIK/nama
            const hasSearch = Boolean(this.toText(query.search));
            const satkerId = Number(query.satker_id || 0);
            const hasRegionalSatker = (Number.isSafeInteger(satkerId) && satkerId > 0) || (!scope.all && Boolean(scope.satkerId));
            const isNationalUnfiltered = !hasSearch && !hasRegionalSatker;

            if (isNationalUnfiltered && days > 31 && !isDpoQuery) {
                throw new BadRequestException('Query nasional tanpa filter NIK / satker regional dibatasi maksimal 31 hari. Silakan pilih Wilayah Satker atau masukkan kata kunci pencarian NIK/Nama.');
            }
        }
        for (const [name, op] of [['from', '>='], ['to', '<=']] as const) {
            const value = this.toText(query[name]);
            if (!value) continue;
            if (!datePattern.test(value)) throw new BadRequestException(`Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`);
            params.push(value);
            where.push(`to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date ${op} $${params.length}::date`);
        }

        const kejahatan = this.toText(query.kejahatan);
        if (kejahatan) {
            params.push(`%${kejahatan.toLowerCase()}%`);
            where.push(`lower(coalesce(jk.keterangan,'')) like $${params.length}`);
        }

        const area = this.toText(query.area);
        if (area) {
            params.push(`%${area.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(lp.satker_nama,'')) like $${p} or lower(coalesce(lp.unit_satker_nama,'')) like $${p})`);
        }

        const satkerId = Number(query.satker_id || 0);
        if (Number.isSafeInteger(satkerId) && satkerId > 0) {
            where.push(`coalesce(lp.unit_satker_id, lp.satker_id) in (
                with recursive selected_tree as (
                    select id from bdb_satker where id=${satkerId}
                    union
                    select s.id
                    from bdb_satker s
                    join selected_tree t on s.parent_id=t.id
                )
                select id from selected_tree
            )`);
        }
        if (includeFacetFilters) {
            const keterlibatan = this.toText(query.keterlibatan);
            if (keterlibatan && keterlibatan.toUpperCase() !== 'ALL') {
                params.push(keterlibatan.toUpperCase());
                where.push(`upper(coalesce(${partyAlias}.keterlibatan,'-'))=$${params.length}`);
            }
            const status = this.toText(query.status);
            if (status && status.toUpperCase() !== 'ALL') {
                params.push(status.toUpperCase() === 'LIDIK' ? 'PENYELIDIKAN' : status.toUpperCase());
                where.push(`coalesce(sm.code,'LP')=$${params.length}`);
            }
        }
        return { params, where, skip: false };
    }

    private documentPartiesCte() {
        return `document_tsk as (
                    select distinct on (
                               d.lp_id,
                               upper(trim(coalesce(item->>'nama',''))),
                               trim(coalesce(item->>'nik',''))
                           )
                           d.lp_id,
                           d.id as dokumen_id,
                           ordinality::int as urutan,
                           nullif(trim(item->>'nama'),'') as nama,
                           nullif(trim(item->>'nik'),'') as nik,
                           nullif(trim(item->>'jenis_kelamin'),'') as jenis_kelamin,
                           nullif(trim(item->>'tempat_lahir'),'') as tempat_lahir,
                           nullif(trim(item->>'tgl_lahir'),'') as tgl_lahir,
                           nullif(trim(item->>'pekerjaan'),'') as pekerjaan,
                           nullif(trim(item->>'alamat'),'') as alamat,
                           nullif(trim(item->>'no_hp'),'') as no_hp,
                           'TERSANGKA'::text as keterlibatan,
                           coalesce(nullif(trim(d.nomor_dokumen),''), nullif(trim(d.data->>'nomor_dokumen'),'')) as nomor_dokumen,
                           coalesce(d.tanggal_dokumen, nullif(trim(d.data->>'tanggal_dokumen'),'')::date) as tanggal_dokumen,
                           d.created_at
                    from bdb_dokumen d
                    join bdb_document_type_master dt on dt.id=d.document_type_id and dt.code='PENETAPAN_TSK'
                    cross join lateral jsonb_array_elements(
                        case when jsonb_typeof(d.data->'tersangka')='array'
                             then d.data->'tersangka' else '[]'::jsonb end
                    ) with ordinality as party(item, ordinality)
                    where nullif(trim(item->>'nama'),'') is not null
                    order by d.lp_id,
                             upper(trim(coalesce(item->>'nama',''))),
                             trim(coalesce(item->>'nik','')),
                             d.created_at desc,
                             d.id desc,
                             ordinality desc
                ),
                document_dpo_raw as (
                    select d.lp_id,
                           d.id as dokumen_id,
                           ordinality::int as urutan,
                           nullif(trim(item->>'nama'),'') as nama,
                           nullif(trim(item->>'nik'),'') as nik,
                           nullif(trim(item->>'jenis_kelamin'),'') as jenis_kelamin,
                           nullif(trim(item->>'tempat_lahir'),'') as tempat_lahir,
                           nullif(trim(item->>'tgl_lahir'),'') as tgl_lahir,
                           nullif(trim(item->>'pekerjaan'),'') as pekerjaan,
                           nullif(trim(item->>'alamat'),'') as alamat,
                           nullif(trim(item->>'no_hp'),'') as no_hp,
                           coalesce(nullif(trim(d.nomor_dokumen),''),nullif(trim(d.data->>'nomor_dokumen'),'')) as nomor_dokumen,
                           coalesce(d.tanggal_dokumen,nullif(trim(d.data->>'tanggal_dokumen'),'')::date) as tanggal_dokumen,
                           d.created_at
                    from bdb_dokumen d
                    join bdb_document_type_master dt on dt.id=d.document_type_id and dt.code='PENETAPAN_DPO'
                    cross join lateral jsonb_array_elements(
                        case when jsonb_typeof(d.data->'tersangka')='array'
                             then d.data->'tersangka' else '[]'::jsonb end
                    ) with ordinality as party(item,ordinality)
                    where nullif(trim(item->>'nama'),'') is not null
                ),
                document_dpo_active as (
                    select distinct on (
                               r.lp_id,
                               upper(trim(coalesce(r.nama,''))),
                               trim(coalesce(r.nik,''))
                           )
                           r.lp_id,r.dokumen_id,r.urutan,r.nama,r.nik,r.jenis_kelamin,
                           r.tempat_lahir,r.tgl_lahir,r.pekerjaan,r.alamat,r.no_hp,
                           'DPO'::text as keterlibatan,r.nomor_dokumen,r.tanggal_dokumen,r.created_at
                    from document_dpo_raw r
                    where not exists (
                        select 1
                        from bdb_dokumen c
                        join bdb_document_type_master ct on ct.id=c.document_type_id and ct.code='CABUT_DPO'
                        where c.lp_id=r.lp_id
                          and lower(regexp_replace(trim(coalesce(c.data->>'nomor_dpo','')),'\\s+','','g'))
                              = lower(regexp_replace(trim(coalesce(r.nomor_dokumen,'')),'\\s+','','g'))
                          and exists (
                              select 1
                              from jsonb_array_elements(
                                  case when jsonb_typeof(c.data->'tersangka')='array'
                                       then c.data->'tersangka' else '[]'::jsonb end
                              ) revoked_person
                              where (
                                  nullif(regexp_replace(coalesce(revoked_person->>'nik',''),'\\D','','g'),'') is not null
                                  and nullif(regexp_replace(coalesce(r.nik,''),'\\D','','g'),'') is not null
                                  and regexp_replace(coalesce(revoked_person->>'nik',''),'\\D','','g')
                                      = regexp_replace(coalesce(r.nik,''),'\\D','','g')
                              ) or upper(regexp_replace(coalesce(revoked_person->>'nama',''),'[^A-Za-z0-9]+','','g'))
                                  = upper(regexp_replace(coalesce(r.nama,''),'[^A-Za-z0-9]+','','g'))
                          )
                    )
                    order by r.lp_id,upper(trim(coalesce(r.nama,''))),trim(coalesce(r.nik,'')),r.created_at desc,r.dokumen_id desc,r.urutan desc
                ),
                document_parties as (
                    select t.* from document_tsk t
                    where not exists (
                        select 1 from document_dpo_active a
                        where a.lp_id=t.lp_id
                          and ((nullif(trim(a.nik),'') is not null and nullif(trim(t.nik),'') is not null and trim(a.nik)=trim(t.nik))
                               or upper(trim(a.nama))=upper(trim(t.nama)))
                    )
                    union all
                    select a.* from document_dpo_active a
                )`;
    }

    private summaryProjection(partyAlias: 't' | 'm' | 'x') {
        return `count(*)::int as semua,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='KORBAN')::int as korban,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='SAKSI')::int as saksi,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='PELAPOR')::int as pelapor,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='TERLAPOR')::int as terlapor,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='TERSANGKA')::int as tersangka,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='DPO')::int as dpo,
                count(*) filter (where coalesce(sm.code,'LP')='PENYELIDIKAN')::int as lidik`;
    }

    private emptySummary() {
        return { semua: 0, lidik: 0, korban: 0, saksi: 0, pelapor: 0, terlapor: 0, tersangka: 0, dpo: 0 };
    }

    private mergeSummary(target: any, source: any) {
        for (const key of Object.keys(target)) target[key] += Number(source?.[key] || 0);
        return target;
    }

    async refreshAllTimeSnapshot() {
        try {
            this.logger.log('Refreshing All-Time Ranking Snapshot with full roles and kasta ordering...');
            const categories = ['ALL', 'TERSANGKA', 'TERLAPOR', 'PELAPOR', 'SAKSI', 'KORBAN', 'DPO'];

            for (const cat of categories) {
                await this.dataSource.query(`DELETE FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 0 AND kategori_filter = '${cat}';`);

                let roleFilter = '';
                if (cat === 'TERLAPOR') roleFilter = "AND keterlibatan = 'TERLAPOR'";
                else if (cat === 'PELAPOR') roleFilter = "AND keterlibatan = 'PELAPOR'";
                else if (cat === 'SAKSI') roleFilter = "AND keterlibatan = 'SAKSI'";
                else if (cat === 'KORBAN') roleFilter = "AND keterlibatan = 'KORBAN'";
                else if (cat === 'DPO') roleFilter = "AND keterlibatan = 'DPO'";
                else if (cat === 'TERSANGKA') roleFilter = "AND keterlibatan = 'TERSANGKA'";

                const lim = (cat === 'ALL') ? 100 : 50;

                await this.dataSource.query(`
                    INSERT INTO bdb_pihak_terlibat_ranking_snapshot (
                        tahun, bulan, satker_id, keterlibatan, kategori_filter, nama, nik, total_lp,
                        satker_tier, satker_nama_tertinggi, last_seen, refreshed_at,
                        count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                        jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                        tipe_subjek, tipe_identitas
                    )
                    WITH raw_dors AS (
                        SELECT 
                            lp.id as lp_id,
                            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                            case 
                                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                                when d.id_polda is not null then d.id_polda
                                else '060.01.00'
                            end as wilayah_kode,
                            upper(trim(t.nama)) as nama,
                            trim(t.nik) as nik,
                            upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
                            d.synced_at as seen_at,
                            CASE 
                                WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                                ELSE 4
                            END as satker_tier,
                            coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                            (upper(coalesce(t.status_korban,'')) = 'MD' OR upper(coalesce(t.keterlibatan,'')) LIKE '%MD%' OR upper(coalesce(t.keterlibatan,'')) LIKE '%MENINGGAL%') as is_md,
                            case 
                                when t.tgl_lahir ~ '^[0-9]{2}-[0-9]{2}-[12][0-9]{3}$' then 2026 - substring(t.tgl_lahir from 7 for 4)::int
                                when t.nik ~ '^[1-9][0-9]{15}$' and substring(t.nik from 11 for 2)::int <= 26 then 2026 - (2000 + substring(t.nik from 11 for 2)::int)
                                when t.nik ~ '^[1-9][0-9]{15}$' and substring(t.nik from 11 for 2)::int > 26 then 2026 - (1900 + substring(t.nik from 11 for 2)::int)
                                else null
                            end as umur
                        FROM bdb_laporan_polisi lp
                        JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                        JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                        WHERE lp.deleted_at IS NULL
                          AND t.nik IS NOT NULL AND trim(t.nik) ~ '^[1-9][0-9]{15}$'
                          AND t.nama IS NOT NULL AND length(trim(t.nama)) > 2
                          AND upper(trim(t.nama)) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                          AND NOT (
                              upper(coalesce(t.keterlibatan, '')) IN ('PELAPOR', 'SAKSI')
                              AND (
                                  lp.model_lp = 'lp_model_a' 
                                  OR d.model_lp = 'lp_model_a' 
                                  OR t.model_lp = 'lp_model_a'
                                  OR upper(coalesce(t.pekerjaan, '')) LIKE '%POLRI%'
                                  OR upper(coalesce(t.pekerjaan, '')) LIKE '%POLISI%'
                                  OR upper(coalesce(t.pekerjaan, '')) LIKE '%KEPOLISIAN%'
                              )
                          )
                    ),
                    raw_tsk AS (
                        SELECT 
                            d.lp_id,
                            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                            case 
                                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                                else '060.01.00'
                            end as wilayah_kode,
                            upper(trim(item->>'nama')) as nama,
                            trim(item->>'nik') as nik,
                            'TERSANGKA'::text as keterlibatan,
                            d.created_at as seen_at,
                            CASE 
                                WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                                ELSE 4
                            END as satker_tier,
                            coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                            false as is_md,
                            case 
                                when item->>'tgl_lahir' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then 2026 - substring(item->>'tgl_lahir' from 1 for 4)::int
                                when item->>'tgl_lahir' ~ '^[0-9]{2}-[0-9]{2}-[12][0-9]{3}$' then 2026 - substring(item->>'tgl_lahir' from 7 for 4)::int
                                when trim(item->>'nik') ~ '^[1-9][0-9]{15}$' and substring(trim(item->>'nik') from 11 for 2)::int <= 26 then 2026 - (2000 + substring(trim(item->>'nik') from 11 for 2)::int)
                                when trim(item->>'nik') ~ '^[1-9][0-9]{15}$' and substring(trim(item->>'nik') from 11 for 2)::int > 26 then 2026 - (1900 + substring(trim(item->>'nik') from 11 for 2)::int)
                                else null
                            end as umur
                        FROM bdb_dokumen d
                        JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                        LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                        CROSS JOIN LATERAL jsonb_array_elements(
                            CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
                        ) party(item)
                        WHERE item->>'nama' IS NOT NULL 
                          AND length(trim(item->>'nama')) > 2
                          AND trim(item->>'nik') ~ '^[1-9][0-9]{15}$'
                          AND upper(trim(item->>'nama')) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                    ),
                    unioned AS (
                        SELECT * FROM raw_dors
                        UNION ALL
                        SELECT * FROM raw_tsk
                    ),
                    filtered AS (
                        SELECT * FROM unioned
                        WHERE is_md = false AND (umur IS NULL OR (umur >= 0 AND umur <= 75))
                    ),
                    person_agg AS (
                        SELECT 
                            nik,
                            max(nama) as nama,
                            count(distinct lp_id)::int as total_lp,
                            count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
                            count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
                            count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
                            count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
                            count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
                            count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
                            count(distinct satker_id)::int as jumlah_satker_unik,
                            count(distinct wilayah_kode)::int as jumlah_polda_unik,
                            min(satker_tier)::int as satker_tier,
                            (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                            (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                            string_agg(distinct satker_nama, ', ') as daftar_satker,
                            max(seen_at) as last_seen,
                            (
                                (case 
                                    when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                        then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                    when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                        then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                    when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                        then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                    when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                        then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                    when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                        then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                    when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                        then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                    else 0 
                                end)
                                + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                                + (count(distinct satker_id) * 300)
                                + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                                + (count(distinct lp_id) * 50)
                            )::int as nasional_score
                        FROM filtered
                        WHERE 1=1 ${roleFilter}
                        GROUP BY nik
                        HAVING count(distinct lp_id) > 1
                    )
                    SELECT 
                        0 as tahun,
                        NULL::int as bulan,
                        NULL::bigint as satker_id,
                        '${cat}' as keterlibatan,
                        '${cat}' as kategori_filter,
                        nama, nik, total_lp,
                        satker_tier, satker_nama_tertinggi, last_seen, NOW() as refreshed_at,
                        count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                        jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                        'PERORANGAN' as tipe_subjek,
                        'NIK' as tipe_identitas
                    FROM person_agg
                    ORDER BY 
                        (CASE 
                            WHEN '${cat}' = 'ALL' THEN (
                                CASE 
                                    WHEN count_dpo > 0 THEN 1
                                    WHEN count_tersangka > 0 THEN 2
                                    WHEN count_terlapor > 0 THEN 3
                                    WHEN count_saksi > 0 THEN 4
                                    WHEN count_korban > 0 THEN 5
                                    WHEN count_pelapor > 0 THEN 6
                                    ELSE 7
                                END
                            )
                            ELSE 1
                        END) ASC,
                        (CASE 
                            WHEN '${cat}' = 'TERSANGKA' THEN count_tersangka
                            WHEN '${cat}' = 'TERLAPOR' THEN count_terlapor
                            WHEN '${cat}' = 'PELAPOR' THEN count_pelapor
                            WHEN '${cat}' = 'SAKSI' THEN count_saksi
                            WHEN '${cat}' = 'KORBAN' THEN count_korban
                            WHEN '${cat}' = 'DPO' THEN count_dpo
                            ELSE 0
                        END) DESC,
                        satker_tier ASC,
                        jumlah_satker_unik DESC,
                        total_lp DESC,
                        last_seen DESC
                    LIMIT ${lim};
                `);
            }

            // Corporate All-Time Ranking
            await this.dataSource.query(`DELETE FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 0 AND tipe_subjek = 'KORPORASI';`);
            await this.dataSource.query(`
                WITH raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,
                        'KORP:' || rtrim(regexp_replace(regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1_'), '[^A-Z0-9]+', '_', 'g'), '_+', '_', 'g'), '_') as synth_nik,
                        upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
                        d.synced_at as seen_at,
                        CASE 
                            WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                            ELSE 4
                        END as satker_tier,
                        coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama
                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'
                        OR upper(coalesce(t.jenis_identitas,'')) = 'BADAN HUKUM'
                      )
                      AND length(trim(t.nama)) > 2
                      AND upper(trim(t.nama)) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                ),
                corp_agg AS (
                    SELECT 
                        synth_nik as nik,
                        max(norm_nama) as nama,
                        count(distinct lp_id)::int as total_lp,
                        count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
                        count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
                        count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
                        count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
                        count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
                        count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
                        count(distinct satker_id)::int as jumlah_satker_unik,
                        count(distinct wilayah_kode)::int as jumlah_polda_unik,
                        min(satker_tier)::int as satker_tier,
                        (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                        (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                        string_agg(distinct satker_nama, ', ') as daftar_satker,
                        max(seen_at) as last_seen,
                        (
                            (case 
                                when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                    then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                    then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                    then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                    then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                    then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                    then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                else 0 
                            end)
                            + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                            + (count(distinct satker_id) * 300)
                            + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                            + (count(distinct lp_id) * 50)
                        )::int as nasional_score
                    FROM raw_corp
                    GROUP BY synth_nik
                    HAVING count(distinct lp_id) > 1
                ),
                multi_corp AS (
                    SELECT c.*, 'ALL' as kategori_filter, 'ALL' as keterlibatan FROM corp_agg c
                    UNION ALL
                    SELECT c.*, 'TERSANGKA' as kategori_filter, 'TERSANGKA' as keterlibatan FROM corp_agg c WHERE count_tersangka > 0
                    UNION ALL
                    SELECT c.*, 'TERLAPOR' as kategori_filter, 'TERLAPOR' as keterlibatan FROM corp_agg c WHERE count_terlapor > 0
                    UNION ALL
                    SELECT c.*, 'PELAPOR' as kategori_filter, 'PELAPOR' as keterlibatan FROM corp_agg c WHERE count_pelapor > 0
                    UNION ALL
                    SELECT c.*, 'SAKSI' as kategori_filter, 'SAKSI' as keterlibatan FROM corp_agg c WHERE count_saksi > 0
                    UNION ALL
                    SELECT c.*, 'KORBAN' as kategori_filter, 'KORBAN' as keterlibatan FROM corp_agg c WHERE count_korban > 0
                    UNION ALL
                    SELECT c.*, 'DPO' as kategori_filter, 'DPO' as keterlibatan FROM corp_agg c WHERE count_dpo > 0
                )
                INSERT INTO bdb_pihak_terlibat_ranking_snapshot (
                    tahun, bulan, satker_id, keterlibatan, kategori_filter, nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    tipe_subjek, tipe_identitas
                )
                SELECT 
                    0 as tahun,
                    NULL::int as bulan,
                    NULL::bigint as satker_id,
                    keterlibatan,
                    kategori_filter,
                    nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, NOW() as refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    'KORPORASI' as tipe_subjek,
                    'BADAN HUKUM' as tipe_identitas
                FROM multi_corp
                ON CONFLICT (tahun, COALESCE(bulan, 0), kategori_filter, nik) DO NOTHING;

                UPDATE bdb_pihak_terlibat_ranking_snapshot
                SET
                    total_lp = GREATEST(total_lp, count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor),
                    kasta = CASE
                        WHEN kategori_filter != 'ALL' THEN kategori_filter
                        WHEN count_dpo > 0 THEN 'DPO'
                        WHEN count_tersangka > 0 THEN 'TERSANGKA'
                        WHEN (coalesce(tipe_subjek, '') = 'KORPORASI' AND count_korban > count_terlapor * 2)
                             OR (count_korban >= count_terlapor * 4 AND count_korban >= count_saksi AND count_korban > 0) THEN 'KORBAN'
                        WHEN count_terlapor > 0 THEN 'TERLAPOR'
                        WHEN count_saksi > 0 THEN 'SAKSI'
                        WHEN count_korban > 0 THEN 'KORBAN'
                        ELSE 'PELAPOR'
                    END
                WHERE tahun = 0;
            `);
            this.rankingCache.clear();
            this.logger.log('All-Time Ranking Snapshot refreshed successfully.');
        } catch (e: any) {
            this.logger.error('Error refreshing all-time ranking snapshot: ' + e?.message);
        }
    }

    
    async refreshSummarySnapshot() {
        this.logger.log('Memperbarui bdb_pihak_terlibat_summary_snapshot...');
        await this.dataSource.query(`
            WITH t_agg AS (
                SELECT 
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) as tanggal,
                    count(*)::int as semua,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='KORBAN')::int as korban,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='SAKSI')::int as saksi,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='PELAPOR')::int as pelapor,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='TERLAPOR')::int as terlapor,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='TERSANGKA')::int as tersangka,
                    count(*) filter (where upper(coalesce(t.keterlibatan,'-'))='DPO')::int as dpo,
                    count(*) filter (where coalesce(sm.code,'LP')='PENYELIDIKAN')::int as lidik
                FROM bdb_laporan_polisi lp
                JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id AND t.nama IS NOT NULL
                LEFT JOIN bdb_status_master sm ON sm.id = lp.status_id
                WHERE lp.deleted_at IS NULL
                  AND coalesce(lp.dilimpahkan_eksternal, false) = false
                  AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) >= '2026-01-01'::date
                GROUP BY 1, 2
            )
            INSERT INTO bdb_pihak_terlibat_summary_snapshot 
                (satker_id, tanggal, semua, korban, saksi, pelapor, terlapor, tersangka, dpo, lidik, refreshed_at)
            SELECT satker_id, tanggal, semua, korban, saksi, pelapor, terlapor, tersangka, dpo, lidik, now()
            FROM t_agg
            WHERE satker_id IS NOT NULL AND tanggal IS NOT NULL
            ON CONFLICT (satker_id, tanggal)
            DO UPDATE SET 
                semua = EXCLUDED.semua,
                korban = EXCLUDED.korban,
                saksi = EXCLUDED.saksi,
                pelapor = EXCLUDED.pelapor,
                terlapor = EXCLUDED.terlapor,
                tersangka = EXCLUDED.tersangka,
                dpo = EXCLUDED.dpo,
                lidik = EXCLUDED.lidik,
                refreshed_at = now();

            WITH tsk_agg AS (
                SELECT 
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end) as tanggal,
                    count(*)::int as tsk_count
                FROM bdb_dokumen d
                JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id AND lp.deleted_at IS NULL
                CROSS JOIN LATERAL jsonb_array_elements(
                    case when jsonb_typeof(d.data->'tersangka')='array' then d.data->'tersangka' else '[]'::jsonb end
                ) with ordinality as party(item, ordinality)
                WHERE nullif(trim(party.item->>'nama'),'') is not null
                GROUP BY 1, 2
            )
            INSERT INTO bdb_pihak_terlibat_summary_snapshot 
                (satker_id, tanggal, semua, korban, saksi, pelapor, terlapor, tersangka, dpo, lidik, refreshed_at)
            SELECT satker_id, tanggal, tsk_count, 0, 0, 0, 0, tsk_count, 0, 0, now()
            FROM tsk_agg
            WHERE satker_id IS NOT NULL AND tanggal IS NOT NULL
            ON CONFLICT (satker_id, tanggal)
            DO UPDATE SET
                tersangka = EXCLUDED.tersangka,
                semua = bdb_pihak_terlibat_summary_snapshot.korban + bdb_pihak_terlibat_summary_snapshot.saksi + bdb_pihak_terlibat_summary_snapshot.pelapor + bdb_pihak_terlibat_summary_snapshot.terlapor + EXCLUDED.tersangka + bdb_pihak_terlibat_summary_snapshot.dpo,
                refreshed_at = now();
        `);
        this.logger.log('bdb_pihak_terlibat_summary_snapshot selesai diperbarui.');
    }

    async refreshSnapshot() {
        this.logger.log('Memperbarui bdb_pihak_terlibat_ranking_snapshot (All-Time + 13 Partisi 2026)...');
        try { await this.refreshSummarySnapshot(); } catch (e) { this.logger.error('refreshSummarySnapshot error: ' + e?.message); }
        await this.refreshAllTimeSnapshot();
        await this.refreshRankingSnapshot(null);
        for (let m = 1; m <= 12; m++) {
            await this.refreshRankingSnapshot(m);
        }
        this.summaryCache.clear();
        this.rankingCache.clear();
        this.logger.log('bdb_pihak_terlibat snapshot selesai diperbarui (All-Time + 13 Partisi 2026).');
    }

    private async globalSummary(authUser: any, query: any) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const cacheable = scope.all && !this.hasCommonFilter(query);
        const key = this.summaryKey(scope, query);
        const cached = this.summaryCache.get(key);
        if (cached && cached.expiresAt > Date.now()) return { ...cached.data, cached: true };

        const isEligibleForSnapshot = !query.search &&
            !query.kejahatan &&
            !query.area &&
            (!query.sumber || query.sumber === 'ALL');

        if (isEligibleForSnapshot) {
            try {
                const sParams: any[] = [];
                const sWhere: string[] = ['1=1'];
                if (query.from) {
                    sParams.push(query.from);
                    sWhere.push('tanggal >= $' + sParams.length + '::date');
                }
                if (query.to) {
                    sParams.push(query.to);
                    sWhere.push('tanggal <= $' + sParams.length + '::date');
                }
                const isNational = query?.scope === 'national';
                const satkerId = Number(query?.satker_id || 0);
                const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;

                if (hasExplicitSatker) {
                    sWhere.push(`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = ${satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )`);
                } else if (!isNational && !scope.all && scope.satkerId) {
                    sWhere.push(`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = ${scope.satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )`);
                }
                const snapRows = await this.dataSource.query(`
                    select
                        coalesce(sum(semua), 0)::int as semua,
                        coalesce(sum(korban), 0)::int as korban,
                        coalesce(sum(saksi), 0)::int as saksi,
                        coalesce(sum(pelapor), 0)::int as pelapor,
                        coalesce(sum(terlapor), 0)::int as terlapor,
                        coalesce(sum(tersangka), 0)::int as tersangka,
                        coalesce(sum(dpo), 0)::int as dpo,
                        coalesce(sum(lidik), 0)::int as lidik
                    from bdb_pihak_terlibat_summary_snapshot
                    where ${sWhere.join(' and ')}
                `, sParams);
                if (snapRows && snapRows.length > 0) {
                    const s = snapRows[0];
                    let activeDpoCount = Number(s.dpo || 0);
                    activeDpoCount = await this.countActiveDpo(scope, query);
                    const summary = {
                        semua: Number(s.semua || 0) + (activeDpoCount - Number(s.dpo || 0)),
                        lidik: Number(s.lidik || 0),
                        korban: Number(s.korban || 0),
                        saksi: Number(s.saksi || 0),
                        pelapor: Number(s.pelapor || 0),
                        terlapor: Number(s.terlapor || 0),
                        tersangka: Number(s.tersangka || 0),
                        dpo: activeDpoCount,
                    };
                    const result = { summary, mode: 'snapshot-table-fast', cached: false };
                    this.summaryCache.set(key, { expiresAt: Date.now() + 300000, data: result });
                    return result;
                }
            } catch (err: any) {
                console.error('[PihakTerlibatService] Snapshot fast summary fallback to live query:', err);
            }
        }
        const summary = this.emptySummary();
        const summaryTasks: Promise<any>[] = [];

        const dorsWhere = this.buildDirectSummaryWhere(scope, query, 't', 'DORS');
        if (!dorsWhere.skip) {
            summaryTasks.push(this.readOnlyQuery(
                `select ${this.summaryProjection('t')}
                 from bdb_laporan_polisi lp
                 join bdb_dors_lp d on d.dors_lp_id=lp.dors_lp_id and d.model_lp=lp.model_lp
                 join bdb_dors_lp_terlibat t on t.lp_id=d.id and t.nama is not null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${dorsWhere.where.join(' and ')}`,
                dorsWhere.params,
                12000
            ));
        }

        const manualWhere = this.buildDirectSummaryWhere(scope, query, 'm', 'MANUAL');
        if (!manualWhere.skip) {
            summaryTasks.push(this.readOnlyQuery(
                `select ${this.summaryProjection('m')}
                 from bdb_laporan_polisi lp
                 join bdb_lp_pihak_manual m on m.lp_id=lp.id and m.deleted_at is null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${manualWhere.where.join(' and ')}`,
                manualWhere.params,
                12000
            ));
        }

        const documentWhere = this.buildDirectSummaryWhere(scope, query, 'x', 'DOKUMEN');
        if (!documentWhere.skip) {
            summaryTasks.push(this.readOnlyQuery(
                `with ${this.documentPartiesCte()}
                 select ${this.summaryProjection('x')}
                 from bdb_laporan_polisi lp
                 join document_parties x on x.lp_id=lp.id
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${documentWhere.where.join(' and ')}`,
                documentWhere.params,
                12000
            ));
        }
        const summaryRows = await Promise.allSettled(summaryTasks);
        for (const res of summaryRows) {
            if (res.status === 'fulfilled' && res.value && res.value[0]) {
                this.mergeSummary(summary, res.value[0]);
            }
        }
        summary.dpo = await this.countActiveDpo(scope, query);
        summary.semua = Number(summary.semua || 0) + summary.dpo;
        const result = { summary, mode: cacheable ? 'exact-active-lp-cache-5m' : 'exact-active-lp-filtered', cached: false };
        if (cacheable) this.summaryCache.set(key, { expiresAt: Date.now() + 300000, data: result });
        return result;
    }

    private async recentGlobal(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const fetch = offset + limit + 1;
        const dorsPromise = this.dataSource.query(
            `select 'DORS' as sumber, t.id::text as row_id, lp.id as lp_id, t.nama, t.nik,
                    upper(coalesce(t.keterlibatan,'-')) as keterlibatan,
                    null::text as nomor_dokumen, null::date as tanggal_dokumen, null::date as bap_tanggal,
                    null::text as keterangan, false as has_lampiran, d.synced_at as created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, lp.unit_satker_nama, jk.keterangan as kejahatan
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id=t.lp_id
             join bdb_laporan_polisi lp on lp.dors_lp_id=d.dors_lp_id and lp.model_lp=d.model_lp and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             where t.nama is not null
             order by t.id desc
             limit $1`,
            [fetch]
        );
        const manualPromise = this.dataSource.query(
            `select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id, m.nama, m.nik,
                    upper(m.keterlibatan) as keterlibatan, m.nomor_dokumen, m.tanggal_dokumen, m.bap_tanggal,
                    m.keterangan, (m.lampiran_object_key is not null) as has_lampiran, m.created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, lp.unit_satker_nama, jk.keterangan as kejahatan
             from bdb_lp_pihak_manual m
             join bdb_laporan_polisi lp on lp.id=m.lp_id and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             where m.deleted_at is null
             order by m.id desc
             limit $1`,
            [fetch]
        );
        const documentPromise = this.dataSource.query(
            `with ${this.documentPartiesCte()}
             select 'DOKUMEN' as sumber,
                    (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                    lp.id as lp_id,x.nama,x.nik,x.keterlibatan,x.nomor_dokumen,x.tanggal_dokumen,
                    null::date as bap_tanggal,case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                    false as has_lampiran,x.created_at,
                    lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,lp.unit_satker_nama,jk.keterangan as kejahatan
             from document_parties x
             join bdb_laporan_polisi lp on lp.id=x.lp_id and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             order by x.created_at desc,x.dokumen_id desc,x.urutan desc
             limit $1`,
            [fetch]
        );
        const dpoPromise = this.dataSource.query(
            `select 'DPO' as sumber,
                    d.id as id,
                    d.id as dpo_id,
                    ('dpo:' || d.id::text) as row_id,
                    d.lp_id,
                    d.nama_dpo as nama,
                    d.nomor_identitas as nik,
                    'DPO'::text as keterlibatan,
                    d.nomor_dpo as nomor_dokumen,
                    d.tanggal_dpo as tanggal_dokumen,
                    null::date as bap_tanggal,
                    coalesce(d.nama_kejahatan, d.kategori_kejahatan, 'DPO Aktif')::text as keterangan,
                    (d.scan_dokumen_url is not null and trim(d.scan_dokumen_url) != '') as has_lampiran,
                    coalesce(d.scan_dokumen_url, d.foto_dpo_url) as scan_dokumen_url,
                    coalesce(d.scan_dokumen_url, d.foto_dpo_url) as lampiran_url,
                    d.foto_dpo_url,
                    d.created_at,
                    coalesce(lp.no_laporan, d.nomor_lp, '-') as no_laporan,
                    d.satker_id,
                    coalesce(d.satker_nama, lp.satker_nama, d.nama_polda, 'POLRI') as satker_nama,
                    null::text as unit_nama,
                    null::text as unit_satker_nama,
                    coalesce(d.nama_kejahatan, d.kategori_kejahatan, '-') as kejahatan
             from bdb_dpo d
             left join bdb_laporan_polisi lp on lp.id = d.lp_id and lp.deleted_at is null
             where d.status_dpo = 'AKTIF'
             order by d.created_at desc, d.id desc
             limit $1`,
            [fetch]
        );
        const [dors, manual, document, dpoRows] = await Promise.all([dorsPromise, manualPromise, documentPromise, dpoPromise]);
        const merged = [...dors, ...manual, ...document, ...dpoRows].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        const pageRows = merged.slice(offset, offset + limit + 1);
        const hasNext = pageRows.length > limit;
        return { data: pageRows.slice(0, limit), meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'recent-key-tail' } };
    }

    async list(authUser: any, query: any = {}) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        if (String(query.summary_only || '') === '1') {
            const result = await this.globalSummary(authUser, query);
            return { data: [], meta: result };
        }
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 25), 100));
        const isDefaultGlobal = (scope.all || query.scope === 'national') && !this.hasCommonFilter(query) && (!query.keterlibatan || String(query.keterlibatan).toUpperCase() === 'ALL') && (!query.status || String(query.status).toUpperCase() === 'ALL');
        if (isDefaultGlobal) return this.recentGlobal(page, limit);

        const fetch = page * limit + 1;
        const rows: any[] = [];
        const branchTasks: Promise<any>[] = [];

        const dorsWhere = this.buildDirectSummaryWhere(scope, query, 't', 'DORS', true);
        if (!dorsWhere.skip) {
            branchTasks.push(this.readOnlyQuery(
                `select 'DORS' as sumber,t.id::text as row_id,lp.id as lp_id,t.nama,t.nik,
                        upper(coalesce(t.keterlibatan,'-')) as keterlibatan,
                        null::text as nomor_dokumen,null::date as tanggal_dokumen,null::date as bap_tanggal,
                        null::text as keterangan,false as has_lampiran,d.synced_at as created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,lp.unit_satker_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join bdb_dors_lp d on d.dors_lp_id=lp.dors_lp_id and d.model_lp=lp.model_lp
                 join bdb_dors_lp_terlibat t on t.lp_id=d.id and t.nama is not null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${dorsWhere.where.join(' and ')}
                 order by d.synced_at desc,t.id desc limit $${dorsWhere.params.length + 1}`,
                [...dorsWhere.params, fetch],
                12000
            ));
        }

        const manualWhere = this.buildDirectSummaryWhere(scope, query, 'm', 'MANUAL', true);
        if (!manualWhere.skip) {
            branchTasks.push(this.readOnlyQuery(
                `select 'MANUAL' as sumber,m.id::text as row_id,m.lp_id,m.nama,m.nik,
                        upper(m.keterlibatan) as keterlibatan,m.nomor_dokumen,m.tanggal_dokumen,m.bap_tanggal,
                        m.keterangan,(m.lampiran_object_key is not null) as has_lampiran,m.created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,lp.unit_satker_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join bdb_lp_pihak_manual m on m.lp_id=lp.id and m.deleted_at is null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${manualWhere.where.join(' and ')}
                 order by m.created_at desc,m.id desc limit $${manualWhere.params.length + 1}`,
                [...manualWhere.params, fetch],
                12000
            ));
        }

        const documentWhere = this.buildDirectSummaryWhere(scope, query, 'x', 'DOKUMEN', true);
        if (!documentWhere.skip) {
            branchTasks.push(this.readOnlyQuery(
                `with ${this.documentPartiesCte()}
                 select 'DOKUMEN' as sumber,
                        (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                        lp.id as lp_id,x.nama,x.nik,x.keterlibatan,x.nomor_dokumen,x.tanggal_dokumen,
                        null::date as bap_tanggal,case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                        false as has_lampiran,x.created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,lp.unit_satker_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join document_parties x on x.lp_id=lp.id
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${documentWhere.where.join(' and ')}
                 order by x.created_at desc,x.dokumen_id desc,x.urutan desc
                 limit $${documentWhere.params.length + 1}`,
                [...documentWhere.params, fetch],
                12000
            ));
        }

        const isDpoRequest = !query.keterlibatan || String(query.keterlibatan).toUpperCase() === 'ALL' || String(query.keterlibatan).toUpperCase() === 'DPO';
        if (isDpoRequest) {
            const dpoParams: any[] = [];
            const dpoWhereList: string[] = ["d.status_dpo = 'AKTIF'"];
            
            const isNational = query?.scope === 'national';
            const satkerId = Number(query?.satker_id || 0);
            const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;
            if (hasExplicitSatker) {
                dpoWhereList.push(`d.satker_id in (
                    with recursive st as (
                        select id from bdb_satker where id = ${satkerId}
                        union all
                        select s.id from bdb_satker s join st on s.parent_id = st.id
                    ) select id from st
                )`);
            } else if (!isNational && !scope.all && scope.satkerId) {
                dpoWhereList.push(`d.satker_id in (
                    with recursive st as (
                        select id from bdb_satker where id = ${scope.satkerId}
                        union all
                        select s.id from bdb_satker s join st on s.parent_id = st.id
                    ) select id from st
                )`);
            }

            if (query.from) {
                dpoParams.push(query.from);
                const p = dpoParams.length;
                dpoWhereList.push(`(d.tanggal_dpo >= $${p}::date or (d.tanggal_dpo is null and d.created_at >= $${p}::date))`);
            }
            if (query.to) {
                dpoParams.push(query.to);
                const p = dpoParams.length;
                dpoWhereList.push(`(d.tanggal_dpo <= $${p}::date or (d.tanggal_dpo is null and d.created_at <= $${p}::date))`);
            }
            if (query.kejahatan) {
                dpoParams.push(`%${String(query.kejahatan).trim().toLowerCase()}%`);
                const p = dpoParams.length;
                dpoWhereList.push(`(lower(coalesce(d.nama_kejahatan,'')) like $${p} or lower(coalesce(d.kategori_kejahatan,'')) like $${p})`);
            }
            if (query.search) {
                dpoParams.push(`%${String(query.search).trim().toLowerCase()}%`);
                const p = dpoParams.length;
                dpoWhereList.push(`(lower(d.nama_dpo) like $${p} or lower(coalesce(d.nomor_identitas,'')) like $${p} or lower(d.nomor_dpo) like $${p})`);
            }

            branchTasks.push(this.readOnlyQuery(
                `select 'DPO' as sumber,
                    d.id as id,
                    d.id as dpo_id,
                    ('dpo:' || d.id::text) as row_id,
                        d.lp_id,
                        d.nama_dpo as nama,
                        d.nomor_identitas as nik,
                        'DPO'::text as keterlibatan,
                        d.nomor_dpo as nomor_dokumen,
                        d.tanggal_dpo as tanggal_dokumen,
                        null::date as bap_tanggal,
                        coalesce(d.nama_kejahatan, d.kategori_kejahatan, 'DPO Aktif')::text as keterangan,
                        (d.scan_dokumen_url is not null and trim(d.scan_dokumen_url) != '') as has_lampiran,
                        coalesce(d.scan_dokumen_url, d.foto_dpo_url) as scan_dokumen_url,
                        coalesce(d.scan_dokumen_url, d.foto_dpo_url) as lampiran_url,
                        d.foto_dpo_url,
                        d.created_at,
                        coalesce(lp.no_laporan, d.nomor_lp, '-') as no_laporan,
                        d.satker_id,
                        coalesce(d.satker_nama, lp.satker_nama, d.nama_polda, 'POLRI') as satker_nama,
                        null::text as unit_nama,
                        null::text as unit_satker_nama,
                        coalesce(d.nama_kejahatan, d.kategori_kejahatan, '-') as kejahatan
                 from bdb_dpo d
                 left join bdb_laporan_polisi lp on lp.id = d.lp_id and lp.deleted_at is null
                 where ${dpoWhereList.join(' and ')}
                 order by d.created_at desc, d.id desc
                 limit $${dpoParams.length + 1}`,
                [...dpoParams, fetch],
                12000
            ));
        }

        const branchRows = await Promise.allSettled(branchTasks);
        for (const res of branchRows) {
            if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                rows.push(...res.value);
            }
        }

        rows.sort((a: any, b: any) => {
            const time = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            if (time) return time;
            return Number(b.row_id || 0) - Number(a.row_id || 0);
        });
        const offset = (page - 1) * limit;
        const pageRows = rows.slice(offset, offset + limit + 1);
        const hasNext = pageRows.length > limit;
        return { data: pageRows.slice(0, limit), meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'filtered-direct-branch-timeout-12s' } };
    }

        async getLaporanByNik(authUser: any, rawNik: string, query: any = {}) {
        const nik = String(rawNik || '').trim();
        if (!nik) return { status: 1, data: [], meta: { total_all: 0, total_period: 0 } };

        const fromStr = String(query?.from || query?.date_from || '').trim();
        const toStr = String(query?.to || query?.date_to || '').trim();
        const isCorp = nik.startsWith('KORP:');
        const corpTerm = isCorp ? nik.replace(/^KORP:/, '').replace(/_/g, ' ').trim() : '';
        const cleanTerm = corpTerm.replace(/[^A-Za-z0-9]/g, '');

        const sql = isCorp ? `
            WITH ${this.documentPartiesCte()},
            all_parties AS (
                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as peran,
                    'DORS' as sumber
                FROM bdb_dors_lp_terlibat t
                JOIN bdb_dors_lp d ON d.id = t.lp_id
                LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE (
                    regexp_replace(upper(trim(t.nama)), '[^A-Z0-9]+', '', 'g') = $1
                    OR upper(trim(t.nama)) ILIKE ('%' || $2 || '%')
                )

                UNION ALL

                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, lp.created_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, lp.created_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(x.keterlibatan, 'PIHAK'))) as peran,
                    'DOKUMEN' as sumber
                FROM document_parties x
                JOIN bdb_laporan_polisi lp ON lp.id = x.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE (
                    regexp_replace(upper(trim(x.nama)), '[^A-Z0-9]+', '', 'g') = $1
                    OR upper(trim(x.nama)) ILIKE ('%' || $2 || '%')
                )

                UNION ALL

                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, lp.created_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, lp.created_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(m.keterlibatan, 'PIHAK'))) as peran,
                    'MANUAL' as sumber
                FROM bdb_lp_pihak_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE m.deleted_at is null AND (
                    regexp_replace(upper(trim(m.nama)), '[^A-Z0-9]+', '', 'g') = $1
                    OR upper(trim(m.nama)) ILIKE ('%' || $2 || '%')
                )
            )
            SELECT *,
                CASE 
                    WHEN peran = 'DPO' THEN 1
                    WHEN peran = 'TERSANGKA' THEN 2
                    WHEN peran = 'TERLAPOR' THEN 3
                    WHEN peran = 'KORBAN' THEN 4
                    WHEN peran = 'PELAPOR' THEN 5
                    WHEN peran = 'SAKSI' THEN 6
                    ELSE 7
                END as kasta_rank
            FROM all_parties
            ORDER BY kasta_rank ASC, tgl_date DESC;
        ` : `
            WITH ${this.documentPartiesCte()},
            all_parties AS (
                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as peran,
                    'DORS' as sumber
                FROM bdb_dors_lp_terlibat t
                JOIN bdb_dors_lp d ON d.id = t.lp_id
                LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE t.nik = $1

                UNION ALL

                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, lp.created_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, lp.created_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(x.keterlibatan, 'PIHAK'))) as peran,
                    'DOKUMEN' as sumber
                FROM document_parties x
                JOIN bdb_laporan_polisi lp ON lp.id = x.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE x.nik = $1

                UNION ALL

                SELECT 
                    lp.id as lp_id,
                    coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
                        else to_char(coalesce(d.synced_at, lp.synced_at, lp.created_at, now()), 'DD-MM-YYYY')
                    end as tgl_laporan,
                    case 
                        when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
                        else coalesce(d.synced_at, lp.synced_at, lp.created_at, now())::date
                    end as tgl_date,
                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
                    coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
                    coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(m.keterlibatan, 'PIHAK'))) as peran,
                    'MANUAL' as sumber
                FROM bdb_lp_pihak_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE m.deleted_at is null AND m.nik = $1
            )
            SELECT *,
                CASE 
                    WHEN peran = 'DPO' THEN 1
                    WHEN peran = 'TERSANGKA' THEN 2
                    WHEN peran = 'TERLAPOR' THEN 3
                    WHEN peran = 'KORBAN' THEN 4
                    WHEN peran = 'PELAPOR' THEN 5
                    WHEN peran = 'SAKSI' THEN 6
                    ELSE 7
                END as kasta_rank
            FROM all_parties
            ORDER BY kasta_rank ASC, tgl_date DESC;
        `;

        const rows = await this.dataSource.query(sql, isCorp ? [cleanTerm, corpTerm] : [nik]);
        const seen = new Set<string>();
        const deduped: any[] = [];
        for (const r of rows) {
            const key = r.lp_id 
                ? `lp_${r.lp_id}` 
                : (r.no_laporan && r.no_laporan !== 'LP Tanpa Nomor' 
                    ? `no_${r.no_laporan}` 
                    : `rnd_${Math.random()}`);
            if (!seen.has(key)) {
                seen.add(key);
                let tDateStr = '';
                if (r.tgl_date instanceof Date) {
                    tDateStr = r.tgl_date.toISOString().substring(0, 10);
                } else if (r.tgl_date) {
                    tDateStr = String(r.tgl_date).substring(0, 10);
                }
                const inPeriod = (!fromStr || tDateStr >= fromStr) && (!toStr || tDateStr <= toStr);
                deduped.push({
                    ...r,
                    waktu_kejadian: r.waktu_kejadian || '—',
                    tempat_kejadian: r.tempat_kejadian || '—',
                    kejahatan: r.kejahatan || '—',
                    status_lp: r.status_lp || 'PROSES',
                    uraian_kejadian: r.uraian_kejadian || '—',
                    satker_nama: r.satker_nama || 'POLRI',
                    wilayah_nama: r.wilayah_nama || 'POLRI',
                    in_period: inPeriod,
                    tahun: tDateStr ? tDateStr.substring(0, 4) : '—'
                });
            }
        }

        deduped.sort((a: any, b: any) => {
            const da = a.tgl_date ? new Date(a.tgl_date).getTime() : 0;
            const db = b.tgl_date ? new Date(b.tgl_date).getTime() : 0;
            return db - da;
        });

        const periodList = deduped.filter((x: any) => x.in_period);
        return { 
            status: 1, 
            data: deduped, 
            meta: { 
                total_all: deduped.length, 
                total_period: periodList.length,
                period: { from: fromStr, to: toStr }
            } 
        };
    }

    private async resolveRankingSatkerWhere(satkerId: number): Promise<string> {
        if (!Number.isSafeInteger(satkerId) || satkerId <= 0) return '';
        if (satkerId === 13) {
            return "AND (satker_tier = 1 OR daftar_satker ILIKE '%BARESKRIM%' OR daftar_satker ILIKE '%DITTIPID%' OR satker_nama_tertinggi ILIKE '%BARESKRIM%' OR satker_nama_tertinggi ILIKE '%DITTIPID%')";
        }
        const satkerRows = await this.dataSource.query('select deskripsi, nama_singkat, parent_id from bdb_satker where id = $1', [satkerId]);
        const satkerName = satkerRows[0]?.deskripsi || '';
        const singkatName = satkerRows[0]?.nama_singkat || '';
        if (/BARESKRIM|DITTIPID|MABES/i.test(satkerName) || /BARESKRIM|DITTIPID|MABES/i.test(singkatName)) {
            return "AND (satker_tier = 1 OR daftar_satker ILIKE '%BARESKRIM%' OR daftar_satker ILIKE '%DITTIPID%' OR satker_nama_tertinggi ILIKE '%BARESKRIM%' OR satker_nama_tertinggi ILIKE '%DITTIPID%')";
        }
        let parentName = '';
        if (satkerRows[0]?.parent_id) {
            const parentRows = await this.dataSource.query('select deskripsi from bdb_satker where id = $1', [satkerRows[0].parent_id]);
            parentName = parentRows[0]?.deskripsi || '';
        }
        const keywords: string[] = [];
        if (satkerName) {
            const cleanFull = satkerName.replace(/^POLDA\s+/i, '').trim();
            if (cleanFull && cleanFull.length >= 3) keywords.push(cleanFull);
        }
        if (singkatName && singkatName.length >= 3 && !keywords.includes(singkatName)) {
            keywords.push(singkatName);
        }
        if (parentName && !parentName.toUpperCase().includes('POLRI') && !parentName.toUpperCase().includes('MABES')) {
            const pClean = parentName.replace(/^POLDA\s+/i, '').trim();
            if (pClean && !keywords.includes(pClean)) keywords.push(pClean);
        }
        if (keywords.length === 0) return '';
        const conds = keywords.map(kw => {
            const esc = kw.replace(/'/g, "''");
            return `(daftar_satker ILIKE '%${esc}%' OR satker_nama_tertinggi ILIKE '%${esc}%')`;
        });
        return `AND (${conds.join(' OR ')})`;
    }

    async ranking(authUser: any, query: any = {}) {
        const isMaster = String(query.master || '') === '1';
        const isDashboard = String(query.dashboard || '') === '1' || query.scope === 'national';
        const isNational = isMaster || isDashboard || query.scope === 'national';

        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const explicitSatkerId = Number(query.satker_id || 0);

        const cacheKey = JSON.stringify({
            isMaster,
            isDashboard,
            scopeKey: scope.all ? 'ALL' : (scope.satkerId || 0),
            satkerId: explicitSatkerId > 0 ? explicitSatkerId : 0,
            ket: (this.toText(query.keterlibatan || query.peran) || 'ALL').toUpperCase(),
            subjek: String(query.subjek || query.tipe_subjek || 'ALL').toUpperCase(),
            search: (this.toText(query.search) || '').toLowerCase(),
            from: String(query.from || query.date_from || query.startDate || '').trim(),
            to: String(query.to || query.date_to || query.endDate || '').trim(),
            tahun: String(query.tahun || query.year || ''),
            bulan: String(query.bulan || query.month || ''),
            periode: String(query.periode || query.all_time || ''),
            page: Math.max(1, Number(query.page || 1)),
            limit: Number(query.row || query.limit || (isMaster ? 25 : 5))
        });

        const cached = this.rankingCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            return {
                ...cached.data,
                meta: { ...(cached.data.meta || {}), cached: true }
            };
        }

        let scopeWhereClause = '';
        if (explicitSatkerId > 0) {
            scopeWhereClause = await this.resolveRankingSatkerWhere(explicitSatkerId);
        } else if (!isNational && !scope.all && scope.satkerId) {
            scopeWhereClause = await this.resolveRankingSatkerWhere(Number(scope.satkerId));
        }

        const allowed = [
            'ALL',
            'LINTAS_WILAYAH',
            'KORBAN',
            'SAKSI',
            'PELAPOR',
            'TERLAPOR',
            'TERSANGKA',
            'DPO'
        ];
    
        const rawKet = (this.toText(query.keterlibatan || query.peran) || 'ALL').toUpperCase();
        const keterlibatan = allowed.includes(rawKet) ? rawKet : 'ALL';

        // Khusus DPO: langsung baca dari bdb_dpo aktif agar selalu update di dashboard & pihak paling sering terlibat
        if (keterlibatan === 'DPO') {
            const page = Math.max(1, Number(query.page || 1));
            const limit = isMaster ? Math.max(1, Math.min(Number(query.row || query.limit || 25), 100)) : Math.max(1, Math.min(Number(query.limit || 5), 10));
            const offset = (page - 1) * limit;
            const rSearch = this.toText(query.search);
            const searchClause = rSearch ? `AND (lower(d.nama_dpo) LIKE '%${rSearch.toLowerCase()}%' OR coalesce(d.nomor_identitas,'') LIKE '%${rSearch}%' OR lower(d.nomor_dpo) LIKE '%${rSearch.toLowerCase()}%')` : '';
            const satkerClause = explicitSatkerId > 0 ? `AND d.satker_id in (with recursive st as (select id from bdb_satker where id = ${explicitSatkerId} union all select s.id from bdb_satker s join st on s.parent_id = st.id) select id from st)` : '';

            const [dpoRows, countRes] = await Promise.all([
                this.dataSource.query(`
                    SELECT 
                        d.id as id,
                        d.id as dpo_id,
                        d.nama_dpo as nama,
                        d.nomor_identitas as nik,
                        1 as total_lp,
                        1 as jumlah_lp,
                        1 as count_role,
                        1 as count_dpo,
                        0 as count_tersangka,
                        0 as count_terlapor,
                        0 as count_saksi,
                        0 as count_korban,
                        0 as count_pelapor,
                        'DPO' as keterlibatan,
                        'DPO' as kasta,
                        1 as kasta_rank,
                        coalesce(d.satker_nama, 'POLRI') as satker_nama,
                        coalesce(d.satker_nama, 'POLRI') as satker_nama_tertinggi,
                        2 as satker_tier,
                        1 as jumlah_satker_unik,
                        false as is_lintas_wilayah,
                        'PERORANGAN' as tipe_subjek,
                        'NIK' as tipe_identitas,
                        d.created_at as last_seen,
                        coalesce(d.scan_dokumen_url, d.foto_dpo_url) as scan_dokumen_url,
                        coalesce(d.scan_dokumen_url, d.foto_dpo_url) as lampiran_url
                    FROM bdb_dpo d
                    WHERE d.status_dpo = 'AKTIF'
                      ${searchClause}
                      ${satkerClause}
                    ORDER BY d.created_at DESC, d.id DESC
                    LIMIT ${limit} OFFSET ${offset}
                `),
                this.dataSource.query(`SELECT count(*)::int as c FROM bdb_dpo d WHERE d.status_dpo = 'AKTIF' ${searchClause} ${satkerClause}`)
            ]);
            const totalDpo = countRes[0]?.c || 0;

            const dpoResult = {
                status: 1,
                data: dpoRows,
                meta: {
                    total: totalDpo,
                    estimatedTotal: totalDpo,
                    page,
                    limit,
                    hasNext: offset + limit < totalDpo,
                    totalPages: Math.max(1, Math.ceil(totalDpo / limit)),
                    mode: 'direct-active-dpo'
                }
            };
            this.rankingCache.set(cacheKey, { expiresAt: Date.now() + this.rankingCacheTtlMs, data: dpoResult });
            return dpoResult;
        }

        // Detect target partition based on query params (from, to, tahun, bulan, date_from, date_to)
        let targetTahun: number = 2026;
        let targetBulan: number | null = null;

        const fromStr = String(query.from || query.date_from || query.startDate || '').trim();
        const toStr = String(query.to || query.date_to || query.endDate || '').trim();
        const qTahun = query.tahun || query.year;
        const qBulan = query.bulan || query.month;

        if (query.tahun === '0' || query.tahun === 'all' || query.all_time === '1' || query.periode === 'all') {
            targetTahun = 0;
            targetBulan = null;
        } else if (qTahun && Number(qTahun) === 2026) {
            targetTahun = 2026;
            targetBulan = (qBulan && Number(qBulan) >= 1 && Number(qBulan) <= 12) ? Number(qBulan) : null;
        } else if (fromStr.startsWith('2026') || toStr.startsWith('2026')) {
            targetTahun = 2026;
            const mFrom = fromStr.match(/^2026-(\d{2})/);
            const mTo = toStr.match(/^2026-(\d{2})/);
            if (mFrom && mTo && mFrom[1] === mTo[1]) {
                targetBulan = Number(mFrom[1]);
            } else {
                targetBulan = null;
            }
        }

        const partitionWhere = targetBulan !== null 
            ? `tahun = ${targetTahun} AND bulan = ${targetBulan}` 
            : `tahun = ${targetTahun} AND bulan IS NULL`;

        const rawSubjek = String(query.subjek || query.tipe_subjek || 'ALL').toUpperCase();
        const subjekWhere = rawSubjek === 'KORPORASI' ? "AND tipe_subjek = 'KORPORASI'" : (rawSubjek === 'PERORANGAN' ? "AND tipe_subjek = 'PERORANGAN'" : '');

        const kastaCaseExpr = `
            CASE 
              WHEN count_dpo > 0 THEN 'DPO'
              WHEN count_tersangka > 0 THEN 'TERSANGKA'
              WHEN (tipe_subjek = 'KORPORASI' AND count_korban > count_terlapor * 2)
                OR (count_korban >= count_terlapor * 4 AND count_korban >= count_pelapor AND count_korban >= count_saksi AND count_korban > 0) THEN 'KORBAN'
              WHEN count_terlapor > 0 THEN 'TERLAPOR'
              WHEN count_pelapor > 0 THEN 'PELAPOR'
              WHEN count_saksi > 0 THEN 'SAKSI'
              WHEN count_korban > 0 THEN 'KORBAN'
              ELSE 'PIHAK'
            END`;

        const kastaRankExpr = `
            CASE 
              WHEN count_dpo > 0 THEN 1
              WHEN count_tersangka > 0 THEN 2
              WHEN (tipe_subjek = 'KORPORASI' AND count_korban > count_terlapor * 2)
                OR (count_korban >= count_terlapor * 4 AND count_korban >= count_pelapor AND count_korban >= count_saksi AND count_korban > 0) THEN 6
              WHEN count_terlapor > 0 THEN 3
              WHEN count_pelapor > 0 THEN 4
              WHEN count_saksi > 0 THEN 5
              WHEN count_korban > 0 THEN 6
              ELSE 7
            END`;

        // 1. MASTER VIEW (Menu: Pihak Paling Sering Terlibat)
        if (isMaster) {
            try {
                const page = Math.max(1, Number(query.page || 1));
                const rowLimit = Math.max(1, Math.min(Number(query.row || query.limit || 25), 100));
                const offset = (page - 1) * rowLimit;
                const rSearch = this.toText(query.search)?.trim();
                const searchClause = rSearch ? `AND (lower(nama) LIKE '%${rSearch.toLowerCase().replace(/'/g, "''")}%' OR nik LIKE '%${rSearch.replace(/'/g, "''")}%')` : '';
                
                let catFilter = 'ALL';
                let extraWhere = '';
                if (keterlibatan === 'LINTAS_WILAYAH') {
                    extraWhere = 'AND is_lintas_wilayah = true';
                } else if (keterlibatan !== 'ALL') {
                    catFilter = keterlibatan;
                }

                const orderClauseMaster = catFilter === 'ALL'
                    ? (keterlibatan === 'LINTAS_WILAYAH' 
                        ? `(${kastaRankExpr}) ASC, jumlah_polda_unik DESC, total_lp DESC, satker_tier ASC, last_seen DESC` 
                        : `(${kastaRankExpr}) ASC, total_lp DESC, satker_tier ASC, last_seen DESC`)
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC,' : '') + ` satker_tier ASC, (${kastaRankExpr}) ASC, total_lp DESC, last_seen DESC`;

                const [snapRanking, countRes, summaryRes] = await Promise.all([
                    this.dataSource.query(`
                        SELECT nama, nik,
                               GREATEST(coalesce(total_lp, 0), coalesce(count_dpo, 0), coalesce(count_tersangka, 0), coalesce(count_terlapor, 0), coalesce(count_saksi, 0), coalesce(count_korban, 0), coalesce(count_pelapor, 0)) as total_lp,
                               satker_tier, satker_nama_tertinggi, last_seen,
                               count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                               jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                               tipe_subjek, tipe_identitas,
                               ${kastaCaseExpr} as kasta,
                               ${kastaRankExpr} as kasta_rank
                        FROM bdb_pihak_terlibat_ranking_snapshot
                        WHERE ${partitionWhere}
                          AND kategori_filter = '${catFilter}'
                          AND total_lp > 1
                          ${subjekWhere}
                          ${searchClause}
                          ${scopeWhereClause}
                          ${extraWhere}
                        ORDER BY ${orderClauseMaster}
                        LIMIT ${rowLimit} OFFSET ${offset}
                    `),
                    this.dataSource.query(`
                        SELECT count(*)::int as total
                        FROM bdb_pihak_terlibat_ranking_snapshot
                        WHERE ${partitionWhere}
                          AND kategori_filter = '${catFilter}'
                          AND total_lp > 1
                          ${subjekWhere}
                          ${searchClause}
                          ${scopeWhereClause}
                          ${extraWhere}
                    `),
                    this.dataSource.query(`
                        SELECT 
                            count(case when kategori_filter = 'ALL' then 1 end)::int as semua,
                            count(case when kategori_filter = 'ALL' and is_lintas_wilayah = true then 1 end)::int as lintas_wilayah,
                            coalesce((select count(*)::int from bdb_dpo d where d.status_dpo = 'AKTIF' ${explicitSatkerId > 0 ? `and d.satker_id in (with recursive st as (select id from bdb_satker where id = ${explicitSatkerId} union all select s.id from bdb_satker s join st on s.parent_id = st.id) select id from st)` : ''}), 0) as dpo,
                            count(case when kategori_filter = 'TERSANGKA' then 1 end)::int as tersangka,
                            count(case when kategori_filter = 'TERLAPOR' then 1 end)::int as terlapor,
                            count(case when kategori_filter = 'SAKSI' then 1 end)::int as saksi,
                            count(case when kategori_filter = 'KORBAN' then 1 end)::int as korban,
                            count(case when kategori_filter = 'PELAPOR' then 1 end)::int as pelapor,
                            count(case when kategori_filter = 'ALL' and (${kastaCaseExpr}) = 'TERSANGKA' then 1 end)::int as kasta_tersangka,
                            count(case when kategori_filter = 'ALL' and (${kastaCaseExpr}) = 'TERLAPOR' then 1 end)::int as kasta_terlapor,
                            count(case when kategori_filter = 'ALL' and (${kastaCaseExpr}) = 'SAKSI' then 1 end)::int as kasta_saksi,
                            count(case when kategori_filter = 'ALL' and (${kastaCaseExpr}) = 'KORBAN' then 1 end)::int as kasta_korban,
                            count(case when kategori_filter = 'ALL' and (${kastaCaseExpr}) = 'PELAPOR' then 1 end)::int as kasta_pelapor
                        FROM bdb_pihak_terlibat_ranking_snapshot
                        WHERE ${partitionWhere} AND total_lp > 1 ${subjekWhere} ${searchClause} ${scopeWhereClause};
                    `)
                ]);

                const total = Number(countRes[0]?.total || 0);
                const rawSummary = summaryRes[0] || { semua: 0, lintas_wilayah: 0, tersangka: 0, terlapor: 0, korban: 0, saksi: 0, pelapor: 0, dpo: 0 };
                const summary = {
                    semua: Number(rawSummary.semua || 0),
                    lintas_wilayah: Number(rawSummary.lintas_wilayah || 0),
                    dpo: Number(rawSummary.dpo || 0),
                    tersangka: Number(rawSummary.tersangka || 0),
                    terlapor: Number(rawSummary.terlapor || 0),
                    saksi: Number(rawSummary.saksi || 0),
                    korban: Number(rawSummary.korban || 0),
                    pelapor: Number(rawSummary.pelapor || 0),
                    kasta_breakdown: {
                        dpo: Number(rawSummary.dpo || 0),
                        tersangka: Number(rawSummary.kasta_tersangka || 0),
                        terlapor: Number(rawSummary.kasta_terlapor || 0),
                        saksi: Number(rawSummary.kasta_saksi || 0),
                        korban: Number(rawSummary.kasta_korban || 0),
                        pelapor: Number(rawSummary.kasta_pelapor || 0)
                    }
                };

                const masterResult = {
                    status: 1,
                    data: (snapRanking || []).map((r: any) => ({
                        nama: r.nama,
                        nik: r.nik,
                        keterlibatan: catFilter !== 'ALL' ? catFilter : (r.kasta || 'PIHAK'),
                        kasta: catFilter !== 'ALL' ? catFilter : (r.kasta || 'PIHAK'),
                        kasta_rank: r.kasta_rank,
                        total_lp: Number(r.total_lp || 0),
                        jumlah_lp: Number(r.total_lp || 0),
                        satker_tier: r.satker_tier,
                        satker_nama: r.satker_nama_tertinggi || 'Mabes Polri',
                        satker_nama_tertinggi: r.satker_nama_tertinggi || 'Mabes Polri',
                        daftar_satker: r.daftar_satker || r.satker_nama_tertinggi || 'Mabes Polri',
                        count_tersangka: Number(r.count_tersangka || 0),
                        count_terlapor: Number(r.count_terlapor || 0),
                        count_saksi: Number(r.count_saksi || 0),
                        count_korban: Number(r.count_korban || 0),
                        count_pelapor: Number(r.count_pelapor || 0),
                        count_dpo: Number(r.count_dpo || 0),
                        jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                        jumlah_polda_unik: Number(r.jumlah_polda_unik || 1),
                        is_lintas_wilayah: Boolean(r.is_lintas_wilayah),
                        nasional_score: Number(r.nasional_score || 0),
                        tipe_subjek: r.tipe_subjek || (r.nik?.startsWith('KORP:') ? 'KORPORASI' : 'PERORANGAN'),
                        tipe_identitas: r.tipe_identitas || (r.nik?.startsWith('KORP:') ? 'BADAN HUKUM' : 'NIK'),
                        last_seen: r.last_seen
                    })),
                    pagination: {
                        page,
                        per_page: rowLimit,
                        total,
                        total_pages: Math.ceil(total / rowLimit)
                    },
                    meta: {
                        summary,
                        cached: false,
                        mode: targetTahun === 2026 ? (targetBulan ? 'snapshot-master-month-' + targetBulan : 'snapshot-master-year-2026') : 'snapshot-master-all-time'
                    }
                };
                if (this.rankingCache.size > 300) {
                    const now = Date.now();
                    for (const [k, v] of this.rankingCache.entries()) {
                        if (v.expiresAt <= now) this.rankingCache.delete(k);
                    }
                }
                this.rankingCache.set(cacheKey, { expiresAt: Date.now() + this.rankingCacheTtlMs, data: masterResult });
                return masterResult;
            } catch (err: any) {
                this.logger.error('Error in master ranking: ' + err?.message);
                throw err;
            }
        }

        // 2. DASHBOARD WIDGET (Max 5, All-Time, National, Kasta Tertinggi Priority)
        if (isDashboard) {
            try {
                const requestedLimit = Number(query.limit || 5);
                const limit = Math.max(1, Math.min(requestedLimit, 10));
                const catFilter = (keterlibatan && keterlibatan !== 'ALL' && keterlibatan !== 'LINTAS_WILAYAH') ? keterlibatan : 'ALL';

                const orderClauseDash = catFilter === 'ALL'
                    ? `(${kastaRankExpr}) ASC, total_lp DESC, satker_tier ASC, last_seen DESC`
                    : (catFilter === 'TERSANGKA' ? 'count_tersangka DESC,' :
                       catFilter === 'TERLAPOR' ? 'count_terlapor DESC,' :
                       catFilter === 'PELAPOR' ? 'count_pelapor DESC,' :
                       catFilter === 'SAKSI' ? 'count_saksi DESC,' :
                       catFilter === 'KORBAN' ? 'count_korban DESC,' :
                       catFilter === 'DPO' ? 'count_dpo DESC,' : '') + ` satker_tier ASC, (${kastaRankExpr}) ASC, total_lp DESC, last_seen DESC`;

                const snapRanking = await this.dataSource.query(`
                    SELECT nama, nik,
                           GREATEST(coalesce(total_lp, 0), coalesce(count_dpo, 0), coalesce(count_tersangka, 0), coalesce(count_terlapor, 0), coalesce(count_saksi, 0), coalesce(count_korban, 0), coalesce(count_pelapor, 0)) as total_lp,
                           satker_tier, satker_nama_tertinggi, last_seen,
                           count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                           jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                           tipe_subjek, tipe_identitas,
                           ${kastaCaseExpr} as kasta,
                           ${kastaRankExpr} as kasta_rank
                    FROM bdb_pihak_terlibat_ranking_snapshot
                    WHERE ${partitionWhere}
                      AND kategori_filter = '${catFilter}'
                      AND total_lp > 1
                      ${subjekWhere}
                      ${scopeWhereClause}
                    ORDER BY ${orderClauseDash}
                    LIMIT ${limit * 3}
                `);

                const seenNik = new Set<string>();
                const uniqueSnap: any[] = [];
                for (const r of (snapRanking || [])) {
                    const key = (r.nik ? r.nik.trim() : r.nama) || "";
                    if (key && seenNik.has(key)) continue;
                    if (key) seenNik.add(key);
                    uniqueSnap.push(r);
                    if (uniqueSnap.length >= limit) break;
                }

                const dashResult = {
                    status: 1,
                    data: uniqueSnap.map((r: any) => {
                        const countRole = catFilter === 'KORBAN' ? Number(r.count_korban || 0)
                            : catFilter === 'SAKSI' ? Number(r.count_saksi || 0)
                            : catFilter === 'PELAPOR' ? Number(r.count_pelapor || 0)
                            : catFilter === 'TERLAPOR' ? Number(r.count_terlapor || 0)
                            : catFilter === 'TERSANGKA' ? Number(r.count_tersangka || 0)
                            : catFilter === 'DPO' ? Number(r.count_dpo || 0)
                            : Number(r.total_lp || 0);

                        const isCorp = r.tipe_subjek === 'KORPORASI' || (r.nik && String(r.nik).startsWith('KORP:')) || r.tipe_identitas === 'BADAN HUKUM';
                        return {
                            nama: r.nama,
                            nik: r.nik || (isCorp ? `KORP:${r.nama}` : ''),
                            raw_nik: r.nik,
                            keterlibatan: catFilter !== 'ALL' ? catFilter : (r.kasta || 'PIHAK'),
                            kasta: catFilter !== 'ALL' ? catFilter : (r.kasta || 'PIHAK'),
                            kasta_rank: r.kasta_rank,
                            total_lp: Number(r.total_lp || 0),
                            jumlah_lp: Number(r.total_lp || 0),
                            count_role: countRole,
                            satker_tier: r.satker_tier,
                            satker_nama: r.satker_nama_tertinggi || 'Mabes Polri',
                            satker_nama_tertinggi: r.satker_nama_tertinggi || 'Mabes Polri',
                            count_tersangka: Number(r.count_tersangka || 0),
                            count_terlapor: Number(r.count_terlapor || 0),
                            count_saksi: Number(r.count_saksi || 0),
                            count_korban: Number(r.count_korban || 0),
                            count_pelapor: Number(r.count_pelapor || 0),
                            count_dpo: Number(r.count_dpo || 0),
                            jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                            jumlah_polda_unik: Number(r.jumlah_polda_unik || 1),
                            is_lintas_wilayah: Boolean(r.is_lintas_wilayah),
                            nasional_score: Number(r.nasional_score || 0),
                            tipe_subjek: r.tipe_subjek || (isCorp ? 'KORPORASI' : 'PERORANGAN'),
                            tipe_identitas: r.tipe_identitas || (isCorp ? 'BADAN HUKUM' : 'NIK'),
                            last_seen: r.last_seen
                        };
                    }),
                    meta: {
                        cached: false,
                        mode: targetTahun === 2026 ? (targetBulan ? 'snapshot-dashboard-month-' + targetBulan : 'snapshot-dashboard-year-2026') : 'snapshot-dashboard-all-time'
                    }
                };
                this.rankingCache.set(cacheKey, { expiresAt: Date.now() + this.rankingCacheTtlMs, data: dashResult });
                return dashResult;
            } catch (err: any) {
                this.logger.error('Error in dashboard ranking: ' + err?.message);
                throw err;
            }
        }

        // 3. Fallback
        const limit = 5;
        const snap = await this.dataSource.query(`
            SELECT nama, nik,
                   GREATEST(coalesce(total_lp, 0), coalesce(count_dpo, 0), coalesce(count_tersangka, 0), coalesce(count_terlapor, 0), coalesce(count_saksi, 0), coalesce(count_korban, 0), coalesce(count_pelapor, 0)) as total_lp,
                   satker_tier, satker_nama_tertinggi, last_seen,
                   count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                   jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                   ${kastaCaseExpr} as kasta,
                   ${kastaRankExpr} as kasta_rank
            FROM bdb_pihak_terlibat_ranking_snapshot
            WHERE ${partitionWhere} AND total_lp > 1 ${scopeWhereClause}
            ORDER BY nasional_score DESC, total_lp DESC, last_seen DESC
            LIMIT ${limit}
        `);
        const fallbackResult = {
            status: 1,
            data: (snap || []).map((r: any) => ({
                nama: r.nama,
                nik: r.nik,
                keterlibatan: r.kasta || 'PIHAK',
                kasta: r.kasta || 'PIHAK',
                total_lp: Number(r.total_lp || 0),
                jumlah_lp: Number(r.total_lp || 0),
                satker_tier: r.satker_tier,
                satker_nama: r.satker_nama_tertinggi || 'Mabes Polri',
                is_lintas_wilayah: Boolean(r.is_lintas_wilayah),
                jumlah_satker_unik: Number(r.jumlah_satker_unik || 1),
                last_seen: r.last_seen
            })),
            meta: { cached: false, mode: 'snapshot-fallback' }
        };
        this.rankingCache.set(cacheKey, { expiresAt: Date.now() + this.rankingCacheTtlMs, data: fallbackResult });
        return fallbackResult;
    }

    private async assertAccess(authUser: any, lp: { id: number; satker_id: number; unit_satker_id?: number | null }, scope: { all: boolean; satkerId: number | null }) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new ForbiddenException('Tidak berwenang menambahkan pihak terlibat.');
        }
        const scopeSatkerId = scope.satkerId == null ? null : Number(scope.satkerId);
        if (!scope.all && (scopeSatkerId == null || !Number.isFinite(scopeSatkerId))) {
            throw new ForbiddenException('Akun belum memiliki scope satker yang valid.');
        }
        await this.monitoring.assertCanMutateLp(authUser?.id ? Number(authUser.id) : undefined, Number(lp.id), authUser);
    }

    async addManual(authUser: any, lpId: number, dto: any, file?: UploadedFileLike) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);

        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, jenis_kejahatan_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];

        await this.assertAccess(authUser, lp, scope);

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

    /** Gabungan DORS + DOKUMEN + MANUAL untuk satu LP. Sumber dokumen selalu read-only. */
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

        const documentRows = await this.dataSource.query(
            `with ${this.documentPartiesCte()}
             select (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                    x.keterlibatan,x.nama,x.nik,x.jenis_kelamin,x.tempat_lahir,x.tgl_lahir,
                    x.pekerjaan,x.alamat,x.no_hp,null::date as bap_tanggal,x.nomor_dokumen,
                    x.tanggal_dokumen,null::text as lampiran_url,
                    case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                    false as can_edit,false as can_delete
             from document_parties x
             where x.lp_id=$1
             order by x.created_at desc,x.dokumen_id desc,x.urutan`,
            [lpId]
        );
        const documentData = documentRows.map((r: any) => ({ sumber: 'DOKUMEN', ...r }));

        const manual = await this.listByLp(authUser, lpId);
        return { data: [...dorsData, ...documentData, ...manual.data] };
    }

    private async assertLpAccess(authUser: any, lpId: number) {
        const scope = await resolveScope(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, jenis_kejahatan_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        await this.assertAccess(authUser, lp, scope);
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

    @Cron('0 */30 * * * *')
    async cronRefreshRankingSnapshot() {
        if (!isPrimaryClusterInstance()) return;
        const now = new Date();
        const curMonth = now.getMonth() + 1;
        await this.refreshRankingSnapshot(curMonth);
        if (now.getHours() % 2 === 0 && now.getMinutes() === 0) {
            await this.refreshRankingSnapshot(null);
        }
    }

    async refreshRankingSnapshot(targetMonth?: number | null) {
        const isYear = (targetMonth === null || targetMonth === undefined);
        const curMonth = !isYear ? targetMonth : null;
        const mm = isYear ? null : String(curMonth).padStart(2, '0');
        const startDay = isYear ? '2026-01-01' : ('2026-' + mm + '-01');
        const lastDay = isYear ? '2026-12-31' : ('2026-' + mm + '-' + String(new Date(2026, curMonth, 0).getDate()).padStart(2, '0'));
        const monthVal = isYear ? 'NULL::int' : String(curMonth);
        const monthDeleteClause = isYear ? 'bulan IS NULL' : ('bulan = ' + curMonth);

        const limAll = isYear ? 100 : 50;
        const limRole = isYear ? 100 : 25;

        this.logger.log(`Refreshing Ranking Snapshot for ${isYear ? 'Year 2026' : 'Month ' + curMonth} (${startDay} to ${lastDay}) in transaction...`);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`DELETE FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 2026 AND ${monthDeleteClause};`);

            await queryRunner.query(`
                WITH raw_dors AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        upper(trim(t.nama)) as nama,
                        trim(t.nik) as nik,
                        upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
                        d.synced_at as seen_at,
                        CASE 
                            WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                            ELSE 4
                        END as satker_tier,
                        coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                        (upper(coalesce(t.status_korban,'')) = 'MD' OR upper(coalesce(t.keterlibatan,'')) LIKE '%MD%' OR upper(coalesce(t.keterlibatan,'')) LIKE '%MENINGGAL%') as is_md,
                        case 
                            when t.tgl_lahir ~ '^[0-9]{2}-[0-9]{2}-[12][0-9]{3}$' then 2026 - substring(t.tgl_lahir from 7 for 4)::int
                            when t.tgl_lahir ~ '^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$' then 2026 - substring(t.tgl_lahir from 1 for 4)::int
                            when trim(t.nik) ~ '^[1-9][0-9]{15}$' and substring(trim(t.nik) from 11 for 2)::int <= 26 then 2026 - (2000 + substring(trim(t.nik) from 11 for 2)::int)
                            when trim(t.nik) ~ '^[1-9][0-9]{15}$' and substring(trim(t.nik) from 11 for 2)::int > 26 then 2026 - (1900 + substring(trim(t.nik) from 11 for 2)::int)
                            else null
                        end as umur
                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '${startDay}'::date
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) <= '${lastDay}'::date
                      AND t.nik IS NOT NULL AND trim(t.nik) ~ '^[1-9][0-9]{15}$'
                      AND t.nama IS NOT NULL AND length(trim(t.nama)) > 2
                      AND upper(trim(t.nama)) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                      AND NOT (
                          upper(coalesce(t.keterlibatan, '')) IN ('PELAPOR', 'SAKSI')
                          AND (
                              lp.model_lp = 'lp_model_a' 
                              OR d.model_lp = 'lp_model_a' 
                              OR t.model_lp = 'lp_model_a'
                              OR upper(coalesce(lp.no_laporan, '')) LIKE '%/A/%'
                              OR upper(coalesce(t.pekerjaan, '')) LIKE '%POLRI%'
                              OR upper(coalesce(t.pekerjaan, '')) LIKE '%POLISI%'
                              OR upper(coalesce(t.pekerjaan, '')) LIKE '%KEPOLISIAN%'
                              OR upper(coalesce(t.jenis_identitas, '')) LIKE '%NRP%'
                          )
                      )
                ),
                raw_tsk AS (
                    SELECT 
                        d.lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            else '060.01.00'
                        end as wilayah_kode,
                        upper(trim(item->>'nama')) as nama,
                        trim(item->>'nik') as nik,
                        'TERSANGKA'::text as keterlibatan,
                        d.created_at as seen_at,
                        CASE 
                            WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                            ELSE 4
                        END as satker_tier,
                        coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                        false as is_md,
                        case 
                            when item->>'tgl_lahir' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then 2026 - substring(item->>'tgl_lahir' from 1 for 4)::int
                            when item->>'tgl_lahir' ~ '^[0-9]{2}-[0-9]{2}-[12][0-9]{3}$' then 2026 - substring(item->>'tgl_lahir' from 7 for 4)::int
                            when trim(item->>'nik') ~ '^[1-9][0-9]{15}$' and substring(trim(item->>'nik') from 11 for 2)::int <= 26 then 2026 - (2000 + substring(trim(item->>'nik') from 11 for 2)::int)
                            when trim(item->>'nik') ~ '^[1-9][0-9]{15}$' and substring(trim(item->>'nik') from 11 for 2)::int > 26 then 2026 - (1900 + substring(trim(item->>'nik') from 11 for 2)::int)
                            else null
                        end as umur
                    FROM bdb_dokumen d
                    JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
                    LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    CROSS JOIN LATERAL jsonb_array_elements(
                        CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
                    ) party(item)
                    WHERE d.created_at::date >= '${startDay}'::date AND d.created_at::date <= '${lastDay}'::date
                      AND item->>'nama' IS NOT NULL 
                      AND length(trim(item->>'nama')) > 2
                      AND trim(item->>'nik') ~ '^[1-9][0-9]{15}$'
                      AND upper(trim(item->>'nama')) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                ),
                unioned AS (
                    SELECT * FROM raw_dors
                    UNION ALL
                    SELECT * FROM raw_tsk
                ),
                filtered AS (
                    SELECT * FROM unioned
                    WHERE is_md = false AND (umur IS NULL OR (umur >= 0 AND umur <= 75))
                ),
                person_agg AS (
                    SELECT 
                        nik,
                        max(nama) as nama,
                        count(distinct lp_id)::int as total_lp,
                        count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
                        count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
                        count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
                        count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
                        count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
                        count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
                        count(distinct satker_id)::int as jumlah_satker_unik,
                        count(distinct wilayah_kode)::int as jumlah_polda_unik,
                        min(satker_tier)::int as satker_tier,
                        (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                        (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                        string_agg(distinct satker_nama, ', ') as daftar_satker,
                        max(seen_at) as last_seen,
                        (
                            (case 
                                when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                    then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                    then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                    then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                    then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                    then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                    then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                else 0 
                            end)
                            + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                            + (count(distinct satker_id) * 300)
                            + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                            + (count(distinct lp_id) * 50)
                        )::int as nasional_score
                    FROM filtered
                    GROUP BY nik
                    HAVING count(distinct lp_id) > 1
                ),
                multi_cat AS (
                    SELECT p.*, 'ALL' as kategori_filter, 'ALL' as keterlibatan, ${limAll} as max_lim FROM person_agg p
                    UNION ALL
                    SELECT p.*, 'TERSANGKA' as kategori_filter, 'TERSANGKA' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_tersangka > 0
                    UNION ALL
                    SELECT p.*, 'TERLAPOR' as kategori_filter, 'TERLAPOR' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_terlapor > 0
                    UNION ALL
                    SELECT p.*, 'PELAPOR' as kategori_filter, 'PELAPOR' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_pelapor > 0
                    UNION ALL
                    SELECT p.*, 'SAKSI' as kategori_filter, 'SAKSI' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_saksi > 0
                    UNION ALL
                    SELECT p.*, 'KORBAN' as kategori_filter, 'KORBAN' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_korban > 0
                    UNION ALL
                    SELECT p.*, 'DPO' as kategori_filter, 'DPO' as keterlibatan, ${limRole} as max_lim FROM person_agg p WHERE count_dpo > 0
                ),
                ranked AS (
                    SELECT *,
                        ROW_NUMBER() OVER (
                            PARTITION BY kategori_filter
                            ORDER BY 
                                (CASE 
                                    WHEN kategori_filter = 'ALL' THEN (
                                        CASE 
                                            WHEN count_dpo > 0 THEN 1
                                            WHEN count_tersangka > 0 THEN 2
                                            WHEN count_terlapor > 0 THEN 3
                                            WHEN count_pelapor > 0 THEN 4
                                            WHEN count_saksi > 0 THEN 5
                                            WHEN count_korban > 0 THEN 6
                                            ELSE 7
                                        END
                                    )
                                    ELSE 1
                                END) ASC,
                                (CASE 
                                    WHEN kategori_filter = 'TERSANGKA' THEN count_tersangka
                                    WHEN kategori_filter = 'TERLAPOR' THEN count_terlapor
                                    WHEN kategori_filter = 'PELAPOR' THEN count_pelapor
                                    WHEN kategori_filter = 'SAKSI' THEN count_saksi
                                    WHEN kategori_filter = 'KORBAN' THEN count_korban
                                    WHEN kategori_filter = 'DPO' THEN count_dpo
                                    ELSE 0
                                END) DESC,
                                total_lp DESC,
                                satker_tier ASC,
                                jumlah_satker_unik DESC,
                                last_seen DESC
                        ) as rn
                    FROM multi_cat
                )
                INSERT INTO bdb_pihak_terlibat_ranking_snapshot (
                    tahun, bulan, satker_id, keterlibatan, kategori_filter, nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    tipe_subjek, tipe_identitas
                )
                SELECT 
                    2026 as tahun,
                    ${monthVal} as bulan,
                    NULL::bigint as satker_id,
                    keterlibatan,
                    kategori_filter,
                    nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, NOW() as refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    'PERORANGAN' as tipe_subjek,
                    'NIK' as tipe_identitas
                FROM ranked
                WHERE 1=1
                ON CONFLICT (tahun, COALESCE(bulan, 0), kategori_filter, nik) DO NOTHING;
            `);

            // Corporate Ranking for 2026
            await queryRunner.query(`
                WITH raw_corp AS (
                    SELECT 
                        lp.id as lp_id,
                        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                        case 
                            when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                            when d.id_polda is not null then d.id_polda
                            else '060.01.00'
                        end as wilayah_kode,
                        regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,
                        'KORP:' || rtrim(regexp_replace(regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1_'), '[^A-Z0-9]+', '_', 'g'), '_+', '_', 'g'), '_') as synth_nik,
                        upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
                        d.synced_at as seen_at,
                        CASE 
                            WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                            WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                            ELSE 4
                        END as satker_tier,
                        coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama
                    FROM bdb_laporan_polisi lp
                    JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                    JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
                    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                    WHERE lp.deleted_at IS NULL
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '${startDay}'::date
                      AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) <= '${lastDay}'::date
                      AND (
                        upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'
                        OR upper(coalesce(t.jenis_identitas,'')) = 'BADAN HUKUM'
                      )
                      AND length(trim(t.nama)) > 2
                      AND upper(trim(t.nama)) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
                ),
                corp_agg AS (
                    SELECT 
                        synth_nik as nik,
                        max(norm_nama) as nama,
                        count(distinct lp_id)::int as total_lp,
                        count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
                        count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
                        count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
                        count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
                        count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
                        count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
                        count(distinct satker_id)::int as jumlah_satker_unik,
                        count(distinct wilayah_kode)::int as jumlah_polda_unik,
                        min(satker_tier)::int as satker_tier,
                        (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
                        (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
                        string_agg(distinct satker_nama, ', ') as daftar_satker,
                        max(seen_at) as last_seen,
                        (
                            (case 
                                when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                                    then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                                when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                                    then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                                when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                                    then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                                when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                                    then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                                when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                                    then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                                when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                                    then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                                else 0 
                            end)
                            + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                            + (count(distinct satker_id) * 300)
                            + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                            + (count(distinct lp_id) * 50)
                        )::int as nasional_score
                    FROM raw_corp
                    GROUP BY synth_nik
                    HAVING count(distinct lp_id) > 1
                ),
                multi_corp AS (
                    SELECT c.*, 'ALL' as kategori_filter, 'ALL' as keterlibatan FROM corp_agg c
                    UNION ALL
                    SELECT c.*, 'TERSANGKA' as kategori_filter, 'TERSANGKA' as keterlibatan FROM corp_agg c WHERE count_tersangka > 0
                    UNION ALL
                    SELECT c.*, 'TERLAPOR' as kategori_filter, 'TERLAPOR' as keterlibatan FROM corp_agg c WHERE count_terlapor > 0
                    UNION ALL
                    SELECT c.*, 'PELAPOR' as kategori_filter, 'PELAPOR' as keterlibatan FROM corp_agg c WHERE count_pelapor > 0
                    UNION ALL
                    SELECT c.*, 'SAKSI' as kategori_filter, 'SAKSI' as keterlibatan FROM corp_agg c WHERE count_saksi > 0
                    UNION ALL
                    SELECT c.*, 'KORBAN' as kategori_filter, 'KORBAN' as keterlibatan FROM corp_agg c WHERE count_korban > 0
                    UNION ALL
                    SELECT c.*, 'DPO' as kategori_filter, 'DPO' as keterlibatan FROM corp_agg c WHERE count_dpo > 0
                )
                INSERT INTO bdb_pihak_terlibat_ranking_snapshot (
                    tahun, bulan, satker_id, keterlibatan, kategori_filter, nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    tipe_subjek, tipe_identitas
                )
                SELECT 
                    2026 as tahun,
                    ${monthVal} as bulan,
                    NULL::bigint as satker_id,
                    keterlibatan,
                    kategori_filter,
                    nama, nik, total_lp,
                    satker_tier, satker_nama_tertinggi, last_seen, NOW() as refreshed_at,
                    count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
                    jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, daftar_satker, nasional_score,
                    'KORPORASI' as tipe_subjek,
                    'BADAN HUKUM' as tipe_identitas
                FROM multi_corp ON CONFLICT (tahun, COALESCE(bulan, 0), kategori_filter, nik) DO NOTHING;

                UPDATE bdb_pihak_terlibat_ranking_snapshot
                SET
                    total_lp = GREATEST(total_lp, count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor),
                    kasta = CASE
                        WHEN kategori_filter != 'ALL' THEN kategori_filter
                        WHEN count_dpo > 0 THEN 'DPO'
                        WHEN count_tersangka > 0 THEN 'TERSANGKA'
                        WHEN (coalesce(tipe_subjek, '') = 'KORPORASI' AND count_korban > count_terlapor * 2)
                             OR (count_korban >= count_terlapor * 4 AND count_korban >= count_pelapor AND count_korban >= count_saksi AND count_korban > 0) THEN 'KORBAN'
                        WHEN count_terlapor > 0 THEN 'TERLAPOR'
                        WHEN count_pelapor > 0 THEN 'PELAPOR'
                        WHEN count_saksi > 0 THEN 'SAKSI'
                        WHEN count_korban > 0 THEN 'KORBAN'
                        ELSE 'PIHAK'
                    END
                WHERE tahun = 2026 AND ${monthDeleteClause};
            `);

            await queryRunner.commitTransaction();
            this.rankingCache.clear();
            this.logger.log(`Ranking Snapshot Refresh for ${isYear ? 'Year 2026' : 'Month ' + curMonth} completed.`);
        } catch (e: any) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error refreshing ranking snapshot: ' + e?.message);
        } finally {
            await queryRunner.release();
        }
    }

    public async countActiveDpo(scope: any, query: any): Promise<number> {
        try {
            const isNational = query?.scope === 'national';
            const satkerId = Number(query?.satker_id || 0);
            const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;
            const dpoWhere: string[] = ["d.status_dpo = 'AKTIF'"];
            const dpoParams: any[] = [];

            if (hasExplicitSatker) {
                dpoWhere.push(`d.satker_id in (
                    with recursive st as (
                        select id from bdb_satker where id = ${satkerId}
                        union all
                        select s.id from bdb_satker s join st on s.parent_id = st.id
                    ) select id from st
                )`);
            } else if (!isNational && !scope.all && scope.satkerId) {
                dpoWhere.push(`d.satker_id in (
                    with recursive st as (
                        select id from bdb_satker where id = ${scope.satkerId}
                        union all
                        select s.id from bdb_satker s join st on s.parent_id = st.id
                    ) select id from st
                )`);
            }

            if (query.from) {
                dpoParams.push(query.from);
                const p = dpoParams.length;
                dpoWhere.push(`(d.tanggal_dpo >= $${p}::date or (d.tanggal_dpo is null and d.created_at >= $${p}::date))`);
            }
            if (query.to) {
                dpoParams.push(query.to);
                const p = dpoParams.length;
                dpoWhere.push(`(d.tanggal_dpo <= $${p}::date or (d.tanggal_dpo is null and d.created_at <= $${p}::date))`);
            }
            if (query.kejahatan) {
                dpoParams.push(`%${String(query.kejahatan).trim().toLowerCase()}%`);
                const p = dpoParams.length;
                dpoWhere.push(`(lower(coalesce(d.nama_kejahatan,'')) like $${p} or lower(coalesce(d.kategori_kejahatan,'')) like $${p})`);
            }
            if (query.search) {
                dpoParams.push(`%${String(query.search).trim().toLowerCase()}%`);
                const p = dpoParams.length;
                dpoWhere.push(`(lower(d.nama_dpo) like $${p} or lower(coalesce(d.nomor_identitas,'')) like $${p} or lower(d.nomor_dpo) like $${p})`);
            }

            const res = await this.dataSource.query(
                `SELECT count(*)::int as c FROM bdb_dpo d WHERE ${dpoWhere.join(' and ')}`,
                dpoParams
            );
            return Number(res?.[0]?.c || 0);
        } catch (err: any) {
            console.error('[PihakTerlibatService] countActiveDpo error:', err);
            return 0;
        }
    }

    public async getDpoArsip(id: number, res: any) {
        try {
            const rows = await this.dataSource.query(`
                SELECT d.*, 
                       s.deskripsi as satker_deskripsi,
                       jk.keterangan as jk_keterangan
                FROM bdb_dpo d
                LEFT JOIN bdb_satker s ON s.id = d.satker_id
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = d.jenis_kejahatan_id
                WHERE d.id = $1
            `, [id]);

            if (!rows || rows.length === 0) {
                return res.status(404).send('<h2 style="font-family:sans-serif;text-align:center;margin-top:40px;">Data Arsip DPO Tidak Ditemukan</h2>');
            }

            const d = rows[0];

            // Check if binary file exists in bdb_dpo_arsip
            const arsipRows = await this.dataSource.query(`
                SELECT file_name, mime_type, file_data 
                FROM bdb_dpo_arsip 
                WHERE dpo_id = $1 AND file_data IS NOT NULL
                ORDER BY id DESC LIMIT 1
            `, [id]);

            if (arsipRows && arsipRows.length > 0 && arsipRows[0].file_data) {
                const a = arsipRows[0];
                res.setHeader('Content-Type', a.mime_type || 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${a.file_name || 'arsip_dpo.pdf'}"`);
                return res.send(a.file_data);
            }


            // Generate authentic police digital archive document
            const tglStr = d.tanggal_dpo ? new Date(d.tanggal_dpo).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
            const tglReg = d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
            const satkerNama = (d.satker_nama || d.satker_deskripsi || d.nama_polda || 'KEPOLISIAN NEGARA REPUBLIK INDONESIA').toUpperCase();

            const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARSIP RESMI DPO - ${d.nomor_dpo || d.nama_dpo}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #1e293b; padding: 24px; display: flex; justify-content: center; }
        .page { background: #ffffff; width: 100%; max-width: 840px; min-height: 1050px; padding: 48px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); position: relative; }
        .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 60px; font-weight: 800; color: rgba(220, 38, 38, 0.05); text-transform: uppercase; pointer-events: none; white-space: nowrap; }
        .header { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
        .header h3 { font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #0f172a; text-transform: uppercase; }
        .header h2 { font-size: 16px; font-weight: 800; color: #1e3a8a; margin-top: 4px; text-transform: uppercase; }
        .header p { font-size: 12px; color: #475569; margin-top: 2px; }
        .title-box { text-align: center; margin: 20px 0; }
        .title-box h1 { font-size: 18px; font-weight: 900; text-decoration: underline; letter-spacing: 1.5px; color: #b91c1c; }
        .title-box p { font-size: 13px; font-weight: 700; margin-top: 4px; color: #334155; }
        .badge-status { display: inline-block; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; margin-top: 8px; letter-spacing: 1px; }
        .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 8px; margin: 24px 0 12px 0; }
        table.info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
        table.info-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        table.info-table td.lbl { width: 32%; font-weight: 600; color: #475569; background: #f8fafc; }
        table.info-table td.val { font-weight: 700; color: #0f172a; }
        .footer-sign { margin-top: 36px; display: flex; justify-content: space-between; align-items: flex-end; }
        .security-stamp { border: 2px dashed #94a3b8; padding: 12px; border-radius: 6px; font-size: 11px; color: #64748b; line-height: 1.4; max-width: 340px; }
        .sign-box { text-align: center; min-width: 240px; font-size: 13px; }
        .sign-box .satker { font-weight: 700; }
        .sign-space { height: 60px; }
        .sign-box .nama { font-weight: 800; text-decoration: underline; }
        .btn-print { position: fixed; bottom: 24px; right: 24px; background: #2563eb; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.4); display: flex; align-items: center; gap: 8px; }
        .btn-print:hover { background: #1d4ed8; }
        @media print {
            body { background: #ffffff; padding: 0; }
            .page { box-shadow: none; padding: 20px; border: none; }
            .btn-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="watermark">ARSIP RESMI DPO POLRI</div>
        <div class="header">
            <h3>KEPOLISIAN NEGARA REPUBLIK INDONESIA</h3>
            <h2>${satkerNama}</h2>
            <p>Sistem Informasi Penegakan Hukum & Analisis Perkara (CAS Big Data Binops)</p>
        </div>
        <div class="title-box">
            <h1>DAFTAR PENCARIAN ORANG (DPO)</h1>
            <p>NOMOR: ${d.nomor_dpo || '—'}</p>
            <div><span class="badge-status">STATUS DPO: ${d.status_dpo || 'AKTIF'}</span></div>
        </div>

        <div class="section-title">I. IDENTITAS BURONAN / TERSANGKA</div>
        <table class="info-table">
            <tr><td class="lbl">Nama Lengkap</td><td class="val">${d.nama_dpo || '—'}</td></tr>
            <tr><td class="lbl">Nomor Identitas (NIK)</td><td class="val">${d.nomor_identitas || 'Belum/tidak diketahui'}</td></tr>
            <tr><td class="lbl">Jenis Identitas</td><td class="val">${d.jenis_identitas || 'KTP / NIK'}</td></tr>
            <tr><td class="lbl">Kewarganegaraan</td><td class="val">${d.kewarganegaraan || 'WNI'}</td></tr>
            <tr><td class="lbl">Alamat Tinggal Terakhir</td><td class="val">${d.alamat_terakhir || '—'}</td></tr>
        </table>

        <div class="section-title">II. PERKARA & TINDAK PIDANA</div>
        <table class="info-table">
            <tr><td class="lbl">Klasifikasi Kejahatan</td><td class="val">${d.jk_keterangan || d.nama_kejahatan || '—'}</td></tr>
            <tr><td class="lbl">Kategori Kejahatan</td><td class="val">${d.kategori_kejahatan || '—'}</td></tr>
            <tr><td class="lbl">Tanggal Penetapan DPO</td><td class="val">${tglStr}</td></tr>
            <tr><td class="lbl">Satker Penerbit</td><td class="val">${satkerNama}</td></tr>
            <tr><td class="lbl">Tingkatan Satker</td><td class="val">${d.tingkatan_satker || '—'}</td></tr>
        </table>

        <div class="section-title">III. PENYIDIK PENERBIT & KONTAK</div>
        <table class="info-table">
            <tr><td class="lbl">Penyidik Penanggung Jawab</td><td class="val">${d.penyidik_nama || '—'}</td></tr>
            <tr><td class="lbl">Kontak Telepon Penyidik</td><td class="val">${d.penyidik_telp || '—'}</td></tr>
            <tr><td class="lbl">Tanggal Registrasi CAS</td><td class="val">${tglReg}</td></tr>
        </table>

        <div class="footer-sign">
            <div class="security-stamp">
                <strong>VERIFIKASI INTEGRITAS DATABASE CAS</strong><br>
                UUID Arsip: CAS-BDB-DPO-${d.id}<br>
                Dokumen arsip resmi ini diterbitkan langsung dari basis data CAS Big Data Binops Polri tanpa koneksi internet eksternal.
            </div>
            <div class="sign-box">
                <p>Ditetapkan di Tempat Penerbit</p>
                <p class="satker">${satkerNama}</p>
                <div class="sign-space"></div>
                <p class="nama">${d.penyidik_nama || 'PENYIDIK POLRI'}</p>
                <p>Penyidik Penanggung Jawab</p>
            </div>
        </div>
    </div>
    <button class="btn-print" onclick="window.print()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Cetak Dokumen Arsip
    </button>
</body>
</html>`;

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        } catch (err: any) {
            console.error('[PihakTerlibatService] getDpoArsip error:', err);
            return res.status(500).send('Internal Server Error');
        }
    }

    public async getDpoFoto(id: number, res: any) {
        try {
            const arsipRows = await this.dataSource.query(`
                SELECT file_name, mime_type, file_data 
                FROM bdb_dpo_arsip 
                WHERE dpo_id = $1 AND tipe_dokumen = 'FOTO_DPO' AND file_data IS NOT NULL
                ORDER BY id DESC LIMIT 1
            `, [id]);

            if (arsipRows && arsipRows.length > 0 && arsipRows[0].file_data) {
                const a = arsipRows[0];
                res.setHeader('Content-Type', a.mime_type || 'image/jpeg');
                return res.send(a.file_data);
            }

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="#f1f5f9"/>
                <circle cx="100" cy="75" r="40" fill="#94a3b8"/>
                <path d="M40 170 C40 130 70 120 100 120 C130 120 160 130 160 170 Z" fill="#94a3b8"/>
                <text x="100" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748b">FOTO DPO TERDAFTAR</text>
            </svg>`;
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.send(svg);
        } catch (err: any) {
            return res.status(500).send('Internal Server Error');
        }
    }

}

