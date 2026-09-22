import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('an_dashboard_type_kejahatan')
export class DashboardTypeKejahatan {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    organisasi_path: string;

    @PrimaryColumn({ type: 'date' })
    date: Date;

    @PrimaryColumn({ type: 'int' })
    kategori_id: number;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    level_path: string;

    @PrimaryColumn({ type: 'int' })
    type_id: number;

    @Column({ type: 'varchar', length: 255 })
    type_name: string;

    @Column({ type: 'int', default: 0 })
    total: number;

    @Column({ type: 'int', default: 0 })
    total_selesai: number;

    @Column({ type: 'int', nullable: true })
    total_tunggakan_status_selesai: number;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
