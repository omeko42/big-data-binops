export type SatkerPlacementNode = {
    id: number | string;
    kode?: string | null;
    deskripsi: string;
    parent_id?: number | string | null;
    tipe_satker?: string | null;
    depth?: number;
};

export type SatkerPlacement = {
    selected: SatkerPlacementNode;
    satker: SatkerPlacementNode;
    unit: SatkerPlacementNode | null;
};

const TERRITORIAL_TYPES = new Set(['POLDA', 'POLRES', 'POLSEK']);

/**
 * Ubah node pilihan UI menjadi struktur penanganan LP.
 *
 * POLDA/POLRES/POLSEK disimpan sebagai satker utama. Node fungsi (DIT/SAT/unit)
 * disimpan sebagai unit_satker dan memakai leluhur wilayah terdekat sebagai satker
 * utama. Node organisasi yang tidak punya leluhur wilayah (contoh sebagian node
 * Mabes) tetap diperlakukan seperti sebelumnya agar mapping Mabes tidak berubah.
 */
export function resolveSatkerPlacementFromChain(chain: SatkerPlacementNode[]): SatkerPlacement {
    if (!chain.length) throw new Error('Satker tujuan tidak ditemukan.');

    const ordered = [...chain].sort((a, b) => Number(a.depth || 0) - Number(b.depth || 0));
    const selected = ordered[0];
    const territorial = ordered.find((node) => TERRITORIAL_TYPES.has(String(node.tipe_satker || '').toUpperCase()));

    if (!territorial || String(territorial.id) === String(selected.id)) {
        return { selected, satker: selected, unit: null };
    }

    return { selected, satker: territorial, unit: selected };
}
