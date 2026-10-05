import { DataSource } from 'typeorm';

export type DataScope = { all: boolean; isSuper: boolean; isViewer: boolean; satkerId: number | null };

/**
 * Scope data per role:
 *  - superadmin / admin_binops  -> semua data (all=true)
 *  - operator                   -> HANYA satkernya sendiri (EXACT, tidak hirarki),
 *                                  karena tiap satker punya operator masing-masing.
 *    (satkerId null => operator belum ditetapkan ke satker => tidak melihat data)
 */
export async function resolveScope(ds: DataSource, userId?: number): Promise<DataScope> {
    if (!userId) return { all: false, isSuper: false, isViewer: false, satkerId: null };
    const rows = await ds.query('select role_bdb, role_name, scope_satker_id from auth_users where id=$1', [userId]);
    const u = rows[0];
    const roleBdb = String(u?.role_bdb || '').toLowerCase();
    const roleName = String(u?.role_name || '').toLowerCase();
    const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
    const isAdmin = roleBdb === 'admin_binops';
    const isViewer = roleBdb === 'viewer' || roleName.includes('viewer') || roleName.includes('kapol');
    if (isSuper || isAdmin) return { all: true, isSuper, isViewer: false, satkerId: null };
    return { all: false, isSuper: false, isViewer, satkerId: u?.scope_satker_id != null ? Number(u.scope_satker_id) : null };
}
