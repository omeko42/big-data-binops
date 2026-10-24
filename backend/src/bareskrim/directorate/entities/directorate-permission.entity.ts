import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { DirectorateRole } from './directorate-role.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_dir_permisson')
export class DirectoratePermission {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    path: string;

    @Column({ type: 'varchar', length: 255 })
    method: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    tags: string;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;

    // @ManyToMany(() => DirectorateRole, (DirectorateRole) => DirectorateRole.DirectoratePermission)
    // DirectorateRole: DirectorateRole[]
}
