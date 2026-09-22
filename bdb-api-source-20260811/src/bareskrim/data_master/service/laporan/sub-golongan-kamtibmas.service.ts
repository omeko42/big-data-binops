import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateSubGolonganKamtibmasDto } from '@bareskrim/data_master/dto/laporan/sub-golongan-kamtibmas.dto';
import { SubGolonganKamtibmas } from '@bareskrim/data_master/entities/laporan/sub-golongan-kamtibmas.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SubGolonganKamtibmasService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateSubGolonganKamtibmasDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { golongan_kamptibmas_id, ...rest } = dto;
            const subGolongan = queryRunner.manager.create(SubGolonganKamtibmas, {
                ...rest,
                GolonganKamtibmas: golongan_kamptibmas_id ? { id: golongan_kamptibmas_id } : null
            });
            await queryRunner.manager.save([subGolongan]);
            await queryRunner.commitTransaction();
            return subGolongan;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(SubGolonganKamtibmas).findOneOrFail({ where: { id }, relations: ['GolonganKamtibmas'] });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(SubGolonganKamtibmas, 'subGolongan');
        queryBuilder.leftJoinAndSelect('subGolongan.GolonganKamtibmas', 'golongan');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'subGolongan',
            searchingAll: ['name'],
            searching: ['id', 'name'],
            searchingOption: ['id', 'name'],
            searchingOrWhere: ['id', 'name'],
            searchingBeetween: ['id', 'name'],
            yearMonthFilter: ['id', 'name'],
            sorting: ['id', 'name'],
            defaultSorting: 'subGolongan.id',
            joins: []
        });
    }

    async update(id: number, dto: CreateSubGolonganKamtibmasDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(SubGolonganKamtibmas, { where: { id } });
            const { golongan_kamptibmas_id, ...rest } = dto;
            const data = await queryRunner.manager.update(SubGolonganKamtibmas, id, {
                ...rest,
                GolonganKamtibmas: golongan_kamptibmas_id ? { id: golongan_kamptibmas_id } : null
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
                    await queryRunner.manager.softDelete(SubGolonganKamtibmas, { id: joinObject.id });
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
