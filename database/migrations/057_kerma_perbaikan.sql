-- 057_kerma_perbaikan.sql
-- Perbaikan modul Kerma (Kerja Sama):
--  1) gabung manfaat + keterangan -> catatan, lalu hapus kolom lama beserta kolom penandatangan
--     (tak lagi diperlukan di form).
--  2) master Jenis Naskah (dropdown, bukan input bebas) -- 8 nilai baku.
--  3) status disamakan ke AKTIF/NONAKTIF (kolom lama sempat divalidasi 'DIARSIPKAN' oleh backend
--     padahal frontend selalu kirim 'NONAKTIF' -- baris manapun yg kepalang 'DIARSIPKAN' dirapikan).

alter table bdb_kerma_master add column if not exists catatan text;
update bdb_kerma_master set catatan = nullif(trim(both E'\n' from
    coalesce(manfaat, '') || case when coalesce(manfaat, '') <> '' and coalesce(keterangan, '') <> '' then E'\n\n' else '' end || coalesce(keterangan, '')
), '')
where catatan is null and (coalesce(manfaat, '') <> '' or coalesce(keterangan, '') <> '');

alter table bdb_kerma_master drop column if exists penandatangan_nama;
alter table bdb_kerma_master drop column if exists penandatangan_jabatan;
alter table bdb_kerma_master drop column if exists manfaat;
alter table bdb_kerma_master drop column if exists keterangan;

update bdb_kerma_master set status = 'NONAKTIF' where upper(status) = 'DIARSIPKAN';

create table if not exists bdb_kerma_jenis_naskah (
    id bigserial primary key,
    nama text not null unique,
    urutan int not null default 0,
    created_at timestamptz not null default now()
);
insert into bdb_kerma_jenis_naskah (nama, urutan) values
    ('Nota Kesepahaman', 1),
    ('Perjanjian Kerja Sama', 2),
    ('Adendum Perjanjian Kerja Sama', 3),
    ('Pedoman Kerja', 4),
    ('Pedoman Kerja Bersama', 5),
    ('Peraturan Bersama', 6),
    ('Kesepakatan Bersama', 7),
    ('Keputusan Bersama', 8)
on conflict (nama) do nothing;

-- rapikan data lama (mis. "NOTA KESEPAHAMAN" semua kapital) ke penulisan baku di atas, spy langsung
-- cocok begitu jenis_naskah jadi dropdown (bukan input bebas lagi).
update bdb_kerma_master k set jenis_naskah = j.nama
from bdb_kerma_jenis_naskah j
where lower(k.jenis_naskah) = lower(j.nama) and k.jenis_naskah <> j.nama;
