-- Kolom outcome (SUCCESS/ERROR) di bdb_audit_log -- sebelumnya cuma tersimpan di dalam meta (json),
-- dipromosikan jadi kolom sendiri supaya bisa difilter cepat (dgn index) di halaman Log Audit,
-- dipakai fitur monitoring error sistem (lihat GlobalAuditInterceptor -- sekarang catat error dari
-- endpoint GET jg, bukan cuma POST/PUT/PATCH/DELETE).
alter table bdb_audit_log add column if not exists outcome text;
create index if not exists idx_audit_outcome on bdb_audit_log(outcome);
