import { DataSource } from 'typeorm';

export type DataScope = { all: boolean; isSuper: boolean; satkerId: number | null };

/**
 * Scope data per role:
 *  - superadmin / admin_binops  -> semua data (all=true)
 *  - viewer (Bareskrim/Mabes)   -> semua data / nasional (all=true)
 *  - viewer (Polda/Polres/dll)  -> lingkup satkernya (all=false, satkerId=...)
 *  - operator                   -> HANYA satkernya sendiri (EXACT, tidak hirarki),
 *                                  karena tiap satker punya operator masing-masing.
 *    (satkerId null => operator belum ditetapkan ke satker => tidak melihat data)
 */
export async function resolveScope(ds: DataSource, userId?: number): Promise<DataScope> {
    if (!userId) return { all: false, isSuper: false, satkerId: null };
    const rows = await ds.query(
        `select u.role_bdb, u.role_name, u.scope_satker_id, s.deskripsi as satker_deskripsi, s.tipe_satker as satker_tipe
         from auth_users u
         left join bdb_satker s on s.id = u.scope_satker_id
         where u.id = $1`,
        [userId]
    );
    const u = rows[0];
    const roleBdb = String(u?.role_bdb || '').toLowerCase();
    const roleName = String(u?.role_name || '').toLowerCase();
    const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
    const isAdmin = roleBdb === 'admin_binops';
    if (isSuper || isAdmin) return { all: true, isSuper, satkerId: null };

    const isViewer = roleBdb === 'viewer' || roleName.includes('viewer');
    if (isViewer) {
        const sId = u?.scope_satker_id != null ? Number(u.scope_satker_id) : null;
        const sTipe = String(u?.satker_tipe || '').toUpperCase();
        const sDesk = String(u?.satker_deskripsi || '').toUpperCase();
        const isApexMabes = !sId || sId === 1 || sId === 13 || sDesk === 'BARESKRIM POLRI' || sDesk === 'MABES POLRI';
        if (isApexMabes) {
            return { all: true, isSuper: false, satkerId: sId || 13 };
        }
    }

    return { all: false, isSuper: false, satkerId: u?.scope_satker_id != null ? Number(u.scope_satker_id) : null };
}
