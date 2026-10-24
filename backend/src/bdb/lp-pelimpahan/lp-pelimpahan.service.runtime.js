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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LpPelimpahanService = exports.POLDA_WILAYAH_MAP = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const id_cipher_util_1 = require("../laporan-polisi/id-cipher.util");
const minio_service_1 = require("../kerma/minio.service");
const lp_monitoring_access_service_1 = require("../common/lp-monitoring-access.service");
exports.POLDA_WILAYAH_MAP = {
    '060.01.02': { name: 'Aceh', code: '11' },
    '060.01.03': { name: 'Sumatera Utara', code: '12' },
    '060.01.04': { name: 'Sumatera Barat', code: '13' },
    '060.01.05': { name: 'Riau', code: '14' },
    '060.01.06': { name: 'Kepulauan Riau', code: '21' },
    '060.01.07': { name: 'Sumatera Selatan', code: '16' },
    '060.01.08': { name: 'Kepulauan Bangka Belitung', code: '19' },
    '060.01.09': { name: 'Bengkulu', code: '17' },
    '060.01.10': { name: 'Jambi', code: '15' },
    '060.01.11': { name: 'Lampung', code: '18' },
    '060.01.12': { name: 'DKI Jakarta', code: '31', altCodes: ['32', '36'] },
    '060.01.13': { name: 'Jawa Barat', code: '32' },
    '060.01.14': { name: 'Banten', code: '36' },
    '060.01.15': { name: 'Jawa Tengah', code: '33' },
    '060.01.16': { name: 'Daerah Istimewa Yogyakarta', code: '34' },
    '060.01.17': { name: 'Jawa Timur', code: '35' },
    '060.01.18': { name: 'Kalimantan Barat', code: '61' },
    '060.01.19': { name: 'Kalimantan Selatan', code: '63' },
    '060.01.20': { name: 'Kalimantan Tengah', code: '62' },
    '060.01.21': { name: 'Kalimantan Timur', code: '64' },
    '060.01.22': { name: 'Bali', code: '51' },
    '060.01.23': { name: 'Nusa Tenggara Barat', code: '52' },
    '060.01.24': { name: 'Nusa Tenggara Timur', code: '53' },
    '060.01.25': { name: 'Sulawesi Selatan', code: '73' },
    '060.01.26': { name: 'Sulawesi Tenggara', code: '74' },
    '060.01.27': { name: 'Sulawesi Tengah', code: '72' },
    '060.01.28': { name: 'Sulawesi Utara', code: '71' },
    '060.01.29': { name: 'Gorontalo', code: '75' },
    '060.01.30': { name: 'Maluku', code: '81' },
    '060.01.31': { name: 'Maluku Utara', code: '82' },
    '060.01.32': { name: 'Papua', code: '91', altCodes: ['93', '95'] },
    '060.01.33': { name: 'Papua Barat', code: '92' },
    '060.01.34': { name: 'Sulawesi Barat', code: '76' },
    '060.01.35': { name: 'Kalimantan Utara', code: '65' },
    '060.01.36': { name: 'Papua Barat Daya', code: '96', altCodes: ['92'] },
    '060.01.37': { name: 'Papua Tengah', code: '94' },
};
let LpPelimpahanService = class LpPelimpahanService {
    dataSource;
    minio;
    monitoring;
    logger = new common_1.Logger('LpPelimpahanService');
    constructor(dataSource, minio, monitoring) {
        this.dataSource = dataSource;
        this.minio = minio;
        this.monitoring = monitoring;
    }
    schemaCheck = null;
    async ensureTable() {
        if (!this.schemaCheck) {
            this.schemaCheck = (async () => {
                await this.dataSource.query(`select id,lp_id,satker_asal_id,satker_tujuan_id,
                    satker_eksternal_id,satker_eksternal_nama,nomor_dokumen,tanggal_dokumen
                    from bdb_lp_pelimpahan where false`);
                await this.dataSource.query(`select id,pelimpahan_id,file_name,object_key,content_type,size
                    from bdb_lp_pelimpahan_attachments where false`);
                await this.dataSource.query(`select sudah_dilimpahkan,dilimpahkan_eksternal
                    from bdb_laporan_polisi where false`);
            })().catch((error) => { this.schemaCheck = null; throw error; });
        }
        await this.schemaCheck;
    }
    async lpRow(lpId) {
        const rows = await this.dataSource.query('select id, satker_id, satker_nama, unit_satker_id, unit_satker_nama, no_laporan, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [lpId]);
        return rows[0] || null;
    }
    extractRegencyKeyword(nama) {
        if (!nama)
            return null;
        const cleaned = nama.trim()
            .replace(/^POLRESTABES\s+/i, '')
            .replace(/^POLRESTA\s+/i, '')
            .replace(/^POLRES\s+METRO\s+/i, '')
            .replace(/^POLRES\s+/i, '')
            .replace(/^POLSEKTA\s+/i, '')
            .replace(/^POLSEK\s+/i, '')
            .trim();
        return cleaned.length > 2 ? cleaned : null;
    }
    async getSatkerHierarchy(satkerId) {
        const rows = await this.dataSource.query(`WITH RECURSIVE satker_chain AS (
                SELECT id, kode, deskripsi, tipe_satker, parent_id, 0 as lvl
                FROM bdb_satker
                WHERE id = $1
                UNION ALL
                SELECT p.id, p.kode, p.deskripsi, p.tipe_satker, p.parent_id, c.lvl + 1
                FROM bdb_satker p
                JOIN satker_chain c ON p.id = c.parent_id
            )
            SELECT 
                max(CASE WHEN tipe_satker = 'POLDA' THEN id END) AS polda_id,
                max(CASE WHEN tipe_satker = 'POLDA' THEN deskripsi END) AS polda_nama,
                max(CASE WHEN tipe_satker = 'POLDA' THEN kode END) AS polda_kode,
                max(CASE WHEN tipe_satker = 'POLRES' THEN id END) AS polres_id,
                max(CASE WHEN tipe_satker = 'POLRES' THEN deskripsi END) AS polres_nama,
                max(CASE WHEN tipe_satker = 'POLSEK' THEN id END) AS polsek_id,
                max(CASE WHEN tipe_satker = 'POLSEK' THEN deskripsi END) AS polsek_nama,
                bool_or(tipe_satker = 'POLSEK') AS has_polsek,
                bool_or(tipe_satker = 'POLRES') AS has_polres,
                bool_or(tipe_satker = 'POLDA') AS has_polda
            FROM satker_chain`, [satkerId]);
        const r = rows[0] || {};
        let tier = 'MABES';
        if (r.has_polsek)
            tier = 'POLSEK';
        else if (r.has_polres)
            tier = 'POLRES';
        else if (r.has_polda)
            tier = 'POLDA';
        const poldaKode = r.polda_kode ? String(r.polda_kode).trim() : null;
        let provinsiName = null;
        let provinsiKode = null;
        let provinsiAltCodes = [];
        if (poldaKode && exports.POLDA_WILAYAH_MAP[poldaKode]) {
            const w = exports.POLDA_WILAYAH_MAP[poldaKode];
            provinsiName = w.name;
            provinsiKode = w.code;
            provinsiAltCodes = w.altCodes || [];
        }
        else if (r.polda_nama) {
            const matchedKey = Object.keys(exports.POLDA_WILAYAH_MAP).find((k) => r.polda_nama.toUpperCase().includes(exports.POLDA_WILAYAH_MAP[k].name.toUpperCase()));
            if (matchedKey) {
                const w = exports.POLDA_WILAYAH_MAP[matchedKey];
                provinsiName = w.name;
                provinsiKode = w.code;
                provinsiAltCodes = w.altCodes || [];
            }
        }
        const regencyKeyword = this.extractRegencyKeyword(r.polres_nama);
        return {
            id: Number(satkerId),
            tier,
            poldaId: r.polda_id ? Number(r.polda_id) : null,
            poldaNama: r.polda_nama || null,
            poldaKode,
            polresId: r.polres_id ? Number(r.polres_id) : null,
            polresNama: r.polres_nama || null,
            polsekId: r.polsek_id ? Number(r.polsek_id) : null,
            polsekNama: r.polsek_nama || null,
            provinsiName,
            provinsiKode,
            provinsiAltCodes,
            regencyKeyword,
        };
    }
    async getAllowedTargetSatkers(currentOwnerId) {
        const hier = await this.getSatkerHierarchy(currentOwnerId);
        let induk = [];
        let anak = [];
        let sesama = [];
        if (hier.tier === 'POLSEK') {
            if (hier.polresId) {
                induk = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                     where parent_id = $1 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true
                       and (
                           deskripsi ilike '%RESKRIM%' or deskripsi ilike '%SATRESKRIM%'
                           or deskripsi ilike '%NARKOBA%' or deskripsi ilike '%POL AIR%' or deskripsi ilike '%POLAIRUD%'
                           or deskripsi ilike '%LANTAS%' or deskripsi ilike '%TAHTI%'
                       )
                     order by deskripsi asc`, [hier.polresId]);
                if (induk.length === 0) {
                    induk = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker where id = $1`, [hier.polresId]);
                }
            }
            anak = [];
            if (hier.polresId) {
                sesama = await this.dataSource.query(`select u.id, u.kode, u.deskripsi
                     from bdb_satker p
                     join bdb_satker u on u.parent_id = p.id and (u.deskripsi ilike '%RESKRIM%' or u.deskripsi ilike '%UNIT RESKRIM%')
                     where p.parent_id = $1 and p.tipe_satker = 'POLSEK' and coalesce(p.kinerja_aktif, true) = true and coalesce(u.kinerja_aktif, true) = true
                       and u.id != $2
                     order by u.deskripsi asc`, [hier.polresId, currentOwnerId]);
            }
        }
        else if (hier.tier === 'POLRES') {
            if (hier.poldaId) {
                induk = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                     where parent_id = $1 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true
                       and (
                           deskripsi ilike '%KRIM%' or deskripsi ilike '%NARKOBA%'
                           or deskripsi ilike '%SIBER%' or deskripsi ilike '%POLAIR%' or deskripsi ilike '%LANTAS%'
                       )
                     order by deskripsi asc`, [hier.poldaId]);
                if (induk.length === 0) {
                    induk = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker where id = $1`, [hier.poldaId]);
                }
            }
            if (hier.polresId) {
                anak = await this.dataSource.query(`select u.id, u.kode, u.deskripsi
                     from bdb_satker p
                     join bdb_satker u on u.parent_id = p.id and (u.deskripsi ilike '%RESKRIM%' or u.deskripsi ilike '%UNIT RESKRIM%')
                     where p.parent_id = $1 and p.tipe_satker = 'POLSEK' and coalesce(p.kinerja_aktif, true) = true and coalesce(u.kinerja_aktif, true) = true
                     order by u.deskripsi asc`, [hier.polresId]);
            }
            const samePolresUnits = hier.polresId
                ? await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                       where parent_id = $1 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true and id != $2
                         and (deskripsi ilike '%RESKRIM%' or deskripsi ilike '%NARKOBA%' or deskripsi ilike '%POL AIR%' or deskripsi ilike '%POLAIRUD%' or deskripsi ilike '%LANTAS%')
                       order by deskripsi asc`, [hier.polresId, currentOwnerId])
                : [];
            const siblingPolresUnits = hier.poldaId
                ? await this.dataSource.query(`select coalesce(u.id, p.id) as id, coalesce(u.kode, p.kode) as kode, coalesce(u.deskripsi, p.deskripsi) as deskripsi
                       from bdb_satker p
                       left join bdb_satker u on u.parent_id = p.id and coalesce(u.kinerja_aktif, true) = true and (u.deskripsi ilike '%SAT RESKRIM%' or u.deskripsi ilike '%SATRESKRIM%') where p.parent_id = $1 and p.tipe_satker = 'POLRES' and coalesce(p.kinerja_aktif, true) = true and p.id != $2
                       order by coalesce(u.deskripsi, p.deskripsi) asc`, [hier.poldaId, hier.polresId])
                : [];
            sesama = [...samePolresUnits, ...siblingPolresUnits];
        }
        else if (hier.tier === 'POLDA') {
            induk = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                 where parent_id = 13 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true
                   and (deskripsi ilike '%DIT %' or deskripsi ilike '%DITTIPID%' or deskripsi ilike '%TIPID%')
                 order by deskripsi asc`);
            if (hier.poldaId) {
                anak = await this.dataSource.query(`select coalesce(u.id, p.id) as id, coalesce(u.kode, p.kode) as kode, coalesce(u.deskripsi, p.deskripsi) as deskripsi
                     from bdb_satker p
                     left join bdb_satker u on u.parent_id = p.id and coalesce(u.kinerja_aktif, true) = true and (u.deskripsi ilike '%SAT RESKRIM%' or u.deskripsi ilike '%SATRESKRIM%') where p.parent_id = $1 and p.tipe_satker = 'POLRES' and coalesce(p.kinerja_aktif, true) = true
                     order by coalesce(u.deskripsi, p.deskripsi) asc`, [hier.poldaId]);
            }
            if (hier.poldaId) {
                const samePoldaUnits = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                     where parent_id = $1 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true and id != $2
                       and (deskripsi ilike '%KRIM%' or deskripsi ilike '%NARKOBA%' or deskripsi ilike '%SIBER%' or deskripsi ilike '%POLAIR%')
                     order by deskripsi asc`, [hier.poldaId, currentOwnerId]);
                const otherPoldas = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                     where tipe_satker = 'POLDA' and coalesce(kinerja_aktif, true) = true and id != $1
                     order by deskripsi asc`, [hier.poldaId]);
                const otherPoldaUnits = await this.dataSource.query(`select u.id, u.kode, concat(p.deskripsi, ' - ', u.deskripsi) as deskripsi
                     from bdb_satker p
                     join bdb_satker u on u.parent_id = p.id and u.tipe_satker = 'FUNGSI'
                     where p.tipe_satker = 'POLDA' and coalesce(p.kinerja_aktif, true) = true and coalesce(u.kinerja_aktif, true) = true and p.id != $1
                       and (u.deskripsi ilike '%KRIM%' or u.deskripsi ilike '%NARKOBA%' or u.deskripsi ilike '%SIBER%' or u.deskripsi ilike '%POLAIR%')
                     order by p.deskripsi asc, u.deskripsi asc`, [hier.poldaId]);
                sesama = [...samePoldaUnits, ...otherPoldas, ...otherPoldaUnits];
            }
        }
        else {
            induk = [];
            anak = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                 where coalesce(kinerja_aktif, true) = true and parent_id in (select id from bdb_satker where tipe_satker = 'POLDA' and coalesce(kinerja_aktif, true) = true)
                   and (deskripsi ilike '%KRIM%' or deskripsi ilike '%NARKOBA%' or deskripsi ilike '%SIBER%')
                 order by deskripsi asc`);
            sesama = await this.dataSource.query(`select id, kode, deskripsi from bdb_satker
                 where parent_id = 13 and tipe_satker = 'FUNGSI' and coalesce(kinerja_aktif, true) = true and id != $1
                   and (deskripsi ilike '%DIT %' or deskripsi ilike '%DITTIPID%' or deskripsi ilike '%TIPID%')
                 order by deskripsi asc`, [currentOwnerId]);
        }
        return { induk, anak, sesama, tier: hier.tier };
    }
    async allowedTargets(lpId, userId) {
        const lp = await this.lpRow(lpId);
        if (!lp)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const currentOwnerId = Number(lp.unit_satker_id ?? lp.satker_id ?? 0);
        if (!scope.all && currentOwnerId !== scope.satkerId) {
            throw new common_1.ForbiddenException('Mode monitoring tidak dapat melakukan pelimpahan. Hubungi operator satker pemilik LP.');
        }
        if (!currentOwnerId)
            return { status: 1, data: { induk: [], anak: [], sesama: [] } };
        const targets = await this.getAllowedTargetSatkers(currentOwnerId);
        return { status: 1, data: targets };
    }
    async isAllowedTarget(currentSatkerId, targetSatkerId) {
        if (currentSatkerId === targetSatkerId)
            return false;
        const targets = await this.getAllowedTargetSatkers(currentSatkerId);
        const allAllowed = new Set([
            ...targets.induk.map((t) => Number(t.id)),
            ...targets.anak.map((t) => Number(t.id)),
            ...targets.sesama.map((t) => Number(t.id)),
        ]);
        return allAllowed.has(Number(targetSatkerId));
    }
    async allowedExternalTargets(lpId, userId) {
        const lp = await this.lpRow(lpId);
        if (!lp)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const currentOwnerId = Number(lp.unit_satker_id ?? lp.satker_id ?? 0);
        if (!scope.all && currentOwnerId !== scope.satkerId) {
            throw new common_1.ForbiddenException('Mode monitoring tidak dapat melakukan pelimpahan. Hubungi operator satker pemilik LP.');
        }
        if (!currentOwnerId)
            return { status: 1, data: [] };
        const hier = await this.getSatkerHierarchy(currentOwnerId);
        if (hier.tier === 'MABES') {
            const rows = await this.dataSource.query(`select id, nama, alamat, keterangan, 'PUSAT' as scope_group
                 from bdb_satker_eksternal
                 where keterangan ilike '%Kelompok: Instansi pusat%' or keterangan ilike '%Organisasi pusat%'
                 union all
                 select id, nama, alamat, keterangan, 'PROVINSI' as scope_group
                 from bdb_satker_eksternal
                 where keterangan ilike '%Tingkat provinsi%' or keterangan ilike '%Tingkat: Provinsi%'
                 order by id asc`);
            return { status: 1, data: rows };
        }
        const provPatterns = [];
        if (hier.provinsiName)
            provPatterns.push(`%${hier.provinsiName}%`);
        if (hier.provinsiKode) {
            provPatterns.push(`%Kode wilayah ${hier.provinsiKode}%`, `%Kode wilayah ${hier.provinsiKode}.%`);
        }
        for (const alt of hier.provinsiAltCodes) {
            provPatterns.push(`%Kode wilayah ${alt}%`, `%Kode wilayah ${alt}.%`);
        }
        const regencyKeyword = hier.regencyKeyword ? `%${hier.regencyKeyword}%` : null;
        const includePusat = hier.tier === 'POLDA';
        const isPolda = hier.tier === 'POLDA';
        const rows = await this.dataSource.query(`WITH matched AS (
                -- Instansi Pusat (Hanya dibuka untuk POLDA dan MABES)
                SELECT id, nama, alamat, keterangan, 'PUSAT' as scope_group, 3 as sort_prio
                FROM bdb_satker_eksternal
                WHERE $3::boolean = true AND (keterangan ILIKE '%Kelompok: Instansi pusat%' OR keterangan ILIKE '%Organisasi pusat%')
                
                UNION ALL
                
                -- Instansi Tingkat Provinsi:
                -- Jika POLDA (selevel Mabes): dibuka SELURUH Indonesia (Kejati, Pengadilan Tinggi, BNNP se-Indonesia)
                -- Jika POLRES / POLSEK: HANYA di provinsi sendiri
                SELECT id, nama, alamat, keterangan,
                       CASE WHEN (keterangan ILIKE ANY($1::text[]) OR nama ILIKE ANY($1::text[]))
                            THEN 'PROVINSI_LOKAL' ELSE 'PROVINSI_LAIN' END as scope_group,
                       CASE WHEN (keterangan ILIKE ANY($1::text[]) OR nama ILIKE ANY($1::text[]))
                            THEN 2 ELSE 4 END as sort_prio
                FROM bdb_satker_eksternal
                WHERE (keterangan ILIKE '%Tingkat provinsi%' OR keterangan ILIKE '%Tingkat: Provinsi%')
                  AND ($4::boolean = true OR (keterangan ILIKE ANY($1::text[]) OR nama ILIKE ANY($1::text[])))
                
                UNION ALL
                
                -- Instansi Tingkat Kab/Kota di dalam provinsi satker asal
                SELECT id, nama, alamat, keterangan,
                       CASE WHEN ($2::text IS NOT NULL AND (nama ILIKE $2::text OR alamat ILIKE $2::text))
                            THEN 'WILAYAH_LOKAL' ELSE 'KAB_KOTA_PROVINSI' END as scope_group,
                       CASE WHEN ($2::text IS NOT NULL AND (nama ILIKE $2::text OR alamat ILIKE $2::text))
                            THEN 1 ELSE 5 END as sort_prio
                FROM bdb_satker_eksternal
                WHERE (keterangan NOT ILIKE '%Tingkat provinsi%' AND keterangan NOT ILIKE '%Tingkat: Provinsi%')
                  AND (keterangan NOT ILIKE '%Kelompok: Instansi pusat%' AND keterangan NOT ILIKE '%Organisasi pusat%')
                  AND (keterangan ILIKE ANY($1::text[]) OR nama ILIKE ANY($1::text[]))
            )
            SELECT id, nama, alamat, keterangan, scope_group
            FROM matched
            ORDER BY sort_prio ASC, nama ASC`, [provPatterns, regencyKeyword, includePusat, isPolda]);
        return { status: 1, data: rows };
    }
    async isAllowedExternalTarget(currentSatkerId, targetExternalSatkerId) {
        const hier = await this.getSatkerHierarchy(currentSatkerId);
        if (hier.tier === 'MABES')
            return true;
        const target = await this.dataSource.query(`select id, nama, keterangan from bdb_satker_eksternal where id = $1`, [targetExternalSatkerId]);
        if (!target.length)
            return false;
        const ket = target[0].keterangan || '';
        const isPusat = /Kelompok:\s*Instansi pusat/i.test(ket) || /Organisasi pusat/i.test(ket);
        const isProvinsi = /Tingkat\s*provinsi/i.test(ket) || /Tingkat:\s*Provinsi/i.test(ket);
        if (isPusat) {
            return hier.tier === 'POLDA';
        }
        if (isProvinsi && hier.tier === 'POLDA') {
            return true;
        }
        if (!hier.provinsiName && !hier.provinsiKode) {
            return false;
        }
        const provPatterns = [];
        if (hier.provinsiName)
            provPatterns.push(`%${hier.provinsiName}%`);
        if (hier.provinsiKode) {
            provPatterns.push(`%Kode wilayah ${hier.provinsiKode}%`, `%Kode wilayah ${hier.provinsiKode}.%`);
        }
        for (const alt of hier.provinsiAltCodes) {
            provPatterns.push(`%Kode wilayah ${alt}%`, `%Kode wilayah ${alt}.%`);
        }
        const rows = await this.dataSource.query(`select 1 from bdb_satker_eksternal
             where id = $1 and (
                 keterangan ilike any($2::text[])
                 or nama ilike any($2::text[])
             ) limit 1`, [targetExternalSatkerId, provPatterns]);
        return rows.length > 0;
    }
    async create(opts) {
        await this.monitoring.assertNotViewer(opts?.userId);
        await this.ensureTable();
        const lp = await this.lpRow(opts.lpId);
        if (!lp)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        if (!lp.satker_id)
            throw new common_1.BadRequestException('LP ini belum punya satker penanganan.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, opts.userId);
        const currentOwnerId = Number(lp.unit_satker_id ?? lp.satker_id);
        if (!scope.all && currentOwnerId !== scope.satkerId) {
            const access = await this.monitoring.assertCanAccessLp(opts.userId, opts.lpId);
            if (!access.monitoring) {
                throw new common_1.ForbiddenException('LP tidak dapat diakses oleh akun Anda.');
            }
            const p = String(opts.statement?.pernyataan || '').trim();
            const a = String(opts.statement?.alasan || '').trim();
            if (!p || !a || a.length < 5) {
                throw new common_1.BadRequestException('Tindakan pelimpahan atas nama satker bawahan wajib menyertakan lembar pernyataan dan alasan pertanggungjawaban dinas.');
            }
        }
        if (Number(opts.satkerTujuanId) === currentOwnerId) {
            throw new common_1.BadRequestException('Satker tujuan sama dengan satker saat ini.');
        }
        const allowed = await this.isAllowedTarget(currentOwnerId, Number(opts.satkerTujuanId));
        if (!allowed) {
            throw new common_1.BadRequestException('Satker tujuan harus 1 tingkat di atas, 1 tingkat di bawah, atau sesama tingkat dalam wilayah yurisdiksi yang sama (tidak boleh melompati hierarki).');
        }
        const tujuan = await this.dataSource.query('select id, kode, deskripsi, parent_id, tipe_satker from bdb_satker where id=$1', [opts.satkerTujuanId]);
        if (!tujuan.length)
            throw new common_1.NotFoundException('Satker tujuan tidak ditemukan.');
        let newSatkerId = tujuan[0].id;
        let newSatkerNama = tujuan[0].deskripsi;
        let newUnitId = null;
        let newUnitNama = null;
        let newUnitKode = null;
        if (tujuan[0].parent_id && (tujuan[0].tipe_satker === 'FUNGSI' || tujuan[0].deskripsi.includes('RESKRIM') || tujuan[0].deskripsi.includes('DIT ') || tujuan[0].deskripsi.includes('SAT '))) {
            const parent = await this.dataSource.query('select id, deskripsi, tipe_satker from bdb_satker where id=$1', [tujuan[0].parent_id]);
            if (parent.length && ['POLDA', 'POLRES', 'POLSEK'].includes(String(parent[0].tipe_satker || '').toUpperCase())) {
                newSatkerId = parent[0].id;
                newSatkerNama = parent[0].deskripsi;
                newUnitId = tujuan[0].id;
                newUnitNama = tujuan[0].deskripsi;
                newUnitKode = tujuan[0].kode;
            }
        }
        let userNama = null;
        if (opts.userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [opts.userId]);
            userNama = u[0]?.name || null;
        }
        let pelimpahanId;
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const inserted = await runner.query(`insert into bdb_lp_pelimpahan
                    (lp_id, satker_asal_id, satker_asal_nama, satker_tujuan_id, satker_tujuan_nama, keterangan, nomor_dokumen, tanggal_dokumen, dilimpahkan_oleh, dilimpahkan_oleh_nama)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 returning id`, [opts.lpId, currentOwnerId, lp.unit_satker_nama ?? lp.satker_nama, tujuan[0].id, tujuan[0].deskripsi, opts.keterangan || null, opts.nomorDokumen || null, opts.tanggalDokumen || null, opts.userId || null, userNama]);
            pelimpahanId = inserted[0].id;
            await runner.query(`update bdb_laporan_polisi
                 set satker_id=$2, satker_nama=$3, sudah_dilimpahkan=true,
                     unit_satker_id=$4, unit_satker_nama=$5, unit_satker_kode=$6, updated_at=now()
                 where id=$1`, [opts.lpId, newSatkerId, newSatkerNama, newUnitId, newUnitNama, newUnitKode]);
            const effectiveTargetId = newUnitId ?? newSatkerId;
            await runner.query(`update bdb_kinerja_perkara_snapshot
                 set satker_id=$2,
                     tanggal_mulai_penanganan=coalesce($3::date, current_date),
                     refreshed_at=now()
                 where lp_id=$1`, [opts.lpId, effectiveTargetId, opts.tanggalDokumen || null]);
            await runner.commitTransaction();
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
        this.logger.log(`LP ${opts.lpId} (${lp.no_laporan}) dilimpahkan dari "${lp.satker_nama}" ke "${tujuan[0].deskripsi}" oleh ${userNama || opts.userId || '?'}`);
        return {
            status: 1,
            data: { pelimpahan_id: pelimpahanId, lp_id: opts.lpId, satker_asal: lp.satker_nama, satker_tujuan: tujuan[0].deskripsi },
            message: `LP dilimpahkan ke "${tujuan[0].deskripsi}". Satker asal tidak lagi punya akses aktif ke LP ini.`,
        };
    }
    async createEksternal(opts) {
        await this.monitoring.assertNotViewer(opts?.userId);
        await this.ensureTable();
        const lp = await this.dataSource.query('select id, satker_id, satker_nama, unit_satker_id, unit_satker_nama, no_laporan, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [opts.lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        if (!lp[0].satker_id)
            throw new common_1.BadRequestException('LP ini belum punya satker penanganan.');
        if (lp[0].dilimpahkan_eksternal)
            throw new common_1.BadRequestException('LP ini sudah pernah dilimpahkan ke instansi eksternal sebelumnya.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, opts.userId);
        const currentOwnerId = Number(lp[0].unit_satker_id ?? lp[0].satker_id);
        if (!scope.all && currentOwnerId !== scope.satkerId) {
            const access = await this.monitoring.assertCanAccessLp(opts.userId, opts.lpId);
            if (!access.monitoring) {
                throw new common_1.ForbiddenException('LP tidak dapat diakses oleh akun Anda.');
            }
            const p = String(opts.statement?.pernyataan || '').trim();
            const a = String(opts.statement?.alasan || '').trim();
            if (!p || !a || a.length < 5) {
                throw new common_1.BadRequestException('Tindakan pelimpahan eksternal atas nama satker bawahan wajib menyertakan lembar pernyataan dan alasan pertanggungjawaban dinas.');
            }
        }
        const tujuan = await this.dataSource.query('select id, nama from bdb_satker_eksternal where id=$1', [opts.satkerEksternalId]);
        if (!tujuan.length)
            throw new common_1.NotFoundException('Satker eksternal tujuan tidak ditemukan.');
        const allowed = await this.isAllowedExternalTarget(currentOwnerId, Number(opts.satkerEksternalId));
        if (!allowed) {
            throw new common_1.BadRequestException('Instansi eksternal tujuan berada di luar wilayah yurisdiksi satker penanganan (dilarang lintas Polda).');
        }
        let userNama = null;
        if (opts.userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [opts.userId]);
            userNama = u[0]?.name || null;
        }
        let pelimpahanId;
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const inserted = await runner.query(`insert into bdb_lp_pelimpahan
                    (lp_id, satker_asal_id, satker_asal_nama, satker_eksternal_id, satker_eksternal_nama, keterangan, nomor_dokumen, tanggal_dokumen, dilimpahkan_oleh, dilimpahkan_oleh_nama)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 returning id`, [opts.lpId, currentOwnerId, lp[0].unit_satker_nama ?? lp[0].satker_nama, tujuan[0].id, tujuan[0].nama, opts.keterangan || null, opts.nomorDokumen || null, opts.tanggalDokumen || null, opts.userId || null, userNama]);
            pelimpahanId = inserted[0].id;
            await runner.query(`update bdb_laporan_polisi
                 set sudah_dilimpahkan=true, dilimpahkan_eksternal=true, updated_at=now()
                 where id=$1`, [opts.lpId]);
            await runner.query(`delete from bdb_kinerja_perkara_snapshot where lp_id=$1`, [opts.lpId]);
            await runner.commitTransaction();
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
        this.logger.log(`LP ${opts.lpId} (${lp[0].no_laporan}) dilimpahkan dari "${lp[0].satker_nama}" ke instansi eksternal "${tujuan[0].nama}" oleh ${userNama || opts.userId || '?'}`);
        return {
            status: 1,
            data: { pelimpahan_id: pelimpahanId, lp_id: opts.lpId, satker_asal: lp[0].satker_nama, satker_eksternal: tujuan[0].nama },
            message: `LP dilimpahkan ke instansi eksternal "${tujuan[0].nama}". Status CT/CC tidak diubah; satker Anda tidak lagi punya akses aktif ke LP ini.`,
        };
    }
    async riwayat(lpId, userId) {
        let boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh) {
            try {
                boleh = (await this.monitoring.assertCanAccessLp(userId, lpId)).allowed;
            }
            catch {
                boleh = false;
            }
        }
        if (!boleh)
            throw new common_1.ForbiddenException('Riwayat LP tidak dapat diakses oleh akun Anda.');
        const rows = await this.dataSource.query(`select p.id, p.satker_asal_id, p.satker_asal_nama, p.satker_tujuan_id, p.satker_tujuan_nama, p.satker_eksternal_id, p.satker_eksternal_nama,
                    p.keterangan, p.nomor_dokumen, p.tanggal_dokumen, p.dilimpahkan_oleh_nama, p.created_at,
                    (select count(*)::int from bdb_lp_pelimpahan_attachments a where a.pelimpahan_id = p.id) as jumlah_lampiran
             from bdb_lp_pelimpahan p where p.lp_id=$1 order by p.created_at asc`, [lpId]);
        return { status: 1, data: rows };
    }
    async hasArsipAccess(lpId, userId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (scope.all)
            return true;
        if (!scope.satkerId)
            return false;
        const rows = await this.dataSource.query(`select 1 from bdb_lp_pelimpahan where lp_id=$1 and (satker_asal_id=$2 or satker_tujuan_id=$2) limit 1`, [lpId, scope.satkerId]);
        return rows.length > 0;
    }
    async arsip(opts) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, opts.userId);
        const page = Math.max(opts.page || 1, 1);
        const row = Math.min(Math.max(opts.row || 25, 1), 1000);
        const offset = (page - 1) * row;
        const params = [];
        const where = [`lp.sudah_dilimpahkan = true`];
        if (!scope.all) {
            if (!scope.satkerId)
                return { status: 1, data: [], total: 0, page, row };
            params.push(scope.satkerId);
            where.push(`exists (select 1 from bdb_lp_pelimpahan p where p.lp_id = lp.id and (p.satker_asal_id = $${params.length} or p.satker_tujuan_id = $${params.length}))`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`lp.no_laporan ilike $${params.length}`);
        }
        const whereSql = `where ${where.join(' and ')}`;
        const totalRes = await this.dataSource.query(`select count(*)::int as c from bdb_laporan_polisi lp ${whereSql}`, params);
        const rows = await this.dataSource.query(`select lp.id, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.dilimpahkan_eksternal, coalesce(lp.unit_satker_id, lp.satker_id) as satker_saat_ini_id, coalesce(lp.unit_satker_nama, lp.satker_nama) as satker_saat_ini_nama,
                    (select p2.satker_asal_nama from bdb_lp_pelimpahan p2 where p2.lp_id = lp.id order by p2.created_at asc limit 1) as satker_asal_pertama,
                    (select count(*)::int from bdb_lp_pelimpahan p3 where p3.lp_id = lp.id) as jumlah_pelimpahan,
                    (select p4.created_at from bdb_lp_pelimpahan p4 where p4.lp_id = lp.id order by p4.created_at desc limit 1) as terakhir_dilimpahkan_at,
                    case when lp.dilimpahkan_eksternal then
                        (select coalesce(p5.satker_tujuan_nama, p5.satker_eksternal_nama) from bdb_lp_pelimpahan p5 where p5.lp_id = lp.id order by p5.created_at desc, p5.id desc limit 1)
                    else coalesce(lp.unit_satker_nama, lp.satker_nama) end as tujuan_terakhir_nama
             from bdb_laporan_polisi lp
             ${whereSql}
             order by lp.updated_at desc
             limit ${row} offset ${offset}`, params);
        for (const r of rows)
            r.pid = (0, id_cipher_util_1.encodeId)(r.id);
        return { status: 1, data: rows, total: totalRes[0]?.c || 0, page, row };
    }
    async arsipDetail(lpId, userId) {
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh)
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        const rows = await this.dataSource.query('select * from bdb_laporan_polisi where id=$1', [lpId]);
        const row = rows[0] || null;
        if (!row)
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        row.pid = (0, id_cipher_util_1.encodeId)(row.id);
        const riwayat = await this.riwayat(lpId, userId);
        return { status: 1, data: { profil: row, riwayat: riwayat.data } };
    }
    async pelimpahanLpId(pelimpahanId) {
        const rows = await this.dataSource.query('select lp_id from bdb_lp_pelimpahan where id=$1', [pelimpahanId]);
        return rows[0]?.lp_id ?? null;
    }
    async assertAttachmentAccess(pelimpahanId, userId) {
        const lpId = await this.pelimpahanLpId(pelimpahanId);
        if (lpId == null)
            throw new common_1.NotFoundException('Riwayat pelimpahan tidak ditemukan.');
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh)
            throw new common_1.ForbiddenException('Anda tidak berhak mengakses lampiran pelimpahan ini.');
        return lpId;
    }
    async addAttachments(pelimpahanId, userId, files) {
        await this.monitoring.assertNotViewer(userId);
        await this.ensureTable();
        await this.assertAttachmentAccess(pelimpahanId, userId);
        for (const f of files || []) {
            const key = await this.minio.upload(f, 'lp-pelimpahan');
            await this.dataSource.query(`insert into bdb_lp_pelimpahan_attachments (pelimpahan_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`, [pelimpahanId, f.originalname, key, f.mimetype || null, f.size || null]);
        }
        return this.listAttachments(pelimpahanId, userId);
    }
    async listAttachments(pelimpahanId, userId) {
        await this.assertAttachmentAccess(pelimpahanId, userId);
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at from bdb_lp_pelimpahan_attachments where pelimpahan_id = $1 order by id desc`, [pelimpahanId]);
        const data = [];
        for (const r of rows) {
            let url = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            }
            catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }
    async removeAttachment(attId, userId) {
        await this.monitoring.assertNotViewer(userId);
        const rows = await this.dataSource.query('select pelimpahan_id, object_key from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Lampiran tidak ditemukan.');
        await this.assertAttachmentAccess(Number(rows[0].pelimpahan_id), userId);
        try {
            await this.minio.remove(rows[0].object_key);
        }
        catch {
        }
        await this.dataSource.query('delete from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
    async batalEksternal(lpId, userId) {
        await this.monitoring.assertNotViewer(userId);
        await this.ensureTable();
        const lp = await this.dataSource.query('select id, no_laporan, satker_id, satker_nama, unit_satker_id, unit_satker_nama, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        if (!lp[0].dilimpahkan_eksternal)
            throw new common_1.BadRequestException('LP ini tidak dalam status dilimpahkan ke eksternal.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const ownerSatkerId = Number(lp[0].unit_satker_id ?? lp[0].satker_id ?? 0);
        if (!scope.all && ownerSatkerId !== scope.satkerId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki hak untuk membatalkan pelimpahan LP ini.');
        }
        const lastPelimpahan = await this.dataSource.query('select id, satker_eksternal_nama from bdb_lp_pelimpahan where lp_id=$1 and satker_eksternal_id is not null order by created_at desc, id desc limit 1', [lpId]);
        const extNama = lastPelimpahan[0]?.satker_eksternal_nama || 'Eksternal';
        await this.dataSource.query(`update bdb_laporan_polisi
             set dilimpahkan_eksternal = false,
                 sudah_dilimpahkan = false,
                 status_id = 1,
                 tanggal_selesai = null,
                 updated_at = now()
             where id = $1`, [lpId]);
        await this.dataSource.query(`insert into bdb_kinerja_perkara_snapshot
                (lp_id, satker_id, tanggal_mulai_penanganan, refreshed_at)
             values ($1, $2, current_date, now())
             on conflict (lp_id) do update
             set satker_id = excluded.satker_id,
                 tanggal_selesai = null,
                 refreshed_at = now()`, [lpId, ownerSatkerId]);
        if (lastPelimpahan[0]?.id) {
            await this.dataSource.query('delete from bdb_lp_pelimpahan where id = $1', [lastPelimpahan[0].id]);
        }
        let userNama = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        this.logger.log(`Pelimpahan eksternal LP ${lpId} (${lp[0].no_laporan}) ke "${extNama}" DIBATALKAN oleh ${userNama || userId || '?'}`);
        return {
            status: 1,
            data: { id: lpId, no_laporan: lp[0].no_laporan },
            message: `Pelimpahan eksternal ke "${extNama}" berhasil dibatalkan. LP telah kembali aktif dalam penanganan satker Polri.`
        };
    }
};
exports.LpPelimpahanService = LpPelimpahanService;
exports.LpPelimpahanService = LpPelimpahanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService,
        lp_monitoring_access_service_1.LpMonitoringAccessService])
], LpPelimpahanService);
//# sourceMappingURL=lp-pelimpahan.service.js.map