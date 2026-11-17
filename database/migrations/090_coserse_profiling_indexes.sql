-- 090_coserse_profiling_indexes.sql
-- Indeks performa tinggi untuk modul Cross-Entity Profiling Coserse 1.0
-- Target: respon kueri lintas 11,4 jt bdb_dors_lp_terlibat & 5,9 jt bdb_dors_lp_barang_bukti < 1.5 detik.
-- WAJIB dijalankan di luar blok transaksi (autocommit) karena menggunakan CONCURRENTLY agar tidak mengunci tabel live.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Pencarian nomor HP & telepon pada bdb_dors_lp_terlibat (normalisasi digit via B-Tree partial index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_terlibat_no_hp_norm
    ON bdb_dors_lp_terlibat (regexp_replace(coalesce(no_hp, ''), '\D', '', 'g'))
    WHERE no_hp IS NOT NULL AND btrim(no_hp) <> '';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_terlibat_telphone_norm
    ON bdb_dors_lp_terlibat (regexp_replace(coalesce(telphone, ''), '\D', '', 'g'))
    WHERE telphone IS NOT NULL AND btrim(telphone) <> '';

-- 2. Pencarian exact NIK bersih (trim) pada bdb_dors_lp_terlibat
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_terlibat_nik_trim
    ON bdb_dors_lp_terlibat (btrim(nik))
    WHERE nik IS NOT NULL AND btrim(nik) <> '';

-- 3. Pencarian parsial nama pihak terlibat menggunakan GIN Trigram (pg_trgm)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_terlibat_nama_trgm
    ON bdb_dors_lp_terlibat USING gin (upper(nama) gin_trgm_ops)
    WHERE nama IS NOT NULL AND btrim(nama) <> '';

-- 4. Pencarian silang keterangan barang bukti & nama pemilik ranmor via GIN Trigram
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_bb_keterangan_trgm
    ON bdb_dors_lp_barang_bukti USING gin (upper(keterangan) gin_trgm_ops)
    WHERE keterangan IS NOT NULL AND btrim(keterangan) <> '';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_bb_pemilik_trgm
    ON bdb_dors_lp_barang_bukti USING gin (upper(ran_nama_pemilik) gin_trgm_ops)
    WHERE ran_nama_pemilik IS NOT NULL AND btrim(ran_nama_pemilik) <> '';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coserse_bb_ran_nopol_upper
    ON bdb_dors_lp_barang_bukti (upper(regexp_replace(coalesce(ran_no_registrasi, ''), '\s+', '', 'g')))
    WHERE ran_no_registrasi IS NOT NULL AND btrim(ran_no_registrasi) <> '';
