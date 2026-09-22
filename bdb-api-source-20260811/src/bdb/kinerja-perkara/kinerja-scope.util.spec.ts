import { buildKinerjaScopePlan, buildNationalKinerjaScopePlan, inferKinerjaFunctionGroup } from './kinerja-scope.util';

describe('buildKinerjaScopePlan', () => {
    const satkers = [
        { id: 1, kode: '060.01.11', deskripsi: 'POLDA LAMPUNG', parent_id: null, tipe_satker: 'POLDA' },
        { id: 2, kode: '060.01.11.15', deskripsi: 'DIT KRIMUM LAMPUNG', parent_id: 1, tipe_satker: 'FUNGSI' },
        { id: 3, kode: '060.01.11.16', deskripsi: 'DIT KRIMSUS LAMPUNG', parent_id: 1, tipe_satker: 'FUNGSI' },
        { id: 4, kode: '060.01.11.17', deskripsi: 'DIT NARKOBA LAMPUNG', parent_id: 1, tipe_satker: 'FUNGSI' },
        { id: 5, kode: '060.01.11.01', deskripsi: 'POLRESTA BANDAR LAMPUNG', parent_id: 1, tipe_satker: 'POLRES' },
        { id: 6, kode: '060.01.11.01.10', deskripsi: 'SAT RESKRIM RESTA BANDAR LAMPUNG', parent_id: 5, tipe_satker: 'FUNGSI' },
        { id: 7, kode: '060.01.11.01.11', deskripsi: 'SAT NARKOBA RESTA BANDAR LAMPUNG', parent_id: 5, tipe_satker: 'FUNGSI' },
        { id: 8, kode: '060.01.11.01.01', deskripsi: 'POLSEK KEDATON', parent_id: 5, tipe_satker: 'POLSEK' }
    ];

    it('memberi akun Krimum scope regional Polda-Polsek tanpa Krimsus/Narkoba', () => {
        const plan = buildKinerjaScopePlan(satkers, 2)!;

        expect(plan.rootNama).toBe('POLDA LAMPUNG');
        expect(plan.functionGroup).toBe('KRIMUM');
        expect(plan.allowedIds).toEqual([1, 2, 5, 6, 8]);
        expect(plan.visibleIds.has(3)).toBe(false);
        expect(plan.visibleIds.has(4)).toBe(false);
        expect(plan.visibleIds.has(7)).toBe(false);
    });

    it('mengenali variasi nama fungsi tanpa spasi', () => {
        expect(inferKinerjaFunctionGroup('DITRESKRIMUM POLDA LAMPUNG')).toBe('KRIMUM');
        expect(inferKinerjaFunctionGroup('DITTIPIDUM BARESKRIM POLRI')).toBe('KRIMUM');
        expect(inferKinerjaFunctionGroup('SATRESKRIM POLRESTA')).toBe('KRIMUM');
        expect(inferKinerjaFunctionGroup('DITRESKRIMSUS POLDA LAMPUNG')).toBe('KRIMSUS');
    });

    it('scope Nasional membuang fungsi non-reserse tetapi mempertahankan leluhur', () => {
        const nasional = [
            { id: 100, kode: '060', deskripsi: 'POLRI (MABES POLRI)', parent_id: null, tipe_satker: 'FUNGSI' },
            { id: 101, kode: '060.00', deskripsi: 'BARESKRIM POLRI', parent_id: 100, tipe_satker: 'FUNGSI' },
            { id: 102, kode: '060.00.01', deskripsi: 'DITTIPIDTER BARESKRIM', parent_id: 101, tipe_satker: 'FUNGSI' },
            { id: 103, kode: '060.01.11', deskripsi: 'POLDA LAMPUNG', parent_id: 100, tipe_satker: 'POLDA' },
            { id: 104, kode: '060.01.11.19', deskripsi: 'DIT SABHARA LAMPUNG', parent_id: 103, tipe_satker: 'FUNGSI' },
            { id: 105, kode: '060.01.11.20', deskripsi: 'DIT LANTAS LAMPUNG', parent_id: 103, tipe_satker: 'FUNGSI' }
        ];
        const plan = buildNationalKinerjaScopePlan(nasional);

        expect(plan.allowedIds).toEqual([100, 101, 102, 103]);
    });
});
