import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { CreateKategoriLokasiDto } from '@bareskrim/data_master/dto/laporan/kategori-lokasi.dto';
import { KategoriLokasi } from '@bareskrim/data_master/entities/laporan/kategori-lokasi.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class KategoriLokasiService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService
    ) {}

    async create(dto: CreateKategoriLokasiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const kategoriLokasi = queryRunner.manager.create(KategoriLokasi, {
                ...dto
            });
            await queryRunner.manager.save([kategoriLokasi]);
            await queryRunner.commitTransaction();
            return kategoriLokasi;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        return this.dataSource.getRepository(KategoriLokasi).findOneOrFail({ where: { id } });
    }

    async findAll(request: any) {
        const queryBuilder = this.dataSource.createQueryBuilder(KategoriLokasi, 'kategoriLokasi');
        return this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'kategoriLokasi',
            searchingAll: ['name'],
            searching: ['id', 'name', 'created_at', 'updated_at'],
            searchingOption: ['id', 'name', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
            sorting: ['id', 'name', 'created_at', 'updated_at'],
            defaultSorting: 'kategoriLokasi.id',
            joins: []
        });
    }

    async update(id: number, dto: CreateKategoriLokasiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.findOneOrFail(KategoriLokasi, { where: { id } });
            const data = await queryRunner.manager.update(KategoriLokasi, id, {
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
                    await queryRunner.manager.softDelete(KategoriLokasi, { id: joinObject.id });
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
