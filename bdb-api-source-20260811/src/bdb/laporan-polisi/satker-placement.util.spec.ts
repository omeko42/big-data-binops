import { resolveSatkerPlacementFromChain } from './satker-placement.util';

describe('resolveSatkerPlacementFromChain', () => {
    it('keeps a territorial selection as the main satker', () => {
        const result = resolveSatkerPlacementFromChain([
            { id: 18733, deskripsi: 'POLDA PAPUA TENGAH', tipe_satker: 'POLDA', depth: 0 }
        ]);

        expect(result.satker.id).toBe(18733);
        expect(result.unit).toBeNull();
    });

    it('places a directorate under its nearest territorial ancestor', () => {
        const result = resolveSatkerPlacementFromChain([
            { id: 18707, kode: '060.01.37.00.00.15', deskripsi: 'DIT KRIMUM PAPUA TENGAH', tipe_satker: 'FUNGSI', depth: 0 },
            { id: 18733, kode: '060.01.37', deskripsi: 'POLDA PAPUA TENGAH', tipe_satker: 'POLDA', depth: 1 }
        ]);

        expect(result.satker.id).toBe(18733);
        expect(result.unit?.id).toBe(18707);
    });

    it('uses the nearest territorial ancestor through nested function nodes', () => {
        const result = resolveSatkerPlacementFromChain([
            { id: 300, deskripsi: 'UNIT PIDUM', tipe_satker: 'FUNGSI', depth: 0 },
            { id: 200, deskripsi: 'SAT RESKRIM', tipe_satker: 'FUNGSI', depth: 1 },
            { id: 100, deskripsi: 'POLRES CONTOH', tipe_satker: 'POLRES', depth: 2 },
            { id: 1, deskripsi: 'POLDA CONTOH', tipe_satker: 'POLDA', depth: 3 }
        ]);

        expect(result.satker.id).toBe(100);
        expect(result.unit?.id).toBe(300);
    });

    it('preserves a non-territorial Mabes node when it has no territorial ancestor', () => {
        const result = resolveSatkerPlacementFromChain([
            { id: 20, deskripsi: 'DITTIPIDUM BARESKRIM POLRI', tipe_satker: 'FUNGSI', depth: 0 },
            { id: 1, deskripsi: 'MABES POLRI', tipe_satker: 'FUNGSI', depth: 1 }
        ]);

        expect(result.satker.id).toBe(20);
        expect(result.unit).toBeNull();
    });
});
