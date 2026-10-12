import fs from 'fs';

const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

// Let's create test_final_word_view.html
console.log('Generating test_final_word_view.html...');

const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Anev Periodik - Naskah Resmi A4 (Google Docs / Word WYSIWYG)</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background: #cbd5e1;
      font-family: Arial, "Times New Roman", Calibri, sans-serif;
      margin: 0;
      padding: 0;
      color: #000000;
    }

    /* GOOGLE DOCS TOOLBAR */
    .anev-docs-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #ffffff;
      border-bottom: 1px solid #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      padding: 4px 14px;
      display: flex;
      align-items: center;
      gap: 3px;
      flex-wrap: wrap;
    }
    .anev-tool-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid transparent;
      background: transparent;
      color: #334155;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
    }
    .anev-tool-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .anev-tool-separator {
      width: 1px;
      height: 20px;
      background: #cbd5e1;
      margin: 0 4px;
    }
    .anev-tool-select {
      height: 28px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 0 6px;
      font-size: 0.78rem;
      background: #ffffff;
      color: #334155;
      cursor: pointer;
    }

    /* RIGHT-CLICK CONTEXT MENU */
    .anev-context-menu {
      position: fixed;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      min-width: 200px;
      padding: 4px 0;
      font-size: 0.80rem;
      z-index: 99999;
    }
    .anev-context-item {
      padding: 6px 14px;
      color: #1e293b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      transition: background 0.1s;
    }
    .anev-context-item:hover {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }
    .anev-context-separator {
      width: 100%;
      height: 1px;
      background: #e2e8f0;
      margin: 3px 0;
    }

    /* WORKSPACE & EXACT A4 SHEETS */
    .anev-pages-workspace {
      background: #cbd5e1;
      padding: 24px 0 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
    }
    .anev-page-sheet {
      background: #ffffff;
      box-sizing: border-box;
      width: 210mm;
      min-height: 297mm;
      padding: 2cm 2cm 2cm 3cm; /* 2cm top, 2cm right, 2cm bottom, 3cm left matching Kinerja Perkara @page! */
      margin: 0 auto 24px auto;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
      border-radius: 2px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      font-size: 10pt;
      line-height: 1.45;
      color: #000000;
      font-family: Arial, "Times New Roman", Calibri, sans-serif;
    }

    /* TYPOGRAPHY: DEFAULT JUSTIFY */
    .anev-page-content, .anev-doc-editor {
      flex: 1 1 auto;
      outline: none;
      text-align: justify;
      text-justify: inter-word;
      color: #000000;
    }
    .anev-page-content p, .anev-page-content li, .anev-doc-editor p, .anev-doc-editor li {
      text-align: justify;
      text-justify: inter-word;
      margin: 0.35rem 0;
    }

    /* LOGO RESMI RESERSE (DELETABLE & MOVEABLE) */
    .anev-doc-logo {
      cursor: pointer;
      user-select: all;
      transition: outline 0.15s ease-in-out;
    }
    .anev-doc-logo:hover, .anev-doc-logo:focus {
      outline: 2px dashed #2563eb;
      outline-offset: 3px;
    }

    /* SECURITY STAMP & WATERMARK */
    .anev-security-stamp {
      border: 2px solid #dc2626;
      color: #dc2626;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 2px 14px;
      border-radius: 4px;
      font-size: 0.80rem;
      display: inline-block;
      margin-bottom: 6px;
    }
    .anev-watermark-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      user-select: none;
      z-index: 5;
      opacity: 0.045;
      transform: rotate(-25deg) scale(1.15);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      padding: 2rem 0;
    }
    .anev-watermark-line {
      font-size: 1.15rem;
      font-weight: 900;
      font-family: monospace;
      letter-spacing: 3px;
      color: #000;
      white-space: nowrap;
      text-align: center;
    }

    /* TABLES */
    .anev-table-naskah {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 8.5pt;
      line-height: 1.3;
      color: #000000;
    }
    .anev-table-naskah th, .anev-table-naskah td {
      border: 1px solid #000000;
      padding: 3px 5px;
    }
    .anev-table-naskah th {
      background: #f1f5f9;
      font-weight: 700;
      text-align: center;
    }

    /* HEADINGS */
    .anev-section-title {
      font-weight: 800;
      font-size: 11pt;
      text-transform: uppercase;
      margin: 10px 0 4px 0;
      text-align: center;
      color: #000000;
    }
    .anev-sub-title {
      font-weight: 700;
      font-size: 10pt;
      margin: 6px 0 3px 0;
      text-align: left;
      color: #000000;
    }

    /* FOOTER */
    .anev-page-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #64748b;
      z-index: 10;
    }

    /* PRINT EXACT A4 */
    @media print {
      @page {
        size: A4 portrait;
        margin-top: 2cm !important;
        margin-right: 2cm !important;
        margin-bottom: 2cm !important;
        margin-left: 3cm !important;
      }
      html, body {
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .anev-docs-toolbar, .anev-context-menu {
        display: none !important;
      }
      .anev-pages-workspace {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        gap: 0 !important;
      }
      .anev-page-sheet {
        width: 100% !important;
        max-width: 100% !important;
        min-height: 250mm !important;
        height: auto !important;
        padding: 0 !important; /* Zero padding in print: @page supplies 2cm/3cm margins! */
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .anev-page-sheet:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
    }
  </style>
</head>
<body>

<!-- GOOGLE DOCS TOOLBAR -->
<div class="anev-docs-toolbar">
  <button class="anev-tool-btn" title="Urungkan (Undo)" onclick="document.execCommand('undo')">↶</button>
  <button class="anev-tool-btn" title="Ulangi (Redo)" onclick="document.execCommand('redo')">↷</button>
  <button class="anev-tool-btn" title="Cetak Naskah (Ctrl+P)" onclick="window.print()">🖨️</button>
  <div class="anev-tool-separator"></div>

  <!-- Style Dropdown -->
  <select class="anev-tool-select" onchange="document.execCommand('formatBlock', false, this.value)">
    <option value="p">Teks Normal</option>
    <option value="h1">Judul Utama (H1)</option>
    <option value="h2">Sub Judul (H2)</option>
    <option value="h3">Bagian (H3)</option>
  </select>

  <!-- Font Family -->
  <select class="anev-tool-select" onchange="document.execCommand('fontName', false, this.value)">
    <option value="Arial" selected>Arial</option>
    <option value="Times New Roman">Times New Roman</option>
    <option value="Calibri">Calibri</option>
    <option value="Georgia">Georgia</option>
  </select>

  <!-- Font Size -->
  <select class="anev-tool-select" onchange="document.execCommand('fontSize', false, this.value)">
    <option value="2">10 pt</option>
    <option value="3" selected>11 pt</option>
    <option value="4">12 pt</option>
    <option value="5">14 pt</option>
    <option value="6">18 pt</option>
  </select>
  <div class="anev-tool-separator"></div>

  <!-- Formatting -->
  <button class="anev-tool-btn" title="Tebal (Ctrl+B)" onclick="document.execCommand('bold')"><b>B</b></button>
  <button class="anev-tool-btn" title="Miring (Ctrl+I)" onclick="document.execCommand('italic')"><i>I</i></button>
  <button class="anev-tool-btn" title="Garis Bawah (Ctrl+U)" onclick="document.execCommand('underline')"><u>U</u></button>
  <button class="anev-tool-btn" title="Coret (Strikethrough)" onclick="document.execCommand('strikeThrough')"><s>S</s></button>
  <div class="anev-tool-separator"></div>

  <!-- Alignment (Default Justify) -->
  <button class="anev-tool-btn" title="Rata Kiri" onclick="document.execCommand('justifyLeft')">⇤</button>
  <button class="anev-tool-btn" title="Rata Tengah" onclick="document.execCommand('justifyCenter')">⇎</button>
  <button class="anev-tool-btn" title="Rata Kanan" onclick="document.execCommand('justifyRight')">⇥</button>
  <button class="anev-tool-btn" style="background:#e2e8f0;color:#1d4ed8;font-weight:800;" title="Rata Kiri Kanan (Justify - Default)" onclick="document.execCommand('justifyFull')">≡</button>
  <div class="anev-tool-separator"></div>

  <!-- Lists -->
  <button class="anev-tool-btn" title="Daftar Butir" onclick="document.execCommand('insertUnorderedList')">•≡</button>
  <button class="anev-tool-btn" title="Daftar Nomor" onclick="document.execCommand('insertOrderedList')">1≡</button>
  <div class="anev-tool-separator"></div>

  <!-- Sinkron Button -->
  <button class="anev-tool-btn" style="background:#2563eb;color:#ffffff;border:1px solid #1d4ed8;border-radius:4px;padding:2px 10px;font-weight:800;" onclick="resolveTags()" title="Sinkronkan data dengan database CAS">
    ✨ Sinkron Data CAS
  </button>
</div>

<!-- CONTEXT MENU (KLIK KANAN) -->
<div id="contextMenu" class="anev-context-menu" style="display:none;"></div>

<!-- WORKSPACE A4 9 PAGES -->
<div class="anev-pages-workspace">

  <!-- PAGE 1 -->
  <div class="anev-page-sheet">
    <div class="anev-watermark-overlay">
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
    </div>
    <div class="anev-page-content" contenteditable="true" spellcheck="false">
      <div style="text-align:center;margin-bottom:1rem;">
        <div class="anev-security-stamp">KLASIFIKASI: RAHASIA</div>
        <div style="font-weight:800;font-size:10.5pt;letter-spacing:0.5px;text-transform:uppercase;">KEPOLISIAN NEGARA REPUBLIK INDONESIA</div>
        <div style="font-weight:700;font-size:10pt;letter-spacing:0.5px;text-transform:uppercase;">{{AUTO: structure_level}} {{AUTO: lokasi_satker}}</div>
        <div style="font-weight:700;font-size:9.5pt;letter-spacing:0.5px;text-transform:uppercase;">{{AUTO: organization_level}}</div>
        <div style="text-align:center;margin:6px 0;">
          <img src="${logoDataUri}" class="anev-doc-logo" alt="Logo Reserse Polri" title="Klik untuk memilih, tekan Backspace/Delete untuk menghapus" style="width:70px;height:auto;display:block;margin:4px auto;cursor:pointer;user-select:all;" />
        </div>
        <div style="font-weight:900;font-size:11.5pt;letter-spacing:0.5px;marginTop:4px;">LAPORAN [*PERIOD]</div>
        <div style="font-weight:700;font-size:10pt;">{{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}}</div>
        <div style="font-weight:600;font-size:9pt;color:#334155;">[*DETAIL PERIOD]</div>
        <div style="border-bottom:2px solid #000;margin-top:8px;margin-bottom:10px;"></div>
      </div>

      <div class="anev-section-title">PENDAHULUAN</div>
      <div class="anev-sub-title">Umum</div>
      <p>Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu {{AUTO: tanggal_awal}} s.d. {{AUTO: tanggal_akhir}}, mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}}.</p>
      <p>Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya.</p>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Maksud dan Tujuan</div>
      <p><strong>Maksud:</strong> Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode yang telah ditentukan.</p>
      <p><strong>Tujuan: Laporan ini bertujuan untuk:</strong></p>
      <ol style="margin:2px 0 6px 1.2rem;padding:0;">
        <li>Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;</li>
        <li>Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;</li>
        <li>Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan {{AUTO: structure_level}}.</li>
      </ol>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Dasar</div>
      <ol style="margin:2px 0 6px 1.2rem;padding:0;">
        <li>Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;</li>
        <li>[*Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang Susunan Organisasi dan Tata Kerja Satuan Organisasi pada Tingkat Markas Besar Kepolisian Negara Republik Indonesia / Peraturan Kepolisian Negara Republik Indonesia Nomor 3 Tahun 2024 tentang Perubahan atas Peraturan Kepolisian Negara Republik Indonesia Nomor 14 Tahun 2018 tentang Susunan Organisasi dan Tata Kerja Kepolisian Daerah];</li>
        <li>Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Keamanan dan Ketertiban Masyarakat;</li>
        <li>Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;</li>
        <li>Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;</li>
        <li>Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;</li>
        <li>Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang pengiriman format Laporan Bulanan.</li>
      </ol>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Ruang Lingkup</div>
      <p>Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} selama periode {{[*DETAIL PERIOD]}}. Adapun ruang lingkup pelaporan meliputi: 1) Data laporan polisi (LP) yang masuk dan diselesaikan; 2) Penanganan perkara berdasarkan jenis tindak pidana; 3) Pelaksanaan restorative justice (RJ) dan penyelesaian non-litigasi lainnya; 4) Data barang bukti yang diamankan dan/atau disita; 5) Kondisi kekuatan personel serta beban kerja penyidik; 6) Kerja sama dan koordinasi dengan satuan kerja lain, instansi eksternal, atau operasi terpusat; 7) Kasus-kasus menonjol atau menjadi atensi pimpinan; 8) Analisis dan evaluasi kinerja penyidikan berdasarkan indikator yang ditetapkan.</p>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Indeks Kinerja Utama</div>
      <p>Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel dalam menjawab harapan masyarakat terhadap keadilan hukum.</p>

      <!-- TABEL 1.1 IKU -->
      <table class="anev-table-naskah">
        <thead>
          <tr>
            <th rowspan="2" style="width:8%;">No</th>
            <th rowspan="2" style="width:38%;">Sasaran Strategis</th>
            <th rowspan="2" style="width:24%;">Indikator Kinerja Utama</th>
            <th colspan="5">Target Kinerja</th>
          </tr>
          <tr>
            <th style="width:6%;">2025</th>
            <th style="width:6%;">2026</th>
            <th style="width:6%;">2027</th>
            <th style="width:6%;">2028</th>
            <th style="width:6%;">2029</th>
          </tr>
          <tr style="background:#f8fafc;font-size:8pt;text-align:center;">
            <td>1</td><td>2</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;font-weight:bold;">SS2</td>
            <td>Penegakan Hukum yang Humanis, Akuntabel, dan Berkeadlian (Renstra 2020-2024: Penegakan hukum secara berkeadilan)</td>
            <td style="font-weight:600;">3. Indeks Gakkum Polri</td>
            <td style="text-align:center;">3,6</td>
            <td style="text-align:center;font-weight:bold;">3,7</td>
            <td style="text-align:center;">3,8</td>
            <td style="text-align:center;">3,9</td>
            <td style="text-align:center;">4,0</td>
          </tr>
        </tbody>
      </table>
      <div style="font-size:8.5pt;font-style:italic;margin:4px 0 8px 0;">Tabel 1.1: indikator kinerja utama indeks gakkum polri</div>
      <p>Target Indeks Kinerja Utama (IKU) ini bersifat tahunan dan digunakan sebagai dasar dalam mengevaluasi kinerja satuan kerja (satker) fungsi Reserse, mulai dari tingkat Polsek, Polres, Polda, hingga Bareskrim Polri. Penilaian terhadap pencapaian IKU dilakukan melalui pengukuran berbasis data yang bersumber dari Crime Analytic System (CAS), yang mengelola data secara otomatis. Dengan demikian, IKU tidak hanya menjadi alat ukur administratif, tetapi juga instrumen strategis dalam perencanaan kebutuhan personel, anggaran, serta pengambilan kebijakan berbasis analisis beban kerja dan kasus prioritas.</p>
    </div>
    <div class="anev-page-footer">
      <div>🛡️ CAS FORENSIC DOCUMENT • CAS-98010710-ANEV</div>
      <div>1</div>
    </div>
  </div>

</div>

<script>
  function resolveTags() {
    let ctx = {
      structure_level: "DAERAH",
      lokasi_satker: "JAWA TIMUR",
      organization_level: "DIREKTORAT RESERSE KRIMINAL UMUM",
      tanggal_awal: "01 September 2026",
      tanggal_akhir: "30 September 2026",
      period: "BULANAN",
      detail_period: "SEPTEMBER 2026"
    };
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node, textNodes = [];
    while (node = walker.nextNode()) textNodes.push(node);
    for (let tn of textNodes) {
      let val = tn.nodeValue;
      if (val && (val.includes("{{") || val.includes("[*"))) {
        let n = val;
        for (let k in ctx) {
          n = n.split("{{AUTO: " + k + "}}").join(ctx[k]);
          n = n.split("{{AUTO:" + k + "}}").join(ctx[k]);
          n = n.split("[*" + k + "]").join(ctx[k]);
          n = n.split("[*" + k.toUpperCase() + "]").join(ctx[k]);
        }
        if (n !== val) tn.nodeValue = n;
      }
    }
  }
</script>
</body>
</html>`;

fs.writeFileSync('test_final_word_view.html', html, 'utf8');
console.log('test_final_word_view.html generated successfully!');
