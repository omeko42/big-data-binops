"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveScope = resolveScope;
async function resolveScope(ds, userId) {
    if (!userId)
        return { all: false, isSuper: false, satkerId: null };
    const rows = await ds.query('select role_bdb, role_name, scope_satker_id from auth_users where id=$1', [userId]);
    const u = rows[0];
    const roleBdb = String(u?.role_bdb || '').toLowerCase();
    const roleName = String(u?.role_name || '').toLowerCase();
    const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
    const isAdmin = roleBdb === 'admin_binops';
    if (isSuper || isAdmin)
        return { all: true, isSuper, satkerId: null };
    return { all: false, isSuper: false, satkerId: u?.scope_satker_id != null ? Number(u.scope_satker_id) : null };
}
//# sourceMappingURL=scope.util.js.map