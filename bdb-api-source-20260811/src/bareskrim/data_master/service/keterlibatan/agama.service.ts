import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateAgamaDto } from '@bareskrim/data_master/dto/keterlibatan/agama.dto';
import { Agama } from '@bareskrim/data_master/entities/keterlibatan/agama.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AgamaService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateAgamaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingagama = await queryRunner.manager.findOne(Agama, {
                where: { name: dto.name }
            });
            if (existingagama) {
                throw new Error('Data Sudah ada');
            }
            const agama = queryRunner.manager.create(Agama, {
                name: dto.name
            });

            await queryRunner.manager.save([agama]);
            await queryRunner.commitTransaction();
            return agama;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        const result = await this.dataSource.getRepository(Agama).findOne({
            where: {
                id: id
            },
            relations: []
        });
        return result;
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.dataSource.createQueryBuilder(Agama, 'agama');
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'agama',
                searchingAll: ['name'],
                searching: ['id', 'name', 'created_at', 'updated_at'],
                searchingOption: ['id', 'name', 'created_at', 'updated_at'],
                searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
                searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
                yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
                sorting: ['id', 'name', 'created_at', 'updated_at'],
                defaultSorting: 'agama.created_at',
                joins: []
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: CreateAgamaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOneOrFail(Agama, {
                where: { id }
            });
            await queryRunner.manager.update(Agama, id, {
                name: dto.name
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
                    await queryRunner.manager.softDelete(Agama, {
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
