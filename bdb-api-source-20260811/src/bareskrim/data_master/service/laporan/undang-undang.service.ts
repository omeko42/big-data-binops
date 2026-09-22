import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateUndangUndangDto } from '@bareskrim/data_master/dto/laporan/undang-undang.dto';
import { UndangUndang } from '@bareskrim/data_master/entities/laporan/undang-undang.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UndangUndangService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateUndangUndangDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingagama = await queryRunner.manager.findOne(UndangUndang, {
                where: { id: dto.id }
            });
            if (existingagama) {
                throw new Error('Data Sudah ada');
            }
            const undangUndang = queryRunner.manager.create(UndangUndang, {
                ...dto
            });

            await queryRunner.manager.save([undangUndang]);
            await queryRunner.commitTransaction();
            return undangUndang;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    async findOne(id: number) {
        try {
            const data = await this.dataSource.getRepository(UndangUndang).findOneOrFail({ where: { id } });
            return data;
        } catch (error) {
            throw error;
        }
    }
    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(UndangUndang, 'undangUndang');
            queryBuilder.leftJoinAndSelect('undangUndang.JenisKejahatan', 'jenisKejahatan');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'undangUndang',
                searchingAll: ['deskripsi'],
                searching: ['id', 'deskripsi', 'created_at', 'updated_at'],
                searchingOption: ['id', 'jenisKejahatan.id', 'deskripsi', 'created_at', 'updated_at'],
                searchingOrWhere: ['id', 'deskripsi', 'created_at', 'updated_at'],
                searchingBeetween: ['id', 'deskripsi', 'created_at', 'updated_at'],
                yearMonthFilter: ['id', 'nadeskripsime', 'created_at', 'updated_at'],
                sorting: ['id', 'deskripsi', 'created_at', 'updated_at'],
                defaultSorting: 'undangUndang.Timestamps.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: CreateUndangUndangDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(UndangUndang, {
                where: { id: id }
            });
            const data = await queryRunner.manager.update(UndangUndang, id, {
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
                    await queryRunner.manager.softDelete(UndangUndang, {
                        id: joinObject.id
                    });
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
