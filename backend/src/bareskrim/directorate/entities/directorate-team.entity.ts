import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Directorate } from './directorate.entity';
import { User } from '@app_core/auth/user/entities/user.entity';
import { DirectorateRole } from './directorate-role.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_dir_team')
export class DirectorateTeam {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => Directorate, Directorate => Directorate.DirectorateTeam, { onDelete: 'SET NULL' })
    Directorate: Directorate;

    @ManyToOne(() => User, User => User.DirectorateTeam, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'userId' })
    User: User;

    @ManyToOne(() => DirectorateRole, DirectorateRole => DirectorateRole.DirectorateTeam, { onDelete: 'SET NULL' })
    DirectorateRole: DirectorateRole;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
