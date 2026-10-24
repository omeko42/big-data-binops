import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { LogImport } from './log-import.entity';
import { LogReport } from './log-report.entity';
import { Directorate } from '@bareskrim/directorate/entities/directorate.entity';
import { DirectorateReport } from './directorate-report.entity';
import { Report } from './report.entity';
import { TipeIdentitas } from '@bareskrim/data_master/entities/keterlibatan/tipe-identitas.entity';
import { JenisKelamin } from '@bareskrim/data_master/entities/keterlibatan/jenis-kelamin.entity';
import { Agama } from '@bareskrim/data_master/entities/keterlibatan/agama.entity';
import { Provinsi } from '@bareskrim/data_master/entities/lokasi/provinsi.entity';
import { Kabupaten } from '@bareskrim/data_master/entities/lokasi/kabupaten.entity';
import { Kecamatan } from '@bareskrim/data_master/entities/lokasi/kecamatan.entity';
import { Desa } from '@bareskrim/data_master/entities/lokasi/desa.entity';
import { Kewarganegaraan } from '@bareskrim/data_master/entities/keterlibatan/kewarganegaraan.entity';
import { Pekerjaan } from '@bareskrim/data_master/entities/keterlibatan/pekerjaan.entity';
import { Suku } from '@bareskrim/data_master/entities/keterlibatan/suku.entity';
import { Pendidikan } from '@bareskrim/data_master/entities/keterlibatan/pendidikan.entity';
import { TerlaporStatus } from '@bareskrim/data_master/entities/keterlibatan/terlapor-status.entity';
import { JenisBarangBukti } from '@bareskrim/data_master/entities/laporan/jenis-barang-bukti.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_report_barang_bukti')
export class ReportBarangBukti {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => JenisBarangBukti, JenisBarangBukti => JenisBarangBukti.ReportBarangBukti, { onDelete: 'SET NULL' })
    JenisBarangBukti: JenisBarangBukti;

    @Index()
    @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
    jumlah: number;

    @ManyToOne(() => Report, Report => Report.ReportBarangBukti, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
