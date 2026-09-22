"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSatkerPlacementFromChain = resolveSatkerPlacementFromChain;
const TERRITORIAL_TYPES = new Set(['POLDA', 'POLRES', 'POLSEK']);
function resolveSatkerPlacementFromChain(chain) {
    if (!chain.length)
        throw new Error('Satker tujuan tidak ditemukan.');
    const ordered = [...chain].sort((a, b) => Number(a.depth || 0) - Number(b.depth || 0));
    const selected = ordered[0];
    const territorial = ordered.find((node) => TERRITORIAL_TYPES.has(String(node.tipe_satker || '').toUpperCase()));
    if (!territorial || String(territorial.id) === String(selected.id)) {
        return { selected, satker: selected, unit: null };
    }
    return { selected, satker: territorial, unit: selected };
}
//# sourceMappingURL=satker-placement.util.js.map