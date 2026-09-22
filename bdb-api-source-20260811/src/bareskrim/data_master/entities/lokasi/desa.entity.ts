import { User } from '@app_core/auth/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Unique, Index } from 'typeorm';
import { Kecamatan } from './kecamatan.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { Kabupaten } from './kabupaten.entity';
import { Provinsi } from './provinsi.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_desa')
export class Desa {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    code: number; // Primary Key untuk kode desa

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string; // Nama desa

    @Column({ type: 'varchar', length: 255, nullable: true })
    singkatan: string | null; // Singkatan desa (nullable)

    @Column({ type: 'varchar', length: 255, nullable: true })
    puskarda_kode: string; // Kode Puskarda

    @Column({ type: 'boolean', default: true })
    status_aktif: boolean; // Status aktif desa

    @Column({ type: 'varchar', length: 1, default: 'A' })
    status: string; // Status desa (A untuk aktif, misalnya)

    @Column({ type: 'timestamp', nullable: true })
    tanggal_update: Date | null; // Waktu terakhir update yang dilakukan terhadap desa

    // --------------------------------------------------------------------------------------------------------------------------

    @ManyToOne(() => Kecamatan, Kecamatan => Kecamatan.Desa, {
        onDelete: 'SET NULL'
    })
    Kecamatan: Kecamatan; // Relasi ManyToOne ke Kecamatan

    @ManyToOne(() => Kabupaten, Kabupaten => Kabupaten.Desa, {
        onDelete: 'SET NULL'
    })
    Kabupaten: Kabupaten; // Relasi ManyToOne ke Kabupaten

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Desa, {
        onDelete: 'SET NULL'
    })
    Provinsi: Provinsi; // Relasi ManyToOne ke Provinsi

    // --------------------------------------------------------------------------------------------------------------------------

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.Desa, {
        onDelete: 'SET NULL'
    })
    ReportPelapor: ReportPelapor[];

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.Desa, {
        onDelete: 'SET NULL'
    })
    ReportTerlapor: ReportTerlapor[];

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.Desa, {
        onDelete: 'SET NULL'
    })
    ReportKorban: ReportKorban[];

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.Desa, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi[];

    @OneToMany(() => Report, Report => Report.Desa, { onDelete: 'SET NULL' })
    Report: Report[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
