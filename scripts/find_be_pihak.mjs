import { runBE } from './fe_inspect.mjs';

const patchScript = `
const fs = require("fs");
const p = "/usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts";
let s = fs.readFileSync(p, "utf8");

// 1. scopeClause
const origScopeClause = \`    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[]): string {
        if (scope.all) return '1=1';
        if (!scope.satkerId) return '1=0';
        const rootId = Number(scope.satkerId);
        if (!Number.isSafeInteger(rootId) || rootId <= 0) return '1=0';
        return \\x60coalesce(lp.unit_satker_id, lp.satker_id) in (
            with recursive scope_tree as (
                select id from bdb_satker where id=\\${rootId}
                union
                select s.id
                from bdb_satker s
                join scope_tree t on s.parent_id=t.id
            )
            select id from scope_tree
        )\\x60;
    }\`;

const newScopeClause = \`    private scopeClause(scope: { all: boolean; satkerId: number | null }, params: any[], query?: any): string {
        if (scope.all) return '1=1';
        const isNational = query?.scope === 'national';
        const hasSearch = Boolean(this.toText(query?.search));
        const satkerId = Number(query?.satker_id || 0);
        const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;

        // Jika user filter spesifik satker, query akan difilter spesifik oleh selected_tree di buildDirectSummaryWhere
        if (hasExplicitSatker) return '1=1';

        // Jika query eksplisit nasional atau pencarian spesifik NIK / Nama pihak, buka scope pencarian nasional
        if (isNational || hasSearch) return '1=1';

        // Operator default: batasi ke satker wilayah kewenangannya
        if (!scope.satkerId) return '1=0';
        const rootId = Number(scope.satkerId);
        if (!Number.isSafeInteger(rootId) || rootId <= 0) return '1=0';
        return \\x60coalesce(lp.unit_satker_id, lp.satker_id) in (
            with recursive scope_tree as (
                select id from bdb_satker where id=\\${rootId}
                union
                select s.id
                from bdb_satker s
                join scope_tree t on s.parent_id=t.id
            )
            select id from scope_tree
        )\\x60;
    }\`;

if (!s.includes(origScopeClause)) {
    console.error("origScopeClause not found!");
    process.exit(1);
}
s = s.replace(origScopeClause, newScopeClause);

// 2. summaryKey
const origSummaryKey = "return JSON.stringify({ scope: scope.all ? 'ALL' : Number(scope.satkerId || 0), search: query.search || '',";
const newSummaryKey = "return JSON.stringify({ scope: scope.all ? 'ALL' : Number(scope.satkerId || 0), queryScope: query.scope || '', search: query.search || '',";
if (!s.includes(origSummaryKey)) {
    console.error("origSummaryKey not found!");
    process.exit(1);
}
s = s.replace(origSummaryKey, newSummaryKey);

// 3. scopeClause calls in buildWhere and buildDirectSummaryWhere
const origScopeCall = "const where: string[] = ['lp.deleted_at is null', this.scopeClause(scope, params)];";
const newScopeCall = "const where: string[] = ['lp.deleted_at is null', this.scopeClause(scope, params, query)];";
if (!s.includes(origScopeCall)) {
    console.error("origScopeCall not found!");
    process.exit(1);
}
s = s.split(origScopeCall).join(newScopeCall);

// 4. globalSummary snapshot satker filter
const origSnapSatker = \`                if (!scope.all && scope.satkerId) {
                    sWhere.push(\\`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = \\${scope.satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )\\`);
                } else if (query.satker_id) {
                    const sid = Number(query.satker_id);
                    if (Number.isSafeInteger(sid) && sid > 0) {
                        sWhere.push(\\`satker_id in (
                            with recursive st as (
                                select id from bdb_satker where id = \\${sid}
                                union all
                                select s.id from bdb_satker s join st on s.parent_id = st.id
                            ) select id from st
                        )\\`);
                    }
                }\`;

const newSnapSatker = \`                const isNational = query?.scope === 'national';
                const satkerId = Number(query?.satker_id || 0);
                const hasExplicitSatker = Number.isSafeInteger(satkerId) && satkerId > 0;

                if (hasExplicitSatker) {
                    sWhere.push(\\`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = \\${satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )\\`);
                } else if (!isNational && !scope.all && scope.satkerId) {
                    sWhere.push(\\`satker_id in (
                        with recursive st as (
                            select id from bdb_satker where id = \\${scope.satkerId}
                            union all
                            select s.id from bdb_satker s join st on s.parent_id = st.id
                        ) select id from st
                    )\\`);
                }\`;

if (!s.includes(origSnapSatker)) {
    console.error("origSnapSatker not found!");
    process.exit(1);
}
s = s.replace(origSnapSatker, newSnapSatker);

// 5. isDefaultGlobal in list
const origDefaultGlobal = "const isDefaultGlobal = scope.all && !this.hasCommonFilter(query)";
const newDefaultGlobal = "const isDefaultGlobal = (scope.all || query.scope === 'national') && !this.hasCommonFilter(query)";
if (!s.includes(origDefaultGlobal)) {
    console.error("origDefaultGlobal not found!");
    process.exit(1);
}
s = s.replace(origDefaultGlobal, newDefaultGlobal);

// 6. scopeWhereClause in ranking
const origRankingScope = "if (!scope.all && scope.satkerId) {\\n            const satkerRows = await this.dataSource.query('select deskripsi, parent_id from bdb_satker where id = $1', [scope.satkerId]);";
const newRankingScope = "if (!scope.all && scope.satkerId && query.scope !== 'national') {\\n            const satkerRows = await this.dataSource.query('select deskripsi, parent_id from bdb_satker where id = $1', [scope.satkerId]);";
if (!s.includes("if (!scope.all && scope.satkerId) {\n            const satkerRows = await this.dataSource.query('select deskripsi, parent_id from bdb_satker where id = $1', [scope.satkerId]);")) {
    console.error("origRankingScope not found!");
    process.exit(1);
}
s = s.replace("if (!scope.all && scope.satkerId) {\n            const satkerRows = await this.dataSource.query('select deskripsi, parent_id from bdb_satker where id = $1', [scope.satkerId]);", newRankingScope);

fs.writeFileSync(p, s, "utf8");
console.log("pihak-terlibat.service.ts patched successfully!");
`;

const b64Patch = Buffer.from(patchScript).toString('base64');
const cmd = `docker exec bdb-api node -e 'eval(Buffer.from("${b64Patch}", "base64").toString("utf8"))'`;

try {
    console.log("Running patch on bdb-api...");
    console.log(runBE(cmd));
} catch (e) {
    console.error("Patch failed:", e.message);
}
