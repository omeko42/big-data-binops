import fs from 'fs';

// Full script to build the entire Google Docs style Anev Report into 1s8uqnrz-0f75.patched.js
console.log('Generating complete Anev Report sheets and toolbar...');

// Helper to create sheet container
function renderSheet(pageNum, contentJsx) {
  return `
        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            ${contentJsx}
          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:${pageNum}})
          ]})
        ]})
  `;
}

// SHEET 1: Kop Dinas, Security Stamp, Lambang Reserse, Judul, BAB I PENDAHULUAN (Umum, Maksud, Tujuan, Dasar, Ruang Lingkup, IKU Tabel 1.1)
const sheet1Content = `
            // KOP DINAS & SECURITY STAMP
            (0,t.jsxs)("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[
              (0,t.jsx)("div",{className:"anev-security-stamp",children:"KLASIFIKASI: RAHASIA"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",letterSpacing:"1px",textTransform:"uppercase"},children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA"}),
              (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.90rem",letterSpacing:"0.5px",textTransform:"uppercase"},children:[
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
              ]}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",letterSpacing:"0.5px",textTransform:"uppercase"},children:(0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"})}),
              // Lambang Reserse
              (0,t.jsx)("div",{style:{margin:"10px auto",width:"60px",height:"60px",display:"flex",alignItems:"center",justifyContent:"center",background:"#090d16",borderRadius:"50%",border:"2.5px solid #eab308",color:"#eab308",fontWeight:900,fontSize:"1.4rem",boxShadow:"0 2px 8px rgba(234,179,8,0.25)"},children:"★"}),
              (0,t.jsxs)("div",{style:{fontWeight:900,fontSize:"1.1rem",letterSpacing:"1px",marginTop:"6px"},children:[
                "LAPORAN ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: period}}"})
              ]}),
              (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.92rem"},children:[
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
              ]}),
              (0,t.jsx)("div",{style:{fontWeight:600,fontSize:"0.85rem",color:"#475569"},children:(0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"})}),
              (0,t.jsx)("div",{style:{borderBottom:"2.5px solid #000",marginTop:"12px"}})
            ]}),

            // BAB I PENDAHULUAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB I: PENDAHULUAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Umum"}),
            (0,t.jsxs)("p",{children:[
              "Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: tanggal_awal}}"}),
              " s.d. ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: tanggal_akhir}}"}),
              ", mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              "."
            ]}),
            (0,t.jsx)("p",{children:"Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Maksud dan Tujuan"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"1. Maksud: "}),
              "Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " selama periode yang telah ditentukan."
            ]}),
            (0,t.jsx)("p",{children:(0,t.jsx)("strong",{children:"2. Tujuan: Laporan ini bertujuan untuk:"})}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;"}),
              (0,t.jsx)("li",{children:"Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;"}),
              (0,t.jsxs)("li",{children:[
                "Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                "."
              ]})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"C. Dasar"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang SOTK Mabes Polri / Peraturan Kepolisian Negara Republik Indonesia Nomor 3 Tahun 2024 tentang Perubahan atas Perkap Nomor 14 Tahun 2018 tentang SOTK Polda;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Kamtibmas;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;"}),
              (0,t.jsx)("li",{children:"Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang format Laporan Bulanan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"D. Ruang Lingkup"}),
            (0,t.jsxs)("p",{children:[
              "Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " selama periode ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", meliputi: 1) Data laporan polisi (LP) masuk dan selesai; 2) Penanganan perkara per jenis tindak pidana; 3) Pelaksanaan restorative justice (RJ); 4) Data barang bukti; 5) Kekuatan personel & beban kerja; 6) Kerjasama instansi; 7) Kasus menonjol; 8) Analisis dan evaluasi kinerja."
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"E. Indeks Kinerja Utama (IKU)"}),
            (0,t.jsx)("p",{children:"Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel."}),
            // Tabel 1.1 IKU
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",margin:"8px 0"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"8%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"38%"},children:"Sasaran Strategis"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Indikator Kinerja Utama"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2025"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2026"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2027"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2028"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2029"})
              ]})}),
              (0,t.jsx)("tbody",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"SS2"}),
                (0,t.jsx)("td",{children:"Penegakan Hukum yang Humanis, Akuntabel, dan Berkeadilan (Renstra 2020-2024: Penegakan hukum secara berkeadilan)"}),
                (0,t.jsx)("td",{style:{fontWeight:600},children:"3. Indeks Gakkum Polri"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,6"}),
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:"3,7"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,8"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,9"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"4,0"})
              ]})})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 1.1: Indikator Kinerja Utama Indeks Gakkum Polri"}),
            (0,t.jsx)("p",{children:"Target Indeks Kinerja Utama (IKU) ini bersifat tahunan dan digunakan sebagai dasar dalam mengevaluasi kinerja satker fungsi Reserse secara berjenjang. Penilaian terhadap pencapaian IKU dilakukan melalui pengukuran berbasis data yang bersumber dari Crime Analytic System (CAS) yang mengelola data secara otomatis dan real-time."})
`;

// SHEET 2: BAB II TUGAS YANG DILAKSANAKAN (Tugas Utama, Manajemen Operasional SDM, Anggaran, Sarpras, Tahanan Tabel 1.8, Barang Bukti Tabel 1.9)
const sheet2Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB II: TUGAS YANG DILAKSANAKAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tugas Utama"}),
            (0,t.jsxs)("p",{children:[
              "Selama periode pelaporan ini, ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " melaksanakan tugas pokok dan fungsi di bidang reserse kriminal sesuai dengan ketentuan yang berlaku. Tugas-tugas tersebut mencakup kegiatan penyelidikan, penyidikan, pelaksanaan gelar perkara, penegakan hukum, serta kegiatan operasional terpadu lainnya."
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Manajemen Operasional"}),
            (0,t.jsx)("p",{children:"Pelaksanaan tugas operasional ditunjang oleh ketersediaan sumber daya manusia (SDM), anggaran belanja, serta sarana dan prasarana (sarpras) yang dikelola secara efektif dan efisien guna mewujudkan pelayanan prima kepolisian."}),
            
            (0,t.jsxs)("div",{style:{paddingLeft:"0.8rem"},children:[
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "1. Sumber Daya Manusia (SDM): ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Kekuatan personel pengemban fungsi reserse kriminal saat ini tercatat siap operasional dengan tingkat pemenuhan DSP 89% dan rasio beban kerja terdistribusi proporsional. Seluruh penyidik aktif didorong meningkatkan kompetensi melalui sertifikasi profesi."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "2. Anggaran Belanja: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Penggunaan anggaran belanja selama periode pelaporan terbagi dalam Belanja Pegawai, Belanja Barang, dan Belanja Modal. Penyerapan anggaran penyelidikan dan penyidikan terealisasi sesuai rencana penarikan dana operasional tanpa kendala administratif."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "3. Sarana dan Prasarana: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum, kendaraan dinas taktis R4/R2, alat komunikasi HT terenkripsi, unit PC/laptop operasional CAS, mobile forensic kit, serta ruang riksa dan ruang tahanan berada dalam kondisi laik pakai dan memenuhi standar pelayanan presisi."})
              ]})})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"C. Tahanan dan Barang Bukti"}),
            (0,t.jsx)("p",{children:"Pengelolaan tahanan dan barang bukti selama periode pelaporan dijabarkan secara kuantitatif berdasarkan kategori dan jenisnya:"}),
            
            // Tabel 1.8 Tahanan
            (0,t.jsx)("p",{style:{fontWeight:700,marginBottom:"3px"},children:"1. Rekapitulasi Jumlah Tahanan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"34%",textAlign:"left"},children:"Jenis Tahanan"}),
                  (0,t.jsx)("th",{colSpan:3,children:"Jumlah Tahanan"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Total"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"18%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Awal"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Masuk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Keluar"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),
                  (0,t.jsx)("td",{colSpan:6,children:"Tahanan Satuan Kerja"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{children:"Dewasa (Laki-laki)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"18"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"7"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"20"}),
                  (0,t.jsx)("td",{children:"Rutan Satker"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{children:"Dewasa (Perempuan)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"3"}),
                  (0,t.jsx)("td",{children:"Rutan Satker"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{children:"Anak Berhadapan Hukum (ABH)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"0"}),
                  (0,t.jsx)("td",{children:"Diversi / Bapas"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),
                  (0,t.jsx)("td",{colSpan:6,children:"Titipan Instansi / K / L"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{children:"Titipan Kejaksaan / Pengadilan"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"2"}),
                  (0,t.jsx)("td",{children:"Tahap II / Sidang"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"GRAND TOTAL TAHANAN"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"24"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"9"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"8"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Tertib & Aman"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"8px"},children:"Tabel 1.8: Jumlah Tahanan"}),

            // Tabel 1.9 Barang Bukti
            (0,t.jsx)("p",{style:{fontWeight:700,marginBottom:"3px"},children:"2. Rekapitulasi Jenis dan Jumlah Barang Bukti"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"40%",textAlign:"left"},children:"Jenis Barang Bukti"}),
                (0,t.jsx)("th",{style:{width:"18%"},children:"Jumlah"}),
                (0,t.jsx)("th",{style:{width:"16%"},children:"Satuan"}),
                (0,t.jsx)("th",{style:{width:"20%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),
                  (0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bergerak"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{children:"Kendaraan Bermotor (Roda 2 / Roda 4)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"14"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Unit"}),
                  (0,t.jsx)("td",{children:"Gudang BB"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{children:"Perangkat Elektronik (HP / Laptop / Tablet)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"28"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Unit"}),
                  (0,t.jsx)("td",{children:"Uji Labfor"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{children:"Senjata Tajam & Senpi Rakitan"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Pucuk/Bilah"}),
                  (0,t.jsx)("td",{children:"Ruang Khusus BB"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),
                  (0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Finansial & Digital"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{children:"Uang Tunai / Valuta Asing"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"385.000.000"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),
                  (0,t.jsx)("td",{children:"Rekening Penitipan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{children:"Dokumen Digital, CCTV & Rekaman Media"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"16"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Berkas/Flashdisk"}),
                  (0,t.jsx)("td",{children:"Penyidikan CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic"},children:"Tabel 1.9: Jenis dan Jumlah Barang Bukti"})
`;

// SHEET 3: Kerjasama, Analisis Data Operasional Apple-to-Apple, Tabel 2.1 Data Kejahatan Periode Sebelumnya
const sheet3Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",children:"D. Kerjasama yang Dilaksanakan"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan, satuan kerja telah aktif melaksanakan koordinasi dan kerja sama strategis serta taktis operasional bersama mitra Criminal Justice System (CJS) seperti Kejaksaan Negeri, Pengadilan Negeri, Balai Pemasyarakatan (Bapas), Pusat Pelaporan dan Analisis Transaksi Keuangan (PPATK), serta perbankan guna percepatan pembuktian perkara dan pemulihan aset korban kejahatan."}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"E. Analisis dan Evaluasi terhadap Pelaksanaan Tugas"}),
            (0,t.jsx)("p",{children:"Analisis dan evaluasi ini disusun berdasarkan data operasional yang terintegrasi secara real-time melalui Crime Analytic System (CAS). Evaluasi dilakukan dengan pendekatan kuantitatif dan komparatif, membandingkan indikator kinerja antara periode pelaporan saat ini dengan periode sebelumnya yang setara (apple to apple) guna memastikan akurasi pemetaan kriminologi dan efektivitas langkah penegakan hukum."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"1. Analisis Data Kejahatan Periode Sebelumnya"}),
            (0,t.jsx)("p",{children:"Data perkara kejahatan pada periode sebelumnya digunakan sebagai baseline perbandingan kinerja operasional penegakan hukum, dengan rincian sebagai berikut:"}),

            // Tabel 2.1 Data Kejahatan Periode Sebelumnya
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"33%",textAlign:"left"},children:"Jenis Kejahatan / Tindak Pidana"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Lapor (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Selesai (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (reportData?.kamtibmas?.appleToApple && reportData.kamtibmas.appleToApple.length > 0) ? (
                  reportData.kamtibmas.appleToApple.slice(0, 10).map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama || ("Jenis Kejahatan " + (idx + 1))}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_prev || 0) * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_prev || 0) * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_prev || 0) * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_prev || 0) * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:(row.cr_prev || (row.ct_prev > 0 ? Math.round(((row.cc_prev||0)/(row.ct_prev||1))*100) : 0)) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Rutin"})
                    ]})
                  ))
                ) : (
                  [
                    { nama: "Pencurian dengan Pemberatan (Curat)", ct_prev: 42, cc_prev: 35 },
                    { nama: "Penipuan / Penggelapan Daring", ct_prev: 38, cc_prev: 28 },
                    { nama: "Pencurian Kendaraan Bermotor (Curanmor)", ct_prev: 29, cc_prev: 21 },
                    { nama: "Penyalahgunaan Narkotika", ct_prev: 26, cc_prev: 26 },
                    { nama: "Penganiayaan Berat (Anirat)", ct_prev: 18, cc_prev: 16 },
                    { nama: "Tindak Pidana ITE / Pencemaran", ct_prev: 15, cc_prev: 11 },
                    { nama: "Pencurian dengan Kekerasan (Curas)", ct_prev: 12, cc_prev: 10 },
                    { nama: "Tindak Pidana Lingkungan / Tipiter", ct_prev: 8, cc_prev: 6 }
                  ].map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_prev * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_prev * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_prev * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_prev * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:Math.round((row.cc_prev / row.ct_prev) * 100) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Rutin"})
                    ]})
                  ))
                ),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH TOTAL PERIODE SEBELUMNYA"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.prev || 188) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.prev || 188) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.prev || 153) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.prev || 153) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.ratePrev || "81.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Data CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"8px"},children:"Tabel 2.1: Data Kejahatan Periode Sebelumnya"}),
            (0,t.jsx)("p",{children:"Data pada Tabel 2.1 mencerminkan beban perkara tunggakan maupun perkara berjalan pada periode lalu. Penanganan perkara diprioritaskan pada tindak pidana yang meresahkan masyarakat serta perkara transnasional berbasis digital."})
`;

// SHEET 4: Tabel 2.2 Data Kejahatan Periode Ini, Gambar 1.1 Grafik Tren (SVG), Narasi Analisis Perbandingan
const sheet4Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",children:"2. Analisis Data Kejahatan Periode Saat Ini"}),
            (0,t.jsx)("p",{children:"Data tindak pidana yang dilaporkan dan diselesaikan pada periode pelaporan berjalan disajikan pada tabel berikut:"}),

            // Tabel 2.2 Data Kejahatan Periode Ini
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"33%",textAlign:"left"},children:"Jenis Kejahatan / Tindak Pidana"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Lapor (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Selesai (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (reportData?.kamtibmas?.appleToApple && reportData.kamtibmas.appleToApple.length > 0) ? (
                  reportData.kamtibmas.appleToApple.slice(0, 10).map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama || ("Jenis Kejahatan " + (idx + 1))}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_curr || 0) * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_curr || 0) * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_curr || 0) * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_curr || 0) * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:(row.cr_curr || (row.ct_curr > 0 ? Math.round(((row.cc_curr||0)/(row.ct_curr||1))*100) : 0)) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Terkendali"})
                    ]})
                  ))
                ) : (
                  [
                    { nama: "Pencurian dengan Pemberatan (Curat)", ct_curr: 36, cc_curr: 32 },
                    { nama: "Penipuan / Penggelapan Daring", ct_curr: 45, cc_curr: 36 },
                    { nama: "Pencurian Kendaraan Bermotor (Curanmor)", ct_curr: 24, cc_curr: 20 },
                    { nama: "Penyalahgunaan Narkotika", ct_curr: 29, cc_curr: 29 },
                    { nama: "Penganiayaan Berat (Anirat)", ct_curr: 14, cc_curr: 13 },
                    { nama: "Tindak Pidana ITE / Pencemaran", ct_curr: 18, cc_curr: 15 },
                    { nama: "Pencurian dengan Kekerasan (Curas)", ct_curr: 9, cc_curr: 8 },
                    { nama: "Tindak Pidana Lingkungan / Tipiter", ct_curr: 7, cc_curr: 6 }
                  ].map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_curr * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_curr * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_curr * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_curr * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:Math.round((row.cc_curr / row.ct_curr) * 100) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Terkendali"})
                    ]})
                  ))
                ),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH TOTAL PERIODE SAAT INI"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.current || 182) * 0.25)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.current || 182) * 0.75)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.current || 159) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.current || 159) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Data CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"10px"},children:"Tabel 2.2: Data Kejahatan Periode Saat Ini"}),

            // GAMBAR 1.1 GRAFIK TREN KEJAHATAN (SVG VECTOR BERKUALITAS TINGGI)
            (0,t.jsx)("div",{className:"anev-sub-title",children:"3. Perbandingan Grafis Data Kejahatan"}),
            (0,t.jsxs)("div",{style:{background:"#f8fafc",border:"1.5px solid #cbd5e1",borderRadius:"6px",padding:"12px",margin:"6px 0",textAlign:"center"},children:[
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.80rem",color:"#1e293b",marginBottom:"8px"},children:"Gambar 1.1: Grafik Perbandingan Tren Jumlah Kasus Tindak Pidana"}),
              // Vector SVG Chart
              (0,t.jsxs)("svg",{viewBox:"0 0 650 160",style:{width:"100%",maxHeight:"160px"},children:[
                // Grid lines & labels
                (0,t.jsx)("line",{x1:"50",y1:"20",x2:"620",y2:"20",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"60",x2:"620",y2:"60",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"100",x2:"620",y2:"100",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"130",x2:"620",y2:"130",stroke:"#94a3b8",strokeWidth:"1.5"}),
                (0,t.jsx)("text",{x:"25",y:"24",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"200"}),
                (0,t.jsx)("text",{x:"25",y:"64",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"100"}),
                (0,t.jsx)("text",{x:"25",y:"104",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"50"}),
                (0,t.jsx)("text",{x:"25",y:"134",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"0"}),
                // Group 1: CT
                (0,t.jsx)("rect",{x:"110",y:"32",width:"38",height:"98",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"129",y:"26",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                (0,t.jsx)("rect",{x:"152",y:"36",width:"38",height:"94",fill:"#2563eb",rx:"3"}),
                (0,t.jsx)("text",{x:"171",y:"30",fontSize:"10",fontWeight:"bold",fill:"#1d4ed8",textAnchor:"middle",children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                (0,t.jsx)("text",{x:"150",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Crime Total (CT)"}),
                // Group 2: CC
                (0,t.jsx)("rect",{x:"280",y:"54",width:"38",height:"76",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"299",y:"48",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:String(reportData?.kamtibmas?.cc?.prev || 153)}),
                (0,t.jsx)("rect",{x:"322",y:"51",width:"38",height:"79",fill:"#16a34a",rx:"3"}),
                (0,t.jsx)("text",{x:"341",y:"45",fontSize:"10",fontWeight:"bold",fill:"#15803d",textAnchor:"middle",children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                (0,t.jsx)("text",{x:"320",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Crime Clearance (CC)"}),
                // Group 3: Restorative Justice (RJ)
                (0,t.jsx)("rect",{x:"450",y:"106",width:"38",height:"24",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"469",y:"100",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:"22"}),
                (0,t.jsx)("rect",{x:"492",y:"98",width:"38",height:"32",fill:"#ea580c",rx:"3"}),
                (0,t.jsx)("text",{x:"511",y:"92",fontSize:"10",fontWeight:"bold",fill:"#c2410c",textAnchor:"middle",children:"31"}),
                (0,t.jsx)("text",{x:"490",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Penyelesaian RJ"}),
                // Legend
                (0,t.jsx)("rect",{x:"230",y:"2",width:"12",height:"10",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("text",{x:"248",y:"11",fontSize:"10",fill:"#475569",children:"Periode Sebelumnya"}),
                (0,t.jsx)("rect",{x:"360",y:"2",width:"12",height:"10",fill:"#2563eb",rx:"2"}),
                (0,t.jsx)("text",{x:"378",y:"11",fontSize:"10",fill:"#1e293b",fontWeight:"bold",children:"Periode Saat Ini"})
              ]})
            ]}),

            // NARASI ANALISIS PERBANDINGAN KOMPREHENSIF
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"4. Narasi Analisis Komparasi Antarperiode"}),
            (0,t.jsxs)("div",{style:{lineHeight:"1.45"},children:[
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"a. Jumlah Tunggakan Tindak Pidana (KP): "}),
                "Terjadi penanganan terhadap tunggakan tindak pidana secara progresif. Tunggakan yang berhasil diselesaikan pada periode berjalan mencakup perkara pembuktian digital dan pemeriksaan saksi lintas wilayah."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"b. Jumlah Tindak Pidana (KM): "}),
                "Jumlah kejahatan yang dilaporkan tercatat ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                " perkara, mengalami penurunan sebesar ",
                (0,t.jsx)("strong",{children:String(Math.abs(reportData?.kamtibmas?.ct?.delta || -6))}),
                " perkara (",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.pct || "-3.2")}),
                "%) dibandingkan periode sebelumnya sebanyak ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                " perkara."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"c. Jumlah Penyelesaian Tindak Pidana (KB & KT): "}),
                "Penyelesaian tindak pidana mencapai ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                " perkara dengan Clearance Rate sebesar ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                ", meningkat sebesar +6.0% dibandingkan periode sebelumnya (81.4%)."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"d. Persentase Penanganan Tindak Pidana (Rumus): "}),
                (0,t.jsx)("code",{style:{background:"#eff6ff",padding:"2px 6px",borderRadius:"4px",color:"#1d4ed8",fontWeight:700},children:"X = (KB + KT) : (KM + KP) x 100%"}),
                " = ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                " (Kategori Kinerja: Sangat Efektif)."
              ]})
            ]})
`;

// SHEET 5: Penanganan RJ (Tabel 2.3), Analisis Beban Kinerja (Tabel 2.4), Narasi Analisis Beban Kinerja
const sheet5Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"F. Penanganan Tindak Pidana melalui Restorative Justice (RJ)"}),
            (0,t.jsx)("p",{children:"Penanganan perkara dengan pendekatan Restorative Justice (RJ) merupakan salah satu upaya penyelesaian tindak pidana melalui proses mediasi penal antara para pihak terkait guna memulihkan keadaan semula, menjamin kepastian hukum, dan rasa keadilan di tengah masyarakat sesuai Perpol No. 8 Tahun 2021."}),
            (0,t.jsx)("p",{children:"Pada periode pelaporan ini, telah dilaksanakan penyelesaian perkara melalui Restorative Justice terhadap sejumlah tindak pidana sebagai berikut:"}),

            // Tabel 2.3 RJ
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"35%",textAlign:"left"},children:"Jenis Tindak Pidana"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Crime Total"}),
                  (0,t.jsx)("th",{colSpan:3,children:"Selesai Melalui RJ"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"7%"},children:"Lid"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"Sid"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"Tot"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { tipid: "Pencurian Ringan (Tipiring / Ps 364)", ct: 18, lid: 8, sid: 10, tot: 18, pct: "100%" },
                  { tipid: "Penipuan & Penggelapan Keluarga", ct: 16, lid: 5, sid: 7, tot: 12, pct: "75.0%" },
                  { tipid: "Penganiayaan Ringan (Ps 352 KUHP)", ct: 12, lid: 6, sid: 4, tot: 10, pct: "83.3%" },
                  { tipid: "Kekerasan Dalam Rumah Tangga (KDRT)", ct: 8, lid: 3, sid: 4, tot: 7, pct: "87.5%" },
                  { tipid: "Pencemaran Nama Baik / UU ITE", ct: 11, lid: 4, sid: 5, tot: 9, pct: "81.8%" },
                  { tipid: "Perusakan Barang / Perselisihan Lingkungan", ct: 6, lid: 2, sid: 3, tot: 5, pct: "83.3%" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{children:row.tipid}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.ct}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.lid}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.sid}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:row.tot}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:row.pct}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:"Akta Perdamaian"})
                  ]})
                )),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH PENYELESAIAN RJ"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"71"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"28"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"33"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"61"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"85.9%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Keadilan Restoratif"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 2.3: Penanganan Tindak Pidana Melalui RJ"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"Efektivitas RJ: "}),
              "Berdasarkan analisis data pada Tabel 2.3, satuan kerja mampu menyelesaikan 61 perkara melalui RJ dari total 71 perkara yang diajukan (tingkat efektivitas 85.9%). Penerapan RJ terbukti sangat efektif menekan penumpukan perkara di pengadilan, mengurangi beban over-capacity lembaga pemasyarakatan, serta mengembalikan keharmonisan sosial para pihak yang berperkara."
            ]}),

            // ANALISIS BEBAN KINERJA
            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"G. Analisis Beban Kinerja Personel"}),
            (0,t.jsx)("p",{children:"Analisis beban kinerja dilakukan untuk mengukur tingkat beban kerja berdasarkan jumlah perkara yang ditangani dibandingkan dengan jumlah personel penyidik yang tersedia pada periode pelaporan secara apple to apple dengan periode sebelumnya."}),

            // Tabel 2.4 Beban Kinerja
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Periode"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"CT"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"CC"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"CR (%)"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"Jml Agt"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Ratio LP/Agt"}),
                (0,t.jsx)("th",{style:{width:"16%"},children:"Beban Kinerja (%)"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Periode Sebelumnya"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.cc?.prev || 153)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:(reportData?.kamtibmas?.cc?.ratePrev || "81.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"24"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 7.8"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"65.0%"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Periode Saat Ini"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 7.3"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#15803d"},children:"60.8%"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"RATA-RATA / STANDAR IDEAL"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"185"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"156"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"84.4%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 12.0"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"100% (Batas Ideal)"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 2.4: Analisis Beban Kinerja"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"Analisis Narasi Beban Kinerja: "}),
              "Berdasarkan data pada Tabel 2.4, rasio rata-rata beban penanganan perkara per penyidik tercatat sebesar 1 : 7.3 perkara dalam periode pelaporan. Nilai ini berada pada 60.8% dari standar beban maksimal yang ditetapkan institusi (standar ideal 1 : 12 perkara per penyidik per periode). Dengan demikian, beban kerja personel penyidik saat ini masih berada dalam batas ideal yang sehat, memungkinkan para penyidik berfokus pada kualitas pembuktian materiil, kepatuhan SOP gelar perkara, serta pemenuhan target P-21 secara akuntabel."
            ]})
`;

// SHEET 6: Evaluasi Pelaksanaan Tugas (Tren Kejahatan, Efektivitas CC, Optimalisasi RJ, Beban Personel, Sarpras, Kesimpulan Umum)
const sheet6Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"H. Evaluasi Pelaksanaan Tugas"}),
            (0,t.jsxs)("p",{children:[
              "Berdasarkan data hasil analisis komparatif pada periode ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " telah menangani total ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.current || 182)}),
              " perkara (Crime Total/CT) dengan tingkat penyelesaian (Crime Clearance/CC) sebanyak ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.current || 159)}),
              " perkara atau tingkat penyelesaian ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
              "."
            ]}),

            (0,t.jsxs)("div",{style:{paddingLeft:"0.6rem"},children:[
              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"1. Tren Kejahatan"}),
              (0,t.jsxs)("p",{children:[
                "Dibandingkan periode sebelumnya, jumlah laporan kejahatan mengalami penurunan sebesar ",
                (0,t.jsx)("strong",{children:String(Math.abs(reportData?.kamtibmas?.ct?.delta || -6))}),
                " perkara (",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.pct || "-3.2")}),
                "%). Penurunan ini terutama dipengaruhi oleh intensitas patroli siber preventif dan penindakan tegas terhadap sindikat pencurian pemberatan konvensional. Di sisi lain, tren penipuan daring berbasis rekayasa sosial (social engineering) tetap memerlukan atensi deteksi dini berkelanjutan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"2. Efektivitas Penyelesaian Perkara"}),
              (0,t.jsxs)("p",{children:[
                "Tingkat penyelesaian perkara (Clearance Rate) mencapai ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                ", lebih tinggi +6.0% dibandingkan periode sebelumnya (81.4%). Kinerja ini telah melampaui target Renstra nasional Polri (standar minimal 75%), sehingga perlu dipertahankan melalui supervisi berkala terhadap berkas perkara bolak-balik (P-19) agar cepat terpenuhi menjadi P-21."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"3. Optimalisasi Keadilan Restoratif (RJ)"}),
              (0,t.jsxs)("p",{children:[
                "Penyelesaian perkara melalui mekanisme Restorative Justice mencapai 61 perkara atau 38.4% dari total perkara yang diselesaikan. Optimalisasi ini mencerminkan komitmen penegakan hukum humanis Polri yang mengedepankan pemulihan hak korban serta perdamaian yang berkelanjutan tanpa menafikan kepastian hukum."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"4. Beban Kinerja Personel"}),
              (0,t.jsxs)("p",{children:[
                "Kekuatan personel penyidik dan penyidik pembantu aktif menghasilkan rasio beban kerja rata-rata 1 : 7.3 perkara. Kondisi ini masih berada di bawah ambang batas beban maksimal (1 : 12 perkara), sehingga penyidik memiliki ruang gerak yang sangat leluasa untuk menjaga integritas dan ketelitian proses pembuktian di pengadilan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"5. Sumber Daya dan Dukungan Operasional"}),
              (0,t.jsxs)("p",{children:[
                "Sarana dan prasarana penunjang operasional penyidikan dalam kondisi laik pakai. Dukungan logistik, BBM dinas, perlengkapan olah TKP, serta perangkat digital forensik mobile telah mencukupi kebutuhan penanganan tindak pidana lapangan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"6. Kesimpulan Umum Pelaksanaan Tugas"}),
              (0,t.jsxs)("p",{children:[
                "Secara umum pelaksanaan tugas fungsi reserse pada periode pelaporan telah berjalan dengan sangat baik dan kondusif. Stabilitas kamtibmas terjaga, penyelesaian perkara menunjukkan tren positif, dan kepercayaan masyarakat terhadap transparansi proses penyidikan terus meningkat."
              ]})
            ]})
`;

// SHEET 7: Monitoring Kasus Menonjol (Internal & Media Massa), Tugas Lainnya
const sheet7Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"I. Monitoring Kasus Menonjol & Perhatian Masyarakat"}),
            (0,t.jsx)("p",{children:"Monitoring terhadap perkara atensi pimpinan maupun perkara yang viral dan menjadi sorotan publik dilakukan secara ketat guna memastikan penanganan berjalan transparan, profesional, dan akuntabel sesuai asas presisi."}),

            // 1. Kasus Internal / Pimpinan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"1. Perkara Menonjol dalam Pengawasan Internal / Atensi Pimpinan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"25%",textAlign:"left"},children:"Judul / Uraian Kasus"}),
                (0,t.jsx)("th",{style:{width:"20%"},children:"Nomor LP"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Tindakan Terakhir"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"Status"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { judul: "Sindikat Curanmor Lintas Wilayah", lp: "LP/B/241/IX/2026/SPKT", aksi: "Penangkapan 4 Tsk & Sita 8 R2", status: "Penyidikan (Tahap I)", ket: "Atensi Kapolda" },
                  { judul: "Penipuan Investasi Fiktif Berkedok Koperasi", lp: "LP/B/258/IX/2026/SPKT", aksi: "Pemeriksaan Saksi Ahli OJK & PPATK", status: "Penetapan Tsk", ket: "Gelar Khusus" },
                  { judul: "Penyalahgunaan Narkoba Skala Menengah", lp: "LP/A/89/IX/2026/SPKT", aksi: "Penyitaan 450 gr Sabu & Uji Lab", status: "P-21", ket: "Pelimpahan JPU" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{style:{fontWeight:600},children:row.judul}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontFamily:"monospace"},children:row.lp}),
                    (0,t.jsx)("td",{children:row.aksi}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:row.status}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.ket})
                  ]})
                ))
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"12px"},children:"Tabel 2.5: Rekapitulasi Kasus Menonjol Atensi Internal"}),

            // 2. Kasus Media Massa / Viral
            (0,t.jsx)("div",{className:"anev-sub-title",children:"2. Perkara yang Menjadi Perhatian Publik melalui Media Massa & Media Sosial"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"25%",textAlign:"left"},children:"Isu / Judul Kasus"}),
                (0,t.jsx)("th",{style:{width:"18%"},children:"Saluran Media"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Sentimen"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Tindak Lanjut & Humas"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Status"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { isu: "Aksi Begal di Kawasan Lingkar Barat", media: "Instagram & X (Twitter)", sentimen: "Resah / Tuntutan Gerak", respon: "Konferensi Pers & Tangkap Pelaku < 24 Jam", status: "Kondusif" },
                  { isu: "Sengketa Lahan Melibatkan Ormas", media: "Media Online & TikTok", sentimen: "Memanas / Provokatif", respon: "Mediasi Terbuka & Gandeng Tokoh Agama", status: "Selesai RJ" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{style:{fontWeight:600},children:row.isu}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.media}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:"#b45309"},children:row.sentimen}),
                    (0,t.jsx)("td",{children:row.respon}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#15803d"},children:row.status})
                  ]})
                ))
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"12px"},children:"Tabel 2.6: Rekapitulasi Kasus Viral & Respon Media Publik"}),

            // 3. Tugas Lainnya
            (0,t.jsx)("div",{className:"anev-sub-title",children:"J. Pelaksanaan Tugas Lainnya"}),
            (0,t.jsx)("p",{children:"Selain tugas rutin penegakan hukum, satuan kerja melaksanakan kegiatan kolaboratif lintas sektor bersama instansi pemerintah, BUMN, kementerian, dan lembaga:"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Pelaksanaan kegiatan bersama Dinas Pertanian dan Kelompok Tani dalam rangka program ketahanan pangan nasional penanaman jagung dan padi terpadu seluas 45 hektar;"}),
              (0,t.jsx)("li",{children:"Operasi gabungan bersama Balai POM dan Bea Cukai dalam pengawasan peredaran obat-obatan tanpa izin edar dan barang impor ilegal di jalur logistik daerah;"}),
              (0,t.jsx)("li",{children:"Bimbingan penyuluhan hukum preventif pencegahan kenakalan remaja dan bahaya judi online pada sekolah-sekolah menengah serta komunitas pemuda kewilayahan."})
            ]})
`;

// SHEET 8: BAB III Hasil Yang Dicapai, Faktor Yang Mempengaruhi, BAB IV Kesimpulan Dan Saran
const sheet8Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB III: HASIL YANG DICAPAI"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Capaian Prestasi & Apresiasi"}),
            (0,t.jsxs)("p",{children:[
              "Selama periode pelaporan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " telah mencapai sejumlah prestasi dan hasil signifikan dalam penegakan hukum, antara lain:"
            ]}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Penyelesaian perkara mencapai tingkat Clearance Rate 87.4%, berada di atas rata-rata target kinerja nasional Polri;"}),
              (0,t.jsx)("li",{children:"Penyelamatan potensi kerugian keuangan masyarakat senilai lebih dari Rp 1.850.000.000,- melalui pemblokiran rekening penipuan daring cepat;"}),
              (0,t.jsx)("li",{children:"Menerima piagam penghargaan dan apresiasi dari pimpinan daerah serta paguyuban warga atas pengungkapan cepat kasus pencurian dengan kekerasan tanpa menimbulkan korban jiwa;"}),
              (0,t.jsx)("li",{children:"Nol pelanggaran disiplin dan kode etik profesi penyidik selama pelaksanaan proses penyelidikan dan penyidikan pada periode pelaporan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Faktor yang Mempengaruhi"}),
            (0,t.jsxs)("div",{style:{paddingLeft:"0.6rem"},children:[
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "1. Faktor Pendukung Keberhasilan: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Soliditas kepemimpinan operasional berjenjang, pemanfaatan sistem analitik Crime Analytic System (CAS) secara disiplin oleh operator, koordinasi harmonis dengan CJS (Kejaksaan/Pengadilan), serta peran aktif masyarakat dalam pelaporan dini melalui layanan Call Center 110."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "2. Faktor Kendala yang Dihadapi: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Karakteristik kejahatan siber yang semakin canggih menggunakan akun nominee dan kripto terdesentralisasi, lamanya proses pemenuhan petunjuk saksi ahli tertentu, serta kendala geografis cuaca pada beberapa Polsek jajaran terjauh."})
              ]})})
            ]}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1.2rem"},children:"BAB IV: KESIMPULAN DAN SARAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Kesimpulan"}),
            (0,t.jsxs)("p",{children:[
              "1. Berdasarkan data analitik operasional CAS, stabilitas kamtibmas di wilayah hukum ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " terpelihara secara prima, aman, dan terkendali."
            ]}),
            (0,t.jsx)("p",{children:"2. Kinerja penegakan hukum menunjukkan efektivitas tinggi dengan penurunan jumlah kejadian tindak pidana sebesar -3.2% dan peningkatan Clearance Rate hingga mencapai 87.4%."}),
            (0,t.jsx)("p",{children:"3. Pendekatan keadilan restoratif (RJ) berjalan efektif sebagai instrumen humanis dalam menyelesaikan 61 perkara tanpa mengurangi wibawa hukum."}),
            (0,t.jsx)("p",{children:"4. Manajemen SDM, sarpras, dan anggaran berada dalam kondisi seimbang dan mendukung penuh kelancaran operasional lidik/sidik."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Saran"}),
            (0,t.jsx)("p",{children:"1. Kepada Pimpinan Tingkat Atas: Diusulkan penambahan alokasi pelatihan sertifikasi digital forensics dan investigasi TPPU bagi penyidik muda kewilayahan guna menjawab eskalasi kejahatan berbasis internet."}),
            (0,t.jsx)("p",{children:"2. Kepada Satuan Kerja Jajaran: Agar senantiasa mempercepat asistensi gelar perkara berkala, memperketat pengawasan administrasi penyidikan, serta mendokumentasikan setiap tahapan SP2HP secara transparan kepada pelapor."}),
            (0,t.jsx)("p",{children:"3. Penguatan integrasi pemutakhiran data operasional pada Crime Analytic System (CAS) secara tertib waktu guna mendukung keakuratan pengambilan kebijakan pimpinan."})
`;

// SHEET 9: BAB V Penutup & Lembar Tanda Tangan Resmi Dinas Lengkap
const sheet9Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB V: PENUTUP"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Rencana Tindak Lanjut"}),
            (0,t.jsx)("p",{children:"Guna mempertahankan capaian kinerja dan memperbaiki kekurangan pada periode mendatang, disusun rencana tindak lanjut strategis:"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 8px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Menggelar operasi kepolisian kewilayahan mandiri terfokus pada kejahatan 3C (Curat, Curas, Curanmor) dan kejahatan siber;"}),
              (0,t.jsx)("li",{children:"Mempercepat penyelesaian berkas perkara tunggakan melalui pendampingan gelar perkara asistensi di tingkat Polda/Mabes;"}),
              (0,t.jsx)("li",{children:"Mengoptimalkan koordinasi pra-penuntutan dengan Jaksa Penuntut Umum guna menekan pengembalian berkas P-19 berulang;"}),
              (0,t.jsx)("li",{children:"Meningkatkan transparansi pelayanan dengan menyajikan laporan progres penyidikan (SP2HP) secara online kepada pelapor."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Penutup"}),
            (0,t.jsxs)("p",{children:[
              "Demikian Laporan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: period}}"}),
              " Pembinaan Operasional ini dibuat berdasarkan data dan sebagaimana hasil analisis yang ada untuk kemudian dapat menjadi bahan masukan kepada pimpinan dalam perumusan kebijakan pembinaan dan operasional kepolisian berikutnya."
            ]}),

            // LEMBAR PENGESAHAN / TANDA TANGAN DINAS RESMI (KOTAK PANDUAN INTERAKTIF & EDITABLE)
            (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:"3rem",marginBottom:"1.5rem",pageBreakInside:"avoid"},children:[
              // Kiri: Catatan Lampiran
              (0,t.jsxs)("div",{style:{fontSize:"0.80rem",color:"#475569",lineHeight:"1.5"},children:[
                (0,t.jsx)("div",{style:{fontWeight:700,color:"#0f172a"},children:"Lampiran:"}),
                (0,t.jsx)("div",{children:"1. Rekapitulasi Data Kasus CAS"}),
                (0,t.jsx)("div",{children:"2. Matriks Indikator Kinerja Jajaran"}),
                (0,t.jsx)("div",{children:"3. Dokumentasi Giat Operasional"}),
                (0,t.jsx)("div",{style:{fontStyle:"italic",marginTop:"4px"},children:"dan seterusnya."})
              ]}),

              // Kanan: Blok Tanda Tangan
              (0,t.jsxs)("div",{style:{width:"350px",textAlign:"center",fontSize:"0.84rem",lineHeight:"1.4"},children:[
                // 1. Kotak Tempat & Tanggal
                (0,t.jsx)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatTempatTanggal(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Tempat & Tanggal",
                  style:{fontWeight:600,color:"#0f172a",marginBottom:"8px"},
                  children:pejabatTempatTanggal || ("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))
                }),
                // 2. Kotak a.n. Jabatan
                (0,t.jsxs)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatJabatan(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Jabatan",
                  style:{fontWeight:800,fontSize:"0.86rem",lineHeight:"1.35",color:"#0f172a",textTransform:"uppercase"},
                  children:[
                    "a.n. KEPALA ", (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
                    (0,t.jsx)("br",{}),
                    (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}), " ", (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
                  ]
                }),
                // 3. Ruang Tanda Tangan (~65px)
                (0,t.jsxs)("div",{
                  className:"anev-guide-space-box",
                  style:{height:"68px",display:"flex",alignItems:"center",justifyContent:"center",margin:"6px 0"},
                  children:[
                    (0,t.jsx)("span",{
                      className:"anev-no-print",
                      style:{fontSize:"0.68rem",color:"#94a3b8",fontStyle:"italic",border:"1px dashed #cbd5e1",borderRadius:"4px",padding:"4px 14px",background:"#f8fafc",letterSpacing:"0.3px"},
                      children:"(Ruang Tanda Tangan & Cap Dinas ~65px)"
                    })
                  ]
                }),
                // 4. Kotak Nama Lengkap Penandatangan (Underline)
                (0,t.jsx)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatNama(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Nama Lengkap Penandatangan",
                  style:{fontWeight:900,fontSize:"0.88rem",textDecoration:"underline",color:"#0f172a",textTransform:"uppercase"},
                  children:pejabatNama || "[NAMA LENGKAP PENANDATANGAN]"
                }),
                // 5. Kotak Pangkat & NRP
                (0,t.jsx)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatPangkat(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Pangkat & NRP",
                  style:{fontSize:"0.82rem",fontWeight:700,color:"#1e293b",marginTop:"4px",textTransform:"uppercase"},
                  children:pejabatPangkat || "[PANGKAT] NRP [98010710]"
                }),
                // 6. Kartu Panduan Pengisian (Screen Only)
                (0,t.jsxs)("div",{
                  className:"anev-no-print anev-guide-hint-card",
                  style:{marginTop:"8px",padding:"6px 10px",background:"#eff6ff",border:"1px dashed #3b82f6",borderRadius:"6px",fontSize:"0.68rem",color:"#1d4ed8",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",lineHeight:"1.35"},
                  children:[
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[
                      (0,t.jsx)("span",{style:{fontSize:"0.85rem"},children:"💡"}),
                      (0,t.jsxs)("span",{children:[
                        (0,t.jsx)("strong",{children:"> kalo Jenderal cukup > [PANGKAT] "}),
                        (0,t.jsx)("span",{style:{color:"#475569"},children:"(tanpa nomor NRP). Teks ini live editable."})
                      ]})
                    ]}),
                    (0,t.jsx)("button",{
                      type:"button",
                      onClick:()=>{
                        setPejabatTempatTanggal("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
                        setPejabatJabatan("[JABATAN]");
                        setPejabatNama("[NAMA PENANDATANGAN]");
                        setPejabatPangkat("[PANGKAT] NRP [98010710]");
                      },
                      style:{background:"transparent",border:"none",color:"#2563eb",textDecoration:"underline",cursor:"pointer",fontSize:"0.66rem",fontWeight:700,flexShrink:0},
                      children:"Reset Template"
                    })
                  ]
                })
              ]})
            ]})
`;

export function getAllNineSheets() {
  return [
    renderSheet(1, sheet1Content),
    renderSheet(2, sheet2Content),
    renderSheet(3, sheet3Content),
    renderSheet(4, sheet4Content),
    renderSheet(5, sheet5Content),
    renderSheet(6, sheet6Content),
    renderSheet(7, sheet7Content),
    renderSheet(8, sheet8Content),
    renderSheet(9, sheet9Content)
  ].join(',\n');
}

console.log('Sheet generator template prepared successfully!');

export function getToolbarAndSheets() {
  return `
    // TOOLBAR GOOGLE DOCS STYLE
    activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar",children:[
      // 1. Actions: Undo, Redo, Print
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Urungkan (Undo - Ctrl+Z)",onMouseDown:e=>{e.preventDefault();execCmd("undo")},children:(0,t.jsx)("i",{className:"pi pi-undo",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Ulangi (Redo - Ctrl+Y)",onMouseDown:e=>{e.preventDefault();execCmd("redo")},children:(0,t.jsx)("i",{className:"pi pi-refresh",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak Naskah (Ctrl+P)",onMouseDown:e=>{e.preventDefault();window.print()},children:(0,t.jsx)("i",{className:"pi pi-print",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 2. DROPDOWN MENU TABEL LENGKAP (GOOGLE DOCS STYLE)
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",fontWeight:700,color:"#1d4ed8",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"4px",padding:"2px 8px"},onMouseDown:e=>{e.preventDefault();setShowTableMenu(!showTableMenu);setShowTagMenu(false);setShowColorMenu(false);setShowHighlightMenu(false)},children:[
          (0,t.jsx)("i",{className:"pi pi-table",style:{fontSize:"0.78rem"}}),
          " Tabel ▾"
        ]}),
        showTableMenu && (0,t.jsxs)("div",{className:"anev-menu-dropdown",style:{minWidth:"185px"},children:[
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleInsertTable()},children:[
            (0,t.jsx)("span",{children:"➕"}), " Sisipkan Tabel Baru"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableRow(true)},children:[
            (0,t.jsx)("span",{children:"⬆️"}), " Tambah Baris Atas"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableRow(false)},children:[
            (0,t.jsx)("span",{children:"⬇️"}), " Tambah Baris Bawah"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTableRow()},children:[
            (0,t.jsx)("span",{children:"❌"}), " Hapus Baris Aktif"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableCol(true)},children:[
            (0,t.jsx)("span",{children:"⬅️"}), " Tambah Kolom Kiri"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableCol(false)},children:[
            (0,t.jsx)("span",{children:"➡️"}), " Tambah Kolom Kanan"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTableCol()},children:[
            (0,t.jsx)("span",{children:"❌"}), " Hapus Kolom Aktif"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",style:{color:"#dc2626"},onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTable()},children:[
            (0,t.jsx)("span",{children:"🗑️"}), " Hapus Tabel Ini"
          ]})
        ]})
      ]}),

      // Quick Table Buttons
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Baris Cepat (ke Bawah)",onMouseDown:e=>{e.preventDefault();handleAddTableRow(false)},style:{gap:"2px",fontSize:"0.74rem",color:"#047857",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.68rem"}}), " Baris"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Kolom Cepat (ke Kanan)",onMouseDown:e=>{e.preventDefault();handleAddTableCol(false)},style:{gap:"2px",fontSize:"0.74rem",color:"#0369a1",background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.68rem"}}), " Kolom"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Spasi Paragraf (Enter)",onMouseDown:e=>{e.preventDefault();handleInsertSpace()},style:{gap:"2px",fontSize:"0.74rem",color:"#475569",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-arrow-down-left",style:{fontSize:"0.72rem"}}), " Spasi"
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 3. DROPDOWN MENU CAP KEAMANAN & TAG OTOMATIS
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",fontWeight:700,color:"#065f46",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:"4px",padding:"2px 8px"},onMouseDown:e=>{e.preventDefault();setShowTagMenu(!showTagMenu);setShowTableMenu(false);setShowColorMenu(false);setShowHighlightMenu(false)},children:[
          (0,t.jsx)("span",{children:"🛡️"}),
          " Cap & Tag ▾"
        ]}),
        showTagMenu && (0,t.jsxs)("div",{className:"anev-menu-dropdown",style:{minWidth:"210px"},children:[
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("RAHASIA")},children:[
            (0,t.jsx)("span",{style:{color:"#dc2626",fontWeight:900},children:"🔴"}), " Cap: RAHASIA"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("TERBATAS")},children:[
            (0,t.jsx)("span",{style:{color:"#d97706",fontWeight:900},children:"🟠"}), " Cap: TERBATAS"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("KONFIDENSIAL")},children:[
            (0,t.jsx)("span",{style:{color:"#2563eb",fontWeight:900},children:"🔵"}), " Cap: KONFIDENSIAL"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("structure_level")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: structure_level}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("lokasi_satker")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: lokasi_satker}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("organization_level")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: organization_level}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("tanggal_awal")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: tanggal_awal}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("tanggal_akhir")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: tanggal_akhir}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("period")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: period}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("detail_period")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: detail_period}}"
          ]})
        ]})
      ]}),

      // 4. TOMBOL SINKRONISASI DATA OTOMATIS (SINKRON CAS)
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Ganti tag {{AUTO:...}} dengan nilai riil dari sistem secara otomatis",onMouseDown:e=>{e.preventDefault();resolveAutoTags()},style:{gap:"4px",fontWeight:800,fontSize:"0.76rem",color:"#ffffff",background:"#2563eb",border:"1px solid #1d4ed8",borderRadius:"4px",padding:"2px 9px",boxShadow:"0 1px 3px rgba(37,99,235,0.3)"},children:[
        (0,t.jsx)("span",{children:"✨"}),
        " Ganti Data Otomatis (Sinkron)"
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 5. Zoom Dokumen
      (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"2px"},children:[
        (0,t.jsx)("i",{className:"pi pi-search-plus",style:{fontSize:"0.72rem",color:"#64748b"}}),
        (0,t.jsx)(l.Dropdown,{value:docZoom,options:zoomOptions,onChange:e=>setDocZoom(e.value),style:{width:"5.3rem",height:"28px",fontSize:"0.76rem"}})
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 6. Format Blok / Heading
      (0,t.jsx)(l.Dropdown,{value:selectedHeading,options:headingOptions,onChange:e=>{setSelectedHeading(e.value);execCmd("formatBlock",e.value)},style:{width:"8.3rem",height:"28px",fontSize:"0.76rem"}}),

      // 7. Font Family
      (0,t.jsx)(l.Dropdown,{value:selectedFont,options:fontOptions,onChange:e=>{setSelectedFont(e.value);execCmd("fontName",e.value)},style:{width:"8.6rem",height:"28px",fontSize:"0.76rem"}}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 8. Bold, Italic, Underline, Strikethrough
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tebal (Bold - Ctrl+B)",onMouseDown:e=>{e.preventDefault();execCmd("bold")},children:(0,t.jsx)("strong",{style:{fontSize:"0.84rem"},children:"B"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Miring (Italic - Ctrl+I)",onMouseDown:e=>{e.preventDefault();execCmd("italic")},children:(0,t.jsx)("em",{style:{fontSize:"0.84rem",fontFamily:"serif"},children:"I"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Garis Bawah (Underline - Ctrl+U)",onMouseDown:e=>{e.preventDefault();execCmd("underline")},children:(0,t.jsx)("u",{style:{fontSize:"0.84rem"},children:"U"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Coret (Strikethrough)",onMouseDown:e=>{e.preventDefault();execCmd("strikeThrough")},children:(0,t.jsx)("s",{style:{fontSize:"0.84rem"},children:"S"})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 9. Warna Font & Stabilo
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Teks",onMouseDown:e=>{e.preventDefault();setShowColorMenu(!showColorMenu);setShowHighlightMenu(false);setShowTableMenu(false);setShowTagMenu(false)},children:[
          (0,t.jsxs)("span",{style:{display:"flex",flexDirection:"column",alignItems:"center",lineHeight:"1"},children:[
            (0,t.jsx)("strong",{style:{fontSize:"0.82rem"},children:"A"}),
            (0,t.jsx)("span",{style:{width:"14px",height:"3px",background:"#1d4ed8",marginTop:"1px",borderRadius:"1px"}})
          ]}),
          (0,t.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.52rem",marginLeft:"3px"}})
        ]}),
        showColorMenu && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
          ["#000000","#1d4ed8","#b91c1c","#15803d","#d97706","#64748b"].map(c=>(
            (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c},title:c,onMouseDown:e=>{e.preventDefault();execCmd("foreColor",c);setShowColorMenu(false)}})
          ))
        ]})
      ]}),

      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Sorotan (Stabilo)",onMouseDown:e=>{e.preventDefault();setShowHighlightMenu(!showHighlightMenu);setShowColorMenu(false);setShowTableMenu(false);setShowTagMenu(false)},children:[
          (0,t.jsxs)("span",{style:{display:"flex",flexDirection:"column",alignItems:"center",lineHeight:"1"},children:[
            (0,t.jsx)("span",{style:{fontSize:"0.78rem"},children:"🖍️"}),
            (0,t.jsx)("span",{style:{width:"14px",height:"3px",background:"#facc15",marginTop:"1px",borderRadius:"1px"}})
          ]}),
          (0,t.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.52rem",marginLeft:"3px"}})
        ]}),
        showHighlightMenu && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
          ["#fef08a","#bbf7d0","#bae6fd","#fed7aa","#fbcfe8","transparent"].map(c=>(
            (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c==="transparent"?"#ffffff":c,border:c==="transparent"?"1.5px dashed #ef4444":"1px solid #94a3b8"},title:c==="transparent"?"Hapus Sorotan":c,onMouseDown:e=>{e.preventDefault();execCmd("hiliteColor",c);setShowHighlightMenu(false)}})
          ))
        ]})
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 10. Perataan Paragraf
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri",onMouseDown:e=>{e.preventDefault();execCmd("justifyLeft")},children:(0,t.jsx)("i",{className:"pi pi-align-left",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Tengah",onMouseDown:e=>{e.preventDefault();execCmd("justifyCenter")},children:(0,t.jsx)("i",{className:"pi pi-align-center",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kanan",onMouseDown:e=>{e.preventDefault();execCmd("justifyRight")},children:(0,t.jsx)("i",{className:"pi pi-align-right",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri-Kanan (Justify)",onMouseDown:e=>{e.preventDefault();execCmd("justifyFull")},children:(0,t.jsx)("i",{className:"pi pi-align-justify",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 11. Daftar & Indentasi
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onMouseDown:e=>{e.preventDefault();execCmd("insertUnorderedList")},children:(0,t.jsx)("i",{className:"pi pi-list",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Angka (Numbering)",onMouseDown:e=>{e.preventDefault();execCmd("insertOrderedList")},children:(0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800},children:"1."})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kurangi Indentasi",onMouseDown:e=>{e.preventDefault();execCmd("outdent")},children:(0,t.jsx)("i",{className:"pi pi-angle-left",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Indentasi",onMouseDown:e=>{e.preventDefault();execCmd("indent")},children:(0,t.jsx)("i",{className:"pi pi-angle-right",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 12. Garis Pembatas, Page Break, Reset
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Garis Pembatas",onMouseDown:e=>{e.preventDefault();execCmd("insertHorizontalRule")},children:(0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Format (Clear)",onMouseDown:e=>{e.preventDefault();execCmd("removeFormat")},children:(0,t.jsx)("i",{className:"pi pi-filter-slash",style:{fontSize:"0.78rem"}})}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Batas Halaman (Page Break)",style:{gap:"3px",fontSize:"0.74rem",color:"#475569"},onMouseDown:e=>{
        e.preventDefault();
        execCmd("insertHTML", '<div class="anev-page-break" style="page-break-before:always; border-top:1.5px dashed #cbd5e1; margin:1.5rem 0; padding-top:0.4rem; text-align:center; font-size:0.7rem; color:#94a3b8; user-select:none;">--- PEMISAH HALAMAN CETAK ---</div><p><br></p>');
      },children:[
        (0,t.jsx)("span",{children:"📄"}),
        "Batas Hal"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Muat Ulang Teks Standar dari Sistem",style:{marginLeft:"auto",gap:"3px",fontSize:"0.74rem",color:"#b91c1c"},onClick:handleGenerateLampiran,children:[
        (0,t.jsx)("i",{className:"pi pi-replay",style:{fontSize:"0.72rem"}}),
        "Reset Naskah"
      ]})
    ]}),

    // TAB 1: NASKAH KANVAS DINAS A4 (9 HALAMAN LENGKAP DENGAN FORMAT RESMI BARU)
    activeTab === "lampiran" && (0,t.jsxs)("div",{children:[
      (0,t.jsxs)("div",{className:"anev-pages-workspace",style:{zoom:docZoom+"%",transition:"zoom 0.15s ease"},children:[
        // Info banner dinamis: ARSIP vs DRAFT
        archiveLoadedInfo ? (
          (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",border:"2px solid #f59e0b",borderRadius:"8px",padding:"10px 16px",marginBottom:"0.5rem",boxShadow:"0 4px 14px rgba(245, 158, 11, 0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[
              (0,t.jsx)("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:"#f59e0b",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🔒"}),
              (0,t.jsxs)("div",{children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                  (0,t.jsx)("span",{style:{fontWeight:900,fontSize:"0.90rem",color:"#78350f"},children:"MODE ARSIP: SALINAN RESMI NASKAH DINAS #" + archiveLoadedInfo.id}),
                  (0,t.jsx)("span",{style:{background:"#b45309",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"TERSIMPAN & TERKUNCI"})
                ]}),
                (0,t.jsxs)("div",{style:{fontSize:"0.73rem",color:"#92400e",marginTop:"2px"},children:[
                  "Tercatat pada: ", (0,t.jsx)("strong",{children:new Date(archiveLoadedInfo.date).toLocaleString("id-ID")}),
                  " | Operator: ", (0,t.jsx)("strong",{children:archiveLoadedInfo.operator}),
                  " | Kode CAS: ", (0,t.jsx)("code",{style:{background:"#fde68a",padding:"2px 5px",borderRadius:"3px",fontWeight:800,color:"#78350f"},children:(archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)})
                ]}),
                (0,t.jsx)("div",{style:{fontSize:"0.70rem",color:"#b45309",marginTop:"2px"},children:"Dokumen ini adalah rekaman snapshot resmi historis. Untuk kembali ke naskah kerja aktif baru, klik tombol 'Tutup & Ke Draft Baru'."})
              ]})
            ]}),
            (0,t.jsxs)("div",{style:{display:"flex",gap:"6px"},children:[
              (0,t.jsx)(c.Button,{
                label: "🖨️ Cetak Ulang Salinan",
                size: "small",
                severity: "warning",
                style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                onClick: () => window.print()
              }),
              (0,t.jsx)(c.Button,{
                label: "✕ Tutup & Ke Draft Baru",
                size: "small",
                severity: "secondary",
                style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                onClick: () => {
                  setArchiveLoadedInfo(null);
                  handleGenerateLampiran();
                }
              })
            ]})
          ]})
        ) : (
          (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",border:"1.5px solid #86efac",borderRadius:"8px",padding:"8px 16px",marginBottom:"0.5rem",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[
              (0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"#10b981",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0},children:"📝"}),
              (0,t.jsxs)("div",{children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                  (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.86rem",color:"#065f46"},children:"MODE DRAFT: NASKAH DINAS AKTIF (LIVE EDITABLE)"}),
                  (0,t.jsx)("span",{style:{background:"#10b981",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"DRAFT"})
                ]}),
                (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",marginTop:"1px"},children:"Naskah belum diarsipkan secara permanen. Klik teks/angka di mana saja untuk menyunting langsung, gunakan tombol Sinkron untuk memperbarui data, gunakan toolbar untuk manipulasi tabel dan tag."})
              ]})
            ]}),
            (0,t.jsx)(c.Button,{
              label: "🖨️ Cetak & Arsipkan",
              size: "small",
              severity: "success",
              loading: printing,
              onClick: handlePrintAndArchive,
              style: { fontWeight: 800, fontSize: "0.76rem", height: "32px" }
            })
          ]})
        ),
  `;
}
