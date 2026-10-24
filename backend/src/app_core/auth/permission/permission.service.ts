import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '@app_core/auth/permission/dto/create-permission.dto';
import { UpdatePermissionDto } from '@app_core/auth/permission/dto/update-permission.dto';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DataSource } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { RouteService } from '../route/route.service';
import { OrganisasiLevel } from 'src/orgaisasi/entity/level.entity';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { OrganisasiRole } from 'src/orgaisasi/entity/role.entity';

@Injectable()
export class PermissionService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly routeService: RouteService
    ) {}
    async create() {
        const routeData = await this.routeService.getAllEndpoints();
        const data = routeData.sort((a, b) => {
            const getPriority = item => {
                if (item.menu === '' && item.action === '') return 1; // no menu & no action
                if (!item.action) return 2; // no action
                if (item.parent === '') return 3; // no parent
                return 4; // others
            };

            return getPriority(a) - getPriority(b);
        });

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const route of data) {
                const isAuthenticationRoot = route.path === '/' || route.tags === 'auth' || route.group == null || route.group == '';
                if (isAuthenticationRoot) {
                    continue;
                }
                const existData = await queryRunner.manager.findOne(Permission, {
                    where: {
                        access_route: route.path,
                        method: route.method
                    }
                });
                let parentData: Permission = null;
                if (route.parent != null && route.parent != '') {
                    const dataParent = await queryRunner.manager.findOne(Permission, {
                        where: {
                            access_name: route.parent
                        }
                    });
                    parentData = dataParent;
                }
                if (existData) {
                    // Update data yang ada
                    const updatedData = {
                        group: route.group,
                        menu: route.menu,
                        action: route.action,
                        access_name: route.name,
                        parent_menu: route.parent === '' ? null : route.parent,
                        parent: parentData
                    };
                    queryRunner.manager.merge(Permission, existData, updatedData);
                    await queryRunner.manager.save(existData);
                } else {
                    // Buat baru jika belum ada
                    const createdData = {
                        group: route.group,
                        menu: route.menu,
                        action: route.action,
                        access_route: route.path,
                        access_name: route.name,
                        method: route.method,
                        parent_menu: route.parent === '' ? null : route.parent,
                        parent: parentData
                    };
                    const newData = queryRunner.manager.create(Permission, createdData);
                    await queryRunner.manager.save(newData);
                }
            }
            const allPermission = await queryRunner.manager.find(Permission);

            const administratorLevel = await queryRunner.manager.findOne(OrganisasiLevel, {
                where: {
                    id: 1
                },
                relations: ['Permission']
            });

            if (!administratorLevel) {
                await queryRunner.manager.save(
                    queryRunner.manager.create(OrganisasiLevel, {
                        id: 1,
                        level_name: 'administrator',
                        Permission: allPermission
                    })
                );
            } else {
                administratorLevel.Permission = allPermission;
                await queryRunner.manager.save(administratorLevel);
            }

            const mabes = await queryRunner.manager.findOne(OrganisasiLevel, {
                where: {
                    id: 2
                }
            });

            if (!mabes) {
                await queryRunner.manager.save(
                    queryRunner.manager.create(OrganisasiLevel, {
                        id: 2,
                        level_name: 'mabes',
                        parent: { id: 1 }
                    })
                );
            }
            const superadminRoleName = 'superadmin';
            const superadminEmail = process.env.BDB_SUPERADMIN_EMAIL || 'superadmin@bareskrim.polri.go.id';
            const superadminName = process.env.BDB_SUPERADMIN_NAME || 'BDB Superadmin Dev';
            const superadminPassword = process.env.BDB_SUPERADMIN_PASSWORD || superadminEmail;

            const administratorBdb = await queryRunner.manager.findOne(Organisasi, {
                where: {
                    id: 1
                }
            });

            if (!administratorBdb) {
                const newOrganisasi = queryRunner.manager.create(Organisasi, {
                    id: 1,
                    name: 'BDB Superadmin',
                    OrganisasiLevel: { id: 1 }
                });
                await queryRunner.manager.save(newOrganisasi);

                const roleOrganisasi = queryRunner.manager.create(OrganisasiRole, {
                    role_name: superadminRoleName,
                    Organisasi: newOrganisasi,
                    Permission: allPermission
                });
                await queryRunner.manager.save(roleOrganisasi);

                const user = queryRunner.manager.create(User, {
                    name: superadminName,
                    email: superadminEmail,
                    email_google: superadminEmail.endsWith('@gmail.com') ? superadminEmail : null,
                    email_polri: superadminEmail.endsWith('@polri.go.id') ? superadminEmail : null,
                    login_method: 'HYBRID',
                    local_password_enabled: true,
                    role_bdb: 'superadmin',
                    requested_role_bdb: 'superadmin',
                    approval_status: 'APPROVED',
                    two_factor_required: false,
                    email_otp_required: true,
                    password: await bcrypt.hash(superadminPassword, 10),
                    role_name: superadminRoleName,
                    OrganisasiRole: roleOrganisasi,
                    Organisasi: newOrganisasi,
                    otp: false,
                    totp: false,
                    status: 'AKTIF'
                });
                await queryRunner.manager.save(user);
            } else {
                let roleOrganisasi = await queryRunner.manager.findOne(OrganisasiRole, {
                    where: {
                        Organisasi: { id: 1 },
                        id: 1
                    },
                    relations: ['Permission']
                });

                if (!roleOrganisasi) {
                    roleOrganisasi = queryRunner.manager.create(OrganisasiRole, {
                        id: 1,
                        role_name: superadminRoleName,
                        Organisasi: administratorBdb,
                        Permission: allPermission
                    });
                } else {
                    roleOrganisasi.role_name = superadminRoleName;
                    roleOrganisasi.Permission = allPermission;
                }
                await queryRunner.manager.save(roleOrganisasi);

                const existingSuperadmin = await queryRunner.manager.findOne(User, {
                    where: {
                        email: superadminEmail
                    }
                });

                if (!existingSuperadmin) {
                    const user = queryRunner.manager.create(User, {
                        name: superadminName,
                        email: superadminEmail,
                        email_google: superadminEmail.endsWith('@gmail.com') ? superadminEmail : null,
                        email_polri: superadminEmail.endsWith('@polri.go.id') ? superadminEmail : null,
                        login_method: 'HYBRID',
                        local_password_enabled: true,
                        role_bdb: 'superadmin',
                        requested_role_bdb: 'superadmin',
                        approval_status: 'APPROVED',
                        two_factor_required: false,
                        email_otp_required: true,
                        password: await bcrypt.hash(superadminPassword, 10),
                        role_name: superadminRoleName,
                        OrganisasiRole: roleOrganisasi,
                        Organisasi: administratorBdb,
                        otp: false,
                        totp: false,
                        status: 'AKTIF'
                    });
                    await queryRunner.manager.save(user);
                } else {
                    existingSuperadmin.name = existingSuperadmin.name || superadminName;
                    existingSuperadmin.role_name = superadminRoleName;
                    existingSuperadmin.email_google = existingSuperadmin.email_google || (superadminEmail.endsWith('@gmail.com') ? superadminEmail : null);
                    existingSuperadmin.email_polri = existingSuperadmin.email_polri || (superadminEmail.endsWith('@polri.go.id') ? superadminEmail : null);
                    existingSuperadmin.login_method = 'HYBRID';
                    existingSuperadmin.local_password_enabled = true;
                    existingSuperadmin.role_bdb = 'superadmin';
                    existingSuperadmin.requested_role_bdb = 'superadmin';
                    existingSuperadmin.approval_status = 'APPROVED';
                    existingSuperadmin.two_factor_required = false;
                    existingSuperadmin.email_otp_required = true;
                    existingSuperadmin.OrganisasiRole = roleOrganisasi;
                    existingSuperadmin.Organisasi = administratorBdb;
                    existingSuperadmin.otp = false;
                    existingSuperadmin.totp = false;
                    existingSuperadmin.status = existingSuperadmin.status || 'AKTIF';
                    await queryRunner.manager.save(existingSuperadmin);
                }
            }

            await queryRunner.commitTransaction();
            return 'success';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any) {
        let treeMenu = await this.dataSource.getTreeRepository(Permission).findTrees({ depth: 4 });
        function assignKeys(nodes, prefix = '0', isRoot = true) {
            nodes.forEach((node, index) => {
                const currentKey = isRoot ? `${index}` : `${prefix}-${index}`;
                node.key = currentKey;
                if (node.children && node.children.length > 0) {
                    assignKeys(node.children, currentKey, false);
                }
            });
        }

        assignKeys(treeMenu);
        return treeMenu;
    }

    async findOne(id: number) {
        const permission = await this.dataSource.getRepository(Permission).findOne({
            where: {
                id: id
            }
        });
        return permission;
    }

    async update(id: number, dto: UpdatePermissionDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await queryRunner.manager.findOne(Permission, {
                where: {
                    id: id
                }
            });
            data.to = dto.to;
            data.icon = dto.icon;
            data.hide = dto.hide;
            await queryRunner.manager.save(data);
            await queryRunner.commitTransaction();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    remove(id: number) {
        return `This action removes a #${id} permission`;
    }
}
