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
import { Pendidikan } from '@bareskrim/data_master/entities/keterlibatan/pendidikan.entity';
import { Suku } from '@bareskrim/data_master/entities/keterlibatan/suku.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';

@Entity('trb_report_pelapor')
export class ReportPelapor {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => TipeIdentitas, TipeIdentitas => TipeIdentitas.ReportPelapor, { onDelete: 'SET NULL' })
    TipeIdentitas: TipeIdentitas;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    nomor_identitas: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    nama: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tanggal_lahir: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    tempat_lahir: string;

    @ManyToOne(() => JenisKelamin, JenisKelamin => JenisKelamin.ReportPelapor, { onDelete: 'SET NULL' })
    JenisKelamin: JenisKelamin;

    @ManyToOne(() => Agama, Agama => Agama.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Agama: Agama;

    @Column({ type: 'text', nullable: true })
    alamat: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kode_pos: string;

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Provinsi: Provinsi;

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Kecamatan: Kecamatan;

    @ManyToOne(() => Desa, Desa => Desa.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Desa: Desa;

    @Column({ type: 'varchar', length: 255, nullable: true })
    no_handpone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    no_telepon: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @ManyToOne(() => Kewarganegaraan, Kewarganegaraan => Kewarganegaraan.ReportPelapor, { onDelete: 'SET NULL' })
    Kewarganegaraan: Kewarganegaraan;

    @ManyToOne(() => Suku, Suku => Suku.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Suku: Suku;

    @ManyToOne(() => Pekerjaan, Pekerjaan => Pekerjaan.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Pekerjaan: Pekerjaan;

    @ManyToOne(() => Pendidikan, Pendidikan => Pendidikan.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Pendidikan: Pendidikan;

    @Column({ type: 'varchar', length: 255, nullable: true })
    media_sosial: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    dokumen: string;

    @ManyToOne(() => Report, Report => Report.ReportPelapor, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
