import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Organisasi } from '../../../../orgaisasi/entity/organisasi.entity';
import { Report } from '@bareskrim/report/entities/report.entity';
import { JenisKejahatan } from '@bareskrim/data_master/entities/laporan/jenis-kejahatan.entity';

@Entity('tm_type_kejahatan')
export class TypeKejahatan {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @OneToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.TypeKejahatan)
    JenisKejahatan: JenisKejahatan;

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
