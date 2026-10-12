import fs from 'fs';

console.log('Generating official 13-page Word template matching user specification...');

const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

// Helper to render sheet
function renderSheet(pageNum, contentJsx, catchwordText = null) {
  // Page 1 should NOT have a page number header.
  // Page numbering must start from '2' on the second page, placed in the top right corner.
  const topHeaderJsx = pageNum === 1 
    ? `(0,t.jsx)("div",{className:"anev-sheet-header",contentEditable:false,style:{height:"16px",userSelect:"none"}})`
    : `(0,t.jsx)("div",{className:"anev-sheet-header",contentEditable:false,style:{textAlign:"right",fontWeight:700,fontSize:"10pt",color:"#000000",marginBottom:"14px",userSelect:"none"},children:${pageNum}})`;

  // Catchword logic: "number (jika ada) + first line next first character + '.....'"
  const catchwordJsx = catchwordText
    ? `(0,t.jsx)("div",{className:"anev-sheet-catchword",contentEditable:false,style:{textAlign:"right",fontSize:"8.5pt",fontStyle:"italic",color:"#475569",marginTop:"16px",userSelect:"none"},children:${JSON.stringify(catchwordText)}})`
    : ``;

  return `
        (0,t.jsxs)("div",{id:"sheet-page-${pageNum}","data-page":${pageNum},className:"anev-page-sheet anev-print-sheet gdocs-page",children:[
          // Authentic Single Diagonal Watermark
          (0,t.jsx)("div",{className:"anev-watermark-overlay",contentEditable:false,style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%) rotate(-35deg)",fontSize:"5.5rem",fontWeight:900,color:"#000000",opacity:0.042,letterSpacing:"6px",pointerEvents:"none",userSelect:"none",zIndex:1,fontFamily:"Arial, sans-serif"},children:activeNrp}),
          // Page Header (Top Right Page Number from Page 2)
          ${topHeaderJsx},
          // Page Content Area (Editable Body)
          (0,t.jsxs)("div",{className:"anev-page-body",children:[
            ${contentJsx}
          ]}),
          // Catchword
          ${catchwordJsx},
          // Page Footer (Forensic Stamp)
          (0,t.jsxs)("div",{className:"anev-page-footer",contentEditable:false,style:{userSelect:"none"},children:[
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
// SHEET 1: Kop Surat (Toggable), Logo Reserse Asli, Judul, I. PENDAHULUAN (A. Umum)
// ----------------------------------------------------
const sheet1Content = `
            // KOP SURAT (DENGAN GARIS BAWAH RESMI, TOGGABLE SESUAI KOMENTAR AGUNG KRISDIANTO)
            (0,t.jsxs)("div",{id:"docKopSurat",style:{textAlign:"center",marginBottom:"0.5rem"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px"},children:"MARKAS BESAR"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px"},children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px"},children:"BADAN RESERSE KRIMINAL"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px",borderBottom:"2px solid #000000",paddingBottom:"3px",display:"inline-block"},children:"BIRO PEMBINAAN OPERASIONAL"})
            ]}),

            // LOGO RESERSE RESMI (REAL DELETABLE & EDITABLE IMG)
            (0,t.jsx)("div",{style:{textAlign:"center",margin:"10px 0 8px 0"},children:(0,t.jsx)("img",{
              src: "${logoDataUri}",
              className: "anev-doc-logo",
              alt: "Logo Reserse Polri",
              title: "Klik untuk memilih, tekan Backspace/Delete untuk menghapus",
              style: { width: "75px", height: "auto", display: "block", margin: "4px auto", cursor: "pointer", userSelect: "all" }
            })}),

            // TITLE (CENTER ALIGNED, UPPERCASE, BOLD)
            (0,t.jsxs)("div",{style:{textAlign:"center",margin:"6px 0 14px 0"},children:[
              (0,t.jsx)("div",{style:{fontWeight:900,fontSize:"11.5pt",letterSpacing:"0.5px"},children:"LAPORAN ANALISIS DAN EVALUASI PERIODIK"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"10.5pt",letterSpacing:"0.5px"},children:"BARESKRIM POLRI DAN POLDA JAJARAN"}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9.5pt",letterSpacing:"0.5px",color:"#1e293b"},children:"PERIODE BULAN AGUSTUS 2026"}),
              (0,t.jsx)("div",{style:{borderBottom:"1.5px solid #000000",margin:"8px auto 14px auto",width:"100%"}})
            ]}),

            // BODY (LEFT/JUSTIFY ALIGNED DENGAN INDENTASI PERKAP POLRI)
            (0,t.jsxs)("div",{style:{margin:"0",fontSize:"10pt",lineHeight:"1.5"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800},children:"I.\u00a0\u00a0\u00a0\u00a0PENDAHULUAN"}),
              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"24px",marginTop:"4px"},children:"A.\u00a0\u00a0\u00a0\u00a0Umum"}),
              (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify",textJustify:"inter-word",marginTop:"6px"},children:"Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu 1 Agustus 2026 s.d. 31 Agustus 2026, mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan BARESKRIM POLRI DAN POLDA JAJARAN."}),
              (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify",textJustify:"inter-word",marginTop:"6px"},children:"Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya."})
            ]})
`;

// ----------------------------------------------------
// SHEET 2: B. Maksud dan Tujuan (1-2), C. Dasar (1-7), D. Ruang Lingkup
// ----------------------------------------------------
const sheet2Content = `
            (0,t.jsxs)("div",{style:{margin:"0",fontSize:"10pt",lineHeight:"1.5"},children:[
              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"24px"},children:"B.\u00a0\u00a0\u00a0\u00a0Maksud dan Tujuan"}),
              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"48px",marginTop:"4px"},children:"1.\u00a0\u00a0Maksud"}),
              (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify",marginTop:"4px"},children:"Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh BARESKRIM POLRI DAN POLDA JAJARAN selama periode yang telah ditentukan."}),
              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"48px",marginTop:"6px"},children:"2.\u00a0\u00a0Tujuan"}),
              (0,t.jsx)("p",{style:{marginLeft:"48px",marginBottom:"2px"},children:"Laporan ini bertujuan untuk:"}),
              (0,t.jsxs)("div",{style:{marginLeft:"48px"},children:[
                (0,t.jsx)("p",{children:"a.\u00a0\u00a0Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;"}),
                (0,t.jsx)("p",{children:"b.\u00a0\u00a0Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;"}),
                (0,t.jsx)("p",{children:"c.\u00a0\u00a0Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan Kepolisian Negara Republik Indonesia."})
              ]}),

              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"24px",marginTop:"10px"},children:"C.\u00a0\u00a0\u00a0\u00a0Dasar"}),
              (0,t.jsxs)("div",{style:{marginLeft:"48px"},children:[
                (0,t.jsx)("p",{children:"1.\u00a0\u00a0Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;"}),
                (0,t.jsx)("p",{children:"2.\u00a0\u00a0Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang Susunan Organisasi dan Tata Kerja Satuan Organisasi pada Tingkat Markas Besar Kepolisian Negara Republik Indonesia;"}),
                (0,t.jsx)("p",{children:"3.\u00a0\u00a0Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Keamanan dan Ketertiban Masyarakat;"}),
                (0,t.jsx)("p",{children:"4.\u00a0\u00a0Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;"}),
                (0,t.jsx)("p",{children:"5.\u00a0\u00a0Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;"}),
                (0,t.jsx)("p",{children:"6.\u00a0\u00a0Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;"}),
                (0,t.jsx)("p",{children:"7.\u00a0\u00a0Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang pengiriman format Laporan Bulanan."})
              ]}),

              (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"24px",marginTop:"10px"},children:"D.\u00a0\u00a0\u00a0\u00a0Ruang Lingkup"}),
              (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh BARESKRIM POLRI DAN POLDA JAJARAN selama kurun waktu Agustus 2026."})
            ]})
`;

// ----------------------------------------------------
// SHEET 3: Lanjutan Ruang Lingkup (8 poin), E. IKU & Tabel 1.1
// ----------------------------------------------------
const sheet3Content = `
            (0,t.jsx)("p",{style:{marginLeft:"48px",marginBottom:"4px"},children:"Adapun ruang lingkup pelaporan meliputi:"}),
            (0,t.jsxs)("div",{style:{marginLeft:"48px"},children:[
              (0,t.jsx)("p",{children:"1.\u00a0\u00a0Data laporan polisi (LP) yang masuk dan diselesaikan;"}),
              (0,t.jsx)("p",{children:"2.\u00a0\u00a0Penanganan perkara berdasarkan jenis tindak pidana;"}),
              (0,t.jsx)("p",{children:"3.\u00a0\u00a0Pelaksanaan restorative justice (RJ) dan penyelesaian non-litigasi lainnya;"}),
              (0,t.jsx)("p",{children:"4.\u00a0\u00a0Data barang bukti yang diamankan dan/atau disita;"}),
              (0,t.jsx)("p",{children:"5.\u00a0\u00a0Kondisi kekuatan personel serta beban kerja penyidik;"}),
              (0,t.jsx)("p",{children:"6.\u00a0\u00a0Kerja sama dan koordinasi dengan satuan kerja lain, instansi eksternal, atau operasi terpusat;"}),
              (0,t.jsx)("p",{children:"7.\u00a0\u00a0Kasus-kasus menonjol atau menjadi atensi pimpinan;"}),
              (0,t.jsx)("p",{children:"8.\u00a0\u00a0Analisis dan evaluasi kinerja penyidikan berdasarkan indikator yang ditetapkan."})
            ]}),

            (0,t.jsx)("div",{style:{fontWeight:700,marginLeft:"24px",marginTop:"12px"},children:"E.\u00a0\u00a0\u00a0\u00a0Indeks Kinerja Utama"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel dalam menjawab harapan masyarakat terhadap keadilan hukum."}),

            // Tabel 1.1 IKU
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginTop:"8px"},children:[
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
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),
                  (0,t.jsx)("td",{children:"Terwujudnya Penegakan Hukum yang Menjamin Kepastian dan Keadilan"}),
                  (0,t.jsx)("td",{children:"Indeks Penegakan Hukum secara Berkeadilan"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3.00"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3.20"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3.40"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3.60"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3.80"})
                ]})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 4: BAB II. TUGAS DAN CAPAIAN KINERJA (A. Tugas, B. Kamtibmas)
// ----------------------------------------------------
const sheet4Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"II.\u00a0\u00a0TUGAS DAN CAPAIAN KINERJA"}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"A.\u00a0\u00a0Tugas Utama"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Berdasarkan Peraturan Kapolri tentang Susunan Organisasi dan Tata Kerja, Bareskrim Polri bertugas membina dan menyelenggarakan fungsi penyelidikan dan penyidikan tindak pidana, pengawasan penyidikan, koordinasi dan pengawasan PPNS, serta fungsi laboratorium forensik, identifikasi, dan psikologi kepolisian."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Dalam rangka pelaksanaan tugas tersebut di atas, Bareskrim Polri menyelenggarakan fungsi pembinaan operasional reserse kriminal, koordinasi pengawasan, bantuan teknis penyidikan, serta penegakan hukum terhadap tindak pidana transnasional dan kejahatan konvensional berintensitas tinggi."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px",marginTop:"12px"},children:"B.\u00a0\u00a0Situasi Keamanan dan Ketertiban Masyarakat"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Secara umum situasi keamanan dan ketertiban masyarakat (kamtibmas) di wilayah hukum Republik Indonesia selama periode pelaporan berada dalam kondisi yang aman, terkendali, dan kondusif. Penanganan tindak pidana dilakukan secara terpadu melalui koordinasi intensif dengan seluruh Polda jajaran."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Berdasarkan rekapitulasi data operasional yang tercatat dalam sistem informasi Crime Analytic System (CAS), dinamika laporan tindak pidana dan penyelesaian perkara disajikan pada tabel rekapitulasi berikut."})
`;

// ----------------------------------------------------
// SHEET 5: Tabel 2.1 Trend Periode Lalu & Tabel 2.2 Trend Periode Berjalan
// ----------------------------------------------------
const sheet5Content = `
            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9pt",margin:"4px 0 2px 0"},children:"Tabel 2.1. Trend Tindak Pidana Periode Lalu"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah anev-table-2-1",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"35%"},children:"Jenis Kejahatan"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Kasus (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Penyelesaian Kasus (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"CR (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"Ket"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Kejahatan Konvensional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"8.210"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"19.140"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.240"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"2.890"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"15.1%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Kejahatan Transnasional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.420"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"3.310"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"310"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"720"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"21.8%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Kejahatan Terhadap Kekayaan Negara"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"450"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.050"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"85"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"195"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"18.7%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"10.080"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"23.500"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.635"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"3.805"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"16.2%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}) ]})
              ]})
            ]}),

            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"9pt",margin:"10px 0 2px 0"},children:"Tabel 2.2. Trend Tindak Pidana Periode Berjalan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah anev-table-2-2",children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"35%"},children:"Jenis Kejahatan"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Kasus (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Penyelesaian Kasus (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"CR (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"Ket"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Kejahatan Konvensional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"8.450"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"19.720"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.420"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"3.310"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"16.8%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Kejahatan Transnasional"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.510"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"3.520"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"380"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"890"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"25.2%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Kejahatan Terhadap Kekayaan Negara"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"480"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.120"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"110"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"260"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"23.1%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"10.440"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"24.360"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.910"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"4.460"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"18.3%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}) ]})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 6: C. Analisis Perbandingan CT, CC, CR
// ----------------------------------------------------
const sheet6Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"C.\u00a0\u00a0Analisis Perbandingan Penanganan Perkara (CT, CC, CR)"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Analisis perbandingan dilakukan dengan membandingkan data Crime Total (CT), Crime Clearance (CC), dan Crime Clearance Rate (CR) antara periode lalu dengan periode berjalan. Dari data operasional yang terhimpun, terlihat dinamika penegakan hukum sebagai berikut:"}),
            (0,t.jsxs)("div",{style:{marginLeft:"48px",margin:"6px 0"},children:[
              (0,t.jsx)("p",{children:"1.\u00a0\u00a0Crime Total (CT) pada periode berjalan mengalami kenaikan sebesar 1.263 perkara (3.3%) dari 38.586 perkara menjadi 39.849 perkara. Peningkatan ini didominasi oleh kejahatan siber dan penipuan online."}),
              (0,t.jsx)("p",{children:"2.\u00a0\u00a0Crime Clearance (CC) pada periode berjalan mencatatkan peningkatan signifikan sebesar 1.054 perkara (21.2%) dari 4.969 perkara menjadi 6.023 perkara yang berhasil diselesaikan."}),
              (0,t.jsx)("p",{children:"3.\u00a0\u00a0Crime Clearance Rate (CR) meningkat dari 12.9% menjadi 15.1% (kenaikan 2.2%). Hal ini menunjukkan efektivitas penyidikan yang semakin adaptif dan responsif."})
            ]}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Tingkat penyelesaian perkara (CR) dihitung dengan formula baku penegakan hukum Polri: CR = (CC / CT) x 100%, yang mencerminkan rasio akuntabilitas penanganan perkara di seluruh tingkat satker."})
`;

// ----------------------------------------------------
// SHEET 7: D. Restorative Justice (RJ) & Tabel 2.3
// ----------------------------------------------------
const sheet7Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"D.\u00a0\u00a0Penyelesaian Perkara Melalui Keadilan Restoratif (Restorative Justice)"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Sesuai Peraturan Kepolisian Negara Republik Indonesia Nomor 8 Tahun 2021 tentang Penanganan Tindak Pidana Berdasarkan Keadilan Restoratif, penyidik terus mengedepankan pemulihan hak-hak korban dan perdamaian para pihak untuk tindak pidana yang memenuhi syarat materiil dan formil."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Selama periode pelaporan, penyelesaian perkara melalui mekanisme Restorative Justice berhasil menyelesaikan 1.367 perkara (22.7% dari total penyelesaian perkara). Data rincian disajikan pada tabel berikut:"}),

            // Tabel 2.3 RJ
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginTop:"8px"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                  (0,t.jsx)("th",{style:{width:"40%"},children:"Klasifikasi Tindak Pidana"}),
                  (0,t.jsx)("th",{style:{width:"18%"},children:"Jumlah RJ"}),
                  (0,t.jsx)("th",{style:{width:"18%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{style:{width:"18%"},children:"Keterangan"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"1."}),(0,t.jsx)("td",{children:"Penganiayaan Ringan & Pencemaran Nama Baik"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"620"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"45.4%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Selesai SP3"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"2."}),(0,t.jsx)("td",{children:"Pencurian Ringan & Penggelapan Keluarga"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"415"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"30.4%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Selesai SP3"})]}),
                (0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"3."}),(0,t.jsx)("td",{children:"Pelanggaran ITE Ringan / Sengketa Konsumen"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"332"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"24.2%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Selesai SP3"})]}),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[(0,t.jsx)("td",{style:{textAlign:"center"},children:"-"}),(0,t.jsx)("td",{children:"Jumlah Keseluruhan RJ"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"1.367"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"100.0%"}),(0,t.jsx)("td",{style:{textAlign:"center"},children:"Kepastian Hukum"})]})
              ]})
            ]})
`;

// ----------------------------------------------------
// SHEET 8: E. Pengelolaan Barang Bukti & Transparansi
// ----------------------------------------------------
const sheet8Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"E.\u00a0\u00a0Pengelolaan Barang Bukti dan Pengawasan Penyidikan"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Pengelolaan barang bukti dilaksanakan secara akuntabel menggunakan aplikasi e-Barang Bukti (e-BB) yang terintegrasi di bawah kendali Bagian Tahti dan penyidik penangan perkara. Setiap barang bukti yang disita tercatat barcode digital untuk mencegah manipulasi atau penyusutan nilai ekonomis."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Di bidang pengawasan penyidikan, Biro Pengawasan Penyidikan (Rowassidik) Bareskrim Polri terus mengoptimalkan penanganan Dumas (Pengaduan Masyarakat) melalui sistem e-Dumas Terpadu Presisi. Setiap keluhan masyarakat ditindaklanjuti melalui gelar perkara khusus untuk memastikan asas transparansi dan objektivitas penyidikan."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Selama kurun waktu periode ini, sebanyak 184 pengaduan masyarakat telah diselesaikan secara tuntas melalui mekanisme asistensi penyidikan dan gelar perkara terbuka."})
`;

// ----------------------------------------------------
// SHEET 9: BAB III. PEMBINAAN SUMBER DAYA (A. Kekuatan Personel)
// ----------------------------------------------------
const sheet9Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"III.\u00a0\u00a0PEMBINAAN KEKUATAN SUMBER DAYA"}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"A.\u00a0\u00a0Kekuatan Personel dan Rasio Beban Kerja Penyidik"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Jumlah riil personel Bareskrim Polri yang mengawaki fungsi penegakan hukum pada periode pelaporan tercatat sebanyak 1.420 personel (terdiri dari Penyidik Utama, Penyidik Madya, Penyidik Pratama, dan Penyidik Pembantu serta staf pendukung operasional)."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Berdasarkan beban perkara yang ditangani, rasio beban kerja penyidik rata-rata berada pada kisaran 1 penyidik menangani 28 laporan polisi dalam satu semester. Angka ini masih berada dalam batas toleransi kapasitas penyidikan dengan dukungan platform digital Crime Analytic System (CAS) yang memangkas waktu administrasi penyidikan hingga 40%."})
`;

// ----------------------------------------------------
// SHEET 10: B. Pengelolaan Anggaran Satker Reserse
// ----------------------------------------------------
const sheet10Content = `
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"B.\u00a0\u00a0Pengelolaan Anggaran Satker Reserse"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Realisasi penyerapan anggaran penyelidikan dan penyidikan tindak pidana pada DIPA Bareskrim Polri Tahun Anggaran 2026 berjalan secara proporsional dan akuntabel. Alokasi anggaran lidik/sidik disalurkan berbasis indeks perkara (kejahatan sangat sulit, sulit, sedang, dan mudah) dengan verifikasi ketat melalui Sistem Informasi Keuangan Polri."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Sampai dengan akhir periode pelaporan, penyerapan anggaran telah mencapai 74.8% dari total pagu DIPA, sejalan dengan capaian output kinerja penegakan hukum dan target penyelesaian perkara nasional."})
`;

// ----------------------------------------------------
// SHEET 11: BAB IV. PENANGANAN KASUS MENONJOL
// ----------------------------------------------------
const sheet11Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"IV.\u00a0\u00a0PENANGANAN KASUS MENONJOL DAN ATENSI PUBLIK"}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"A.\u00a0\u00a0Pengungkapan Kasus Kejahatan Lintas Negara (Transnasional)"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Selama periode pelaporan, Bareskrim Polri berhasil mengungkap jaringan peredaran gelap narkotika lintas negara dengan barang bukti sabu seberat 210 kg dan ekstasi sebanyak 85.000 butir. Pengungkapan ini melibatkan kerja sama internasional melalui Police-to-Police (P2P) dengan Interpol dan DEA."}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px",marginTop:"12px"},children:"B.\u00a0\u00a0Penindakan Kejahatan Siber dan Judi Online Terorganisir"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Direktorat Tindak Pidana Siber Bareskrim Polri telah melakukan penindakan terukur terhadap 14 sindikat platform judi daring dan penipuan perbankan (phishing) dengan nilai perputaran rekening yang dibekukan mencapai Rp 420 Miliar. Sebanyak 78 tersangka telah ditetapkan dan berkas perkaranya telah dilimpahkan ke Kejaksaan Agung (Tahap I)."}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px",marginTop:"12px"},children:"C.\u00a0\u00a0Penegakan Hukum Kejahatan Terhadap Perempuan dan Anak (PPA)"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Direktorat Tindak Pidana PPA-PPO terus mengawal pemulihan trauma bagi korban tindak pidana kekerasan seksual dan perdagangan orang, serta mempercepat proses penyidikan dengan menerapkan Undang-Undang TPKS secara tegas dan berkeadilan."})
`;

// ----------------------------------------------------
// SHEET 12: BAB V. EVALUASI, BAB VI. KESIMPULAN, BAB VII. PENUTUP
// ----------------------------------------------------
const sheet12Content = `
            (0,t.jsx)("div",{className:"anev-section-title",children:"V.\u00a0\u00a0EVALUASI DAN HASIL CAPAIAN KINERJA"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Evaluasi menyeluruh menunjukkan bahwa pemanfaatan Big Data dan analitik prediktif CAS telah mempercepat proses pengambilan keputusan taktis di lapangan. Tantangan ke depan bertumpu pada modernisasi alat digital forensik dan pemerataan kapasitas penyidik di tingkat wilayah."}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"14px"},children:"VI.\u00a0\u00a0KESIMPULAN DAN REKOMENDASI"}),
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px"},children:"A.\u00a0\u00a0Kesimpulan"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"1.\u00a0\u00a0Situasi kamtibmas secara umum terjaga aman, tertib, dan kondusif berkat sinergi penegakan hukum preventif-represif."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"2.\u00a0\u00a0Capaian Crime Clearance (CC) dan Crime Rate (CR) mengalami lonjakan positif, disertai peningkatan penyelesaian damai berbasis Restorative Justice."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginLeft:"24px",marginTop:"8px"},children:"B.\u00a0\u00a0Rekomendasi"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"1.\u00a0\u00a0Perluasan pelatihan investigasi digital forensik bersertifikasi bagi penyidik di tingkat Polda dan Polres jajaran."}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"2.\u00a0\u00a0Optimalisasi anggaran bantuan teknis penyidikan untuk menuntaskan perkara-perkara tunggakan masa lalu."}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"14px"},children:"VII.\u00a0\u00a0PENUTUP"}),
            (0,t.jsx)("p",{style:{marginLeft:"48px",textAlign:"justify"},children:"Demikian Laporan Analisis dan Evaluasi Periodik Badan Reserse Kriminal Polri ini dibuat dengan sebenar-benarnya sebagai wujud transparansi, profesionalisme, dan akuntabilitas penegakan hukum Polri Presisi."})
`;

// ----------------------------------------------------
// SHEET 13: Lembar Pengesahan Pejabat (Dukungan Dinamis Anggota POLRI & PNS POLRI)
// ----------------------------------------------------
const sheet13Content = `
            (0,t.jsx)("div",{className:"anev-section-title",style:{marginBottom:"18px"},children:"LEMBAR PENGESAHAN"}),
            (0,t.jsx)("p",{style:{textAlign:"justify",marginBottom:"2rem"},children:"Laporan Analisis dan Evaluasi Periodik ini telah diperiksa, diverifikasi, dan disahkan oleh Kepala Badan Reserse Kriminal Kepolisian Negara Republik Indonesia pada tanggal dan tempat yang tertera di bawah ini:"}),

            // OFFICIAL SIGNATURE BLOCK DENGAN ID DINAMIS UNTUK POLRI / PNS TOGGLE
            (0,t.jsxs)("div",{id:"docSignatureBlock",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:"3rem"},children:[
              (0,t.jsxs)("div",{style:{fontSize:"9.5pt",lineHeight:1.4},children:[
                (0,t.jsx)("div",{children:"Lampiran:"}),
                (0,t.jsx)("div",{children:"1. Rekapitulasi Data Kasus CAS"}),
                (0,t.jsx)("div",{children:"2. Tabulasi Restorative Justice"}),
                (0,t.jsx)("div",{children:"dan seterusnya."})
              ]}),
              (0,t.jsxs)("div",{style:{textAlign:"center",width:"300px",fontSize:"10pt",lineHeight:1.35},children:[
                (0,t.jsx)("div",{children:"Jakarta,\u00a0\u00a0\u00a0\u00a0Agustus 2026"}),
                (0,t.jsx)("div",{style:{marginTop:"4px"},children:"KEPALA BADAN RESERSE KRIMINAL POLRI"}),
                (0,t.jsx)("div",{style:{height:"72px"}}),
                (0,t.jsx)("div",{id:"sigName",style:{fontWeight:800,textDecoration:"underline",letterSpacing:"0.5px"},children:"Drs. WAHYU WIDADA, M.Phil."}),
                (0,t.jsx)("div",{id:"sigRankId",style:{fontSize:"9.5pt"},children:"KOMISARIS JENDERAL POLISI NRP 69090291"})
              ]})
            ]})
`;

// Export function generating all 13 sheets with precise catchword logic
export function getAll13Sheets() {
  return [
    renderSheet(1, sheet1Content, "B. M......"),
    renderSheet(2, sheet2Content, "E. I......"),
    renderSheet(3, sheet3Content, "II. T......"),
    renderSheet(4, sheet4Content, "Tabel 2.1......"),
    renderSheet(5, sheet5Content, "C. A......"),
    renderSheet(6, sheet6Content, "D. R......"),
    renderSheet(7, sheet7Content, "E. P......"),
    renderSheet(8, sheet8Content, "III. S......"),
    renderSheet(9, sheet9Content, "B. A......"),
    renderSheet(10, sheet10Content, "IV. K......"),
    renderSheet(11, sheet11Content, "V. E......"),
    renderSheet(12, sheet12Content, "LEMBAR PENGESAHAN......"),
    renderSheet(13, sheet13Content, null)
  ].join(',\n');
}

export function getToolbarAndSheets() {
  return `
        // TAB 1: NASKAH DINAS (EDITOR WYSIWYG GOOGLE DOCS)
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"gdocs-root-app",children:[

          // BARIS 1: GOOGLE DOCS TOP HEADER (APP ICON, TITLE INPUT, STAR, CLOUD STATUS, AUTHENTIC MENUBAR & ACTIONS)
          (0,t.jsxs)("div",{className:"gdocs-top-header anev-no-print",children:[
            (0,t.jsxs)("div",{className:"gdocs-top-left",children:[
              (0,t.jsx)("div",{className:"gdocs-app-icon",title:"Google Docs Editor - Bareskrim Polri",children:"📄"}),
              (0,t.jsxs)("div",{className:"gdocs-doc-info",children:[
                (0,t.jsxs)("div",{className:"gdocs-title-row",children:[
                  (0,t.jsx)("input",{
                    id:"docTitleInput",
                    className:"gdocs-title-input",
                    defaultValue:"DRAFT FORMAT LAPORAN HARIAN - MINGGUAN RESERSE - SHARE",
                    title:"Klik untuk mengganti nama dokumen",
                    spellCheck:false
                  }),
                  (0,t.jsx)("button",{type:"button",className:"gdocs-star-btn",title:"Bintang (Favorit)",children:"⭐"}),
                  (0,t.jsxs)("span",{className:"gdocs-cloud-status",children:[
                    (0,t.jsx)("span",{style:{marginRight:"4px"},children:"☁️"}),
                    "Tersimpan di Cloud CAS"
                  ]})
                ]}),
                // AUTHENTIC GOOGLE DOCS MENUBAR DROPDOWNS
                (0,t.jsxs)("div",{className:"gdocs-menubar",children:[
                  // 1. FILE MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-file",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-file")},onMouseEnter:()=>hoverMenubar("menu-file"),children:"File"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();window.print();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🖨️ Cetak Dokumen"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+P"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();handleInsertPageBreak();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📄 Halaman Baru (Page Break)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+Enter"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();resolveAutoTags();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{style:{color:"#2563eb",fontWeight:700},children:"✨ Sinkronkan Data dari CAS"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Auto"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();handleCopyDocumentText();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📋 Salin Seluruh Naskah"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+A"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();alert("Standar Naskah Dinas Polri:\\n• Ukuran Kertas: A4 (210 x 297 mm)\\n• Orientasi: Portrait\\n• Margin Kiri: 3 cm\\n• Margin Kanan, Atas & Bawah: 2 cm\\n• Huruf Default: Arial 10pt\\n• Spasi: 1.45 Standar Perkap");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"⚙️ Penataan Halaman (A4 Portrait)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"3cm / 2cm"})
                      ]})
                    ]})
                  ]}),

                  // 2. EDIT MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-edit",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-edit")},onMouseEnter:()=>hoverMenubar("menu-edit"),children:"Edit"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("undo");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"↶ Urungkan"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+Z"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("redo");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"↷ Ulangi"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+Y"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("selectAll");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔲 Pilih Semua"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+A"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();toggleFindReplace(false);closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔍 Temukan (Cari Teks)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+F"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();toggleFindReplace(true);closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔁 Temukan dan Ganti"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+H"})
                      ]})
                    ]})
                  ]}),

                  // 3. TAMPILAN MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-view",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-view")},onMouseEnter:()=>hoverMenubar("menu-view"),children:"Tampilan"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"✓ Tata Letak Cetak (Print Layout)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Aktif"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();toggleDocRuler();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📏 Tampilkan Penggaris (Ruler)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Toggle"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();toggleDocOutline();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📑 Tampilkan Kerangka Naskah"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Toggle"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();applyDocZoom(1.0,"100%");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔍 Perbesaran 100%"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Normal"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();applyDocZoom(1.25,"125%");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔍 Perbesaran 125%"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Besar"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();applyDocZoom(0.75,"75%");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🔍 Perbesaran 75%"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Kecil"})
                      ]})
                    ]})
                  ]}),

                  // 4. SISIPKAN MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-insert",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-insert")},onMouseEnter:()=>hoverMenubar("menu-insert"),children:"Sisipkan"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();handleInsertLogo();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🖼️ Lambang Reserse Polri"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Gambar"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();insertCustomTable(3, 4);closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📊 Tabel Data (3x4)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Tabel"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();handleInsertPageBreak();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📄 Pemisah Halaman (Page Break)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+Enter"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("insertHorizontalRule");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"➖ Garis Horizontal"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Garis"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();handleInsertSecurityStamp();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🛡️ Cap Klasifikasi RAHASIA"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Perkap"})
                      ]})
                    ]})
                  ]}),

                  // 5. FORMAT MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-format",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-format")},onMouseEnter:()=>hoverMenubar("menu-format"),children:"Format"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("bold");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"B Tebal"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+B"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("italic");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"I Miring"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+I"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("underline");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"U Garis Bawah"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+U"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("strikeThrough");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"S Coretan"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Strike"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyFull");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"≡ Rata Justify (Kanan-Kiri)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Standar"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyLeft");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"⇤ Rata Kiri"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Left"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyCenter");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"⇎ Rata Tengah"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Center"})
                      ]}),
                      (0,t.jsx)("div",{className:"gdocs-dropdown-separator"}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.45");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"↕ Spasi 1.45 (Standar Polri)"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Perkap"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();runDocCmd("removeFormat");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🧹 Hapus Format"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Ctrl+Clear"})
                      ]})
                    ]})
                  ]}),

                  // 6. ALAT MENU
                  (0,t.jsxs)("div",{className:"gdocs-menu-item",id:"menu-tools",children:[
                    (0,t.jsx)("button",{type:"button",className:"gdocs-menu-trigger",onMouseDown:e=>{e.preventDefault();toggleMenubar("menu-tools")},onMouseEnter:()=>hoverMenubar("menu-tools"),children:"Alat"}),
                    (0,t.jsxs)("div",{className:"gdocs-menu-dropdown",children:[
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();resolveAutoTags();closeAllMenubars()},children:[
                        (0,t.jsx)("span",{style:{color:"#2563eb",fontWeight:700},children:"✨ Sinkronkan Seluruh Data CAS"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Otomatis"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();updateDocStats();alert(document.getElementById("statusWordInfo")?.innerText + " • " + document.getElementById("statusPageInfo")?.innerText);closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"📊 Statistik Kata & Karakter"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"Hitung"})
                      ]}),
                      (0,t.jsxs)("div",{className:"gdocs-dropdown-entry",onMouseDown:e=>{e.preventDefault();alert("Format Naskah Dinas Terverifikasi:\\n• Struktur: BAB I s.d. BAB VII Lengkap\\n• Penomoran Otomatis: 1 s.d. 13 Halaman\\n• Lambang Reserse: Aktif\\n• Security Watermark: Aktif");closeAllMenubars()},children:[
                        (0,t.jsx)("span",{children:"🛡️ Verifikasi Kesesuaian Perkap"}),
                        (0,t.jsx)("span",{className:"gdocs-shortcut-badge",children:"OK"})
                      ]})
                    ]})
                  ]})
                ]})
              ]})
            ]}),

            // TOP RIGHT CONTROLS: OPSI TTD, KOP SURAT TOGGLE, PRINT, SYNC
            (0,t.jsxs)("div",{className:"gdocs-top-right",children:[
              // OPSI TTD (ANGGOTA POLRI / PNS POLRI)
              (0,t.jsxs)("div",{className:"gdocs-ctrl-group",title:"Pilih format penandatangan naskah",children:[
                (0,t.jsx)("span",{className:"gdocs-ctrl-label",children:"Opsi TTD:"}),
                (0,t.jsx)("button",{type:"button",id:"btn-ttd-polri",className:"gdocs-pill-toggle active",onMouseDown:e=>{e.preventDefault();setDocSignerType("polri")},children:"Polri (NRP)"}),
                (0,t.jsx)("button",{type:"button",id:"btn-ttd-pns",className:"gdocs-pill-toggle",onMouseDown:e=>{e.preventDefault();setDocSignerType("pns")},children:"PNS (NIP)"})
              ]}),

              // KOP SURAT TOGGLE (MENJAWAB KOMENTAR AGUNG KRISDIANTO)
              (0,t.jsxs)("div",{className:"gdocs-ctrl-group",title:"Tampilkan atau sembunyikan kop surat",children:[
                (0,t.jsx)("span",{className:"gdocs-ctrl-label",children:"Kop:"}),
                (0,t.jsx)("button",{type:"button",id:"btn-kop-header-on",className:"gdocs-pill-toggle active",onMouseDown:e=>{e.preventDefault();toggleDocKop(true)},children:"Pakai Kop"}),
                (0,t.jsx)("button",{type:"button",id:"btn-kop-header-off",className:"gdocs-pill-toggle",onMouseDown:e=>{e.preventDefault();toggleDocKop(false)},children:"Tanpa Kop"})
              ]}),

              (0,t.jsxs)("button",{type:"button",className:"gdocs-action-btn-outline",onClick:()=>window.print(),title:"Cetak Naskah (Ctrl+P)",children:[
                "🖨️ ",
                (0,t.jsx)("span",{children:"Cetak A4"})
              ]}),
              (0,t.jsxs)("button",{type:"button",className:"gdocs-action-btn-primary",onClick:()=>resolveAutoTags(),title:"Gantikan semua tag dan tabel dinamis dengan data terkini",children:[
                "✨ ",
                (0,t.jsx)("span",{children:"Sinkron Data CAS"})
              ]})
            ]})
          ]}),

          // BARIS 2: GOOGLE DOCS STICKY FORMATTING TOOLBAR
          (0,t.jsxs)("div",{className:"gdocs-toolbar anev-docs-toolbar anev-no-print",children:[
            // 1. Undo, Redo, Print, RemoveFormat
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Urungkan (Ctrl+Z)",onMouseDown:e=>{e.preventDefault();runDocCmd("undo")},children:"↶"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Ulangi (Ctrl+Y)",onMouseDown:e=>{e.preventDefault();runDocCmd("redo")},children:"↷"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak Naskah (Ctrl+P)",onMouseDown:e=>{e.preventDefault();window.print()},children:"🖨️"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Format (Clear Formatting)",onMouseDown:e=>{e.preventDefault();runDocCmd("removeFormat")},children:"🧹"}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 2. Zoom Dropdown
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"zoomDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",onMouseDown:e=>{e.preventDefault();toggleDocDropdown("zoomDropdown")},children:[
                (0,t.jsx)("span",{id:"tb-zoom-label",children:"100%"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"100px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();applyDocZoom(0.75,"75%")},children:"75%"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();applyDocZoom(0.90,"90%")},children:"90%"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();applyDocZoom(1.00,"100%")},children:"100%"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();applyDocZoom(1.25,"125%")},children:"125%"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();applyDocZoom(1.50,"150%")},children:"150%"})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 3. Paragraph Style Dropdown
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"styleDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",onMouseDown:e=>{e.preventDefault();toggleDocDropdown("styleDropdown")},children:[
                (0,t.jsx)("span",{id:"tb-style-label",children:"Teks normal"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"150px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocBlockFormat("p","Teks normal")},children:(0,t.jsx)("span",{style:{fontSize:"10pt"},children:"Teks normal"})}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocBlockFormat("h1","Judul Utama")},children:(0,t.jsx)("b",{style:{fontSize:"13pt"},children:"Judul Utama"})}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocBlockFormat("h2","Subjudul")},children:(0,t.jsx)("b",{style:{fontSize:"11.5pt"},children:"Subjudul"})}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocBlockFormat("h3","Tajuk 3")},children:(0,t.jsx)("b",{style:{fontSize:"10.5pt"},children:"Tajuk 3"})})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 4. Font Family Dropdown
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"fontDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",style:{minWidth:"95px"},onMouseDown:e=>{e.preventDefault();toggleDocDropdown("fontDropdown")},children:[
                (0,t.jsx)("span",{id:"tb-font-label",children:"Arial"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"160px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"Arial"},onMouseDown:e=>{e.preventDefault();setDocFontName("Arial")},children:"Arial"}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"'Times New Roman'"},onMouseDown:e=>{e.preventDefault();setDocFontName("Times New Roman")},children:"Times New Roman"}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"Calibri"},onMouseDown:e=>{e.preventDefault();setDocFontName("Calibri")},children:"Calibri"}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"Georgia"},onMouseDown:e=>{e.preventDefault();setDocFontName("Georgia")},children:"Georgia"}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"'Courier New'"},onMouseDown:e=>{e.preventDefault();setDocFontName("Courier New")},children:"Courier New"}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{fontFamily:"Verdana"},onMouseDown:e=>{e.preventDefault();setDocFontName("Verdana")},children:"Verdana"})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 5. Font Size Decrement, Dropdown, Increment
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kecilkan Huruf (Font Size -)",onMouseDown:e=>{e.preventDefault();stepDocFontSize(-1)},children:"−"}),
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"sizeDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",style:{minWidth:"48px",justifyContent:"center"},onMouseDown:e=>{e.preventDefault();toggleDocDropdown("sizeDropdown")},children:[
                (0,t.jsx)("span",{id:"tb-size-label",children:"10"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"65px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(8)},children:"8"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(9)},children:"9"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(10)},children:"10"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(11)},children:"11"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(12)},children:"12"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(14)},children:"14"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(16)},children:"16"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(18)},children:"18"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(20)},children:"20"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(24)},children:"24"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocFontSizePt(32)},children:"32"})
              ]})
            ]}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Besarkan Huruf (Font Size +)",onMouseDown:e=>{e.preventDefault();stepDocFontSize(1)},children:"+"}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 6. Bold, Italic, Underline, Strike
            (0,t.jsx)("button",{type:"button",id:"tb-btn-bold",className:"anev-tool-btn",title:"Tebal (Ctrl+B)",onMouseDown:e=>{e.preventDefault();runDocCmd("bold")},children:(0,t.jsx)("b",{children:"B"})}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-italic",className:"anev-tool-btn",title:"Miring (Ctrl+I)",onMouseDown:e=>{e.preventDefault();runDocCmd("italic")},children:(0,t.jsx)("i",{children:"I"})}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-underline",className:"anev-tool-btn",title:"Garis Bawah (Ctrl+U)",onMouseDown:e=>{e.preventDefault();runDocCmd("underline")},children:(0,t.jsx)("u",{children:"U"})}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-strike",className:"anev-tool-btn",title:"Coretan (Strike)",onMouseDown:e=>{e.preventDefault();runDocCmd("strikeThrough")},children:(0,t.jsx)("s",{children:"S"})}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 7. Text Color Palette
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"textColorDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Teks",onMouseDown:e=>{e.preventDefault();toggleDocDropdown("textColorDropdown")},children:[
                (0,t.jsx)("span",{style:{color:"#dc2626",fontWeight:900,textDecoration:"underline"},children:"A"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"130px",padding:"8px",display:"grid",gridTemplateColumns:"repeat(5, 20px)",gap:"4px"},children:[
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#000000",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#000000")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#475569",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#475569")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#dc2626",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#dc2626")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#ea580c",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#ea580c")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#ca8a04",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#ca8a04")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#16a34a",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#16a34a")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#0284c7",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#0284c7")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#2563eb",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#2563eb")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#7c3aed",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#7c3aed")}}),
                (0,t.jsx)("div",{style:{width:"20px",height:"20px",background:"#db2777",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocTextColor("#db2777")}})
              ]})
            ]}),

            // 8. Highlight Color Palette
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"bgColorDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Sorotan (Stabilo)",onMouseDown:e=>{e.preventDefault();toggleDocDropdown("bgColorDropdown")},children:[
                (0,t.jsx)("span",{style:{background:"#fef08a",padding:"0 3px",border:"1px solid #ca8a04",borderRadius:"2px"},children:"🖊️"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"130px",padding:"8px",display:"grid",gridTemplateColumns:"repeat(5, 20px)",gap:"4px"},children:[
                (0,t.jsx)("div",{title:"Kuning",style:{width:"20px",height:"20px",background:"#fef08a",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("#fef08a")}}),
                (0,t.jsx)("div",{title:"Hijau",style:{width:"20px",height:"20px",background:"#bbf7d0",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("#bbf7d0")}}),
                (0,t.jsx)("div",{title:"Biru",style:{width:"20px",height:"20px",background:"#bae6fd",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("#bae6fd")}}),
                (0,t.jsx)("div",{title:"Oranye",style:{width:"20px",height:"20px",background:"#fed7aa",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("#fed7aa")}}),
                (0,t.jsx)("div",{title:"Pink",style:{width:"20px",height:"20px",background:"#fbcfe8",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("#fbcfe8")}}),
                (0,t.jsx)("div",{title:"Tanpa Warna",style:{width:"20px",height:"20px",background:"transparent",border:"1px dashed #64748b",borderRadius:"2px",cursor:"pointer"},onMouseDown:e=>{e.preventDefault();setDocHighlightColor("transparent")}})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 9. Alignments
            (0,t.jsx)("button",{type:"button",id:"tb-btn-align-left",className:"anev-tool-btn",title:"Rata Kiri (Left)",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyLeft")},children:"⇤"}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-align-center",className:"anev-tool-btn",title:"Rata Tengah (Center)",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyCenter")},children:"⇎"}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-align-right",className:"anev-tool-btn",title:"Rata Kanan (Right)",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyRight")},children:"⇥"}),
            (0,t.jsx)("button",{type:"button",id:"tb-btn-align-justify",className:"anev-tool-btn active",title:"Rata Justify (Kanan-Kiri Penuh)",onMouseDown:e=>{e.preventDefault();runDocCmd("justifyFull")},children:"≡"}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 10. Line Spacing Dropdown
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"spacingDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",onMouseDown:e=>{e.preventDefault();toggleDocDropdown("spacingDropdown")},children:[
                (0,t.jsx)("span",{children:"↕ Spasi"}),
                " ▾"
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"150px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.0")},children:"1.0 (Tunggal)"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.15")},children:"1.15"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.35")},children:"1.35"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.45")},children:"1.45 (Standar Polri)"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("1.5")},children:"1.5"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();setDocLineSpacing("2.0")},children:"2.0 (Ganda)"})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 11. Bullets & Indentation
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onMouseDown:e=>{e.preventDefault();runDocCmd("insertUnorderedList")},children:"•≡"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Nomor (Numbered)",onMouseDown:e=>{e.preventDefault();runDocCmd("insertOrderedList")},children:"1≡"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kurangi Indentasi",onMouseDown:e=>{e.preventDefault();runDocCmd("outdent")},children:"⇤"}),
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Indentasi",onMouseDown:e=>{e.preventDefault();runDocCmd("indent")},children:"⇥"}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 12. Table Menu Dropdown
            (0,t.jsxs)("div",{className:"tb-dropdown",id:"tableDropdown",children:[
              (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",style:{color:"#1d4ed8",fontWeight:700,background:"#eff6ff",borderColor:"#bfdbfe"},onMouseDown:e=>{e.preventDefault();toggleDocDropdown("tableDropdown")},children:[
                "📊 ",
                (0,t.jsx)("span",{children:"Tabel ▾"})
              ]}),
              (0,t.jsxs)("div",{className:"tb-dropdown-menu",style:{minWidth:"190px"},children:[
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();insertCustomTable(3, 4)},children:"➕ Sisipkan Tabel Baru"}),
                (0,t.jsx)("div",{style:{height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("addRowAbove")},children:"⬆️ Sisipkan Baris di Atas"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("addRowBelow")},children:"⬇️ Sisipkan Baris di Bawah"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("delRow")},children:"❌ Hapus Baris"}),
                (0,t.jsx)("div",{style:{height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("addColLeft")},children:"⬅️ Sisipkan Kolom di Kiri"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("addColRight")},children:"➡️ Sisipkan Kolom di Kanan"}),
                (0,t.jsx)("div",{className:"tb-menu-item",onMouseDown:e=>{e.preventDefault();handleTableAction("delCol")},children:"❌ Hapus Kolom"}),
                (0,t.jsx)("div",{style:{height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
                (0,t.jsx)("div",{className:"tb-menu-item",style:{color:"#dc2626"},onMouseDown:e=>{e.preventDefault();handleTableAction("delTable")},children:"🗑️ Hapus Tabel"})
              ]})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 13. Page Break
            (0,t.jsxs)("button",{type:"button",className:"tb-select-btn",style:{fontWeight:700},title:"Pemisah Halaman (Page Break / Ctrl+Enter)",onMouseDown:e=>{e.preventDefault();handleInsertPageBreak()},children:[
              "📄+ ",
              (0,t.jsx)("span",{children:"Page Break"})
            ]}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 14. Find and Replace Button
            (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Temukan dan Ganti (Ctrl+F / Ctrl+H)",onMouseDown:e=>{e.preventDefault();toggleFindReplace(true)},children:"🔍"}),
            (0,t.jsx)("div",{className:"anev-tool-separator"}),

            // 15. Logo Reserse
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",color:"#475569"},onMouseDown:e=>{e.preventDefault();handleInsertLogo()},title:"Sisipkan lambang Reserse Polri",children:[
              "🖼️ ",
              (0,t.jsx)("span",{children:"Logo"})
            ]})
          ]}),

          // FLOATING GOOGLE DOCS FIND & REPLACE BOX
          (0,t.jsxs)("div",{id:"docFindReplaceBox",className:"gdocs-find-replace-box anev-no-print",style:{display:"none"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"},children:[
              (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.82rem",color:"#1e293b"},children:"🔍 Temukan & Ganti"}),
              (0,t.jsx)("span",{id:"findMatchCount",style:{fontSize:"0.72rem",color:"#64748b",marginLeft:"auto"},children:""}),
              (0,t.jsx)("button",{type:"button",className:"gdocs-btn-icon",onMouseDown:e=>{e.preventDefault();closeFindReplace()},title:"Tutup (Esc)",children:"✕"})
            ]}),
            (0,t.jsxs)("div",{style:{display:"flex",gap:"6px",alignItems:"center",marginBottom:"6px"},children:[
              (0,t.jsx)("input",{id:"docFindInput",type:"text",placeholder:"Cari dalam naskah...",className:"gdocs-find-input",onKeyDown:e=>{if(e.key==="Enter")handleDocFind(e.target.value,!e.shiftKey)}}),
              (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Sebelumnya (Shift+Enter)",onMouseDown:e=>{e.preventDefault();handleDocFind(document.getElementById("docFindInput").value,false)},children:"▲"}),
              (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Berikutnya (Enter)",onMouseDown:e=>{e.preventDefault();handleDocFind(document.getElementById("docFindInput").value,true)},children:"▼"})
            ]}),
            (0,t.jsxs)("div",{id:"replaceFields",style:{display:"flex",gap:"6px",alignItems:"center"},children:[
              (0,t.jsx)("input",{id:"docReplaceInput",type:"text",placeholder:"Ganti dengan...",className:"gdocs-find-input"}),
              (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",style:{fontSize:"0.72rem",padding:"2px 8px"},onMouseDown:e=>{e.preventDefault();handleDocReplace(document.getElementById("docFindInput").value,document.getElementById("docReplaceInput").value)},children:"Ganti"}),
              (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",style:{fontSize:"0.72rem",padding:"2px 8px",fontWeight:700,color:"#2563eb"},onMouseDown:e=>{e.preventDefault();handleDocReplaceAll(document.getElementById("docFindInput").value,document.getElementById("docReplaceInput").value)},children:"Ganti Semua"})
            ]})
          ]}),

          // GOOGLE DOCS EDITOR LAYOUT (COLLAPSIBLE OUTLINE + WORKSPACE)
          (0,t.jsxs)("div",{className:"gdocs-editor-layout-wrapper",children:[

            // FLOATING OUTLINE TOGGLE PILL (ON LEFT MARGIN)
            (0,t.jsxs)("button",{type:"button",className:"gdocs-floating-outline-pill anev-no-print",onClick:()=>toggleDocOutline(),title:"Buka / Tutup Kerangka Naskah",children:[
              (0,t.jsx)("span",{style:{fontSize:"1rem"},children:"📑"}),
              (0,t.jsx)("span",{className:"pill-label",children:"Kerangka"})
            ]}),

            // LEFT SIDEBAR: DOCUMENT OUTLINE (COLLAPSED BY DEFAULT SO A4 PAPER IS PERFECTLY CENTERED)
            (0,t.jsxs)("div",{id:"docOutlinePanel",className:"doc-outline-panel anev-no-print collapsed",children:[
              (0,t.jsxs)("div",{className:"doc-outline-header",children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[
                  (0,t.jsx)("span",{children:"📑"}),
                  (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.82rem"},children:"Kerangka Naskah"})
                ]}),
                (0,t.jsx)("button",{type:"button",className:"gdocs-btn-icon",onClick:()=>toggleDocOutline(),title:"Tutup Kerangka Naskah",children:"«"})
              ]}),
              (0,t.jsxs)("div",{className:"doc-outline-content",children:[
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-1"),children:"📌 Kop Surat & Judul"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-1"),children:"📖 I. PENDAHULUAN"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-1"),children:"• A. Umum"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-2"),children:"• B. Maksud dan Tujuan"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-2"),children:"• C. Dasar Hukum"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-2"),children:"• D. Ruang Lingkup"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-3"),children:"• E. IKU & Tabel 1.1"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-4"),children:"📊 II. TUGAS & KAMTIBMAS"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-4"),children:"• A. Tugas Utama"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-4"),children:"• B. Situasi Kamtibmas"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-5"),children:"• Tabel 2.1 & 2.2 Trend"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-6"),children:"• Perbandingan Perkara"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-7"),children:"• Restorative Justice"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-8"),children:"• Barang Bukti"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-9"),children:"• III. Kekuatan Personel"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-10"),children:"• B. Anggaran Satker"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-2",onClick:()=>jumpToSection("sheet-page-11"),children:"• IV. Kasus Menonjol"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-12"),children:"🏆 V. HASIL CAPAIAN"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-12"),children:"💡 VI. KESIMPULAN & SARAN"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-12"),children:"🏁 VII. PENUTUP"}),
                (0,t.jsx)("div",{className:"outline-item outline-level-1",onClick:()=>jumpToSection("sheet-page-13"),children:"🖋️ Lembar Pengesahan Pejabat"})
              ]})
            ]}),

            // MAIN DOCUMENT WORKSPACE & RULER & UNIFIED EDITOR ROOT
            (0,t.jsxs)("div",{className:"anev-pages-workspace",id:"docWorkspace",children:[

              // HORIZONTAL RULER (PENGGARIS DOKUMEN GOOGLE DOCS / MS WORD)
              (0,t.jsx)("div",{className:"anev-ruler-bar anev-no-print",children:[
                (0,t.jsxs)("div",{className:"anev-ruler",children:[
                  (0,t.jsx)("div",{className:"anev-ruler-left-margin",title:"Batas Margin Kiri (3 cm)",children:(0,t.jsx)("span",{children:"3 cm"})}),
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
                  (0,t.jsx)("div",{className:"anev-ruler-right-margin",title:"Batas Margin Kanan (2 cm)",children:(0,t.jsx)("span",{children:"2 cm"})})
                ]})
              ]}),

              // REAL GOOGLE DOCS COMMENT BUBBLE (MENJAWAB KOMENTAR AGUNG KRISDIANTO DI GOOGLE DOCS)
              (0,t.jsxs)("div",{id:"gdocsCommentKop",className:"gdocs-comment-bubble anev-no-print",children:[
                (0,t.jsxs)("div",{className:"gdocs-comment-bubble-head",children:[
                  (0,t.jsx)("div",{className:"gdocs-comment-avatar",children:"AK"}),
                  (0,t.jsxs)("div",{className:"gdocs-comment-info",children:[
                    (0,t.jsx)("div",{className:"gdocs-comment-author",children:"Agung Krisdianto"}),
                    (0,t.jsx)("div",{className:"gdocs-comment-time",children:"11.16 Hari Ini"})
                  ]})
                ]}),
                (0,t.jsx)("div",{className:"gdocs-comment-msg",children:"KALO PAKE KOP"}),
                (0,t.jsxs)("div",{className:"gdocs-comment-btn-group",children:[
                  (0,t.jsx)("button",{type:"button",id:"btnCommentKopOn",className:"gdocs-comment-action-btn active",onMouseDown:e=>{e.preventDefault();toggleDocKop(true)},children:"✓ Pakai Kop"}),
                  (0,t.jsx)("button",{type:"button",id:"btnCommentKopOff",className:"gdocs-comment-action-btn",onMouseDown:e=>{e.preventDefault();toggleDocKop(false)},children:"✕ Tanpa Kop"})
                ]})
              ]}),

              // WORKSPACE A4 UNIFIED GOOGLE DOCS / MS WORD ROOT
              (0,t.jsxs)("div",{className:"gdocs-document-container anev-unified-editor",id:"docEditor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
  `;
}
