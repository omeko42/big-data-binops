import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SubGolonganKamtibmas } from './sub-golongan-kamtibmas.entity';
import { Report } from '@bareskrim/report/entities/report.entity';

@Entity('cm_golongan_kamtibmas')
export class GolonganKamtibmas {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @OneToMany(() => SubGolonganKamtibmas, SubGolonganKamtibmas => SubGolonganKamtibmas.GolonganKamtibmas, { onDelete: 'SET NULL' })
    SubGolonganKamtibmas: SubGolonganKamtibmas;

    @OneToMany(() => Report, Report => Report.GolonganKamtibmas, {
        onDelete: 'SET NULL'
    })
    Report: Report;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
