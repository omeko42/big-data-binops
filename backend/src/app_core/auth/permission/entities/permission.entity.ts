import { Role } from '@app_core/auth/role/entities/role.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { OrganisasiLevel } from 'src/orgaisasi/entity/level.entity';
import { OrganisasiRole } from 'src/orgaisasi/entity/role.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('permission')
@Tree('closure-table')
export class Permission {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    group: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    menu: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    action: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    access_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    access_route: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    method: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    parent_menu: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    form_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    to: string;

    @Column({ type: 'boolean', nullable: true, default: false })
    hide: boolean;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    path: string;

    @TreeParent()
    parent: Permission;

    @TreeChildren()
    children: Permission[];

    @ManyToMany(() => Role, Role => Role.Permission)
    Role: Role[];

    @ManyToMany(() => OrganisasiLevel, OrganisasiLevel => OrganisasiLevel.Permission)
    OrganisasiLevel: OrganisasiLevel[];

    @ManyToMany(() => OrganisasiRole, OrganisasiRole => OrganisasiRole.Permission)
    OrganisasiRole: OrganisasiRole[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
