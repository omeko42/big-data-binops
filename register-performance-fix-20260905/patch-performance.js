const fs = require('fs');

function patchFile(path, replacements) {
  let source = fs.readFileSync(path, 'utf8');
  for (const { from, to, label } of replacements) {
    const count = source.split(from).length - 1;
    if (count !== 1) throw new Error(`${path}: ${label} expected once, found ${count}`);
    source = source.replace(from, to);
  }
  fs.writeFileSync(path, source);
  console.log(JSON.stringify({ path, bytes: Buffer.byteLength(source), changes: replacements.length }));
}

const root = __dirname;

for (const ext of ['ts', 'js']) {
  const isTs = ext === 'ts';
  patchFile(`${root}/pihak-terlibat.service.candidate.${ext}`, [
    {
      label: 'shared summary cache signature',
      from: isTs
        ? 'private summaryKey(authUser: any, query: any) {'
        : 'summaryKey(authUser, query) {',
      to: isTs
        ? "private summaryKey(scope: { all: boolean; satkerId: number | null }, query: any) {"
        : 'summaryKey(scope, query) {'
    },
    {
      label: 'shared summary cache identity',
      from: "return JSON.stringify({ user: Number(authUser?.id || 0), search: query.search || '', sumber: query.sumber || 'ALL', from: query.from || '', to: query.to || '', kejahatan: query.kejahatan || '', area: query.area || '', satker_id: query.satker_id || null });",
      to: "return JSON.stringify({ scope: scope.all ? 'ALL' : Number(scope.satkerId || 0), search: query.search || '', sumber: query.sumber || 'ALL', from: query.from || '', to: query.to || '', kejahatan: query.kejahatan || '', area: query.area || '', satker_id: query.satker_id || null });"
    },
    {
      label: 'shared summary cache call',
      from: 'const key = this.summaryKey(authUser, query);',
      to: 'const key = this.summaryKey(scope, query);'
    },
    {
      label: 'parallel recent DORS promise',
      from: 'const dors = await this.dataSource.query(',
      to: 'const dorsPromise = this.dataSource.query('
    },
    {
      label: 'parallel recent manual promise',
      from: 'const manual = await this.dataSource.query(',
      to: 'const manualPromise = this.dataSource.query('
    },
    {
      label: 'parallel recent document promise',
      from: 'const document = await this.dataSource.query(',
      to: 'const documentPromise = this.dataSource.query('
    },
    {
      label: 'await parallel recent branches',
      from: '        const merged = [...dors, ...manual, ...document].sort',
      to: '        const [dors, manual, document] = await Promise.all([dorsPromise, manualPromise, documentPromise]);\n        const merged = [...dors, ...manual, ...document].sort'
    }
  ]);
}

for (const ext of ['ts', 'js']) {
  const isTs = ext === 'ts';
  patchFile(`${root}/barang-bukti.service.candidate.${ext}`, [
    {
      label: 'cap page size',
      from: 'const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));',
      to: 'const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));'
    },
    {
      label: 'remove full count',
      from: "        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql}`, params);\n        const total = Number(countRows?.[0]?.total || 0);\n",
      to: ''
    },
    {
      label: 'fetch one lookahead row',
      from: isTs
        ? '[...params, limit, offset]\n        );\n\n        return {\n            data: rows,\n            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }\n        };'
        : '[...params, limit, offset]);\n        return {\n            data: rows,\n            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }\n        };',
      to: isTs
        ? '[...params, limit + 1, offset]\n        );\n\n        const hasNext = rows.length > limit;\n        return {\n            data: rows.slice(0, limit),\n            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: \'lookahead-no-count\' }\n        };'
        : '[...params, limit + 1, offset]);\n        const hasNext = rows.length > limit;\n        return {\n            data: rows.slice(0, limit),\n            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: \'lookahead-no-count\' }\n        };'
    }
  ]);
}

patchFile(`${root}/register-bb-fast-20260905.js`, [
  {
    label: 'frontend lookahead pagination',
    from: 'd(e?.data||[]),y(e?.meta?.total||0)',
    to: 'let a=e?.data||[],t=e?.meta||{};d(a),y(null!=t.total?Number(t.total):(f-1)*j+a.length+(t.hasNext?1:0))'
  }
]);

patchFile(`${root}/register-pihak-v7-fast-20260905.js`, [
  {
    label: 'defer expensive summary request',
    from: 'J("");(async()=>{try{',
    to: 'J("");let r=setTimeout((()=>{(async()=>{try{'
  },
  {
    label: 'cancel deferred summary request',
    from: '}})();return()=>{e=!0}}),[V.search,V.sumber,V.from,V.to,V.kejahatan,V.area])',
    to: '}})()}),750);return()=>{e=!0,clearTimeout(r)}}),[V.search,V.sumber,V.from,V.to,V.kejahatan,V.area])'
  }
]);
