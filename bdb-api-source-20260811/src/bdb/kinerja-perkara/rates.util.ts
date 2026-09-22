export type RateInputs = {
    ct: number;
    cpAktual: number;
    cpTunggakan: number;
    ccAktual: number;
    ccTunggakan: number;
};

export type KinerjaRates = {
    prLama: number;
    prBaru: number;
    crLama: number;
    crBaru: number;
};

const percentage = (numerator: number, denominator: number): number =>
    denominator > 0 ? (numerator / denominator) * 100 : 0;

/**
 * Semua rumus memakai total CP/CC dari dataset Kinerja Perkara yang sama.
 * Perbedaannya hanya pada penambahan tunggakan ke denominator rumus baru.
 */
export function computeKinerjaRates(input: RateInputs): KinerjaRates {
    const cpTotal = input.cpAktual + input.cpTunggakan;
    const ccTotal = input.ccAktual + input.ccTunggakan;

    return {
        prLama: percentage(cpTotal, input.ct),
        prBaru: percentage(cpTotal, input.ct + input.cpTunggakan),
        crLama: percentage(ccTotal, input.ct),
        crBaru: percentage(ccTotal, input.ct + input.ccTunggakan)
    };
}

/** Empat desimal diperlukan agar selisih denominator kecil tetap terlihat di laporan. */
export function roundRate(value: number): number {
    return Math.round((value + Number.EPSILON) * 10000) / 10000;
}
