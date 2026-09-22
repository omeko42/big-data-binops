/**
 * Worker thread terpisah utk membangun workbook ExcelJS & wb.xlsx.writeBuffer() -- sama spt
 * pdf-render.worker.ts, proses ini sinkron & CPU-bound (~2 detik utk export penuh Kinerja Perkara)
 * sehingga kalau dijalankan di main thread ikut memblok event loop & request user lain.
 * Data yg diterima via workerData (`headerPlan`, `valueRows`) sudah plain data hasil render di
 * main thread, aman di-structured-clone lewat batas worker.
 */
import { parentPort, workerData } from 'worker_threads';
import * as ExcelJS from 'exceljs';

type HeaderPlanCol = { key: string; group: string; sub: string; width: number };

(async () => {
    try {
        const headerPlan: HeaderPlanCol[] = workerData.headerPlan;
        const valueRows: Record<string, string | number>[] = workerData.valueRows;

        const wb = new ExcelJS.Workbook();
        wb.creator = 'BDB';
        const sheet = wb.addWorksheet('Kinerja Perkara');
        sheet.columns = headerPlan.map((c) => ({ key: c.key, width: c.width }));

        const row1 = sheet.getRow(1);
        const row2 = sheet.getRow(2);
        let col = 1;
        for (let i = 0; i < headerPlan.length; ) {
            const c = headerPlan[i];
            let span = 1;
            while (i + span < headerPlan.length && headerPlan[i + span].group === c.group) span++;
            row1.getCell(col).value = c.group;
            if (span > 1) {
                sheet.mergeCells(1, col, 1, col + span - 1);
                for (let k = 0; k < span; k++) row2.getCell(col + k).value = headerPlan[i + k].sub;
            } else {
                sheet.mergeCells(1, col, 2, col);
            }
            col += span;
            i += span;
        }
        [row1, row2].forEach((row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8935C' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            });
        });
        row1.commit();
        row2.commit();

        for (const values of valueRows) sheet.addRow(values);
        sheet.views = [{ state: 'frozen', ySplit: 2 }];

        const buf = await wb.xlsx.writeBuffer();
        parentPort!.postMessage({ buf: Buffer.from(buf) });
    } catch (e: any) {
        parentPort!.postMessage({ error: e?.message || String(e) });
    }
})();
