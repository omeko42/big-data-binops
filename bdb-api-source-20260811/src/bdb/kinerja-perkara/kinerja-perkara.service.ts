import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { computeIndeks, levelOf, round2 } from './indeks.util';
import { isPrimaryClusterInstance } from '../common/cluster-instance.util';
import { computeKinerjaRates, roundRate } from './rates.util';
import { buildKinerjaScopePlan, buildNationalKinerjaScopePlan } from './kinerja-scope.util';

// tgl_laporan = teks 'DD-MM-YYYY HH:MM:SS'; fallback ke synced_at bila format tak sesuai.
// Sama persis dgn DATE_EXPR di anev.service.ts, supaya konsisten dgn laporan lain.
const DATE_EXPR = "(case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else lp.synced_at::date end)";

// Rincian status di dalam bucket CP (LP masih diproses) -- "Format Tabel Kinerja" resmi: tiap
// bucket (Aktual/Tunggakan) dipecah lagi per status penanganan saat ini.
const CP_BREAKDOWN: { key: string; code: string }[] = [
    { key: 'lidik', code: 'PENYELIDIKAN' },
    { key: 'sidik', code: 'PENYIDIKAN' },
    { key: 'spdp', code: 'SPDP' },
    { key: 'thp1', code: 'TAHAP_I' },
    { key: 'p19', code: 'P19' },
    { key: 'p21', code: 'P21' }
];
// Rincian status di dalam bucket CC (LP sudah selesai). RJ (Restorative Justice) BUKAN status
// tersendiri -- dia salah satu pilihan "Alasan Dihentikan" pada form dokumen SP2_LIDIK/SP3 (lihat
// form_schema di bdb_document_type_master, field_key "alasan_penghentian"), jadi dipisah dari
// sp2lid/sp3 di sini (bukan status_code baru) supaya total rincian tetap = total bucket (tak
// dobel-hitung -- kasus RJ DIKELUARKAN dari sp2lid/sp3, bukan ditambahkan di atasnya).
// Match via ILIKE substring, BUKAN persamaan persis -- form_schema-nya bisa diedit superadmin
// lewat menu Alur Dokumen (mis. ganti kata "Penyelesaian luar proses peradilan / " di depannya),
// jadi cocokkan kata intinya. DUA kondisi (OR): "restorat" (cakup ejaan Inggris "Restorative" &
// Indonesia "Restoratif") ATAU singkatan "RJ" berdiri sendiri sbg KATA UTUH (\y = word boundary
// di regex Postgres) -- bukan substring polos, krn "rj" polos nyangkut di banyak kata Indonesia
// biasa (keRJa, beRJalan, teRJadi, dst), jadi \yrj\y wajib supaya "RJ"/"(RJ)" match tapi
// "kerja"/"berjalan" TIDAK.
const ALASAN_RJ_LIKE = '%restorat%';
const ALASAN_RJ_WORD_RE = '\\yrj\\y';
// RJ dipecah lagi per asal dokumen penutupnya (SP2LID vs SP3) -- keduanya sama-sama "RJ", cuma
// beda status_code saat ini, jadi kondisinya tinggal tambah "and is_rj"/"and not is_rj" ke kondisi
// sp2lid/sp3 di atas (tak perlu logika baru).
const CC_BREAKDOWN: { key: string; cond: string }[] = [
    { key: 'sp2lid', cond: "status_code = 'SP2_LIDIK' and not is_rj" },
    { key: 'sp3', cond: "status_code = 'SP3' and not is_rj" },
    { key: 'rj_sp2lid', cond: "status_code = 'SP2_LIDIK' and is_rj" },
    { key: 'rj_sp3', cond: "status_code = 'SP3' and is_rj" },
    { key: 'thp2', cond: "status_code = 'TAHAP_II'" }
];

type Node = {
    id: number;
    kode: string;
    nama: string;
    parent_id: number | null;
    depth: number;
    urutan: number | null;
    ct: number;
    ct_model_a: number;
    ct_model_b: number;
    cp_berjalan: number;
    cp_tunggakan: number;
    cc_aktual: number;
    cc_tunggakan: number;
    belum_kesulitan: number;
    jumlah_penduduk: number;
    status: Record<string, number>;
    cp_berjalan_rincian: Record<string, number>;
    cp_tunggakan_rincian: Record<string, number>;
    cc_aktual_rincian: Record<string, number>;
    cc_tunggakan_rincian: Record<string, number>;
};
type CrimeClockOut = { hari: number; jam: number; menit: number; detik: number; label: string };
type Metrics = { cr: number; cr_lama: number; pr: number; pr_lama: number; level: number; indeks: number; crime_rate: number | null; crime_clock: CrimeClockOut | null; crime_clock_detik: number | null };
type TreeNode = Node & Metrics & { children: TreeNode[] };
type LiteNode = Node & Metrics & { has_children: boolean };

type SatkerRow = { id: number; kode: string; deskripsi: string; parent_id: number | null; depth: number; jumlah_penduduk: string | null; tipe_satker: string; urutan: number | null };

@Injectable()
export class KinerjaPerkaraService implements OnModuleInit {
    private readonly logger = new Logger(KinerjaPerkaraService.name);

    // bdb_satker punya ~18.7k baris (seluruh Puskarda nasional) tapi strukturnya nyaris tak pernah
    // berubah -- tanpa cache ini, buildTree() query+transfer ulang seluruh tabel di SETIAP panggilan
    // (root rekap, summary, tiap klik expand baris, dashboard Ringkasan), padahal isinya sama terus.
    private satkerCache: { rows: SatkerRow[]; at: number } | null = null;
    private static readonly SATKER_CACHE_TTL_MS = 10 * 60 * 1000;

    constructor(private readonly ds: DataSource) {}

    /** Dipanggil SatkerService tiap ada perubahan satker (tambah/ubah/hapus/toggle kinerja_aktif) --
     *  tanpa ini, exclude/tree bisa nyangkut versi lama sampai 10 menit (SATKER_CACHE_TTL_MS),
     *  bikin superadmin nge-toggle "Ikut rekap Kinerja Perkara" tapi hasilnya belum berubah. */
    clearCache() {
        this.satkerCache = null;
        this.excludedSatkerCache = null;
    }

    private async getSatkerTree(): Promise<SatkerRow[]> {
        if (this.satkerCache && Date.now() - this.satkerCache.at < KinerjaPerkaraService.SATKER_CACHE_TTL_MS) {
            return this.satkerCache.rows;
        }
        const rawRows = await this.ds.query('select id, kode, deskripsi, parent_id, depth, jumlah_penduduk, tipe_satker, urutan from bdb_satker');
        // Kolom bigint dari node-postgres datang sebagai string. Seluruh Map/Set di buildTree
        // harus memakai satu tipe yang sama; kalau id child berupa string tetapi parent/scope
        // berupa number, roll-up berhenti di child dan baris Polres/Polda bisa tampil 0.
        const rows: SatkerRow[] = rawRows.map((s: any) => ({
            id: Number(s.id),
            kode: String(s.kode ?? ''),
            deskripsi: String(s.deskripsi ?? ''),
            parent_id: s.parent_id == null ? null : Number(s.parent_id),
            depth: Number(s.depth) || 0,
            jumlah_penduduk: s.jumlah_penduduk,
            tipe_satker: String(s.tipe_satker ?? ''),
            urutan: s.urutan == null ? null : Number(s.urutan)
        }));
        this.satkerCache = { rows, at: Date.now() };
        return rows;
    }

    // Satker yg superadmin kecualikan manual dari rekap Kinerja Perkara (bdb_satker.kinerja_aktif=false,
    // dikelola di menu Struktur Satker) -- LP-nya dikeluarkan sepenuhnya dari CT/CP/CC/status (bukan
    // cuma disembunyikan barisnya), spy tak ikut merusak angka rollup satker leluhurnya jg.
    private excludedSatkerCache: { ids: number[]; at: number } | null = null;
    private async getExcludedSatkerIds(): Promise<number[]> {
        if (this.excludedSatkerCache && Date.now() - this.excludedSatkerCache.at < KinerjaPerkaraService.SATKER_CACHE_TTL_MS) {
            return this.excludedSatkerCache.ids;
        }
        const rows = await this.ds.query('select id from bdb_satker where kinerja_aktif = false');
        const ids = rows.map((r: any) => Number(r.id));
        this.excludedSatkerCache = { ids, at: Date.now() };
        return ids;
    }

    /**
     * Jumlah penduduk utk Crime Rate. Kunci: Polsek adalah satuan penduduk asli (1 kecamatan =
     * 1 Polsek), Polres = jumlah Polsek-nya, Polda = jumlah Polres-nya, Mabes/nasional = jumlah
     * semua Polda. bdb_satker.tipe_satker (POLDA/POLRES/POLSEK vs FUNGSI utk satuan organisasi
     * spt SAT RESKRIM/BAG OPS -- lihat sql/bdb/068) sudah membedakan mana yg wilayah geografis
     * sungguhan. Algoritma per node: PAKAI JUMLAH ANAK kalau ada breakdown di bawahnya (paling
     * akurat, dan otomatis MENGABAIKAN nilai sendiri kalau ternyata kebetulan JUGA terisi --
     * self-correcting thd dobel-isi Polda+Polres yg sama), fallback ke nilai sendiri HANYA kalau
     * node ini WILAYAH (POLDA/POLRES/POLSEK) dan tak py breakdown anak sama sekali (mis. Polres yg
     * blm dipecah per-Polsek di tree). Satker FUNGSI tak pernah jadi sumber angka penduduk sendiri
     * (nilainya, kalau kebetulan ada, selalu diabaikan) tapi tetap diteruskan breakdown anaknya
     * (kalau strukturnya tak lazim, unit fungsi punya anak wilayah).
     * startIds null = nasional (dari root), terisi = subtree satker tsb saja (sesuai scope operator).
     */
    /** Hitung jumlah_penduduk yg BENAR utk SEMUA id satker sekaligus (bottom-up, child-priority,
     *  self-correcting) -- dipakai baik utk total nasional/scope (sumLeafPopulation) maupun utk
     *  ngisi kolom Jumlah Penduduk per baris di grid (lihat pemanggil di rekap()/exportRows()).
     *  Satu sumber kebenaran spy tak ada 2 algoritma beda yg gampang divergen kaya sebelumnya. */
    private computePopulationById(satkers: SatkerRow[]): Map<number, number> {
        const childrenOf = new Map<number, number[]>();
        const byId = new Map<number, SatkerRow>();
        for (const s of satkers) {
            byId.set(s.id, s);
            if (s.parent_id != null) {
                const arr = childrenOf.get(s.parent_id) || [];
                arr.push(s.id);
                childrenOf.set(s.parent_id, arr);
            }
        }
        const memo = new Map<number, number>();
        const sumFrom = (id: number): number => {
            if (memo.has(id)) return memo.get(id)!;
            const kids = childrenOf.get(id) || [];
            const childrenSum = kids.reduce((a, k) => a + sumFrom(k), 0);
            let result = childrenSum;
            if (childrenSum === 0) {
                const s = byId.get(id);
                if (s && s.tipe_satker !== 'FUNGSI') {
                    const v = s.jumlah_penduduk != null ? Number(s.jumlah_penduduk) : NaN;
                    result = Number.isFinite(v) ? v : 0;
                }
            }
            memo.set(id, result);
            return result;
        };
        for (const s of satkers) sumFrom(s.id);
        return memo;
    }

    private sumLeafPopulation(satkers: SatkerRow[], startIds: number[] | null): number {
        const memo = this.computePopulationById(satkers);
        const roots = startIds && startIds.length ? startIds : satkers.filter((s) => s.parent_id == null).map((s) => s.id);
        return roots.reduce((a, id) => a + (memo.get(id) ?? 0), 0);
    }

    /** Bagian bernilai 0 boleh disembunyikan; detik dibulatkan di tahap akhir (bukan tiap konversi). */
    private formatCrimeClock(totalSeconds: number): { hari: number; jam: number; menit: number; detik: number; label: string } {
        const rounded = Math.max(0, Math.round(totalSeconds));
        const hari = Math.floor(rounded / 86400);
        const sisaJam = rounded % 86400;
        const jam = Math.floor(sisaJam / 3600);
        const sisaMenit = sisaJam % 3600;
        const menit = Math.floor(sisaMenit / 60);
        const detik = sisaMenit % 60;
        const parts: string[] = [];
        if (hari) parts.push(`${hari} Hari`);
        if (jam) parts.push(`${jam} Jam`);
        if (menit) parts.push(`${menit} Menit`);
        if (detik || !parts.length) parts.push(`${detik} Detik`);
        return { hari, jam, menit, detik, label: `Selang ${parts.join(' ')}` };
    }

    /** Cuma proses primer (lihat isPrimaryClusterInstance()) -- 32 proses PM2 cluster refresh
     *  snapshot bersamaan saat boot bikin "duplicate key" ke bdb_kinerja_perkara_snapshot
     *  (insiden 5 Agu 2026). ensureTable() tetap jalan di semua proses (CREATE TABLE IF NOT
     *  EXISTS, murah & aman diulang). */
    async onModuleInit() {
        try {
            await this.ensureTable();
            if (!isPrimaryClusterInstance()) return;
            await this.refreshSnapshot();
        } catch (e: any) {
            this.logger.warn('refresh snapshot awal gagal: ' + (e?.message || e));
        }
    }

    /** Refresh otomatis tiap 30 menit -- pisah dari tabel transaksional bdb_laporan_polisi. Cuma
     *  proses primer, sama alasan spt onModuleInit() di atas. */
    @Interval(30 * 60 * 1000)
    async scheduledRefresh() {
        if (!isPrimaryClusterInstance()) return;
        try {
            await this.refreshSnapshot();
            this.logger.log('Snapshot kinerja perkara diperbarui (jadwal 30 menit).');
        } catch (e: any) {
            this.logger.error('refresh snapshot terjadwal gagal: ' + (e?.message || e));
        }
    }

    private async ensureTable() {
        await this.ds.query(`
            create table if not exists bdb_kinerja_perkara_snapshot (
                lp_id bigint primary key,
                satker_id bigint,
                tanggal_mulai_penanganan date,
                tanggal_selesai date,
                tingkat_kesulitan text,
                kesulitan_belum_dipilih boolean not null default false,
                batas_hari integer not null default 30,
                tanggal_jatuh_tempo date,
                status_code text,
                jenis_kejahatan_id bigint,
                refreshed_at timestamptz not null default now()
            );
        `);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists status_code text;`);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists jenis_kejahatan_id bigint;`);
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists model_lp text;`);
        // is_rj: apakah dokumen penutup LP ini (SP2_LIDIK/SP3, sesuai status_code saat ini) diisi
        // "Alasan Dihentikan" mengandung Restorative/Restoratif Justice atau singkatan RJ -- lihat
        // ALASAN_RJ_LIKE/ALASAN_RJ_WORD_RE & CC_BREAKDOWN.
        await this.ds.query(`alter table bdb_kinerja_perkara_snapshot add column if not exists is_rj boolean not null default false;`);
    }

    /** Full rebuild snapshot dari bdb_laporan_polisi (dipanggil scheduler/init/tombol refresh manual). */
    async refreshSnapshot() {
        await this.ensureTable();
        await this.ds.query('delete from bdb_kinerja_perkara_snapshot');
        await this.ds.query(
            `
            insert into bdb_kinerja_perkara_snapshot
                (lp_id, satker_id, tanggal_mulai_penanganan, tanggal_selesai, tingkat_kesulitan, kesulitan_belum_dipilih, batas_hari, tanggal_jatuh_tempo, status_code, jenis_kejahatan_id, model_lp, is_rj, refreshed_at)
            select
                lp.id,
                -- Pakai unit_satker_id (anak satker yg lebih spesifik, mis. SATRESKRIM di bawah
                -- POLRES) kalau sudah teridentifikasi remapDeeper() -- BUKAN cuma satker_id
                -- (Polres/Polda-nya saja). buildTree() di bawah roll-up angka dari satker_id snapshot
                -- ini ke SEMUA leluhurnya (while-loop jalan ke atas), jadi kalau satker_id yg dicatat
                -- di sini cuma level Polres, angka SELAMANYA nempel di baris Polres & tak pernah
                -- turun ke baris SATRESKRIM/SATNARKOBA dst di bawahnya (baris itu tetap 0 selamanya).
                -- Level Mabes tidak kena masalah ini krn mapMabesByUnit() sudah langsung isi
                -- satker_id ke anak yg tepat (unit_satker_id di situ selalu null).
                coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                coalesce(pel.received_at, ${DATE_EXPR}) as tanggal_mulai_penanganan,
                lp.tanggal_selesai,
                lp.tingkat_kesulitan,
                (lp.tingkat_kesulitan is null) as kesulitan_belum_dipilih,
                case lp.tingkat_kesulitan
                    when 'Mudah' then 30
                    when 'Sedang' then 60
                    when 'Sulit' then 90
                    when 'Sangat Sulit' then 120
                    else 30
                end as batas_hari,
                (coalesce(pel.received_at, ${DATE_EXPR}) + (
                    case lp.tingkat_kesulitan
                        when 'Mudah' then 30 when 'Sedang' then 60 when 'Sulit' then 90 when 'Sangat Sulit' then 120 else 30
                    end || ' days')::interval)::date as tanggal_jatuh_tempo,
                st.code as status_code,
                lp.jenis_kejahatan_id,
                lp.model_lp,
                coalesce(dok.alasan_penghentian ilike $1 or dok.alasan_penghentian ~* $2, false) as is_rj,
                now()
            from bdb_laporan_polisi lp
            left join bdb_status_master st on st.id = lp.status_id
            left join lateral (
                select p.created_at::date as received_at
                from bdb_lp_pelimpahan p where p.lp_id = lp.id order by p.created_at desc limit 1
            ) pel on true
            -- Dokumen "penutup" LP -- SP2_LIDIK/SP3 yg jenisnya cocok dgn status LP saat ini
            -- (kalau ada >1 versi/koreksi, ambil yg terbaru). alasan_penghentian dari form_schema
            -- dinamis bdb_document_type_master (field select "Alasan Dihentikan").
            left join lateral (
                select d.data->>'alasan_penghentian' as alasan_penghentian
                from bdb_dokumen d
                join bdb_document_type_master dt on dt.id = d.document_type_id
                where d.lp_id = lp.id and dt.code = st.code
                order by d.created_at desc
                limit 1
            ) dok on true
            where lp.deleted_at is null
        `,
            [ALASAN_RJ_LIKE, ALASAN_RJ_WORD_RE]
        );
        return this.lastRefreshedAt();
    }

    async lastRefreshedAt(): Promise<string | null> {
        await this.ensureTable();
        const r = await this.ds.query('select max(refreshed_at) as t from bdb_kinerja_perkara_snapshot');
        return r[0]?.t ? new Date(r[0].t).toISOString() : null;
    }

    private normPeriod(from?: string, to?: string) {
        const now = new Date();
        const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const defaultTo = now.toISOString().slice(0, 10);
        return { from: from || defaultFrom, to: to || defaultTo };
    }

    /**
     * Ekspresi FILTER per mode acuan tanggal periode:
     * - 'both'   (default, sesuai ketentuan resmi): CT dari tanggal_mulai_penanganan, CC dari tanggal_selesai,
     *            CP = LP yg masih terbuka per akhir periode (bukan disaring oleh tanggal mulai).
     * - 'mulai'  (kohort tanggal LP/mulai penanganan): populasi = LP yg tanggal_mulai_penanganan jatuh di periode,
     *            lalu dipilah CP (masih terbuka) vs CC Aktual/Tunggakan (sudah selesai) dari kohort itu.
     * - 'selesai'(kohort tanggal selesai/CC): populasi = LP yg tanggal_selesai jatuh di periode (otomatis semua closed,
     *            CP selalu 0), CT = total kohort itu, dipilah CC Aktual/Tunggakan.
     */
    private countExprs(mode: 'mulai' | 'selesai' | 'both') {
        if (mode === 'mulai') {
            return {
                ct: '(tanggal_mulai_penanganan between $1 and $2)',
                cp_berjalan: '(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and tanggal_jatuh_tempo >= $2::date)',
                cp_tunggakan: '(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is null and tanggal_jatuh_tempo < $2::date)',
                cc_aktual: '(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is not null and tanggal_selesai <= tanggal_jatuh_tempo)',
                cc_tunggakan: '(tanggal_mulai_penanganan between $1 and $2 and tanggal_selesai is not null and tanggal_selesai > tanggal_jatuh_tempo)',
                belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_mulai_penanganan between $1 and $2)'
            };
        }
        if (mode === 'selesai') {
            return {
                ct: '(tanggal_selesai between $1 and $2)',
                cp_berjalan: 'false',
                cp_tunggakan: 'false',
                cc_aktual: '(tanggal_selesai between $1 and $2 and tanggal_selesai <= tanggal_jatuh_tempo)',
                cc_tunggakan: '(tanggal_selesai between $1 and $2 and tanggal_selesai > tanggal_jatuh_tempo)',
                belum_kesulitan: '(kesulitan_belum_dipilih and tanggal_selesai between $1 and $2)'
            };
        }
        return {
            ct: '(tanggal_selesai is null or (tanggal_mulai_penanganan between $1 and $2))',
            cp_berjalan: '(tanggal_selesai is null and tanggal_jatuh_tempo >= $2::date)',
            cp_tunggakan: '(tanggal_selesai is null and tanggal_jatuh_tempo < $2::date)',
            cc_aktual: '(tanggal_selesai between $1 and $2 and tanggal_selesai <= tanggal_jatuh_tempo)',
            cc_tunggakan: '(tanggal_selesai between $1 and $2 and tanggal_selesai > tanggal_jatuh_tempo)',
            belum_kesulitan: '(kesulitan_belum_dipilih and (tanggal_selesai is null or (tanggal_mulai_penanganan between $1 and $2)))'
        };
    }

    /** Golongan/ICCS adalah atribut cm_jenis_kejahatan, bukan kolom snapshot -- resolve dulu jadi
     *  daftar jenis_kejahatan_id, gabung (intersect) dgn filter jenis_kejahatan_id eksplisit kalau
     *  dua2nya diisi (mis. "Golongan Konvensional" AND "jenis kejahatan spesifik X"). Kalau golongan
     *  & ICCS dua2nya diisi, digabung AND (harus cocok golongan ITU DAN kategori ICCS itu). */
    private async resolveJenisKejahatanIds(explicit?: number[], golonganIds?: number[], iccsKategoriIds?: number[]): Promise<number[] | undefined> {
        if (!golonganIds?.length && !iccsKategoriIds?.length) return explicit;
        const conds: string[] = [];
        const params: any[] = [];
        if (golonganIds?.length) {
            params.push(golonganIds);
            conds.push(`"golonganKejahatanId" = any($${params.length})`);
        }
        if (iccsKategoriIds?.length) {
            params.push(iccsKategoriIds);
            conds.push(`"iccsKategoriId" = any($${params.length})`);
        }
        const rows = await this.ds.query(`select id from cm_jenis_kejahatan where ${conds.join(' and ')}`, params);
        const resolved = rows.map((r: any) => Number(r.id));
        // -1 = sentinel "sengaja tak ada yg cocok" -- beda dari array kosong yg di WHERE clause
        // (`if (ids?.length)`) berarti "filter tak aktif, tampilkan semua". Kalau golongan/ICCS
        // dipilih tapi hasil resolusinya nihil, harus tampil KOSONG, bukan tampil SEMUA data.
        if (explicit?.length) {
            const set = new Set(resolved);
            const intersected = explicit.filter((id) => set.has(id));
            return intersected.length ? intersected : [-1];
        }
        return resolved.length ? resolved : [-1];
    }

    /** Bangun pohon satker berisi hitungan CT/CP/CC ter-rollup, di-scope per role. */
    private async buildTree(userId: number | undefined, fromIn?: string, toIn?: string, modeIn?: string, jenisKejahatanIdsIn?: number[], golonganIds?: number[], iccsKategoriIds?: number[]) {
        const { from, to } = this.normPeriod(fromIn, toIn);
        const mode: 'mulai' | 'selesai' | 'both' = modeIn === 'mulai' || modeIn === 'selesai' ? modeIn : 'both';
        const jenisKejahatanIds = await this.resolveJenisKejahatanIds(jenisKejahatanIdsIn, golonganIds, iccsKategoriIds);
        const satkers = await this.getSatkerTree();
        const scope = await resolveScope(this.ds, userId);
        let allowed: number[] | null = null;
        let visibleSatkerIds: Set<number> | null = null;
        let scopeMeta: Record<string, any> = { kind: 'NASIONAL', label: 'Grup Nasional', function_group: null };
        if (scope.all) {
            const nationalPlan = buildNationalKinerjaScopePlan(satkers);
            allowed = nationalPlan.allowedIds;
            visibleSatkerIds = nationalPlan.visibleIds;
        } else {
            const plan = scope.satkerId ? buildKinerjaScopePlan(satkers, scope.satkerId) : null;
            if (!plan) return { roots: [] as TreeNode[], byKode: new Map<string, TreeNode>(), totals: this.emptyTotals(), columns: [] as { code: string; nama: string; kategori: string }[], from, to, mode, scoped: true, jumlahPenduduk: 0, scope_meta: { kind: 'REGIONAL', label: 'Scope satker belum tersedia', function_group: null } };
            allowed = plan.allowedIds;
            visibleSatkerIds = plan.visibleIds;
            scopeMeta = {
                kind: 'REGIONAL',
                label: `Grup Regional ${plan.rootNama}`,
                root_id: plan.rootId,
                root_kode: plan.rootKode,
                root_nama: plan.rootNama,
                function_group: plan.functionGroup
            };
        }

        const excludedSatkerIds = await this.getExcludedSatkerIds();
        const params: any[] = [from, to];
        let where = 'where satker_id is not null';
        if (allowed) {
            params.push(allowed);
            where += ` and satker_id = any($${params.length})`;
        }
        if (jenisKejahatanIds?.length) {
            params.push(jenisKejahatanIds);
            where += ` and jenis_kejahatan_id = any($${params.length})`;
        }
        if (excludedSatkerIds.length) {
            params.push(excludedSatkerIds);
            where += ` and satker_id <> all($${params.length})`;
        }
        const ex = this.countExprs(mode);
        // Rincian per status DI DALAM tiap bucket CP/CC (mis. dari LP yg cp_tunggakan, berapa yg
        // masih LIDIK vs SIDIK dst) -- beda dari statusCounts di bawah yg snapshot status TANPA
        // filter periode/bucket. "Format Tabel Kinerja" resmi butuh keduanya dipisah per bucket.
        const cpBreakdownSql = CP_BREAKDOWN.map((b) => `count(*) filter (where ${ex.cp_berjalan} and status_code = '${b.code}')::int as cp_berjalan_${b.key},\n                count(*) filter (where ${ex.cp_tunggakan} and status_code = '${b.code}')::int as cp_tunggakan_${b.key}`).join(',\n                ');
        const ccBreakdownSql = CC_BREAKDOWN.map((b) => `count(*) filter (where ${ex.cc_aktual} and ${b.cond})::int as cc_aktual_${b.key},\n                count(*) filter (where ${ex.cc_tunggakan} and ${b.cond})::int as cc_tunggakan_${b.key}`).join(',\n                ');
        const counts = await this.ds.query(
            `select
                satker_id as sid,
                count(*) filter (where ${ex.ct})::int as ct,
                count(*) filter (where ${ex.ct} and model_lp = 'lp_model_a')::int as ct_model_a,
                count(*) filter (where ${ex.ct} and model_lp = 'lp_model_b')::int as ct_model_b,
                count(*) filter (where ${ex.cp_berjalan})::int as cp_berjalan,
                count(*) filter (where ${ex.cp_tunggakan})::int as cp_tunggakan,
                count(*) filter (where ${ex.cc_aktual})::int as cc_aktual,
                count(*) filter (where ${ex.cc_tunggakan})::int as cc_tunggakan,
                count(*) filter (where ${ex.belum_kesulitan})::int as belum_kesulitan,
                ${cpBreakdownSql},
                ${ccBreakdownSql}
             from bdb_kinerja_perkara_snapshot
             ${where}
             group by satker_id`,
            params
        );

        // breakdown status SAAT INI (LIDIK s/d SP3/Tahap II dst) -- snapshot posisi caseload,
        // tidak difilter periode (beda konsep dari CT/CP/CC yg berbasis tanggal).
        const statusParams: any[] = [];
        let statusWhere = 'where satker_id is not null';
        if (allowed) {
            statusParams.push(allowed);
            statusWhere += ` and satker_id = any($${statusParams.length})`;
        }
        if (jenisKejahatanIds?.length) {
            statusParams.push(jenisKejahatanIds);
            statusWhere += ` and jenis_kejahatan_id = any($${statusParams.length})`;
        }
        if (excludedSatkerIds.length) {
            statusParams.push(excludedSatkerIds);
            statusWhere += ` and satker_id <> all($${statusParams.length})`;
        }
        const statusCounts = await this.ds.query(
            `select satker_id as sid, coalesce(status_code,'TANPA_STATUS') as code, count(*)::int as jml
             from bdb_kinerja_perkara_snapshot ${statusWhere} group by satker_id, status_code`,
            statusParams
        );

        const node = new Map<number, Node>();
        const parentOf = new Map<number, number | null>();
        for (const s of satkers) {
            node.set(s.id, {
                id: s.id,
                kode: s.kode,
                nama: s.deskripsi,
                parent_id: s.parent_id,
                depth: s.depth,
                urutan: s.urutan,
                ct: 0,
                ct_model_a: 0,
                ct_model_b: 0,
                cp_berjalan: 0,
                cp_tunggakan: 0,
                cc_aktual: 0,
                cc_tunggakan: 0,
                belum_kesulitan: 0,
                jumlah_penduduk: 0,
                status: {},
                cp_berjalan_rincian: {},
                cp_tunggakan_rincian: {},
                cc_aktual_rincian: {},
                cc_tunggakan_rincian: {}
            });
            parentOf.set(s.id, s.parent_id);
        }

        // Jumlah_penduduk per node -- PAKAI computePopulationById() (bottom-up child-priority,
        // sama persis dgn sumLeafPopulation() utk kartu ringkasan). Sebelumnya di sini jalan
        // algoritma beda ("tiap satker yg py nilai sendiri, tambahkan ke SEMUA leluhurnya") yg
        // dobel-hitung parah begitu POLDA+POLRES+POLSEK di satu cabang SAMA-SAMA terisi (kasus
        // normal setelah sinkron populasi dari DORS, lihat SatkerService.syncPopulasiWilayahDariDors) --
        // populasi Polsek ketambah ke Polres, LALU populasi Polres (yg overlap dgn Polsek-nya)
        // ketambah lagi ke Polda, dst -- MABES bisa tampil 600 juta+ (2-3x lipat penduduk RI asli).
        const popById = this.computePopulationById(satkers);
        for (const [id, n] of node) n.jumlah_penduduk = popById.get(id) ?? 0;

        for (const c of counts) {
            let cur: number | null = c.sid == null ? null : Number(c.sid);
            const guard = new Set<number>();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur)!;
                n.ct += Number(c.ct) || 0;
                n.ct_model_a += Number(c.ct_model_a) || 0;
                n.ct_model_b += Number(c.ct_model_b) || 0;
                n.cp_berjalan += Number(c.cp_berjalan) || 0;
                n.cp_tunggakan += Number(c.cp_tunggakan) || 0;
                n.cc_aktual += Number(c.cc_aktual) || 0;
                n.cc_tunggakan += Number(c.cc_tunggakan) || 0;
                n.belum_kesulitan += Number(c.belum_kesulitan) || 0;
                for (const b of CP_BREAKDOWN) {
                    n.cp_berjalan_rincian[b.key] = (n.cp_berjalan_rincian[b.key] || 0) + (Number(c[`cp_berjalan_${b.key}`]) || 0);
                    n.cp_tunggakan_rincian[b.key] = (n.cp_tunggakan_rincian[b.key] || 0) + (Number(c[`cp_tunggakan_${b.key}`]) || 0);
                }
                for (const b of CC_BREAKDOWN) {
                    n.cc_aktual_rincian[b.key] = (n.cc_aktual_rincian[b.key] || 0) + (Number(c[`cc_aktual_${b.key}`]) || 0);
                    n.cc_tunggakan_rincian[b.key] = (n.cc_tunggakan_rincian[b.key] || 0) + (Number(c[`cc_tunggakan_${b.key}`]) || 0);
                }
                cur = parentOf.get(cur) ?? null;
            }
        }
        for (const c of statusCounts) {
            let cur: number | null = c.sid == null ? null : Number(c.sid);
            const guard = new Set<number>();
            while (cur != null && node.has(cur) && !guard.has(cur)) {
                guard.add(cur);
                const n = node.get(cur)!;
                n.status[c.code] = (n.status[c.code] || 0) + (Number(c.jml) || 0);
                cur = parentOf.get(cur) ?? null;
            }
        }

        // Sama dgn dipakai summary() -- periode dihitung inklusif kedua tanggal, dipakai bareng utk semua node.
        const diffDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;

        const withMetrics = (n: Node): Metrics => {
            const rates = computeKinerjaRates({
                ct: n.ct,
                cpAktual: n.cp_berjalan,
                cpTunggakan: n.cp_tunggakan,
                ccAktual: n.cc_aktual,
                ccTunggakan: n.cc_tunggakan
            });
            const crimeRate = n.jumlah_penduduk > 0 ? (n.ct / n.jumlah_penduduk) * 100000 : null;
            const crimeClockDetik = n.ct > 0 ? totalDetikPeriode / n.ct : null;
            return {
                cr: roundRate(rates.crBaru),
                cr_lama: roundRate(rates.crLama),
                pr: roundRate(rates.prBaru),
                pr_lama: roundRate(rates.prLama),
                level: levelOf(Math.min(rates.crBaru, 100)),
                indeks: round2(computeIndeks(rates.crBaru)),
                crime_rate: crimeRate != null ? Math.round(crimeRate) : null,
                crime_clock: crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null,
                crime_clock_detik: crimeClockDetik
            };
        };

        // Satker dikecualikan ("Ikut rekap Kinerja Perkara" nonaktif) HARUS hilang sepenuhnya sbg
        // baris laporan, bukan cuma nol angkanya -- sblm ini cuma counts LP-nya yg difilter (WHERE
        // satker_id <> all(excluded)), satkernya sendiri tetap muncul di tree dgn baris 0 semua,
        // bikin bingung ("sudah dikecualikan kok masih tampil"). Anak dari satker terkecuali
        // (kalau ada) dinaikkan ke leluhur terdekat yg TIDAK dikecualikan -- sama spt behavior
        // hapus satker (sub-satker naik ke induk terdekat), bukan ikut hilang.
        // PENTING: node.id (dari raw query pg) datang sbg STRING utk kolom bigint (perilaku default
        // node-postgres, hindari presisi hilang di atas Number.MAX_SAFE_INTEGER), sedangkan
        // excludedSatkerIds sudah di-Number()-kan di getExcludedSatkerIds() -- Set.has() pakai
        // strict equality jadi "2" !== 2, exclude-nya diam2 tak pernah kena kalau dibandingkan apa
        // adanya. Normalisasi ke string di kedua sisi supaya konsisten dgn tipe asli node/parentOf.
        const excludedSet = new Set(excludedSatkerIds.map((id) => String(id)));

        // Unit/fungsi DI BAWAH Polsek (mis. "Unit Reskrim Polsek X") tak perlu tampil sbg baris
        // sendiri -- Polsek sudah level detail yg cukup utk laporan ini, dan remapDeeper() SENGAJA
        // tak menyasar level Polsek (lihat kondisinya di laporan-polisi.service.ts, cuma
        // Polda/Polres/Mabes), jadi baris2 ini nyaris pasti selamanya 0 dan cuma bikin tree penuh
        // sesak. Datanya (kalau ada, kasus langka via correctSatker manual ke anak Polsek) tetap
        // ikut terhitung ke Polsek induknya lewat while-loop rollup di atas -- yg disembunyikan
        // cuma barisnya, bukan angkanya.
        const tipeById = new Map<number, string>();
        for (const s of satkers) tipeById.set(s.id, s.tipe_satker);
        const underPolsekMemo = new Map<number, boolean>();
        const isUnderPolsek = (id: number): boolean => {
            if (underPolsekMemo.has(id)) return underPolsekMemo.get(id)!;
            underPolsekMemo.set(id, false); // guard thd siklus tak terduga di data
            const parentId = parentOf.get(id);
            let result = false;
            if (parentId != null) {
                result = tipeById.get(parentId) === 'POLSEK' || isUnderPolsek(parentId);
            }
            underPolsekMemo.set(id, result);
            return result;
        };

        const byId = new Map<number, TreeNode>();
        for (const n of node.values()) {
            if (excludedSet.has(String(n.id))) continue;
            if (visibleSatkerIds && !visibleSatkerIds.has(Number(n.id))) continue;
            if (isUnderPolsek(n.id)) continue;
            byId.set(n.id, { ...n, ...withMetrics(n), children: [] });
        }
        const nearestVisibleAncestor = (parentId: number | null | undefined): TreeNode | null => {
            let cur = parentId;
            const guard = new Set<number>();
            while (cur != null && !guard.has(cur)) {
                guard.add(cur);
                const p = byId.get(cur);
                if (p) return p;
                cur = parentOf.get(cur) ?? null;
            }
            return null;
        };
        const roots: TreeNode[] = [];
        for (const n of byId.values()) {
            const p = nearestVisibleAncestor(n.parent_id);
            if (p) p.children.push(n);
            else roots.push(n);
        }
        // urutan (sql/bdb/087) dipilih user secara eksplisit: Bareskrim/Densus/Pol Air di atas
        // Polda, tiap Polda diikuti Fungsi lalu Polres (dst) -- bukan sekadar kode_canonical yg
        // suka meleset kalau ada baris hasil DORS backfill/merge yg kode-nya tak ikut pola bersih.
        // Fallback ke kode kalau urutan null (mis. baris baru yg belum sempat di-resequence).
        const sortRec = (arr: TreeNode[]) => {
            arr.sort((a, b) => (a.urutan ?? Number.MAX_SAFE_INTEGER) - (b.urutan ?? Number.MAX_SAFE_INTEGER) || String(a.kode).localeCompare(String(b.kode)));
            arr.forEach((x) => sortRec(x.children));
        };
        sortRec(roots);

        const byKode = new Map<string, TreeNode>();
        const indexRec = (arr: TreeNode[]) => arr.forEach((n) => { byKode.set(n.kode, n); indexRec(n.children); });
        indexRec(roots);

        const mergeRincian = (a: Record<string, number>, b: Record<string, number>): Record<string, number> => {
            const out = { ...a };
            for (const k of Object.keys(b)) out[k] = (out[k] || 0) + b[k];
            return out;
        };
        const totals = roots.reduce(
            (a, n) => ({
                ct: a.ct + n.ct,
                ct_model_a: a.ct_model_a + n.ct_model_a,
                ct_model_b: a.ct_model_b + n.ct_model_b,
                cp_berjalan: a.cp_berjalan + n.cp_berjalan,
                cp_tunggakan: a.cp_tunggakan + n.cp_tunggakan,
                cc_aktual: a.cc_aktual + n.cc_aktual,
                cc_tunggakan: a.cc_tunggakan + n.cc_tunggakan,
                belum_kesulitan: a.belum_kesulitan + n.belum_kesulitan,
                cp_berjalan_rincian: mergeRincian(a.cp_berjalan_rincian, n.cp_berjalan_rincian),
                cp_tunggakan_rincian: mergeRincian(a.cp_tunggakan_rincian, n.cp_tunggakan_rincian),
                cc_aktual_rincian: mergeRincian(a.cc_aktual_rincian, n.cc_aktual_rincian),
                cc_tunggakan_rincian: mergeRincian(a.cc_tunggakan_rincian, n.cc_tunggakan_rincian)
            }),
            this.emptyTotals()
        );

        // Tampilkan SELURUH status master sbg kolom (bukan cuma yg lg ada datanya), supaya
        // rekap status penanganan selalu lengkap spt daftar master (LP s/d Tahap II dst).
        const allStatuses = await this.ds.query("select code, nama, coalesce(kategori,'CT') as kategori, urutan from bdb_status_master order by urutan, id");
        const columns = allStatuses.map((s: any) => ({ code: s.code, nama: s.nama, kategori: s.kategori }));

        const jumlahPenduduk = this.sumLeafPopulation(satkers, allowed);

        return { roots, byKode, totals, columns, from, to, mode, scoped: !scope.all, jumlahPenduduk, scope_meta: scopeMeta };
    }

    /** Ratakan pohon utuh (bukan lazy) utk export Excel/PDF -- nama satker diberi indent per level. */
    async exportRows(userId: number | undefined, from?: string, to?: string, mode?: string, jenisKejahatanIds?: number[], golonganIds?: number[], iccsKategoriIds?: number[]) {
        const { roots, columns, from: f, to: t, mode: m } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds);
        const rows: any[] = [];
        const walk = (nodes: TreeNode[], level: number) => {
            for (const n of nodes) {
                const row: any = { kode: n.kode, satker: `${'   '.repeat(level)}${n.nama}` };
                for (const c of columns) row[c.code] = n.status[c.code] || 0;
                row.ct = n.ct;
                row.ct_model_a = n.ct_model_a;
                row.ct_model_b = n.ct_model_b;
                row.cp_berjalan = n.cp_berjalan;
                row.cp_tunggakan = n.cp_tunggakan;
                for (const b of CP_BREAKDOWN) {
                    row[`cp_berjalan_${b.key}`] = n.cp_berjalan_rincian[b.key] || 0;
                    row[`cp_tunggakan_${b.key}`] = n.cp_tunggakan_rincian[b.key] || 0;
                }
                row.cc_aktual = n.cc_aktual;
                row.cc_tunggakan = n.cc_tunggakan;
                for (const b of CC_BREAKDOWN) {
                    row[`cc_aktual_${b.key}`] = n.cc_aktual_rincian[b.key] || 0;
                    row[`cc_tunggakan_${b.key}`] = n.cc_tunggakan_rincian[b.key] || 0;
                }
                row.cr = n.cr;
                row.cr_lama = n.cr_lama;
                row.pr = n.pr;
                row.pr_lama = n.pr_lama;
                row.level = n.level;
                row.indeks = n.indeks;
                row.jumlah_penduduk = n.jumlah_penduduk || null;
                row.crime_rate = n.crime_rate;
                row.crime_clock = n.crime_clock?.label || '';
                rows.push(row);
                if (n.children.length) walk(n.children, level + 1);
            }
        };
        walk(roots, 0);
        return { columns, rows, from: f, to: t, mode: m };
    }

    private emptyTotals() {
        return {
            ct: 0,
            ct_model_a: 0,
            ct_model_b: 0,
            cp_berjalan: 0,
            cp_tunggakan: 0,
            cc_aktual: 0,
            cc_tunggakan: 0,
            belum_kesulitan: 0,
            cp_berjalan_rincian: {} as Record<string, number>,
            cp_tunggakan_rincian: {} as Record<string, number>,
            cc_aktual_rincian: {} as Record<string, number>,
            cc_tunggakan_rincian: {} as Record<string, number>
        };
    }

    private lite(n: TreeNode): LiteNode {
        const { children, ...rest } = n;
        return { ...rest, has_children: !!children.length };
    }

    /** Rekap lazy per level: tanpa parent -> root; dengan parent -> anak langsungnya. */
    async rekap(userId: number | undefined, from?: string, to?: string, parent?: string, mode?: string, jenisKejahatanIds?: number[], golonganIds?: number[], iccsKategoriIds?: number[]) {
        const { roots, byKode, totals, columns, scoped, scope_meta } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds);
        if (parent) {
            const node = byKode.get(parent);
            return { status: 1, data: { nodes: (node?.children || []).map((n) => this.lite(n)), scope_meta } };
        }
        return { status: 1, data: { nodes: roots.map((n) => this.lite(n)), totals, columns, scoped, scope_meta } };
    }

    /** Kartu ringkasan atas: total + CR + level + indeks utk seluruh scope. */
    async summary(userId: number | undefined, from?: string, to?: string, mode?: string, jenisKejahatanIds?: number[], golonganIds?: number[], iccsKategoriIds?: number[]) {
        const { totals, from: f, to: t, scoped, jumlahPenduduk, scope_meta } = await this.buildTree(userId, from, to, mode, jenisKejahatanIds, golonganIds, iccsKategoriIds);
        const rates = computeKinerjaRates({
            ct: totals.ct,
            cpAktual: totals.cp_berjalan,
            cpTunggakan: totals.cp_tunggakan,
            ccAktual: totals.cc_aktual,
            ccTunggakan: totals.cc_tunggakan
        });
        const lastRefreshed = await this.lastRefreshedAt();

        // Crime Rate = (CT / Jumlah Penduduk) x 100.000 -- presisi penuh, dibulatkan cuma di tampilan.
        // Kosong/0 penduduk = jangan dibagi, biar frontend tampilkan "-" + keterangan blm tersedia.
        const crimeRate = jumlahPenduduk > 0 ? (totals.ct / jumlahPenduduk) * 100000 : null;

        // Crime Clock = Total Detik dlm Periode / CT (periode dihitung inklusif kedua tanggal).
        const diffDays = Math.round((new Date(t).getTime() - new Date(f).getTime()) / 86400000) + 1;
        const totalDetikPeriode = Math.max(0, diffDays) * 86400;
        const crimeClockDetik = totals.ct > 0 ? totalDetikPeriode / totals.ct : null;
        const crimeClock = crimeClockDetik != null ? this.formatCrimeClock(crimeClockDetik) : null;

        return {
            status: 1,
            data: {
                ...totals,
                cr: roundRate(rates.crBaru),
                cr_raw: rates.crBaru,
                cr_lama: roundRate(rates.crLama),
                pr: roundRate(rates.prBaru),
                pr_lama: roundRate(rates.prLama),
                level: levelOf(Math.min(rates.crBaru, 100)),
                indeks: round2(computeIndeks(rates.crBaru)),
                jumlah_penduduk: jumlahPenduduk > 0 ? jumlahPenduduk : null,
                crime_rate: crimeRate != null ? Math.round(crimeRate) : null,
                crime_rate_raw: crimeRate,
                crime_clock_detik: crimeClockDetik,
                crime_clock: crimeClock,
                periode_hari_inklusif: diffDays,
                from: f,
                to: t,
                scoped,
                scope_meta,
                last_refreshed_at: lastRefreshed
            }
        };
    }

    /** Daftar jenis kejahatan yg benar2 dipakai LP (bukan seluruh 300+ master cm_jenis_kejahatan) -- utk filter dropdown. */
    async jenisKejahatanOptions() {
        const rows = await this.ds.query(`
            select distinct ck.id, ck.keterangan
            from bdb_laporan_polisi lp
            join cm_jenis_kejahatan ck on ck.id = lp.jenis_kejahatan_id
            where lp.deleted_at is null
            order by ck.keterangan
        `);
        return { status: 1, data: rows };
    }
}
