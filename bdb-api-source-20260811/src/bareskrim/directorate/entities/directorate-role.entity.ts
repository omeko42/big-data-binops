import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import { DirectorateTeam } from './directorate-team.entity';
import { DirectoratePermission } from './directorate-permission.entity';
import { Directorate } from './directorate.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_dir_role')
export class DirectorateRole {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    role_name: string;

    @OneToMany(() => DirectorateTeam, DirectorateTeam => DirectorateTeam.DirectorateRole)
    DirectorateTeam: DirectorateTeam;

    @ManyToOne(() => Directorate, directorate => directorate.DirectorateRole, { onDelete: 'SET NULL' })
    Directorate: Directorate;

    @ManyToMany(() => DirectoratePermission, { cascade: true })
    @JoinTable()
    directoratePermissions: DirectoratePermission[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
