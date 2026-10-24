import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('an_dashboard_status')
export class DashboardStatus {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    organisasi_path: string;

    @PrimaryColumn({ type: 'date' })
    date: Date;

    @PrimaryColumn({ type: 'int' })
    kategori_id: number;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    level_path: string;

    @PrimaryColumn({ type: 'int' })
    status_id: number;

    @Column({ type: 'varchar', length: 100 })
    status_name: string;

    @Column({ type: 'int', default: 0 })
    total: number;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
