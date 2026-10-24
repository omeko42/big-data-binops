import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JenisKejahatan } from './jenis-kejahatan.entity';

@Entity('cm_golongan_kejahatan')
export class GolonganKejahatan {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @OneToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.GolonganKejahatan)
    JenisKejahatan: JenisKejahatan[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
