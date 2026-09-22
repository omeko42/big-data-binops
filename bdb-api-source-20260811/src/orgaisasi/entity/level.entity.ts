import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable, Tree, TreeParent, TreeChildren, Index } from 'typeorm';
import { Organisasi } from './organisasi.entity';
import { KategoriLp } from '../entity/kategori-lp.entity';
import { Permission } from '@app_core/auth/permission/entities/permission.entity';

@Entity('tm_org_level')
@Tree('closure-table')
export class OrganisasiLevel {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    level_name: string;

    @Column({ type: 'bigint', nullable: true })
    parent_id: number;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    path: string;

    @TreeParent()
    @JoinColumn({ name: 'parent_id' })
    parent: OrganisasiLevel;

    @TreeChildren()
    children: OrganisasiLevel[];

    @OneToMany(() => Organisasi, Organisasi => Organisasi.OrganisasiLevel)
    Organisasi: Organisasi[];


    @ManyToMany(() => Permission, Permission => Permission.OrganisasiLevel)
    @JoinTable()
    Permission: Permission[];

    @ManyToMany(() => OrganisasiLevel, OrganisasiLevel => OrganisasiLevel.aksesParent)
    @JoinTable()
    aksesChild: OrganisasiLevel[];

    @ManyToMany(() => OrganisasiLevel, OrganisasiLevel => OrganisasiLevel.aksesChild)
    aksesParent: OrganisasiLevel[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
