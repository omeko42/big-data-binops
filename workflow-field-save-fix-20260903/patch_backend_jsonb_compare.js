const fs = require('fs');

function replaceExactlyOnce(path, before, after) {
  const source = fs.readFileSync(path, 'utf8');
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`Target pembanding JSONB tidak ditemukan: ${path}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`Target pembanding JSONB tidak unik: ${path}`);
  fs.writeFileSync(path, source.slice(0, first) + after + source.slice(first + before.length));
}

const before = `            const savedFields = updated[0].form_schema?.fields;
            if (savedPrerequisite !== requestedPrerequisite || JSON.stringify(savedFields) !== JSON.stringify(requestedSchema.fields)) {`;

const after = `            const schemaCheck = await this.dataSource.query('select $1::jsonb = $2::jsonb as ok', [JSON.stringify(updated[0].form_schema), vals[6]]);
            if (savedPrerequisite !== requestedPrerequisite || !schemaCheck[0]?.ok) {`;

replaceExactlyOnce('/usr/src/app/src/bdb/workflow/workflow.service.ts', before, after);
replaceExactlyOnce('/usr/src/app/dist/bdb/workflow/workflow.service.js', before, after);
console.log('BACKEND_JSONB_COMPARE_PATCHED=1');
