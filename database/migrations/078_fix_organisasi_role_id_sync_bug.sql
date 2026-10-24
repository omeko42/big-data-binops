-- Backfill BUG FATAL: UserService.create() sebelumnya hardcode organisasiRoleId ke 1
-- ("superadmin" di tm_org_role) untuk SEMUA user baru, apa pun role_bdb-nya. Menu sidebar di
-- frontend cek DUA field (lib/auth.ts deriveRoles()): role_bdb DAN user.role.role_name (dari
-- organisasiRoleId) -- kalau salah satu mengandung "super", user dianggap superadmin dan lihat
-- SEMUA menu, walau role_bdb-nya sendiri sudah benar "operator"/"viewer"/"admin_binops".
--
-- Kena SEMUA user yang dibuat lewat UserService.create() (baik "Tambah Pengguna" manual maupun
-- bulk-import Excel di menu Pengguna) -- jalur lain (mis. auto-backfill admin operator per
-- satker) sudah set organisasiRoleId dgn benar sejak awal, tidak kena.
--
-- Fix ini samakan organisasiRoleId dgn tm_org_role yang NAMANYA cocok dgn role_bdb user itu
-- sendiri -- role_bdb adalah sumber kebenaran (kolom BDB asli), organisasiRoleId cuma field
-- legacy yang harus ikut, bukan sebaliknya. Aman dijalankan berkali-kali (idempotent).
update auth_users u
set "organisasiRoleId" = r.id
from tm_org_role r
where lower(r.role_name) = lower(u.role_bdb)
  and r.deleted_at is null
  and u."organisasiRoleId" is distinct from r.id;
