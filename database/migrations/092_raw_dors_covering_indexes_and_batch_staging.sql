-- Migration 092: Covering Indexes for raw_dors & Dirty-Partition Atomic Batch Staging
-- NOTE: CREATE INDEX CONCURRENTLY statements must run outside a transaction block.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lp_eff_tgl_dors_active
    ON bdb_laporan_polisi ((COALESCE(parse_tgl_laporan(tgl_laporan), synced_at::date)), dors_lp_id, model_lp)
    INCLUDE (id, satker_id, unit_satker_id, satker_nama, unit_satker_nama, synced_at, no_laporan)
    WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_terlibat_lp_valid_nik_cov
    ON bdb_dors_lp_terlibat (lp_id)
    INCLUDE (nik, nama, keterlibatan, status_korban, tgl_lahir, pekerjaan, jenis_identitas, model_lp)
    WHERE nik IS NOT NULL AND trim(nik) ~ '^[1-9][0-9]{15}$' AND nama IS NOT NULL AND length(trim(nama)) > 2;

CREATE TABLE IF NOT EXISTS bdb_snapshot_partition_state (
    partition_key VARCHAR(40) PRIMARY KEY,
    tahun INTEGER NOT NULL,
    bulan INTEGER,
    is_dirty BOOLEAN NOT NULL DEFAULT true,
    last_dirty_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_refreshed_at TIMESTAMPTZ,
    active_batch_id VARCHAR(80),
    dirty_reason TEXT
);

CREATE TABLE IF NOT EXISTS bdb_snapshot_active_batch (
    snapshot_name VARCHAR(64) PRIMARY KEY,
    active_batch_id VARCHAR(80) NOT NULL,
    switched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    partitions_switched JSONB DEFAULT '[]'::jsonb,
    meta_json JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS bdb_pihak_terlibat_ranking_snapshot_staging (
    LIKE bdb_pihak_terlibat_ranking_snapshot INCLUDING DEFAULTS
);

ALTER TABLE bdb_pihak_terlibat_ranking_snapshot_staging
    ADD COLUMN IF NOT EXISTS batch_id VARCHAR(80) NOT NULL DEFAULT 'init';

CREATE INDEX IF NOT EXISTS idx_pihak_ranking_staging_batch_part
    ON bdb_pihak_terlibat_ranking_snapshot_staging (batch_id, tahun, COALESCE(bulan, 0));
