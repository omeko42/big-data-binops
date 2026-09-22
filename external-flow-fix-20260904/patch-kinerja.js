const fs = require('fs');
const path = require('path');

const root = __dirname;
const tsPath = path.join(root, 'candidate', 'kinerja-perkara.service.ts');
const jsPath = path.join(root, 'candidate', 'kinerja-perkara.service.js');
const uiPath = path.join(root, 'candidate', 'kinerja-external-20260904.js');

function replaceOnce(text, oldText, newText, label) {
  text = text.replace(/\r\n/g, '\n');
  oldText = oldText.replace(/\r\n/g, '\n');
  newText = newText.replace(/\r\n/g, '\n');
  const first = text.indexOf(oldText);
  const last = text.lastIndexOf(oldText);
  if (first < 0 || first !== last) throw new Error(`${label}: expected exactly one anchor`);
  return text.slice(0, first) + newText + text.slice(first + oldText.length);
}

let ts = fs.readFileSync(tsPath, 'utf8');
ts = replaceOnce(ts, "{ key: 'sp2lid', cond: \"status_code = 'SP2_LIDIK'\" }", "{ key: 'sp2lid', cond: \"status_code = 'SP2_LID'\" }", 'TS current SP2 code');
ts = replaceOnce(ts, "{ key: 'tipiring', cond: \"status_code = 'TIPIRING_PUTUSAN'\" }", "{ key: 'tipiring', cond: \"status_code = 'PUTUSAN_TIPIRING'\" }", 'TS current Tipiring code');
ts = replaceOnce(ts, '    belum_update_tunggakan: number;\r\n    cc_aktual: number;', '    belum_update_tunggakan: number;\r\n    limpah_eksternal: number;\r\n    cc_aktual: number;', 'TS Node field');
ts = replaceOnce(ts,
`        // breakdown status SAAT INI (LIDIK s/d SP3/Tahap II dst) -- snapshot posisi caseload,`,
[
  '        // Pelimpahan eksternal dihitung dari tanggal transaksi pelimpahan, bukan tanggal LP.',
  '        // Dimensi scope/jenis/model/taksonomi/kelompok identik dengan tabel utama; metrik ini',
  '        // bersifat informasi dan tidak masuk CT, CP, CC, PR, CR, ataupun indeks.',
  '        const externalParams: any[] = [from, to];',
  "        let externalWhere = 'where satker_id is not null and tanggal_limpah between $1 and $2';",
  '        if (allowed) {',
  '            externalParams.push(allowed);',
  '            externalWhere += ` and satker_id = any($${externalParams.length})`;',
  '        }',
  '        if (jenisKejahatanIds !== undefined) {',
  '            externalParams.push(jenisKejahatanIds);',
  '            externalWhere += ` and jenis_kejahatan_id = any($${externalParams.length})`;',
  '        }',
  '        if (modelFilter) {',
  '            externalParams.push(modelFilter);',
  '            externalWhere += ` and model_lp = $${externalParams.length}`;',
  '        }',
  '        if (excludedSatkerIds.length) {',
  '            externalParams.push(excludedSatkerIds);',
  '            externalWhere += ` and satker_id <> all($${externalParams.length})`;',
  '        }',
  '        externalWhere = appendKinerjaGroupWhere(externalWhere, externalParams, groupPlan);',
  '        const externalCounts = await this.ds.query(',
  '            `select satker_id as sid, count(*)::int as limpah_eksternal',
  '             from (',
  '                select distinct on (lp.id)',
  '                       lp.id, coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,',
  '                       lp.jenis_kejahatan_id, lp.model_lp, p.created_at::date as tanggal_limpah',
  '                from bdb_laporan_polisi lp',
  '                join bdb_lp_pelimpahan p on p.lp_id = lp.id and p.satker_eksternal_id is not null',
  '                where lp.deleted_at is null and coalesce(lp.dilimpahkan_eksternal, false)',
  '                order by lp.id, p.created_at desc, p.id desc',
  '             ) active_external',
  '             ${externalWhere}',
  '             group by satker_id`,',
  '            externalParams',
  '        );',
  '',
  '        // breakdown status SAAT INI (LIDIK s/d SP3/Tahap II dst) -- snapshot posisi caseload,'
].join('\r\n'),
        'TS external query');
ts = replaceOnce(ts, '                belum_update_tunggakan: 0,\r\n                cc_aktual: 0,', '                belum_update_tunggakan: 0,\r\n                limpah_eksternal: 0,\r\n                cc_aktual: 0,', 'TS node init');
ts = replaceOnce(ts, '        for (const c of statusCounts) {', `        for (const c of externalCounts) {\r\n            let cur: number | null | undefined = Number(c.sid);\r\n            const guard = new Set<number>();\r\n            while (cur != null && node.has(cur) && !guard.has(cur)) {\r\n                guard.add(cur);\r\n                node.get(cur)!.limpah_eksternal += Number(c.limpah_eksternal) || 0;\r\n                cur = parentOf.get(cur) ?? null;\r\n            }\r\n        }\r\n        for (const c of statusCounts) {`, 'TS external rollup');
ts = replaceOnce(ts, '                cp_tunggakan_belum_update: a.cp_tunggakan_belum_update + n.cp_tunggakan_belum_update,\r\n                cc_aktual:', '                cp_tunggakan_belum_update: a.cp_tunggakan_belum_update + n.cp_tunggakan_belum_update,\r\n                limpah_eksternal: a.limpah_eksternal + n.limpah_eksternal,\r\n                cc_aktual:', 'TS totals');
ts = replaceOnce(ts, '                row.cp_tunggakan_belum_update = n.cp_tunggakan_belum_update;\r\n                for (const b of CP_BREAKDOWN)', '                row.cp_tunggakan_belum_update = n.cp_tunggakan_belum_update;\r\n                row.limpah_eksternal = n.limpah_eksternal;\r\n                for (const b of CP_BREAKDOWN)', 'TS export');
ts = replaceOnce(ts, '            cp_tunggakan_belum_update: 0,\r\n            cc_aktual:', '            cp_tunggakan_belum_update: 0,\r\n            limpah_eksternal: 0,\r\n            cc_aktual:', 'TS empty totals');
fs.writeFileSync(tsPath, ts);

let js = fs.readFileSync(jsPath, 'utf8');
js = replaceOnce(js, "{ key: 'sp2lid', cond: \"status_code = 'SP2_LIDIK'\" }", "{ key: 'sp2lid', cond: \"status_code = 'SP2_LID'\" }", 'JS current SP2 code');
js = replaceOnce(js, "{ key: 'tipiring', cond: \"status_code = 'TIPIRING_PUTUSAN'\" }", "{ key: 'tipiring', cond: \"status_code = 'PUTUSAN_TIPIRING'\" }", 'JS current Tipiring code');
js = replaceOnce(js,
`        const statusParams = [];`,
[
  '        const externalParams = [from, to];',
  "        let externalWhere = 'where satker_id is not null and tanggal_limpah between $1 and $2';",
  '        if (allowed) {',
  '            externalParams.push(allowed);',
  '            externalWhere += ` and satker_id = any($${externalParams.length})`;',
  '        }',
  '        if (jenisKejahatanIds !== undefined) {',
  '            externalParams.push(jenisKejahatanIds);',
  '            externalWhere += ` and jenis_kejahatan_id = any($${externalParams.length})`;',
  '        }',
  '        if (modelFilter) {',
  '            externalParams.push(modelFilter);',
  '            externalWhere += ` and model_lp = $${externalParams.length}`;',
  '        }',
  '        if (excludedSatkerIds.length) {',
  '            externalParams.push(excludedSatkerIds);',
  '            externalWhere += ` and satker_id <> all($${externalParams.length})`;',
  '        }',
  '        externalWhere = (0, exports.appendKinerjaGroupWhere)(externalWhere, externalParams, groupPlan);',
  '        const externalCounts = await this.ds.query(`select satker_id as sid, count(*)::int as limpah_eksternal',
  '             from (',
  '                select distinct on (lp.id)',
  '                       lp.id, coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,',
  '                       lp.jenis_kejahatan_id, lp.model_lp, p.created_at::date as tanggal_limpah',
  '                from bdb_laporan_polisi lp',
  '                join bdb_lp_pelimpahan p on p.lp_id = lp.id and p.satker_eksternal_id is not null',
  '                where lp.deleted_at is null and coalesce(lp.dilimpahkan_eksternal, false)',
  '                order by lp.id, p.created_at desc, p.id desc',
  '             ) active_external',
  '             ${externalWhere}',
  '             group by satker_id`, externalParams);',
  '        const statusParams = [];'
].join('\r\n'),
        'JS external query');
js = replaceOnce(js, '                belum_update_tunggakan: 0,\r\n                cc_aktual: 0,', '                belum_update_tunggakan: 0,\r\n                limpah_eksternal: 0,\r\n                cc_aktual: 0,', 'JS node init');
js = replaceOnce(js, '        for (const c of statusCounts) {', `        for (const c of externalCounts) {\r\n            let cur = Number(c.sid);\r\n            const guard = new Set();\r\n            while (cur != null && node.has(cur) && !guard.has(cur)) {\r\n                guard.add(cur);\r\n                node.get(cur).limpah_eksternal += Number(c.limpah_eksternal) || 0;\r\n                cur = parentOf.get(cur) ?? null;\r\n            }\r\n        }\r\n        for (const c of statusCounts) {`, 'JS external rollup');
js = replaceOnce(js, '            cp_tunggakan_belum_update: a.cp_tunggakan_belum_update + n.cp_tunggakan_belum_update,\r\n            cc_aktual:', '            cp_tunggakan_belum_update: a.cp_tunggakan_belum_update + n.cp_tunggakan_belum_update,\r\n            limpah_eksternal: a.limpah_eksternal + n.limpah_eksternal,\r\n            cc_aktual:', 'JS totals');
js = replaceOnce(js, '                row.cp_tunggakan_belum_update = n.cp_tunggakan_belum_update;\r\n                for (const b of CP_BREAKDOWN)', '                row.cp_tunggakan_belum_update = n.cp_tunggakan_belum_update;\r\n                row.limpah_eksternal = n.limpah_eksternal;\r\n                for (const b of CP_BREAKDOWN)', 'JS export');
js = replaceOnce(js, '            cp_tunggakan_belum_update: 0,\r\n            cc_aktual:', '            cp_tunggakan_belum_update: 0,\r\n            limpah_eksternal: 0,\r\n            cc_aktual:', 'JS empty totals');
fs.writeFileSync(jsPath, js);

let ui = fs.readFileSync(uiPath, 'utf8');
ui = replaceOnce(ui, 'belum_kesulitan:0,cp_berjalan_rincian:', 'belum_kesulitan:0,limpah_eksternal:0,cp_berjalan_rincian:', 'UI default');
ui = replaceOnce(ui, '${74+46*!!ee}rem', '${80+46*!!ee}rem', 'UI width');
ui = replaceOnce(ui,
  'header:"BELUM UPDATE",colSpan:ee?3:1,style:z}),(0,a.jsx)(r.Column,{header:"CP (CRIME PROCESSED)"',
  'header:"BELUM UPDATE",colSpan:ee?3:1,style:z}),(0,a.jsx)(r.Column,{header:"LIMPAH EKSTERNAL",rowSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"CP (CRIME PROCESSED)"',
  'UI header');
const bodyAnchor = '"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:((e.data.cp_berjalan??0)+(e.data.cp_tunggakan??0)).toLocaleString("id-ID")})';
const bodyNew = '"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#7c3aed"},children:(e.data.limpah_eksternal??0).toLocaleString("id-ID")}),style:{minWidth:"6rem",background:"#faf5ff"},align:"center"},"limpah-eksternal"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:((e.data.cp_berjalan??0)+(e.data.cp_tunggakan??0)).toLocaleString("id-ID")})';
ui = replaceOnce(ui, bodyAnchor, bodyNew, 'UI body');
fs.writeFileSync(uiPath, ui);

console.log(JSON.stringify({patched: true, ts: tsPath, js: jsPath, ui: uiPath}));
