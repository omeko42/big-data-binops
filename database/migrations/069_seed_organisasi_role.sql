-- 069_seed_organisasi_role.sql
-- Seed master data tm_org_level/tm_org/tm_org_closure/tm_org_role -- hilang di prod karena
-- baris ini dulu dibuat manual lewat UI pas development awal, bukan lewat migration/seed
-- apapun (beda dgn cm_* di 037/038 yg sudah ada generator). Akibatnya menu "Organisasi Role"
-- (Pengaturan Sistem) kosong total di prod meski fresh-install lokal sudah punya isinya.
-- Idempotent (ON CONFLICT DO NOTHING), aman dijalankan ulang.

-- tm_org_level: 2 baris
insert into "tm_org_level" ("id", "level_name", "parent_id", "path", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at") values
 (1, 'administrator', NULL, '/1', NULL, NULL, NULL, now(), now(), NULL),
 (2, 'mabes', NULL, '/1/2', NULL, NULL, NULL, now(), now(), NULL)
on conflict ("id") do nothing;
do $$ declare seq text; begin seq := pg_get_serial_sequence('tm_org_level', 'id'); if seq is not null then perform setval(seq, greatest((select coalesce(max("id"),0) from "tm_org_level"), 1)); end if; end $$;

-- tm_org: 1 baris (organisasi tunggal aplikasi BDB)
insert into "tm_org" ("id", "name", "path", "parent_id", "jumlah_penduduk", "organisasiLevelId", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at") values
 (1, 'BDB Superadmin', '/1', NULL, NULL, 1, NULL, NULL, NULL, now(), now(), NULL)
on conflict ("id") do nothing;
do $$ declare seq text; begin seq := pg_get_serial_sequence('tm_org', 'id'); if seq is not null then perform setval(seq, greatest((select coalesce(max("id"),0) from "tm_org"), 1)); end if; end $$;

-- tm_org_closure: self-reference wajib untuk TypeORM @Tree('closure-table')
insert into "tm_org_closure" ("id_ancestor", "id_descendant") values
 (1, 1)
on conflict do nothing;

-- tm_org_role: 4 baris (role dasar aplikasi BDB)
insert into "tm_org_role" ("id", "role_name", "invitation_code", "invitation_url", "temporary_invitation_code", "organisasiId", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at") values
 (1, 'superadmin', NULL, NULL, NULL, 1, NULL, NULL, NULL, now(), now(), NULL),
 (2, 'admin_binops', NULL, NULL, NULL, 1, NULL, NULL, NULL, now(), now(), NULL),
 (3, 'operator', NULL, NULL, NULL, 1, NULL, NULL, NULL, now(), now(), NULL),
 (4, 'viewer', NULL, NULL, NULL, 1, NULL, NULL, NULL, now(), now(), NULL)
on conflict ("id") do nothing;
do $$ declare seq text; begin seq := pg_get_serial_sequence('tm_org_role', 'id'); if seq is not null then perform setval(seq, greatest((select coalesce(max("id"),0) from "tm_org_role"), 1)); end if; end $$;
