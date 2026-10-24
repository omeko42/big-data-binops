-- DISABLED BY DESIGN.
-- File ini sengaja dibuat tidak melakukan perubahan data.
-- Reset user dev tidak disimpan sebagai migration/script agar tidak menjadi celah keamanan.

DO $$
BEGIN
  RAISE EXCEPTION 'Migration 005 dinonaktifkan. Jangan jalankan reset user dari file SQL.';
END $$;
