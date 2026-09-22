import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
    async excel(file: Express.Multer.File, sheetName: string) {
        // Header kolom yang ingin diambil
        const headersToInclude = [
            'NOMOR DAN TANGAL',
            'PASAL',
            'URAIAN KEJADIAN',
            'PELAPOR',
            'TERSANGKA',
            'BB',
            'TUJUAN PENYALURAN',
            'BUKTI PENYALURAN',
            'MODEL LP',
            'TGL LP',
            'SUMBER',
            'KET SUMBER',
            'CEKLIST CROSCEK BUKU B1 DIREKTORAT',
            'STATUS PENANGANAN TERAKHIR',
            'TGL UPDATE PENANGANAN TERAKHIR'
        ];

        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.load(file.buffer as unknown as ExcelJS.Buffer);
            // await workbook.xlsx.load(file.buffer as any);
        } catch (err) {
            throw new BadRequestException('Gagal memuat file Excel.');
        }

        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            throw new BadRequestException(`Sheet dengan nama "${sheetName}" tidak ditemukan.`);
        }

        const rows: Record<string, any>[] = [];
        const headers: string[] = [];

        // Ambil header dari baris pertama
        worksheet.getRow(1).eachCell(cell => {
            headers.push(cell.text.trim());
        });

        // Validasi apakah semua kolom yang diminta ada
        const missingHeaders = headersToInclude.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            throw new BadRequestException(`Kolom berikut tidak ditemukan di header: ${missingHeaders.join(', ')}`);
        }

        // Proses setiap baris data
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const rowObject: Record<string, any> = {};

            headersToInclude.forEach(header => {
                const columnIndex = headers.indexOf(header) + 1;
                rowObject[header] = row.getCell(columnIndex).text.trim();
            });

            rows.push(rowObject);
        });

        return rows;
    }
}
