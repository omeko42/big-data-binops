import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Report } from './report.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';
import { UndangUndang } from '@bareskrim/data_master/entities/laporan/undang-undang.entity';
import { Pasal } from '@bareskrim/data_master/entities/laporan/pasal.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

// Define an enum for jenis_pasal_terkait
export enum JenisPasalTerkait {
    Junto = 'junto',
    Subsider = 'subsider',
    Alternatif = 'alternatif',
    Tambahan = 'tambahan',
    Utama = 'utama',
    Khusus = 'khusus',
    Pendukung = 'pendukung'
}

@Entity('trb_report_pasal')
export class ReportPasal {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.ReportPasal, { onDelete: 'SET NULL' })
    JenisKejahatan: JenisKejahatan;

    @ManyToOne(() => UndangUndang, UndangUndang => UndangUndang.ReportPasal, {
        onDelete: 'SET NULL'
    })
    UndangUndang: UndangUndang;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pasal: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    dan_atau: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    junto: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    subsider: string | null;

    @ManyToOne(() => Report, Report => Report.ReportPasal, {
        onDelete: 'SET NULL'
    })
    Report: Report; // Renamed to camelCase

    @ManyToOne(() => Pasal, Pasal => Pasal.ReportPasal, {
        onDelete: 'SET NULL'
    })
    Pasal: Pasal; // Renamed to camelCase

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
