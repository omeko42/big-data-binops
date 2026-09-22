"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectiveLpOwnerId = effectiveLpOwnerId;
exports.hasEffectiveLpAccess = hasEffectiveLpAccess;
exports.effectiveLpScopeSql = effectiveLpScopeSql;
exports.operationalLpScopeIds = operationalLpScopeIds;
exports.hasOperationalLpAccess = hasOperationalLpAccess;
function effectiveLpOwnerId(lp) {
    if (!lp) return null;
    const raw = lp.unit_satker_id ?? lp.satker_id;
    if (raw === null || raw === undefined || raw === '') return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}
function hasEffectiveLpAccess(lp, scopeSatkerId) {
    if (scopeSatkerId === null || scopeSatkerId === undefined) return false;
    return effectiveLpOwnerId(lp) === Number(scopeSatkerId);
}
function effectiveLpScopeSql(alias, parameter) {
    return `coalesce(${alias}.unit_satker_id, ${alias}.satker_id) = ${parameter}`;
}
// Operational read/write access follows the assigned owner, not reporting rollups.
// DORS transfers already set that owner; never grant every Polsek to Satreskrim.
async function operationalLpScopeIds(dataSource, rootId) {
    const id = Number(rootId);
    if (!Number.isSafeInteger(id) || id <= 0) return [];
    const rows = await dataSource.query('select id from bdb_satker where id=$1', [id]);
    return rows.map((row) => Number(row.id)).filter((value) => value === id);
}
async function hasOperationalLpAccess(dataSource, lp, scopeSatkerId) {
    if (scopeSatkerId === null || scopeSatkerId === undefined) return false;
    const ownerId = effectiveLpOwnerId(lp);
    if (ownerId === null) return false;
    const allowedIds = await operationalLpScopeIds(dataSource, Number(scopeSatkerId));
    return allowedIds.includes(ownerId);
}

