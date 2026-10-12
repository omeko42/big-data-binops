import fs from 'fs';

console.log('Generating complete test suite with Ruler, Connected Multi-Page Flow, Full Toolbar, and CAS Sync...');

const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

// We build test_word_complete_suite.html
const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Google Docs / MS Word WYSIWYG - Anev Periodik CAS</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background: #cbd5e1;
      font-family: Arial, "Times New Roman", Calibri, sans-serif;
      margin: 0;
      padding: 0;
      color: #000000;
    }

    /* GOOGLE DOCS TOOLBAR STICKY */
    .gdocs-toolbar-container {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #ffffff;
      border-bottom: 1px solid #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .gdocs-toolbar {
      padding: 4px 14px;
      display: flex;
      align-items: center;
      gap: 3px;
      flex-wrap: wrap;
    }
    .gdocs-btn {
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
      transition: background 0.1s;
    }
    .gdocs-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .gdocs-btn.active {
      background: #e2e8f0;
      color: #1d4ed8;
      border-color: #cbd5e1;
    }
    .gdocs-separator {
      width: 1px;
      height: 20px;
      background: #cbd5e1;
      margin: 0 4px;
    }
    .gdocs-select {
      height: 28px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 0 6px;
      font-size: 0.78rem;
      background: #ffffff;
      color: #334155;
      cursor: pointer;
    }

    /* DROPDOWNS */
    .gdocs-dropdown {
      position: relative;
      display: inline-block;
    }
    .gdocs-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 3px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      min-width: 195px;
      z-index: 1200;
      padding: 4px 0;
    }
    .gdocs-dropdown:hover .gdocs-menu,
    .gdocs-dropdown.open .gdocs-menu {
      display: block;
    }
    .gdocs-menu-item {
      padding: 6px 14px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gdocs-menu-item:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    /* HORIZONTAL RULER */
    .gdocs-ruler-bar {
      display: flex;
      justify-content: center;
      background: #cbd5e1;
      padding: 4px 0;
      border-bottom: 1px solid #94a3b8;
    }
    .gdocs-ruler {
      width: 210mm;
      height: 24px;
      background: #ffffff;
      border: 1px solid #94a3b8;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      position: relative;
      user-select: none;
    }
    .gdocs-ruler-left-margin {
      width: 30mm;
      background: #e2e8f0;
      border-right: 1.5px solid #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
    }
    .gdocs-ruler-body {
      width: 160mm;
      background: #ffffff;
      position: relative;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
    }
    .gdocs-ruler-right-margin {
      width: 20mm;
      background: #e2e8f0;
      border-left: 1.5px solid #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
    }
    .gdocs-ruler-marker-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #2563eb;
      cursor: ew-resize;
      z-index: 5;
    }
    .gdocs-ruler-marker-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 6px solid #2563eb;
      cursor: ew-resize;
      z-index: 5;
    }
    .gdocs-ruler-marker-right {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #2563eb;
      cursor: ew-resize;
      z-index: 5;
    }

    /* RIGHT-CLICK CONTEXT MENU */
    .gdocs-context-menu {
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
    .gdocs-context-item {
      padding: 6px 14px;
      color: #1e293b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }
    .gdocs-context-item:hover {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }
    .gdocs-context-separator {
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
      margin: 0 auto;
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
    .anev-doc-editor {
      flex: 1 1 auto;
      outline: none;
      text-align: justify;
      text-justify: inter-word;
      color: #000000;
    }
    .anev-doc-editor p, .anev-doc-editor li {
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
      .gdocs-toolbar-container, .gdocs-ruler-bar, .gdocs-context-menu {
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
<div class="gdocs-toolbar-container">
  <div class="gdocs-toolbar">
    <button class="gdocs-btn" title="Urungkan (Undo)" onclick="document.execCommand('undo')">↶</button>
    <button class="gdocs-btn" title="Ulangi (Redo)" onclick="document.execCommand('redo')">↷</button>
    <button class="gdocs-btn" title="Cetak Naskah (Ctrl+P)" onclick="window.print()">🖨️</button>
    <div class="gdocs-separator"></div>

    <!-- Style Dropdown -->
    <select class="gdocs-select" onchange="document.execCommand('formatBlock', false, this.value)" title="Gaya Paragraf">
      <option value="p">Teks Normal</option>
      <option value="h1">Judul Utama (H1)</option>
      <option value="h2">Sub Judul (H2)</option>
      <option value="h3">Bagian (H3)</option>
    </select>

    <!-- Font Family -->
    <select class="gdocs-select" onchange="document.execCommand('fontName', false, this.value)" title="Jenis Huruf">
      <option value="Arial" selected>Arial</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Calibri">Calibri</option>
      <option value="Georgia">Georgia</option>
    </select>

    <!-- Font Size (Real PT Sizes) -->
    <select class="gdocs-select" onchange="setDocFontSize(this.value)" title="Ukuran Huruf">
      <option value="9">9 pt</option>
      <option value="10" selected>10 pt</option>
      <option value="11">11 pt</option>
      <option value="12">12 pt</option>
      <option value="14">14 pt</option>
      <option value="16">16 pt</option>
      <option value="18">18 pt</option>
    </select>
    <div class="gdocs-separator"></div>

    <!-- Formatting -->
    <button class="gdocs-btn" title="Tebal (Ctrl+B)" onclick="document.execCommand('bold')"><b>B</b></button>
    <button class="gdocs-btn" title="Miring (Ctrl+I)" onclick="document.execCommand('italic')"><i>I</i></button>
    <button class="gdocs-btn" title="Garis Bawah (Ctrl+U)" onclick="document.execCommand('underline')"><u>U</u></button>
    <button class="gdocs-btn" title="Coret (Strikethrough)" onclick="document.execCommand('strikeThrough')"><s>S</s></button>
    <div class="gdocs-separator"></div>

    <!-- Text Color & Highlight -->
    <div class="gdocs-dropdown">
      <button class="gdocs-btn" title="Warna Teks">
        <span style="border-bottom:3px solid #1e293b;padding-bottom:1px;font-weight:900;">A</span>
      </button>
      <div class="gdocs-menu" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:8px;min-width:130px;">
        <div style="width:22px;height:22px;background:#000000;border-radius:3px;cursor:pointer;" onclick="document.execCommand('foreColor',false,'#000000')"></div>
        <div style="width:22px;height:22px;background:#dc2626;border-radius:3px;cursor:pointer;" onclick="document.execCommand('foreColor',false,'#dc2626')"></div>
        <div style="width:22px;height:22px;background:#2563eb;border-radius:3px;cursor:pointer;" onclick="document.execCommand('foreColor',false,'#2563eb')"></div>
        <div style="width:22px;height:22px;background:#16a34a;border-radius:3px;cursor:pointer;" onclick="document.execCommand('foreColor',false,'#16a34a')"></div>
      </div>
    </div>
    <div class="gdocs-dropdown">
      <button class="gdocs-btn" title="Warna Sorot (Highlight)">
        <span style="background:#fde047;padding:1px 4px;border-radius:2px;font-weight:900;">H</span>
      </button>
      <div class="gdocs-menu" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:8px;min-width:130px;">
        <div style="width:22px;height:22px;background:#fef08a;border-radius:3px;cursor:pointer;" onclick="document.execCommand('hiliteColor',false,'#fef08a')"></div>
        <div style="width:22px;height:22px;background:#bbf7d0;border-radius:3px;cursor:pointer;" onclick="document.execCommand('hiliteColor',false,'#bbf7d0')"></div>
        <div style="width:22px;height:22px;background:#bae6fd;border-radius:3px;cursor:pointer;" onclick="document.execCommand('hiliteColor',false,'#bae6fd')"></div>
        <div style="width:22px;height:22px;background:#ffffff;border:1px dashed #94a3b8;border-radius:3px;cursor:pointer;" onclick="document.execCommand('hiliteColor',false,'transparent')"></div>
      </div>
    </div>
    <div class="gdocs-separator"></div>

    <!-- Alignment (Default Justify) -->
    <button class="gdocs-btn" title="Rata Kiri" onclick="document.execCommand('justifyLeft')">⇤</button>
    <button class="gdocs-btn" title="Rata Tengah" onclick="document.execCommand('justifyCenter')">⇎</button>
    <button class="gdocs-btn" title="Rata Kanan" onclick="document.execCommand('justifyRight')">⇥</button>
    <button class="gdocs-btn active" title="Rata Kiri Kanan (Justify - Default)" onclick="document.execCommand('justifyFull')">≡</button>
    <div class="gdocs-separator"></div>

    <!-- Line Spacing -->
    <select class="gdocs-select" onchange="setDocLineSpacing(this.value)" title="Spasi Baris (Line Spacing)">
      <option value="1.15">1.15</option>
      <option value="1.35">1.35</option>
      <option value="1.45" selected>1.45</option>
      <option value="1.5">1.5</option>
      <option value="2.0">2.0</option>
    </select>
    <div class="gdocs-separator"></div>

    <!-- Indent / Outdent -->
    <button class="gdocs-btn" title="Kurangi Indentasi" onclick="document.execCommand('outdent')">⇤</button>
    <button class="gdocs-btn" title="Tambah Indentasi" onclick="document.execCommand('indent')">⇥</button>
    <div class="gdocs-separator"></div>

    <!-- Lists -->
    <button class="gdocs-btn" title="Daftar Butir" onclick="document.execCommand('insertUnorderedList')">•≡</button>
    <button class="gdocs-btn" title="Daftar Nomor" onclick="document.execCommand('insertOrderedList')">1≡</button>
    <div class="gdocs-separator"></div>

    <!-- Table Menu Dropdown -->
    <div class="gdocs-dropdown">
      <button class="gdocs-btn" style="gap:4px;color:#1d4ed8;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;">
        📊 <b>Tabel ▾</b>
      </button>
      <div class="gdocs-menu">
        <div class="gdocs-menu-item" onclick="insertNewTable()">➕ Sisipkan Tabel Baru</div>
        <div style="width:100%;height:1px;background:#e2e8f0;margin:3px 0;"></div>
        <div class="gdocs-menu-item" onclick="addTableRow(true)">⬆️ Tambah Baris Atas</div>
        <div class="gdocs-menu-item" onclick="addTableRow(false)">⬇️ Tambah Baris Bawah</div>
        <div class="gdocs-menu-item" onclick="deleteTableRow()">❌ Hapus Baris</div>
        <div style="width:100%;height:1px;background:#e2e8f0;margin:3px 0;"></div>
        <div class="gdocs-menu-item" onclick="addTableCol(true)">⬅️ Tambah Kolom Kiri</div>
        <div class="gdocs-menu-item" onclick="addTableCol(false)">➡️ Tambah Kolom Kanan</div>
        <div class="gdocs-menu-item" onclick="deleteTableCol()">❌ Hapus Kolom</div>
        <div style="width:100%;height:1px;background:#e2e8f0;margin:3px 0;"></div>
        <div class="gdocs-menu-item" onclick="deleteActiveTable()" style="color:#dc2626;">🗑️ Hapus Tabel</div>
      </div>
    </div>
    <div class="gdocs-separator"></div>

    <!-- Page Break Button -->
    <button class="gdocs-btn" title="Sisipkan Pemisah Halaman (Page Break / Ctrl+Enter)" onclick="insertPageBreak()">
      📄+ Page Break
    </button>
    <div class="gdocs-separator"></div>

    <!-- Clear Formatting -->
    <button class="gdocs-btn" title="Hapus Format (Clear Formatting)" onclick="document.execCommand('removeFormat')">
      🧹
    </button>
    <div class="gdocs-separator"></div>

    <!-- Sinkron Button -->
    <button class="gdocs-btn" style="background:#2563eb;color:#ffffff;border:1px solid #1d4ed8;border-radius:4px;padding:2px 10px;font-weight:800;gap:4px;" onclick="syncCasData()" title="Sinkronkan data dengan database CAS">
      ✨ Sinkron Data CAS
    </button>
  </div>

  <!-- HORIZONTAL RULER (PENGGARIS DOKUMEN GOOGLE DOCS / MS WORD) -->
  <div class="gdocs-ruler-bar">
    <div class="gdocs-ruler">
      <!-- Left Margin: 30mm (3cm) -->
      <div class="gdocs-ruler-left-margin" title="Batas Margin Kiri (3 cm)">
        <span>3 cm</span>
      </div>
      <!-- Body: 160mm (16cm) with cm markings -->
      <div class="gdocs-ruler-body" id="rulerBody" title="Area Cetak Lembar Kerja (16 cm)">
        <div class="gdocs-ruler-marker-top" title="Indentasi Baris Pertama"></div>
        <div class="gdocs-ruler-marker-bottom" title="Indentasi Kiri"></div>
        <div class="gdocs-ruler-marker-right" title="Margin Kanan"></div>
        <!-- SVG Ticks and Numbers -->
        <svg style="width:100%;height:100%;display:block;" viewBox="0 0 605 24" preserveAspectRatio="none">
          <!-- cm ticks & numbers (1 to 16) -->
          <g font-size="9" fill="#475569" font-family="Arial, sans-serif" text-anchor="middle">
            <line x1="37.8" y1="14" x2="37.8" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="37.8" y="11">1</text>
            <line x1="75.6" y1="14" x2="75.6" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="75.6" y="11">2</text>
            <line x1="113.4" y1="14" x2="113.4" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="113.4" y="11">3</text>
            <line x1="151.2" y1="14" x2="151.2" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="151.2" y="11">4</text>
            <line x1="189.0" y1="14" x2="189.0" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="189.0" y="11">5</text>
            <line x1="226.8" y1="14" x2="226.8" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="226.8" y="11">6</text>
            <line x1="264.6" y1="14" x2="264.6" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="264.6" y="11">7</text>
            <line x1="302.4" y1="14" x2="302.4" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="302.4" y="11">8</text>
            <line x1="340.2" y1="14" x2="340.2" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="340.2" y="11">9</text>
            <line x1="378.0" y1="14" x2="378.0" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="378.0" y="11">10</text>
            <line x1="415.8" y1="14" x2="415.8" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="415.8" y="11">11</text>
            <line x1="453.6" y1="14" x2="453.6" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="453.6" y="11">12</text>
            <line x1="491.4" y1="14" x2="491.4" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="491.4" y="11">13</text>
            <line x1="529.2" y1="14" x2="529.2" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="529.2" y="11">14</text>
            <line x1="567.0" y1="14" x2="567.0" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="567.0" y="11">15</text>
            <line x1="604.8" y1="14" x2="604.8" y2="24" stroke="#94a3b8" stroke-width="1"/>
            <text x="604.8" y="11">16</text>
          </g>
        </svg>
      </div>
      <!-- Right Margin: 20mm (2cm) -->
      <div class="gdocs-ruler-right-margin" title="Batas Margin Kanan (2 cm)">
        <span>2 cm</span>
      </div>
    </div>
  </div>
</div>

<!-- CONTEXT MENU (KLIK KANAN) -->
<div id="contextMenu" class="gdocs-context-menu" style="display:none;"></div>

<!-- WORKSPACE A4 SHEETS -->
<div class="anev-pages-workspace" id="pagesWorkspace">

  <!-- PAGE 1 -->
  <div class="anev-page-sheet" data-page="1">
    <div class="anev-watermark-overlay">
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
    </div>
    <div class="anev-doc-editor" contenteditable="true" spellcheck="false">
      <div style="text-align:center;margin-bottom:1rem;">
        <div class="anev-security-stamp">KLASIFIKASI: RAHASIA</div>
        <div style="font-weight:800;font-size:10.5pt;letter-spacing:0.5px;text-transform:uppercase;">KEPOLISIAN NEGARA REPUBLIK INDONESIA</div>
        <div style="font-weight:700;font-size:10pt;letter-spacing:0.5px;text-transform:uppercase;">{{AUTO: structure_level}} {{AUTO: lokasi_satker}}</div>
        <div style="font-weight:700;font-size:9.5pt;letter-spacing:0.5px;text-transform:uppercase;">{{AUTO: organization_level}}</div>
        <div style="text-align:center;margin:6px 0;">
          <img src="${logoDataUri}" class="anev-doc-logo" alt="Logo Reserse Polri" title="Klik untuk memilih, tekan Backspace/Delete untuk menghapus" style="width:70px;height:auto;display:block;margin:4px auto;cursor:pointer;user-select:all;" />
        </div>
        <div style="font-weight:900;font-size:11.5pt;letter-spacing:0.5px;margin-top:4px;">LAPORAN [*PERIOD]</div>
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
      <div class="page-num-display">1</div>
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="anev-page-sheet" data-page="2">
    <div class="anev-watermark-overlay">
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
      <div class="anev-watermark-line">98010710 &nbsp; • &nbsp; 98010710 &nbsp; • &nbsp; 98010710</div>
    </div>
    <div class="anev-doc-editor" contenteditable="true" spellcheck="false">
      <div class="anev-section-title">TUGAS YANG DILAKSANAKAN</div>
      <div class="anev-sub-title">Tugas utama</div>
      <p>Selama periode pelaporan ini, {{AUTO: organization_level}} {{AUTO: structure_level}} {{AUTO: lokasi_satker}} melaksanakan tugas pokok dan fungsi di bidang reserse kriminal sesuai dengan ketentuan yang berlaku. Tugas-tugas tersebut mencakup kegiatan penyelidikan, penyidikan, pelaksanaan gelar perkara, penegakan hukum, dan kegiatan pendukung lainnya yang relevan dengan penanganan tindak pidana.</p>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Manajemen Operasional</div>
      <p>Pelaksanaan tugas operasional ditunjang oleh ketersediaan sumber daya manusia (SDM), anggaran belanja, serta sarana dan prasarana (sarpras). Pengelolaan SDM dan sarpras dilakukan secara efektif dan efisien untuk mendukung capaian kinerja yang optimal.</p>

      <div style="font-weight:700;margin-top:0.4rem;">Sumber Daya Manusia</div>
      <p>SDM yang mendukung pelaksanaan tugas terdiri dari berbagai tingkat kepangkatan, fungsi penyidikan, serta latar belakang pendidikan. Adapun keterangan yang perlu disampaikan terkait SDM periode ini [*Nihil / Mutasi 1 (satu) orang ke … / MD karena … / dll terkait keterangan SDM.].</p>

      <div style="font-weight:700;margin-top:0.4rem;">Anggaran Belanja</div>
      <p>Penggunaan anggaran belanja selama periode pelaporan terbagi dalam tiga jenis: Belanja Pegawai, Belanja Barang, dan Belanja Modal. Penyerapan anggaran pada periode ini [*Nihil / terserap … digunakan untuk … / dll.].</p>

      <div style="font-weight:700;margin-top:0.4rem;">Sarana prasarana</div>
      <p>Penggunaan dan kondisi sarana serta prasarana dalam mendukung operasional satuan disusun berdasarkan klasifikasi berikut:</p>
      <p>1. Sarana: Terkait penggunaan dan kondisi sarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ].</p>
      <p>2. Prasarana: Terkait penggunaan dan kondisi prasarana periode ini, [*Nihil / terjadi [*pembaruan / kerusakan ringan / kerusakan berat / penghapusan] terhadap … ].</p>

      <div class="anev-sub-title" style="margin-top:0.6rem;">Tahanan dan Barang Bukti</div>
      <p>Jumlah tahanan serta barang bukti yang dikelola selama periode pelaporan dijabarkan secara kuantitatif, baik berdasarkan kategori maupun jenisnya.</p>
      
      <div style="font-weight:700;margin-bottom:3px;">Tahanan</div>
      <table class="anev-table-naskah" id="tabelTahanan">
        <thead>
          <tr>
            <th rowspan="2" style="width:6%;">NO</th>
            <th rowspan="2" style="width:32%;">JENIS TAHANAN</th>
            <th colspan="3">JUMLAH TAHANAN</th>
            <th rowspan="2" style="width:12%;">TOTAL TAHANAN</th>
            <th rowspan="2" style="width:18%;">KET</th>
          </tr>
          <tr>
            <th style="width:10%;">AWAL</th>
            <th style="width:10%;">MASUK</th>
            <th style="width:10%;">KELUAR</th>
          </tr>
          <tr style="background:#f8fafc;font-size:8pt;text-align:center;">
            <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f8fafc;font-weight:700;">
            <td style="text-align:center;">A.</td><td colspan="6">Tahanan Satker</td>
          </tr>
          <tr>
            <td style="text-align:center;">1.</td><td>Dewasa</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Laki-laki</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Perempuan</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">2.</td><td>Anak</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Laki-laki</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Perempuan</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr style="font-weight:700;">
            <td style="text-align:center;">-</td><td>Jumlah</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr style="background:#f8fafc;font-weight:700;">
            <td style="text-align:center;">B.</td><td colspan="6">Titipan Instansi / K / L</td>
          </tr>
          <tr>
            <td style="text-align:center;">1.</td><td>Dewasa</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Laki-laki</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Perempuan</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">2.</td><td>Anak</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Laki-laki</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr>
            <td style="text-align:center;">-</td><td>Perempuan</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr style="font-weight:700;">
            <td style="text-align:center;">-</td><td>Jumlah</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
          <tr style="background:#f1f5f9;font-weight:800;">
            <td style="text-align:center;">-</td><td>Grand Total</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td>* hanya contoh</td>
          </tr>
        </tbody>
      </table>
      <div style="font-size:8.5pt;font-style:italic;margin:4px 0 8px 0;">Tabel 1.8: Jumlah Tahanan</div>
    </div>
    <div class="anev-page-footer">
      <div>🛡️ CAS FORENSIC DOCUMENT • CAS-98010710-ANEV</div>
      <div class="page-num-display">2</div>
    </div>
  </div>

</div>

<script>
  // CROSS-PAGE SEAMLESS NAVIGATION & BACKSPACE MERGE ENGINE
  document.addEventListener('keydown', function(e) {
    let sel = window.getSelection();
    if (!sel || !sel.isCollapsed) return;

    let targetEditor = sel.anchorNode ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest('.anev-doc-editor') : null;
    if (!targetEditor) return;

    let currentSheet = targetEditor.closest('.anev-page-sheet');
    let pageNum = parseInt(currentSheet?.getAttribute('data-page') || '1', 10);

    if (e.key === 'Backspace') {
      let range = sel.getRangeAt(0);
      let preRange = range.cloneRange();
      preRange.selectNodeContents(targetEditor);
      preRange.setEnd(range.startContainer, range.startOffset);

      // If cursor is at the very beginning of this page's editor
      if (preRange.toString().length === 0) {
        if (pageNum > 1) {
          e.preventDefault();
          let prevSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum - 1) + '"]');
          let prevEditor = prevSheet ? prevSheet.querySelector('.anev-doc-editor') : null;
          if (prevEditor) {
            // Move first element of current page to the end of previous page
            let firstChild = targetEditor.firstElementChild;
            if (firstChild) {
              prevEditor.appendChild(firstChild);
              let newRange = document.createRange();
              newRange.selectNodeContents(firstChild);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
              firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              // If page is completely empty, focus end of prev page
              let lastChild = prevEditor.lastElementChild || prevEditor;
              let newRange = document.createRange();
              newRange.selectNodeContents(lastChild);
              newRange.collapse(false);
              sel.removeAllRanges();
              sel.addRange(newRange);
              lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      }
    } else if (e.key === 'Delete') {
      let range = sel.getRangeAt(0);
      let postRange = range.cloneRange();
      postRange.selectNodeContents(targetEditor);
      postRange.setStart(range.endContainer, range.endOffset);

      // If cursor is at the very end of this page's editor
      if (postRange.toString().length === 0) {
        let nextSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum + 1) + '"]');
        let nextEditor = nextSheet ? nextSheet.querySelector('.anev-doc-editor') : null;
        if (nextEditor && nextEditor.firstElementChild) {
          e.preventDefault();
          let moved = nextEditor.firstElementChild;
          targetEditor.appendChild(moved);
        }
      }
    } else if (e.key === 'ArrowUp') {
      let range = sel.getRangeAt(0);
      let preRange = range.cloneRange();
      preRange.selectNodeContents(targetEditor);
      preRange.setEnd(range.startContainer, range.startOffset);

      if (preRange.toString().indexOf('\\n') === -1 && preRange.toString().length < 30) {
        if (pageNum > 1) {
          let prevSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum - 1) + '"]');
          let prevEditor = prevSheet ? prevSheet.querySelector('.anev-doc-editor') : null;
          if (prevEditor) {
            let lastChild = prevEditor.lastElementChild || prevEditor;
            let newRange = document.createRange();
            newRange.selectNodeContents(lastChild);
            newRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(newRange);
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            e.preventDefault();
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      let range = sel.getRangeAt(0);
      let postRange = range.cloneRange();
      postRange.selectNodeContents(targetEditor);
      postRange.setStart(range.endContainer, range.endOffset);

      if (postRange.toString().indexOf('\\n') === -1 && postRange.toString().length < 30) {
        let nextSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum + 1) + '"]');
        let nextEditor = nextSheet ? nextSheet.querySelector('.anev-doc-editor') : null;
        if (nextEditor) {
          let firstChild = nextEditor.firstElementChild || nextEditor;
          let newRange = document.createRange();
          newRange.selectNodeContents(firstChild);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          e.preventDefault();
        }
      }
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      insertPageBreak();
    }
  });

  // FONT SIZE PT ENGINE
  function setDocFontSize(pt) {
    document.execCommand('fontSize', false, '7');
    var fonts = document.querySelectorAll('font[size="7"]');
    for (var i = 0; i < fonts.length; i++) {
      var f = fonts[i];
      var span = document.createElement('span');
      span.style.fontSize = pt + 'pt';
      span.innerHTML = f.innerHTML;
      f.parentNode.replaceChild(span, f);
    }
  }

  // LINE SPACING
  function setDocLineSpacing(val) {
    var sel = window.getSelection();
    if (!sel) return;
    var node = sel.anchorNode;
    var p = node ? (node.nodeType === 1 ? node : node.parentElement).closest('p, div, li, td, th') : null;
    if (p) p.style.lineHeight = val;
  }

  // INSERT PAGE BREAK
  function insertPageBreak() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var node = sel.anchorNode;
    var editor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-doc-editor') : null;
    if (!editor) return;

    var sheet = editor.closest('.anev-page-sheet');
    var pageNum = parseInt(sheet.getAttribute('data-page') || '1', 10);
    var workspace = document.getElementById('pagesWorkspace');

    // Create a new sheet right after current sheet
    var newSheet = sheet.cloneNode(true);
    var newPageNum = pageNum + 1;
    newSheet.setAttribute('data-page', newPageNum);
    var newEditor = newSheet.querySelector('.anev-doc-editor');
    newEditor.innerHTML = '<p><br></p>';
    var pageNumDisp = newSheet.querySelector('.page-num-display');
    if (pageNumDisp) pageNumDisp.innerText = newPageNum;

    // Split content at cursor: move all following siblings into new sheet
    var currentBlock = (node.nodeType === 1 ? node : node.parentElement).closest('p, div, table, ol, ul, h1, h2, h3');
    if (currentBlock && currentBlock.parentElement === editor) {
      var nextSib = currentBlock.nextElementSibling;
      while (nextSib) {
        var toMove = nextSib;
        nextSib = nextSib.nextElementSibling;
        newEditor.appendChild(toMove);
      }
    }

    sheet.after(newSheet);
    renumberPages();
    newEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renumberPages() {
    var sheets = document.querySelectorAll('.anev-page-sheet');
    for (var i = 0; i < sheets.length; i++) {
      var s = sheets[i];
      s.setAttribute('data-page', i + 1);
      var disp = s.querySelector('.page-num-display');
      if (disp) disp.innerText = i + 1;
    }
  }

  // TABLE MANIPULATION ENGINES
  var currentTarget = null;
  document.addEventListener('contextmenu', function(e) {
    var editor = e.target.closest('.anev-doc-editor');
    if (!editor) return;

    e.preventDefault();
    currentTarget = e.target;
    var isImg = currentTarget.tagName === 'IMG';
    var isCell = !!currentTarget.closest('td, th');
    var isTable = !!currentTarget.closest('table');
    var menu = document.getElementById('contextMenu');

    var menuHtml = '';
    if (isImg) {
      menuHtml = \`
        <div class="gdocs-context-item" onclick="deleteTarget()">🗑️ Hapus Gambar / Logo</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="alignImg('center')">↔️ Rata Tengah</div>
        <div class="gdocs-context-item" onclick="alignImg('left')">⇤ Rata Kiri</div>
        <div class="gdocs-context-item" onclick="alignImg('right')">⇥ Rata Kanan</div>
      \`;
    } else if (isCell || isTable) {
      menuHtml = \`
        <div class="gdocs-context-item" onclick="addTableRow(true)">⬆️ Sisipkan Baris di Atas</div>
        <div class="gdocs-context-item" onclick="addTableRow(false)">⬇️ Sisipkan Baris di Bawah</div>
        <div class="gdocs-context-item" onclick="deleteTableRow()">❌ Hapus Baris</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="addTableCol(true)">⬅️ Sisipkan Kolom di Kiri</div>
        <div class="gdocs-context-item" onclick="addTableCol(false)">➡️ Sisipkan Kolom di Kanan</div>
        <div class="gdocs-context-item" onclick="deleteTableCol()">❌ Hapus Kolom</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="deleteActiveTable()" style="color:#dc2626;">🗑️ Hapus Tabel</div>
      \`;
    } else {
      menuHtml = \`
        <div class="gdocs-context-item" onclick="document.execCommand('cut')">✂️ Potong (Cut)</div>
        <div class="gdocs-context-item" onclick="document.execCommand('copy')">📋 Salin (Copy)</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="document.execCommand('bold')"><b>B</b> Tebal</div>
        <div class="gdocs-context-item" onclick="document.execCommand('italic')"><i>I</i> Miring</div>
        <div class="gdocs-context-item" onclick="document.execCommand('underline')"><u>U</u> Garis Bawah</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="document.execCommand('justifyFull')">≡ Rata Justify (Kanan-Kiri)</div>
        <div class="gdocs-context-item" onclick="document.execCommand('justifyLeft')">⇤ Rata Kiri</div>
        <div class="gdocs-context-item" onclick="document.execCommand('justifyCenter')">⇎ Rata Tengah</div>
        <div class="gdocs-context-item" onclick="document.execCommand('justifyRight')">⇥ Rata Kanan</div>
        <div class="gdocs-context-separator"></div>
        <div class="gdocs-context-item" onclick="syncCasData()" style="color:#2563eb;font-weight:700;">✨ Sinkronkan Data CAS</div>
      \`;
    }

    menu.innerHTML = menuHtml;
    menu.style.display = 'block';
    menu.style.left = Math.min(e.clientX, window.innerWidth - 210) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - 260) + 'px';
  });

  window.addEventListener('click', function(e) {
    var menu = document.getElementById('contextMenu');
    if (menu) menu.style.display = 'none';
  });

  function deleteTarget() { if (currentTarget) currentTarget.remove(); }
  function alignImg(align) {
    if (!currentTarget) return;
    if (align === 'center') { currentTarget.style.margin = '4px auto'; currentTarget.style.display = 'block'; }
    if (align === 'left') { currentTarget.style.margin = '4px auto 4px 0'; currentTarget.style.display = 'block'; }
    if (align === 'right') { currentTarget.style.margin = '4px 0 4px auto'; currentTarget.style.display = 'block'; }
  }

  function getActiveTable() {
    return currentTarget ? currentTarget.closest('table') : document.querySelector('.anev-table-naskah');
  }

  function addTableRow(above) {
    var table = getActiveTable();
    if (!table) return;
    var refTr = (currentTarget ? currentTarget.closest('tr') : null) || table.querySelector('tbody tr:last-child') || table.querySelector('tr:last-child');
    var cols = refTr ? refTr.children.length : 4;
    var newTr = document.createElement('tr');
    for (var i = 0; i < cols; i++) {
      var td = document.createElement('td');
      td.style.border = '1px solid #000';
      td.style.padding = '3px 5px';
      td.innerHTML = i === 0 ? '-' : '';
      newTr.appendChild(td);
    }
    if (above && refTr) refTr.before(newTr);
    else if (refTr) refTr.after(newTr);
    else table.appendChild(newTr);
  }

  function deleteTableRow() {
    var tr = currentTarget ? currentTarget.closest('tr') : null;
    if (tr && tr.parentElement.children.length > 1) tr.remove();
  }

  function addTableCol(left) {
    var table = getActiveTable();
    if (!table) return;
    var cell = currentTarget ? currentTarget.closest('td, th') : null;
    var idx = cell ? cell.cellIndex : -1;
    var rows = table.rows;
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var isH = row.firstElementChild && row.firstElementChild.tagName === 'TH';
      var newC = document.createElement(isH ? 'th' : 'td');
      newC.style.border = '1px solid #000';
      newC.style.padding = '3px 5px';
      if (isH) { newC.style.background = '#f1f5f9'; newC.innerHTML = 'Kolom Baru'; }
      else newC.innerHTML = '-';
      if (idx >= 0 && idx < row.children.length) {
        if (left) row.children[idx].before(newC);
        else row.children[idx].after(newC);
      } else row.appendChild(newC);
    }
  }

  function deleteTableCol() {
    var table = getActiveTable();
    var cell = currentTarget ? currentTarget.closest('td, th') : null;
    if (!table || !cell) return;
    var idx = cell.cellIndex;
    var rows = table.rows;
    if (rows.length > 0 && rows[0].children.length <= 1) { table.remove(); return; }
    for (var r = 0; r < rows.length; r++) {
      if (idx < rows[r].children.length) rows[r].children[idx].remove();
    }
  }

  function deleteActiveTable() {
    var table = getActiveTable();
    if (table) table.remove();
  }

  function insertNewTable() {
    var html = '<table class="anev-table-naskah"><thead><tr><th>No</th><th>Uraian / Indikator</th><th>Target</th><th>Keterangan</th></tr></thead><tbody><tr><td style="text-align:center;">1</td><td>Data baru</td><td style="text-align:center;">-</td><td>-</td></tr></tbody></table><p><br></p>';
    document.execCommand('insertHTML', false, html);
  }

  // CAS DATA SYNC ENGINE (FULL CAS REPLACEMENT)
  function syncCasData() {
    var ctx = {
      structure_level: "DAERAH",
      lokasi_satker: "JAWA TIMUR",
      organization_level: "DIREKTORAT RESERSE KRIMINAL UMUM",
      tanggal_awal: "01 September 2026",
      tanggal_akhir: "30 September 2026",
      period: "BULANAN",
      detail_period: "SEPTEMBER 2026",
      "DETAIL PERIOD": "SEPTEMBER 2026",
      "PERIOD": "BULANAN",
      "PERIODE": "SEPTEMBER 2026",
      "PERIODE-SEBELUM": "AGUSTUS 2026",
      "NAMA SATKER": "POLDA JAWA TIMUR",
      "HEAD OF ORGANIZATION LEVEL": "KAPOLDA JAWA TIMUR",
      "KBO Level": "DIRRESKRIMUM POLDA JAWA TIMUR",
      "KBO NAME": "FARMAN, S.I.K., M.H.",
      "PANGKAT": "KOMBES POL",
      "ID NRP/NIP": "98010710",
      "Location": "Surabaya",
      "dd Mmmm yyyy": "12 Oktober 2026",
      "CT": "1.420",
      "CC": "1.080",
      "CR": "76,1%",
      "CT-P1": "1.530",
      "CT-P2": "1.420",
      "CC-P1": "990",
      "CC-P2": "1.080",
      "CR-P1": "64,7%",
      "CR-P2": "76,1%",
      "SELISIH-CT": "110",
      "PERSEN-CT": "7,2%",
      "SELISIH-CR": "11,4%",
      "AGT-P1": "295",
      "AGT-P2": "295",
      "RATIO-P1": "1 : 5",
      "RATIO-P2": "1 : 5",
      "BEBAN-P1": "50%",
      "BEBAN-P2": "50%",
      "RJ-JUMLAH": "245",
      "RJ-PERSEN": "22,7%",
      "AGT": "295",
      "RATIO LP/AGT": "1 : 5",
      "BEBAN-ID": "1 : 10",
      "x": "1.420",
      "y": "76,1",
      "y %": "76,1%",
      "count: X = (KB + KT) : (KM + KP) x 100%": "X = (800 + 280) : (1.080 + 340) x 100% = 1.080 : 1.420 x 100% = 76,1%"
    };

    var walker = document.createTreeWalker(document.getElementById('pagesWorkspace'), NodeFilter.SHOW_TEXT, null, false);
    var node, textNodes = [];
    while (node = walker.nextNode()) textNodes.push(node);
    for (var i = 0; i < textNodes.length; i++) {
      var tn = textNodes[i];
      var val = tn.nodeValue;
      if (val && (val.includes("{{") || val.includes("[*") || val.includes("*["))) {
        var newVal = val;
        for (var k in ctx) {
          newVal = newVal.split("{{AUTO: " + k + "}}").join(ctx[k]);
          newVal = newVal.split("{{AUTO:" + k + "}}").join(ctx[k]);
          newVal = newVal.split("{{ AUTO: " + k + " }}").join(ctx[k]);
          newVal = newVal.split("[*" + k + "]").join(ctx[k]);
          newVal = newVal.split("*[" + k + "]").join(ctx[k]);
          newVal = newVal.split("[*" + k.toUpperCase() + "]").join(ctx[k]);
          newVal = newVal.split("*[" + k.toUpperCase() + "]").join(ctx[k]);
        }
        if (newVal !== val) tn.nodeValue = newVal;
      }
    }
  }
</script>
</body>
</html>`;

fs.writeFileSync('test_word_complete_suite.html', html, 'utf8');
console.log('test_word_complete_suite.html generated successfully!');
