import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateGolonganKejahatanDto } from '@bareskrim/data_master/dto/laporan/golongan-kejahatan.dto';
import { GolonganKejahatan } from '@bareskrim/data_master/entities/laporan/golongan-kejahatan.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GolonganKejahatanService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateGolonganKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const golongan = queryRunner.manager.create(GolonganKejahatan, {
                ...dto
            });
            await queryRunner.manager.save([golongan]);
            await queryRunner.commitTransaction();
            return golongan;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(GolonganKejahatan).findOneOrFail({ where: { id } });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(GolonganKejahatan, 'golongan');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'golongan',
            searchingAll: ['name'],
            searching: ['id', 'name', 'created_at', 'updated_at'],
            searchingOption: ['id', 'name', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
            sorting: ['id', 'name', 'created_at', 'updated_at'],
            defaultSorting: 'golongan.id',
            joins: []
        });
    }

    async update(id: number, dto: CreateGolonganKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(GolonganKejahatan, { where: { id } });
            const data = await queryRunner.manager.update(GolonganKejahatan, id, {
                ...dto
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
                    await queryRunner.manager.softDelete(GolonganKejahatan, { id: joinObject.id });
                }
            }
            await queryRunner.commitTransaction();
            return 'Successfully removed';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
