import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Report } from './report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_dir_report')
export class DirectorateReport {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'int', nullable: true })
    status: Boolean;

    @ManyToOne(() => Report, Report => Report.DirectorateReport, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @ManyToOne(() => Directorate, Directorate => Directorate.DirectorateReport, { onDelete: 'SET NULL' })
    Directorate: Directorate;

    @ManyToOne(() => Directorate, DirectorateFrom => DirectorateFrom.DirectorateReportFrom, { onDelete: 'SET NULL' })
    DirectorateFrom: Directorate;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
