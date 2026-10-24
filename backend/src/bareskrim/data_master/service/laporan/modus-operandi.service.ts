import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateModusOperandiDto } from '@bareskrim/data_master/dto/laporan/modus-operandi.dto';
import { ModusOperandi } from '@bareskrim/data_master/entities/laporan/modus-operandi.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ModusOperandiService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateModusOperandiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const modusOperandi = queryRunner.manager.create(ModusOperandi, {
                ...dto
            });
            await queryRunner.manager.save([modusOperandi]);
            await queryRunner.commitTransaction();
            return modusOperandi;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(ModusOperandi).findOneOrFail({ where: { id } });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(ModusOperandi, 'modusOperandi');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'modusOperandi',
            searchingAll: ['name'],
            searching: ['id', 'name', 'created_at', 'updated_at'],
            searchingOption: ['id', 'name', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
            sorting: ['id', 'name', 'created_at', 'updated_at'],
            defaultSorting: 'modusOperandi.id',
            joins: []
        });
    }

    async update(id: number, dto: CreateModusOperandiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(ModusOperandi, { where: { id } });
            const data = await queryRunner.manager.update(ModusOperandi, id, {
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
                    await queryRunner.manager.softDelete(ModusOperandi, { id: joinObject.id });
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
