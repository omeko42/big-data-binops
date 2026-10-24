-- 023_dors_satker_alias.sql
-- Alias hasil "paksa mapping": nama/kode satker DORS -> satker (bdb_satker) yang benar.
-- Sekali dipaksakan, LP serupa berikutnya otomatis termapping tanpa paksa ulang.
-- Idempotent; juga dibuat oleh LaporanPolisiService.ensureAliasTable().

create table if not exists bdb_dors_satker_map (
    id                bigserial primary key,
    dors_kode_pusiknas text,           -- kode pusiknas DORS (bila ada)
    dors_nama         text not null,   -- nama satker DORS (terdalam)
    dors_parent_nama  text,            -- nama induk (polres/polda) utk disambiguasi
    satker_id         bigint not null references bdb_satker(id) on delete cascade,
    satker_nama       text,
    catatan           text,
    created_at        timestamp not null default now(),
    updated_at        timestamp not null default now()
);

-- kunci unik: prioritas kode; bila kode kosong pakai nama+induk
create unique index if not exists bdb_dors_satker_map_key
    on bdb_dors_satker_map (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')));
