import fs from 'fs';
import { execSync } from 'child_process';

import vm from 'vm';

let code = fs.readFileSync('live-laporan-perma.js.clean', 'utf8');

function patchRegex(name, pattern, replacement) {
  if (!pattern.test(code)) {
    console.error(`ERROR: ${name} pattern not found!`);
    process.exit(1);
  }
  code = code.replace(pattern, replacement);
  console.log(`Patched ${name}`);
}

// 1. quickType dropdown (Update Status LP)
patchRegex(
  'q1 (quickType dropdown)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"quick_doc_type"[\s\S]*?style:\{width:"100%"\})/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 2. quickRenderInput select dropdown (Update Status LP field select)
patchRegex(
  'q2 (quickRenderInput select)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:field\.field_key,[\s\S]*?showClear:!0)/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 3. bulkType dropdown (Update Status Massal)
patchRegex(
  'q3 (bulkType dropdown)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"bulk_doc_type"[\s\S]*?style:\{width:"100%"\})/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 4. bulkStatusFilter dropdown (Update Status Massal)
patchRegex(
  'q4 (bulkStatusFilter dropdown)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"bulk_status_filter"[\s\S]*?showClear:!0)/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 5. bulkRenderInput select dropdown (Update Status Massal field select)
patchRegex(
  'q5 (bulkRenderInput select)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?id:"bulk-dd-"\+id\+"-"\+field\.field_key,[\s\S]*?showClear:!0)/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 6. bulkPeriodMonth dropdown
patchRegex(
  'q6a (bulkPeriodMonth)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"bulk_period_month"[\s\S]*?placeholder:"Bulan",style:\{width:"100%"\})/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 7. bulkPeriodYear dropdown
patchRegex(
  'q6b (bulkPeriodYear)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"bulk_period_year"[\s\S]*?placeholder:"Tahun",style:\{width:"100%"\})/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// 8. bulkPeriodYear single dropdown
patchRegex(
  'q6c (bulkPeriodYear single)',
  /(\(0,t\.jsx\)\(i\.Dropdown,\{[\s\S]*?name:"bulk_period_year_single"[\s\S]*?placeholder:"Pilih tahun",style:\{width:"100%"\})/,
  '$1,appendTo:typeof document!=="undefined"?document.body:undefined'
);

// Verify with vm.Script before writing
new vm.Script(code);
console.log("Pre-write VM Script syntax validation passed!");

fs.writeFileSync('live-laporan-perma.js', code, 'utf8');
console.log("Successfully wrote patched live-laporan-perma.js");

// Validate syntax with node --check
execSync('node --check live-laporan-perma.js', { stdio: 'inherit' });
console.log("SYNTAX VALIDATION PASSED: live-laporan-perma.js is 100% valid JS!");
