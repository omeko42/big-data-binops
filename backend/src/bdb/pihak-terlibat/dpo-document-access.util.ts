/**
 * BDB-004 (CWE-862 / CWE-639) -- proteksi endpoint dokumen arsip/foto DPO.
 *
 * Dua lapis proteksi:
 *   1. AuthGuard  -> tanpa token = 401. Rule bypass '/dpo/' SUDAH dihapus di
 *      BDB-002 (auth-public-routes.util.ts).
 *   2. Scope satker -> DPO di luar scope_satker_id user = 404 (supaya id yang
 *      ada tapi tidak berhak tidak bisa dibedakan dari id yang tidak ada).
 *
 * Helpers di file ini dipakai service supaya aturan ini bisa diuji langsung.
 */

export type ScopeLike = { all: boolean; satkerId: number | null };

/**
 * Content-Type yang boleh dilayani untuk dokumen DPO.
 * Allowlist ini mencegah file HTML/SVG (XSS tersimpan) atau script ikut dilayani
 * sebagai dokumen yang bisa dieksekusi di origin aplikasi.
 */
export const ALLOWED_DPO_DOC_MIME = new Set([
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
]);

/**
 * Normalisasi nama file agar aman dipakai di header Content-Disposition.
 *
 * Anti path traversal: basename diambil, lalu karakter di luar [A-Za-z0-9._-]
 * dibuang. Hasilnya tidak mungkin mengandung '/' atau '..' yang keluar direktori.
 */
export function sanitizeDownloadFileName(raw: any, fallback = 'arsip_dpo.pdf'): string {
    const s = String(raw ?? '').trim();
    if (!s) return fallback;

    // Ambil basename: buang semua segmen direktori.
    const base = s.split(/[\\/]/).pop() || '';
    if (!base || base === '.' || base === '..') return fallback;

    // Buang karakter berbahaya; sisakan alfanumer, titik, underscore, strip.
    const cleaned = base.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '');

    if (!cleaned) return fallback;
    // Tolak nama yang mencoba keluar direktori.
    if (cleaned === '.' || cleaned === '..') return fallback;
    return cleaned;
}

/**
 * Content-Type final untuk dilayani.
 *
 * - Bila mime_type dari DB ada di allowlist -> pakai apa adanya.
 * - Bila tidak -> fallback aman ('application/pdf' untuk arsip, 'image/jpeg' untuk foto).
 *
 * Tidak pernah mengembalikan tipe yang bisa dieksekusi (text/html, image/svg+xml).
 */
export function resolveDpoDocContentType(mimeType: any, kind: 'arsip' | 'foto'): string {
    const fallback = kind === 'foto' ? 'image/jpeg' : 'application/pdf';
    const mt = String(mimeType ?? '').trim().toLowerCase().split(';')[0];
    if (!mt) return fallback;
    if (!ALLOWED_DPO_DOC_MIME.has(mt)) return fallback;
    return mt;
}

/**
 * Apakah satker DPO berada dalam scope user?
 *
 * - scope.all (superadmin / admin_binops / viewer apex) -> boleh akses semua.
 * - selain itu -> satker_id DPO harus berada di subtree satker user.
 */
export function isDpoWithinScope(
    scope: ScopeLike,
    dpoSatkerId: number | null | undefined,
    subtreeSatkerIds: number[] = []
): boolean {
    if (scope?.all) return true;

    const rootId = Number(scope?.satkerId || 0);
    if (!Number.isSafeInteger(rootId) || rootId <= 0) return false;

    const dpoSatker = Number(dpoSatkerId || 0);
    if (!Number.isSafeInteger(dpoSatker) || dpoSatker <= 0) {
        // DPO tanpa satker hanya boleh dibaca role nasional.
        return false;
    }

    if (dpoSatker === rootId) return true;
    return subtreeSatkerIds.map(Number).includes(dpoSatker);
}

/**
 * Normalisasi id DPO dari parameter route.
 * Non-numerik / non-positif -> null (dipakai untuk membalas 404, bukan 500).
 */
export function normalizeDpoId(raw: any): number | null {
    const n = Number(raw);
    if (!Number.isSafeInteger(n) || n <= 0) return null;
    return n;
}
