import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateKabupatenDto, UpdateKabupatenDto } from '@bareskrim/data_master/dto/keterlibatan/kabupaten.dto';
import { Kabupaten } from '@bareskrim/data_master/entities/lokasi/kabupaten.entity';
import { Provinsi } from '@bareskrim/data_master/entities/lokasi/provinsi.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class KabupatenService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateKabupatenDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingKecamatan = await queryRunner.manager.findOne(Kabupaten, {
                where: { code: dto.code }
            });
            if (existingKecamatan) {
                throw new Error('Data Sudah ada');
            }
            const provinsi = await queryRunner.manager.findOne(Provinsi, {
                where: { code: dto.id_provinsi }
            });
            const kabupaten = queryRunner.manager.create(Kabupaten, {
                name: dto.name,
                code: dto.code,
                Provinsi: provinsi || null
            });
            await queryRunner.manager.save([kabupaten]);
            await queryRunner.commitTransaction();
            return kabupaten;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(Kabupaten, 'kabupaten');
            queryBuilder.leftJoinAndSelect('kabupaten.Provinsi', 'Provinsi');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'kabupaten',
                searchingAll: ['name', 'code'],
                searching: ['name', 'code', 'created_at', 'updated_at'],
                searchingOption: ['Provinsi.code', 'code', 'name', 'created_at', 'updated_at'],
                searchingOrWhere: ['name', 'code', 'created_at', 'updated_at'],
                searchingBeetween: ['name', 'created_at', 'updated_at'],
                yearMonthFilter: ['name', 'created_at', 'updated_at'],
                sorting: ['name', 'created_at', 'updated_at'],
                defaultSorting: 'kabupaten.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            const data = await this.dataSource.getRepository(Kabupaten)
            .createQueryBuilder('kabupaten')
            .leftJoinAndSelect('kabupaten.Provinsi', 'id_provinsi')
            .where('kabupaten.code = :id', { id })
            .getOneOrFail();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: UpdateKabupatenDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await queryRunner.manager.findOneOrFail(Kabupaten, {
                where: { code: id }
            });
            const provinsi = await queryRunner.manager.findOne(Provinsi, {
                where: { code: dto.id_provinsi }
            });
            await queryRunner.manager.update(Kabupaten, id, {
                name: dto.name,
                Provinsi: provinsi || null
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
                    await queryRunner.manager.softDelete(Kabupaten, {
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
