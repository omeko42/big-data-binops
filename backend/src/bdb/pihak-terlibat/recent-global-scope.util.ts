/**
 * BDB-003 (CWE-639 / CWE-200) -- utilitas scope & masking untuk "pihak terlibat".
 *
 * Dipisah dari service agar bisa diuji langsung (unit test + integrasi PGlite)
 * tanpa harus memanggil seluruh alur PhillipsTerlibat.
 */

export type ScopeLike = { all: boolean; satkerId: number | null };

/**
 * Bangun klausa SQL yang membatasi baris ke pohon satker milik user.
 *
 * - scope.all (superadmin / admin_binops / viewer apex) -> '1=1' (data nasional).
 * - selain itu -> subtree satker user; kalau user tidak punya satker -> '1=0'
 *   (user tanpa scope tidak boleh melihat data apa pun).
 *
 * `alias` menentukan kolom mana yang dipakai:
 *   - 'lp' : baris yang punya relasi ke bdb_laporan_polisi (DORS/MANUAL/DOKUMEN).
 *   - 'dpo': baris bdb_dpo (memiliki kolom satker_id sendiri).
 *
 * Nilai rootId dikirim sebagai parameter PostgreSQL (bukan interpolasi string).
 */
export function buildScopeSql(scope: ScopeLike, alias: 'lp' | 'dpo', params: any[]): string {
    if (scope?.all) return '1=1';

    const rootId = Number(scope?.satkerId || 0);
    if (!Number.isSafeInteger(rootId) || rootId <= 0) return '1=0';

    params.push(rootId);
    const p = params.length;

    // DPO punya kolom satker_id sendiri (bdb_dpo.satker_id); sumber lain
    // (DORS/MANUAL/DOKUMEN) scoping-nya lewat relasi ke bdb_laporan_polisi.
    const col = alias === 'dpo' ? 'd.satker_id' : 'coalesce(lp.unit_satker_id, lp.satker_id)';

    return `${col} in (
        with recursive scope_tree as (
            select id from bdb_satker where id = $${p}
            union
            select s.id from bdb_satker s join scope_tree t on s.parent_id = t.id
        )
        select id from scope_tree
    )`;
}

/**
 * Masking NIK untuk role non-nasional: 6 digit awal + 4 digit akhir,
 * digit tengah disamarkan.
 *
 * NIK < 10 digit -> disamarkan penuh (tidak ada yang bisa disimpulkan dari
 * 4 digit terakhir + sisa panjang).
 */
export function maskNik(nik: any): any {
    if (nik === null || nik === undefined) return nik;
    const s = String(nik).trim();
    if (!s) return s;
    if (s.length <= 10) return '*'.repeat(s.length);
    return `${s.slice(0, 6)}${'*'.repeat(s.length - 10)}${s.slice(-4)}`;
}

/**
 * Terapkan masking ke baris hasil query.
 * Kolom NIK pada endpoint recent-global: 'nik' (DORS/MANUAL/DOKUMEN) dan
 * 'nomor_identitas' (DPO).
 */
export function applyNikMasking(rows: any[], mask: boolean): any[] {
    if (!mask) return rows;
    return rows.map((row) => {
        if (!row || typeof row !== 'object') return row;
        const out = { ...row };
        if (out.nik !== undefined && out.nik !== null) out.nik = maskNik(out.nik);
        if (out.nomor_identitas !== undefined && out.nomor_identitas !== null) {
            out.nomor_identitas = maskNik(out.nomor_identitas);
        }
        return out;
    });
}
