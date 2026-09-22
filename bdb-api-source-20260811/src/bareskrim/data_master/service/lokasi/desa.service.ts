import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateDesaDto, UpdateDesaDto } from '@bareskrim/data_master/dto/keterlibatan/desa.dto';
import { Desa } from '@bareskrim/data_master/entities/lokasi/desa.entity';
import { Kecamatan } from '@bareskrim/data_master/entities/lokasi/kecamatan.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DesaService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateDesaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingagama = await queryRunner.manager.findOne(Desa, {
                where: { code: dto.code }
            });
            if (existingagama) {
                throw new Error('Data Sudah ada');
            }
            const kecamatan = await queryRunner.manager.findOne(Kecamatan, {
                where: { code: dto.id_kecamatan }
            });
            const desa = queryRunner.manager.create(Desa, {
                name: dto.name,
                code: dto.code,
                Kecamatan: kecamatan || null
            });
            await queryRunner.manager.save([desa]);
            await queryRunner.commitTransaction();
            return desa;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(Desa, 'desa');
            queryBuilder.leftJoinAndSelect('desa.Kecamatan', 'Kecamatan');
            queryBuilder.leftJoinAndSelect('Kecamatan.Kabupaten', 'Kabupaten');
            queryBuilder.leftJoinAndSelect('Kabupaten.Provinsi', 'Provinsi');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'desa',
                searchingAll: ['name'],
                searching: ['name', 'created_at', 'updated_at'],
                searchingOption: ['Kecamatan.code', 'Kabupaten.code', 'Provinsi.code', 'name', 'created_at', 'updated_at'],
                searchingOrWhere: ['name', 'created_at', 'updated_at'],
                searchingBeetween: ['name', 'created_at', 'updated_at'],
                yearMonthFilter: ['name', 'created_at', 'updated_at'],
                sorting: ['name', 'created_at', 'updated_at'],
                defaultSorting: 'desa.Timestamps.created_at',
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
                .getRepository(Desa)
                .createQueryBuilder('desa')
                .leftJoinAndSelect('desa.Kecamatan', 'kecamatan') // JOIN ke Kabupaten
                .leftJoinAndSelect('kecamatan.Kabupaten', 'kabupaten') // JOIN ke Kabupaten
                .leftJoinAndSelect('kabupaten.Provinsi', 'provinsi') // JOIN ke Provinsi
                .where('desa.code = :id', { id })
                .getOneOrFail();

            return data;
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, dto: UpdateDesaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await queryRunner.manager.findOneOrFail(Desa, {
                where: { code: id }
            });
            const kecamatan = await queryRunner.manager.findOne(Kecamatan, {
                where: { code: dto.id_kecamatan }
            });
            await queryRunner.manager.update(Desa, id, {
                name: dto.name,
                code: dto.code,
                Kecamatan: kecamatan || null
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
                    await queryRunner.manager.softDelete(Desa, {
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
