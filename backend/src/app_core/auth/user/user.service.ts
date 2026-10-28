import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { ReviewUserApprovalDto, UpdateUserDto } from './dto/updateUser.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as ExcelJS from 'exceljs';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { AuditService } from 'src/bdb/audit/audit.service';
import { resolveOrganisasiRoleId } from '@app_core/auth/organisasi-role.util';

const BDB_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'] as const;
type BdbRole = (typeof BDB_ROLES)[number];
type ScopeRow = { id: string; satker_key: string };

export type ImportPreviewRow = {
    row: number;
    ok: boolean;
    message?: string;
    name?: string;
    nrp?: string;
    email?: string;
    email_polri?: string;
    username?: string;
    role_bdb?: string;
    status?: string;
    scope_satker_key?: string;
    scope_satker_name?: string;
};
export type ImportCommitResult = { row: number; ok: boolean; message?: string; email?: string; password?: string };

@Injectable()
export class UserService {
    private readonly userRepository: Repository<User>;
    private tableHelper: any;

    constructor(
        private readonly dataSource: DataSource,
        private readonly mailService: MailService,
        private readonly audit: AuditService
    ) {
        this.userRepository = this.dataSource.getRepository(User);
        this.tableHelper = new TableHelperService();
    }

    generateDefaultHandle(id: any): string {
        const seed = String(id || '0');
        let num = 0;
        for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
        const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
        return 'user_' + seed + code;
    }

    sanitizeUsernameInput(raw: any): string | null {
        if (raw === undefined || raw === null) return null;
        let u = String(raw).trim().toLowerCase();
        if (!u) return null;
        if (u.startsWith('@')) u = u.slice(1);
        if (u.includes('@')) u = u.split('@')[0];
        u = u.replace(/[^a-z0-9_.]/g, '').slice(0, 30);
        return u || null;
    }
    private normalizeEmail(email?: string): string {
        return String(email || '').trim().toLowerCase();
    }

    private normalizeBdbRole(role?: string): BdbRole {
        const value = String(role || '').trim().toLowerCase();
        return (BDB_ROLES as readonly string[]).includes(value) ? (value as BdbRole) : 'viewer';
    }

    /** Lihat organisasi-role.util.ts -- WAJIB dipakai di setiap create/update/approve user, JANGAN
     *  pernah hardcode id tm_org_role manapun (riwayat bug fatal ada di sana). */
    private resolveOrganisasiRoleId(roleBdb: string): Promise<number | null> {
        return resolveOrganisasiRoleId(this.dataSource, roleBdb);
    }

    private normalizeStatus(status?: string): string {
        return String(status || '').trim().toUpperCase();
    }

    private shouldRequireScope(role: BdbRole, status?: string, approvalStatus?: string, isSuperadmin = false): boolean {
        if (role === 'superadmin') return false;
        if (role === 'viewer' && isSuperadmin) return false;
        return this.normalizeStatus(status || 'AKTIF') === 'AKTIF' && this.normalizeStatus(approvalStatus || 'APPROVED') === 'APPROVED';
    }

    isApprovedActive(user: User): boolean {
        const approvalStatus = this.normalizeStatus(user.approval_status || 'APPROVED');
        const status = this.normalizeStatus(user.status || 'AKTIF');
        const inactiveStatuses = ['PENDING_EMAIL', 'PENDING_APPROVAL', 'WAITING APPROVAL', 'PENDING', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'];

        if (user.self_deactivated_at || user.deactivated_at) return false;
        if (approvalStatus !== 'APPROVED') return false;
        if (inactiveStatuses.includes(status)) return false;
        return true;
    }

    assertCanPasswordLogin(user: User) {
        if (!this.isApprovedActive(user)) {
            throw new BadRequestException({
                errors: { account: ['akun belum aktif atau sudah dinonaktifkan'] }
            });
        }

        if (user.local_password_enabled === false || !user.password) {
            throw new BadRequestException({
                errors: { password: ['login password lokal tidak aktif untuk akun ini'] }
            });
        }
    }

    async markLogin(userId: number, method: string) {
        await this.userRepository.update(userId, {
            last_login_method: method,
            last_login_at: new Date(),
            failed_login_attempts: 0,
            locked_until: null
        });
    }

    // ---- Lockout: 3x gagal -> kunci 30 menit ----
    static readonly MAX_LOGIN_ATTEMPTS = 3;
    static readonly LOCK_MINUTES = 30;

    /** Sisa menit terkunci (0 bila tidak terkunci). */
    lockRemainingMinutes(user: any): number {
        if (!user?.locked_until) return 0;
        const until = new Date(user.locked_until).getTime();
        const diff = until - Date.now();
        return diff > 0 ? Math.ceil(diff / 60000) : 0;
    }

    /** Catat percobaan login gagal; kunci akun bila mencapai batas. */
    async registerFailedLogin(user: any): Promise<{ locked: boolean; remaining: number; minutes: number }> {
        const attempts = (user?.failed_login_attempts || 0) + 1;
        if (attempts >= UserService.MAX_LOGIN_ATTEMPTS) {
            const until = new Date(Date.now() + UserService.LOCK_MINUTES * 60000);
            await this.userRepository.update(user.id, { failed_login_attempts: attempts, locked_until: until });
            return { locked: true, remaining: 0, minutes: UserService.LOCK_MINUTES };
        }
        await this.userRepository.update(user.id, { failed_login_attempts: attempts });
        return { locked: false, remaining: UserService.MAX_LOGIN_ATTEMPTS - attempts, minutes: 0 };
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const normalizedEmail = this.normalizeEmail(email);
        if (!normalizedEmail) return undefined;

        return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.Organisasi', 'Organisasi')
            .leftJoinAndSelect('user.OrganisasiRole', 'OrganisasiRole')
            .leftJoinAndSelect('Organisasi.OrganisasiLevel', 'OrganisasiLevel')
            .where('lower(user.email) = :email', { email: normalizedEmail })
            .orWhere('lower(user.email_google) = :email', { email: normalizedEmail })
            .orWhere('lower(user.email_polri) = :email', { email: normalizedEmail })
            .orWhere('lower(user.username) = :email', { email: normalizedEmail })
            .addSelect('user.password')
            .addSelect('user.security_pin_hash')
            .addSelect('user.totp_secret')
            .getOne();
    }

    /**
     * Login SEKARANG wajib pakai email dinas Polri (email_polri) ATAU username -- bukan email
     * umum/google lagi. Dipakai khusus utk identifikasi login (signIn/verifyLoginOtp/verifyPin),
     * supaya konsisten dgn kemana OTP email dikirim kalau fitur OTP-login diaktifkan.
     */
    async findByLoginIdentifier(identifier: string): Promise<User | undefined> {
        const raw = String(identifier || '').trim().toLowerCase();
        const normalized = raw.startsWith('@') ? raw.slice(1) : raw;
        if (!normalized) return undefined;

        return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.Organisasi', 'Organisasi')
            .leftJoinAndSelect('user.OrganisasiRole', 'OrganisasiRole')
            .leftJoinAndSelect('Organisasi.OrganisasiLevel', 'OrganisasiLevel')
            .where('lower(user.email_polri) = :id', { id: raw })
            .orWhere('lower(user.username) = :id', { id: raw }).orWhere('lower(user.username) = :uLocal', { uLocal: raw.includes('@') ? raw.split('@')[0] : raw })
            .orWhere('lower(user.email) = :id', { id: raw })
            .orWhere('lower(user.callsign) = :cid', { cid: normalized })
            .addSelect('user.password')
            .addSelect('user.security_pin_hash')
            .addSelect('user.totp_secret')
            .getOne();
    }

    /** Cek ketersediaan username/email_polri -- dipakai form Master Pengguna sblm submit (live validation). */
    async checkIdentifierAvailability(field: 'username' | 'email_polri' | 'email', value: string, excludeUserId?: number): Promise<{ available: boolean; satker_nama?: string }> {
        const normalized = this.normalizeEmail(value);
        const rawTrim = String(value || '').trim();
        if (field === 'username' && rawTrim) {
            if (rawTrim.includes('@')) {
                const suggested = this.sanitizeUsernameInput(rawTrim) || 'username';
                return { available: false, reason: 'Format salah: Username tidak boleh memakai @domain/email! Cukup ketik "' + suggested + '" saja.' };
            }
            if (!/^[a-z0-9_.]{3,30}$/i.test(rawTrim)) {
                return { available: false, reason: 'Format salah: Gunakan 3-30 karakter huruf kecil, angka, titik (.), atau underscore (_) tanpa spasi.' };
            }
        }
        if (!normalized)
            return { available: true };
        const qb = this.userRepository.createQueryBuilder('user').where(`lower(user.${field}) = :v`, { v: normalized });
        if (excludeUserId) qb.andWhere('user.id <> :id', { id: excludeUserId });
        const existing = await qb.getOne();
        if (!existing) return { available: true };
        let satkerNama: string | undefined;
        if (existing.scope_satker_id) {
            const rows = await this.dataSource.query('select deskripsi from bdb_satker where id=$1', [existing.scope_satker_id]);
            satkerNama = rows[0]?.deskripsi;
        }
        return { available: false, satker_nama: satkerNama || (existing.role_bdb === 'superadmin' ? 'Superadmin' : undefined) };
    }

    async create(createUserDto: CreateUserDto, authUser?: User): Promise<User> {
        const { password, password_confirmation, email, ...rest } = createUserDto as any;
        if (password !== password_confirmation) {
            throw new BadRequestException({
                message: 'Bad Request',
                errors: { password: ['Password confirmation does not match password'] }
            });
        }

        const normalizedEmail = this.normalizeEmail(email);
        const existingUser = await this.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new ConflictException({
                message: 'Bad Request',
                errors: { email: ['Email already in use'] }
            });
        }
        if (rest.email_polri && rest.username && this.normalizeEmail(rest.email_polri) === this.normalizeEmail(rest.username)) {
            throw new BadRequestException({
                message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                errors: {
                    username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                    email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                }
            });
        }
        if (rest.email_polri) {
            const check = await this.checkIdentifierAvailability('email_polri', rest.email_polri);
            if (!check.available) {
                throw new ConflictException({ errors: { email_polri: [`Email dinas Polri ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
            }
        }
        if (rest.username) {
            const check = await this.checkIdentifierAvailability('username', rest.username);
            if (!check.available) {
                throw new ConflictException({ errors: { username: [`Username ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
            }
        }

        const roleBdb = this.normalizeBdbRole(rest.role_bdb || 'viewer');
        const initialStatus = rest.status || 'AKTIF';
        const initialApprovalStatus = rest.approval_status || 'APPROVED';
        const isSuperadmin = authUser && this.normalizeBdbRole(authUser.role_bdb) === 'superadmin';
        let targetScopeId = rest.scope_satker_id;
        let targetScopeKey = rest.scope_satker_key;
        if (authUser && this.normalizeBdbRole(authUser.role_bdb) === 'operator') {
            if (!targetScopeId && !targetScopeKey) {
                targetScopeId = authUser.scope_satker_id;
                targetScopeKey = authUser.scope_satker_key;
            }
        }
        const scope = await this.resolveScope(roleBdb, targetScopeId, targetScopeKey, this.shouldRequireScope(roleBdb, initialStatus, initialApprovalStatus, isSuperadmin));
        if (authUser) {
            await this.assertCanReview(authUser, roleBdb, scope.scope_satker_id, scope.scope_satker_key);
        }
        const organisasiRoleId = await this.resolveOrganisasiRoleId(roleBdb);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            ...rest,
            email: normalizedEmail,
            email_google: rest.email_google || (normalizedEmail.endsWith('@gmail.com') ? normalizedEmail : null),
            email_polri: rest.email_polri || (normalizedEmail.endsWith('@polri.go.id') ? normalizedEmail : null),
            password: hashedPassword,
            role_name: roleBdb,
            role_bdb: roleBdb,
            requested_role_bdb: roleBdb,
            scope_satker_id: scope.scope_satker_id,
            scope_satker_key: scope.scope_satker_key,
            requested_scope_satker_id: scope.scope_satker_id,
            requested_scope_satker_key: scope.scope_satker_key,
            login_method: 'HYBRID',
            local_password_enabled: rest.local_password_enabled ?? true,
            two_factor_required: rest.two_factor_required ?? false,
            approval_status: initialApprovalStatus,
            status: initialStatus,
            otp: false,
            totp: false,
            Organisasi: { id: 1 },
            ...(organisasiRoleId != null ? { OrganisasiRole: { id: organisasiRoleId } } : {}),
            Timestamps: { created_by: authUser?.id ? Number(authUser.id) : null }
        } as any) as unknown as User;
        const savedUser = await this.userRepository.save(user);
        const finalHandle = (savedUser.username && String(savedUser.username).trim())
            ? String(savedUser.username).trim().replace(/^@/, '').toLowerCase()
            : this.generateDefaultHandle(savedUser.id);
        if (savedUser.username !== finalHandle || savedUser.callsign !== finalHandle) {
            savedUser.username = finalHandle;
            savedUser.callsign = finalHandle;
            await this.dataSource.query('UPDATE auth_users SET username = $1, callsign = $1 WHERE id = $2', [finalHandle, savedUser.id]);
        }
        await this.upsertPoliceProfileByEmail(savedUser.email, {
            ...rest,
            name: savedUser.name,
            email: savedUser.email
        });
        return savedUser;
    }

    async findAll(request: any) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.leftJoinAndSelect('user.Organisasi', 'Organisasi');
        queryBuilder.leftJoinAndSelect('user.OrganisasiRole', 'OrganisasiRole');

        const authUser = request['user'];
        if (this.normalizeBdbRole(authUser?.role_bdb) === 'admin_binops') {
            const scopeId = authUser?.scope_satker_id ? Number(authUser.scope_satker_id) : null;
            const isMabes = !scopeId || scopeId === 1 || scopeId === 13;
            if (isMabes) {
                queryBuilder.andWhere("coalesce(user.role_bdb, 'viewer') in ('operator', 'viewer')");
            } else {
                const scope = await this.getScopeRows(authUser);
                const ids = scope.map(row => Number(row.id)).filter(Boolean);
                const keys = scope.map(row => row.satker_key).filter(Boolean);
                if (ids.length === 0 && keys.length === 0) {
                    queryBuilder.andWhere('1 = 0');
                } else {
                    queryBuilder.andWhere('(user.scope_satker_id in (:...ids) or user.scope_satker_key in (:...keys))', {
                        ids: ids.length ? ids : [-1],
                        keys: keys.length ? keys : ['__none__']
                    });
                    queryBuilder.andWhere("coalesce(user.role_bdb, 'viewer') in ('operator', 'viewer')");
                }
            }
        } else if (this.normalizeBdbRole(authUser?.role_bdb) === 'operator') {
            const scopeId = authUser?.scope_satker_id ? Number(authUser.scope_satker_id) : null;
            const isMabes = !scopeId || scopeId === 1 || scopeId === 13;
            if (isMabes) {
                queryBuilder.andWhere("coalesce(user.role_bdb, 'viewer') in ('operator', 'viewer')");
            } else {
                const scope = await this.getScopeRows(authUser);
                const ids = scope.map(row => Number(row.id)).filter(Boolean);
                const keys = scope.map(row => row.satker_key).filter(Boolean);
                if (ids.length === 0 && keys.length === 0) {
                    queryBuilder.andWhere('(user.id = :selfId or user.created_by = :selfId)', { selfId: Number(authUser.id) });
                } else {
                    queryBuilder.andWhere(
                        '(user.id = :selfId or user.created_by = :selfId or ((user.scope_satker_id in (:...ids) or user.scope_satker_key in (:...keys)) and coalesce(user.role_bdb, \'viewer\') in (\'operator\', \'viewer\')))',
                        {
                            selfId: Number(authUser.id),
                            ids: ids.length ? ids : [-1],
                            keys: keys.length ? keys : ['__none__']
                        }
                    );
                }
            }
        }

        const rawSearchAll = request?.query?.searchAll;
        const masterUserKeyword = String(Array.isArray(rawSearchAll) ? rawSearchAll[0] : rawSearchAll || '').trim().toLowerCase();
        if (masterUserKeyword) {
            queryBuilder.andWhere(`(
                lower(coalesce(user.name, '')) like :masterUserKeyword
                or lower(coalesce(user.email, '')) like :masterUserKeyword
                or lower(coalesce(user.email_google, '')) like :masterUserKeyword
                or lower(coalesce(user.email_polri, '')) like :masterUserKeyword
                or lower(coalesce(user.username, '')) like :masterUserKeyword
                or lower(coalesce(user.role_name, '')) like :masterUserKeyword
                or lower(coalesce(user.role_bdb, '')) like :masterUserKeyword
                or lower(coalesce(user.approval_status, '')) like :masterUserKeyword
                or lower(coalesce(user.status, '')) like :masterUserKeyword
                or exists (
                    select 1
                    from bdb_satker scope_search
                    where scope_search.is_synthetic = false
                      and (scope_search.id = user.scope_satker_id or scope_search.kode = user.scope_satker_key)
                      and (
                          lower(coalesce(scope_search.deskripsi, '')) like :masterUserKeyword
                          or lower(coalesce(scope_search.kode, '')) like :masterUserKeyword
                      )
                )
            )`, { masterUserKeyword: `%${masterUserKeyword}%` });
        }

        const rawSortBy = request?.query?.sortBy ?? request?.query?.['sortBy[]'] ?? request?.query?.['sortBy[0]'];
        const rawSort = request?.query?.sort ?? request?.query?.['sort[]'] ?? request?.query?.['sort[0]'];
        const sortFields = Array.isArray(rawSortBy) ? rawSortBy : (rawSortBy ? [rawSortBy] : []);
        const sortOrders = Array.isArray(rawSort) ? rawSort : (rawSort ? [rawSort] : []);

        const validSortFields = [
            'id', 'name', 'email', 'role_bdb', 'role_name', 'status', 
            'approval_status', 'scope_satker_key', 'last_login_at', 'created_at',
            'activity_score', 'score'
        ];
        let hasOrder = false;

        for (let i = 0; i < sortFields.length; i++) {
            const rawField = String(sortFields[i] || '').trim();
            const cleanField = rawField.startsWith('user.') ? rawField.slice(5) : rawField;
            if (!validSortFields.includes(cleanField)) continue;

            const order = String(sortOrders[i] || 'asc').trim().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            if (cleanField === 'activity_score' || cleanField === 'score') {
                queryBuilder.addOrderBy('user.activity_score', order, 'NULLS LAST');
                queryBuilder.addOrderBy('user.id', 'ASC');
            } else if (cleanField === 'last_login_at' || cleanField === 'scope_satker_key') {
                queryBuilder.addOrderBy(`user.${cleanField}`, order, 'NULLS LAST');
            } else {
                queryBuilder.addOrderBy(`user.${cleanField}`, order);
            }
            hasOrder = true;
        }

        if (!hasOrder) {
            queryBuilder.addOrderBy('user.id', 'ASC');
        }

        const filterQuery = { ...request?.query };
        delete filterQuery.sortBy;
        delete filterQuery['sortBy[]'];
        delete filterQuery['sortBy[0]'];
        delete filterQuery.sort;
        delete filterQuery['sort[]'];
        delete filterQuery['sort[0]'];
        if (masterUserKeyword) {
            delete filterQuery.searchAll;
        }
        const filterRequest = { ...request, query: filterQuery };

        const result = await this.tableHelper.applyFilters(queryBuilder, filterRequest, {
            coreTable: 'user',
            searchingAll: ['name', 'email', 'email_google', 'email_polri', 'role_name', 'role_bdb', 'approval_status', 'status'],
            searching: ['name', 'email', 'email_google', 'email_polri', 'role_name', 'role_bdb', 'approval_status', 'status'],
            searchingOption: ['name', 'email', 'email_google', 'email_polri', 'role_name', 'role_bdb', 'approval_status', 'status'],
            searchingOrWhere: ['name', 'email', 'email_google', 'email_polri', 'role_name', 'role_bdb', 'approval_status', 'status'],
            searchingBeetween: ['created_at'],
            yearMonthFilter: ['created_at'],
            sorting: [],
            joins: []
        });
        await this.enrichUserScopes(result.data || []);
        await this.enrichPoliceProfiles(result.data || []);
        await this.enrichUserActivity(result.data || []);
        return result;
    }

    async findOne(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { id: Number(id) },
            relations: ['Organisasi', 'OrganisasiRole']
        });
    }

    async update(id: number, dto: UpdateUserDto, authUser?: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(User, {
                where: { id: id },
                relations: ['Organisasi', 'OrganisasiRole']
            });
            if (!user) {
                throw new NotFoundException('User with ID ' + id + ' not found.');
            }

            const polriToCheck = (dto as any).email_polri !== undefined ? (dto as any).email_polri : user.email_polri;
            const usernameToCheck = (dto as any).username !== undefined ? (dto as any).username : user.username;
            if (polriToCheck && usernameToCheck && this.normalizeEmail(polriToCheck) === this.normalizeEmail(usernameToCheck)) {
                throw new BadRequestException({
                    message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                    errors: {
                        username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                        email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                    }
                });
            }

            if ((dto as any).email_polri && this.normalizeEmail((dto as any).email_polri) !== this.normalizeEmail(user.email_polri)) {
                const check = await this.checkIdentifierAvailability('email_polri', (dto as any).email_polri, Number(id));
                if (!check.available) {
                    throw new ConflictException({ errors: { email_polri: [`Email dinas Polri ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
                }
            }
            if ((dto as any).username && this.normalizeEmail((dto as any).username) !== this.normalizeEmail(user.username)) {
                const check = await this.checkIdentifierAvailability('username', (dto as any).username, Number(id));
                if (!check.available) {
                    throw new ConflictException({ errors: { username: [`Username ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
                }
            }

            const roleBdb = this.normalizeBdbRole((dto as any).role_bdb || dto.role_name || user.role_bdb);
            const requestedStatus = (dto as any).status ?? user.status ?? 'AKTIF';
            const requestedApprovalStatus = (dto as any).approval_status ?? user.approval_status ?? 'APPROVED';
            const isSuperadmin = authUser && this.normalizeBdbRole(authUser.role_bdb) === 'superadmin';
            const scope = await this.resolveScope(
                roleBdb,
                (dto as any).scope_satker_id ?? user.scope_satker_id,
                (dto as any).scope_satker_key ?? user.scope_satker_key,
                this.shouldRequireScope(roleBdb, requestedStatus, requestedApprovalStatus, isSuperadmin)
            );
            const scopeSatkerId = scope.scope_satker_id;
            const scopeSatkerKey = scope.scope_satker_key;
            await this.assertCanManageUser(authUser, user, roleBdb, scopeSatkerId, scopeSatkerKey);
            // Jaga OrganisasiRole (legacy) tetap selaras dgn role_bdb kalau rolenya berubah --
            // sebelumnya field ini tak pernah disentuh di update(), jadi user yg role_bdb-nya
            // kena bug create() (organisasiRoleId nyasar ke superadmin) tetap rusak akses menunya
            // walau adminnya sudah "perbaiki" lewat edit role di UI (lihat resolveOrganisasiRoleId).
            const organisasiRoleId = roleBdb !== this.normalizeBdbRole(user.role_bdb) ? await this.resolveOrganisasiRoleId(roleBdb) : null;
            const resolvedUsername = ((dto as any).username !== undefined
                ? (this.sanitizeUsernameInput((dto as any).username) || this.generateDefaultHandle(id))
                : (user.username ? String(user.username).trim().replace(/^@/, '') : this.generateDefaultHandle(id)));
            const updatedData: Partial<User> = {
                name: dto.name ?? user.name,
                email: dto.email ? this.normalizeEmail(dto.email) : user.email,
                email_google: (dto as any).email_google ?? user.email_google,
                email_polri: (dto as any).email_polri ?? user.email_polri,
                username: resolvedUsername,
                callsign: resolvedUsername,
                password: dto.password ? await bcrypt.hash(dto.password, 10) : user.password,
                role_name: dto.role_name || roleBdb,
                role_bdb: roleBdb,
                ...(organisasiRoleId != null ? { OrganisasiRole: { id: organisasiRoleId } as any } : {}),
                scope_satker_id: scopeSatkerId,
                scope_satker_key: scopeSatkerKey,
                login_method: (dto as any).login_method || user.login_method,
                local_password_enabled: (dto as any).local_password_enabled ?? user.local_password_enabled,
                two_factor_required: (dto as any).two_factor_required ?? user.two_factor_required,
                status: (dto as any).status ?? user.status,
                approval_status: (dto as any).approval_status ?? user.approval_status
            };
            const nextStatus = this.normalizeStatus(updatedData.status);
            const currentStatus = this.normalizeStatus(user.status || 'AKTIF');
            if ((nextStatus === 'NONAKTIF' || nextStatus === 'NONAKTIF_ADMIN') && currentStatus !== 'NONAKTIF_ADMIN' && currentStatus !== 'NONAKTIF') {
                updatedData.deactivated_by = authUser?.id ? Number(authUser.id) : null;
                updatedData.deactivated_at = new Date();
                updatedData.deactivation_reason = 'Dinonaktifkan admin';
            }
            if (nextStatus === 'AKTIF') {
                updatedData.approval_status = 'APPROVED';
                updatedData.self_deactivated_at = null;
                updatedData.deactivated_by = null;
                updatedData.deactivated_at = null;
                updatedData.deactivation_reason = null;
            }

            // Jika satker berubah via edit profil, rekam ke tabel auth_user_mutations
            if (user.scope_satker_id && scopeSatkerId && Number(user.scope_satker_id) !== Number(scopeSatkerId)) {
                let oldSatkerName = '-';
                const oldSatkers = await queryRunner.query(`SELECT deskripsi FROM bdb_satker WHERE id = $1 LIMIT 1`, [user.scope_satker_id]);
                if (oldSatkers && oldSatkers.length) oldSatkerName = oldSatkers[0].deskripsi;

                let newSatkerName = '-';
                const newSatkers = await queryRunner.query(`SELECT deskripsi FROM bdb_satker WHERE id = $1 LIMIT 1`, [scopeSatkerId]);
                if (newSatkers && newSatkers.length) newSatkerName = newSatkers[0].deskripsi;

                await queryRunner.query(
                    `
                    INSERT INTO auth_user_mutations (
                        user_id, from_satker_id, from_satker_key, from_satker_name, from_role,
                        to_satker_id, to_satker_key, to_satker_name, to_role,
                        nomor_surat, tanggal_efektif, keterangan, mutated_by, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
                    `,
                    [
                        id,
                        user.scope_satker_id,
                        user.scope_satker_key,
                        oldSatkerName,
                        user.role_bdb,
                        scopeSatkerId,
                        scopeSatkerKey,
                        newSatkerName,
                        roleBdb,
                        (dto as any).nomor_surat || 'MUTASI-ADMIN',
                        new Date(),
                        (dto as any).keterangan_mutasi || 'Perubahan satker melalui edit profil pengguna',
                        authUser?.id ? Number(authUser.id) : null
                    ]
                );
            }

            await queryRunner.manager.update(User, id, updatedData);
            await this.upsertPoliceProfileByEmail(
                updatedData.email || user.email,
                {
                    ...(dto as any),
                    name: updatedData.name,
                    email: updatedData.email || user.email
                },
                queryRunner,
                user.email
            );
            await queryRunner.commitTransaction();
            return { ...user, ...updatedData };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async approvalQueue(authUser: User) {
        const role = this.normalizeBdbRole(authUser?.role_bdb);
        const params: any[] = [];
        let where = "u.approval_status = 'PENDING_APPROVAL'";

        if (role === 'superadmin') {
            // Superadmin melihat semua antrian.
        } else if (role === 'admin_binops') {
            const scopeId = authUser?.scope_satker_id ? Number(authUser.scope_satker_id) : null;
            const isMabes = !scopeId || scopeId === 1 || scopeId === 13;
            if (isMabes) {
                where += " and coalesce(u.requested_role_bdb, u.role_bdb, 'viewer') in ('operator', 'viewer')";
            } else {
                const scope = await this.getScopeRows(authUser);
                const ids = scope.map(row => Number(row.id)).filter(Boolean);
                const keys = scope.map(row => row.satker_key).filter(Boolean);
                if (ids.length === 0 && keys.length === 0) return [];
                params.push(ids.length ? ids : [-1], keys.length ? keys : ['__none__']);
                where += " and coalesce(u.requested_role_bdb, u.role_bdb, 'viewer') in ('operator', 'viewer')";
                where += ' and (u.requested_scope_satker_id = any($1::bigint[]) or u.requested_scope_satker_key = any($2::text[]))';
            }
        } else {
            return [];
        }

        const sql = [
            'select',
            '  u.id, u.name, u.email, u.email_google, u.email_polri,',
            '  u.role_bdb, u.requested_role_bdb, u.approval_status, u.status,',
            '  u.requested_scope_satker_id, u.requested_scope_satker_key,',
            '  s.deskripsi as requested_scope_satker_name,',
            '  u.created_at',
            'from auth_users u',
            'left join bdb_satker s on s.id = u.requested_scope_satker_id',
            'where ' + where,
            'order by u.created_at asc'
        ].join(String.fromCharCode(10));
        return this.dataSource.query(sql, params);
    }

    async reviewApproval(authUser: User, targetId: number, dto: ReviewUserApprovalDto) {
        const target = await this.userRepository.findOne({ where: { id: targetId } });
        if (!target) throw new NotFoundException('User tidak ditemukan');
        if (this.normalizeStatus(target.approval_status) !== 'PENDING_APPROVAL') {
            throw new BadRequestException({ errors: { approval: ['akun tidak sedang menunggu approval'] } });
        }

        const targetRole = this.normalizeBdbRole(dto.role_bdb || target.requested_role_bdb || target.role_bdb || 'viewer');
        const targetScopeId = dto.scope_satker_id ?? target.requested_scope_satker_id;
        const targetScopeKey = dto.scope_satker_key ?? target.requested_scope_satker_key;

        await this.assertCanReview(authUser, targetRole, targetScopeId, targetScopeKey);

        if (dto.action === 'reject') {
            await this.userRepository.update(targetId, {
                approval_status: 'REJECTED',
                status: 'REJECTED',
                rejected_by: Number(authUser.id),
                rejected_at: new Date(),
                reject_reason: dto.reason || null
            });
            return { id: targetId, approval_status: 'REJECTED' };
        }

        // organisasiRoleId (legacy) WAJIB ikut disamakan di sini -- ini titik dimana role_bdb
        // user BENAR-BENAR ditetapkan pertama kali (registrasi mandiri selalu mulai dari
        // role_bdb='viewer' menunggu approval, lihat AuthService registrasi via OTP). Tanpa ini,
        // user yg diapprove dgn role selain viewer tetap kebagian organisasiRoleId dari saat
        // registrasi (lihat resolveOrganisasiRoleId utk riwayat bug lengkapnya).
        const organisasiRoleId = await this.resolveOrganisasiRoleId(targetRole);
        await this.userRepository.update(targetId, {
            role_bdb: targetRole,
            role_name: targetRole,
            requested_role_bdb: targetRole,
            ...(organisasiRoleId != null ? { OrganisasiRole: { id: organisasiRoleId } as any } : {}),
            scope_satker_id: targetScopeId || null,
            scope_satker_key: targetScopeKey || null,
            requested_scope_satker_id: targetScopeId || null,
            requested_scope_satker_key: targetScopeKey || null,
            approval_status: 'APPROVED',
            status: 'AKTIF',
            approved_by: Number(authUser.id),
            approved_at: new Date(),
            rejected_by: null,
            rejected_at: null,
            reject_reason: null
        });
        return { id: targetId, approval_status: 'APPROVED', role_bdb: targetRole };
    }

    async validateEmailOtp(otpId: string, otpToken: string) {
        if (!otpId || !otpToken) {
            throw new BadRequestException({ errors: { otp_token: ['otp tidak terisi'] } });
        }

        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const [ivBase64, encryptedBase64] = otpId.split(':');
        if (!ivBase64 || !encryptedBase64) {
            throw new BadRequestException({ errors: { otp_token: ['Invalid format'] } });
        }

        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const payload = JSON.parse(decrypted);

        if (new Date(payload.expired_at) < new Date()) {
            throw new BadRequestException({ errors: { otp_token: ['expired token'] } });
        }

        const isMatch = await bcrypt.compare(otpToken, payload.otp);
        if (!isMatch) {
            throw new BadRequestException({ errors: { otp_token: ['Invalid OTP token'] } });
        }

        return payload;
    }

    private isFemalePersonnel(name?: any, jenisKelamin?: any, socialMedia?: any): boolean {
        const explicitJk = String(socialMedia?.jenis_kelamin || socialMedia?.gender || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(explicitJk)) return true;
        if (['l', 'laki-laki', 'laki', 'pria', 'male', 'm', 'polki'].includes(explicitJk)) return false;
        const jk = String(jenisKelamin || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(jk)) return true;
        const n = String(name || '').trim();
        if (!n) return false;
        if (/^(doliandri|muhammad|muhamad|mohammad|mohamad|mochamad|mochammad|m\.|moh\.|muh\.|ahmad|achmad|budi|agus|hendra|eko|rizky|rizki|andi|dedi|dedy|wahyu|bayu|dimas|bagus|fajar|reza|ilham|arif|arief|irfan|taufik|taufiq|hidayat|saputra|pratama|dewangga|irwan|iwan|heru|heri|hery|bambang|slamet|joko|tri\s+budi|agung|dwi\s+putra|putra)\b/i.test(n)) return false;
        return /\b(siti|sri|dewi|dewie|ayu|putri|dian|fitri|fitria|fitriani|nurul|rina|rini|desi|desy|mega|ratna|wulan|wulandari|indah|intan|novita|novi|lestari|anggraini|maharani|puspita|handayani|kusumawati|rahmawati|susanti|astuti|widyastuti|yuliani|yulia|yuni|wahyuni|fatimah|alfia|amini|tita|maria|theresia|veronica|natalia|debora|chintya|nadia|nabila|annisa|anisa|aulia|amelia|amalia|tiara|citra|maya|lina|linda|nina|dina|vina|vera|sari|wati|ningrum|ningsih|pratiwi|yashinta|prameswari|retno|endang|inggrid|ni\s+putu|ni\s+made|ni\s+luh|ni\s+wayan|ni\s+kadek|ni\s+komang|ni\s+nyoman|ni\s+ketut)\b/i.test(n);
    }

    /**
     * Dapatkan profil sendiri (termasuk foto profil avatar, data personil kepolisian, dll).
     */
    async getOwnProfile(authUser: User) {
        const user = await this.userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');
        let policeProfile: any = null;
        try {
            const policeRows = await this.dataSource.query(
                `select nrp, nama, jenis_kelamin, satuan, no_hp, pangkat, jabatan, email, foto, is_pns, social_media
                 from trb_police
                 where lower(email) = any($1::text[])
                 order by id desc limit 1`,
                [[this.normalizeEmail(user.email), this.normalizeEmail(user.email_polri)].filter(Boolean)]
            );
            policeProfile = policeRows?.[0] || null;
        } catch {}
        const isSuper = String(user.id) === '1' || user.username === 'omeko42' || String(user.role_bdb).toLowerCase() === 'superadmin' || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(user.id));
        let satkerNama: string | null = isSuper ? 'Robinopsnal Bareskrim Polri' : null;
        let satkerSingkat: string | null = isSuper ? 'Robinopsnal Bareskrim Polri' : null;
        let satkerSatuan: string | null = isSuper ? 'ROBINOPSNAL BARESKRIM POLRI' : null;
        if (!satkerNama && user.scope_satker_id) {
            try {
                const sRows = await this.dataSource.query('select deskripsi, nama_singkat from bdb_satker where id=$1', [user.scope_satker_id]);
                if (sRows && sRows[0]) {
                    satkerNama = sRows[0].deskripsi;
                    satkerSingkat = sRows[0].nama_singkat || sRows[0].deskripsi;
                    satkerSatuan = sRows[0].deskripsi;
                }
            } catch {}
        }
        const isCustomPhoto = (val: any) => typeof val === 'string' && val.trim().length > 5 && val !== 'null' && val !== 'undefined' && !val.includes('default-avatar');
        const isCustomBanner = (val: any) => typeof val === 'string' && val.trim().length > 5 && !val.includes('default-banner');
        const resolvedCustomPhoto = isCustomPhoto(user.photo_url) ? user.photo_url.trim() : (isCustomPhoto(policeProfile?.foto) ? policeProfile.foto.trim() : null);
        const uSoc = (user.social_media && typeof user.social_media === 'object') ? user.social_media : {};
        const pSoc = (policeProfile?.social_media && typeof policeProfile.social_media === 'object') ? policeProfile.social_media : {};
        const mergedSocial: any = {
            ...pSoc,
            ...uSoc
        };
        if (isCustomBanner(uSoc.banner_theme)) mergedSocial.banner_theme = uSoc.banner_theme.trim();
        else if (isCustomBanner(pSoc.banner_theme)) mergedSocial.banner_theme = pSoc.banner_theme.trim();
        if (resolvedCustomPhoto) mergedSocial.avatar_v2 = true;
        if (isCustomBanner(mergedSocial.banner_theme)) mergedSocial.banner_v2 = true;
        const isFemale = this.isFemalePersonnel(user.name || policeProfile?.nama, policeProfile?.jenis_kelamin, mergedSocial);
        const resolvedGender = isFemale ? 'P' : 'L';
        mergedSocial.jenis_kelamin = resolvedGender;
        mergedSocial.gender = resolvedGender;
        const resolvedHandle = (user.username && String(user.username).trim())
            ? String(user.username).trim().replace(/^@/, '')
            : ((user.callsign && String(user.callsign).trim())
                ? String(user.callsign).trim().replace(/^@/, '')
                : this.generateDefaultHandle(user.id));
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            email_polri: user.email_polri,
            username: resolvedHandle,
            callsign: resolvedHandle,
            foto: resolvedCustomPhoto || user.photo_url || policeProfile?.foto || null,
            photo_url: resolvedCustomPhoto || user.photo_url || policeProfile?.foto || null,
            nrp: policeProfile?.nrp || null,
            no_hp: policeProfile?.no_hp || null,
            jenis_kelamin: resolvedGender,
            gender: resolvedGender,
            is_pns: Boolean(user.is_pns || policeProfile?.is_pns),
            satuan: satkerSatuan || policeProfile?.satuan || (isSuper ? 'ROBINOPSNAL BARESKRIM POLRI' : null),
            satker: satkerSingkat || satkerNama || (isSuper ? 'Robinopsnal Bareskrim Polri' : null),
            satker_singkat: satkerSingkat || satkerNama || (isSuper ? 'Robinopsnal Bareskrim Polri' : null),
            satker_nama: satkerNama || (isSuper ? 'Robinopsnal Bareskrim Polri' : null),
            scope_satker_name: satkerSingkat || satkerNama || (isSuper ? 'Robinopsnal Bareskrim Polri' : null),
            pangkat: policeProfile?.pangkat || null,
            jabatan: policeProfile?.jabatan || null,
            role_bdb: user.role_bdb,
            status: user.status,
            social_media: mergedSocial
        };
    }

    /**
     * Edit profil sendiri (siapa pun yang login) -- HANYA data personil non-sensitif
     * (nama, NRP, pangkat, jabatan, satuan, no. HP). Tidak pernah lewat sini: role, scope
     * satker, status, approval -- itu tetap lewat update() admin dengan pengecekan berjenjang.
     */
    async updateOwnProfile(authUser: User, dto: any = {}, file?: any) {
        if (dto && typeof dto.social_media === 'string') {
            try { dto.social_media = JSON.parse(dto.social_media); } catch { dto.social_media = {}; }
        }
        if (dto && typeof dto.is_pns === 'string') {
            dto.is_pns = dto.is_pns === 'true' || dto.is_pns === '1';
        }
        if (file && file.buffer) {
            const mime = (file.mimetype && String(file.mimetype).startsWith('image/')) ? file.mimetype : 'image/jpeg';
            const serverDataUrl = `data:${mime};base64,${file.buffer.toString('base64')}`;
            if (String(dto?.upload_target || '').toLowerCase() === 'banner') {
                dto.social_media = (dto.social_media && typeof dto.social_media === 'object') ? dto.social_media : {};
                dto.social_media.banner_theme = serverDataUrl;
                dto.social_media.banner_v2 = true;
            } else {
                dto.photo_url = serverDataUrl;
                dto.foto = serverDataUrl;
                dto.social_media = (dto.social_media && typeof dto.social_media === 'object') ? dto.social_media : {};
                dto.social_media.avatar_v2 = true;
                if (dto.crop_zoom !== undefined) {
                    dto.social_media.avatar_crop = {
                        zoom: Number(dto.crop_zoom || 1),
                        panX: Number(dto.crop_pan_x || 0),
                        panY: Number(dto.crop_pan_y || 0),
                        mode: String(dto.crop_mode || 'cover')
                    };
                }
            }
        }
        const dbUser = await this.userRepository.findOne({ where: { id: Number(authUser.id) } });
        let existingPoliceSoc: any = {};
        try {
            const pRows = await this.dataSource.query(
                `select social_media from trb_police where lower(email) = any($1::text[]) order by id desc limit 1`,
                [[this.normalizeEmail(dbUser?.email || authUser.email), this.normalizeEmail(dbUser?.email_polri || authUser.email_polri)].filter(Boolean)]
            );
            if (pRows?.[0]?.social_media && typeof pRows[0].social_media === 'object') {
                existingPoliceSoc = pRows[0].social_media;
            }
        } catch {}
        const name = (dto.name || '').trim();
        const authUpdate: Partial<User> = {};
        if (name && name !== authUser.name) authUpdate.name = name;
        if (dto.is_pns !== undefined) authUpdate.is_pns = Boolean(dto.is_pns);
        const rawJkInput = String(dto.jenis_kelamin || dto.gender || dto.social_media?.jenis_kelamin || dto.social_media?.gender || '').trim().toUpperCase();
        let normJk: 'P' | 'L' | null = null;
        if (['P', 'PEREMPUAN', 'WANITA', 'FEMALE', 'F', 'POLWAN'].includes(rawJkInput)) normJk = 'P';
        else if (['L', 'LAKI-LAKI', 'LAKI', 'PRIA', 'MALE', 'M', 'POLKI'].includes(rawJkInput)) normJk = 'L';
        if (dto.social_media !== undefined || normJk) {
            const dbSoc = (dbUser?.social_media && typeof dbUser.social_media === 'object') ? dbUser.social_media : ((authUser.social_media && typeof authUser.social_media === 'object') ? authUser.social_media : {});
            const baseSoc: any = { ...existingPoliceSoc, ...dbSoc };
            const incomingSoc = (dto.social_media && typeof dto.social_media === 'object') ? dto.social_media : {};
            const nextSoc: any = { ...baseSoc, ...incomingSoc };
            const isCustomBanner = (val: any) => typeof val === 'string' && val.trim().length > 5 && !val.includes('default-banner');
            if (!isCustomBanner(incomingSoc.banner_theme) && (isCustomBanner(dbSoc.banner_theme) || isCustomBanner(existingPoliceSoc.banner_theme))) {
                if (incomingSoc.banner_theme === undefined) {
                    nextSoc.banner_theme = isCustomBanner(dbSoc.banner_theme) ? dbSoc.banner_theme : existingPoliceSoc.banner_theme;
                }
            }
            if (normJk) {
                nextSoc.jenis_kelamin = normJk;
                nextSoc.gender = normJk;
            }
            authUpdate.social_media = nextSoc;
            dto.social_media = nextSoc;
        }
        if (dto.photo_url !== undefined || dto.foto !== undefined) {
            const rawPhoto = String(dto.photo_url || dto.foto || '').trim();
            if (rawPhoto) {
                const photoHash = crypto.createHash('sha256').update(rawPhoto).digest('hex');
                authUpdate.photo_url = rawPhoto;
                (authUpdate as any).photo_hash = photoHash;
                (authUpdate as any).photo_updated_at = new Date();
            } else {
                authUpdate.photo_url = null;
                (authUpdate as any).photo_hash = null;
                (authUpdate as any).photo_updated_at = new Date();
            }
        }

        if (dto.email_polri !== undefined) {
            const emailPolri = this.normalizeEmail(dto.email_polri);
            if (emailPolri !== this.normalizeEmail(authUser.email_polri)) {
                if (emailPolri) {
                    const check = await this.checkIdentifierAvailability('email_polri', emailPolri, Number(authUser.id));
                    if (!check.available) {
                        throw new ConflictException({ errors: { email_polri: [`Email dinas Polri ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
                    }
                }
                authUpdate.email_polri = emailPolri || null;
            }
        }
        if (dto.email !== undefined) {
            const secondaryEmail = this.normalizeEmail(dto.email);
            const targetEmail = secondaryEmail || authUpdate.email_polri || authUser.email_polri || authUser.email;
            if (targetEmail && targetEmail !== this.normalizeEmail(authUser.email)) {
                const check = await this.checkIdentifierAvailability('email', targetEmail, Number(authUser.id));
                if (!check.available) {
                    throw new ConflictException({ errors: { email: [`Email ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
                }
                authUpdate.email = targetEmail;
            }
        }
        if (dto.username !== undefined) {
            const rawTrim = String(dto.username || '').trim();
            const cleanU = rawTrim ? this.sanitizeUsernameInput(rawTrim) : null;
            if (rawTrim && (!cleanU || cleanU.length < 3)) {
                throw new BadRequestException({
                    message: 'Username minimal 3 karakter (huruf kecil, angka, titik, atau underscore).',
                    errors: { username: ['Username minimal 3 karakter (huruf kecil, angka, titik, atau underscore, tanpa @domain).'] }
                });
            }
            const nextUsername = cleanU || this.generateDefaultHandle(authUser.id);
            if (this.normalizeEmail(nextUsername) !== this.normalizeEmail(dbUser?.username || authUser.username)) {
                const check = await this.checkIdentifierAvailability('username', nextUsername, Number(authUser.id));
                if (!check.available) {
                    throw new ConflictException({ errors: { username: [`Username ini sudah terdaftar${check.satker_nama ? ` oleh satker ${check.satker_nama}` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.`] } });
                }
            }
            authUpdate.username = nextUsername;
            authUpdate.callsign = nextUsername;
        }
        const effectivePolri = authUpdate.email_polri !== undefined ? authUpdate.email_polri : (dbUser?.email_polri || authUser.email_polri);
        const effectiveUsername = authUpdate.username !== undefined
            ? authUpdate.username
            : ((dbUser?.username && String(dbUser.username).trim()) ? String(dbUser.username).trim().replace(/^@/, '') : ((authUser.username && String(authUser.username).trim()) ? String(authUser.username).trim().replace(/^@/, '') : this.generateDefaultHandle(authUser.id)));
        if (dbUser?.callsign !== effectiveUsername) {
            authUpdate.callsign = effectiveUsername;
        }
        if (effectivePolri && effectiveUsername && this.normalizeEmail(effectivePolri) === this.normalizeEmail(effectiveUsername)) {
            throw new BadRequestException({
                message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                errors: {
                    username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                    email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                }
            });
        }
        if (Object.keys(authUpdate).length) {
            await this.userRepository.update(Number(authUser.id), authUpdate);
        }

        await this.upsertPoliceProfileByEmail(authUser.email, {
            nrp: dto.nrp,
            name: name || authUser.name,
            jenis_kelamin: normJk ? normJk.toLowerCase() : undefined,
            pangkat: dto.pangkat,
            jabatan: dto.jabatan,
            satuan: dto.satuan,
            no_hp: dto.no_hp,
            is_pns: dto.is_pns,
            social_media: dto.social_media,
            ...(dto.photo_url !== undefined || dto.foto !== undefined ? { foto: dto.photo_url || dto.foto || '' } : {})
        }, this.dataSource, authUser.email_polri);
        const finalPhoto = authUpdate.photo_url !== undefined ? authUpdate.photo_url : (dbUser?.photo_url || null);
        return {
            status: 1,
            message: 'Profil berhasil diperbarui.',
            data: {
                ...authUser,
                ...authUpdate,
                photo_url: finalPhoto,
                foto: finalPhoto,
                social_media: authUpdate.social_media || dbUser?.social_media || {},
                jenis_kelamin: normJk || undefined,
                gender: normJk || undefined,
                username: effectiveUsername,
                callsign: effectiveUsername
            }
        };
    }

    async selfDeactivate(authUser: User, reason?: string) {
        await this.userRepository.update(Number(authUser.id), {
            approval_status: 'NONAKTIF_MANDIRI',
            status: 'NONAKTIF_MANDIRI',
            self_deactivated_at: new Date(),
            deactivated_by: Number(authUser.id),
            deactivated_at: new Date(),
            deactivation_reason: reason || null
        });
        return { id: authUser.id, status: 'NONAKTIF_MANDIRI' };
    }

    /**
     * Hapus PERMANEN akun pengguna (bukan soft-delete/nonaktifkan -- itu sudah ada di
     * selfDeactivate). Superadmin-only. "Paksa": tetap jalan walau akun ini pernah jadi
     * pelaku pelimpahan LP (satu-satunya FK yang bisa memblokir hapus biasa) -- riwayat
     * pelimpahannya tetap ada, hanya penaut ke akun ini yang dikosongkan. Kolom lain yang
     * mereferensikan user (created_by dkk) tidak punya FK constraint jadi otomatis aman,
     * hanya jadi id yatim (dibiarkan, bukan tanggung jawab hapus akun).
     */
    async remove(id: number, authUser: User) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID pengguna tidak valid.');
        }
        const actorRole = String(authUser?.role_bdb || '').toLowerCase();
        if (actorRole !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat menghapus akun pengguna.');
        }
        if (Number(authUser.id) === Number(id)) {
            throw new BadRequestException('Tidak bisa menghapus akun sendiri.');
        }

        const target = await this.userRepository.findOne({ where: { id } });
        if (!target) throw new NotFoundException('Pengguna tidak ditemukan.');

        if (String(target.role_bdb || '').toLowerCase() === 'superadmin') {
            const countRows = await this.dataSource.query("select count(*)::int as c from auth_users where lower(role_bdb)='superadmin'");
            if ((countRows[0]?.c || 0) <= 1) {
                throw new BadRequestException('Tidak bisa menghapus superadmin terakhir.');
            }
        }

        // Lepas FK yang bisa memblokir hapus (bdb_lp_pelimpahan.dilimpahkan_oleh tanpa on delete).
        // Try/catch: tabel ini baru dibuat saat fitur pelimpahan pertama dipakai (ensureTable), jadi
        // di install baru mungkin belum ada -- itu bukan alasan gagal menghapus akun.
        try {
            await this.dataSource.query('update bdb_lp_pelimpahan set dilimpahkan_oleh = null where dilimpahkan_oleh = $1', [id]);
        } catch {
            /* tabel belum ada -- aman diabaikan */
        }
        await this.dataSource.query('delete from auth_users where id = $1', [id]);

        return { status: 1, message: `Akun "${target.name}" (${target.email}) dihapus permanen.` };
    }
    async requestDeletion(id: number, body: { type: string; reason: string }, authUser: User) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID pengguna tidak valid.');
        }
        const target = await this.userRepository.findOne({ where: { id } });
        if (!target) throw new NotFoundException('Pengguna tidak ditemukan.');
        const type = String(body?.type || '').toUpperCase() === 'NONAKTIF' ? 'REQUEST_DEACTIVATE' : 'REQUEST_DELETE';
        const reason = String(body?.reason || '').trim();
        await this.dataSource.query(
            "update auth_users set status = 'NONAKTIF', approval_status = $1, deactivation_reason = $2, deactivated_at = NOW(), deactivated_by = $3, updated_at = NOW() where id = $4",
            [type, reason, authUser.id, id]
        );
        return { status: 1, message: `Pengajuan akun "${target.name}" terkirim ke Superadmin. Akun telah dibekukan sementara.` };
    }

    async reviewDeletion(id: number, body: { action: string }, authUser: User) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID pengguna tidak valid.');
        }
        const actorRole = String(authUser?.role_bdb || '').toLowerCase();
        if (actorRole !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat memproses permohonan.');
        }
        const target = await this.userRepository.findOne({ where: { id } });
        if (!target) throw new NotFoundException('Pengguna tidak ditemukan.');
        const action = String(body?.action || '').toUpperCase();
        if (action === 'APPROVE_DELETE') {
            return await this.remove(id, authUser);
        } else if (action === 'APPROVE_DEACTIVATE') {
            await this.dataSource.query(
                "update auth_users set status = 'NONAKTIF', approval_status = 'NONAKTIF_ADMIN', updated_at = NOW() where id = $1",
                [id]
            );
            return { status: 1, message: `Permohonan penonaktifan akun "${target.name}" disetujui.` };
        } else if (action === 'APPROVE_MUTASI') {
            const pendingMuts = await this.dataSource.query(
                `SELECT * FROM auth_user_mutations WHERE user_id = $1 AND status = 'PENDING' ORDER BY created_at DESC LIMIT 1`,
                [id]
            );
            if (!pendingMuts.length) {
                throw new BadRequestException('Tidak ada permohonan mutasi pending untuk akun ini.');
            }
            const mut = pendingMuts[0];
            const isKeluarReserse = mut.is_keluar_reserse || !mut.to_satker_id;

            if (isKeluarReserse) {
                await this.dataSource.query(
                    `UPDATE auth_user_mutations SET status = 'APPROVED', reviewed_by = $1, reviewed_at = NOW() WHERE id = $2`,
                    [authUser.id, mut.id]
                );
                await this.dataSource.query(
                    `UPDATE auth_users 
                     SET status = 'NONAKTIF', approval_status = 'MUTASI_KELUAR_RESERSE',
                         deactivated_at = NOW(), deactivated_by = $1,
                         deactivation_reason = $2, updated_at = NOW()
                     WHERE id = $3`,
                    [authUser.id, `Mutasi keluar fungsi Reserse ke ${mut.to_satker_name || 'Dinas Luar Reskrim'} (Sprin: ${mut.nomor_surat})`, id]
                );
                return { status: 1, message: `Permohonan mutasi keluar fungsi Reserse akun "${target.name}" ke ${mut.to_satker_name} disetujui.` };
            } else {
                const targetRole = this.normalizeBdbRole(mut.to_role || 'operator');
                const organisasiRoleId = await this.resolveOrganisasiRoleId(targetRole);

                await this.dataSource.query(
                    `UPDATE auth_user_mutations SET status = 'APPROVED', reviewed_by = $1, reviewed_at = NOW() WHERE id = $2`,
                    [authUser.id, mut.id]
                );
                await this.dataSource.query(
                    `UPDATE auth_users 
                     SET scope_satker_id = $1,
                         scope_satker_key = $2,
                         requested_scope_satker_id = $1,
                         requested_scope_satker_key = $2,
                         role_bdb = $3,
                         role_name = $3,
                         status = 'AKTIF',
                         approval_status = 'APPROVED',
                         deactivated_at = NULL,
                         deactivated_by = NULL,
                         deactivation_reason = NULL,
                         self_deactivated_at = NULL,
                         "organisasiRoleId" = COALESCE($5, "organisasiRoleId"),
                         updated_at = NOW()
                     WHERE id = $4`,
                    [mut.to_satker_id, mut.to_satker_key, targetRole, id, organisasiRoleId]
                );
                await this.dataSource.query(
                    `UPDATE trb_police SET satuan = $1, updated_at = NOW() WHERE lower(email) = lower($2) OR lower(email) = lower($3)`,
                    [mut.to_satker_name, target.email, target.email_polri || target.email]
                );
                return { status: 1, message: `Permohonan mutasi akun "${target.name}" ke ${mut.to_satker_name} disetujui.` };
            }
        } else if (action === 'REJECT' || action === 'REJECT_MUTASI') {
            await this.dataSource.query(
                `UPDATE auth_user_mutations SET status = 'REJECTED', reviewed_by = $1, reviewed_at = NOW() WHERE user_id = $2 AND status = 'PENDING'`,
                [authUser.id, id]
            );
            await this.dataSource.query(
                "update auth_users set status = 'AKTIF', approval_status = 'APPROVED', deactivated_at = null, deactivated_by = null, deactivation_reason = null, updated_at = NOW() where id = $1",
                [id]
            );
            return { status: 1, message: `Permohonan ditolak, akun "${target.name}" telah diaktifkan kembali.` };
        } else {
            throw new BadRequestException('Tindakan review tidak valid.');
        }
    }

    async user(request: Request, filter: any) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.where({ id: request['user'].id });
        for (const element of filter.with) {
            queryBuilder.leftJoinAndSelect(element.table, element.name);
        }
        for (const element of filter.where) {
            queryBuilder.where(String(element.table) + ' = :field', { field: element.value });
        }
        const data = queryBuilder.getOneOrFail();
        return data;
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async resetTotp(email: string, authUser?: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const normalizedEmail = this.normalizeEmail(email);
            const user = await queryRunner.manager.getRepository(User).createQueryBuilder('user')
                .where('lower(user.email) = :email', { email: normalizedEmail })
                .orWhere('lower(user.email_google) = :email', { email: normalizedEmail })
                .orWhere('lower(user.email_polri) = :email', { email: normalizedEmail })
                .getOne();
            if (!user) {
                throw new Error('User with email ' + email + ' not found.');
            }

            if (Number(authUser?.id || 0) !== Number(user.id)) {
                await this.assertCanManageUser(authUser, user, this.normalizeBdbRole(user.role_bdb), user.scope_satker_id, user.scope_satker_key);
            }

            user.totp_secret = null;
            user.totp = true;
            const data = await queryRunner.manager.save(User, user);

            await queryRunner.commitTransaction();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async resolveScope(role: BdbRole, scopeSatkerId?: number, scopeSatkerKey?: string, required = true) {
        if (role === 'superadmin') {
            return { scope_satker_id: null, scope_satker_key: null };
        }

        const rawId = scopeSatkerId === undefined || scopeSatkerId === null || Number(scopeSatkerId) <= 0 ? null : Number(scopeSatkerId);
        const rawKey = scopeSatkerKey === undefined || scopeSatkerKey === null || String(scopeSatkerKey).trim() === '' ? null : String(scopeSatkerKey).trim();

        if (!rawId && !rawKey && !required) {
            return { scope_satker_id: null, scope_satker_key: null };
        }

        if (!rawId && !rawKey) {
            throw new BadRequestException({
                errors: { scope_satker_key: ['satker melekat wajib diisi untuk user non-superadmin'] }
            });
        }

        // Satker melekat = hirarki Puskarda (bdb_satker). Master satker lama sudah tidak dipakai.
        const puskardaKey = rawKey && /^[0-9.]+$/.test(rawKey) ? rawKey : null;
        const rows = await this.dataSource.query(
            `
            select id, kode as satker_key, deskripsi as nama_satker_canonical, null as operational_role
            from bdb_satker
            where is_synthetic = false
              and (($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and kode = $2::text))
            order by id asc
            limit 1
            `,
            [rawId, puskardaKey]
        );

        if (!rows.length) {
            throw new BadRequestException({
                errors: { scope_satker_key: ['satker melekat tidak ditemukan di struktur satker'] }
            });
        }

        if (role === 'admin_binops') {
            const row = rows[0];
            const binopsMarker = [
                row?.operational_role,
                row?.nama_satker_canonical,
                row?.satker_key
            ].map((value) => String(value || '').toUpperCase()).join(' ');

            if (!binopsMarker.includes('BINOPS')) {
                throw new BadRequestException({
                    errors: { scope_satker_key: ['role Admin wajib melekat pada satker Binops'] }
                });
            }
        }

        if (role === 'operator') {
            const satker = rows[0];
            const childRows = await this.dataSource.query(
                `select 1 from bdb_satker where parent_id = $1 and is_synthetic = false limit 1`,
                [Number(satker.id)]
            );
            if (childRows && childRows.length > 0) {
                throw new BadRequestException({
                    errors: {
                        scope_satker_key: [
                            `Role Operator wajib ditempatkan pada satuan fungsi teknis (seperti Satreskrim / Satresnarkoba / Unit Reskrim), tidak boleh berhenti di tingkat induk (${satker.nama_satker_canonical}). Silakan pilih fungsi teknis di bawahnya.`
                        ]
                    }
                });
            }
        }

        return {
            scope_satker_id: Number(rows[0].id),
            scope_satker_key: rows[0].satker_key
        };
    }

    private async enrichUserScopes(users: any[]) {
        if (!Array.isArray(users) || users.length === 0) return;

        const ids = Array.from(new Set(users.map((user) => Number(user.scope_satker_id)).filter(Boolean)));
        const keys = Array.from(new Set(users.map((user) => user.scope_satker_key).filter(Boolean)));

        let pkRows: any[] = [];
        if (ids.length || keys.length) {
            // Satker melekat = hirarki Puskarda (bdb_satker). Master lama tidak dipakai lagi.
            pkRows = await this.dataSource.query(
                `
                select id, kode as satker_key, deskripsi as nama_satker_canonical, ('Tingkat ' || depth) as level, kode as full_path
                from bdb_satker
                where is_synthetic = false and (id = any($1::bigint[]) or kode = any($2::text[]))
                `,
                [ids, keys]
            );
        }

        const pkById = new Map(pkRows.map((row) => [Number(row.id), row]));
        const pkByKey = new Map(pkRows.map((row) => [row.satker_key, row]));

        users.forEach((user) => {
            if (this.normalizeBdbRole(user.role_bdb) === 'superadmin') {
                user.scope_satker_name = '-';
                user.scope_satker_display = '-';
                user.scope_access_display = 'Nasional';
                return;
            }

            // Cocokkan by KEY (kode Puskarda) dulu, lalu by id.
            const satker = pkByKey.get(user.scope_satker_key) || pkById.get(Number(user.scope_satker_id));
            if (satker) {
                user.scope_satker_id = Number(satker.id);
                user.scope_satker_key = satker.satker_key;
                user.scope_satker_name = satker.nama_satker_canonical;
                user.scope_satker_level = satker.level;
                user.scope_satker_full_path = satker.full_path;
                user.scope_satker_display = satker.nama_satker_canonical;
                user.scope_access_display = `${satker.nama_satker_canonical} dan bawahannya`;
            }
        });
    }

    private cleanOptionalText(value: any): string | null {
        if (value === undefined || value === null) return null;
        const text = String(value).trim();
        return text === '' ? null : text;
    }

    private async upsertPoliceProfileByEmail(email: string, payload: Record<string, any>, executor: any = this.dataSource, previousEmail?: string) {
        const normalizedEmail = this.normalizeEmail(email);
        const previousNormalizedEmail = this.normalizeEmail(previousEmail);
        if (!normalizedEmail) return;

        const nrp = this.cleanOptionalText(payload?.nrp || payload?.nip || payload?.nrp_nip);
        const nama = this.cleanOptionalText(payload?.name || payload?.nama);
        const rawJk = this.cleanOptionalText(payload?.jenis_kelamin || payload?.gender || payload?.social_media?.jenis_kelamin || payload?.social_media?.gender);
        const jenisKelamin = rawJk ? (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(rawJk.toLowerCase()) ? 'p' : 'l') : null;
        const satuan = this.cleanOptionalText(payload?.satuan || payload?.requested_scope_label);
        const noHp = this.cleanOptionalText(payload?.no_hp || payload?.phone || payload?.no_handphone);
        const pangkat = this.cleanOptionalText(payload?.pangkat);
        const jabatan = this.cleanOptionalText(payload?.jabatan);
        const isPns = payload?.is_pns !== undefined ? Boolean(payload.is_pns) : null;
        const socialMedia = payload?.social_media ? JSON.stringify(payload.social_media) : null;
        const fotoProvided = (payload?.foto !== undefined || payload?.photo_url !== undefined);
        const foto = this.cleanOptionalText(payload?.foto || payload?.photo_url);
        const photoHash = foto ? crypto.createHash('sha256').update(foto).digest('hex') : null;

        if (!nrp && !nama && !jenisKelamin && !satuan && !noHp && !pangkat && !jabatan && isPns === null && !socialMedia && !foto && !fotoProvided) return;

        const emails = Array.from(new Set([normalizedEmail, previousNormalizedEmail].filter(Boolean)));
        const existingRows = await executor.query(
            `
            select id
            from trb_police
            where lower(email) = any($1::text[])
            order by id desc
            limit 1
            `,
            [emails]
        );

        const existing = existingRows[0];

        if (existing?.id) {
            await executor.query(
                `
                update trb_police
                set
                    nrp = coalesce($2, nrp),
                    nama = coalesce($3, nama),
                    satuan = coalesce($4, satuan),
                    no_hp = coalesce($5, no_hp),
                    pangkat = coalesce($6, pangkat),
                    jabatan = coalesce($7, jabatan),
                    email = $8,
                    is_pns = coalesce($9, is_pns),
                    social_media = CASE WHEN $10::jsonb IS NOT NULL THEN coalesce(social_media, '{}'::jsonb) || $10::jsonb ELSE social_media END,
                    foto = CASE WHEN $11::boolean THEN $12 ELSE foto END,
                    photo_hash = CASE WHEN $11::boolean THEN $13 ELSE photo_hash END,
                    photo_updated_at = CASE WHEN $11::boolean THEN now() ELSE photo_updated_at END,
                    jenis_kelamin = coalesce($14, jenis_kelamin),
                    updated_at = now()
                where id = $1
                `,
                [existing.id, nrp, nama, satuan, noHp, pangkat, jabatan, normalizedEmail, isPns, socialMedia, fotoProvided, foto, photoHash, jenisKelamin]
            );
            return;
        }

        await executor.query(
            `
            insert into trb_police (
                nrp,
                nama,
                jenis_kelamin,
                pangkat,
                jabatan,
                satuan,
                no_hp,
                email,
                is_pns,
                social_media,
                foto,
                photo_hash,
                photo_updated_at,
                created_at,
                updated_at
            )
            values ($1, $2, coalesce($12, 'l'), coalesce($3, '-'), coalesce($4, '-'), $5, $6, $7, coalesce($8, false), coalesce($9::jsonb, '{}'::jsonb), $10, $11, now(), now(), now())
            `,
            [nrp, nama, pangkat, jabatan, satuan, noHp, normalizedEmail, isPns, socialMedia, foto, photoHash, jenisKelamin]
        );
    }

    private async enrichPoliceProfiles(users: any[]) {
        if (!Array.isArray(users) || users.length === 0) return;

        const emails = Array.from(new Set(users.flatMap((user) => [this.normalizeEmail(user?.email), this.normalizeEmail(user?.email_polri)]).filter(Boolean)));
        if (!emails.length) return;

        const rows = await this.dataSource.query(
            `
            select distinct on (lower(email))
                lower(email) as email_key,
                nrp,
                nama,
                jenis_kelamin,
                satuan,
                no_hp,
                pangkat,
                jabatan,
                email,
                foto,
                is_pns,
                social_media
            from trb_police
            where lower(email) = any($1::text[])
            order by lower(email), id desc
            `,
            [emails]
        );

        const byEmail = new Map<string, any>(rows.map((row: any) => [row.email_key, row]));

        users.forEach((user) => {
            const profile: any = byEmail.get(this.normalizeEmail(user?.email)) || byEmail.get(this.normalizeEmail(user?.email_polri));
            if (!profile) return;
            user.nrp = profile.nrp;
            user.no_hp = profile.no_hp;
            user.satuan = profile.satuan;
            user.pangkat = profile.pangkat;
            user.jabatan = profile.jabatan;
            user.is_pns = Boolean(user.is_pns || profile.is_pns);
            user.social_media = user.social_media || profile.social_media || {};
            const isFem = this.isFemalePersonnel(user.name || profile.nama, profile.jenis_kelamin, user.social_media);
            user.jenis_kelamin = isFem ? 'P' : 'L';
            user.gender = isFem ? 'P' : 'L';
            user.photo_url = user.photo_url || profile.foto || null;
            user.Police = profile;
        });
    }

    private async assertCanManageUser(authUser: User | undefined, target: User, targetRole: BdbRole, targetScopeId?: number, targetScopeKey?: string) {
        if (!authUser) return;

        const actorRole = this.normalizeBdbRole(authUser.role_bdb);
        if (actorRole === 'superadmin') return;

        if (actorRole === 'operator') {
            const currentTargetRole = this.normalizeBdbRole(target.role_bdb);
            if (currentTargetRole !== 'viewer' && currentTargetRole !== 'operator') {
                throw new ForbiddenException('Operator hanya boleh mengelola akun Operator atau Viewer.');
            }
            const createdBy = (target as any)?.Timestamps?.created_by;
            const targetSatkerId = target.scope_satker_id ? Number(target.scope_satker_id) : null;
            const targetSatkerKey = target.scope_satker_key || null;
            const actorSatkerId = authUser.scope_satker_id ? Number(authUser.scope_satker_id) : null;
            const sameSatker = actorSatkerId != null && targetSatkerId != null && actorSatkerId === targetSatkerId;

            const scope = await this.getScopeRows(authUser);
            const allowedIds = new Set(scope.map(row => Number(row.id)));
            const allowedKeys = new Set(scope.map(row => row.satker_key));
            const inScope = (targetSatkerId && allowedIds.has(Number(targetSatkerId))) || (targetSatkerKey && allowedKeys.has(targetSatkerKey));

            if (!sameSatker && !inScope && (!createdBy || Number(createdBy) !== Number(authUser.id))) {
                throw new ForbiddenException('Anda hanya boleh mengelola akun di satker Anda sendiri atau subordinatnya.');
            }
            await this.assertCanReview(authUser, targetRole, targetScopeId, targetScopeKey);
            return;
        }

        if (actorRole !== 'admin_binops') {
            throw new ForbiddenException('Tidak berwenang mengelola user');
        }

        const currentTargetRole = this.normalizeBdbRole(target.role_bdb);
        if (currentTargetRole === 'superadmin' || currentTargetRole === 'admin_binops') {
            throw new ForbiddenException('Admin/Binops tidak boleh mengelola Superadmin atau Admin/Binops lain');
        }

        await this.assertCanReview(authUser, targetRole, targetScopeId, targetScopeKey);
    }
    private async assertCanReview(authUser: User, targetRole: BdbRole, targetScopeId?: number, targetScopeKey?: string) {
        const actorRole = this.normalizeBdbRole(authUser?.role_bdb);

        if (actorRole === 'superadmin') return;

        const scopeId = authUser.scope_satker_id ? Number(authUser.scope_satker_id) : null;
        const isMabes = !scopeId || scopeId === 1 || scopeId === 13;

        if (actorRole === 'operator') {
            if (targetRole !== 'viewer' && targetRole !== 'operator') {
                throw new ForbiddenException('Operator hanya boleh menambahkan akun dengan role Operator atau Viewer.');
            }
            if (isMabes) return;

            const scopeKey = authUser.scope_satker_key || null;
            const sameId = scopeId != null && targetScopeId != null && Number(targetScopeId) === scopeId;
            const sameKey = !!scopeKey && !!targetScopeKey && targetScopeKey === scopeKey;
            if (!sameId && !sameKey) {
                const scope = await this.getScopeRows(authUser);
                const allowedIds = new Set(scope.map(row => Number(row.id)));
                const allowedKeys = new Set(scope.map(row => row.satker_key));
                const idAllowed = targetScopeId ? allowedIds.has(Number(targetScopeId)) : false;
                const keyAllowed = targetScopeKey ? allowedKeys.has(targetScopeKey) : false;
                if (!idAllowed && !keyAllowed) {
                    throw new ForbiddenException('Pengguna yang ditambahkan harus berada di satker yang sama dengan Anda atau subordinatnya.');
                }
            }
            return;
        }

        if (actorRole !== 'admin_binops') {
            throw new ForbiddenException('Tidak berwenang approve user');
        }

        if (targetRole === 'superadmin' || targetRole === 'admin_binops') {
            throw new ForbiddenException('Admin/Binops hanya boleh approve Operator atau Viewer');
        }

        if (isMabes) return;

        const scope = await this.getScopeRows(authUser);
        const allowedIds = new Set(scope.map(row => Number(row.id)));
        const allowedKeys = new Set(scope.map(row => row.satker_key));
        const idAllowed = targetScopeId ? allowedIds.has(Number(targetScopeId)) : false;
        const keyAllowed = targetScopeKey ? allowedKeys.has(targetScopeKey) : false;

        if (!idAllowed && !keyAllowed) {
            throw new ForbiddenException('Scope user di luar kewenangan Admin/Binops');
        }
    }

    private async getScopeRows(user: User): Promise<ScopeRow[]> {
        const scopeId = user?.scope_satker_id ? Number(user.scope_satker_id) : null;
        const scopeKey = user?.scope_satker_key || null;
        if (!scopeId && !scopeKey) return [];

        const sql = `
            with recursive
            user_satker as (
                select us.id, us.parent_id, us.deskripsi, us.tipe_satker, us.kode_canonical, p.tipe_satker as parent_tipe
                from bdb_satker us
                left join bdb_satker p on p.id = us.parent_id
                where ($1::bigint is not null and us.id = $1::bigint)
                   or ($2::text is not null and (us.kode_canonical = $2::text or us.kode = $2::text))
                limit 1
            ),
            actor_meta as (
                select us.id, us.parent_id, us.deskripsi, us.tipe_satker, us.parent_tipe,
                    case
                        when upper(us.deskripsi) ~ 'NARKOBA' then 'NARKOBA'
                        when upper(us.deskripsi) ~ 'KRIMSUS|TIPIDEKSUS|TIPIDTER|TIPIDKOR|KORTAS' then 'KRIMSUS'
                        when upper(us.deskripsi) ~ 'SIBER' then 'SIBER'
                        when upper(us.deskripsi) ~ 'PPA|PPO|RENAKTA' then 'PPA'
                        when upper(us.deskripsi) ~ 'POLAIR|AIRUD' then 'POLAIR'
                        when upper(us.deskripsi) ~ 'KRIMUM|TIPIDUM|RESKRIM|RES[[:space:]]*KRIM' then 'RESKRIM'
                        when us.tipe_satker = 'FUNGSI' then 'OTHER_FUNGSI'
                        else 'ALL'
                    end as domain_code,
                    case
                        when (us.parent_id in (1, 13) or us.parent_id is null) and us.tipe_satker = 'FUNGSI' and us.id not in (1, 13) and upper(trim(us.deskripsi)) not in ('BARESKRIM POLRI', 'POLRI (MABES POLRI)', 'MABES POLRI') then 'MABES_DIT'
                        when us.id in (1, 13) or upper(trim(us.deskripsi)) in ('BARESKRIM POLRI', 'POLRI (MABES POLRI)', 'MABES POLRI') then 'MABES'
                        when us.tipe_satker = 'POLDA' then 'POLDA'
                        when us.parent_tipe = 'POLDA' and us.tipe_satker = 'FUNGSI' then 'POLDA_DIT'
                        when us.tipe_satker = 'POLRES' then 'POLRES'
                        when us.parent_tipe = 'POLRES' and us.tipe_satker = 'FUNGSI' then 'POLRES_SAT'
                        when us.tipe_satker = 'POLSEK' then 'POLSEK'
                        when us.parent_tipe = 'POLSEK' and us.tipe_satker = 'FUNGSI' then 'POLSEK_UNIT'
                        else 'OTHER'
                    end as unit_level
                from user_satker us
            ),
            territory_root as (
                select case
                    when m.unit_level in ('MABES', 'OTHER') then 1
                    when m.unit_level in ('MABES_DIT', 'POLSEK_UNIT', 'POLSEK') then us.id
                    when m.unit_level = 'POLRES_SAT' then p.id
                    when m.unit_level = 'POLRES' then us.id
                    when m.unit_level = 'POLDA_DIT' then p.id
                    when m.unit_level = 'POLDA' then us.id
                    else us.id
                end as root_id,
                us.id as user_satker_id,
                m.domain_code,
                m.unit_level
                from user_satker us
                cross join actor_meta m
                left join bdb_satker p on p.id = us.parent_id
            ),
            polres_with_ppa as (
                select distinct parent_id as polres_id
                from bdb_satker
                where upper(deskripsi) ~ 'PPA|PPO|RENAKTA'
                  and upper(deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER|POLSEK'
                  and tipe_satker = 'FUNGSI'
            ),
            descendants as (
                select dk.id, dk.parent_id, dk.deskripsi, dk.tipe_satker, dk.kode_canonical from bdb_satker dk join territory_root tr on dk.id = tr.root_id
                union all
                select ck.id, ck.parent_id, ck.deskripsi, ck.tipe_satker, ck.kode_canonical from bdb_satker ck join descendants d on ck.parent_id = d.id
            ),
            filtered_descendants as (
                select d.id, d.kode_canonical
                from descendants d
                cross join territory_root tr
                where
                    (tr.unit_level in ('POLSEK_UNIT', 'POLSEK', 'MABES_DIT'))
                    or (d.id = tr.user_satker_id)
                    or (d.tipe_satker in ('POLDA', 'POLRES', 'POLSEK'))
                    or (upper(d.deskripsi) ~ 'UNIT[[:space:]]*RESKRIM')
                    or (
                        tr.unit_level = 'POLDA_DIT'
                        and d.parent_id != tr.root_id
                        and (
                            (
                                tr.domain_code = 'NARKOBA'
                                and upper(d.deskripsi) ~ 'NARKOBA'
                            )
                            or (
                                tr.domain_code in ('RESKRIM', 'KRIMSUS', 'SIBER')
                                and upper(d.deskripsi) ~ 'SAT[[:space:]]*RESKRIM|SATRESKRIM|RESKRIM'
                                and upper(d.deskripsi) !~ 'NARKOBA|PPA|PPO'
                            )
                            or (
                                tr.domain_code = 'PPA'
                                and (
                                    (
                                        upper(d.deskripsi) ~ 'PPA|PPO|RENAKTA'
                                        and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                                    )
                                    or (
                                        upper(d.deskripsi) ~ 'SAT[[:space:]]*RESKRIM|SATRESKRIM|RESKRIM'
                                        and upper(d.deskripsi) !~ 'NARKOBA|PPA|PPO'
                                        and d.parent_id not in (select polres_id from polres_with_ppa)
                                    )
                                )
                            )
                            or (
                                tr.domain_code = 'POLAIR'
                                and upper(d.deskripsi) ~ 'POLAIR|AIRUD'
                            )
                        )
                    )
                    or (
                        tr.unit_level = 'POLRES_SAT' and (
                            (
                                tr.domain_code = 'NARKOBA'
                                and upper(d.deskripsi) ~ 'NARKOBA'
                            )
                            or (
                                tr.domain_code = 'RESKRIM'
                                and upper(d.deskripsi) ~ 'RESKRIM|KRIMUM|TIPIDUM'
                                and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER|PPA|PPO'
                            )
                            or (
                                tr.domain_code = 'PPA'
                                and upper(d.deskripsi) ~ 'PPA|PPO|RENAKTA'
                                and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                            )
                            or (
                                tr.domain_code = 'KRIMSUS'
                                and upper(d.deskripsi) ~ 'KRIMSUS|TIPIDEKSUS|TIPIDTER|TIPIDKOR|KORTAS'
                                and upper(d.deskripsi) !~ 'NARKOBA|SIBER|PPA|PPO'
                            )
                            or (
                                tr.domain_code = 'SIBER'
                                and upper(d.deskripsi) ~ 'SIBER'
                                and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|PPA|PPO'
                            )
                            or (
                                tr.domain_code = 'POLAIR'
                                and upper(d.deskripsi) ~ 'POLAIR|AIRUD'
                                and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                            )
                        )
                    )
                    or (
                        tr.domain_code = 'ALL'
                    )
            )
            select id::text, kode_canonical as satker_key
            from filtered_descendants
        `;
        return this.dataSource.query(sql, [scopeId, scopeKey]);
    }

    // ===================== Import Massal Pengguna (Excel) =====================
    private static readonly IMPORT_HEADERS = ['Nama', 'NRP/NIP', 'Email Dinas Polri (Utama)', 'Email Sekunder (Opsional)', 'Username', 'Role', 'Kode atau Nama Satker', 'Status'];
    private static readonly IMPORT_ROLE_OPTS = ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'];
    private static readonly IMPORT_STATUS_OPTS = ['AKTIF', 'NONAKTIF'];

    /** Password acak (huruf besar+kecil+angka, 10 karakter) -- dipakai baris import yg tak isi password. */
    private generateImportPassword(): string {
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghijkmnpqrstuvwxyz';
        const digit = '23456789';
        const all = upper + lower + digit;
        const pick = (s: string) => s[crypto.randomInt(s.length)];
        let pass = pick(upper) + pick(lower) + pick(digit);
        for (let i = 0; i < 7; i++) pass += pick(all);
        return pass;
    }

    /**
     * Terima kode Puskarda ("060.01.02...") ATAU nama satker (deskripsi) dari kolom Excel --
     * kode dipakai langsung, nama dicocokkan case-insensitive ke bdb_satker.deskripsi.
     * Beda dari resolveScope() yg cuma terima kode -- ini lapisan tambahan khusus import supaya
     * admin tak perlu hafal kode Puskarda tiap baris.
     */
    private async resolveSatkerForImport(raw?: string): Promise<{ key: string; name: string } | null> {
        const value = String(raw || '').trim();
        if (!value) return null;
        if (/^[0-9.]+$/.test(value)) {
            const rows = await this.dataSource.query('select kode, deskripsi from bdb_satker where is_synthetic=false and kode=$1 limit 1', [value]);
            return rows.length ? { key: rows[0].kode, name: rows[0].deskripsi } : null;
        }
        const rows = await this.dataSource.query('select kode, deskripsi from bdb_satker where is_synthetic=false and lower(deskripsi)=lower($1) order by id limit 2', [value]);
        if (rows.length === 1) return { key: rows[0].kode, name: rows[0].deskripsi };
        return null; // 0 atau ambigu (>1 cocok nama sama) -- suruh isi kode persis
    }

    /** Baca file Excel (buffer) -> baris mentah, mulai dari baris ke-2 (baris 1 = header). */
    private async parseImportWorkbook(buffer: Buffer): Promise<{ row: number; name: string; nrp: string; email: string; email_polri: string; username: string; role_bdb: string; satker_raw: string; status: string }[]> {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer as any);
        const sheet = wb.worksheets[0];
        if (!sheet) throw new BadRequestException('File Excel tidak berisi sheet apa pun.');
        const cell = (row: ExcelJS.Row, idx: number) => String(row.getCell(idx).text || '').trim();
        const out: { row: number; name: string; nrp: string; email: string; email_polri: string; username: string; role_bdb: string; satker_raw: string; status: string }[] = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // header
            const name = cell(row, 1);
            const nrp = cell(row, 2);
            let val3 = cell(row, 3);
            let val4 = cell(row, 4);
            const username = cell(row, 5);
            const role_bdb = cell(row, 6).toLowerCase();
            const satker_raw = cell(row, 7);
            const status = cell(row, 8).toUpperCase();
            if (!name && !val3 && !val4 && !nrp) return; // baris kosong, lewati

            let email_polri = '';
            let email_sekunder = '';
            if (val3.toLowerCase().endsWith('@polri.go.id')) {
                email_polri = val3;
                email_sekunder = val4;
            } else if (val4.toLowerCase().endsWith('@polri.go.id')) {
                email_polri = val4;
                email_sekunder = val3;
            } else {
                email_polri = val3 || val4;
            }

            out.push({ row: rowNumber, name, nrp, email: email_sekunder || email_polri, email_polri, username, role_bdb, satker_raw, status });
        });
        return out;
    }

    /**
     * Validasi (TANPA menyimpan) seluruh baris hasil upload template Excel -- dipakai layar "review"
     * sebelum admin klik Import. Pakai ulang aturan yg SAMA dgn create() (email/username/email_polri
     * unik, resolveScope, assertCanReview) supaya hasil preview dijamin konsisten dgn hasil commit.
     */
    async previewBulkImport(buffer: Buffer, authUser?: User): Promise<{ rows: ImportPreviewRow[] }> {
        const raw = await this.parseImportWorkbook(buffer);
        if (!raw.length) throw new BadRequestException('Tidak ada baris data ditemukan (isi dari baris ke-2, baris 1 = header).');

        // Deteksi duplikat DI DALAM file yg sama (blm tentu ketahuan dari cek DB krn blm ada di DB).
        const seen = { email: new Map<string, number>(), email_polri: new Map<string, number>(), username: new Map<string, number>() };
        const results: ImportPreviewRow[] = [];

        for (const r of raw) {
            try {
                if (!r.name) throw new BadRequestException('Nama wajib diisi.');
                if (!r.nrp) throw new BadRequestException('NRP/NIP wajib diisi.');
                if (!r.email_polri) throw new BadRequestException('Email Dinas Polri (Utama) wajib diisi.');
                const emailPolriNorm = this.normalizeEmail(r.email_polri);
                if (!emailPolriNorm.endsWith('@polri.go.id')) throw new BadRequestException('Email Dinas Polri wajib menggunakan domain @polri.go.id.');

                const secEmailNorm = r.email && r.email.toLowerCase() !== emailPolriNorm ? this.normalizeEmail(r.email) : '';
                if (secEmailNorm && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(secEmailNorm)) throw new BadRequestException('Format email sekunder tidak valid.');
                if (secEmailNorm && secEmailNorm === emailPolriNorm) throw new BadRequestException('Email sekunder tidak boleh sama dengan email dinas Polri.');

                for (const [field, val] of [['email_polri', emailPolriNorm], ['email', secEmailNorm], ['username', r.username ? r.username.toLowerCase() : '']] as const) {
                    if (!val) continue;
                    const dupRow = seen[field].get(val);
                    if (dupRow) throw new BadRequestException(`${field === 'email' ? 'Email Sekunder' : field === 'email_polri' ? 'Email Dinas Polri' : 'Username'} ini sudah dipakai di baris ${dupRow} pada file yang sama.`);
                    seen[field].set(val, r.row);
                }

                const existingPolri = await this.findByEmail(emailPolriNorm);
                if (existingPolri) throw new ConflictException('Email Dinas Polri sudah dipakai akun lain di sistem.');
                if (secEmailNorm) {
                    const existingSec = await this.findByEmail(secEmailNorm);
                    if (existingSec) throw new ConflictException('Email Sekunder sudah dipakai akun lain di sistem.');
                }
                if (r.username) {
                    const checkUser = await this.checkIdentifierAvailability('username', r.username);
                    if (!checkUser.available) throw new ConflictException(`Username sudah dipakai${checkUser.satker_nama ? ' oleh ' + checkUser.satker_nama : ''}.`);
                }

                const roleBdb = this.normalizeBdbRole(r.role_bdb || 'viewer');
                if (r.role_bdb && !UserService.IMPORT_ROLE_OPTS.includes(r.role_bdb)) {
                    throw new BadRequestException(`Role "${r.role_bdb}" tidak dikenal (pakai: ${UserService.IMPORT_ROLE_OPTS.join(', ')}).`);
                }
                const status = UserService.IMPORT_STATUS_OPTS.includes(r.status) ? r.status : 'AKTIF';

                let satker: { key: string; name: string } | null = null;
                if (roleBdb !== 'superadmin') {
                    if (!r.satker_raw) throw new BadRequestException('Kode/Nama Satker wajib diisi untuk role selain Superadmin.');
                    satker = await this.resolveSatkerForImport(r.satker_raw);
                    if (!satker) throw new BadRequestException(`Satker "${r.satker_raw}" tidak ditemukan (isi kode Puskarda persis, atau nama satker persis & unik).`);
                }

                const isSuperadmin = authUser && this.normalizeBdbRole(authUser.role_bdb) === 'superadmin';
                const scope = await this.resolveScope(roleBdb, undefined, satker?.key, this.shouldRequireScope(roleBdb, status, 'APPROVED', isSuperadmin));
                if (authUser) await this.assertCanReview(authUser, roleBdb, scope.scope_satker_id ?? undefined, scope.scope_satker_key ?? undefined);

                results.push({
                    row: r.row,
                    ok: true,
                    name: r.name,
                    nrp: r.nrp || undefined,
                    email: secEmailNorm || emailPolriNorm,
                    email_polri: emailPolriNorm,
                    username: r.username || undefined,
                    role_bdb: roleBdb,
                    status,
                    scope_satker_key: scope.scope_satker_key ?? undefined,
                    scope_satker_name: satker?.name
                });
            } catch (e: any) {
                const msg = e?.response?.errors ? Object.values(e.response.errors).flat().join(', ') : e?.message || 'Baris tidak valid.';
                results.push({ row: r.row, ok: false, message: msg, name: r.name || undefined, email: r.email || undefined });
            }
        }
        return { rows: results };
    }

    /**
     * Eksekusi commit: buat akun utk tiap baris yg sudah lolos preview (dikirim balik oleh frontend).
     * Pakai ulang create() apa adanya (bukan tulis ulang logikanya) -- password acak dibuat di sini
     * kalau baris tak sertakan password, lalu dikembalikan SEKALI di hasil supaya admin bisa catat.
     */
    async commitBulkImport(rows: ImportPreviewRow[], authUser?: User): Promise<{ results: ImportCommitResult[] }> {
        if (!Array.isArray(rows) || !rows.length) throw new BadRequestException('Tidak ada baris untuk diimpor.');
        const results: ImportCommitResult[] = [];
        for (const r of rows) {
            try {
                const password = this.generateImportPassword();
                const dto: any = {
                    name: r.name,
                    nrp: r.nrp,
                    email: r.email,
                    email_polri: r.email_polri,
                    username: r.username,
                    role_bdb: r.role_bdb,
                    status: r.status,
                    approval_status: 'APPROVED',
                    scope_satker_key: r.scope_satker_key,
                    password,
                    password_confirmation: password
                };
                await this.create(dto as CreateUserDto, authUser);
                results.push({ row: r.row, ok: true, email: r.email, password });
            } catch (e: any) {
                const msg = e?.response?.errors ? Object.values(e.response.errors).flat().join(', ') : e?.message || 'Gagal membuat akun.';
                results.push({ row: r.row, ok: false, message: msg, email: r.email });
            }
        }
        return { results };
    }

    /**
     * Semua satker (kode + nama + jalur hierarki Polda/Polres/Polsek/Satuan) -- dipakai isi sheet
     * "Daftar Satker" di template import, krn kebanyakan admin cuma hafal NAMA satkernya, bukan kode
     * Puskarda-nya. Satu pass recursive CTE utk SEMUA baris (bukan subquery per-baris) krn datanya besar
     * (~18 ribuan satker) -- jalur dibangun turun dari anak root (Polda-level), root sintetis "POLRI"
     * sendiri tak diikutkan sbg baris/prefix jalur krn bukan satker yg bisa dipilih.
     */
    private async getSatkerReferenceRows(): Promise<{ kode: string; deskripsi: string; jalur: string }[]> {
        return this.dataSource.query(`
            with recursive tree as (
                select id, kode, deskripsi, parent_id, deskripsi::text as jalur
                from bdb_satker
                where parent_id = (select id from bdb_satker where is_root=true limit 1)
                union all
                select c.id, c.kode, c.deskripsi, c.parent_id, (t.jalur || ' > ' || c.deskripsi)
                from bdb_satker c
                join tree t on c.parent_id = t.id
            )
            select t.kode, t.deskripsi, t.jalur
            from tree t
            join bdb_satker s on s.id = t.id
            where s.is_synthetic = false
            order by t.kode
        `);
    }

    /** Generate template Excel kosong (+ petunjuk + daftar satker) utk diisi admin sblm diupload lewat "Import Massal". */
    async buildImportTemplateBuffer(): Promise<Buffer> {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'BDB';

        const sheet = wb.addWorksheet('Data Pengguna');
        sheet.columns = UserService.IMPORT_HEADERS.map((h) => ({ header: h, width: h === 'Kode atau Nama Satker' ? 28 : h.includes('Email') ? 28 : 18 }));
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
        sheet.addRow(['Contoh Nama', '12345678', '12345678@polri.go.id', '', 'contoh.username', 'operator', '060.01.02 (lihat sheet "Daftar Satker")', 'AKTIF']).font = { italic: true, color: { argb: 'FF94A3B8' } };
        for (let i = 2; i <= 200; i++) {
            sheet.getCell(`F${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${UserService.IMPORT_ROLE_OPTS.join(',')}"`] };
            sheet.getCell(`H${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${UserService.IMPORT_STATUS_OPTS.join(',')}"`] };
        }

        const satkerRows = await this.getSatkerReferenceRows();
        const satkerSheet = wb.addWorksheet('Daftar Satker');
        satkerSheet.columns = [
            { header: 'Kode', width: 16 },
            { header: 'Nama Satker', width: 32 },
            { header: 'Jalur (Polda > Polres > Polsek > Satuan)', width: 70 }
        ];
        satkerSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        satkerSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        satkerSheet.views = [{ state: 'frozen', ySplit: 1 }];
        satkerSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 3 } };
        for (const s of satkerRows) satkerSheet.addRow([s.kode, s.deskripsi, s.jalur]);

        const info = wb.addWorksheet('Petunjuk');
        info.columns = [{ width: 24 }, { width: 90 }];
        const rows: [string, string][] = [
            ['Nama', 'Wajib. Nama lengkap pengguna.'],
            ['NRP/NIP', 'Opsional, disarankan diisi.'],
            ['Email', 'Wajib. Dipakai sbg identitas utama akun, harus unik (belum dipakai akun lain).'],
            ['Email Dinas Polri', 'Opsional. Dipakai utk login & kirim OTP -- kalau diisi, harus unik.'],
            ['Username', 'Opsional, alternatif login selain email dinas -- kalau diisi, harus unik.'],
            ['Role', `Wajib. Salah satu: ${UserService.IMPORT_ROLE_OPTS.join(', ')}. Kosong = dianggap "viewer".`],
            [
                'Kode atau Nama Satker',
                'Wajib utk semua role KECUALI superadmin. Tidak perlu hafal kode -- buka sheet "Daftar Satker" di file ini, cari (Ctrl+F) nama Polda/Polres/Polsek/Satuan-nya, lalu copy nilai kolom "Kode" ke sini. Boleh juga isi nama satker persis & unik kalau sudah yakin.'
            ],
            ['Status', `${UserService.IMPORT_STATUS_OPTS.join(' / ')}. Kosong = dianggap "AKTIF".`],
            ['', ''],
            ['Password', 'TIDAK perlu diisi di sini -- sistem membuat password acak otomatis utk tiap akun baru, ditampilkan SEKALI setelah proses Import selesai supaya bisa dicatat/dibagikan ke pengguna.'],
            [
                'Cara pakai',
                '1) Cari kode satker tiap calon pengguna di sheet "Daftar Satker" (cari berdasar nama Polda/Polres/Polsek/Satuan yg diketahui). 2) Isi baris mulai baris ke-2 di sheet "Data Pengguna" (hapus baris contoh). 3) Upload lewat tombol "Import Massal". 4) Tinjau hasil validasi tiap baris. 5) Klik "Import Sekarang" utk baris yang valid.'
            ]
        ];
        info.addRow(['Kolom', 'Keterangan']).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        info.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
        for (const r of rows) {
            const added = info.addRow(r);
            added.alignment = { wrapText: true, vertical: 'top' };
        }

        return (await wb.xlsx.writeBuffer()) as Buffer;
    }

    // ===================== Reset Password + Kirim Email Kredensial =====================
    private bulkResetRunning = false;
    private bulkResetTablesReady = false;
    /** Jeda antar kirim email supaya tak membanjiri/memicu blokir server SMTP saat kirim ke ribuan akun sekaligus. */
    private static readonly BULK_RESET_PACE_MS = 300;

    private async ensureBulkResetTables() {
        if (this.bulkResetTablesReady) return;
        await this.dataSource.query(`
            create table if not exists bdb_bulk_password_reset_job (
                id bigserial primary key,
                status text not null default 'running',
                total int not null default 0,
                done int not null default 0,
                success int not null default 0,
                failed int not null default 0,
                started_by bigint references auth_users(id) on delete set null,
                started_at timestamptz not null default now(),
                finished_at timestamptz,
                last_error text
            )`);
        await this.dataSource.query(`
            create table if not exists bdb_bulk_password_reset_item (
                id bigserial primary key,
                job_id bigint not null references bdb_bulk_password_reset_job(id) on delete cascade,
                user_id bigint not null,
                email text,
                ok boolean not null,
                message text,
                created_at timestamptz not null default now()
            )`);
        await this.dataSource.query('create index if not exists idx_bprj_items_job on bdb_bulk_password_reset_item(job_id)');
        this.bulkResetTablesReady = true;
    }

    /** Superadmin only -- dipakai reset massal krn scope-nya lintas satker/lintas role (tak ada aturan resolveScope yg cocok). */
    private assertSuperadmin(authUser?: User) {
        if (this.normalizeBdbRole(authUser?.role_bdb) !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat melakukan tindakan ini.');
        }
    }

    /** Catat perubahan password sendiri tanpa pernah menyimpan password/hash ke audit. */
    async logOwnPasswordChange(authUser: User, sessionRevoked: boolean): Promise<void> {
        await this.audit.log({
            user: authUser,
            action: 'CHANGE_OWN_PASSWORD',
            entity: 'user',
            entityId: authUser?.id,
            outcome: 'SUCCESS',
            meta: { session_revoked: sessionRevoked }
        });
    }

    /**
     * Kirim kredensial baru (password acak baru) ke SATU user via email -- dipakai tombol "Reset Password" per baris.
     * Wewenang SAMA PERSIS dgn edit user (assertCanManageUser): superadmin bebas, admin_binops sesuai scope-nya,
     * operator HANYA utk akun Viewer yg dia buat sendiri di satker yg sama -- supaya operator bisa bantu reset
     * password reviewer/viewer di satkernya tanpa bisa menyentuh akun operator/admin lain.
     */
    async resetPasswordAndNotify(id: number, authUser?: User): Promise<{ email: string }> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan.');
        if (authUser && Number(authUser.id) === Number(id)) throw new BadRequestException('Tidak bisa reset password akun Anda sendiri lewat fitur ini.');
        if (authUser) await this.assertCanManageUser(authUser, user, this.normalizeBdbRole(user.role_bdb), user.scope_satker_id, user.scope_satker_key);
        const recipient = user.email_polri || user.email;
        if (!recipient) throw new BadRequestException('Pengguna ini tidak punya email terdaftar (email maupun email dinas Polri).');

        const password = this.generateImportPassword();
        const html = this.mailService.createCredentialEmail(user.name || '', recipient, password);
        await this.mailService.sendEmail(recipient, 'Kredensial Login BDB - Password Baru', 'Password baru akun BDB Anda telah dibuat.', html);

        await this.userRepository.update(id, { password: await bcrypt.hash(password, 10) } as any);
        await this.audit.log({ user: authUser, action: 'RESET_PASSWORD_EMAIL', entity: 'user', entityId: id, meta: { target_email: recipient } });
        return { email: recipient };
    }

    /** Jumlah akun (non-superadmin) yg akan kena reset massal -- dipakai layar konfirmasi sblm mulai. */
    async getBulkPasswordResetPreviewCount(authUser?: User): Promise<{ total: number }> {
        this.assertSuperadmin(authUser);
        const rows = await this.dataSource.query("select count(*)::int c from auth_users where coalesce(role_bdb,'viewer') <> 'superadmin'");
        return { total: rows[0]?.c || 0 };
    }

    /** Mulai proses reset password + kirim email massal (background, TIDAK menunggu selesai di request ini). */
    async startBulkPasswordReset(authUser?: User): Promise<{ jobId: number; total: number }> {
        this.assertSuperadmin(authUser);
        if (this.bulkResetRunning) throw new BadRequestException('Proses reset massal sedang berjalan. Tunggu sampai selesai sebelum memulai lagi.');
        await this.ensureBulkResetTables();

        const targets: { id: number; name: string; email: string; email_polri: string }[] = await this.dataSource.query(
            `select id, name, email, email_polri from auth_users where coalesce(role_bdb,'viewer') <> 'superadmin'${authUser?.id ? ' and id <> $1' : ''} order by id`,
            authUser?.id ? [authUser.id] : []
        );
        if (!targets.length) throw new BadRequestException('Tidak ada akun yang bisa direset.');

        const jobRows = await this.dataSource.query(
            'insert into bdb_bulk_password_reset_job (status, total, started_by) values ($1,$2,$3) returning id',
            ['running', targets.length, authUser?.id || null]
        );
        const jobId = jobRows[0].id;
        this.bulkResetRunning = true;
        await this.audit.log({ user: authUser, action: 'BULK_RESET_PASSWORD_START', entity: 'user', entityId: jobId, meta: { total: targets.length } });

        // Sengaja tidak di-await -- request langsung balik ke frontend dgn jobId, proses lanjut di background.
        this.processBulkResetJob(jobId, targets).catch(async (e: any) => {
            await this.dataSource.query('update bdb_bulk_password_reset_job set status=$1, last_error=$2, finished_at=now() where id=$3', ['failed', e?.message || 'Gagal tak terduga.', jobId]);
            this.bulkResetRunning = false;
        });

        return { jobId, total: targets.length };
    }

    private async processBulkResetJob(jobId: number, targets: { id: number; name: string; email: string; email_polri: string }[]) {
        let success = 0;
        let failed = 0;
        for (const t of targets) {
            const recipient = t.email_polri || t.email;
            let ok = true;
            let message: string | undefined;
            try {
                if (!recipient) throw new Error('Tidak punya email terdaftar.');
                const password = this.generateImportPassword();
                const html = this.mailService.createCredentialEmail(t.name || '', recipient, password);
                await this.mailService.sendEmail(recipient, 'Kredensial Login BDB - Password Baru', 'Password baru akun BDB Anda telah dibuat.', html);
                await this.dataSource.query('update auth_users set password=$1 where id=$2', [await bcrypt.hash(password, 10), t.id]);
            } catch (e: any) {
                ok = false;
                message = e?.response?.errors || e?.message || 'Gagal mengirim email.';
            }
            if (ok) success++;
            else failed++;
            await this.dataSource.query('insert into bdb_bulk_password_reset_item (job_id, user_id, email, ok, message) values ($1,$2,$3,$4,$5)', [jobId, t.id, recipient || null, ok, message || null]);
            await this.dataSource.query('update bdb_bulk_password_reset_job set done=done+1, success=$1, failed=$2 where id=$3', [success, failed, jobId]);
            if (UserService.BULK_RESET_PACE_MS > 0) await new Promise((r) => setTimeout(r, UserService.BULK_RESET_PACE_MS));
        }
        await this.dataSource.query('update bdb_bulk_password_reset_job set status=$1, finished_at=now() where id=$2', ['completed', jobId]);
        this.bulkResetRunning = false;
    }

    async getBulkPasswordResetJob(jobId: number, authUser?: User) {
        this.assertSuperadmin(authUser);
        await this.ensureBulkResetTables();
        const rows = await this.dataSource.query('select * from bdb_bulk_password_reset_job where id=$1', [jobId]);
        if (!rows.length) throw new NotFoundException('Job reset massal tidak ditemukan.');
        return rows[0];
    }

    async getLatestBulkPasswordResetJob(authUser?: User) {
        this.assertSuperadmin(authUser);
        await this.ensureBulkResetTables();
        const rows = await this.dataSource.query('select * from bdb_bulk_password_reset_job order by id desc limit 1');
        return rows[0] || null;
    }

    async getBulkPasswordResetItems(jobId: number, opts: { page?: number | string; row?: number | string; onlyFailed?: boolean }, authUser?: User) {
        this.assertSuperadmin(authUser);
        await this.ensureBulkResetTables();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(500, Number(opts.row) || 50));
        const offset = (page - 1) * row;
        const where = opts.onlyFailed ? 'where job_id=$1 and ok=false' : 'where job_id=$1';
        const totalRows = await this.dataSource.query(`select count(*)::int c from bdb_bulk_password_reset_item ${where}`, [jobId]);
        const data = await this.dataSource.query(`select * from bdb_bulk_password_reset_item ${where} order by id limit $2 offset $3`, [jobId, row, offset]);
        return { data, total: totalRows[0]?.c || 0, page, row };
    }

    
    private async enrichUserActivity(users: any[]) {
        if (!Array.isArray(users) || users.length === 0) return;
        const userIds = Array.from(new Set(users.map((u) => Number(u.id)).filter(Boolean)));
        if (!userIds.length) return;

        const rows = await this.dataSource.query(
            `
            SELECT user_id, score, login_days_count, lp_created_count, lp_updated_count, 
                   docs_uploaded_count, last_active_at, status_keaktifan
            FROM auth_users_activity_cache
            WHERE user_id = ANY($1::bigint[])
            `,
            [userIds]
        );
        const map = new Map<number, any>(rows.map((r: any) => [Number(r.user_id), r]));
        users.forEach((u) => {
            const a: any = map.get(Number(u.id));
            u.activity_score = a ? a.score : 0;
            u.activity_status = a ? a.status_keaktifan : 'INAKTIF';
            u.activity_login_days = a ? a.login_days_count : 0;
            u.activity_lp_created = a ? a.lp_created_count : 0;
            u.activity_lp_updated = a ? a.lp_updated_count : 0;
            u.activity_docs_uploaded = a ? a.docs_uploaded_count : 0;
            u.activity_last_active = a ? a.last_active_at : null;
        });
    }

    async getUserActivityDetail(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const cacheRow = await this.dataSource.query(
            `SELECT * FROM auth_users_activity_cache WHERE user_id = $1`,
            [userId]
        );
        const summary = cacheRow[0] || {
            score: 0,
            login_days_count: 0,
            lp_created_count: 0,
            lp_updated_count: 0,
            docs_uploaded_count: 0,
            last_active_at: null,
            status_keaktifan: 'INAKTIF'
        };

        const recentLogs = await this.dataSource.query(
            `
            SELECT id, action, entity, entity_id, meta, ip, created_at, outcome
            FROM bdb_audit_log
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 5
            `,
            [userId]
        );

        return {
            user_id: userId,
            name: user.name,
            email: user.email,
            role_bdb: user.role_bdb,
            scope_satker_id: user.scope_satker_id,
            scope_satker_key: user.scope_satker_key,
            summary: {
                score: summary.score,
                status_keaktifan: summary.status_keaktifan,
                login_days_count: summary.login_days_count,
                lp_created_count: summary.lp_created_count,
                lp_updated_count: summary.lp_updated_count,
                docs_uploaded_count: summary.docs_uploaded_count,
                last_active_at: summary.last_active_at || user.last_login_at
            },
            recent_logs: recentLogs
        };
    }

    async mutateUser(userId: number, dto: any, authUser: User) {
        const actorRole = this.normalizeBdbRole(authUser?.role_bdb);
        if (actorRole !== 'superadmin' && actorRole !== 'admin_binops' && actorRole !== 'operator') {
            throw new ForbiddenException('Tidak berwenang melakukan mutasi satker pengguna.');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        // Admin Binops dan Superadmin tidak boleh dimutasi
        if (user.role_bdb === 'superadmin' || user.role_bdb === 'admin_binops') {
            throw new BadRequestException('User Admin Binops atau Superadmin tidak dapat dimutasi satker.');
        }

        const isKeluarReserse = Boolean(dto.is_keluar_reserse);

        if (!dto.nomor_surat || !String(dto.nomor_surat).trim()) {
            throw new BadRequestException('Nomor Surat Telegram / Sprint Mutasi wajib diisi');
        }

        let targetSatker: { id?: string | number | null; kode?: string | null; deskripsi: string } = {
            id: null,
            kode: null,
            deskripsi: ''
        };

        if (isKeluarReserse) {
            const externalName = String(dto.satker_non_reserse || dto.to_satker_name || '').trim();
            if (!externalName) {
                throw new BadRequestException('Nama satuan kerja baru (luar Reskrim) wajib diisi');
            }
            targetSatker.deskripsi = externalName;
        } else {
            if (!dto.to_satker_id && !dto.to_satker_key) {
                throw new BadRequestException('Satker tujuan wajib dipilih');
            }
            let targetSatkers = [];
            if (dto.to_satker_id) {
                targetSatkers = await this.dataSource.query(
                    `SELECT id, kode, deskripsi FROM bdb_satker WHERE id = $1 LIMIT 1`,
                    [dto.to_satker_id]
                );
            } else if (dto.to_satker_key) {
                targetSatkers = await this.dataSource.query(
                    `SELECT id, kode, deskripsi FROM bdb_satker WHERE kode = $1 OR kode_canonical = $1 LIMIT 1`,
                    [dto.to_satker_key]
                );
            }
            if (!targetSatkers.length) {
                throw new BadRequestException('Satker tujuan tidak valid di struktur satker');
            }
            targetSatker = targetSatkers[0];
        }

        // Role tujuan mutasi tidak boleh superadmin atau admin_binops
        const reqRole = dto.to_role ? String(dto.to_role).trim().toLowerCase() : (user.role_bdb || 'operator');
        if (reqRole === 'superadmin' || reqRole === 'admin_binops') {
            throw new BadRequestException('Role tujuan mutasi hanya boleh Operator atau Viewer.');
        }
        const newRole = isKeluarReserse ? 'nonaktif' : this.normalizeBdbRole(reqRole);

        let oldSatkerName = '-';
        if (user.scope_satker_id) {
            const oldSatkers = await this.dataSource.query(
                `SELECT deskripsi FROM bdb_satker WHERE id = $1 LIMIT 1`,
                [user.scope_satker_id]
            );
            if (oldSatkers.length) oldSatkerName = oldSatkers[0].deskripsi;
        }

        const isOperatorReq = actorRole === 'operator';

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (isOperatorReq) {
                // Operator: Masukkan permohonan ke auth_user_mutations dengan status PENDING
                await queryRunner.query(
                    `
                    INSERT INTO auth_user_mutations (
                        user_id, from_satker_id, from_satker_key, from_satker_name, from_role,
                        to_satker_id, to_satker_key, to_satker_name, to_role,
                        nomor_surat, tanggal_efektif, keterangan, mutated_by, created_at,
                        status, is_keluar_reserse
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), 'PENDING', $14)
                    `,
                    [
                        userId,
                        user.scope_satker_id,
                        user.scope_satker_key,
                        oldSatkerName,
                        user.role_bdb,
                        isKeluarReserse ? null : targetSatker.id,
                        isKeluarReserse ? null : targetSatker.kode,
                        targetSatker.deskripsi,
                        newRole,
                        String(dto.nomor_surat).trim(),
                        dto.tanggal_efektif || new Date(),
                        dto.keterangan || null,
                        authUser?.id ? Number(authUser.id) : null,
                        isKeluarReserse
                    ]
                );

                const approvalStatus = isKeluarReserse ? 'REQUEST_MUTASI_KELUAR' : 'REQUEST_MUTASI';
                const reason = isKeluarReserse
                    ? `Permohonan mutasi keluar fungsi Reserse ke ${targetSatker.deskripsi} (Sprin: ${dto.nomor_surat})`
                    : `Permohonan mutasi ke ${targetSatker.deskripsi} (${newRole}) (Sprin: ${dto.nomor_surat})`;

                await queryRunner.query(
                    `
                    UPDATE auth_users
                    SET approval_status = $1,
                        requested_scope_satker_id = $2,
                        requested_scope_satker_key = $3,
                        requested_role_bdb = $4,
                        deactivation_reason = $5,
                        deactivated_by = $6,
                        deactivated_at = NOW(),
                        updated_at = NOW()
                    WHERE id = $7
                    `,
                    [
                        approvalStatus,
                        isKeluarReserse ? null : targetSatker.id,
                        isKeluarReserse ? null : targetSatker.kode,
                        isKeluarReserse ? (user.role_bdb || 'operator') : newRole,
                        reason,
                        authUser?.id ? Number(authUser.id) : null,
                        userId
                    ]
                );

                await queryRunner.query(
                    `
                    INSERT INTO bdb_audit_log (
                        user_id, user_nama, action, entity, entity_id, meta, created_at, outcome
                    ) VALUES ($1, $2, 'REQUEST_MUTASI', 'auth_users', $3, $4, NOW(), 'SUCCESS')
                    `,
                    [
                        authUser?.id ? Number(authUser.id) : null,
                        authUser?.name || 'Operator',
                        userId,
                        JSON.stringify({
                            from_satker: oldSatkerName,
                            to_satker: targetSatker.deskripsi,
                            nomor_surat: dto.nomor_surat,
                            is_keluar_reserse: isKeluarReserse,
                            target_user: user.name
                        })
                    ]
                );

                await queryRunner.commitTransaction();
                return {
                    success: true,
                    requires_approval: true,
                    message: `Permohonan mutasi personil ${user.name} berhasil diajukan dan sedang menunggu persetujuan Superadmin.`
                };
            }

            // Superadmin / Admin Binops: Langsung eksekusi & approve
            await queryRunner.query(
                `UPDATE auth_user_mutations SET status = 'SUPERSEDED', reviewed_by = $1, reviewed_at = NOW() WHERE user_id = $2 AND status = 'PENDING'`,
                [authUser?.id ? Number(authUser.id) : null, userId]
            );

            if (isKeluarReserse) {
                await queryRunner.query(
                    `
                    INSERT INTO auth_user_mutations (
                        user_id, from_satker_id, from_satker_key, from_satker_name, from_role,
                        to_satker_id, to_satker_key, to_satker_name, to_role,
                        nomor_surat, tanggal_efektif, keterangan, mutated_by, created_at,
                        status, is_keluar_reserse, reviewed_by, reviewed_at
                    ) VALUES ($1, $2, $3, $4, $5, NULL, NULL, $6, 'nonaktif', $7, $8, $9, $10, NOW(), 'APPROVED', true, $10, NOW())
                    `,
                    [
                        userId,
                        user.scope_satker_id,
                        user.scope_satker_key,
                        oldSatkerName,
                        user.role_bdb,
                        targetSatker.deskripsi,
                        String(dto.nomor_surat).trim(),
                        dto.tanggal_efektif || new Date(),
                        dto.keterangan || null,
                        authUser?.id ? Number(authUser.id) : null
                    ]
                );

                await queryRunner.query(
                    `
                    UPDATE auth_users 
                    SET status = 'NONAKTIF',
                        approval_status = 'MUTASI_KELUAR_RESERSE',
                        deactivated_at = NOW(),
                        deactivated_by = $1,
                        deactivation_reason = $2,
                        updated_at = NOW()
                    WHERE id = $3
                    `,
                    [
                        authUser?.id ? Number(authUser.id) : null,
                        `Mutasi keluar fungsi Reserse ke ${targetSatker.deskripsi} (Sprin: ${dto.nomor_surat})`,
                        userId
                    ]
                );

                await queryRunner.query(
                    `
                    INSERT INTO bdb_audit_log (
                        user_id, user_nama, action, entity, entity_id, meta, created_at, outcome
                    ) VALUES ($1, $2, 'MUTASI_KELUAR_RESERSE', 'auth_users', $3, $4, NOW(), 'SUCCESS')
                    `,
                    [
                        authUser?.id ? Number(authUser.id) : null,
                        authUser?.name || 'Admin',
                        userId,
                        JSON.stringify({
                            from_satker: oldSatkerName,
                            to_satker: targetSatker.deskripsi,
                            nomor_surat: dto.nomor_surat,
                            target_user: user.name
                        })
                    ]
                );

                await queryRunner.commitTransaction();
                return {
                    success: true,
                    message: `Personil ${user.name} berhasil dimutasikan keluar fungsi Reserse/Reskrim ke ${targetSatker.deskripsi}. Seluruh histori LP lama tetap tersimpan.`,
                    mutation: {
                        from: oldSatkerName,
                        to: targetSatker.deskripsi,
                        nomor_surat: dto.nomor_surat
                    }
                };
            } else {
                const organisasiRoleId = await this.resolveOrganisasiRoleId(newRole);

                await queryRunner.query(
                    `
                    INSERT INTO auth_user_mutations (
                        user_id, from_satker_id, from_satker_key, from_satker_name, from_role,
                        to_satker_id, to_satker_key, to_satker_name, to_role,
                        nomor_surat, tanggal_efektif, keterangan, mutated_by, created_at,
                        status, is_keluar_reserse, reviewed_by, reviewed_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), 'APPROVED', false, $13, NOW())
                    `,
                    [
                        userId,
                        user.scope_satker_id,
                        user.scope_satker_key,
                        oldSatkerName,
                        user.role_bdb,
                        targetSatker.id,
                        targetSatker.kode,
                        targetSatker.deskripsi,
                        newRole,
                        String(dto.nomor_surat).trim(),
                        dto.tanggal_efektif || new Date(),
                        dto.keterangan || null,
                        authUser?.id ? Number(authUser.id) : null
                    ]
                );

                await queryRunner.query(
                    `
                    UPDATE auth_users 
                    SET scope_satker_id = $1,
                        scope_satker_key = $2,
                        requested_scope_satker_id = $1,
                        requested_scope_satker_key = $2,
                        role_bdb = $3,
                        role_name = $3,
                        status = 'AKTIF',
                        approval_status = 'APPROVED',
                        deactivated_at = NULL,
                        deactivated_by = NULL,
                        deactivation_reason = NULL,
                        self_deactivated_at = NULL,
                        "organisasiRoleId" = COALESCE($5, "organisasiRoleId"),
                        updated_at = NOW()
                    WHERE id = $4
                    `,
                    [targetSatker.id, targetSatker.kode, newRole, userId, organisasiRoleId]
                );

                await queryRunner.query(
                    `
                    UPDATE trb_police
                    SET satuan = $1, updated_at = NOW()
                    WHERE lower(email) = lower($2) OR lower(email) = lower($3)
                    `,
                    [targetSatker.deskripsi, user.email, user.email_polri || user.email]
                );

                await queryRunner.query(
                    `
                    INSERT INTO bdb_audit_log (
                        user_id, user_nama, action, entity, entity_id, meta, created_at, outcome
                    ) VALUES ($1, $2, 'MUTASI_SATKER', 'auth_users', $3, $4, NOW(), 'SUCCESS')
                    `,
                    [
                        authUser?.id ? Number(authUser.id) : null,
                        authUser?.name || 'Admin',
                        userId,
                        JSON.stringify({
                            from_satker: oldSatkerName,
                            to_satker: targetSatker.deskripsi,
                            nomor_surat: dto.nomor_surat,
                            target_user: user.name
                        })
                    ]
                );

                await queryRunner.commitTransaction();
                return {
                    success: true,
                    message: `User ${user.name} berhasil dimutasi ke ${targetSatker.deskripsi}`,
                    mutation: {
                        from: oldSatkerName,
                        to: targetSatker.deskripsi,
                        nomor_surat: dto.nomor_surat
                    }
                };
            }
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getUserMutations(userId: number) {
        const rows = await this.dataSource.query(
            `
            SELECT m.*, u.name as mutated_by_name, r.name as reviewed_by_name
            FROM auth_user_mutations m
            LEFT JOIN auth_users u ON u.id = m.mutated_by
            LEFT JOIN auth_users r ON r.id = m.reviewed_by
            WHERE m.user_id = $1
            ORDER BY m.created_at DESC
            `,
            [userId]
        );
        return rows;
    }
}
