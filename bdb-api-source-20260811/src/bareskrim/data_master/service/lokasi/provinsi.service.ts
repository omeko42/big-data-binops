import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Provinsi } from '../../entities/lokasi/provinsi.entity';
import { CreateProvinsiDto, UpdateProvinsiDto } from '../../dto/keterlibatan/provinsi.dto';

@Injectable()
export class ProvinsiService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateProvinsiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingProvinsi = await queryRunner.manager.findOne(Provinsi, {
                where: { code: dto.code }
            });
            if (existingProvinsi) {
                throw new Error('Data Sudah ada');
            }
            const provinsi = queryRunner.manager.create(Provinsi, {
                ...dto
            });

            await queryRunner.manager.save([provinsi]);
            await queryRunner.commitTransaction();
            return provinsi;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            // console.log(error);

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(Provinsi, 'provinsi');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'provinsi',
                searchingAll: ['name'],
                searching: ['name', 'created_at', 'updated_at'],
                searchingOption: ['code', 'created_at', 'updated_at'],
                searchingOrWhere: ['name', 'created_at', 'updated_at'],
                searchingBeetween: ['name', 'created_at', 'updated_at'],
                yearMonthFilter: ['name', 'created_at', 'updated_at'],
                sorting: ['name', 'created_at', 'updated_at'],
                defaultSorting: 'provinsi.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async findOne(id: number) {
        try {
            const data = await this.dataSource.getRepository(Provinsi).findOneOrFail({ where: { code: id } });
            return data;
        } catch (error) {
            throw error;
        }
    }
    async update(id: number, dto: UpdateProvinsiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await queryRunner.manager.findOneOrFail(Provinsi, {
                where: { code: id }
            });
            await queryRunner.manager.update(Provinsi, id, {
                name: dto.name,
                code: dto.code
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
                    await queryRunner.manager.softDelete(Provinsi, {
                        code: joinObject.code
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
