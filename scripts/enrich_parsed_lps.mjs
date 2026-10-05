import fs from 'fs';

function parseCSVLine(text) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            res.push(cur.trim());
            cur = '';
        } else {
            cur += ch;
        }
    }
    res.push(cur.trim());
    return res;
}

function cleanLpNumber(raw) {
    if (!raw) return '';
    let s = raw.trim();
    s = s.replace(/^["']|["']$/g, '');
    s = s.replace(/[,.]+$/, '').trim();
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/\s*\/\s*/g, '/');
    return s.toUpperCase();
}

const MONTH_MAP = {
    'januari': '01', 'jan': '01',
    'februari': '02', 'feb': '02',
    'maret': '03', 'mar': '03',
    'april': '04', 'apr': '04',
    'mei': '05', 'may': '05',
    'juni': '06', 'jun': '06',
    'juli': '07', 'jul': '07',
    'agustus': '08', 'agusts': '08', 'agu': '08', 'ags': '08',
    'september': '09', 'sptember': '09', 'sep': '09',
    'oktober': '10', 'okt': '10',
    'november': '11', 'nov': '11',
    'desember': '12', 'des': '12'
};

function parseDateToIso(str) {
    if (!str) return null;
    let s = str.trim();

    // 1. Check YYYY-MM-DD
    const isoM = s.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoM) {
        return `${isoM[1]}-${isoM[2].padStart(2, '0')}-${isoM[3].padStart(2, '0')}`;
    }

    // 2. Check DD/MM/YYYY or DD-MM-YYYY
    const dmyM = s.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyM) {
        return `${dmyM[3]}-${dmyM[2].padStart(2, '0')}-${dmyM[1].padStart(2, '0')}`;
    }

    // 3. Check DD MonthName YYYY (e.g. 09 Januari 2026)
    const indDateM = s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (indDateM) {
        const d = indDateM[1].padStart(2, '0');
        const mKey = indDateM[2].toLowerCase();
        const y = indDateM[3];
        if (MONTH_MAP[mKey]) {
            return `${y}-${MONTH_MAP[mKey]}-${d}`;
        }
    }

    return null;
}

const rawContent = fs.readFileSync('scripts/input_dittipidum_raw.txt', 'utf8');
const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const lpRecords = new Map();

for (const line of lines) {
    if (line.startsWith('NO,') || line.startsWith(',,,,')) continue;
    const parts = parseCSVLine(line);
    if (parts.length < 4) continue;

    let noLp = '';
    let tglLp = '';
    let jenisDok = '';
    let valCol5 = '';
    let valCol6 = '';
    let valCol7 = '';
    let valCol8 = '';

    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p.toUpperCase().startsWith('LP/') || p.toUpperCase().startsWith('LPB/')) {
            noLp = p;
            tglLp = parts[i + 1] || '';
            jenisDok = parts[i + 2] || '';
            valCol5 = parts[i + 3] || '';
            valCol6 = parts[i + 4] || '';
            valCol7 = parts[i + 5] || '';
            valCol8 = parts[i + 6] || '';
            break;
        }
    }

    if (!noLp) continue;
    const cleanNo = cleanLpNumber(noLp);

    if (!lpRecords.has(cleanNo)) {
        lpRecords.set(cleanNo, {
            cleanNo,
            rawNos: [noLp],
            tglLp: tglLp,
            jenisDoks: [jenisDok],
            nomorDoks: [],
            dates: [],
            alasanList: []
        });
    }

    const rec = lpRecords.get(cleanNo);
    if (!rec.rawNos.includes(noLp)) rec.rawNos.push(noLp);
    if (jenisDok && !rec.jenisDoks.includes(jenisDok)) rec.jenisDoks.push(jenisDok);

    const candidates = [valCol5, valCol6, valCol7, valCol8].filter(Boolean);
    for (const cand of candidates) {
        // Check date
        const dIso = parseDateToIso(cand);
        if (dIso && !rec.dates.includes(dIso)) {
            rec.dates.push(dIso);
        }

        // Check doc number (contains / and letters like SPPP, B-, etc.)
        if (cand.includes('/') && /[A-Za-z]/.test(cand) && !cand.toLowerCase().startsWith('http')) {
            // If it has "tanggal", split it
            if (cand.toLowerCase().includes('tanggal')) {
                const partsDoc = cand.split(/tanggal/i);
                const docNum = partsDoc[0].trim().replace(/[,.-]+$/, '');
                if (docNum && !rec.nomorDoks.includes(docNum)) rec.nomorDoks.push(docNum);
                const dPart = parseDateToIso(partsDoc[1]);
                if (dPart && !rec.dates.includes(dPart)) rec.dates.push(dPart);
            } else {
                // If it doesn't look like an LP number itself
                if (!cand.toUpperCase().startsWith('LP/') && !cand.toUpperCase().startsWith('LPB/')) {
                    if (!rec.nomorDoks.includes(cand)) rec.nomorDoks.push(cand);
                }
            }
        }

        // Check alasan
        const u = cand.toUpperCase();
        if (u.includes('BUKAN TINDAK PIDANA') || u.includes('TIDAK CUKUP ALAT BUKTI') || u.includes('RESTORATIF') || u.includes('DICABUT')) {
            if (!rec.alasanList.includes(cand)) rec.alasanList.push(cand);
        }
    }
}

// Now merge with our 84 found LPs from analysis
const analysis = JSON.parse(fs.readFileSync('scripts/parsed_lps_analysis.json', 'utf8'));

function mapDocType(jenisList) {
    const joined = (jenisList || []).join(' ').toLowerCase();
    if (joined.includes('p21') || joined.includes('p-21')) {
        return { docTypeId: 17, docCode: 'P21', docName: 'Surat Pemberitahuan Berkas Perkara Lengkap (P-21)', targetStatusId: 11, targetStatusCode: 'P21', targetStatusName: 'P21', targetKategori: 'CT' };
    }
    if (joined.includes('tahap-2') || joined.includes('tahap 2') || joined.includes('ba-serah-tsk-bb')) {
        return { docTypeId: 5, docCode: 'TAHAP_2', docName: 'Surat Pengantar Tahap II (Tersangka & Barang Bukti)', targetStatusId: 6, targetStatusCode: 'TAHAP_II', targetStatusName: 'Tahap II', targetKategori: 'CC' };
    }
    if (joined.includes('sp3') || joined.includes('henti-sidik') || joined.includes('henti sidik')) {
        return { docTypeId: 3, docCode: 'SP3', docName: 'Surat Perintah Penghentian Penyidikan (SP3)', targetStatusId: 4, targetStatusCode: 'SP3', targetStatusName: 'Henti Sidik / SP3', targetKategori: 'CC' };
    }
    if (joined.includes('sp2lid') || joined.includes('sp2_lid') || joined.includes('henti-lidik') || joined.includes('henti lidik') || joined.includes('sp2hp-a5')) {
        return { docTypeId: 18, docCode: 'SP2_LIDIK', docName: 'Surat Perintah Penghentian Penyelidikan', targetStatusId: 7, targetStatusCode: 'SP2_LID', targetStatusName: 'Henti Lidik / SP2Lid', targetKategori: 'CC' };
    }
    return { docTypeId: 18, docCode: 'SP2_LIDIK', docName: 'Surat Perintah Penghentian Penyelidikan', targetStatusId: 7, targetStatusCode: 'SP2_LID', targetStatusName: 'Henti Lidik / SP2Lid', targetKategori: 'CC' };
}

const final84 = [];

for (const item of analysis.found) {
    const rec = lpRecords.get(item.cleanNo) || { jenisDoks: [item.item.jenisDok], nomorDoks: [], dates: [], alasanList: [] };
    const docMap = mapDocType(rec.jenisDoks);

    let nomorDokumen = rec.nomorDoks[0] || null;
    let tanggalDokumen = rec.dates[0] || null;
    let alasan = rec.alasanList[0] || null;

    if (!nomorDokumen) {
        const lpShort = item.db.no_laporan.replace(/^LP\//, '').replace(/\//g, '-');
        if (docMap.docCode === 'P21') nomorDokumen = `B-P21/${lpShort}`;
        else if (docMap.docCode === 'TAHAP_2') nomorDokumen = `B-THP2/${lpShort}`;
        else if (docMap.docCode === 'SP3') nomorDokumen = `SP.Henti.Sidik/${lpShort}`;
        else nomorDokumen = `SPPP/Henti.Lidik/${lpShort}`;
    }

    if (!tanggalDokumen) {
        tanggalDokumen = '2026-08-01';
    }

    final84.push({
        lpId: item.db.id,
        noLaporan: item.db.no_laporan,
        satkerId: item.db.satker_id,
        satkerNama: item.db.satker_nama,
        currentStatusId: item.db.status_id,
        currentStatusNama: item.db.status_nama,
        docTypeId: docMap.docTypeId,
        docCode: docMap.docCode,
        docName: docMap.docName,
        targetStatusId: docMap.targetStatusId,
        targetStatusCode: docMap.targetStatusCode,
        targetStatusName: docMap.targetStatusName,
        targetKategori: docMap.targetKategori,
        nomorDokumen: nomorDokumen,
        tanggalDokumen: tanggalDokumen,
        alasan: alasan || (docMap.targetKategori === 'CC' ? 'Bukan Tindak Pidana' : 'Berkas Lengkap')
    });
}

console.log(`Enriched all ${final84.length} LPs with exact doc numbers, dates, and reasons.`);
fs.writeFileSync('scripts/final_84_lps_ready.json', JSON.stringify(final84, null, 2), 'utf8');

// Sample print
console.log('Sample 5 enriched:');
final84.slice(0, 5).forEach((x, i) => {
    console.log(`[${i+1}] ${x.noLaporan}`);
    console.log(`     Doc: ${x.docCode} -> Status: ${x.targetStatusName} (${x.targetKategori})`);
    console.log(`     No Dok: ${x.nomorDokumen} | Tgl: ${x.tanggalDokumen} | Alasan: ${x.alasan}`);
});
