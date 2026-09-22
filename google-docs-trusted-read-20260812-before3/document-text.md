# Handover Teknis CAS v1.3 - Koreksi Scope Akses LP Unit dan Parent Polres

- Document ID: 1FNX4Yaeir67ah8o3rULFZFbM9V5w5NuKgyWYwfmDRlU
- Revision ID: AIroW377GlUHUFH8H-Q8vTb4QxuuzqWKuBZc2StRaUBaphVXbfJRMi-WCE9ENPQNW4g5ZhAM54jHHYpc43RPnvXEV5aJzXXnrrkATvGR2Bk
- Selected tab: all
- Protected controls: 0
- Opaque controls: 0
- Authoritative dropdowns: 0

Protected-control annotations are preservation instructions. Do not insert their displayed placeholder text to recreate a native control.

## Tab 1 (t.0)

[P00001 | 1:44 | NORMAL_TEXT]
HANDOVER TEKNIS DAN INSTRUKSI SINKRONISASI

[P00002 | 44:128 | NORMAL_TEXT]
Koreksi Mapping Papua Tengah, Penempatan LP, Patch Backend, dan Hotfix Frontend CAS

[P00003 | 128:196 | NORMAL_TEXT]
Ditujukan kepada: Programmer / Tim Pengembang CAS - Big Data Binops

[P00004 | 196:224 | NORMAL_TEXT]
Tanggal kondisi produksi: Aug 11, 2026

[P00005 | 224:311 | NORMAL_TEXT]
Lingkungan: Database 10.0.0.x | Backend 10.0.0.x | Frontend 10.0.0.x

[P00006 | 311:430 | NORMAL_TEXT]
Status: Koreksi produksi telah diterapkan dan tervalidasi; wajib disinkronkan ke source resmi sebelum build berikutnya

[P00007 | 430:431 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00008 | 431:702 | NORMAL_TEXT]
Pesan utama: Jangan melakukan deployment dari source lama sebelum seluruh perubahan pada dokumen ini dipindahkan ke repository resmi. Hotfix produksi saat ini mencakup perubahan database, backend, dan frontend yang dapat hilang jika image atau build lama dipasang ulang.

[P00009 | 702:725 | HEADING_1]
1. Ringkasan Eksekutif

[P00010 | 725:1343 | NORMAL_TEXT]
Insiden awal terjadi karena kode DORS Papua Tengah (060.37) belum memiliki mapping lengkap pada master satker. Akibatnya LP Papua Tengah dipetakan ke Polda Papua Barat Daya. Penanganan dilakukan dengan prinsip menghentikan sumber salah mapping terlebih dahulu, kemudian memindahkan data LP yang telanjur salah arah. Setelah itu ditemukan dua cacat aplikasi tambahan: backend menyimpan satker fungsi sebagai satker utama, dan frontend menampilkan label satker dari field mentah DORS. Terakhir, modal Edit Pengguna mengosongkan satker valid ketika pertama kali dibuka akibat race condition pada komponen pemilih satker.

[P00011 | 1346:1351 | NORMAL_TEXT | TABLE row=0 col=0]
Area

[P00012 | 1352:1368 | NORMAL_TEXT | TABLE row=0 col=1]
Status produksi

[P00013 | 1369:1381 | NORMAL_TEXT | TABLE row=0 col=2]
Hasil utama

[P00014 | 1383:1400 | NORMAL_TEXT | TABLE row=1 col=0]
Database mapping

[P00015 | 1401:1409 | NORMAL_TEXT | TABLE row=1 col=1]
Selesai

[P00016 | 1410:1451 | NORMAL_TEXT | TABLE row=1 col=2]
Master dan alias DORS Papua Tengah aktif

[P00017 | 1453:1464 | NORMAL_TEXT | TABLE row=2 col=0]
Koreksi LP

[P00018 | 1465:1473 | NORMAL_TEXT | TABLE row=2 col=1]
Selesai

[P00019 | 1474:1532 | NORMAL_TEXT | TABLE row=2 col=2]
69 LP massal + 1 LP outlier dikoreksi dengan backup baris

[P00020 | 1534:1542 | NORMAL_TEXT | TABLE row=3 col=0]
Backend

[P00021 | 1543:1551 | NORMAL_TEXT | TABLE row=3 col=1]
Selesai

[P00022 | 1552:1616 | NORMAL_TEXT | TABLE row=3 col=2]
Penempatan satker utama dan unit fungsi dipisahkan dengan benar

[P00023 | 1618:1637 | NORMAL_TEXT | TABLE row=4 col=0]
Frontend daftar LP

[P00024 | 1638:1646 | NORMAL_TEXT | TABLE row=4 col=1]
Selesai

[P00025 | 1647:1699 | NORMAL_TEXT | TABLE row=4 col=2]
Label memakai unit_satker_nama sebagai sumber utama

[P00026 | 1701:1724 | NORMAL_TEXT | TABLE row=5 col=0]
Frontend Edit Pengguna

[P00027 | 1725:1733 | NORMAL_TEXT | TABLE row=5 col=1]
Selesai

[P00028 | 1734:1784 | NORMAL_TEXT | TABLE row=5 col=2]
Satker awal tidak lagi terhapus saat modal dibuka

[P00029 | 1786:1802 | NORMAL_TEXT | TABLE row=6 col=0]
Kinerja Perkara

[P00030 | 1803:1824 | NORMAL_TEXT | TABLE row=6 col=1]
Requirement lanjutan

[P00031 | 1825:1910 | NORMAL_TEXT | TABLE row=6 col=2]
Tambahkan total, sudah diupdate, dan belum diupdate untuk CP/CC aktual dan tunggakan

[P00032 | 1911:1912 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00033 | 1912:1952 | HEADING_1]
2. Ruang Lingkup dan Prinsip Penanganan

[P00034 | 1952:2063 | NORMAL_TEXT | LIST id=kix.abbjgqrrp6vn level=0]
Menghentikan kran: memperbaiki master mapping terlebih dahulu agar sinkronisasi baru tidak kembali salah arah.

[P00035 | 2063:2175 | NORMAL_TEXT | LIST id=kix.abbjgqrrp6vn level=0]
Memindahkan air: mengoreksi LP yang sudah telanjur masuk ke satker yang salah setelah mapping dinyatakan valid.

[P00036 | 2175:2298 | NORMAL_TEXT | LIST id=kix.abbjgqrrp6vn level=0]
Menjaga rollback: setiap perubahan material memiliki dump, backup tabel, tag image lama, atau salinan build sebelum patch.

[P00037 | 2298:2417 | NORMAL_TEXT | LIST id=kix.abbjgqrrp6vn level=0]
Memisahkan data dan tampilan: memastikan nilai satker utama, unit fungsi, dan label UI menggunakan sumber yang sesuai.

[P00038 | 2417:2537 | NORMAL_TEXT | LIST id=kix.abbjgqrrp6vn level=0]
Mencegah regresi: programmer wajib memindahkan hotfix terkompilasi ke source bersih dan menambahkan pengujian otomatis.

[P00039 | 2537:2580 | HEADING_1]
3. Perubahan Database yang Telah Dilakukan

[P00040 | 2580:2613 | HEADING_2]
3.1 Backup penuh sebelum koreksi

[P00041 | 2613:2780 | NORMAL_TEXT]
Sebelum perubahan, database PostgreSQL big_data_binops telah diekspor dalam format custom dump. File ini merupakan titik pemulihan penuh sebelum koreksi Papua Tengah.

[P00042 | 2783:2791 | NORMAL_TEXT | TABLE row=0 col=0]
Atribut

[P00043 | 2792:2798 | NORMAL_TEXT | TABLE row=0 col=1]
Nilai

[P00044 | 2800:2811 | NORMAL_TEXT | TABLE row=1 col=0]
File lokal

[P00045 | 2812:2897 | NORMAL_TEXT | TABLE row=1 col=1]
D:\Prototype CAS\EDIT MASTER MASAL\big_data_binops_before_papua_tengah_20260811.dump

[P00046 | 2899:2906 | NORMAL_TEXT | TABLE row=2 col=0]
Ukuran

[P00047 | 2907:2943 | NORMAL_TEXT | TABLE row=2 col=1]
1.646.497.529 byte (sekitar 1,6 GB)

[P00048 | 2945:2952 | NORMAL_TEXT | TABLE row=3 col=0]
SHA256

[P00049 | 2953:3018 | NORMAL_TEXT | TABLE row=3 col=1]
B9CAB967F8D50B7C152A768749ACF14A48AAA44A7EA3FF8F4D62221487A546D1

[P00050 | 3020:3029 | NORMAL_TEXT | TABLE row=4 col=0]
Database

[P00051 | 3030:3062 | NORMAL_TEXT | TABLE row=4 col=1]
big_data_binops - PostgreSQL 16

[P00052 | 3063:3064 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00053 | 3064:3098 | HEADING_2]
3.2 Master dan alias Papua Tengah

[P00054 | 3098:3330 | NORMAL_TEXT]
Lima node master di bdb_satker diaktifkan untuk kode DORS Papua Tengah dan lima alias dibuat pada bdb_dors_satker_map. Mapping ini menjadi sumber pencegah agar LP baru dengan id_polda 060.37 tidak kembali masuk ke Papua Barat Daya.

[P00055 | 3333:3336 | NORMAL_TEXT | TABLE row=0 col=0]
ID

[P00056 | 3337:3344 | NORMAL_TEXT | TABLE row=0 col=1]
Satker

[P00057 | 3345:3355 | NORMAL_TEXT | TABLE row=0 col=2]
Kode DORS

[P00058 | 3356:3362 | NORMAL_TEXT | TABLE row=0 col=3]
Peran

[P00059 | 3364:3370 | NORMAL_TEXT | TABLE row=1 col=0]
18733

[P00060 | 3371:3390 | NORMAL_TEXT | TABLE row=1 col=1]
POLDA PAPUA TENGAH

[P00061 | 3391:3398 | NORMAL_TEXT | TABLE row=1 col=2]
060.37

[P00062 | 3399:3412 | NORMAL_TEXT | TABLE row=1 col=3]
Satker utama

[P00063 | 3414:3420 | NORMAL_TEXT | TABLE row=2 col=0]
18707

[P00064 | 3421:3445 | NORMAL_TEXT | TABLE row=2 col=1]
DIT KRIMUM PAPUA TENGAH

[P00065 | 3446:3456 | NORMAL_TEXT | TABLE row=2 col=2]
060.37-17

[P00066 | 3457:3469 | NORMAL_TEXT | TABLE row=2 col=3]
Unit fungsi

[P00067 | 3471:3477 | NORMAL_TEXT | TABLE row=3 col=0]
18708

[P00068 | 3478:3503 | NORMAL_TEXT | TABLE row=3 col=1]
DIT KRIMSUS PAPUA TENGAH

[P00069 | 3504:3514 | NORMAL_TEXT | TABLE row=3 col=2]
060.37-18

[P00070 | 3515:3527 | NORMAL_TEXT | TABLE row=3 col=3]
Unit fungsi

[P00071 | 3529:3535 | NORMAL_TEXT | TABLE row=4 col=0]
18709

[P00072 | 3536:3561 | NORMAL_TEXT | TABLE row=4 col=1]
DIT NARKOBA PAPUA TENGAH

[P00073 | 3562:3572 | NORMAL_TEXT | TABLE row=4 col=2]
060.37-19

[P00074 | 3573:3585 | NORMAL_TEXT | TABLE row=4 col=3]
Unit fungsi

[P00075 | 3587:3593 | NORMAL_TEXT | TABLE row=5 col=0]
18710

[P00076 | 3594:3620 | NORMAL_TEXT | TABLE row=5 col=1]
DIT POLAIRUD PAPUA TENGAH

[P00077 | 3621:3631 | NORMAL_TEXT | TABLE row=5 col=2]
060.37-21

[P00078 | 3632:3644 | NORMAL_TEXT | TABLE row=5 col=3]
Unit fungsi

[P00079 | 3645:3646 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00080 | 3646:3677 | HEADING_2]
3.3 Koreksi LP yang salah arah

[P00081 | 3677:3923 | NORMAL_TEXT]
Sebanyak 69 LP yang sebelumnya masuk ke Polda Papua Barat Daya dikoreksi berdasarkan id_unit_terusan DORS. Distribusi hasil koreksi adalah 60 LP Krimum, 6 LP Krimsus, 2 LP Narkoba, dan 1 LP Polairud. Backup baris persisten dibuat sebelum update.

[P00082 | 3926:3933 | NORMAL_TEXT | TABLE row=0 col=0]
Backup

[P00083 | 3934:3938 | NORMAL_TEXT | TABLE row=0 col=1]
Isi

[P00084 | 3939:3946 | NORMAL_TEXT | TABLE row=0 col=2]
Fungsi

[P00085 | 3948:3995 | NORMAL_TEXT | TABLE row=1 col=0]
public.bdb_fix_lp_papua_tengah_20260811_backup

[P00086 | 3996:4008 | NORMAL_TEXT | TABLE row=1 col=1]
69 baris LP

[P00087 | 4009:4033 | NORMAL_TEXT | TABLE row=1 col=2]
Rollback koreksi massal

[P00088 | 4035:4090 | NORMAL_TEXT | TABLE row=2 col=0]
public.bdb_fix_lp_papua_tengah_outlier_20260811_backup

[P00089 | 4091:4102 | NORMAL_TEXT | TABLE row=2 col=1]
1 baris LP

[P00090 | 4103:4135 | NORMAL_TEXT | TABLE row=2 col=2]
Rollback koreksi outlier manual

[P00091 | 4136:4137 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00092 | 4137:4397 | NORMAL_TEXT]
Satu LP outlier yang sebelumnya pernah dipetakan manual juga diperbaiki: LP id 392520, dors_lp_id 4526422, nomor LP/B/67/VIII/2026/SPKT/POLDA PAPUA TENGAH. Nilai akhirnya adalah satker utama 18733 (POLDA PAPUA TENGAH) dan unit 18707 (DIT KRIMUM PAPUA TENGAH).

[P00093 | 4397:4411 | HEADING_2]
3.4 Paket SQL

[P00094 | 4411:4484 | NORMAL_TEXT]
Seluruh preflight, dry-run, apply, validasi, dan rollback disimpan pada:

[P00095 | 4484:4563 | NORMAL_TEXT]
D:\Prototype CAS\EDIT MASTER MASAL\sql/home/clouduser/cas_papua_tengah_patch/

[P00096 | 4563:4671 | NORMAL_TEXT]
Daftar berkas: 01_mapping_preflight_papua_tengah.sql sampai dengan 10_lp_outlier_rollback_papua_tengah.sql.

[P00097 | 4671:4895 | NORMAL_TEXT]
Peringatan: Programmer tidak boleh menjalankan ulang file apply secara buta. Gunakan preflight terlebih dahulu, periksa backup table yang sudah ada, dan perlakukan skrip ini sebagai histori migrasi serta referensi rollback.

[P00098 | 4895:4930 | HEADING_1]
4. Patch Backend Penempatan Satker

[P00099 | 4930:4947 | HEADING_2]
4.1 Akar masalah

[P00100 | 4947:5246 | NORMAL_TEXT]
Pada alur correctSatker(), mapOne(), serta jalur alias, satker fungsi yang dipilih pengguna disimpan langsung ke kolom satker utama. Kolom unit_satker_* justru dikosongkan. Dampaknya, LP fungsi seperti Ditreskrimum dapat terlihat sebagai satker utama, bukan sebagai unit di bawah Polda atau Polres.

[P00101 | 5246:5273 | HEADING_2]
4.2 Perilaku setelah patch

[P00102 | 5273:5378 | NORMAL_TEXT | LIST id=kix.yutwom68omkv level=0]
Jika pilihan adalah POLDA, POLRES, atau POLSEK: node tersebut menjadi satker utama dan unit dikosongkan.

[P00103 | 5378:5529 | NORMAL_TEXT | LIST id=kix.yutwom68omkv level=0]
Jika pilihan adalah FUNGSI dan memiliki induk teritorial: induk teritorial terdekat menjadi satker utama, sedangkan node fungsi menjadi unit_satker_*.

[P00104 | 5529:5709 | NORMAL_TEXT | LIST id=kix.yutwom68omkv level=0]
Jika node fungsi tidak memiliki induk teritorial, termasuk beberapa struktur Mabes: perilaku lama dipertahankan agar tidak merusak cakupan yang belum memiliki pasangan teritorial.

[P00105 | 5709:5734 | HEADING_2]
4.3 Source dan pengujian

[P00106 | 5737:5744 | NORMAL_TEXT | TABLE row=0 col=0]
Berkas

[P00107 | 5745:5755 | NORMAL_TEXT | TABLE row=0 col=1]
Perubahan

[P00108 | 5757:5806 | NORMAL_TEXT | TABLE row=1 col=0]
src/bdb/laporan-polisi/laporan-polisi.service.ts

[P00109 | 5807:5862 | NORMAL_TEXT | TABLE row=1 col=1]
Integrasi resolver penempatan pada semua jalur mapping

[P00110 | 5864:5912 | NORMAL_TEXT | TABLE row=2 col=0]
src/bdb/laporan-polisi/satker-placement.util.ts

[P00111 | 5913:5951 | NORMAL_TEXT | TABLE row=2 col=1]
Resolver satker utama dan unit fungsi

[P00112 | 5953:6006 | NORMAL_TEXT | TABLE row=3 col=0]
src/bdb/laporan-polisi/satker-placement.util.spec.ts

[P00113 | 6007:6029 | NORMAL_TEXT | TABLE row=3 col=1]
Empat regression test

[P00114 | 6030:6031 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00115 | 6031:6137 | NORMAL_TEXT]
Patch diterapkan pada correctSatker, mapOne, insertMappedLp, name matching, serta jalur alias unit/group.

[P00116 | 6137:6164 | HEADING_2]
4.4 Baseline image backend

[P00117 | 6167:6171 | NORMAL_TEXT | TABLE row=0 col=0]
Tag

[P00118 | 6172:6181 | NORMAL_TEXT | TABLE row=0 col=1]
Image ID

[P00119 | 6182:6193 | NORMAL_TEXT | TABLE row=0 col=2]
Keterangan

[P00120 | 6195:6219 | NORMAL_TEXT | TABLE row=1 col=0]
bdb-api:20260805-193904

[P00121 | 6220:6233 | NORMAL_TEXT | TABLE row=1 col=1]
9aa9923248e3

[P00122 | 6234:6259 | NORMAL_TEXT | TABLE row=1 col=2]
Tag operasional saat ini

[P00123 | 6261:6299 | NORMAL_TEXT | TABLE row=2 col=0]
bdb-api:20260811-satker-placement-fix

[P00124 | 6300:6313 | NORMAL_TEXT | TABLE row=2 col=1]
9aa9923248e3

[P00125 | 6314:6350 | NORMAL_TEXT | TABLE row=2 col=2]
Kandidat berisi source + dist patch

[P00126 | 6352:6394 | NORMAL_TEXT | TABLE row=3 col=0]
bdb-api:20260805-193904-before-satker-fix

[P00127 | 6395:6408 | NORMAL_TEXT | TABLE row=3 col=1]
c7a75bde6f98

[P00128 | 6409:6432 | NORMAL_TEXT | TABLE row=3 col=2]
Rollback sebelum patch

[P00129 | 6433:6434 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00130 | 6434:6500 | NORMAL_TEXT]
Validasi health endpoint /api/network/ping menghasilkan HTTP 200.

[P00131 | 6500:6541 | HEADING_1]
5. Hotfix Frontend Daftar Laporan Polisi

[P00132 | 6541:6564 | HEADING_2]
5.1 Akar masalah label

[P00133 | 6564:6796 | NORMAL_TEXT]
Kolom Satker Penanganan pada tabel daftar LP membentuk label dari unit_nama dan satker_nama. unit_nama merupakan nama mentah DORS, sehingga label yang tampil dapat berbeda dari unit_satker_nama yang sudah dipetakan pada master CAS.

[P00134 | 6796:6950 | NORMAL_TEXT]
Sumber label sebelum patch:[row.unit_nama, row.satker_nama].filter(Boolean).join(' ')Sumber label setelah patch:row.unit_satker_nama || fallback lama

[P00135 | 6950:7214 | NORMAL_TEXT]
Hotfix produksi dilakukan pada chunk client dan SSR karena source Next.js aktif tidak tersedia di host. Cache busting diterapkan agar browser tidak memakai chunk lama. Programmer wajib menerapkan logika tersebut pada source bersih app/cms/laporan-polisi/page.tsx.

[P00136 | 7214:7216 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00137 | 7216:7267 | HEADING_2]
5.2 Baseline image frontend setelah seluruh hotfix

[P00138 | 7270:7274 | NORMAL_TEXT | TABLE row=0 col=0]
Tag

[P00139 | 7275:7284 | NORMAL_TEXT | TABLE row=0 col=1]
Image ID

[P00140 | 7285:7296 | NORMAL_TEXT | TABLE row=0 col=2]
Keterangan

[P00141 | 7298:7322 | NORMAL_TEXT | TABLE row=1 col=0]
bdb-web:20260805-132056

[P00142 | 7323:7336 | NORMAL_TEXT | TABLE row=1 col=1]
9dc428d25cbd

[P00143 | 7337:7379 | NORMAL_TEXT | TABLE row=1 col=2]
Tag operasional setelah seluruh hotfix FE

[P00144 | 7381:7424 | NORMAL_TEXT | TABLE row=2 col=0]
bdb-web:20260812-user-satker-hydration-fix

[P00145 | 7425:7438 | NORMAL_TEXT | TABLE row=2 col=1]
9dc428d25cbd

[P00146 | 7439:7468 | NORMAL_TEXT | TABLE row=2 col=2]
Kandidat patch Edit Pengguna

[P00147 | 7470:7517 | NORMAL_TEXT | TABLE row=3 col=0]
bdb-web:20260805-132056-before-user-satker-fix

[P00148 | 7518:7531 | NORMAL_TEXT | TABLE row=3 col=1]
0cee672a719c

[P00149 | 7532:7569 | NORMAL_TEXT | TABLE row=3 col=2]
Rollback sebelum patch Edit Pengguna

[P00150 | 7571:7605 | NORMAL_TEXT | TABLE row=4 col=0]
bdb-web:20260812-satker-label-fix

[P00151 | 7606:7619 | NORMAL_TEXT | TABLE row=4 col=1]
0cee672a719c

[P00152 | 7620:7641 | NORMAL_TEXT | TABLE row=4 col=2]
Kandidat patch label

[P00153 | 7643:7691 | NORMAL_TEXT | TABLE row=5 col=0]
bdb-web:20260805-132056-before-satker-label-fix

[P00154 | 7692:7705 | NORMAL_TEXT | TABLE row=5 col=1]
f3d2ee329509

[P00155 | 7706:7735 | NORMAL_TEXT | TABLE row=5 col=2]
Rollback sebelum patch label

[P00156 | 7736:7737 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00157 | 7737:7776 | HEADING_1]
6. Hotfix Frontend Modal Edit Pengguna

[P00158 | 7776:7795 | HEADING_2]
6.1 Kasus validasi

[P00159 | 7795:8086 | NORMAL_TEXT]
Kasus direproduksi pada user ID 122, HENDRIK DWI HARIADI, role operator. Data database valid: scope_satker_id 9453, scope_satker_key 060.01.17.00.00.28, dan master DIT RES SIBER JAWA TIMUR ditemukan baik berdasarkan ID maupun kode. Namun modal Edit Pengguna hanya menampilkan Satker: POLRI.

[P00160 | 8086:8118 | HEADING_2]
6.2 Akar masalah race condition

[P00161 | 8118:8176 | NORMAL_TEXT | LIST id=kix.cjbworhgqko9 level=0]
Modal mengirim initialId 9453 ke komponen pemilih satker.

[P00162 | 8176:8248 | NORMAL_TEXT | LIST id=kix.cjbworhgqko9 level=0]
State internal komponen pada render pertama masih berupa daftar kosong.

[P00163 | 8248:8322 | NORMAL_TEXT | LIST id=kix.cjbworhgqko9 level=0]
useEffect yang memantau state tersebut langsung memanggil onSelect(null).

[P00164 | 8322:8401 | NORMAL_TEXT | LIST id=kix.cjbworhgqko9 level=0]
Form induk menghapus scope_satker_id, scope_satker_key, dan scope_satker_name.

[P00165 | 8401:8494 | NORMAL_TEXT | LIST id=kix.cjbworhgqko9 level=0]
Perubahan initialId menjadi null membatalkan pemuatan jalur 9453; UI berhenti di root POLRI.

[P00166 | 8494:8542 | HEADING_2]
6.3 Perbaikan source yang wajib dibuat permanen

[P00167 | 8542:8797 | NORMAL_TEXT]
Hilangkan efek yang mengirim onSelect setiap kali selected berubah. Panggil onSelect hanya dari handler perubahan dropdown yang benar-benar dipicu pengguna. Inisialisasi dari initialId hanya mengisi state internal dan tidak boleh mengosongkan form induk.

[P00168 | 8797:9144 | NORMAL_TEXT]
// Prinsip implementasi pada komponen pemilih satkerasync function handleLevelChange(level, node) {  const nextSelected = selected.slice(0, level);  // isi node dan daftar anak sesuai pilihan  setSelected(nextSelected);  onSelectRef.current(nextSelected.at(-1) ?? null);}// Hapus efek otomatis yang memanggil onSelect saat hydration awal.

[P00169 | 9144:9478 | NORMAL_TEXT]
Patch terkompilasi diterapkan pada chunk client halaman user dan chunk SSR terkait. Chunk client memakai nama cache-busted 00l7wgk9jmf2_-user-satker-fix-20260812.js. Validasi menghasilkan handler baru = 1 dan efek lama = 0. Setelah deploy, modal user ID 122 berhasil menampilkan POLRI -> POLDA JAWA TIMUR -> DIT RES SIBER JAWA TIMUR.

[P00170 | 9478:9521 | HEADING_1]
7. Catatan Penting tentang Source Frontend

[P00171 | 9521:9806 | NORMAL_TEXT]
Jangan salah repository: Dua folder /var/www/www/cas_v1.2.0/cas-cms dan /var/www/cas_v1.2.0/cas-cms adalah source Vue lama. Aplikasi produksi aktif adalah Next.js 16.2.10 dengan package cas-web-master di container bdb-web. Jangan membangun pengganti produksi dari source Vue tersebut.

[P00172 | 9806:10117 | NORMAL_TEXT]
Karena source Next.js bersih tidak tersedia pada host FE, dua perbaikan frontend saat ini berupa hotfix build terkompilasi. Programmer harus mengambil repository Next.js resmi yang sesuai dengan build produksi, lalu memindahkan logika patch label LP dan patch hydration pemilih satker ke source TypeScript/TSX.

[P00173 | 10117:10171 | HEADING_1]
8. Langkah Wajib Programmer Sebelum Update Berikutnya

[P00174 | 10171:10306 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Bekukan baseline. Catat tag dan image ID aktif untuk database, backend, dan frontend. Jangan langsung menjalankan pipeline deployment.

[P00175 | 10306:10414 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Buat branch khusus integrasi hotfix dari commit source resmi yang benar-benar menjadi dasar image produksi.

[P00176 | 10414:10524 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Verifikasi seluruh artifact dan checksum pada Lampiran A. Jangan memakai file bernama sama jika hash berbeda.

[P00177 | 10524:10676 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Backend: port perubahan laporan-polisi.service.ts, satker-placement.util.ts, dan test resolver ke repository resmi. Jalankan unit test dan build penuh.

[P00178 | 10676:10844 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Frontend daftar LP: ubah sumber label menjadi unit_satker_nama dengan fallback yang aman. Tambahkan regression test untuk unit master yang berbeda dari unit_nama DORS.

[P00179 | 10844:11099 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Frontend Edit Pengguna: pindahkan callback onSelect ke handler interaksi pengguna dan hapus emission otomatis saat hydration. Tambahkan test membuka modal dengan initialId, mengganti satker, menghapus satker, serta membuka dua pengguna secara bergantian.

[P00180 | 11099:11261 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Database: masukkan SQL Papua Tengah sebagai histori migrasi yang terdokumentasi. Jangan mengulang apply ke produksi tanpa preflight dan pemeriksaan backup table.

[P00181 | 11261:11395 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Bangun kandidat backend dan frontend dengan tag baru. Jalankan di port atau environment terisolasi sebelum menyentuh container aktif.

[P00182 | 11395:11536 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Lakukan smoke test terpadu sesuai Bagian 10, kemudian deploy dengan backup filesystem/image serta prosedur rollback yang telah diverifikasi.

[P00183 | 11536:11668 | NORMAL_TEXT | LIST id=kix.tkg204zf6jf6 level=0]
Setelah lolos produksi, pastikan tag operasional mengarah ke image baru agar container yang direcreate tidak kembali ke build lama.

[P00184 | 11668:11719 | HEADING_1]
9. Requirement Lanjutan: Kinerja Perkara CP dan CC

[P00185 | 11719:11969 | NORMAL_TEXT]
Pada tabel Kinerja Perkara perlu ditambahkan indikator jumlah LP yang belum diupdate agar total data dan data yang sudah diupdate selalu dapat direkonsiliasi. Perubahan berlaku pada empat lokasi: CP Aktual, CP Tunggakan, CC Aktual, dan CC Tunggakan.

[P00186 | 11972:11982 | NORMAL_TEXT | TABLE row=0 col=0]
Indikator

[P00187 | 11983:12005 | NORMAL_TEXT | TABLE row=0 col=1]
Definisi implementasi

[P00188 | 12007:12016 | NORMAL_TEXT | TABLE row=1 col=0]
Total LP

[P00189 | 12017:12104 | NORMAL_TEXT | TABLE row=1 col=1]
Populasi LP unik yang masuk ke filter, periode, satker, model, dan scope baris terkait

[P00190 | 12106:12121 | NORMAL_TEXT | TABLE row=2 col=0]
Sudah Diupdate

[P00191 | 12122:12206 | NORMAL_TEXT | TABLE row=2 col=1]
LP unik dari populasi yang sama dan memenuhi definisi update/status Kinerja Perkara

[P00192 | 12208:12223 | NORMAL_TEXT | TABLE row=3 col=0]
Belum Diupdate

[P00193 | 12224:12299 | NORMAL_TEXT | TABLE row=3 col=1]
LP unik dari populasi yang sama yang belum memenuhi definisi update/status

[P00194 | 12300:12301 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00195 | 12301:12443 | NORMAL_TEXT]
Invariant wajib: Total LP = Sudah Diupdate + Belum Diupdate untuk setiap baris, satker, periode, model, scope, dan kategori aktual/tunggakan.

[P00196 | 12443:12551 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Perhitungan harus berasal dari backend sebagai source of truth, bukan hanya pengurangan visual di frontend.

[P00197 | 12551:12659 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Gunakan COUNT(DISTINCT lp.id) atau identitas LP kanonik agar join status/riwayat tidak menggandakan jumlah.

[P00198 | 12659:12794 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Ketiga indikator wajib menggunakan filter dan exclusion yang sama: deleted, limpah eksternal, scope akses, satker, periode, dan model.

[P00199 | 12794:12956 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Definisi Aktual dan Tunggakan harus mengikuti logika bisnis yang saat ini sudah dipakai modul; jangan mengubah batas periodenya tanpa persetujuan pemilik produk.

[P00200 | 12956:13041 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Respons API yang disarankan per baris: total_lp, sudah_diupdate, dan belum_diupdate.

[P00201 | 13041:13169 | NORMAL_TEXT | LIST id=kix.u1sxl4oxugmb level=0]
Perubahan status satu LP harus membuat sudah_diupdate bertambah satu dan belum_diupdate berkurang satu tanpa mengubah total_lp.

[P00202 | 13169:13207 | HEADING_2]
9.1 Pengujian minimum Kinerja Perkara

[P00203 | 13207:13255 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
CP Aktual: invariant jumlah dan filter periode.

[P00204 | 13255:13328 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
CP Tunggakan: invariant jumlah dan pembawaan perkara periode sebelumnya.

[P00205 | 13328:13374 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
CC Aktual: invariant jumlah dan scope satker.

[P00206 | 13374:13425 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
CC Tunggakan: invariant jumlah dan exclusion data.

[P00207 | 13425:13487 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
Perubahan satu LP dari belum diupdate menjadi sudah diupdate.

[P00208 | 13487:13540 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
Join status berganda tidak menyebabkan double count.

[P00209 | 13540:13619 | NORMAL_TEXT | LIST id=kix.sqsm3qvf58k level=0]
Hasil superadmin dan user berscope konsisten terhadap data yang boleh dilihat.

[P00210 | 13619:13658 | HEADING_1]
10. Acceptance Test Sebelum Deployment

[P00211 | 13658:13684 | HEADING_2]
10.1 Database dan mapping

[P00212 | 13684:13748 | NORMAL_TEXT | LIST id=kix.3ajzwijh9dkw level=0]
Kode 060.37 dan 060.37-17/-18/-19/-21 mengarah ke Papua Tengah.

[P00213 | 13748:13810 | NORMAL_TEXT | LIST id=kix.3ajzwijh9dkw level=0]
LP baru Papua Tengah tidak kembali masuk ke Papua Barat Daya.

[P00214 | 13810:13857 | NORMAL_TEXT | LIST id=kix.3ajzwijh9dkw level=0]
Jumlah LP salah arah setelah cutoff tetap nol.

[P00215 | 13857:13912 | NORMAL_TEXT | LIST id=kix.3ajzwijh9dkw level=0]
Backup table koreksi tetap tersedia dan tidak berubah.

[P00216 | 13912:13925 | HEADING_2]
10.2 Backend

[P00217 | 13925:13984 | NORMAL_TEXT | LIST id=kix.83p330tto1ud level=0]
Pilihan Polda/Polres/Polsek disimpan sebagai satker utama.

[P00218 | 13984:14064 | NORMAL_TEXT | LIST id=kix.83p330tto1ud level=0]
Pilihan fungsi disimpan sebagai unit dan induk teritorial sebagai satker utama.

[P00219 | 14064:14154 | NORMAL_TEXT | LIST id=kix.83p330tto1ud level=0]
Mapping otomatis, mapping manual, alias unit, dan alias group memakai resolver yang sama.

[P00220 | 14154:14224 | NORMAL_TEXT | LIST id=kix.83p330tto1ud level=0]
Unit test resolver lulus dan /api/network/ping menghasilkan HTTP 200.

[P00221 | 14224:14238 | HEADING_2]
10.3 Frontend

[P00222 | 14238:14306 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Kolom Satker Penanganan menampilkan unit_satker_nama saat tersedia.

[P00223 | 14306:14389 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Fallback label tetap bekerja untuk data lama yang belum memiliki unit_satker_nama.

[P00224 | 14389:14475 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Modal Edit Pengguna user ID 122 memuat Polda Jawa Timur dan Dit Res Siber Jawa Timur.

[P00225 | 14475:14545 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Membuka modal tidak mengubah data form sebelum pengguna berinteraksi.

[P00226 | 14545:14623 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Mengganti dan menghapus pilihan satker tetap memutakhirkan form dengan benar.

[P00227 | 14623:14684 | NORMAL_TEXT | LIST id=kix.ja3wpshyg95r level=0]
Hard refresh atau browser baru mengambil chunk cache-busted.

[P00228 | 14684:14711 | HEADING_1]
11. Rollback dan Pemulihan

[P00229 | 14711:14725 | HEADING_2]
11.1 Database

[P00230 | 14725:14804 | NORMAL_TEXT | LIST id=kix.1vh2kzfis4bu level=0]
Gunakan backup baris persisten untuk rollback terbatas pada LP yang dikoreksi.

[P00231 | 14804:14927 | NORMAL_TEXT | LIST id=kix.1vh2kzfis4bu level=0]
Gunakan full dump hanya jika dibutuhkan pemulihan menyeluruh dan setelah melakukan dry-run restore pada database terpisah.

[P00232 | 14927:15052 | NORMAL_TEXT | LIST id=kix.1vh2kzfis4bu level=0]
Jangan restore penuh langsung ke produksi tanpa validasi version PostgreSQL, ruang disk, koneksi aktif, dan window downtime.

[P00233 | 15052:15065 | HEADING_2]
11.2 Backend

[P00234 | 15065:15151 | NORMAL_TEXT]
Tag rollback backend: bdb-api:20260805-193904-before-satker-fix (image c7a75bde6f98).

[P00235 | 15151:15165 | HEADING_2]
11.3 Frontend

[P00236 | 15165:15544 | NORMAL_TEXT]
Rollback terbatas sebelum patch Edit Pengguna tersedia pada tag bdb-web:20260805-132056-before-user-satker-fix (image 0cee672a719c). Rollback lebih lama sebelum patch label tersedia pada bdb-web:20260805-132056-before-satker-label-fix (image f3d2ee329509). Salinan .next sebelum deploy terakhir juga tersedia pada /home/clouduser/bdb-web-deploy-user-satker-20260812/before-next.

[P00237 | 15544:15817 | NORMAL_TEXT]
Aturan rollback: Rollback harus mengembalikan filesystem container dan tag image operasional. Mengubah tag saja tidak mengubah filesystem container yang sedang berjalan; sebaliknya, menyalin file ke container tanpa memperbarui tag dapat hilang saat container dibuat ulang.

[P00238 | 15817:15851 | HEADING_1]
12. Hal yang Tidak Boleh Terlewat

[P00239 | 15851:15919 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan menggunakan source Vue lama sebagai dasar frontend produksi.

[P00240 | 15919:16030 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan menghapus backup dump, backup table, source archive, atau tag rollback sebelum build resmi baru stabil.

[P00241 | 16030:16118 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan mengganti .env.development atau konfigurasi runtime saat menyalin source/hotfix.

[P00242 | 16118:16230 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan menganggap hotfix chunk sebagai source permanen; implementasikan ulang pada source TypeScript/TSX resmi.

[P00243 | 16230:16344 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan menjalankan koreksi SQL berdasarkan pencarian nama saja. Gunakan ID dan kode DORS yang sudah diverifikasi.

[P00244 | 16344:16447 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Jangan deploy image lama setelah koreksi karena akan menghidupkan kembali bug penempatan dan tampilan.

[P00245 | 16447:16559 | NORMAL_TEXT | LIST id=kix.nzlc6w5afjuv level=0]
Simpan dokumen ini bersama release note dan commit yang mengintegrasikan patch agar jejak audit tidak terputus.

[P00246 | 16559:16635 | HEADING_1]
13. Pekerjaan Tambahan Prioritas Major: Scope Polres Ikut Mengakses LP Unit

[P00247 | 16635:16652 | HEADING_2]
13.1 Bukti kasus

[P00248 | 16652:16859 | NORMAL_TEXT]
Pada LP/A/64/VIII/2026/SPKT.SATRESNARKOBA/POLRES CIANJUR/POLDA JAWA BARAT, halaman detail sudah menampilkan satker utama POLRES CIANJUR, unit penanganan SAT NARKOBA RES CIANJUR, dan unit DORS SATRESNARKOBA.

[P00249 | 16859:17052 | NORMAL_TEXT]
Artinya unit LP terbaca dan unit_satker_id kemungkinan sudah terisi benar. Concern utama bukan lagi kegagalan mapping unit, melainkan LP tersebut tetap dapat diakses dari scope POLRES CIANJUR.

[P00250 | 17052:17235 | NORMAL_TEXT]
Akun Admin_POLRES_CIANJUR hanya menjadi sarana untuk melihat gejala. Fokus perbaikan adalah aturan akses yang membuat parent Polres ikut lolos walaupun LP sudah mempunyai kamar unit.

[P00251 | 17235:17265 | HEADING_2]
13.2 Akar masalah pada source

[P00252 | 17265:17342 | NORMAL_TEXT | LIST id=kix.i68a2cna9m8o level=0]
resolveScope menghasilkan satu scope_satker_id untuk pengguna nonsuperadmin.

[P00253 | 17342:17447 | NORMAL_TEXT | LIST id=kix.i68a2cna9m8o level=0]
Query statistik dan daftar LP saat ini memakai pola (lp.satker_id = scope OR lp.unit_satker_id = scope).

[P00254 | 17447:17544 | NORMAL_TEXT | LIST id=kix.i68a2cna9m8o level=0]
Pencarian global, detail LP, dan sejumlah endpoint perubahan data memakai logika OR yang setara.

[P00255 | 17544:17711 | NORMAL_TEXT | LIST id=kix.i68a2cna9m8o level=0]
Karena satker_id LP tetap menunjuk induk POLRES CIANJUR, akun berscope Polres memenuhi kondisi pertama walaupun unit_satker_id sudah menunjuk SAT NARKOBA RES CIANJUR.

[P00256 | 17711:17835 | NORMAL_TEXT | LIST id=kix.i68a2cna9m8o level=0]
Dengan kata lain, field mapping berfungsi, tetapi precedence akses antara satker induk dan unit penanganan belum dibedakan.

[P00257 | 17835:17869 | HEADING_2]
13.3 Aturan akses yang diharapkan

[P00258 | 17869:17987 | NORMAL_TEXT | LIST id=kix.8sufg7ascx3b level=0]
Jika unit_satker_id terisi, akses operasional hanya boleh diberikan ketika scope pengguna sama dengan unit_satker_id.

[P00259 | 17987:18173 | NORMAL_TEXT | LIST id=kix.8sufg7ascx3b level=0]
satker_id tetap dipertahankan sebagai induk teritorial untuk struktur, agregasi, dan pelaporan; field tersebut tidak boleh menjadi jalur akses tambahan ketika unit penanganan sudah ada.

[P00260 | 18173:18310 | NORMAL_TEXT | LIST id=kix.8sufg7ascx3b level=0]
Jika unit_satker_id kosong, LP masuk ke antrean Unit Belum Terpetakan yang hanya dapat ditangani superadmin atau mekanisme triase resmi.

[P00261 | 18310:18400 | NORMAL_TEXT | LIST id=kix.8sufg7ascx3b level=0]
Admin Polres tidak dijadikan akun operasional untuk menangani seluruh LP unit turunannya.

[P00262 | 18400:18470 | NORMAL_TEXT | LIST id=kix.8sufg7ascx3b level=0]
Akun petugas tetap dibuat dan dibatasi pada kamar unit masing-masing.

[P00263 | 18470:18508 | HEADING_2]
13.4 Perubahan source yang diperlukan

[P00264 | 18508:18605 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Buat satu helper predicate akses LP agar aturan precedence unit-versus-parent tidak diduplikasi.

[P00265 | 18605:18715 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Terapkan helper yang sama pada stats, per_status, list, searchGlobal, detail, dan seluruh endpoint mutasi LP.

[P00266 | 18715:18873 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Gunakan aturan inti: unit_satker_id IS NOT NULL harus cocok ke scope unit; satker_id hanya dipakai sebagai fallback terkontrol ketika unit_satker_id IS NULL.

[P00267 | 18873:18968 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Batasi fallback LP tanpa unit ke antrean khusus atau superadmin, bukan ke seluruh akun Polres.

[P00268 | 18968:19114 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Audit proses generate/import operator agar role operasional tidak dibuat atau ditempelkan pada node Polres ketika kamar unit yang valid tersedia.

[P00269 | 19114:19227 | NORMAL_TEXT | LIST id=kix.1uvv2apxdf3l level=0]
Tambahkan indeks atau review execution plan bila predicate baru memengaruhi performa query daftar dan statistik.

[P00270 | 19227:19263 | HEADING_2]
13.5 Penanganan data yang sudah ada

[P00271 | 19263:19323 | NORMAL_TEXT | LIST id=kix.q3g7viwksin2 level=0]
LP yang unit_satker_id-nya sudah benar tidak perlu diremap.

[P00272 | 19323:19426 | NORMAL_TEXT | LIST id=kix.q3g7viwksin2 level=0]
Pisahkan audit data menjadi tiga kategori: unit benar tetapi scope bocor, unit salah, dan unit kosong.

[P00273 | 19426:19524 | NORMAL_TEXT | LIST id=kix.q3g7viwksin2 level=0]
Lakukan remap hanya pada kategori unit salah atau unit kosong setelah kandidat unit diverifikasi.

[P00274 | 19524:19638 | NORMAL_TEXT | LIST id=kix.q3g7viwksin2 level=0]
Untuk kategori unit benar tetapi scope bocor, perbaiki source dan lakukan regression test tanpa mengubah data LP.

[P00275 | 19638:19833 | NORMAL_TEXT | LIST id=kix.q3g7viwksin2 level=0]
Akun Polres yang terbuat selama proses operasional dievaluasi dan dinonaktifkan hanya setelah fungsi, pemilik, dan dampaknya dikonfirmasi; tindakan tersebut harus tercatat dan dapat di-rollback.

[P00276 | 19833:19858 | HEADING_2]
13.6 Acceptance criteria

[P00277 | 19858:19957 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
LP contoh tetap mempunyai satker utama POLRES CIANJUR dan unit penanganan SAT NARKOBA RES CIANJUR.

[P00278 | 19957:20039 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
Petugas berscope SAT NARKOBA RES CIANJUR dapat melihat dan menangani LP tersebut.

[P00279 | 20039:20123 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
Akun berscope POLRES CIANJUR tidak melihat LP yang unit_satker_id-nya sudah terisi.

[P00280 | 20123:20212 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
LP tanpa unit tidak bocor ke akun Polres dan muncul pada antrean triase yang ditentukan.

[P00281 | 20212:20329 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
Jumlah pada kartu statistik, daftar, pencarian, detail, dan otorisasi mutasi memakai predicate akses yang konsisten.

[P00282 | 20329:20437 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
Regression test mencakup scope unit benar, scope Polres, unit kosong, superadmin, dan pelimpahan eksternal.

[P00283 | 20437:20518 | NORMAL_TEXT | LIST id=kix.9x5hswro39h9 level=0]
Tidak ada perubahan unit_satker_id terhadap LP yang mapping unitnya sudah benar.

[P00284 | 20518:20563 | HEADING_1]
Lampiran A. Inventaris Artifact dan Checksum

[P00285 | 20566:20575 | NORMAL_TEXT | TABLE row=0 col=0]
Artifact

[P00286 | 20576:20592 | NORMAL_TEXT | TABLE row=0 col=1]
SHA256 / lokasi

[P00287 | 20594:20613 | NORMAL_TEXT | TABLE row=1 col=0]
Full database dump

[P00288 | 20614:20679 | NORMAL_TEXT | TABLE row=1 col=1]
B9CAB967F8D50B7C152A768749ACF14A48AAA44A7EA3FF8F4D62221487A546D1

[P00289 | 20681:20701 | NORMAL_TEXT | TABLE row=2 col=0]
Backend source asli

[P00290 | 20702:20767 | NORMAL_TEXT | TABLE row=2 col=1]
0FFF0B51772B4737B4940A2A35B1B3BD2CA024F2DCE8DA953A46C9874D1DD020

[P00291 | 20769:20791 | NORMAL_TEXT | TABLE row=3 col=0]
Backend patch archive

[P00292 | 20792:20857 | NORMAL_TEXT | TABLE row=3 col=1]
08F9E38B8193EE57904AFD58086C1068AD895AE4AF916EC8C2A44BC3870FC0C2

[P00293 | 20859:20880 | NORMAL_TEXT | TABLE row=4 col=0]
Frontend label patch

[P00294 | 20881:20946 | NORMAL_TEXT | TABLE row=4 col=1]
4EA91B52A7151ADF28FAED8D843B112192E83B94D9CBE1A4DB84FBDF069AD441

[P00295 | 20948:20970 | NORMAL_TEXT | TABLE row=5 col=0]
Frontend audit bundle

[P00296 | 20971:21037 | NORMAL_TEXT | TABLE row=5 col=1]
E1410D90ADB474D5BE9EDA1C1AEA9A1AD4FF6754CA9BE6E8FDAFC1969C3B6723C

[P00297 | 21039:21068 | NORMAL_TEXT | TABLE row=6 col=0]
Frontend Edit Pengguna patch

[P00298 | 21069:21134 | NORMAL_TEXT | TABLE row=6 col=1]
F88213F21C5D8C9FB1C920C967CC9BE27FA07C4D1762A47084B91AAC77CC6DB5

[P00299 | 21135:21136 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00300 | 21136:21170 | HEADING_1]
Lampiran B. Lokasi Artifact Lokal

[P00301 | 21170:21229 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-source-20260811

[P00302 | 21229:21309 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-satker-placement-fix-20260811.tar.gz

[P00303 | 21309:21380 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-satker-label-patch-20260811

[P00304 | 21380:21456 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-satker-label-fix-20260812.tar.gz

[P00305 | 21456:21521 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-audit-20260812.tar.gz

[P00306 | 21521:21596 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-user-satker-fix-20260812.tar.gz

[P00307 | 21596:21635 | NORMAL_TEXT | LIST id=kix.s0rv0fjj2v7z level=0]
D:\Prototype CAS\EDIT MASTER MASAL\sql

[P00308 | 21635:21677 | HEADING_1]
Lampiran C. Definition of Done Programmer

[P00309 | 21677:21745 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Semua perubahan DB, BE, dan FE sudah tercatat pada commit/PR resmi.

[P00310 | 21745:21831 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Source Next.js yang dibangun telah dibuktikan sebagai source aplikasi produksi aktif.

[P00311 | 21831:21873 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Unit test dan regression test baru lulus.

[P00312 | 21873:21935 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Kandidat image diuji terisolasi dan smoke test terpadu lulus.

[P00313 | 21935:21993 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Backup, rollback, tag image, dan checksum terdokumentasi.

[P00314 | 21993:22063 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Kinerja Perkara CP/CC aktual dan tunggakan memenuhi invariant jumlah.

[P00315 | 22063:22135 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Deployment produksi tervalidasi dari akun superadmin dan akun berscope.

[P00316 | 22135:22236 | NORMAL_TEXT | LIST id=kix.vpf4na8laoz9 level=0]
Release note menyebutkan mapping Papua Tengah, penempatan LP, label LP, dan hydration Edit Pengguna.

[P00317 | 22236:22237 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00318 | 22237:22263 | HEADING_1]
Lampiran D. Riwayat Versi

[P00319 | 22263:22343 | NORMAL_TEXT]
v1.0 - Snapshot sebelum tambahan major case LP tertahan dan coverage akun unit.

[P00320 | 22343:22346 | NORMAL_TEXT]
[Handover Teknis CAS v1.0 - Snapshot sebelum tambahan Admin Unit dan LP Polres (12 Agustus 2026)](https://docs.google.com/document/d/1BfWt6CV9KURfHDTKQr4N1lZGnRskj9Dm-5UrFssMBUw/edit)1

[P00321 | 22346:22487 | NORMAL_TEXT]
v1.1 - Menambahkan analisis, pemisahan hold teknis dan operasional, rekomendasi coverage akun unit, alur koreksi, serta acceptance criteria.

[P00322 | 22487:22488 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00323 | 22488:22596 | NORMAL_TEXT]
v1.2 - Mengoreksi klasifikasi major case: LP berhenti di Polres tanpa unit, bukan karena belum ada petugas.

[P00324 | 22596:22641 | NORMAL_TEXT]
Snapshot v1.1 sebelum koreksi klasifikasi: [Handover Teknis CAS v1.1 - Snapshot sebelum koreksi klasifikasi LP tertahan (12 Agustus 2026)](https://docs.google.com/document/d/1Gv79hZZ7138zqPCozjwrE_YCGp-uXqLGK-zHqOeVtPA/edit)

[P00325 | 22641:22771 | NORMAL_TEXT]
v1.3 - Mengoreksi akar masalah major case: unit LP sudah benar, tetapi predicate akses OR membuat scope parent Polres ikut lolos.

[P00326 | 22771:22816 | NORMAL_TEXT]
Snapshot v1.2 sebelum koreksi scope akses: [Handover Teknis CAS v1.2 - Snapshot sebelum koreksi scope akses LP unit (12 Agustus 2026)](https://docs.google.com/document/d/18-3p2U2aqzt9aGNtdDBjYMHKYpYSxfBrqVCHjrPp7a4/edit)

[P00327 | 22816:22839 | NORMAL_TEXT]
AKHIR DOKUMEN HANDOVER


