import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { JenisKejahatan } from './jenis-kejahatan.entity';
import { ReportPasal } from '@bareskrim/report/entities/report-pasal.entity';

@Entity('cm_undang_undang')
export class UndangUndang {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    deskripsi: string;

    @ManyToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.UndangUndang)
    JenisKejahatan: JenisKejahatan[];

    @OneToMany(() => ReportPasal, ReportPasal => ReportPasal.UndangUndang, {
        onDelete: 'SET NULL'
    })
    ReportPasal: ReportPasal;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
