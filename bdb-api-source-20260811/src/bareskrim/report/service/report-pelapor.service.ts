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
import { ReportPelapor } from '../entities/report-pelapor.entity';
import { CreateReportPelaporDto, UpdateReportPelaporDto } from '../dto/report-pelapor.dto';
import { AksesLpHelper } from './akses-lp.helper';

@Injectable()
export class ReportPelaporService {
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

    async create(dto: CreateReportPelaporDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = queryRunner.manager.create(ReportPelapor, {
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
                Report: { id: dto.report_id }
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

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(ReportPelapor, 'ReportPelapor');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Report', 'Report');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Agama', 'Agama');
        queryBuilder.leftJoinAndSelect('ReportPelapor.JenisKelamin', 'JenisKelamin');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Kewarganegaraan', 'Kewarganegaraan');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Pekerjaan', 'Pekerjaan');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Pendidikan', 'Pendidikan');
        queryBuilder.leftJoinAndSelect('ReportPelapor.TipeIdentitas', 'TipeIdentitas');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Provinsi', 'Provinsi');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Kabupaten', 'Kabupaten');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Kecamatan', 'Kecamatan');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Desa', 'Desa');
        queryBuilder.leftJoinAndSelect('ReportPelapor.Suku', 'Suku');
        AksesLpHelper.applyToQuery(queryBuilder, request.user);

        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'ReportPelapor',
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
            searchingOrWhere: ['id', 'status_name', 'created_at', 'updated_at'],
            sorting: ['id', 'status_name', 'created_at', 'updated_at'],
            defaultSorting: 'ReportPelapor.Timestamps.created_at',
            joins: []
        });
        return result;
    }

    async findOne(id: number) {
        const data = await this.dataSource.getRepository(ReportPelapor).findOneOrFail({ where: { id }, relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan', 'Report'] });
        return data;
    }

    async update(id: number, dto: UpdateReportPelaporDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(ReportPelapor, { where: { id } });
            await queryRunner.manager.update(ReportPelapor, id, {
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
                    await queryRunner.manager.softDelete(ReportPelapor, {
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
}
