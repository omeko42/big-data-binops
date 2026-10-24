-- Revert seed 035: kembalikan status LP ke kondisi sebelum distribusi (dari snapshot).
-- Jalankan bila ingin membatalkan variasi status Anev CT/CC.

begin;
update bdb_laporan_polisi lp
set status_id = b.status_id, updated_at = now()
from bdb_lp_status_backup b
where b.id = lp.id;
commit;

-- Opsional: hapus tabel snapshot setelah revert
-- drop table if exists bdb_lp_status_backup;
