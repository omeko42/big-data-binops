/**
 * Worker thread terpisah utk pdfMake.createPdf().getBuffer() -- layout PDF ribuan baris x puluhan
 * kolom murni CPU-bound & sinkron di dalam pdfmake (~15 detik utk export penuh Kinerja Perkara),
 * kalau dijalankan di main thread akan freeze SELURUH aplikasi (semua request lain) selama itu.
 * `docDefinition` yg diterima via workerData sudah plain data (hasil render string), jadi aman
 * di-structured-clone lewat batas worker.
 */
import { parentPort, workerData } from 'worker_threads';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfMake = require('pdfmake');

const ROBOTO_DIR = path.join(path.dirname(require.resolve('pdfmake/package.json')), 'fonts', 'Roboto');
const PDF_FONTS = {
    Roboto: {
        normal: path.join(ROBOTO_DIR, 'Roboto-Regular.ttf'),
        bold: path.join(ROBOTO_DIR, 'Roboto-Medium.ttf'),
        italics: path.join(ROBOTO_DIR, 'Roboto-Italic.ttf'),
        bolditalics: path.join(ROBOTO_DIR, 'Roboto-MediumItalic.ttf')
    }
};

(async () => {
    try {
        pdfMake.setFonts(PDF_FONTS);
        pdfMake.setLocalAccessPolicy(() => true);
        const buf: Buffer = await pdfMake.createPdf(workerData.docDefinition).getBuffer();
        parentPort!.postMessage({ buf });
    } catch (e: any) {
        parentPort!.postMessage({ error: e?.message || String(e) });
    }
})();
