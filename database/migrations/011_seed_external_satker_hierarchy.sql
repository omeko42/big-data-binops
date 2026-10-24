-- Seed satker eksternal BDB yang tidak tersedia dari DORS.
-- Pola kode mengikuti generator internal: <kode induk>.BDB-<ROLE>
-- Contoh:
--   060.01.BDB-EXT-BEA-CUKAI
--   060.02.BDB-KEJATI
--   060.02.26.BDB-KEJARI

begin;

create temp table tmp_bdb_external_satker_seed on commit drop as
with root_data(satker_key, manual_code, nama_satker_canonical, operational_role) as (
    values
        ('BDB:EXT-KEJAKSAAN-RI', '060.01.BDB-EXT-KEJAKSAAN-RI', 'Kejaksaan RI', 'EKSTERNAL_KEJAKSAAN'),
        ('BDB:EXT-BNN-RI', '060.01.BDB-EXT-BNN-RI', 'BNN RI', 'EKSTERNAL_BNN'),
        ('BDB:EXT-POM-TNI', '060.01.BDB-EXT-POM-TNI', 'POM TNI', 'EKSTERNAL_POM_TNI'),
        ('BDB:EXT-POMAD', '060.01.BDB-EXT-POMAD', 'POMAD', 'EKSTERNAL_POMAD'),
        ('BDB:EXT-POMAL', '060.01.BDB-EXT-POMAL', 'POMAL', 'EKSTERNAL_POMAL'),
        ('BDB:EXT-POMAU', '060.01.BDB-EXT-POMAU', 'POMAU', 'EKSTERNAL_POMAU'),
        ('BDB:EXT-BEA-CUKAI', '060.01.BDB-EXT-BEA-CUKAI', 'Direktorat Jenderal Bea dan Cukai', 'EKSTERNAL_BEA_CUKAI'),
        ('BDB:EXT-OJK', '060.01.BDB-EXT-OJK', 'Otoritas Jasa Keuangan', 'EKSTERNAL_OJK'),
        ('BDB:EXT-KPK', '060.01.BDB-EXT-KPK', 'Komisi Pemberantasan Korupsi', 'EKSTERNAL_KPK'),
        ('BDB:EXT-IMIGRASI', '060.01.BDB-EXT-IMIGRASI', 'Direktorat Jenderal Imigrasi', 'EKSTERNAL_IMIGRASI'),
        ('BDB:EXT-PAJAK', '060.01.BDB-EXT-PAJAK', 'Direktorat Jenderal Pajak', 'EKSTERNAL_PAJAK'),
        ('BDB:EXT-GAKKUM-KLHK', '060.01.BDB-EXT-GAKKUM-KLHK', 'Gakkum KLHK', 'EKSTERNAL_GAKKUM_KLHK'),
        ('BDB:EXT-PSDKP-KKP', '060.01.BDB-EXT-PSDKP-KKP', 'PSDKP KKP', 'EKSTERNAL_PSDKP_KKP'),
        ('BDB:EXT-BPOM', '060.01.BDB-EXT-BPOM', 'Badan POM', 'EKSTERNAL_BPOM')
),
polda as (
    select distinct on (coalesce(nullif(dors_kode, ''), nullif(manual_code, ''), id::text))
        id,
        satker_key,
        coalesce(nullif(dors_kode, ''), nullif(manual_code, ''), id::text) as kode_polda,
        trim(regexp_replace(nama_satker_canonical, '^Polda\s+', '', 'i')) as wilayah
    from bdb_satker_master
    where lower(coalesce(level, '')) = 'polda'
      and coalesce(domain, '') = 'INTERNAL POLRI'
      and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
      and nama_satker_canonical ~* '^Polda\s+'
    order by
        coalesce(nullif(dors_kode, ''), nullif(manual_code, ''), id::text),
        case when coalesce(source_type, '') = 'DORS' then 0 else 1 end,
        id
),
polres as (
    select distinct on (r.satker_key)
        r.id,
        r.satker_key,
        coalesce(nullif(r.dors_kode, ''), nullif(r.manual_code, ''), r.id::text) as kode_polres,
        trim(regexp_replace(
            regexp_replace(initcap(lower(r.nama_satker_canonical)), '^(Polres|Polresta|Polrestabes)\s+', '', 'i'),
            '\s+',
            ' ',
            'g'
        )) as wilayah,
        p.satker_key as polda_key,
        p.kode_polda,
        p.wilayah as polda_wilayah
    from bdb_satker_master r
    join lateral (
        select p0.*
        from polda p0
        where p0.satker_key = r.parent_key
           or upper(coalesce(r.nama_parent_satker_dors, '')) = upper(p0.wilayah)
           or upper(coalesce(r.nama_parent_satker_dors, '')) = upper('Polda ' || p0.wilayah)
        order by case when p0.satker_key = r.parent_key then 0 else 1 end, p0.kode_polda
        limit 1
    ) p on true
    where lower(coalesce(r.level, '')) = 'polres'
      and coalesce(r.domain, '') = 'INTERNAL POLRI'
      and coalesce(r.status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
    order by r.satker_key
),
seed_rows as (
    select
        r.satker_key,
        null::text as legacy_key,
        r.manual_code,
        r.nama_satker_canonical,
        'Mabes'::text as level,
        null::text as parent_key,
        null::text as grandparent_key,
        null::text as parent_name,
        null::text as grandparent_name,
        r.nama_satker_canonical as full_path,
        r.operational_role,
        true as is_holding_node,
        null::text as source_polda_key,
        null::text as source_polda_code,
        null::text as source_polres_key,
        null::text as source_polres_code
    from root_data r

    union all

    select
        'BDB:' || p.kode_polda || '.BDB-BNNP',
        'BDB:EXT-BNN-RI:' || replace(p.kode_polda, '.', '-'),
        p.kode_polda || '.BDB-BNNP',
        'BNNP ' || p.wilayah,
        'Polda',
        'BDB:EXT-BNN-RI',
        null,
        'BNN RI',
        null,
        'BNN RI > BNNP ' || p.wilayah,
        'EKSTERNAL_BNN',
        true,
        p.satker_key,
        p.kode_polda,
        null,
        null
    from polda p

    union all

    select
        'BDB:' || p.kode_polda || '.BDB-KEJATI',
        'BDB:EXT-KEJAKSAAN-RI:' || replace(p.kode_polda, '.', '-'),
        p.kode_polda || '.BDB-KEJATI',
        'Kejaksaan Tinggi ' || p.wilayah,
        'Polda',
        'BDB:EXT-KEJAKSAAN-RI',
        null,
        'Kejaksaan RI',
        null,
        'Kejaksaan RI > Kejaksaan Tinggi ' || p.wilayah,
        'EKSTERNAL_KEJAKSAAN',
        true,
        p.satker_key,
        p.kode_polda,
        null,
        null
    from polda p

    union all

    select
        'BDB:' || r.kode_polres || '.BDB-BNNK',
        null,
        r.kode_polres || '.BDB-BNNK',
        'BNNK ' || r.wilayah,
        'Polres',
        'BDB:' || r.kode_polda || '.BDB-BNNP',
        'BDB:EXT-BNN-RI',
        'BNNP ' || r.polda_wilayah,
        'BNN RI',
        'BNN RI > BNNP ' || r.polda_wilayah || ' > BNNK ' || r.wilayah,
        'EKSTERNAL_BNN',
        false,
        r.polda_key,
        r.kode_polda,
        r.satker_key,
        r.kode_polres
    from polres r

    union all

    select
        'BDB:' || r.kode_polres || '.BDB-KEJARI',
        null,
        r.kode_polres || '.BDB-KEJARI',
        'Kejaksaan Negeri ' || r.wilayah,
        'Polres',
        'BDB:' || r.kode_polda || '.BDB-KEJATI',
        'BDB:EXT-KEJAKSAAN-RI',
        'Kejaksaan Tinggi ' || r.polda_wilayah,
        'Kejaksaan RI',
        'Kejaksaan RI > Kejaksaan Tinggi ' || r.polda_wilayah || ' > Kejaksaan Negeri ' || r.wilayah,
        'EKSTERNAL_KEJAKSAAN',
        false,
        r.polda_key,
        r.kode_polda,
        r.satker_key,
        r.kode_polres
    from polres r
)
select *
from seed_rows;

delete from bdb_satker_master s
where coalesce(s.payload_json->>'generated_by', '') = 'BDB_EXTERNAL_SATKER_SEED'
  and coalesce(s.operational_role, '') in (
      'EKSTERNAL_PENGADILAN',
      'EKSTERNAL_KEMENTERIAN_LEMBAGA',
      'EKSTERNAL_PEMDA',
      'EKSTERNAL_RUMAH_SAKIT',
      'EKSTERNAL_BUMN_BUMD',
      'EKSTERNAL_SWASTA_PERORANGAN',
      'EKSTERNAL_LAINNYA',
      'EKSTERNAL_TNI',
      'EKSTERNAL_PPNS'
  )
  and not exists (
      select 1
      from tmp_bdb_external_satker_seed seed
      where seed.satker_key = s.satker_key
  );

update bdb_satker_master s
set satker_key = seed.satker_key
from tmp_bdb_external_satker_seed seed
where seed.legacy_key is not null
  and s.satker_key = seed.legacy_key
  and not exists (
      select 1
      from bdb_satker_master x
      where x.satker_key = seed.satker_key
        and x.id <> s.id
  );

delete from bdb_satker_master s
using tmp_bdb_external_satker_seed seed
where seed.legacy_key is not null
  and s.satker_key = seed.legacy_key
  and coalesce(s.payload_json->>'generated_by', '') = 'BDB_EXTERNAL_SATKER_SEED'
  and exists (
      select 1
      from bdb_satker_master x
      where x.satker_key = seed.satker_key
  );

update bdb_satker_master s
set
    domain = 'EKSTERNAL POLRI',
    sub_domain = 'EKSTERNAL NON POLRI',
    level = seed.level,
    nama_satker_canonical = seed.nama_satker_canonical,
    dors_satker_id = null,
    dors_kode = null,
    nama_satker_dors = seed.nama_satker_canonical,
    nama_parent_satker_dors = seed.parent_name,
    nama_grandparent_satker_dors = seed.grandparent_name,
    status = 'Aktif',
    payload_json = coalesce(s.payload_json, '{}'::jsonb) || jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now(),
        'source_polda_key', seed.source_polda_key,
        'source_polda_code', seed.source_polda_code,
        'source_polres_key', seed.source_polres_key,
        'source_polres_code', seed.source_polres_code,
        'legacy_key', seed.legacy_key
    ),
    updated_at = now(),
    parent_key = seed.parent_key,
    grandparent_key = seed.grandparent_key,
    full_path = seed.full_path,
    source_type = 'BDB',
    manual_code = seed.manual_code,
    operational_role = seed.operational_role,
    is_holding_node = seed.is_holding_node
from tmp_bdb_external_satker_seed seed
where s.satker_key = seed.satker_key;

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
    seed.level,
    seed.nama_satker_canonical,
    null,
    null,
    seed.nama_satker_canonical,
    seed.parent_name,
    seed.grandparent_name,
    'Aktif',
    jsonb_build_object(
        'generated_by', 'BDB_EXTERNAL_SATKER_SEED',
        'generated_at', now(),
        'source_polda_key', seed.source_polda_key,
        'source_polda_code', seed.source_polda_code,
        'source_polres_key', seed.source_polres_key,
        'source_polres_code', seed.source_polres_code,
        'legacy_key', seed.legacy_key
    ),
    now(),
    now(),
    seed.satker_key,
    seed.parent_key,
    seed.grandparent_key,
    seed.full_path,
    'BDB',
    seed.manual_code,
    seed.operational_role,
    seed.is_holding_node
from tmp_bdb_external_satker_seed seed
where not exists (
    select 1
    from bdb_satker_master s
    where s.satker_key = seed.satker_key
);

commit;
