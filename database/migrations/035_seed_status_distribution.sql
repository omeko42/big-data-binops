-- Seed DEV: sebar status LP (bdb_laporan_polisi) agar Anev CT/CC bervariasi.
-- Funnel realistis: banyak yang sedang ditangani (CT), sebagian selesai (CC).
-- REVERSIBLE: status asli disnapshot ke bdb_lp_status_backup (revert di 035_revert...).
-- Deterministik via setseed. Aman dijalankan ulang (backup hanya diisi sekali per id).

begin;

create table if not exists bdb_lp_status_backup (id bigint primary key, status_id bigint);
insert into bdb_lp_status_backup (id, status_id)
select id, status_id from bdb_laporan_polisi lp
where not exists (select 1 from bdb_lp_status_backup b where b.id = lp.id);

select setseed(0.42);

with pick as (
    select id, random() as r from bdb_laporan_polisi
),
code_of as (
    select id,
        case
            when r < 0.18 then 'LP'
            when r < 0.40 then 'PENYELIDIKAN'
            when r < 0.60 then 'PENYIDIKAN'
            when r < 0.66 then 'SPDP'
            when r < 0.74 then 'TAHAP_I'
            when r < 0.78 then 'P19'
            when r < 0.82 then 'P21'
            when r < 0.90 then 'SP3'
            when r < 0.94 then 'SP2_LIDIK'
            else 'TAHAP_II'
        end as code
    from pick
)
update bdb_laporan_polisi lp
set status_id = sm.id, updated_at = now()
from code_of c
join bdb_status_master sm on sm.code = c.code
where lp.id = c.id;

commit;
