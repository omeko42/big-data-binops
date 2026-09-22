import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('an_dashboard')
export class Dashboard {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    organisasi_path: string;

    @PrimaryColumn({ type: 'date' })
    date: Date;

    @PrimaryColumn({ type: 'int' })
    kategori_id: number;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    level_path: string;

    @Column({ type: 'int', nullable: true })
    total: number;

    @Column({ type: 'int', nullable: true })
    total_status_selesai: number;

    @Column({ type: 'int', nullable: true })
    total_tunggakan_status_selesai: number;

    @Column({ type: 'int', nullable: true })
    total_pelapor: number;

    @Column({ type: 'int', nullable: true })
    total_terlapor: number;

    @Column({ type: 'int', nullable: true })
    total_korban: number;

    @Column({ type: 'int', nullable: true })
    total_saksi: number;

    @Column({ type: 'text', nullable: true })
    total_type_kejahatan: string;

    @Column({ type: 'text', nullable: true })
    total_kategori_kejahatan: string;

    @Column({ type: 'text', nullable: true })
    total_jenis_kejahatan: string;

    @Column({ type: 'text', nullable: true })
    total_status: string;

    @Column({ type: 'int', nullable: true })
    total_dpo: number;

    @Column({ type: 'int', nullable: true })
    total_tersangka: number;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
