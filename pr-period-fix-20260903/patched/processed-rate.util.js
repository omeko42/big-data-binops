'use strict';
function processedMetrics(counts) {
    const cpTotal = Number(counts.cp_berjalan) + Number(counts.cp_tunggakan);
    const denominator = Number(counts.ct) + Number(counts.cp_tunggakan);
    return {
        pr: denominator > 0 ? cpTotal / denominator * 100 : 0,
        prLama: counts.ct > 0 ? cpTotal / counts.ct * 100 : 0,
    };
}
exports.processedMetrics = processedMetrics;

