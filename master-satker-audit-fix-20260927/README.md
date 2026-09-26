# Audit Komprehensif Master Satker & Perbaikan Akar Masalah (2026-09-27)

## Ringkasan Eksekusi
Audit menyeluruh terhadap master satker (`bdb_satker`) pada sistem CAS (*Crime Analytic System*) yang menghubungkan seluruh modul data, laporan kinerja perkara, manajemen laporan polisi, integrasi DORS, serta isolasi akses RBAC pengguna.

---

## 1. Peta Keterhubungan Master Satker (Di Mana Saja Nyambungnya)

1. **`bdb_laporan_polisi`** (1.743.258 LP aktif):
   - `satker_id`: Satker kewilayahan pemegang perkara.
   - `unit_satker_id`: Satuan kerja fungsional penangan perkara (Satreskrim, Unit PPA, Satresnarkoba, Polairud).
   - `kode_pusiknas`: Kode hierarkis Puskarda untuk validasi nomor LP.
2. **`bdb_kinerja_perkara_snapshot`** (1.256.439 snapshot perkara):
   - `satker_id`: Basis agregasi metrik kejahatan yang ter-rollup hierarkis ke atas pohon: `Polsek -> Polres -> Polda -> Mabes Polri`.
3. **`auth_users`** (3.212 pengguna aktif):
   - `scope_satker_id` & `scope_satker_key`: Menentukan batas teritorial dan fungsi akun pengguna via `resolveScope()`.
4. **`bdb_dors_raw_lp` & `bdb_dors_satker_map`** (5.519 alias mapping):
   - Mesin sinkronisasi DORS memetakan data mentah ke node satker menggunakan `child_kp`, `child_dkode`, alias, dan verifikasi induk.
5. **`bdb_satker_taxonomy_r11`** (View Taksonomi):
   - Mengelompokkan `function_domain` (*INTERNAL_RESERSE, STRUCTURAL, EKSTERNAL_RESERSE*) dan `organization_domain` (*INTERNAL_POLRI, EKSTERNAL_POLRI*).
6. **`bdb_lp_pelimpahan`**:
   - Pencatatan mutasi perkara antar-satker (`satker_asal_id` dan `satker_tujuan_id`).
7. **`bdb_kasus_atensi` & `bdb_kasus_menonjol`**:
   - Menghubungkan perkara atensi pimpinan ke satker penanggung jawab.

---

## 2. Hasil Audit & Perbaikan 5 Anomali / Bug

| No | Anomali | Kondisi Sebelum | Kondisi Sesudah (Live) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Hierarki Induk Polsek** | ID 18314 (`POLSEK KAWASAN PELABUHAN`, `060.01.33.06.05`) berinduk ke `POLDA PAPUA BARAT` (satu-satunya Polsek bukan berinduk Polres di Indonesia). | Ditambahkan override `060.01.33.06.05 -> 060.01.36.101` (`POLRESTA SORONG KOTA`) dan ditandai `[DUPLIKAT NONAKTIF]`. | **0 Anomali** (100% Polsek berinduk Polres) |
| **2** | **Duplikat `dors_kode`** | 3 pasang satker aktif vs nonaktif memiliki `dors_kode` sama (Muratara `060.08.41`, Bumi Waras `060.09.21.03`, Magelang `060.14.38`). | `dors_kode` pada node nonaktif dikosongkan (`null`) dan deskripsi ditandai `[DUPLIKAT NONAKTIF]`. | **0 Duplikat** |
| **3** | **Missing `dors_kode` Polda** | `POLDA DIY` (ID 9155) dan `POLDA KEP. BABEL` (ID 3575) memiliki `dors_kode = null`. | Diisi `060.15` (DIY) dan `060.10` (Babel) sesuai data historis DORS Stamaops. | **0 Missing** (36/36 Polda lengkap) |
| **4** | **Inkonsistensi User Scope** | 10 akun pengguna di `auth_users` memiliki `scope_satker_key` yang tidak sinkron dengan `bdb_satker.kode`. | Disinkronkan otomatis antara `auth_users.scope_satker_key` dengan `bdb_satker.kode`. | **0 Mismatch** (3.212/3.212 akun sinkron) |
| **5** | **Potensi Blank Kinerja Perkara** | `KinerjaPerkaraService.getSatkerTree()` menggunakan `INNER JOIN` ke view taksonomi R11 tanpa fallback. `create()` satker baru belum menyimpan kolom domain. | `getSatkerTree()` diubah menjadi `LEFT JOIN` dengan fallback default, dan `create()` otomatis mengisi `function_domain` dan `organization_domain`. | **Resilien & Terlindungi** |

---

## 3. Verifikasi & Deployment

- **Backend Build**: `nest build` sukses tanpa error pada container `bdb-api`.
- **Health Check**: Endpoint API merespons `HTTP 200 OK`.
- **Integritas Metrik**:
  - Total LP Aktif di CAS: **1.743.258 LP**
  - LP Belum Termapping DORS: **0 LP**
  - Snapshot Kinerja Perkara: **1.256.439 baris** (Terhubung dan tersinkronisasi)
