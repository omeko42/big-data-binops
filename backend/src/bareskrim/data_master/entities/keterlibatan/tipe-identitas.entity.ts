import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('cm_tipe_identitas')
export class TipeIdentitas {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    code: string;

    @OneToMany(() => ReportPelapor, ReportPelapor => ReportPelapor.TipeIdentitas, { onDelete: 'SET NULL' })
    ReportPelapor: ReportPelapor;

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.TipeIdentitas, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor;

    @OneToMany(() => ReportKorban, ReportKorban => ReportKorban.TipeIdentitas, { onDelete: 'SET NULL' })
    ReportKorban: ReportKorban;

    @OneToMany(() => ReportSaksi, ReportSaksi => ReportSaksi.TipeIdentitas, {
        onDelete: 'SET NULL'
    })
    ReportSaksi: ReportSaksi;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
