import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, TreeChildren, TreeParent, Tree, Index } from 'typeorm';
import { LogImport } from './log-import.entity';
import { LogReport } from './log-report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { DirectorateReport } from './directorate-report.entity';
import { Report } from './report.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_report_status')
@Tree('closure-table')
export class ReportStatus {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status_name: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    path: string;

    @OneToMany(() => Report, Report => Report.ReportStatus, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @OneToMany(() => LogReport, LogReport => LogReport.ReportStatus, {
        onDelete: 'SET NULL'
    })
    LogReport: LogReport;

    @TreeParent()
    @JoinColumn({ name: 'parent_id' })
    parent: ReportStatus;

    @TreeChildren()
    children: ReportStatus[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
