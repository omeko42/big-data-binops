import { User } from '@app_core/auth/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Index, Unique } from 'typeorm';
import { Kabupaten } from './kabupaten.entity';
import { Desa } from './desa.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { Provinsi } from './provinsi.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Polda } from '../hirarki/polda.entity';
import { Polres } from '../hirarki/polres.entity';
import { Polsek } from '../hirarki/polsek.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_kecamatann')
export class Kecamatan {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    code: number; // Primary Key untuk kode kecamatan

    @Column({ type: 'varchar', length: 255 })
    name: string; // Nama kecamatan

    @Column({ type: 'varchar', length: 255, nullable: true })
    puskarda_kode: string | null; // Kode Puskarda (nullable)

    @Column({ type: 'varchar', length: 255, nullable: true })
    singkatan: string | null; // Singkatan kecamatan (nullable)

    @Column({ type: 'boolean', default: true })
    status_aktif: boolean; // Status aktif kecamatan

    @Column({ type: 'varchar', length: 1, default: 'A' })
    status: string; // Status kecamatan (A untuk aktif, misalnya)

    @Column({ type: 'timestamp', nullable: true })
    tanggal_update: Date | null; // Waktu terakhir update (nullable)

    // -----------------------------------------------------------------------
    // --------------Many To One-------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------
    @ManyToOne(() => Kabupaten, kabupaten => kabupaten.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Kabupaten: Kabupaten;

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Provinsi: Provinsi;
    // --------------Many To One-------------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------
    // --------------ONe TO Many-------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------

    @OneToMany(() => Polda, Polda => Polda.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Polda: Polda[];

    @OneToMany(() => Polres, Polres => Polres.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Polres: Polres[];

    @OneToMany(() => Polsek, Polsek => Polsek.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Polsek: Polsek[];

    @OneToMany(() => Desa, Desa => Desa.Kecamatan, { onDelete: 'SET NULL' })
    Desa: Desa[];

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.Kecamatan, { onDelete: 'SET NULL' })
    ReportPelapor: ReportPelapor[];

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.Kecamatan, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor[];

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.Kecamatan, {
        onDelete: 'SET NULL'
    })
    ReportKorban: ReportKorban[];

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.Kecamatan, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi[];

    @OneToMany(() => Report, Report => Report.Kecamatan, {
        onDelete: 'SET NULL'
    })
    Report: Report[];
    // --------------ONe TO Many-------------------------------------------------------------------------------------------------------------------

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
