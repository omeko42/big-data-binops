import { Timestamps } from '@app_core/helper/entity/timestamp.entitiy';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JenisKejahatan } from './jenis-kejahatan.entity';

@Entity('cm_iccs_kategori')
export class IccsKategori {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'int' })
    kode: number;

    @Column({ type: 'text' })
    nama: string;

    @Column({ type: 'text', nullable: true })
    keterangan: string;

    @OneToMany(() => JenisKejahatan, JenisKejahatan => JenisKejahatan.IccsKategori)
    JenisKejahatan: JenisKejahatan[];

    @Column(() => Timestamps, { prefix: false })
    Timestamps: Timestamps;
}
