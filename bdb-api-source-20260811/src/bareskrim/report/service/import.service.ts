import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportExcel } from '../entities/report-excel.entity';
import { LogImport } from '../entities/log-import.entity';
import { join } from 'path';
import { writeFileSync, promises as fsPromises } from 'fs';
import { CreateImportDto } from '../dto/create-import.dto';
import { ExcelService } from './excel.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';

@Injectable()
export class ImportService {
    private readonly reportExcelRepository: Repository<ReportExcel>;
    private readonly logImportRepository: Repository<LogImport>;
    private tableHelper: any;
    constructor(
        private excelService: ExcelService,
        private readonly dataSource: DataSource
    ) {
        (this.reportExcelRepository = this.dataSource.getRepository(ReportExcel)),
            (this.logImportRepository = this.dataSource.getRepository(LogImport)),
            (this.tableHelper = new TableHelperService());
    }

    async create(createImportDto: CreateImportDto, file: any, request: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const user = request['user'];
        try {
            const timestamp = Date.now();
            const dateObj = new Date(createImportDto.year);
            const year = dateObj.getFullYear();
            const fileName = `${year}-${timestamp}-${file.originalname}`;
            const directoryPath = join(process.cwd(), 'storage', 'file_excel');
            const dataPath = join('storage', 'file_excel', fileName);
            const filePath = join(directoryPath, fileName);
            await fsPromises.mkdir(directoryPath, { recursive: true });
            writeFileSync(filePath, file.buffer);
            const data = await this.excelService.excel(file, createImportDto.sheets_name);
            const logImport = this.logImportRepository.create({
                year: year,
                import_date: new Date(),
                report_file: dataPath,
                createBy: user.id,
                total_data: data.length
            });
            await queryRunner.manager.save(logImport);
            for (const [index, element] of data.entries()) {
                const datas = {
                    row: index + 2,
                    nomor_dan_tanggal: element['NOMOR DAN TANGAL'],
                    pasal: element.PASAL,
                    uraian_kejadian: element['URAIAN KEJADIAN'],
                    pelapor: element.PELAPOR,
                    tersangka: element.TERSANGKA,
                    barang_bukti: element.BB,
                    tujuan_penyaluran: element['TUJUAN PENYALURAN'],
                    bukti_penyaluran: element['BUKTI PENYALURAN'],
                    model_lp: element['MODEL LP'],
                    tgl_lp: element['TGL LP'],
                    sumber: element['SUMBER'],
                    ket_sumber: element['KET SUMBER'],
                    ceklist_croscek: element['CEKLIST CROSCEK BUKU B1 DIREKTORAT'],
                    status_penanganan: element['STATUS PENANGANAN TERAKHIR'],
                    tgl_update_penanganan: element['TGL UPDATE PENANGANAN TERAKHIR'],
                    LogImport: logImport
                };
                await queryRunner.manager.save(ReportExcel, datas);
            }
            await queryRunner.commitTransaction();
            const totalData = data.length;
            return [{ total: totalData }];
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.logImportRepository.createQueryBuilder('logImport');
            queryBuilder.leftJoinAndSelect('logImport.createBy', 'createBy');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'logImport',
                searchingAll: ['year', 'import_date'],
                searching: ['id', 'year', 'import_date', 'status', 'report_file', 'created_at', 'updated_at', 'createBy.id', 'createBy.name', 'createBy.email'],
                searchingOption: ['id', 'year', 'import_date', 'status', 'report_file', 'created_at', 'updated_at', 'createBy.id', 'createBy.name', 'createBy.email'],
                searchingOrWhere: ['id', 'year', 'import_date', 'status', 'report_file', 'created_at', 'updated_at', 'createBy.id', 'createBy.name', 'createBy.email'],
                searchingBeetween: ['import_date', 'created_at', 'updated_at'],
                yearMonthFilter: ['created_at'],
                sorting: ['id', 'year', 'import_date', 'status', 'report_file', 'created_at', 'updated_at', 'createBy.id', 'createBy.name', 'createBy.email'],
                defaultSorting: 'logImport.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}
