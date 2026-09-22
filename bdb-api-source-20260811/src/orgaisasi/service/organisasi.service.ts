import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganisasiDto, organisasiKategoriAkses, OrganisasiJumlahPendudukDto } from '../dto/organisasi.dto';
import { DataSource, In, TreeRepository } from 'typeorm';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { Organisasi } from '../entity/organisasi.entity';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { OrganisasiLevel } from '../entity/level.entity';
import { OrganisasiRole } from '../entity/role.entity';
import { OrganisasiLevelService } from './level.service';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { KategoriLp } from '../entity/kategori-lp.entity';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class OrganisasiService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly levelService: OrganisasiLevelService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async create(dto: OrganisasiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        if (dto.organisasi_level_id != null) {
            try {
                const level = await queryRunner.manager.findOne(OrganisasiLevel, {
                    where: { id: dto.organisasi_level_id },
                    relations: ['Permission']
                });

                if (!level) {
                    throw new BadRequestException({
                        errors: { organisasi_level_id: ['data tidak ada'] }
                    });
                }
                const treeRepo = queryRunner.manager.getTreeRepository(Organisasi);
                const newData = new Organisasi();
                newData.name = dto.name;
                newData.OrganisasiLevel = level;
                const kategori_lp = await queryRunner.manager.find(KategoriLp, {});
                newData.KategoriLp = kategori_lp;

                if (dto.parent_id) {
                    const parent = await treeRepo.findOne({
                        where: { id: dto.parent_id },
                        relations: ['OrganisasiLevel.children'] // atau relasi lain yang kamu butuhkan
                    });
                    if (!parent) throw new BadRequestException({ errors: { parent_id: ['Parent id tidak cocok dengan level '] } });
                    if (!parent.OrganisasiLevel.children?.some(child => +child.id === +dto.organisasi_level_id)) throw new BadRequestException({ errors: { parent_id: ['Parent id tidak cocok dengan level '] } });
                    // newData.parent.id = parent.id;
                    newData.parent = { id: parent.id } as Organisasi;
                }

                await treeRepo.save(newData);
                await this.saveOrganisasiWithIdPath(treeRepo, newData);

                const role = queryRunner.manager.create(OrganisasiRole, {
                    role_name: 'KBO',
                    Permission: level.Permission,
                    Organisasi: { id: newData.id }
                }); // Penting: gunakan treeRepo agar closure table ikut ter-update
                await queryRunner.manager.save(role);
                await queryRunner.commitTransaction();
                return newData;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } else if (dto.organisasi_level_key) {
            const allLevel = await this.levelService.findAll({});
            const parsed = typeof dto.organisasi_level_key === 'string' ? JSON.parse(dto.organisasi_level_key) : dto.organisasi_level_key;
            const key = Object.keys(parsed)[0];
            const selectedLevel = this.findLevelByKey(allLevel.data, key);
            try {
                const level = await queryRunner.manager.findOne(OrganisasiLevel, {
                    where: { id: selectedLevel.id },
                    relations: ['Permission']
                });
                if (!level) {
                    throw new BadRequestException({
                        errors: { organisasi_level_id: ['data tidak ada'] }
                    });
                }
                const treeRepo = queryRunner.manager.getTreeRepository(Organisasi);
                const newData = new Organisasi();
                newData.name = dto.name;
                newData.OrganisasiLevel = level;

                if (dto.parent_id) {
                    const parent = await treeRepo.findOne({
                        where: { id: dto.parent_id },
                        relations: ['OrganisasiLevel.children'] // atau relasi lain yang kamu butuhkan
                    });

                    if (!parent) throw new BadRequestException({ errors: { parent_id: ['Parent id tidak cocok dengan level '] } });
                    if (!parent.OrganisasiLevel.children?.some(child => +child.id === +selectedLevel.id)) throw new BadRequestException({ errors: { parent_id: ['Parent id tidak cocok dengan level '] } });
                    // newData.parent.id = parent.id;
                    newData.parent = { id: parent.id } as Organisasi;
                }
                const kategori_lp = await queryRunner.manager.find(KategoriLp, {});
                newData.KategoriLp = kategori_lp;
                await treeRepo.save(newData);
                await this.saveOrganisasiWithIdPath(treeRepo, newData);
                const role = queryRunner.manager.create(OrganisasiRole, {
                    role_name: 'KBO',
                    Permission: level.Permission,
                    Organisasi: newData
                }); // Penting: gunakan treeRepo agar closure table ikut ter-update
                await queryRunner.manager.save(role);
                await queryRunner.commitTransaction();
                return newData;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        }
    }
    async getTreeOrganisasiWithCache(root_id = 2) {
        const cacheKey = 'treeOrganisasi' + root_id;

        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const rootNode = await this.dataSource.getRepository(Organisasi).findOneBy({ id: root_id });
        if (!rootNode) throw new Error('Root node tidak ditemukan');
        let depth = 20;
        if (root_id != 2) {
            depth = 2;
        }
        const treeOrganisasi = [await this.dataSource.getTreeRepository(Organisasi).findDescendantsTree(rootNode, { depth: depth })];

        function assignKeys(nodes, prefix = '0', isRoot = true) {
            nodes.forEach((node, index) => {
                const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
                node.key = currentKey;
                if (node.children && node.children.length > 0) {
                    assignKeys(node.children, currentKey, false);
                }
            });
        }

        assignKeys(treeOrganisasi);

        function convertToPrimeVueTree(data) {
            return data.map((item, index) => ({
                key: item.key || item.id || String(index),
                label: item.name,
                data: item,
                id: item.id,
                children: convertToPrimeVueTree(item.children || [])
            }));
        }

        const result = { data: convertToPrimeVueTree(treeOrganisasi) };

        // Simpan ke cache selama 1 hari
        await this.cacheManager.set(cacheKey, result, 86400000);
        return result;
    }

    async findAll(request: any, @CurrentUser() authUser) {
        if (request.query.type === 'tree') {
            return await this.getTreeOrganisasiWithCache(request.query.root_node);
        } else {
            const queryBuilder = this.dataSource.createQueryBuilder(Organisasi, 'Organisasi');
            queryBuilder.leftJoinAndSelect('Organisasi.OrganisasiLevel', 'OrganisasiLevel');
            queryBuilder.andWhere('Organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` });

            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'Organisasi',
                searchingAll: ['name'],
                searching: ['id', 'name', 'created_at', 'updated_at'],
                searchingOption: ['id', 'OrganisasiLevel.id', 'name', 'created_at', 'updated_at'],
                searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
                searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
                yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
                sorting: ['id', 'name', 'created_at', 'updated_at'],
                defaultSorting: 'Organisasi.Timestamps.created_at',
                joins: []
            });
            return result;
        }
    }
    async findOne(id: number, @CurrentUser() authUser) {
        const repo = this.dataSource.getTreeRepository(Organisasi);

        // Ambil root node dengan relasi yang kamu butuhkan (kecuali OrganisasiLevel)
        const rootNode = await repo.findOneOrFail({
            where: { id },
            relations: ['OrganisasiRole.Permission', 'KategoriLp']
        });
        const userPath = authUser.Organisasi.path;
        const nodePath = rootNode.path;
        const isChild = nodePath.startsWith(`${userPath}/`);
        if (!isChild && authUser.Organisasi.path != rootNode.path) {
            throw new Error("Unauthorized: Not a descendant of user's organisasi");
        }

        // Ambil tree descendant depth 2
        let tree = await repo.findDescendantsTree(rootNode, { depth: 1 });

        // Kumpulkan semua OrganisasiLevelId yang ada di tree
        const collectOrganisasiLevelIds = (node: any, set: Set<number>) => {
            if (node.organisasi_level_id) set.add(node.organisasi_level_id);
            if (node.children?.length) {
                node.children.forEach((child: any) => collectOrganisasiLevelIds(child, set));
            }
        };
        const orgLevelIds = new Set<number>();
        collectOrganisasiLevelIds(tree, orgLevelIds);

        // Query OrganisasiLevel sekali saja, ambil id dan level_name
        const orgLevelRepo = this.dataSource.getRepository(OrganisasiLevel);
        const organisasiLevels = await orgLevelRepo.find({
            where: {
                id: In(Array.from(orgLevelIds))
            },
            select: ['id', 'level_name']
        });

        // Buat map dari id ke OrganisasiLevel singkat
        const orgLevelMap = new Map<number, { id: number; level_name: string }>();
        organisasiLevels.forEach(level => {
            orgLevelMap.set(level.id, level);
        });

        // Fungsi assign keys dan pasang OrganisasiLevel dari map
        const assignKeysAndLevel = (nodes: any[], prefix = '0', isRoot = true) => {
            nodes.forEach((node, index) => {
                const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
                node.key = currentKey;
                node.OrganisasiLevel = orgLevelMap.get(node.organisasi_level_id) || null;
                if (node.children?.length) {
                    assignKeysAndLevel(node.children, currentKey, false);
                }
            });
        };

        assignKeysAndLevel([tree]);

        return tree;
    }

    async update(id: number, dto: OrganisasiDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const treeRepo = queryRunner.manager.getTreeRepository(Organisasi);

            const existingOrganisasi = await treeRepo.findOne({
                where: { id },
                relations: ['OrganisasiLevel', 'parent', 'OrganisasiLevel.children', 'KategoriLp']
            });

            if (!existingOrganisasi) {
                throw new BadRequestException({ errors: { id: ['Data organisasi tidak ditemukan'] } });
            }

            // Update name
            if (dto.name) existingOrganisasi.name = dto.name;
            if (existingOrganisasi.KategoriLp.length == 0) {
                const kategori_lp = await queryRunner.manager.find(KategoriLp, {});
                existingOrganisasi.KategoriLp = kategori_lp;
            }
            // Determine level
            let level: OrganisasiLevel | null = null;

            if (dto.organisasi_level_id) {
                level = await queryRunner.manager.findOne(OrganisasiLevel, {
                    where: { id: dto.organisasi_level_id },
                    relations: ['Permission']
                });
                if (!level) {
                    throw new BadRequestException({
                        errors: { organisasi_level_id: ['data tidak ada'] }
                    });
                }
            } else if (dto.organisasi_level_key) {
                const allLevel = await this.levelService.findAll({});
                const parsed = typeof dto.organisasi_level_key === 'string' ? JSON.parse(dto.organisasi_level_key) : dto.organisasi_level_key;
                const key = Object.keys(parsed)[0];
                const selectedLevel = this.findLevelByKey(allLevel.data, key);

                level = await queryRunner.manager.findOne(OrganisasiLevel, {
                    where: { id: selectedLevel.id },
                    relations: ['Permission']
                });

                if (!level) {
                    throw new BadRequestException({
                        errors: { organisasi_level_id: ['data tidak ada'] }
                    });
                }
            }

            if (level) {
                existingOrganisasi.OrganisasiLevel = level;
            }

            // Update parent
            if (dto.parent_id) {
                const parent = await treeRepo.findOne({
                    where: { id: dto.parent_id },
                    relations: ['OrganisasiLevel.children']
                });

                if (!parent) {
                    throw new BadRequestException({ errors: { parent_id: ['Parent id tidak ditemukan'] } });
                }

                if (level && !parent.OrganisasiLevel.children?.some(child => +child.id === +level.id)) {
                    throw new BadRequestException({ errors: { parent_id: ['Parent id tidak cocok dengan level'] } });
                }

                // existingOrganisasi.parent.id = parent.id;
                existingOrganisasi.parent = { id: parent.id } as Organisasi;
            }

            await treeRepo.save(existingOrganisasi);
            await this.saveOrganisasiWithIdPath(treeRepo, existingOrganisasi);

            // Update Role - OPTIONAL: Only if permissions changed
            if (level) {
                // ======== Handle Role KBO ========
                const existingRoleKBO = await queryRunner.manager.findOne(OrganisasiRole, {
                    where: { Organisasi: { id }, role_name: 'KBO' },
                    relations: ['Permission']
                });

                if (existingRoleKBO) {
                    existingRoleKBO.Permission = level.Permission;
                    await queryRunner.manager.save(existingRoleKBO);
                } else {
                    const newRoleKBO = queryRunner.manager.create(OrganisasiRole, {
                        role_name: 'KBO',
                        Permission: level.Permission,
                        Organisasi: { id }
                    });
                    await queryRunner.manager.save(newRoleKBO);
                }

                // ======== Handle Role STAF KBO ========
                const existingRoleSTAFKBO = await queryRunner.manager.findOne(OrganisasiRole, {
                    where: { Organisasi: { id }, role_name: 'STAF KBO' },
                    relations: ['Permission']
                });

                if (existingRoleSTAFKBO) {
                    const filteredPermissions = level.Permission.filter(p => p.group !== 'master');
                    existingRoleSTAFKBO.Permission = filteredPermissions;
                    await queryRunner.manager.save(existingRoleSTAFKBO);
                } else {
                    const filteredPermissions = level.Permission.filter(p => p.group !== 'master');
                    const newRoleSTAFKBO = queryRunner.manager.create(OrganisasiRole, {
                        role_name: 'STAF KBO',
                        Permission: filteredPermissions,
                        Organisasi: { id }
                    });
                    await queryRunner.manager.save(newRoleSTAFKBO);
                }
            }

            await queryRunner.commitTransaction();
            return 'success';
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async updateJumlahPenduduk(id: number, dto: OrganisasiJumlahPendudukDto, @CurrentUser() authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const existData = await queryRunner.manager.findOne(Organisasi, {
            where: {
                id: id
            }
        });

        if (!existData) {
            throw new BadRequestException({ errors: { id: ['Data organisasi tidak ditemukan'] } });
        }

        await queryRunner.startTransaction();
        try {
            // Update JUmlah Penduduk
            if (dto.jumlah_penduduk) existData.jumlah_penduduk = dto.jumlah_penduduk;
            await queryRunner.manager.save(existData);
            await queryRunner.commitTransaction();
            return 'success';
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
                    await queryRunner.manager.softDelete(Organisasi, {
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

    private findLevelByKey(data, targetKey) {
        for (const item of data) {
            // Check if top-level key matches
            if (item.key === targetKey || item.data?.key === targetKey) {
                return item.data || item;
            }

            // Check in children under data
            if (item.data?.children?.length) {
                const found = this.findLevelByKey(item.data.children, targetKey);
                if (found) return found;
            }

            // Check in direct children
            if (item.children?.length) {
                const found = this.findLevelByKey(item.children, targetKey);
                if (found) return found;
            }
        }

        return null; // not found
    }
    async buildIdPath(entity: Organisasi, treeRepo: TreeRepository<Organisasi>): Promise<string> {
        const ancestors = await treeRepo.findAncestors(entity);
        const ordered = ancestors.sort((a, b) => a.id - b.id);
        return '/' + ordered.map(a => a.id).join('/');
    }
    private async saveOrganisasiWithIdPath(treeRepo: TreeRepository<Organisasi>, organisasi: Organisasi) {
        await treeRepo.save(organisasi); // Simpan dulu untuk dapat ID
        organisasi.path = await this.buildIdPath(organisasi, treeRepo);
        return await treeRepo.save(organisasi); // Simpan ulang dengan path
    }
}
