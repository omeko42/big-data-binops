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
import { DashboardStatus } from '../entity/total_status.entity';
import { TypeKejahatan } from '@bareskrim/data_master/entities/laporan/type-kejahatan.entity';
import { DashboardTypeKejahatan } from '../entity/total_type_kejahatan.entity';
import { KategoriLp } from 'src/orgaisasi/entity/kategori-lp.entity';
import { DashboardKategoriKejahatan } from '../entity/total_kategori_kejahatan.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';
import { DashboardJenisKejahatan } from '../entity/total_jenis_kejahatan.entity';
import { isPrimaryClusterInstance } from 'src/bdb/common/cluster-instance.util';

@Injectable()
export class SummaryTableService {
    private readonly logger = new Logger(SummaryTableService.name);

    constructor(private readonly dataSource: DataSource) {}
    @Cron('0 0 1 * * *')
    async handleCron() {
        // Sebelumnya cek `NODE_APP_INSTANCE === '0'` langsung -- SALAH utk mode 1-proses (tanpa
        // PM2, env ini undefined, jadi cron ini tak pernah jalan sama sekali). isPrimaryClusterInstance()
        // benar utk kedua mode -- lihat cluster-instance.util.ts.
        if (isPrimaryClusterInstance()) {
            this.logger.log('Scheduled summary table refresh started...');
            await this.refreshSummaryTable();
        } else {
            this.logger.log('🚫 Cron dilewati oleh instance', process.env.NODE_APP_INSTANCE);
        }
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    async handleCronNow() {
        if (isPrimaryClusterInstance()) {
            this.logger.log('Scheduled summary table refresh started...');
            const date_now = new Date();
            const one_week_later = new Date(date_now);
            one_week_later.setDate(one_week_later.getDate() + 7);
            await this.refreshSummaryTable(date_now, one_week_later);
        } else {
            this.logger.log('🚫 Cron dilewati oleh instance', process.env.NODE_APP_INSTANCE);
        }
    }

    async refreshSummaryTable(startDate?: Date, endDate?: Date) {
        // Jika startDate tidak diberikan, ambil dari data paling awal
        if (!startDate) {
            const first_date = await this.dataSource.getRepository(Report).find({
                order: { tanggal: 'ASC' },
                take: 1
            });

            startDate = first_date[0] ? new Date(first_date[0].tanggal) : null;
        }

        // Jika endDate tidak diberikan, gunakan tanggal hari ini
        if (!endDate) {
            endDate = new Date();
        }

        // Validasi apakah startDate masih null
        if (!startDate) {
            this.logger.warn('Start date is not found. Aborting summary refresh.');
            return;
        }

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const isoDate = currentDate.toISOString().slice(0, 10);

            const dataToUpsert = await this.getSummaryPerTanggal(isoDate);
            if (dataToUpsert.length > 0) {
                await this.upsertDashboardBatch(dataToUpsert);
            }
            // this.getTotalTypeReportByTanggal(isoDate);
            // this.getTotalKategoriKejahatanByTanggal(isoDate);
            // this.getTotalJenisKejahatanByTanggal(isoDate);
            // this.getTotalStatusByTanggalAndOrganisasi(isoDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return 'All upserts asd';
    }
    async getSummaryPerTanggal(tanggal: string) {
        const status_selesai = await this.getIdsStatusSelesai();

        if (!status_selesai || !Array.isArray(status_selesai)) {
            throw new Error('status_selesai is undefined or not an array');
        }

        const tanggalString = tanggal;
        const batasTanggal = new Date(tanggal);
        batasTanggal.setFullYear(batasTanggal.getFullYear() - 1);
        const batasTanggalString = batasTanggal.toISOString().slice(0, 10);

        // Placeholder untuk status selesai di query IN (...)
        const statusPlaceholders = status_selesai.map(() => '?').join(',');

        const query = `
      SELECT
        o.id AS organisasi_id,
        o.path AS organisasi_path,
        ol.path AS level_path,
        rkl.id AS kategori_id,
        ? AS date,

        -- Total laporan baru pada tanggal tsb
        COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) AS total,

        -- Total laporan tunggakan yang selesai di tanggal tsb
        COUNT(DISTINCT CASE
          WHEN r.tanggal < ?
            AND EXISTS (
              SELECT 1
              FROM trb_log_report lr
              WHERE lr.reportId = r.id
                AND lr.reportStatusId IN (${statusPlaceholders})
                AND (
                  SELECT MIN(lr2.tanggal_dinyatakan)
                  FROM trb_log_report lr2
                  WHERE lr2.reportId = lr.reportId
                    AND lr2.reportStatusId IN (${statusPlaceholders})
                ) = ?
            )
          THEN r.id
        END) AS total_tunggakan_status_selesai,

        -- Total laporan baru yang langsung selesai
        COUNT(DISTINCT CASE
          WHEN r.tanggal = ?
            AND r.reportStatusId IN (${statusPlaceholders})
          THEN r.id
        END) AS total_status_selesai,

        -- Entitas terkait laporan
        COUNT(DISTINCT rp.id) AS total_pelapor,
        COUNT(DISTINCT rt.id) AS total_terlapor,
        COUNT(DISTINCT CASE WHEN rt.terlaporStatusId = 2 THEN rt.id END) AS total_dpo,
        COUNT(DISTINCT CASE WHEN rt.terlaporStatusId = 3 THEN rt.id END) AS total_tersangka,
        COUNT(DISTINCT rk.id) AS total_korban,
        COUNT(DISTINCT rsak.id) AS total_saksi

      FROM trb_report r
      JOIN tm_org o ON o.id = r.organisasiId
      LEFT JOIN trb_report_status rs ON rs.id = r.reportStatusId
      LEFT JOIN cm_jenis_kejahatan rjk ON rjk.id = r.jenisKejahatanId
      LEFT JOIN tm_kategori_lp rkl ON rkl.id = rjk.kategoriLpId
      LEFT JOIN tm_org_level ol ON ol.id = o.organisasiLevelId
      LEFT JOIN trb_report_pelapor rp ON rp.reportId = r.id
      LEFT JOIN trb_report_terlapor rt ON rt.reportId = r.id
      LEFT JOIN trb_report_korban rk ON rk.reportId = r.id
      LEFT JOIN trb_report_saksi rsak ON rsak.reportId = r.id

      WHERE r.tanggal = ? OR r.tanggal < ?

      GROUP BY o.id, o.path, ol.path, rkl.id

      HAVING
        COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) > 0
        OR COUNT(DISTINCT CASE
          WHEN r.tanggal < ?
            AND EXISTS (
              SELECT 1
              FROM trb_log_report lr
              WHERE lr.reportId = r.id
                AND lr.reportStatusId IN (${statusPlaceholders})
                AND (
                  SELECT MIN(lr2.tanggal_dinyatakan)
                  FROM trb_log_report lr2
                  WHERE lr2.reportId = lr.reportId
                    AND lr2.reportStatusId IN (${statusPlaceholders})
                ) = ?
            )
          THEN r.id
        END) > 0
    `;

        // Susun parameter secara berurutan sesuai urutan '?'
        const params = [
            tanggalString, // SELECT ? AS date
            tanggalString, // r.tanggal = ?
            batasTanggalString, // r.tanggal < ?

            ...status_selesai, // lr.reportStatusId IN (...)
            ...status_selesai, // lr2.reportStatusId IN (...)
            tanggalString, // MIN(...) = ?

            tanggalString, // r.tanggal = ? (total_status_selesai)
            ...status_selesai, // r.reportStatusId IN (...)

            tanggalString, // WHERE r.tanggal = ?
            batasTanggalString, // WHERE r.tanggal < ?

            tanggalString, // HAVING r.tanggal = ?
            batasTanggalString, // HAVING r.tanggal < ?

            ...status_selesai, // HAVING EXISTS lr.reportStatusId IN (...)
            ...status_selesai, // HAVING EXISTS lr2.reportStatusId IN (...)
            tanggalString // HAVING MIN(...) = ?
        ];

        const rawResults = await this.dataSource.query(query, params);

        return rawResults.map(row => ({
            date: row.date,
            organisasi_path: row.organisasi_path,
            total: Number(row.total),
            total_status_selesai: Number(row.total_status_selesai),
            total_tunggakan_status_selesai: Number(row.total_tunggakan_status_selesai),
            total_pelapor: Number(row.total_pelapor),
            total_terlapor: Number(row.total_terlapor),
            total_dpo: Number(row.total_dpo),
            total_tersangka: Number(row.total_tersangka),
            total_korban: Number(row.total_korban),
            total_saksi: Number(row.total_saksi),
            kategori_id: Number(row.kategori_id),
            level_path: row.level_path
        }));
    }

    async upsertDashboardBatch(dataArray: object[]) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // console.log(dataArray);

            await queryRunner.manager.upsert(Dashboard, dataArray, ['date', 'organisasi_path', 'kategori_id', 'level_path']);
            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            this.logger.log(error.message + dataArray);
            await queryRunner.rollbackTransaction();
            this.logger.log('error' + error.message);
            this.logger.log(JSON.stringify(dataArray));
            throw new Error(`Failed to upsert batch summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getIdsStatusSelesai(): Promise<number[]> {
        // const statusList = ['TAHAP2', 'SP2LID', 'SP3'];
        const statusList = ['SP2LID', 'SP3', 'P21'];
        const treeRepository = this.dataSource.getTreeRepository(ReportStatus);

        // Ambil root statuses berdasarkan nama status
        const rootStatuses = await treeRepository.createQueryBuilder('ReportStatus').where('ReportStatus.status_name IN (:...statusList)', { statusList }).getMany();

        if (!rootStatuses || rootStatuses.length === 0) {
            return []; // Jika tidak ada root status, langsung return array kosong
        }

        // Ambil tree descendants untuk setiap root status
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

        // Kumpulkan semua id dari setiap tree, lalu hapus duplikat
        const allIds = allDescendantsTrees.flatMap(tree => {
            if (!tree) return [];
            return extractIdsFromTree(tree);
        });

        const uniqueIds = [...new Set(allIds)];

        return uniqueIds;
    }

    async getTotalTypeReportByTanggal(tanggal: string | Date) {
        const status_selesai = await this.getIdsStatusSelesai();

        if (!status_selesai || !Array.isArray(status_selesai)) {
            throw new Error('status_selesai is undefined or not an array');
        }

        const tanggalString = typeof tanggal === 'string' ? tanggal : tanggal.toISOString().slice(0, 10);
        const batasTanggal = new Date(tanggalString);
        batasTanggal.setFullYear(batasTanggal.getFullYear() - 1);
        const batasTanggalString = batasTanggal.toISOString().slice(0, 10);

        const statusPlaceholders = status_selesai.map(() => '?').join(',');

        const query = `
    SELECT
      o.id AS organisasi_id,
      o.path AS organisasi_path,
      rtk.id AS type_id,
      rtk.name AS type_name,
      ol.path AS level_path,
      rkl.id AS kategori_id,
      ? AS date,

      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) AS total,

      COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) AS total_tunggakan_status_selesai,

      COUNT(DISTINCT CASE
        WHEN r.tanggal = ?
          AND r.reportStatusId IN (${statusPlaceholders})
        THEN r.id
      END) AS total_status_selesai

    FROM trb_report r
    JOIN tm_org o ON o.id = r.organisasiId
    LEFT JOIN cm_jenis_kejahatan rjk ON rjk.id = r.jenisKejahatanId
    LEFT JOIN tm_type_kejahatan rtk ON rtk.id = rjk.typeKejahatanId
    LEFT JOIN tm_kategori_lp rkl ON rkl.id = rjk.kategoriLpId
    LEFT JOIN tm_org_level ol ON ol.id = o.organisasiLevelId

    WHERE r.tanggal = ? OR r.tanggal < ?

    GROUP BY r.tanggal, o.path, rtk.id, ol.path, rkl.id

    HAVING
      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) > 0
      OR COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) > 0
  `;

        const params = [
            tanggalString, // SELECT ? AS date
            tanggalString, // CASE r.tanggal = ?
            batasTanggalString, // CASE r.tanggal < ?

            ...status_selesai, // lr.reportStatusId IN (...)
            ...status_selesai, // lr2.reportStatusId IN (...)
            tanggalString, // MIN(...) = ?

            tanggalString, // total_status_selesai: r.tanggal = ?
            ...status_selesai, // r.reportStatusId IN (...)

            tanggalString, // WHERE r.tanggal = ?
            batasTanggalString, // OR r.tanggal < ?

            tanggalString, // HAVING r.tanggal = ?
            batasTanggalString, // HAVING r.tanggal < ?

            ...status_selesai, // HAVING EXISTS lr.reportStatusId IN (...)
            ...status_selesai, // HAVING EXISTS lr2.reportStatusId IN (...)
            tanggalString // HAVING MIN(...) = ?
        ];

        const rawResults = await this.dataSource.query(query, params);
        if (rawResults.length == 0) {
            return 'no data';
        }

        const datas = rawResults.map(row => ({
            date: row.date,
            organisasi_path: row.organisasi_path,
            type_id: Number(row.type_id),
            type_name: row.type_name,
            total: Number(row.total),
            total_selesai: Number(row.total_status_selesai),
            total_tunggakan_status_selesai: Number(row.total_tunggakan_status_selesai),
            kategori_id: Number(row.kategori_id),
            level_path: row.level_path
        }));

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.upsert(
                DashboardTypeKejahatan,
                datas,
                ['date', 'organisasi_path', 'type_id', 'kategori_id', 'level_path'] // pastikan ini field unik di entitas
            );

            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            this.logger.log('error' + error.message);
            this.logger.log(JSON.stringify(datas));
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert batch summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getTotalKategoriKejahatanByTanggal(tanggal: string | Date) {
        const status_selesai = await this.getIdsStatusSelesai();

        if (!status_selesai || !Array.isArray(status_selesai)) {
            throw new Error('status_selesai is undefined or not an array');
        }

        const tanggalString = typeof tanggal === 'string' ? tanggal : tanggal.toISOString().slice(0, 10);
        const batasTanggal = new Date(tanggalString);
        batasTanggal.setFullYear(batasTanggal.getFullYear() - 1);
        const batasTanggalString = batasTanggal.toISOString().slice(0, 10);

        const statusPlaceholders = status_selesai.map(() => '?').join(',');

        const query = `
    SELECT
      o.id AS organisasi_id,
      o.path AS organisasi_path,
      rkl.id AS kategori_id,
      rkl.name AS kategori_name,
      ol.path AS level_path,
      rkl.id AS kategori_id,
      ? AS date,

      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) AS total,

      COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) AS total_tunggakan_status_selesai,

      COUNT(DISTINCT CASE
        WHEN r.tanggal = ?
          AND r.reportStatusId IN (${statusPlaceholders})
        THEN r.id
      END) AS total_status_selesai

    FROM trb_report r
    JOIN tm_org o ON o.id = r.organisasiId
    LEFT JOIN cm_jenis_kejahatan rjk ON rjk.id = r.jenisKejahatanId
    LEFT JOIN tm_kategori_lp rkl ON rkl.id = rjk.kategoriLpId
    LEFT JOIN tm_org_level ol ON ol.id = o.organisasiLevelId

    WHERE r.tanggal = ? OR r.tanggal < ?

    GROUP BY r.tanggal, o.path, ol.path, rkl.id

    HAVING
      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) > 0
      OR COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) > 0
  `;

        const params = [
            tanggalString, // SELECT ? AS date
            tanggalString, // CASE r.tanggal = ?
            batasTanggalString, // CASE r.tanggal < ?

            ...status_selesai, // lr.reportStatusId IN (...)
            ...status_selesai, // lr2.reportStatusId IN (...)
            tanggalString, // MIN(...) = ?

            tanggalString, // total_status_selesai: r.tanggal = ?
            ...status_selesai, // r.reportStatusId IN (...)

            tanggalString, // WHERE r.tanggal = ?
            batasTanggalString, // OR r.tanggal < ?

            tanggalString, // HAVING r.tanggal = ?
            batasTanggalString, // HAVING r.tanggal < ?

            ...status_selesai, // HAVING EXISTS lr.reportStatusId IN (...)
            ...status_selesai, // HAVING EXISTS lr2.reportStatusId IN (...)
            tanggalString // HAVING MIN(...) = ?
        ];

        const rawResults = await this.dataSource.query(query, params);
        if (rawResults.length == 0) {
            return 'no data';
        }
        const datas = rawResults.map(row => ({
            date: row.date,
            organisasi_path: row.organisasi_path,
            kategori_id: Number(row.kategori_id),
            kategori_name: row.kategori_name,
            total: Number(row.total),
            total_selesai: Number(row.total_status_selesai),
            total_tunggakan_status_selesai: Number(row.total_tunggakan_status_selesai),
            level_path: row.level_path
        }));

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.upsert(
                DashboardKategoriKejahatan,
                datas,
                ['date', 'organisasi_path', 'kategori_id', 'level_path'] // pastikan ini field unik di entitas
            );

            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            this.logger.log('error' + error.message);
            this.logger.log(JSON.stringify(datas));
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert batch summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getTotalJenisKejahatanByTanggal(tanggal: string | Date) {
        const status_selesai = await this.getIdsStatusSelesai();
        if (!status_selesai || !Array.isArray(status_selesai)) {
            throw new Error('status_selesai is undefined or not an array');
        }

        const tanggalString = typeof tanggal === 'string' ? tanggal : tanggal.toISOString().slice(0, 10);
        const batasTanggal = new Date(tanggalString);
        batasTanggal.setFullYear(batasTanggal.getFullYear() - 1);
        const batasTanggalString = batasTanggal.toISOString().slice(0, 10);

        const statusPlaceholders = status_selesai.map(() => '?').join(',');

        const query = `
    SELECT
      o.id AS organisasi_id,
      o.path AS organisasi_path,
      rjk.id AS jenis_kejahatan_id,
      rjk.keterangan AS jenis_kejahatan_name,
            ol.path AS level_path,
      rkl.id AS kategori_id,
      ? AS date,

      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) AS total,

      COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) AS total_tunggakan_status_selesai,

      COUNT(DISTINCT CASE
        WHEN r.tanggal = ?
          AND r.reportStatusId IN (${statusPlaceholders})
        THEN r.id
      END) AS total_status_selesai,
      
       COUNT(DISTINCT CASE
        WHEN r.tanggal = ?
          AND r.reportStatusId = 14
        THEN r.id
      END) AS total_selesai_rjlid,

      COUNT(DISTINCT CASE
        WHEN r.tanggal = ?
          AND r.reportStatusId = 22
        THEN r.id
      END) AS total_selesai_rjsid

    FROM trb_report r
    JOIN tm_org o ON o.id = r.organisasiId
    LEFT JOIN cm_jenis_kejahatan rjk ON rjk.id = r.jenisKejahatanId
        LEFT JOIN tm_kategori_lp rkl ON rkl.id = rjk.kategoriLpId
    LEFT JOIN tm_org_level ol ON ol.id = o.organisasiLevelId

    WHERE r.tanggal = ? OR r.tanggal < ?

    GROUP BY r.tanggal, o.path, rjk.id, ol.path, rkl.id

    HAVING
      COUNT(DISTINCT CASE WHEN r.tanggal = ? THEN r.id END) > 0
      OR COUNT(DISTINCT CASE
        WHEN r.tanggal < ?
          AND EXISTS (
            SELECT 1
            FROM trb_log_report lr
            WHERE lr.reportId = r.id
              AND lr.reportStatusId IN (${statusPlaceholders})
              AND (
                SELECT MIN(lr2.tanggal_dinyatakan)
                FROM trb_log_report lr2
                WHERE lr2.reportId = lr.reportId
                  AND lr2.reportStatusId IN (${statusPlaceholders})
              ) = ?
          )
        THEN r.id
      END) > 0
  `;

        const params = [
            tanggalString, // ? AS date
            tanggalString, // r.tanggal = ?
            batasTanggalString, // r.tanggal < ?

            ...status_selesai, // lr.reportStatusId IN (...)
            ...status_selesai, // lr2.reportStatusId IN (...)
            tanggalString, // MIN(lr2.tanggal_dinyatakan) = ?

            tanggalString, // r.tanggal = ? (total_status_selesai)
            ...status_selesai, // r.reportStatusId IN (...)
            tanggalString, // r.tanggal = ? (total_selesai_rjlid)
            tanggalString, // r.tanggal = ? (total_selesai_rjsid)

            tanggalString, // WHERE r.tanggal = ?
            batasTanggalString, // WHERE r.tanggal < ?

            tanggalString, // HAVING r.tanggal = ?
            batasTanggalString, // HAVING r.tanggal < ?

            ...status_selesai, // HAVING lr.reportStatusId IN (...)
            ...status_selesai, // HAVING lr2.reportStatusId IN (...)
            tanggalString // HAVING MIN(lr2.tanggal_dinyatakan) = ?
        ];

        const rawResults = await this.dataSource.query(query, params);
        // function formatQueryWithParams(query, params) {
        //     let i = 0;
        //     return query.replace(/\?/g, () => {
        //         if (i >= params.length) return '?';
        //         const param = params[i++];
        //         if (typeof param === 'string') {
        //             // Escape single quotes dan bungkus dengan tanda kutip
        //             return `'${param.replace(/'/g, "''")}'`;
        //         }
        //         if (param === null || param === undefined) {
        //             return 'NULL';
        //         }
        //         return param;
        //     });
        // }
        // console.log(formatQueryWithParams(query, params));

        if (rawResults.length == 0) {
            return 'no data';
        }

        const datas = rawResults.map(row => ({
            date: row.date,
            organisasi_path: row.organisasi_path,
            jenis_kejahatan_id: Number(row.jenis_kejahatan_id),
            jenis_kejahatan_name: row.jenis_kejahatan_name,
            total: Number(row.total),
            total_selesai: Number(row.total_status_selesai),
            total_tunggakan_status_selesai: Number(row.total_tunggakan_status_selesai),
            total_selesai_rjlid: Number(row.total_selesai_rjlid),
            total_selesai_rjsid: Number(row.total_selesai_rjsid),
            kategori_id: Number(row.kategori_id),
            level_path: row.level_path
        }));

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.upsert(
                DashboardJenisKejahatan,
                datas,
                ['date', 'organisasi_path', 'jenis_kejahatan_id', 'kategori_id', 'level_path'] // pastikan ini field unik di entitas
            );

            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            this.logger.log('error' + error.message);
            this.logger.log(JSON.stringify(datas));
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert batch summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
    async getTotalStatusByTanggalAndOrganisasi(tanggal: string | Date) {
        const treeRepository = this.dataSource.getTreeRepository(ReportStatus);
        const rootStatuses = await treeRepository.findRoots();

        const flatResults: {
            date: string | Date;
            status_id: number;
            status_name: string;
            organisasi_path: string;
            level_path: string;
            kategori_id: number;
            total: number;
        }[] = [];

        // Step 1: Ambil semua organisasi ID + path + level_path + kategori_id yg punya laporan di tanggal tsb
        const organisasiResult = await this.dataSource
            .getRepository(Report)
            .createQueryBuilder('Report')
            .innerJoin('Report.Organisasi', 'Organisasi')
            .innerJoin('Organisasi.OrganisasiLevel', 'OrganisasiLevel')
            .innerJoin('Report.JenisKejahatan', 'JenisKejahatan')
            .innerJoin('JenisKejahatan.KategoriLp', 'KategoriLp')
            .select(['Report.organisasiId AS organisasi_id', 'Organisasi.path AS organisasi_path', 'OrganisasiLevel.path AS level_path', 'KategoriLp.id AS kategori_id'])
            .distinct(true)
            .where('Report.tanggal = :tanggal', { tanggal })
            .getRawMany();

        // Step 2: Fungsi bantu ambil semua ID anak dari status
        const collectDescendantIds = (node: ReportStatus): number[] => {
            let ids = [node.id];
            if (node.children) {
                for (const child of node.children) {
                    ids = ids.concat(collectDescendantIds(child));
                }
            }
            return ids;
        };

        // Step 3: Bangun data flat untuk semua kombinasi status × organisasi × level × kategori
        const buildFlatData = async (node: ReportStatus, organisasi_id: number, organisasi_path: string, level_path: string, kategori_id: number) => {
            const fullTree = await treeRepository.findDescendantsTree(node);
            const allStatusIds = collectDescendantIds(fullTree);

            const total = await this.dataSource
                .getRepository(Report)
                .createQueryBuilder('Report')
                .innerJoin('Report.Organisasi', 'Organisasi')
                .innerJoin('Organisasi.OrganisasiLevel', 'OrganisasiLevel')
                .innerJoin('Report.JenisKejahatan', 'JenisKejahatan')
                .innerJoin('JenisKejahatan.KategoriLp', 'KategoriLp')
                .where('Report.tanggal = :tanggal', { tanggal })
                .andWhere('Report.organisasiId = :organisasi_id', { organisasi_id })
                .andWhere('Report.reportStatusId IN (:...statusIds)', { statusIds: allStatusIds })
                .andWhere('KategoriLp.id = :kategori_id', { kategori_id }) // filter sesuai kategori yg sedang dihitung
                .andWhere('OrganisasiLevel.path = :level_path', { level_path }) // filter sesuai level yg sedang dihitung
                .getCount();

            if (total > 0) {
                flatResults.push({
                    date: tanggal,
                    status_id: node.id,
                    status_name: node.status_name,
                    organisasi_path,
                    level_path,
                    kategori_id,
                    total
                });
            }

            if (node.children) {
                for (const child of node.children) {
                    await buildFlatData(child, organisasi_id, organisasi_path, level_path, kategori_id);
                }
            }
        };

        for (const { organisasi_id, organisasi_path, level_path, kategori_id } of organisasiResult) {
            for (const root of rootStatuses) {
                await buildFlatData(root, organisasi_id, organisasi_path, level_path, kategori_id);
            }
        }

        if (flatResults.length === 0) {
            return 'no data';
        }

        // Step 4: Simpan ke tabel dashboard
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            console.log(flatResults);

            await queryRunner.manager.upsert(
                DashboardStatus,
                flatResults,
                ['date', 'status_id', 'organisasi_path', 'kategori_id', 'level_path'] // <- key unik
            );
            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            this.logger.error('Upsert error:', error);
            this.logger.error('Payload:', JSON.stringify(flatResults));
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to upsert status summary data: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}
