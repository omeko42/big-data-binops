import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, DeleteDateColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Device } from '../../device/entities/device.entity';
import { DirectorateTeam } from '@bareskrim/directorate/entities/directorate-team.entity';
import { LogImport } from '@bareskrim/report/entities/log-import.entity';
import { Police } from '@bareskrim/police/entities/police.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Exclude } from 'class-transformer';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { OrganisasiRole } from 'src/orgaisasi/entity/role.entity';

@Entity('auth_users')
export class User {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email_google: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email_polri: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 30, default: 'LOCAL' })
    login_method: string;

    @Column({ type: 'boolean', default: true })
    local_password_enabled: boolean;

    @Exclude()
    @Column({ type: 'timestamp', nullable: true })
    email_verified_at: Date | null;

    @Exclude()
    @Column({ type: 'varchar', length: 255, select: false, nullable: true })
    password: string;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    remember_token: string | null;

    @Exclude()
    @Column({ type: 'boolean', default: true, nullable: true })
    otp: boolean | null;

    @Exclude()
    @Column({ type: 'boolean', default: true, nullable: true })
    totp: boolean | null;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    totp_secret: string | null;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    otp_id: string | null;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    otp_token: string | null;

    @Column({ type: 'timestamp', nullable: true })
    otp_expires_at: Date | null;

    @Column({ type: 'int', nullable: true })
    directorate_id: number;

    @Column({ type: 'varchar', length: 255, nullable: true }) //administrator atau user atau user internal
    role_name: string;

    @Column({ type: 'varchar', length: 40, default: 'viewer' })
    role_bdb: string;

    @Column({ type: 'varchar', length: 40, default: 'viewer' })
    requested_role_bdb: string;

    @Column({ type: 'bigint', nullable: true })
    scope_satker_id: number;

    @Column({ type: 'text', nullable: true })
    scope_satker_key: string;

    @Column({ type: 'bigint', nullable: true })
    requested_scope_satker_id: number;

    @Column({ type: 'text', nullable: true })
    requested_scope_satker_key: string;

    @Column({ type: 'varchar', length: 40, default: 'APPROVED' })
    approval_status: string;

    @Column({ type: 'bigint', nullable: true })
    approved_by: number;

    @Column({ type: 'timestamp', nullable: true })
    approved_at: Date;

    @Column({ type: 'bigint', nullable: true })
    rejected_by: number;

    @Column({ type: 'timestamp', nullable: true })
    rejected_at: Date;

    @Column({ type: 'text', nullable: true })
    reject_reason: string;

    @Column({ type: 'timestamp', nullable: true })
    self_deactivated_at: Date;

    @Column({ type: 'bigint', nullable: true })
    deactivated_by: number;

    @Column({ type: 'timestamp', nullable: true })
    deactivated_at: Date;

    @Column({ type: 'text', nullable: true })
    deactivation_reason: string;

    @Column({ type: 'boolean', default: false })
    two_factor_required: boolean;

    @Column({ type: 'boolean', default: true })
    email_otp_required: boolean;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true, select: false })
    security_pin_hash: string | null;

    @Column({ type: 'boolean', default: false })
    pin_required: boolean;

    @Column({ type: 'varchar', length: 30, nullable: true })
    last_login_method: string;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date;

    @Column({ type: 'int', default: 0 })
    failed_login_attempts: number;

    @Column({ type: 'timestamp', nullable: true })
    locked_until: Date;

    @OneToMany(() => Device, device => device.user) // note: we will create author property in the Photo class below
    devices: Device[];

    @OneToMany(() => DirectorateTeam, DirectorateTeam => DirectorateTeam.User) // note: we will create author property in the Photo class below
    DirectorateTeam: DirectorateTeam[];

    @OneToMany(() => LogImport, LogImport => LogImport.createBy) // note: we will create author property in the Photo class below
    LogImport: LogImport[];

    @OneToOne(() => Police, Police => Police.User) // note: we will create author property in the Photo class below
    Police: Police;

    @RelationId((user: User) => user.Organisasi)
    organisasi_id: number;

    @ManyToOne(() => Organisasi, Organisasi => Organisasi.User, { onDelete: 'SET NULL' })
    Organisasi: Organisasi;

    @RelationId((user: User) => user.OrganisasiRole)
    organisasi_role_id: number;

    @ManyToOne(() => OrganisasiRole, OrganisasiRole => OrganisasiRole.User, { onDelete: 'SET NULL' })
    OrganisasiRole: OrganisasiRole;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string;

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: true })
    invitation_code: string;

    @Exclude()
    @Column({ type: 'timestamp', nullable: true })
    invitation_expired_at: Date;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
