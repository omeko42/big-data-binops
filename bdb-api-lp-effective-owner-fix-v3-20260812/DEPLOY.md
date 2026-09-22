# Deploy patch pemilik efektif LP v3

Patch ini menghentikan akun scope parent Polres/Polda dari menarik LP yang sudah mempunyai
`unit_satker_id`. Pemilik akses efektif ditentukan dengan urutan:

1. `unit_satker_id` bila terisi;
2. `satker_id` hanya bila `unit_satker_id` kosong.

Versi v3 juga menambahkan single-flight dan advisory transaction lock untuk `ensureTable()`.
Pengaman ini mencegah request list/stats/cron mengeksekusi DDL trigger LP secara paralel dan
memicu PostgreSQL `tuple concurrently updated`. Error handler QueryFailedError juga dibuat aman
ketika query tidak mempunyai parameter, sehingga pesan database asli tidak lagi tertutup error
sekunder `Cannot read properties of undefined (reading 'join')`.

Versi v3 memperbaiki jalur `linkMasterData()` agar memanggil `ensureTable()` yang sudah terkunci,
bukan memanggil helper DDL tanpa `QueryRunner`. Perubahan ini menutup kegagalan compile pada
kandidat v2 sekaligus memastikan semua DDL LP melewati pengaman concurrency yang sama.

## 1. Upload dan build kandidat

Jalankan dari komputer lokal:

```bash
scp "/d/Prototype CAS/EDIT MASTER MASAL/bdb-api-lp-effective-owner-fix-v3-20260812.tar.gz" clouduser@10.0.0.x:/home/clouduser/
```

Lalu di server backend `10.0.0.x`:

```bash
sha256sum /home/clouduser/bdb-api-lp-effective-owner-fix-v3-20260812.tar.gz

mkdir -p /home/clouduser/bdb-api-lp-effective-owner-fix-v3-20260812
tar -xzf /home/clouduser/bdb-api-lp-effective-owner-fix-v3-20260812.tar.gz \
  -C /home/clouduser/bdb-api-lp-effective-owner-fix-v3-20260812

cd /home/clouduser/bdb-api-lp-effective-owner-fix-v3-20260812

sudo docker build --network=none --no-cache \
  -f Dockerfile.lp-effective-owner-fix \
  -t bdb-api:20260812-lp-effective-owner-fix-v3 .
```

Build hanya boleh dilanjutkan ke production bila unit test dan `npm run build` selesai tanpa error.

## 2. Backup runtime sebelum deploy

```bash
cd /home/clouduser

mkdir -p /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/before-dist
mkdir -p /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/patched-dist

sudo docker inspect bdb-api \
  > /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/bdb-api-inspect-before.json

sudo docker tag \
  bdb-api:20260805-193904 \
  bdb-api:20260805-193904-before-lp-owner-fix-v3

sudo docker cp \
  bdb-api:/usr/src/app/dist/. \
  /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/before-dist/

sudo docker create \
  --name bdb-api-lp-owner-artifact-v3-20260812 \
  bdb-api:20260812-lp-effective-owner-fix-v3

sudo docker cp \
  bdb-api-lp-owner-artifact-v3-20260812:/usr/src/app/dist/. \
  /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/patched-dist/

sudo docker rm bdb-api-lp-owner-artifact-v3-20260812

du -sh /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/before-dist
du -sh /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/patched-dist
```

Jangan lanjut bila salah satu folder `dist` kosong atau ukuran keduanya berbeda jauh tanpa alasan.

## 3. Deploy runtime

```bash
sudo docker cp \
  /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/patched-dist/. \
  bdb-api:/usr/src/app/dist/

sudo docker restart bdb-api

sudo docker ps --filter name=bdb-api \
  --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

curl -fsS --max-time 10 http://127.0.0.1:3850/api/network/ping

sudo docker logs --since 3m --tail 180 bdb-api
```

## 4. Uji penerimaan

- Impersonasi akun parent `Admin_POLRES CIANJUR`: LP milik SAT NARKOBA, SAT LANTAS, atau
  SAT RESKRIM tidak boleh muncul lagi.
- Buka URL detail salah satu LP unit memakai akun parent: harus tampil "LP tidak ditemukan"
  atau akses ditolak.
- Impersonasi operator `SAT NARKOBA RES CIANJUR`: LP Narkoba tetap tampil dan detail bisa dibuka.
- Coba aksi ringan pada LP unit, misalnya membuka tab pihak terkait/barang bukti dan modal
  tingkat kesulitan. Akses unit harus tetap normal.
- Superadmin tetap dapat melihat seluruh LP.
- LP lama yang `unit_satker_id`-nya kosong tetap dapat dilihat oleh akun pada `satker_id`-nya.

Setelah seluruh uji lulus:

```bash
sudo docker tag \
  bdb-api:20260812-lp-effective-owner-fix-v3 \
  bdb-api:20260805-193904
```

## 5. Rollback

```bash
sudo docker cp \
  /home/clouduser/bdb-api-deploy-lp-owner-v3-20260812/before-dist/. \
  bdb-api:/usr/src/app/dist/

sudo docker restart bdb-api

sudo docker tag \
  bdb-api:20260805-193904-before-lp-owner-fix-v3 \
  bdb-api:20260805-193904

curl -fsS --max-time 10 http://127.0.0.1:3850/api/network/ping
```

Rollback runtime tidak mengubah data PostgreSQL karena patch ini hanya mengubah aturan akses.
