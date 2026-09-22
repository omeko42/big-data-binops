import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganisasiLevelAksesDto, OrganisasiLevelDto, OrganisasiLevelMenuDto } from '../dto/level.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DataSource, In } from 'typeorm';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { OrganisasiLevel } from '../entity/level.entity';
import { Permission } from '@app_core/auth/permission/entities/permission.entity';
import { PermissionService } from '@app_core/auth/permission/permission.service';

@Injectable()
export class OrganisasiLevelService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly menu: PermissionService
    ) {}

    async create(dto: OrganisasiLevelDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const treeRepo = queryRunner.manager.getTreeRepository(OrganisasiLevel);
            const newData = new OrganisasiLevel();
            newData.level_name = dto.level_name;

            if (dto.parent_id) {
                const parent = await treeRepo.findOneBy({ id: dto.parent_id });
                if (!parent) throw new Error('Parent not found');
                newData.parent = parent;
            }

            await treeRepo.save(newData); // Penting: gunakan treeRepo agar closure table ikut ter-update
            await queryRunner.commitTransaction();
            return 'success';
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        const result = await this.dataSource.getRepository(OrganisasiLevel).findOne({
            where: {
                id: id
            },
            relations: []
        });
        return result;
    }

    async findAll(request: any) {
        let treeMenu = await this.dataSource.getTreeRepository(OrganisasiLevel).findTrees({ depth: 9 });
        function assignKeys(nodes, prefix = '0', isRoot = true) {
            nodes.forEach((node, index) => {
                const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
                node.key = currentKey;
                node.label = node.level_name;
                if (node.children && node.children.length > 0) {
                    assignKeys(node.children, currentKey, false);
                }
            });
        }

        assignKeys(treeMenu);
        if (request.parent_level_id) {
            function findSubtreeById(tree, targetId) {
                for (const node of tree) {
                    if (node.id === targetId) {
                        return node; // Ditemukan, langsung return node-nya
                    }
                    if (node.children && node.children.length > 0) {
                        const result = findSubtreeById(node.children, targetId);
                        if (result) return result;
                    }
                }
                return null;
            }

            const rootNode = findSubtreeById(treeMenu, request.parent_level_id);
            treeMenu = rootNode?.children ?? [];
        }
        return { data: treeMenu };
    }

    async update(id: number, dto: OrganisasiLevelDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const treeRepo = queryRunner.manager.getTreeRepository(OrganisasiLevel);
            const existing = await treeRepo.findOneBy({ id });
            if (!existing) throw new Error('ReportStatus not found');
            existing.level_name = dto.level_name ?? existing.level_name;
            if (dto.parent_id !== undefined) {
                if (dto.parent_id === null) {
                    existing.parent = null;
                } else {
                    const parent = await treeRepo.findOneBy({ id: dto.parent_id });
                    if (!parent) throw new Error('Parent not found');
                    if (parent.id === id) throw new Error('Cannot set self as parent');
                    existing.parent = parent;
                }
            }
            await treeRepo.save(existing);
            await queryRunner.commitTransaction();
            return 'success';
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
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
                    await queryRunner.manager.softDelete(OrganisasiLevel, {
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

    async LevelMenuUpdate(id: number, dto: OrganisasiLevelMenuDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (dto.permission_ids && dto.permission_ids.length > 0) {
            try {
                const permissionIds = dto.permission_ids; // pastikan dto.permission_ids adalah number[]
                const permissions = await queryRunner.manager.getRepository(Permission).find({
                    where: { id: In(permissionIds) }
                });

                if (!permissions || permissions.length === 0) {
                    throw new BadRequestException({ errors: { permission_ids: ['Permission tidak ditemukan'] } });
                }

                // Ambil data OrganisasiLevel
                const existing = await queryRunner.manager.getRepository(OrganisasiLevel).findOne({
                    where: { id },
                    relations: ['Permission'] // optional, bisa berguna kalau Anda mau merge
                });

                if (!existing) {
                    throw new NotFoundException('OrganisasiLevel tidak ditemukan');
                }

                // Update permission
                existing.Permission = permissions;
                await queryRunner.manager.save(existing);
                await queryRunner.commitTransaction();
                return 'success';
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } else if (dto.selection_key && dto.selection_key != null && typeof dto.selection_key === 'object') {
            const menu = await this.menu.findAll({});
            let menu_key: { key: string; id: number }[] = [];
            function traverse(menu, parentKey = '') {
                menu.forEach((item, index) => {
                    const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
                    menu_key.push({
                        key: currentKey,
                        id: Number(item.id)
                    });
                    if (item.children && item.children.length > 0) {
                        traverse(item.children, currentKey);
                    }
                });
            }
            traverse(menu);
            const array_selected_key = Object.entries(dto.selection_key).map(([key, value]) => ({
                key,
                checked: value.checked,
                partialChecked: value.partialChecked
            }));

            let permission_ids = [];
            menu_key.forEach(element => {
                array_selected_key.forEach(selected => {
                    if (element.key === selected.key) {
                        permission_ids.push(element.id);
                    }
                });
            });
            try {
                const permissionIds = permission_ids; // pastikan dto.permission_ids adalah number[]
                const permissions = await queryRunner.manager.getRepository(Permission).find({
                    where: { id: In(permissionIds) }
                });

                if (!permissions || permissions.length === 0) {
                    throw new BadRequestException({ errors: { permission_ids: ['Permission tidak ditemukan'] } });
                }

                // Ambil data OrganisasiLevel
                const existing = await queryRunner.manager.getRepository(OrganisasiLevel).findOne({
                    where: { id },
                    relations: ['Permission'] // optional, bisa berguna kalau Anda mau merge
                });

                if (!existing) {
                    throw new NotFoundException('OrganisasiLevel tidak ditemukan');
                }

                // Update permission
                existing.Permission = permissions;
                // console.log(permissionIds);
                // console.log(permissions);
                await queryRunner.manager.save(existing);
                await queryRunner.commitTransaction();
                return 'success';
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        }
    }

    async LevelMenuIndex(id: number) {
        const menu = await this.menu.findAll({});
        const OrganisasiLevelData = await this.dataSource.getRepository(OrganisasiLevel).findOne({
            where: { id },
            relations: ['Permission'] // optional, bisa berguna kalau Anda mau merge
        });
        function buildSelectedValue(menu, allowedIds) {
            const result = {};

            function traverse(node, keyPath = '') {
                const key = keyPath;
                const id = String(node.id);
                const hasChildren = node.children && node.children.length > 0;

                let childStatus = [];

                if (hasChildren) {
                    node.children.forEach((child, index) => {
                        const childKey = key ? `${key}-${index}` : `${index}`;
                        const status = traverse(child, childKey);
                        childStatus.push(status);
                    });

                    const allChecked = childStatus.every(s => s.checked && !s.partialChecked);
                    const someChecked = childStatus.some(s => s.checked || s.partialChecked);

                    if (allChecked) {
                        result[key] = { checked: true, partialChecked: false };
                        return { checked: true, partialChecked: false };
                    } else if (someChecked) {
                        result[key] = { checked: false, partialChecked: true };
                        return { checked: false, partialChecked: true };
                    } else {
                        return { checked: false, partialChecked: false };
                    }
                } else {
                    const isChecked = allowedIds.has(id);
                    if (key) {
                        result[key] = {
                            checked: isChecked,
                            partialChecked: false
                        };
                    }
                    return {
                        checked: isChecked,
                        partialChecked: false
                    };
                }
            }

            menu.forEach((item, index) => {
                traverse(item, `${index}`);
            });

            return result;
        }

        const allowedIds = new Set(OrganisasiLevelData.Permission.map(p => String(p.id)));
        const selected_value = buildSelectedValue(menu, allowedIds);

        type SelectionStatus = { checked: boolean; partialChecked: boolean };

        const selected_value_clean = Object.fromEntries(Object.entries(selected_value as Record<string, SelectionStatus>).filter(([_, value]) => value.checked || value.partialChecked));
        return { menu: menu, selected_key: selected_value_clean };
    }

    async LevelAksesUpdate(id: number, dto: OrganisasiLevelAksesDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (dto.level_ids && dto.level_ids.length > 0) {
            try {
                const levels = await queryRunner.manager.getRepository(OrganisasiLevel).find({
                    where: { id: In(dto.level_ids) }
                });

                if (!levels || levels.length === 0) {
                    throw new BadRequestException({ errors: { permission_ids: ['level tidak ditemukan'] } });
                }

                // Ambil data OrganisasiLevel
                const existing = await queryRunner.manager.getRepository(OrganisasiLevel).findOne({
                    where: { id },
                    relations: ['aksesChild'] // optional, bisa berguna kalau Anda mau merge
                });

                if (!existing) {
                    throw new NotFoundException('OrganisasiLevel tidak ditemukan');
                }

                // Update permission
                existing.aksesChild = levels;
                await queryRunner.manager.save(existing);
                await queryRunner.commitTransaction();
                return 'success';
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } else if (dto.selection_key && dto.selection_key != null && typeof dto.selection_key === 'object') {
            const level = await this.findAll({});
            let level_key: { key: string; id: number }[] = [];
            function traverse(menu, parentKey = '') {
                menu.forEach((item, index) => {
                    const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
                    level_key.push({
                        key: currentKey,
                        id: Number(item.id)
                    });
                    if (item.children && item.children.length > 0) {
                        traverse(item.children, currentKey);
                    }
                });
            }
            traverse(level.data);
            const array_selected_key = Object.entries(dto.selection_key).map(([key, value]) => ({
                key
            }));
            let level_ids = [];
            level_key.forEach(element => {
                array_selected_key.forEach(selected => {
                    if (element.key === selected.key) {
                        level_ids.push(element.id);
                    }
                });
            });
            try {
                const levels = await queryRunner.manager.getRepository(OrganisasiLevel).find({
                    where: { id: In(level_ids) }
                });

                if (!levels || levels.length === 0) {
                    throw new BadRequestException({ errors: { permission_ids: ['level tidak ditemukan'] } });
                }

                // Ambil data OrganisasiLevel
                const existing = await queryRunner.manager.getRepository(OrganisasiLevel).findOne({
                    where: { id },
                    relations: ['aksesChild'] // optional, bisa berguna kalau Anda mau merge
                });

                if (!existing) {
                    throw new NotFoundException('OrganisasiLevel tidak ditemukan');
                }

                // Update permission
                existing.aksesChild = levels;
                await queryRunner.manager.save(existing);
                await queryRunner.commitTransaction();
                return 'success';
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        }
    }

    async LevelAksesIndex(id: number) {
        const level = await this.findAll({});
        const OrganisasiLevelData = await this.dataSource.getRepository(OrganisasiLevel).findOne({
            where: { id },
            relations: ['aksesChild'] // optional, bisa berguna kalau Anda mau merge
        });
        let level_key: { key: string; id: number }[] = [];        
        function traverse(menu, parentKey = '') {
            menu.forEach((item, index) => {
                const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
                level_key.push({
                    key: currentKey,
                    id: Number(item.id)
                });
                if (item.children && item.children.length > 0) {
                    traverse(item.children, currentKey);
                }
            });
        }
        traverse(level.data);
        let level_ids: { id: number }[] = [];
        OrganisasiLevelData.aksesChild.forEach(element => {
            level_ids.push({
                id: Number(element.id)
            });
        });
        const idSet = new Set(level_ids.map(item => item.id));
        const selected_key = {};
        level_key.forEach(item => {
            if (idSet.has(item.id)) {
                selected_key[item.key] = true;
            }
        });
        return { data: level.data, selected_key: selected_key };
    }
}
