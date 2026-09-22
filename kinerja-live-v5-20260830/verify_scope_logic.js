'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

const originalLoad = Module._load;
const noop = function () { return noop; };
const stub = new Proxy({}, { get: () => noop });
Module._load = function (request, parent, isMain) {
    if (request.startsWith('node:')) return originalLoad.call(this, request, parent, isMain);
    return stub;
};

const servicePath = path.join(
    __dirname,
    'backend',
    'dist',
    'bdb',
    'kinerja-perkara',
    'kinerja-perkara.service.js'
);
const { buildKinerjaRegionalScopePlan } = originalLoad.call(Module, servicePath, module, false);
Module._load = originalLoad;

const row = (id, deskripsi, tipe_satker, parent_id = null) => ({
    id,
    kode: String(id),
    deskripsi,
    tipe_satker,
    parent_id,
    depth: 0,
    jumlah_penduduk: null,
    urutan: id,
    function_domain_resolved: 'INTERNAL_RESERSE',
    organization_domain_resolved: 'INTERNAL_POLRI',
    counting_eligible: true
});

const satkers = [
    row(1, 'POLDA ACEH', 'POLDA'),
    row(2, 'DITRESKRIMSUS POLDA ACEH', 'FUNGSI', 1),
    row(3, 'POLRES ACEH BARAT', 'POLRES', 1),
    row(4, 'SATRESKRIM POLRES ACEH BARAT', 'FUNGSI', 3),
    row(5, 'POLSEK JOHAN PAHLAWAN', 'POLSEK', 3),
    row(6, 'UNIT RESKRIM POLSEK JOHAN PAHLAWAN', 'FUNGSI', 5),
    row(7, 'POLDA SUMATERA UTARA', 'POLDA'),
    row(8, 'POLRES MEDAN', 'POLRES', 7)
];

const poldaToPolres = buildKinerjaRegionalScopePlan(satkers, 1, 3);
assert.equal(poldaToPolres.rootId, 3);
assert.deepEqual(new Set(poldaToPolres.allowedIds), new Set([3, 4, 5, 6]));

assert.equal(buildKinerjaRegionalScopePlan(satkers, 1, 8), null);

const functionToPolres = buildKinerjaRegionalScopePlan(satkers, 2, 3);
assert.equal(functionToPolres.rootId, 3);
assert.equal(functionToPolres.functionGroup, 'KRIMSUS');
assert(functionToPolres.allowedIds.includes(3));
assert(functionToPolres.allowedIds.includes(5));
assert(!functionToPolres.allowedIds.includes(4));
assert(!functionToPolres.allowedIds.includes(6));

const polresToPolsek = buildKinerjaRegionalScopePlan(satkers, 3, 5);
assert.equal(polresToPolsek.rootId, 5);
assert.deepEqual(new Set(polresToPolsek.allowedIds), new Set([5, 6]));

const polsekOwn = buildKinerjaRegionalScopePlan(satkers, 5);
assert.equal(polsekOwn.rootId, 5);

const allAccessPolda = buildKinerjaRegionalScopePlan(satkers, 1, 1);
assert.equal(allAccessPolda.rootId, 1);

console.log(JSON.stringify({
    status: 'ok',
    polda_target: poldaToPolres.rootNama,
    polres_target: polresToPolsek.rootNama,
    polsek_target: polsekOwn.rootNama,
    function_intersection: functionToPolres.functionGroup
}));
