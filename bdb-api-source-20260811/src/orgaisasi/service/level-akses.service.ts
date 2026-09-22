// import { Injectable } from '@nestjs/common';
// import { TableHelperService } from '@app_core/helper/service/table.helper.service';
// import { DataSource } from 'typeorm';
// import { DeleteDto } from '@app_core/helper/helperDelete.dto';
// import { OrganisasiLevelAkses } from '../entity/level-akses.entity';
// import { OrganisasiLevelAksesDto } from '../dto/level-akses.dto';

// @Injectable()
// export class OrganisasiLevelService {
//     constructor(
//         private readonly dataSource: DataSource,
//         private readonly tableHelper: TableHelperService
//     ) {}

//     async create(dto: OrganisasiLevelAksesDto) {
//         const queryRunner = this.dataSource.createQueryRunner();
//         await queryRunner.connect();
//         await queryRunner.startTransaction();
//         try {
//             const newData = queryRunner.manager.create(OrganisasiLevelAkses, {
//                 ...dto
//             });
//             await queryRunner.manager.save(newData);
//             await queryRunner.commitTransaction();
//             return 'success';
//         } catch (error) {
//             await queryRunner.rollbackTransaction();
//             throw error;
//         } finally {
//             await queryRunner.release();
//         }
//     }

//     async findOne(id: number) {
//         const result = await this.dataSource.getRepository(OrganisasiLevelAkses).findOne({
//             where: {
//                 id: id
//             },
//             relations: []
//         });
//         return result;
//     }

//     async findAll(request: any) {
//         const queryBuilder = this.dataSource.createQueryBuilder(OrganisasiLevelAkses, 'OrganisasiLevelAkses');
//         const result = await this.tableHelper.applyFilters(queryBuilder, request, {
//             coreTable: 'OrganisasiLevelAkses',
//             searchingAll: ['level_name'],
//             searching: ['id', 'level_name', 'created_at', 'updated_at'],
//             searchingOption: ['id', 'level_name', 'created_at', 'updated_at'],
//             searchingOrWhere: ['id', 'level_name', 'created_at', 'updated_at'],
//             searchingBeetween: ['id', 'level_name', 'created_at', 'updated_at'],
//             yearMonthFilter: ['id', 'level_name', 'created_at', 'updated_at'],
//             sorting: ['id', 'level_name', 'created_at', 'updated_at'],
//             defaultSorting: 'OrganisasiLevelAkses.created_at',
//             joins: []
//         });
//         return result;
//     }

//     async update(id: number, dto: OrganisasiLevelAksesDto) {
//         const queryRunner = this.dataSource.createQueryRunner();
//         await queryRunner.connect();
//         const existData = await queryRunner.manager.findOneOrFail(OrganisasiLevelAkses, {
//             where: {
//                 id: id
//             }
//         });
//         await queryRunner.startTransaction();
//         try {
//             const data = queryRunner.manager.merge(OrganisasiLevelAkses, existData, {
//                 ...dto
//             });
//             await queryRunner.manager.save(data);
//             await queryRunner.commitTransaction();
//             return 'success';
//         } catch (error) {
//             await queryRunner.rollbackTransaction();
//             throw error;
//         } finally {
//             await queryRunner.release();
//         }
//     }

//     async remove(deleteDto: DeleteDto) {
//         const queryRunner = this.dataSource.createQueryRunner();
//         await queryRunner.connect();
//         await queryRunner.startTransaction();
//         try {
//             if (deleteDto.data && deleteDto.data.length > 0) {
//                 for (const joinObject of deleteDto.data) {
//                     await queryRunner.manager.softDelete(OrganisasiLevelAkses, {
//                         id: joinObject.id
//                     });
//                 }
//             }
//             await queryRunner.commitTransaction();
//             return 'Successfully removed';
//         } catch (error) {
//             await queryRunner.rollbackTransaction();
//             throw error;
//         } finally {
//             await queryRunner.release();
//         }
//     }
// }
