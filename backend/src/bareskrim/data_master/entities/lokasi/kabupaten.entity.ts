import { User } from '@app_core/auth/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Unique, Index } from 'typeorm';
import { Provinsi } from './provinsi.entity';
import { Kecamatan } from './kecamatan.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Desa } from './desa.entity';
import { Polda } from '../hirarki/polda.entity';
import { Polres } from '../hirarki/polres.entity';
import { Polsek } from '../hirarki/polsek.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_kabupaten')
export class Kabupaten {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    code: number; // Primary Key untuk kode kabupaten

    @Column({ type: 'varchar', length: 255 })
    name: string; // Nama kabupaten

    @Column({ type: 'varchar', length: 255, nullable: true })
    ibukota: string | null; // Ibukota kabupaten (nullable)

    @Column({ type: 'varchar', length: 255, nullable: true })
    puskarda_kode: string | null; // Kode Puskarda (nullable)

    @Column({ type: 'varchar', length: 255, nullable: true })
    singkatan: string | null; // Singkatan kabupaten (nullable)

    @Column({ type: 'boolean', default: true })
    status_aktif: boolean; // Status aktif kabupaten

    @Column({ type: 'varchar', length: 1, default: 'A' })
    status: string; // Status kabupaten (A untuk aktif, misalnya)

    @ManyToOne(() => Provinsi, Provinsi => Provinsi.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Provinsi: Provinsi; // Relasi ManyToOne ke Provinsi

    @OneToMany(() => Polda, Polda => Polda.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Polda: Polda[];

    @OneToMany(() => Polres, Polres => Polres.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Polres: Polres[];

    @OneToMany(() => Polsek, Polsek => Polsek.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Polsek: Polsek[];

    @OneToMany(() => Kecamatan, Kecamatan => Kecamatan.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Kecamatan: Kecamatan[];

    @OneToMany(() => Desa, Desa => Desa.Kecamatan, { onDelete: 'SET NULL' })
    Desa: Desa[];

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.Kabupaten, { onDelete: 'SET NULL' })
    ReportPelapor: ReportPelapor[];

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.Kabupaten, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor[];

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.Kabupaten, {
        onDelete: 'SET NULL'
    })
    ReportKorban: ReportKorban[];

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.Kabupaten, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi[];

    @OneToMany(() => Report, Report => Report.Kabupaten, {
        onDelete: 'SET NULL'
    })
    Report: Report[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
