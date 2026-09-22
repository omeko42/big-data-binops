/**
 * Rumus Indeks sesuai "Ketentuan Penghitungan CT, CP, CC, CR, dan Indeks" (TW IV 2025) --
 * interpolasi linear per-band, presisi penuh selama proses, dibulatkan cuma di tampilan.
 * Diverifikasi thd tabel validasi dokumen: 63.77->3.37, 63.74->3.36, 63.93->3.37, 78.96->4.00,
 * 57.44->3.10 (lihat kinerja-perkara.spec-check.ts).
 */
type Band = { x1: number; x2: number; y1: number; y2: number };

const BANDS: Band[] = [
    { x1: 0, x2: 30, y1: 1.0, y2: 2.0 },
    { x1: 30, x2: 55, y1: 2.0, y2: 3.0 },
    { x1: 55, x2: 85, y1: 3.0, y2: 4.25 },
    { x1: 85, x2: 95, y1: 4.25, y2: 4.75 },
    { x1: 95, x2: 100, y1: 4.75, y2: 5.0 }
];

export function levelOf(cr: number): 1 | 2 | 3 | 4 | 5 {
    if (cr < 30) return 1;
    if (cr < 55) return 2;
    if (cr < 85) return 3;
    if (cr < 95) return 4;
    return 5;
}

/** cr = nilai CR mentah (boleh >100, presisi penuh). Indeks dibatasi CR<=100 khusus utk indeks. */
export function computeIndeks(cr: number): number {
    const crCapped = Math.min(cr, 100);
    const band = BANDS[levelOf(crCapped) - 1];
    const a = (band.y2 - band.y1) / (band.x2 - band.x1);
    const b = band.y1 - a * band.x1;
    return Math.min(5, a * crCapped + b);
}

export function round2(v: number): number {
    return Math.round(v * 100) / 100;
}
