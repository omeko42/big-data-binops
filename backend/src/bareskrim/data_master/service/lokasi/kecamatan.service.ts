import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateKecamatanDto, UpdateKecamatanDto } from '../../dto/keterlibatan/kecamatan.dto';
import { Kecamatan } from '../../entities/lokasi/kecamatan.entity';
import { Kabupaten } from '@bareskrim/data_master/entities/lokasi/kabupaten.entity';

@Injectable()
export class KecamatanService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateKecamatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingKecamatan = await queryRunner.manager.findOne(Kecamatan, {
                where: { code: dto.code }
            });
            if (existingKecamatan) {
                throw new Error('Data Sudah ada');
            }
            const kabupaten = await queryRunner.manager.findOne(Kabupaten, {
                where: { code: dto.id_kabupaten }
            });
            const kecamatan = queryRunner.manager.create(Kecamatan, {
                name: dto.name,
                code: dto.code,
                Kabupaten: kabupaten || null
            });

            await queryRunner.manager.save([kecamatan]);
            await queryRunner.commitTransaction();
            return kecamatan;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(Kecamatan, 'kecamatan');
            queryBuilder.leftJoinAndSelect('kecamatan.Kabupaten', 'Kabupaten');
            queryBuilder.leftJoinAndSelect('Kabupaten.Provinsi', 'Provinsi');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'kecamatan',
                searchingAll: ['name', 'Kabupaten.name', 'Provinsi.name', 'code'],
                searching: ['name', 'code', 'created_at', 'updated_at'],
                searchingOption: ['Provinsi.code', 'Kabupaten.code', 'name', 'code', 'created_at', 'updated_at'],
                searchingOrWhere: ['name', 'code', 'created_at', 'updated_at'],
                searchingBeetween: ['name', 'created_at', 'updated_at'],
                yearMonthFilter: ['name', 'created_at', 'updated_at'],
                sorting: ['name', 'created_at', 'updated_at'],
                defaultSorting: 'kecamatan.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async findOne(id: number) {
        try {
            const data = await this.dataSource
                .getRepository(Kecamatan)
                .createQueryBuilder('kecamatan')
                .leftJoinAndSelect('kecamatan.Kabupaten', 'kabupaten') // JOIN ke Kabupaten
                .leftJoinAndSelect('kabupaten.Provinsi', 'provinsi') // JOIN ke Provinsi
                .where('kecamatan.code = :id', { id })
                .getOneOrFail();

            return data;
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, dto: UpdateKecamatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await queryRunner.manager.findOneOrFail(Kecamatan, {
                where: { code: id }
            });
            const kabupaten = await queryRunner.manager.findOne(Kabupaten, {
                where: { code: dto.id_kabupaten }
            });
            await queryRunner.manager.update(Kecamatan, id, {
                name: dto.name,
                code: dto.code,
                Kabupaten: kabupaten || null
            });
            data.name = dto.name;
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
                    await queryRunner.manager.softDelete(Kecamatan, {
                        id: joinObject.id
                    });
                }
            }
            await queryRunner.commitTransaction();
            return 'Successfully Removed';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
