import { computeKinerjaRates, roundRate } from './rates.util';

describe('computeKinerjaRates', () => {
    it('membedakan rumus lama dan baru PR serta CR', () => {
        const rates = computeKinerjaRates({
            ct: 100,
            cpAktual: 30,
            cpTunggakan: 20,
            ccAktual: 80,
            ccTunggakan: 20
        });

        expect(rates.prLama).toBeCloseTo(50, 10);
        expect(rates.prBaru).toBeCloseTo(41.6666666667, 10);
        expect(rates.crLama).toBeCloseTo(100, 10);
        expect(rates.crBaru).toBeCloseTo(83.3333333333, 10);
    });

    it('mengembalikan nol jika denominator tidak positif', () => {
        expect(
            computeKinerjaRates({ ct: 0, cpAktual: 0, cpTunggakan: 0, ccAktual: 0, ccTunggakan: 0 })
        ).toEqual({ prLama: 0, prBaru: 0, crLama: 0, crBaru: 0 });
    });

    it('mempertahankan empat desimal agar selisih kecil tetap terlihat', () => {
        const rates = computeKinerjaRates({
            ct: 301349,
            cpAktual: 8753,
            cpTunggakan: 0,
            ccAktual: 4355,
            ccTunggakan: 27
        });

        expect(roundRate(rates.crLama)).toBe(1.4541);
        expect(roundRate(rates.crBaru)).toBe(1.454);
    });
});
