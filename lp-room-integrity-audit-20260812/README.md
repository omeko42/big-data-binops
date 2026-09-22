# Audit integritas kamar LP DORS -> BDB

Paket ini hanya membaca data produksi. Seluruh tabel kerja dibuat sebagai tabel sementara
dan transaksi selalu ditutup dengan `ROLLBACK`.

Tujuan:

1. memeriksa contoh POLSEK SRANDAKAN/SANDEN, POLRES BANTUL, dan TELUK WONDAMA;
2. memisahkan LP yang kamarnya kosong, salah, atau memang belum mempunyai master kamar;
3. mendeteksi satu identitas DORS yang terhubung ke lebih dari satu master `bdb_satker`;
4. mendeteksi LP dan akun yang terpecah di antara master-master duplikat;
5. melindungi seluruh LP yang mempunyai flag/riwayat pelimpahan.

Catatan unit DORS:

- pada level POLRES, sumber lazimnya menulis `SATRESKRIM`;
- pada level POLSEK, sumber menulis `RESKRIM` dan target BDB yang dicari adalah
  `UNIT RESKRIM ...` sebagai anak langsung POLSEK tersebut;
- kecocokan nama saja tidak cukup: parent sumber dan parent target tetap harus sama,
  serta kandidat anak harus tepat satu.

Jalankan di server DB 10.0.0.x:

```bash
cd /home/clouduser/lp-room-integrity-audit-20260812

sudo -u postgres psql -X -d big_data_binops \
  < 01_target_examples_readonly.sql \
  2>&1 | tee /home/clouduser/21_lp_room_examples_readonly.out

sudo -u postgres psql -X -d big_data_binops \
  < 02_national_room_integrity_readonly.sql \
  2>&1 | tee /home/clouduser/22_lp_room_national_readonly.out

sudo -u postgres psql -X -d big_data_binops \
  < 03_tanjung_duren_grogol_petamburan_readonly.sql \
  2>&1 | tee /home/clouduser/23_tanjung_duren_grogol_petamburan_readonly.out
```

Audit ketiga membedakan rename satu master dari dua master yang benar-benar harus
di-merge. Pemeriksaannya mencakup identitas DORS, parent, mapping, LP, akun, dan
child unit; audit tetap read-only.

Kriteria kandidat koreksi paling aman:

- `keputusan = SAFE_UNIQUE_CHILD`;
- `jumlah_kandidat = 1`;
- parent BDB cocok dengan kode parent pada payload DORS;
- target bukan master dengan identitas DORS duplikat;
- `sudah_dilimpahkan = false`;
- `dilimpahkan_eksternal = false`;
- tidak mempunyai baris pada `bdb_lp_pelimpahan`.

Jangan melakukan koreksi massal dari hasil audit sebelum kelompok `MASTER_DORS_DUPLIKAT`
diputuskan master canonical-nya. Kasus seperti DIT NARKOBA KEPRI harus disatukan pada lapisan
master/mapping terlebih dahulu, baru cache kamar LP dan scope akun diselaraskan.
