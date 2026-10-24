import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, DeleteDateColumn, Index } from 'typeorm';

@Entity('auth_devices')
export class Device {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_name: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    device_token: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_os: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_vendor: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_browser: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    device_app_version: string;

    @Column({ type: 'timestamp', nullable: true })
    last_hit: Date;

    @Column({ type: 'timestamp', nullable: true })
    last_token_change: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    request_token: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    request_token_old: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refresh_token: string;

    @Column({ type: 'timestamp', nullable: true })
    refresh_token_expired_at: Date;

    @ManyToOne(() => User, user => user.devices, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
