import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { SubGolonganKamtibmas } from './sub-golongan-kamtibmas.entity';
import { GolonganKejahatan } from './golongan-kejahatan.entity';
import { IccsKategori } from './iccs-kategori.entity';
import { UndangUndang } from './undang-undang.entity';
import { ReportPasal } from '@bareskrim/report/entities/report-pasal.entity';
import { Pasal } from './pasal.entity';
import { KategoriLp } from 'src/orgaisasi/entity/kategori-lp.entity';
import { TypeKejahatan } from './type-kejahatan.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_jenis_kejahatan')
export class JenisKejahatan {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'text', nullable: true })
    keterangan: string;

    @Column({ type: 'boolean', nullable: true })
    street_crime: boolean;

    @Column({ type: 'int', nullable: true })
    id_sub_golongan: number;

    @Column({ type: 'int', nullable: true })
    sort: number;

    @Column({ type: 'int', nullable: true })
    atensi_pimpinan: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nomor: string;

    @Column({ type: 'text', nullable: true })
    pasal_mapping: string;

    @Column({ type: 'int', nullable: true })
    id_uu: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pasal: string | null;

    @Column({ type: 'boolean', default: false, nullable: true })
    kasus_menojol: boolean;

    @Column({ type: 'boolean', default: false, nullable: true })
    status_aktif: boolean;

    @Column({ type: 'int', nullable: true })
    id_emp: number | null;

    @Column({ type: 'boolean', default: false, nullable: true })
    kasus_menonjol: boolean;

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    @ManyToOne(() => SubGolonganKamtibmas, SubGolonganKamtibmas => SubGolonganKamtibmas.JenisKejahatan, { onDelete: 'SET NULL' })
    SubGolonganKamtibmas: SubGolonganKamtibmas; // Legacy, sudah tak dipakai UI -- taksonomi lebih luas dari yg dibutuhkan (lihat GolonganKejahatan)

    @ManyToOne(() => GolonganKejahatan, GolonganKejahatan => GolonganKejahatan.JenisKejahatan, { onDelete: 'SET NULL' })
    GolonganKejahatan: GolonganKejahatan; // Klasifikasi resmi 4 kode dari DORS (id_sub_golongan) -- ini yg dipakai UI/filter "Golongan Kejahatan"

    @ManyToOne(() => IccsKategori, IccsKategori => IccsKategori.JenisKejahatan, { onDelete: 'SET NULL' })
    IccsKategori: IccsKategori; // Klasifikasi ICCS Level 1 (pelengkap golongan/sub-golongan kamtibmas)

    @ManyToMany(() => UndangUndang, UndangUndang => UndangUndang.JenisKejahatan)
    @JoinTable()
    UndangUndang: UndangUndang[];
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    @OneToMany(() => ReportPasal, ReportPasal => ReportPasal.JenisKejahatan, {
        onDelete: 'SET NULL'
    })
    ReportPasal: ReportPasal;

    @OneToMany(() => Report, Report => Report.JenisKejahatan, {
        onDelete: 'SET NULL'
    })
    Report: Report;
    

    @OneToMany(() => Pasal, Pasal => Pasal.JenisKejahatan)
    Pasal: Pasal;


    @ManyToOne(() => KategoriLp, KategoriLp => KategoriLp.JenisKejahatan, { onDelete: 'SET NULL' })
    KategoriLp: KategoriLp;
    
    @ManyToOne(() => TypeKejahatan, TypeKejahatan => TypeKejahatan.JenisKejahatan, { onDelete: 'SET NULL' })
    TypeKejahatan: TypeKejahatan; 

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
