const fs = require('fs');
const Module = require('module');

const source = fs
  .readFileSync('/usr/src/app/lp-filter-candidate-regression-readonly.cjs', 'utf8')
  .replace(
    '/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.candidate.ts',
    '/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.ts',
  );

if (source.includes('laporan-polisi.service.candidate.ts')) {
  throw new Error('Gagal mengalihkan regression test ke service aktif.');
}

const testModule = new Module('/usr/src/app/lp-filter-postdeploy-readonly.cjs', module);
testModule.filename = '/usr/src/app/lp-filter-postdeploy-readonly.cjs';
testModule.paths = module.paths;
testModule._compile(source, testModule.filename);
