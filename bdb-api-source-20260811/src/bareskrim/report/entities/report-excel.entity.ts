import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LogImport } from './log-import.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_report_excels')
export class ReportExcel {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'int', nullable: true })
    row: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nomor_dan_tanggal: string;

    @Column({ type: 'varchar', length: 255 })
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

    @Column({ type: 'varchar', length: 255, nullable: true })
    model_lp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tgl_lp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    sumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ket_sumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ceklist_croscek: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status_penanganan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tgl_update_penanganan: string;

    @ManyToOne(() => LogImport, LogImport => LogImport.ReportExcel, {
        onDelete: 'SET NULL'
    })
    LogImport: LogImport;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
