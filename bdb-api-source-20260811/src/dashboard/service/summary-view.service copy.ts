import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Dashboard } from '../entity/dashboard.entity';
import { ReportStatus } from '@bareskrim/report/entities/report-status.entity';
import { Report } from '@bareskrim/report/entities/report.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { TypeKejahatan } from '@bareskrim/data_master/entities/laporan/type-kejahatan.entity';
import { KategoriLp } from 'src/orgaisasi/entity/kategori-lp.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';
import { DashboardKategoriKejahatan } from '../entity/total_kategori_kejahatan.entity';
import { DashboardTypeKejahatan } from '../entity/total_type_kejahatan.entity';
import { DashboardJenisKejahatan } from '../entity/total_jenis_kejahatan.entity';
import { DashboardStatus } from '../entity/total_status.entity';

@Injectable()
export class SummaryTableService {
    private readonly logger = new Logger(SummaryTableService.name);
    constructor(private readonly dataSource: DataSource) {}

    async refreshSummaryTable() {
        const startDate = new Date('2019-12-30'); // ganti sesuai kebutuhan
        const endDate = new Date(); // sekarang

        const currentDate = new Date(startDate);
        const organisasis = await this.dataSource.getRepository(Organisasi).find();

        while (currentDate <= endDate) {
            const isoDate = currentDate.toISOString().slice(0, 10);
            for (const organisasi of organisasis) {
                const total = await this.getTotalReport(isoDate, organisasi.id);
                if (total != 0) {
                    const total_status_selesai = await this.getTotalReportDiselesaikan(isoDate, organisasi.id);
                    const total_type_kejahatan = await this.getTotalTypeReport(isoDate, organisasi.id);
                    const total_kategori_kejahatan = await this.getTotalKategoriReport(isoDate, organisasi.id);
                    const total_jenis_kejahatan = await this.getTotalKeteranganJenisKejahatan(isoDate, organisasi.id);
                    const total_status = await this.getTotalStatus(isoDate, organisasi.id);
                    const summaryData = {
                        date: isoDate,
                        organisasi_path: organisasi.path,
                        total: total,
                        total_status_selesai: await this.getTotalTunggakanDiselesaikan(isoDate, organisasi.id),
                        total_tunggakan_status_selesai: total_status_selesai,
                        // total_status_berjalan: total - total_status_selesai,
                        total_pelapor: await this.getTotalKeterlibatan(isoDate, ReportPelapor, organisasi.id),
                        total_terlapor: await this.getTotalKeterlibatan(isoDate, ReportTerlapor, organisasi.id),
                        total_korban: await this.getTotalKeterlibatan(isoDate, ReportKorban, organisasi.id),
                        total_saksi: await this.getTotalKeterlibatan(isoDate, ReportSaksi, organisasi.id)
                    };
                    this.upsertDashboard(isoDate, summaryData);

                    this.saveKejahatanData(total_type_kejahatan, organisasi.path, new Date(isoDate), DashboardTypeKejahatan, { typeId: 'type_id', typeName: 'type_name' }, ['organisasi_path', 'date', 'type_id']);
                    this.saveKejahatanData(total_kategori_kejahatan, organisasi.path, new Date(isoDate), DashboardKategoriKejahatan, { id: 'kategori_id', name: 'kategori_name' }, ['organisasi_path', 'date', 'kategori_id']);
                    this.saveKejahatanData(total_jenis_kejahatan, organisasi.path, new Date(isoDate), DashboardJenisKejahatan, { id: 'jenis_kejahatan_id', keterangan: 'jenis_kejahatan_name' }, ['organisasi_path', 'date', 'jenis_kejahatan_id']);
                    this.processStatusTree(total_status, organisasi.path, new Date(isoDate));
                }
            }
            // tambah 1 hari
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return 'All upserts completed';
    }

    async saveKejahatanData(list: any[], organisasiPath: string, date: Date, entity: any, keyMap: Record<string, string>, uniqueKeys: string[]) {
        for (const item of list) {
            const data: any = {
                organisasi_path: organisasiPath,
                date: date,
                total: item.total
            };
            // Mapkan properti dari item ke field entity berdasarkan keyMap
            for (const [sourceKey, targetKey] of Object.entries(keyMap)) {
                data[targetKey] = item[sourceKey];
            }
            // Hanya simpan jika total valid
            if (data.total !== null && data.total !== 0) {
                await this.upsert(data, entity, uniqueKeys);
            }
        }
    }

    async processStatusTree(statusArray: any[], organisasiPath: string, isoDate: Date) {
        for (const element of statusArray) {
            const data = {
                organisasi_path: organisasiPath,
                date: isoDate,
                status_id: Number(element.id),
                status_name: element.status_name,
                total: Number(element.total)
            };
            if (data.total !== null && data.total !== 0) {
                await this.upsert(data, DashboardStatus, ['organisasi_path', 'date', 'status_id']);
            }
            // Rekursif ke children jika ada
            if (Array.isArray(element.children) && element.children.length > 0) {
                await this.processStatusTree(element.children, organisasiPath, isoDate);
            }
        }
    }

    async upsertDashboard(date: string, data: object) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Gunakan composite key: ['date', 'organisasi_path']
            await queryRunner.manager.upsert(Dashboard, [data], ['date', 'organisasi_path']);

            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
    async upsert(data: object, entity: EntityClassOrSchema, primary_key: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.upsert(entity, [data], primary_key);
            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getIdsStatusSelesai() {
        let statusList = ['SP2LID', 'SP3', 'P21'];
        const treeRepository = this.dataSource.getTreeRepository(ReportStatus);
        const rootStatuses = await treeRepository.createQueryBuilder('ReportStatus').where('ReportStatus.status_name IN (:...statusList)', { statusList }).getMany();
        const allDescendantsTrees = await Promise.all(rootStatuses.map(status => treeRepository.findDescendantsTree(status)));
        function extractIdsFromTree(node: ReportStatus): number[] {
            const ids = [node.id];
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    ids.push(...extractIdsFromTree(child));
                }
            }
            return ids;
        }
        const allIds = allDescendantsTrees.flatMap(tree => extractIdsFromTree(tree));
        const uniqueIds = [...new Set(allIds)];
        return uniqueIds;
    }

    async getTotalReport(tanggal: string | Date, organisasi_id: number) {
        const queryBuilder = this.dataSource.getRepository(Report).createQueryBuilder('Report');
        const total = await queryBuilder.leftJoin('Report.Organisasi', 'Organisasi').where('Report.tanggal = :tanggal', { tanggal }).andWhere('Organisasi.id = :organisasi_id', { organisasi_id }).getCount();
        return total;
    }
    async getTotalTunggakanReport(tanggal: string | Date, organisasi_id: number) {
        const status_selesai = await this.getIdsStatusSelesai();
        // Hitung tanggal 1 tahun sebelumnya
        let tanggalReport = new Date(tanggal);
        tanggalReport.setFullYear(tanggalReport.getFullYear() - 1);

        const queryBuilder = this.dataSource.getRepository(Report).createQueryBuilder('Report');

        queryBuilder
            .leftJoin('Report.ReportStatus', 'ReportStatus')
            .leftJoin('Report.Organisasi', 'Organisasi')
            .andWhere('Organisasi.id = :organisasi_id', { organisasi_id })
            .where('Report.tanggal = :tanggalReport', { tanggalReport })
            .andWhere('ReportStatus.id NOT IN (:...status_selesai)', { status_selesai });
        const total = await queryBuilder.getCount();

        return total;
    }
    async getTotalReportDiselesaikan(tanggal: string | Date, organisasi_id: number) {
        const status_selesai = await this.getIdsStatusSelesai();
        const queryBuilder = this.dataSource.getRepository(Report).createQueryBuilder('Report');
        queryBuilder.leftJoin('Report.ReportStatus', 'ReportStatus').leftJoin('Report.Organisasi', 'Organisasi').where('ReportStatus.id IN (:...status_selesai)', { status_selesai }).andWhere('Organisasi.id = :organisasi_id', { organisasi_id });
        const total = await queryBuilder.andWhere('Report.tanggal = :tanggal', { tanggal }).getCount();
        return total;
    }
    async getTotalTunggakanDiselesaikan(tanggal: string | Date, organisasi_id: number) {
        const status_selesai = await this.getIdsStatusSelesai();

        // Hitung tanggal batas 1 tahun ke belakang dari `tanggal` input
        const batasTanggal = new Date(tanggal);
        batasTanggal.setFullYear(batasTanggal.getFullYear() - 1);

        const subQueryLogReportSelesaiPertama = this.dataSource.createQueryBuilder().select('MIN(lr_inner.tanggal_dinyatakan)', 'min_tanggal').from('trb_log_report', 'lr_inner').where('lr_inner.reportId = Report.id').andWhere('lr_inner.reportStatusId IN (:...status_selesai)', { status_selesai });

        const total = await this.dataSource
            .getRepository(Report)
            .createQueryBuilder('Report')
            .innerJoin('Report.Organisasi', 'Organisasi')
            .innerJoin('Report.LogReport', 'LogReport')
            .innerJoin('LogReport.ReportStatus', 'ReportStatus')
            .where('Organisasi.id = :organisasi_id', { organisasi_id })
            .andWhere('ReportStatus.id IN (:...status_selesai)', { status_selesai })
            .andWhere('Report.tanggal < :batasTanggal', { batasTanggal })
            .andWhere('LogReport.tanggal_dinyatakan = (' + subQueryLogReportSelesaiPertama.getQuery() + ')')
            .setParameters(subQueryLogReportSelesaiPertama.getParameters())
            .getCount();
        if (total != 0) {
            console.log(organisasi_id);
        }
        return total;
    }

    async getTotalKeterlibatan(tanggal: string | Date, entity: EntityClassOrSchema, organisasi_id: number) {
        const queryBuilder = this.dataSource.getRepository(entity).createQueryBuilder('ReportPelapor');
        const total = await queryBuilder.leftJoin('ReportPelapor.Report', 'Report').leftJoin('Report.Organisasi', 'Organisasi').where('Report.tanggal = :tanggal', { tanggal }).andWhere('Organisasi.id = :organisasi_id', { organisasi_id }).getCount();
        return total;
    }

    async getTotalTypeReport(tanggal: string | Date, organisasi_id: number) {
        const queryBuilder = this.dataSource.getRepository(TypeKejahatan).createQueryBuilder('TypeKejahatan');

        const rawResult = await queryBuilder
            .leftJoin('TypeKejahatan.JenisKejahatan', 'JenisKejahatan')
            .leftJoin('JenisKejahatan.Report', 'Report', 'Report.tanggal = :tanggal AND Report.organisasiId = :organisasi_id', {
                tanggal,
                organisasi_id
            })
            .select('TypeKejahatan.id', 'typeId')
            .addSelect('TypeKejahatan.name', 'typeName')
            .addSelect('COUNT(Report.id)', 'total')
            .groupBy('TypeKejahatan.id')
            .addGroupBy('TypeKejahatan.name')
            .getRawMany();

        return rawResult.map(row => ({
            typeId: Number(row.typeId),
            typeName: row.typeName,
            total: Number(row.total)
        }));
    }

    async getTotalKategoriReport(tanggal: string | Date, organisasi_id: number) {
        const queryBuilder = this.dataSource.getRepository(KategoriLp).createQueryBuilder('KategoriLp');

        const result = await queryBuilder
            .leftJoin('KategoriLp.JenisKejahatan', 'JenisKejahatan')
            .leftJoin('JenisKejahatan.Report', 'Report', 'Report.tanggal = :tanggal AND Report.organisasiId = :organisasi_id', {
                tanggal,
                organisasi_id
            })
            .select('KategoriLp.id', 'id')
            .addSelect('KategoriLp.name', 'name') // ganti sesuai nama kolom
            .addSelect('COUNT(Report.id)', 'total')
            .groupBy('KategoriLp.id')
            .addGroupBy('KategoriLp.name')
            .getRawMany();

        return result.map(row => ({
            id: Number(row.id),
            name: row.name,
            total: Number(row.total)
        }));
    }

    async getTotalKeteranganJenisKejahatan(tanggal: string | Date, organisasi_id: number) {
        const queryBuilder = this.dataSource.getRepository(JenisKejahatan).createQueryBuilder('JenisKejahatan');

        const result = await queryBuilder
            .leftJoin('JenisKejahatan.Report', 'Report', 'Report.tanggal = :tanggal AND Report.organisasiId = :organisasi_id', {
                tanggal,
                organisasi_id
            })
            .select('JenisKejahatan.id', 'id')
            .addSelect('JenisKejahatan.keterangan', 'keterangan')
            .addSelect('COUNT(Report.id)', 'total')
            .groupBy('JenisKejahatan.id')
            .addGroupBy('JenisKejahatan.keterangan')
            .getRawMany();

        return result.map(row => ({
            id: Number(row.id),
            keterangan: row.keterangan,
            total: Number(row.total)
        }));
    }

    async getTotalStatus(tanggal: string | Date, organisasi_id: number) {
        const treeRepository = this.dataSource.getTreeRepository(ReportStatus);

        // Ambil semua status root
        const rootStatuses = await treeRepository.findRoots();

        // Helper untuk ambil semua report count berdasarkan list ID
        const countReportsByStatusIds = async (ids: number[]) => {
            return this.dataSource.getRepository(Report).createQueryBuilder('Report').where('Report.tanggal = :tanggal', { tanggal }).andWhere('Report.organisasiId = :organisasi_id', { organisasi_id }).andWhere('Report.reportStatusId IN (:...ids)', { ids }).getCount();
        };

        // Helper untuk bangun tree beserta total
        const buildStatusTree = async (node: ReportStatus): Promise<any> => {
            const fullTree = await treeRepository.findDescendantsTree(node);

            // Kumpulkan semua id dari node dan anak-anaknya
            const collectIds = (n: ReportStatus): number[] => {
                let ids = [n.id];
                if (n.children) {
                    for (const child of n.children) {
                        ids = ids.concat(collectIds(child));
                    }
                }
                return ids;
            };

            const allIds = collectIds(fullTree);
            const total = await countReportsByStatusIds(allIds);

            // Susun struktur tree dengan children
            const buildChildren = async (n: ReportStatus): Promise<any> => {
                const thisTotal = await countReportsByStatusIds([n.id]);
                const children = await Promise.all((n.children || []).map(child => buildChildren(child)));
                return {
                    id: n.id,
                    status_name: n.status_name,
                    total: thisTotal,
                    children
                };
            };

            const nodeWithChildren = await buildChildren(node);
            nodeWithChildren.total = total; // overwrite parent total dengan total + anak
            return nodeWithChildren;
        };

        const result = await Promise.all(rootStatuses.map(root => buildStatusTree(root)));
        return result;
    }

    @Cron(CronExpression.EVERY_6_HOURS)
    async handleCron() {
        if (process.env.NODE_APP_INSTANCE === '0') {
            this.logger.log('⏰ Cron dijalankan oleh instance 0, Scheduled summary table refresh started...');
            await this.refreshSummaryTable();
        } else {
            this.logger.log('🚫 Cron dilewati oleh instance', process.env.NODE_APP_INSTANCE);
        }
    }
}
