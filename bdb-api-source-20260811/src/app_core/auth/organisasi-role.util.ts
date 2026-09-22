import { DataSource } from 'typeorm';

/**
 * Cari id tm_org_role yg NAMANYA cocok dgn role_bdb (mis. "operator" -> id 3) -- SATU-SATUNYA
 * cara yg boleh dipakai utk isi auth_users.organisasiRoleId, JANGAN PERNAH hardcode id manapun.
 *
 * Riwayat bug: organisasiRoleId sempat di-hardcode ke 1 ("superadmin") di 3 tempat terpisah
 * (UserService.create() utk Tambah Pengguna & bulk-import Excel, AuthService registrasi mandiri
 * via OTP, dan UserService.reviewApproval() yg SAMA SEKALI tak menyentuh kolom ini saat admin
 * approve+tetapkan role user baru) -- deriveRoles() di frontend (lib/auth.ts) cek DUA field utk
 * tentukan superadmin: role_bdb DAN user.role.role_name (dari organisasiRoleId) via
 * roleName.includes('super'). Akibatnya user dgn role_bdb yg BENAR (mis. "operator") tetap dapat
 * akses menu penuh spt superadmin krn field legacy ini nyasar ke id 1. Ditemukan dari laporan
 * prod: user hasil bulk-import role "operator" tapi akses menunya persis superadmin.
 */
export async function resolveOrganisasiRoleId(dataSource: DataSource, roleBdb: string): Promise<number | null> {
    const rows = await dataSource.query('select id from tm_org_role where lower(role_name) = lower($1) and deleted_at is null limit 1', [roleBdb]);
    return rows[0]?.id != null ? Number(rows[0].id) : null;
}
