import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DateService } from '@app_core/helper/service/date.helper.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { ReportPasal } from '../entities/report-pasal.entity';
import { CreateReportPasalDto, UpdateReportPasalDto } from '../dto/report-pasal.dto';
import { AksesLpHelper } from './akses-lp.helper';

@Injectable()
export class ReportPasalService {
    constructor(
        private dateService: DateService,
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateReportPasalDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = queryRunner.manager.create(ReportPasal, {
                pasal: dto.pasal,
                dan_atau: dto.dan_atau,
                junto: dto.junto,
                subsider: dto.subsider,
                Report: { id: dto.report_id },
                JenisKejahatan: { id: dto.jenis_kejahatan_id },
                UndangUndang: { id: dto.undang_undang_id }
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
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(ReportPasal, 'ReportPasal');
            queryBuilder.leftJoinAndSelect('ReportPasal.Report', 'Report');
            queryBuilder.leftJoinAndSelect('ReportPasal.UndangUndang', 'UndangUndang');
            AksesLpHelper.applyToQuery(queryBuilder, request.user);
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'ReportPasal',
                searchingAll: ['pasal'],
                searching: ['id', 'pasal'],
                searchingOption: ['id', 'pasal', 'Report.id'],
                searchingOrWhere: ['id', 'pasal', 'created_at', 'updated_at'],
                // searchingBeetween: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
                // yearMonthFilter: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
                sorting: ['id', 'status_name', 'created_at', 'updated_at', 'UndangUndang.deskripsi', 'pasal', 'dan_atau', 'junto', 'subsider'],
                defaultSorting: 'ReportPasal.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        const data = await this.dataSource.getRepository(ReportPasal).findOneOrFail({ where: { id }, relations: ['Pasal', 'UndangUndang', 'JenisKejahatan', 'Report'] });
        return data;
    }

    async update(id: number, dto: UpdateReportPasalDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(ReportPasal, {
                where: { id }
            });
            await queryRunner.manager.update(ReportPasal, id, {
                pasal: dto.pasal,
                dan_atau: dto.dan_atau,
                junto: dto.junto,
                subsider: dto.subsider,
                Report: { id: dto.report_id },
                JenisKejahatan: { id: dto.jenis_kejahatan_id },
                UndangUndang: { id: dto.undang_undang_id }
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
            console.log(deleteDto.data);

            if (deleteDto.data && deleteDto.data.length > 0) {
                for (const joinObject of deleteDto.data) {
                    await queryRunner.manager.softDelete(ReportPasal, {
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
