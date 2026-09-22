import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Organisasi } from './organisasi.entity';
import { Report } from '@bareskrim/report/entities/report.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';

@Entity('tm_kategori_lp')
export class KategoriLp {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @ManyToMany(() => Organisasi, Organisasi => Organisasi.KategoriLp)
    Organisasi: Organisasi[];

    @OneToMany(() => Report, Report => Report.KategoriLp)
    Report: Report[];

    @OneToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.KategoriLp)
    JenisKejahatan: JenisKejahatan;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
