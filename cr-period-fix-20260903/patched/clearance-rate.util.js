'use strict';
function clearanceMetrics(counts) {
    const ccTotal = Number(counts.cc_aktual) + Number(counts.cc_tunggakan);
    // User-defined formulas. CC Aktual must be a subset of the selected CT cohort.
    const denominator = Number(counts.ct) + Number(counts.cc_tunggakan);
    return {
        ccTotal,
        denominator,
        cr: denominator > 0 ? ccTotal / denominator * 100 : 0,
        crLama: counts.ct > 0 ? ccTotal / counts.ct * 100 : 0,
    };
}

exports.clearanceMetrics = clearanceMetrics;
