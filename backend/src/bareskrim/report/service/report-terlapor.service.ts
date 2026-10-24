import { Injectable } from '@nestjs/common';
import { UpdateReportDto } from '@bareskrim/report/dto/update-report.dto';
import { ImportService } from '@bareskrim/report/service/import.service';
import { DataSource, Repository } from 'typeorm';
import { ReportExcel } from '../entities/report-excel.entity';
import { LogImport } from '../entities/log-import.entity';
import { Report } from '../entities/report.entity';
import { DateService } from '@app_core/helper/service/date.helper.service';
import { DuplicatedReport } from '../entities/duplicate-report.entity';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DirectorateReport } from '../entities/directorate-report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { ReportStatus } from '../entities/report-status.entity';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { ReportTerlapor } from '../entities/report-terlapor.entity';
import { CreateReportTerlaporDto, UpdateReportTerlaporDPODto, UpdateReportTerlaporDto } from '../dto/report-terlapor.dto';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { AksesLpHelper } from './akses-lp.helper';
import { join } from 'path';
import { promises as fsPromises, writeFileSync } from 'fs';
import { LogReport } from '../entities/log-report.entity';
@Injectable()
export class ReportTerlaporService {
    private readonly reportExcelRepository: Repository<ReportExcel>;
    private readonly logImportRepository: Repository<LogImport>;
    private readonly reportRepository: Repository<Report>;
    private readonly duplicatedReportRepository: Repository<DuplicatedReport>;
    private readonly directorateReport: Repository<DirectorateReport>;
    private readonly directorate: Repository<Directorate>;
    private readonly reportStatusRepository: Repository<ReportStatus>;
    constructor(
        private dateService: DateService,
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateReportTerlaporDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = queryRunner.manager.create(ReportTerlapor, {
                nomor_identitas: dto.nomor_identitas,
                nama: dto.nama,
                tanggal_lahir: dto.tanggal_lahir,
                tempat_lahir: dto.tempat_lahir,
                JenisKelamin: { id: dto.jenis_kelamin_id },
                TipeIdentitas: { id: dto.tipe_identitas_id }, // Updated to snake_case
                Agama: { id: dto.agama_id }, // Updated to snake_case
                alamat: dto.alamat,
                kode_pos: dto.kode_pos,
                Provinsi: { code: dto.provinsi_id }, // Updated to snake_case
                Kabupaten: { code: dto.kabupaten_id }, // Updated to snake_case
                Kecamatan: { code: dto.kecamatan_id }, // Updated to snake_case
                Desa: { code: dto.desa_id }, // Updated to snake_case
                no_handpone: dto.no_handpone,
                no_telepon: dto.no_telepon,
                email: dto.email,
                Kewarganegaraan: { id: dto.kewarganegaraan_id }, // Updated to snake_case
                Suku: { id: dto.suku_id }, // Updated to snake_case
                Pekerjaan: { id: dto.pekerjaan_id }, // Updated to snake_case
                Pendidikan: { id: dto.pendidikan_id }, // Updated to snake_case
                media_sosial: dto.media_sosial,
                dokumen: dto.dokumen,
                Report: { id: dto.report_id },
                TerlaporStatus: { id: 1 }
            });

            await queryRunner.manager.save([data]);
            await queryRunner.commitTransaction();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any, @CurrentUser() authUser) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(ReportTerlapor, 'ReportTerlapor');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Report', 'Report');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Agama', 'Agama');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.JenisKelamin', 'JenisKelamin');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Kewarganegaraan', 'Kewarganegaraan');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Pekerjaan', 'Pekerjaan');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Pendidikan', 'Pendidikan');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.TipeIdentitas', 'TipeIdentitas');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Provinsi', 'Provinsi');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Kabupaten', 'Kabupaten');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Kecamatan', 'Kecamatan');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Desa', 'Desa');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.Suku', 'Suku');
            queryBuilder.leftJoinAndSelect('ReportTerlapor.TerlaporStatus', 'TerlaporStatus');
            AksesLpHelper.applyToQuery(queryBuilder, authUser);

            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'ReportTerlapor',
                searchingAll: ['nama'],
                searching: [
                    'id',
                    'nomor_identitas',
                    'nama',
                    'tanggal_lahir',
                    'tempat_lahir',
                    'alamat',
                    'kode_pos',
                    'no_handpone',
                    'no_telepon',
                    'email',
                    'media_sosial',
                    'dokumen',
                    'created_at',
                    'updated_at',
                    'deleted_at',
                    'Agama.name',
                    'JenisKelamin.name',
                    'Agama.name',
                    'Provinsi.name',
                    'Kabupaten.name',
                    'Kecamatan.name',
                    'Desa.name',
                    'Kewarganegaraan.name',
                    'Suku.name',
                    'Pekerjaan.name',
                    'Pendidikan.name',
                    'Report.nomor'
                ],
                searchingOption: [
                    'id',
                    'nomor_identitas',
                    'nama',
                    'tanggal_lahir',
                    'tempat_lahir',
                    'alamat',
                    'kode_pos',
                    'no_handpone',
                    'no_telepon',
                    'email',
                    'media_sosial',
                    'dokumen',
                    'created_at',
                    'updated_at',
                    'deleted_at',
                    'Agama.id',
                    'JenisKelamin.id',
                    'Agama.id',
                    'Provinsi.id',
                    'Kabupaten.id',
                    'Kecamatan.id',
                    'Desa.id',
                    'Kewarganegaraan.id',
                    'Suku.id',
                    'Pekerjaan.id',
                    'Pendidikan.id',
                    'Report.id'
                ],
                searchingOrWhere: ['id', 'TerlaporStatus.name', 'created_at', 'updated_at'],
                // searchingBeetween: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
                // yearMonthFilter: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
                sorting: ['id', 'TerlaporStatus.name', 'created_at', 'updated_at'],
                defaultSorting: 'ReportTerlapor.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        const data = await this.dataSource.getRepository(ReportTerlapor).findOneOrFail({ where: { id }, relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan', 'Report', 'TerlaporStatus'] });
        return data;
    }

    async update(id: number, dto: UpdateReportTerlaporDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(ReportTerlapor, { where: { id } });
            await queryRunner.manager.update(ReportTerlapor, id, {
                nomor_identitas: dto.nomor_identitas,
                nama: dto.nama,
                tanggal_lahir: dto.tanggal_lahir,
                tempat_lahir: dto.tempat_lahir,
                JenisKelamin: { id: dto.jenis_kelamin_id },
                TipeIdentitas: { id: dto.tipe_identitas_id }, // Updated to snake_case
                Agama: { id: dto.agama_id }, // Updated to snake_case
                alamat: dto.alamat,
                kode_pos: dto.kode_pos,
                Provinsi: { code: dto.provinsi_id }, // Updated to snake_case
                Kabupaten: { code: dto.kabupaten_id }, // Updated to snake_case
                Kecamatan: { code: dto.kecamatan_id }, // Updated to snake_case
                Desa: { code: dto.desa_id }, // Updated to snake_case
                no_handpone: dto.no_handpone,
                no_telepon: dto.no_telepon,
                email: dto.email,
                Kewarganegaraan: { id: dto.kewarganegaraan_id }, // Updated to snake_case
                Suku: { id: dto.suku_id }, // Updated to snake_case
                Pekerjaan: { id: dto.pekerjaan_id }, // Updated to snake_case
                Pendidikan: { id: dto.pendidikan_id }, // Updated to snake_case
                media_sosial: dto.media_sosial,
                dokumen: dto.dokumen
                // TerlaporStatus: { id: dto.status_id }
            });
            await queryRunner.commitTransaction();
            return data;
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
                    await queryRunner.manager.softDelete(ReportTerlapor, {
                        id: joinObject.id
                    });
                }
            }
            await queryRunner.commitTransaction();
            return `Successfully removed report statuses.`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async jadikaTersangka(id: number, dto: UpdateReportTerlaporDPODto, file: any, authUser, req) {
        let dokumen = null;
        if (file) {
            dokumen = await this.saveFile(file, 'dokumen_status_tersangka');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(ReportTerlapor, { where: { id } });
            
            await queryRunner.manager.update(ReportTerlapor, id, {
                TerlaporStatus: { id: 2 }
            });
            await queryRunner.manager.insert(LogReport, {
                tanggal_dinyatakan: await this.dateService.parseDate2(dto.report_status_date),
                keterangan: `Penetapan Terlapor menjadi Tersangka`,
                status: 'Perubahan Status Terlapor',
                Report: data.Report,
                bukti_dinyatakan: dto.bukti_dinyatakan,
                dokumen_bukti_dinyatakan: dokumen ?? null,
            });
            await queryRunner.commitTransaction();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async masukKeDpo(id: number, dto: UpdateReportTerlaporDPODto, file: any, authUser, req) {

        let dokumen = null;
        if (file) {
            dokumen = await this.saveFile(file, 'dokumen_status_tersangka');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(ReportTerlapor, { where: { id } });
            await queryRunner.manager.update(ReportTerlapor, id, {
                TerlaporStatus: { id: 3 }
            });
            await queryRunner.manager.insert(LogReport, {
                tanggal_dinyatakan: await this.dateService.parseDate2(dto.report_status_date),
                keterangan: `Penetapan Terlapor menjadi DPO`,
                status: 'Perubahan Status Terlapor',
                Report: data.Report,
                bukti_dinyatakan: dto.bukti_dinyatakan,
                dokumen_bukti_dinyatakan: dokumen ?? null,
            });
            await queryRunner.commitTransaction();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async saveFile(file: Express.Multer.File, dir: string): Promise<string> {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.originalname}`;

        const directoryPath = join(process.cwd(), 'storage', dir);
        const filePath = join(directoryPath, fileName);
        await fsPromises.mkdir(directoryPath, { recursive: true });
        writeFileSync(filePath, file.buffer);
        return join(dir, fileName);
    }
}
