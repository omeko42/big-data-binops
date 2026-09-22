import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateJenisKejahatanDto } from '@bareskrim/data_master/dto/laporan/jenis-kejahatan.dto';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';
import { Pasal } from '@bareskrim/data_master/entities/laporan/pasal.entity';
import { UndangUndang } from '@bareskrim/data_master/entities/laporan/undang-undang.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import * as ExcelJS from 'exceljs';

type ImportRawRow = { row: number; id: string; keterangan: string; golongan_raw: string; iccs_raw: string };
export type JenisKejahatanImportPreviewRow = {
    row: number;
    ok: boolean;
    mode?: 'BARU' | 'UPDATE';
    id?: number;
    keterangan?: string;
    golongan_nama?: string;
    iccs_nama?: string;
    message?: string;
};
export type JenisKejahatanImportCommitResult = { row: number; ok: boolean; mode?: 'BARU' | 'UPDATE'; keterangan?: string; message?: string };

@Injectable()
export class JenisKejahatanService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateJenisKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingJenisKejahatan = dto.id
                ? await queryRunner.manager.findOne(JenisKejahatan, {
                      where: { id: dto.id }
                  })
                : null;

            if (existingJenisKejahatan) {
                throw new Error('Data Sudah Ada');
            }
            const { id_uu, ...restDto } = dto;
            const jenisKejahatan = queryRunner.manager.create(JenisKejahatan, {
                ...restDto,
                GolonganKejahatan: dto.id_golongan_kejahatan ? { id: dto.id_golongan_kejahatan } : null,
                IccsKategori: dto.id_iccs_kategori ? { id: dto.id_iccs_kategori } : null,
                TypeKejahatan: { id: dto.id_type_kejahatan },
                KategoriLp: { id: dto.id_kategori_lp },
                UndangUndang: Array.isArray(id_uu)
                    ? id_uu.map(id => ({ id: Number(id) })).filter(obj => !isNaN(obj.id))
                    : typeof id_uu === 'string'
                      ? id_uu
                            .split(',')
                            .map(id => Number(id.trim()))
                            .filter(id => !isNaN(id))
                            .map(id => ({ id }))
                      : typeof id_uu === 'number'
                        ? [{ id: id_uu }]
                        : []
            });
            await queryRunner.manager.save(jenisKejahatan);
            const pasalArray = String(dto.pasal_mapping || '')
                .split(',')
                .map(pasal => pasal.trim());
            for (const pasalText of pasalArray) {
                const existingPasal = await queryRunner.manager.findOne(Pasal, {
                    where: {
                        pasal: pasalText,
                        JenisKejahatan: { id: jenisKejahatan.id }
                    }
                });
                if (!existingPasal) {
                    const newPasal = queryRunner.manager.create(Pasal, {
                        pasal: pasalText,
                        JenisKejahatan: jenisKejahatan
                    });
                    await queryRunner.manager.save(newPasal); // Save new pasal
                }
            }
            await queryRunner.commitTransaction();
            return jenisKejahatan;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(JenisKejahatan, 'jenisKejahatan');
        queryBuilder.leftJoinAndSelect('jenisKejahatan.GolonganKejahatan', 'golonganKejahatan');
        queryBuilder.leftJoinAndSelect('jenisKejahatan.IccsKategori', 'iccsKategori');
        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'jenisKejahatan',
            searchingAll: ['keterangan'],
            searching: ['id', 'keterangan', 'created_at', 'updated_at'],
            searchingOption: ['id', 'keterangan', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'keterangan', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'keterangan', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'keterangan', 'created_at', 'updated_at'],
            sorting: ['id', 'keterangan', 'created_at', 'updated_at'],
            defaultSorting: 'jenisKejahatan.Timestamps.created_at',
            joins: []
        });
        return result;
    }

    async findOne(id: number) {
        const data = await this.dataSource.getRepository(JenisKejahatan).findOneOrFail({ where: { id }, relations: ['GolonganKejahatan', 'IccsKategori', 'TypeKejahatan', 'KategoriLp', 'UndangUndang'] });
        return data;
    }

    async update(id: number, dto: CreateJenisKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const jenisKejahatan = await queryRunner.manager.findOneOrFail(JenisKejahatan, { where: { id: id } });
            const { id_uu, id_type_kejahatan, id_kategori_lp, UndangUndang, ...restDto } = dto;
            let createData = {
                ...restDto,
                ...((id_type_kejahatan ?? undefined) && { TypeKejahatan: { id: id_type_kejahatan } }),
                ...((id_kategori_lp ?? undefined) && { KategoriLp: { id: id_kategori_lp } }),
                GolonganKejahatan: dto.id_golongan_kejahatan ? { id: dto.id_golongan_kejahatan } : null,
                IccsKategori: dto.id_iccs_kategori ? { id: dto.id_iccs_kategori } : null
            };
            await queryRunner.manager.update(JenisKejahatan, id, createData);

            // Handling UndangUndang (Many-to-Many)

            let undangUndangData = [];

            if (Array.isArray(id_uu)) {
                undangUndangData = id_uu.map(id => ({ id }));
            } else if (typeof id_uu === 'string') {
                undangUndangData = id_uu.split(',').map(id => ({ id: Number(id.trim()) }));
            } else if (typeof id_uu === 'number') {
                undangUndangData = [{ id: id_uu }];
            }
            const existingUndangUndangRelations = await queryRunner.manager.createQueryBuilder().relation(JenisKejahatan, 'UndangUndang').of(jenisKejahatan).loadMany(); // Load all existing UndangUndang relations

            const existingUndangUndangIds = existingUndangUndangRelations.map((uu: any) => +uu.id);
            const newUndangUndangData = undangUndangData.filter(uu => !existingUndangUndangIds.includes(uu.id));
            if (newUndangUndangData.length > 0) {
                await queryRunner.manager.createQueryBuilder().relation(JenisKejahatan, 'UndangUndang').of(jenisKejahatan).add(newUndangUndangData); // Adds only the new associations
            } // Add the new associations
            if (dto.pasal_mapping) {
                const pasalArray = String(dto.pasal_mapping)
                    .split(',')
                    .map(pasal => ({
                        pasal: pasal.trim(),
                        JenisKejahatan: { id: jenisKejahatan.id }
                    }));
                for (const pasalData of pasalArray) {
                    const existingPasal = await queryRunner.manager.findOne(Pasal, {
                        where: {
                            pasal: pasalData.pasal,
                            JenisKejahatan: { id: jenisKejahatan.id }
                        }
                    });
                    if (existingPasal) {
                        existingPasal.pasal = pasalData.pasal;
                        await queryRunner.manager.save(existingPasal);
                    } else {
                        const newPasal = queryRunner.manager.create(Pasal, pasalData);
                        await queryRunner.manager.save(newPasal);
                    }
                }
            }
            await queryRunner.commitTransaction();
            return jenisKejahatan; // Return the updated entity
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async remove(deleteDto: DeleteDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (deleteDto.data && deleteDto.data.length > 0) {
                for (const joinObject of deleteDto.data) {
                    await queryRunner.manager.softDelete(JenisKejahatan, {
                        id: joinObject.id
                    });
                }
            }
            await queryRunner.commitTransaction();
            return 'Successfully removed';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // ===================== Import Massal (insert/update) =====================

    /** Cocokkan nama Golongan Kejahatan bebas dari file Excel (mis. "Konvensional" atau
     *  "Kejahatan Konvensional") ke id-nya di cm_golongan_kejahatan (4 kode resmi dari DORS). */
    private async resolveGolonganForImport(raw?: string): Promise<{ id: number; label: string } | null> {
        const value = String(raw || '').trim();
        if (!value) return null;
        const rows = await this.dataSource.query('select id, name from cm_golongan_kejahatan where lower(name) = lower($1)', [value]);
        if (rows.length === 1) return { id: Number(rows[0].id), label: rows[0].name };
        return null;
    }

    /** Cocokkan Kategori ICCS bebas dari file Excel ("1" / "1. Tindakan yg..." / nama lengkap) ke id-nya. */
    private async resolveIccsForImport(raw?: string): Promise<{ id: number; label: string } | null> {
        const value = String(raw || '').trim();
        if (!value) return null;
        const kodeMatch = value.match(/^(\d{1,2})\b/);
        if (kodeMatch) {
            const rows = await this.dataSource.query('select id, kode, nama from cm_iccs_kategori where kode = $1', [Number(kodeMatch[1])]);
            if (rows.length === 1) return { id: Number(rows[0].id), label: `${rows[0].kode}. ${rows[0].nama}` };
        }
        const rows = await this.dataSource.query('select id, kode, nama from cm_iccs_kategori where lower(nama) = lower($1)', [value]);
        if (rows.length === 1) return { id: Number(rows[0].id), label: `${rows[0].kode}. ${rows[0].nama}` };
        return null;
    }

    /** Baca file Excel (buffer) -> baris mentah, mulai dari baris ke-2 (baris 1 = header). */
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
            const keterangan = cell(row, 2);
            const golongan_raw = cell(row, 3);
            const iccs_raw = cell(row, 4);
            if (!id && !keterangan) return; // baris kosong, lewati
            out.push({ row: rowNumber, id, keterangan, golongan_raw, iccs_raw });
        });
        return out;
    }

    /** Validasi (TANPA menyimpan) seluruh baris hasil upload template -- dipakai layar "review"
     *  sebelum admin klik Import. ID kosong = baris baru (INSERT); ID terisi = update baris itu
     *  (harus sudah ada di DB). */
    async previewBulkImport(buffer: Buffer): Promise<{ rows: JenisKejahatanImportPreviewRow[] }> {
        const raw = await this.parseImportWorkbook(buffer);
        if (!raw.length) throw new BadRequestException('Tidak ada baris data ditemukan (isi dari baris ke-2, baris 1 = header).');

        const seenIds = new Map<number, number>(); // id -> baris pertama yg pakai id itu (deteksi duplikat DI FILE yg sama)
        const results: JenisKejahatanImportPreviewRow[] = [];

        for (const r of raw) {
            try {
                if (!r.keterangan) throw new BadRequestException('Keterangan wajib diisi.');
                let mode: 'BARU' | 'UPDATE' = 'BARU';
                let id: number | undefined;
                if (r.id) {
                    id = Number(r.id);
                    if (!Number.isFinite(id) || id <= 0) throw new BadRequestException('Kolom ID harus angka (kosongkan utk baris baru).');
                    const dup = seenIds.get(id);
                    if (dup) throw new BadRequestException(`ID ${id} sudah dipakai di baris ${dup} pada file yang sama.`);
                    seenIds.set(id, r.row);
                    const exists = await this.dataSource.query('select id from cm_jenis_kejahatan where id = $1', [id]);
                    if (!exists.length) throw new BadRequestException(`ID ${id} tidak ditemukan di data yang sudah ada -- kosongkan kolom ID kalau maksudnya baris baru.`);
                    mode = 'UPDATE';
                }

                let golongan: { id: number; label: string } | null = null;
                if (r.golongan_raw) {
                    golongan = await this.resolveGolonganForImport(r.golongan_raw);
                    if (!golongan) throw new BadRequestException(`Golongan Kejahatan "${r.golongan_raw}" tidak ditemukan -- lihat sheet "Daftar Golongan", isi persis salah satu dari 4 golongan resmi.`);
                }
                let iccs: { id: number; label: string } | null = null;
                if (r.iccs_raw) {
                    iccs = await this.resolveIccsForImport(r.iccs_raw);
                    if (!iccs) throw new BadRequestException(`Kategori ICCS "${r.iccs_raw}" tidak ditemukan -- lihat sheet "Daftar Kategori ICCS", isi kode atau nama persis.`);
                }

                results.push({ row: r.row, ok: true, mode, id, keterangan: r.keterangan, golongan_nama: golongan?.label, iccs_nama: iccs?.label });
            } catch (e: any) {
                const msg = e?.response?.errors ? Object.values(e.response.errors).flat().join(', ') : e?.message || 'Baris tidak valid.';
                results.push({ row: r.row, ok: false, message: msg, keterangan: r.keterangan || undefined });
            }
        }
        return { rows: results };
    }

    /** Eksekusi commit: create()/update() (pakai ulang logic yg sudah ada) utk tiap baris yg lolos preview. */
    async commitBulkImport(rows: JenisKejahatanImportPreviewRow[]): Promise<{ results: JenisKejahatanImportCommitResult[] }> {
        if (!Array.isArray(rows) || !rows.length) throw new BadRequestException('Tidak ada baris untuk diimpor.');
        const results: JenisKejahatanImportCommitResult[] = [];
        for (const r of rows) {
            try {
                // golongan_nama/iccs_nama di preview cuma label utk ditampilkan -- perlu resolve ULANG
                // ke ID krn payload dari frontend hasil review tak menyimpan id_golongan_kejahatan/id_iccs_kategori
                // mentah, cuma label yg sudah dicocokkan. Baris ini sudah lolos preview jadi dijamin cocok.
                const golongan = r.golongan_nama ? await this.resolveGolonganByLabel(r.golongan_nama) : null;
                const iccs = r.iccs_nama ? await this.resolveIccsByLabel(r.iccs_nama) : null;
                const dto: any = { keterangan: r.keterangan, id_golongan_kejahatan: golongan?.id, id_iccs_kategori: iccs?.id };
                if (r.mode === 'UPDATE' && r.id) {
                    await this.update(r.id, dto as CreateJenisKejahatanDto);
                    results.push({ row: r.row, ok: true, mode: 'UPDATE', keterangan: r.keterangan });
                } else {
                    await this.create(dto as CreateJenisKejahatanDto);
                    results.push({ row: r.row, ok: true, mode: 'BARU', keterangan: r.keterangan });
                }
            } catch (e: any) {
                const msg = e?.response?.errors ? Object.values(e.response.errors).flat().join(', ') : e?.message || 'Gagal menyimpan.';
                results.push({ row: r.row, ok: false, message: msg, keterangan: r.keterangan });
            }
        }
        return { results };
    }

    /** Label = nama golongan kejahatan persis (hasil resolveGolonganForImport). */
    private async resolveGolonganByLabel(label: string): Promise<{ id: number } | null> {
        const rows = await this.dataSource.query('select id from cm_golongan_kejahatan where lower(name) = lower($1) limit 1', [label]);
        return rows.length ? { id: Number(rows[0].id) } : null;
    }
    /** Label sudah dalam format "kode. nama" (hasil resolveIccsForImport). */
    private async resolveIccsByLabel(label: string): Promise<{ id: number } | null> {
        const kodeMatch = label.match(/^(\d{1,2})\./);
        if (!kodeMatch) return null;
        const rows = await this.dataSource.query('select id from cm_iccs_kategori where kode = $1 limit 1', [Number(kodeMatch[1])]);
        return rows.length ? { id: Number(rows[0].id) } : null;
    }

    /** 4 golongan kejahatan resmi -- dipakai isi sheet "Daftar Golongan" di template import. */
    private async getGolonganReferenceRows(): Promise<{ golongan: string }[]> {
        return this.dataSource.query('select name as golongan from cm_golongan_kejahatan order by id');
    }
    /** Semua kategori ICCS -- dipakai isi sheet "Daftar Kategori ICCS" di template import. */
    private async getIccsReferenceRows(): Promise<{ kode: number; nama: string }[]> {
        return this.dataSource.query('select kode, nama from cm_iccs_kategori order by kode');
    }

    /** Generate template Excel kosong (+ petunjuk + referensi Golongan/ICCS) utk Import Massal Jenis Kejahatan. */
    async buildImportTemplateBuffer(): Promise<Buffer> {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'BDB';

        const sheet = wb.addWorksheet('Data Jenis Kejahatan');
        sheet.columns = [
            { header: 'ID (kosongkan utk baru)', width: 22 },
            { header: 'Keterangan', width: 50 },
            { header: 'Golongan', width: 32 },
            { header: 'Kategori ICCS', width: 50 }
        ];
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
        sheet.addRow(['', 'Contoh: Pencurian dengan Pemberatan', 'Kejahatan Konvensional', '5. Kejahatan terhadap Properti Saja (Tanpa Kekerasan)']).font = { italic: true, color: { argb: 'FF94A3B8' } };

        const golonganRows = await this.getGolonganReferenceRows();
        const golonganSheet = wb.addWorksheet('Daftar Golongan');
        golonganSheet.columns = [{ header: 'Golongan Kejahatan (isi persis salah satu)', width: 40 }];
        golonganSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        golonganSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        golonganSheet.views = [{ state: 'frozen', ySplit: 1 }];
        for (const g of golonganRows) golonganSheet.addRow([g.golongan]);

        const iccsRows = await this.getIccsReferenceRows();
        const iccsSheet = wb.addWorksheet('Daftar Kategori ICCS');
        iccsSheet.columns = [
            { header: 'Kode', width: 8 },
            { header: 'Nama (isi "kode" saja, atau nama lengkap)', width: 70 }
        ];
        iccsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        iccsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        iccsSheet.views = [{ state: 'frozen', ySplit: 1 }];
        for (const c of iccsRows) iccsSheet.addRow([c.kode, c.nama]);

        const info = wb.addWorksheet('Petunjuk');
        info.columns = [{ width: 24 }, { width: 90 }];
        const rows: [string, string][] = [
            ['ID', 'Opsional. KOSONGKAN untuk menambah jenis kejahatan BARU. Isi dengan ID yang sudah ada (lihat Master Jenis Kejahatan) untuk MENGUBAH data itu.'],
            ['Keterangan', 'Wajib. Nama/uraian jenis kejahatan.'],
            ['Golongan', 'Opsional. Lihat sheet "Daftar Golongan" -- isi nama Golongan Kejahatan persis (mis. "Kejahatan Konvensional").'],
            ['Kategori ICCS', 'Opsional. Lihat sheet "Daftar Kategori ICCS" -- isi angka kode-nya saja (mis. "5"), atau nama lengkapnya.'],
            ['', ''],
            ['Cara pakai', '1) Isi baris mulai baris ke-2 di sheet "Data Jenis Kejahatan" (hapus baris contoh). 2) Upload lewat tombol "Import Massal". 3) Tinjau hasil validasi tiap baris. 4) Klik "Import Sekarang" utk baris yang valid.']
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
