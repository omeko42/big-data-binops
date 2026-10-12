import fs from 'fs';

console.log('Generating official Word template sheets matching user document...');

// Read real Reserse shield logo
const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

// Helper to render sheet
function renderSheet(pageNum, contentJsx) {
  return `
        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay (Using NRP 98010710)
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content (WYSIWYG Editable)
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

// ----------------------------------------------------
// SHEET 1: Kop Dinas, Logo Reserse Asli, Judul, BAB I PENDAHULUAN & IKU
// ----------------------------------------------------
const sheet1Content = `
            // KOP DINAS & SECURITY STAMP
            (0,t.jsxs)("div",{style:{textAlign:"center",marginBottom:"1rem"},children:[
              (0,t.jsx)("div",{className:"anev-security-stamp",children:"KLASIFIKASI: RAHASIA"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px",textTransform:"uppercase"},children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA"}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"10pt",letterSpacing:"0.5px",textTransform:"uppercase"},children:"{{AUTO: structure_level}} {{AUTO: lokasi_satker}}"}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9.5pt",letterSpacing:"0.5px",textTransform:"uppercase"},children:"{{AUTO: organization_level}}"}),
              // LOGO RESERSE RESMI (REAL DELETABLE & EDITABLE IMG)
              (0,t.jsx)("div",{style:{textAlign:"center",margin:"6px 0"},children:(0,t.jsx)("img",{
                src: "${logoDataUri}",
                className: "anev-doc-logo",
                alt: "Logo Reserse Polri",
                title: "Klik untuk memilih, tekan Backspace/Delete untuk menghapus",
                style: { width: "70px", height: "auto", display: "block", margin: "4px auto", cursor: "pointer", userSelect: "all" }
              })}),
              (0,t.jsx)("div",{style:{fontWeight:900,fontSize:"11.5pt",letterSpacing:"0.5px",marginTop:"4px"},children:"LAPORAN [*PERIOD]"}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"10pt"},children:"{{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}}"}),
              (0,t.jsx)("div",{style:{fontWeight:600,fontSize:"9pt",color:"#334155"},children:"[*DETAIL PERIOD]"}),
              (0,t.jsx)("div",{style:{borderBottom:"2px solid #000",marginTop:"8px",marginBottom:"10px"}})
            ]}),

            // BAB I PENDAHULUAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"PENDAHULUAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Umum"}),
            (0,t.jsx)("p",{children:"Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu {{AUTO: tanggal_awal}} s.d. {{AUTO: tanggal_akhir}}, mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}}."}),
            (0,t.jsx)("p",{children:"Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Maksud dan Tujuan"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"Maksud: "}),
              "Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode yang telah ditentukan."
            ]}),
            (0,t.jsx)("p",{children:(0,t.jsx)("strong",{children:"Tujuan: Laporan ini bertujuan untuk:"})}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;"}),
              (0,t.jsx)("li",{children:"Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;"}),
              (0,t.jsx)("li",{children:"Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan {{AUTO: structure_level}}."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Dasar"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"[*Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang Susunan Organisasi dan Tata Kerja Satuan Organisasi pada Tingkat Markas Besar Kepolisian Negara Republik Indonesia / Peraturan Kepolisian Negara Republik Indonesia Nomor 3 Tahun 2024 tentang Perubahan atas Peraturan Kepolisian Negara Republik Indonesia Nomor 14 Tahun 2018 tentang Susunan Organisasi dan Tata Kerja Kepolisian Daerah];"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Keamanan dan Ketertiban Masyarakat;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;"}),
              (0,t.jsx)("li",{children:"Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang pengiriman format Laporan Bulanan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Ruang Lingkup"}),
            (0,t.jsx)("p",{children:"Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode {{[*DETAIL PERIOD]}}. Adapun ruang lingkup pelaporan meliputi: 1) Data laporan polisi (LP) yang masuk dan diselesaikan; 2) Penanganan perkara berdasarkan jenis tindak pidana; 3) Pelaksanaan restorative justice (RJ) dan penyelesaian non-litigasi lainnya; 4) Data barang bukti yang diamankan dan/atau disita; 5) Kondisi kekuatan personel serta beban kerja penyidik; 6) Kerja sama dan koordinasi dengan satuan kerja lain, instansi eksternal, atau operasi terpusat; 7) Kasus-kasus menonjol atau menjadi atensi pimpinan; 8) Analisis dan evaluasi kinerja penyidikan berdasarkan indikator yang ditetapkan."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Indeks Kinerja Utama"}),
            (0,t.jsx)("p",{children:"Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel dalam menjawab harapan masyarakat terhadap keadilan hukum."}),

            // Tabel 1.1 IKU
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"8%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"38%"},children:"Sasaran Strategis"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"24%"},children:"Indikator Kinerja Utama"}),
                  (0,t.jsx)("th",{colSpan:5,children:"Target Kinerja"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"6%"},children:"2025"}),
                  (0,t.jsx)("th",{style:{width:"6%"},children:"2026"}),
                  (0,t.jsx)("th",{style:{width:"6%"},children:"2027"}),
                  (0,t.jsx)("th",{style:{width:"6%"},children:"2028"}),
                  (0,t.jsx)("th",{style:{width:"6%"},children:"2029"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"}),(0,t.jsx)("td",{children:"9"})
                ]})
              ]}),
              (0,t.jsx)("tbody",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"SS2"}),
                (0,t.jsx)("td",{children:"Penegakan Hukum yang Humanis, Akuntabel, dan Berkeadlian (Renstra 2020-2024: Penegakan hukum secara berkeadilan)"}),
                (0,t.jsx)("td",{style:{fontWeight:600},children:"3. Indeks Gakkum Polri"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,6"}),
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"3,7"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,8"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,9"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"4,0"})
              ]})})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.1: indikator kinerja utama indeks gakkum polri"}),
            (0,t.jsx)("p",{children:"Target Indeks Kinerja Utama (IKU) ini bersifat tahunan dan digunakan sebagai dasar dalam mengevaluasi kinerja satuan kerja (satker) fungsi Reserse, mulai dari tingkat Polsek, Polres, Polda, hingga Bareskrim Polri. Penilaian terhadap pencapaian IKU dilakukan melalui pengukuran berbasis data yang bersumber dari Crime Analytic System (CAS), yang mengelola data secara otomatis. Dengan demikian, IKU tidak hanya menjadi alat ukur administratif, tetapi juga instrumen strategis dalam perencanaan kebutuhan personel, anggaran, serta pengambilan kebijakan berbasis analisis beban kerja dan kasus prioritas."})
`;

// ----------------------------------------------------
// SHEET 2: BAB II TUGAS YANG DILAKSANAKAN & TABEL 1.8 TAHANAN
// ----------------------------------------------------
const sheet2Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"TUGAS YANG DILAKSANAKAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Tugas utama"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan ini, {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} melaksanakan tugas pokok dan fungsi di bidang reserse kriminal sesuai dengan ketentuan yang berlaku. Tugas-tugas tersebut mencakup kegiatan penyelidikan, penyidikan, pelaksanaan gelar perkara, penegakan hukum, dan kegiatan pendukung lainnya yang relevan dengan penanganan tindak pidana."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Manajemen Operasional"}),
            (0,t.jsx)("p",{children:"Pelaksanaan tugas operasional ditunjang oleh ketersediaan sumber daya manusia (SDM), anggaran belanja, serta sarana dan prasarana (sarpras). Pengelolaan SDM dan sarpras dilakukan secara efektif dan efisien untuk mendukung capaian kinerja yang optimal."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"Sumber Daya Manusia"}),
            (0,t.jsx)("p",{children:"SDM yang mendukung pelaksanaan tugas terdiri dari berbagai tingkat kepangkatan, fungsi penyidikan, serta latar belakang pendidikan. Adapun keterangan yang perlu disampaikan terkait SDM periode ini [*Nihil / Mutasi 1 (satu) orang ke … / MD karena … / dll terkait keterangan SDM.]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"Anggaran Belanja"}),
            (0,t.jsx)("p",{children:"Penggunaan anggaran belanja selama periode pelaporan terbagi dalam tiga jenis: Belanja Pegawai, Belanja Barang, dan Belanja Modal. Penyerapan anggaran pada periode ini [*Nihil / terserap … digunakan untuk … / dll.]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"Sarana prasarana"}),
            (0,t.jsx)("p",{children:"Penggunaan dan kondisi sarana serta prasarana dalam mendukung operasional satuan disusun berdasarkan klasifikasi berikut:"}),
            (0,t.jsx)("p",{children:"1. Sarana: Terkait penggunaan dan kondisi sarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ]."}),
            (0,t.jsx)("p",{children:"2. Prasarana: Terkait penggunaan dan kondisi prasarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ]."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Tahanan dan Barang Bukti"}),
            (0,t.jsx)("p",{children:"Jumlah tahanan serta barang bukti yang dikelola selama periode pelaporan dijabarkan secara kuantitatif, baik berdasarkan kategori maupun jenisnya."}),
            
            (0,t.jsx)("div",{style:{fontWeight:700,marginBottom:"3px"},children:"Tahanan"}),
            // Tabel 1.8 Tahanan
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"32%"},children:"JENIS TAHANAN"}),
                  (0,t.jsx)("th",{colSpan:3,children:"JUMLAH TAHANAN"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"TOTAL TAHANAN"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"18%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"10%"},children:"AWAL"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"MASUK"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"KELUAR"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),(0,t.jsx)("td",{colSpan:6,children:"Tahanan Satker"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Dewasa"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Anak"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),(0,t.jsx)("td",{colSpan:6,children:"Titipan Instansi / K / L"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Dewasa"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Anak"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Grand Total"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"* hanya contoh"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.8: Jumlah Tahanan"})
`;

// ----------------------------------------------------
// SHEET 3: BARANG BUKTI TABEL 1.9 & KERJASAMA
// ----------------------------------------------------
const sheet3Content = `
            (0,t.jsx)("div",{style:{fontWeight:700,marginBottom:"4px"},children:"Barang Bukti"}),
            // Tabel 1.9 Barang Bukti
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"34%"},children:"JENIS BARANG BUKTI"}),
                  (0,t.jsx)("th",{colSpan:2,children:"BARANG BUKTI"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"20%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"18%"},children:"JUMLAH"}),
                  (0,t.jsx)("th",{style:{width:"22%"},children:"SATUAN"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"6"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bergerak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Kendaraan"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Roda 2"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Roda 4"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Sepeda listrik"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Perangkat Elektronik"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"HP"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Laptop"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Tablet"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Senjata"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Tajam"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Airsoft gun"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Palu"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Senpi Rakitan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"Dokumen cetak"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Sertifikat"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Surat Berharga"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"Pakaian"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Baju"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Celana"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Alas kaki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Tidak Bergerak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Tanah & Bangunan"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Aset"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Fasilitas Olahraga"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Kos"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Apartemen"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Hotel"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"C."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Finansial"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Uang Tunai"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Valuta Nasional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Valuta Asing"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"US Dollar"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Uang dalam Rekening Bank"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"BRI"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Cryptocurrency"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Binance"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"BTC"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"TokoCrypto"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ETH"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"D."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Digital / Elektronik"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Dokumen Elektronik"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Data digital"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Rekaman media"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"CCTV"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Camrecorder"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),

                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"E."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bahan / Obat- Obatan Berbahaya"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Narkoba"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Pengawet mayat / Balsam"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Zat Radioaktif"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"* hanya contoh"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.9: Jenis dan Jumlah Barang Bukti"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"Kerjasama yang dilaksanakan"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan, satker kami telah melaksanakan berbagai bentuk kerjasama dengan instansi internal maupun eksternal, baik yang bersifat strategis maupun teknis operasional. Adapun kerja sama yang dilaksanakan pada periode ini [*Nihil. / yaitu: Kerja sama … dengan pihak … dalam bidang … untuk … ]."})
`;

// ----------------------------------------------------
// SHEET 4: ANALISIS DAN EVALUASI - TABEL 2.1 & TABEL 2.2
// ----------------------------------------------------
const sheet4Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"Analisis dan evaluasi terhadap pelaksanaan tugas"}),
            (0,t.jsx)("p",{children:"Analisis dan evaluasi ini disusun berdasarkan data operasional yang terintegrasi melalui CAS. Evaluasi dilakukan dengan pendekatan kuantitatif dan komparatif, membandingkan indikator kinerja antara periode pelaporan saat ini dengan periode sebelumnya yang setara (apple to apple). Metode perbandingan ini memungkinkan pengukuran tren kinerja yang akurat serta mendukung penyusunan kebijakan berbasis data."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Analisis"}),
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"Data kejahatan periode sebelumnya"}),

            // Tabel 2.1
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"32%"},children:"JENIS KEJAHATAN"}),
                  (0,t.jsx)("th",{colSpan:2,children:"LAPOR"}),
                  (0,t.jsx)("th",{colSpan:2,children:"SELESAI"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"PERSENTASE (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"TGK"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"JLN"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"TGK"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"JLN"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{ j_kjht _x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ lp_tgk_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ lp_jln_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ cc_tgk_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ cc_jln_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ persentase_x }}"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"* sesuai yang ditangani satker"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Pencurian dengan Pemberatan (Curat)"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"Pencurian Kendaraan Bermotor (Curanmor)"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"Penipuan / Penggelapan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"6."}),(0,t.jsx)("td",{children:"Narkotika / Psikotropika"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tt_tgk }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tt_jln }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tc_tgk }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tc_jln }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ persentase_tot }}"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.1: data kejahatan periode sebelumnya"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"Data kejahatan periode ini"}),
            // Tabel 2.2
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"32%"},children:"JENIS KEJAHATAN"}),
                  (0,t.jsx)("th",{colSpan:2,children:"LAPOR"}),
                  (0,t.jsx)("th",{colSpan:2,children:"SELESAI"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"PERSENTASE (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"TGK"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"JLN"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"TGK"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"JLN"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{ j_kjht _x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ lp_tgk_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ lp_jln_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ cc_tgk_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ cc_jln_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ persentase_x }}"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"* sesuai yang ditangani satker"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Pencurian dengan Pemberatan (Curat)"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"Pencurian Kendaraan Bermotor (Curanmor)"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"Penipuan / Penggelapan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"6."}),(0,t.jsx)("td",{children:"Narkotika / Psikotropika"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0%"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tt_tgk }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tt_jln }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tc_tgk }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ tc_jln }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{ persentase_tot }}"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.2: data kejahatan periode ini"})
`;

// ----------------------------------------------------
// SHEET 5: GRAFIK 1.1 DAN RUMUS PENANGANAN PERKARA X
// ----------------------------------------------------
const sheet5Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Perbandingan grafis data kejahatan"}),
            
            // CLEAN VECTOR SVG BAR CHART
            (0,t.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"12px 16px",margin:"10px 0"},children:[
              (0,t.jsxs)("svg",{viewBox:"0 0 540 180",style:{width:"100%",height:"auto",display:"block"},children:[
                // Grid lines
                (0,t.jsx)("line",{x1:"50",y1:"30",x2:"510",y2:"30",stroke:"#e2e8f0",strokeDasharray:"4"}),
                (0,t.jsx)("line",{x1:"50",y1:"75",x2:"510",y2:"75",stroke:"#e2e8f0",strokeDasharray:"4"}),
                (0,t.jsx)("line",{x1:"50",y1:"120",x2:"510",y2:"120",stroke:"#e2e8f0",strokeDasharray:"4"}),
                (0,t.jsx)("line",{x1:"50",y1:"145",x2:"510",y2:"145",stroke:"#475569",strokeWidth:"1.5"}),
                // Y Axis labels
                (0,t.jsx)("text",{x:"40",y:"34",fontSize:"10",fill:"#64748b",textAnchor:"end"},"150"),
                (0,t.jsx)("text",{x:"40",y:"79",fontSize:"10",fill:"#64748b",textAnchor:"end"},"100"),
                (0,t.jsx)("text",{x:"40",y:"124",fontSize:"10",fill:"#64748b",textAnchor:"end"},"50"),
                (0,t.jsx)("text",{x:"40",y:"149",fontSize:"10",fill:"#64748b",textAnchor:"end"},"0"),
                // Bar Group 1: Tunggakan (KP)
                (0,t.jsx)("rect",{x:"70",y:"65",width:"32",height:"80",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("rect",{x:"106",y:"55",width:"32",height:"90",fill:"#1e40af",rx:"2"}),
                (0,t.jsx)("text",{x:"104",y:"160",fontSize:"10",fill:"#1e293b",fontWeight:"bold",textAnchor:"middle"},"Tunggakan (KP)"),
                // Bar Group 2: Kasus Baru (KM)
                (0,t.jsx)("rect",{x:"180",y:"45",width:"32",height:"100",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("rect",{x:"216",y:"40",width:"32",height:"105",fill:"#1e40af",rx:"2"}),
                (0,t.jsx)("text",{x:"214",y:"160",fontSize:"10",fill:"#1e293b",fontWeight:"bold",textAnchor:"middle"},"Kasus Baru (KM)"),
                // Bar Group 3: Selesai Tgk (KT)
                (0,t.jsx)("rect",{x:"290",y:"85",width:"32",height:"60",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("rect",{x:"326",y:"70",width:"32",height:"75",fill:"#16a34a",rx:"2"}),
                (0,t.jsx)("text",{x:"324",y:"160",fontSize:"10",fill:"#1e293b",fontWeight:"bold",textAnchor:"middle"},"Selesai Tgk (KT)"),
                // Bar Group 4: Selesai Baru (KB)
                (0,t.jsx)("rect",{x:"400",y:"75",width:"32",height:"70",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("rect",{x:"436",y:"60",width:"32",height:"85",fill:"#16a34a",rx:"2"}),
                (0,t.jsx)("text",{x:"434",y:"160",fontSize:"10",fill:"#1e293b",fontWeight:"bold",textAnchor:"middle"},"Selesai Baru (KB)"),
                // Legend
                (0,t.jsx)("rect",{x:"320",y:"8",width:"12",height:"10",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("text",{x:"338",y:"17",fontSize:"9.5",fill:"#475569"},"Periode Lalu"),
                (0,t.jsx)("rect",{x:"420",y:"8",width:"12",height:"10",fill:"#1e40af",rx:"2"}),
                (0,t.jsx)("text",{x:"438",y:"17",fontSize:"9.5",fill:"#475569"},"Periode Ini")
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 12px 0"},children:"Gambar 1.1: grafik perbandingan tren jumlah kasus tindak pidana"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"Jumlah Tunggakan Tindak Pidana (KP)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah tunggakan Tindak Pidana sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"Jumlah Tindak Pidana (KM)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Tindak Pidana sebanyak [x] LP atau [y] % dibandingkan dengan periode sebelumnya sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"Jumlah Penyelesaian Tunggakan Tindak Pidana (KT)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Penyelesaian Tunggakan Tindak Pidana sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"Jumlah Penyelesaian Tindak Pidana (KB)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Penyelesaian Tindak Pidana sebanyak [x] LP atau [y] % dibandingkan dengan periode sebelumnya sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"Persentase Penanganan Tindak Pidana (X)"}),
            (0,t.jsx)("p",{children:"Rumus:"}),
            (0,t.jsx)("p",{style:{fontFamily:"monospace",fontWeight:700,marginLeft:"1rem"},children:"X = KS : KD x 100%"}),
            (0,t.jsx)("p",{style:{fontFamily:"monospace",fontWeight:700,marginLeft:"1rem"},children:"X = (KB + KT) : (KM + KP) x 100%"}),
            (0,t.jsx)("p",{style:{fontWeight:700,color:"#1e40af",marginTop:"4px"},children:"[*count: X = (KB + KT) : (KM + KP) x 100%]"})
`;

// ----------------------------------------------------
// SHEET 6: TABEL 2.3 RJ & TABEL 2.4 BEBAN KERJA
// ----------------------------------------------------
const sheet6Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Penanganan Tindak Pidana melalui Restorative Justice"}),
            (0,t.jsx)("p",{children:"Penanganan perkara dengan pendekatan Restorative Justice (RJ) merupakan salah satu upaya penyelesaian tindak pidana melalui proses mediasi penal antara para pihak terkait."}),
            (0,t.jsx)("p",{children:"Pada periode pelaporan ini, telah dilaksanakan RJ terhadap sejumlah perkara dengan hasil sebagai berikut:"}),

            // Tabel 2.3 RJ
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"27%"},children:"JENIS TIPID"}),
                  (0,t.jsx)("th",{colSpan:3,children:"CRIME TOTAL (CT)"}),
                  (0,t.jsx)("th",{colSpan:3,children:"SELESAI (RJ)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"PERSENTASE (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"11%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"7%"},children:"LID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"SID"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"TOT"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"LID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"SID"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"TOT"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"}),(0,t.jsx)("td",{children:"9"}),(0,t.jsx)("td",{children:"10"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{ jenis_tindak_pidana_x }}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"* sesuai yang diselesaikan dgn RJ oleh satker"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.3: penanganan tindak pidana melalui RJ"}),

            (0,t.jsx)("p",{children:"Efektifitas penyelesaian Tindak Pidana melalui RJ berdasarkan analisis data di atas, [*ORGANIZATION LEVEL] mampu melaksanakan penyelesaian dengan menerapkan RJ sebanyak [x] LP atau sekitar [y] % dari [*TOTAL] LP yang ada. RJ [*kurang/cukup/sangat] efektif terhadap penyelesaian Tindak Pidana."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"Analisis beban kinerja"}),
            (0,t.jsx)("p",{children:"Analisis beban kinerja dilakukan untuk mengukur tingkat beban kerja berdasarkan jumlah perkara yang ditangani dibandingkan dengan jumlah personel penyidik yang tersedia pada periode pelaporan. Perhitungan ini memanfaatkan data operasional yang terintegrasi di CAS dan dianalisis secara apple to apple dengan periode sebelumnya."}),

            // Tabel 2.4 Beban Kerja
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"18%"},children:"PERIODE"}),
                  (0,t.jsx)("th",{colSpan:3,children:"DATA TIPID"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"JML AGT"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"15%"},children:"RATIO LP/AGT"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"16%"},children:"BEBAN KINERJA (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"8%"},children:"CT"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"CC"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"CR (%)"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"}),(0,t.jsx)("td",{children:"9"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Periode 1"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CT-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CC-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CR-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*AGT-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RATIO-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*BEBAN-P1]"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Periode 2"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CT-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CC-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CR-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*AGT-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RATIO-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*BEBAN-P2]"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣCT"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣCC"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"(ΣCC÷Σ CT)× 100"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣAGT"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣRATIO"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"(ΣRATIO ÷ standar )× 100"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.4: analisis beban kinerja"}),

            (0,t.jsx)("p",{children:"Berdasarkan data pada Tabel 2.4, jumlah kasus yang harus ditangani (Crime Total/CT) pada periode [*PERIODE 2] tercatat sebanyak *[CT-P2] kasus, mengalami [*peningkatan/penurunan] sebesar *[SELISIH-CT] kasus atau *[PERSEN-CT]% dibandingkan periode [*PERIODE 1] yang berjumlah *[CT-P1] kasus."}),
            (0,t.jsx)("p",{children:"Tingkat penyelesaian perkara (Crime Clearance/CC) pada periode [*PERIODE 2] adalah *[CC-P2] kasus dengan Clearance Rate (CR) sebesar [*CR-P2]%, [*lebih tinggi/lebih rendah] *[SELISIH-CR]% dibandingkan periode sebelumnya ([*CR-P1]%)."}),
            (0,t.jsx)("p",{children:"Jumlah penyidik/penyidik pembantu aktif pada periode [*PERIODE 2] tercatat sebanyak *[AGT-P2] personel, sehingga rata-rata beban kasus per penyidik (Ratio LP/AGT) adalah *[RATIO-P2] kasus, atau setara dengan *[BEBAN-P2]% dari standar beban ideal yang telah ditetapkan."}),
            (0,t.jsx)("p",{children:"Berdasarkan perbandingan antarperiode, dapat disimpulkan bahwa beban kinerja [*meningkat/menurun] pada periode [*PERIODE 2], yang [*berpotensi memerlukan penambahan personel/masih berada pada batas ideal] untuk menjaga efektivitas penanganan perkara."})
`;

// ----------------------------------------------------
// SHEET 7: EVALUASI KINERJA (5 POIN STRATEGIS)
// ----------------------------------------------------
const sheet7Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"Evaluasi"}),
            (0,t.jsx)("p",{children:"Berdasarkan data hasil analisis pada periode [*PERIODE], Satker *[NAMA SATKER] telah menangani *[CT] perkara (Crime Total/CT), dengan tingkat penyelesaian (Crime Clearance/CC) sebanyak *[CC] perkara atau [*CR]%."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Tren Kejahatan"}),
            (0,t.jsx)("p",{children:"Dibandingkan periode sebelumnya ([*PERIODE-SEBELUM]), jumlah perkara mengalami [*peningkatan/penurunan] sebesar *[SELISIH-CT] perkara ([*PERSEN-CT]%). Perubahan ini terutama dipengaruhi oleh [*faktor dominan dari data CAS, misal: peningkatan kasus penipuan daring / penurunan kasus pencurian konvensional]."}),
            (0,t.jsx)("p",{children:"Kondisi ini menunjukkan bahwa [*strategi penanggulangan berjalan efektif / perlu penyesuaian strategi] guna mengendalikan tren tersebut secara berkelanjutan."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Efektivitas Penyelesaian Perkara"}),
            (0,t.jsx)("p",{children:"Tingkat penyelesaian (CC) mencapai *[CC] perkara, dengan Clearance Rate sebesar [*CR]%, [*lebih tinggi/lebih rendah] *[SELISIH-CR]% dibandingkan periode sebelumnya."}),
            (0,t.jsx)("p",{children:"Kinerja ini [*di atas target nasional sehingga perlu dipertahankan / di bawah target nasional sehingga perlu percepatan proses penyidikan] dengan tetap menjaga kualitas penanganan perkara."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Optimalisasi RJ"}),
            (0,t.jsx)("p",{children:"Penyelesaian perkara melalui RJ pada periode ini mencapai *[RJ-JUMLAH] perkara atau *[RJ-PERSEN]% dari total perkara yang diselesaikan."}),
            (0,t.jsx)("p",{children:"Hal ini [*menunjukkan pemanfaatan RJ berjalan optimal sesuai kebijakan Polri / masih perlu didorong agar lebih efektif terutama untuk perkara yang memenuhi syarat RJ], guna mengurangi beban perkara di penyidikan formal."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Beban Kinerja Personel"}),
            (0,t.jsx)("p",{children:"Jumlah penyidik aktif (*[AGT]* personel) menghasilkan rasio *[RATIO LP/AGT] perkara per penyidik. Standar beban ideal adalah *[BEBAN-ID] perkara per penyidik."}),
            (0,t.jsx)("p",{children:"Beban kerja ini [*masih dalam batas ideal / melebihi batas ideal], sehingga [*memungkinkan fokus pada peningkatan kualitas penyidikan / berpotensi menurunkan efektivitas kerja jika tidak diimbangi penambahan personel atau redistribusi perkara]."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Sumber Daya dan Dukungan Operasional"}),
            (0,t.jsx)("p",{children:"Sarana dan prasarana penunjang penyidikan [*memadai/tidak memadai], dengan ketersediaan utama meliputi [*placeholder: daftar fasilitas dari CAS]."}),
            (0,t.jsx)("p",{children:"[*Dukungan operasional yang ada cukup memadai untuk menunjang pelaksanaan tugas / Perlu penambahan atau peremajaan sarana tertentu agar kinerja penyidikan lebih optimal]."}),
            (0,t.jsx)("p",{children:"Secara umum, pelaksanaan tugas pada periode *[PERIODE] [*telah berjalan baik / masih memerlukan perbaikan signifikan] berdasarkan capaian indikator kinerja yang ada. Periode ini menunjukkan [*tren positif berupa peningkatan penyelesaian perkara dan efektivitas RJ / tantangan berupa peningkatan jumlah perkara yang belum diimbangi penyelesaian sepadan]."})
`;

// ----------------------------------------------------
// SHEET 8: KASUS MENONJOL, BAB III & BAB IV
// ----------------------------------------------------
const sheet8Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"Monitoring kasus menonjol atau yang menjadi perhatian Masyarakat"}),
            
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Langsung dalam Internal atau dari pimpinan"}),
            (0,t.jsx)("p",{style:{fontStyle:"italic",color:"#475569"},children:"Judul kasus / tag, karena apa dapat menjadi kasus menonjol atau yang menjadi perhatian Masyarakat, Nomor LP jika ada, Hal terakhir yang dilakukan, Menjadi viral/tidak, Viral dimedia apa, Ket lain yang perlu ditambahkan"}),
            (0,t.jsx)("p",{children:"…"}),
            (0,t.jsx)("p",{children:"… dst."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Melalui media masa (pemberitaan) dan atau media sosial"}),
            (0,t.jsx)("p",{style:{fontStyle:"italic",color:"#475569"},children:"Judul kasus / tag, karena apa dapat menjadi kasus menonjol atau yang menjadi perhatian Masyarakat, Nomor LP jika ada, Hal terakhir yang dilakukan, Menjadi viral/tidak, Viral dimedia apa, Ket lain yang perlu ditambahkan"}),
            (0,t.jsx)("p",{children:"…"}),
            (0,t.jsx)("p",{children:"… dst."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Tugas lainnya"}),
            (0,t.jsx)("p",{children:"Melaksanakan kegiatan bersama [*Objek / Instansi / Kementerian / Lembaga] …… dalam rangka …… [*misal: penanaman jagung dalam rangka mewujudkan ketahanan pangan NKRI]"}),
            (0,t.jsx)("p",{children:"…… dst."}),

            // BAB III HASIL YANG DICAPAI
            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"HASIL YANG DICAPAI"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"[*Mendapatkan Penghargaan / Apresiasi / Hal-hal lain yang perlu dilaporkan]"}),
            (0,t.jsx)("p",{children:"……[*Berisi keterangan hasil yang dicapai dari judul A]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Faktor yang mempengaruhi"}),
            (0,t.jsx)("p",{children:"……[*Berisi Faktor-faktor yang mempengaruhi kinerja Satuan kerja yang menangani kegiatan berdasarkan tugas-tugas yang dilaksanakan di poin II baik faktor keberhasilan dan faktor yang mempengaruhi belum tercapainya tujuan yang ada]……"}),

            // BAB IV KESIMPULAN DAN SARAN
            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"KESIMPULAN DAN SARAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Kesimpulan"}),
            (0,t.jsx)("p",{children:"……[*Berisi Kesimpulan yang disimpulan yang dapat berdasarkan data yang diberikan oleh satuan kerja dan tambahan Kesimpulan dari penandatangan laporan ini]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Saran"}),
            (0,t.jsx)("p",{children:"……[*Berisi saran dari satuan kerja yang membuat laporan bahwa diperlukan apa dalam menanggapi Kesimpulan yang telah dibuat di atasnya]……"})
`;

// ----------------------------------------------------
// SHEET 9: BAB V PENUTUP & TANDA TANGAN DINAS POLRI
// ----------------------------------------------------
const sheet9Content = `
            // BAB V PENUTUP
            (0,t.jsx)("div",{className:"anev-section-title",children:"PENUTUP"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"Rencana Tindak Lanjut"}),
            (0,t.jsx)("p",{children:"……[*Berisi informasi Tindak Lanjut dari Kegiatan yang akan dilaksanakan kedepan/Hal yang belum tercapai/Komitmen Satuan Kerja dalam menambah dan atau memperbaiki kekurangan kedepannya]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"Penutup"}),
            (0,t.jsx)("p",{children:"Demikian Laporan [*PERIOD] Pembinaan Operasional ini dibuat berdasarkan data dan sebagaimana hasil analisis yang ada untuk kemudian dapat menjadi bahan masukan kepada pimpinan."}),

            // TABEL TANDA TANGAN KEDINASAN RESMI POLRI
            (0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",marginTop:"3rem",border:"none"},children:[
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsxs)("td",{style:{width:"45%",verticalAlign:"top",border:"none",padding:"4px 8px"},children:[
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"10pt"},children:"Lampiran:"}),
                    (0,t.jsx)("div",{style:{fontSize:"9.5pt",color:"#475569"},children:"dan seterusnya."})
                  ]}),
                  (0,t.jsxs)("td",{style:{width:"55%",textAlign:"center",verticalAlign:"top",border:"none",padding:"4px 8px"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"10pt"},children:"[*Location], [dd Mmmm yyyy]"}),
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"10pt",marginTop:"4px"},children:"a.n. [*HEAD OF ORGANIZATION LEVEL]"}),
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"10pt"},children:"[*KBO Level]"}),
                    (0,t.jsx)("div",{style:{height:"4.5rem"}}), // RUANG TANDA TANGAN DINAS
                    (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10pt",textDecoration:"underline"},children:"[*KBO NAME]"}),
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9.5pt"},children:"[*PANGKAT] NRP/NIP [*ID NRP/NIP]"})
                  ]})
                ]})
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

export function getToolbarAndSheets() {
  return `
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar anev-no-print",children:[
          // 1. Undo, Redo, Print
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Urungkan (Undo)",onClick:() => runDocCmd("undo"),children:"↶"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Ulangi (Redo)",onClick:() => runDocCmd("redo"),children:"↷"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak / Print PDF (Ctrl+P)",onClick:handleDirectPrint,children:"🖨️"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 2. Heading / Format Block
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => runDocCmd("formatBlock", e.target.value),defaultValue:"p",title:"Gaya Paragraf",children:[
            (0,t.jsx)("option",{value:"p",children:"Teks Normal"}),
            (0,t.jsx)("option",{value:"h1",children:"Judul Utama (H1)"}),
            (0,t.jsx)("option",{value:"h2",children:"Sub Judul (H2)"}),
            (0,t.jsx)("option",{value:"h3",children:"Bagian (H3)"})
          ]}),

          // 3. Font Family
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => runDocCmd("fontName", e.target.value),defaultValue:"Arial",title:"Jenis Huruf",children:[
            (0,t.jsx)("option",{value:"Arial",children:"Arial"}),
            (0,t.jsx)("option",{value:"Times New Roman",children:"Times New Roman"}),
            (0,t.jsx)("option",{value:"Calibri",children:"Calibri"}),
            (0,t.jsx)("option",{value:"Georgia",children:"Georgia"})
          ]}),

          // 4. Font Size
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => runDocCmd("fontSize", e.target.value),defaultValue:"3",title:"Ukuran Huruf",children:[
            (0,t.jsx)("option",{value:"2",children:"10 pt"}),
            (0,t.jsx)("option",{value:"3",children:"11 pt"}),
            (0,t.jsx)("option",{value:"4",children:"12 pt"}),
            (0,t.jsx)("option",{value:"5",children:"14 pt"}),
            (0,t.jsx)("option",{value:"6",children:"18 pt"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 5. Formatting Bold, Italic, Underline, Strike
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tebal (Ctrl+B)",onClick:() => runDocCmd("bold"),children:(0,t.jsx)("b",{children:"B"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Miring (Ctrl+I)",onClick:() => runDocCmd("italic"),children:(0,t.jsx)("i",{children:"I"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Garis Bawah (Ctrl+U)",onClick:() => runDocCmd("underline"),children:(0,t.jsx)("u",{children:"U"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Coret (Strikethrough)",onClick:() => runDocCmd("strikeThrough"),children:(0,t.jsx)("s",{children:"S"})}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 6. Text Color & Highlight Color
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Warna Teks",onClick:() => { setShowTextColorPalette(!showTextColorPalette); setShowBgColorPalette(false); },children:(0,t.jsx)("span",{style:{borderBottom:"3px solid #1e293b",paddingBottom:"1px",fontWeight:900},children:"A"})}),
            showTextColorPalette && (0,t.jsx)("div",{className:"anev-palette-dropdown",children:
              ["#000000","#1e293b","#dc2626","#ea580c","#d97706","#16a34a","#2563eb","#7c3aed","#db2777"].map(c => 
                (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c},onClick:() => { runDocCmd("foreColor", c); setShowTextColorPalette(false); }})
              )
            })
          ]}),
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Warna Sorot (Highlight)",onClick:() => { setShowBgColorPalette(!showBgColorPalette); setShowTextColorPalette(false); },children:(0,t.jsx)("span",{style:{background:"#fde047",padding:"1px 4px",borderRadius:"2px",fontWeight:900},children:"H"})}),
            showBgColorPalette && (0,t.jsx)("div",{className:"anev-palette-dropdown",children:
              ["transparent","#fef08a","#bbf7d0","#bae6fd","#fed7aa","#fbcfe8","#e2e8f0"].map(c => 
                (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c==="transparent"?"#ffffff":c,border:c==="transparent"?"1px dashed #94a3b8":"1px solid #cbd5e1"},onClick:() => { runDocCmd("hiliteColor", c); setShowBgColorPalette(false); }})
              )
            })
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 7. Alignments (Left, Center, Right, Justify - Default Justify)
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri",onClick:() => runDocCmd("justifyLeft"),children:"⇤"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Tengah",onClick:() => runDocCmd("justifyCenter"),children:"⇎"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kanan",onClick:() => runDocCmd("justifyRight"),children:"⇥"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",style:{background:"#e2e8f0",color:"#1d4ed8",fontWeight:800},title:"Rata Kiri Kanan (Justify - Default)",onClick:() => runDocCmd("justifyFull"),children:"≡"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 8. Lists
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onClick:() => runDocCmd("insertUnorderedList"),children:"•≡"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Nomor (Numbered)",onClick:() => runDocCmd("insertOrderedList"),children:"1≡"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 9. Table Operations Dropdown
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{color:"#1d4ed8",fontWeight:700,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"4px",padding:"2px 8px",gap:"4px"},onClick:() => setShowTableMenu(!showTableMenu),title:"Menu Manipulasi Tabel",children:[
              "📊 ",
              (0,t.jsx)("span",{children:"Tabel ▾"})
            ]}),
            showTableMenu && (0,t.jsxs)("div",{className:"anev-menu-dropdown",children:[
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { insertCustomTable(); setShowTableMenu(false); },children:"➕ Sisipkan Tabel Baru"}),
              (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"2px 0"}}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleAddTableRow(true); setShowTableMenu(false); },children:"⬆️ Tambah Baris Atas"}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleAddTableRow(false); setShowTableMenu(false); },children:"⬇️ Tambah Baris Bawah"}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleDeleteTableRow(); setShowTableMenu(false); },children:"❌ Hapus Baris"}),
              (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"2px 0"}}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleAddTableCol(true); setShowTableMenu(false); },children:"⬅️ Tambah Kolom Kiri"}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleAddTableCol(false); setShowTableMenu(false); },children:"➡️ Tambah Kolom Kanan"}),
              (0,t.jsx)("div",{className:"anev-menu-item",onClick:() => { handleDeleteTableCol(); setShowTableMenu(false); },children:"❌ Hapus Kolom"}),
              (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"2px 0"}}),
              (0,t.jsx)("div",{className:"anev-menu-item",style:{color:"#dc2626"},onClick:() => { handleDeleteTable(); setShowTableMenu(false); },children:"🗑️ Hapus Tabel"})
            ]})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 10. Sisipkan Logo Reserse (Bila Terhapus)
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",color:"#475569"},onClick:handleInsertLogo,title:"Sisipkan kembali lambang Reserse",children:[
            "🖼️ ",
            (0,t.jsx)("span",{children:"Sisipkan Logo"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 11. Sinkron Data CAS
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{background:"#2563eb",color:"#ffffff",border:"1px solid #1d4ed8",borderRadius:"4px",padding:"2px 10px",fontWeight:800,gap:"4px"},onClick:() => resolveAutoTags(),title:"Gantikan semua tag dinamis dengan data satker dan periode terkini",children:[
            "✨ ",
            (0,t.jsx)("span",{children:"Sinkron Data CAS"})
          ]})
        ]}),

        // WORKSPACE A4 9 PAGES
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-pages-workspace",children:[
  `;
}
