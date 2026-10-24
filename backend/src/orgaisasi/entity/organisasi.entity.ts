import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Tree, TreeParent, TreeChildren, ManyToMany, JoinTable, RelationId, Index } from 'typeorm';
import { OrganisasiLevel } from './level.entity';
import { OrganisasiRole } from './role.entity';
import { KategoriLp } from './kategori-lp.entity';
import { Report } from '@bareskrim/report/entities/report.entity';
import { KasusMenonjol } from 'src/dashboard/entity/kasus_menonjol.entity';

@Entity('tm_org')
@Tree('closure-table')
export class Organisasi {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    path: string;

    @RelationId((Organisasi: Organisasi) => Organisasi.OrganisasiLevel)
    organisasi_level_id: number;

    @ManyToOne(() => OrganisasiLevel, OrganisasiLevel => OrganisasiLevel.Organisasi, { onDelete: 'SET NULL' })
    OrganisasiLevel: OrganisasiLevel;

    @OneToMany(() => User, User => User.Organisasi) // note: we will create author property in the Photo class below
    User: User[];

    @OneToMany(() => OrganisasiRole, OrganisasiRole => OrganisasiRole.Organisasi) // note: we will create author property in the Photo class below
    OrganisasiRole: OrganisasiRole[];

    @OneToMany(() => Report, Report => Report.Organisasi)
    Report: Report[];

    @Column({ type: 'bigint', nullable: true })
    parent_id: number;

    @TreeParent()
    @JoinColumn({ name: 'parent_id' })
    parent: Organisasi;

    @TreeChildren()
    children: Organisasi[];

    @Column({ type: 'int', nullable: true })
    jumlah_penduduk: number;

    @ManyToMany(() => KategoriLp, kategoriLp => kategoriLp.Organisasi)
    @JoinTable()
    KategoriLp: KategoriLp[];

    @OneToMany(() => KasusMenonjol, KasusMenonjol => KasusMenonjol.Organisasi) // note: we will create author property in the Photo class below
    KasusMenonjol: KasusMenonjol[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
