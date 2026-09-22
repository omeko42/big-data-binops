# Audit Residual LP Tanpa Kamar (Read Only)

Paket ini hanya mengklasifikasikan LP yang masih berada di parent POLSEK tetapi belum memiliki `unit_satker_id`.

Tidak ada `UPDATE`, `DELETE`, `INSERT` ke tabel produksi, atau pembuatan tabel permanen. Seluruh tabel kerja dibuat sebagai temporary table di dalam satu transaksi dan selalu ditutup dengan `ROLLBACK`.

## Tujuan

- `SAFE_EXPLICIT_ALIAS`: hanya satu kamar anak langsung yang cocok dan didukung alias eksplisit di `bdb_dors_satker_map`.
- `SAFE_UNIQUE_DIRECT_CHILD`: hanya satu kamar anak langsung yang cocok berdasarkan unit DORS yang dinormalisasi.
- `HOLD_*`: belum cukup bukti, master kamar tidak tersedia, target lebih dari satu, atau hubungan parent tidak aman.
- `EXCLUDE_PELIMPAHAN`: LP memiliki flag pelimpahan sehingga tidak boleh dipindahkan oleh koreksi kamar asal.

## Upload dari komputer lokal

```bash
scp "/d/Prototype CAS/EDIT MASTER MASAL/lp-residual-room-classification-readonly-20260813.tar.gz" \
  clouduser@10.0.0.x:/home/clouduser/
```

## Jalankan di server database 10.0.0.x

```bash
cd /home/clouduser
sha256sum lp-residual-room-classification-readonly-20260813.tar.gz
mkdir -p lp-residual-room-classification-readonly-20260813
tar -xzf lp-residual-room-classification-readonly-20260813.tar.gz \
  -C lp-residual-room-classification-readonly-20260813 \
  --strip-components=1
cd lp-residual-room-classification-readonly-20260813

sudo -u postgres psql -X -d big_data_binops \
  < sql/01_residual_room_classification_readonly.sql \
  2>&1 | tee /home/clouduser/60_lp_residual_room_classification_readonly.out
```

## Verifikasi cepat

Bagian akhir output wajib menampilkan:

- `safe_dengan_pelimpahan = 0`
- `safe_target_null = 0`
- `safe_target_bukan_anak_langsung = 0`
- `safe_target_lebih_dari_satu = 0`
- `AUDIT SELESAI - ROLLBACK; DATA PRODUKSI TIDAK BERUBAH.`

Jika salah satu guard bukan nol atau query berhenti karena timeout/lock, jangan lanjut ke patch data. Kirimkan file output untuk ditelaah.

## Ambil hasil ke komputer lokal

```bash
scp clouduser@10.0.0.x:/home/clouduser/60_lp_residual_room_classification_readonly.out \
  "/d/Prototype CAS/EDIT MASTER MASAL/"
```

Paket ini sengaja tidak menyediakan file apply. Hasil audit harus ditinjau dahulu sebelum dibuat batch koreksi berikutnya.
