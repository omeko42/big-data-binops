# Perkap & Perpol Pelengkap: Pengelolaan Barang Bukti, SOTK Reserse, Wassidik & PPA-PPO

> Dokumen ini melengkapi `Perkap 6/2019`, `Perkabareskrim 1/2022`, dan `Perpol 8/2021` sebagai **pedoman utama internal Polri** dalam pengelolaan barang bukti, pemisahan SOTK Reserse, pengawasan penyidikan, serta penanganan perkara anak/perempuan.

---

## 1. Pengelolaan Barang Bukti (`Perkap No. 10 Tahun 2010` jo. `Perkap No. 8 Tahun 2014`)
- **Landasan Regulasi**: **Perkap No. 10 Tahun 2010** tentang Tata Cara Pengelolaan Barang Bukti di Lingkungan Polri sebagaimana diubah dengan **Perkap No. 8 Tahun 2014**.
- **Prinsip Utama Pengelolaan BB**:
  1. **Penerimaan & Penelitian**: Setiap barang bukti hasil penyitaan wajib diteliti kesesuaian jumlah, jenis, kondisi, dan dokumen penyitaannya (Surat Perintah Penyitaan & Berita Acara Penyitaan).
  2. **Pencatatan & Pengamanan (TAHTI / Bagtahti / Sattahti)**: Barang bukti dicatat dalam buku register barang bukti, diberi label identitas perkara, dan disimpan di ruang penyimpanan khusus sesuai sifat barang (umum, berharga, berbahaya, mudah rusak, narkotika, kendaraan).
  3. **Status & Tindak Lanjut Barang Bukti**:
     - Barang bukti mudah rusak/berbiaya tinggi dapat dilelang/dimusnahkan atau dititipkan sesuai ketentuan KUHAP dengan penetapan/persetujuan yang sah.
     - Pada saat **Tahap II**, tanggung jawab fisik barang bukti diserahkan kepada Penuntut Umum (JPU).
- **Keterkaitan di Aplikasi CAS (`/cms/laporan/rekap-barang-bukti`)**:
  - Barang bukti dikelompokkan ke dalam **16 kategori induk standar** dengan pemisahan **Jumlah (Numerik)** dan **Satuan (Dropdown Standar Indonesia)**.
  - Data BB yang berasal dari DORS dilindungi aturan **Edit-Only / No-Delete** (tidak boleh dihapus, hanya dilengkapi satuannya bila belum terisi).

---

## 2. SOTK Reserse (`Perkap No. 6 Tahun 2017` jo. `Perpol No. 4 Tahun 2025`)
- **Landasan Organisasi**: Mengatur susunan organisasi dan tata kerja satuan fungsi di lingkungan Polri, termasuk pemekaran dan pemisahan tegas **Korps Reserse** pada `bdb_satker_taxonomy_r11` di CAS:
  1. **`INTERNAL_RESERSE` (Masuk Kinerja Perkara Reserse)**:
     - **Mabes Polri**: Bareskrim Polri (Robinopsnal, Rorenmin/Bagtahti, Rowassidik, Rokorwas PPNS, Direktorat Teknis: *Dittipidum, Dittipideksus, Dittipidter, Dittipidnarkoba, Dittipidsiber, **Dittipid PPA-PPO***, serta Pusat *Puslabfor, Pusiknas, Pusinafis*, dan *Satresmob*).
     - **Polda**: **5 Direktorat Reserse** (`DITKRIMUM`, `DITKRIMSUS`, `DITNARKOBA`, `DITSIBER`, dan `DITPPA-PPO`).
     - **Polres**: `SATRESKRIM`, `SATRESNARKOBA`, dan `SATRES PPA-PPO` (*satker pemekaran sesuai Perpol 4/2025*).
     - **Polsek**: `Unit Reskrim Polsek` (terintegrasi satu kesatuan cakupan dengan induk Polsek).
  2. **`EKSTERNAL_RESERSE` (Dipisahkan Kamarnya dari Kinerja Reserse)**:
     - Unsur non-Reserse seperti **Korlantas / Ditlantas / Satlantas**, **Baharkam (Polairud, Samapta/Sabhara, Binmas, Pamobvit)**, **Intelkam**, **Kortastipidkor**, dan **Densus 88 AT**.
     - LP yang ditangani oleh satuan Eksternal Reserse tidak dihitung dalam CT/CC/CR Kinerja Perkara Reserse kecuali dilimpahkan secara resmi ke unit Reserse.

---

## 3. Pengawasan Penyidikan (Wassidik) & Penanganan Perkara Anak/Perempuan
1. **Pengawasan Penyidikan (Wassidik — Rowassidik Bareskrim / Bagwassidik Ditreskrim Polda)**:
   - Menjalankan fungsi pengawasan melekat dan korektif terhadap pelaksanaan penyidikan, menindaklanjuti komplain masyarakat/kuasa hukum, menyelenggarakan **Gelar Perkara Khusus**, dan memberikan rekomendasi perbaikan administrasi Mindik maupun kepatuhan SLA Perkap 6/2019.
   - Di CAS, atasan penyidik/KBO memantau LP yang melewati ambang batas SLA (Mudah 30 hari, Sedang 60 hari, Sulit 90 hari, Sangat Sulit 120 hari) untuk pencegahan tunggakan perkara.
2. **Penanganan Perkara Anak & Perempuan (`DITPPA-PPO` / `SATRES PPA-PPO`)**:
   - Wajib menerapkan pendekatan berperspektif korban, ruang pelayanan khusus (RPK), pendampingan pekerja sosial/Bapas/orang tua (untuk Anak yang Berhadapan dengan Hukum), serta mengutamakan **Diversi** pada perkara anak sesuai syarat **UU SPPA No. 11 Tahun 2012** (dicatat di CAS sebagai penyelesaian perkara/CC melalui SP2 Lidik / SP3 alasan Diversi).
