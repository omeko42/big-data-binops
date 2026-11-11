/**
 * BDB-001 (CWE-89) -- pembangun WHERE clause untuk laporan "Lampiran Anev".
 *
 * Semua nilai yang berasal dari request (kelompokHitung, golonganId, modelLp,
 * closureReason, satkerId, kode satker) TIDAK BOLEH masuk ke SQL lewat
 * interpolasi string. Modul ini menerima nilai-nilai itu dan mengembalikan
 * (a) potongan SQL yang hanya berisi placeholder $1..$n dan (b) array parameter
 * yang dipakai berpasangan. Penomoran parameter dimulai dari `startIndex` supaya
 * bisa digabung dengan parameter tanggal ($1..$4) pada query yang sama.
 *
 * Modul ini sengaja dipisah dari service agar bisa diuji langsung (unit test)
 * tanpa harus memanggil seluruh alur lampiran.
 */

export type LampiranFilterInput = {
    /** Id satker target (sudah dinormalisasi ke number | null). */
    targetSatkerId?: number | null;
    /** True kalau target adalah apex Bareskrim (scope nasional). */
    isApexBareskrim?: boolean;
    /** Group utama direktorat Bareskrim (mis. 'TIPIDUM') atau null. */
    bareskrimDirGroup?: string | null;
    /** Kode satker (mis. '060.01.01') -- dipakai untuk pencocokan kode anak. */
    satkerKode?: string | null;
    /** kelompokHitung mentah (sudah uppercase dari pemanggil). */
    kelompokHitung?: string | null;
    /** golonganId (number | null). */
    golonganId?: number | null;
    /** modelLp (string | null). */
    modelLp?: string | null;
    /** closureReason (string | null). */
    closureReason?: string | null;
};

export type LampiranFilter = {
    /** Potongan SQL AND ... (boleh kosong). */
    sql: string;
    /** Parameter yang harus dikirim bareng query. */
    params: any[];
};

/** Filter crime default: hanya crime group yang aktif & sudah disetujui. */
const BASE_CRIME_FILTER =
    `AND lp.jenis_kejahatan_id IN (SELECT jenis_kejahatan_id FROM bdb_kinerja_crime_group_mapping ` +
    `WHERE active = true AND decision_status = 'APPROVED')`;

/** Crime non-Reserse Bareskrim (laka lintas, kecelakaan) dikecualikan. */
const NON_RESERSE_CRIME_FILTER =
    ` AND lp.jenis_kejahatan_id NOT IN (SELECT id FROM cm_jenis_kejahatan ` +
    `WHERE coalesce(keterangan, '') ILIKE '%kecelakaan%' OR coalesce(keterangan, '') ILIKE '%lalu lintas%' OR coalesce(keterangan, '') ILIKE '%laka%')`;

/**
 * @param input nilai filter dari request (sudah divalidasi oleh DTO)
 * @param startIndex nomor parameter pertama yang boleh dipakai (default 1)
 */
export function buildLampiranFilterSql(input: LampiranFilterInput, startIndex = 1): LampiranFilter {
    const params: any[] = [];
    let index = startIndex;
    const next = (value: any): string => {
        params.push(value);
        return `$${index++}`;
    };

    // --- filter satker ------------------------------------------------------
    let satkerSql = '';
    const targetSatkerId = Number(input.targetSatkerId || 0);
    if (targetSatkerId > 0 && !input.isApexBareskrim && !input.bareskrimDirGroup) {
        const satkerParam = next(targetSatkerId);
        const kodeParam = next(`${String(input.satkerKode || '')}.%`);
        satkerSql =
            `AND (lp.satker_id = ${satkerParam} OR lp.satker_id IN (` +
            `SELECT id FROM bdb_satker WHERE parent_id = ${satkerParam} OR kode LIKE ${kodeParam}))`;
    }

    // --- filter kelompok hitung / group crime -------------------------------
    let crimeSql = '';
    if (input.bareskrimDirGroup) {
        const groupParam = next(input.bareskrimDirGroup);
        crimeSql =
            `AND lp.jenis_kejahatan_id IN (SELECT jenis_kejahatan_id FROM bdb_kinerja_crime_group_mapping ` +
            `WHERE kelompok = ${groupParam} AND active = true AND decision_status = 'APPROVED')`;
    } else if (input.kelompokHitung && input.kelompokHitung !== 'ALL') {
        const rawGroups = String(input.kelompokHitung)
            .split(',')
            .map((s) => s.trim().toUpperCase())
            .filter(Boolean);
        if (rawGroups.length > 0) {
            // Array parameter, bukan IN ('a','b') -- CWE-89.
            const groupsParam = next(rawGroups);
            crimeSql =
                `AND lp.jenis_kejahatan_id IN (SELECT jenis_kejahatan_id FROM bdb_kinerja_crime_group_mapping ` +
                `WHERE kelompok = ANY(${groupsParam}::text[]) AND active = true AND decision_status = 'APPROVED')`;
        } else {
            crimeSql = BASE_CRIME_FILTER;
        }
    } else {
        crimeSql = BASE_CRIME_FILTER;
    }
    crimeSql += NON_RESERSE_CRIME_FILTER;

    // --- filter golongan / model LP / closure reason -------------------------
    const golonganId = Number(input.golonganId || 0);
    if (golonganId > 0) {
        crimeSql += ` AND lp.golongan_kejahatan_id = ${next(golonganId)}`;
    }
    if (input.modelLp) {
        crimeSql += ` AND upper(coalesce(lp.model_lp, '')) = ${next(String(input.modelLp))}`;
    }
    if (input.closureReason) {
        crimeSql +=
            ` AND lp.status_id IN (SELECT id FROM bdb_status_master ` +
            `WHERE upper(coalesce(nama, '')) LIKE ('%' || ${next(String(input.closureReason))}::text || '%'))`;
    }

    return { sql: `${satkerSql} ${crimeSql}`.trim(), params };
}
