-- Index fungsional utk ekspresi normalisasi whitespace yg dipakai LaporanPolisiService.normKode()
-- dan SatkerLegacyReconciliationService.normKode() (lihat kedua file itu) -- tanpa ini, exact-match
-- kode_pusiknas/dors_kode di mapFromDors() jadi full-scan bdb_satker tiap sync (lambat, makin parah
-- seiring data bertambah). Ekspresi HARUS identik persis dgn yg dipakai di query supaya Postgres
-- mengenali & memakai index ini (planner mencocokkan expression tree, bukan cuma nama kolom).
create index if not exists bdb_satker_kode_norm_idx
    on bdb_satker (regexp_replace(replace(coalesce(kode, ''), chr(160), ''), '\s+', '', 'g'));

create index if not exists bdb_satker_dors_kode_norm_idx
    on bdb_satker (regexp_replace(replace(coalesce(dors_kode, ''), chr(160), ''), '\s+', '', 'g'))
    where dors_kode is not null;
