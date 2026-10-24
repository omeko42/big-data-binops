import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { LogImport } from './log-import.entity';
import { LogReport } from './log-report.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_dp_report')
export class DuplicatedReport {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nomor: string;

    @Column({ type: 'date', nullable: true })
    tanggal: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pasal: string;

    @Column({ type: 'text', nullable: true })
    uraian_kejadian: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pelapor: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tersangka: string;

    @Column({ type: 'text', nullable: true })
    barang_bukti: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tujuan_penyaluran: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    bukti_penyaluran: string;

    @Column({ type: 'date', nullable: true })
    tanggal_penyaluran: string;

    @ManyToOne(() => LogImport, LogImport => LogImport.Report, {
        onDelete: 'SET NULL'
    })
    LogImport: LogImport;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
