-- Install BDB satker auto-child triggers and backfill existing DORS rows.
-- Run this after bdb_satker_master and related columns already exist.

begin;

create or replace function bdb_auto_create_satker_children()
returns trigger
language plpgsql
as $$
begin
  if coalesce(new.source_type, '') <> 'DORS' then
    return new;
  end if;

  if coalesce(new.status, '') in ('ARSIP_DUP_PARENT','ARSIP_TEST','Nonaktif') then
    return new;
  end if;

  -- POLDA baru -> SPKT POLDA
  if new.level = 'Polda' and new.dors_kode <> '060.01' then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI',
      'INTERNAL RESERSE',
      'Unit',
      'SPKT ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode),
      now(),
      now(),
      'BDB:' || new.dors_kode || '.BDB-SPKT',
      new.satker_key,
      null,
      new.nama_satker_canonical || ' > SPKT ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-SPKT',
      'SPKT_POLDA',
      true,
      new.nama_satker_canonical,
      null
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SPKT'
    );
  end if;

  -- POLRES baru -> SPKT POLRES
  if new.level = 'Polres' then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI',
      'INTERNAL RESERSE',
      'Unit',
      'SPKT ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode),
      now(),
      now(),
      'BDB:' || new.dors_kode || '.BDB-SPKT',
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > SPKT ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-SPKT',
      'SPKT_POLRES',
      true,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SPKT'
    );
  end if;

  -- POLSEK baru -> SPKT, BINOPS, UNITLANTAS, UNITSAMAPTA
  if new.level = 'Polsek' then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI',
      v.sub_domain,
      'Unit',
      v.nama_prefix || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode),
      now(),
      now(),
      'BDB:' || new.dors_kode || '.BDB-' || v.kode,
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > ' || v.nama_prefix || ' ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-' || v.kode,
      v.role,
      true,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    from (
      values
        ('SPKT', 'SPKT', 'SPKT', 'INTERNAL RESERSE'),
        ('BINOPS', 'BINOPS', 'BINOPS', 'INTERNAL RESERSE'),
        ('UNITLANTAS', 'UNITLANTAS', 'UNITLANTAS', 'EKSTERNAL RESERSE'),
        ('UNITSAMAPTA', 'UNITSAMAPTA', 'UNITSAMAPTA', 'EKSTERNAL RESERSE')
    ) as v(kode, nama_prefix, role, sub_domain)
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-' || v.kode
    );
  end if;

  -- UNIT RESKRIM POLSEK baru -> SUBNIT 1-5
  if upper(coalesce(new.operational_role, '')) = 'UNITRES' then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI',
      'INTERNAL RESERSE',
      'Subnit',
      'SUBNIT ' || n || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'subnit_no',n),
      now(),
      now(),
      'BDB:' || new.dors_kode || '.BDB-SUBNIT-' || n,
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > SUBNIT ' || n || ' ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-SUBNIT-' || n,
      'SUBNIT',
      false,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    from generate_series(1,5) n
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SUBNIT-' || n
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_bdb_auto_create_satker_children on bdb_satker_master;

create trigger trg_bdb_auto_create_satker_children
after insert or update of source_type, status, level, operational_role, dors_kode, satker_key, parent_key, grandparent_key, nama_satker_canonical
on bdb_satker_master
for each row
execute function bdb_auto_create_satker_children();

create or replace function bdb_auto_create_big_satker_children()
returns trigger
language plpgsql
as $$
begin
  if coalesce(new.source_type, '') <> 'DORS' then
    return new;
  end if;

  if coalesce(new.status, '') in ('ARSIP_DUP_PARENT','ARSIP_TEST','Nonaktif') then
    return new;
  end if;

  -- SATRES baru -> URBINOPS + UNIT 1-5 + SUBNIT 1-5 per UNIT
  if upper(coalesce(new.operational_role, '')) = 'SATRES' then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Unit',
      'URBINOPS ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-URBINOPS',
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > URBINOPS ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-URBINOPS',
      'URBINOPS',
      true,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-URBINOPS'
    );

    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Unit',
      'UNIT ' || u || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'unit_no',u),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-UNIT-' || u,
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > UNIT ' || u || ' ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-UNIT-' || u,
      'UNIT_SATRES',
      false,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    from generate_series(1,5) u
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-UNIT-' || u
    );

    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Subnit',
      'SUBNIT ' || n || ' UNIT ' || u || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'unit_no',u,'subnit_no',n),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n,
      'BDB:' || new.dors_kode || '.BDB-UNIT-' || u,
      new.satker_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > UNIT ' || u || ' ' || new.nama_satker_canonical || ' > SUBNIT ' || n,
      'BDB',
      new.dors_kode || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n,
      'SUBNIT_SATRES',
      false,
      'UNIT ' || u || ' ' || new.nama_satker_canonical,
      new.nama_satker_canonical
    from generate_series(1,5) u
    cross join generate_series(1,5) n
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n
    );
  end if;

  -- DITRES / DITTIPID baru -> BINOPS + SUBDIT + UNIT + SUBNIT
  if upper(coalesce(new.operational_role, '')) in ('DITRES','DITTIPID') then
    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Unit',
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'SUBBAGBINOPS ' || new.nama_satker_canonical
        else 'BAGBINOPS ' || new.nama_satker_canonical
      end,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode),
      now(), now(),
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'BDB:' || new.dors_kode || '.BDB-SUBBAGBINOPS'
        else 'BDB:' || new.dors_kode || '.BDB-BAGBINOPS'
      end,
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > BINOPS',
      'BDB',
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then new.dors_kode || '.BDB-SUBBAGBINOPS'
        else new.dors_kode || '.BDB-BAGBINOPS'
      end,
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'SUBBAGBINOPS_DITTIPID'
        else 'BAGBINOPS_DITRES'
      end,
      true,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key =
        case
          when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
            then 'BDB:' || new.dors_kode || '.BDB-SUBBAGBINOPS'
          else 'BDB:' || new.dors_kode || '.BDB-BAGBINOPS'
        end
    );

    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Subdit',
      'SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'subdit_no',s),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s,
      new.satker_key,
      new.parent_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      'BDB',
      new.dors_kode || '.BDB-SUBDIT-' || s,
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'SUBDIT_DITTIPID'
        else 'SUBDIT_DITRES'
      end,
      false,
      new.nama_satker_canonical,
      nullif(new.nama_parent_satker_dors, '')
    from generate_series(1,5) s
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s
    );

    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Unit',
      'UNIT ' || u || ' SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'subdit_no',s,'unit_no',u),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u,
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s,
      new.satker_key,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > SUBDIT ' || s || ' > UNIT ' || u,
      'BDB',
      new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u,
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'UNIT_DITTIPID'
        else 'UNIT_DITRES'
      end,
      false,
      'SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      new.nama_satker_canonical
    from generate_series(1,5) s
    cross join generate_series(1,5) u
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u
    );

    insert into bdb_satker_master (
      domain, sub_domain, level, nama_satker_canonical,
      status, payload_json, created_at, updated_at,
      satker_key, parent_key, grandparent_key, full_path,
      source_type, manual_code, operational_role, is_holding_node,
      nama_parent_satker_dors, nama_grandparent_satker_dors
    )
    select
      'INTERNAL POLRI', 'INTERNAL RESERSE', 'Subnit',
      'SUBNIT ' || n || ' UNIT ' || u || ' SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      'Aktif',
      jsonb_build_object('generated_by','BDB_AUTO_BIG_TRIGGER','base_satker_key',new.satker_key,'base_dors_kode',new.dors_kode,'subdit_no',s,'unit_no',u,'subnit_no',n),
      now(), now(),
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n,
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u,
      'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s,
      coalesce(new.full_path, new.nama_satker_canonical) || ' > SUBDIT ' || s || ' > UNIT ' || u || ' > SUBNIT ' || n,
      'BDB',
      new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n,
      case
        when upper(coalesce(new.operational_role, '')) = 'DITTIPID'
          then 'SUBNIT_DITTIPID'
        else 'SUBNIT_DITRES'
      end,
      false,
      'UNIT ' || u || ' SUBDIT ' || s || ' ' || new.nama_satker_canonical,
      'SUBDIT ' || s || ' ' || new.nama_satker_canonical
    from generate_series(1,5) s
    cross join generate_series(1,5) u
    cross join generate_series(1,5) n
    where not exists (
      select 1 from bdb_satker_master x
      where x.satker_key = 'BDB:' || new.dors_kode || '.BDB-SUBDIT-' || s || '.BDB-UNIT-' || u || '.BDB-SUBNIT-' || n
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_bdb_auto_create_big_satker_children on bdb_satker_master;

create trigger trg_bdb_auto_create_big_satker_children
after insert or update of source_type, status, level, operational_role, dors_kode, satker_key, parent_key, grandparent_key, nama_satker_canonical
on bdb_satker_master
for each row
execute function bdb_auto_create_big_satker_children();

-- Backfill existing imported DORS rows so the triggers generate BDB child nodes.
-- The update includes trigger columns on purpose; PostgreSQL fires the AFTER UPDATE triggers even if values stay the same.
with candidates as (
  select
    id,
    upper(concat_ws(' ', nama_satker_canonical, nama_satker_dors)) as role_text,
    upper(coalesce(nama_parent_satker_dors, '')) as parent_text,
    upper(coalesce(parent_key, '')) as parent_key_text
  from bdb_satker_master
  where dors_kode is not null
    and coalesce(satker_key, '') not like 'BDB:%'
    and coalesce(nullif(source_type, ''), 'DORS') = 'DORS'
    and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
)
update bdb_satker_master s
set
  source_type = 'DORS',
  status = coalesce(nullif(s.status, ''), 'Aktif'),
  operational_role = coalesce(
    nullif(s.operational_role, ''),
    case
      when c.role_text like '%DENSUS 88%' then 'DENSUS88'
      when c.role_text like '%KORTASTIPIDKOR%' then 'KORTASTIPIDKOR'
      when c.role_text like '%KORPOLAIR%' then 'KORPOLAIR'
      when c.role_text like '%DITTIPID%' then 'DITTIPID'
      when c.role_text like '%DITRES%' then 'DITRES'
      when c.role_text like '%SATRES%' or c.role_text like '%SAT RES%' then 'SATRES'
      when c.role_text like '%DITLANTAS%' then 'DITLANTAS'
      when c.role_text like '%SATLANTAS%' then 'SATLANTAS'
      when c.role_text like '%DITPOLAIR%' then 'DITPOLAIR'
      when c.role_text like '%SATPOLAIR%' then 'SATPOLAIR'
      when c.role_text like '%SATSAMAPTA%' or c.role_text like '%SATSABHARA%' then 'SATSAMAPTA'
      when s.level = 'Unit' and c.role_text like '%RESKRIM%' and (c.parent_text like '%POLSEK%' or c.parent_key_text like '%:POLSEK:%') then 'UNITRES'
      else null
    end
  ),
  updated_at = s.updated_at
from candidates c
where s.id = c.id;

commit;

-- Quick check:
-- select payload_json->>'generated_by' as generated_by, count(*) from bdb_satker_master where satker_key like 'BDB:%' group by 1 order by 1;
