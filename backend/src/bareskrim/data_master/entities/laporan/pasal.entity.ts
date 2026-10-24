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
    Index
} from 'typeorm';
import { JenisKejahatan } from './jenis-kejahatan.entity';
import { ReportPasal } from '@bareskrim/report/entities/report-pasal.entity';
import { Judol } from '@bareskrim/asta_cita/entities/judol.entity';

@Entity('cm_pasal')
export class Pasal {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    pasal: string;

    @ManyToOne(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.Pasal, {
        onDelete: 'SET NULL'
    })
    JenisKejahatan: JenisKejahatan;

    @OneToMany(() => ReportPasal, ReportPasal => ReportPasal.Pasal, {
        onDelete: 'SET NULL'
    })
    ReportPasal: ReportPasal;

    @OneToMany(() => Judol, Judol => Judol.Pasal, { onDelete: 'SET NULL' })
    Judol: Judol;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
