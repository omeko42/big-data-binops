import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UndangUndang } from './undang-undang.entity';
import { JenisKejahatan } from './jenis-kejahatan.entity';
import { GolonganKamtibmas } from './golongan-kamtibmas.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_sub_golongan_kamtibmas')
export class SubGolonganKamtibmas {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @OneToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.SubGolonganKamtibmas, { onDelete: 'SET NULL' })
    JenisKejahatan: JenisKejahatan;

    @ManyToOne(() => GolonganKamtibmas, GolonganKamtibmas => GolonganKamtibmas.SubGolonganKamtibmas, { onDelete: 'SET NULL' })
    GolonganKamtibmas: GolonganKamtibmas; // Properti yang menghubungkan Polsek dengan Polda

    @OneToMany(() => Report, Report => Report.SubGolonganKamtibmas, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
