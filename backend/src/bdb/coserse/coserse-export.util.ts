import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExcelJS = require('exceljs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfMake = require('pdfmake');

import {
    CoserseDiscoveryGroup,
    CrossEntityMatchRecord,
    CrossEntityProfileSummary
} from './dto/profile-query.dto';

export type CoserseExportFormat = 'pdf' | 'docx' | 'pptx' | 'xlsx';

export interface CoserseExportInput {
    format: CoserseExportFormat;
    queryText: string;
    groupLabel: string;
    scopeMode: string;
    actorHandle: string;
    actorRole: string;
    summary: CrossEntityProfileSummary;
    discoveryGroups: CoserseDiscoveryGroup[];
    records: CrossEntityMatchRecord[];
}

export interface CoserseExportResult {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    formatLabel: 'PDF' | 'Word' | 'PPT' | 'Excel';
}

const COSERSE_EXPORT_DISCLAIMER =
    'Dokumen internal CAS Bareskrim Polri (Coserse 1.0). Hanya untuk kepentingan kedinasan internal dan harap diverifikasi ulang terhadap dokumen sumber.';

function getRobotoFonts() {
    const robotoDir = path.join(path.dirname(require.resolve('pdfmake/package.json')), 'fonts', 'Roboto');
    return {
        Roboto: {
            normal: path.join(robotoDir, 'Roboto-Regular.ttf'),
            bold: path.join(robotoDir, 'Roboto-Medium.ttf'),
            italics: path.join(robotoDir, 'Roboto-Italic.ttf'),
            bolditalics: path.join(robotoDir, 'Roboto-MediumItalic.ttf')
        }
    };
}

export function normalizeExportFormat(raw?: string | null): CoserseExportFormat {
    const f = String(raw || 'pdf').trim().toLowerCase();
    if (f === 'docx' || f === 'doc' || f === 'word') return 'docx';
    if (f === 'pptx' || f === 'ppt' || f === 'powerpoint') return 'pptx';
    if (f === 'xlsx' || f === 'xls' || f === 'excel') return 'xlsx';
    return 'pdf';
}

export function formatLabelFor(format: CoserseExportFormat): 'PDF' | 'Word' | 'PPT' | 'Excel' {
    if (format === 'docx') return 'Word';
    if (format === 'pptx') return 'PPT';
    if (format === 'xlsx') return 'Excel';
    return 'PDF';
}

export function formatBytesReadable(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function sanitizeSlug(raw: string): string {
    const cleaned = String(raw || 'coserse')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
    return cleaned || 'temuan-cas';
}

function formatWibDate(d = new Date()): string {
    return (
        new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(d) + ' WIB'
    );
}

function escapeXml(raw: any): string {
    return String(raw ?? '')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function clipText(raw: any, max = 160): string {
    const s = String(raw ?? '-').replace(/\s+/g, ' ').trim() || '-';
    return s.length > max ? `${s.slice(0, max - 3)}...` : s;
}

function buildExportFilename(format: CoserseExportFormat, queryText: string): string {
    const stamp = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    const slug = sanitizeSlug(queryText);
    return `CAS_Coserse_${slug}_${stamp}.${format}`;
}

export async function generateCoserseExportBuffer(input: CoserseExportInput): Promise<CoserseExportResult> {
    const format = normalizeExportFormat(input.format);
    const filename = buildExportFilename(format, input.queryText);
    const printedAt = formatWibDate();
    const safeRecords = Array.isArray(input.records) ? input.records : [];
    const safeGroups = Array.isArray(input.discoveryGroups) ? input.discoveryGroups : [];

    if (format === 'xlsx') {
        const buffer = await buildXlsxBuffer(input, safeRecords, safeGroups, printedAt);
        return {
            buffer,
            filename,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            formatLabel: 'Excel'
        };
    }

    if (format === 'docx') {
        const buffer = await buildDocxBuffer(input, safeRecords, safeGroups, printedAt);
        return {
            buffer,
            filename,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            formatLabel: 'Word'
        };
    }

    if (format === 'pptx') {
        const buffer = await buildPptxBuffer(input, safeRecords, safeGroups, printedAt);
        return {
            buffer,
            filename,
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            formatLabel: 'PPT'
        };
    }

    const buffer = await buildPdfBuffer(input, safeRecords, safeGroups, printedAt);
    return {
        buffer,
        filename,
        mimeType: 'application/pdf',
        formatLabel: 'PDF'
    };
}

async function buildXlsxBuffer(
    input: CoserseExportInput,
    records: CrossEntityMatchRecord[],
    groups: CoserseDiscoveryGroup[],
    printedAt: string
): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'CAS Bareskrim Polri - Coserse 1.0';
    wb.created = new Date();

    const ws = wb.addWorksheet('Data Temuan CAS');
    ws.columns = [
        { key: 'no', width: 6 },
        { key: 'sumber', width: 24 },
        { key: 'no_lp', width: 32 },
        { key: 'tgl', width: 14 },
        { key: 'satker', width: 28 },
        { key: 'nama', width: 26 },
        { key: 'peran', width: 20 },
        { key: 'kategori', width: 26 },
        { key: 'status', width: 16 },
        { key: 'detail', width: 42 }
    ];

    ws.mergeCells('A1:J1');
    ws.getCell('A1').value = 'KEPOLISIAN NEGARA REPUBLIK INDONESIA • BARESKRIM POLRI (CAS — COSERSE 1.0)';
    ws.getCell('A1').font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2942' } };
    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    ws.getRow(1).height = 26;

    ws.mergeCells('A2:J2');
    ws.getCell('A2').value = `Kata Kunci: "${input.queryText}" | Fokus: ${input.groupLabel || 'Semua Kelompok Data'} | Scope: ${input.scopeMode} | Total Riil DB: ${Number(input.summary?.total_records || records.length).toLocaleString('id-ID')}`;
    ws.getCell('A2').font = { size: 10, bold: true, color: { argb: 'FF1E293B' } };
    ws.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

    ws.mergeCells('A3:J3');
    ws.getCell('A3').value = `Dicetak oleh: ${input.actorHandle} (${input.actorRole}) | Waktu: ${printedAt} | Sampel Ditampilkan: ${records.length} baris`;
    ws.getCell('A3').font = { size: 9, italic: true, color: { argb: 'FF475569' } };

    const headers = [
        'No',
        'Sumber Tabel',
        'Nomor LP / Ref',
        'Tanggal',
        'Satker',
        'Nama / Subjek',
        'Peran / Konteks',
        'Kategori / Kejahatan',
        'Status',
        'Detail Konteks'
    ];
    const headerRow = ws.getRow(5);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
    });
    headerRow.height = 24;

    records.slice(0, 1000).forEach((rec, idx) => {
        const row = ws.addRow({
            no: idx + 1,
            sumber: rec.sumber_tabel || '-',
            no_lp: rec.no_laporan || '-',
            tgl: rec.tgl_laporan || '-',
            satker: rec.satker_nama || '-',
            nama: rec.nama_tercatat || '-',
            peran: rec.peran_entitas || '-',
            kategori: rec.kategori_kejahatan || '-',
            status: rec.status_perkara || '-',
            detail: rec.detail_konteks || '-'
        });
        row.eachCell((cell: any, colNum: number) => {
            cell.font = { size: 9.5 };
            cell.alignment = {
                vertical: 'top',
                horizontal: colNum === 1 ? 'center' : 'left',
                wrapText: true
            };
            if (idx % 2 === 1) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
        });
    });

    ws.views = [{ state: 'frozen', ySplit: 5 }];

    const footerRow = ws.addRow([]);
    const noteCell = ws.getCell(`A${footerRow.number + 1}`);
    ws.mergeCells(`A${footerRow.number + 1}:J${footerRow.number + 1}`);
    noteCell.value = COSERSE_EXPORT_DISCLAIMER;
    noteCell.font = { italic: true, size: 8.5, color: { argb: 'FF64748B' } };

    // Second sheet: Ringkasan Kelompok Temuan (Data A, Data B, dst)
    const wsGroup = wb.addWorksheet('Ringkasan Kelompok Data');
    wsGroup.columns = [
        { key: 'group_id', width: 14 },
        { key: 'label', width: 38 },
        { key: 'source_table', width: 28 },
        { key: 'total_count', width: 16 },
        { key: 'breakdown', width: 46 }
    ];
    wsGroup.addRow(['Kelompok', 'Label Konteks', 'Sumber Tabel DB', 'Total Temuan Riil', 'Rincian']);
    const gHeader = wsGroup.getRow(1);
    gHeader.eachCell((cell: any) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2942' } };
    });
    for (const g of groups) {
        const bd = g.breakdown
            ? Object.entries(g.breakdown)
                  .map(([k, v]) => `${k}: ${Number(v).toLocaleString('id-ID')}`)
                  .join(' | ')
            : '-';
        wsGroup.addRow({
            group_id: g.group_id,
            label: g.label,
            source_table: g.source_table,
            total_count: g.total_count,
            breakdown: bd
        });
    }

    const rawBuf = await wb.xlsx.writeBuffer();
    return Buffer.from(rawBuf);
}

async function buildPdfBuffer(
    input: CoserseExportInput,
    records: CrossEntityMatchRecord[],
    groups: CoserseDiscoveryGroup[],
    printedAt: string
): Promise<Buffer> {
    pdfMake.setFonts(getRobotoFonts());
    pdfMake.setLocalAccessPolicy(() => true);

    const groupRows: any[] = [
        [
            { text: 'Kelompok', bold: true, fillColor: '#0f2942', color: '#ffffff', fontSize: 8.5 },
            { text: 'Konteks / Modul', bold: true, fillColor: '#0f2942', color: '#ffffff', fontSize: 8.5 },
            { text: 'Tabel Sumber', bold: true, fillColor: '#0f2942', color: '#ffffff', fontSize: 8.5 },
            { text: 'Total Riil DB', bold: true, fillColor: '#0f2942', color: '#ffffff', fontSize: 8.5, alignment: 'right' }
        ],
        ...groups.map((g, idx) => [
            { text: g.group_id, bold: true, fontSize: 8, fillColor: idx % 2 ? '#f8fafc' : '#ffffff' },
            { text: g.label, fontSize: 8, fillColor: idx % 2 ? '#f8fafc' : '#ffffff' },
            { text: g.source_table, fontSize: 8, fillColor: idx % 2 ? '#f8fafc' : '#ffffff' },
            { text: Number(g.total_count || 0).toLocaleString('id-ID'), fontSize: 8, alignment: 'right', fillColor: idx % 2 ? '#f8fafc' : '#ffffff' }
        ])
    ];

    const limited = records.slice(0, 120);
    const dataBody: any[] = [
        [
            { text: 'No', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Nomor LP / Ref', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Tgl', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Satker', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Nama / Subjek', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Peran / Konteks', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Kategori / Status', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 },
            { text: 'Detail Konteks', bold: true, fillColor: '#1e3a5f', color: '#ffffff', fontSize: 8 }
        ],
        ...limited.map((r, idx) => {
            const bg = idx % 2 ? '#f8fafc' : '#ffffff';
            return [
                { text: String(idx + 1), fontSize: 7.5, alignment: 'center', fillColor: bg },
                { text: clipText(r.no_laporan, 55), fontSize: 7.5, fillColor: bg },
                { text: clipText(r.tgl_laporan, 18), fontSize: 7.5, fillColor: bg },
                { text: clipText(r.satker_nama, 36), fontSize: 7.5, fillColor: bg },
                { text: clipText(r.nama_tercatat || '-', 36), fontSize: 7.5, fillColor: bg },
                { text: clipText(r.peran_entitas, 26), fontSize: 7.5, fillColor: bg },
                { text: `${clipText(r.kategori_kejahatan, 24)} (${clipText(r.status_perkara, 16)})`, fontSize: 7.5, fillColor: bg },
                { text: clipText(r.detail_konteks, 85), fontSize: 7.5, fillColor: bg }
            ];
        })
    ];

    const content: any[] = [
        {
            table: {
                widths: ['*'],
                body: [
                    [
                        {
                            text: 'KEPOLISIAN NEGARA REPUBLIK INDONESIA • BARESKRIM POLRI',
                            bold: true,
                            fontSize: 12,
                            color: '#ffffff',
                            fillColor: '#0f2942',
                            margin: [8, 6, 8, 2]
                        }
                    ],
                    [
                        {
                            text: 'LAPORAN PENELUSURAN DATABASE OPERASIONAL CAS (COSERSE 1.0)',
                            fontSize: 9.5,
                            color: '#e2e8f0',
                            fillColor: '#1e3a5f',
                            margin: [8, 2, 8, 6]
                        }
                    ]
                ]
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 8]
        },
        {
            columns: [
                { text: `Kata Kunci: "${input.queryText}"`, bold: true, fontSize: 9 },
                { text: `Fokus: ${input.groupLabel || 'Semua Kelompok'}`, fontSize: 9 },
                { text: `Total Riil: ${Number(input.summary?.total_records || records.length).toLocaleString('id-ID')} | Scope: ${input.scopeMode}`, fontSize: 9, alignment: 'right' }
            ],
            margin: [0, 0, 0, 2]
        },
        {
            text: `Dicetak oleh: ${input.actorHandle} (${input.actorRole}) pada ${printedAt} • Menampilkan ${limited.length} dari ${records.length} baris sampel teratas`,
            fontSize: 8,
            color: '#475569',
            margin: [0, 0, 0, 8]
        }
    ];

    if (groups.length > 0) {
        content.push(
            { text: 'Ringkasan Kelompok Temuan Database', bold: true, fontSize: 9.5, margin: [0, 2, 0, 4] },
            {
                table: {
                    headerRows: 1,
                    widths: [65, '*', 150, 85],
                    body: groupRows
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 10]
            }
        );
    }

    content.push(
        { text: 'Rincian Data Temuan Operasional', bold: true, fontSize: 9.5, margin: [0, 2, 0, 4] },
        {
            table: {
                headerRows: 1,
                widths: [22, 125, 48, 88, 82, 65, 80, '*'],
                body: dataBody
            },
            layout: {
                hLineWidth: () => 0.4,
                vLineWidth: () => 0.4,
                hLineColor: () => '#cbd5e1',
                vLineColor: () => '#e2e8f0'
            }
        },
        {
            text: `\nCatatan: ${COSERSE_EXPORT_DISCLAIMER}`,
            fontSize: 7.5,
            italics: true,
            color: '#64748b'
        }
    );

    const docDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [24, 24, 24, 30],
        defaultStyle: { font: 'Roboto', fontSize: 8.5, color: '#0f172a' },
        footer: (currentPage: number, pageCount: number) => ({
            columns: [
                { text: 'CAS Bareskrim Polri • Internal Only', fontSize: 7.5, color: '#64748b', margin: [24, 0, 0, 0] },
                { text: `Halaman ${currentPage} dari ${pageCount}`, fontSize: 7.5, color: '#64748b', alignment: 'right', margin: [0, 0, 24, 0] }
            ]
        }),
        content
    };

    const rawPdf = await pdfMake.createPdf(docDefinition).getBuffer();
    return Buffer.from(rawPdf);
}

async function buildDocxBuffer(
    input: CoserseExportInput,
    records: CrossEntityMatchRecord[],
    groups: CoserseDiscoveryGroup[],
    printedAt: string
): Promise<Buffer> {
    const zip = new JSZip();

    zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
    );

    zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
    );

    const mkParagraph = (text: string, opts?: { bold?: boolean; sizeHalfPt?: number; color?: string; spaceAfter?: number }) => {
        const bTag = opts?.bold ? '<w:b/>' : '';
        const sz = opts?.sizeHalfPt || 20;
        const color = opts?.color || '0F172A';
        const after = opts?.spaceAfter ?? 80;
        return `<w:p><w:pPr><w:spacing w:after="${after}"/></w:pPr><w:r><w:rPr>${bTag}<w:color w:val="${color}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
    };

    const mkCell = (text: string, widthDxa: number, opts?: { header?: boolean; shade?: string }) => {
        const fill = opts?.header ? '0F2942' : opts?.shade || 'FFFFFF';
        const color = opts?.header ? 'FFFFFF' : '0F172A';
        const bold = opts?.header ? '<w:b/>' : '';
        return `<w:tc><w:tcPr><w:tcW w:w="${widthDxa}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/></w:tcPr><w:p><w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr><w:r><w:rPr>${bold}<w:color w:val="${color}"/><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p></w:tc>`;
    };

    const tblBorders = `<w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/></w:tblBorders>`;

    let groupTableXml = '';
    if (groups.length > 0) {
        const gRows = [
            `<w:tr><w:trPr><w:tblHeader/></w:trPr>${mkCell('Kelompok', 1800, { header: true })}${mkCell('Konteks Temuan', 5600, { header: true })}${mkCell('Tabel Sumber', 4200, { header: true })}${mkCell('Total Riil', 2400, { header: true })}</w:tr>`,
            ...groups.map((g, idx) => {
                const shade = idx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
                return `<w:tr>${mkCell(g.group_id, 1800, { shade })}${mkCell(g.label, 5600, { shade })}${mkCell(g.source_table, 4200, { shade })}${mkCell(Number(g.total_count || 0).toLocaleString('id-ID'), 2400, { shade })}</w:tr>`;
            })
        ].join('');
        groupTableXml =
            mkParagraph('Ringkasan Kelompok Temuan Database', { bold: true, sizeHalfPt: 21, color: '0F2942', spaceAfter: 60 }) +
            `<w:tbl><w:tblPr><w:tblW w:w="14000" w:type="dxa"/>${tblBorders}</w:tblPr>${gRows}</w:tbl>` +
            mkParagraph('', { spaceAfter: 100 });
    }

    const colWidths = [700, 2600, 1200, 2000, 2000, 1500, 1800, 3200];
    const limited = records.slice(0, 120);
    const dataRowsXml = [
        `<w:tr><w:trPr><w:tblHeader/></w:trPr>${[
            mkCell('No', colWidths[0], { header: true }),
            mkCell('Nomor LP / Ref', colWidths[1], { header: true }),
            mkCell('Tanggal', colWidths[2], { header: true }),
            mkCell('Satker', colWidths[3], { header: true }),
            mkCell('Nama / Subjek', colWidths[4], { header: true }),
            mkCell('Peran / Konteks', colWidths[5], { header: true }),
            mkCell('Kategori & Status', colWidths[6], { header: true }),
            mkCell('Detail Konteks', colWidths[7], { header: true })
        ].join('')}</w:tr>`,
        ...limited.map((r, idx) => {
            const shade = idx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
            return `<w:tr>${[
                mkCell(String(idx + 1), colWidths[0], { shade }),
                mkCell(clipText(r.no_laporan, 60), colWidths[1], { shade }),
                mkCell(clipText(r.tgl_laporan, 20), colWidths[2], { shade }),
                mkCell(clipText(r.satker_nama, 42), colWidths[3], { shade }),
                mkCell(clipText(r.nama_tercatat || '-', 42), colWidths[4], { shade }),
                mkCell(clipText(r.peran_entitas, 28), colWidths[5], { shade }),
                mkCell(`${clipText(r.kategori_kejahatan, 24)} (${clipText(r.status_perkara, 16)})`, colWidths[6], { shade }),
                mkCell(clipText(r.detail_konteks, 95), colWidths[7], { shade })
            ].join('')}</w:tr>`;
        })
    ].join('');

    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${mkParagraph('KEPOLISIAN NEGARA REPUBLIK INDONESIA • BARESKRIM POLRI', { bold: true, sizeHalfPt: 26, color: '0F2942', spaceAfter: 40 })}
    ${mkParagraph('LAPORAN PENELUSURAN DATABASE OPERASIONAL CAS (COSERSE 1.0)', { bold: true, sizeHalfPt: 21, color: '1E3A5F', spaceAfter: 100 })}
    ${mkParagraph(`Kata Kunci: "${input.queryText}" | Fokus Kelompok: ${input.groupLabel || 'Semua Kelompok'} | Total Riil DB: ${Number(input.summary?.total_records || records.length).toLocaleString('id-ID')}`, { bold: true, sizeHalfPt: 19, spaceAfter: 40 })}
    ${mkParagraph(`Operator: ${input.actorHandle} (${input.actorRole}) | Scope: ${input.scopeMode} | Waktu Cetak: ${printedAt}`, { sizeHalfPt: 18, color: '475569', spaceAfter: 120 })}
    ${groupTableXml}
    ${mkParagraph(`Rincian Data Temuan Operasional (Menampilkan ${limited.length} dari ${records.length} baris sampel)`, { bold: true, sizeHalfPt: 21, color: '0F2942', spaceAfter: 60 })}
    <w:tbl><w:tblPr><w:tblW w:w="15000" w:type="dxa"/>${tblBorders}</w:tblPr>${dataRowsXml}</w:tbl>
    ${mkParagraph(COSERSE_EXPORT_DISCLAIMER, { sizeHalfPt: 16, color: '64748B', spaceAfter: 40 })}
    <w:sectPr>
      <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="400" w:footer="400" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    zip.file('word/document.xml', docXml);
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

async function buildPptxBuffer(
    input: CoserseExportInput,
    records: CrossEntityMatchRecord[],
    groups: CoserseDiscoveryGroup[],
    printedAt: string
): Promise<Buffer> {
    const zip = new JSZip();

    const rowsPerSlide = 8;
    const capped = records.slice(0, 80);
    const dataChunks: CrossEntityMatchRecord[][] = [];
    for (let i = 0; i < capped.length; i += rowsPerSlide) {
        dataChunks.push(capped.slice(i, i + rowsPerSlide));
    }
    if (dataChunks.length === 0) dataChunks.push([]);

    const totalSlides = 1 + dataChunks.length;

    const slideOverrides = Array.from({ length: totalSlides }, (_, idx) =>
        `<Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    ).join('\n  ');

    zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  ${slideOverrides}
</Types>`
    );

    zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
    );

    const presRels = [
        `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>`,
        `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>`,
        ...Array.from({ length: totalSlides }, (_, idx) =>
            `<Relationship Id="rId${idx + 3}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>`
        )
    ].join('\n  ');

    zip.file(
        'ppt/_rels/presentation.xml.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${presRels}
</Relationships>`
    );

    const sldIdLst = Array.from({ length: totalSlides }, (_, idx) =>
        `<p:sldId id="${256 + idx}" r:id="rId${idx + 3}"/>`
    ).join('');

    zip.file(
        'ppt/presentation.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>${sldIdLst}</p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
    );

    zip.file(
        'ppt/theme/theme1.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Bareskrim CAS">
  <a:themeElements>
    <a:clrScheme name="Bareskrim">
      <a:dk1><a:srgbClr val="0F172A"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="0F2942"/></a:dk2>
      <a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="1E3A5F"/></a:accent1>
      <a:accent2><a:srgbClr val="D97706"/></a:accent2>
      <a:accent3><a:srgbClr val="0284C7"/></a:accent3>
      <a:accent4><a:srgbClr val="16A34A"/></a:accent4>
      <a:accent5><a:srgbClr val="DC2626"/></a:accent5>
      <a:accent6><a:srgbClr val="64748B"/></a:accent6>
      <a:hlink><a:srgbClr val="0284C7"/></a:hlink>
      <a:folHlink><a:srgbClr val="475569"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Calibri">
      <a:majorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
      <a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office">
      <a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>`
    );

    zip.file(
        'ppt/slideMasters/_rels/slideMaster1.xml.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`
    );

    zip.file(
        'ppt/slideMasters/slideMaster1.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>`
    );

    zip.file(
        'ppt/slideLayouts/_rels/slideLayout1.xml.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`
    );

    zip.file(
        'ppt/slideLayouts/slideLayout1.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>`
    );

    const mkTextBox = (id: number, name: string, x: number, y: number, w: number, h: number, text: string, opts?: { sizePt?: number; bold?: boolean; color?: string; fill?: string }) => {
        const sz = (opts?.sizePt || 12) * 100;
        const boldAttr = opts?.bold ? ' b="1"' : '';
        const fillXml = opts?.fill ? `<a:solidFill><a:srgbClr val="${opts.fill}"/></a:solidFill>` : '<a:noFill/>';
        const color = opts?.color || '0F172A';
        return `<p:sp>
  <p:nvSpPr><p:cNvPr id="${id}" name="${escapeXml(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>${fillXml}</p:spPr>
  <p:txBody><a:bodyPr wrap="square" lIns="120000" rIns="120000" tIns="60000" bIns="60000"/><a:lstStyle/><a:p><a:r><a:rPr lang="id-ID" sz="${sz}"${boldAttr}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:rPr><a:t>${escapeXml(text)}</a:t></a:r></a:p></p:txBody>
</p:sp>`;
    };

    const mkTableCell = (text: string, opts?: { header?: boolean; fill?: string; sizePt?: number }) => {
        const sz = (opts?.sizePt || (opts?.header ? 10 : 9)) * 100;
        const fill = opts?.header ? '0F2942' : opts?.fill || 'FFFFFF';
        const color = opts?.header ? 'FFFFFF' : '0F172A';
        const b = opts?.header ? ' b="1"' : '';
        return `<a:tc><a:txBody><a:bodyPr wrap="square"/><a:lstStyle/><a:p><a:r><a:rPr lang="id-ID" sz="${sz}"${b}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:rPr><a:t>${escapeXml(text)}</a:t></a:r></a:p></a:txBody><a:tcPr marL="60000" marR="60000" marT="40000" marB="40000"><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill></a:tcPr></a:tc>`;
    };

    const wrapSlide = (shapesXml: string) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapesXml}</p:spTree></p:cSld>
</p:sld>`;

    const slideRelXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`;

    // Slide 1: Executive Summary & Discovery Groups
    const groupCols = [1400000, 4400000, 3400000, 2100000];
    const groupTblRows = [
        `<a:tr h="380000">${mkTableCell('Kelompok', { header: true })}${mkTableCell('Konteks Temuan Database', { header: true })}${mkTableCell('Sumber Tabel', { header: true })}${mkTableCell('Total Riil DB', { header: true })}</a:tr>`,
        ...(groups.length ? groups.slice(0, 8) : [{ group_id: 'Data A', label: 'Hasil Pencarian Aktif', source_table: 'bdb_laporan_polisi', total_count: records.length }]).map((g, idx) => {
            const fill = idx % 2 === 1 ? 'F1F5F9' : 'FFFFFF';
            return `<a:tr h="340000">${mkTableCell(g.group_id, { fill })}${mkTableCell(clipText(g.label, 65), { fill })}${mkTableCell(g.source_table, { fill })}${mkTableCell(Number(g.total_count || 0).toLocaleString('id-ID'), { fill })}</a:tr>`;
        })
    ].join('');

    const slide1Table = `<p:graphicFrame>
  <p:nvGraphicFramePr><p:cNvPr id="5" name="GroupTable"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>
  <p:xfrm><a:off x="450000" y="2100000"/><a:ext cx="11300000" cy="3800000"/></p:xfrm>
  <a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid>${groupCols.map((w) => `<a:gridCol w="${w}"/>`).join('')}</a:tblGrid>${groupTblRows}</a:tbl></a:graphicData></a:graphic>
</p:graphicFrame>`;

    zip.file('ppt/slides/_rels/slide1.xml.rels', slideRelXml);
    zip.file(
        'ppt/slides/slide1.xml',
        wrapSlide(
            mkTextBox(2, 'Header', 0, 0, 12192000, 950000, 'BARESKRIM POLRI • CAS COSERSE 1.0 — RINGKASAN PENELUSURAN DATABASE', {
                sizePt: 18,
                bold: true,
                color: 'FFFFFF',
                fill: '0F2942'
            }) +
                mkTextBox(
                    3,
                    'Meta',
                    450000,
                    1100000,
                    11300000,
                    850000,
                    `Kata Kunci: "${input.queryText}" | Fokus: ${input.groupLabel || 'Semua Kelompok'} | Total Riil: ${Number(input.summary?.total_records || records.length).toLocaleString('id-ID')} | Dicetak: ${input.actorHandle} (${printedAt})`,
                    { sizePt: 12, bold: true, color: '1E3A5F', fill: 'E2E8F0' }
                ) +
                slide1Table +
                mkTextBox(6, 'Footer', 450000, 6250000, 11300000, 420000, COSERSE_EXPORT_DISCLAIMER, {
                    sizePt: 9,
                    color: '64748B'
                })
        )
    );

    // Slide 2..N: Paginated Data Tables
    const dataCols = [500000, 2300000, 950000, 1800000, 1800000, 1250000, 2700000];
    dataChunks.forEach((chunk, cIdx) => {
        const sNum = cIdx + 2;
        const tRows = [
            `<a:tr h="360000">${[
                mkTableCell('No', { header: true }),
                mkTableCell('Nomor LP / Ref', { header: true }),
                mkTableCell('Tanggal', { header: true }),
                mkTableCell('Satker', { header: true }),
                mkTableCell('Nama / Subjek', { header: true }),
                mkTableCell('Peran', { header: true }),
                mkTableCell('Detail Konteks', { header: true })
            ].join('')}</a:tr>`,
            ...chunk.map((r, rIdx) => {
                const absNo = cIdx * rowsPerSlide + rIdx + 1;
                const fill = rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
                return `<a:tr h="520000">${[
                    mkTableCell(String(absNo), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.no_laporan, 45), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.tgl_laporan, 16), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.satker_nama, 32), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.nama_tercatat || '-', 32), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.peran_entitas, 22), { fill, sizePt: 8.5 }),
                    mkTableCell(clipText(r.detail_konteks, 65), { fill, sizePt: 8.5 })
                ].join('')}</a:tr>`;
            })
        ].join('');

        const dataTbl = `<p:graphicFrame>
  <p:nvGraphicFramePr><p:cNvPr id="5" name="DataTable"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>
  <p:xfrm><a:off x="450000" y="1050000"/><a:ext cx="11300000" cy="5100000"/></p:xfrm>
  <a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid>${dataCols.map((w) => `<a:gridCol w="${w}"/>`).join('')}</a:tblGrid>${tRows}</a:tbl></a:graphicData></a:graphic>
</p:graphicFrame>`;

        zip.file(`ppt/slides/_rels/slide${sNum}.xml.rels`, slideRelXml);
        zip.file(
            `ppt/slides/slide${sNum}.xml`,
            wrapSlide(
                mkTextBox(
                    2,
                    'SlideHeader',
                    0,
                    0,
                    12192000,
                    820000,
                    `RINCIAN DATA TEMUAN (${input.groupLabel || 'SEMUA KELOMPOK'}) — HALAMAN ${sNum - 1}/${dataChunks.length}`,
                    { sizePt: 15, bold: true, color: 'FFFFFF', fill: '1E3A5F' }
                ) +
                    dataTbl +
                    mkTextBox(
                        6,
                        'SlideFooter',
                        450000,
                        6300000,
                        11300000,
                        360000,
                        `CAS Bareskrim Polri • Kata Kunci: "${input.queryText}" • ${printedAt}`,
                        { sizePt: 9, color: '64748B' }
                    )
            )
        );
    });

    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
