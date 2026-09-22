import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable, RelationId } from 'typeorm';
import { Organisasi } from './organisasi.entity';
import { Permission } from '@app_core/auth/permission/entities/permission.entity';
import { OrganisasiLevel } from './level.entity';

@Entity('tm_org_role')
export class OrganisasiRole {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    role_name: string;

    @RelationId((OrganisasiRole: OrganisasiRole) => OrganisasiRole.Organisasi)
    organisasi_id: number;

    @ManyToOne(() => Organisasi, Organisasi => Organisasi.OrganisasiRole, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'organisasiId' })
    Organisasi: Organisasi;

    @ManyToMany(() => Permission, Permission => Permission.OrganisasiRole)
    @JoinTable()
    Permission: Permission[];

    @OneToMany(() => User, User => User.Organisasi) // note: we will create author property in the Photo class below
    User: User[];

    @Column({ type: 'varchar', nullable: true, unique: true })
    invitation_code: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    invitation_url: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    temporary_invitation_code: string;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
