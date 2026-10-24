import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Report } from '@bareskrim/report/entities/report.entity';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

@Entity('an_kasus_menonjol')
export class KasusMenonjol {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    organisasi_path: string;

    @ManyToOne(() => Organisasi, Organisasi => Organisasi.KasusMenonjol, { nullable: true, onDelete: 'SET NULL' })
    Organisasi: Organisasi;

    @Column({ type: 'varchar', length: 255 })
    judul: string;

    @Column({ type: 'boolean', default: 0, nullable: false })
    rilis: number;

    @Column({ type: 'date', nullable: true })
    tanggal_rilis: Date;

    @ManyToOne(() => Report, Report => Report.KasusMenonjol, { nullable: true, onDelete: 'SET NULL' })
    Report: Report;

    @Column({ type: 'bigint', nullable: true, name: 'bdb_lp_master_id' })
    bdb_lp_master_id: number;

    @Column({ type: 'enum', enum: ['nasional', 'regional', 'tidak viral'], nullable: true })
    skala_viral: string;

    @Column({ type: 'text', nullable: true })
    keterangan: string;

    @Column({ type: 'varchar', nullable: true })
    dokumen_rilis: string;

    @Column(() => Timestamps, { prefix: false })
    timestamps: Timestamps;
}

