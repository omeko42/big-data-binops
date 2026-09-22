import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as ExcelJS from 'exceljs';

type ImportRawRow = { row: number; id: string; nama: string; alamat: string; keterangan: string };
export type SatkerEksternalImportPreviewRow = {
    row: number;
    ok: boolean;
    mode?: 'BARU' | 'UPDATE';
    id?: number;
    nama?: string;
    alamat?: string;
    keterangan?: string;
    message?: string;
};
export type SatkerEksternalImportCommitResult = { row: number; ok: boolean; mode?: 'BARU' | 'UPDATE'; nama?: string; message?: string };

@Injectable()
export class SatkerEksternalService {
    constructor(private readonly dataSource: DataSource) {}

    async list(search?: string) {
        const params: any[] = [];
        let where = '';
        if (search && search.trim()) {
            params.push(`%${search.trim()}%`);
            where = 'where nama ilike $1 or alamat ilike $1 or keterangan ilike $1';
        }
        const rows = await this.dataSource.query(
            `select id, nama, alamat, keterangan, created_at, updated_at from bdb_satker_eksternal ${where} order by nama`,
            params
        );
        return { status: 1, data: rows };
    }

    async save(body: { id?: number; nama?: string; alamat?: string; keterangan?: string }) {
        const nama = (body.nama || '').trim();
        if (!nama) throw new BadRequestException('Nama satker eksternal wajib diisi.');
        const alamat = body.alamat?.trim() || null;
        const keterangan = body.keterangan?.trim() || null;
        if (body.id) {
            // UPDATE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
            const [r] = await this.dataSource.query(
                'update bdb_satker_eksternal set nama=$2, alamat=$3, keterangan=$4, updated_at=now() where id=$1 returning id',
                [body.id, nama, alamat, keterangan]
            );
            if (!r.length) throw new NotFoundException('Satker eksternal tidak ditemukan.');
            return { status: 1, data: { id: body.id }, message: 'Satker eksternal diperbarui.' };
        }
        const ins = await this.dataSource.query(
            'insert into bdb_satker_eksternal (nama, alamat, keterangan) values ($1,$2,$3) returning id',
            [nama, alamat, keterangan]
        );
        return { status: 1, data: { id: ins[0].id }, message: 'Satker eksternal ditambahkan.' };
    }

    async remove(id: number) {
        // DELETE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
        const [r] = await this.dataSource.query('delete from bdb_satker_eksternal where id=$1 returning id', [id]);
        if (!r.length) throw new NotFoundException('Satker eksternal tidak ditemukan.');
        return { status: 1, message: 'Satker eksternal dihapus.' };
    }

    // ===================== Import Massal (insert/update) =====================

    private async parseImportWorkbook(buffer: Buffer): Promise<ImportRawRow[]> {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer as any);
        const sheet = wb.worksheets[0];
        if (!sheet) throw new BadRequestException('File Excel tidak berisi sheet apa pun.');
        const cell = (row: ExcelJS.Row, idx: number) => String(row.getCell(idx).text || '').trim();
        const out: ImportRawRow[] = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // header
            const id = cell(row, 1);
            const nama = cell(row, 2);
            const alamat = cell(row, 3);
            const keterangan = cell(row, 4);
            if (!id && !nama) return; // baris kosong, lewati
            out.push({ row: rowNumber, id, nama, alamat, keterangan });
        });
        return out;
    }

    async previewBulkImport(buffer: Buffer): Promise<{ rows: SatkerEksternalImportPreviewRow[] }> {
        const raw = await this.parseImportWorkbook(buffer);
        if (!raw.length) throw new BadRequestException('Tidak ada baris data ditemukan (isi dari baris ke-2, baris 1 = header).');

        const seenIds = new Map<number, number>();
        const results: SatkerEksternalImportPreviewRow[] = [];

        for (const r of raw) {
            try {
                if (!r.nama) throw new BadRequestException('Nama wajib diisi.');
                let mode: 'BARU' | 'UPDATE' = 'BARU';
                let id: number | undefined;
                if (r.id) {
                    id = Number(r.id);
                    if (!Number.isFinite(id) || id <= 0) throw new BadRequestException('Kolom ID harus angka (kosongkan utk baris baru).');
                    const dup = seenIds.get(id);
                    if (dup) throw new BadRequestException(`ID ${id} sudah dipakai di baris ${dup} pada file yang sama.`);
                    seenIds.set(id, r.row);
                    const exists = await this.dataSource.query('select id from bdb_satker_eksternal where id = $1', [id]);
                    if (!exists.length) throw new BadRequestException(`ID ${id} tidak ditemukan di data yang sudah ada -- kosongkan kolom ID kalau maksudnya baris baru.`);
                    mode = 'UPDATE';
                }
                results.push({ row: r.row, ok: true, mode, id, nama: r.nama, alamat: r.alamat || undefined, keterangan: r.keterangan || undefined });
            } catch (e: any) {
                results.push({ row: r.row, ok: false, message: e?.message || 'Baris tidak valid.', nama: r.nama || undefined });
            }
        }
        return { rows: results };
    }

    async commitBulkImport(rows: SatkerEksternalImportPreviewRow[]): Promise<{ results: SatkerEksternalImportCommitResult[] }> {
        if (!Array.isArray(rows) || !rows.length) throw new BadRequestException('Tidak ada baris untuk diimpor.');
        const results: SatkerEksternalImportCommitResult[] = [];
        for (const r of rows) {
            try {
                await this.save({ id: r.mode === 'UPDATE' ? r.id : undefined, nama: r.nama, alamat: r.alamat, keterangan: r.keterangan });
                results.push({ row: r.row, ok: true, mode: r.mode, nama: r.nama });
            } catch (e: any) {
                results.push({ row: r.row, ok: false, mode: r.mode, nama: r.nama, message: e?.message || 'Gagal menyimpan.' });
            }
        }
        return { results };
    }

    async buildImportTemplateBuffer(): Promise<Buffer> {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'BDB';

        const sheet = wb.addWorksheet('Data Satker Eksternal');
        sheet.columns = [
            { header: 'ID (kosongkan utk baru)', width: 22 },
            { header: 'Nama', width: 40 },
            { header: 'Alamat', width: 45 },
            { header: 'Keterangan', width: 40 }
        ];
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
        sheet.addRow(['', 'Kejaksaan Negeri Ogan Komering Ilir', 'Jl. Contoh No. 1, Kayuagung', 'Mitra penuntutan']).font = { italic: true, color: { argb: 'FF94A3B8' } };

        const info = wb.addWorksheet('Petunjuk');
        info.columns = [{ width: 24 }, { width: 90 }];
        const rows: [string, string][] = [
            ['ID', 'Opsional. KOSONGKAN untuk menambah satker eksternal BARU. Isi dengan ID yang sudah ada (lihat Master Satker Eksternal) untuk MENGUBAH data itu.'],
            ['Nama', 'Wajib. Nama instansi/mitra di luar Polri.'],
            ['Alamat', 'Opsional.'],
            ['Keterangan', 'Opsional.'],
            ['', ''],
            ['Cara pakai', '1) Isi baris mulai baris ke-2 di sheet "Data Satker Eksternal" (hapus baris contoh). 2) Upload lewat tombol "Import Massal". 3) Tinjau hasil validasi tiap baris. 4) Klik "Import Sekarang" utk baris yang valid.']
        ];
        info.addRow(['Kolom', 'Keterangan']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        info.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        for (const r of rows) {
            const added = info.addRow(r);
            added.alignment = { wrapText: true, vertical: 'top' };
        }

        return (await wb.xlsx.writeBuffer()) as Buffer;
    }
}
