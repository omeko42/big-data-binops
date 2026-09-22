# Koreksi master regional — bukti LIVE

3 September 2026, diverifikasi setelah restart sekitar20.53WIB.

## Batas privasi dan kewenangan

Pengguna meminta penyelesaian koreksi yang sudah diaudit. Setelah pertanyaan privasi, pengguna menyetujui pembacaan kode/metadata ke sesi ini dengan pemahaman bahwa model tidak seluruhnya lokal. Batas terbaru: tidak menyentuh isi sensitif kasus. Pembacaan/perubahan dibatasi pada satker, alias, scope akun, alamat pemilik LP dan agregat rekap. Tidak mengambil password/token, tidak membaca dokumen atau identitas pihak, tidak mengubah status penanganan.

## Hasil

| Objek | Sebelum | Sesudah |
| --- | --- | --- |
| Polsek Pangandaran6371 | parent6318Ciamis | parent6878Pangandaran |
| Rantepao15379 | parent15371TanaToraja | parent15667TorajaUtara |
| Sanggalangi15391 | parent15371TanaToraja | parent15667TorajaUtara |
| Sesean15400 | parent15371TanaToraja | parent15667TorajaUtara |
| Akun15597Julian | scope11716kosong | scope19785;163LP seluruh tahun,73tahun2026 |
| Pitumpanua | 56LPdi15541/15543 +56LPdi20254/20952 | 112LPdi20254/20952;42tahun2026 |
| LAPRI15512/15514 | duplikat aktif tanpaLP/akun | dinonaktifkan; Lappariaja20246/20950 tetap38LP,11tahun2026 |
| Pitumpanualama15541/15543 | aktif, membelah pemetaan | nonaktif; identitas lama diakomodasi alias |

Koreksi akun memperbarui keempat field scope/current/requested beserta key terkait; role_bdb/role_name tetap operator.

Tidak ada LP dihapus. Untuk56LP Pitumpanua, hanya kolom alamat satker/unit dan updated_at yang diperbarui; payload, nomorLP, isi, status, dan riwayat tidak dimodifikasi oleh skrip. Trigger yang sudah ada otomatis menyelaraskan snapshot. Sebanyak56snapshot dipastikan memakai pemilik20952.

## Ketahanan setelah restart

Hanya dua file satker service diberi empat tambahan override pada Map yang sudah ada; kode/sumber lain tidak dibangun ulang:

- dist/bdb/satker/satker.service.js: a56e9394fa9a66df086dbb83f1a27f678d7ffe64e34e53a21d711f81b21d3f0e ->44c69789ccf1abcec0d2a6a7016e84a242d38ba89cc599f7c81ae18a0c066d60
- src/bdb/satker/satker.service.ts: a667be08f0f72a27e569d209f8f64744bc1779907b322b02803d7478bb9f1f3b ->72f7405382c7dfaac95a29d708c6ba74f7c6db69cd8d6a959d54669fd815ee0d

Uji runtime dan source hasiltranspile lulus: empat parent benar, child/unit tetap pada Polsek masing-masing, contoh wilayah lain tidak berubah. Empat parent aktual kembali diperiksa setelah restart dan tetap benar.

## Pemasangan dan cadangan

- Backup kode dan metadata di hostproduksi: /home/clouduser/codex-backups/bdb-api/regional-master-20260903-135102
- Backup metadata dalamcontainer: /tmp/regional-master-repair-20260903/data-before.json
- Auditlog:1790043, actionREGIONAL_MASTER_REPAIRED_20260903
- Aliasbaru:6214..6220
- Backend kembaliHTTP200, pemeriksaan agregat melalui service statistik produksi lulus, roleakun tidak berubah.
- Job463/464 success sebelum dan sesudah; tidak dihentikan/diulang.
- Belum menguji antarmuka menggunakan sesi operator atau melakukan pengisian dokumen produksi.

Percobaan pertama batal seluruh transaksi karena pemeriksaan mengharapkan56UPDATEsnapshot, padahal triggerLP sudah memperbarui56snapshot lebih dahulu sehingga UPDATEmanual0. Diverifikasi kembali:56LP dan56snapshot masih diownerlama, Julian masihscope11716, audit0. Verifikasi kemudian diperbaiki untuk menguji hasilakhir56snapshot, bukan jumlahUPDATEmanual; percobaan kedua berhasil.

## Harkamtibmas — belum terverifikasi tuntas

- Kamus live membedakan SATRESNARKOBA->NARKOBA, SATRESPPADANPPO->PPA. Tidak mengubahnya menjadi Satreskrim.
-69LP milik PolsekHSU pada salinan sumberCAS masihlevelpolsek/unitRESKRIM. Tidak ada penandaHarkamtibmas tepercaya pada master.
- Pemeriksaan agregat nasional tambahan menemukan73400LP dengansourceSATRESNARKOBA (73288ownernamasesuaifungsi;53punyapenanda/riwayatproteksi) dan3089sourceSATRESPPADANPPO (2666ownernamasesuaifungsi;149denganproteksi). Ini bukan bukti semua selisih salahmapping: targetkosong, perubahanmanual, dan penamaan belum diaudit peralamat. Tidak melakukan mutasi nasional atas angka tersebut.
- Pengguna diminta daftarPolsekHarkamtibmas atau satu contoh IDLP yang tujuanDORS terbarunya sudahPolres. Tidak melakukan pembacaan isi kasus atau pemindahan paksa berdasarkan jeniskejahatan.

LP7Jembrana dengan pelimpahaneksternal riil tidakdirollback; di luar koreksi masterini.
