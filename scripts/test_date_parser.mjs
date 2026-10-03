function parseFlexibleDate(val) {
    if (!val) return null;
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return null;
        const y = val.getUTCFullYear();
        const m = String(val.getUTCMonth() + 1).padStart(2, '0');
        const d = String(val.getUTCDate()).padStart(2, '0');
        return { dateStr: `${y}-${m}-${d}` };
    }
    if (typeof val === 'number') {
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (isNaN(date.getTime())) return null;
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const d = String(date.getUTCDate()).padStart(2, '0');
        return { dateStr: `${y}-${m}-${d}` };
    }
    const s = String(val).trim();
    if (!s) return null;

    const isoMatch = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (isoMatch) {
        const y = parseInt(isoMatch[1], 10);
        const m = parseInt(isoMatch[2], 10);
        const d = parseInt(isoMatch[3], 10);
        return { dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` };
    }

    const dmyMatch = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmyMatch) {
        const d = parseInt(dmyMatch[1], 10);
        const m = parseInt(dmyMatch[2], 10);
        const y = parseInt(dmyMatch[3], 10);
        return { dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` };
    }

    const monthNames = {
        jan: 1, januari: 1, january: 1,
        feb: 2, februari: 2, february: 2,
        mar: 3, maret: 3, march: 3,
        apr: 4, april: 4,
        mei: 5, may: 5,
        jun: 6, juni: 6, june: 6,
        jul: 7, juli: 7, july: 7,
        agu: 8, ags: 8, agustus: 8, aug: 8, august: 8,
        sep: 9, september: 9,
        okt: 10, oktober: 10, oct: 10, october: 10,
        nov: 11, november: 11,
        des: 12, desember: 12, dec: 12, december: 12
    };
    const namedMatch = s.match(/^(\d{1,2})[\s\-]+([a-zA-Z]+)[\s\-]+(\d{4})/);
    if (namedMatch) {
        const d = parseInt(namedMatch[1], 10);
        const monthStr = namedMatch[2].toLowerCase();
        const y = parseInt(namedMatch[3], 10);
        const m = monthNames[monthStr];
        if (m) {
            return { dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` };
        }
    }

    return null;
}

const tests = [
  '12 Sep 2026',
  '12-Sep-2026',
  '12 September 2026',
  '03-10-2026 17:50:35',
  '2026-10-03',
  '03/10/2026',
  new Date(),
  46277
];

tests.forEach(t => console.log(t, '=>', parseFlexibleDate(t)));
