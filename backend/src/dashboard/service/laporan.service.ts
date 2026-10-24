import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DateService } from '@app_core/helper/service/date.helper.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { Report } from '@bareskrim/report/entities/report.entity';
import { join } from 'path';
import { promises as fsPromises, writeFileSync } from 'fs';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { DashboardJenisKejahatan } from '../entity/total_jenis_kejahatan.entity';
// import { AksesLpHelper } from './akses-lp.helper';

@Injectable()
export class LaporanService {
    constructor(
        private dateService: DateService,
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async jenisKejahatan(req: any, @CurrentUser() authUser) {
        let request = req;
        const berjalan = await this.getJenisKejahatan(request, authUser);

        // Step 1: Ambil dan validasi input
        let filters = {
            searchBeetwen: request.query.searchBeetwen, // contoh: ["date"]
            searchBeetwenStart: Array.isArray(request.query.searchBeetwenStart) ? request.query.searchBeetwenStart : [],
            searchBeetwenEnd: Array.isArray(request.query.searchBeetwenEnd) ? request.query.searchBeetwenEnd : []
        };

        // Filter tanggal valid (bukan string 'string' dan bukan kosong)
        const rawStartDates = filters.searchBeetwenStart.filter(date => date && date !== 'string');
        const rawEndDates = filters.searchBeetwenEnd.filter(date => date && date !== 'string');

        const startDateStr: string | undefined = rawStartDates[0];
        const endDateStr: string | undefined = rawEndDates[0];

        if (startDateStr && endDateStr && !isNaN(new Date(startDateStr).getTime()) && !isNaN(new Date(endDateStr).getTime())) {
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);
            let newStartDate, newEndDate;
            if (startDate.getTime() === endDate.getTime()) {
                newStartDate = new Date(startDate);
                newStartDate.setDate(newStartDate.getDate() - 1);
                newEndDate = new Date(endDate);
                newEndDate.setDate(newEndDate.getDate() - 1);
            } else {
                const diffInMs = endDate.getTime() - startDate.getTime();
                newStartDate = new Date(startDate.getTime() - diffInMs -1);
                newEndDate = new Date(endDate.getTime() - diffInMs -1);
            }

            // Step 4: Format ke string
            const formatDate = date => date.toISOString().split('T')[0];
            let requestSebelumnya = { ...request, query: { pagination: 'false', searchBeetwen: [], searchBeetwenStart: [], searchBeetwenEnd: [] } }; // optional: clone object if needed
            requestSebelumnya.query.searchBeetwen = ['date', 'string'];
            requestSebelumnya.query.searchBeetwenStart = [formatDate(newStartDate), 'string'];
            requestSebelumnya.query.searchBeetwenEnd = [formatDate(newEndDate), 'string'];
            // Lanjutkan proses menggunakan tanggal yang dimundurkan
            const sebelumnya = await this.getJenisKejahatan(requestSebelumnya, authUser);
            return {
                bejralan: berjalan,
                periode_sebelumnya: sebelumnya,
                keterangan: {
                    periode_berjalan: { start_date: startDateStr, end_date: endDateStr },
                    periode_sebelumnya: { start_date: formatDate(newStartDate), end_date: formatDate(newEndDate) }
                }
            };
            // unakan 'sebelumnya' sesuai kebutuhan
        } else {
            console.log('Tanggal tidak valid atau kosong.');
        }
    }

    async getJenisKejahatan(request, authUser) {
        const queryBuilder = await this.dataSource
            .createQueryBuilder(DashboardJenisKejahatan, 'Dashboard')
            .select('Dashboard.jenis_kejahatan_id', 'jenis_kejahatan_id')
            .addSelect('Dashboard.jenis_kejahatan_name', 'jenis_kejahatan_name')
            .addSelect('SUM(Dashboard.total)', 'total')
            .addSelect('SUM(Dashboard.total_selesai)', 'total_selesai')
            .addSelect('SUM(Dashboard.total_selesai_rjlid)', 'total_selesai_rjlid')
            .addSelect('SUM(Dashboard.total_selesai_rjsid)', 'total_selesai_rjsid')
            .where('Dashboard.organisasi_path LIKE :path', { path: `${authUser.Organisasi.path}%` })
            .groupBy('Dashboard.jenis_kejahatan_id')
            .addGroupBy('Dashboard.jenis_kejahatan_name');
        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'Dashboard',
            searchingAll: ['id'],
            searching: ['id', 'created_at', 'updated_at'],
            searchingOption: ['id', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'date', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'created_at', 'updated_at'],
            sorting: ['id', 'created_at', 'updated_at'],
            // defaultSorting: 'Dashboard.date',
            joins: [],
            result: 'raw'
        });
        const queryBuilderTunggakan = await this.dataSource
            .createQueryBuilder(DashboardJenisKejahatan, 'Dashboard')
            .select('Dashboard.jenis_kejahatan_id', 'jenis_kejahatan_id')
            .addSelect('Dashboard.jenis_kejahatan_name', 'jenis_kejahatan_name')
            .addSelect('SUM(Dashboard.total)', 'total')
            .addSelect('SUM(Dashboard.total_selesai)', 'total_selesai')
            .addSelect('SUM(Dashboard.total_tunggakan_status_selesai)', 'total_tunggakan_status_selesai')
            .addSelect('SUM(Dashboard.total_selesai_rjlid)', 'total_selesai_rjlid')
            .addSelect('SUM(Dashboard.total_selesai_rjsid)', 'total_selesai_rjsid')
            .where('Dashboard.organisasi_path LIKE :path', { path: `${authUser.Organisasi.path}%` })
            .groupBy('Dashboard.jenis_kejahatan_id')
            .addGroupBy('Dashboard.jenis_kejahatan_name');
        let filters = {
            searchBeetwen: request.query.searchBeetwen, // ["date", "string"]
            searchBeetwenStart: request.query.searchBeetwenStart, // ["2025-01-01", "string"]
            searchBeetwenEnd: request.query.searchBeetwenEnd // ["2025-01-01", "string"]
        };
        filters.searchBeetwen.forEach((field: string, index: number) => {
            const start = filters.searchBeetwenStart[index];
            if (start && ['date'].includes(field)) {
                const beforeOneYearParam = `beforeOneYearFromStart${index}`;
                const beforeOneYear = new Date(start);
                beforeOneYear.setFullYear(beforeOneYear.getFullYear() - 1);
                queryBuilderTunggakan.andWhere(`Dashboard.${field} <= :${beforeOneYearParam}`, {
                    [beforeOneYearParam]: beforeOneYear.toISOString().split('T')[0]
                });
            }
        });
        const resultTUnggakan = await this.tableHelper.applyFilters(queryBuilderTunggakan, request, {
            coreTable: 'Dashboard',
            searchingAll: ['id'],
            searching: ['id', 'created_at', 'updated_at'],
            searchingOption: ['id', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'created_at', 'updated_at'],
            // searchingBeetween: ['id', 'date', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'created_at', 'updated_at'],
            sorting: ['id', 'created_at', 'updated_at'],
            // defaultSorting: 'Dashboard.date',
            joins: [],
            result: 'raw'
        });

        const tunggakanMap = {};
        resultTUnggakan.data.forEach(item => {
            tunggakanMap[item.jenis_kejahatan_id] = item;
        });

        // Gabungkan kedua array
        let resultMerge = [];

        // Ambil semua jenis_kejahatan_id unik dari kedua array
        const uniqueIds = new Set([...result.data.map(item => item.jenis_kejahatan_id), ...resultTUnggakan.data.map(item => item.jenis_kejahatan_id)]);

        uniqueIds.forEach(id => {
            const dataItem = result.data.find(item => item.jenis_kejahatan_id === id);
            const tunggakanItem = tunggakanMap[id];
            const totalSelesai = (dataItem?.total_selesai || 0) + (tunggakanItem?.total_selesai || 0);
            const total = (dataItem?.total || 0) + (tunggakanItem?.total || 0);

            const persentase = total === 0 ? '0%' : ((totalSelesai / total) * 100).toFixed(2) + '%';

            resultMerge.push({
                jenis_kejahatan_id: id,
                jenis_kejahatan_name: tunggakanItem?.jenis_kejahatan_name || dataItem?.jenis_kejahatan_name || '',
                total_berjalan: dataItem?.total || '0',
                total_berjalan_status_selesai: dataItem?.total_selesai || '0',
                total_tunggakan: tunggakanItem?.total || '0',
                total_tunggakan_status_selesai: tunggakanItem?.total_selesai ?? '0',
                total_selesai_rjlid: dataItem?.total_selesai_rjlid ?? '0',
                total_selesai_rjsid: dataItem?.total_selesai_rjsid ?? '0',
                total_tunggakan_selesai_rjlid: tunggakanItem?.total_selesai_rjlid ?? '0',
                total_tunggakan_selesai_rjsid: tunggakanItem?.total_selesai_rjsid ?? '0',
                persentase: persentase
            });
        });

        return resultMerge;
    }
}
