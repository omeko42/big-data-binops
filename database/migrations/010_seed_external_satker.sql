-- Seed satker eksternal non-Polri yang tidak tersedia dari DORS.
-- Polanya mengikuti generator satker operasional BDB: source_type BDB,
-- satker_key stabil, parent_key, full_path, operational_role, dan holding node.

with root_data(satker_key, manual_code, nama_satker_canonical, operational_role) as (
    values
        ('BDB:EXT-BNN-RI', 'EXT-BNN-RI', 'BNN RI', 'EKSTERNAL_BNN'),
        ('BDB:EXT-KEJAKSAAN-RI', 'EXT-KEJAKSAAN-RI', 'Kejaksaan RI', 'EKSTERNAL_KEJAKSAAN')
)
update bdb_satker_master s
set
    domain = 'EKSTERNAL POLRI',
    sub_domain = 'EKSTERNAL NON POLRI',
    level = 'Instansi',
    nama_satker_canonical = r.nama_satker_canonical,
    nama_satker_dors = r.nama_satker_canonical,
    nama_parent_satker_dors = null,
    nama_grandparent_satker_dors = null,
    status = 'Aktif',
    payload_json = coalesce(s.payload_json, '{}'::jsonb) || jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now()
    ),
    updated_at = now(),
    parent_key = null,
    grandparent_key = null,
    full_path = r.nama_satker_canonical,
    source_type = 'BDB',
    manual_code = r.manual_code,
    operational_role = r.operational_role,
    is_holding_node = true
from root_data r
where s.satker_key = r.satker_key;

with root_data(satker_key, manual_code, nama_satker_canonical, operational_role) as (
    values
        ('BDB:EXT-BNN-RI', 'EXT-BNN-RI', 'BNN RI', 'EKSTERNAL_BNN'),
        ('BDB:EXT-KEJAKSAAN-RI', 'EXT-KEJAKSAAN-RI', 'Kejaksaan RI', 'EKSTERNAL_KEJAKSAAN')
)
insert into bdb_satker_master (
    domain,
    sub_domain,
    level,
    nama_satker_canonical,
    dors_satker_id,
    dors_kode,
    nama_satker_dors,
    nama_parent_satker_dors,
    nama_grandparent_satker_dors,
    status,
    payload_json,
    created_at,
    updated_at,
    satker_key,
    parent_key,
    grandparent_key,
    full_path,
    source_type,
    manual_code,
    operational_role,
    is_holding_node
)
select
    'EKSTERNAL POLRI',
    'EKSTERNAL NON POLRI',
    'Instansi',
    r.nama_satker_canonical,
    null,
    null,
    r.nama_satker_canonical,
    null,
    null,
    'Aktif',
    jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now()
    ),
    now(),
    now(),
    r.satker_key,
    null,
    null,
    r.nama_satker_canonical,
    'BDB',
    r.manual_code,
    r.operational_role,
    true
from root_data r
where not exists (
    select 1
    from bdb_satker_master s
    where s.satker_key = r.satker_key
);

with polda as (
    select
        id,
        satker_key,
        coalesce(nullif(dors_kode, ''), nullif(manual_code, ''), id::text) as kode_polda,
        regexp_replace(nama_satker_canonical, '^Polda\s+', '', 'i') as wilayah
    from bdb_satker_master
    where lower(coalesce(level, '')) = 'polda'
      and coalesce(domain, '') = 'INTERNAL POLRI'
      and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
      and nama_satker_canonical ~* '^Polda\s+'
),
child_data as (
    select
        'BDB:EXT-BNN-RI:' || replace(p.kode_polda, '.', '-') as satker_key,
        'EXT-BNNP-' || replace(p.kode_polda, '.', '-') || '-' ||
            upper(regexp_replace(regexp_replace(p.wilayah, '[^A-Za-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) as manual_code,
        'BNNP ' || p.wilayah as nama_satker_canonical,
        'BDB:EXT-BNN-RI' as parent_key,
        'BNN RI' as parent_name,
        'BNN RI > BNNP ' || p.wilayah as full_path,
        'EKSTERNAL_BNN' as operational_role,
        p.satker_key as source_polda_key,
        p.kode_polda as source_polda_code
    from polda p

    union all

    select
        'BDB:EXT-KEJAKSAAN-RI:' || replace(p.kode_polda, '.', '-') as satker_key,
        'EXT-KEJATI-' || replace(p.kode_polda, '.', '-') || '-' ||
            upper(regexp_replace(regexp_replace(p.wilayah, '[^A-Za-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) as manual_code,
        'Kejaksaan Tinggi ' || p.wilayah as nama_satker_canonical,
        'BDB:EXT-KEJAKSAAN-RI' as parent_key,
        'Kejaksaan RI' as parent_name,
        'Kejaksaan RI > Kejaksaan Tinggi ' || p.wilayah as full_path,
        'EKSTERNAL_KEJAKSAAN' as operational_role,
        p.satker_key as source_polda_key,
        p.kode_polda as source_polda_code
    from polda p
)
update bdb_satker_master s
set
    domain = 'EKSTERNAL POLRI',
    sub_domain = 'EKSTERNAL NON POLRI',
    level = 'Instansi',
    nama_satker_canonical = c.nama_satker_canonical,
    nama_satker_dors = c.nama_satker_canonical,
    nama_parent_satker_dors = c.parent_name,
    nama_grandparent_satker_dors = null,
    status = 'Aktif',
    payload_json = coalesce(s.payload_json, '{}'::jsonb) || jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now(),
        'source_polda_key', c.source_polda_key,
        'source_polda_code', c.source_polda_code
    ),
    updated_at = now(),
    parent_key = c.parent_key,
    grandparent_key = null,
    full_path = c.full_path,
    source_type = 'BDB',
    manual_code = c.manual_code,
    operational_role = c.operational_role,
    is_holding_node = false
from child_data c
where s.satker_key = c.satker_key;

with polda as (
    select
        id,
        satker_key,
        coalesce(nullif(dors_kode, ''), nullif(manual_code, ''), id::text) as kode_polda,
        regexp_replace(nama_satker_canonical, '^Polda\s+', '', 'i') as wilayah
    from bdb_satker_master
    where lower(coalesce(level, '')) = 'polda'
      and coalesce(domain, '') = 'INTERNAL POLRI'
      and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
      and nama_satker_canonical ~* '^Polda\s+'
),
child_data as (
    select
        'BDB:EXT-BNN-RI:' || replace(p.kode_polda, '.', '-') as satker_key,
        'EXT-BNNP-' || replace(p.kode_polda, '.', '-') || '-' ||
            upper(regexp_replace(regexp_replace(p.wilayah, '[^A-Za-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) as manual_code,
        'BNNP ' || p.wilayah as nama_satker_canonical,
        'BDB:EXT-BNN-RI' as parent_key,
        'BNN RI' as parent_name,
        'BNN RI > BNNP ' || p.wilayah as full_path,
        'EKSTERNAL_BNN' as operational_role,
        p.satker_key as source_polda_key,
        p.kode_polda as source_polda_code
    from polda p

    union all

    select
        'BDB:EXT-KEJAKSAAN-RI:' || replace(p.kode_polda, '.', '-') as satker_key,
        'EXT-KEJATI-' || replace(p.kode_polda, '.', '-') || '-' ||
            upper(regexp_replace(regexp_replace(p.wilayah, '[^A-Za-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) as manual_code,
        'Kejaksaan Tinggi ' || p.wilayah as nama_satker_canonical,
        'BDB:EXT-KEJAKSAAN-RI' as parent_key,
        'Kejaksaan RI' as parent_name,
        'Kejaksaan RI > Kejaksaan Tinggi ' || p.wilayah as full_path,
        'EKSTERNAL_KEJAKSAAN' as operational_role,
        p.satker_key as source_polda_key,
        p.kode_polda as source_polda_code
    from polda p
)
insert into bdb_satker_master (
    domain,
    sub_domain,
    level,
    nama_satker_canonical,
    dors_satker_id,
    dors_kode,
    nama_satker_dors,
    nama_parent_satker_dors,
    nama_grandparent_satker_dors,
    status,
    payload_json,
    created_at,
    updated_at,
    satker_key,
    parent_key,
    grandparent_key,
    full_path,
    source_type,
    manual_code,
    operational_role,
    is_holding_node
)
select
    'EKSTERNAL POLRI',
    'EKSTERNAL NON POLRI',
    'Instansi',
    c.nama_satker_canonical,
    null,
    null,
    c.nama_satker_canonical,
    c.parent_name,
    null,
    'Aktif',
    jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now(),
        'source_polda_key', c.source_polda_key,
        'source_polda_code', c.source_polda_code
    ),
    now(),
    now(),
    c.satker_key,
    c.parent_key,
    null,
    c.full_path,
    'BDB',
    c.manual_code,
    c.operational_role,
    false
from child_data c
where not exists (
    select 1
    from bdb_satker_master s
    where s.satker_key = c.satker_key
);

