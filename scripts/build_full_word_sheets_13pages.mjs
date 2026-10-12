import fs from 'fs';

console.log('Generating official 13-page Word template matching user specification...');

const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

// Helper to render sheet
function renderSheet(pageNum, contentJsx, isLastPage = false) {
  const topHeaderJsx = pageNum === 1 
    ? `(0,t.jsx)("div",{style:{height:"14px"}})`
    : `(0,t.jsx)("div",{style:{textAlign:"center",fontWeight:700,fontSize:"10pt",color:"#000000",marginBottom:"14px",userSelect:"none"},children:${pageNum}})`;

  const catchwordJsx = isLastPage
    ? ``
    : `(0,t.jsx)("div",{style:{textAlign:"right",fontSize:"8.5pt",fontStyle:"italic",color:"#475569",marginTop:"16px",userSelect:"none"},children:"[*First Next Line Char] + [……]"})`;

  return `
        (0,t.jsxs)("div",{"data-page":${pageNum},className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay (NRP 98010710)
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content (WYSIWYG Editable)
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            ${topHeaderJsx},
            ${contentJsx},
            ${catchwordJsx}
          ]}),
          // Page Footer (Forensic Stamp)
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right page-num-display",children:${pageNum}})
          ]})
        ]})
  `;
}

// ----------------------------------------------------
// SHEET 1: Kop Dinas, Logo Reserse Asli, Judul, BAB I PENDAHULUAN & Maksud Tujuan
// ----------------------------------------------------
const sheet1Content = `
            // KOP DINAS & SECURITY STAMP
            (0,t.jsxs)("div",{style:{textAlign:"center",marginBottom:"0.8rem"},children:[
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
              (0,t.jsx)("div",{style:{borderBottom:"2px solid #000",marginTop:"8px",marginBottom:"12px"}})
            ]}),

            // I. PENDAHULUAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"I. PENDAHULUAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Umum"}),
            (0,t.jsx)("p",{children:"Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu {{AUTO: tanggal_awal}} s.d. {{AUTO: tanggal_akhir}}, mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}}."}),
            (0,t.jsx)("p",{children:"Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Maksud dan Tujuan"}),
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"1. Maksud"}),
            (0,t.jsx)("p",{children:"Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode yang telah ditentukan."}),
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"2. Tujuan"}),
            (0,t.jsx)("p",{children:"Laporan ini bertujuan untuk:"})
`;

// ----------------------------------------------------
// SHEET 2: Lanjutan Tujuan (a,b,c), C. Dasar (1-7), D. Ruang Lingkup
// ----------------------------------------------------
const sheet2Content = `
            (0,t.jsxs)("div",{style:{margin:"2px 0 8px 1.2rem"},children:[
              (0,t.jsx)("p",{children:"a. Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;"}),
              (0,t.jsx)("p",{children:"b. Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;"}),
              (0,t.jsx)("p",{children:"c. Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan {{AUTO: structure_level}}."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"C. Dasar"}),
            (0,t.jsxs)("div",{style:{margin:"2px 0 8px 1.2rem"},children:[
              (0,t.jsx)("p",{children:"1. Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("p",{children:"2. [*Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang Susunan Organisasi dan Tata Kerja Satuan Organisasi pada Tingkat Markas Besar Kepolisian Negara Republik Indonesia / Peraturan Kepolisian Negara Republik Indonesia Nomor 3 Tahun 2024 tentang Perubahan atas Peraturan Kepolisian Negara Republik Indonesia Nomor 14 Tahun 2018 tentang Susunan Organisasi dan Tata Kerja Kepolisian Daerah];"}),
              (0,t.jsx)("p",{children:"3. Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Keamanan dan Ketertiban Masyarakat;"}),
              (0,t.jsx)("p",{children:"4. Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;"}),
              (0,t.jsx)("p",{children:"5. Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("p",{children:"6. Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;"}),
              (0,t.jsx)("p",{children:"7. Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang pengiriman format Laporan Bulanan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"D. Ruang Lingkup"}),
            (0,t.jsx)("p",{children:"Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode {{[*DETAIL PERIOD]}}."})
`;

// ----------------------------------------------------
// SHEET 3: Lanjutan Ruang Lingkup (8 poin), E. IKU & Tabel 1.1
// ----------------------------------------------------
const sheet3Content = `
            (0,t.jsx)("p",{children:"Adapun ruang lingkup pelaporan meliputi:"}),
            (0,t.jsxs)("div",{style:{margin:"2px 0 8px 1.2rem"},children:[
              (0,t.jsx)("p",{children:"1. Data laporan polisi (LP) yang masuk dan diselesaikan;"}),
              (0,t.jsx)("p",{children:"2. Penanganan perkara berdasarkan jenis tindak pidana;"}),
              (0,t.jsx)("p",{children:"3. Pelaksanaan restorative justice (RJ) dan penyelesaian non-litigasi lainnya;"}),
              (0,t.jsx)("p",{children:"4. Data barang bukti yang diamankan dan/atau disita;"}),
              (0,t.jsx)("p",{children:"5. Kondisi kekuatan personel serta beban kerja penyidik;"}),
              (0,t.jsx)("p",{children:"6. Kerja sama dan koordinasi dengan satuan kerja lain, instansi eksternal, atau operasi terpusat;"}),
              (0,t.jsx)("p",{children:"7. Kasus-kasus menonjol atau menjadi atensi pimpinan;"}),
              (0,t.jsx)("p",{children:"8. Analisis dan evaluasi kinerja penyidikan berdasarkan indikator yang ditetapkan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"E. Indeks Kinerja Utama"}),
            (0,t.jsx)("p",{children:"Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel dalam menjawab harapan masyarakat terhadap keadilan hukum."}),

            // Tabel 1.1 IKU
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"36%"},children:"Sasaran Strategis"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"28%"},children:"Indikator Kinerja Utama"}),
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
                (0,t.jsx)("td",{children:"Penegakan Hukum yang Humanis, Akuntabel, dan Berkeadilan (Renstra 2020-2024: Penegakan hukum secara berkeadilan)"}),
                (0,t.jsx)("td",{children:"3. Indeks Gakkum Polri"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,6"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,7"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,8"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,9"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"4,0"})
              ]})})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.1: indikator kinerja utama indeks gakkum polri"}),

            (0,t.jsx)("p",{children:"Target Indeks Kinerja Utama (IKU) ini bersifat tahunan dan digunakan sebagai dasar dalam mengevaluasi kinerja satuan kerja (satker) fungsi"})
`;

// ----------------------------------------------------
// SHEET 4: Lanjutan IKU, II. TUGAS YANG DILAKSANAKAN, Manajemen Operasional
// ----------------------------------------------------
const sheet4Content = `
            (0,t.jsx)("p",{children:"Reserse, mulai dari tingkat Polsek, Polres, Polda, hingga Bareskrim Polri. Penilaian terhadap pencapaian IKU dilakukan melalui pengukuran berbasis data yang bersumber dari Crime Analytic System (CAS), yang mengelola data secara otomatis. Dengan demikian, IKU tidak hanya menjadi alat ukur administratif, tetapi juga instrumen strategis dalam perencanaan kebutuhan personel, anggaran, serta pengambilan kebijakan berbasis analisis beban kerja dan kasus prioritas."}),

            // II. TUGAS YANG DILAKSANAKAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"II. TUGAS YANG DILAKSANAKAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tugas utama"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan ini, {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} melaksanakan tugas pokok dan fungsi di bidang reserse kriminal sesuai dengan ketentuan yang berlaku. Tugas-tugas tersebut mencakup kegiatan penyelidikan, penyidikan, pelaksanaan gelar perkara, penegakan hukum, dan kegiatan pendukung lainnya yang relevan dengan penanganan tindak pidana."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"1. Manajemen Operasional"}),
            (0,t.jsx)("p",{children:"Pelaksanaan tugas operasional ditunjang oleh ketersediaan sumber daya manusia (SDM), anggaran belanja, serta sarana dan prasarana (sarpras). Pengelolaan SDM dan sarpras dilakukan secara efektif dan efisien untuk mendukung capaian kinerja yang optimal."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"a. Sumber Daya Manusia"}),
            (0,t.jsx)("p",{children:"SDM yang mendukung pelaksanaan tugas terdiri dari berbagai tingkat kepangkatan, fungsi penyidikan, serta latar belakang pendidikan. Adapun keterangan yang perlu disampaikan terkait SDM periode ini [*Nihil / Mutasi 1 (satu) orang ke … / MD karena … / dll terkait keterangan SDM.]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"b. Anggaran Belanja"}),
            (0,t.jsx)("p",{children:"Penggunaan anggaran belanja selama periode pelaporan terbagi dalam tiga jenis: Belanja Pegawai, Belanja Barang, dan Belanja Modal. Penyerapan anggaran pada periode ini [*Nihil / terserap … digunakan untuk … / dll.]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"c. Sarana prasarana"})
`;

// ----------------------------------------------------
// SHEET 5: Sarana, Prasarana, Tahanan (Tabel 1.8), Barang Bukti (Tabel 1.9 Part 1)
// ----------------------------------------------------
const sheet5Content = `
            (0,t.jsx)("p",{children:"Penggunaan dan kondisi sarana serta prasarana dalam mendukung operasional satuan disusun berdasarkan klasifikasi berikut:"}),
            
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.2rem"},children:"1) Sarana"}),
            (0,t.jsx)("p",{children:"Terkait penggunaan dan kondisi sarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.2rem"},children:"2) Prasarana"}),
            (0,t.jsx)("p",{children:"Terkait penggunaan dan kondisi prasarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"d. Tahanan dan Barang Bukti"}),
            (0,t.jsx)("p",{children:"Jumlah tahanan serta barang bukti yang dikelola selama periode pelaporan dijabarkan secara kuantitatif, baik berdasarkan kategori maupun jenisnya."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.2rem"},children:"1) Tahanan"}),

            // Tabel 1.8 Jumlah Tahanan
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"33%"},children:"JENIS TAHANAN"}),
                  (0,t.jsx)("th",{colSpan:3,children:"JUMLAH TAHANAN"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"TOTAL TAHANAN"}),
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
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{colSpan:6,children:"Dewasa"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{colSpan:6,children:"Anak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:700},children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),(0,t.jsx)("td",{colSpan:6,children:"Titipan Instansi / K / L"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{colSpan:6,children:"Dewasa"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{colSpan:6,children:"Anak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Laki-laki"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Perempuan"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:700},children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#e2e8f0",fontWeight:800},children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"Grand Total"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{children:"*hanya contoh"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.8: Jumlah Tahanan"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"2) Barang Bukti"}),

            // Tabel 1.9 Part 1
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"40%"},children:"JENIS BARANG BUKTI"}),
                  (0,t.jsx)("th",{colSpan:2,children:"BARANG BUKTI"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"20%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"17%"},children:"JUMLAH"}),
                  (0,t.jsx)("th",{style:{width:"17%"},children:"SATUAN"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"6"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bergerak"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{colSpan:4,children:"Kendaraan"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Roda 2"}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Roda 4"}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Sepeda listrik"}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:""}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{colSpan:4,children:"Perangkat Elektronik"})]})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 6: Lanjutan Tabel 1.9 Part 2, Kerjasama, 3. Analisis & Evaluasi
// ----------------------------------------------------
const sheet6Content = `
            // Tabel 1.9 Part 2
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{width:"6%"}}),(0,t.jsx)("td",{style:{width:"40%",paddingLeft:"16px"},children:"HP"}),(0,t.jsx)("td",{style:{width:"17%"}}),(0,t.jsx)("td",{style:{width:"17%"}}),(0,t.jsx)("td",{style:{width:"20%"},children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Laptop"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Tablet"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{colSpan:4,children:"Senjata"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Tajam"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Airsoft gun"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Palu"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Senpi Rakitan"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{colSpan:4,children:"Dokumen cetak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Sertifikat"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Surat Berharga"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{colSpan:4,children:"Pakaian"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Baju"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Celana"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Alas kaki"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Tidak Bergerak"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Tanah & Bangunan"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{colSpan:4,children:"Aset"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Fasilitas Olahraga"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Kos"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Apartemen"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Hotel"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"C."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Finansial"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{colSpan:4,children:"Uang Tunai"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Valuta Nasional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Valuta Asing"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"US Dollar"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{colSpan:4,children:"Uang dalam Rekening Bank"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"BRI"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{colSpan:4,children:"Cryptocurrency"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Binance"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"BTC"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"TokoCrypto"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ETH"}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"D."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Digital / Elektronik"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Dokumen Elektronik"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Data digital"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{style:{fontWeight:600},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{colSpan:4,children:"Rekaman media"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"CCTV"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{}),(0,t.jsx)("td",{style:{paddingLeft:"16px"},children:"Camrecorder"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"E."}),(0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bahan / Obat-Obatan Berbahaya"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Narkoba"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Pengawet mayat / Balsam"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Zat Radioaktif"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{children:"*hanya contoh"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 1.9: Jenis dan Jumlah Barang Bukti"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"2. Kerjasama yang dilaksanakan"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan, satker kami telah melaksanakan berbagai bentuk kerjasama dengan instansi internal maupun eksternal, baik yang bersifat strategis maupun teknis operasional. Adapun kerja sama yang dilaksanakan pada periode ini [*Nihil. / yaitu: Kerja sama … dengan pihak … dalam bidang … untuk … ]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"3. Analisis dan evaluasi terhadap pelaksanaan tugas"}),
            (0,t.jsx)("p",{children:"Analisis dan evaluasi ini disusun berdasarkan data operasional yang terintegrasi melalui CAS. Evaluasi dilakukan dengan pendekatan kuantitatif dan komparatif, membandingkan indikator kinerja antara periode pelaporan saat ini dengan periode sebelumnya yang setara"})
`;

// ----------------------------------------------------
// SHEET 7: (apple to apple), a. Analisis, Tabel 2.1, Tabel 2.2, Grafik
// ----------------------------------------------------
const sheet7Content = `
            (0,t.jsx)("p",{children:"(apple to apple). Metode perbandingan ini memungkinkan pengukuran tren kinerja yang akurat serta mendukung penyusunan kebijakan berbasis data."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"a. Analisis"}),
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"1) Data kejahatan periode sebelumnya"}),

            // Tabel 2.1 (anev-table-2-1)
            (0,t.jsxs)("table",{className:"anev-table-naskah anev-table-2-1",children:[
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
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{j_kjht _x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{lp_tgk_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{lp_jln_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{cc_tgk_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{cc_jln_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{persentase_x}}"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"*sesuai yang"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"ditangani"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"oleh satker"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"6."}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tt_tgk}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tt_jln}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tc_tgk}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tc_jln}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{persentase_tot}}"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.1: data kejahatan periode sebelumnya"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"2) Data kejahatan periode ini"}),

            // Tabel 2.2 (anev-table-2-2)
            (0,t.jsxs)("table",{className:"anev-table-naskah anev-table-2-2",children:[
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
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{j_kjht _x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{lp_tgk_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{lp_jln_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{cc_tgk_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{cc_jln_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{persentase_x}}"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"*sesuai yang"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"ditangani"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"oleh satker"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"6."}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tt_tgk}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tt_jln}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tc_tgk}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{tc_jln}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"{{persentase_tot}}"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.2: data kejahatan periode ini"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"3) Perbandingan grafis data kejahatan"}),

            // Vector Comparative Chart
            (0,t.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"10px 14px",margin:"6px 0"},children:[
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9pt",textAlign:"center",marginBottom:"6px",color:"#1e293b"},children:"Data Kejahatan (Period 1 vs Period 2)"}),
              (0,t.jsxs)("svg",{style:{width:"100%",height:"130px",display:"block"},viewBox:"0 0 540 130",children:[
                (0,t.jsx)("line",{x1:"40",y1:"10",x2:"40",y2:"100",stroke:"#94a3b8",strokeWidth:"1"}),
                (0,t.jsx)("line",{x1:"40",y1:"100",x2:"520",y2:"100",stroke:"#94a3b8",strokeWidth:"1"}),
                // Y axis ticks
                (0,t.jsx)("text",{x:"32",y:"104",fontSize:"8",textAnchor:"end",fill:"#64748b",children:"0"}),
                (0,t.jsx)("text",{x:"32",y:"82",fontSize:"8",textAnchor:"end",fill:"#64748b",children:"1"}),
                (0,t.jsx)("text",{x:"32",y:"60",fontSize:"8",textAnchor:"end",fill:"#64748b",children:"2"}),
                (0,t.jsx)("text",{x:"32",y:"38",fontSize:"8",textAnchor:"end",fill:"#64748b",children:"3"}),
                (0,t.jsx)("text",{x:"32",y:"16",fontSize:"8",textAnchor:"end",fill:"#64748b",children:"4"}),
                // Lines
                (0,t.jsx)("polyline",{fill:"none",stroke:"#2563eb",strokeWidth:"2",points:"75,30 150,75 225,50 300,30 375,85 450,55"}),
                (0,t.jsx)("polyline",{fill:"none",stroke:"#f97316",strokeWidth:"2",points:"75,70 150,30 225,85 300,55 375,35 450,70"}),
                // Points P1
                (0,t.jsx)("circle",{cx:"75",cy:"30",r:"3.5",fill:"#2563eb"}),
                (0,t.jsx)("circle",{cx:"150",cy:"75",r:"3.5",fill:"#2563eb"}),
                (0,t.jsx)("circle",{cx:"225",cy:"50",r:"3.5",fill:"#2563eb"}),
                (0,t.jsx)("circle",{cx:"300",cy:"30",r:"3.5",fill:"#2563eb"}),
                (0,t.jsx)("circle",{cx:"375",cy:"85",r:"3.5",fill:"#2563eb"}),
                (0,t.jsx)("circle",{cx:"450",cy:"55",r:"3.5",fill:"#2563eb"}),
                // Points P2
                (0,t.jsx)("circle",{cx:"75",cy:"70",r:"3.5",fill:"#f97316"}),
                (0,t.jsx)("circle",{cx:"150",cy:"30",r:"3.5",fill:"#f97316"}),
                (0,t.jsx)("circle",{cx:"225",cy:"85",r:"3.5",fill:"#f97316"}),
                (0,t.jsx)("circle",{cx:"300",cy:"55",r:"3.5",fill:"#f97316"}),
                (0,t.jsx)("circle",{cx:"375",cy:"35",r:"3.5",fill:"#f97316"}),
                (0,t.jsx)("circle",{cx:"450",cy:"70",r:"3.5",fill:"#f97316"}),
                // X axis labels
                (0,t.jsx)("text",{x:"75",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 1"}),
                (0,t.jsx)("text",{x:"150",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 2"}),
                (0,t.jsx)("text",{x:"225",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 3"}),
                (0,t.jsx)("text",{x:"300",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 4"}),
                (0,t.jsx)("text",{x:"375",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 5"}),
                (0,t.jsx)("text",{x:"450",y:"112",fontSize:"7.5",textAnchor:"middle",fill:"#475569",children:"Scale 6"}),
                // Legend
                (0,t.jsx)("circle",{cx:"190",cy:"124",r:"3",fill:"#2563eb"}),
                (0,t.jsx)("text",{x:"198",y:"127",fontSize:"7.5",fill:"#334155",children:"Period 1"}),
                (0,t.jsx)("circle",{cx:"310",cy:"124",r:"3",fill:"#f97316"}),
                (0,t.jsx)("text",{x:"318",y:"127",fontSize:"7.5",fill:"#334155",children:"Period 2"})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 8: Gambar 1.1, Poin a-e (KP, KM, KT, KB, Rumus X), 4) RJ Pengantar & Tabel 2.3 Part 1
// ----------------------------------------------------
const sheet8Content = `
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",textAlign:"center",marginBottom:"10px"},children:"Gambar 1.1: grafik perbandingan tren jumlah kasus tindak pidana"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"a) Jumlah Tunggakan Tindak Pidana (KP)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah tunggakan Tindak Pidana sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"b) Jumlah Tindak Pidana (KM)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Tindak Pidana sebanyak [x] LP atau [y] % dibandingkan dengan periode sebelumnya sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"c) Jumlah Penyelesaian Tunggakan Tindak Pidana (KT)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Penyelesaian Tunggakan Tindak Pidana sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"d) Jumlah Penyelesaian Tindak Pidana (KB)"}),
            (0,t.jsx)("p",{children:"Terjadi [*peningkatan / penurunan] terhadap jumlah Penyelesaian Tindak Pidana sebanyak [x] LP atau [y] % dibandingkan dengan periode sebelumnya sebanyak [x] LP atau [y] %"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.4rem"},children:"e) Persentase Penanganan Tindak Pidana (X)"}),
            (0,t.jsx)("p",{children:"Rumus:"}),
            (0,t.jsx)("p",{children:"X = KS : KD x 100%"}),
            (0,t.jsx)("p",{children:"X = (KB + KT) : (KM + KP) x 100%"}),
            (0,t.jsx)("p",{style:{fontWeight:700},children:"[*count: X = (KB + KT) : (KM + KP) x 100%]"}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"4) Penanganan Tindak Pidana melalui Restorative Justice"}),
            (0,t.jsx)("p",{children:"Penanganan perkara dengan pendekatan Restorative Justice (RJ) merupakan salah satu upaya penyelesaian tindak pidana melalui proses mediasi penal antara para pihak terkait."}),
            (0,t.jsx)("p",{children:"Pada periode pelaporan ini, telah dilaksanakan RJ terhadap sejumlah perkara dengan hasil sebagai berikut:"}),

            // Tabel 2.3 Part 1
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"27%"},children:"JENIS TIPID"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"CRIME TOTAL (CT)"}),
                  (0,t.jsx)("th",{colSpan:3,children:"SELESAI (RJ)"}),
                  (0,t.jsx)("th",{colSpan:3,children:"PERSENTASE (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"7%"},children:"LID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"SID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"TOT"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"LID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"SID"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"TOT"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"}),(0,t.jsx)("td",{children:"9"}),(0,t.jsx)("td",{children:"10"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"{{jenis_tindak_pidana_x}}"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"*sesuai yang"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"diselesaikan dgn RJ"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"4."}),(0,t.jsx)("td",{children:"oleh satker"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"5."}),(0,t.jsx)("td",{children:"-"}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{}),(0,t.jsx)("td",{})]})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 9: Lanjutan Tabel 2.3 Part 2, Paragraf RJ, 5) Beban Kinerja & Tabel 2.4
// ----------------------------------------------------
const sheet9Content = `
            // Tabel 2.3 Part 2
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{width:"5%",textAlign:"center"},children:"6."}),(0,t.jsx)("td",{style:{width:"27%"},children:"-"}),(0,t.jsx)("td",{style:{width:"14%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"7%"}}),(0,t.jsx)("td",{style:{width:"10%"}})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CT]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RJ-JUMLAH]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RJ-PERSEN]"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.3: penanganan tindak pidana melalui RJ"}),

            (0,t.jsx)("p",{children:"Efektifitas penyelesaian Tindak Pidana melalui RJ berdasarkan analisis data di atas, [*ORGANIZATION LEVEL] mampu melaksanakan penyelesaian dengan menerapkan RJ sebanyak [x] LP atau sekitar [y] % dari [*TOTAL] LP yang ada. RJ [*kurang/cukup/sangat] efektif terhadap penyelesaian Tindak Pidana."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.6rem"},children:"5) Analisis beban kinerja"}),
            (0,t.jsx)("p",{children:"Analisis beban kinerja dilakukan untuk mengukur tingkat beban kerja berdasarkan jumlah perkara yang ditangani dibandingkan dengan jumlah personel penyidik yang tersedia pada periode pelaporan. Perhitungan ini memanfaatkan data operasional yang terintegrasi di CAS dan dianalisis secara apple to apple dengan periode sebelumnya."}),

            // Tabel 2.4 Analisis Beban Kinerja
            (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"NO"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"17%"},children:"PERIODE"}),
                  (0,t.jsx)("th",{colSpan:3,children:"DATA TIPID"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"JML AGT"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"15%"},children:"RATIO LP/AGT"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"15%"},children:"BEBAN KINERJA (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"KET"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"CT"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"CC"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"CR (%)"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontSize:"8pt",textAlign:"center"},children:[
                  (0,t.jsx)("td",{children:"1"}),(0,t.jsx)("td",{children:"2"}),(0,t.jsx)("td",{children:"3"}),(0,t.jsx)("td",{children:"4"}),(0,t.jsx)("td",{children:"5"}),(0,t.jsx)("td",{children:"6"}),(0,t.jsx)("td",{children:"7"}),(0,t.jsx)("td",{children:"8"}),(0,t.jsx)("td",{children:"9"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Periode 1"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CT-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CC-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CR-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*AGT-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RATIO-P1]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*BEBAN-P1]"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Periode 2"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CT-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CC-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*CR-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*AGT-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*RATIO-P2]"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"[*BEBAN-P2]"}),(0,t.jsx)("td",{children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣCT"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣCC"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"(ΣCC÷ΣCT)×100"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣAGT"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"ΣRATIO"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"(ΣRATIO ÷ standar)×100"}),(0,t.jsx)("td",{children:"-"})]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"8.5pt",fontStyle:"italic",margin:"4px 0 8px 0"},children:"Tabel 2.4: analisis beban kinerja"}),

            (0,t.jsx)("p",{children:"Berdasarkan data pada Tabel [*Nomor Tabel], jumlah kasus yang harus ditangani (Crime Total/CT) pada periode [*PERIODE 2] tercatat sebanyak *[CT-P2] kasus, mengalami [*peningkatan/penurunan] sebesar *[SELISIH-CT] kasus atau *[PERSEN-CT]% dibandingkan periode [*PERIODE 1] yang berjumlah *[CT-P1] kasus."}),
            (0,t.jsx)("p",{children:"Tingkat penyelesaian perkara (Crime Clearance/CC) pada periode [*PERIODE 2] adalah *[CC-P2] kasus dengan Clearance Rate (CR) sebesar [*CR-P2]%, [*lebih tinggi/lebih rendah] *[SELISIH-CR]% dibandingkan periode sebelumnya ([*CR-P1]%)."}),
            (0,t.jsx)("p",{children:"Jumlah penyidik/penyidik pembantu aktif pada periode [*PERIODE 2] tercatat sebanyak *[AGT-P2] personel, sehingga rata-rata beban kasus per penyidik (Ratio"})
`;

// ----------------------------------------------------
// SHEET 10: Lanjutan Beban Kinerja, b. Evaluasi (Tren Kejahatan, Efektivitas, RJ)
// ----------------------------------------------------
const sheet10Content = `
            (0,t.jsx)("p",{children:"LP/AGT) adalah *[RATIO-P2] kasus, atau setara dengan *[BEBAN-P2]% dari standar beban ideal yang telah ditetapkan."}),
            (0,t.jsx)("p",{children:"Berdasarkan perbandingan antarperiode, dapat disimpulkan bahwa beban kinerja [*meningkat/menurun] pada periode [*PERIODE 2], yang [*berpotensi memerlukan penambahan personel/masih berada pada batas ideal] untuk menjaga efektivitas penanganan perkara."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"b. Evaluasi"}),
            (0,t.jsx)("p",{children:"Berdasarkan data hasil analisis pada periode [*PERIODE], Satker *[NAMA SATKER] telah menangani *[CT] perkara (Crime Total/CT), dengan tingkat penyelesaian (Crime Clearance/CC) sebanyak *[CC] perkara atau [*CR]%."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.5rem"},children:"1) Tren Kejahatan"}),
            (0,t.jsx)("p",{children:"Dibandingkan periode sebelumnya ([*PERIODE-SEBELUM]), jumlah perkara mengalami [*peningkatan/penurunan] sebesar *[SELISIH-CT] perkara ([*PERSEN-CT]%). Perubahan ini terutama dipengaruhi oleh [*faktor dominan dari data CAS, misal: peningkatan kasus penipuan daring / penurunan kasus pencurian konvensional]."}),
            (0,t.jsx)("p",{children:"Kondisi ini menunjukkan bahwa [*strategi penanggulangan berjalan efektif / perlu penyesuaian strategi] guna mengendalikan tren tersebut secara berkelanjutan."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.5rem"},children:"2) Efektivitas Penyelesaian Perkara"}),
            (0,t.jsx)("p",{children:"Tingkat penyelesaian (CC) mencapai *[CC] perkara, dengan Clearance Rate sebesar [*CR]%, [*lebih tinggi/lebih rendah] *[SELISIH-CR]% dibandingkan periode sebelumnya."}),
            (0,t.jsx)("p",{children:"Kinerja ini [*di atas target nasional sehingga perlu dipertahankan / di bawah target nasional sehingga perlu percepatan proses penyidikan] dengan tetap menjaga kualitas penanganan perkara."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.5rem"},children:"3) Optimalisasi RJ"}),
            (0,t.jsx)("p",{children:"Penyelesaian perkara melalui RJ pada periode ini mencapai *[RJ-JUMLAH] perkara atau *[RJ-PERSEN]%"})
`;

// ----------------------------------------------------
// SHEET 11: Lanjutan RJ, Beban Kinerja, Sumber Daya, 4. Kasus Menonjol (a. Langsung)
// ----------------------------------------------------
const sheet11Content = `
            (0,t.jsx)("p",{children:"dari total perkara yang diselesaikan."}),
            (0,t.jsx)("p",{children:"Hal ini [*menunjukkan pemanfaatan RJ berjalan optimal sesuai kebijakan Polri / masih perlu didorong agar lebih efektif terutama untuk perkara yang memenuhi syarat RJ], guna mengurangi beban perkara di penyidikan formal."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.5rem"},children:"4) Beban Kinerja Personel"}),
            (0,t.jsx)("p",{children:"Jumlah penyidik aktif (**[AGT]* personel) menghasilkan rasio *[RATIO LP/AGT] perkara per penyidik. Standar beban ideal adalah *[BEBAN-ID] perkara per penyidik."}),
            (0,t.jsx)("p",{children:"Beban kerja ini [*masih dalam batas ideal / melebihi batas ideal], sehingga [*memungkinkan fokus pada peningkatan kualitas penyidikan / berpotensi menurunkan efektivitas kerja jika tidak diimbangi penambahan personel atau redistribusi perkara]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.5rem"},children:"5) Sumber Daya dan Dukungan Operasional"}),
            (0,t.jsx)("p",{children:"Sarana dan prasarana penunjang penyidikan [*memadai/tidak memadai], dengan ketersediaan utama meliputi [*placeholder: daftar fasilitas dari CAS]."}),
            (0,t.jsx)("p",{children:"[*Dukungan operasional yang ada cukup memadai untuk menunjang pelaksanaan tugas / Perlu penambahan atau peremajaan sarana tertentu agar kinerja penyidikan lebih optimal]."}),
            (0,t.jsx)("p",{children:"Secara umum, pelaksanaan tugas pada periode *[PERIODE] [*telah berjalan baik / masih memerlukan perbaikan signifikan] berdasarkan capaian indikator kinerja yang ada. Periode ini menunjukkan [*tren positif berupa peningkatan penyelesaian perkara dan efektivitas RJ / tantangan berupa peningkatan jumlah perkara yang belum diimbangi penyelesaian sepadan]."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"4. Monitoring kasus menonjol atau yang menjadi perhatian Masyarakat"}),
            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"a. Langsung dalam Internal atau dari pimpinan"}),
            (0,t.jsx)("p",{children:"1) Judul kasus / tag, karena apa dapat menjadi kasus menonjol atau yang menjadi perhatian Masyarakat, Nomor LP jika ada, Hal terakhir yang dilakukan, Menjadi viral/tidak, Viral dimedia apa, Ket lain yang perlu ditambahkan"}),
            (0,t.jsx)("p",{children:"2) …"}),
            (0,t.jsx)("p",{children:"3) … dst."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.3rem"},children:"b. Melalui media masa (pemberitaan) dan atau media sosial"})
`;

// ----------------------------------------------------
// SHEET 12: Lanjutan b, B. Tugas Lainnya, III. HASIL YANG DICAPAI, IV. KESIMPULAN DAN SARAN
// ----------------------------------------------------
const sheet12Content = `
            (0,t.jsx)("p",{children:"1) Judul kasus / tag, karena apa dapat menjadi kasus menonjol atau yang menjadi perhatian Masyarakat, Nomor LP jika ada, Hal terakhir yang dilakukan, Menjadi viral/tidak, Viral dimedia apa, Ket lain yang perlu ditambahkan"}),
            (0,t.jsx)("p",{children:"2) …"}),
            (0,t.jsx)("p",{children:"3) … dst."}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginTop:"0.8rem"},children:"B. Tugas lainnya"}),
            (0,t.jsx)("p",{children:"1. Melaksanakan kegiatan bersama [*Objek / Instansi / Kementerian / Lembaga] …… dalam rangka …… [*misal: penanaman jagung dalam rangka mewujudkan ketahanan pangan NKRI]"}),
            (0,t.jsx)("p",{children:"2. …… dst."}),

            // III. HASIL YANG DICAPAI
            (0,t.jsx)("div",{className:"anev-section-title",children:"III. HASIL YANG DICAPAI"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. [*Mendapatkan Penghargaan / Apresiasi / Hal-hal lain yang perlu dilaporkan]"}),
            (0,t.jsx)("p",{children:"……[*Berisi keterangan hasil yang dicapai dari judul A]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Faktor yang mempengaruhi"}),
            (0,t.jsx)("p",{children:"……[*Berisi Faktor-faktor yang mempengaruhi kinerja Satuan kerja yang menangani kegiatan berdasarkan tugas-tugas yang dilaksanakan di poin II baik faktor keberhasilan dan faktor yang mempengaruhi belum tercapainya tujuan yang ada]……"}),

            // IV. KESIMPULAN DAN SARAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"IV. KESIMPULAN DAN SARAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Kesimpulan"}),
            (0,t.jsx)("p",{children:"……[*Berisi Kesimpulan yang disimpulan yang dapat berdasarkan data yang diberikan oleh satuan kerja dan tambahan Kesimpulan dari penandatangan laporan ini]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Saran"})
`;

// ----------------------------------------------------
// SHEET 13: Lanjutan Saran, V. PENUTUP, Tanda Tangan Resmi
// ----------------------------------------------------
const sheet13Content = `
            (0,t.jsx)("p",{children:"……[*Berisi saran dari satuan kerja yang membuat laporan bahwa diperlukan apa dalam menanggapi Kesimpulan yang telah dibuat di atasnya]……"}),

            // V. PENUTUP
            (0,t.jsx)("div",{className:"anev-section-title",children:"V. PENUTUP"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Rencana Tindak Lanjut"}),
            (0,t.jsx)("p",{children:"……[*Berisi informasi Tindak Lanjut dari Kegiatan yang akan dilaksanakan kedepan/Hal yang belum tercapai/Komitmen Satuan Kerja dalam menambah dan atau memperbaiki kekurangan kedepannya]……"}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Penutup"}),
            (0,t.jsx)("p",{children:"Demikian Laporan [*PERIOD] Pembinaan Operasional ini dibuat berdasarkan data dan sebagaimana hasil analisis yang ada untuk kemudian dapat menjadi bahan masukan kepada pimpinan."}),

            // OFFICIAL SIGNATURE BLOCK
            (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:"2.5rem"},children:[
              (0,t.jsxs)("div",{style:{fontSize:"9.5pt",lineHeight:1.4},children:[
                (0,t.jsx)("div",{children:"Lampiran:"}),
                (0,t.jsx)("div",{children:"dan seterusnya."})
              ]}),
              (0,t.jsxs)("div",{style:{textAlign:"center",width:"280px",fontSize:"10pt",lineHeight:1.35},children:[
                (0,t.jsx)("div",{children:"[*Location], [dd Mmmm yyyy]"}),
                (0,t.jsx)("div",{style:{marginTop:"4px"},children:"a.n. [*HEAD OF ORGANIZATION LEVEL]"}),
                (0,t.jsx)("div",{style:{fontWeight:700},children:"[*KBO Level]"}),
                (0,t.jsx)("div",{style:{height:"68px"}}),
                (0,t.jsx)("div",{style:{fontWeight:800,textDecoration:"underline",letterSpacing:"0.5px"},children:"[*KBO NAME]"}),
                (0,t.jsx)("div",{style:{fontSize:"9.5pt"},children:"[*PANGKAT] NRP/NIP [*ID NRP/NIP]"})
              ]})
            ]})
`;

// Export function generating all 13 sheets
export function getAll13Sheets() {
  return [
    renderSheet(1, sheet1Content),
    renderSheet(2, sheet2Content),
    renderSheet(3, sheet3Content),
    renderSheet(4, sheet4Content),
    renderSheet(5, sheet5Content),
    renderSheet(6, sheet6Content),
    renderSheet(7, sheet7Content),
    renderSheet(8, sheet8Content),
    renderSheet(9, sheet9Content),
    renderSheet(10, sheet10Content),
    renderSheet(11, sheet11Content),
    renderSheet(12, sheet12Content),
    renderSheet(13, sheet13Content, true)
  ].join(',\n');
}

export function getToolbarAndSheets() {
  return `
        // TAB 1: NASKAH DINAS (EDITOR WYSIWYG)
        // BARIS 3: MS WORD / GOOGLE DOCS TOOLBAR
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar anev-no-print",children:[
          // 1. Font Family
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => runDocCmd("fontName", e.target.value),defaultValue:"Arial",title:"Jenis Huruf (Font)",children:[
            (0,t.jsx)("option",{value:"Arial",children:"Arial"}),
            (0,t.jsx)("option",{value:"Times New Roman",children:"Times New Roman"}),
            (0,t.jsx)("option",{value:"Calibri",children:"Calibri"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 2. Real Point Font Size (pt)
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => setDocFontSize(e.target.value),defaultValue:"10",title:"Ukuran Huruf (Point/pt)",children:[
            (0,t.jsx)("option",{value:"9",children:"9 pt"}),
            (0,t.jsx)("option",{value:"10",children:"10 pt"}),
            (0,t.jsx)("option",{value:"11",children:"11 pt"}),
            (0,t.jsx)("option",{value:"12",children:"12 pt"}),
            (0,t.jsx)("option",{value:"14",children:"14 pt"}),
            (0,t.jsx)("option",{value:"16",children:"16 pt"}),
            (0,t.jsx)("option",{value:"18",children:"18 pt"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 3. Bold, Italic, Underline, Strikethrough
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tebal (Ctrl+B)",onClick:() => runDocCmd("bold"),children:(0,t.jsx)("b",{children:"B"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Miring (Ctrl+I)",onClick:() => runDocCmd("italic"),children:(0,t.jsx)("i",{children:"I"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Garis Bawah (Ctrl+U)",onClick:() => runDocCmd("underline"),children:(0,t.jsx)("u",{children:"U"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Coretan (Strike)",onClick:() => runDocCmd("strikeThrough"),children:(0,t.jsx)("s",{children:"S"})}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 4. Text Color Picker
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",onClick:() => setShowTextColorPalette(!showTextColorPalette),title:"Warna Teks",children:[
              (0,t.jsx)("span",{style:{color:"#dc2626",fontWeight:900,textDecoration:"underline"},children:"A"}),
              " ▾"
            ]}),
            showTextColorPalette && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#000000"},onClick:() => { runDocCmd("foreColor","#000000"); setShowTextColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#dc2626"},onClick:() => { runDocCmd("foreColor","#dc2626"); setShowTextColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#2563eb"},onClick:() => { runDocCmd("foreColor","#2563eb"); setShowTextColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#16a34a"},onClick:() => { runDocCmd("foreColor","#16a34a"); setShowTextColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#d97706"},onClick:() => { runDocCmd("foreColor","#d97706"); setShowTextColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#7c3aed"},onClick:() => { runDocCmd("foreColor","#7c3aed"); setShowTextColorPalette(false); }})
            ]})
          ]}),

          // 5. Highlight Color Picker
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",onClick:() => setShowBgColorPalette(!showBgColorPalette),title:"Warna Sorotan (Stabilo)",children:[
              (0,t.jsx)("span",{style:{background:"#fef08a",padding:"0 3px",border:"1px solid #ca8a04",borderRadius:"2px"},children:"🖊️"}),
              " ▾"
            ]}),
            showBgColorPalette && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#fef08a"},onClick:() => { runDocCmd("hiliteColor","#fef08a"); setShowBgColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#bbf7d0"},onClick:() => { runDocCmd("hiliteColor","#bbf7d0"); setShowBgColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#bae6fd"},onClick:() => { runDocCmd("hiliteColor","#bae6fd"); setShowBgColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#fbcfe8"},onClick:() => { runDocCmd("hiliteColor","#fbcfe8"); setShowBgColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"#fed7aa"},onClick:() => { runDocCmd("hiliteColor","#fed7aa"); setShowBgColorPalette(false); }}),
              (0,t.jsx)("div",{className:"anev-color-swatch",style:{background:"transparent",border:"1px dashed #64748b"},title:"Tanpa Warna",onClick:() => { runDocCmd("hiliteColor","transparent"); setShowBgColorPalette(false); }})
            ]})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 6. Alignments (Left, Center, Right, Justify)
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri (Left)",onClick:() => runDocCmd("justifyLeft"),children:"⇤"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Tengah (Center)",onClick:() => runDocCmd("justifyCenter"),children:"⇎"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kanan (Right)",onClick:() => runDocCmd("justifyRight"),children:"⇥"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn active",title:"Rata Justify (Kanan-Kiri Penuh)",onClick:() => runDocCmd("justifyFull"),children:"≡"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 7. Line Spacing (1.15, 1.35, 1.45, 1.5, 2.0)
          (0,t.jsxs)("select",{className:"anev-tool-select",onChange:(e) => setDocLineSpacing(e.target.value),defaultValue:"1.45",title:"Spasi Baris (Line Spacing)",children:[
            (0,t.jsx)("option",{value:"1.15",children:"1.15"}),
            (0,t.jsx)("option",{value:"1.35",children:"1.35"}),
            (0,t.jsx)("option",{value:"1.45",children:"1.45"}),
            (0,t.jsx)("option",{value:"1.5",children:"1.5"}),
            (0,t.jsx)("option",{value:"2.0",children:"2.0"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 8. Indent & Outdent
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kurangi Indentasi",onClick:() => runDocCmd("outdent"),children:"⇤"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Indentasi",onClick:() => runDocCmd("indent"),children:"⇥"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 9. Lists
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onClick:() => runDocCmd("insertUnorderedList"),children:"•≡"}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Nomor (Numbered)",onClick:() => runDocCmd("insertOrderedList"),children:"1≡"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 10. Table Operations Dropdown
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

          // 11. Page Break Button
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Pemisah Halaman (Page Break / Ctrl+Enter)",onClick:handleInsertPageBreak,children:[
            "📄+ ",
            (0,t.jsx)("span",{children:"Page Break"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 12. Clear Formatting
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Format (Clear Formatting)",onClick:() => runDocCmd("removeFormat"),children:"🧹"}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 13. Sisipkan Logo Reserse (Bila Terhapus)
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",color:"#475569"},onClick:handleInsertLogo,title:"Sisipkan kembali lambang Reserse",children:[
            "🖼️ ",
            (0,t.jsx)("span",{children:"Logo"})
          ]}),
          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 14. Sinkron Data CAS
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{background:"#2563eb",color:"#ffffff",border:"1px solid #1d4ed8",borderRadius:"4px",padding:"2px 10px",fontWeight:800,gap:"4px"},onClick:() => resolveAutoTags(),title:"Gantikan semua tag dinamis dan tabel dengan data satker dan periode terkini dari database CAS",children:[
            "✨ ",
            (0,t.jsx)("span",{children:"Sinkron Data CAS"})
          ]})
        ]}),

        // HORIZONTAL RULER (PENGGARIS DOKUMEN GOOGLE DOCS / MS WORD)
        activeTab === "lampiran" && (0,t.jsx)("div",{className:"anev-ruler-bar anev-no-print",children:[
          (0,t.jsxs)("div",{className:"anev-ruler",children:[
            // Left margin 3cm
            (0,t.jsx)("div",{className:"anev-ruler-left-margin",title:"Batas Margin Kiri (3 cm)",children:(0,t.jsx)("span",{children:"3 cm"})}),
            // Printable body 16cm
            (0,t.jsxs)("div",{className:"anev-ruler-body",title:"Area Cetak Lembar Kerja (16 cm)",children:[
              (0,t.jsx)("div",{className:"gdocs-ruler-marker-top",title:"Indentasi Baris Pertama (First-line indent)"}),
              (0,t.jsx)("div",{className:"gdocs-ruler-marker-bottom",title:"Indentasi Kiri (Left indent)"}),
              (0,t.jsx)("div",{className:"gdocs-ruler-marker-right",title:"Margin Kanan"}),
              (0,t.jsx)("svg",{style:{width:"100%",height:"100%",display:"block"},viewBox:"0 0 605 24",preserveAspectRatio:"none",children:[
                (0,t.jsxs)("g",{fontSize:"9",fill:"#475569",fontFamily:"Arial, sans-serif",textAnchor:"middle",children:[
                  (0,t.jsx)("line",{x1:"37.8",y1:"14",x2:"37.8",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"37.8",y:"11",children:"1"}),
                  (0,t.jsx)("line",{x1:"75.6",y1:"14",x2:"75.6",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"75.6",y:"11",children:"2"}),
                  (0,t.jsx)("line",{x1:"113.4",y1:"14",x2:"113.4",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"113.4",y:"11",children:"3"}),
                  (0,t.jsx)("line",{x1:"151.2",y1:"14",x2:"151.2",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"151.2",y:"11",children:"4"}),
                  (0,t.jsx)("line",{x1:"189.0",y1:"14",x2:"189.0",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"189.0",y:"11",children:"5"}),
                  (0,t.jsx)("line",{x1:"226.8",y1:"14",x2:"226.8",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"226.8",y:"11",children:"6"}),
                  (0,t.jsx)("line",{x1:"264.6",y1:"14",x2:"264.6",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"264.6",y:"11",children:"7"}),
                  (0,t.jsx)("line",{x1:"302.4",y1:"14",x2:"302.4",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"302.4",y:"11",children:"8"}),
                  (0,t.jsx)("line",{x1:"340.2",y1:"14",x2:"340.2",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"340.2",y:"11",children:"9"}),
                  (0,t.jsx)("line",{x1:"378.0",y1:"14",x2:"378.0",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"378.0",y:"11",children:"10"}),
                  (0,t.jsx)("line",{x1:"415.8",y1:"14",x2:"415.8",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"415.8",y:"11",children:"11"}),
                  (0,t.jsx)("line",{x1:"453.6",y1:"14",x2:"453.6",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"453.6",y:"11",children:"12"}),
                  (0,t.jsx)("line",{x1:"491.4",y1:"14",x2:"491.4",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"491.4",y:"11",children:"13"}),
                  (0,t.jsx)("line",{x1:"529.2",y1:"14",x2:"529.2",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"529.2",y:"11",children:"14"}),
                  (0,t.jsx)("line",{x1:"567.0",y1:"14",x2:"567.0",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"567.0",y:"11",children:"15"}),
                  (0,t.jsx)("line",{x1:"604.8",y1:"14",x2:"604.8",y2:"24",stroke:"#94a3b8",strokeWidth:"1"}),(0,t.jsx)("text",{x:"604.8",y:"11",children:"16"})
                ]})
              ]})
            ]}),
            // Right margin 2cm
            (0,t.jsx)("div",{className:"anev-ruler-right-margin",title:"Batas Margin Kanan (2 cm)",children:(0,t.jsx)("span",{children:"2 cm"})})
          ]})
        ]}),

        // WORKSPACE A4 13 PAGES
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-pages-workspace",children:[
  `;
}
