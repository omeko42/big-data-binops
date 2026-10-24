import { User } from '@app_core/auth/user/entities/user.entity';
import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { ReportBarangBukti } from '@bareskrim/report/entities/report-barang-bukti.entity';
import { ReportKorban } from '@bareskrim/report/entities/report-korban.entity';
import { ReportPelapor } from '@bareskrim/report/entities/report-pelapor.entity';
import { ReportSaksi } from '@bareskrim/report/entities/report-saksi.entity';
import { ReportTerlapor } from '@bareskrim/report/entities/report-terlapor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Index } from 'typeorm';

@Entity('cm_jenis_barang_bukti')
export class JenisBarangBukti {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    kelompok: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    satuan: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    kode: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    jenis: string;

    @OneToMany(() => ReportBarangBukti, ReportBarangBukti => ReportBarangBukti.JenisBarangBukti, { onDelete: 'SET NULL' })
    ReportBarangBukti: ReportBarangBukti;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
