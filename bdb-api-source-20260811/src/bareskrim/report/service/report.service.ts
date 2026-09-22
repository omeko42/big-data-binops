import { BadRequestException, Inject, Injectable, Req } from '@nestjs/common';
import { CreateReportDto } from '@bareskrim/report/dto/create-report.dto';
import { createManualReportDto, UpdateKategoriLpReportDto, UpdateReportDto, UpdateStatusReportDto, UpdateDistribusiReportDto } from '@bareskrim/report/dto/update-report.dto';
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
import { DirectorateRole } from '@bareskrim/directorate/entities/directorate-role.entity';
import { LogReport } from '../entities/log-report.entity';
import * as moment from 'moment';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { join } from 'path';
import { promises as fsPromises, writeFileSync } from 'fs';
import { ReportStatusService } from './report-status.service';
import { ReportPelapor } from '../entities/report-pelapor.entity';
import { ReportKorban } from '../entities/report-korban.entity';
import { ReportTerlapor } from '../entities/report-terlapor.entity';
import { ReportSaksi } from '../entities/report-saksi.entity';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { AksesLpHelper } from './akses-lp.helper';
import { Organisasi } from '../../../orgaisasi/entity/organisasi.entity';
import { OrganisasiService } from '../../../orgaisasi/service/organisasi.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ReportService {
    private readonly reportExcelRepository: Repository<ReportExcel>;
    private readonly logImportRepository: Repository<LogImport>;
    private readonly reportRepository: Repository<Report>;
    private readonly duplicatedReportRepository: Repository<DuplicatedReport>;
    private readonly directorateReport: Repository<DirectorateReport>;
    private readonly directorate: Repository<Directorate>;
    constructor(
        private dateService: DateService,
        private readonly dataSource: DataSource,
        private readonly optionReportStatusService: ReportStatusService,
        private readonly optionOrganisasiService: OrganisasiService,
        private readonly tableHelper: TableHelperService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        (this.reportExcelRepository = this.dataSource.getRepository(ReportExcel)),
            (this.logImportRepository = this.dataSource.getRepository(LogImport)),
            (this.duplicatedReportRepository = this.dataSource.getRepository(DuplicatedReport)),
            (this.reportRepository = this.dataSource.getRepository(Report)),
            (this.directorateReport = this.dataSource.getRepository(DirectorateReport)),
            (this.directorate = this.dataSource.getRepository(Directorate));
    }

    async transform(createReportDto: CreateReportDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const logimport = await queryRunner.manager.findOne(LogImport, {
                where: { id: createReportDto.log_import_id }
            });
            if (logimport.status != 1) {
                const data = await queryRunner.manager.find(ReportExcel, {
                    where: { LogImport: { id: createReportDto.log_import_id } }
                });
                let duplicatedData = 0;
                let transformData = 0;
                let emptyRow = 0;
                for (const element of data) {
                    let insertedId = null;
                    let reportStatusId = null;
                    const reportStatus = await queryRunner.manager.findOne(ReportStatus, {
                        where: { status_name: element.status_penanganan }
                    });
                    if (reportStatus) {
                        reportStatusId = reportStatus.id;
                    } else {
                        const newReportStatus = queryRunner.manager.create(ReportStatus, {
                            status_name: element.status_penanganan
                        });
                        const insertedReportStatus = await queryRunner.manager.insert(ReportStatus, newReportStatus);
                        reportStatusId = insertedReportStatus.identifiers[0].id; // Adjusted to get the ID correctly
                    }
                    const reportNumber = await this.extractReportNumber(element.nomor_dan_tanggal);
                    const [bukti_penyaluran] = element.bukti_penyaluran.split('\n').map(part => part.trim());
                    const reportData = {
                        // id: element.id,
                        nomor: reportNumber,
                        tanggal: await this.dateService.parseDate(element.tgl_lp),
                        pasal: element.pasal,
                        uraian_kejadian: element.uraian_kejadian,
                        pelapor: element.pelapor,
                        tersangka: element.tersangka,
                        barang_bukti: element.barang_bukti,
                        // tujuan_penyaluran: element.tujuan_penyaluran,
                        bukti_penyaluran: bukti_penyaluran,
                        // tanggal_penyaluran: await this.dateService.parseDate(tanggal_penyaluran),
                        model_lp: element.model_lp,
                        sumber: element.sumber,
                        ket_sumber: element.ket_sumber,
                        ceklist_croscek: element.ceklist_croscek,
                        tgl_update_penanganan: element.tgl_update_penanganan,
                        created_at: element.Timestamps.created_at,
                        updated_at: element.Timestamps.updated_at,
                        deleted_at: element.Timestamps.deleted_at,
                        LogImport: { id: createReportDto.log_import_id },
                        ReportStatus: { id: reportStatusId },
                        sumber_data: 'import_excel'
                    };

                    if (reportData.nomor) {
                        try {
                            const existingReport = await queryRunner.manager.findOne(Report, {
                                where: {
                                    nomor: reportData.nomor,
                                    sumber_data: 'import_excel'
                                }
                            });
                            if (existingReport) {
                                await queryRunner.manager.insert(DuplicatedReport, reportData);
                                duplicatedData++;
                            } else {
                                const insertResult = await queryRunner.manager.insert(Report, reportData);
                                insertedId = insertResult.identifiers[0]?.id;
                                transformData++;
                            }
                        } catch (error) {
                            if (error.code === 'ER_DUP_ENTRY') {
                                duplicatedData++;
                                console.error('Duplicate entry error:', error);
                            } else {
                                throw error;
                            }
                        }
                    } else {
                        if (element.nomor_dan_tanggal) {
                            reportData.nomor = element.nomor_dan_tanggal;
                            const insertResult = await queryRunner.manager.insert(Report, reportData);
                            insertedId = insertResult.identifiers[0]?.id;
                            transformData++;
                        } else {
                            emptyRow++;
                        }
                    }
                    if (insertedId) {
                        const directorateName = element.tujuan_penyaluran;
                        let lines = directorateName.split(/[\n,-]+/);
                        const processedLines = [];
                        let currentLine = '';
                        const buktiPenyaluran = element.bukti_penyaluran;
                        const arrayBuktiPenyaluran = buktiPenyaluran
                            .split(/(?<=\d{1,2}-\d{1,2}-\d{4})\n/)
                            .map(item => item.trim())
                            .filter(Boolean);
                        const hasilPemisahanBuktiPenyaluran = arrayBuktiPenyaluran.map(item => {
                            const regex = /(\d{1,2}-\d{1,2}-\d{4})/;
                            const tanggalBuktiPEnyaluran = item.match(regex) ? item.match(regex)[0] : null;
                            const nomorBuktiPenyaluran = item.replace(regex, '').trim().replace(/\n+/g, ' '); // Menghapus tanggal dan newline
                            return {
                                tanggalBuktiPEnyaluran,
                                nomorBuktiPenyaluran
                            };
                        });
                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (trimmedLine.toLowerCase().startsWith('di')) {
                                if (currentLine) {
                                    processedLines.push(currentLine.trim());
                                }
                                currentLine = trimmedLine;
                            } else {
                                currentLine += ' ' + trimmedLine;
                            }
                        }
                        if (currentLine) {
                            processedLines.push(currentLine.trim());
                        }
                        const directorateArray = processedLines;
                        let oldDir = null;
                        for (const [index, rawDirName] of directorateArray.entries()) {
                            const dirName = rawDirName.toLowerCase().trim();
                            let dir = await queryRunner.manager.findOne(Directorate, {
                                where: { name: dirName }
                            });
                            if (!dir) {
                                dir = await queryRunner.manager.save(Directorate, { name: dirName });
                                const adminRole = queryRunner.manager.create(DirectorateRole, {
                                    Directorate: dir,
                                    role_name: 'admin'
                                });
                                const anggotaRole = queryRunner.manager.create(DirectorateRole, {
                                    Directorate: dir,
                                    role_name: 'anggota'
                                });
                                await queryRunner.manager.save([adminRole, anggotaRole]);
                            }
                            let dirReportData = {
                                Directorate: dir,
                                Report: { id: insertedId },
                                DirectorateFrom: oldDir
                            };
                            await queryRunner.manager.save(DirectorateReport, dirReportData);

                            // console.log(directorateArray[index], hasilPemisahanBuktiPenyaluran[index]);

                            if (hasilPemisahanBuktiPenyaluran[index]) {
                                const entry = hasilPemisahanBuktiPenyaluran[index];
                                const tanggalDinyatakan = moment(entry.tanggalBuktiPEnyaluran, 'DD-MM-YYYY').isValid() ? moment(entry.tanggalBuktiPEnyaluran, 'DD-MM-YYYY').toDate() : null;

                                await queryRunner.manager.insert(LogReport, {
                                    tanggal_dinyatakan: tanggalDinyatakan,
                                    keterangan: `Dilimpahkan ke ${dir.name}`,
                                    status: 'Pelimpahan Laporan',
                                    bukti_dinyatakan: entry.nomorBuktiPenyaluran || null,
                                    ReportStatus: { id: reportStatusId },
                                    Report: { id: insertedId }
                                    // Uncomment if needed
                                    // Directorate: { id: dto.directorate_id },
                                });
                            } else {
                                // console.error(`Entry at index ${index} is undefined`);
                                // Handle the situation (e.g., skip insertion, log a warning, etc.)
                            }
                            oldDir = dir;
                        }
                        const updateReport = await queryRunner.manager.findOne(Report, {
                            where: { id: insertedId }
                        });
                        if (updateReport) {
                            updateReport.Directorate = oldDir;
                            await queryRunner.manager.save(Report, updateReport);
                        }
                    }
                }

                await queryRunner.manager.update(LogImport, createReportDto.log_import_id, {
                    status: 1,
                    transform_data: transformData,
                    duplicated_data: duplicatedData,
                    empty_row: emptyRow
                });
                await queryRunner.commitTransaction();
                return { transformData, duplicatedData, emptyRow };
            } else {
                throw new Error('Data sudah di-transform');
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    async create(dto: createManualReportDto, authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.insert(Report, {
                id: dto.id,
                nomor: dto.nomor,
                tanggal: await this.dateService.parseDate2(dto.tanggal),
                // pasal: dto.pasal,
                uraian_kejadian: dto.uraian_kejadian,
                // pelapor: dto.pelapor,
                // tersangka: dto.tersangka,
                // barang_bukti: dto.barang_bukti,
                // tujuan_penyaluran: dto.tujuan_penyaluran,
                // bukti_penyaluran: dto.bukti_penyaluran,
                model_lp: dto.model_lp,
                // sumber: dto.sumber,
                // ket_sumber: dto.ket_sumber,
                // ceklist_croscek: dto.ceklist_croscek,
                // status: dto.status,
                Organisasi:{id: authUser.Organisasi.id},
                JenisKejahatan: { id: dto.jenis_kejahatan_id },
                ReportStatus: { id: dto.report_status_id }
            });
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error; // Consider logging the error for debugging
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any, @CurrentUser() authUser, akses = true) {
        const queryBuilder = this.reportRepository.createQueryBuilder('Report');
        queryBuilder.leftJoinAndSelect('Report.ReportStatus', 'ReportStatus');

        // Base: data milik user langsung
        if (akses) {
            AksesLpHelper.applyToQuery(queryBuilder, authUser);
        }

        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'Report',
            searchingAll: ['nomor', 'tanggal'],
            searching: ['nomor', 'tanggal', 'pasal', 'uraian_kejadian', 'pelapor', 'tersangka', 'barang_bukti', 'tujuan_penyaluran', 'bukti_penyaluran', 'tanggal_penyaluran', 'status', 'created_at', 'updated_at', 'model_lp', 'sumber', 'ket_sumber'],
            searchingOption: ['id', 'ReportStatus.id', 'Organisasi.id', 'nomor', 'tanggal', 'pasal', 'uraian_kejadian', 'pelapor', 'tersangka', 'barang_bukti', 'tujuan_penyaluran', 'bukti_penyaluran', 'tanggal_penyaluran', 'status', 'created_at', 'updated_at', 'model_lp'],
            searchingOrWhere: ['nomor', 'tanggal', 'pasal', 'uraian_kejadian', 'pelapor', 'tersangka', 'barang_bukti', 'tujuan_penyaluran', 'bukti_penyaluran', 'tanggal_penyaluran', 'status', 'created_at', 'updated_at'],
            searchingBeetween: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
            yearMonthFilter: ['tanggal', 'tanggal_penyaluran', 'created_at', 'updated_at'],
            sorting: ['Organisasi.name', 'id', 'nomor', 'tanggal', 'pasal', 'uraian_kejadian', 'pelapor', 'tersangka', 'barang_bukti', 'tujuan_penyaluran', 'bukti_penyaluran', 'tanggal_penyaluran', 'status', 'created_at', 'updated_at', 'model_lp', 'sumber', 'ket_sumber', 'ReportStatus.status_name'],
            defaultSorting: 'Report.Timestamps.created_at',
            joins: []
        });
        return result;
    }

    async findOne(id: number, @CurrentUser() authUser, akses = true) {
        // Step 1: Ambil data utama + relasi penting
        const queryBuilder = this.reportRepository.createQueryBuilder('Report');
        queryBuilder
            .leftJoinAndSelect('Report.LogImport', 'LogImport')
            .leftJoinAndSelect('Report.ReportStatus', 'ReportStatus')
            .leftJoinAndSelect('Report.Provinsi', 'Provinsi')
            .leftJoinAndSelect('Report.Kabupaten', 'Kabupaten')
            .leftJoinAndSelect('Report.Kecamatan', 'Kecamatan')
            .leftJoinAndSelect('Report.Desa', 'Desa')
            .leftJoinAndSelect('Report.Polda', 'Polda')
            .leftJoinAndSelect('Report.Polres', 'Polres')
            .leftJoinAndSelect('Report.Polsek', 'Polsek')
            .leftJoinAndSelect('Report.GolonganKamtibmas', 'GolonganKamtibmas')
            .leftJoinAndSelect('Report.KategoriLokasi', 'KategoriLokasi')
            .leftJoinAndSelect('Report.ModusOperandi', 'ModusOperandi')
            .leftJoinAndSelect('Report.MotifKejahatan', 'MotifKejahatan')
            .leftJoinAndSelect('Report.SubGolonganKamtibmas', 'SubGolonganKamtibmas')
            .leftJoinAndSelect('Report.ReportPasal', 'ReportPasal')
            .leftJoinAndSelect('Report.ReportBarangBukti', 'ReportBarangBukti')
            .leftJoinAndSelect('ReportBarangBukti.JenisBarangBukti', 'JenisBarangBukti');

        if (akses) {
            AksesLpHelper.applyToQuery(queryBuilder, authUser);
        }
        queryBuilder.andWhere('Report.id = :id', { id });
        const report = await queryBuilder.getOneOrFail();

        // Step 2: Ambil relasi besar secara paralel
        const [reportPelapor, reportTerlapor, reportKorban, reportSaksi] = await Promise.all([
            this.dataSource.getRepository(ReportPelapor).find({
                where: { Report: { id } },
                relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan']
            }),
            this.dataSource.getRepository(ReportTerlapor).find({
                where: { Report: { id } },
                relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan']
            }),
            this.dataSource.getRepository(ReportKorban).find({
                where: { Report: { id } },
                relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan']
            }),
            this.dataSource.getRepository(ReportSaksi).find({
                where: { Report: { id } },
                relations: ['TipeIdentitas', 'JenisKelamin', 'Agama', 'Provinsi', 'Kabupaten', 'Kecamatan', 'Desa', 'Kewarganegaraan', 'Suku', 'Pekerjaan', 'Pendidikan']
            })
        ]);

        // Step 3: Tambahkan ke objek report
        report.ReportPelapor = reportPelapor;
        report.ReportTerlapor = reportTerlapor;
        report.ReportKorban = reportKorban;
        report.ReportSaksi = reportSaksi;

        return report;
    }

    async update(id: number, dto: UpdateReportDto, file: any, @CurrentUser() authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const queryBuilder = await queryRunner.manager.getRepository(Report).createQueryBuilder('Report').where('Report.id = :id', { id });
            AksesLpHelper.applyToQuery(queryBuilder, authUser);
            const data = await queryBuilder.getOne();
            await queryRunner.manager.update(Report, id, {
                nomor: dto.nomor,
                tanggal: await this.dateService.parseDate2(dto.tanggal),
                pasal: dto.pasal,
                uraian_kejadian: dto.uraian_kejadian,
                // ReportStatus: { id: dto.report_status_id },
                JenisKejahatan: { id: dto.jenis_kejahatan_id }
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

    async updateStatus(id: number, dto: UpdateStatusReportDto, file: any, @CurrentUser() authUser) {
        let dokumen_perubahan_status = null;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const queryBuilder = await queryRunner.manager.getRepository(Report).createQueryBuilder('Report').where('Report.id = :id', { id });
        queryBuilder.leftJoinAndSelect('Report.ReportStatus', 'ReportStatus');
        AksesLpHelper.applyToQuery(queryBuilder, authUser);
        const data = await queryBuilder.getOne();

        if (!data) {
            throw new Error('Data Laporan dengan id tersebut tidak ada');
        }
        if (file) {
            dokumen_perubahan_status = await this.saveFile(file, 'dokumen_perubahan_status');
        }

        try {
            let oldStatus = { status_name: 'belum ada status' };
            if (data.ReportStatus) {
                oldStatus = await queryRunner.manager.findOneOrFail(ReportStatus, { where: { id: data.ReportStatus.id } });
            }
            const allStatus = await this.optionReportStatusService.findAll({});
            const parsed = typeof dto.report_status_id === 'string' ? JSON.parse(dto.report_status_id) : dto.report_status_id;
            const key = Object.keys(parsed)[0];
            const selectedStatus = this.findTreeByKey(allStatus.data, key);

            const newStatus = await queryRunner.manager.findOneOrFail(ReportStatus, { where: { id: +selectedStatus.id }, relations: ['children'] });
            if (newStatus.children.length > 0) {
                throw new BadRequestException({
                    errors: {
                        report_status_id: ['Wajib memilih Sub dari status ' + newStatus.status_name]
                    }
                });
            }
            if (!dto.report_status_date) {
                throw new BadRequestException({
                    errors: {
                        report_status_date: ['Tidak Boleh kosong jika Mengubah Status']
                    }
                });
            }
            await queryRunner.manager.insert(LogReport, {
                tanggal_dinyatakan: await this.dateService.parseDate2(dto.report_status_date),
                keterangan: `Perubahan Status dari ${oldStatus.status_name} ke ${newStatus.status_name}`,
                status: 'Perubahan Status',
                Report: data,
                bukti_dinyatakan: dto.bukti_dinyatakan,
                dokumen_bukti_dinyatakan: dokumen_perubahan_status ?? null,
                ReportStatus: newStatus
            });
            data.ReportStatus = newStatus;
            await queryRunner.manager.save(Report, data);
            await queryRunner.commitTransaction();
            return 'data';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (dokumen_perubahan_status) {
                this.deleteFile(dokumen_perubahan_status);
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async distribusiLaporan(id: number, dto: UpdateDistribusiReportDto, file: any, @CurrentUser() authUser, @Req() req) {
        let dokumen_perubahan_status = null;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const queryBuilder = await queryRunner.manager.getRepository(Report).createQueryBuilder('Report').where('Report.id = :id', { id });
        queryBuilder.leftJoinAndSelect('Report.ReportStatus', 'ReportStatus');
        AksesLpHelper.applyToQuery(queryBuilder, authUser);
        const data = await queryBuilder.getOne();

        if (!data) {
            throw new Error('Data Laporan dengan id tersebut tidak ada');
        }
        if (file) {
            dokumen_perubahan_status = await this.saveFile(file, 'dokumen_perubahan_status');
        }

        try {
            let oldOrganisasi = { name: 'belum ada organisasi' };
            let selectedOrganisasi = null;
            let newOrganisasi = null;
            if (data.Organisasi) {
                oldOrganisasi = data.Organisasi;
            }
            if (dto.type_distribusi === 'external') {
                selectedOrganisasi = { id: 1 };
                newOrganisasi = { name: dto.external_organisai };
            } else {
                console.time('findTreeByKey');
                const allOrganisasi = await this.optionOrganisasiService.findAll({ query: { type: 'tree' } }, authUser);
                console.timeEnd('findTreeByKey');
                const parsed = typeof dto.organisasi_id === 'string' ? JSON.parse(dto.organisasi_id) : dto.organisasi_id;
                const key = Object.keys(parsed)[0];
                selectedOrganisasi = this.findTreeByKey(allOrganisasi.data, key);
                newOrganisasi = await queryRunner.manager.findOneOrFail(Organisasi, { where: { id: +selectedOrganisasi.id }, relations: ['children'] });
            }
            // if (!dto.report_status_date) {
            //     throw new BadRequestException({
            //         errors: {
            //             report_status_date: ['Tidak Boleh kosong jika Mengubah Organisasi']
            //         }
            //     });
            // }
            await queryRunner.manager.insert(LogReport, {
                tanggal_dinyatakan: await this.dateService.parseDate2(dto.report_status_date),
                keterangan: `Distribusi dari ${oldOrganisasi.name} ke ${newOrganisasi.name}`,
                status: 'Distribusi',
                Report: data,
                bukti_dinyatakan: dto.bukti_dinyatakan,
                dokumen_bukti_dinyatakan: dokumen_perubahan_status ?? null,
                ReportStatus: data.ReportStatus,
                keterangan_tambahan: dto.keterangan_tambahan
            });
            data.Organisasi = newOrganisasi;

            await queryRunner.manager.save(Report, data);
            await queryRunner.commitTransaction();
            return 'data';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (dokumen_perubahan_status) {
                this.deleteFile(dokumen_perubahan_status);
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private findTreeByKey(data, targetKey) {
        for (const item of data) {
            // Check if top-level key matches
            if (item.key === targetKey || item.data?.key === targetKey) {
                return item.data || item;
            }

            // Check in children under data
            if (item.data?.children?.length) {
                const found = this.findTreeByKey(item.data.children, targetKey);
                if (found) return found;
            }

            // Check in direct children
            if (item.children?.length) {
                const found = this.findTreeByKey(item.children, targetKey);
                if (found) return found;
            }
        }

        return null; // not found
    }

    async remove(deleteDto: DeleteDto, request: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (deleteDto.data && deleteDto.data.length > 0) {
                for (const joinObject of deleteDto.data) {
                    await queryRunner.manager.softDelete(Report, {
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

    async extractReportNumber(input) {
        const match = input.match(/^(.*?)(?=\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|$)/);
        return match ? match[0].trim() : '';
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
    async deleteFile(filePath: string): Promise<void> {
        try {
            const directoryPath = join(process.cwd(), 'storage', filePath);
            await fsPromises.unlink(directoryPath); // Menghapus file
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
        }
    }
}
