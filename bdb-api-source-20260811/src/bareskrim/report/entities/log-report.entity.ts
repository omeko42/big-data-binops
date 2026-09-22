import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from './report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { ReportStatus } from './report-status.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_log_report')
export class LogReport {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'date', nullable: true })
    tanggal_dinyatakan: Date;

    @Column({ type: 'text', nullable: true })
    keterangan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string;

    @Column({ type: 'text', nullable: true })
    bukti_dinyatakan: string;

    @Column({ type: 'text', nullable: true })
    dokumen_bukti_dinyatakan: string;

    @ManyToOne(() => Report, Report => Report.LogReport, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @ManyToOne(() => Directorate, Directorate => Directorate.LogReport, {
        onDelete: 'SET NULL'
    })
    Directorate: Directorate;

    @ManyToOne(() => ReportStatus, ReportStatus => ReportStatus.LogReport, {
        onDelete: 'SET NULL'
    })
    ReportStatus: ReportStatus;

    @Column({ type: 'enum', enum: ['internal', 'external'], nullable: true })
    jenis_distribusi: string;

    @Column({ type: 'text', nullable: true })
    tujuan_distribusi: string;

    @Column({ type: 'text', nullable: true })
    keterangan_tambahan: string;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
