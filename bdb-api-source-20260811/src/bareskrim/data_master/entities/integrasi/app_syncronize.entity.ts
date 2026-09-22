import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('app_synchronize')
export class AppSynchronize {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    module: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    task: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        default: 'scheduler'
    })
    updated_via: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    updated_status: string;

    @Column({ type: 'text', nullable: true })
    updated_message: string;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
