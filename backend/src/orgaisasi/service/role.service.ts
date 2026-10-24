import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganisasiRoleDto, OrganisasiRoleMenuDto } from '../dto/role.dto';
import { DataSource, In } from 'typeorm';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { OrganisasiRole } from '../entity/role.entity';
import { PermissionService } from '@app_core/auth/permission/permission.service';
import { Permission } from '@app_core/auth/permission/entities/permission.entity';
import { v4 as uuidv4 } from 'uuid';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { Organisasi } from '../entity/organisasi.entity';

// 4 role baku sistem (dipakai luas di seluruh app -- AuthGuard, resolveScope, Pemetaan Menu &
// Role, dst) -- TIDAK BOLEH diubah nama atau dihapus lewat menu Organisasi Role ini, supaya tak
// ada yang bisa merename/menghapusnya lalu merusak akses semua user existing dengan role itu.
// Role CUSTOM di luar 4 ini (ditambahkan lewat menu yang sama) bebas diubah/dihapus.
const BAKU_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer'];
function isBakuRole(roleName: string | null | undefined): boolean {
    return BAKU_ROLES.includes(String(roleName || '').trim().toLowerCase());
}

@Injectable()
export class OrganisasiRoleService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly menu: PermissionService
    ) {}
    async create(dto: OrganisasiRoleDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const invitation_code = uuidv4();
        // organisasi_id opsional -- aplikasi ini single-tenant, kalau tak dikirim FE (mis. dari
        // form Tambah Role yg cuma minta nama role) pakai organisasi tunggal yg ada.
        const organisasi = dto.organisasi_id
            ? await queryRunner.manager.findOne(Organisasi, { where: { id: dto.organisasi_id } })
            : await queryRunner.manager.findOne(Organisasi, { where: {} });
        if (!organisasi) {
            throw new Error('Data tidak ada');
        }
        try {
            const newData = queryRunner.manager.create(OrganisasiRole, {
                role_name: dto.role_name,
                Organisasi: organisasi,
                invitation_code: invitation_code,
                invitation_url: process.env.FRONTEND + '/guest/invitation/' + invitation_code + '/' + organisasi.name
            });
            await queryRunner.manager.save(newData);
            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        const result = await this.dataSource.getRepository(OrganisasiRole).findOne({
            where: {
                id: id
            },
            relations: []
        });
        return result;
    }

    async findAll(request: any, @CurrentUser() authUser) {
        const queryBuilder = this.dataSource.createQueryBuilder(OrganisasiRole, 'OrganisasiRole');
        // authUser.Organisasi.path bisa NULL (bukan cuma '') -- template literal `${null}` jadi
        // string literal "null", bikin `Organisasi.path LIKE 'null%'` tak pernah cocok dgn path
        // yg sungguhan NULL di DB. Sekaligus kolom Organisasi.path itu sendiri bisa NULL (NULL
        // LIKE apapun = NULL/false di SQL) -- COALESCE kedua sisi spy org tanpa path (mis. root
        // yg belum sempat di-backfill) tetap match, bukan malah kefilter habis diam-diam.
        const userPath = authUser.Organisasi.path ?? '';
        queryBuilder.leftJoinAndSelect('OrganisasiRole.Organisasi', 'Organisasi').andWhere("COALESCE(Organisasi.path, '') LIKE :path", { path: `${userPath}%` });
        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'OrganisasiRole',
            searchingAll: ['role_name'],
            searching: ['id', 'role_name', 'created_at', 'updated_at'],
            searchingOption: ['id', 'role_name', 'organisasiId', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'role_name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'role_name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'role_name', 'created_at', 'updated_at'],
            sorting: ['id', 'role_name', 'created_at', 'updated_at'],
            defaultSorting: 'OrganisasiRole.Timestamps.created_at',
            joins: []
        });
        return result;
    }

    async update(id: number, dto: OrganisasiRoleDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        // relations: ['Organisasi'] WAJIB -- relasi Organisasi bukan eager (lihat role.entity.ts),
        // tanpa ini existData.Organisasi.name di bawah throw "Cannot read property 'name' of
        // undefined" (bug lama yg baru ketahuan krn endpoint ini belum pernah dipanggil FE).
        const existData = await queryRunner.manager.findOneOrFail(OrganisasiRole, {
            where: {
                id: id
            },
            relations: ['Organisasi']
        });
        if (isBakuRole(existData.role_name)) {
            await queryRunner.release();
            throw new ForbiddenException(`Role baku "${existData.role_name}" tidak dapat diubah -- dipakai luas di seluruh sistem.`);
        }
        await queryRunner.startTransaction();
        const invitation_code = uuidv4();
        try {
            const data = queryRunner.manager.merge(OrganisasiRole, existData, {
                role_name: dto.role_name,
                // organisasi_id opsional saat edit -- kalau tak dikirim, jangan sentuh relasi
                // Organisasi yg sudah ada (form Edit Role cuma minta nama role).
                ...(dto.organisasi_id ? { Organisasi: { id: dto.organisasi_id } } : {}),
                invitation_code: existData.invitation_code === null ? invitation_code : existData.invitation_code,
                invitation_url: process.env.FRONTEND + '/guest/invitation/' + invitation_code + '/' + existData.Organisasi.name
            });
            await queryRunner.manager.save(data);
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
        // Cek SEMUA id dulu sblm hapus apa pun -- kalau salah satu role baku, seluruh batch
        // ditolak (bukan hapus sebagian lalu gagal di tengah, yg bikin state ambigu).
        if (deleteDto.data && deleteDto.data.length > 0) {
            const ids = deleteDto.data.map((d) => d.id);
            const rows = await queryRunner.manager.find(OrganisasiRole, { where: { id: In(ids) } });
            const bakuHit = rows.find((r) => isBakuRole(r.role_name));
            if (bakuHit) {
                await queryRunner.release();
                throw new ForbiddenException(`Role baku "${bakuHit.role_name}" tidak dapat dihapus -- dipakai luas di seluruh sistem.`);
            }
        }
        await queryRunner.startTransaction();
        try {
            if (deleteDto.data && deleteDto.data.length > 0) {
                for (const joinObject of deleteDto.data) {
                    await queryRunner.manager.softDelete(OrganisasiRole, {
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

    async RoleMenuIndex(id: number) {
        // Load all menu
        const menu = await this.menu.findAll({});

        // Parallel load: get OrganisasiRole and its Permissions, and the OrganisasiLevel Permissions separately
        const [organisasiRole, organisasiLevelPermissions] = await Promise.all([
            this.dataSource.getRepository(OrganisasiRole).findOne({
                where: { id },
                relations: ['Permission', 'Organisasi'] // Load only immediate relation
            }),
            this.dataSource.getRepository(OrganisasiRole).findOne({
                where: { id },
                relations: ['Organisasi.OrganisasiLevel.Permission'] // Only this deep relation
            })
        ]);

        // Defensive checks
        if (!organisasiRole || !organisasiLevelPermissions?.Organisasi?.OrganisasiLevel) {
            throw new Error('Data not found or incomplete');
        }

        // Merge permission from both calls
        const permissionIds = (organisasiLevelPermissions.Organisasi.OrganisasiLevel.Permission ?? []).map(p => p.id);

        const filteredMenu = this.filterMenuByPermissions(menu, permissionIds);
        const updatedMenu = this.assignKeys(filteredMenu);

        const allowedIds = new Set((organisasiRole.Permission ?? []).map(p => String(p.id)));
        const selected_value = this.buildSelectedValue(updatedMenu, allowedIds);

        type SelectionStatus = { checked: boolean; partialChecked: boolean };
        const selected_value_clean = Object.fromEntries(Object.entries(selected_value as Record<string, SelectionStatus>).filter(([_, value]) => value.checked || value.partialChecked));

        return {
            menu: updatedMenu,
            selected_key: selected_value_clean
        };
    }

    async RoleMenuUpdate(id: number, dto: OrganisasiRoleMenuDto) {
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
                const existing = await queryRunner.manager.getRepository(OrganisasiRole).findOne({
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
            const allMenu = await this.menu.findAll({});
            const OrganisasiRoleData = await this.dataSource.getRepository(OrganisasiRole).findOne({
                where: { id },
                relations: ['Permission', 'Organisasi.OrganisasiLevel.Permission'] // optional, bisa berguna kalau Anda mau merge
            });

            const permissionIds = OrganisasiRoleData.Organisasi.OrganisasiLevel.Permission.map(p => p.id);
            const filteredMenu = this.filterMenuByPermissions(allMenu, permissionIds);
            const updatedMenu = this.assignKeys(filteredMenu);

            const menu = updatedMenu;
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
                const existing = await queryRunner.manager.getRepository(OrganisasiRole).findOne({
                    where: { id },
                    relations: ['Permission'] // optional, bisa berguna kalau Anda mau merge
                });

                if (!existing) {
                    throw new NotFoundException('OrganisasiLevel tidak ditemukan');
                }

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
        }
    }

    filterMenuByPermissions(menuItems, permissionIds) {
        return menuItems
            .map(item => {
                // Periksa children terlebih dahulu (rekursif)
                const filteredChildren = this.filterMenuByPermissions(item.children || [], permissionIds);

                // Cek apakah id item ini ada dalam permissionIds atau ada anak yang diizinkan

                const isAllowed = permissionIds.includes(item.id);
                if (isAllowed || filteredChildren.length > 0) {
                    return {
                        ...item,
                        children: filteredChildren
                    };
                }

                // Jika tidak termasuk dan tidak punya anak yang valid, buang
                return null;
            })
            .filter(Boolean); // buang item null
    }
    assignKeys(nodes, prefix = '0', isRoot = true) {
        return nodes.map((node, index) => {
            const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
            const newNode = { ...node, key: currentKey };

            if (node.children && node.children.length > 0) {
                newNode.children = this.assignKeys(node.children, currentKey, false);
            }

            return newNode;
        });
    }

    buildSelectedValue(menu, allowedIds) {
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

    async generateUrl(id: number, @CurrentUser() authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const existData = await queryRunner.manager
            .createQueryBuilder(OrganisasiRole, 'role')
            .leftJoinAndSelect('role.Organisasi', 'organisasi')
            .where('role.id = :id', { id })
            .andWhere('organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` })
            .getOne();
        if (!existData) {
            throw new Error('Data tidak ada');
        }
        await queryRunner.startTransaction();
        const invitation_code = uuidv4();
        try {
            const data = queryRunner.manager.merge(OrganisasiRole, existData, {
                invitation_code: invitation_code,
                invitation_url: process.env.FRONTEND + '/guest/invitation/' + invitation_code + '/' + existData.Organisasi.name
            });
            await queryRunner.manager.save(data);
            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
