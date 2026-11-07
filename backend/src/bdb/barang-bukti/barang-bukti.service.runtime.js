"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BarangBuktiService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarangBuktiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
const lp_monitoring_access_service_1 = require("../common/lp-monitoring-access.service");
const STATUS_MANUAL = ['MASUK', 'KELUAR'];
const STANDAR_SATUAN_SEED = [
    { nama_satuan: 'Buah', kelompok: 'SATUAN HITUNG', sinonim: 'bh, buah, pcs, pc, piece, pieces, biji, bj', aliases: ['bh', 'buah', 'pcs', 'pc', 'piece', 'pieces', 'biji', 'bj'] },
    { nama_satuan: 'Unit', kelompok: 'SATUAN HITUNG', sinonim: 'unit, unt', aliases: ['unit', 'unt'] },
    { nama_satuan: 'Butir', kelompok: 'SATUAN HITUNG', sinonim: 'btr, butir, tablet, tab, pil, kapsul, kaplet', aliases: ['btr', 'butir', 'tablet', 'tab', 'pil', 'kapsul', 'kaplet'] },
    { nama_satuan: 'Batang', kelompok: 'SATUAN HITUNG', sinonim: 'btg, batang, linting', aliases: ['btg', 'batang', 'linting'] },
    { nama_satuan: 'Bilah', kelompok: 'SENJATA & ALAT', sinonim: 'bilah, blh', aliases: ['bilah', 'blh'] },
    { nama_satuan: 'Pucuk', kelompok: 'SENJATA & ALAT', sinonim: 'pucuk, pck', aliases: ['pucuk', 'pck'] },
    { nama_satuan: 'Lembar', kelompok: 'DOKUMEN & ARSIP', sinonim: 'lbr, lembar, hlm, halaman', aliases: ['lbr', 'lembar', 'hlm', 'halaman'] },
    { nama_satuan: 'Helai', kelompok: 'SANDANG & TEKSTIL', sinonim: 'helai, hl, potong, ptg', aliases: ['helai', 'hl', 'potong', 'ptg'] },
    { nama_satuan: 'Stel / Setelan', kelompok: 'SANDANG & TEKSTIL', sinonim: 'stel, setel, stelan, setelan', aliases: ['stel', 'setel', 'stelan', 'setelan', 'stel / setelan'] },
    { nama_satuan: 'Berkas / Bundel', kelompok: 'DOKUMEN & ARSIP', sinonim: 'berkas, bundel, bundle, bendel, map, buku, eksemplar', aliases: ['berkas', 'bundel', 'bundle', 'bendel', 'map', 'buku', 'eksemplar', 'berkas / bundel'] },
    { nama_satuan: 'Pasang', kelompok: 'SANDANG & TEKSTIL', sinonim: 'pasang, psg', aliases: ['pasang', 'psg'] },
    { nama_satuan: 'Set', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'set, rangkaian', aliases: ['set', 'rangkaian'] },
    { nama_satuan: 'Paket', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'paket, pkt', aliases: ['paket', 'pkt'] },
    { nama_satuan: 'Keping', kelompok: 'SATUAN HITUNG', sinonim: 'keping, kpg, chip', aliases: ['keping', 'kpg', 'chip'] },
    { nama_satuan: 'Kotak / Box', kelompok: 'KEMASAN & WADAH', sinonim: 'kotak, box, boks, dus, kardus, karton, peti, krat', aliases: ['kotak', 'box', 'boks', 'dus', 'kardus', 'karton', 'peti', 'krat', 'kotak / box'] },
    { nama_satuan: 'Bungkus', kelompok: 'KEMASAN & WADAH', sinonim: 'bungkus, bks, slop, pak, pack, sachet, saset, klip, clip, poket, kantong, plastik', aliases: ['bungkus', 'bks', 'slop', 'pak', 'pack', 'sachet', 'saset', 'klip', 'clip', 'poket', 'kantong', 'plastik'] },
    { nama_satuan: 'Botol', kelompok: 'KEMASAN & WADAH', sinonim: 'botol, btl, ampul, vial, flakon', aliases: ['botol', 'btl', 'ampul', 'vial', 'flakon'] },
    { nama_satuan: 'Kaleng', kelompok: 'KEMASAN & WADAH', sinonim: 'kaleng, klg', aliases: ['kaleng', 'klg'] },
    { nama_satuan: 'Tabung', kelompok: 'KEMASAN & WADAH', sinonim: 'tabung, tbg, silinder', aliases: ['tabung', 'tbg', 'silinder'] },
    { nama_satuan: 'Jerigen', kelompok: 'KEMASAN & WADAH', sinonim: 'jerigen, jrgn, jergen, jiregen, jurigen, dirigen', aliases: ['jerigen', 'jrgn', 'jergen', 'jiregen', 'jurigen', 'dirigen'] },
    { nama_satuan: 'Drum / Tangki', kelompok: 'KEMASAN & WADAH', sinonim: 'drum, drom, tong, tandon, toren, tangki', aliases: ['drum', 'drom', 'tong', 'tandon', 'toren', 'tangki', 'drum / tangki'] },
    { nama_satuan: 'Galon', kelompok: 'KEMASAN & WADAH', sinonim: 'galon, gln', aliases: ['galon', 'gln'] },
    { nama_satuan: 'Karung', kelompok: 'KEMASAN & WADAH', sinonim: 'karung, krg, goni', aliases: ['karung', 'krg', 'goni'] },
    { nama_satuan: 'Sak', kelompok: 'KEMASAN & WADAH', sinonim: 'sak, zak', aliases: ['sak', 'zak'] },
    { nama_satuan: 'Roll / Gulung', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'roll, rol, gulung, glg, kumparan', aliases: ['roll', 'rol', 'gulung', 'glg', 'kumparan', 'roll / gulung'] },
    { nama_satuan: 'Ikat / Tandan', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'ikat, gabung, tandan, janjang', aliases: ['ikat', 'gabung', 'tandan', 'janjang', 'ikat / tandan'] },
    { nama_satuan: 'Lusin', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'lusin, lsn, dozen, doz', aliases: ['lusin', 'lsn', 'dozen', 'doz'] },
    { nama_satuan: 'Kodi', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'kodi', aliases: ['kodi'] },
    { nama_satuan: 'Gross', kelompok: 'KEMASAN & HIMPUNAN', sinonim: 'gross, gros', aliases: ['gross', 'gros'] },
    { nama_satuan: 'Rim', kelompok: 'DOKUMEN & ARSIP', sinonim: 'rim, ream', aliases: ['rim', 'ream'] },
    { nama_satuan: 'Ekor', kelompok: 'SATWA & TERNAK', sinonim: 'ekor, ekr', aliases: ['ekor', 'ekr'] },
    { nama_satuan: 'Miligram (mg)', kelompok: 'BERAT & MASSA', sinonim: 'mg, miligram, milligram', aliases: ['mg', 'miligram', 'milligram', 'miligram (mg)'] },
    { nama_satuan: 'Gram (g)', kelompok: 'BERAT & MASSA', sinonim: 'g, gr, gram, grm, gram (g)', aliases: ['g', 'gr', 'gram', 'grm', 'gram (g)'] },
    { nama_satuan: 'Ons', kelompok: 'BERAT & MASSA', sinonim: 'ons, on', aliases: ['ons', 'on'] },
    { nama_satuan: 'Kilogram (Kg)', kelompok: 'BERAT & MASSA', sinonim: 'kg, kilo, kilogram, kgm, kilogram (kg)', aliases: ['kg', 'kilo', 'kilogram', 'kgm', 'kilogram (kg)'] },
    { nama_satuan: 'Kuintal', kelompok: 'BERAT & MASSA', sinonim: 'kuintal, kwintal, kw', aliases: ['kuintal', 'kwintal', 'kw'] },
    { nama_satuan: 'Ton', kelompok: 'BERAT & MASSA', sinonim: 'ton, mt, metrik ton', aliases: ['ton', 'mt', 'metrik ton'] },
    { nama_satuan: 'Mililiter (mL)', kelompok: 'VOLUME & CAIRAN', sinonim: 'ml, mililiter, milliliter, cc, mililiter (ml)', aliases: ['ml', 'mililiter', 'milliliter', 'cc', 'mililiter (ml)'] },
    { nama_satuan: 'Liter (L)', kelompok: 'VOLUME & CAIRAN', sinonim: 'l, ltr, liter, litre, liter (l)', aliases: ['l', 'ltr', 'liter', 'litre', 'liter (l)'] },
    { nama_satuan: 'Kiloliter (kL)', kelompok: 'VOLUME & CAIRAN', sinonim: 'kl, kiloliter', aliases: ['kl', 'kiloliter', 'kiloliter (kl)'] },
    { nama_satuan: 'Sentimeter (cm)', kelompok: 'PANJANG, LUAS & RUANG', sinonim: 'cm, sentimeter, centimeter, sentimeter (cm)', aliases: ['cm', 'sentimeter', 'centimeter', 'sentimeter (cm)'] },
    { nama_satuan: 'Meter (m)', kelompok: 'PANJANG, LUAS & RUANG', sinonim: 'm, mtr, meter, meter (m)', aliases: ['m', 'mtr', 'meter', 'meter (m)'] },
    { nama_satuan: 'Meter Persegi (m²)', kelompok: 'PANJANG, LUAS & RUANG', sinonim: 'm2, m², meter persegi, meter persegi (m²)', aliases: ['m2', 'm²', 'meter persegi', 'meter persegi (m²)', 'meter persegi (m2)'] },
    { nama_satuan: 'Hektare (Ha)', kelompok: 'PANJANG, LUAS & RUANG', sinonim: 'ha, hektar, hektare, hektare (ha)', aliases: ['ha', 'hektar', 'hektare', 'hektare (ha)'] },
    { nama_satuan: 'Meter Kubik (m³)', kelompok: 'PANJANG, LUAS & RUANG', sinonim: 'm3, m³, kubik, meter kubik, meter kubik (m³)', aliases: ['m3', 'm³', 'kubik', 'meter kubik', 'meter kubik (m³)', 'meter kubik (m3)'] },
    { nama_satuan: 'Karat', kelompok: 'LOGAM MULIA & PERHIASAN', sinonim: 'karat, krt, ct', aliases: ['karat', 'krt', 'ct'] },
    { nama_satuan: 'Rupiah (Rp)', kelompok: 'MATA UANG', sinonim: 'rp, rupiah, idr, rupiah (rp), rupiah (idr)', aliases: ['rp', 'rupiah', 'idr', 'rupiah (rp)', 'rupiah (idr)'] },
    { nama_satuan: 'Valas / Mata Uang Asing', kelompok: 'MATA UANG', sinonim: 'usd, dollar, dolar, valas', aliases: ['usd', 'dollar', 'dolar', 'valas', 'valas / mata uang asing'] },
];
const SATUAN_ALIAS_MAP = new Map();
const SATUAN_SEED_BY_CANONICAL = new Map();
for (const item of STANDAR_SATUAN_SEED) {
    SATUAN_SEED_BY_CANONICAL.set(item.nama_satuan, item);
    SATUAN_ALIAS_MAP.set(item.nama_satuan.toLowerCase(), item.nama_satuan);
    for (const al of item.aliases) {
        SATUAN_ALIAS_MAP.set(al.toLowerCase(), item.nama_satuan);
    }
}
/**
 * Barang Bukti: gabungan 2 sumber --
 *  1) bdb_dors_lp_barang_bukti / bdb_laporan_polisi.payload_json->'barang_bukti' -- read-only, dari DORS tiap sync.
 *  2) bdb_lp_barang_bukti_manual -- dicatat manual di halaman detail LP, field lengkap (bisa CRUD).
 */
let BarangBuktiService = BarangBuktiService_1 = class BarangBuktiService {
    constructor(dataSource, audit, monitoring) {
        this.dataSource = dataSource;
        this.audit = audit;
        this.monitoring = monitoring;
        this.logger = new common_1.Logger(BarangBuktiService_1.name);
        this.summaryCache = new Map();
        this.listCache = new Map();
        this.satkerTreeCache = new Map();
        this.masterJenisCache = null;
        this.masterSatuanCache = null;
        this.masterSatuanBootstrapped = false;
    }
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
            await this.normalizeManualBarangBuktiToMasterDors();
        }
        catch (err) {
            this.logger.warn('BarangBuktiService index bootstrap warning: ' + (err?.message || err));
        }
    }
    /**
     * Normalisasi data bdb_lp_barang_bukti_manual agar kolom `jenis` mengacu ke Master Jenis Barang DORS
     * dan deskripsi bebas (seperti "karung pupuk NPK...", "Hp merk NOKIA 105...") tersimpan sebagai `keterangan` (Nama/Detail Barang).
     */
    async normalizeManualBarangBuktiToMasterDors() {
        try {
            await this.dataSource.query(`
                ALTER TABLE bdb_lp_barang_bukti_manual ADD COLUMN IF NOT EXISTS satuan text;
                ALTER TABLE bdb_dors_lp_barang_bukti ADD COLUMN IF NOT EXISTS satuan text;
            `);
            await this.ensureMasterSatuanTable();
            this.summaryCache.clear();
            this.listCache.clear();
        }
        catch (e) {
            this.logger.warn('normalizeManualBarangBuktiToMasterDors warning: ' + (e?.message || e));
        }
    }
    satuanKode(canonical) {
        return String(canonical || '')
            .toUpperCase()
            .replace(/²/g, '2')
            .replace(/³/g, '3')
            .replace(/[^A-Z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }
    normalizeCanonicalSatuan(rawUnit) {
        if (rawUnit === undefined || rawUnit === null)
            return null;
        let s = String(rawUnit)
            .trim()
            .replace(/^[\d\s.,/+-]+/, '')
            .trim()
            .replace(/[.,;:!?-]+$/, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!s || /^(null|undefined|nihil|tidak\s*ada|none|n\/a|na|-+|0+)$/i.test(s))
            return null;
        const lower = s.toLowerCase();
        if (SATUAN_ALIAS_MAP.has(lower))
            return SATUAN_ALIAS_MAP.get(lower);
        const noDots = lower.replace(/\./g, '').replace(/\s+/g, ' ').trim();
        if (SATUAN_ALIAS_MAP.has(noDots))
            return SATUAN_ALIAS_MAP.get(noDots);
        const noParens = noDots.replace(/\s*\([^)]*\)\s*/g, '').trim();
        if (noParens && SATUAN_ALIAS_MAP.has(noParens))
            return SATUAN_ALIAS_MAP.get(noParens);
        if (s.length >= 2 && s.length <= 35 && /^[a-zA-ZÀ-ÿ]+(?:\s*(?:\/|\s)\s*[a-zA-ZÀ-ÿ]+)*$/.test(s)) {
            const titleCased = s
                .toLowerCase()
                .replace(/\s*\/\s*/g, ' / ')
                .replace(/\s+/g, ' ')
                .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
            if (SATUAN_ALIAS_MAP.has(titleCased.toLowerCase()))
                return SATUAN_ALIAS_MAP.get(titleCased.toLowerCase());
            return titleCased;
        }
        return null;
    }
    async ensureMasterSatuanTable() {
        if (this.masterSatuanBootstrapped)
            return;
        this.masterSatuanBootstrapped = true;
        try {
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS bdb_ref_satuan_barang (
                    id SERIAL PRIMARY KEY,
                    kode TEXT NOT NULL UNIQUE,
                    nama_satuan TEXT NOT NULL,
                    kelompok TEXT NOT NULL DEFAULT 'UMUM',
                    sinonim TEXT DEFAULT '',
                    sumber TEXT NOT NULL DEFAULT 'STANDAR',
                    status TEXT NOT NULL DEFAULT 'Aktif',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            `);
            await this.dataSource.query(`ALTER TABLE bdb_ref_satuan_barang RENAME COLUMN nama TO nama_satuan`).catch(() => {});
            await this.dataSource.query(`ALTER TABLE bdb_ref_satuan_barang ADD COLUMN IF NOT EXISTS kelompok TEXT NOT NULL DEFAULT 'UMUM'`).catch(() => {});
            await this.dataSource.query(`ALTER TABLE bdb_ref_satuan_barang ADD COLUMN IF NOT EXISTS sinonim TEXT DEFAULT ''`).catch(() => {});
            await this.dataSource.query(`ALTER TABLE bdb_ref_satuan_barang ADD COLUMN IF NOT EXISTS sumber TEXT NOT NULL DEFAULT 'STANDAR'`).catch(() => {});
            await this.dataSource.query(`ALTER TABLE bdb_ref_satuan_barang ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Aktif'`).catch(() => {});
            for (const item of STANDAR_SATUAN_SEED) {
                const kode = this.satuanKode(item.nama_satuan);
                await this.dataSource.query(`
                    INSERT INTO bdb_ref_satuan_barang (kode, nama_satuan, kelompok, sinonim, sumber, status, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, 'STANDAR', 'Aktif', NOW(), NOW())
                    ON CONFLICT (kode) DO UPDATE SET
                        nama_satuan = EXCLUDED.nama_satuan,
                        kelompok = EXCLUDED.kelompok,
                        sinonim = CASE WHEN bdb_ref_satuan_barang.sinonim IS NULL OR bdb_ref_satuan_barang.sinonim = '' THEN EXCLUDED.sinonim ELSE bdb_ref_satuan_barang.sinonim END,
                        updated_at = NOW()
                `, [kode, item.nama_satuan, item.kelompok, item.sinonim]);
            }
            const distinctMan = await this.dataSource.query(`
                SELECT DISTINCT satuan, 'WILAYAH' AS src FROM bdb_lp_barang_bukti_manual WHERE satuan IS NOT NULL AND btrim(satuan) <> ''
                UNION
                SELECT DISTINCT satuan, 'DORS' AS src FROM bdb_dors_lp_barang_bukti WHERE satuan IS NOT NULL AND btrim(satuan) <> ''
            `).catch(() => []);
            for (const r of distinctMan) {
                const raw = r.satuan;
                const canonical = this.normalizeCanonicalSatuan(raw);
                if (!canonical)
                    continue;
                if (canonical !== raw) {
                    await this.dataSource.query(`UPDATE bdb_lp_barang_bukti_manual SET satuan = $2 WHERE satuan = $1`, [raw, canonical]).catch(() => {});
                    await this.dataSource.query(`UPDATE bdb_dors_lp_barang_bukti SET satuan = $2 WHERE satuan = $1`, [raw, canonical]).catch(() => {});
                }
                const kode = this.satuanKode(canonical);
                const seed = SATUAN_SEED_BY_CANONICAL.get(canonical);
                await this.dataSource.query(`
                    INSERT INTO bdb_ref_satuan_barang (kode, nama_satuan, kelompok, sinonim, sumber, status, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, $5, 'Aktif', NOW(), NOW())
                    ON CONFLICT (kode) DO NOTHING
                `, [kode, canonical, seed?.kelompok || 'DORS / WILAYAH', seed?.sinonim || '', seed ? 'STANDAR' : (r.src || 'DORS')]).catch(() => {});
            }
            this.masterSatuanCache = null;
        }
        catch (err) {
            this.masterSatuanBootstrapped = false;
            this.logger.warn('ensureMasterSatuanTable warning: ' + (err?.message || err));
        }
    }
    async registerAndNormalizeSatuan(rawUnit, fallback = 'Buah') {
        await this.ensureMasterSatuanTable();
        const canonical = this.normalizeCanonicalSatuan(rawUnit) || this.normalizeCanonicalSatuan(fallback) || 'Buah';
        const kode = this.satuanKode(canonical);
        if (kode) {
            const seed = SATUAN_SEED_BY_CANONICAL.get(canonical);
            await this.dataSource.query(`
                INSERT INTO bdb_ref_satuan_barang (kode, nama_satuan, kelompok, sinonim, sumber, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, 'Aktif', NOW(), NOW())
                ON CONFLICT (kode) DO UPDATE SET
                    status = 'Aktif',
                    updated_at = NOW()
            `, [kode, canonical, seed?.kelompok || 'WILAYAH / UMUM', seed?.sinonim || '', seed ? 'STANDAR' : 'WILAYAH']).catch(() => {});
            this.masterSatuanCache = null;
        }
        return canonical;
    }
    async listMasterSatuan(search) {
        await this.ensureMasterSatuanTable();
        if (!this.masterSatuanCache || this.masterSatuanCache.expiresAt <= Date.now()) {
            const rows = await this.dataSource.query(`
                SELECT id, kode, nama_satuan, kelompok, coalesce(sinonim, '') as sinonim, sumber, status, created_at, updated_at
                FROM bdb_ref_satuan_barang
                ORDER BY CASE WHEN sumber = 'STANDAR' THEN 0 ELSE 1 END, id ASC
            `);
            const items = rows.map((r) => ({
                id: Number(r.id),
                kode: r.kode,
                nama: r.nama_satuan,
                nama_satuan: r.nama_satuan,
                label: r.nama_satuan,
                value: r.nama_satuan,
                kelompok: r.kelompok || 'UMUM',
                sinonim: r.sinonim || '',
                sumber: r.sumber || 'STANDAR',
                status: r.status || 'Aktif',
            }));
            this.masterSatuanCache = { expiresAt: Date.now() + 300000, items };
        }
        const q = String(search || '').trim().toUpperCase();
        const filtered = q
            ? this.masterSatuanCache.items.filter((it) => it.nama_satuan.toUpperCase().includes(q)
                || it.kode.toUpperCase().includes(q)
                || it.kelompok.toUpperCase().includes(q)
                || it.sinonim.toUpperCase().includes(q))
            : this.masterSatuanCache.items;
        return { status: 1, data: filtered };
    }
    async createMasterSatuan(authUser, body = {}) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Anda tidak memiliki wewenang untuk menambah Master Satuan.');
        }
        await this.ensureMasterSatuanTable();
        const rawNama = this.toText(body.nama_satuan ?? body.nama ?? body.label ?? body.value ?? body.satuan);
        const canonical = this.normalizeCanonicalSatuan(rawNama);
        if (!canonical) {
            throw new common_1.BadRequestException('Nama satuan barang bukti tidak valid.');
        }
        const kode = this.satuanKode(canonical);
        const seed = SATUAN_SEED_BY_CANONICAL.get(canonical);
        const kelompok = this.toText(body.kelompok) || seed?.kelompok || 'WILAYAH / UMUM';
        const sinonim = this.toText(body.sinonim) ?? seed?.sinonim ?? '';
        const sumber = this.toText(body.sumber) || (seed ? 'STANDAR' : 'WILAYAH');
        const status = this.toText(body.status) || 'Aktif';
        const rows = await this.dataSource.query(`
            INSERT INTO bdb_ref_satuan_barang (kode, nama_satuan, kelompok, sinonim, sumber, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            ON CONFLICT (kode) DO UPDATE SET
                nama_satuan = EXCLUDED.nama_satuan,
                kelompok = COALESCE(NULLIF(btrim($3), ''), bdb_ref_satuan_barang.kelompok),
                sinonim = CASE WHEN btrim($4) <> '' THEN $4 ELSE bdb_ref_satuan_barang.sinonim END,
                status = EXCLUDED.status,
                updated_at = NOW()
            RETURNING id, kode, nama_satuan, kelompok, coalesce(sinonim, '') as sinonim, sumber, status
        `, [kode, canonical, kelompok, sinonim, sumber, status]);
        this.masterSatuanCache = null;
        const r = rows[0];
        return {
            status: 1,
            data: {
                id: Number(r.id),
                kode: r.kode,
                nama: r.nama_satuan,
                nama_satuan: r.nama_satuan,
                label: r.nama_satuan,
                value: r.nama_satuan,
                kelompok: r.kelompok,
                sinonim: r.sinonim,
                sumber: r.sumber,
                status: r.status,
            },
            message: `Satuan "${canonical}" berhasil disimpan ke Master Referensi Satuan.`,
        };
    }
    async updateMasterSatuan(authUser, id, body = {}) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Anda tidak memiliki wewenang untuk mengubah Master Satuan.');
        }
        await this.ensureMasterSatuanTable();
        const satuanId = Number(id);
        if (!Number.isSafeInteger(satuanId) || satuanId <= 0) {
            throw new common_1.BadRequestException('ID Master Satuan tidak valid.');
        }
        const existingRows = await this.dataSource.query(`SELECT * FROM bdb_ref_satuan_barang WHERE id = $1`, [satuanId]);
        if (!existingRows.length) {
            throw new common_1.NotFoundException('Master Satuan tidak ditemukan.');
        }
        const existing = existingRows[0];
        const rawNama = this.toText(body.nama_satuan ?? body.nama ?? body.label ?? body.value ?? body.satuan);
        const canonical = rawNama ? (this.normalizeCanonicalSatuan(rawNama) || rawNama) : existing.nama_satuan;
        const kode = this.satuanKode(canonical) || existing.kode;
        const kelompok = this.toText(body.kelompok) ?? existing.kelompok;
        const sinonim = body.sinonim !== undefined ? (this.toText(body.sinonim) || '') : (existing.sinonim || '');
        const status = this.toText(body.status) ?? existing.status;
        const conflict = await this.dataSource.query(`SELECT id FROM bdb_ref_satuan_barang WHERE kode = $1 AND id <> $2`, [kode, satuanId]);
        if (conflict.length) {
            throw new common_1.BadRequestException(`Satuan "${canonical}" sudah terdaftar di Master Referensi.`);
        }
        const rawRes = await this.dataSource.query(`
            UPDATE bdb_ref_satuan_barang
            SET kode = $2, nama_satuan = $3, kelompok = $4, sinonim = $5, status = $6, updated_at = NOW()
            WHERE id = $1
            RETURNING id, kode, nama_satuan, kelompok, coalesce(sinonim, '') as sinonim, sumber, status
        `, [satuanId, kode, canonical, kelompok, sinonim, status]);
        const rows = Array.isArray(rawRes?.[0]) ? rawRes[0] : rawRes;
        this.masterSatuanCache = null;
        const r = rows[0];
        return {
            status: 1,
            data: {
                id: Number(r.id),
                kode: r.kode,
                nama: r.nama_satuan,
                nama_satuan: r.nama_satuan,
                label: r.nama_satuan,
                value: r.nama_satuan,
                kelompok: r.kelompok,
                sinonim: r.sinonim,
                sumber: r.sumber,
                status: r.status,
            },
            message: 'Master Satuan berhasil diperbarui.',
        };
    }
    async deleteMasterSatuan(authUser, id) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus Master Satuan.');
        }
        await this.ensureMasterSatuanTable();
        const satuanId = Number(id);
        if (!Number.isSafeInteger(satuanId) || satuanId <= 0) {
            throw new common_1.BadRequestException('ID Master Satuan tidak valid.');
        }
        const rawRes = await this.dataSource.query(`DELETE FROM bdb_ref_satuan_barang WHERE id = $1 RETURNING id, nama_satuan`, [satuanId]);
        const rows = Array.isArray(rawRes?.[0]) ? rawRes[0] : rawRes;
        if (!rows.length) {
            throw new common_1.NotFoundException('Master Satuan tidak ditemukan.');
        }
        this.masterSatuanCache = null;
        return { status: 1, message: `Master Satuan "${rows[0].nama_satuan}" berhasil dihapus.` };
    }
    async listMasterJenis(search) {
        if (!this.masterJenisCache || this.masterJenisCache.expiresAt <= Date.now()) {
            const items = [
                { label: 'Kendaraan Bermotor', value: 'Kendaraan Bermotor', kelompok: 'KENDARAAN', satuan: 'Unit' },
                { label: 'Perangkat Elektronik & Komunikasi', value: 'Perangkat Elektronik & Komunikasi', kelompok: 'ELEKTRONIK', satuan: 'Unit' },
                { label: 'Alat Elektronik & Digital', value: 'Alat Elektronik & Digital', kelompok: 'ELEKTRONIK', satuan: 'Unit' },
                { label: 'Alat Penerangan & Kelistrikan', value: 'Alat Penerangan & Kelistrikan', kelompok: 'KELISTRIKAN', satuan: 'Unit' },
                { label: 'Hewan & Ternak', value: 'Hewan & Ternak', kelompok: 'PETERNAKAN & SATWA', satuan: 'Ekor' },
                { label: 'Dokumen & Surat Berharga', value: 'Dokumen & Surat Berharga', kelompok: 'DOKUMEN', satuan: 'Lembar' },
                { label: 'Uang Tunai & Logam Mulia', value: 'Uang Tunai & Logam Mulia', kelompok: 'KEUANGAN & PERHIASAN', satuan: 'Rupiah (Rp)' },
                { label: 'Uang & Mata Uang', value: 'Uang & Mata Uang', kelompok: 'KEUANGAN & PERHIASAN', satuan: 'Rupiah (Rp)' },
                { label: 'Logam Mulia & Perhiasan', value: 'Logam Mulia & Perhiasan', kelompok: 'KEUANGAN & PERHIASAN', satuan: 'Gram (g)' },
                { label: 'Narkotika, Psikotropika & Obat', value: 'Narkotika, Psikotropika & Obat', kelompok: 'NARKOTIKA & OBAT', satuan: 'Gram (g)' },
                { label: 'Senjata Tajam', value: 'Senjata Tajam', kelompok: 'SENJATA', satuan: 'Bilah' },
                { label: 'Senjata Api & Bahan Peledak', value: 'Senjata Api & Bahan Peledak', kelompok: 'SENJATA', satuan: 'Pucuk' },
                { label: 'Senjata Api, Tajam & Bahan Peledak', value: 'Senjata Api, Tajam & Bahan Peledak', kelompok: 'SENJATA', satuan: 'Bilah' },
                { label: 'Pakaian, Tekstil & Aksesoris', value: 'Pakaian, Tekstil & Aksesoris', kelompok: 'SANDANG & PRIBADI', satuan: 'Helai' },
                { label: 'Perkakas, Mesin & Alat Berat', value: 'Perkakas, Mesin & Alat Berat', kelompok: 'PERKAKAS & MESIN', satuan: 'Unit' },
                { label: 'Bahan Bakar, Kimia & Material', value: 'Bahan Bakar, Kimia & Material', kelompok: 'ENERGI & MATERIAL', satuan: 'Liter (L)' },
                { label: 'Bahan Kimia, BBM & Material', value: 'Bahan Kimia, BBM & Material', kelompok: 'ENERGI & MATERIAL', satuan: 'Liter (L)' },
                { label: 'Hasil Hutan, Tambang & Alam', value: 'Hasil Hutan, Tambang & Alam', kelompok: 'PERTAMBANGAN & KEHUTANAN', satuan: 'Batang' },
                { label: 'Pangan, Pertanian & Perkebunan', value: 'Pangan, Pertanian & Perkebunan', kelompok: 'PERTANIAN & KONSUMSI', satuan: 'Kilogram (Kg)' },
                { label: 'Perabotan & Alat Rumah Tangga', value: 'Perabotan & Alat Rumah Tangga', kelompok: 'RUMAH TANGGA', satuan: 'Buah' },
                { label: 'Alat Perjudian & Permainan', value: 'Alat Perjudian & Permainan', kelompok: 'PERJUDIAN', satuan: 'Set' },
                { label: 'Barang Bukti Lainnya', value: 'Barang Bukti Lainnya', kelompok: 'UMUM', satuan: 'Buah' },
            ];
            this.masterJenisCache = { expiresAt: Date.now() + 600000, items };
        }
        const q = String(search || '').trim().toUpperCase();
        const filtered = q
            ? this.masterJenisCache.items.filter(it => it.label.toUpperCase().includes(q) || it.kelompok.toUpperCase().includes(q))
            : this.masterJenisCache.items;
        return { data: filtered };
    }
    async resolveSatkerTreeIds(targetSatkerId) {
        const cached = this.satkerTreeCache.get(targetSatkerId);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.ids;
        }
        const rows = await this.dataSource.query(targetSatkerId === 13
            ? `with recursive tree as (
                       select id from bdb_satker where id = 13 or upper(coalesce(nama_singkat,'')) like '%BARESKRIM%' or upper(coalesce(deskripsi,'')) like '%BARESKRIM%'
                       union
                       select s.id from bdb_satker s join tree t on s.parent_id = t.id
                   ) select id::int as id from tree`
            : `with recursive tree as (
                       select id from bdb_satker where id = $1
                       union
                       select s.id from bdb_satker s join tree t on s.parent_id = t.id
                   ) select id::int as id from tree`, targetSatkerId === 13 ? [] : [targetSatkerId]);
        const ids = rows.map((r) => Number(r.id)).filter((n) => Number.isSafeInteger(n) && n > 0);
        const finalIds = ids.length > 0 ? ids : [targetSatkerId];
        this.satkerTreeCache.set(targetSatkerId, { expiresAt: Date.now() + 600000, ids: finalIds });
        return finalIds;
    }
    toText(v) {
        if (v === undefined || v === null)
            return null;
        const t = String(v).trim();
        return t ? t : null;
    }
    toDate(v) {
        if (!v)
            return null;
        const t = String(v).trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(t))
            return null;
        const todayWib = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
        if (t > todayWib)
            throw new common_1.BadRequestException('Tanggal penyitaan tidak boleh di masa depan (melebihi hari ini).');
        return t;
    }
    scopeClause(scope, params, query) {
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
    normalizeCachePeriod(fromRaw, toRaw) {
        const f = this.toText(fromRaw) || '';
        const t = this.toText(toRaw) || '';
        if (!f && !t) return { from: '', to: '' };
        if (f === '2026-01-01' && (!t || t.startsWith('2026-11-') || t === '2026-12-31')) {
            return { from: '2026-01-01', to: '2026-DEFAULT' };
        }
        return { from: f, to: t };
    }
    async ensureBbFastCacheTable() {
        if (this.bbFastCacheReady) return;
        this.bbFastCacheReady = true;
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS bdb_barang_bukti_fast_cache (
                cache_key TEXT PRIMARY KEY,
                payload JSONB NOT NULL,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `).catch(() => {});
    }
    summaryKey(scope, query) {
        const p = this.normalizeCachePeriod(query.from, query.to);
        return JSON.stringify({
            all: !!scope.all,
            satkerId: scope.satkerId ?? null,
            querySatkerId: Number(query?.satker_id || 0),
            search: (this.toText(query.search) || '').toLowerCase(),
            from: p.from,
            to: p.to,
        });
    }
    listKey(scope, query, page, limit) {
        const p = this.normalizeCachePeriod(query.from, query.to);
        return JSON.stringify({
            all: !!scope.all,
            satkerId: scope.satkerId ?? null,
            querySatkerId: Number(query?.satker_id || 0),
            search: (this.toText(query.search) || '').toLowerCase(),
            status: (this.toText(query.status) || 'ALL').toUpperCase(),
            sumber: (this.toText(query.sumber) || 'ALL').toUpperCase(),
            from: p.from,
            to: p.to,
            page,
            limit,
        });
    }
    normalizedJenisSql(alias = 'bb') {
        const src = `concat_ws(' ', ${alias}.jenis_bb, ${alias}.keterangan, ${alias}.ran_jenis, ${alias}.ran_merk)`;
        return `case
            when trim(coalesce(${alias}.jenis_bb, '')) in (
                'Kendaraan Bermotor','Perangkat Elektronik & Komunikasi','Alat Elektronik & Digital','Alat Penerangan & Kelistrikan',
                'Hewan & Ternak','Dokumen & Surat Berharga','Uang Tunai & Logam Mulia','Uang & Mata Uang','Logam Mulia & Perhiasan',
                'Narkotika, Psikotropika & Obat','Senjata Tajam','Senjata Api & Bahan Peledak','Senjata Api, Tajam & Bahan Peledak',
                'Pakaian, Tekstil & Aksesoris','Perkakas, Mesin & Alat Berat','Bahan Bakar, Kimia & Material','Bahan Kimia, BBM & Material',
                'Hasil Hutan, Tambang & Alam','Pangan, Pertanian & Perkebunan','Perabotan & Alat Rumah Tangga','Alat Perjudian & Permainan',
                'Barang Bukti Lainnya'
            ) then trim(${alias}.jenis_bb)
            when (nullif(trim(coalesce(${alias}.ran_jenis, '')), '') is not null
                  or nullif(trim(coalesce(${alias}.ran_merk, '')), '') is not null
                  or ${src} ~* '\\m(sepeda\\s*motor|motor|mobil|truk|truck|pickup|pick\\s*up|bus|ambulans|kendaraan|nopol|plat\\s*nomor|helm|ban\\s*luar|velg|knalpot|honda|yamaha|suzuki|kawasaki|toyota|daihatsu|mitsubishi)\\M')
                 and coalesce(${alias}.jenis_bb, '') !~* '^(stnk|bpkb|dokumen|surat)'
                then 'Kendaraan Bermotor'
            when ${src} ~* '\\m(handphone|hp|ponsel|iphone|samsung|xiaomi|oppo|vivo|realme|infinix|redmi|nokia|laptop|komputer|pc|tablet|ipad|modem|router|flashdisk|harddisk|memory|sim\\s*card|kartu\\s*sim|cctv|kamera|recorder|ht|walkie|elektronik|telepon|tv|televisi|monitor|printer|speaker|headset|charger|powerbank)\\M'
                then 'Perangkat Elektronik & Komunikasi'
            when ${src} ~* '\\m(senter|lampu|bohlam|kabel|listrik|aki|baterai|battery|genset|inverter|trav?o|saklar|stop\\s*kontak|meteran\\s*listrik|solder)\\M'
                then 'Alat Penerangan & Kelistrikan'
            when ${src} ~* '\\m(sabu|shabu|ganja|ekstasi|inex|heroin|kokain|morfin|narkotika|psikotropika|obat|pil|tablet|kapsul|tramadol|hexymer|trihex|dextro|double\\s*l|bong|pipet|pirek|timbangan\\s*digital.*sabu|alat\\s*hisap|tembakau\\s*gorila|sinte)\\M'
                then 'Narkotika, Psikotropika & Obat'
            when ${src} ~* '\\m(dokumen|surat|akta|sertifikat|ijazah|ktp|kk|kartu\\s*keluarga|sim|paspor|stnk|bpkb|kwitansi|kuitansi|nota|faktur|invoice|rekening|buku\\s*tabungan|atm|cek|bilyet|giro|perjanjian|kontrak|berkas|arsip|stempel|materai|bukti\\s*transfer|struk|laporan|formulir|sk|sppkp)\\M'
                then 'Dokumen & Surat Berharga'
            when ${src} ~* '\\m(uang|rupiah|rp|tunai|logam\\s*mulia|emas|perak|cincin|kalung|gelang|anting|perhiasan|berlian|dollar|ringgit|valas)\\M'
                then 'Uang Tunai & Logam Mulia'
            when ${src} ~* '\\m(pisau|parang|golok|celurit|clurit|pedang|badik|keris|rencong|belati|mandau|tombak|panah|busur|sajam|senjata\\s*tajam|sabit|arit|kampak|kapak|kujang|sangkur|cutter|silet|gunting)\\M'
                then 'Senjata Tajam'
            when ${src} ~* '\\m(senpi|senjata\\s*api|pistol|revolver|senapan|laras|amunisi|peluru|selongsong|proyektil|granat|bom|bahan\\s*peledak|petasan|mercon|airsoft|air\\s*gun)\\M'
                then 'Senjata Api & Bahan Peledak'
            when ${src} ~* '\\m(baju|kaos|kemeja|celana|jaket|sweater|hoodie|rok|gamis|daster|jilbab|kerudung|hijab|cadar|zebo|sebo|topi|kupluk|sepatu|sandal|sendal|tas|dompet|ransel|ikat\\s*pinggang|sabuk|kain|sarung|handuk|selimut|sprei|pakaian|celana\\s*dalam|bra|kacamata|jam\\s*tangan)\\M'
                then 'Pakaian, Tekstil & Aksesoris'
            when ${src} ~* '\\m(gergaji|chainsaw|tojok|egrek|dodos|cangkul|sekop|linggis|palu|martil|obeng|kunci\\s*t|kunci\\s*pas|kunci\\s*inggris|tang|bor|gerinda|las|mesin|pompa|alkon|kompresor|excavator|ekskavator|buldoser|alat\\s*berat|traktor|timbangan|katrol|dongkrak|pahat|rantai)\\M'
                then 'Perkakas, Mesin & Alat Berat'
            when ${src} ~* '\\m(bbm|bensin|pertalite|pertamax|solar|biosolar|minyak\\s*tanah|oli|pelumas|gas|lpg|elpiji|tabung\\s*gas|pupuk|pestisida|herbisida|racun|kimia|asam|air\\s*keras|sianida|merkuri|batu\\s*bara|pasir|semen|besi|tembaga|aluminium|timah|bauksit|nikel|aspal|kayu|balok|papan)\\M'
                then 'Bahan Bakar, Kimia & Material'
            when ${src} ~* '\\m(sawit|tbs|tandan\\s*buah\\s*segar|brondolan|karet|getah|kopi|kakao|coklat|cengkeh|lada|kelapa|beras|padi|gabah|jagung|gula|tepung|minyak\\s*goreng|sembako|makanan|minuman|miras|minuman\\s*keras|tuak|ciu|arak|bir|anggur|rokok|tembakau|buah|sayur|bawang|cabai)\\M'
                then 'Pangan, Pertanian & Perkebunan'
            when ${src} ~* '\\m(keranjang|ember|galon|jerigen|jiregen|botol|gelas|piring|mangkok|panci|wajan|kompor|kasur|lemari|meja|kursi|sofa|tempat\\s*tidur|karpet|tikar|terpal|karung|goni|kardus|kotak|box|tali|tambang|plastik|kantong|klip)\\M'
                then 'Perabotan & Alat Rumah Tangga'
            when ${src} ~* '\\m(judi|kartu\\s*remi|kartu\\s*domino|gaple|dadu|togel|kupon|rekapan|rolet|mesin\\s*slot|koin|chip|bola\\s*bilyar|arena\\s*sabung|gebyok)\\M'
                then 'Alat Perjudian & Permainan'
            when ${src} ~* '\\m(ayam|sapi|kerbau|kambing|domba|babi|anjing|kucing|burung|ikan|udang|benur|bibit\\s*lobster|ternak|hewan|satwa|unggas|itik|bebek|kuda|trenggiling|gajah|harimau|orangutan|rusa|ular|buaya|penyu)\\M'
                 and ${src} !~* '\\m(sangkar|kandang|kurungan|jaring|serokan|alat\\s+tangkap|pukat|trawl|troul|pancing|keramba|pakan|pelet)\\M'
                then 'Hewan & Ternak'
            else 'Barang Bukti Lainnya'
        end`;
    }
    normalizedSatuanSql(alias = 'bb', jenisExpr) {
        const jExpr = jenisExpr || this.normalizedJenisSql(alias);
        return `coalesce(
            nullif(btrim(${alias}.satuan), ''),
            case
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(unit|unt)\\M' then 'Unit'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(buah|bh|pcs|pc|piece|pieces|biji|bj)\\M' then 'Buah'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(lembar|lbr|hlm|halaman)\\M' then 'Lembar'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(berkas|bundel|bundle|bendel|map|buku|eksemplar)\\M' then 'Berkas / Bundel'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(ekor|ekr)\\M' then 'Ekor'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(gram|gr|grm)\\M' then 'Gram (g)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(kg|kilo|kilogram|kgm)\\M' then 'Kilogram (Kg)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(liter|ltr|litre)\\M' then 'Liter (L)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(ml|mililiter|milliliter|cc)\\M' then 'Mililiter (mL)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(botol|btl|ampul|vial|flakon)\\M' then 'Botol'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(butir|btr|tablet|tab|pil|kapsul|kaplet)\\M' then 'Butir'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(paket|pkt)\\M' then 'Paket'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(bungkus|bks|slop|pak|pack|sachet|saset|klip|clip|poket|kantong|plastik)\\M' then 'Bungkus'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(karung|krg|goni)\\M' then 'Karung'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(batang|btg|linting)\\M' then 'Batang'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(bilah|blh)\\M' then 'Bilah'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(pucuk|pck)\\M' then 'Pucuk'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(pasang|psg)\\M' then 'Pasang'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(helai|hl|potong|ptg)\\M' then 'Helai'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(set|rangkaian)\\M' then 'Set'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(kotak|box|boks|dus|kardus|karton|peti|krat)\\M' then 'Kotak / Box'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(roll|rol|gulung|glg|kumparan)\\M' then 'Roll / Gulung'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(meter|mtr)\\M' then 'Meter (m)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(rupiah|rp|idr)\\M' then 'Rupiah (Rp)'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(tabung|tbg|silinder)\\M' then 'Tabung'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(jerigen|jrgn|jergen|jiregen|jurigen|dirigen)\\M' then 'Jerigen'
                when coalesce(${alias}.jumlah::text, '') ~* '\\m(keping|kpg|chip)\\M' then 'Keping'
                when (${jExpr}) in ('Kendaraan Bermotor', 'Perangkat Elektronik & Komunikasi', 'Alat Elektronik & Digital', 'Alat Penerangan & Kelistrikan', 'Perkakas, Mesin & Alat Berat') then 'Unit'
                when (${jExpr}) = 'Hewan & Ternak' then 'Ekor'
                when (${jExpr}) = 'Dokumen & Surat Berharga' then 'Lembar'
                when (${jExpr}) in ('Uang Tunai & Logam Mulia', 'Uang & Mata Uang') then 'Rupiah (Rp)'
                when (${jExpr}) in ('Narkotika, Psikotropika & Obat', 'Logam Mulia & Perhiasan') then 'Gram (g)'
                when (${jExpr}) in ('Senjata Tajam', 'Senjata Api, Tajam & Bahan Peledak') then 'Bilah'
                when (${jExpr}) = 'Senjata Api & Bahan Peledak' then 'Pucuk'
                when (${jExpr}) = 'Pakaian, Tekstil & Aksesoris' then 'Helai'
                when (${jExpr}) in ('Bahan Bakar, Kimia & Material', 'Bahan Kimia, BBM & Material') then 'Liter (L)'
                when (${jExpr}) = 'Hasil Hutan, Tambang & Alam' then 'Batang'
                when (${jExpr}) = 'Pangan, Pertanian & Perkebunan' then 'Kilogram (Kg)'
                when (${jExpr}) = 'Alat Perjudian & Permainan' then 'Set'
                else 'Buah'
            end
        )`;
    }
    applyPeriodFilter(query, params, where) {
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
                throw new common_1.BadRequestException('Tanggal akhir tidak boleh sebelum tanggal awal.');
            }
        }
        for (const [name, op] of [['from', '>='], ['to', '<=']]) {
            const value = this.toText(query[name]);
            if (!value)
                continue;
            if (!datePattern.test(value)) {
                throw new common_1.BadRequestException(`Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`);
            }
            params.push(value);
            where.push(`parse_tgl_laporan(lp.tgl_laporan) ${op} $${params.length}::date`);
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
    async globalSummary(scope, query) {
        const key = this.summaryKey(scope, query);
        const cached = this.summaryCache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return { ...cached.data, cached: true };
        }
        if (cached)
            this.summaryCache.delete(key);
        const search = this.toText(query.search);
        if (!search) {
            try {
                const sParams = [];
                const sWhere = ['1=1'];
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
                    }
                    else {
                        sWhere.push(`satker_id in (
                            with recursive st as (
                                select id from bdb_satker where id = ${targetSid}
                                union all
                                select s.id from bdb_satker s join st on s.parent_id = st.id
                            ) select id from st
                        )`);
                    }
                }
                const sRows = await this.dataSource.query(`select
                        coalesce(sum(semua), 0)::int as semua,
                        coalesce(sum(masuk), 0)::int as masuk,
                        coalesce(sum(keluar), 0)::int as keluar,
                        coalesce(sum(dors), 0)::int as dors,
                        coalesce(sum(manual), 0)::int as manual
                     from bdb_barang_bukti_summary_snapshot
                     where ${sWhere.join(' and ')}`, sParams);
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
            }
            catch (snapErr) {
                this.logger.warn('Gagal membaca snapshot BB: ' + snapErr?.message);
            }
        }
        const params = [];
        const rekapSql = this.rekapUnionSql(scope, query, params);
        const where = ['1=1'];
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(c.jenis,'')) like $${p} or lower(coalesce(c.nomor_register,'')) like $${p} or lower(coalesce(c.no_laporan,'')) like $${p} or lower(coalesce(c.keterangan,'')) like $${p})`);
        }
        const rows = await this.dataSource.query(`select
                count(*)::int as semua,
                count(*) filter (where upper(coalesce(c.status,''))='MASUK')::int as masuk,
                count(*) filter (where upper(coalesce(c.status,''))='KELUAR')::int as keluar,
                count(*) filter (where upper(coalesce(c.sumber,''))='DORS')::int as dors,
                count(*) filter (where upper(coalesce(c.sumber,''))='MANUAL')::int as manual
             from (${rekapSql}) c
             where ${where.join(' and ')}`, params);
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
    /** Subquery gabungan DORS + MANUAL, dipakai listByLpAll(). */
    unionSql() {
        return `
            select 'DORS' as sumber, concat('dors-', bb.id)::text as row_id, bb.lp_id as lp_id,
                   null::text as nomor_register,
                   ${this.normalizedJenisSql('bb')} as jenis,
                   bb.jumlah as jumlah,
                   ${this.normalizedSatuanSql('bb')} as satuan,
                   null::text as kepemilikan,
                   null::date as tanggal_penyitaan,
                   'MASUK'::text as status,
                   nullif(trim(concat_ws(' · ', bb.keterangan,
                       nullif(concat_ws(' ', bb.ran_jenis, bb.ran_merk, bb.ran_type, bb.ran_no_registrasi), ''))), '') as keterangan,
                   nullif(trim(concat_ws(' · ', bb.keterangan,
                       nullif(concat_ws(' ', bb.ran_jenis, bb.ran_merk, bb.ran_type, bb.ran_no_registrasi), ''))), '') as nama_barang,
                   false as can_delete,
                   lp.synced_at as created_at
            from bdb_dors_lp_barang_bukti bb
            join bdb_laporan_polisi lp on lp.id = bb.lp_id
            where lp.deleted_at is null

            union all

            select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id,
                   m.nomor_register, m.jenis, m.jumlah,
                   coalesce(nullif(btrim(m.satuan), ''), 'Buah') as satuan,
                   m.kepemilikan, m.tanggal_penyitaan, m.status, m.keterangan,
                   m.keterangan as nama_barang,
                   true as can_delete, m.created_at
            from bdb_lp_barang_bukti_manual m
            where m.deleted_at is null
        `;
    }
    /**
     * Union khusus halaman rekap.
     * Scope + periode LP didorong ke masing-masing branch.
     */
    rekapUnionSql(scope, query, params) {
        const lpWhere = ['lp.deleted_at is null'];
        lpWhere.push(this.scopeClause(scope, params, query));
        this.applyPeriodFilter(query, params, lpWhere);
        const lpFilter = lpWhere.join(' and ');
        return `
            select 'DORS' as sumber, concat('dors-', bb.id)::text as row_id, bb.lp_id,
                   null::text as nomor_register,
                   ${this.normalizedJenisSql('bb')} as jenis,
                   bb.jumlah,
                   ${this.normalizedSatuanSql('bb')} as satuan,
                   null::text as kepemilikan,
                   null::date as tanggal_penyitaan,
                   'MASUK'::text as status,
                   nullif(trim(concat_ws(' · ', bb.keterangan,
                       nullif(concat_ws(' ', bb.ran_jenis, bb.ran_merk, bb.ran_type, bb.ran_no_registrasi), ''))), '') as keterangan,
                   nullif(trim(concat_ws(' · ', bb.keterangan,
                       nullif(concat_ws(' ', bb.ran_jenis, bb.ran_merk, bb.ran_type, bb.ran_no_registrasi), ''))), '') as nama_barang,
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
                   m.nomor_register, m.jenis, m.jumlah,
                   coalesce(nullif(btrim(m.satuan), ''), 'Buah') as satuan,
                   m.kepemilikan, m.tanggal_penyitaan, m.status, m.keterangan,
                   m.keterangan as nama_barang,
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
    async list(authUser, query = {}) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
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
        if (cached)
            this.listCache.delete(cacheKey);
        await this.ensureBbFastCacheTable();
        const dbFastKey = `list:${cacheKey}`;
        const snapRows = await this.dataSource.query(`SELECT payload, (updated_at > now() - interval '30 minutes') AS is_fresh FROM bdb_barang_bukti_fast_cache WHERE cache_key = $1 LIMIT 1`, [dbFastKey]).catch(() => []);
        if (snapRows && snapRows.length && snapRows[0].payload) {
            this.listCache.set(cacheKey, { expiresAt: Date.now() + 1800000, data: snapRows[0].payload });
            return snapRows[0].payload;
        }
        const params = [];
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
        const periodWhere = [];
        this.applyPeriodFilter(query, params, periodWhere);
        const lpWhere = ['lp.deleted_at is null'];
        if (satkerArrParamIdx > 0) {
            lpWhere.push(`coalesce(lp.unit_satker_id, lp.satker_id) = any($${satkerArrParamIdx}::bigint[])`);
        }
        else {
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
        const dorsWhere = [lpFilter];
        if (searchParamIdx > 0) {
            dorsWhere.push(`(lower(coalesce(bb.jenis_bb,'')) like $${searchParamIdx} or lower(coalesce(bb.keterangan,'')) like $${searchParamIdx} or lower(coalesce(bb.ran_jenis,'')) like $${searchParamIdx} or lower(coalesce(bb.ran_merk,'')) like $${searchParamIdx} or lower(coalesce(lp.no_laporan,'')) like $${searchParamIdx})`);
        }
        const manualWhere = ['m.deleted_at is null', lpFilter];
        if (statusFilter) {
            params.push(statusFilter);
            manualWhere.push(`upper(coalesce(m.status, 'MASUK')) = $${params.length}`);
        }
        if (searchParamIdx > 0) {
            manualWhere.push(`(lower(coalesce(m.jenis,'')) like $${searchParamIdx} or lower(coalesce(m.nomor_register,'')) like $${searchParamIdx} or lower(coalesce(m.keterangan,'')) like $${searchParamIdx} or lower(coalesce(lp.no_laporan,'')) like $${searchParamIdx})`);
        }
        const branches = [];
        if (includeDors) {
            if (satkerArrParamIdx > 0 && searchParamIdx === 0) {
                const lateralPeriod = periodWhere.length > 0 ? `and ${periodWhere.join(' and ')}` : '';
                branches.push(`(
                    with matching_lps as materialized (
                        select lp.*
                        from unnest($${satkerArrParamIdx}::bigint[]) as sid
                        cross join lateral (
                            select lp.id, lp.synced_at, lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_satker_id, lp.unit_satker_nama, lp.unit_nama
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
                           ${this.normalizedSatuanSql('bb')} as satuan,
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
                           lp.unit_satker_id,
                           lp.unit_satker_nama,
                           lp.unit_nama
                    from matching_lps lp
                    join bdb_dors_lp_barang_bukti bb on bb.lp_id = lp.id
                    order by (bb.lp_id + 0) desc, bb.id desc
                    limit ${fetchLimit}
                )`);
            }
            else {
                branches.push(`(
                    select 'DORS'::text as sumber,
                           concat('dors-', bb.id)::text as row_id,
                           bb.lp_id,
                           null::text as nomor_register,
                           ${this.normalizedJenisSql('bb')} as jenis,
                           bb.jumlah,
                           ${this.normalizedSatuanSql('bb')} as satuan,
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
                           lp.unit_satker_id,
                           lp.unit_satker_nama,
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
                       coalesce(nullif(btrim(m.satuan), ''), 'Buah') as satuan,
                       m.kepemilikan,
                       m.tanggal_penyitaan,
                       m.status,
                       m.keterangan,
                       true as can_delete,
                       m.created_at,
                       lp.no_laporan,
                       lp.satker_id,
                       lp.satker_nama,
                       lp.unit_satker_id,
                       lp.unit_satker_nama,
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
        const rows = await this.dataSource.query(`with paged as (
                select *
                from (
                    ${branches.join(' union all ')}
                ) c
                order by c.created_at desc nulls last, c.lp_id desc
                limit $${limitParam} offset $${offsetParam}
             )
             select p.sumber, p.row_id, p.lp_id, p.nomor_register, p.jenis, p.jumlah, p.satuan, p.kepemilikan, p.tanggal_penyitaan,
                    p.status, p.keterangan, p.keterangan as nama_barang, p.can_delete, p.created_at,
                    p.no_laporan, p.satker_id, p.satker_nama, p.unit_satker_id, p.unit_satker_nama, p.unit_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(lp_tp.payload_json->'tindak_pidana')='array' then lp_tp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             from paged p
             left join bdb_laporan_polisi lp_tp on lp_tp.id = p.lp_id`, params);
        const hasNext = rows.length > limit;
        const response = {
            data: rows.slice(0, limit),
            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'lookahead-no-count' }
        };
        this.listCache.set(cacheKey, {
            expiresAt: Date.now() + 1800000,
            data: response,
        });
        if (page === 1 && !search) {
            await this.dataSource.query(`
                INSERT INTO bdb_barang_bukti_fast_cache (cache_key, payload, updated_at)
                VALUES ($1, $2::jsonb, now())
                ON CONFLICT (cache_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()
            `, [dbFastKey, JSON.stringify(response)]).catch(() => {});
        }
        return response;
    }
    /** Gabungan DORS + MANUAL utk SATU LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    async listByLpAll(authUser, lpId) {
        const lpRows = await this.dataSource.query('select id from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const rows = await this.dataSource.query(`select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.satuan, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.nama_barang, c.can_delete, c.created_at
             from (${this.unionSql()}) c
             where c.lp_id = $1
             order by c.created_at desc`, [lpId]);
        return { data: rows };
    }
    async assertAccess(authUser, lp, scope) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Anda tidak memiliki wewenang untuk mengubah Barang Bukti milik Satker lain.');
        }
        await this.monitoring.assertNotViewer(authUser?.id ? Number(authUser.id) : undefined, authUser);
        if (scope.all) {
            return;
        }
        const userSatkerId = Number(scope.satkerId || 0);
        if (!Number.isSafeInteger(userSatkerId) || userSatkerId <= 0) {
            throw new common_1.ForbiddenException('Anda tidak memiliki wewenang untuk mengubah Barang Bukti milik Satker lain.');
        }
        const ownSatkerIds = await this.resolveSatkerTreeIds(userSatkerId);
        const effOwnerId = Number(lp.unit_satker_id || lp.satker_id || 0);
        const lpSatkerId = Number(lp.satker_id || 0);
        const isOwn = (effOwnerId > 0 && ownSatkerIds.includes(effOwnerId))
            || (!lp.unit_satker_id && lpSatkerId > 0 && ownSatkerIds.includes(lpSatkerId));
        if (!isOwn) {
            throw new common_1.ForbiddenException('Anda tidak memiliki wewenang untuk mengubah Barang Bukti milik Satker lain.');
        }
    }
    async assertLpAccess(authUser, lpId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, jenis_kejahatan_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        await this.assertAccess(authUser, lp, scope);
        return lp;
    }
    async addManual(authUser, lpId, dto) {
        const lp = await this.assertLpAccess(authUser, lpId);
        const jenis = this.toText(dto?.jenis);
        if (!jenis)
            throw new common_1.BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status))
            throw new common_1.BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);
        const satuan = await this.registerAndNormalizeSatuan(dto?.satuan, 'Buah');
        const rows = await this.dataSource.query(`insert into bdb_lp_barang_bukti_manual (lp_id, nomor_register, jenis, jumlah, satuan, kepemilikan, tanggal_penyitaan, status, keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             returning id`, [
            lpId,
            this.toText(dto?.nomor_register),
            jenis,
            this.toText(dto?.jumlah),
            satuan,
            this.toText(dto?.kepemilikan),
            this.toDate(dto?.tanggal_penyitaan),
            status,
            this.toText(dto?.keterangan ?? dto?.nama_barang),
            authUser?.id ? Number(authUser.id) : null
        ]);
        this.summaryCache.clear();
        this.listCache.clear();
        await this.dataSource.query('TRUNCATE TABLE bdb_barang_bukti_fast_cache').catch(() => {});
        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'barang_bukti_manual', entityId: rows[0].id, meta: { lp_id: lpId, no_laporan: lp.no_laporan, jenis, satuan, status } });
        return this.detail(rows[0].id);
    }
    async detail(id) {
        const rows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        return { sumber: 'MANUAL', row_id: rows[0].id, can_delete: true, nama_barang: rows[0].keterangan, ...rows[0] };
    }
    async updateDors(authUser, id, dto) {
        return this.updateManual(authUser, `dors-${String(id ?? '').replace(/^dors-/i, '')}`, dto);
    }
    async updateManual(authUser, rowIdRaw, dto) {
        const rawStr = String(rowIdRaw ?? '').trim();
        const isDors = /^dors-/i.test(rawStr) || String(dto?.sumber || '').toUpperCase() === 'DORS';
        if (isDors) {
            const cleaned = rawStr.replace(/^dors-/i, '');
            const parts = cleaned.split('-').map((x) => Number(x));
            let dorsRow = null;
            if (parts.length === 1 && Number.isSafeInteger(parts[0]) && parts[0] > 0) {
                const r = await this.dataSource.query('select * from bdb_dors_lp_barang_bukti where id=$1', [parts[0]]);
                dorsRow = r[0] || null;
            }
            else if (parts.length >= 2 && Number.isSafeInteger(parts[0]) && parts[0] > 0) {
                const ord = Math.max(1, parts[1] || 1);
                const r = await this.dataSource.query('select * from bdb_dors_lp_barang_bukti where lp_id=$1 order by id asc offset $2 limit 1', [parts[0], ord - 1]);
                dorsRow = r[0] || null;
            }
            if (!dorsRow)
                throw new common_1.NotFoundException('Data barang bukti DORS tidak ditemukan.');
            let targetLpId = Number(dorsRow.lp_id || 0);
            if ((!targetLpId || !Number.isSafeInteger(targetLpId)) && dorsRow.dors_lp_id) {
                const lpLookup = await this.dataSource.query(
                    'select id from bdb_laporan_polisi where dors_lp_id = $1 and ($2::text is null or model_lp = $2) and deleted_at is null limit 1',
                    [dorsRow.dors_lp_id, dorsRow.model_lp || null]
                );
                if (lpLookup.length)
                    targetLpId = Number(lpLookup[0].id);
            }
            const lp = await this.assertLpAccess(authUser, targetLpId);
            const satuan = await this.registerAndNormalizeSatuan(this.toText(dto?.satuan) ?? dorsRow.satuan, 'Buah');
            const jenis = this.toText(dto?.jenis ?? dto?.jenis_bb) ?? dorsRow.jenis_bb;
            const jumlah = this.toText(dto?.jumlah) ?? dorsRow.jumlah;
            const keterangan = this.toText(dto?.keterangan ?? dto?.nama_barang) ?? dorsRow.keterangan;
            await this.dataSource.query(`update bdb_dors_lp_barang_bukti
                 set satuan = $2, jenis_bb = $3, jumlah = $4, keterangan = $5
                 where id = $1`, [dorsRow.id, satuan, jenis, jumlah, keterangan]);
            this.summaryCache.clear();
            this.listCache.clear();
            await this.dataSource.query('TRUNCATE TABLE bdb_barang_bukti_fast_cache').catch(() => {});
            await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'barang_bukti_dors', entityId: dorsRow.id, meta: { lp_id: dorsRow.lp_id, no_laporan: lp.no_laporan, jenis, satuan } });
            const updated = await this.dataSource.query('select * from bdb_dors_lp_barang_bukti where id=$1', [dorsRow.id]);
            const u = updated[0] || dorsRow;
            return {
                sumber: 'DORS',
                row_id: `dors-${u.id}`,
                lp_id: u.lp_id,
                jenis: u.jenis_bb,
                jumlah: u.jumlah,
                satuan: u.satuan || satuan,
                status: 'MASUK',
                keterangan: u.keterangan,
                nama_barang: u.keterangan,
                can_delete: false,
            };
        }
        const rowId = Number(rawStr);
        if (!Number.isSafeInteger(rowId) || rowId <= 0)
            throw new common_1.BadRequestException('ID barang bukti tidak valid.');
        const existingRows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [rowId]);
        if (!existingRows.length) {
            // Fallback: jika ID numerik ternyata milik bdb_dors_lp_barang_bukti
            const dorsFallback = await this.dataSource.query('select id from bdb_dors_lp_barang_bukti where id=$1', [rowId]);
            if (dorsFallback.length) {
                return this.updateManual(authUser, `dors-${rowId}`, dto);
            }
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        }
        const existing = existingRows[0];
        const lp = await this.assertLpAccess(authUser, Number(existing.lp_id));
        const jenis = this.toText(dto?.jenis) ?? existing.jenis;
        if (!jenis)
            throw new common_1.BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || existing.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status))
            throw new common_1.BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);
        const satuan = await this.registerAndNormalizeSatuan(this.toText(dto?.satuan) ?? existing.satuan, 'Buah');
        await this.dataSource.query(`update bdb_lp_barang_bukti_manual set
                nomor_register=$2, jenis=$3, jumlah=$4, satuan=$5, kepemilikan=$6, tanggal_penyitaan=$7, status=$8, keterangan=$9, updated_at=now()
             where id=$1`, [
            rowId,
            this.toText(dto?.nomor_register) ?? existing.nomor_register,
            jenis,
            this.toText(dto?.jumlah) ?? existing.jumlah,
            satuan,
            this.toText(dto?.kepemilikan) ?? existing.kepemilikan,
            this.toDate(dto?.tanggal_penyitaan) ?? existing.tanggal_penyitaan,
            status,
            this.toText(dto?.keterangan ?? dto?.nama_barang) ?? existing.keterangan
        ]);
        this.summaryCache.clear();
        this.listCache.clear();
        await this.dataSource.query('TRUNCATE TABLE bdb_barang_bukti_fast_cache').catch(() => {});
        await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'barang_bukti_manual', entityId: rowId, meta: { lp_id: existing.lp_id, no_laporan: lp.no_laporan, jenis, satuan, status } });
        return this.detail(rowId);
    }
    async removeManual(authUser, id) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus entri barang bukti manual.');
        }
        const rows = await this.dataSource.query('select id, lp_id, jenis from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        await this.assertLpAccess(authUser, Number(rows[0].lp_id));
        await this.dataSource.query('update bdb_lp_barang_bukti_manual set deleted_at = now() where id=$1', [id]);
        this.summaryCache.clear();
        this.listCache.clear();
        await this.dataSource.query('TRUNCATE TABLE bdb_barang_bukti_fast_cache').catch(() => {});
        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'barang_bukti_manual', entityId: id, meta: { lp_id: rows[0].lp_id, jenis: rows[0].jenis } });
        return { status: 1, message: 'Barang bukti manual dihapus.' };
    }
};
exports.BarangBuktiService = BarangBuktiService;
exports.BarangBuktiService = BarangBuktiService = BarangBuktiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _a : Object, typeof (_b = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _b : Object, typeof (_c = typeof lp_monitoring_access_service_1.LpMonitoringAccessService !== "undefined" && lp_monitoring_access_service_1.LpMonitoringAccessService) === "function" ? _c : Object])
], BarangBuktiService);
