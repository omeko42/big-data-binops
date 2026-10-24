-- Perbaiki sequence id/code yg "ketinggalan" dari max(id) yang sesungguhnya di tabel master cm_*.
--
-- Root cause: data master cm_* diisi lewat impor literal (INSERT dgn id eksplisit dari sumber data
-- lama), yang tidak pernah memanggil setval() utk menyamakan sequence auto-increment dgn id
-- tertinggi yg sudah dipakai. Akibatnya nextval() bisa mengembalikan id yg SUDAH ADA di tabel,
-- menyebabkan error "duplicate key value violates unique constraint" scr acak/intermiten saat
-- tambah data baru (ditemukan scr empiris saat verifikasi fitur Import Massal Jenis Kejahatan:
-- cm_jenis_kejahatan sequence=742 tapi max(id)=761).
--
-- Perbaikan generik & aman dijalankan berkali-kali (idempotent): scan SEMUA kolom bertipe
-- serial/identity di tabel cm_*, lalu setval sequence-nya ke max(kolom) kalau ternyata sequence
-- lebih kecil dari data yg sudah ada. Tidak menyentuh tabel yg sequence-nya sudah benar.
do $$
declare
    r record;
    seq text;
    seqval bigint;
    maxval bigint;
begin
    for r in
        select c.table_name, c.column_name
        from information_schema.columns c
        where c.table_schema = 'public'
          and c.table_name like 'cm\_%'
          and c.column_default like 'nextval%'
    loop
        seq := pg_get_serial_sequence('public.' || r.table_name, r.column_name);
        if seq is not null then
            execute format('select last_value from %s', seq) into seqval;
            execute format('select coalesce(max(%I), 0) from %I', r.column_name, r.table_name) into maxval;
            if maxval > seqval then
                execute format('select setval(%L, %s)', seq, maxval);
                raise notice 'Sequence % disetel ulang: % -> %', seq, seqval, maxval;
            end if;
        end if;
    end loop;
end $$;
