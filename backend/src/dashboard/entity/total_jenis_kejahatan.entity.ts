import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('an_dashboard_jenis_kejahatan')
export class DashboardJenisKejahatan {
     @PrimaryColumn({ type: 'varchar', length: 255 })
    organisasi_path: string;

    @PrimaryColumn({ type: 'date' })
    date: Date;

    @PrimaryColumn({ type: 'int' })
    kategori_id: number;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    level_path: string;

    @PrimaryColumn({ type: 'int' })
    jenis_kejahatan_id: number;

    @Column({ type: 'text' })
    jenis_kejahatan_name: string;

    @Column({ type: 'int', default: 0 })
    total: number;

    @Column({ type: 'int', default: 0 })
    total_selesai: number;

    @Column({ type: 'int', nullable: true })
    total_tunggakan_status_selesai: number;

    @Column({ type: 'int', default: 0 })
    total_selesai_rjlid: number;

    @Column({ type: 'int', default: 0 })
    total_selesai_rjsid: number;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
