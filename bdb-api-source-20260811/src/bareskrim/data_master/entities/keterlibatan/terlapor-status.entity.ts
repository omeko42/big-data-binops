import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('cm_terlapor_status')
export class TerlaporStatus {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @OneToMany(() => ReportTerlapor, ReportTerlapor => ReportTerlapor.TerlaporStatus, { onDelete: 'SET NULL' })
    ReportTerlapor: ReportTerlapor;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
