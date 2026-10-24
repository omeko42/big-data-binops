-- Hapus akun admin operator otomatis (dibuat SatkerService.createAdminForSatker()) yang
-- scope_satker_id-nya menunjuk ke satker yang SUDAH TAK ADA -- ditemukan saat investigasi
-- laporan "prod 5.211 akun user orphan". Semuanya satu kejadian massal 2026-07-16 (kemungkinan
-- besar hasil stress-test/seed data, salah satunya literal bernama "Admin_SAT UJI ADMIN"
-- ["uji" = tes] yang "login"-nya persis di detik yang sama dgn created_at, ciri khas skrip
-- otomatis bukan manusia) -- satker tujuannya (banyak berpola "SPKT SEK X", unit di bawah
-- Polsek) belakangan dihapus dari tree, tapi akun admin yg dibuat otomatis bareng satker itu
-- tak ikut dibersihkan.
--
-- Filter SENGAJA dibuat presis meniru tanda tangan createAdminForSatker() sendiri (role_bdb
-- operator, email @bdb.local, login LOCAL dgn password lokal aktif) SUPAYA TIDAK PERNAH
-- menyentuh akun asli manapun -- kalaupun scope_satker_id kebetulan orphan krn sebab lain di
-- masa depan tapi akunnya BUKAN pola auto-generated ini, migration ini tidak akan menyentuhnya.
--
-- Verifikasi sebelum ditulis (lihat investigasi): 5212/5212 cocok pola ini, cuma 1 yang pernah
-- "login" (auto, bukan manusia), cuma 3 baris di audit log (semua dari kejadian yg sama). Lokal
-- 0 yang muncul sbg auth_users.id di bdb_lp_pelimpahan.dilimpahkan_oleh (SATU-SATUNYA FK ke
-- auth_users yg TAK punya ON DELETE SET NULL, cek information_schema langsung) -- TAPI prod
-- datanya bisa beda dari lokal (sudah pernah kejadian sesi ini), jadi JANGAN andalkan angka 0 di
-- lokal sbg jaminan. Migration ini WAJIB lepaskan referensi itu (set null) SEBELUM delete,
-- bukan cuma berharap tak ada yg nyangkut -- kalau tetap dibiarkan & ternyata ada satu saja di
-- prod, DELETE bakal gagal dgn FK violation = boot API gagal total (lihat run-pending-migrations.ts:
-- migration gagal = throw = boot tak jalan sama sekali, bukan cuma migration ini yg dilewati).
--
-- Idempotent: begitu baris orphan-nya sudah bersih, jalan lagi tidak menemukan apa-apa lagi.
do $$
declare
    v_released int;
    v_deleted int;
begin
    -- Lepaskan dulu SEMUA referensi dilimpahkan_oleh yg kebetulan menunjuk ke salah satu akun
    -- ghost ini -- akun ghost ini tak pernah benar2 dipakai (lihat investigasi), jadi field
    -- "siapa yg melimpahkan" di riwayat pelimpahan itu sendiri sudah tak bermakna kalau memang
    -- terisi oleh salah satu dari akun-akun ini; aman di-null-kan, bukan dipertahankan paksa.
    update bdb_lp_pelimpahan p
    set dilimpahkan_oleh = null
    where p.dilimpahkan_oleh in (
        select u.id from auth_users u
        where u.role_bdb = 'operator'
          and u.login_method = 'LOCAL'
          and u.local_password_enabled = true
          and u.email like '%@bdb.local'
          and u.scope_satker_id is not null
          and not exists (select 1 from bdb_satker s where s.id = u.scope_satker_id)
    );
    get diagnostics v_released = row_count;
    if v_released > 0 then
        raise notice 'bdb_lp_pelimpahan.dilimpahkan_oleh dilepas dulu (menunjuk ke akun ghost): %', v_released;
    end if;

    delete from auth_users u
    where u.role_bdb = 'operator'
      and u.login_method = 'LOCAL'
      and u.local_password_enabled = true
      and u.email like '%@bdb.local'
      and u.scope_satker_id is not null
      and not exists (select 1 from bdb_satker s where s.id = u.scope_satker_id);
    get diagnostics v_deleted = row_count;
    raise notice 'Akun admin operator ghost (satker tujuan sudah tak ada) dihapus: %', v_deleted;
end $$;
