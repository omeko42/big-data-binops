import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ReportExcel } from './report-excel.entity';
import { User } from '@app_core/auth/user/entities/user.entity';
import { Report } from './report.entity';
import { DuplicatedReport } from './duplicate-report.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_log_imports')
export class LogImport {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'int', nullable: true })
    year: number;

    @Column({ type: 'date', nullable: true })
    import_date: Date;

    @Column({
        type: 'int',
        default: 0,
        comment: 'O = belum TRansform, 1 = sudah transform, 2 = transform DIbatalkan'
    })
    status: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    report_file: string;

    @Column({ type: 'int', nullable: true })
    total_data: number;

    @Column({ type: 'int', nullable: true })
    transform_data: number;

    @Column({ type: 'int', nullable: true })
    duplicated_data: number;

    @Column({ type: 'int', nullable: true })
    empty_row: number;

    @Column({ type: 'int', nullable: true })
    duplicate_update: number;

    @Column({ type: 'int', nullable: true })
    duplicate_add: number;

    @Column({ type: 'int', nullable: true })
    duplicate_remove: number;

    @OneToMany(() => ReportExcel, ReportExcel => ReportExcel.LogImport)
    ReportExcel: ReportExcel[];

    @ManyToOne(() => User, createBy => createBy.LogImport, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'createById' })
    createBy: User;

    @OneToMany(() => Report, Report => Report.LogImport)
    Report: Report[];

    @OneToMany(() => DuplicatedReport, DuplicatedReport => DuplicatedReport.LogImport)
    DuplicatedReport: DuplicatedReport[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
