import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateIccsKategoriDto } from '@bareskrim/data_master/dto/laporan/iccs-kategori.dto';
import { IccsKategori } from '@bareskrim/data_master/entities/laporan/iccs-kategori.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class IccsKategoriService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateIccsKategoriDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const iccsKategori = queryRunner.manager.create(IccsKategori, {
                ...dto
            });
            await queryRunner.manager.save([iccsKategori]);
            await queryRunner.commitTransaction();
            return iccsKategori;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(IccsKategori).findOneOrFail({ where: { id } });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(IccsKategori, 'iccsKategori');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'iccsKategori',
            searchingAll: ['nama', 'keterangan'],
            searching: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            searchingOption: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            sorting: ['id', 'kode', 'nama', 'keterangan', 'created_at', 'updated_at'],
            defaultSorting: 'iccsKategori.kode',
            joins: []
        });
    }

    async update(id: number, dto: CreateIccsKategoriDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(IccsKategori, { where: { id } });
            const data = await queryRunner.manager.update(IccsKategori, id, {
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
                    await queryRunner.manager.softDelete(IccsKategori, { id: joinObject.id });
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
