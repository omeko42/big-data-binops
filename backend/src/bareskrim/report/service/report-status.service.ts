import { Injectable } from '@nestjs/common';
import { CreateReportDto, CreateReportStatusDto } from '@bareskrim/report/dto/create-report.dto';
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

@Injectable()
export class ReportStatusService {
    private readonly reportExcelRepository: Repository<ReportExcel>;
    private readonly logImportRepository: Repository<LogImport>;
    private readonly reportRepository: Repository<Report>;
    private readonly duplicatedReportRepository: Repository<DuplicatedReport>;
    private readonly directorateReport: Repository<DirectorateReport>;
    private readonly directorate: Repository<Directorate>;
    private readonly reportStatusRepository: Repository<ReportStatus>;
    private tableHelper: any;
    constructor(
        private dateService: DateService,
        private readonly dataSource: DataSource
    ) {
        (this.reportExcelRepository = this.dataSource.getRepository(ReportExcel)),
            (this.logImportRepository = this.dataSource.getRepository(LogImport)),
            (this.duplicatedReportRepository = this.dataSource.getRepository(DuplicatedReport)),
            (this.reportRepository = this.dataSource.getRepository(Report)),
            (this.directorateReport = this.dataSource.getRepository(DirectorateReport)),
            (this.directorate = this.dataSource.getRepository(Directorate)),
            (this.reportStatusRepository = this.dataSource.getRepository(ReportStatus)),
            (this.tableHelper = new TableHelperService());
    }

    async create(createReportStatusDto: CreateReportStatusDto) {
        const existingReportStatus = await this.reportStatusRepository.findOne({
            where: { status_name: createReportStatusDto.status_name }
        });
        if (!existingReportStatus) {
            const data = await this.reportStatusRepository.insert({
                status_name: createReportStatusDto.status_name
            });
            return data;
        } else {
            throw new Error('Data Sudah ada');
        }
    }

    async findAll(request: any) {
        let treeMenu = await this.dataSource.getTreeRepository(ReportStatus).findTrees({ depth: 9 });
        function assignKeys(nodes, prefix = '0', isRoot = true) {
            nodes.forEach((node, index) => {
                const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
                node.key = currentKey;
                if (node.children && node.children.length > 0) {
                    assignKeys(node.children, currentKey, false);
                }
            });
        }
        assignKeys(treeMenu);
        function convertToPrimeVueTree(data) {
            return data.map((item, index) => ({
                key: item.key || item.id || String(index),
                label: item.status_name,
                data: item,
                id:item.id, // simpan data asli kalau perlu
                children: convertToPrimeVueTree(item.children || [])
            }));
        }
        return { data: convertToPrimeVueTree(treeMenu) };
    }

    async findOne(id: number) {
        const data = await this.dataSource.getRepository(ReportStatus).findOneOrFail({ where: { id } });
        return data;
    }

    async update(id: number, createReportStatusDto: CreateReportStatusDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await queryRunner.manager.findOneOrFail(ReportStatus, {
                where: { id }
            });
            await queryRunner.manager.update(ReportStatus, id, {
                status_name: createReportStatusDto.status_name
            });
            data.status_name = createReportStatusDto.status_name;

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
                    await queryRunner.manager.softDelete(ReportStatus, {
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
