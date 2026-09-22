"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectiveLpOwnerId = effectiveLpOwnerId;
exports.hasEffectiveLpAccess = hasEffectiveLpAccess;
exports.effectiveLpScopeSql = effectiveLpScopeSql;
exports.operationalLpScopeIds = operationalLpScopeIds;
exports.hasOperationalLpAccess = hasOperationalLpAccess;
function effectiveLpOwnerId(lp) {
    if (!lp)
        return null;
    const raw = lp.unit_satker_id ?? lp.satker_id;
    if (raw === null || raw === undefined || raw === '')
        return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}
function hasEffectiveLpAccess(lp, scopeSatkerId) {
    if (scopeSatkerId === null || scopeSatkerId === undefined)
        return false;
    return effectiveLpOwnerId(lp) === Number(scopeSatkerId);
}
function effectiveLpScopeSql(alias, parameter) {
    return `coalesce(${alias}.unit_satker_id, ${alias}.satker_id) = ${parameter}`;
}
async function operationalLpScopeIds(dataSource, rootId) {
    const rows = await dataSource.query(`with recursive root as (
            select id, parent_id, deskripsi
              from bdb_satker
             where id=$1
         ), polres as (
            select p.id
              from root r
              join bdb_satker p on p.id=r.parent_id
             where upper(trim(r.deskripsi)) like 'SAT RESKRIM%'
               and (upper(coalesce(p.tipe_satker,'')) in ('POLRES','POLRESTA','POLRESTABES','POLRES METRO')
                    or upper(trim(p.deskripsi)) like 'POLRES%')
         ), territory as (
            select c.id, c.parent_id, c.deskripsi, c.tipe_satker
              from bdb_satker c join polres p on c.parent_id=p.id
            union all
            select c.id, c.parent_id, c.deskripsi, c.tipe_satker
              from bdb_satker c join territory t on c.parent_id=t.id
         ), allowed as (
            select id from root
            union
            select t.id
              from territory t
              left join bdb_satker parent on parent.id=t.parent_id
             where upper(coalesce(t.tipe_satker,''))='POLSEK'
                or upper(trim(t.deskripsi)) like 'POLSEK%'
                or ((upper(coalesce(parent.tipe_satker,''))='POLSEK' or upper(trim(parent.deskripsi)) like 'POLSEK%')
                    and (upper(trim(t.deskripsi)) like 'UNIT RESKRIM%' or upper(trim(t.deskripsi)) like 'RESKRIM POLSEK%'))
         )
         select id from allowed order by id`, [rootId]);
    return rows.map((row) => Number(row.id)).filter(Number.isFinite);
}
async function hasOperationalLpAccess(dataSource, lp, scopeSatkerId) {
    if (scopeSatkerId === null || scopeSatkerId === undefined)
        return false;
    const ownerId = effectiveLpOwnerId(lp);
    if (ownerId === null)
        return false;
    const allowedIds = await operationalLpScopeIds(dataSource, Number(scopeSatkerId));
    return allowedIds.includes(ownerId);
}
//# sourceMappingURL=lp-scope.util.js.map
