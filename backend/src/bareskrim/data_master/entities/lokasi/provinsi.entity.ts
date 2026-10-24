import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Unique, Index } from 'typeorm';
import { Kabupaten } from './kabupaten.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Kecamatan } from './kecamatan.entity';
import { Desa } from './desa.entity';
import { Polda } from '../hirarki/polda.entity';
import { Polres } from '../hirarki/polres.entity';
import { Polsek } from '../hirarki/polsek.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_provinsi')
export class Provinsi {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    code: number; // Primary Key, tipe data besar untuk kode provinsi

    @Column({ type: 'varchar', length: 255 })
    name: string; // Nama Provinsi

    @Column({ type: 'varchar', length: 255, nullable: true })
    singkatan: string; // Singkatan Provinsi (opsional)

    @Column({ type: 'varchar', length: 255, nullable: true })
    puskarda_kode: string; // Kode Puskarda (opsional)

    @Column({ type: 'boolean', default: true })
    status_aktif: boolean; // Status aktif provinsi

    @Column({ type: 'varchar', length: 1, default: 'A' })
    status: string; // Status provinsi (A untuk aktif, misalnya)

    // -----------------------------------------------------------------------
    // --------------ONe TO Many-------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------
    @OneToMany(() => Kabupaten, Kabupaten => Kabupaten.Provinsi, {
        onDelete: 'SET NULL'
    })
    Kabupaten: Kabupaten[];

    @OneToMany(() => Kecamatan, Kecamatan => Kecamatan.Provinsi, {
        onDelete: 'SET NULL'
    })
    Kecamatan: Kecamatan[];

    @OneToMany(() => Desa, Desa => Desa.Provinsi, { onDelete: 'SET NULL' })
    Desa: Desa[];

    @OneToMany(() => Polda, Polda => Polda.Provinsi, { onDelete: 'SET NULL' })
    Polda: Polda[];

    @OneToMany(() => Polres, Polda => Polda.Provinsi, {
        onDelete: 'SET NULL'
    })
    Polres: Polres[];

    @OneToMany(() => Polsek, Polsek => Polsek.Provinsi, {
        onDelete: 'SET NULL'
    })
    Polsek: Polsek[];

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.Provinsi, {
        onDelete: 'SET NULL'
    })
    ReportPelapor: ReportPelapor[];

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.Provinsi, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor[];

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.Provinsi, {
        onDelete: 'SET NULL'
    })
    ReportKorban: ReportKorban[];

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.Provinsi, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi[];

    @OneToMany(() => Report, Report => Report.Provinsi, {
        onDelete: 'SET NULL'
    })
    Report: Report[];
    // --------------ONe TO Many-------------------------------------------------------------------------------------------------------------------

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
