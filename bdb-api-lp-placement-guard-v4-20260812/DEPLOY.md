# Deploy guard penempatan LP V4 (2026-08-12)

Paket ini meneruskan seluruh hotfix effective-owner V3 yang sudah aktif dan menutup jalur LP
baru yang berhenti pada parent Polda/Polres/Polsek walaupun unit DORS terbaca.

Pengaman V4:

- target wajib tepat satu anak langsung dari parent;
- `unit_satker_id` wajib masih kosong; kamar existing tidak ditimpa;
- LP berflag `sudah_dilimpahkan`, `dilimpahkan_eksternal`, atau mempunyai histori pada
  `bdb_lp_pelimpahan` tidak disentuh;
- Polsek hanya otomatis untuk LP baru mulai ID `404912`;
- backlog lama tidak berubah ketika kode dideploy;
- konfigurasi menambahkan `RESKRIM -> RESKRIM` untuk `UNIT RESKRIM POLSEK`.

## 1. Upload dari komputer lokal

```bash
scp "/d/Prototype CAS/EDIT MASTER MASAL/bdb-api-lp-placement-guard-v4-20260812.tar.gz" \
  clouduser@10.0.0.x:/home/clouduser/
```

## 2. Verifikasi dan build kandidat di BE 10.0.0.x

```bash
sha256sum /home/clouduser/bdb-api-lp-placement-guard-v4-20260812.tar.gz

mkdir -p /home/clouduser/bdb-api-lp-placement-guard-v4-build-20260812
tar -xzf /home/clouduser/bdb-api-lp-placement-guard-v4-20260812.tar.gz \
  -C /home/clouduser/bdb-api-lp-placement-guard-v4-build-20260812

cd /home/clouduser/bdb-api-lp-placement-guard-v4-build-20260812

sudo docker build --network=none --no-cache \
  -f Dockerfile.lp-effective-owner-fix \
  -t bdb-api:20260812-lp-placement-guard-v4 .
```

Jangan deploy apabila test atau `npm run build` gagal.

## 3. Backup runtime aktif dan ekstrak kandidat

```bash
DEPLOY_DIR=/home/clouduser/bdb-api-deploy-lp-placement-v4-20260812

mkdir -p "$DEPLOY_DIR/before-dist" "$DEPLOY_DIR/patched-dist"
mkdir -p "$DEPLOY_DIR/before-config" "$DEPLOY_DIR/patched-config"

sudo docker inspect bdb-api > "$DEPLOY_DIR/bdb-api-inspect-before.json"

sudo docker tag \
  bdb-api:20260805-193904 \
  bdb-api:20260805-193904-before-lp-placement-v4

sudo docker cp bdb-api:/usr/src/app/dist/. "$DEPLOY_DIR/before-dist/"
sudo docker cp bdb-api:/usr/src/app/config/dors-unit-mapping.json \
  "$DEPLOY_DIR/before-config/dors-unit-mapping.json"

sudo docker create --name bdb-api-lp-placement-v4-artifact-20260812 \
  bdb-api:20260812-lp-placement-guard-v4

sudo docker cp bdb-api-lp-placement-v4-artifact-20260812:/usr/src/app/dist/. \
  "$DEPLOY_DIR/patched-dist/"
sudo docker cp bdb-api-lp-placement-v4-artifact-20260812:/usr/src/app/config/dors-unit-mapping.json \
  "$DEPLOY_DIR/patched-config/dors-unit-mapping.json"

sudo docker rm bdb-api-lp-placement-v4-artifact-20260812

du -sh "$DEPLOY_DIR/before-dist" "$DEPLOY_DIR/patched-dist"
sha256sum "$DEPLOY_DIR/before-config/dors-unit-mapping.json"
sha256sum "$DEPLOY_DIR/patched-config/dors-unit-mapping.json"
```

Jangan lanjut bila folder backup/kandidat kosong.

## 4. Deploy runtime

```bash
sudo docker cp "$DEPLOY_DIR/patched-dist/." bdb-api:/usr/src/app/dist/
sudo docker cp "$DEPLOY_DIR/patched-config/dors-unit-mapping.json" \
  bdb-api:/usr/src/app/config/dors-unit-mapping.json

sudo docker restart bdb-api

for i in $(seq 1 30); do
  if curl -fsS --max-time 3 http://127.0.0.1:3850/api/network/ping; then
    echo
    echo 'API SEHAT'
    break
  fi
  sleep 1
done

sudo docker ps --filter name=bdb-api \
  --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

sudo docker logs --since 5m --tail 200 bdb-api
```

Jangan jalankan patch apply database pada tahap ini.

## 5. Uji penerimaan

- Buat/tarik satu LP baru Polsek yang unit DORS-nya `RESKRIM`.
- LP harus mempunyai `satker_id` parent Polsek dan `unit_satker_id` anak `UNIT RESKRIM POLSEK`.
- LP baru Polda/Polres dengan unit yang dikenali tetap masuk anak DIT/SAT yang tepat.
- LP dengan tujuan ambigu tetap dibiarkan kosong; tidak boleh dipilih secara acak.
- LP yang pernah dilimpahkan tidak boleh diisi kembali ke unit lama.
- Akun parent tidak boleh melihat LP yang sudah mempunyai pemilik unit efektif.

Setelah uji lulus:

```bash
sudo docker tag \
  bdb-api:20260812-lp-placement-guard-v4 \
  bdb-api:20260805-193904
```

## 6. Rollback runtime

```bash
DEPLOY_DIR=/home/clouduser/bdb-api-deploy-lp-placement-v4-20260812

sudo docker cp "$DEPLOY_DIR/before-dist/." bdb-api:/usr/src/app/dist/
sudo docker cp "$DEPLOY_DIR/before-config/dors-unit-mapping.json" \
  bdb-api:/usr/src/app/config/dors-unit-mapping.json

sudo docker restart bdb-api

sudo docker tag \
  bdb-api:20260805-193904-before-lp-placement-v4 \
  bdb-api:20260805-193904

curl -fsS --max-time 10 http://127.0.0.1:3850/api/network/ping
```

Rollback V4 hanya mengembalikan kode dan konfigurasi. Paket V4 tidak mengubah backlog database.
