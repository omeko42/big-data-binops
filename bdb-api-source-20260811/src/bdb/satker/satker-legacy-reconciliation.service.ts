import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SatkerService } from './satker.service';
import { LaporanPolisiService } from '../laporan-polisi/laporan-polisi.service';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';

type Level = 'Mabes' | 'Polda' | 'Polres' | 'Polsek';

/**
 * LP DORS yang belum termapping ke bdb_laporan_polisi -- dikelompokkan per satker penanganan
 * (level terdalam yg terisi di payload DORS: polsek > polres > polda). Sumbernya LIVE
 * (bdb_dors_raw_lp, ter-refresh tiap sync DORS), BUKAN backup cm_polda/cm_polres/cm_polsek lama
 * (itu snapshot beku sejak Mei 2025 -- lihat menu Master Data utk kelola cm_* kalau perlu).
 *
 * Fokus halaman ini: JANGAN sampai ada LP yang berisiko tidak masuk bdb_laporan_polisi krn
 * satker penanganannya belum ada di Puskarda tree (bdb_satker). Dua aksi tersedia:
 * - "Tambah ke Tree": buat node satker baru (dari kode_pusiknas atau pilih induk manual),
 *   lalu SEMUA LP di grup ini langsung dipetakan ke node itu (bukan nunggu sync).
 * - "Paksa Petakan": user pilih satker yg SUDAH ADA di tree secara manual, LP di grup ini
 *   langsung dipetakan ke situ (dipakai kalau satkernya sebenarnya sudah ada, cuma DORS
 *   kirim nama/kode yg beda format).
 * Keduanya pakai LaporanPolisiService.mapOne() per LP (bukan cuma andalkan fuzzy-match
 * otomatis) supaya hasilnya PASTI, sekaligus merekam alias (bdb_dors_satker_map) supaya LP
 * serupa berikutnya otomatis termapping juga.
 */
@Injectable()
export class SatkerLegacyReconciliationService {
    private readonly logger = new Logger('SatkerLegacyReconciliationService');
    constructor(
        private readonly dataSource: DataSource,
        private readonly satkerService: SatkerService,
        private readonly laporanPolisiService: LaporanPolisiService,
        private readonly audit: AuditService
    ) {}

    private async ensureExtension() {
        await this.dataSource.query('create extension if not exists pg_trgm');
    }

    // sama dgn LaporanPolisiService.LEVEL_SQL/KP_SQL (level & kode_pusiknas satker penanganan LP)
    private static readonly LEVEL_SQL = `
        case
            when jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
            when jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
            when jsonb_typeof(r.payload_json->'polda')='object' and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
            when jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
            else 'Mabes'
        end`;
    private static readonly KP_SQL = `
        nullif(case
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polda')='object' and (r.payload_json->'polda'->>'kode' = '060.09' or r.payload_json->'polda'->>'nama' ilike '%lampung%') then '060.01.11'
            when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode_pusiknas'
        end, '')`;
    private static readonly NAMA_SQL = `
        coalesce(r.payload_json->'polsek'->>'nama', r.payload_json->'polres'->>'nama', r.payload_json->'polda'->>'nama')`;
    // Induk LANGSUNG dari level terdalam yg terisi (polsek->induknya polres, polres->induknya polda)
    // -- WAJIB dicocokkan jg saat kandidat kemiripan nama, supaya tak salah nyambung ke satker
    // senama tapi beda provinsi/polres (mis. "Polsek Grogol" ada di Jakarta Barat DAN Kediri).
    private static readonly PARENT_NAMA_SQL = `
        case
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polres'->>'nama'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polda'->>'nama'
        end`;

    /** Normalisasi kode sblm exact-match -- kode_pusiknas dari payload DORS kadang bawa karakter
     *  tak-kelihatan (spasi trailing, non-breaking space) yg bikin "=" biasa gagal match walau
     *  keliatan identik di layar (lihat juga LaporanPolisiService.normKode, logika sama). */
    private static normKode(expr: string): string {
        return `regexp_replace(replace(coalesce((${expr}), ''), chr(160), ''), '\\s+', '', 'g')`;
    }

    /** Semua LP DORS yang belum termapping, dengan level/kode_pusiknas/nama satker penanganan. */
    private unmappedCte(): string {
        return `
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.payload_json, r.data_scope, r.synced_at,
                   ${SatkerLegacyReconciliationService.LEVEL_SQL} as level,
                   ${SatkerLegacyReconciliationService.KP_SQL} as kode_pusiknas,
                   ${SatkerLegacyReconciliationService.NAMA_SQL} as nama,
                   ${SatkerLegacyReconciliationService.PARENT_NAMA_SQL} as parent_nama
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
        `;
    }

    /** Grup (level, kode_pusiknas kalau ada / nama kalau tidak) + kandidat match di bdb_satker. */
    private groupsCte(): string {
        return `
            with unmapped as (${this.unmappedCte()}),
            grouped as (
                select level, kode_pusiknas, nama,
                       count(*)::int as lp_terdampak,
                       (array_agg(no_laporan order by no_laporan))[1:5] as contoh_no_laporan,
                       (array_agg(dors_lp_id order by no_laporan))[1] as sample_dors_lp_id,
                       (array_agg(model_lp order by no_laporan))[1] as sample_model_lp,
                       (array_agg(parent_nama order by no_laporan))[1] as parent_nama
                from unmapped
                group by level, coalesce(kode_pusiknas, 'NOKODE:' || coalesce(nama, '')), nama, kode_pusiknas
            )
            select g.*, exact.id as exact_id, exact.kode as exact_kode, exact.deskripsi as exact_deskripsi,
                   nm.id as nama_id, nm.kode as nama_kode, nm.deskripsi as nama_deskripsi, nm.sim as nama_sim
            from grouped g
            left join lateral (
                select s.id, s.kode, s.deskripsi
                from bdb_satker s
                where g.kode_pusiknas is not null
                  and ${SatkerLegacyReconciliationService.normKode('s.kode')} in (
                      ${SatkerLegacyReconciliationService.normKode('g.kode_pusiknas')},
                      ${SatkerLegacyReconciliationService.normKode(`regexp_replace(g.kode_pusiknas, '(\\.00)+$', '')`)}
                  )
                limit 1
            ) exact on true
            left join lateral (
                select s.id, s.kode, s.deskripsi, similarity(upper(s.deskripsi), upper(g.nama)) as sim
                from bdb_satker s
                left join bdb_satker par on par.id = s.parent_id
                where exact.id is null and g.nama is not null and length(g.nama) >= 4
                  and upper(s.deskripsi) % upper(g.nama)
                  -- WAJIB induknya jg mirip (kalau DORS punya info induk) -- cegah kandidat senama
                  -- tapi beda provinsi/polres (mis. "Polsek Grogol" di Jakbar vs di Kediri) ikut
                  -- disodorkan cuma krn nama daunnya kebetulan mirip.
                  and (g.parent_nama is null or par.deskripsi is null or similarity(upper(par.deskripsi), upper(g.parent_nama)) >= 0.35)
                -- alias "sim" tak bisa dipakai dlm ekspresi majemuk di ORDER BY (Postgres cuma
                -- izinkan alias polos) -- ulangi ekspresinya, bukan pakai aliasnya.
                order by similarity(upper(s.deskripsi), upper(g.nama)) + coalesce(similarity(upper(par.deskripsi), upper(g.parent_nama)), 0) desc
                limit 1
            ) nm on true
        `;
    }

    async stats() {
        try {
            await this.ensureExtension();
            await this.dataSource.query('select set_limit(0.5)');
            const rows = await this.dataSource.query(`
                with g as (${this.groupsCte()})
                select level,
                       count(*)::int as grup,
                       sum(lp_terdampak)::int as lp_terdampak,
                       count(*) filter (where exact_id is not null)::int as grup_cocok
                from g group by level order by level
            `);
            const totalLp = await this.dataSource.query(`
                select count(*)::int as c from bdb_dors_raw_lp r
                where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
            `);
            return { status: 1, data: { per_level: rows, total_lp_belum_termapping: totalLp[0]?.c || 0 } };
        } catch (e: any) {
            // JANGAN biarkan gagal diam-diam -- ErrorExceptionFilter global mengubah exception jadi
            // HTTP 200 {status:0} TANPA mencatat apapun ke log server, jadi tanpa log eksplisit di
            // sini, bug SQL semacam ini nyaris mustahil dilacak (persis kejadian nyata: "sim" typo
            // di query nm bikin halaman diam2 nampilin 0 selama entah berapa lama tanpa jejak).
            this.logger.error(`stats() gagal: ${e?.message || e}`);
            throw e;
        }
    }

    async list(opts: { level?: Level; search?: string; onlyUnmatched?: boolean; page?: number; row?: number }) {
        try {
            await this.ensureExtension();
            await this.dataSource.query('select set_limit(0.5)');
            const page = Math.max(opts.page || 1, 1);
            const row = Math.min(Math.max(opts.row || 25, 1), 1000);
            const offset = (page - 1) * row;

            const whereClauses: string[] = [];
            const params: any[] = [];
            if (opts.level) {
                params.push(opts.level);
                whereClauses.push(`level = $${params.length}`);
            }
            if (opts.search) {
                params.push(`%${opts.search.toUpperCase()}%`);
                whereClauses.push(`(upper(coalesce(nama,'')) like $${params.length} or upper(coalesce(kode_pusiknas,'')) like $${params.length})`);
            }
            if (opts.onlyUnmatched) {
                whereClauses.push(`exact_id is null`);
            }
            const where = whereClauses.length ? `where ${whereClauses.join(' and ')}` : '';

            const rows = await this.dataSource.query(
                `
                with g as (${this.groupsCte()})
                select * from g
                ${where}
                order by lp_terdampak desc, level, nama
                limit ${row} offset ${offset}
                `,
                params
            );
            const countRes = await this.dataSource.query(`with g as (${this.groupsCte()}) select count(*)::int as c from g ${where}`, params);
            return {
                status: 1,
                data: rows.map((r: any) => ({
                    level: r.level,
                    kode_pusiknas: r.kode_pusiknas,
                    nama: r.nama,
                    lp_terdampak: r.lp_terdampak,
                    contoh_no_laporan: r.contoh_no_laporan || [],
                    match:
                        r.exact_id != null
                            ? { tipe: 'kode', id: Number(r.exact_id), kode: r.exact_kode, deskripsi: r.exact_deskripsi }
                            : r.nama_id != null
                              ? { tipe: 'nama', id: Number(r.nama_id), kode: r.nama_kode, deskripsi: r.nama_deskripsi, kemiripan: Number(r.nama_sim) }
                              : null,
                })),
                total: countRes[0]?.c || 0,
                page,
                row,
            };
        } catch (e: any) {
            this.logger.error(`list() gagal: ${e?.message || e}`);
            throw e;
        }
    }

    /**
     * Hapus SEMUA baris DORS mentah (bdb_dors_raw_lp) yang cocok dengan filter halaman ini
     * (level/search/onlyUnmatched -- sama persis dgn yg dipakai list()) -- superadmin-only.
     * Sama seperti LaporanPolisiService.deleteAllUnmapped: hanya membersihkan staging, LP yang
     * sudah termapping ke bdb_laporan_polisi tidak tersentuh, dan sync DORS berikutnya akan
     * menarik ulang datanya. Dipakai utk pemulihan kondisi "satker kosong tapi terlanjur sync
     * DORS di prod".
     */
    async deleteAllUnmapped(opts: { level?: Level; search?: string; onlyUnmatched?: boolean }, userId?: number) {
        await this.ensureExtension();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Hanya superadmin yang dapat menghapus data LP tanpa satker.');
        }
        await this.dataSource.query('select set_limit(0.5)');

        const whereClauses: string[] = [];
        const params: any[] = [];
        if (opts.level) {
            params.push(opts.level);
            whereClauses.push(`level = $${params.length}`);
        }
        if (opts.search) {
            params.push(`%${opts.search.toUpperCase()}%`);
            whereClauses.push(`(upper(coalesce(nama,'')) like $${params.length} or upper(coalesce(kode_pusiknas,'')) like $${params.length})`);
        }
        if (opts.onlyUnmatched) {
            whereClauses.push(`exact_id is null`);
        }
        const where = whereClauses.length ? `where ${whereClauses.join(' and ')}` : '';

        const ret = await this.dataSource.query(
            `
            with g as (${this.groupsCte()}),
            target_groups as (select level, kode_pusiknas, nama from g ${where}),
            unmapped as (${this.unmappedCte()})
            delete from bdb_dors_raw_lp
            where id in (
                select u.raw_id from unmapped u
                join target_groups tg on tg.level = u.level
                    and coalesce(tg.kode_pusiknas, 'NOKODE:' || coalesce(tg.nama, '')) = coalesce(u.kode_pusiknas, 'NOKODE:' || coalesce(u.nama, ''))
            )
            returning id
            `,
            params
        );
        // DELETE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
        const deleted = Array.isArray(ret?.[0]) ? ret[0].length : 0;

        let userNama: string | null = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        await this.audit.log({
            userId,
            userName: userNama || undefined,
            action: 'DELETE_ALL_SATKER_LEGACY',
            entity: 'dors_raw_lp',
            meta: { deleted, level: opts.level || null, search: opts.search || null, only_unmatched: !!opts.onlyUnmatched }
        });

        return { status: 1, data: { deleted }, message: `${deleted} data LP tanpa satker dihapus.` };
    }

    /** Normalisasi teks unit sebelum dibandingkan -- huruf besar semua, buang non-alfanumerik
     *  (sama dgn LaporanPolisiService.remapDeeper/applyUnitAliases), supaya beda spasi/tanda
     *  baca antar sumber tidak bikin gagal cocok. */
    private static normUnit(expr: string): string {
        return `upper(regexp_replace(coalesce((${expr}), ''), '[^A-Za-z0-9]', '', 'g'))`;
    }

    /** Semua LP DORS (belum termapping) dalam satu grup -- utk drill-down & dasar aksi bulk.
     *  Kalau unitNama diisi, di-scope HANYA ke LP dgn unit itu (jalur "petakan per unit"). */
    private async groupRawRows(level: Level, kodePusiknas: string | null, nama: string | null, unitNama?: string | null) {
        const params: any[] = [level];
        let cond: string;
        if (kodePusiknas) {
            params.push(kodePusiknas);
            cond = `kode_pusiknas = $2`;
        } else {
            params.push(nama || '');
            cond = `kode_pusiknas is null and coalesce(nama,'') = $2`;
        }
        let unitCond = '';
        if (unitNama) {
            params.push(unitNama);
            unitCond = `and ${SatkerLegacyReconciliationService.normUnit('payload_json->\'unit\'->>\'unit\'')} = ${SatkerLegacyReconciliationService.normUnit(`$${params.length}`)}`;
        }
        return this.dataSource.query(
            `
            with unmapped as (${this.unmappedCte()})
            select * from unmapped where level = $1 and ${cond} ${unitCond}
            order by no_laporan
            `,
            params
        );
    }

    /** Detail LP dalam satu grup -- dipakai dialog drill-down di frontend. */
    async groupDetail(level: Level, kodePusiknas: string | null, nama: string | null) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama);
        return {
            status: 1,
            data: rows.map((r: any) => {
                const p = r.payload_json || {};
                return {
                    raw_id: r.raw_id,
                    dors_lp_id: r.dors_lp_id,
                    model_lp: r.model_lp,
                    no_laporan: r.no_laporan,
                    tgl_laporan: p.tgl_laporan || null,
                    kategori: p.kategori || null,
                    tempat_kejadian: p.tempat_kejadian || null,
                    uraian_singkat: p.uraian_singkat_kejadian || p.uraian_kejadian || null,
                    unit_nama: p.unit?.unit || null,
                    unit_level: p.unit?.level || null,
                    polda_nama: p.polda?.nama || null,
                    polda_kp: p.polda?.kode_pusiknas || null,
                    polres_nama: p.polres?.nama || null,
                    polres_kp: p.polres?.kode_pusiknas || null,
                    polsek_nama: p.polsek?.nama || null,
                    polsek_kp: p.polsek?.kode_pusiknas || null,
                    // Payload penuh + metadata staging -- dipakai frontend utk "Lihat Detail" (dialog
                    // detail LENGKAP yg sama dgn menu Data LP DORS, lihat DorsLpDetailDialog).
                    data_scope: r.data_scope || null,
                    synced_at: r.synced_at || null,
                    payload_json: p,
                };
            }),
        };
    }

    /** Info sebelum tambah ke tree -- kode/induk yang akan dipakai kalau jalur "otomatis". */
    async previewAddToTree(level: Level, kodePusiknas: string | null, nama: string | null, unitNama?: string | null) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama, unitNama);
        if (!rows.length) throw new BadRequestException('Grup LP ini tidak ditemukan (mungkin sudah termapping).');
        let parentPreview: { kode: string; deskripsi: string } | null = null;
        if (kodePusiknas) {
            const segs = kodePusiknas.split('.');
            for (let cut = segs.length - 1; cut >= 1 && !parentPreview; cut--) {
                const candidate = segs.slice(0, cut).join('.');
                const r = await this.dataSource.query(
                    `select kode, deskripsi from bdb_satker where ${SatkerLegacyReconciliationService.normKode('kode')} = ${SatkerLegacyReconciliationService.normKode('$1')} or ${SatkerLegacyReconciliationService.normKode('kode_canonical')} = ${SatkerLegacyReconciliationService.normKode('$1')}`,
                    [candidate]
                );
                if (r[0]) parentPreview = r[0];
            }
        }
        return { status: 1, data: { nama, kode_pusiknas: kodePusiknas, lp_terdampak: rows.length, induk_otomatis: parentPreview } };
    }

    /**
     * Petakan LP dalam satu grup ke satker tujuan (pasti, bukan bergantung fuzzy-match).
     *
     * @param unitNama Kalau diisi: SCOPE ke LP dgn unit itu saja (dari payload DORS), dan alias
     *   yg direkam juga di-scope ke unit itu (lihat LaporanPolisiService.mapOne). Dipakai jalur
     *   "petakan per unit" -- satu grup kode_pusiknas (mis. Mabes Polri) yg berisi LP dari
     *   beberapa unit berbeda (mis. PPA vs Korpolairud) bisa dipetakan ke node tree BERBEDA
     *   per unit, bukan disamaratakan ke satu node.
     *   Kalau kosong: SELURUH grup dipetakan ke satkerId yg sama (perilaku asli), lalu
     *   remapDeeper() dijalankan supaya unit-unit di dalamnya tetap diarahkan ke anak satker
     *   yg sesuai (via config/dors-unit-mapping.json) -- tak perlu lagi kalau sudah di-scope
     *   per unit, krn satkerId yg dipilih SUDAH presisi utk unit itu.
     */
    private async mapGroupTo(level: Level, kodePusiknas: string | null, nama: string | null, satkerId: number, unitNama?: string | null) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama, unitNama);
        let mapped = 0;
        for (const r of rows) {
            try {
                await this.laporanPolisiService.mapOne(Number(r.dors_lp_id), r.model_lp, satkerId, unitNama);
                mapped++;
            } catch (e: any) {
                this.logger.warn(`Gagal mapOne dors_lp_id=${r.dors_lp_id}: ${e?.message || e}`);
            }
        }
        if (!unitNama) {
            // PENTING: satu grup (level Polda/Polres/Polsek) bisa berisi LP dari BEBERAPA unit
            // berbeda (mis. SATRESKRIM, SATRESNARKOBA, SATLANTAS semua di bawah polres yg sama).
            // mapOne() di atas menaruh semua LP ke `satkerId` yg SAMA (pilihan/hasil buat user) --
            // remapDeeper() lah yang mencocokkan unit_nama tiap LP (dari payload DORS) ke anak
            // satker yg tepat (via config/dors-unit-mapping.json), jadi hasilnya presisi per-unit,
            // bukan seluruh grup nempel ke satu node yg sama.
            try {
                await this.laporanPolisiService.remapDeeper();
            } catch (e: any) {
                this.logger.warn('Gagal remapDeeper setelah mapGroupTo: ' + (e?.message || e));
            }
        }
        return mapped;
    }

    /**
     * Tambahkan satker baru ke tree (otomatis dari kode_pusiknas grup ini, atau induk manual),
     * lalu langsung petakan SEMUA LP grup ini ke node baru tsb.
     */
    async addToTree(opts: { level: Level; kode_pusiknas: string | null; nama: string; kode?: string; parent_id?: number; segment?: string; unit_nama?: string | null }) {
        const deskripsi = (opts.nama || '').trim();
        if (!deskripsi) throw new BadRequestException('Nama satker wajib diisi.');

        let created: { status: number; data: { id: number; kode: string }; message: string };
        if (opts.parent_id && opts.segment) {
            created = await this.satkerService.create({ parent_id: opts.parent_id, segment: opts.segment, deskripsi });
        } else {
            const kode = (opts.kode || opts.kode_pusiknas || '').trim();
            if (!kode) throw new BadRequestException('Kode Puskarda kosong -- pilih induk manual + segmen.');
            created = await this.satkerService.create({ kode, deskripsi });
        }

        const mapped = await this.mapGroupTo(opts.level, opts.kode_pusiknas, opts.nama, created.data.id, opts.unit_nama);
        const cakupan = opts.unit_nama ? ` (unit "${opts.unit_nama}")` : '';
        this.logger.log(`"${deskripsi}" ditambahkan ke tree (id ${created.data.id}, kode ${created.data.kode}), ${mapped} LP langsung termapping${cakupan}`);
        return {
            status: 1,
            data: { ...created.data, lp_mapped: mapped },
            message: mapped > 0 ? `Satker "${deskripsi}" ditambahkan ke tree, dan ${mapped} LP${cakupan} langsung termapping ke Laporan Polisi.` : `Satker "${deskripsi}" ditambahkan ke tree, tapi tidak ada LP yang berhasil dipetakan otomatis.`,
        };
    }

    /** Paksa petakan LP grup ini (atau LP unit tertentu dlm grup itu, kalau unit_nama diisi) ke satker yang SUDAH ADA di tree (dipilih manual). */
    async forceMap(opts: { level: Level; kode_pusiknas: string | null; nama: string; satker_id: number; unit_nama?: string | null }) {
        const s = await this.dataSource.query('select id, deskripsi from bdb_satker where id = $1', [opts.satker_id]);
        if (!s.length) throw new BadRequestException('Satker tujuan tidak ditemukan.');
        const mapped = await this.mapGroupTo(opts.level, opts.kode_pusiknas, opts.nama, opts.satker_id, opts.unit_nama);
        const cakupan = opts.unit_nama ? ` (unit "${opts.unit_nama}")` : '';
        this.logger.log(`Paksa petakan "${opts.nama}"${cakupan} -> ${s[0].deskripsi} (id ${opts.satker_id}), ${mapped} LP termapping`);
        return {
            status: 1,
            data: { satker_id: opts.satker_id, satker_nama: s[0].deskripsi, lp_mapped: mapped },
            message: mapped > 0 ? `${mapped} LP${cakupan} dipetakan paksa ke "${s[0].deskripsi}".` : `Tidak ada LP yang berhasil dipetakan (mungkin sudah termapping).`,
        };
    }

    /** Jalur root->node dari bdb_satker, dipakai frontend utk tampilkan posisi kandidat di tree. */
    async path(satkerId: number) {
        const rows = await this.dataSource.query(
            `
            with recursive up as (
                select id, kode, deskripsi, parent_id, 0 as lvl from bdb_satker where id = $1
                union all
                select s.id, s.kode, s.deskripsi, s.parent_id, up.lvl + 1
                from bdb_satker s join up on s.id = up.parent_id
            )
            select id, kode, deskripsi from up order by lvl desc
            `,
            [satkerId]
        );
        return { status: 1, data: rows };
    }
}
