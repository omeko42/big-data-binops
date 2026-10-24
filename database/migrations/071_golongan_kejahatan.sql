-- 071_golongan_kejahatan.sql
-- Master "Golongan Kejahatan" -- klasifikasi resmi 4 kode dari integrasi DORS
-- (bdb_dors_lp_kategori_gk.id_sub_golongan / payload_json->'kategori_gk'->>'id_sub_golongan'),
-- BUKAN "Golongan Kamtibmas"/"Sub-Golongan Kamtibmas" (cm_golongan_kamtibmas /
-- cm_sub_golongan_kamtibmas) yang taksonominya jauh lebih luas (ikut memuat Pelanggaran/
-- Gangguan/Bencana) dan sebelumnya keliru dipakai sbg pengganti "Golongan Kejahatan" di
-- layar Master Jenis Kejahatan. cm_sub_golongan_kamtibmas kebetulan sudah punya id 1-4 yg
-- persis sama isinya (ditambah id 5 "HAM" yg TIDAK termasuk 4 kode resmi ini) -- tabel baru
-- ini sengaja dipisah spy tidak lagi bercampur dgn cabang Pelanggaran/Gangguan/Bencana.
-- Idempotent, aman dijalankan ulang.

create table if not exists cm_golongan_kejahatan (
    id bigserial primary key,
    name varchar(255),
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp
);

insert into cm_golongan_kejahatan (id, name, created_at, updated_at) values
 (1, 'Kejahatan Konvensional', now(), now()),
 (2, 'Kejahatan Trans Nasional', now(), now()),
 (3, 'Kejahatan Terhadap Kekayaan Negara', now(), now()),
 (4, 'Kejahatan Berimplikasi Kontinjensi', now(), now())
on conflict (id) do nothing;
-- id 1-4 di atas diisi eksplisit (bigserial tak otomatis maju krn insert eksplisit) -- pastikan
-- baris BARU lewat form (tanpa id, spt cm_* lain) lanjut dari 5 dst, bukan bentrok/NULL.
select setval(pg_get_serial_sequence('cm_golongan_kejahatan', 'id'), greatest((select coalesce(max(id),0) from cm_golongan_kejahatan), 1));

-- cm_jenis_kejahatan: kolom klasifikasi baru + backfill dari kolom id_sub_golongan lama
-- (yg utk baris hasil import 037 sudah benar berisi 1-4; baris hasil auto-register DORS live
-- yg NULL akan diisi terpisah oleh autoRegisterMasterData() / linkMasterData()).
alter table cm_jenis_kejahatan add column if not exists "golonganKejahatanId" bigint references cm_golongan_kejahatan(id) on delete set null;
create index if not exists cm_jenis_kejahatan_golongan_kejahatan_idx on cm_jenis_kejahatan ("golonganKejahatanId");
update cm_jenis_kejahatan
   set "golonganKejahatanId" = id_sub_golongan
 where id_sub_golongan in (1,2,3,4)
   and "golonganKejahatanId" is null;

-- Pelengkap/koreksi: kolom id_sub_golongan lama kadang keliru dibanding traffic DORS sungguhan
-- (mis. "Penganiayaan Ringan"/"Pencurian Ringan"/dll di seed lama tercatat golongan 6/Pelanggaran,
-- padahal payload DORS asli mencatatnya id_sub_golongan=1/Kejahatan Konvensional). Cocokkan sisa
-- baris yg masih NULL ke bdb_dors_lp_kategori_gk lewat nama (keterangan) -- per nama, id_sub_golongan
-- di tabel itu sudah diverifikasi 100% konsisten/tak ambigu, jadi aman dipakai sbg rujukan otoritatif.
update cm_jenis_kejahatan jk
   set "golonganKejahatanId" = g.id_sub_golongan::bigint
  from (
      select distinct lower(trim(keterangan)) as keterangan_norm, id_sub_golongan
      from bdb_dors_lp_kategori_gk
      where keterangan is not null and id_sub_golongan in ('1','2','3','4')
  ) g
 where lower(trim(jk.keterangan)) = g.keterangan_norm
   and jk."golonganKejahatanId" is null;

-- bdb_laporan_polisi: link per-LP ke golongan kejahatan, sumber id_sub_golongan dari payload
-- DORS (payload_json->'kategori_gk'->>'id_sub_golongan') -- BELUM PERNAH dipakai sebelum ini
-- (lihat laporan-polisi.service.ts, linkMasterData() cuma isi jenis_kejahatan_id/kategori_lokasi_id/
-- motif_kejahatan_id/modus_operandi_id, tak pernah baca id_sub_golongan sama sekali).
alter table bdb_laporan_polisi add column if not exists golongan_kejahatan_id bigint references cm_golongan_kejahatan(id) on delete set null;
create index if not exists bdb_laporan_polisi_golongan_kejahatan_idx on bdb_laporan_polisi (golongan_kejahatan_id);
update bdb_laporan_polisi lp
   set golongan_kejahatan_id = nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::bigint
 where lp.golongan_kejahatan_id is null
   and nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','') ~ '^[0-9]+$'
   and nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::bigint in (1,2,3,4);
