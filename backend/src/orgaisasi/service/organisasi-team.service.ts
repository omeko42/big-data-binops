import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganisasiDto } from '../dto/organisasi.dto';
import { DataSource, In, IsNull, Not } from 'typeorm';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { Organisasi } from '../entity/organisasi.entity';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { OrganisasiLevel } from '../entity/level.entity';
import { OrganisasiRole } from '../entity/role.entity';
import { OrganisasiLevelService } from './level.service';
import { User } from '@app_core/auth/user/entities/user.entity';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { OrganisasiTeamDto, OrganisasiUpdateTeamDto } from '../dto/organisasi-team.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '@app_core/helper/service/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { now } from 'moment';

@Injectable()
export class OrganisasiTeamService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly levelService: OrganisasiLevelService,
        private mailService: MailService
    ) {}

    async create(dto: OrganisasiTeamDto, @CurrentUser() authUser) {
        const repository = this.dataSource.getRepository(OrganisasiRole);
        const role = await repository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.Organisasi', 'organisasi')
            .where('role.id = :roleId', { roleId: dto.role_id })
            .andWhere('organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` })
            .getOne();

        if (!role) {
            throw new Error('Data tidak ada');
        }

        if (!role.invitation_url || !role.invitation_code) {
            const invitation_code = uuidv4();
            role.invitation_code = invitation_code;
            role.invitation_url = `${process.env.FRONTEND}/guest/invitation/${invitation_code}/${role.Organisasi.name}`;
            await repository.save(role);
        }

        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const userEmail = `${dto.nrp}@polri.go.id`;
            const invitation_code = uuidv4();

            const existData = await queryRunner.manager.createQueryBuilder(User, 'user').addSelect('user.password').leftJoinAndSelect('user.Organisasi', 'organisasi').where('user.email = :email', { email: userEmail }).getOne();

            let register = true;

            // role_bdb (kolom asli BDB) WAJIB ikut disamakan dgn OrganisasiRole yg dipilih --
            // sebelumnya cuma OrganisasiRole yg diisi, role_bdb tak pernah disentuh (macet di
            // default 'viewer'), jadi user hasil undang lewat jalur ini praktis tak pernah dapat
            // akses sesuai role yg dipilih. role_bdb dibatasi CHECK constraint ke 4 role baku
            // (auth_users_role_bdb_check) -- kalau role yg dipilih itu role CUSTOM (bukan 4 baku),
            // JANGAN paksa isi (bakal gagal krn constraint), biarkan default apa adanya.
            const BAKU_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer'];
            const roleBdbForInvite = BAKU_ROLES.includes(String(role.role_name || '').trim().toLowerCase()) ? String(role.role_name).trim().toLowerCase() : undefined;

            if (!existData) {
                const newUser = queryRunner.manager.create(User, {
                    invitation_code: invitation_code,
                    invitation_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    email: userEmail,
                    OrganisasiRole: { id: role.id },
                    Organisasi: { id: role.organisasi_id },
                    ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                    status: 'pending'
                });
                await queryRunner.manager.save(newUser);
            } else if (existData && !existData.password) {
                const updatedUser = queryRunner.manager.merge(User, existData, {
                    invitation_code: invitation_code,
                    invitation_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    OrganisasiRole: { id: role.id },
                    Organisasi: { id: role.organisasi_id },
                    ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                    status: 'pending'
                });
                await queryRunner.manager.save(updatedUser);
            } else if (existData && !existData.Organisasi && existData.password) {
                register = false;
                const updatedUser = queryRunner.manager.merge(User, existData, {
                    invitation_code: invitation_code,
                    invitation_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    OrganisasiRole: { id: role.id },
                    Organisasi: { id: role.organisasi_id },
                    ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                    status: 'pending'
                });
                await queryRunner.manager.save(updatedUser);
            } else {
                throw new Error('User telah tergabung dengan satker lain');
            }

            await queryRunner.commitTransaction();

            const htmlContent = this.mailService.InviteMemberEmailTemplate(`${role.invitation_url}?nrp=${encodeURIComponent(dto.nrp)}&cdinv=${encodeURIComponent(invitation_code)}&register=${encodeURIComponent(register)}`, role.Organisasi.name);
            await this.mailService.sendEmail(`${dto.nrp}@polri.go.id`, 'Bareskrim CAS Invitation', 'invitation member', htmlContent);

            return 'Email berhasil dikirim';
        } catch (error) {
            // Pastikan rollback hanya kalau transaksi sudah dimulai
            try {
                await queryRunner.rollbackTransaction();
            } catch (rollbackError) {
                // Log rollback error jika ada
                console.error('Rollback error:', rollbackError);
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(request: any, @CurrentUser() authUser) {
        const queryBuilder = this.dataSource.createQueryBuilder(User, 'User');
        queryBuilder.leftJoinAndSelect('User.OrganisasiRole', 'OrganisasiRole');
        queryBuilder.leftJoinAndSelect('User.Organisasi', 'Organisasi').andWhere('Organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` });
        const result = await this.tableHelper.applyFilters(queryBuilder, request, {
            coreTable: 'User',
            searchingAll: ['name'],
            searching: ['id', 'name', 'email', 'status', 'created_at', 'updated_at'],
            searchingOption: ['id', 'OrganisasiRole.id', 'Organisasi.id', 'name', 'created_at', 'updated_at'],
            searchingOrWhere: ['id', 'name', 'created_at', 'updated_at'],
            searchingBeetween: ['id', 'name', 'created_at', 'updated_at'],
            yearMonthFilter: ['id', 'name', 'created_at', 'updated_at'],
            sorting: ['id', 'name', 'email', 'status', 'created_at', 'updated_at'],
            defaultSorting: 'User.Timestamps.created_at',
            joins: []
        });
        return result;
    }
    async findOne(id: number, @CurrentUser() authUser) {
        const result = await this.dataSource.getRepository(User).findOne({
            where: {
                id: id,
                Organisasi: { id: authUser.organisasi_id }
            }
        });
        return result;
    }

    async update(id: number, dto: OrganisasiUpdateTeamDto, @CurrentUser() authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const existData = await queryRunner.manager.findOneOrFail(User, {
            where: {
                id: id,
                Organisasi: { id: authUser.organisasi_id }
            }
        });
        await queryRunner.startTransaction();
        try {
            const data = queryRunner.manager.merge(User, existData, {
                OrganisasiRole: { id: dto.role_id }
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

    async remove(deleteDto: DeleteDto, @CurrentUser() authUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (deleteDto.data && deleteDto.data.length > 0) {
                for (const joinObject of deleteDto.data) {
                    const existData = await queryRunner.manager
                        .getRepository(User)
                        .createQueryBuilder('user')
                        .leftJoinAndSelect('user.Organisasi', 'organisasi')
                        .where('user.id = :id', { id: joinObject.id })
                        .andWhere('organisasi.path LIKE :path', { path: `${authUser.Organisasi.path}%` })
                        .getOneOrFail();

                    const data = queryRunner.manager.merge(User, existData, {
                        Organisasi: { id: null },
                        OrganisasiRole: { id: null }
                    });
                    await queryRunner.manager.save(data);
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
