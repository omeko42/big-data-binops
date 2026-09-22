import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateMotifKejahatanDto } from '@bareskrim/data_master/dto/laporan/motif-kejahatan.dto';
import { MotifKejahatan } from '@bareskrim/data_master/entities/laporan/motif-kejahatan.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MotifKejahatanService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateMotifKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const motifKejahatan = queryRunner.manager.create(MotifKejahatan, {
                ...dto
            });
            await queryRunner.manager.save([motifKejahatan]);
            await queryRunner.commitTransaction();
            return motifKejahatan;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(MotifKejahatan).findOneOrFail({ where: { id } });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(MotifKejahatan, 'motifKejahatan');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'motifKejahatan',
            searchingAll: ['name'],
            searching: ['id', 'name', 'created_at', 'updated_at'],
            searchingOption: ['id', 'name', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
            sorting: ['id', 'name', 'created_at', 'updated_at'],
            defaultSorting: 'motifKejahatan.id',
            joins: []
        });
    }

    async update(id: number, dto: CreateMotifKejahatanDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(MotifKejahatan, { where: { id } });
            const data = await queryRunner.manager.update(MotifKejahatan, id, {
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
                    await queryRunner.manager.softDelete(MotifKejahatan, { id: joinObject.id });
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
